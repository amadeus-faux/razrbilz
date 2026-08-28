import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface BiteshipWebhookPayload {
  event?: string;
  type?: string;
  order_id?: string;
  status?: string;
  price?: number;
  old_price?: number;
  previous_price?: number;
  waybill_id?: string;
  courier_waybill_id?: string;
  courier_tracking_id?: string;
  courier_company?: string;
  courier_type?: string;
  courier?: {
    tracking_id?: string;
    waybill_id?: string;
    company?: string;
    type?: string;
  };
  metadata?: {
    order_number?: string;
    [key: string]: any;
  };
  updated_at?: string;
}

export function mapBiteshipStatusToInternal(biteshipStatus: string): {
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
  description: string;
} {
  const normalized = (biteshipStatus || "").toLowerCase().trim();

  switch (normalized) {
    case "allocated":
    case "confirmed":
    case "scheduled":
      return { orderStatus: "processing", description: "Kurir ditugaskan / pesanan terkonfirmasi" };
    case "picking_up":
      return { orderStatus: "processing", description: "Kurir dalam perjalanan menjemput paket" };
    case "picked":
      return { orderStatus: "processing", description: "Paket berhasil di-pickup oleh kurir" };
    case "dropping_off":
    case "in_transit":
    case "delivered_to_courier":
      return { orderStatus: "shipped", description: "Paket sedang dikirim ke alamat tujuan" };
    case "delivered":
      return { orderStatus: "delivered", description: "Paket telah sampai dan diterima" };
    case "cancelled":
      return { orderStatus: "cancelled", description: "Pengiriman dibatalkan" };
    case "rejected":
    case "courier_not_found":
      return { orderStatus: "cancelled", description: "Kurir tidak ditemukan atau pengiriman ditolak" };
    case "returned":
    case "disposed":
      return { orderStatus: "cancelled", description: "Paket dikembalikan ke pengirim" };
    default:
      return { orderStatus: "processing", description: `Status Biteship: ${biteshipStatus}` };
  }
}

/**
 * Verify Webhook Secret / Signature Key from Biteship
 */
function verifyWebhookSecret(request: Request): boolean {
  const secret = process.env.BITESHIP_WEBHOOK_SECRET;
  if (!secret) {
    return true; // No secret configured -> allow
  }

  const headerSignature =
    request.headers.get("x-biteship-signature") ||
    request.headers.get("x-biteship-secret") ||
    request.headers.get("biteship-token") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    request.headers.get("x-signature-key");

  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret") || url.searchParams.get("token");

  const providedToken = headerSignature || querySecret;
  return providedToken === secret;
}

/**
 * Core Webhook Handler for Biteship Events
 */
export async function processBiteshipWebhook(
  request: Request,
  explicitEvent?: string
) {
  const timestamp = new Date().toISOString();
  console.log(`\n================== [BITESHIP WEBHOOK ${timestamp}] ==================`);

  // 1. Safely Parse Body (Tahan banting terhadap body kosong, invalid JSON, atau ping)
  let payload: BiteshipWebhookPayload | null = null;
  try {
    const rawText = await request.text();
    if (rawText && rawText.trim().length > 0) {
      payload = JSON.parse(rawText);
    }
  } catch (parseErr) {
    console.warn("[Biteship Webhook] Request body is not JSON or empty. Treating as ping.");
  }

  // 2. Handle Biteship Installation Ping / Verification Ping
  if (
    !payload ||
    Object.keys(payload).length === 0 ||
    payload.event === "test" ||
    payload.event === "ping" ||
    payload.type === "ping" ||
    (!payload.order_id && !payload.metadata?.order_number && !payload.status)
  ) {
    console.log("[Biteship Webhook] ✅ Installation ping / health-check received. Responding with HTTP 200 OK.");
    return NextResponse.json(
      {
        ok: true,
        success: true,
        message: "Biteship Webhook endpoint is active and healthy",
      },
      { status: 200 }
    );
  }


  // 3. Security verification for actual events
  if (!verifyWebhookSecret(request)) {
    console.warn("[Biteship Webhook] ⚠️ Webhook secret mismatch. Responding with 200 to prevent retry storms, but skipping DB update.");
    return NextResponse.json({ ok: false, message: "Invalid webhook secret" }, { status: 200 });
  }

  try {
    console.log("[Biteship Webhook] Processing event payload:", JSON.stringify(payload, null, 2));

    const event = explicitEvent || payload.event || payload.type || "order.status";
    const biteshipOrderId = payload.order_id;
    const orderNumber = payload.metadata?.order_number;

    if (!biteshipOrderId && !orderNumber) {
      console.log("[Biteship Webhook] Event payload without order identifier. Responding 200 OK.");
      return NextResponse.json({ ok: true, message: "No order identifier" }, { status: 200 });
    }

    // 4. Locate order in Supabase
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          ...(biteshipOrderId ? [{ biteshipOrderId }] : []),
          ...(orderNumber ? [{ orderNumber }] : []),
        ],
      },
    });

    if (!order) {
      console.warn(`[Biteship Webhook] ⚠️ Order not found in database: Biteship ID '${biteshipOrderId}' / OrderNumber '${orderNumber}'. Responding 200 OK.`);
      return NextResponse.json(
        { ok: true, status: "ORDER_NOT_FOUND", message: "Order not found in database" },
        { status: 200 }
      );
    }

    console.log(`[Biteship Webhook] Found Order: ${order.orderNumber} (DB ID: ${order.id}) for event: ${event}`);

    // 5. Process Event Logic
    switch (event) {
      case "order.status": {
        const rawStatus = payload.status || "";
        const { orderStatus, description } = mapBiteshipStatusToInternal(rawStatus);
        const waybillId =
          payload.waybill_id ||
          payload.courier_waybill_id ||
          payload.courier?.waybill_id;
        const trackingId =
          payload.courier_tracking_id || payload.courier?.tracking_id;

        const previousStatus = order.biteshipStatus || order.orderStatus;

        console.log(`[Biteship Webhook] Updating status for ${order.orderNumber}: '${previousStatus}' -> '${rawStatus}' (Internal: ${orderStatus})`);

        await prisma.$transaction([
          prisma.order.update({
            where: { id: order.id },
            data: {
              biteshipStatus: rawStatus,
              orderStatus,
              ...(waybillId ? { trackingNumber: waybillId } : {}),
              ...(trackingId ? { biteshipTrackingId: trackingId } : {}),
            },
          }),
          prisma.shippingLog.create({
            data: {
              orderId: order.id,
              event: "order.status",
              previousValue: previousStatus,
              newValue: rawStatus,
              note: `${description} (${rawStatus})`,
              rawPayload: JSON.stringify(payload),
            },
          }),
        ]);

        console.log(`[Biteship Webhook] ✅ Order ${order.orderNumber} status and log updated successfully.`);
        break;
      }

      case "order.price": {
        const newShippingCost =
          typeof payload.price === "number"
            ? Math.round(payload.price)
            : order.shippingCost;
        const oldShippingCost = order.shippingCost;
        const diff = newShippingCost - oldShippingCost;
        const newTotal = order.subtotal + newShippingCost;

        console.log(`[Biteship Webhook] Updating price for ${order.orderNumber}: Shipping ${oldShippingCost} -> ${newShippingCost} (Diff: ${diff}), New Total: ${newTotal}`);

        await prisma.$transaction([
          prisma.order.update({
            where: { id: order.id },
            data: {
              shippingCost: newShippingCost,
              total: newTotal,
            },
          }),
          prisma.shippingLog.create({
            data: {
              orderId: order.id,
              event: "order.price",
              previousValue: String(oldShippingCost),
              newValue: String(newShippingCost),
              note:
                diff !== 0
                  ? `Penyesuaian tarif ongkir Biteship: Rp ${diff > 0 ? "+" : ""}${diff.toLocaleString("id-ID")}`
                  : "Konfirmasi harga ongkir tetap",
              rawPayload: JSON.stringify(payload),
            },
          }),
        ]);

        console.log(`[Biteship Webhook] ✅ Order ${order.orderNumber} shipping price updated with audit log.`);
        break;
      }

      case "order.waybill_id": {
        const waybillId =
          payload.waybill_id ||
          payload.courier_waybill_id ||
          payload.courier?.waybill_id ||
          "";
        const trackingId =
          payload.courier_tracking_id || payload.courier?.tracking_id;

        const previousWaybill = order.trackingNumber || "-";

        console.log(`[Biteship Webhook] Updating waybill for ${order.orderNumber}: '${previousWaybill}' -> '${waybillId}'`);

        if (waybillId) {
          await prisma.$transaction([
            prisma.order.update({
              where: { id: order.id },
              data: {
                trackingNumber: waybillId,
                ...(trackingId ? { biteshipTrackingId: trackingId } : {}),
                orderStatus:
                  order.orderStatus === "processing"
                    ? "processing"
                    : order.orderStatus,
              },
            }),
            prisma.shippingLog.create({
              data: {
                orderId: order.id,
                event: "order.waybill_id",
                previousValue: previousWaybill,
                newValue: waybillId,
                note: `Nomor resi kurir diterbitkan: ${waybillId}`,
                rawPayload: JSON.stringify(payload),
              },
            }),
          ]);

          console.log(`[Biteship Webhook] ✅ Order ${order.orderNumber} waybill updated to ${waybillId}.`);
        }
        break;
      }

      default: {
        console.log(`[Biteship Webhook] Unhandled event '${event}', saving to shipping log.`);
        await prisma.shippingLog.create({
          data: {
            orderId: order.id,
            event,
            newValue: JSON.stringify(payload.status || payload),
            note: `Event: ${event}`,
            rawPayload: JSON.stringify(payload),
          },
        });
      }
    }

    console.log(`================== [BITESHIP WEBHOOK COMPLETED] ==================\n`);

    return NextResponse.json({
      ok: true,
      success: true,
      event,
      order_number: order.orderNumber,
      order_id: order.id,
    });
  } catch (error) {
    console.error("[Biteship Webhook] ❌ Error in processing event:", error);
    // Selalu respon 200 OK agar Biteship tidak menganggap webhook dead / retry berlebihan
    return NextResponse.json(
      {
        ok: true,
        message: "Webhook received with internal handling note",
        error: error instanceof Error ? error.message : "Internal error",
      },
      { status: 200 }
    );
  }
}

/**
 * Handle GET requests (ping / health checks)
 */
export async function GET() {
  return NextResponse.json(
    { ok: true, message: "Biteship Webhook Endpoint Active" },
    { status: 200 }
  );
}

/**
 * Handle HEAD requests
 */
export async function HEAD() {
  return new Response(null, { status: 200 });
}

/**
 * Handle POST requests
 * Endpoint: POST /api/webhooks/biteship
 */
export async function POST(request: Request) {
  return processBiteshipWebhook(request);
}
