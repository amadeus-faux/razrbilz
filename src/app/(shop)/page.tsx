import ProductGrid from "@/components/product/ProductGrid";
import { prisma } from "@/lib/prisma";
import { getActiveExchangeRate } from "@/lib/exchange-rate";
import { resolveDisplayPrice } from "@/lib/pricing";
import { pageMeta } from "@/lib/seo";
import { getHomeMetaDescription } from "@/lib/site-settings";
import type { Metadata } from "next";

// ISR 60 detik: halaman disajikan dari cache CDN tanpa cold start function.
// Edit produk lewat admin tetap instan karena route mutasi memanggil
// revalidatePath("/"); perubahan kurs disapu lewat revalidatePath("/", "layout").
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...pageMeta({ path: "/", description: await getHomeMetaDescription() }),
    // Google pernah menempelkan foto produk dari homepage sebagai thumbnail di
    // hasil pencarian. Direktif ini membatasi preview gambar yang diambil dari
    // halaman ini saja — halaman produk tetap bebas menampilkan gambarnya.
    robots: { "max-image-preview": "none" },
  };
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
  const [products, exchangeRate] = await Promise.all([
    getProducts(),
    getActiveExchangeRate(),
  ]);

  // Halaman ini di-cache (ISR), jadi cookie user_country tidak dibaca di
  // server. Harga SSR selalu harga lokal (ID); ProductGrid menukar angkanya
  // di client setelah mount bila cookie pengunjung berasal dari luar ID.
  const localizedProducts = products.map((p) => ({
    ...p,
    price: resolveDisplayPrice(p.price, "ID", exchangeRate),
    basePrice: p.price,
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
        <ProductGrid products={localizedProducts} exchangeRate={exchangeRate} />
      </div>
    </section>
  );
}
