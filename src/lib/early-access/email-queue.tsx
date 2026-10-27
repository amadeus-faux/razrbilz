import { prisma } from "@/lib/prisma";
import { deliver, type EmailResult } from "@/lib/email";
import { siteOrigin } from "@/lib/site-url";
import type { Locale } from "@/lib/checkout-i18n";
import { ConfirmationEmail, EarlyAccessEmail } from "@/email/newsletter";
import { NEWSLETTER_COPY } from "@/lib/newsletter-i18n";
import { EMAIL_RATE_LIMITED_ERROR, PERIOD_DURATION_DAYS } from "./constants";
import { issueAccessToken } from "./gate";
import { signUnsubscribeToken, tokenMaxUses } from "./tokens";

/**
 * Pengiriman email newsletter + antrean blast early access.
 *
 * Baris `email_sends` dibuat lebih dulu, baru email dikirim. Jadi status per
 * subscriber terlihat di admin, dan tombol "kirim ulang yang gagal" hanya
 * memproses baris yang memang belum sampai. Unique index partial di tabel itu
 * yang menjamin satu subscriber tidak pernah menerima dua email early_access
 * untuk periode yang sama.
 *
 * Token mentah tidak pernah disimpan: dibuat tepat sebelum email dikirim.
 * Kirim ulang membuat token baru, dan link di email lama otomatis mati.
 */

const DEFAULT_DRAIN_DEADLINE_MS = 8_000;
const DEFAULT_DELAY_MS = 1_200;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function envNumber(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

async function unsubscribeUrlFor(subscriberId: string): Promise<string | null> {
  try {
    const token = await signUnsubscribeToken(subscriberId);
    return `${siteOrigin()}/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
  } catch (error) {
    // Kunci HMAC belum dipasang. Email tetap dikirim tanpa link berhenti;
    // kegagalan ini harus terlihat di log, bukan hilang diam-diam.
    console.error("[Newsletter] Link unsubscribe tidak dibuat:", error);
    return null;
  }
}

/** Header berhenti berlangganan satu klik versi tautan (tanpa POST). */
function listUnsubscribeHeaders(url: string | null): Record<string, string> | undefined {
  return url ? { "List-Unsubscribe": `<${url}>` } : undefined;
}

export async function sendConfirmationEmail(p: {
  subscriberId: string;
  email: string;
  locale: Locale;
  rawToken: string;
  kind: "confirmation" | "resend_link";
}): Promise<EmailResult> {
  const base = siteOrigin();
  const confirmUrl = `${base}/newsletter/confirm?token=${encodeURIComponent(p.rawToken)}`;
  const copy = NEWSLETTER_COPY[p.locale].email.confirmation;
  const unsubscribeUrl = await unsubscribeUrlFor(p.subscriberId);

  const row = await prisma.emailSend.create({
    data: { subscriberId: p.subscriberId, kind: p.kind, status: "pending" },
  });

  const result = await deliver({
    to: p.email,
    subject: copy.subject,
    headers: listUnsubscribeHeaders(unsubscribeUrl),
    element: (
      <ConfirmationEmail
        locale={p.locale}
        confirmUrl={confirmUrl}
        unsubscribeUrl={unsubscribeUrl}
      />
    ),
  });

  await prisma.emailSend.update({
    where: { id: row.id },
    data: {
      status: result.success ? "sent" : "failed",
      providerMessageId: result.id ?? null,
      error: result.success ? null : result.message,
      sentAt: result.success ? new Date() : null,
    },
  });

  return result;
}

export interface DrainResult {
  sent: number;
  failed: number;
  remaining: number;
  /** "rate_limited" bila pengiriman berhenti karena Resend menolak (429). */
  paused: "rate_limited" | null;
}

function isRateLimited(message: string): boolean {
  return /429|too many|rate/i.test(message);
}

type SendOutcome = "sent" | "failed" | "rate_limited";

async function sendOneEarlyAccess(
  row: {
    id: string;
    subscriberId: string;
    subscriber: { email: string; locale: string; status: string };
  },
  periodId: string,
  expiresAt: Date
): Promise<SendOutcome> {
  const { subscriber } = row;

  if (subscriber.status !== "confirmed") {
    await prisma.emailSend.update({
      where: { id: row.id },
      data: { status: "failed", error: `subscriber_${subscriber.status}` },
    });
    return "failed";
  }

  const locale: Locale = subscriber.locale === "en" ? "en" : "id";
  const result = await sendEarlyAccessEmail({
    subscriberId: row.subscriberId,
    email: subscriber.email,
    locale,
    periodId,
    expiresAt,
  });

  // 429 bukan kegagalan permanen: biarkan baris tetap pending supaya kirim
  // ulang setelah kuota pulih memprosesnya lagi.
  if (!result.success && isRateLimited(result.message)) {
    await prisma.emailSend.update({
      where: { id: row.id },
      data: {
        status: "pending",
        error: EMAIL_RATE_LIMITED_ERROR,
        providerMessageId: null,
        sentAt: null,
      },
    });
    return "rate_limited";
  }

  await prisma.emailSend.update({
    where: { id: row.id },
    data: {
      status: result.success ? "sent" : "failed",
      providerMessageId: result.id ?? null,
      error: result.success ? null : result.message,
      sentAt: result.success ? new Date() : null,
    },
  });

  return result.success ? "sent" : "failed";
}

/**
 * Membuat token akses baru lalu mengirim email early access.
 *
 * Dipakai dua jalur: drain antrean saat admin menekan "Mulai early access", dan
 * kirim ulang satu orang dari halaman /early. Karena token baru menimpa yang
 * lama, link di email sebelumnya otomatis mati.
 */
async function sendEarlyAccessEmail(p: {
  subscriberId: string;
  email: string;
  locale: Locale;
  periodId: string;
  expiresAt: Date;
}): Promise<EmailResult> {
  const rawToken = await issueAccessToken(p.subscriberId, p.periodId, p.expiresAt);
  const accessUrl = `${siteOrigin()}/early?token=${encodeURIComponent(rawToken)}`;
  const unsubscribeUrl = await unsubscribeUrlFor(p.subscriberId);
  const copy = NEWSLETTER_COPY[p.locale].email.earlyAccess;

  return deliver({
    to: p.email,
    subject: copy.subject,
    headers: listUnsubscribeHeaders(unsubscribeUrl),
    element: (
      <EarlyAccessEmail
        locale={p.locale}
        accessUrl={accessUrl}
        maxUses={tokenMaxUses()}
        endsAt={p.expiresAt}
        unsubscribeUrl={unsubscribeUrl}
      />
    ),
  });
}

/**
 * Kirim ulang email early access untuk satu subscriber pada periode berjalan.
 * Baris `email_sends` yang sudah ada dipakai ulang (unique index menjamin hanya
 * ada satu baris per subscriber per periode), jadi riwayat kirim tidak dobel.
 */
export async function resendEarlyAccessTo(
  subscriberId: string,
  periodId: string
): Promise<EmailResult> {
  const [period, subscriber] = await Promise.all([
    prisma.earlyAccessPeriod.findUnique({ where: { id: periodId } }),
    prisma.subscriber.findUnique({
      where: { id: subscriberId },
      select: { email: true, locale: true, status: true },
    }),
  ]);

  if (!period || !subscriber || subscriber.status !== "confirmed") {
    return { success: false, message: "Tidak ada periode aktif atau subscriber tidak valid" };
  }

  const expiresAt =
    period.endedAt ?? new Date(period.startedAt.getTime() + PERIOD_DURATION_DAYS * 24 * 60 * 60_000);

  const result = await sendEarlyAccessEmail({
    subscriberId,
    email: subscriber.email,
    locale: subscriber.locale === "en" ? "en" : "id",
    periodId,
    expiresAt,
  });

  const rateLimited = !result.success && isRateLimited(result.message);

  await prisma.emailSend.updateMany({
    where: { subscriberId, periodId, kind: "early_access" },
    data: rateLimited
      ? {
          status: "pending",
          error: EMAIL_RATE_LIMITED_ERROR,
          providerMessageId: null,
          sentAt: null,
        }
      : {
          status: result.success ? "sent" : "failed",
          providerMessageId: result.id ?? null,
          error: result.success ? null : result.message,
          sentAt: result.success ? new Date() : null,
        },
  });

  return result;
}

/**
 * Kirim antrean early_access untuk satu periode.
 *
 * Berhenti sendiri saat deadline tercapai supaya tidak menabrak batas eksekusi
 * fungsi serverless (Vercel Hobby ~10 detik). Sisa antrean tetap `pending` dan
 * bisa dilanjutkan lewat tombol kirim ulang di admin.
 */
export async function drainEarlyAccessQueue(
  periodId: string,
  opts?: { deadlineMs?: number; delayMs?: number; batch?: number }
): Promise<DrainResult> {
  const deadlineMs = opts?.deadlineMs ?? envNumber("EARLY_ACCESS_DRAIN_DEADLINE_MS", DEFAULT_DRAIN_DEADLINE_MS);
  const delayMs = opts?.delayMs ?? envNumber("EARLY_ACCESS_DRAIN_DELAY_MS", DEFAULT_DELAY_MS);
  const batch = opts?.batch ?? 10;

  const period = await prisma.earlyAccessPeriod.findUnique({ where: { id: periodId } });
  if (!period) return { sent: 0, failed: 0, remaining: 0, paused: null };

  const expiresAt =
    period.endedAt ?? new Date(period.startedAt.getTime() + PERIOD_DURATION_DAYS * 24 * 60 * 60_000);

  const startedAt = Date.now();
  let sent = 0;
  let failed = 0;

  for (;;) {
    const rows = await prisma.emailSend.findMany({
      where: { periodId, kind: "early_access", status: "pending" },
      orderBy: { createdAt: "asc" },
      take: batch,
      include: {
        subscriber: { select: { email: true, locale: true, status: true } },
      },
    });
    if (rows.length === 0) break;

    for (const row of rows) {
      if (Date.now() - startedAt >= deadlineMs) {
        return { sent, failed, remaining: await countPending(periodId), paused: null };
      }

      const outcome = await sendOneEarlyAccess(row, periodId, expiresAt);

      // 429 = kuota Resend habis. Hentikan seluruh drain, jangan mencoba baris
      // berikutnya: percobaan tambahan hanya memperpanjang penolakan. Baris
      // tetap pending dan alasan tampil di panel admin.
      if (outcome === "rate_limited") {
        return { sent, failed, remaining: await countPending(periodId), paused: "rate_limited" };
      }

      if (outcome === "sent") {
        sent += 1;
      } else {
        failed += 1;
      }

      await sleep(delayMs);
    }
  }

  return { sent, failed, remaining: await countPending(periodId), paused: null };
}

async function countPending(periodId: string): Promise<number> {
  return prisma.emailSend.count({
    where: { periodId, kind: "early_access", status: "pending" },
  });
}

/** Kembalikan baris gagal (dan yang menggantung) ke antrean, lalu kirim lagi. */
export async function requeueEarlyAccess(periodId: string): Promise<number> {
  const result = await prisma.emailSend.updateMany({
    where: {
      periodId,
      kind: "early_access",
      status: { in: ["failed", "pending"] },
    },
    data: { status: "pending", error: null, providerMessageId: null },
  });
  return result.count;
}
