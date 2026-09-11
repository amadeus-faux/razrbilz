import { NextResponse } from "next/server";
import { syncOrderPaymentStatus } from "@/lib/order-fulfillment";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber") || searchParams.get("orderId");

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Parameter orderNumber wajib diisi" },
        { status: 400 }
      );
    }

    // Sync order status with Duitku
    const order = await syncOrderPaymentStatus(orderNumber);

    if (!order) {
      // Fallback find directly in database in case sync failed
      const dbOrder = await prisma.order.findFirst({
        where: { OR: [{ orderNumber }, { id: orderNumber }] },
        select: {
          id: true,
          orderNumber: true,
          paymentStatus: true,
          orderStatus: true,
          total: true,
          duitkuPaymentMethod: true,
          duitkuVaNumber: true,
          duitkuQrString: true,
          duitkuPaymentUrl: true,
        },
      });

      if (!dbOrder) {
        return NextResponse.json(
          { error: "Pesanan tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        orderNumber: dbOrder.orderNumber,
        paymentStatus: dbOrder.paymentStatus,
        orderStatus: dbOrder.orderStatus,
      });
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      total: order.total,
      duitkuPaymentMethod: order.duitkuPaymentMethod,
      biteshipOrderId: order.biteshipOrderId,
    });
  } catch (error) {
    console.error("[CheckStatus] Error:", error);
    return NextResponse.json(
      { error: "Gagal memeriksa status pembayaran" },
      { status: 500 }
    );
  }
}
