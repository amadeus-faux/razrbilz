import Link from "next/link";
import { Package, ShoppingCart, LayoutDashboard, ExternalLink } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-border p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
            <span className="text-label text-sm font-semibold tracking-widest">
              RAZRBILZ ADMIN
            </span>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded hover:bg-surface transition-colors"
            >
              <LayoutDashboard size={16} strokeWidth={1.5} />
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded hover:bg-surface transition-colors"
            >
              <Package size={16} strokeWidth={1.5} />
              Produk
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded hover:bg-surface transition-colors"
            >
              <ShoppingCart size={16} strokeWidth={1.5} />
              Pesanan
            </Link>
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
