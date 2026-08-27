import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySignature, snap } from "@/lib/midtrans";
import { createBiteshipOrder } from "@/lib/biteship";

/**
 * Midtrans Webhook Handler
 * Endpoint: POST /api/payments/midtrans-notification
 */
export async function POST(request: Request) {
  const timestamp = new Date().toISOString();
  console.log(`\n================== [MIDTRANS NOTIFICATION ${timestamp}] ==================`);

  try {
    const notification = await request.json();
    console.log("[Midtrans] Received payload:", JSON.stringify(notification, null, 2));

    const {
      order_id: orderNumber,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: receivedSignature,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
      payment_type: paymentType,
    } = notification;

    if (!orderNumber) {
      console.warn("[Midtrans] ❌ Webhook payload missing order_id");
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

    // 1. Signature Verification
    let isSignatureValid = false;
    if (serverKey && receivedSignature) {
      const expectedSignature = verifySignature(
        orderNumber,
        statusCode,
        grossAmount,
        serverKey
      );

      if (receivedSignature === expectedSignature) {
        isSignatureValid = true;
        console.log(`[Midtrans] ✅ Signature verified for order: ${orderNumber}`);
      } else {
        console.warn(
          `[Midtrans] ⚠️ Signature mismatch for order: ${orderNumber}.\n` +
          `Received: ${receivedSignature}\nExpected: ${expectedSignature}\n` +
          `Falling back to Midtrans API verification...`
        );
      }
    }

    // Fallback verification via Midtrans Status API if signature was not directly matched
    if (!isSignatureValid && serverKey) {
      try {
        const statusResponse = await snap.transaction.status(orderNumber);
        if (statusResponse && statusResponse.transaction_status === transactionStatus) {
          isSignatureValid = true;
          console.log(`[Midtrans] ✅ Verified directly via Midtrans Status API for order: ${orderNumber}`);
        }
      } catch (apiErr) {
        console.error(`[Midtrans] ❌ Midtrans Status API verification failed for ${orderNumber}:`, apiErr);
      }
    }

    if (serverKey && !isSignatureValid) {
      console.error(`[Midtrans] ❌ Signature verification completely failed for order: ${orderNumber}`);
      return NextResponse.json({ error: "Invalid signature key" }, { status: 400 });
    }

    // 2. Map Payment Status
    let paymentStatus = "pending";

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept" || !fraudStatus) {
        paymentStatus = "paid";
      } else if (fraudStatus === "challenge") {
        paymentStatus = "challenge";
      }
    } else if (transactionStatus === "settlement") {
      paymentStatus = "paid";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      paymentStatus = transactionStatus === "expire" ? "expired" : "failed";
    } else if (transactionStatus === "pending") {
      paymentStatus = "pending";
    } else if (transactionStatus === "refund") {
      paymentStatus = "refunded";
    }

    console.log(`[Midtrans] Transaction status: '${transactionStatus}', Fraud: '${fraudStatus}', Mapped Payment Status: '${paymentStatus}'`);

    // 3. Find Order in Database
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      console.error(`[Midtrans] ❌ Order not found in database: ${orderNumber}`);
      return NextResponse.json(
        { error: `Order ${orderNumber} not found in database` },
        { status: 404 }
      );
    }

    const previousPaymentStatus = order.paymentStatus;
    console.log(`[Midtrans] Order ${orderNumber} current paymentStatus: '${previousPaymentStatus}', updating to: '${paymentStatus}'`);

    // 4. Update Order Status in Supabase
    const updatedOrder = await prisma.order.update({
      where: { orderNumber },
      data: {
        paymentStatus,
        orderStatus: paymentStatus === "paid" ? "processing" : order.orderStatus,
        midtransOrderId: orderNumber,
      },
    });

    console.log(`[Midtrans] ✅ Supabase order ${orderNumber} updated successfully.`);

    let biteshipOrderIdCreated: string | null = order.biteshipOrderId || null;

    // 5. Stock Deduction & Biteship Order Creation on Payment Success
    if (paymentStatus === "paid" && previousPaymentStatus !== "paid") {
      // 5a. Deduct Stock
      console.log(`[Inventory] Deducting stock for order ${orderNumber}...`);
      for (const item of order.items) {
        try {
          const updateRes = await prisma.productSize.updateMany({
            where: {
              productId: item.productId,
              size: item.size,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
          console.log(`[Inventory] Deducted ${item.quantity} qty for product ${item.productId} (${item.size}) - affected: ${updateRes.count}`);
        } catch (stockErr) {
          console.error(`[Inventory] ❌ Error deducting stock for ${item.productId}:`, stockErr);
        }
      }

      // 5b. Create Biteship Shipping Order (if not already created)
      if (!order.biteshipOrderId) {
        console.log(`[Biteship] Triggering courier order creation for ${orderNumber}...`);
        try {
          const biteshipResult = await createBiteshipOrder({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerPhone: order.phone,
            customerEmail: order.email,
            destinationAddress: `${order.shippingAddress}, ${order.district || ""}, ${order.city}, ${order.province || ""}`.trim(),
            destinationPostalCode: order.postalCode,
            destinationNote: `Payment via Midtrans (${paymentType || "Online"})`,
            courier: order.courier,
            items: order.items.map((item) => ({
              name: `${item.product.name} (Size ${item.size})`,
              quantity: item.quantity,
              value: item.priceAtBuy,
              weight: 500, // Standard apparel weight in grams
            })),
          });

          if (biteshipResult.success && biteshipResult.orderId) {
            biteshipOrderIdCreated = biteshipResult.orderId;
            await prisma.order.update({
              where: { orderNumber },
              data: {
                shippingOrderStatus: "CREATED",
                shippingOrderError: null,
                biteshipOrderId: biteshipResult.orderId,
                biteshipTrackingId: biteshipResult.trackingId || null,
                trackingNumber: biteshipResult.waybillId || biteshipResult.trackingId || null,
                orderStatus: "processing",
              },
            });
            console.log(`[Biteship] ✅ Order ${orderNumber} linked with Biteship ID: ${biteshipResult.orderId}, Waybill/Tracking: ${biteshipResult.waybillId || biteshipResult.trackingId}`);
          } else {
            const errorMsg = biteshipResult.error || "Gagal membuat order di Biteship";
            console.error(`[Biteship] ❌ Biteship order creation failed for ${orderNumber}: ${errorMsg}`, biteshipResult.raw);
            await prisma.order.update({
              where: { orderNumber },
              data: {
                shippingOrderStatus: "FAILED",
                shippingOrderError: errorMsg,
                shippingRetryCount: { increment: 1 },
              },
            });
          }
        } catch (biteshipErr) {
          const errorMsg = biteshipErr instanceof Error ? biteshipErr.message : "Exception creating Biteship order";
          console.error(`[Biteship] ❌ Exception creating Biteship order for ${orderNumber}:`, biteshipErr);
          await prisma.order.update({
            where: { orderNumber },
            data: {
              shippingOrderStatus: "FAILED",
              shippingOrderError: errorMsg,
              shippingRetryCount: { increment: 1 },
            },
          });
        }
      } else {
        console.log(`[Biteship] Order ${orderNumber} already has Biteship Order ID: ${order.biteshipOrderId}`);
      }
    }


    console.log(`================== [MIDTRANS NOTIFICATION COMPLETED] ==================\n`);

    return NextResponse.json({
      status: "OK",
      order_id: orderNumber,
      payment_status: paymentStatus,
      biteship_order_id: biteshipOrderIdCreated || updatedOrder.biteshipOrderId || null,
    });
  } catch (error) {
    console.error("[Midtrans] ❌ Fatal error in notification handler:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}

