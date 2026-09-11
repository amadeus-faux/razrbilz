import ProductGrid from "@/components/product/ProductGrid";
import { prisma } from "@/lib/prisma";
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
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching homepage products:", error);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <section className="container-shop min-h-[100dvh] flex flex-col justify-center items-center w-full !pb-0 py-12 md:py-16" id="products-section">
      <div className="w-full my-auto">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
