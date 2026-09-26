import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendManualShippingEmail } from "@/lib/email";
import { requireAdmin } from "@/lib/require-admin";

interface ManualTrackingRequestBody {
  trackingNumber: string;
  courier?: string;
  service?: string;
  shippedAt?: string;
  note?: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { orderId } = await params;
    const body: ManualTrackingRequestBody = await request.json();
    const { courier, service, shippedAt, note } = body;

    // 1. Validate tracking number: strip spaces, uppercase, reject empty
    const rawResi = body.trackingNumber || "";
    const cleanedResi = rawResi.trim().replace(/\s+/g, "").toUpperCase();

    if (!cleanedResi) {
      return NextResponse.json(
        { error: "Nomor resi wajib diisi dan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Check UPU standard (2 letters + 9 digits + ID)
    const isUpuStandard = /^[A-Z]{2}\d{9}ID$/.test(cleanedResi);

    // 2. Fetch existing order
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        email: true,
        country: true,
        paymentStatus: true,
        orderStatus: true,
        courier: true,
        trackingNumber: true,
        manualCourier: true,
        manualService: true,
        manualShippedAt: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    if (existingOrder.paymentStatus !== "paid") {
      return NextResponse.json(
        { error: "Hanya pesanan yang sudah dibayar (PAID) yang dapat diinput nomor resinya." },
        { status: 400 }
      );
    }

    const isUpdate = Boolean(existingOrder.trackingNumber);
    const finalCourier = courier ? courier.trim() : "POS Indonesia";
    const finalService = service ? service.trim() : "EMS";
    const finalShippedAt = shippedAt ? new Date(shippedAt) : new Date();

    // 3. Atomically update order status and manual shipping fields
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber: cleanedResi,
        manualCourier: finalCourier,
        manualService: finalService,
        manualShippedAt: finalShippedAt,
        manualTrackingNote: note ? note.trim() : null,
        orderStatus: "shipped",
        shippingOrderStatus: "SHIPPED",
        biteshipStatus: "shipped",
      },
    });

    // 4. Record audit log in ShippingLog
    await prisma.shippingLog.create({
      data: {
        orderId,
        event: isUpdate ? "MANUAL_TRACKING_UPDATED" : "MANUAL_TRACKING_CREATED",
        previousValue: JSON.stringify({
          trackingNumber: existingOrder.trackingNumber,
          courier: existingOrder.manualCourier || existingOrder.courier,
          service: existingOrder.manualService,
          shippedAt: existingOrder.manualShippedAt,
          orderStatus: existingOrder.orderStatus,
        }),
        newValue: JSON.stringify({
          trackingNumber: cleanedResi,
          courier: finalCourier,
          service: finalService,
          shippedAt: finalShippedAt,
          orderStatus: "shipped",
        }),
        note: note ? note.trim() : `Resi manual ${isUpdate ? "diperbarui" : "diinput"} oleh admin: ${cleanedResi} (${finalCourier} - ${finalService})`,
      },
    });

    // 5. Send notification email to customer
    if (existingOrder.email) {
      await sendManualShippingEmail({
        orderId: existingOrder.id,
        orderNumber: existingOrder.orderNumber,
        customerName: existingOrder.customerName,
        customerEmail: existingOrder.email,
        courier: finalCourier,
        service: finalService,
        trackingNumber: cleanedResi,
        shippedAt: finalShippedAt,
        note: note ? note.trim() : null,
      });
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
    revalidatePath(`/order-confirmation/${existingOrder.id}`);
    revalidatePath(`/order-confirmation/${existingOrder.orderNumber}`);

    return NextResponse.json({
      success: true,
      message: isUpdate
        ? `Resi ${cleanedResi} berhasil diperbarui.`
        : `Resi ${cleanedResi} berhasil disimpan & pesanan ditandai dikirim.`,
      isUpuStandard,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("[ManualTracking] Error:", error);
    return NextResponse.json(
      { error: `Gagal menyimpan resi: ${error instanceof Error ? error.message : "Terjadi kesalahan internal"}` },
      { status: 500 }
    );
  }
}
