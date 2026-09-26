import { prisma } from "@/lib/prisma";
import OrdersTableClient from "./OrdersTableClient";
import OrdersDateFilter from "./OrdersDateFilter";
import { autoExpireStaleOrders } from "@/lib/order-fulfillment";
import { AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Admin — Pesanan Masuk" },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RangeKey = "7" | "30" | "90" | "year" | "all";
const VALID_RANGES: RangeKey[] = ["7", "30", "90", "year", "all"];
const DEFAULT_RANGE: RangeKey = "30";

// WIB (Asia/Jakarta) = UTC+7, tanpa DST. createdAt disimpan dalam UTC,
// jadi batas rentang dihitung sebagai instant absolut (JS Date) agar konsisten.
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

function getCreatedAtFilter(range: RangeKey): { createdAt: { gte: Date } } | Record<string, never> {
  const now = Date.now();

  if (range === "all") return {};

  if (range === "year") {
    // Tahun berjalan menurut wall-clock WIB, mulai 1 Januari 00:00 WIB.
    const wibYear = Number(
      new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric" }).format(new Date(now))
    );
    const start = new Date(Date.UTC(wibYear, 0, 1, 0, 0, 0) - WIB_OFFSET_MS);
    return { createdAt: { gte: start } };
  }

  const days = Number(range); // 7 | 30 | 90
  const start = new Date(now - days * 24 * 60 * 60 * 1000);
  return { createdAt: { gte: start } };
}

async function getOrders(range: RangeKey) {
  try {
    // Otomatis ubah status pesanan kadaluarsa menjadi FAILED & CANCELLED
    await autoExpireStaleOrders().catch((err) =>
      console.error("Auto expire stale orders error:", err)
    );

    const where = getCreatedAtFilter(range);

    return await prisma.order.findMany({
      where,
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

interface PageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { range: rangeParam } = await searchParams;
  const range: RangeKey = VALID_RANGES.includes(rangeParam as RangeKey)
    ? (rangeParam as RangeKey)
    : DEFAULT_RANGE;

  const orders = await getOrders(range);

  const failedCount = orders.filter(
    (o) =>
      o.paymentStatus === "paid" &&
      (o.shippingOrderStatus === "FAILED" || (!o.biteshipOrderId && o.shippingOrderError))
  ).length;

  const inProductionCount = orders.filter(
    (o) =>
      o.paymentStatus === "paid" &&
      o.orderStatus !== "returned" &&
      o.orderStatus !== "cancelled" &&
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

      <OrdersDateFilter value={range} />

      <div className="bg-[#141412] border border-[#242320] rounded-2xl shadow-sm overflow-hidden">
        <OrdersTableClient initialOrders={orders as any} />
      </div>
    </div>
  );
}
