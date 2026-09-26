import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncOrderPaymentStatus } from "@/lib/order-fulfillment";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/payments/duitku/check-status?orderNumber=...&sync=1
 *
 * Endpoint PUBLIK (bisa diakses hanya dengan orderNumber, tanpa bukti kepemilikan).
 *
 * Default: READ-ONLY — hanya membaca paymentStatus dari DB. Dipakai poll otomatis
 * tiap 4 detik di modal supaya murah dan tidak membebani API Duitku.
 *
 * Dengan `sync=1` (tombol manual "Saya Sudah Bayar (Cek Status)"): endpoint bertanya
 * LANGSUNG ke Duitku lewat transactionStatus lalu menyinkronkan status order. AMAN
 * walau publik: status hanya naik jadi PAID bila Duitku sendiri mengonfirmasi
 * statusCode "00" — bukan karena pemanggil mengklaim sudah bayar. Jalur ini identik
 * dengan yang sudah dipakai halaman /payment/instructions.
 *
 * TIDAK mengembalikan data sensitif (VA number, QR string, paymentUrl, paymentCode).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber =
      searchParams.get("orderNumber") || searchParams.get("orderId");
    const syncParam = searchParams.get("sync");
    const wantsSync = syncParam === "1" || syncParam === "true";

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Parameter orderNumber wajib diisi" },
        { status: 400 }
      );
    }

    // 2B: sinkronisasi ke Duitku HANYA saat diminta eksplisit (tombol manual),
    // bukan pada poll otomatis. Gagal sync tidak boleh menggagalkan pembacaan status.
    if (wantsSync) {
      await syncOrderPaymentStatus(orderNumber).catch((err) =>
        console.error("[CheckStatus] syncOrderPaymentStatus error:", err)
      );
    }

    const order = await prisma.order.findFirst({
      where: { OR: [{ orderNumber }, { id: orderNumber }] },
      select: {
        orderNumber: true,
        paymentStatus: true,
        orderStatus: true,
        total: true,
        shippingCost: true,
        shippingOrderStatus: true,
        biteshipStatus: true,
        trackingNumber: true,
        courier: true,
        items: {
          select: {
            productNameSnapshot: true,
            size: true,
            quantity: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      total: order.total,
      shippingCost: order.shippingCost,
      shippingOrderStatus: order.shippingOrderStatus,
      biteshipStatus: order.biteshipStatus,
      trackingNumber: order.trackingNumber,
      courier: order.courier,
      items: order.items.map((i) => ({
        name: i.productNameSnapshot,
        size: i.size,
        quantity: i.quantity,
      })),
    });
  } catch (error) {
    console.error("[CheckStatus] Error:", error);
    return NextResponse.json(
      { error: "Gagal memeriksa status pembayaran" },
      { status: 500 }
    );
  }
}
