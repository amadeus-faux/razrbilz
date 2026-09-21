"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  RotateCcw,
  TrendingUp,
  BarChart2,
} from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import StatCard from "./StatCard";
import RevenueChart from "./RevenueChart";
import ProductStatsTable from "./ProductStatsTable";
import GeoCharts from "./GeoCharts";
import ExchangeRateCard from "./ExchangeRateCard";

type Period = "7" | "30" | "90" | "year" | "all";

interface DashboardStats {
  period: string;
  revenue: number;
  revenueChange: number | null;
  paidOrders: number;
  paidOrdersChange: number | null;
  totalOrders: number;
  totalOrdersChange: number | null;
  completedOrders: number;
  failedOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  aov: number;
  aovChange: number | null;
  conversionRate: number;
  conversionRateChange: number | null;
  revenueChart: { date: string; revenue: number }[];
  groupByWeek: boolean;
  topProducts: ProductStat[];
  fastSellingProducts: ProductStat[];
  lowStockProducts: ProductStat[];
  cityData: GeoDataPoint[];
  countryData: GeoDataPoint[];
  newestProductDate: string | null;
  oldestDataDate: string | null;
}

interface ProductStat {
  id: string;
  name: string;
  stock: number;
  sold: number;
  daysListed: number;
  velocity: number;
  soldPercent: number;
}

interface GeoDataPoint {
  name: string;
  count: number;
  percent: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

interface DashboardClientProps {
  initialStats: DashboardStats;
  recentOrders: RecentOrder[];
  totalProducts: number;
}

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7", label: "7 Hari" },
  { value: "30", label: "30 Hari" },
  { value: "90", label: "90 Hari" },
  { value: "year", label: "Tahun Ini" },
  { value: "all", label: "Semua" },
];

export default function DashboardClient({
  initialStats,
  recentOrders,
  totalProducts,
}: DashboardClientProps) {
  const [period, setPeriod] = useState<Period>("30");
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = useCallback(async (p: Period) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/dashboard/stats?period=${p}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(period);
  }, [period, fetchStats]);

  const periodLabel = PERIOD_OPTIONS.find((o) => o.value === period)?.label ?? period;
  const comparisonLabel =
    period === "all" || period === "year"
      ? undefined
      : `vs ${period} hari sblm.`;

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f4f2ee]">Dashboard</h1>
          <p className="text-xs text-[#8c8680] mt-1">
            Ringkasan performa dan aktivitas toko RAZRBILZ
          </p>
        </div>

        {/* Period Filter + Shortcut */}
        <div className="flex flex-col sm:items-end gap-3">
          <div className="flex items-center gap-1.5 bg-[#141412] border border-[#242320] rounded-xl p-1">
            {PERIOD_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  period === value
                    ? "bg-white text-black shadow-sm"
                    : "text-[#9c968f] hover:text-[#dedad3]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
          >
            + Tambah Produk
          </Link>
        </div>
      </div>

      {/* ── Stat Cards — Row 1 (Revenue, Paid, Total, Products) ─────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pendapatan"
          value={formatRupiah(stats.revenue)}
          icon={DollarSign}
          sub={comparisonLabel}
          change={stats.revenueChange}
          isLoading={isLoading}
        />
        <StatCard
          label="Pesanan Berbayar"
          value={stats.paidOrders.toLocaleString("id-ID")}
          icon={ShoppingBag}
          sub={comparisonLabel}
          change={stats.paidOrdersChange}
          isLoading={isLoading}
        />
        <StatCard
          label="Total Pesanan"
          value={stats.totalOrders.toLocaleString("id-ID")}
          icon={ShoppingBag}
          sub={comparisonLabel}
          change={stats.totalOrdersChange}
          isLoading={isLoading}
        />
        <StatCard
          label="Total Produk Aktif"
          value={totalProducts.toLocaleString("id-ID")}
          icon={Package}
          sub="All-time · katalog aktif"
          isLoading={false}
        />
      </div>

      {/* ── Stat Cards — Row 2 (Completed, Failed, Cancelled+Return, AOV, CVR) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pesanan Selesai"
          value={stats.completedOrders.toLocaleString("id-ID")}
          icon={CheckCircle2}
          sub="Status delivered / completed"
          variant="positive"
          isLoading={isLoading}
        />
        <StatCard
          label="Pesanan Gagal"
          value={stats.failedOrders.toLocaleString("id-ID")}
          icon={XCircle}
          sub="Payment failed / expired"
          variant="negative"
          isLoading={isLoading}
        />
        <StatCard
          label="Dibatalkan & Retur"
          value={(stats.cancelledOrders + stats.returnedOrders).toLocaleString("id-ID")}
          icon={RotateCcw}
          sub={`Dibatalkan: ${stats.cancelledOrders} · Retur: ${stats.returnedOrders}`}
          variant="warning"
          isLoading={isLoading}
        />
        <StatCard
          label="Rata-rata Nilai Pesanan"
          value={formatRupiah(stats.aov)}
          icon={TrendingUp}
          sub={comparisonLabel}
          change={stats.aovChange}
          isLoading={isLoading}
        />
      </div>

      {/* ── Conversion Rate banner ───────────────────────────────────────── */}
      <div className="bg-[#141412] border border-[#242320] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1c1b18] border border-white/5 flex items-center justify-center text-[#dedad3] flex-shrink-0">
            <BarChart2 size={16} strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-xs font-medium text-[#9c968f]">Tingkat Konversi Pembayaran</p>
            <p className="text-[11px] text-[#736e67] mt-0.5">
              Pesanan berbayar ÷ total pesanan — periode: {periodLabel}
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className="h-8 w-24 bg-[#1c1b18] rounded-lg animate-pulse" />
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#f4f2ee] tracking-tight">
              {stats.conversionRate}%
            </span>
            {stats.conversionRateChange !== null && (
              <span
                className={`text-xs font-medium ${
                  stats.conversionRateChange >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {stats.conversionRateChange >= 0 ? "+" : ""}{stats.conversionRateChange.toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Revenue Chart ────────────────────────────────────────────────── */}
      <RevenueChart
        data={stats.revenueChart}
        groupByWeek={stats.groupByWeek}
        newestProductDate={stats.newestProductDate}
        oldestDataDate={stats.oldestDataDate}
        isLoading={isLoading}
      />

      {/* ── Product Stats ────────────────────────────────────────────────── */}
      <ProductStatsTable
        topProducts={stats.topProducts}
        fastSellingProducts={stats.fastSellingProducts}
        lowStockProducts={stats.lowStockProducts}
        isLoading={isLoading}
      />

      {/* ── Geo Charts ───────────────────────────────────────────────────── */}
      <GeoCharts
        cityData={stats.cityData}
        countryData={stats.countryData}
        isLoading={isLoading}
      />

      {/* ── Exchange Rate Panel ───────────────────────────────────────────── */}
      <ExchangeRateCard />

      {/* ── Recent Orders ────────────────────────────────────────────────── */}
      <div className="bg-[#141412] border border-[#242320] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-[#f4f2ee]">Pesanan Terbaru</h2>
            <p className="text-xs text-[#8c8680] mt-0.5">Daftar transaksi yang baru saja masuk</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-[#9c968f] hover:text-[#f4f2ee] inline-flex items-center gap-1 transition-colors group"
          >
            <span>Lihat Semua</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#8c8680] bg-[#1a1917]/40 rounded-xl border border-dashed border-[#282623]">
            Belum ada pesanan masuk.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#242320] text-[#8c8680] uppercase tracking-wider font-semibold text-[11px]">
                  <th className="pb-3.5 pr-4">No. Pesanan</th>
                  <th className="pb-3.5 px-4">Customer</th>
                  <th className="pb-3.5 px-4">Total</th>
                  <th className="pb-3.5 px-4">Status Pembayaran</th>
                  <th className="pb-3.5 pl-4">Status Pesanan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201f1c]">
                {recentOrders.map((order) => {
                  const isPaid = order.paymentStatus === "paid";
                  const isFailed = order.paymentStatus === "failed";
                  return (
                    <tr key={order.id} className="hover:bg-[#1a1917]/60 transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-medium text-[#f4f2ee]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-[#dedad3] font-medium">
                        {order.customerName}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#f4f2ee]">
                        {formatRupiah(order.total)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-full border ${
                            isPaid
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : isFailed
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 capitalize text-[#9c968f]">
                        {order.orderStatus}
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
