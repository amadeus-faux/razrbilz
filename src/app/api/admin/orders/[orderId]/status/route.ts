import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { returnOrderStock } from "@/lib/order-fulfillment";
import { requireAdmin } from "@/lib/require-admin";

/** PATCH /api/admin/orders/[orderId]/status — Update orderStatus */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { orderId } = await params;
    const body = await request.json();
    const { orderStatus } = body as { orderStatus: string };

    const ALLOWED_TRANSITIONS: Record<string, string[]> = {
      returned: ["processing", "in_production", "delivered", "completed", "shipped"],
      cancelled: ["processing", "order_received", "in_production"],
      completed: ["delivered", "shipped"],
      delivered: ["processing", "in_production", "shipped", "ready_to_ship"],
    };

    const allowed = ALLOWED_TRANSITIONS[orderStatus];
    if (!allowed) {
      return NextResponse.json(
        { error: `Status "${orderStatus}" tidak dikenali atau tidak boleh diubah lewat endpoint ini.` },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, orderStatus: true, paymentStatus: true, orderNumber: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    if (orderStatus === "returned" && order.paymentStatus !== "paid") {
      return NextResponse.json(
        { error: "Hanya pesanan yang sudah dibayar yang dapat ditandai retur." },
        { status: 400 }
      );
    }

    if (!allowed.includes(order.orderStatus)) {
      return NextResponse.json(
        {
          error: `Tidak bisa mengubah ke "${orderStatus}" dari status saat ini: "${order.orderStatus}". Status yang diperbolehkan: ${allowed.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    let stockReturnFailed = false;
    if (orderStatus === "returned" && order.orderStatus !== "returned") {
      // 7.1: kalau pengembalian stok gagal, returnOrderStock sudah menandai
      // needsManualReview + mengembalikan false. Jangan balas success:true tanpa
      // memberi tahu admin bahwa stok belum benar-benar kembali.
      const ok = await returnOrderStock(orderId);
      stockReturnFailed = !ok;
    }

    const updateData: Record<string, any> = { orderStatus };
    if (orderStatus === "delivered") {
      updateData.shippingOrderStatus = "DELIVERED";
      updateData.biteshipStatus = "delivered";
    } else if (orderStatus === "returned") {
      updateData.shippingOrderStatus = "RETURNED";
      updateData.biteshipStatus = "returned";
    } else if (orderStatus === "cancelled") {
      updateData.shippingOrderStatus = "CANCELLED";
      updateData.biteshipStatus = "cancelled";
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      select: { id: true, orderNumber: true, orderStatus: true },
    });

    await prisma.shippingLog.create({
      data: {
        orderId,
        event: `STATUS_CHANGED_TO_${orderStatus.toUpperCase()}`,
        previousValue: order.orderStatus,
        newValue: orderStatus,
        note: `Status pesanan diubah oleh admin menjadi ${orderStatus}`,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      order: updated,
      warning: stockReturnFailed
        ? "Status diperbarui, TAPI pengembalian stok GAGAL. Pesanan ditandai perlu-tinjauan-manual (needsManualReview) — periksa stok secara manual."
        : undefined,
    });
  } catch (error) {
    console.error("[OrderStatus] PATCH error:", error);
    return NextResponse.json({ error: "Gagal mengubah status pesanan." }, { status: 500 });
  }
}
