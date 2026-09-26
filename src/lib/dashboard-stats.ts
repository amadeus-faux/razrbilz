import { prisma } from "@/lib/prisma";

export type Period = "7" | "30" | "90" | "year" | "all";

export interface DashboardStatsResult {
  period: Period;
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
  topProducts: {
    id: string;
    name: string;
    stock: number;
    sold: number;
    daysListed: number;
    velocity: number;
    soldPercent: number;
  }[];
  fastSellingProducts: {
    id: string;
    name: string;
    stock: number;
    sold: number;
    daysListed: number;
    velocity: number;
    soldPercent: number;
  }[];
  lowStockProducts: {
    id: string;
    name: string;
    stock: number;
    sold: number;
    daysListed: number;
    velocity: number;
    soldPercent: number;
  }[];
  cityData: { name: string; count: number; percent: number }[];
  countryData: { name: string; count: number; percent: number }[];
  newestProductDate: string | null;
  oldestDataDate: string | null;
}

function getPeriodDateRange(period: Period): { start: Date | null; end: Date } {
  const now = new Date();
  const end = now;

  if (period === "all") return { start: null, end };

  if (period === "year") {
    const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    return { start, end };
  }

  const days = parseInt(period, 10);
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { start, end };
}

function getPreviousPeriodDateRange(period: Period): { start: Date | null; end: Date | null } {
  if (period === "all" || period === "year") return { start: null, end: null };

  const days = parseInt(period, 10);
  const now = new Date();
  const prevEnd = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const prevStart = new Date(prevEnd.getTime() - days * 24 * 60 * 60 * 1000);
  return { start: prevStart, end: prevEnd };
}

function calcChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return ((current - previous) / previous) * 100;
}

/** Group revenue by day (or week if range > 90 days) */
function groupRevenueByDate(
  orders: { paidAt: Date | null; total: number }[],
  groupByWeek: boolean
): { date: string; revenue: number }[] {
  const map = new Map<string, number>();

  for (const o of orders) {
    if (!o.paidAt) continue;
    let key: string;
    if (groupByWeek) {
      const d = new Date(o.paidAt);
      const day = d.getDay() || 7;
      d.setDate(d.getDate() + 4 - day);
      const yearStart = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
      key = `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
    } else {
      key = o.paidAt.toISOString().slice(0, 10);
    }
    map.set(key, (map.get(key) || 0) + o.total);
  }

  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, revenue]) => ({ date, revenue }));
}

export async function calculateDashboardStats(
  period: Period = "30"
): Promise<DashboardStatsResult> {
  const { start, end } = getPeriodDateRange(period);
  const { start: prevStart, end: prevEnd } = getPreviousPeriodDateRange(period);

  const periodPaidFilter = start
    ? { paidAt: { gte: start, lte: end } }
    : { paidAt: { lte: end } };

  const periodCreatedFilter = start
    ? { createdAt: { gte: start, lte: end } }
    : { createdAt: { lte: end } };

  const prevPaidFilter =
    prevStart && prevEnd
      ? { paidAt: { gte: prevStart, lte: prevEnd } }
      : null;

  const prevCreatedFilter =
    prevStart && prevEnd
      ? { createdAt: { gte: prevStart, lte: prevEnd } }
      : null;

  const [
    paidOrdersCurrent,
    totalOrdersCurrent,
    completedOrdersCurrent,
    failedOrdersCurrent,
    cancelledOrdersCurrent,
    returnedOrdersCurrent,
    paidOrdersPrev,
    totalOrdersPrev,
    revenueOrdersAll,
    cityDistribution,
    countryDistribution,
    products,
    productSales,
    newestProduct,
    oldestPaidOrder,
  ] = await Promise.all([
    prisma.order.findMany({
      where: { paymentStatus: "paid", ...periodPaidFilter },
      select: { total: true, paidAt: true },
    }),

    prisma.order.count({
      where: periodCreatedFilter,
    }),

    prisma.order.count({
      where: {
        paymentStatus: "paid",
        orderStatus: { in: ["delivered", "completed"] },
        ...periodPaidFilter,
      },
    }),

    prisma.order.count({
      where: {
        paymentStatus: { in: ["failed"] },
        ...periodCreatedFilter,
      },
    }),

    prisma.order.count({
      where: {
        orderStatus: "cancelled",
        ...periodCreatedFilter,
      },
    }),

    prisma.order.count({
      where: {
        orderStatus: "returned",
        ...periodCreatedFilter,
      },
    }),

    prevPaidFilter
      ? prisma.order.findMany({
          where: { paymentStatus: "paid", ...prevPaidFilter },
          select: { total: true },
        })
      : Promise.resolve([] as { total: number }[]),

    prevCreatedFilter
      ? prisma.order.count({ where: prevCreatedFilter })
      : Promise.resolve(0),

    prisma.order.findMany({
      where: { paymentStatus: "paid", ...periodPaidFilter },
      select: { paidAt: true, total: true },
      orderBy: { paidAt: "asc" },
    }),

    prisma.order.groupBy({
      by: ["city"],
      where: {
        paymentStatus: "paid",
        country: "ID",
        city: { not: "" },
        ...periodPaidFilter,
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 9,
    }),

    prisma.order.groupBy({
      by: ["country"],
      where: {
        paymentStatus: "paid",
        country: { notIn: ["ID", ""] },
        ...periodPaidFilter,
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 9,
    }),

    prisma.product.findMany({
      select: { id: true, name: true, stock: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),

    prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: { paymentStatus: "paid" },
        productId: { not: null },
      },
      _sum: { quantity: true },
    }),

    prisma.product.findFirst({
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),

    prisma.order.findFirst({
      where: { paymentStatus: "paid", paidAt: { not: null } },
      orderBy: { paidAt: "asc" },
      select: { paidAt: true },
    }),
  ]);

  const revenue = paidOrdersCurrent.reduce((s, o) => s + o.total, 0);
  const paidCount = paidOrdersCurrent.length;

  const revenuePrev = (paidOrdersPrev as { total: number }[]).reduce(
    (s, o) => s + o.total,
    0
  );
  const paidCountPrev = (paidOrdersPrev as { total: number }[]).length;

  const aov = paidCount > 0 ? Math.round(revenue / paidCount) : 0;
  const aovPrev = paidCountPrev > 0 ? Math.round(revenuePrev / paidCountPrev) : 0;

  const conversionRate =
    totalOrdersCurrent > 0
      ? parseFloat(((paidCount / totalOrdersCurrent) * 100).toFixed(1))
      : 0;
  const conversionRatePrev =
    totalOrdersPrev > 0
      ? parseFloat(((paidCountPrev / totalOrdersPrev) * 100).toFixed(1))
      : 0;

  const dayRange =
    period === "all"
      ? 9999
      : period === "year"
        ? 365
        : parseInt(period, 10);
  const groupByWeek = dayRange > 90;

  const revenueChart = groupRevenueByDate(
    revenueOrdersAll as { paidAt: Date | null; total: number }[],
    groupByWeek
  );

  const salesMap = new Map<string, number>(
    productSales
      .filter((ps): ps is { productId: string; _sum: { quantity: number | null } } => ps.productId !== null)
      .map((ps) => [ps.productId, ps._sum.quantity ?? 0])
  );

  const now = new Date();
  const productStats = products.map((p) => {
    const sold = salesMap.get(p.id) || 0;
    const daysListed = Math.max(
      1,
      Math.floor((now.getTime() - p.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    );
    const originalStock = p.stock + sold;
    const soldPercent = originalStock > 0 ? Math.round((sold / originalStock) * 100) : 0;
    return {
      id: p.id,
      name: p.name,
      stock: p.stock,
      sold,
      daysListed,
      velocity: parseFloat((sold / daysListed).toFixed(2)),
      soldPercent,
    };
  });

  const topProducts = [...productStats]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 8);

  const fastSellingProducts = [...productStats]
    .filter((p) => p.sold > 0)
    .sort((a, b) => b.velocity - a.velocity)
    .slice(0, 8);

  const lowStockProducts = productStats
    .filter((p) => p.stock >= 0 && p.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 8);

  const cityTotal = cityDistribution.reduce((s, c) => s + c._count.id, 0);
  const cityTop8 = cityDistribution.slice(0, 8);
  const cityOtherCount = cityDistribution
    .slice(8)
    .reduce((s, c) => s + c._count.id, 0);

  const cityData = [
    ...cityTop8.map((c) => ({
      name: c.city,
      count: c._count.id,
      percent: cityTotal > 0 ? parseFloat(((c._count.id / cityTotal) * 100).toFixed(1)) : 0,
    })),
    ...(cityOtherCount > 0
      ? [
          {
            name: "Lainnya",
            count: cityOtherCount,
            percent:
              cityTotal > 0
                ? parseFloat(((cityOtherCount / cityTotal) * 100).toFixed(1))
                : 0,
          },
        ]
      : []),
  ];

  const countryTotal = countryDistribution.reduce((s, c) => s + c._count.id, 0);
  const countryTop8 = countryDistribution.slice(0, 8);
  const countryOtherCount = countryDistribution
    .slice(8)
    .reduce((s, c) => s + c._count.id, 0);

  const countryData = [
    ...countryTop8.map((c) => ({
      name: c.country,
      count: c._count.id,
      percent:
        countryTotal > 0
          ? parseFloat(((c._count.id / countryTotal) * 100).toFixed(1))
          : 0,
    })),
    ...(countryOtherCount > 0
      ? [
          {
            name: "Lainnya",
            count: countryOtherCount,
            percent:
              countryTotal > 0
                ? parseFloat(((countryOtherCount / countryTotal) * 100).toFixed(1))
                : 0,
          },
        ]
      : []),
  ];

  return {
    period,
    revenue,
    revenueChange: calcChange(revenue, revenuePrev),
    paidOrders: paidCount,
    paidOrdersChange: calcChange(paidCount, paidCountPrev),
    totalOrders: totalOrdersCurrent,
    totalOrdersChange: calcChange(totalOrdersCurrent, totalOrdersPrev),
    completedOrders: completedOrdersCurrent,
    failedOrders: failedOrdersCurrent,
    cancelledOrders: cancelledOrdersCurrent,
    returnedOrders: returnedOrdersCurrent,
    aov,
    aovChange: calcChange(aov, aovPrev),
    conversionRate,
    conversionRateChange: calcChange(conversionRate, conversionRatePrev),
    revenueChart,
    groupByWeek,
    topProducts,
    fastSellingProducts,
    lowStockProducts,
    cityData,
    countryData,
    newestProductDate: newestProduct?.createdAt ? newestProduct.createdAt.toISOString() : null,
    oldestDataDate: oldestPaidOrder?.paidAt ? oldestPaidOrder.paidAt.toISOString() : null,
  };
}
