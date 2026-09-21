import { NextResponse } from "next/server";
import {
  getActiveExchangeRateInfo,
  setManualOverrideRate,
  clearManualOverrideRate,
} from "@/lib/exchange-rate";

export async function GET() {
  try {
    const rateInfo = await getActiveExchangeRateInfo();
    return NextResponse.json({ success: true, rate: rateInfo });
  } catch (error: any) {
    console.error("[api/admin/exchange-rate] GET error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch exchange rate" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usdToIdr, isOverride } = body;

    if (isOverride === false) {
      const updated = await clearManualOverrideRate();
      return NextResponse.json({ success: true, rate: updated });
    }

    const numericRate = Number(usdToIdr);
    if (isNaN(numericRate) || numericRate <= 0) {
      return NextResponse.json(
        { success: false, error: "Kurs USD/IDR harus berupa angka positif" },
        { status: 400 }
      );
    }

    const updated = await setManualOverrideRate(numericRate);
    return NextResponse.json({ success: true, rate: updated });
  } catch (error: any) {
    console.error("[api/admin/exchange-rate] POST error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update exchange rate" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const updated = await clearManualOverrideRate();
    return NextResponse.json({ success: true, rate: updated });
  } catch (error: any) {
    console.error("[api/admin/exchange-rate] DELETE error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to reset exchange rate" },
      { status: 500 }
    );
  }
}
