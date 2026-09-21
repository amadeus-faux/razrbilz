import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
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
  } catch (error) {
    console.error("Admin products fetch error:", error);
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f4f2ee]">Katalog Produk</h1>
          <p className="text-xs text-[#8c8680] mt-1">
            Kelola daftar produk, foto, harga, dan ketersediaan stok ukuran
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-all inline-flex items-center gap-2 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Tambah Produk</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-[#141412] border border-[#242320] rounded-2xl overflow-hidden shadow-sm">
        {products.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1c1b18] border border-white/5 flex items-center justify-center mx-auto text-[#8c8680]">
              <Package size={22} strokeWidth={1.5} />
            </div>
            <p className="text-sm text-[#dedad3] font-medium">Belum ada produk di database</p>
            <p className="text-xs text-[#8c8680] max-w-sm mx-auto">
              Silakan klik tombol &quot;Tambah Produk&quot; di atas untuk memasukkan produk baru.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#181715] border-b border-[#242320] text-[#8c8680] uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3.5 px-4">Foto</th>
                  <th className="py-3.5 px-4">Nama Produk</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Harga</th>
                  <th className="py-3.5 px-4">Stok & Ukuran</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201f1c]">
                {products.map((p) => {
                  const isSoldOut = p.stock <= 0;
                  return (
                    <tr key={p.id} className="hover:bg-[#1a1917]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="relative w-12 h-12 rounded-xl bg-[#1c1b18] border border-[#2a2825] overflow-hidden">
                          <Image
                            src={p.images[0] || "/placeholder-product.svg"}
                            alt={p.name}
                            fill
                            className="object-contain p-1.5"
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-[#f4f2ee]">{p.name}</p>
                          {p.isPreOrder && (
                            <span className="px-1.5 py-0.5 text-[9.5px] uppercase font-bold tracking-wider rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              PO
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#736e67] font-mono mt-0.5">/{p.slug}</p>
                      </td>
                      <td className="py-3.5 px-4 text-[#dedad3]">
                        <span className="px-2.5 py-1 rounded-md bg-[#1c1b18] border border-white/5 text-[11px] font-medium text-[#c4c0b8]">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-sm text-[#f4f2ee]">
                        {formatRupiah(p.price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5 max-w-xs">
                          <div className="flex items-center gap-2">
                            {isSoldOut ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400">
                                Sold Out (0)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#1c1b18] border border-[#2e2c28] text-emerald-400">
                                {p.stock} <span className="text-[10px] text-[#8c8680] font-normal">pcs</span>
                              </span>
                            )}
                          </div>
                          {p.sizes.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {p.sizes.map((s) => (
                                <span
                                  key={s.id}
                                  className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#1c1b18] border border-[#2a2825] text-[#9c968f]"
                                >
                                  {s.size}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${
                            p.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
                          }`}
                        >
                          {p.isActive ? "Aktif" : "Non-Aktif"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
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
