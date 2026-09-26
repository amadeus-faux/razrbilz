import ProductGrid from "@/components/product/ProductGrid";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getActiveExchangeRate } from "@/lib/exchange-rate";
import { resolveDisplayPrice, normalizeCountryCode } from "@/lib/pricing";
import { pageMeta } from "@/lib/seo";
import { getHomeMetaDescription } from "@/lib/site-settings";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Judul tetap warisi default root layout (menyetel title di sini akan menghasilkan
// "RAZRBILZ — RAZRBILZ" karena template judul). Deskripsi diambil dari database
// supaya bisa diubah dari dashboard; route ini force-dynamic, jadi reload
// homepage selalu menampilkan nilai terbaru.
export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({ path: "/", description: await getHomeMetaDescription() });
}

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
        stock: true,
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching homepage products:", error);
    return [];
  }
}

export default async function ShopPage() {
  const cookieStore = await cookies();
  const userCountry = normalizeCountryCode(cookieStore.get("user_country")?.value);

  const [products, exchangeRate] = await Promise.all([
    getProducts(),
    getActiveExchangeRate(),
  ]);

  const localizedProducts = products.map((p) => ({
    ...p,
    price: resolveDisplayPrice(p.price, userCountry, exchangeRate),
  }));

  return (
    // padding-bottom menggeser item yang di-center flex sebesar pb/2: 200px
    // menaikkan grid 100px supaya pusat gambar sejajar stage Product Detail,
    // 96px (naik 48px) untuk mobile sekaligus jadi clearance BottomNav.
    <section
      className="container-shop min-h-[100dvh] flex flex-col justify-center items-center w-full !pb-24 py-12 md:py-16 md:landscape:!pb-[200px]"
      id="products-section"
    >
      <div className="w-full my-auto">
        <ProductGrid products={localizedProducts} />
      </div>
    </section>
  );
}
