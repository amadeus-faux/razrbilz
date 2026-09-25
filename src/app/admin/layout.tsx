"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingCart, LayoutDashboard, ExternalLink, Menu, X, LogOut, Ruler } from "lucide-react";
import { createClient } from "@/lib/supabase";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Katalog Produk", icon: Package },
  { href: "/admin/size-guides", label: "Size Guide", icon: Ruler },
  { href: "/admin/orders", label: "Pesanan Masuk", icon: ShoppingCart },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Halaman login: render tanpa sidebar/navbar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      window.location.href = "/admin/login";
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e0c] text-[#f4f2ee] flex flex-col md:flex-row font-sans antialiased selection:bg-white selection:text-black">
      {/* Top bar mobile — hamburger trigger */}
      <header className="md:hidden flex items-center justify-between bg-[#141412] border-b border-[#242320] px-5 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <span
            className="text-base font-normal tracking-[0.14em] text-[#f4f2ee]"
            style={{ fontFamily: "var(--font-tanker-var), sans-serif" }}
          >
            RAZRBILZ
          </span>
          <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-sans">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#a6a097] hover:text-white rounded-lg transition-colors cursor-pointer"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Dropdown menu mobile */}
      {mobileOpen && (
        <div className="md:hidden bg-[#141412] border-b border-[#242320] px-5 py-4 space-y-4">
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl transition-all ${
                    isActive
                      ? "bg-[#242320] text-[#f4f2ee] border border-white/5"
                      : "text-[#9c968f] hover:text-[#f4f2ee] hover:bg-[#1a1917]"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.75} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-[#242320] space-y-2">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#9c968f] hover:text-[#f4f2ee] transition-colors"
            >
              <ExternalLink size={14} />
              Lihat Toko Utama
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 px-3 py-2 text-xs text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg w-full transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              {loggingOut ? "Keluar..." : "Keluar (Logout)"}
            </button>
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:w-64 bg-[#141412] border-r border-[#242320] p-6 flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen">
        <div>
          {/* Brand header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#242320] mb-6">
            <div className="flex items-center gap-2.5">
              <span
                className="text-lg font-normal tracking-[0.16em] text-[#f4f2ee]"
                style={{ fontFamily: "var(--font-tanker-var), sans-serif" }}
              >
                RAZRBILZ
              </span>
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-sans">
                Admin
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl transition-all ${
                    isActive
                      ? "bg-[#242320] text-[#f4f2ee] shadow-sm border border-white/5"
                      : "text-[#9c968f] hover:text-[#f4f2ee] hover:bg-[#1a1917]"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.75} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-[#242320] space-y-1.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#9c968f] hover:text-[#f4f2ee] rounded-lg hover:bg-[#1a1917] transition-colors"
          >
            <ExternalLink size={14} />
            Lihat Toko
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg w-full transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            {loggingOut ? "Keluar..." : "Keluar (Logout)"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}