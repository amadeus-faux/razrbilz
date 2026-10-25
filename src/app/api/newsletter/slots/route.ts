import { NextResponse } from "next/server";

import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { reportHandledError } from "@/lib/sentry";
import { getSlotStats } from "@/lib/early-access/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SLOTS_RATE_LIMIT = { max: 30, windowMs: 60_000 };

/**
 * Sisa slot untuk counter di halaman /newsletter.
 *
 * Hanya angka yang dikembalikan, tanpa daftar atau alamat apa pun: endpoint ini
 * publik dan tidak boleh menjadi sumber data pelanggan. `no-store` supaya
 * angkanya tidak dibekukan cache CDN dan terlihat bohong setelah seseorang
 * konfirmasi.
 */
export async function GET(request: Request) {
  try {
    const limit = checkRateLimit(`nl-slots:${clientIp(request)}`, SLOTS_RATE_LIMIT);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, code: "RATE_LIMITED", retryAfterSec: limit.retryAfterSec },
        { status: 429, headers: { "Cache-Control": "no-store" } }
      );
    }

    const stats = await getSlotStats();
    return NextResponse.json(
      { success: true, remaining: stats.remaining, total: stats.total },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    reportHandledError("newsletter-slots", error);
    console.error("[api/newsletter/slots] error:", error);
    return NextResponse.json(
      { success: false, code: "INTERNAL_ERROR" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
