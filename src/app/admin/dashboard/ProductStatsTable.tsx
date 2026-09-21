"use client";

import { useState } from "react";
import { TrendingUp, Zap, AlertTriangle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface ProductStat {
  id: string;
  name: string;
  stock: number;
  sold: number;
  daysListed: number;
  velocity: number;
  soldPercent: number;
}

interface ProductStatsTableProps {
  topProducts: ProductStat[];
  fastSellingProducts: ProductStat[];
  lowStockProducts: ProductStat[];
  isLoading?: boolean;
}

const TABS = [
  { id: "top", label: "Terlaris", icon: TrendingUp, description: "Unit terjual terbanyak (all-time)" },
  { id: "fast", label: "Cepat Habis", icon: Zap, description: "Kecepatan terjual (unit/hari sejak dibuat)" },
  { id: "low", label: "Stok Menipis", icon: AlertTriangle, description: "Sisa stok ≤ 5 unit" },
] as const;

type TabId = typeof TABS[number]["id"];

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-10 text-center text-xs text-[#736e67] rounded-xl border border-dashed border-[#282623]">
      {label}
    </div>
  );
}

function SkeletonRows() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <tr key={i} className="border-b border-[#201f1c]">
          <td className="py-3 px-4">
            <div className="h-3.5 w-32 bg-[#1c1b18] rounded animate-pulse" />
          </td>
          <td className="py-3 px-4"><div className="h-3.5 w-10 bg-[#1c1b18] rounded animate-pulse" /></td>
          <td className="py-3 px-4"><div className="h-3.5 w-10 bg-[#1c1b18] rounded animate-pulse" /></td>
          <td className="py-3 px-4"><div className="h-2 w-20 bg-[#1c1b18] rounded-full animate-pulse" /></td>
        </tr>
      ))}
    </>
  );
}

export default function ProductStatsTable({
  topProducts,
  fastSellingProducts,
  lowStockProducts,
  isLoading,
}: ProductStatsTableProps) {
  const [activeTab, setActiveTab] = useState<TabId>("top");

  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const tabIcon = currentTab.icon;

  return (
    <div className="bg-[#141412] border border-[#242320] rounded-2xl p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#f4f2ee]">Analisis Produk</h2>
        <p className="text-xs text-[#8c8680] mt-0.5">{currentTab.description}</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 mb-5 bg-[#1a1917] rounded-xl p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[11px] font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === id
                ? "bg-white text-black shadow-sm"
                : "text-[#9c968f] hover:text-[#dedad3]"
            }`}
          >
            <Icon size={11} strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      {activeTab === "top" && (
        isLoading ? (
          <table className="w-full text-xs"><tbody><SkeletonRows /></tbody></table>
        ) : topProducts.length === 0 ? (
          <EmptyState label="Belum ada produk dengan penjualan" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#242320] text-[#8c8680] text-[11px] uppercase tracking-wider">
                  <th className="text-left pb-3 px-2">Produk</th>
                  <th className="text-right pb-3 px-2">Terjual</th>
                  <th className="text-right pb-3 px-2">Sisa Stok</th>
                  <th className="text-left pb-3 px-2 min-w-[80px]">Habis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201f1c]">
                {topProducts.map((p, i) => (
                  <tr key={p.id} className="hover:bg-[#1a1917]/60">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#5a5650] w-4 text-right">{i + 1}</span>
                        <span className="text-[#dedad3] font-medium truncate max-w-[160px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-[#f4f2ee]">{p.sold}</td>
                    <td className="py-3 px-2 text-right">
                      <span className={p.stock <= 5 ? "text-rose-400 font-semibold" : "text-[#9c968f]"}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#2e2c28] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full transition-all"
                            style={{ width: `${Math.min(p.soldPercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[#736e67] w-7 text-right">{p.soldPercent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {activeTab === "fast" && (
        isLoading ? (
          <table className="w-full text-xs"><tbody><SkeletonRows /></tbody></table>
        ) : fastSellingProducts.length === 0 ? (
          <EmptyState label="Belum ada data kecepatan penjualan" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#242320] text-[#8c8680] text-[11px] uppercase tracking-wider">
                  <th className="text-left pb-3 px-2">Produk</th>
                  <th className="text-right pb-3 px-2">Unit/Hari</th>
                  <th className="text-right pb-3 px-2">Total Terjual</th>
                  <th className="text-right pb-3 px-2">Sisa Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201f1c]">
                {fastSellingProducts.map((p, i) => (
                  <tr key={p.id} className="hover:bg-[#1a1917]/60">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#5a5650] w-4 text-right">{i + 1}</span>
                        <span className="text-[#dedad3] font-medium truncate max-w-[160px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-semibold text-amber-400">{p.velocity}</span>
                      <span className="text-[10px] text-[#736e67]"> /hari</span>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-[#f4f2ee]">{p.sold}</td>
                    <td className="py-3 px-2 text-right">
                      <span className={p.stock <= 5 ? "text-rose-400 font-semibold" : "text-[#9c968f]"}>
                        {p.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {activeTab === "low" && (
        isLoading ? (
          <table className="w-full text-xs"><tbody><SkeletonRows /></tbody></table>
        ) : lowStockProducts.length === 0 ? (
          <div className="py-10 text-center text-xs text-emerald-400/80 rounded-xl border border-dashed border-emerald-900/40 bg-emerald-500/5">
            ✓ Semua produk memiliki stok yang cukup (stok &gt; 5)
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#242320] text-[#8c8680] text-[11px] uppercase tracking-wider">
                  <th className="text-left pb-3 px-2">Produk</th>
                  <th className="text-right pb-3 px-2">Sisa Stok</th>
                  <th className="text-left pb-3 px-2 min-w-[80px]">Level</th>
                  <th className="text-right pb-3 px-2">Terjual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201f1c]">
                {lowStockProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1a1917]/60">
                    <td className="py-3 px-2 font-medium text-[#dedad3] truncate max-w-[180px]">{p.name}</td>
                    <td className="py-3 px-2 text-right">
                      <span className={`font-bold text-sm ${p.stock === 0 ? "text-rose-400" : p.stock <= 2 ? "text-orange-400" : "text-amber-400"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        p.stock === 0
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : p.stock <= 2
                            ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {p.stock === 0 ? "Habis" : p.stock <= 2 ? "Kritis" : "Menipis"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-[#9c968f]">{p.sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
