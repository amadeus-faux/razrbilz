import { prisma } from "@/lib/prisma";
import { siteOrigin } from "@/lib/site-url";
import type { MetadataRoute } from "next";

/**
 * Sitemap dibaca crawler beberapa kali sehari, bukan tiap request; katalog
 * berubah lewat admin, jadi regenerasi per jam sudah cukup dan tidak membebani
 * pooler Supabase.
 */
export const revalidate = 3600;

/** Halaman yang boleh diindeks. /cart, /checkout, /payment, /admin tidak masuk. */
const STATIC: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/size-guide", changeFrequency: "monthly", priority: 0.7 },
  { path: "/refund-policy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/policy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy-policy", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();

  const products = await prisma.product
    .findMany({
      where: { isActive: true },
      select: { slug: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    })
    .catch((error: unknown) => {
      // Katalog hilang diam-diam dari sitemap tidak boleh tidak terdeteksi.
      console.error("sitemap: gagal membaca produk aktif:", error);
      return [];
    });

  return [
    ...STATIC.map((s) => ({
      url: `${origin}${s.path}`,
      changeFrequency: s.changeFrequency,
      priority: s.priority,
    })),
    ...products.map((p) => ({
      url: `${origin}/product/${p.slug}`,
      // Product tidak punya kolom updatedAt — createdAt satu-satunya tanggal
      // yang jujur di sini.
      lastModified: p.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
