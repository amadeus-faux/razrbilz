import { after, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { reportHandledError } from "@/lib/sentry";
import {
  closeGate,
  getGateOverview,
  openForPublic,
  readGateState,
  startEarlyAccess,
} from "@/lib/early-access/gate";
import { drainEarlyAccessQueue, requeueEarlyAccess } from "@/lib/early-access/email-queue";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ACTIONS = ["close", "start_early_access", "open_public", "resend_failed"] as const;
type GateAction = (typeof ACTIONS)[number];

function isGateAction(value: unknown): value is GateAction {
  return typeof value === "string" && (ACTIONS as readonly string[]).includes(value);
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    return NextResponse.json({ success: true, gate: await getGateOverview() });
  } catch (error) {
    reportHandledError("admin-gate-get", error);
    console.error("[api/admin/gate] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat status gate" },
      { status: 500 }
    );
  }
}

/**
 * Semua perpindahan status gate.
 *
 * `requireAdmin()` dipanggil di handler ini, bukan mengandalkan middleware:
 * middleware hanya menjaga halaman /admin, dan tombol yang disembunyikan di UI
 * bukan penjaga keamanan.
 *
 * Blast email dijalankan lewat `after()` supaya respons admin tidak menunggu
 * ratusan kiriman. Status per email ada di `email_sends`, jadi pekerjaan yang
 * terpotong batas eksekusi serverless bisa dilanjutkan dari tombol kirim ulang.
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const action = body?.action;

    if (!isGateAction(action)) {
      return NextResponse.json(
        { success: false, error: "Aksi gate tidak dikenal." },
        { status: 400 }
      );
    }

    if (action === "close") {
      await closeGate(auth.email);
      return NextResponse.json({ success: true, gate: await getGateOverview() });
    }

    if (action === "open_public") {
      await openForPublic(auth.email);
      return NextResponse.json({ success: true, gate: await getGateOverview() });
    }

    if (action === "resend_failed") {
      const gate = await readGateState();
      if (!gate.currentPeriodId) {
        return NextResponse.json(
          { success: false, error: "Belum ada periode early access." },
          { status: 409 }
        );
      }
      const requeued = await requeueEarlyAccess(gate.currentPeriodId);
      const periodId = gate.currentPeriodId;
      after(async () => {
        try {
          await drainEarlyAccessQueue(periodId);
        } catch (error) {
          reportHandledError("admin-gate-resend-drain", error);
        }
      });
      return NextResponse.json({ success: true, requeued, gate: await getGateOverview() });
    }

    // start_early_access: konfirmasi dua langkah di UI mengirim jumlah yang
    // dilihat admin. Bila jumlahnya berubah (ada konfirmasi baru masuk),
    // permintaan ditolak supaya admin mengkonfirmasi angka yang benar.
    const declared = body?.subscriberCount;
    if (typeof declared !== "number" || !Number.isInteger(declared) || declared < 0) {
      return NextResponse.json(
        { success: false, error: "Jumlah subscriber untuk konfirmasi tidak valid." },
        { status: 400 }
      );
    }

    const eligible = await prisma.subscriber.count({
      where: { status: "confirmed", slotNumber: { not: null } },
    });

    if (declared !== eligible) {
      return NextResponse.json(
        {
          success: false,
          code: "COUNT_CHANGED",
          eligible,
          error: `Jumlah subscriber berubah menjadi ${eligible}. Periksa ulang lalu konfirmasi lagi.`,
        },
        { status: 409 }
      );
    }

    const started = await startEarlyAccess(auth.email);
    const periodId = started.periodId;

    after(async () => {
      try {
        await drainEarlyAccessQueue(periodId);
      } catch (error) {
        reportHandledError("admin-gate-early-access-drain", error);
      }
    });

    return NextResponse.json({ success: true, ...started, gate: await getGateOverview() });
  } catch (error) {
    reportHandledError("admin-gate-post", error);
    console.error("[api/admin/gate] POST error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menjalankan aksi gate" },
      { status: 500 }
    );
  }
}
