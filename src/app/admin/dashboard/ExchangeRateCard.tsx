"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Globe, Check, AlertCircle, Edit3, RotateCcw } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface RateInfo {
  usdToIdr: number;
  source: string;
  isOverride: boolean;
  updatedAt: string;
  expiresAt: string | null;
}

export default function ExchangeRateCard() {
  const [rateInfo, setRateInfo] = useState<RateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [overrideInput, setOverrideInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchRate = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/exchange-rate");
      const data = await res.json();
      if (data.success && data.rate) {
        setRateInfo(data.rate);
        setOverrideInput(Math.round(data.rate.usdToIdr).toString());
      }
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setMessage(null);
      const res = await fetch("/api/admin/exchange-rate/refresh", { method: "POST" });
      const data = await res.json();
      if (data.success && data.rate) {
        setRateInfo(data.rate);
        setOverrideInput(Math.round(data.rate.usdToIdr).toString());
        setMessage({ text: "Kurs berhasil diperbarui dari open.er-api.com", type: "success" });
      } else {
        setMessage({ text: data.error || "Gagal memperbarui kurs", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err?.message || "Koneksi gagal", type: "error" });
    } finally {
      setRefreshing(false);
    }
  };

  const handleSaveOverride = async () => {
    const val = Number(overrideInput);
    if (!val || val <= 0) {
      setMessage({ text: "Masukkan angka kurs yang valid", type: "error" });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);
      const res = await fetch("/api/admin/exchange-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usdToIdr: val, isOverride: true }),
      });
      const data = await res.json();
      if (data.success && data.rate) {
        setRateInfo(data.rate);
        setIsEditing(false);
        setMessage({ text: `Override kurs tersimpan: ${formatRupiah(val)}`, type: "success" });
      } else {
        setMessage({ text: data.error || "Gagal menyimpan override", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err?.message || "Koneksi gagal", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleClearOverride = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const res = await fetch("/api/admin/exchange-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOverride: false }),
      });
      const data = await res.json();
      if (data.success && data.rate) {
        setRateInfo(data.rate);
        setOverrideInput(Math.round(data.rate.usdToIdr).toString());
        setIsEditing(false);
        setMessage({ text: "Override dihapus. Kembali ke kurs otomatis.", type: "success" });
      } else {
        setMessage({ text: data.error || "Gagal menghapus override", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err?.message || "Koneksi gagal", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#141311] border border-[#242320] rounded-2xl p-6 mb-8 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#242320]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1d1b18] border border-[#2e2c28] flex items-center justify-center text-[#d4af37]">
            <Globe size={18} strokeWidth={1.8} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#f4f2ee]">Kurs Internasional (USD → IDR)</h2>
              {rateInfo && (
                <span
                  className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-full border ${
                    rateInfo.isOverride
                      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  }`}
                >
                  {rateInfo.isOverride ? "Override Manual" : "API Otomatis"}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8c8680] mt-0.5">
              Dipakai untuk mengonversi harga bagi pembeli dari luar Indonesia (dibulatkan ke kelipatan Rp 5.000).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1d1b18] hover:bg-[#252320] border border-[#2e2c28] text-xs text-[#dedad3] transition-colors disabled:opacity-50"
            title="Ambil kurs terbaru dari open.er-api.com"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin text-amber-400" : ""} />
            <span>{refreshing ? "Mengambil..." : "Refresh Kurs"}</span>
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1d1b18] hover:bg-[#252320] border border-[#2e2c28] text-xs text-[#dedad3] transition-colors"
            >
              <Edit3 size={13} />
              <span>Ubah Manual</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 py-2 rounded-xl bg-[#1d1b18] hover:bg-[#252320] border border-[#2e2c28] text-xs text-[#8c8680] transition-colors"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {message && (
        <div
          className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-300 border-rose-500/20"
          }`}
        >
          {message.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Main active rate */}
        <div className="p-4 rounded-xl bg-[#191815] border border-[#242320]">
          <span className="text-[10px] uppercase tracking-wider text-[#8c8680] block">Kurs Aktif Saat Ini</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#f4f2ee]">
              {rateInfo ? formatRupiah(Math.round(rateInfo.usdToIdr)) : "..."}
            </span>
            <span className="text-xs text-[#8c8680]">/ 1 USD</span>
          </div>
          <span className="text-[11px] text-[#8c8680] mt-1 block">
            {rateInfo?.usdToIdr ? `Presisi: ${rateInfo.usdToIdr.toFixed(2)}` : ""}
          </span>
        </div>

        {/* Update status */}
        <div className="p-4 rounded-xl bg-[#191815] border border-[#242320]">
          <span className="text-[10px] uppercase tracking-wider text-[#8c8680] block">Pembaruan Terakhir</span>
          <span className="text-sm font-medium text-[#dedad3] mt-1 block">
            {rateInfo?.updatedAt
              ? new Date(rateInfo.updatedAt).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "..."}
          </span>
          <span className="text-[11px] text-[#8c8680] mt-1 block">
            Sumber: {rateInfo?.source === "manual" ? "Override Admin" : "open.er-api.com"}
          </span>
        </div>

        {/* Example calculation preview */}
        <div className="p-4 rounded-xl bg-[#191815] border border-[#242320]">
          <span className="text-[10px] uppercase tracking-wider text-[#8c8680] block">Simulasi Rp 350.000</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm font-semibold text-emerald-400">
              {rateInfo
                ? formatRupiah(Math.ceil(((350000 / 10000) * rateInfo.usdToIdr) / 5000) * 5000)
                : "..."}
            </span>
            <span className="text-[10px] text-[#8c8680]">untuk pembeli US</span>
          </div>
          <span className="text-[10px] text-[#8c8680] mt-1 block">
            35 USD × {rateInfo ? Math.round(rateInfo.usdToIdr).toLocaleString("id-ID") : "..."} (kelipatan 5.000)
          </span>
        </div>
      </div>

      {/* Manual Override Form */}
      {isEditing && (
        <div className="mt-4 p-4 rounded-xl bg-[#191815] border border-[#383530] space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1 w-full sm:w-auto">
              <label className="text-[11px] font-medium text-[#dedad3] block mb-1">
                Tetapkan Nilai Kurs Manual (IDR per 1 USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8c8680]">Rp</span>
                <input
                  type="number"
                  value={overrideInput}
                  onChange={(e) => setOverrideInput(e.target.value)}
                  placeholder="Contoh: 17500"
                  className="w-full bg-[#12110f] border border-[#2c2a26] focus:border-amber-500/60 rounded-xl pl-9 pr-4 py-2 text-sm text-[#f4f2ee] font-mono outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 sm:pt-5 w-full sm:w-auto">
              <button
                onClick={handleSaveOverride}
                disabled={saving}
                className="flex-1 sm:flex-initial px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Kurs"}
              </button>

              {rateInfo?.isOverride && (
                <button
                  onClick={handleClearOverride}
                  disabled={saving}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#252320] hover:bg-[#2e2c28] text-rose-300 text-xs rounded-xl border border-rose-500/20 transition-colors disabled:opacity-50"
                  title="Hapus override dan gunakan kurs otomatis dari API"
                >
                  <RotateCcw size={12} />
                  <span>Kembali Otomatis</span>
                </button>
              )}
            </div>
          </div>
          <p className="text-[10px] text-[#8c8680]">
            Saat override aktif, sistem tidak akan menggunakan kurs API sampai Anda membatalkan override atau me-refresh manual.
          </p>
        </div>
      )}
    </div>
  );
}
