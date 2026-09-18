import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBiteshipOrder } from "@/lib/biteship";
import { mapBiteshipStatusToInternal } from "@/app/api/webhooks/biteship/route";

interface RouteParams {
  params: Promise<{ orderId: string }>;
}

/**
 * Admin Action: Manually sync shipping status from Biteship
 * Calls Biteship GET /orders/:id and updates database status
 * POST /api/admin/orders/[orderId]/sync-shipping
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: "Parameter orderId wajib diisi" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: `Pesanan tidak ditemukan: ${orderId}` },
        { status: 404 }
      );
    }

    if (!order.biteshipOrderId) {
      return NextResponse.json(
        { error: `Pesanan belum memiliki ID Biteship untuk disinkronkan.` },
        { status: 400 }
      );
    }

    console.log(`[Sync Shipping] Fetching status for order ${order.orderNumber} (Biteship ID: ${order.biteshipOrderId})...`);

    const result = await getBiteshipOrder(order.biteshipOrderId);

    if (!result.success || !result.status) {
      return NextResponse.json(
        { error: result.error || "Gagal mengambil data dari Biteship" },
        { status: 400 }
      );
    }

    const rawStatus = (result.status || "").toLowerCase().trim();
    const { orderStatus, description } = mapBiteshipStatusToInternal(rawStatus);
    const waybillId = result.waybillId;
    const trackingId = result.trackingId;

    const previousStatus = order.biteshipStatus || order.orderStatus;

    const [updatedOrder] = await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          biteshipStatus: rawStatus,
          orderStatus,
          ...(waybillId ? { trackingNumber: waybillId } : {}),
          ...(trackingId ? { biteshipTrackingId: trackingId } : {}),
          shippingOrderError: rawStatus === "cancelled" ? "Pesanan dibatalkan di Biteship" : order.shippingOrderError,
        },
      }),
      prisma.shippingLog.create({
        data: {
          orderId: order.id,
          event: "order.manual_sync",
          previousValue: previousStatus,
          newValue: rawStatus,
          note: `Sinkronisasi manual dari Biteship API: ${description} (${rawStatus})`,
          rawPayload: JSON.stringify(result.raw || {}),
        },
      }),
    ]);

    console.log(`[Sync Shipping] ✅ Order ${order.orderNumber} status updated: '${previousStatus}' -> '${rawStatus}'`);

    return NextResponse.json({
      success: true,
      message: `Status pesanan ${order.orderNumber} berhasil diperbarui menjadi: ${description} (${rawStatus})`,
      orderNumber: updatedOrder.orderNumber,
      biteshipOrderId: order.biteshipOrderId,
      biteshipStatus: rawStatus,
      orderStatus: updatedOrder.orderStatus,
      trackingNumber: updatedOrder.trackingNumber,
    });
  } catch (error) {
    console.error("[Sync Shipping] ❌ Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Terjadi kesalahan sistem saat sinkronisasi",
      },
      { status: 500 }
    );
  }
}
