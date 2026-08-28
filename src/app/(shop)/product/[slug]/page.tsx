import ProductDetailClient from "./ProductDetailClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";

export const revalidate = 30;

interface PageParams {
  params: Promise<{ slug: string }>;
}

const getAllActiveProducts = cache(async () => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        sizes: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch (error) {
    console.error("Error fetching active products:", error);
    return [];
  }
});

export async function generateStaticParams() {
  const products = await getAllActiveProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const products = await getAllActiveProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return { title: "RAZRBILZ" };
  }

  return {
    title: `RAZRBILZ`,
    description: "Find Your North.",
    openGraph: {
      title: `RAZRBILZ`,
      description: "Find Your North.",
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const allProducts = await getAllActiveProducts();

  const currentProduct = allProducts.find((p) => p.slug === slug);

  if (!currentProduct) {
    notFound();
  }

  const initialIndex = allProducts.findIndex((p) => p.slug === slug);

  // Serialize product list for the client orchestrator
  const serializedProducts = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    images: p.images,
    sizes: p.sizes.map((s) => ({
      size: s.size,
      stock: s.stock,
    })),
  }));

  return (
    <ProductDetailClient
      products={serializedProducts}
      initialIndex={initialIndex >= 0 ? initialIndex : 0}
    />
  );
}
