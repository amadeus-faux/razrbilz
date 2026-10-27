import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { reportHandledError } from "@/lib/sentry";
import {
  RESEND_EMAIL_RATE_LIMIT,
  RESEND_IP_RATE_LIMIT,
} from "@/lib/early-access/constants";
import { isValidEmail, normalizeEmail } from "@/lib/early-access/db";
import { ensureConfirmationToken, readGateState } from "@/lib/early-access/gate";
import { hashToken } from "@/lib/early-access/tokens";
import { resendEarlyAccessTo, sendConfirmationEmail } from "@/lib/early-access/email-queue";
import { resolveNewsletterLocale } from "@/lib/newsletter-i18n";
import { withProbe, type Probe } from "@/lib/perf-probe";

export const dynamic = "force-dynamic";

/**
 * Kirim ulang link: dipakai orang yang kehilangan email konfirmasi dan halaman
 * /early yang linknya sudah habis dipakai.
 *
 * Balasannya selalu sama untuk email yang terdaftar maupun yang tidak. Kalau
 * balasannya berbeda, endpoint ini jadi alat untuk memeriksa alamat mana yang
 * ada di daftar kami.
 */
async function handlePOST(request: Request, probe: Probe) {
  try {
    const ip = clientIp(request);
    const ipLimit = checkRateLimit(`nl-resend-ip:${ip}`, RESEND_IP_RATE_LIMIT);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { success: false, code: "RATE_LIMITED", retryAfterSec: ipLimit.retryAfterSec },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as {
      email?: unknown;
      token?: unknown;
    } | null;

    // Jalur token: dipakai halaman /early saat link mati (periode baru, jatah
    // habis, kedaluwarsa). Pengunjung tidak perlu tahu emailnya; kami cari
    // subscriber lewat hash token akses. Balasan dibuat identik dengan jalur
    // email supaya token mati tidak bisa dibedakan dari token hidup.
    const rawAccessToken = typeof body?.token === "string" ? body.token.trim() : "";
    if (rawAccessToken) {
      const accessTokenHash = await hashToken(rawAccessToken);
      const emailLimit = checkRateLimit(
        `nl-resend-token:${accessTokenHash}`,
        RESEND_EMAIL_RATE_LIMIT
      );
      if (!emailLimit.allowed) {
        return NextResponse.json(
          { success: false, code: "RATE_LIMITED", retryAfterSec: emailLimit.retryAfterSec },
          { status: 429 }
        );
      }

      const accessToken = await probe.time("db_access_token", () =>
        prisma.accessToken.findUnique({
          where: { tokenHash: accessTokenHash },
          select: { subscriberId: true, periodId: true, expiresAt: true },
        })
      );

      if (accessToken && accessToken.expiresAt.getTime() > Date.now()) {
        const result = await probe.time("email_access_token", () =>
          resendEarlyAccessTo(accessToken.subscriberId, accessToken.periodId, probe)
        );
        if (!result.success) {
          console.error(
            `[Newsletter] Kirim ulang link akses (via token) ke subscriber ${accessToken.subscriberId} gagal: ${result.message}`
          );
        }
      }
      return NextResponse.json({ success: true, code: "EMAIL_SENT" });
    }

    const email = normalizeEmail(body?.email);

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, code: "INVALID_EMAIL" }, { status: 400 });
    }

    const emailLimit = checkRateLimit(`nl-resend-email:${email}`, RESEND_EMAIL_RATE_LIMIT);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { success: false, code: "RATE_LIMITED", retryAfterSec: emailLimit.retryAfterSec },
        { status: 429 }
      );
    }

    const subscriber = await probe.time("db_subscriber_find", () =>
      prisma.subscriber.findUnique({
        where: { email },
        select: { id: true, status: true, locale: true },
      })
    );

    if (!subscriber) {
      return NextResponse.json({ success: true, code: "EMAIL_SENT" });
    }

    // Sudah konfirmasi: yang dibutuhkan bukan link konfirmasi lagi, melainkan
    // link masuk. Dikirim ulang hanya bila early access memang sedang berjalan.
    if (subscriber.status === "confirmed") {
      const gate = await probe.time("db_gate", () => readGateState());
      if (gate.status === "early_access" && gate.currentPeriodId) {
        const periodId = gate.currentPeriodId;
        const result = await probe.time("email_access_token", () =>
          resendEarlyAccessTo(subscriber.id, periodId, probe)
        );
        if (!result.success) {
          console.error(`[Newsletter] Kirim ulang link akses ke ${email} gagal: ${result.message}`);
        }
      }
      return NextResponse.json({ success: true, code: "EMAIL_SENT" });
    }

    if (subscriber.status !== "pending") {
      return NextResponse.json({ success: true, code: "EMAIL_SENT" });
    }

    const cookieStore = await cookies();
    const locale =
      subscriber.locale === "en" || subscriber.locale === "id"
        ? subscriber.locale
        : resolveNewsletterLocale(cookieStore.get("user_country")?.value);

    const rawToken = await probe.time("db_token", () => ensureConfirmationToken(subscriber.id));
    const result = await probe.time("email", () =>
      sendConfirmationEmail({
        subscriberId: subscriber.id,
        email,
        locale,
        rawToken,
        kind: "resend_link",
        probe,
      })
    );

    if (!result.success) {
      console.error(`[Newsletter] Kirim ulang ke ${email} gagal: ${result.message}`);
    }

    return NextResponse.json({ success: true, code: "EMAIL_SENT" });
  } catch (error) {
    reportHandledError("newsletter-resend", error);
    console.error("[api/newsletter/resend] error:", error);
    return NextResponse.json({ success: false, code: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export const POST = withProbe(handlePOST);
