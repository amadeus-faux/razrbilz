import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBiteshipOrder } from "@/lib/biteship";
import { requireAdmin } from "@/lib/require-admin";
import { WEIGHT_PER_ITEM_GRAMS } from "@/lib/shipping-cost";

interface RouteParams {
  params: Promise<{ orderId: string }>;
}

/**
 * Admin Action: Mark order as ready to ship (Tandai Siap Kirim)
 * Calls Biteship createOrder API and moves pre-order from 'in_production' to 'ready_to_ship'.
 * POST /api/admin/orders/[orderId]/ready-to-ship
 */
export async function POST(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: "Parameter orderId wajib diisi" }, { status: 400 });
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
        { error: `Pesanan tidak ditemukan: ${orderId}` },
        { status: 404 }
      );
    }

    if (order.paymentStatus !== "paid") {
      return NextResponse.json(
        {
          error: `Pesanan belum berstatus 'paid' (status saat ini: ${order.paymentStatus}). Hanya pesanan lunas yang dapat dikirim ke kurir.`,
        },
        { status: 400 }
      );
    }

    if (order.biteshipOrderId) {
      return NextResponse.json(
        {
          error: `Pesanan sudah memiliki Biteship Order ID (${order.biteshipOrderId}). Gunakan retry jika terjadi kendala pengiriman.`,
        },
        { status: 400 }
      );
    }

    console.log(`[Admin Ready-To-Ship] Processing order ${order.orderNumber} for Biteship dispatch...`);

    // 2. Call Biteship create order
    const biteshipResult = await createBiteshipOrder({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.phone,
      customerEmail: order.email,
      destinationAddress: [order.shippingAddress, order.district, order.city, order.province]
        .filter(Boolean)
        .join(", "),
      destinationPostalCode: order.postalCode,
      destinationNote: "Order selesai produksi (siap kirim)",
      courier: order.courier,
      items: order.items.map((item) => ({
        name: `${item.productNameSnapshot || item.product?.name || "Product"} (Size ${item.size})`,
        quantity: item.quantity,
        value: item.priceAtBuy,
        weight: item.product?.weightGrams ?? WEIGHT_PER_ITEM_GRAMS,
      })),
    });

    // 3. Update database based on outcome
    if (biteshipResult.success && biteshipResult.orderId) {
      const trackingNo = biteshipResult.waybillId || biteshipResult.trackingId || null;
      const initialBiteshipStatus = biteshipResult.status || "confirmed";

      const [updatedOrder] = await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: {
            orderStatus: "ready_to_ship",
            shippingOrderStatus: "CREATED",
            shippingOrderError: null,
            biteshipOrderId: biteshipResult.orderId,
            biteshipTrackingId: biteshipResult.trackingId || null,
            trackingNumber: trackingNo,
            biteshipStatus: initialBiteshipStatus,
          },
        }),
        prisma.shippingLog.create({
          data: {
            orderId: order.id,
            event: "order.ready_to_ship",
            previousValue: order.orderStatus,
            newValue: "ready_to_ship",
            note: `Pesanan selesai produksi dan ditandai siap kirim. Berhasil dibuatkan jadwal pickup di Biteship (ID: ${biteshipResult.orderId}).`,
            rawPayload: JSON.stringify(biteshipResult.raw || {}),
          },
        }),
      ]);

      console.log(`[Admin Ready-To-Ship] ✅ Order ${order.orderNumber} successfully sent to Biteship: ${biteshipResult.orderId}`);

      return NextResponse.json({
        success: true,
        message: `Pesanan ${order.orderNumber} berhasil ditandai siap kirim dan dikirimkan ke Biteship!`,
        orderNumber: updatedOrder.orderNumber,
        biteshipOrderId: biteshipResult.orderId,
        trackingNumber: updatedOrder.trackingNumber,
        orderStatus: updatedOrder.orderStatus,
        shippingOrderStatus: "CREATED",
      });
    } else {
      const errorMsg = biteshipResult.error || "Gagal membuat order pengiriman di Biteship";
      console.error(`[Admin Ready-To-Ship] ❌ Failed for ${order.orderNumber}: ${errorMsg}`);

      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: {
            shippingOrderStatus: "FAILED",
            shippingOrderError: errorMsg,
            shippingRetryCount: { increment: 1 },
          },
        }),
        prisma.shippingLog.create({
          data: {
            orderId: order.id,
            event: "order.shipping_error",
            previousValue: order.orderStatus,
            newValue: "FAILED",
            note: `Gagal mengirim ke Biteship: ${errorMsg}`,
            rawPayload: JSON.stringify(biteshipResult.raw || {}),
          },
        }),
      ]);

      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
          code: biteshipResult.code,
          orderNumber: order.orderNumber,
          shippingOrderStatus: "FAILED",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[Admin Ready-To-Ship] ❌ Fatal error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Terjadi kesalahan internal saat menandai siap kirim",
      },
      { status: 500 }
    );
  }
}
