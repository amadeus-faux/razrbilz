import ProductDetailClient from "./ProductDetailClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import { cookies } from "next/headers";
import { getActiveExchangeRate } from "@/lib/exchange-rate";
import { resolveDisplayPrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const cookieStore = await cookies();
  const userCountry = cookieStore.get("user_country")?.value || "ID";

  const [allProducts, exchangeRate] = await Promise.all([
    getAllActiveProducts(),
    getActiveExchangeRate(),
  ]);

  const currentProduct = allProducts.find((p) => p.slug === slug);

  if (!currentProduct) {
    notFound();
  }

  const initialIndex = allProducts.findIndex((p) => p.slug === slug);

  // Serialize product list for the client orchestrator with localized prices
  const serializedProducts = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: resolveDisplayPrice(p.price, userCountry, exchangeRate),
    basePrice: p.price,
    stock: p.stock,
    images: p.images,
    sizes: p.sizes.map((s) => ({
      size: s.size,
    })),
  }));

  return (
    <ProductDetailClient
      products={serializedProducts}
      initialIndex={initialIndex >= 0 ? initialIndex : 0}
    />
  );
}
