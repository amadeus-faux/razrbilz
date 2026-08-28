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
        <div className="flex items-center gap-2 justify-end">
            <Link
                href={`/admin/products/${productId}/edit`}
                className="p-1.5 text-muted hover:text-foreground hover:bg-surface rounded transition-colors"
                aria-label="Edit produk"
            >
                <Pencil size={14} />
            </Link>
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                aria-label="Hapus produk"
            >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
        </div>
    );
}