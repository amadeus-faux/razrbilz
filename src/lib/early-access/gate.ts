import { prisma } from "@/lib/prisma";
import {
  EMAIL_RATE_LIMITED_ERROR,
  PERIOD_DURATION_DAYS,
  START_EARLY_ACCESS_GUARD_MS,
  type GateStatus,
} from "./constants";
import { generateRawToken, hashToken, tokenMaxUses } from "./tokens";

/**
 * Status gate + periode early access (runtime Node, Prisma).
 *
 * Semua perpindahan status lewat satu fungsi (`writeGateStatus`) yang sekaligus
 * menulis baris di `gate_status_log`, jadi tidak ada perubahan status tanpa
 * jejak siapa dan kapan.
 */

const GATE_ROW_ID = 1;

export interface GateState {
  status: GateStatus;
  currentPeriodId: string | null;
}

export async function readGateState(): Promise<GateState> {
  // Select eksplisit: kolom cap boleh belum ada saat kode ini di-deploy
  // sebelum migration dijalankan.
  const row = await prisma.gateSetting.findUnique({
    where: { id: GATE_ROW_ID },
    select: { status: true, currentPeriodId: true },
  });
  return {
    status: (row?.status as GateStatus) ?? "closed",
    currentPeriodId: row?.currentPeriodId ?? null,
  };
}

async function writeGateStatus(
  status: GateStatus,
  changedBy: string | null,
  periodId?: string | null
): Promise<void> {
  await prisma.$transaction([
    prisma.gateSetting.upsert({
      where: { id: GATE_ROW_ID },
      create: { id: GATE_ROW_ID, status, currentPeriodId: periodId ?? null, updatedBy: changedBy },
      update: {
        status,
        ...(periodId !== undefined ? { currentPeriodId: periodId } : {}),
        updatedBy: changedBy,
        updatedAt: new Date(),
      },
      select: { id: true },
    }),
    prisma.gateStatusLog.create({
      data: { status, periodId: periodId ?? null, changedBy },
    }),
  ]);
}

export async function closeGate(changedBy: string | null): Promise<GateState> {
  await writeGateStatus("closed", changedBy, null);
  return readGateState();
}

export async function openForPublic(changedBy: string | null): Promise<GateState> {
  const current = await readGateState();
  // Periode ditutup supaya jelas kapan early access berakhir.
  if (current.currentPeriodId) {
    await prisma.earlyAccessPeriod.updateMany({
      where: { id: current.currentPeriodId, endedAt: null },
      data: { endedAt: new Date() },
    });
  }
  await writeGateStatus("public", changedBy, current.currentPeriodId);
  return readGateState();
}

export interface StartEarlyAccessResult {
  periodId: string;
  reused: boolean;
  queued: number;
  eligible: number;
}

/**
 * Mulai periode early access baru: periode lama otomatis tidak berlaku lagi
 * (cookie & token lama terikat period id yang berbeda).
 *
 * Idempoten terhadap klik ganda: bila status sudah `early_access` dan periodenya
 * baru dimulai dalam `START_EARLY_ACCESS_GUARD_MS`, periode itu dipakai ulang
 * dan tidak ada antrean email baru.
 */
export async function startEarlyAccess(changedBy: string | null): Promise<StartEarlyAccessResult> {
  const current = await readGateState();

  if (current.status === "early_access" && current.currentPeriodId) {
    const existing = await prisma.earlyAccessPeriod.findUnique({
      where: { id: current.currentPeriodId },
    });
    if (
      existing &&
      Date.now() - existing.startedAt.getTime() < START_EARLY_ACCESS_GUARD_MS
    ) {
      const queued = await prisma.emailSend.count({
        where: { periodId: existing.id, kind: "early_access" },
      });
      return { periodId: existing.id, reused: true, queued, eligible: queued };
    }
    if (existing && existing.endedAt === null) {
      await prisma.earlyAccessPeriod.update({
        where: { id: existing.id },
        data: { endedAt: new Date() },
      });
    }
  }

  const startedAt = new Date();
  const endedAt = new Date(startedAt.getTime() + PERIOD_DURATION_DAYS * 24 * 60 * 60_000);

  const period = await prisma.earlyAccessPeriod.create({
    data: { startedAt, endedAt, startedBy: changedBy },
  });

  // Semua subscriber yang sudah konfirmasi ikut, tanpa kuota dan tanpa syarat
  // nomor slot. Nomor slot hanya jejak historis.
  const eligible = await prisma.subscriber.findMany({
    where: { status: "confirmed" },
    select: { id: true },
  });

  await prisma.emailSend.createMany({
    data: eligible.map((s) => ({
      subscriberId: s.id,
      periodId: period.id,
      kind: "early_access",
      status: "pending",
    })),
    skipDuplicates: true,
  });

  await writeGateStatus("early_access", changedBy, period.id);

  return { periodId: period.id, reused: false, queued: eligible.length, eligible: eligible.length };
}

/**
 * Token konfirmasi baru untuk satu subscriber. Hash yang lama ditimpa, jadi
 * link di email sebelumnya mati: hanya link terakhir yang berlaku.
 */
export async function ensureConfirmationToken(subscriberId: string): Promise<string> {
  const raw = generateRawToken();
  await prisma.subscriber.update({
    where: { id: subscriberId },
    data: { confirmationTokenHash: await hashToken(raw) },
  });
  return raw;
}

/**
 * Token akses untuk satu subscriber pada satu periode. Dipanggil saat email
 * dikirim (bukan saat antrean dibuat) supaya tombol "kirim ulang yang gagal"
 * bisa membuat link baru tanpa perlu menyimpan token mentah di database.
 */
export async function issueAccessToken(
  subscriberId: string,
  periodId: string,
  expiresAt: Date
): Promise<string> {
  const raw = generateRawToken();
  const tokenHash = await hashToken(raw);
  await prisma.accessToken.upsert({
    where: {
      subscriberId_periodId: { subscriberId, periodId },
    },
    create: {
      subscriberId,
      periodId,
      tokenHash,
      expiresAt,
      maxUses: tokenMaxUses(),
    },
    update: { tokenHash, expiresAt, useCount: 0, maxUses: tokenMaxUses() },
  });
  return raw;
}

export interface GateOverview {
  status: GateStatus;
  currentPeriodId: string | null;
  period: {
    startedAt: string;
    endedAt: string | null;
    startedBy: string | null;
  } | null;
  subscribers: {
    pending: number;
    confirmed: number;
    unsubscribed: number;
  };
  sends: {
    pending: number;
    sent: number;
    failed: number;
    /** "rate_limited" bila antrean berhenti karena batas harian Resend. */
    pendingReason: "rate_limited" | null;
  };
  updatedBy: string | null;
  updatedAt: string | null;
  history: { status: string; changedBy: string | null; changedAt: string }[];
}

export async function getGateOverview(): Promise<GateOverview> {
  const [row, pending, confirmed, unsubscribed, recentHistory] = await Promise.all([
    prisma.gateSetting.findUnique({
      where: { id: GATE_ROW_ID },
      select: { status: true, currentPeriodId: true, updatedBy: true, updatedAt: true },
    }),
    prisma.subscriber.count({ where: { status: "pending" } }),
    prisma.subscriber.count({ where: { status: "confirmed" } }),
    prisma.subscriber.count({ where: { status: "unsubscribed" } }),
    prisma.gateStatusLog.findMany({ orderBy: { changedAt: "desc" }, take: 8 }),
  ]);

  const periodId = row?.currentPeriodId ?? null;
  const period = periodId
    ? await prisma.earlyAccessPeriod.findUnique({
        where: { id: periodId },
        select: { startedAt: true, endedAt: true, startedBy: true },
      })
    : null;

  const sendWhere = periodId ? { periodId, kind: "early_access" as const } : { kind: "early_access" as const };
  const [sendsPending, sendsSent, sendsFailed, sendsRateLimited] = await Promise.all([
    prisma.emailSend.count({ where: { ...sendWhere, status: "pending" } }),
    prisma.emailSend.count({ where: { ...sendWhere, status: "sent" } }),
    prisma.emailSend.count({ where: { ...sendWhere, status: "failed" } }),
    prisma.emailSend.count({
      where: {
        ...sendWhere,
        status: "pending",
        error: { startsWith: EMAIL_RATE_LIMITED_ERROR },
      },
    }),
  ]);

  return {
    status: (row?.status as GateStatus) ?? "closed",
    currentPeriodId: periodId,
    period: period
      ? {
          startedAt: period.startedAt.toISOString(),
          endedAt: period.endedAt ? period.endedAt.toISOString() : null,
          startedBy: period.startedBy,
        }
      : null,
    subscribers: { pending, confirmed, unsubscribed },
    sends: {
      pending: sendsPending,
      sent: sendsSent,
      failed: sendsFailed,
      pendingReason: sendsRateLimited > 0 ? "rate_limited" : null,
    },
    updatedBy: row?.updatedBy ?? null,
    updatedAt: row?.updatedAt ? row.updatedAt.toISOString() : null,
    history: recentHistory.map((h) => ({
      status: h.status,
      changedBy: h.changedBy,
      changedAt: h.changedAt.toISOString(),
    })),
  };
}
