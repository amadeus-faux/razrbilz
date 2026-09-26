import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { PageTransitionProvider } from "@/context/PageTransitionContext";
import PageTransitionOverlay from "@/components/animations/PageTransitionOverlay";
import { siteOrigin } from "@/lib/site-url";
import { BRAND_OG_IMAGE, OG_DEFAULTS } from "@/lib/seo";

// ── Tanker — single-weight display font (400/Regular only) ────────────────────
const tanker = localFont({
  src: [
    {
      path: "./fonts/Tanker-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Tanker-Regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-tanker-var",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  // Tanpa metadataBase, semua URL relatif (OG image, canonical, sitemap) jadi
  // rusak saat link dibagikan ke WhatsApp/Instagram.
  metadataBase: new URL(siteOrigin()),
  title: {
    default: "RAZRBILZ",
    template: "%s — RAZRBILZ",
  },
  description:
    "RAZRBILZ is a streetwear label from Bandung, Indonesia.",
  keywords: [
    "RAZRBILZ",
    "streetwear",
    "clothing",
    "Bandung streetwear",
    "streetwear Indonesia",
  ],
  // Ikon diambil dari konvensi file App Router (icon.png, apple-icon.png,
  // favicon.ico di folder ini) — tidak perlu blok `icons` lagi.
  //
  // Sengaja tidak ada `og:title` / `og:description` di sini: Next.js mengambil
  // judul & deskripsi halaman yang sedang aktif, sedangkan memaksa nilainya di
  // root membuat semua halaman membagi satu preview yang sama.
  //
  // Tidak ada `alternates.canonical` juga — canonical tiap halaman dibangun oleh
  // `pageMeta` (src/lib/seo.ts). Blok di bawah ini hanya jadi fallback untuk
  // halaman yang tidak punya metadata sendiri, dan `pageMeta` tetap menyetel
  // og:url karena Next tidak menurunkannya dari canonical.
  openGraph: { ...OG_DEFAULTS, images: [BRAND_OG_IMAGE] },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased ${tanker.variable}`}>
      <body className="min-h-full flex flex-col">
        <PageTransitionProvider>
          {children}
          <PageTransitionOverlay />
        </PageTransitionProvider>
        {/* mode default "auto": hanya mengirim event di build produksi */}
        <Analytics />
      </body>
    </html>
  );
}
