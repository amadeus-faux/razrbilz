import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { calculateDashboardStats, DashboardStatsResult } from "@/lib/dashboard-stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getRecentOrders() {
  try {
    return await prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        paymentStatus: true,
        orderStatus: true,
        createdAt: true,
      },
    });
  } catch {
    return [];
  }
}

async function getTotalProducts() {
  try {
    return await prisma.product.count({ where: { isActive: true } });
  } catch {
    return 0;
  }
}

export default async function AdminDashboardPage() {
  const fallbackStats: DashboardStatsResult = {
    period: "30",
    revenue: 0,
    revenueChange: null,
    paidOrders: 0,
    paidOrdersChange: null,
    totalOrders: 0,
    totalOrdersChange: null,
    completedOrders: 0,
    failedOrders: 0,
    cancelledOrders: 0,
    returnedOrders: 0,
    aov: 0,
    aovChange: null,
    conversionRate: 0,
    conversionRateChange: null,
    revenueChart: [],
    groupByWeek: false,
    topProducts: [],
    fastSellingProducts: [],
    lowStockProducts: [],
    cityData: [],
    countryData: [],
    newestProductDate: null,
    oldestDataDate: null,
  };

  let initialStats: DashboardStatsResult = fallbackStats;
  try {
    initialStats = await calculateDashboardStats("30");
  } catch (err) {
    console.error("[AdminDashboardPage] Failed to calculate stats:", err);
  }

  const [recentOrders, totalProducts] = await Promise.all([
    getRecentOrders(),
    getTotalProducts(),
  ]);

  return (
    <DashboardClient
      initialStats={initialStats}
      recentOrders={recentOrders.map((o) => ({
        ...o,
        createdAt: o.createdAt.toISOString(),
      }))}
      totalProducts={totalProducts}
    />
  );
}
