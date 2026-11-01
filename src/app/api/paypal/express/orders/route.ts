import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import {
  resolveDisplayPrice,
  isInternational,
  normalizeCountryCode,
} from "@/lib/pricing";
import { getActiveExchangeRate } from "@/lib/exchange-rate";
import { MAX_QTY_PER_PRODUCT, firstProductOverLimit } from "@/lib/order-limits";
import { reportHandledError } from "@/lib/sentry";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { resolveLocale } from "@/lib/checkout-i18n";
import {
  getInternationalShippingCost,
  INTERNATIONAL_COURIER,
} from "@/lib/shipping-cost";
import { createPayPalOrder, idrToUsd, toPayPalLocale } from "@/lib/paypal";
import { withProbe, type Probe } from "@/lib/perf-probe";

interface ExpressItem {
  productId: string;
  size: string;
  quantity: number;
}

class ExpressRouteError extends Error {
  constructor(
    readonly code: string,
    readonly errorParams?: Record<string, string | number>,
    readonly status = 400
  ) {
    super(code);
    this.name = "ExpressRouteError";
  }
}

const EXPIRY_MINUTES = 60;
const RATE_DRIFT_TOLERANCE = 0.02;

/**
 * Express Checkout hanya untuk pembeli internasional. Ongkir memakai tarif flat
 * internasional, jadi alamat tidak perlu diketahui saat order dibuat; alamat
 * diambil dari akun PayPal buyer setelah approval (lihat /express/capture).
 */
async function handlePOST(request: NextRequest, probe: Probe) {
  let createdOrderId: string | null = null;
  const productQuantities = new Map<string, number>();

  try {
    const limit = checkRateLimit(`paypal-express-order:${clientIp(request)}`, {
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
    const { items, country, exchangeRateUsed } = body as {
      items: ExpressItem[];
      country?: string;
      exchangeRateUsed?: number;
    };

    if (!Array.isArray(items) || items.length === 0) {
      throw new ExpressRouteError("CART_EMPTY");
    }

    for (const item of items) {
      const q = item?.quantity;
      if (typeof q !== "number" || !Number.isInteger(q) || q < 1 || q > 100) {
        throw new ExpressRouteError("INVALID_QTY");
      }
      if (!item?.productId || typeof item.size !== "string" || !item.size) {
        throw new ExpressRouteError("INVALID_PRODUCT");
      }
    }

    if (firstProductOverLimit(items)) {
      throw new ExpressRouteError("QTY_LIMIT", { max: MAX_QTY_PER_PRODUCT });
    }

    for (const item of items) {
      productQuantities.set(
        item.productId,
        (productQuantities.get(item.productId) || 0) + item.quantity
      );
    }

    const cookieCountry = request.cookies.get("user_country")?.value;
    const headerCountry =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry");
    const orderCountry = normalizeCountryCode(
      country || cookieCountry || headerCountry,
      ""
    );
    if (!orderCountry || !isInternational(orderCountry)) {
      throw new ExpressRouteError("EXPRESS_UNAVAILABLE");
    }

    const activeRate = await probe.time("fx", () => getActiveExchangeRate(probe));

    const clientRate = Number(exchangeRateUsed);
    if (Number.isFinite(clientRate) && clientRate > 0 && activeRate > 0) {
      const drift = Math.abs(clientRate - activeRate) / activeRate;
      if (drift > RATE_DRIFT_TOLERANCE) {
        throw new ExpressRouteError("RATE_CHANGED", undefined, 409);
      }
    }

    const serverShippingCost = getInternationalShippingCost(orderCountry);
    const orderNumber = generateOrderNumber();

    const created = await probe.time("db_tx", () =>
      prisma.$transaction(async (tx) => {
        const productMap = new Map<
          string,
          {
            id: string;
            name: string;
            price: number;
            stock: number;
            isPreOrder: boolean;
            images: string[];
          }
        >();

        for (const [productId, requiredQty] of productQuantities.entries()) {
          const product = await probe.time("db_tx_lookup", () =>
            tx.product.findUnique({
              where: { id: productId },
              select: {
                id: true,
                name: true,
                price: true,
                stock: true,
                isActive: true,
                isPreOrder: true,
                images: true,
              },
            })
          );
          if (!product || !product.isActive) {
            throw new ExpressRouteError("INVALID_PRODUCT");
          }
          if (product.stock < requiredQty) {
            throw new ExpressRouteError("OUT_OF_STOCK", { name: product.name });
          }
          const updateResult = await probe.time("db_tx_update", () =>
            tx.product.updateMany({
              where: { id: productId, stock: { gte: requiredQty }, isActive: true },
              data: { stock: { decrement: requiredQty } },
            })
          );
          if (updateResult.count === 0) {
            throw new ExpressRouteError("OUT_OF_STOCK", { name: product.name });
          }
          productMap.set(productId, product);
        }

        const resolvedItems = items.map((item) => {
          const prod = productMap.get(item.productId);
          if (!prod) {
            throw new ExpressRouteError("INVALID_PRODUCT");
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
        const orderIsPreOrder = Array.from(productMap.values()).some(
          (p) => p.isPreOrder
        );
        const expiredAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);
        const usdAmount = idrToUsd(computedTotal, activeRate);

        const order = await probe.time("db_tx_create", () =>
          tx.order.create({
            data: {
              orderNumber,
              // Identitas & alamat diisi dari PayPal saat capture. Order tidak
              // pernah menjadi paid sebelum langkah itu berhasil.
              customerName: "PayPal buyer",
              email: "",
              phone: "",
              country: orderCountry,
              priceRegion: orderCountry,
              exchangeRate: activeRate,
              province: "",
              stateProvince: null,
              city: "",
              district: "",
              shippingAddress: "",
              apartment: null,
              postalCode: "",
              courier: `${INTERNATIONAL_COURIER.courier_name} - ${INTERNATIONAL_COURIER.courier_service_name}`,
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
          })
        );

        return { order, usdAmount };
      })
    );

    createdOrderId = created.order.id;
    const finalOrderId = created.order.id;

    let paypalOrderId = "";
    try {
      const pp = await probe.time("paypal_create", () =>
        createPayPalOrder({
          amountUsd: created.usdAmount,
          currency: "USD",
          orderNumber,
          locale: toPayPalLocale(resolveLocale(orderCountry)),
          shippingPreference: "GET_FROM_FILE",
        })
      );
      paypalOrderId = pp.id;
    } catch (paypalError) {
      await compensate(createdOrderId, productQuantities, orderNumber);
      reportHandledError("paypal-express-create", paypalError, { orderNumber });
      throw new ExpressRouteError("ORDER_CREATE_FAILED", undefined, 502);
    }

    await probe.time("db_order_update", () =>
      prisma.order.update({
        where: { id: finalOrderId },
        data: { paypalOrderId },
      })
    );

    return NextResponse.json({
      id: paypalOrderId,
      orderNumber,
      amount: created.usdAmount,
      currency: "USD",
    });
  } catch (error) {
    if (error instanceof ExpressRouteError) {
      return NextResponse.json(
        { code: error.code, errorParams: error.errorParams ?? null },
        { status: error.status }
      );
    }
    console.error("[PayPal Express] create order error:", error);
    if (createdOrderId) {
      await compensate(createdOrderId, productQuantities, "unknown");
    }
    reportHandledError("paypal-express-create-unexpected", error);
    return NextResponse.json({ code: "ORDER_CREATE_FAILED" }, { status: 500 });
  }
}

export const POST = withProbe(handlePOST);

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
        `[PayPal Express] KOMPENSASI GAGAL: stok produk ${productId} (qty ${qty}) order ${orderNumber} tidak kembali — perlu rekonsiliasi manual.`,
        revertErr
      );
      reportHandledError("paypal-express-compensation-stock", revertErr, {
        orderNumber,
        orderId,
      });
    }
  }
  try {
    await prisma.order.delete({ where: { id: orderId } });
  } catch (deleteErr) {
    console.error(
      `[PayPal Express] KOMPENSASI GAGAL: order ${orderNumber} (${orderId}) tidak terhapus — perlu rekonsiliasi manual.`,
      deleteErr
    );
    reportHandledError("paypal-express-compensation-delete", deleteErr, {
      orderNumber,
      orderId,
    });
  }
}
