import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDuitkuTransaction } from "@/lib/duitku";
import { generateOrderNumber } from "@/lib/utils";
import { resolveDisplayPrice, isInternational } from "@/lib/pricing";
import { getActiveExchangeRate } from "@/lib/exchange-rate";

interface CheckoutItem {
  productId: string;
  size: string;
  quantity: number;
  priceAtBuy?: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      email,
      phone,
      country = "ID",
      province,
      address,
      apartment,
      district,
      city,
      stateProvince,
      postalCode,
      courier,
      shippingCost = 0,
      items,
      paymentMethod,
    } = body as {
      customerName: string;
      email: string;
      phone: string;
      country?: string;
      province?: string;
      address: string;
      apartment?: string;
      district?: string;
      city: string;
      stateProvince?: string;
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

    const orderCountry = (country || "ID").trim().toUpperCase();
    const activeRate = await getActiveExchangeRate();
    const orderNumber = generateOrderNumber();

    // 1. Calculate total quantities required per product (regardless of size)
    const productQuantities = new Map<string, number>();
    for (const item of items) {
      const curr = productQuantities.get(item.productId) || 0;
      productQuantities.set(item.productId, curr + item.quantity);
    }

    // 2. Atomically verify stock, calculate server prices, decrement stock, and create order
    console.log(`[Checkout] Processing order ${orderNumber} in atomic transaction for region ${orderCountry}...`);
    const { order, isPreOrder, validatedItems, serverTotal } = await prisma.$transaction(async (tx) => {
      const productMap = new Map<string, { id: string; name: string; price: number; stock: number; isPreOrder: boolean }>();

      // Verify and atomically decrement stock for each unique product
      for (const [productId, requiredQty] of productQuantities.entries()) {
        const product = await tx.product.findUnique({
          where: { id: productId },
          select: { id: true, name: true, price: true, stock: true, isActive: true, isPreOrder: true },
        });

        if (!product || !product.isActive) {
          throw new Error(`Produk tidak ditemukan atau sedang tidak aktif.`);
        }

        if (product.stock < requiredQty) {
          throw new Error(
            `Stok untuk "${product.name}" tidak mencukupi (tersedia: ${product.stock}, diminta: ${requiredQty}).`
          );
        }

        // Atomic update with stock >= requiredQty condition to prevent race conditions
        const updateResult = await tx.product.updateMany({
          where: {
            id: productId,
            stock: { gte: requiredQty },
            isActive: true,
          },
          data: {
            stock: { decrement: requiredQty },
          },
        });

        if (updateResult.count === 0) {
          throw new Error(
            `Stok produk "${product.name}" baru saja habis atau tidak mencukupi. Silakan coba kembali.`
          );
        }

        productMap.set(productId, product);
      }

      // Calculate authoritative server prices for each item
      const resolvedItems = items.map((item) => {
        const prod = productMap.get(item.productId);
        if (!prod) {
          throw new Error(`Produk ${item.productId} tidak valid`);
        }
        const unitPrice = resolveDisplayPrice(prod.price, orderCountry, activeRate);
        return {
          productId: item.productId,
          name: prod.name,
          size: item.size,
          quantity: item.quantity,
          priceAtBuy: unitPrice,
        };
      });

      const serverSubtotal = resolvedItems.reduce(
        (sum, item) => sum + item.priceAtBuy * item.quantity,
        0
      );
      const computedTotal = serverSubtotal + (shippingCost || 0);

      const orderIsPreOrder = Array.from(productMap.values()).some((p) => p.isPreOrder);

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          email,
          phone,
          country: orderCountry,
          priceRegion: orderCountry,
          exchangeRate: isInternational(orderCountry) ? activeRate : null,
          province: province || "",
          stateProvince: stateProvince || null,
          city,
          district: district || "",
          shippingAddress: address,
          apartment: apartment || null,
          postalCode,
          courier,
          shippingCost: shippingCost || 0,
          subtotal: serverSubtotal,
          total: computedTotal,
          paymentStatus: "pending",
          orderStatus: "order_received",
          isPreOrder: orderIsPreOrder,
          items: {
            create: resolvedItems.map((item) => ({
              productId: item.productId,
              size: item.size,
              quantity: item.quantity,
              priceAtBuy: item.priceAtBuy,
            })),
          },
        },
      });

      return {
        order: createdOrder,
        isPreOrder: orderIsPreOrder,
        validatedItems: resolvedItems,
        serverTotal: computedTotal,
      };
    });

    const orderId = order.id;
    console.log(`[Checkout] Order ${orderNumber} (ID: ${order.id}) created and stock decremented successfully.`);

    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL;
    if (!appUrl) {
      throw new Error("APP_URL atau NEXT_PUBLIC_BASE_URL wajib diisi untuk callback Duitku.");
    }

    const chosenMethod = paymentMethod || process.env.DUITKU_PAYMENT_METHOD || "VA";
    let transaction: Awaited<ReturnType<typeof createDuitkuTransaction>> | null = null;

    try {
      const duitkuItems = validatedItems.map((item) => ({
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
        paymentAmount: serverTotal,
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
      // Revert stock decrement if payment provider initialization fails
      for (const [productId, requiredQty] of productQuantities.entries()) {
        await prisma.product
          .update({
            where: { id: productId },
            data: { stock: { increment: requiredQty } },
          })
          .catch(() => null);
      }
      await prisma.order.delete({ where: { id: order.id } }).catch(() => null);
      throw new Error(
        duitkuError instanceof Error ? duitkuError.message : "Gagal menghubungkan ke Duitku."
      );
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
      amount: serverTotal,
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
