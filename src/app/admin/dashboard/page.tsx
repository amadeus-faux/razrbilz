import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { Package, ShoppingBag, DollarSign, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getDashboardStats() {
  try {
    const totalOrders = await prisma.order.count();
    const paidOrders = await prisma.order.findMany({
      where: { paymentStatus: "paid" },
      select: { total: true },
    });
    const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = await prisma.order.count({
      where: { paymentStatus: "pending" },
    });
    const totalProducts = await prisma.product.count();
    const recentOrders = await prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    return {
      totalOrders,
      revenue,
      pendingOrders,
      totalProducts,
      recentOrders,
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return {
      totalOrders: 0,
      revenue: 0,
      pendingOrders: 0,
      totalProducts: 0,
      recentOrders: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Total Pendapatan",
      value: formatRupiah(stats.revenue),
      icon: DollarSign,
      sub: "Dari pesanan terverifikasi",
    },
    {
      label: "Total Pesanan",
      value: stats.totalOrders.toLocaleString("id-ID"),
      icon: ShoppingBag,
      sub: "Semua status pesanan",
    },
    {
      label: "Pesanan Menunggu",
      value: stats.pendingOrders.toLocaleString("id-ID"),
      icon: Clock,
      sub: "Menunggu pembayaran",
    },
    {
      label: "Total Produk",
      value: stats.totalProducts.toLocaleString("id-ID"),
      icon: Package,
      sub: "Katalog aktif di toko",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f4f2ee]">Dashboard</h1>
          <p className="text-xs text-[#8c8680] mt-1">Ringkasan performa dan aktivitas toko RAZRBILZ</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>+ Tambah Produk</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, sub }) => (
          <div
            key={label}
            className="bg-[#141412] border border-[#242320] rounded-2xl p-5 hover:border-[#383530] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#9c968f]">{label}</span>
              <div className="w-8 h-8 rounded-xl bg-[#1c1b18] border border-white/5 flex items-center justify-center text-[#dedad3]">
                <Icon size={16} strokeWidth={1.75} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#f4f2ee] tracking-tight mt-3">
              {value}
            </p>
            <p className="text-[11px] text-[#736e67] mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
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
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
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
                  <th className="pb-3.5 pl-4">Status Pengiriman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201f1c]">
                {stats.recentOrders.map((order) => {
                  const isPaid = order.paymentStatus === "paid";
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
