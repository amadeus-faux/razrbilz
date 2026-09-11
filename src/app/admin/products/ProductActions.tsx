"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Loader2 } from "lucide-react";

export default function ProductActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal menghapus");
      if (data.softDeleted) alert(data.message);

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
        onClick={handleDelete}
        disabled={deleting}
        className="p-2 text-[#9c968f] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center justify-center cursor-pointer"
        aria-label="Hapus produk"
        title="Hapus Produk"
      >
        {deleting ? <Loader2 size={15} className="animate-spin text-rose-400" /> : <Trash2 size={15} strokeWidth={1.75} />}
      </button>
    </div>
  );
}