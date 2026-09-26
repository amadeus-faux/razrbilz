import { siteOrigin } from "@/lib/site-url";
import type { MetadataRoute } from "next";

/** Domain produksi. Preview/deploy lain harus terblokir supaya tidak indexed. */
const PRODUCTION_HOSTS = new Set(["razrbilz.id", "www.razrbilz.id"]);

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  const isProduction = PRODUCTION_HOSTS.has(new URL(origin).hostname);

  // Fallback aman: kalau APP_URL masih menunjuk ke vercel.app / staging,
  // larang semua — lebih baik tidak terindeks daripada duplikat konten.
  if (!isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/cart",
          "/checkout",
          "/order-confirmation",
          "/payment",
        ],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
  };
}
