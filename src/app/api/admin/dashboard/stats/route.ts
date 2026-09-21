import { NextResponse } from "next/server";
import { calculateDashboardStats, Period } from "@/lib/dashboard-stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPeriod = searchParams.get("period") || "30";
    const period = (["7", "30", "90", "year", "all"].includes(rawPeriod)
      ? rawPeriod
      : "30") as Period;

    const stats = await calculateDashboardStats(period);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[Dashboard Stats] Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat statistik dashboard" },
      { status: 500 }
    );
  }
}
