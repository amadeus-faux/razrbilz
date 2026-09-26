"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Trash2, ShieldAlert, CheckCircle2 } from "lucide-react";

const CONFIRM_WORD = "RESET";

export default function ResetDataButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canSubmit = typed.trim() === CONFIRM_WORD && !loading;

  function openDialog() {
    setTyped("");
    setError(null);
    setSuccess(null);
    setOpen(true);
  }

  function closeDialog() {
    if (loading) return;
    setOpen(false);
  }

  async function handleReset() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: typed.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mereset data.");
      }

      const d = data.deleted || {};
      setSuccess(
        `Berhasil. Terhapus permanen: ${d.products ?? 0} produk, ${d.orders ?? 0} pesanan, ` +
          `${d.orderItems ?? 0} item pesanan, ${d.shippingLogs ?? 0} log pengiriman. Total pendapatan kini Rp0.`
      );
      setTyped("");
      // Segarkan dashboard agar menampilkan kondisi kosong (bukan cache lama).
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mereset data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mt-8 bg-[#141412] border border-rose-500/20 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <ShieldAlert size={18} />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-[#f4f2ee]">Zona Berbahaya — Reset Data</h2>
            <p className="text-xs text-[#8c8680] mt-1 leading-relaxed max-w-2xl">
              Menghapus <span className="text-rose-400 font-medium">permanen</span> semua data Produk
              dan Pesanan Masuk (termasuk item pesanan & log pengiriman), dan mereset total pendapatan
              ke Rp0. Akun admin, konfigurasi Size Guide, dan pengaturan kurs <span className="text-[#dedad3]">tidak</span> dihapus.
              Tindakan ini <span className="text-rose-400 font-medium">tidak bisa dibatalkan</span>.
            </p>
            <button
              onClick={openDialog}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer shadow-sm"
            >
              <Trash2 size={14} />
              <span>Reset Semua Data Produk & Pesanan</span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md bg-[#141412] border border-[#2a2825] rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#f4f2ee]">Konfirmasi Reset Permanen</h2>
                <p className="text-[11px] text-rose-400/90 font-medium">TIDAK ADA UNDO / TIDAK BISA DIBATALKAN</p>
              </div>
            </div>

            {success ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                  <span>{success}</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-full py-3 text-xs font-semibold rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-xs text-[#9c968f] leading-relaxed space-y-2">
                  <p className="font-semibold text-[#dedad3]">Yang AKAN dihapus permanen:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Semua data Produk (beserta ukuran/stok per produk)</li>
                    <li>Semua Pesanan Masuk (Order & OrderItem)</li>
                    <li>Log pengiriman terkait pesanan (ShippingLog)</li>
                    <li>Total pendapatan kembali menjadi Rp0</li>
                  </ul>
                  <p className="font-semibold text-[#dedad3] pt-1">Yang TIDAK dihapus:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Akun admin / user</li>
                    <li>Konfigurasi Size Guide</li>
                    <li>Pengaturan kurs mata uang & lainnya</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8c8680] font-medium mb-2">
                    Ketik <span className="text-rose-400 font-bold">{CONFIRM_WORD}</span> untuk mengonfirmasi
                  </label>
                  <input
                    type="text"
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    placeholder={CONFIRM_WORD}
                    autoComplete="off"
                    className="w-full px-4 py-3 bg-[#1a1917] border border-[#2e2c28] rounded-xl text-sm text-[#f4f2ee] focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition-all placeholder:text-[#5a5650] font-mono tracking-widest"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs leading-relaxed">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={closeDialog}
                    disabled={loading}
                    className="px-4 py-2.5 text-xs font-medium text-[#9c968f] hover:text-[#f4f2ee] bg-[#1e1d1a] hover:bg-[#2a2826] border border-[#33312c] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={!canSubmit}
                    className="px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    <span>{loading ? "Mereset..." : "Ya, Hapus Permanen Semua"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
