import type { Metadata } from "next";

export type OgImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

/** Gambar OG cadangan: halaman tanpa gambar sendiri (dan produk tanpa foto). */
export const BRAND_OG_IMAGE: OgImage = {
  url: "/og/razrbilz-1200x630.png",
  width: 1200,
  height: 630,
  alt: "RAZRBILZ — unisex streetwear made to order in Bandung, Indonesia",
};

/**
 * Sifat `openGraph` di App Router: blok dari halaman anak MENGGANTI blok root
 * secara utuh, bukan di-merge per kunci. Halaman yang hanya menyetel `url`
 * akan kehilangan og:image / og:type / og:site_name, jadi setiap halaman harus
 * membawa blok OG lengkap lewat `pageMeta`.
 */
export const OG_DEFAULTS = {
  type: "website",
  siteName: "RAZRBILZ",
  locale: "en_US",
} as const;

/**
 * Potong teks bebas (deskripsi produk) jadi satu kalimat ringkas untuk
 * meta/OG. Google memotong sendiri di ~155–160 karakter, jadi memotong di
 * batas kata lebih baik daripada membiarkan kalimat terputus di tengah kata.
 */
export function describe(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const at = Math.max(cut.lastIndexOf(" "), cut.lastIndexOf("."));
  return `${cut.slice(0, at > 60 ? at : max).trimEnd()}…`;
}

/**
 * Metadata satu halaman. `canonical` dan `og:url` selalu dibangun dari `path`
 * yang sama supaya keduanya tidak bisa lari terpisah; URL relatif diselesaikan
 * oleh `metadataBase` di root layout.
 *
 * `title`/`description` opsional: homepage cukup warisi default dari root.
 */
export function pageMeta(o: {
  path: string;
  title?: string;
  description?: string;
  image?: OgImage;
}): Metadata {
  return {
    ...(o.title ? { title: o.title } : {}),
    ...(o.description ? { description: o.description } : {}),
    alternates: { canonical: o.path },
    openGraph: {
      ...OG_DEFAULTS,
      url: o.path,
      images: [o.image ?? BRAND_OG_IMAGE],
    },
  };
}
