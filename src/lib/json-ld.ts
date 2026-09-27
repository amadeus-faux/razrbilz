import { siteOrigin } from "@/lib/site-url";
import { BRAND_DESCRIPTION } from "@/lib/seo";

/**
 * Entitas brand untuk Google (knowledge panel + pemahaman situs).
 *
 * `description` sengaja konstanta kode, bukan `SiteSetting` dari database: nilainya
 * masuk ke `<script>` lewat `dangerouslySetInnerHTML`, dan satu `</script>` dari
 * dashboard tidak boleh bisa menutup tag tersebut.
 *
 * `logo` memakai /apple-icon.png (180x180, latar gelap opaque), bukan
 * /logo/Cardinal_Compass_White.png yang putih di atas transparan — di atas latar
 * putih Google mark itu tidak terlihat sama sekali.
 */
export function brandJsonLd() {
  const origin = siteOrigin();

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: "RAZRBILZ",
      url: origin,
      logo: `${origin}/apple-icon.png`,
      description: BRAND_DESCRIPTION,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: origin,
      name: "RAZRBILZ",
      publisher: { "@id": `${origin}/#organization` },
    },
  ];
}
