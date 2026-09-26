"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react";

export default function ProductActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal menghapus");

      setShowConfirm(false);
      router.refresh();
    } catch {
      alert("Gagal menghapus produk.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5 justify-end">
      <Link
        href={`/admin/products/${productId}/edit`}
        className="p-2 text-[#9c968f] hover:text-[#f4f2ee] hover:bg-[#22211e] rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
        aria-label="Edit produk"
        title="Edit Produk"
      >
        <Pencil size={15} strokeWidth={1.75} />
      </Link>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-2 text-[#9c968f] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
        aria-label="Hapus produk"
        title="Hapus Produk"
      >
        <Trash2 size={15} strokeWidth={1.75} />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-[#141412] border border-[#2a2825] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle size={18} />
              </div>
              <h2 className="text-sm font-semibold text-[#f4f2ee]">Hapus Produk Permanen?</h2>
            </div>

            <p className="text-xs text-[#9c968f] leading-relaxed">
              Produk akan <span className="text-rose-400 font-semibold">dihapus permanen</span> dari
              database dan tidak bisa dikembalikan. Riwayat pesanan yang mengandung produk ini{" "}
              <span className="text-[#dedad3] font-medium">tetap aman</span> — nama, ukuran, harga,
              dan foto saat transaksi sudah tersimpan di data pesanan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 text-xs font-medium text-[#9c968f] hover:text-[#f4f2ee] bg-[#1e1d1a] hover:bg-[#2a2826] border border-[#33312c] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                <span>{deleting ? "Menghapus..." : "Ya, Hapus Permanen"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
