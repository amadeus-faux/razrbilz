import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { reportHandledError } from "@/lib/sentry";
import { verifyUnsubscribeToken } from "@/lib/early-access/tokens";

export const dynamic = "force-dynamic";

const UNSUBSCRIBE_RATE_LIMIT = { max: 10, windowMs: 10 * 60_000 };

/**
 * Berhenti berlangganan.
 *
 * Token ditandatangani HMAC, jadi tidak ada id pelanggan yang bisa ditebak dari
 * URL. Slot yang sudah terkunci tidak dikembalikan: slot diberikan saat
 * konfirmasi dan tidak diperdagangkan ulang lewat unsubscribe-resubscribe.
 */
export async function POST(request: Request) {
  try {
    const limit = checkRateLimit(`nl-unsub:${clientIp(request)}`, UNSUBSCRIBE_RATE_LIMIT);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, code: "RATE_LIMITED", retryAfterSec: limit.retryAfterSec },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as { token?: unknown } | null;
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    if (!token) {
      return NextResponse.json(
        { success: false, code: "UNSUBSCRIBE_INVALID" },
        { status: 400 }
      );
    }

    const verified = await verifyUnsubscribeToken(token);
    if (!verified) {
      return NextResponse.json(
        { success: false, code: "UNSUBSCRIBE_INVALID" },
        { status: 400 }
      );
    }

    await prisma.subscriber.updateMany({
      where: { id: verified.subscriberId },
      data: { status: "unsubscribed", unsubscribedAt: new Date(), confirmationTokenHash: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    reportHandledError("newsletter-unsubscribe", error);
    console.error("[api/newsletter/unsubscribe] error:", error);
    return NextResponse.json({ success: false, code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
