import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSnapTransaction } from "@/lib/midtrans";
import { generateOrderNumber } from "@/lib/utils";

interface CheckoutItem {
  productId: string;
  size: string;
  quantity: number;
  priceAtBuy: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      email,
      phone,
      country,
      province,
      address,
      district,
      city,
      postalCode,
      courier,
      shippingCost,
      items,
    } = body as {
      customerName: string;
      email: string;
      phone: string;
      country?: string;
      province?: string;
      address: string;
      district?: string;
      city: string;
      postalCode: string;
      courier: string;
      shippingCost: number;
      items: CheckoutItem[];
    };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Keranjang belanja kosong" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();
    const subtotal = items.reduce(
      (sum, item) => sum + item.priceAtBuy * item.quantity,
      0
    );
    const total = subtotal + (shippingCost || 0);

    let orderId = orderNumber;
    let snapToken: string | null = null;

    // 1. Validate stock and create order in Database
    for (const item of items) {
      const productSize = await prisma.productSize.findUnique({
        where: {
          productId_size: {
            productId: item.productId,
            size: item.size,
          },
        },
      });

      if (productSize && productSize.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stok untuk ukuran ${item.size} tidak mencukupi (sisa: ${productSize.stock})`,
          },
          { status: 400 }
        );
      }
    }

    console.log(`[Checkout] Creating order ${orderNumber} in database...`);
    const createdOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        email,
        phone,
        country: country || "ID",
        province: province || "",
        shippingAddress: address,
        district: district || "",
        city: city || "",
        postalCode: postalCode || "",
        courier,
        shippingCost,
        subtotal,
        total,
        paymentStatus: "pending",
        orderStatus: "processing",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
            priceAtBuy: item.priceAtBuy,
          })),
        },
      },
    });

    orderId = createdOrder.id;
    console.log(`[Checkout] Order ${orderNumber} (ID: ${orderId}) created successfully in Supabase.`);

    // 2. Request Midtrans Snap Token if configured
    if (process.env.MIDTRANS_SERVER_KEY) {
      try {
        const midtransItems = items.map((item) => ({
          id: `${item.productId}-${item.size}`.slice(0, 50),
          name: `Product (${item.size})`.slice(0, 50),
          price: item.priceAtBuy,
          quantity: item.quantity,
        }));

        if (shippingCost > 0) {
          midtransItems.push({
            id: "SHIPPING",
            name: `Ongkir (${courier})`.slice(0, 50),
            price: shippingCost,
            quantity: 1,
          });
        }

        const transaction = await createSnapTransaction({
          orderId: orderNumber,
          grossAmount: total,
          customerName,
          customerEmail: email,
          customerPhone: phone,
          items: midtransItems,
        });

        snapToken = transaction.token;

        // Save snapToken & midtransOrderId to order in Supabase
        await prisma.order.update({
          where: { orderNumber },
          data: { snapToken, midtransOrderId: orderNumber },
        });
        console.log(`[Checkout] Snap token generated and attached to order ${orderNumber}`);
      } catch (midtransErr) {
        console.error(`[Checkout] ❌ Midtrans Snap error for order ${orderNumber}:`, midtransErr);
        throw new Error("Gagal menghubungkan dengan payment gateway Midtrans");
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      snapToken,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal memproses pesanan",
      },
      { status: 500 }
    );
  }
}
