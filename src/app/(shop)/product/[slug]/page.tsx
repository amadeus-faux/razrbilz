import ProductDetailClient from "./ProductDetailClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const mockProducts = [
  {
    id: "1",
    name: "EQUATOR TEE",
    slug: "equator-tee",
    description:
      "Premium heavyweight cotton tee with relaxed fit. Pre-shrunk fabric, ribbed crew neck. Made in Indonesia.",
    price: 350000,
    images: ["/products/equator-tee.svg"],
    category: "T-Shirts",
    sizes: [
      { id: "s1", size: "S", stock: 10 },
      { id: "s2", size: "M", stock: 15 },
      { id: "s3", size: "L", stock: 8 },
      { id: "s4", size: "XL", stock: 5 },
    ],
  }
];

interface PageParams {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { sizes: true },
    });
    if (product) return product;
  } catch {
  }

  return mockProducts.find((p) => p.slug === slug) || null;
}

async function getAllSlugs() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
      orderBy: { createdAt: "desc" },
    });
    if (products.length > 0) return products.map((p) => p.slug);
  } catch {
  }
  return mockProducts.map((p) => p.slug);
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found — RAZRBILZ" };
  }

  return {
    title: `${product.name} — RAZRBILZ`,
    description: product.description,
    openGraph: {
      title: `${product.name} — RAZRBILZ`,
      description: product.description,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const allSlugs = await getAllSlugs();
  const currentIndex = allSlugs.indexOf(slug);
  const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
  const nextSlug =
    currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;

  return (
    <ProductDetailClient
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
      prevSlug={prevSlug}
      nextSlug={nextSlug}
    />
  );
}
