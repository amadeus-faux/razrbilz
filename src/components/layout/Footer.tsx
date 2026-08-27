import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-border mt-auto" id="site-footer">
      <div className="flex flex-col items-center justify-center gap-5 w-full py-10 px-6">
        {/* Navigation links */}
        <nav
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 w-full"
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
        <div className="w-8 h-px bg-border" aria-hidden="true" />

        {/* Copyright */}
        <p className="text-[10px] tracking-[0.1em] text-muted font-normal text-center">
          © 2026, RAZRBILZ. All rights reserved.
        </p>
      </div>
    </footer>
  );
}