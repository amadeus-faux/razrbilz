import { prisma } from "@/lib/prisma";
import { createBiteshipOrder } from "@/lib/biteship";
import { checkDuitkuTransaction } from "@/lib/duitku";

interface MarkOrderPaidParams {
  orderId: string;
  reference?: string;
  fee?: string | number;
  paymentMethod?: string;
  statusMessage?: string;
}

/**
 * Marks an order as paid, decrements stock for each item, and creates a Biteship order.
 * Safe and idempotent: if order is already paid, does nothing.
 */
export async function markOrderPaid({
  orderId,
  reference,
  fee,
  paymentMethod,
  statusMessage,
}: MarkOrderPaidParams) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) return null;

  // Already marked as paid
  if (order.paymentStatus === "paid") {
    return order;
  }

  // 1. Update order status to paid
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "paid",
      orderStatus: "processing",
      duitkuReference: reference || order.duitkuReference,
      duitkuFee: fee !== undefined ? String(fee) : order.duitkuFee,
      duitkuPaymentMethod: paymentMethod || order.duitkuPaymentMethod,
      duitkuStatusMessage: statusMessage || order.duitkuStatusMessage,
    },
    include: { items: { include: { product: true } } },
  });

  // 2. Decrement stock
  for (const item of order.items) {
    await prisma.productSize.updateMany({
      where: { productId: item.productId, size: item.size },
      data: { stock: { decrement: item.quantity } },
    });
  }

  // 3. Create Biteship shipment if not yet created
  if (!order.biteshipOrderId) {
    try {
      const shipping = await createBiteshipOrder({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.phone,
        customerEmail: order.email,
        destinationAddress: [order.shippingAddress, order.district, order.city, order.province]
          .filter(Boolean)
          .join(", "),
        destinationPostalCode: order.postalCode,
        destinationNote: "Pembayaran melalui Duitku V2",
        courier: order.courier,
        items: order.items.map((item) => ({
          name: `${item.product.name} (Size ${item.size})`,
          quantity: item.quantity,
          value: item.priceAtBuy,
          weight: 500,
        })),
      });

      await prisma.order.update({
        where: { id: order.id },
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
        where: { id: order.id },
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

    // Check directly with Duitku
    const result = await checkDuitkuTransaction(order.orderNumber).catch(() => null);
    if (!result) return order;

    if (result.statusCode === "00") {
      return await markOrderPaid({
        orderId: order.id,
        reference: result.reference,
        fee: result.fee,
        statusMessage: result.statusMessage,
      });
    } else if (result.statusCode === "02") {
      return await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "failed",
          orderStatus: "cancelled",
          duitkuStatusMessage: result.statusMessage,
        },
        include: { items: { include: { product: true } } },
      });
    }

    return order;
  } catch (error) {
    console.error("[OrderFulfillment] syncOrderPaymentStatus error:", error);
    return null;
  }
}
