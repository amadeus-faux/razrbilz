import { NextResponse } from "next/server";

import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { reportHandledError } from "@/lib/sentry";
import { confirmSubscriberByToken } from "@/lib/early-access/db";

export const dynamic = "force-dynamic";

const CONFIRM_RATE_LIMIT = { max: 20, windowMs: 10 * 60_000 };

/**
 * Langkah 2 double opt-in: konfirmasi email + penguncian slot.
 *
 * Slot dibagikan oleh fungsi SQL `confirm_and_assign_slot`, bukan di sini, jadi
 * dua orang yang konfirmasi pada milidetik yang sama tidak mungkin mendapat
 * nomor yang sama. Memanggil ulang dengan token yang sama aman (idempoten):
 * baris yang sama dikembalikan dengan `alreadyConfirmed: true`.
 */
export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limit = checkRateLimit(`nl-confirm-ip:${ip}`, CONFIRM_RATE_LIMIT);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, code: "RATE_LIMITED", retryAfterSec: limit.retryAfterSec },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as { token?: unknown } | null;
    const token = typeof body?.token === "string" ? body.token.trim() : "";

    if (!token) {
      return NextResponse.json({ success: false, code: "TOKEN_INVALID" }, { status: 400 });
    }

    const result = await confirmSubscriberByToken(token);

    if (!result.ok) {
      return NextResponse.json(
        { success: false, code: result.code },
        { status: result.code === "UNSUBSCRIBED" ? 410 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      slotNumber: result.slotNumber,
      alreadyConfirmed: result.alreadyConfirmed,
    });
  } catch (error) {
    reportHandledError("newsletter-confirm", error);
    console.error("[api/newsletter/confirm] error:", error);
    return NextResponse.json({ success: false, code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
