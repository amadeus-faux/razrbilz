import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchAndCacheExchangeRate } from "@/lib/exchange-rate";
import { requireAdmin } from "@/lib/require-admin";
import { withProbe, type Probe } from "@/lib/perf-probe";

async function handlePOST(_request: Request, probe: Probe) {
  const auth = await probe.time("auth", () => requireAdmin());
  if (!auth.ok) return auth.response;

  try {
    const rateInfo = await probe.time("fx_refresh", () =>
      fetchAndCacheExchangeRate(probe)
    );
    // Kurs baru ikut ter-bake ke halaman ISR (harga internasional) — sapu
    // seluruh cache storefront agar angka langsung ikut kurs terbaru.
    const revalidateStart = performance.now();
    revalidatePath("/", "layout");
    probe.mark("revalidate", performance.now() - revalidateStart);
    return NextResponse.json({ success: true, rate: rateInfo });
  } catch (error: any) {
    console.error("[api/admin/exchange-rate/refresh] POST error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to refresh exchange rate" },
      { status: 500 }
    );
  }
}

export const POST = withProbe(handlePOST);
