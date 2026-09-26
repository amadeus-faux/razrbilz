import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { timingSafeEqual } from "crypto";
import {
  mapBiteshipStatusToInternal,
  type BiteshipWebhookPayload,
} from "@/lib/biteship-status";
import { sendShippingEmail } from "@/lib/email";
import { returnOrderStock } from "@/lib/order-fulfillment";
import { reportHandledError } from "@/lib/sentry";

function verifyWebhookSecret(request: Request): boolean {
  const secret = process.env.BITESHIP_WEBHOOK_SECRET;

  // FAIL-CLOSED: tanpa secret terkonfigurasi, tolak SEMUA webhook.
  // (Sebelumnya meloloskan semua request bila env belum di-set.)
  if (!secret) {
    console.error(
      "[Biteship Webhook] BITESHIP_WEBHOOK_SECRET belum di-set di environment. Menolak request (fail-closed)."
    );
    return false;
  }

  // Secret HANYA boleh lewat header. Query string (?secret=) sengaja tidak
  // diterima lagi karena bisa bocor ke access log server / proxy / browser history.
  const providedToken =
    request.headers.get("x-biteship-signature") ||
    request.headers.get("x-biteship-secret") ||
    request.headers.get("biteship-token") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    request.headers.get("x-signature-key");

  if (!providedToken) {
    return false;
  }

  // Perbandingan timing-safe untuk mencegah timing attack.
  const a = Buffer.from(providedToken);
  const b = Buffer.from(secret);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function processBiteshipWebhook(
  request: Request,
  explicitEvent?: string
) {
  const timestamp = new Date().toISOString();
  console.log(`\n================== [BITESHIP WEBHOOK ${timestamp}] ==================`);

  // 0. FAIL-CLOSED auth gate — diverifikasi paling awal, sebelum body diparse
  //    atau ping dilayani. Secret wajib cocok; bila env belum di-set → tolak.
  if (!verifyWebhookSecret(request)) {
    console.warn(
      "[Biteship Webhook] ⚠️ Secret tidak valid / tidak ada. Menolak request (401)."
    );
    return NextResponse.json(
      { ok: false, error: "Invalid or missing webhook secret" },
      { status: 401 }
    );
  }

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

    // Resi untuk email "pesanan dikirim". Event `order.status` dan
    // `order.waybill_id` bisa datang dalam urutan apa pun dari Biteship, jadi
    // keduanya mengusahakan pemberitahuan yang sama — pengirimnya idempoten per
    // nomor resi sehingga retry webhook tidak mengirim email ganda.
    let shipmentNotice: { trackingNumber: string } | null = null;

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

        // Hanya status "sudah berangkat" yang boleh mengklaim pengiriman ke
        // customer (subjek email berbunyi "has been shipped"), dan hanya bila
        // nomor resi sudah diketahui.
        if (orderStatus === "shipped") {
          const resi = waybillId || order.trackingNumber;
          if (resi) shipmentNotice = { trackingNumber: resi };
        }

        // 7b: paket retur = barang fisik kembali ke studio, jadi stok harus
        // ditarik ulang. Sebelumnya hanya jalur admin (api/admin/orders/[orderId]/status)
        // yang memanggil returnOrderStock, sehingga retur otomatis dari Biteship
        // membuat produk tampak "habis" selamanya. returnOrderStock idempoten
        // (lock stockReturnedAt) → retry webhook tidak menambah stok dua kali.
        // paymentStatus sengaja TIDAK diubah (tetap paid; revenue sudah mengecualikan
        // order returned/cancelled).
        if (orderStatus === "returned" && order.orderStatus !== "returned") {
          const stockReturned = await returnOrderStock(order.id);
          if (stockReturned) {
            await prisma.shippingLog.create({
              data: {
                orderId: order.id,
                event: "order.stock.returned_by_webhook",
                previousValue: order.orderStatus,
                newValue: "returned",
                note: `Paket retur terdeteksi otomatis dari webhook Biteship (status: ${rawStatus}). Stok produk dikembalikan ke katalog tanpa tindakan admin.`,
              },
            });
            console.log(
              `[Biteship Webhook] ↩️ Stok order ${order.orderNumber} dikembalikan otomatis (retur Biteship).`
            );
          } else {
            // returnOrderStock sudah menandai needsManualReview + me-rollback
            // transaksinya, dan sudah melapor ke Sentry dengan tag
            // `return-order-stock`. Tidak perlu dilaporkan dua kali di sini.
            // Status order tetap returned; stok perlu rekonsiliasi manual.
            console.error(
              `[Biteship Webhook] ⚠️ Order ${order.orderNumber} berstatus retur tetapi pengembalian stok GAGAL — order ditandai needsManualReview untuk rekonsiliasi manual.`
            );
          }
        }
        break;
      }

      case "order.price": {
        const newShippingCost =
          typeof payload.price === "number"
            ? Math.round(payload.price)
            : order.shippingCost;
        const oldShippingCost = order.shippingCost;
        const diff = newShippingCost - oldShippingCost;

        // D2 guard: JANGAN ubah total order yang sudah dibayar. Pelanggan sudah
        // membayar nominal tertentu; mengubah total setelah paid menciptakan
        // selisih tagihan vs pembayaran. Cukup catat sebagai discrepancy.
        if (order.paymentStatus === "paid") {
          console.warn(
            `[Biteship Webhook] ⚠️ order.price untuk ${order.orderNumber} DIABAIKAN: order sudah PAID. ` +
              `Ongkir webhook Rp ${newShippingCost} vs tersimpan Rp ${oldShippingCost} (selisih Rp ${diff}).`
          );
          await prisma.shippingLog.create({
            data: {
              orderId: order.id,
              event: "order.price.discrepancy_ignored",
              previousValue: String(oldShippingCost),
              newValue: String(newShippingCost),
              note:
                `Order sudah berstatus PAID — penyesuaian ongkir dari webhook DIABAIKAN demi integritas total yang sudah dibayar. ` +
                `Ongkir webhook: Rp ${newShippingCost.toLocaleString("id-ID")}, tersimpan: Rp ${oldShippingCost.toLocaleString("id-ID")}, selisih: Rp ${diff.toLocaleString("id-ID")}.`,
              rawPayload: JSON.stringify(payload),
            },
          });
          break;
        }

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

          // Resi terbit belakangan, tapi pesanan sudah berstatus dikirim.
          if (order.orderStatus === "shipped") {
            shipmentNotice = { trackingNumber: waybillId };
          }
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

    // Email "pesanan dikirim / nomor resi". Sengaja DI LUAR $transaction dan
    // setelah semua update DB: email adalah efek samping, dan sendShippingEmail
    // tidak pernah melempar — kegagalan Resend tidak membuat Biteship menganggap
    // webhook gagal lalu mengirim ulang event yang sama.
    if (shipmentNotice) {
      await sendShippingEmail({
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.email,
        country: order.country,
        courier:
          payload.courier_company || payload.courier?.company || order.courier,
        service: payload.courier_type || payload.courier?.type || null,
        trackingNumber: shipmentNotice.trackingNumber,
        shippedAt: payload.updated_at ?? null,
      });
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
    // 7.2: error internal → balas 5xx supaya Biteship tahu harus retry.
    // Detail asli hanya di-log di server, tidak dibocorkan ke pemanggil.
    console.error("[Biteship Webhook] ❌ Error in processing event:", error);
    reportHandledError("biteship-webhook", error, {
      orderNumber: payload?.metadata?.order_number ?? null,
    });
    return NextResponse.json(
      {
        ok: false,
        error: "Internal error while processing webhook",
      },
      { status: 500 }
    );
  }
}
