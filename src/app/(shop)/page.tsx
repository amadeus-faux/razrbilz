import ProductGrid from "@/components/product/ProductGrid";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop — RAZRBILZ",
  description:
    "Browse the full RAZRBILZ collection. Unisex streetwear tees, hoodies, and pants.",
};

// Mock data for development (before database is connected)
const mockProducts = [
  {
    id: "1",
    name: "EQUATOR TEE",
    slug: "equator-tee",
    images: ["/products/equator-tee.svg"],
  },
  {
    id: "2",
    name: "VOID HOODIE",
    slug: "void-hoodie",
    images: ["/products/void-hoodie.svg"],
  },
  {
    id: "3",
    name: "DRIFT PANT",
    slug: "drift-pant",
    images: ["/products/drift-pant.svg"],
  },
  {
    id: "4",
    name: "SIGNAL TEE",
    slug: "signal-tee",
    images: ["/products/signal-tee.svg"],
  },
  {
    id: "5",
    name: "STATIC HOODIE",
    slug: "static-hoodie",
    images: ["/products/static-hoodie.svg"],
  },
  {
    id: "6",
    name: "ORBIT PANT",
    slug: "orbit-pant",
    images: ["/products/orbit-pant.svg"],
  },
  {
    id: "7",
    name: "APEX TEE",
    slug: "apex-tee",
    images: ["/products/apex-tee.svg"],
  },
  {
    id: "8",
    name: "ZERO HOODIE",
    slug: "zero-hoodie",
    images: ["/products/zero-hoodie.svg"],
  },
];

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
    return products.length > 0 ? products : mockProducts;
  } catch {
    // Database not connected yet, use mock data
    return mockProducts;
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
