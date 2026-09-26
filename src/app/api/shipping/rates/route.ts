import { NextResponse } from "next/server";
import { getServerShippingRates } from "@/lib/shipping-cost";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  headers: {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destinationPostalCode, items, couriers, country } = body;

    // 2.5: Berat & nama produk diambil dari DB (server-authoritative). Client
    // hanya mengirim productId + quantity; nilai weight dari client diabaikan
    // supaya ongkir tidak bisa dimanipulasi dengan memalsukan berat.
    const rawItems: Array<{ productId?: string; quantity?: number }> = Array.isArray(items)
      ? items
      : [];
    const productIds = rawItems
      .map((i) => i?.productId)
      .filter((id): id is string => typeof id === "string" && id.length > 0);
    const products = productIds.length
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true, weightGrams: true },
        })
      : [];
    const productById = new Map(products.map((p) => [p.id, p]));
    const serverItems = rawItems.map((i) => {
      const p = i?.productId ? productById.get(i.productId) : undefined;
      return {
        name: p?.name,
        quantity: Number(i?.quantity) || 0,
        weightGrams: p?.weightGrams,
      };
    });

    const result = await getServerShippingRates({
      country,
      destinationPostalCode,
      items: serverItems,
      couriers,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        rates: result.rates,
        isFallback: result.isFallback ?? false,
        fallbackReason: result.fallbackReason ?? null,
      },
      NO_STORE_HEADERS
    );
  } catch (error) {
    console.error("Shipping rates error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal menghitung tarif pengiriman",
      },
      { status: 500 }
    );
  }
}
