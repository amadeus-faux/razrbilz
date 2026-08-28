"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingCart, LayoutDashboard, ExternalLink, Menu, X } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingCart },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Halaman login: tanpa sidebar/navbar sama sekali
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Top bar mobile — hamburger trigger */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-border p-4 sticky top-0 z-40">
        <span className="text-label text-sm font-semibold tracking-widest">
          RAZRBILZ ADMIN
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-foreground"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Dropdown menu mobile */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-border p-4 space-y-3">
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded hover:bg-surface transition-colors"
              >
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-border">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors"
            >
              <ExternalLink size={14} />
              Lihat Toko
            </Link>
          </div>
        </div>
      )}

      {/* Sidebar desktop — sama seperti sebelumnya, cuma disembunyikan di mobile */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-border p-6 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
            <span className="text-label text-sm font-semibold tracking-widest">
              RAZRBILZ ADMIN
            </span>
          </div>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded hover:bg-surface transition-colors"
              >
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="pt-6 border-t border-border mt-6">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors"
          >
            <ExternalLink size={14} />
            Lihat Toko
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}