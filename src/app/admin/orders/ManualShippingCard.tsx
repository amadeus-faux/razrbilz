"use client";

import { useState } from "react";
import {
  Truck,
  Send,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Edit2,
  Copy,
  Check,
  Calendar,
  FileText,
  Clock,
  PackageCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

export interface ManualShippingOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  email?: string | null;
  country?: string | null;
  paymentStatus: string;
  orderStatus: string;
  trackingNumber?: string | null;
  manualCourier?: string | null;
  manualService?: string | null;
  manualShippedAt?: any;
  manualTrackingNote?: string | null;
}

interface Props {
  order: ManualShippingOrder;
  onSuccess?: () => void;
}

const COMMON_SERVICES = [
  "EMS (Express Mail Service)",
  "Paket Pos Cepat Internasional",
  "Pos Ekspor",
  "Registered Mail Internasional",
  "Lainnya",
];

export default function ManualShippingCard({ order, onSuccess }: Props) {
  const router = useRouter();
  const hasExistingTracking = Boolean(order.trackingNumber);

  // Form states
  const [isEditing, setIsEditing] = useState(!hasExistingTracking);
  const [courier, setCourier] = useState(order.manualCourier || "POS Indonesia");
  const [serviceOption, setServiceOption] = useState(() => {
    if (!order.manualService) return "EMS (Express Mail Service)";
    if (COMMON_SERVICES.includes(order.manualService)) return order.manualService;
    return "Lainnya";
  });
  const [customService, setCustomService] = useState(() => {
    if (order.manualService && !COMMON_SERVICES.includes(order.manualService)) {
      return order.manualService;
    }
    return "";
  });

  const [rawTracking, setRawTracking] = useState(order.trackingNumber || "");
  const [shippedAt, setShippedAt] = useState(() => {
    if (order.manualShippedAt) {
      try {
        return new Date(order.manualShippedAt).toISOString().split("T")[0];
      } catch {
        return new Date().toISOString().split("T")[0];
      }
    }
    return new Date().toISOString().split("T")[0];
  });
  const [note, setNote] = useState(order.manualTrackingNote || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMarkingDelivered, setIsMarkingDelivered] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Cleaned tracking string: strip spaces, uppercase
  const cleanedResi = rawTracking.trim().replace(/\s+/g, "").toUpperCase();

  // UPU standard check: 2 letters + 9 digits + "ID" (e.g. EE123456789ID)
  const isUpuStandard = /^[A-Z]{2}\d{9}ID$/.test(cleanedResi);
  const showUpuWarning = cleanedResi.length > 0 && !isUpuStandard;

  const trackingUrl = "https://www.posindonesia.co.id/en/tracking";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!cleanedResi) {
      setMessage({ type: "error", text: "Nomor resi wajib diisi." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const finalService = serviceOption === "Lainnya" ? (customService.trim() || "Standar Internasional") : serviceOption;

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/manual-tracking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingNumber: cleanedResi,
          courier: courier.trim(),
          service: finalService,
          shippedAt,
          note: note.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan data resi");
      }

      setMessage({
        type: "success",
        text: `✅ ${data.message} ${order.email ? `Notifikasi email telah dikirimkan ke ${order.email}.` : ""}`,
      });
      setIsEditing(false);
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: `❌ Gagal: ${err instanceof Error ? err.message : "Terjadi kesalahan sistem"}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleMarkDelivered() {
    if (
      !confirm(
        `Tandai pesanan ${order.orderNumber} sebagai SELESAI (DELIVERED)?\n\nStatus pesanan akan tercatat selesai dan dihitung pada metrik dashboard.`
      )
    ) {
      return;
    }

    setIsMarkingDelivered(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: "delivered" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menandai pesanan selesai");
      }

      setMessage({
        type: "success",
        text: `✅ Berhasil! Pesanan ${order.orderNumber} kini berstatus Selesai (Delivered).`,
      });
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: `❌ Gagal: ${err instanceof Error ? err.message : "Terjadi kesalahan"}`,
      });
    } finally {
      setIsMarkingDelivered(false);
    }
  }

  function handleCopyResi() {
    if (!order.trackingNumber) return;
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isDelivered = order.orderStatus === "delivered" || order.orderStatus === "completed";

  return (
    <div className="bg-[#181715] border border-[#2a2825] rounded-xl p-4.5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#242320]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center">
            <Truck size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-semibold text-[#f4f2ee]">Pengiriman Manual (Luar Negeri)</h4>
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Non-Biteship
              </span>
            </div>
            <p className="text-[10px] text-[#8c8680]">
              Pengiriman internasional manual via POS Indonesia.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasExistingTracking && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#242320] hover:bg-[#2e2c28] text-[#dedad3] border border-[#383530] transition-colors cursor-pointer"
            >
              <Edit2 size={11} />
              <span>Edit Resi</span>
            </button>
          )}

          {hasExistingTracking && !isDelivered && (
            <button
              onClick={handleMarkDelivered}
              disabled={isMarkingDelivered}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-medium bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer disabled:opacity-50"
              title="Tandai pesanan telah sampai di tujuan"
            >
              <PackageCheck size={12} />
              <span>{isMarkingDelivered ? "Memproses..." : "Tandai Selesai"}</span>
            </button>
          )}

          {isDelivered && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              <CheckCircle2 size={11} />
              <span>Selesai (Delivered)</span>
            </span>
          )}
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-300 border border-rose-500/20"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* If tracking exists and not editing: Display view */}
      {hasExistingTracking && !isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-[#111110] p-3.5 rounded-xl border border-[#242320]">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#6a6660]">Kurir & Layanan</p>
              <p className="text-xs text-[#f4f2ee] font-medium mt-0.5">
                {order.manualCourier || "POS Indonesia"}
                {order.manualService && (
                  <span className="text-[#9c968f] block text-[11px]">{order.manualService}</span>
                )}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#6a6660]">Nomor Resi</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-xs text-amber-400 font-semibold tracking-wide">
                  {order.trackingNumber}
                </span>
                <button
                  onClick={handleCopyResi}
                  className="p-1 text-[#8c8680] hover:text-white transition-colors cursor-pointer"
                  title="Salin No. Resi"
                >
                  {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#6a6660]">Tanggal Kirim</p>
              <p className="text-xs text-[#f4f2ee] font-medium mt-0.5">
                {order.manualShippedAt
                  ? new Date(order.manualShippedAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#6a6660]">Tautan Lacak</p>
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors mt-0.5"
              >
                <span>Lacak POS Indonesia</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {order.manualTrackingNote && (
            <div className="text-[11px] text-[#9c968f] bg-[#111110] px-3.5 py-2 rounded-lg border border-[#242320]">
              <span className="text-[#6a6660] font-medium uppercase text-[10px] block">Catatan:</span>
              {order.manualTrackingNote}
            </div>
          )}
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {/* Kurir */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#8c8680] font-medium mb-1">
                Kurir *
              </label>
              <input
                type="text"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                placeholder="POS Indonesia"
                required
                className="w-full px-3 py-2 bg-[#111110] border border-[#2c2a26] rounded-lg text-xs text-[#f4f2ee] placeholder:text-[#55524c] focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Jenis Layanan */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#8c8680] font-medium mb-1">
                Jenis Layanan
              </label>
              <select
                value={serviceOption}
                onChange={(e) => setServiceOption(e.target.value)}
                className="w-full px-3 py-2 bg-[#111110] border border-[#2c2a26] rounded-lg text-xs text-[#f4f2ee] focus:outline-none focus:border-amber-500/50 cursor-pointer"
              >
                {COMMON_SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {serviceOption === "Lainnya" && (
                <input
                  type="text"
                  value={customService}
                  onChange={(e) => setCustomService(e.target.value)}
                  placeholder="Nama layanan lainnya..."
                  className="w-full mt-1.5 px-3 py-1.5 bg-[#111110] border border-[#2c2a26] rounded-lg text-xs text-[#f4f2ee] placeholder:text-[#55524c] focus:outline-none focus:border-amber-500/50"
                />
              )}
            </div>

            {/* Tanggal Kirim */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#8c8680] font-medium mb-1">
                Tanggal Kirim *
              </label>
              <input
                type="date"
                value={shippedAt}
                onChange={(e) => setShippedAt(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#111110] border border-[#2c2a26] rounded-lg text-xs text-[#f4f2ee] focus:outline-none focus:border-amber-500/50 cursor-pointer"
              />
            </div>
          </div>

          {/* Nomor Resi */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] uppercase tracking-wider text-[#8c8680] font-medium">
                Nomor Resi * (Wajib)
              </label>
              <span className="text-[10px] text-[#6a6660]">Contoh UPU: EE123456789ID</span>
            </div>
            <input
              type="text"
              value={rawTracking}
              onChange={(e) => setRawTracking(e.target.value.toUpperCase())}
              placeholder="Masukkan nomor resi pengiriman..."
              required
              className="w-full px-3.5 py-2.5 bg-[#111110] border border-[#2c2a26] rounded-lg text-xs font-mono text-[#f4f2ee] placeholder:text-[#55524c] focus:outline-none focus:border-amber-500/50 tracking-wider font-medium uppercase"
            />

            {/* Warning if not standard UPU (informational only, not a hard reject) */}
            {showUpuWarning && (
              <p className="text-[11px] text-amber-400/90 mt-1.5 flex items-start gap-1.5 leading-relaxed bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                <AlertCircle size={13} className="shrink-0 mt-0.5 text-amber-400" />
                <span>
                  Format nomor resi tidak mengikuti standar UPU Pos Indonesia (2 huruf + 9 digit + ID, contoh:{" "}
                  <strong className="font-mono">EE123456789ID</strong>). Anda tetap dapat menyimpannya jika menggunakan format lain.
                </span>
              </p>
            )}
          </div>

          {/* Catatan Opsional */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#8c8680] font-medium mb-1">
              Catatan Pengiriman (Opsional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tambahkan catatan khusus jika ada (mis. nomor kuitansi kiriman, berat aktual, dll)..."
              rows={2}
              className="w-full px-3 py-2 bg-[#111110] border border-[#2c2a26] rounded-lg text-xs text-[#f4f2ee] placeholder:text-[#55524c] focus:outline-none focus:border-amber-500/50 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-[#242320]">
            <p className="text-[10px] text-[#6a6660]">
              * Status order otomatis menjadi <strong className="text-[#dedad3]">shipped</strong> & email notifikasi dikirim ke customer.
            </p>
            <div className="flex items-center gap-2">
              {hasExistingTracking && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setMessage(null);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#9c968f] hover:text-white bg-[#201f1c] hover:bg-[#282724] transition-colors cursor-pointer"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !cleanedResi}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-black transition-all cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Send size={12} />
                <span>{isSubmitting ? "Menyimpan..." : hasExistingTracking ? "Simpan Perubahan Resi" : "Simpan & Kirim Notifikasi"}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
