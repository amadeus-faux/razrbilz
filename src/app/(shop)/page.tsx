import ProductGrid from "@/components/product/ProductGrid";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { cache } from "react";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "RAZRBILZ",
  description:
    "Find Your North.",
};

const getProducts = cache(async () => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
      },
    });
    return products;
  } catch {
    return [];
  }
});

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="container-shop flex-1 flex flex-col justify-center w-full !pb-0">
      <div className="my-auto w-full py-10 md:py-16">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
