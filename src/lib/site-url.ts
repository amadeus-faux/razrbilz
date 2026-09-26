/**
 * Sumber tunggal URL publik untuk metadata SEO (metadataBase, sitemap, robots,
 * Open Graph). `src/lib/email.tsx` punya siteUrl() sendiri yang boleh mengembalikan
 * null — template email memakai itu untuk menyembunyikan tombol; di sini URL wajib
 * ada supaya relatif path selalu bisa diubah jadi absolut.
 */
export function siteOrigin(): string {
  const raw =
    process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://razrbilz.id";
  return raw.replace(/\/+$/, "");
}
