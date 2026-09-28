import Link from "next/link";
import { BRAND_DESCRIPTION } from "@/lib/seo";

interface FooterProps {
  showBrandWordmark?: boolean;
}

export default function Footer({ showBrandWordmark = false }: FooterProps) {
  return (
    <footer className="w-full border-t border-border mt-auto" id="site-footer">
      <div className="flex flex-col items-start md:items-center justify-center gap-6 w-full py-10 px-6 max-w-7xl mx-auto">
        {/* Navigation links: stacked vertically on mobile, row on desktop */}
        <nav
          className="flex flex-col items-start gap-y-2.5 md:flex-row md:items-center md:justify-center md:gap-x-8 md:gap-y-3 w-full"
          aria-label="Footer navigation"
          data-nosnippet
        >
          {[
            { href: "/refund-policy", label: "Refund Policy" },
            { href: "/terms", label: "Terms of Service" },
            { href: "/contact", label: "Contact Us" },
            { href: "/privacy-policy", label: "Privacy Policy" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[10px] tracking-[0.14em] uppercase text-muted hover:text-foreground transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Divider & Copyright — omitted on Shop page where giant RAZRBILZ wordmark takes visual prominence */}
        {!showBrandWordmark && (
          <>
            <div className="w-8 h-px bg-border mx-auto" aria-hidden="true" />
            <p className="text-[10px] tracking-[0.1em] text-muted text-center w-full">
              © 2026, RAZRBILZ. All rights reserved.
            </p>
          </>
        )}
      </div>

      {showBrandWordmark && (
        <div className="w-full overflow-hidden px-6 pb-28 pt-2">
          {/* Wordmark raksasa ini tersusun dari satu <span> per huruf, jadi teksnya
              tidak terbaca sebagai satu kata. <h1> memberi crawler dan screen reader
              judul yang bersih sementara hurufnya tetap dekoratif. */}
          <h1 className="select-none">
            <span className="sr-only">RAZRBILZ</span>
            <span
              aria-hidden="true"
              className="flex justify-between text-foreground leading-none"
              style={{
                fontFamily: "var(--font-tanker-var), ui-sans-serif, sans-serif",
                fontSize: "clamp(4rem, 23.6vw, 30rem)",
              }}
            >
              {"razrbilz".split("").map((char, i) => (
                <span key={i}>{char}</span>
              ))}
            </span>
          </h1>

          {/* credit line — satu-satunya kalimat deskriptif di homepage. Tanpa ini
              Google merakit snippet sendiri dari sisa teks halaman (nama produk,
              harga, link kebijakan, alt logo) dan mengabaikan meta description. */}
          <p className="mt-4 text-center text-[10px] leading-[1.6] tracking-[0.08em] text-muted/60">
            {BRAND_DESCRIPTION}
          </p>
        </div>
      )}
    </footer>
  );
}