import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { markOrderPaid } from "@/lib/order-fulfillment";
import { verifyWebhookSignature, normalizeAmount } from "@/lib/paypal";
import { reportHandledError } from "@/lib/sentry";

interface PayPalWebhookEvent {
  event_type?: string;
  resource?: {
    id?: string;
    status?: string;
    amount?: { value?: string; currency_code?: string };
    supplementary_data?: { related_ids?: { order_id?: string } };
  };
}

/**
 * Fallback untuk pembayaran yang berhasil di sisi PayPal tetapi tab buyer ditutup
 * sebelum /paypal/return menyelesaikan capture. Signature WAJIB terverifikasi
 * sebelum apa pun diproses (fail-closed).
 */
export async function POST(request: Request) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ code: "INVALID_BODY" }, { status: 400 });
  }

  const valid = await verifyWebhookSignature(request.headers, rawBody);
  if (!valid) {
    return NextResponse.json({ code: "INVALID_SIGNATURE" }, { status: 400 });
  }

  try {
    const event = rawBody as PayPalWebhookEvent;
    if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
      return NextResponse.json({ received: true, ignored: true });
    }

    const resource = event.resource || {};
    const captureId = resource.id || "";
    const status = resource.status || "";
    const paypalOrderId = resource.supplementary_data?.related_ids?.order_id;
    const gotValue = resource.amount?.value || "";
    const gotCurrency = resource.amount?.currency_code || "";

    if (!paypalOrderId) {
      console.warn("[PayPal] webhook CAPTURE.COMPLETED tanpa related order_id; diabaikan.");
      return NextResponse.json({ received: true, ignored: true });
    }

    const order = await prisma.order.findUnique({ where: { paypalOrderId } });
    if (!order) {
      console.warn(`[PayPal] webhook untuk paypalOrderId tak dikenal (${paypalOrderId}); diabaikan.`);
      return NextResponse.json({ received: true, ignored: true });
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.json({ received: true, alreadyPaid: true });
    }

    if (status !== "COMPLETED") {
      console.warn(
        `[PayPal] webhook capture status=${status} (bukan COMPLETED) order ${order.orderNumber}; diabaikan.`
      );
      return NextResponse.json({ received: true, ignored: true });
    }

    const expectedValue = order.paypalAmountUsd || "";
    const expectedCurrency = order.paypalCurrency || "USD";
    if (
      normalizeAmount(gotValue) !== normalizeAmount(expectedValue) ||
      gotCurrency !== expectedCurrency
    ) {
      console.error(
        `[PayPal] webhook amount MISMATCH order ${order.orderNumber}: ` +
          `expected ${expectedValue} ${expectedCurrency}, got ${gotValue} ${gotCurrency}`
      );
      reportHandledError(
        "paypal-webhook-amount-mismatch",
        new Error(
          `PayPal webhook amount mismatch (paypalOrderId ${paypalOrderId}): ` +
            `expected ${expectedValue} ${expectedCurrency}, got ${gotValue} ${gotCurrency}`
        ),
        { orderNumber: order.orderNumber, orderId: order.id }
      );
      return NextResponse.json({ received: true, ignored: true });
    }

    if (captureId) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paypalCaptureId: captureId },
      });
    }

    await markOrderPaid({
      orderId: order.id,
      paymentMethod: "PAYPAL",
      statusMessage: "PayPal webhook CAPTURE.COMPLETED",
    });

    return NextResponse.json({ received: true, ok: true });
  } catch (error) {
    console.error("[PayPal] webhook processing error:", error);
    reportHandledError("paypal-webhook-unexpected", error);
    // 500 -> PayPal me-retry. Pemrosesan idempoten (guard paid + lock markOrderPaid).
    return NextResponse.json({ code: "WEBHOOK_ERROR" }, { status: 500 });
  }
}
