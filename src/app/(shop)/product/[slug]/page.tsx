import ProductDetailClient from "./ProductDetailClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getActiveExchangeRate } from "@/lib/exchange-rate";
import { resolveDisplayPrice, normalizeCountryCode } from "@/lib/pricing";
import { describe, pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageParams {
  params: Promise<{ slug: string }>;
}

async function getActiveProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      include: {
        sizes: true,
        sizeGuide: true,
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
  const path = `/product/${slug}`;

  // Query metadata yang gagal tidak boleh mengubah halaman jadi error
  // (pooler Supabase cuma 15 koneksi) — jatuh ke fallback brand.
  const product = await prisma.product
    .findUnique({
      where: { slug },
      select: {
        name: true,
        description: true,
        images: true,
        isActive: true,
      },
    })
    .catch(() => null);

  // Produk nonaktif akan memanggil notFound() di body halaman — judul/OG-nya
  // jangan bocor ke crawler.
  if (!product?.isActive) return pageMeta({ path });

  // Harga sengaja tidak masuk deskripsi: yang tampil di toko adalah harga hasil
  // `resolveDisplayPrice` (pembulatan + kurs), bukan `price` mentah dari DB.
  return pageMeta({
    path,
    title: product.name,
    description: describe(
      product.description ||
        "Made to order at our studio in Bandung — 14–21 days of production, shipped worldwide with tracking."
    ),
    // Dimensi foto produk tidak diketahui, jadi width/height dikosongkan;
    // tanpa `image` sekali pun, pageMeta memakai gambar brand.
    image: product.images[0]
      ? { url: product.images[0], alt: product.name }
      : undefined,
  });
}

export default async function ProductDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const cookieStore = await cookies();
  // Default to "ID" — ensure country is always treated as local unless explicitly international
  const rawCountry = cookieStore.get("user_country")?.value ?? "";
  const userCountry = normalizeCountryCode(rawCountry);

  const [allProducts, exchangeRate] = await Promise.all([
    getActiveProducts(),
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
    sizeGuide: p.sizeGuide
      ? {
          id: p.sizeGuide.id,
          name: p.sizeGuide.name,
          description: p.sizeGuide.description,
          measurements: (p.sizeGuide.measurements as {
            columns?: string[];
            rows?: Record<string, string>[];
          }) || null,
        }
      : null,
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
