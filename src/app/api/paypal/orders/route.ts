import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { resolveDisplayPrice, isInternational } from "@/lib/pricing";
import { getActiveExchangeRate } from "@/lib/exchange-rate";
import { MAX_QTY_PER_PRODUCT, firstProductOverLimit } from "@/lib/order-limits";
import { reportHandledError } from "@/lib/sentry";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { resolveLocale } from "@/lib/checkout-i18n";
import {
  getServerShippingRates,
  getInternationalShippingCost,
  findMatchingRate,
  INTERNATIONAL_COURIER,
} from "@/lib/shipping-cost";
import { createPayPalOrder, idrToUsd, toPayPalLocale } from "@/lib/paypal";

interface PayPalCheckoutItem {
  productId: string;
  size: string;
  quantity: number;
}

/**
 * Error yang memang diharapkan (validasi/stok). `code` adalah kontrak publik yang
 * diterjemahkan client (lihat PAYPAL_ERROR_KEY di checkout-i18n); detail teknis
 * tidak pernah dikirim ke client.
 */
class PayPalRouteError extends Error {
  constructor(
    readonly code: string,
    readonly errorParams?: Record<string, string | number>,
    readonly status = 400
  ) {
    super(code);
    this.name = "PayPalRouteError";
  }
}

const EXPIRY_MINUTES = 60;
const RATE_DRIFT_TOLERANCE = 0.02;

export async function POST(request: Request) {
  let createdOrderId: string | null = null;
  const productQuantities = new Map<string, number>();

  try {
    const limit = checkRateLimit(`paypal-order:${clientIp(request)}`, {
      max: 10,
      windowMs: 10 * 60_000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        {
          code: "RATE_LIMITED",
          errorParams: { seconds: limit.retryAfterSec },
        },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
      );
    }

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
      courierCode,
      courierServiceCode,
      items,
      exchangeRateUsed,
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
      courierCode?: string;
      courierServiceCode?: string;
      items: PayPalCheckoutItem[];
      exchangeRateUsed?: number;
    };

    if (!Array.isArray(items) || items.length === 0) {
      throw new PayPalRouteError("CART_EMPTY");
    }

    for (const item of items) {
      const q = item?.quantity;
      if (typeof q !== "number" || !Number.isInteger(q) || q < 1 || q > 100) {
        throw new PayPalRouteError("INVALID_QTY");
      }
      if (!item?.productId) {
        throw new PayPalRouteError("INVALID_PRODUCT");
      }
    }

    if (firstProductOverLimit(items)) {
      throw new PayPalRouteError("QTY_LIMIT", { max: MAX_QTY_PER_PRODUCT });
    }

    for (const item of items) {
      productQuantities.set(
        item.productId,
        (productQuantities.get(item.productId) || 0) + item.quantity
      );
    }

    const orderCountry = (country || "ID").trim().toUpperCase();
    const activeRate = await getActiveExchangeRate();

    // Setiap order PayPal dikonversi ke USD, jadi kurs yang dilihat client harus
    // masih segar. Bila admin baru mengubah kurs, tolak dan minta refresh.
    const clientRate = Number(exchangeRateUsed);
    if (Number.isFinite(clientRate) && clientRate > 0 && activeRate > 0) {
      const drift = Math.abs(clientRate - activeRate) / activeRate;
      if (drift > RATE_DRIFT_TOLERANCE) {
        throw new PayPalRouteError("RATE_CHANGED", undefined, 409);
      }
    }

    // Ongkir selalu ditentukan server, tidak pernah dari body client.
    let serverShippingCost = 0;
    if (isInternational(orderCountry)) {
      if (courierCode && courierCode !== INTERNATIONAL_COURIER.courier_code) {
        throw new PayPalRouteError("INVALID_COURIER");
      }
      serverShippingCost = getInternationalShippingCost(orderCountry);
    } else {
      if (courierCode === INTERNATIONAL_COURIER.courier_code) {
        throw new PayPalRouteError("INVALID_COURIER");
      }
      const quoteProducts = await prisma.product.findMany({
        where: { id: { in: Array.from(productQuantities.keys()) } },
        select: {
          id: true,
          name: true,
          weightGrams: true,
          lengthCm: true,
          widthCm: true,
          heightCm: true,
        },
      });
      const quoteProductById = new Map(quoteProducts.map((p) => [p.id, p]));
      const quote = await getServerShippingRates({
        country: orderCountry,
        destinationPostalCode: postalCode,
        items: items.map((it) => {
          const p = quoteProductById.get(it.productId);
          return {
            name: p?.name,
            quantity: it.quantity,
            weightGrams: p?.weightGrams,
            lengthCm: p?.lengthCm,
            widthCm: p?.widthCm,
            heightCm: p?.heightCm,
          };
        }),
      });
      if (!quote.ok) {
        throw new PayPalRouteError("INVALID_COURIER");
      }
      const matched = findMatchingRate(
        quote.rates,
        courierCode || "",
        courierServiceCode || ""
      );
      if (!matched) {
        throw new PayPalRouteError("INVALID_COURIER");
      }
      serverShippingCost = matched.price;
    }

    const orderNumber = generateOrderNumber();

    // Verifikasi stok + harga server + decrement atomik, lalu buat order pending.
    const created = await prisma.$transaction(async (tx) => {
      const productMap = new Map<
        string,
        { id: string; name: string; price: number; stock: number; isPreOrder: boolean; images: string[] }
      >();

      for (const [productId, requiredQty] of productQuantities.entries()) {
        const product = await tx.product.findUnique({
          where: { id: productId },
          select: { id: true, name: true, price: true, stock: true, isActive: true, isPreOrder: true, images: true },
        });
        if (!product || !product.isActive) {
          throw new PayPalRouteError("INVALID_PRODUCT");
        }
        if (product.stock < requiredQty) {
          throw new PayPalRouteError("OUT_OF_STOCK", { name: product.name });
        }
        const updateResult = await tx.product.updateMany({
          where: { id: productId, stock: { gte: requiredQty }, isActive: true },
          data: { stock: { decrement: requiredQty } },
        });
        if (updateResult.count === 0) {
          throw new PayPalRouteError("OUT_OF_STOCK", { name: product.name });
        }
        productMap.set(productId, product);
      }

      const resolvedItems = items.map((item) => {
        const prod = productMap.get(item.productId);
        if (!prod) {
          throw new PayPalRouteError("INVALID_PRODUCT");
        }
        return {
          productId: item.productId,
          name: prod.name,
          image: prod.images?.[0] || null,
          size: item.size,
          quantity: item.quantity,
          priceAtBuy: resolveDisplayPrice(prod.price, orderCountry, activeRate),
        };
      });

      const serverSubtotal = resolvedItems.reduce(
        (sum, item) => sum + item.priceAtBuy * item.quantity,
        0
      );
      const computedTotal = serverSubtotal + serverShippingCost;
      const orderIsPreOrder = Array.from(productMap.values()).some((p) => p.isPreOrder);
      const expiredAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);
      const usdAmount = idrToUsd(computedTotal, activeRate);

      const order = await tx.order.create({
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
          shippingCost: serverShippingCost,
          subtotal: serverSubtotal,
          total: computedTotal,
          paymentStatus: "pending",
          orderStatus: "order_received",
          expiredAt,
          isPreOrder: orderIsPreOrder,
          paypalAmountUsd: usdAmount,
          paypalCurrency: "USD",
          paypalExchangeRate: activeRate,
          items: {
            create: resolvedItems.map((item) => ({
              productId: item.productId,
              size: item.size,
              quantity: item.quantity,
              priceAtBuy: item.priceAtBuy,
              productNameSnapshot: item.name,
              productImageSnapshot: item.image,
            })),
          },
        },
      });

      return { order, usdAmount };
    });

    createdOrderId = created.order.id;

    // Buat order di PayPal. Bila gagal, kompensasi (kembalikan stok + hapus order)
    // supaya tidak ada stok terkunci tanpa pembayaran.
    let approveUrl: string | null = null;
    let paypalOrderId = "";
    try {
      const pp = await createPayPalOrder({
        amountUsd: created.usdAmount,
        currency: "USD",
        orderNumber,
        locale: toPayPalLocale(resolveLocale(orderCountry)),
      });
      paypalOrderId = pp.id;
      approveUrl = pp.approveUrl;
    } catch (paypalError) {
      await compensate(createdOrderId, productQuantities, orderNumber);
      reportHandledError("paypal-create-order", paypalError, { orderNumber });
      throw new PayPalRouteError("ORDER_CREATE_FAILED", undefined, 502);
    }

    if (!approveUrl) {
      await compensate(createdOrderId, productQuantities, orderNumber);
      throw new PayPalRouteError("ORDER_CREATE_FAILED", undefined, 502);
    }

    await prisma.order.update({
      where: { id: createdOrderId },
      data: { paypalOrderId },
    });

    // Simpan bahasa checkout yang otoritatif (dari negara kirim) supaya halaman
    // /paypal/return menampilkan bahasa yang sama setelah pulang dari PayPal.
    const response = NextResponse.json({
      id: paypalOrderId,
      approveUrl,
      orderNumber,
      amount: created.usdAmount,
      currency: "USD",
    });
    response.cookies.set("rz_locale", resolveLocale(orderCountry), {
      path: "/",
      maxAge: 3600,
      sameSite: "lax",
    });
    return response;
  } catch (error) {
    if (error instanceof PayPalRouteError) {
      // Stok/order mungkin sudah terbuat sebelum error (mis. RATE_CHANGED tidak,
      // tapi OUT_OF_STOCK di transaction sudah di-rollback otomatis). Untuk error
      // pasca-transaction, kompensasi sudah dipanggil di titik gagalnya.
      return NextResponse.json(
        { code: error.code, errorParams: error.errorParams ?? null },
        { status: error.status }
      );
    }
    console.error("[PayPal] create order error:", error);
    if (createdOrderId) {
      await compensate(createdOrderId, productQuantities, "unknown");
    }
    reportHandledError("paypal-create-unexpected", error);
    return NextResponse.json({ code: "ORDER_CREATE_FAILED" }, { status: 500 });
  }
}

/** Kembalikan stok lalu hapus order pending. Kegagalan kompensasi di-log keras. */
async function compensate(
  orderId: string,
  productQuantities: Map<string, number>,
  orderNumber: string
): Promise<void> {
  for (const [productId, qty] of productQuantities.entries()) {
    try {
      await prisma.product.update({
        where: { id: productId },
        data: { stock: { increment: qty } },
      });
    } catch (revertErr) {
      console.error(
        `[PayPal] KOMPENSASI GAGAL: stok produk ${productId} (qty ${qty}) order ${orderNumber} tidak kembali — perlu rekonsiliasi manual.`,
        revertErr
      );
      reportHandledError("paypal-compensation-stock", revertErr, { orderNumber, orderId });
    }
  }
  try {
    await prisma.order.delete({ where: { id: orderId } });
  } catch (deleteErr) {
    console.error(
      `[PayPal] KOMPENSASI GAGAL: order ${orderNumber} (${orderId}) tidak terhapus — perlu rekonsiliasi manual.`,
      deleteErr
    );
    reportHandledError("paypal-compensation-delete", deleteErr, { orderNumber, orderId });
  }
}
