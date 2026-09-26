import { prisma, Prisma } from "@/lib/prisma";
import { createBiteshipOrder } from "@/lib/biteship";
import { checkDuitkuTransaction } from "@/lib/duitku";
import { WEIGHT_PER_ITEM_GRAMS } from "@/lib/shipping-cost";
import { sendPaymentSuccessEmail } from "@/lib/email";
import { reportHandledError } from "@/lib/sentry";

// 3.4: jendela tambahan SETELAH expiredAt sebelum order benar-benar di-expire.
// Mengantisipasi pembayaran yang sedang diproses bank tepat di detik-detik akhir.
// expiredAt asli = 60 menit (lihat EXPIRY_MINUTES di checkout) → efektif 70 menit.
const EXPIRY_GRACE_MINUTES = 10;
const BASE_EXPIRY_MINUTES = 60;

interface MarkOrderPaidParams {
  orderId: string;
  reference?: string;
  fee?: string | number;
  paymentMethod?: string;
  statusMessage?: string;
}

type DuitkuCheck =
  | { ok: true; result: Awaited<ReturnType<typeof checkDuitkuTransaction>> }
  | { ok: false; error: unknown };

/**
 * 3.4: Bungkus checkDuitkuTransaction supaya bisa MEMBEDAKAN "API Duitku gagal
 * dihubungi" dari "status terkonfirmasi". Jangan pernah menyamakan network error
 * dengan "belum bayar" — itu penyebab order lunas ikut ter-expire.
 */
async function checkDuitkuSafe(orderNumber: string): Promise<DuitkuCheck> {
  try {
    const result = await checkDuitkuTransaction(orderNumber);
    return { ok: true, result };
  } catch (error) {
    return { ok: false, error };
  }
}

function isDuitkuPaid(statusCode: string): boolean {
  return statusCode === "00";
}

function isDuitkuExplicitFailed(result: {
  statusCode: string;
  statusMessage?: string;
}): boolean {
  return (
    result.statusCode === "02" ||
    ["FAILED", "EXPIRED", "EXPIRE", "CANCEL", "CANCELLED"].includes(
      (result.statusMessage || "").toUpperCase()
    )
  );
}

/**
 * Marks an order as paid, decrements stock for each item, and creates a Biteship order.
 *
 * 3.3: Transisi pending→paid dibungkus dalam $transaction dengan `updateMany`
 * bersyarat (where paymentStatus != 'paid') sebagai LOCK idempoten. Hanya satu
 * pemanggil (count===1) yang menang dan boleh lanjut membuat order Biteship —
 * menghilangkan race double-Biteship saat callback Duitku retry berjalan bareng.
 *
 * 3.4 (poin 2 & 3): Bila order sebelumnya sempat FAILED/expired dan stoknya sudah
 * dikembalikan (stockReturnedAt terisi), pembayaran telat yang TERKONFIRMASI sukses
 * tetap di-override jadi PAID, stok ditarik ulang (re-reserve), dan kejadian ini
 * di-log eksplisit sebagai `order.payment.late_success_override`.
 */
export async function markOrderPaid({
  orderId,
  reference,
  fee,
  paymentMethod,
  statusMessage,
}: MarkOrderPaidParams) {
  const pre = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!pre) return null;

  // Already marked as paid
  if (pre.paymentStatus === "paid") {
    return pre;
  }

  const wasFailedOverride =
    pre.paymentStatus === "failed" || pre.orderStatus === "cancelled";
  const nextOrderStatus = pre.isPreOrder ? "in_production" : "processing";
  const initialShippingStatus = pre.isPreOrder ? "WAITING_PRODUCTION" : "PENDING";

  // 3.3: transisi atomik + lock idempoten.
  const transition = await prisma.$transaction(async (tx) => {
    const lock = await tx.order.updateMany({
      where: { id: orderId, paymentStatus: { not: "paid" } },
      data: {
        paymentStatus: "paid",
        orderStatus: nextOrderStatus,
        shippingOrderStatus: initialShippingStatus,
        paidAt: pre.paidAt ?? new Date(),
        duitkuReference: reference || pre.duitkuReference,
        duitkuFee: fee !== undefined ? String(fee) : pre.duitkuFee,
        duitkuPaymentMethod: paymentMethod || pre.duitkuPaymentMethod,
        duitkuStatusMessage: statusMessage || pre.duitkuStatusMessage,
      },
    });

    // count === 0 → caller lain sudah lebih dulu menandai paid. Kalah race, keluar.
    if (lock.count === 0) {
      return { won: false as const };
    }

    // 3.4 poin 2: order ini sebelumnya FAILED dan stoknya sudah dikembalikan.
    // Tarik ulang stok supaya tidak oversell. Idempoten via lock stockReturnedAt.
    if (pre.stockReturnedAt) {
      const relock = await tx.order.updateMany({
        where: { id: orderId, stockReturnedAt: { not: null } },
        data: { stockReturnedAt: null },
      });
      if (relock.count > 0) {
        for (const item of pre.items) {
          if (!item.productId) continue;
          const prod = await tx.product.findUnique({
            where: { id: item.productId },
            select: { stock: true },
          });
          const current = prod?.stock ?? 0;
          const shortfall = item.quantity - current;
          // Customer SUDAH bayar → pesanan tetap dihormati. Bila stok tidak cukup
          // (sudah terjual ke orang lain saat sempat expired), clamp ke 0 dan catat.
          const target = shortfall > 0 ? 0 : current - item.quantity;
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: target },
          });
          if (shortfall > 0) {
            await tx.shippingLog.create({
              data: {
                orderId,
                event: "order.stock.oversell_on_late_payment",
                previousValue: String(current),
                newValue: String(target),
                note:
                  `Stok tidak cukup saat re-reserve akibat pembayaran telat masuk ` +
                  `(order ${pre.orderNumber} sebelumnya sempat expired). ` +
                  `Kekurangan: ${shortfall} untuk produk ${item.productId}. ` +
                  `Stok di-clamp ke 0 — PERLU REKONSILIASI MANUAL.`,
              },
            });
          }
        }
      }
    }

    // 3.4 poin 3: log eksplisit kejadian override FAILED → PAID.
    if (wasFailedOverride) {
      await tx.shippingLog.create({
        data: {
          orderId,
          event: "order.payment.late_success_override",
          previousValue: "failed",
          newValue: "paid",
          note:
            `Pembayaran TERKONFIRMASI SUKSES setelah order sempat di-expire/FAILED. ` +
            `Status di-override menjadi PAID. paidAt=${(pre.paidAt ?? new Date()).toISOString()}, ` +
            `reference=${reference || pre.duitkuReference || "-"}. ` +
            `Pertimbangkan menyesuaikan grace period bila kasus ini sering terjadi.`,
        },
      });
    }

    return { won: true as const };
  });

  if (!transition.won) {
    // Sudah diproses caller lain yang menang race.
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });
  }

  if (wasFailedOverride) {
    console.warn(
      `[OrderFulfillment] ⚠️ LATE SUCCESS OVERRIDE: order ${pre.orderNumber} sebelumnya FAILED/expired, ` +
        `kini dikonfirmasi PAID. Status di-override + stok ditarik ulang.`
    );
  }

  const updatedOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  // Email "pembayaran diterima". Hanya pemanggil yang MENANG lock yang sampai di
  // sini, jadi callback Duitku yang retry tidak mengirim email dua kali.
  // deliver() tidak pernah melempar → email gagal tidak membatalkan status paid.
  if (updatedOrder) {
    await sendPaymentSuccessEmail({
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      customerName: updatedOrder.customerName,
      customerEmail: updatedOrder.email,
      country: updatedOrder.country,
      total: updatedOrder.total,
      items: updatedOrder.items.map((item) => ({
        name: item.productNameSnapshot || item.product?.name || "Produk RAZRBILZ",
        size: item.size,
        quantity: item.quantity,
        priceAtBuy: item.priceAtBuy,
      })),
      paymentMethodName: updatedOrder.duitkuPaymentMethod,
      paidAt: updatedOrder.paidAt,
    });
  }

  // Pre-Order: DO NOT call Biteship yet. Wait until admin marks ready-to-ship.
  if (pre.isPreOrder) {
    await prisma.shippingLog.create({
      data: {
        orderId: pre.id,
        event: "order.in_production",
        previousValue: pre.orderStatus,
        newValue: "in_production",
        note: "Pembayaran terkonfirmasi. Pesanan masuk masa produksi (Pre-Order 14-21 hari). Pengiriman ke Biteship ditunda.",
      },
    });
    console.log(`[OrderFulfillment] Order ${pre.orderNumber} is PRE-ORDER. Status set to 'in_production'. Biteship dispatch deferred.`);
    return updatedOrder;
  }

  // Ready-Stock: Create Biteship shipment immediately if not yet created.
  // Hanya caller yang MENANG lock yang sampai di sini → tidak ada double Biteship.
  if (!pre.biteshipOrderId) {
    try {
      const shipping = await createBiteshipOrder({
        orderNumber: pre.orderNumber,
        customerName: pre.customerName,
        customerPhone: pre.phone,
        customerEmail: pre.email,
        destinationAddress: [pre.shippingAddress, pre.district, pre.city, pre.province]
          .filter(Boolean)
          .join(", "),
        destinationPostalCode: pre.postalCode,
        destinationNote: "Pembayaran melalui Duitku V2",
        courier: pre.courier,
        items: pre.items.map((item) => ({
          name: `${item.productNameSnapshot || item.product?.name || "Produk"} (Size ${item.size})`,
          quantity: item.quantity,
          value: item.priceAtBuy,
          // 2.5 lanjutan: pakai berat asli per unit (sama dengan yang dipakai
          // saat quote) supaya tagihan label Biteship konsisten dengan ongkir
          // yang dibayar customer. Fallback ke konstanta quote bila produk sudah
          // terhapus (productId → null) atau berat belum diisi.
          weight: item.product?.weightGrams ?? WEIGHT_PER_ITEM_GRAMS,
        })),
      });

      await prisma.order.update({
        where: { id: pre.id },
        data:
          shipping.success && shipping.orderId
            ? {
                biteshipOrderId: shipping.orderId,
                biteshipTrackingId: shipping.trackingId || null,
                trackingNumber: shipping.waybillId || shipping.trackingId || null,
                shippingOrderStatus: "CREATED",
                shippingOrderError: null,
              }
            : {
                shippingOrderStatus: "FAILED",
                shippingOrderError: shipping.error || "Gagal membuat order Biteship",
                shippingRetryCount: { increment: 1 },
              },
      });
    } catch (shippingError) {
      await prisma.order.update({
        where: { id: pre.id },
        data: {
          shippingOrderStatus: "FAILED",
          shippingOrderError:
            shippingError instanceof Error ? shippingError.message : "Gagal membuat order Biteship",
          shippingRetryCount: { increment: 1 },
        },
      });
    }
  }

  return updatedOrder;
}

/**
 * Checks order status with Duitku and synchronizes it if paid or canceled.
 */
export async function syncOrderPaymentStatus(orderNumberOrId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { OR: [{ orderNumber: orderNumberOrId }, { id: orderNumberOrId }] },
      include: { items: { include: { product: true } } },
    });

    if (!order) return null;
    if (order.paymentStatus === "paid") return order;

    // 3.4: hubungi Duitku, BEDAKAN antara "API gagal" dan "status terkonfirmasi".
    const check = await checkDuitkuSafe(order.orderNumber);

    if (!check.ok) {
      // API Duitku tidak bisa dihubungi → JANGAN expire. Biarkan status apa adanya,
      // coba lagi nanti (retry/cron). Gagal koneksi bukan berarti belum bayar.
      console.warn(
        `[OrderFulfillment] Duitku unreachable for ${order.orderNumber}; skip expire (akan dicoba lagi).`,
        check.error
      );
      return order;
    }

    const result = check.result;

    // Dibayar — termasuk override order yang sebelumnya FAILED (late success).
    if (isDuitkuPaid(result.statusCode)) {
      return await markOrderPaid({
        orderId: order.id,
        reference: result.reference,
        fee: result.fee,
        statusMessage: result.statusMessage,
      });
    }

    const explicitFailed = isDuitkuExplicitFailed(result);

    // Grace period: expire hanya bila sudah lewat expiredAt + grace
    // (atau, bila expiredAt null, createdAt + 60 menit + grace).
    const now = Date.now();
    const graceMs = EXPIRY_GRACE_MINUTES * 60 * 1000;
    const effectiveExpiry = order.expiredAt
      ? new Date(order.expiredAt).getTime() + graceMs
      : new Date(order.createdAt).getTime() + BASE_EXPIRY_MINUTES * 60 * 1000 + graceMs;
    const isPastGrace = now >= effectiveExpiry;

    // Boleh expire bila: Duitku eksplisit gagal, ATAU status bukan-paid (termasuk
    // pending/01) DAN sudah lewat grace period.
    if (explicitFailed || isPastGrace) {
      if (order.paymentStatus === "failed" || order.orderStatus === "cancelled") {
        return order;
      }
      return await cancelOrderAndReturnStock(
        order.id,
        result.statusMessage ||
          order.duitkuStatusMessage ||
          "Waktu pembayaran telah habis (Expired)"
      );
    }

    return order;
  } catch (error) {
    console.error("[OrderFulfillment] syncOrderPaymentStatus error:", error);
    return null;
  }
}

/**
 * Automatically checks and expires all pending orders that have passed their
 * expiration window PLUS grace period.
 *
 * 3.4: TIDAK PERNAH expire hanya karena API Duitku gagal dihubungi.
 * 1. Cari order pending yang sudah lewat expiredAt + grace (atau createdAt + 60m + grace).
 * 2. Hubungi Duitku:
 *    - API error       -> SKIP (biarkan pending, coba lagi nanti).
 *    - paid ("00")     -> markOrderPaid (termasuk override FAILED→PAID).
 *    - selain paid     -> baru boleh di-expire (failed/cancelled + kembalikan stok),
 *                         karena kita sudah punya konfirmasi status dari Duitku.
 */
export async function autoExpireStaleOrders(): Promise<number> {
  try {
    const now = new Date();
    const graceMs = EXPIRY_GRACE_MINUTES * 60 * 1000;
    const graceCutoff = new Date(now.getTime() - graceMs);
    const nullExpiryCutoff = new Date(
      now.getTime() - BASE_EXPIRY_MINUTES * 60 * 1000 - graceMs
    );

    const staleOrders = await prisma.order.findMany({
      where: {
        paymentStatus: "pending",
        OR: [
          { expiredAt: { lte: graceCutoff } },
          { expiredAt: null, createdAt: { lte: nullExpiryCutoff } },
        ],
      },
      include: { items: true },
    });

    if (staleOrders.length === 0) return 0;

    let expiredCount = 0;
    let skippedCount = 0;
    for (const order of staleOrders) {
      try {
        const check = await checkDuitkuSafe(order.orderNumber);

        // 3.4: API Duitku gagal dihubungi → JANGAN expire. Skip, retry nanti.
        if (!check.ok) {
          skippedCount++;
          console.warn(
            `[OrderFulfillment] Duitku unreachable for ${order.orderNumber}; skip auto-expire (akan dicoba lagi).`
          );
          continue;
        }

        const result = check.result;

        if (isDuitkuPaid(result.statusCode)) {
          await markOrderPaid({
            orderId: order.id,
            reference: result.reference,
            fee: result.fee,
            statusMessage: result.statusMessage,
          });
          continue;
        }

        // Sudah dapat konfirmasi status bukan-paid dari Duitku + lewat grace → expire.
        await cancelOrderAndReturnStock(
          order.id,
          result.statusMessage ||
            order.duitkuStatusMessage ||
            "Waktu pembayaran telah habis (Expired)"
        );
        expiredCount++;
      } catch (err) {
        console.error(`[OrderFulfillment] Error expiring order ${order.orderNumber}:`, err);
        reportHandledError("auto-expire-order", err, {
          orderNumber: order.orderNumber,
          orderId: order.id,
        });
      }
    }

    if (expiredCount > 0) {
      console.log(`[OrderFulfillment] Otomatis mengubah ${expiredCount} pesanan kadaluarsa menjadi FAILED & CANCELLED.`);
    }
    if (skippedCount > 0) {
      console.log(`[OrderFulfillment] ${skippedCount} pesanan dilewati (Duitku tidak bisa dihubungi) — tidak di-expire.`);
    }
    return expiredCount;
  } catch (error) {
    console.error("[OrderFulfillment] autoExpireStaleOrders error:", error);
    return 0;
  }
}

/**
 * 5.1: Inti pengembalian stok yang ATOMIC + IDEMPOTEN, dijalankan di dalam sebuah
 * transaction (tx). Pakai `stockReturnedAt` sebagai lock: updateMany bersyarat
 * (hanya order yang stockReturnedAt-nya masih null) memastikan kalau fungsi ini
 * terpanggil dua kali (retry / double-click / race), stok TIDAK ditambah dua kali.
 * Mengembalikan true bila stok benar-benar dikembalikan pada pemanggilan ini.
 */
async function returnStockTx(
  tx: Prisma.TransactionClient,
  orderId: string
): Promise<boolean> {
  const lock = await tx.order.updateMany({
    where: { id: orderId, stockReturnedAt: null },
    data: { stockReturnedAt: new Date() },
  });
  // count === 0 → stok untuk order ini sudah pernah dikembalikan. Idempoten.
  if (lock.count === 0) return false;

  const order = await tx.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order || order.items.length === 0) return false;

  for (const item of order.items) {
    if (!item.productId) continue;
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }
  return true;
}

/**
 * Restores product stock for each item in an order.
 * Safe and idempotent: ensures stock is returned when an order expires or is cancelled.
 *
 * 7.1: TIDAK lagi menelan error diam-diam. Mengembalikan `true` bila stok
 * berada dalam keadaan benar setelah pemanggilan ini (dikembalikan sekarang ATAU
 * memang sudah pernah dikembalikan). Mengembalikan `false` bila terjadi error —
 * transaksi stok sudah di-rollback, order ditandai `needsManualReview: true`, dan
 * pemanggil TIDAK boleh membalas success:true seolah stok sudah kembali.
 */
export async function returnOrderStock(orderId: string): Promise<boolean> {
  try {
    const returned = await prisma.$transaction((tx) => returnStockTx(tx, orderId));
    if (returned) {
      console.log(`[OrderFulfillment] Stock restored successfully for order ${orderId}`);
    } else {
      console.log(`[OrderFulfillment] Stock already returned for order ${orderId} (skip).`);
    }
    return true;
  } catch (error) {
    console.error(
      `[OrderFulfillment] ❌ returnOrderStock GAGAL untuk order ${orderId} — pengembalian stok di-rollback. Menandai needsManualReview untuk rekonsiliasi manual:`,
      error
    );
    reportHandledError("return-order-stock", error, { orderId });
    await prisma.order
      .update({ where: { id: orderId }, data: { needsManualReview: true } })
      .catch((e) =>
        console.error(
          `[OrderFulfillment] Gagal menandai needsManualReview untuk order ${orderId}:`,
          e
        )
      );
    return false;
  }
}

/**
 * 5.1: Membatalkan order (failed/cancelled) DAN mengembalikan stok dalam SATU
 * transaction atomik + idempoten. Dipakai di jalur expire/callback gagal supaya
 * tidak ada window di mana stok sudah kembali tapi status belum ter-update
 * (atau sebaliknya), dan supaya double-call tidak mengembalikan stok dua kali.
 *
 * 7.1: Bila transaksi gagal (mis. pengembalian stok error), order ditandai
 * `needsManualReview: true` dan error DILEMPAR kembali supaya pemanggil tahu dan
 * tidak membalas success:true padahal stok belum benar-benar kembali.
 */
export async function cancelOrderAndReturnStock(
  orderId: string,
  statusMessage?: string,
  extraData?: Prisma.OrderUpdateInput
) {
  try {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: { id: true, duitkuStatusMessage: true },
      });
      if (!order) return null;

      await returnStockTx(tx, orderId);

      return tx.order.update({
        where: { id: orderId },
        data: {
          ...(extraData || {}),
          paymentStatus: "failed",
          orderStatus: "cancelled",
          duitkuStatusMessage:
            statusMessage ||
            order.duitkuStatusMessage ||
            "Waktu pembayaran telah habis (Expired)",
        },
        include: { items: { include: { product: true } } },
      });
    });
  } catch (error) {
    console.error(
      `[OrderFulfillment] ❌ cancelOrderAndReturnStock GAGAL untuk order ${orderId} — order TIDAK berubah status dan stok tidak kembali (transaksi rollback). Menandai needsManualReview:`,
      error
    );
    await prisma.order
      .update({ where: { id: orderId }, data: { needsManualReview: true } })
      .catch((e) =>
        console.error(
          `[OrderFulfillment] Gagal menandai needsManualReview untuk order ${orderId}:`,
          e
        )
      );
    throw error;
  }
}
