import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyDuitkuCallbackSignature } from "@/lib/duitku";
import { markOrderPaid, cancelOrderAndReturnStock } from "@/lib/order-fulfillment";
import { reportHandledError } from "@/lib/sentry";

type CallbackPayload = {
  merchantCode?: string;
  merchantOrderId?: string;
  reference?: string;
  amount?: string | number;
  fee?: string | number;
  statusCode?: string;
  resultCode?: string;
  statusMessage?: string;
  signature?: string;
  paymentCode?: string;
};

async function readCallback(request: Request): Promise<CallbackPayload> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return request.json() as Promise<CallbackPayload>;
  }

  const form = await request.formData();
  return Object.fromEntries(form.entries()) as CallbackPayload;
}

/** POST /api/payments/duitku/callback — Duitku V2 server notification. */
export async function POST(request: Request) {
  try {
    const payload = await readCallback(request);
    const merchantOrderId = payload.merchantOrderId?.trim();
    const merchantCode = payload.merchantCode?.trim();
    const signature = payload.signature?.trim();
    const amount = String(payload.amount ?? "").trim();
    // Duitku's V2 docs call this resultCode; statusCode is accepted for V2 status callbacks.
    const statusCode = String(payload.statusCode ?? payload.resultCode ?? "").trim();

    if (!merchantOrderId || !merchantCode || !signature || !amount || !statusCode) {
      return NextResponse.json({ error: "Parameter callback Duitku tidak lengkap." }, { status: 400 });
    }

    if (!verifyDuitkuCallbackSignature({ merchantCode, amount, merchantOrderId, signature })) {
      return NextResponse.json({ error: "Signature Duitku tidak valid." }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: merchantOrderId },
      include: { items: { include: { product: true } } },
    });
    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }
    if (Number(amount) !== order.total) {
      return NextResponse.json({ error: "Nominal callback tidak sesuai pesanan." }, { status: 400 });
    }

    if (statusCode === "00") {
      await markOrderPaid({
        orderId: order.id,
        reference: payload.reference,
        fee: payload.fee,
        paymentMethod: payload.paymentCode,
        statusMessage: payload.statusMessage,
      });
    } else {
      const isFailed =
        statusCode === "02" ||
        ["FAILED", "EXPIRED", "EXPIRE", "CANCEL", "CANCELLED"].includes(statusCode.toUpperCase()) ||
        ["FAILED", "EXPIRED", "EXPIRE", "CANCEL", "CANCELLED"].includes((payload.statusMessage || "").toUpperCase());

      const nextStatus = statusCode === "01" ? "pending" : isFailed ? "failed" : null;
      if (!nextStatus) {
        return NextResponse.json({ error: "statusCode Duitku tidak dikenali." }, { status: 400 });
      }

      // Never downgrade an already paid order
      if (order.paymentStatus !== "paid") {
        if (nextStatus === "failed") {
          // 5.1: batal + kembalikan stok atomik & idempoten dalam satu transaction.
          await cancelOrderAndReturnStock(order.id, payload.statusMessage, {
            duitkuReference: payload.reference || order.duitkuReference,
            duitkuFee: payload.fee === undefined ? order.duitkuFee : String(payload.fee),
            duitkuPaymentMethod: payload.paymentCode || order.duitkuPaymentMethod,
          });
        } else {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: nextStatus,
              duitkuReference: payload.reference || order.duitkuReference,
              duitkuFee: payload.fee === undefined ? order.duitkuFee : String(payload.fee),
              duitkuPaymentMethod: payload.paymentCode || order.duitkuPaymentMethod,
              duitkuStatusMessage: payload.statusMessage || order.duitkuStatusMessage,
            },
          });
        }
      }
    }

    return NextResponse.json({
      received: true,
      merchantOrderId,
      reference: payload.reference || null,
      statusCode,
      status: statusCode === "00" ? "paid" : statusCode === "01" ? "pending" : "failed",
    });
  } catch (error) {
    console.error("[Duitku] Callback processing failed:", error);
    // Status pembayaran bisa tertinggal (customer sudah bayar tapi order belum
    // paid) dan tidak ada yang tahu kalau ini hanya masuk console.
    reportHandledError("duitku-callback", error);
    return NextResponse.json({ error: "Gagal memproses callback Duitku." }, { status: 500 });
  }
}
