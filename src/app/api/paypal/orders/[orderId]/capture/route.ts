import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { markOrderPaid } from "@/lib/order-fulfillment";
import { capturePayPalOrder, normalizeAmount } from "@/lib/paypal";
import { reportHandledError } from "@/lib/sentry";

interface RouteContext {
  params: Promise<{ orderId: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const { orderId } = await context.params;

  try {
    if (!orderId) {
      return NextResponse.json({ code: "CAPTURE_FAILED" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { paypalOrderId: orderId } });
    if (!order) {
      // Order harus dibuat server lebih dulu. Token tak dikenal -> tolak.
      return NextResponse.json({ code: "CAPTURE_FAILED" }, { status: 404 });
    }

    // Idempoten: capture/webhook sebelumnya sudah menandai paid.
    if (order.paymentStatus === "paid") {
      return NextResponse.json({ ok: true, orderNumber: order.orderNumber, alreadyPaid: true });
    }

    // PayPal-Request-Id deterministik -> retry/double-click tidak menagih dua kali.
    const capture = await capturePayPalOrder(orderId, `razrbilz-${order.orderNumber}`);
    if (!capture) {
      return NextResponse.json(
        { code: "CAPTURE_FAILED", orderNumber: order.orderNumber },
        { status: 502 }
      );
    }

    if (capture.status !== "COMPLETED") {
      console.warn(
        `[PayPal] capture ${orderId} status=${capture.status} (belum COMPLETED) untuk order ${order.orderNumber}`
      );
      return NextResponse.json(
        { code: "CAPTURE_FAILED", orderNumber: order.orderNumber },
        { status: 409 }
      );
    }

    // Verifikasi nominal + mata uang persis sama dengan yang disimpan saat create.
    const expectedValue = order.paypalAmountUsd || "";
    const expectedCurrency = order.paypalCurrency || "USD";
    const gotValue = capture.amount?.value || "";
    const gotCurrency = capture.amount?.currency_code || "";
    if (
      normalizeAmount(gotValue) !== normalizeAmount(expectedValue) ||
      gotCurrency !== expectedCurrency
    ) {
      console.error(
        `[PayPal] capture amount MISMATCH order ${order.orderNumber}: ` +
          `expected ${expectedValue} ${expectedCurrency}, got ${gotValue} ${gotCurrency}`
      );
      reportHandledError(
        "paypal-capture-amount-mismatch",
        new Error(
          `PayPal capture amount mismatch: expected ${expectedValue} ${expectedCurrency}, got ${gotValue} ${gotCurrency}`
        ),
        { orderNumber: order.orderNumber, orderId }
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

    // Transisi paid terpusat (lock idempoten, email, notifikasi pemilik, defer
    // Biteship untuk pre-order, override late-success). reference Duitku dibiarkan
    // null; capture id tersimpan di paypalCaptureId.
    await markOrderPaid({
      orderId: order.id,
      paymentMethod: "PAYPAL",
      statusMessage: "PayPal capture COMPLETED",
    });

    return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("[PayPal] capture error:", error);
    reportHandledError("paypal-capture-unexpected", error, { orderId });
    return NextResponse.json({ code: "CAPTURE_FAILED" }, { status: 500 });
  }
}
