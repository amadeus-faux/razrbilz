import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBiteshipOrder } from "@/lib/biteship";

interface RouteParams {
  params: Promise<{ orderId: string }>;
}

/**
 * Manual Retry API for Biteship Shipping Order Creation
 * POST /api/admin/retry-shipping/[orderId]
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // 1. Find Order in database
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: `Order tidak ditemukan: ${orderId}` },
        { status: 404 }
      );
    }

    if (order.paymentStatus !== "paid") {
      return NextResponse.json(
        {
          error: `Pesanan belum berstatus 'paid' (status saat ini: ${order.paymentStatus}). Hanya pesanan terbayar yang dapat dibuatkan label pengiriman.`,
        },
        { status: 400 }
      );
    }

    console.log(`[Admin Retry] Attempting manual retry for order ${order.orderNumber} (Retry count before: ${order.shippingRetryCount})...`);

    // 2. Call Biteship create order
    const biteshipResult = await createBiteshipOrder({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.phone,
      customerEmail: order.email,
      destinationAddress: `${order.shippingAddress}, ${order.district || ""}, ${order.city}, ${order.province || ""}`.trim(),
      destinationPostalCode: order.postalCode,
      destinationNote: "Manual retry from Admin",
      courier: order.courier,
      items: order.items.map((item) => ({
        name: `${item.product?.name || "Product"} (Size ${item.size})`,
        quantity: item.quantity,
        value: item.priceAtBuy,
        weight: 500, // Standard apparel weight in grams
      })),
    });

    // 3. Update database based on outcome
    if (biteshipResult.success && biteshipResult.orderId) {
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          shippingOrderStatus: "CREATED",
          shippingOrderError: null,
          biteshipOrderId: biteshipResult.orderId,
          biteshipTrackingId: biteshipResult.trackingId || null,
          trackingNumber: biteshipResult.waybillId || biteshipResult.trackingId || null,
          shippingRetryCount: { increment: 1 },
          orderStatus: "processing",
        },
      });

      console.log(`[Admin Retry] ✅ Successfully created Biteship order for ${order.orderNumber}: ${biteshipResult.orderId}`);

      return NextResponse.json({
        success: true,
        message: "Order pengiriman Biteship berhasil dibuat!",
        orderNumber: updatedOrder.orderNumber,
        biteshipOrderId: biteshipResult.orderId,
        trackingNumber: updatedOrder.trackingNumber,
        shippingOrderStatus: "CREATED",
        retryCount: updatedOrder.shippingRetryCount,
      });
    } else {
      const errorMsg = biteshipResult.error || "Gagal membuat order di Biteship";
      console.error(`[Admin Retry] ❌ Failed to create Biteship order for ${order.orderNumber}: ${errorMsg}`);

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          shippingOrderStatus: "FAILED",
          shippingOrderError: errorMsg,
          shippingRetryCount: { increment: 1 },
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
          code: biteshipResult.code,
          orderNumber: updatedOrder.orderNumber,
          shippingOrderStatus: "FAILED",
          retryCount: updatedOrder.shippingRetryCount,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[Admin Retry] ❌ Fatal error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Terjadi kesalahan sistem saat mencoba ulang",
      },
      { status: 500 }
    );
  }
}
