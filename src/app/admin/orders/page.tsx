import { prisma } from "@/lib/prisma";
import OrdersTableClient from "./OrdersTableClient";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getOrders() {
  try {
    return await prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const failedCount = orders.filter(
    (o) =>
      o.paymentStatus === "paid" &&
      (o.shippingOrderStatus === "FAILED" || (!o.biteshipOrderId && o.shippingOrderError))
  ).length;

  const inProductionCount = orders.filter(
    (o) =>
      o.paymentStatus === "paid" &&
      (o.orderStatus === "in_production" || o.shippingOrderStatus === "WAITING_PRODUCTION") &&
      !o.biteshipOrderId
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f4f2ee]">Pesanan Masuk</h1>
          <p className="text-xs text-[#8c8680] mt-1">
            Daftar pesanan customer, alur produksi Pre-Order, dan integrasi logistik Biteship
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {inProductionCount > 0 && (
            <div className="px-3.5 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-300 font-medium flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
              <span>{inProductionCount} pesanan sedang diproduksi</span>
            </div>
          )}

          {failedCount > 0 && (
            <div className="px-3.5 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 font-medium flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
              <span className="leading-snug">
                {failedCount} pesanan gagal kirim
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#141412] border border-[#242320] rounded-2xl shadow-sm overflow-hidden">
        <OrdersTableClient initialOrders={orders as any} />
      </div>
    </div>
  );
}
