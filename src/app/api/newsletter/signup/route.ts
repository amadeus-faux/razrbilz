import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { reportHandledError } from "@/lib/sentry";
import {
  NEWSLETTER_HONEYPOT_FIELD,
  SIGNUP_EMAIL_RATE_LIMIT,
  SIGNUP_IP_RATE_LIMIT,
} from "@/lib/early-access/constants";
import { isValidEmail, normalizeEmail } from "@/lib/early-access/db";
import { ensureConfirmationToken } from "@/lib/early-access/gate";
import { sendConfirmationEmail } from "@/lib/early-access/email-queue";
import { resolveNewsletterLocale } from "@/lib/newsletter-i18n";
import { withProbe, type Probe } from "@/lib/perf-probe";

export const dynamic = "force-dynamic";

/**
 * Pendaftaran newsletter (langkah 1 dari double opt-in).
 *
 * Respons untuk email baru, email yang sudah terdaftar, dan email yang sudah
 * berhenti berlangganan sengaja IDENTIK. Membedakan ketiganya sama saja memberi
 * alat untuk memeriksa alamat mana yang ada di daftar kami.
 *
 * Honeypot mengikuti pola form Contact Us: bot yang mengisi semua field akan
 * mengisi field tersembunyi ini, dan kami membalas sukses tanpa menyimpan apa pun.
 */
async function handlePOST(request: Request, probe: Probe) {
  try {
    const ip = clientIp(request);
    const ipLimit = checkRateLimit(`nl-signup-ip:${ip}`, SIGNUP_IP_RATE_LIMIT);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { success: false, code: "RATE_LIMITED", retryAfterSec: ipLimit.retryAfterSec },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    if (body && typeof body[NEWSLETTER_HONEYPOT_FIELD] === "string" && body[NEWSLETTER_HONEYPOT_FIELD]) {
      return NextResponse.json({ success: true, code: "EMAIL_SENT" });
    }

    const email = normalizeEmail(body?.email);
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, code: "INVALID_EMAIL" }, { status: 400 });
    }

    const emailLimit = checkRateLimit(`nl-signup-email:${email}`, SIGNUP_EMAIL_RATE_LIMIT);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { success: false, code: "RATE_LIMITED", retryAfterSec: emailLimit.retryAfterSec },
        { status: 429 }
      );
    }

    const cookieStore = await cookies();
    const locale = resolveNewsletterLocale(cookieStore.get("user_country")?.value);

    let subscriber = await probe.time("db_subscriber_find", () =>
      prisma.subscriber.findUnique({ where: { email } })
    );

    if (!subscriber) {
      subscriber = await probe.time("db_subscriber_create", () =>
        prisma.subscriber.create({
          data: { email, locale, status: "pending" },
        })
      );
    } else if (subscriber.status === "unsubscribed") {
      // Mendaftar lagi = minta dimasukkan kembali. Slot lama tidak dikembalikan:
      // slot hanya diberikan lewat fungsi konfirmasi atomik.
      await probe.time("db_subscriber_update", () =>
        prisma.subscriber.update({
          where: { id: subscriber!.id },
          data: { status: "pending", unsubscribedAt: null, locale },
        })
      );
    }

    if (subscriber.status === "confirmed") {
      return NextResponse.json({ success: true, code: "EMAIL_SENT" });
    }

    const subscriberId = subscriber.id;
    const rawToken = await probe.time("db_token", () => ensureConfirmationToken(subscriberId));
    const result = await probe.time("email", () =>
      sendConfirmationEmail({
        subscriberId,
        email,
        locale,
        rawToken,
        kind: "confirmation",
        probe,
      })
    );

    if (!result.success) {
      console.error(`[Newsletter] Email konfirmasi ke ${email} gagal: ${result.message}`);
    }

    return NextResponse.json({ success: true, code: "EMAIL_SENT" });
  } catch (error) {
    reportHandledError("newsletter-signup", error);
    console.error("[api/newsletter/signup] error:", error);
    return NextResponse.json(
      { success: false, code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export const POST = withProbe(handlePOST);
