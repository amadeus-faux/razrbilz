import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-border mt-auto" id="site-footer">
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
              className="text-[10px] font-medium tracking-[0.14em] uppercase text-muted hover:text-foreground transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="w-8 h-px bg-border mx-auto" aria-hidden="true" />

        {/* Copyright */}
        <p className="text-[10px] tracking-[0.1em] text-muted font-normal text-center w-full">
          © 2026, RAZRBILZ. All rights reserved.
        </p>
      </div>
    </footer>
  );
}