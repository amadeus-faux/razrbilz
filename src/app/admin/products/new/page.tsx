"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Ruler } from "lucide-react";
import { slugify, formatRupiah } from "@/lib/utils";
import { resolveDisplayPrice } from "@/lib/pricing";
import ImageUploader from "@/components/admin/ImageUploader";

export default function NewProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(350000);
  const [stock, setStock] = useState<number>(50);
  const [category, setCategory] = useState("T-Shirts");
  const [images, setImages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isPreOrder, setIsPreOrder] = useState(true);
  const [availableSizes, setAvailableSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [sizeGuideId, setSizeGuideId] = useState<string>("");
  const [sizeGuides, setSizeGuides] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/size-guides")
      .then((res) => res.json())
      .then((data) => {
        if (data.sizeGuides) {
          setSizeGuides(data.sizeGuides);
        }
      })
      .catch((err) => console.error("Error loading size guides:", err));
  }, []);

  const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

  function toggleSize(size: string) {
    if (availableSizes.includes(size)) {
      if (availableSizes.length === 1) {
        alert("Produk minimal harus memiliki 1 ukuran tersedia.");
        return;
      }
      setAvailableSizes(availableSizes.filter((s) => s !== size));
    } else {
      setAvailableSizes([...availableSizes, size]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    if (images.length === 0) {
      alert("Tambahkan minimal 1 foto produk.");
      setSubmitting(false);
      return;
    }

    if (availableSizes.length === 0) {
      alert("Pilih minimal 1 ukuran yang tersedia.");
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
          stock: Math.max(0, Number(stock) || 0),
          category,
          images,
          sizes: availableSizes.map((s) => ({ size: s })),
          sizeGuideId: sizeGuideId || null,
          isActive,
          isPreOrder,
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
              Harga Dasar (IDR) <span className="text-rose-400">*</span>
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
            <div className="mt-2 p-2.5 rounded-lg bg-[#191815] border border-[#272623] space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8c8680]">Harga Dasar:</span>
                <span className="text-[#dedad3] font-mono">{formatRupiah(price || 0)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-medium">Harga ke Customer:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {formatRupiah(resolveDisplayPrice(price || 0, "ID", 0))}
                </span>
              </div>
            </div>
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

        {/* Total Stok Produk */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9c968f] mb-2">
            Total Stok Produk (Pre-Order) <span className="text-rose-400">*</span>
          </label>
          <input
            type="number"
            required
            min={0}
            value={stock}
            onChange={(e) => setStock(Math.max(0, Number(e.target.value)))}
            placeholder="misal: 50"
            className="w-full px-4 py-3 bg-[#1c1b18] border border-[#2e2c28] rounded-xl text-sm text-[#f4f2ee] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-[#5a5650]"
          />
          <p className="text-[11px] text-[#736e67] mt-1.5">
            Stok berlaku untuk keseluruhan produk (gabungan semua ukuran). Pembeli dapat memilih ukuran mana pun selama total stok masih tersedia.
          </p>
        </div>

        {/* Pilihan Ukuran Tersedia */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9c968f] mb-2">
            Pilihan Ukuran yang Tersedia
          </label>
          <div className="flex flex-wrap gap-2.5">
            {ALL_SIZES.map((size) => {
              const isSelected = availableSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-white text-black border-white shadow-sm"
                      : "bg-[#1c1b18] text-[#8c8680] border-[#2e2c28] hover:text-[#dedad3] hover:border-[#3e3c38]"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-[#736e67] mt-1.5">
            Klik untuk mengaktifkan atau menonaktifkan ukuran yang dapat dipilih pembeli.
          </p>
        </div>

        {/* Pilihan Size Guide */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9c968f]">
              Size Guide (Panduan Ukuran)
            </label>
            <Link
              href="/admin/size-guides"
              target="_blank"
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Ruler size={12} />
              <span>Kelola Size Guide &rarr;</span>
            </Link>
          </div>
          <select
            value={sizeGuideId}
            onChange={(e) => setSizeGuideId(e.target.value)}
            className="w-full px-4 py-3 bg-[#1c1b18] border border-[#2e2c28] rounded-xl text-sm text-[#f4f2ee] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all cursor-pointer"
          >
            <option value="" className="bg-[#1c1b18] text-neutral-400">
              -- Tidak Ada (Sembunyikan Size Guide) --
            </option>
            {sizeGuides.map((guide) => (
              <option key={guide.id} value={guide.id} className="bg-[#1c1b18] text-white">
                {guide.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-[#736e67] mt-1.5">
            Pilih panduan ukuran yang akan ditampilkan pada modal &quot;Size Guide&quot; di halaman produk.
          </p>
        </div>

        {/* Foto Produk */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9c968f] mb-2">
            Foto Produk (Minimal 1) <span className="text-rose-400">*</span>
          </label>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Status Aktif & Pre-Order */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
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

          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <input
              type="checkbox"
              id="isPreOrder"
              checked={isPreOrder}
              onChange={(e) => setIsPreOrder(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-[#2e2c28] bg-[#1c1b18] text-purple-600 focus:ring-0 cursor-pointer"
            />
            <div>
              <label htmlFor="isPreOrder" className="text-xs font-semibold text-purple-200 cursor-pointer">
                Produk Pre-Order (Estimasi Produksi 14–21 Hari)
              </label>
              <p className="text-[11px] text-[#8c8680] mt-0.5">
                Pengiriman kurir Biteship akan ditunda otomatis sampai admin menekan tombol &quot;Tandai Siap Kirim&quot;.
              </p>
            </div>
          </div>
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
