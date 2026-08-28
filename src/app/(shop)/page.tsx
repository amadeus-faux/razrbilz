import ProductGrid from "@/components/product/ProductGrid";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

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
        images: true,
      },
    });
    return products;
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="container-shop pt-8 md:pt-16">
      <ProductGrid products={products} />
    </div>
  );
}
