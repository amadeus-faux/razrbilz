import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { returnOrderStock } from "@/lib/order-fulfillment";
import { cancelBiteshipOrder } from "@/lib/biteship";
import { sendCancellationEmail } from "@/lib/email";
import { requireAdmin } from "@/lib/require-admin";
import { formatRupiah } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ orderId: string }>;
}

/** Status yang masih boleh dibatalkan: paket belum diberangkatkan. */
const CANCELABLE_ORDER_STATUSES = [
  "order_received",
  "processing",
  "in_production",
  "ready_to_ship",
];

/**
 * Status Biteship sebelum paket diserahkan ke kurir. Status kita bisa tertinggal
 * satu langkah dari webhook, jadi batas ini diperiksa terpisah: order yang
 * orderStatus-nya masih ready_to_ship tapi sudah di-pickup kurir tidak bisa
 * dibatalkan lagi secara fisik.
 */
const PRE_PICKUP_BITESHIP_STATUSES = [
  "pending",
  "allocated",
  "confirmed",
  "scheduled",
  "picking_up",
];

/**
 * POST /api/admin/orders/[orderId]/cancel
 *
 * Membatalkan pesanan PAID sebelum pengiriman: tarik dulu di Biteship, baru ubah
 * status kita, kembalikan stok, catat pengingat refund, kirim email.
 * paymentStatus sengaja TIDAK diubah — uangnya memang sudah masuk (lihat catatan
 * Jalur A di src/lib/order-status-labels.ts).
 */
export async function POST(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Parameter orderId wajib diisi" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        email: true,
        country: true,
        paymentStatus: true,
        orderStatus: true,
        biteshipOrderId: true,
        biteshipStatus: true,
        total: true,
        duitkuPaymentMethod: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    if (order.orderStatus === "cancelled" || order.orderStatus === "returned") {
      return NextResponse.json(
        { error: `Pesanan sudah berstatus ${order.orderStatus}.` },
        { status: 409 }
      );
    }

    if (!CANCELABLE_ORDER_STATUSES.includes(order.orderStatus)) {
      return NextResponse.json(
        {
          error: `Pesanan berstatus "${order.orderStatus}" tidak bisa dibatalkan karena paketnya sudah berangkat. Gunakan "Tandai Retur".`,
        },
        { status: 400 }
      );
    }

    const rawBStatus = (order.biteshipStatus || "").toLowerCase().trim();
    if (rawBStatus && !PRE_PICKUP_BITESHIP_STATUSES.includes(rawBStatus)) {
      return NextResponse.json(
        {
          error: `Kurir sudah menangani paketnya (status Biteship: ${rawBStatus}). Pembatalan tidak tersedia lagi — gunakan "Tandai Retur".`,
        },
        { status: 400 }
      );
    }

    // 1. Biteship dulu. Kalau penolakan kurir diabaikan, kita mencatat pesanan
    //    sebagai batal sementara paketnya masih melaju ke alamat customer.
    let biteshipCancelled = false;
    if (order.biteshipOrderId) {
      const cancel = await cancelBiteshipOrder(order.biteshipOrderId);
      if (!cancel.success) {
        return NextResponse.json(
          {
            error: `Biteship menolak pembatalan: ${cancel.error}. Status pesanan tidak diubah.`,
          },
          { status: 409 }
        );
      }
      biteshipCancelled = true;
    }

    // 2. Transisi bersyarat: hanya satu pemanggil yang boleh memicu efek samping
    //    (pola yang sama dengan markOrderPaid).
    const transition = await prisma.order.updateMany({
      where: { id: order.id, orderStatus: { in: CANCELABLE_ORDER_STATUSES } },
      data: {
        orderStatus: "cancelled",
        shippingOrderStatus: "CANCELLED",
        biteshipStatus: "cancelled",
      },
    });

    if (transition.count === 0) {
      return NextResponse.json(
        {
          error:
            "Status pesanan berubah saat pembatalan diproses. Muat ulang halaman dan periksa kembali.",
        },
        { status: 409 }
      );
    }

    // 3. Barang belum pernah keluar studio, jadi stok wajib kembali.
    const stockReturned = await returnOrderStock(order.id);

    // 4. Refund tidak ada di sistem ini (Duitku tidak punya endpoint refund yang
    //    kita pakai) — jejak audit ini satu-satunya pengingatnya.
    const wasPaid = order.paymentStatus === "paid";
    const refundNote = wasPaid
      ? `PERLU REFUND MANUAL — ${formatRupiah(order.total)} via ${
          order.duitkuPaymentMethod || "kanal pembayaran yang dipakai customer"
        }.`
      : "Pesanan belum dibayar, tidak ada refund.";

    const shippingNote = biteshipCancelled
      ? `Pengiriman Biteship ${order.biteshipOrderId} dibatalkan via API.`
      : order.biteshipOrderId
        ? "Penarikan di Biteship belum tentu terjadi."
        : "Belum ada pesanan pengiriman di Biteship.";

    const stockNote = stockReturned
      ? "Stok dikembalikan ke katalog."
      : "Stok TIDAK kembali otomatis — pesanan ditandai perlu-tinjauan-manual, cek stok manual.";

    await prisma.shippingLog.create({
      data: {
        orderId: order.id,
        event: "order.cancelled_by_admin",
        previousValue: order.orderStatus,
        newValue: "cancelled",
        note: `${refundNote} ${shippingNote} ${stockNote}`,
      },
    });

    // 5. Email hanya untuk order yang benar-benar dibayar: menjanjikan refund pada
    //    order unpaid adalah klaim yang tidak benar.
    let emailSent = false;
    let emailMessage = "Customer tidak punya alamat email.";
    if (wasPaid && order.email) {
      const result = await sendCancellationEmail({
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.email,
        country: order.country,
        total: order.total,
        paymentMethodName: order.duitkuPaymentMethod,
        cancelledAt: new Date(),
      });
      emailSent = result.success;
      emailMessage = result.message;
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");

    const updated = await prisma.order.findUnique({
      where: { id: order.id },
      select: { id: true, orderNumber: true, orderStatus: true, paymentStatus: true },
    });

    return NextResponse.json({
      success: true,
      order: updated,
      biteshipCancelled,
      stockReturned,
      emailSent,
      warning: stockReturned
        ? undefined
        : "Status dibatalkan, TAPI pengembalian stok GAGAL. Periksa stok secara manual.",
      message:
        `Pesanan ${order.orderNumber} dibatalkan.` +
        (biteshipCancelled ? " Pengiriman Biteship ikut dibatalkan." : "") +
        (wasPaid ? " PERLU REFUND MANUAL — cek riwayat pesanan." : "") +
        (emailSent
          ? " Email pembatalan terkirim."
          : wasPaid
            ? ` Email pembatalan TIDAK terkirim: ${emailMessage}`
            : ""),
    });
  } catch (error) {
    console.error("[OrderCancel] POST error:", error);
    return NextResponse.json(
      { error: "Gagal membatalkan pesanan." },
      { status: 500 }
    );
  }
}
