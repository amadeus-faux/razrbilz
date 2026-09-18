import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDuitkuTransaction } from "@/lib/duitku";
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
      paymentMethod,
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
      paymentMethod?: string;
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

    // 1. Verify stock availability before proceeding
    for (const item of items) {
      const sizeRecord = await prisma.productSize.findUnique({
        where: {
          productId_size: {
            productId: item.productId,
            size: item.size,
          },
        },
      });

      if (!sizeRecord || sizeRecord.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stok untuk ukuran ${item.size} tidak mencukupi (tersedia: ${
              sizeRecord?.stock || 0
            })`,
          },
          { status: 400 }
        );
      }
    }

    // Check if any item in cart is pre-order
    const productIds = Array.from(new Set(items.map((i) => i.productId)));
    const productsInOrder = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, isPreOrder: true },
    });
    const isPreOrder = productsInOrder.some((p) => p.isPreOrder) || productsInOrder.length === 0;

    console.log(`[Checkout] Creating order ${orderNumber} in database (Pre-Order: ${isPreOrder})...`);
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        email,
        phone,
        country: country || "ID",
        province: province || "",
        city,
        district: district || "",
        shippingAddress: address,
        postalCode,
        courier,
        shippingCost: shippingCost || 0,
        subtotal,
        total,
        paymentStatus: "pending",
        orderStatus: "order_received",
        isPreOrder,
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

    orderId = order.id;
    console.log(`[Checkout] Order ${orderNumber} (ID: ${order.id}) created successfully in Supabase.`);

    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL;
    if (!appUrl) {
      throw new Error("APP_URL atau NEXT_PUBLIC_BASE_URL wajib diisi untuk callback Duitku.");
    }

    const chosenMethod = paymentMethod || process.env.DUITKU_PAYMENT_METHOD || "VA";
    let transaction: Awaited<ReturnType<typeof createDuitkuTransaction>> | null = null;

    try {
      const duitkuItems = items.map((item) => ({
        name: `Produk RAZRBILZ (${item.size})`,
        price: item.priceAtBuy,
        quantity: item.quantity,
      }));

      if (shippingCost > 0) {
        duitkuItems.push({
          name: `Ongkir ${courier}`.slice(0, 255),
          price: shippingCost,
          quantity: 1,
        });
      }

      transaction = await createDuitkuTransaction({
        merchantOrderId: orderNumber,
        paymentAmount: total,
        paymentMethod: chosenMethod,
        productDetails: `Pembayaran pesanan RAZRBILZ ${orderNumber}`,
        customerName,
        email,
        phoneNumber: phone,
        address,
        city,
        postalCode,
        countryCode: country || "ID",
        items: duitkuItems,
        callbackUrl: `${appUrl}/api/payments/duitku/callback`,
        returnUrl: `${appUrl}/payment/instructions/${encodeURIComponent(orderNumber)}`,
      });

      await prisma.order.update({
        where: { orderNumber },
        data: {
          duitkuReference: transaction.reference,
          duitkuPaymentMethod: chosenMethod,
          duitkuPaymentUrl: transaction.paymentUrl || null,
          duitkuVaNumber: transaction.vaNumber || null,
          duitkuQrString: transaction.qrString || null,
          duitkuStatusMessage: transaction.statusMessage,
        },
      });
      console.log(`[Checkout] Duitku reference saved for order ${orderNumber}`);
    } catch (duitkuError) {
      console.error(`[Checkout] Duitku V2 error for ${orderNumber}:`, duitkuError);
      throw new Error(duitkuError instanceof Error ? duitkuError.message : "Gagal menghubungkan ke Duitku.");
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      paymentStatus: "pending",
      paymentInstructionsUrl: `/payment/instructions/${orderNumber}`,
      reference: transaction?.reference || null,
      paymentMethod: chosenMethod,
      paymentUrl: transaction?.paymentUrl || null,
      vaNumber: transaction?.vaNumber || null,
      qrString: transaction?.qrString || null,
      amount: total,
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
