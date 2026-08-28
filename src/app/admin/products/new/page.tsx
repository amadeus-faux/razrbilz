"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";
import ImageUploader from "@/components/admin/ImageUploader";

export default function NewProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(350000);
  const [category, setCategory] = useState("T-Shirts");
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState([
    { size: "S", stock: 10 },
    { size: "M", stock: 20 },
    { size: "L", stock: 15 },
    { size: "XL", stock: 5 },
  ]);

  function handleStockChange(size: string, stock: number) {
    setSizes(
      sizes.map((s) => (s.size === size ? { ...s, stock: Math.max(0, stock) } : s))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    if (images.length === 0) {
      alert("Tambahkan minimal 1 foto produk.");
      return;
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slugify(name),
          description,
          price: Number(price),
          category,
          images,
          sizes,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan produk");
      }

      router.push("/admin/products");
    } catch {
      alert("Gagal menambahkan produk (Database belum terhubung).");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-1 text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold">Tambah Produk</h1>
          <p className="text-xs text-muted mt-0.5">
            Tambahkan produk baru ke katalog RAZRBILZ
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-border p-6 space-y-6"
      >
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-1.5">
            Nama Produk
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="misal: EQUATOR TEE"
            className="w-full p-2.5 border border-border text-sm focus:outline-none focus:border-foreground"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-1.5">
              Harga (IDR)
            </label>
            <input
              type="number"
              required
              min={0}
              step={1}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2.5 border border-border text-sm focus:outline-none focus:border-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-1.5">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 border border-border text-sm focus:outline-none focus:border-foreground bg-white"
            >
              <option value="T-Shirts">T-Shirts</option>
              <option value="Hoodies">Hoodies</option>
              <option value="Pants">Pants</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-1.5">
            Deskripsi
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi bahan, fitting, dan instruksi perawatan..."
            className="w-full p-2.5 border border-border text-sm focus:outline-none focus:border-foreground resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-1.5">
            Foto Produk
          </label>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Stock Per Size */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-2">
            Stok Per Ukuran
          </label>
          <div className="grid grid-cols-4 gap-3">
            {sizes.map((s) => (
              <div key={s.size} className="border border-border p-3 text-center">
                <span className="block text-xs font-semibold mb-1">{s.size}</span>
                <input
                  type="number"
                  min={0}
                  value={s.stock}
                  onChange={(e) =>
                    handleStockChange(s.size, Number(e.target.value))
                  }
                  className="w-full p-1.5 border border-border text-center text-xs focus:outline-none focus:border-foreground"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-foreground text-background text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              MENYIMPAN...
            </>
          ) : (
            "SIMPAN PRODUK"
          )}
        </button>
      </form>
    </div>
  );
}
