import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import Image from "next/image";
import ProductActions from "./ProductActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProducts() {
  try {
    return await prisma.product.findMany({
      include: { sizes: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Produk</h1>
          <p className="text-xs text-muted mt-1">Kelola katalog produk dan stok ukuran</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs uppercase tracking-wider font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          Tambah Produk
        </Link>
      </div>

      <div className="bg-white border border-border">
        {products.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted">
            Belum ada produk di database. Jalankan seed database atau tambah produk baru.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted bg-surface/50">
                  <th className="p-4">Foto</th>
                  <th className="p-4">Nama</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4">Stok Ukuran</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => {
                  const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
                  return (
                    <tr key={p.id} className="hover:bg-surface/50">
                      <td className="p-4">
                        <div className="relative w-12 h-12 bg-surface">
                          <Image
                            src={p.images[0] || "/placeholder-product.svg"}
                            alt={p.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4">{p.category}</td>
                      <td className="p-4">{formatRupiah(p.price)}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {p.sizes.map((s) => (
                            <span
                              key={s.size}
                              className={`px-1.5 py-0.5 border text-[10px] ${s.stock === 0
                                ? "border-red-200 text-red-500 line-through"
                                : "border-border text-muted"
                                }`}
                            >
                              {s.size}: {s.stock}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] uppercase font-medium rounded-full ${p.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                            }`}
                        >
                          {p.isActive ? "Aktif" : "Non-aktif"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <ProductActions productId={p.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
