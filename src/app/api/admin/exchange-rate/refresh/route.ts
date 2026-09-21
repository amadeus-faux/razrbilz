import { NextResponse } from "next/server";
import { fetchAndCacheExchangeRate } from "@/lib/exchange-rate";

export async function POST() {
  try {
    const rateInfo = await fetchAndCacheExchangeRate();
    return NextResponse.json({ success: true, rate: rateInfo });
  } catch (error: any) {
    console.error("[api/admin/exchange-rate/refresh] POST error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to refresh exchange rate" },
      { status: 500 }
    );
  }
}
