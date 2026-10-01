import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchAndCacheExchangeRate } from "@/lib/exchange-rate";
import { requireAdmin } from "@/lib/require-admin";

export async function POST() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const rateInfo = await fetchAndCacheExchangeRate();
    // Kurs baru ikut ter-bake ke halaman ISR (harga internasional) — sapu
    // seluruh cache storefront agar angka langsung ikut kurs terbaru.
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, rate: rateInfo });
  } catch (error: any) {
    console.error("[api/admin/exchange-rate/refresh] POST error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to refresh exchange rate" },
      { status: 500 }
    );
  }
}
