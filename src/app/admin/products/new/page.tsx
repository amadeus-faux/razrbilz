"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
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
  const [isActive, setIsActive] = useState(true);
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
      setSubmitting(false);
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
          isActive,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Gagal menyimpan produk ke database");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 text-[#9c968f] hover:text-[#f4f2ee] hover:bg-[#1c1b18] rounded-xl transition-colors inline-flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f4f2ee]">Tambah Produk Baru</h1>
          <p className="text-xs text-[#8c8680] mt-0.5">
            Tambahkan produk baru ke katalog toko RAZRBILZ
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#141412] border border-[#242320] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
      >
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9c968f] mb-2">
            Nama Produk <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="misal: EQUATOR HEAVY TEE"
            className="w-full px-4 py-3 bg-[#1c1b18] border border-[#2e2c28] rounded-xl text-sm text-[#f4f2ee] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-[#5a5650]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9c968f] mb-2">
              Harga (IDR) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              required
              min={0}
              step={1000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-4 py-3 bg-[#1c1b18] border border-[#2e2c28] rounded-xl text-sm text-[#f4f2ee] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9c968f] mb-2">
              Kategori <span className="text-rose-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-[#1c1b18] border border-[#2e2c28] rounded-xl text-sm text-[#f4f2ee] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all cursor-pointer"
            >
              <option value="T-Shirts" className="bg-[#1c1b18] text-white">T-Shirts</option>
              <option value="Jackets" className="bg-[#1c1b18] text-white">Jackets</option>
              <option value="Hoodies" className="bg-[#1c1b18] text-white">Hoodies</option>
              <option value="Pants" className="bg-[#1c1b18] text-white">Pants</option>
              <option value="Accessories" className="bg-[#1c1b18] text-white">Accessories</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9c968f] mb-2">
            Deskripsi Singkat
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Material katun 280 gsm heavyweight, potongan boxy fit unisex..."
            className="w-full px-4 py-3 bg-[#1c1b18] border border-[#2e2c28] rounded-xl text-sm text-[#f4f2ee] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all resize-none placeholder:text-[#5a5650]"
          />
        </div>

        {/* Stok Ukuran */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9c968f] mb-2">
            Stok per Ukuran
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sizes.map(({ size, stock }) => (
              <div key={size} className="p-3 bg-[#1c1b18] border border-[#2e2c28] rounded-xl space-y-1.5">
                <span className="text-xs font-semibold text-[#dedad3] block">{size}</span>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => handleStockChange(size, Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-[#141412] border border-[#2e2c28] rounded-lg text-xs text-[#f4f2ee] focus:outline-none focus:border-white/40"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Foto Produk */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9c968f] mb-2">
            Foto Produk (Minimal 1) <span className="text-rose-400">*</span>
          </label>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Status Aktif */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded border-[#2e2c28] bg-[#1c1b18] text-white focus:ring-0 cursor-pointer"
          />
          <label htmlFor="isActive" className="text-xs font-medium text-[#dedad3] cursor-pointer">
            Tampilkan produk di etalase toko (Aktif)
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-white text-black font-semibold text-xs tracking-wider uppercase rounded-xl hover:bg-neutral-200 active:scale-[0.99] disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/30 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 size={15} className="animate-spin text-black" />
              <span>MENYIMPAN PRODUK...</span>
            </>
          ) : (
            <>
              <Plus size={15} strokeWidth={2.5} />
              <span>SIMPAN KE KATALOG</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
