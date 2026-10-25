import { prisma } from "@/lib/prisma";
import { EARLY_ACCESS_CAP } from "./constants";
import { hashToken } from "./tokens";

/**
 * Akses data Early Access Gate (runtime Node, lewat Prisma).
 *
 * Pembagian slot TIDAK dilakukan di sini: `confirmSubscriberByToken` memanggil
 * fungsi SQL `confirm_and_assign_slot` yang mengunci baris dan menghitung slot
 * dalam satu transaksi. Dua konfirmasi serentak tidak bisa mendapat nomor sama.
 */

export interface SlotStats {
  taken: number;
  remaining: number;
  total: number;
}

export async function getSlotStats(): Promise<SlotStats> {
  const taken = await prisma.subscriber.count({ where: { slotNumber: { not: null } } });
  return {
    taken,
    remaining: Math.max(0, EARLY_ACCESS_CAP - taken),
    total: EARLY_ACCESS_CAP,
  };
}

export type ConfirmResult =
  | { ok: true; subscriberId: string; slotNumber: number | null; alreadyConfirmed: boolean }
  | { ok: false; code: "TOKEN_INVALID" | "UNSUBSCRIBED" };

export async function confirmSubscriberByToken(rawToken: string): Promise<ConfirmResult> {
  const tokenHash = await hashToken(rawToken);

  try {
    const rows = await prisma.$queryRaw<
      { subscriber_id: string; slot_number: number | null; already_confirmed: boolean }[]
    >`SELECT * FROM confirm_and_assign_slot(${tokenHash})`;

    const row = rows[0];
    if (!row) return { ok: false, code: "TOKEN_INVALID" };

    const subscriber = await prisma.subscriber.findUnique({
      where: { id: row.subscriber_id },
      select: { status: true },
    });
    if (subscriber?.status === "unsubscribed") return { ok: false, code: "UNSUBSCRIBED" };

    return {
      ok: true,
      subscriberId: row.subscriber_id,
      slotNumber: row.slot_number,
      alreadyConfirmed: row.already_confirmed,
    };
  } catch (error) {
    // Fungsi SQL melempar 'token_not_found' untuk hash yang tidak dikenal.
    const message = error instanceof Error ? error.message : "";
    if (message.includes("token_not_found")) return { ok: false, code: "TOKEN_INVALID" };
    throw error;
  }
}

export function normalizeEmail(raw: unknown): string {
  return String(raw ?? "").trim().toLowerCase();
}

/** Bentuk email diperiksa server; kebenaran alamat dibuktikan link konfirmasi. */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

export function isValidEmail(email: string): boolean {
  return email.length > 0 && email.length <= 254 && EMAIL_SHAPE.test(email);
}
