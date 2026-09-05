import Link from "next/link";

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
        <div
          className="w-full overflow-hidden px-6 pb-28 pt-2 select-none"
          aria-hidden="true"
        >
          <div
            className="flex justify-between text-foreground uppercase leading-none"
            style={{
              fontFamily: "var(--font-tanker-var), ui-sans-serif, sans-serif",
              fontSize: "clamp(4rem, 23.6vw, 30rem)",
            }}
          >
            {"RAZRBILZ".split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </div>
        </div>
      )}
    </footer>
  );
}