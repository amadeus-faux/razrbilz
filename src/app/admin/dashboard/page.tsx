import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { Package, ShoppingBag, DollarSign, Clock } from "lucide-react";
import Link from "next/link";

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
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    return {
      totalOrders,
      revenue,
      pendingOrders,
      totalProducts,
      recentOrders,
    };
  } catch {
    return {
      totalOrders: 0,
      revenue: 0,
      pendingOrders: 0,
      totalProducts: 8,
      recentOrders: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-xs text-muted mt-1">Ringkasan performa toko RAZRBILZ</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Total Pendapatan</span>
            <DollarSign size={16} className="text-muted" />
          </div>
          <p className="text-lg font-semibold mt-2">
            {formatRupiah(stats.revenue)}
          </p>
        </div>

        <div className="bg-white p-5 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Total Pesanan</span>
            <ShoppingBag size={16} className="text-muted" />
          </div>
          <p className="text-lg font-semibold mt-2">{stats.totalOrders}</p>
        </div>

        <div className="bg-white p-5 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Pesanan Pending</span>
            <Clock size={16} className="text-muted" />
          </div>
          <p className="text-lg font-semibold mt-2">{stats.pendingOrders}</p>
        </div>

        <div className="bg-white p-5 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Total Produk</span>
            <Package size={16} className="text-muted" />
          </div>
          <p className="text-lg font-semibold mt-2">{stats.totalProducts}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Pesanan Terbaru</h2>
          <Link
            href="/admin/orders"
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            Lihat Semua →
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="text-xs text-muted py-4 text-center">
            Belum ada pesanan masuk.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="pb-3">No. Pesanan</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status Bayar</th>
                  <th className="pb-3">Status Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface">
                    <td className="py-3 font-mono">{order.orderNumber}</td>
                    <td className="py-3">{order.customerName}</td>
                    <td className="py-3">{formatRupiah(order.total)}</td>
                    <td className="py-3 uppercase font-medium">
                      {order.paymentStatus}
                    </td>
                    <td className="py-3 capitalize">{order.orderStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
