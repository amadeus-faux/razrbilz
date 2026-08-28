import ProductDetailClient from "./ProductDetailClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageParams {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { sizes: true },
    });
    if (product && product.isActive) return product;
  } catch (error) {
    console.error("Error fetching product:", error);
  }
  return null;
}

async function getAllActiveProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        slug: true,
        name: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching active products:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found | RAZRBILZ" };
  }

  return {
    title: `${product.name} | RAZRBILZ`,
    description: product.description,
    openGraph: {
      title: `${product.name} | RAZRBILZ`,
      description: product.description,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProduct(slug),
    getAllActiveProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const currentIndex = allProducts.findIndex((p) => p.slug === slug);

  return (
    <ProductDetailClient
      key={product.id}
      product={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        images: product.images,
      }}
      sizes={product.sizes.map((s) => ({
        size: s.size,
        stock: s.stock,
      }))}
      allProducts={allProducts}
      currentIndex={currentIndex >= 0 ? currentIndex : 0}
    />
  );
}
