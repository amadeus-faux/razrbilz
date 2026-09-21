import ProductGrid from "@/components/product/ProductGrid";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getActiveExchangeRate } from "@/lib/exchange-rate";
import { resolveDisplayPrice } from "@/lib/pricing";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "RAZRBILZ",
  description:
    "Find Your North.",
};

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        images: true,
        stock: true,
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching homepage products:", error);
    return [];
  }
}

export default async function ShopPage() {
  const cookieStore = await cookies();
  const userCountry = cookieStore.get("user_country")?.value || "ID";

  const [products, exchangeRate] = await Promise.all([
    getProducts(),
    getActiveExchangeRate(),
  ]);

  const localizedProducts = products.map((p) => ({
    ...p,
    price: resolveDisplayPrice(p.price, userCountry, exchangeRate),
  }));

  return (
    <section className="container-shop min-h-[100dvh] flex flex-col justify-center items-center w-full !pb-0 py-12 md:py-16" id="products-section">
      <div className="w-full my-auto">
        <ProductGrid products={localizedProducts} />
      </div>
    </section>
  );
}
