import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/payments/duitku/check-status?orderNumber=...
 *
 * Endpoint PUBLIK (bisa diakses hanya dengan orderNumber, tanpa bukti kepemilikan).
 * Karena itu:
 *  - READ-ONLY: tidak memanggil syncOrderPaymentStatus / tidak memutasi status order.
 *    Sinkronisasi status Duitku terjadi lewat callback server-to-server yang
 *    terverifikasi signature, atau lewat job autoExpireStaleOrders — bukan di sini.
 *  - TIDAK mengembalikan data sensitif (VA number, QR string, paymentUrl).
 *    Hanya status + info tracking yang memang needed untuk lacak pesanan.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber =
      searchParams.get("orderNumber") || searchParams.get("orderId");

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Parameter orderNumber wajib diisi" },
        { status: 400 }
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
