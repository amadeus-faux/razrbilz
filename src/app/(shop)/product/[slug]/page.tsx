import ProductDetailClient from "./ProductDetailClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Mock data for development
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
  },
  {
    id: "2",
    name: "VOID HOODIE",
    slug: "void-hoodie",
    description:
      "Oversized pullover hoodie in brushed fleece. Kangaroo pocket, dropped shoulders. 400gsm cotton.",
    price: 750000,
    images: ["/products/void-hoodie.svg"],
    category: "Hoodies",
    sizes: [
      { id: "s5", size: "S", stock: 5 },
      { id: "s6", size: "M", stock: 12 },
      { id: "s7", size: "L", stock: 10 },
      { id: "s8", size: "XL", stock: 3 },
    ],
  },
  {
    id: "3",
    name: "DRIFT PANT",
    slug: "drift-pant",
    description:
      "Wide-leg cargo pants with elastic waistband and drawcord. Ripstop nylon blend, multiple pockets.",
    price: 550000,
    images: ["/products/drift-pant.svg"],
    category: "Pants",
    sizes: [
      { id: "s9", size: "S", stock: 7 },
      { id: "s10", size: "M", stock: 0 },
      { id: "s11", size: "L", stock: 9 },
      { id: "s12", size: "XL", stock: 6 },
    ],
  },
  {
    id: "4",
    name: "SIGNAL TEE",
    slug: "signal-tee",
    description:
      "Boxy fit tee with back print. 100% cotton, 220gsm. Enzyme washed for vintage feel.",
    price: 320000,
    images: ["/products/signal-tee.svg"],
    category: "T-Shirts",
    sizes: [
      { id: "s13", size: "S", stock: 12 },
      { id: "s14", size: "M", stock: 20 },
      { id: "s15", size: "L", stock: 14 },
      { id: "s16", size: "XL", stock: 0 },
    ],
  },
  {
    id: "5",
    name: "STATIC HOODIE",
    slug: "static-hoodie",
    description:
      "Zip-up hoodie with tonal embroidery. Double-layered hood, heavy-weight fleece. YKK zipper.",
    price: 820000,
    images: ["/products/static-hoodie.svg"],
    category: "Hoodies",
    sizes: [
      { id: "s17", size: "S", stock: 4 },
      { id: "s18", size: "M", stock: 8 },
      { id: "s19", size: "L", stock: 6 },
      { id: "s20", size: "XL", stock: 2 },
    ],
  },
  {
    id: "6",
    name: "ORBIT PANT",
    slug: "orbit-pant",
    description:
      "Straight-leg sweatpants with side seam pockets. French terry, elastic cuffs. Relaxed fit.",
    price: 480000,
    images: ["/products/orbit-pant.svg"],
    category: "Pants",
    sizes: [
      { id: "s21", size: "S", stock: 9 },
      { id: "s22", size: "M", stock: 15 },
      { id: "s23", size: "L", stock: 11 },
      { id: "s24", size: "XL", stock: 7 },
    ],
  },
  {
    id: "7",
    name: "APEX TEE",
    slug: "apex-tee",
    description:
      "Slim-fit longline tee. Curved hem, reinforced shoulder seams. 180gsm organic cotton.",
    price: 280000,
    images: ["/products/apex-tee.svg"],
    category: "T-Shirts",
    sizes: [
      { id: "s25", size: "S", stock: 18 },
      { id: "s26", size: "M", stock: 25 },
      { id: "s27", size: "L", stock: 20 },
      { id: "s28", size: "XL", stock: 10 },
    ],
  },
  {
    id: "8",
    name: "ZERO HOODIE",
    slug: "zero-hoodie",
    description:
      "Minimal pullover hoodie with raw-edge details. Garment-dyed, 380gsm. Vintage washed.",
    price: 690000,
    images: ["/products/zero-hoodie.svg"],
    category: "Hoodies",
    sizes: [
      { id: "s29", size: "S", stock: 6 },
      { id: "s30", size: "M", stock: 10 },
      { id: "s31", size: "L", stock: 0 },
      { id: "s32", size: "XL", stock: 4 },
    ],
  },
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
    // DB not connected
  }

  // Fallback to mock data
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
    // DB not connected
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
