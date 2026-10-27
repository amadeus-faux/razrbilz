"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DoorOpen, Lock, MailWarning, RefreshCw, Rocket, Unlock } from "lucide-react";

interface GateOverview {
  status: "closed" | "early_access" | "public";
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
    pendingReason: "rate_limited" | null;
  };
  updatedBy: string | null;
  updatedAt: string | null;
  history: { status: string; changedBy: string | null; changedAt: string }[];
}

type GateAction = "close" | "start_early_access" | "open_public" | "resend_failed";

const STATUS_META: Record<
  GateOverview["status"],
  { label: string; badge: string }
> = {
  closed: {
    label: "Tertutup",
    badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  },
  early_access: {
    label: "Early Access",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  public: {
    label: "Terbuka untuk Publik",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
};

const CONFIRM_TEXT: Record<GateAction, string> = {
  start_early_access:
    "Mulai periode early access baru dan kirim email akses ke seluruh subscriber terkonfirmasi? Link periode lama langsung mati.",
  open_public:
    "Buka toko untuk semua pengunjung? Periode early access yang berjalan akan diakhiri.",
  close: "Tutup toko? Semua pengunjung tanpa akses akan diarahkan ke halaman newsletter.",
  resend_failed:
    "Kirim ulang email early access yang gagal atau masih pending untuk periode ini?",
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

/**
 * Kontrol gate toko: status, jumlah subscriber, progres pengiriman blast,
 * dan tiga perpindahan status. Semua aksi lewat konfirmasi dua langkah;
 * untuk start_early_access server menolak bila jumlah subscriber berubah
 * sejak admin melihat angkanya (kode COUNT_CHANGED).
 */
export default function GateCard() {
  const [gate, setGate] = useState<GateOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<GateAction | null>(null);
  const [pendingAction, setPendingAction] = useState<GateAction | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchGate = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/gate", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.gate) {
        setGate(data.gate as GateOverview);
        return data.gate as GateOverview;
      }
    } catch (err) {
      console.error("Gagal memuat status gate:", err);
    }
    return null;
  }, []);

  useEffect(() => {
    (async () => {
      await fetchGate();
      setLoading(false);
    })();
  }, [fetchGate]);

  // Pantau progres pengiriman blast selama masih ada antrean.
  useEffect(() => {
    const draining = gate !== null && gate.status === "early_access" && gate.sends.pending > 0;
    if (draining && !pollRef.current) {
      pollRef.current = setInterval(() => {
        void fetchGate();
      }, 5000);
    }
    if (!draining && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [gate, fetchGate]);

  async function runAction(action: GateAction) {
    setBusyAction(action);
    setMessage(null);
    try {
      const body: Record<string, unknown> = { action };
      if (action === "start_early_access" && gate) {
        body.subscriberCount = gate.subscribers.confirmed;
      }
      const res = await fetch("/api/admin/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setPendingAction(null);
        if (data.gate) setGate(data.gate as GateOverview);
        if (action === "start_early_access") {
          setMessage({
            text: data.reused
              ? `Periode yang sedang berjalan dipakai ulang (${data.queued} email diantrekan).`
              : `Periode early access dimulai. ${data.queued} email diantrekan.`,
            type: "success",
          });
        } else if (action === "resend_failed") {
          setMessage({ text: `${data.requeued} email diantrekan ulang.`, type: "success" });
        } else {
          setMessage({ text: "Status gate diperbarui.", type: "success" });
        }
      } else if (res.status === 409 && data.code === "COUNT_CHANGED" && typeof data.eligible === "number") {
        // Jumlah berubah sejak kartu dimuat: segarkan angka, minta konfirmasi ulang.
        setGate((prev) =>
          prev ? { ...prev, subscribers: { ...prev.subscribers, confirmed: data.eligible } } : prev
        );
        if (data.gate) setGate(data.gate as GateOverview);
        setMessage({ text: data.error ?? "Jumlah subscriber berubah. Konfirmasi ulang.", type: "error" });
      } else if (res.status === 409 && action === "resend_failed") {
        setMessage({ text: data.error ?? "Belum ada periode early access.", type: "error" });
        setPendingAction(null);
      } else {
        setMessage({ text: data.error ?? "Aksi gate gagal dijalankan.", type: "error" });
      }
    } catch {
      setMessage({ text: "Koneksi gagal. Coba lagi.", type: "error" });
    } finally {
      setBusyAction(null);
    }
  }

  const statusMeta = gate ? STATUS_META[gate.status] : null;
  const totalSends = gate ? gate.sends.pending + gate.sends.sent + gate.sends.failed : 0;
  const sentPercent = gate && totalSends > 0 ? Math.round((gate.sends.sent / totalSends) * 100) : 0;

  const actions: { action: GateAction; label: string; icon: typeof Lock; show: boolean; primary?: boolean }[] = gate
    ? [
        {
          action: "start_early_access",
          label: "Mulai Early Access",
          icon: Rocket,
          show: gate.status === "closed",
          primary: true,
        },
        {
          action: "open_public",
          label: "Buka untuk Publik",
          icon: Unlock,
          show: gate.status !== "public",
        },
        {
          action: "close",
          label: "Tutup Toko",
          icon: Lock,
          show: gate.status !== "closed",
        },
        {
          action: "resend_failed",
          label: "Kirim Ulang yang Gagal",
          icon: MailWarning,
          show: gate.sends.failed > 0 || (gate.status === "early_access" && gate.sends.pending > 0),
        },
      ]
    : [];

  return (
    <div className="bg-[#141311] border border-[#242320] rounded-2xl p-6 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#242320]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1d1b18] border border-[#2e2c28] flex items-center justify-center text-[#d4af37]">
            <DoorOpen size={18} strokeWidth={1.8} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#f4f2ee]">Gate Toko</h2>
              {statusMeta && (
                <span
                  className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-full border ${statusMeta.badge}`}
                >
                  {statusMeta.label}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8c8680] mt-0.5">
              Status akses storefront: tertutup, early access, atau terbuka untuk semua.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void fetchGate()}
          className="p-2 rounded-lg text-[#9c968f] hover:text-[#f4f2ee] hover:bg-[#1c1b18] transition-colors"
          aria-label="Muat ulang status gate"
        >
          <RefreshCw size={14} className={busyAction ? "animate-spin" : undefined} />
        </button>
      </div>

      {loading || !gate ? (
        <div className="py-8 space-y-3">
          <div className="h-4 w-1/3 bg-[#1c1b18] rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-[#1c1b18] rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            <MiniStat label="Menunggu Konfirmasi" value={String(gate.subscribers.pending)} />
            <MiniStat label="Terkonfirmasi" value={String(gate.subscribers.confirmed)} />
            <MiniStat label="Berhenti" value={String(gate.subscribers.unsubscribed)} />
          </div>

          {gate.period && (
            <p className="text-[11px] text-[#8c8680] mt-3">
              Periode berjalan: {formatWhen(gate.period.startedAt)}
              {gate.period.endedAt ? ` - ${formatWhen(gate.period.endedAt)}` : ""}
              {gate.period.startedBy ? ` oleh ${gate.period.startedBy}` : ""}
            </p>
          )}

          {totalSends > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] text-[#9c968f] mb-1.5">
                <span>Pengiriman email blast</span>
                <span>
                  {gate.sends.sent} terkirim · {gate.sends.pending} antre · {gate.sends.failed} gagal
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#1c1b18] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${gate.sends.failed > 0 ? "bg-amber-400" : "bg-emerald-400"}`}
                  style={{ width: `${sentPercent}%` }}
                />
              </div>
              {gate.sends.pending > 0 && gate.sends.pendingReason === "rate_limited" ? (
                <p className="text-[11px] text-amber-300 mt-2">
                  {gate.sends.pending} email tertahan: batas harian Resend. Kirim ulang setelah kuota pulih.
                </p>
              ) : null}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-5">
            {actions
              .filter((a) => a.show)
              .map(({ action, label, icon: Icon, primary }) => (
                <button
                  key={action}
                  type="button"
                  disabled={busyAction !== null}
                  onClick={() => {
                    setMessage(null);
                    setPendingAction(action);
                  }}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
                    primary
                      ? "bg-white text-black hover:bg-neutral-200"
                      : "bg-[#1c1b18] border border-[#2e2c28] text-[#dedad3] hover:text-white hover:border-[#3d3a35]"
                  }`}
                >
                  <Icon size={13} strokeWidth={1.9} />
                  {label}
                </button>
              ))}
          </div>

          {pendingAction && (
            <div className="mt-4 p-4 rounded-xl bg-[#1c1b18] border border-[#2e2c28]">
              <p className="text-xs text-[#dedad3] leading-relaxed">
                {pendingAction === "start_early_access"
                  ? `${CONFIRM_TEXT[pendingAction]} Saat ini ${gate.subscribers.confirmed} subscriber akan dikirimi email.`
                  : CONFIRM_TEXT[pendingAction]}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  disabled={busyAction !== null}
                  onClick={() => void runAction(pendingAction)}
                  className="px-4 py-2 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                  {busyAction === pendingAction ? "Menjalankan..." : "Ya, Jalankan"}
                </button>
                <button
                  type="button"
                  disabled={busyAction !== null}
                  onClick={() => setPendingAction(null)}
                  className="px-4 py-2 bg-transparent border border-[#2e2c28] text-[#9c968f] text-xs font-semibold uppercase tracking-wider rounded-xl hover:text-[#dedad3] transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {message && (
            <div
              className={`mt-4 p-3 rounded-xl text-xs border ${
                message.type === "success"
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-300 border-rose-500/20"
              }`}
              role="status"
            >
              {message.text}
            </div>
          )}

          {gate.history.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#242320]">
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#736e67] mb-2">
                Riwayat Status
              </p>
              <ul className="space-y-1">
                {gate.history.map((h, i) => (
                  <li key={`${h.changedAt}-${i}`} className="text-[11px] text-[#8c8680]">
                    <span className="text-[#dedad3]">{STATUS_META[h.status as GateOverview["status"]]?.label ?? h.status}</span>
                    {" · "}
                    {formatWhen(h.changedAt)}
                    {h.changedBy ? ` · ${h.changedBy}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#1a1917] border border-[#242320] rounded-xl px-3 py-2.5">
      <p className="text-[9px] uppercase tracking-wider text-[#736e67] font-bold">{label}</p>
      <p className="text-sm font-semibold text-[#f4f2ee] mt-0.5">{value}</p>
    </div>
  );
}
