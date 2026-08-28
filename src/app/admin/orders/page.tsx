import { prisma } from "@/lib/prisma";
import OrdersTableClient from "./OrdersTableClient";

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
  } catch {
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const failedCount = orders.filter(
    (o) => o.paymentStatus === "paid" && (o.shippingOrderStatus === "FAILED" || (!o.biteshipOrderId && o.shippingOrderError))
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Pesanan</h1>
          <p className="text-xs text-muted mt-1">
            Daftar pesanan masuk dan manajemen status pengiriman Biteship
          </p>
        </div>

        {failedCount > 0 && (
          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>Ada {failedCount} pesanan gagal kirim ke Biteship (perlu ditindaklanjuti)</span>
          </div>
        )}
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <OrdersTableClient initialOrders={orders as any} />
      </div>
    </div>
  );
}

