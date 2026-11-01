import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { markOrderPaid } from "@/lib/order-fulfillment";
import {
  capturePayPalOrder,
  getPayPalOrderDetails,
  normalizeAmount,
} from "@/lib/paypal";
import { reportHandledError } from "@/lib/sentry";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Menyelesaikan Express Checkout: ambil alamat dari PayPal, simpan ke order,
 * lalu capture. Capture tidak pernah dilakukan bila alamat kirim tidak lengkap,
 * karena order fisik tidak bisa diproses tanpa alamat.
 */
export async function POST(request: Request) {
  let orderID = "";

  try {
    const limit = checkRateLimit(`paypal-express-capture:${clientIp(request)}`, {
      max: 20,
      windowMs: 10 * 60_000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { code: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
      );
    }

    const body = await request.json().catch(() => null);
    orderID = typeof body?.orderID === "string" ? body.orderID.trim() : "";
    if (!orderID) {
      return NextResponse.json({ code: "CAPTURE_FAILED" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { paypalOrderId: orderID },
    });
    if (!order) {
      return NextResponse.json({ code: "CAPTURE_FAILED" }, { status: 404 });
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.json({
        ok: true,
        orderNumber: order.orderNumber,
        alreadyPaid: true,
      });
    }

    const details = await getPayPalOrderDetails(orderID);
    if (!details) {
      return NextResponse.json(
        { code: "CAPTURE_FAILED", orderNumber: order.orderNumber },
        { status: 502 }
      );
    }

    const address = details.shipping?.address;
    if (
      !address ||
      !address.line1 ||
      !address.city ||
      !address.postalCode ||
      !/^[A-Z]{2}$/.test(address.country)
    ) {
      console.error(
        `[PayPal Express] alamat PayPal tidak lengkap untuk order ${order.orderNumber}`
      );
      return NextResponse.json(
        { code: "ADDRESS_MISSING", orderNumber: order.orderNumber },
        { status: 422 }
      );
    }

    // Simpan identitas + alamat SEBELUM capture. Bila capture gagal, data ini
    // tetap terlihat admin dan bisa dipakai saat buyer mencoba lagi.
    await prisma.order.update({
      where: { id: order.id },
      data: {
        customerName:
          details.shipping?.name || details.payer.name || order.customerName,
        email: details.payer.email || order.email,
        phone: details.payer.phone || order.phone,
        country: address.country,
        province: "",
        stateProvince: address.state || null,
        city: address.city,
        district: "",
        shippingAddress: address.line1,
        apartment: address.line2 || null,
        postalCode: address.postalCode,
      },
    });

    const capture = await capturePayPalOrder(
      orderID,
      `razrbilz-${order.orderNumber}`
    );
    if (!capture) {
      return NextResponse.json(
        { code: "CAPTURE_FAILED", orderNumber: order.orderNumber },
        { status: 502 }
      );
    }

    if (capture.status !== "COMPLETED") {
      console.warn(
        `[PayPal Express] capture ${orderID} status=${capture.status} untuk order ${order.orderNumber}`
      );
      return NextResponse.json(
        { code: "CAPTURE_FAILED", orderNumber: order.orderNumber },
        { status: 409 }
      );
    }

    const expectedValue = order.paypalAmountUsd || "";
    const expectedCurrency = order.paypalCurrency || "USD";
    const gotValue = capture.amount?.value || "";
    const gotCurrency = capture.amount?.currency_code || "";
    if (
      normalizeAmount(gotValue) !== normalizeAmount(expectedValue) ||
      gotCurrency !== expectedCurrency
    ) {
      console.error(
        `[PayPal Express] capture amount MISMATCH order ${order.orderNumber}: ` +
          `expected ${expectedValue} ${expectedCurrency}, got ${gotValue} ${gotCurrency}`
      );
      reportHandledError(
        "paypal-express-capture-amount-mismatch",
        new Error(
          `PayPal capture amount mismatch: expected ${expectedValue} ${expectedCurrency}, got ${gotValue} ${gotCurrency}`
        ),
        { orderNumber: order.orderNumber, orderId: orderID }
      );
      return NextResponse.json(
        { code: "CAPTURE_FAILED", orderNumber: order.orderNumber },
        { status: 409 }
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paypalCaptureId: capture.captureId },
    });

    await markOrderPaid({
      orderId: order.id,
      paymentMethod: "PAYPAL",
      statusMessage: "PayPal Express capture COMPLETED",
    });

    return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("[PayPal Express] capture error:", error);
    reportHandledError("paypal-express-capture-unexpected", error, { orderId: orderID });
    return NextResponse.json({ code: "CAPTURE_FAILED" }, { status: 500 });
  }
}
