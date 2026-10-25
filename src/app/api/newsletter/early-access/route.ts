import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { reportHandledError } from "@/lib/sentry";
import { GATE_COOKIE } from "@/lib/early-access/constants";
import { readGateState } from "@/lib/early-access/gate";
import { hashToken } from "@/lib/early-access/tokens";

export const dynamic = "force-dynamic";

const ENTRY_RATE_LIMIT = { max: 20, windowMs: 10 * 60_000 };

/**
 * Menukar token dari email dengan cookie akses.
 *
 * Validasi sepenuhnya di server: token di-hash lalu dicocokkan dengan baris
 * untuk periode yang sedang berjalan. Token periode lama tidak pernah cocok,
 * jadi memulai periode baru otomatis mematikan semua link lama.
 *
 * Penghitung pemakaian dinaikkan dengan syarat `useCount < maxUses` di query
 * yang sama, jadi dua klik serentak tidak bisa melewati batas.
 */
export async function POST(request: Request) {
  try {
    const limit = checkRateLimit(`nl-entry:${clientIp(request)}`, ENTRY_RATE_LIMIT);
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

    const gate = await readGateState();

    // Gate sudah terbuka untuk semua orang: cookie tidak diperlukan.
    if (gate.status === "public") {
      return NextResponse.json({ success: true, status: "public" });
    }

    if (gate.status !== "early_access" || !gate.currentPeriodId) {
      return NextResponse.json({ success: false, code: "GATE_CLOSED" }, { status: 403 });
    }

    const periodId = gate.currentPeriodId;
    const tokenHash = await hashToken(token);
    const record = await prisma.accessToken.findUnique({ where: { tokenHash } });

    if (!record || record.periodId !== periodId) {
      return NextResponse.json({ success: false, code: "TOKEN_INVALID" }, { status: 400 });
    }
    if (record.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ success: false, code: "TOKEN_EXPIRED" }, { status: 400 });
    }
    if (record.useCount >= record.maxUses) {
      return NextResponse.json({ success: false, code: "TOKEN_USED" }, { status: 400 });
    }

    const claimed = await prisma.accessToken.updateMany({
      where: { id: record.id, useCount: { lt: record.maxUses } },
      data: { useCount: { increment: 1 } },
    });
    if (claimed.count === 0) {
      return NextResponse.json({ success: false, code: "TOKEN_USED" }, { status: 400 });
    }

    const period = await prisma.earlyAccessPeriod.findUnique({ where: { id: periodId } });
    const expiresAt = period?.endedAt ?? new Date(Date.now() + 24 * 60 * 60_000);
    const maxAge = Math.max(60, Math.floor((expiresAt.getTime() - Date.now()) / 1000));

    const response = NextResponse.json({
      success: true,
      status: "early_access",
      remainingUses: Math.max(0, record.maxUses - record.useCount - 1),
    });

    response.cookies.set(GATE_COOKIE, periodId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return response;
  } catch (error) {
    reportHandledError("newsletter-early-access", error);
    console.error("[api/newsletter/early-access] error:", error);
    return NextResponse.json({ success: false, code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
