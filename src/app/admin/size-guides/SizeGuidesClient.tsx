"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ruler,
  Plus,
  Trash2,
  Edit2,
  X,
  AlertTriangle,
  Loader2,
  Columns,
  Table as TableIcon,
  Sparkles,
  Eye,
  Check,
} from "lucide-react";

export interface SerializedSizeGuide {
  id: string;
  name: string;
  description: string | null;
  measurements: {
    columns?: string[];
    rows?: Record<string, string>[];
  };
  createdAt: string;
  updatedAt: string;
  productsCount: number;
  products: { id: string; name: string; slug: string }[];
}

interface SizeGuidesClientProps {
  initialSizeGuides: SerializedSizeGuide[];
}

const PRESETS = [
  {
    name: "T-Shirt / Kaos",
    description: "Panduan ukuran kaos relaxed boxy fit",
    columns: ["Size", "Lebar Dada (cm)", "Panjang (cm)", "Bahu (cm)"],
    rows: [
      { Size: "S", "Lebar Dada (cm)": "52", "Panjang (cm)": "70", "Bahu (cm)": "48" },
      { Size: "M", "Lebar Dada (cm)": "56", "Panjang (cm)": "73", "Bahu (cm)": "50" },
      { Size: "L", "Lebar Dada (cm)": "60", "Panjang (cm)": "76", "Bahu (cm)": "53" },
      { Size: "XL", "Lebar Dada (cm)": "64", "Panjang (cm)": "79", "Bahu (cm)": "56" },
    ],
  },
  {
    name: "Hoodie / Jaket",
    description: "Panduan ukuran hoodie & outerwear oversized",
    columns: ["Size", "Lebar Dada (cm)", "Panjang (cm)", "Lengan (cm)"],
    rows: [
      { Size: "S", "Lebar Dada (cm)": "58", "Panjang (cm)": "68", "Lengan (cm)": "60" },
      { Size: "M", "Lebar Dada (cm)": "62", "Panjang (cm)": "71", "Lengan (cm)": "62" },
      { Size: "L", "Lebar Dada (cm)": "66", "Panjang (cm)": "74", "Lengan (cm)": "64" },
      { Size: "XL", "Lebar Dada (cm)": "70", "Panjang (cm)": "77", "Lengan (cm)": "66" },
    ],
  },
  {
    name: "Celana / Pants",
    description: "Panduan ukuran celana wide fit",
    columns: ["Size", "Pinggang (cm)", "Pinggul (cm)", "Panjang (cm)"],
    rows: [
      { Size: "S", "Pinggang (cm)": "72-82", "Pinggul (cm)": "106", "Panjang (cm)": "100" },
      { Size: "M", "Pinggang (cm)": "76-88", "Pinggul (cm)": "110", "Panjang (cm)": "102" },
      { Size: "L", "Pinggang (cm)": "82-94", "Pinggul (cm)": "114", "Panjang (cm)": "104" },
      { Size: "XL", "Pinggang (cm)": "88-100", "Pinggul (cm)": "118", "Panjang (cm)": "106" },
    ],
  },
];

export default function SizeGuidesClient({ initialSizeGuides }: SizeGuidesClientProps) {
  const router = useRouter();
  const [guides, setGuides] = useState<SerializedSizeGuide[]>(initialSizeGuides);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<SerializedSizeGuide | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [columns, setColumns] = useState<string[]>(["Size", "Chest Width", "Length"]);
  const [rows, setRows] = useState<Record<string, string>[]>([
    { Size: "S", "Chest Width": "51 cm", Length: "53 cm" },
    { Size: "M", "Chest Width": "53 cm", Length: "55 cm" },
    { Size: "L", "Chest Width": "55 cm", Length: "58 cm" },
    { Size: "XL", "Chest Width": "58 cm", Length: "60 cm" },
  ]);
  const [newColumnName, setNewColumnName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  // Delete modal state
  const [guideToDelete, setGuideToDelete] = useState<SerializedSizeGuide | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Preview modal for viewing from list
  const [previewGuide, setPreviewGuide] = useState<SerializedSizeGuide | null>(null);

  function openCreateModal() {
    setEditingGuide(null);
    setName("");
    setDescription("");
    setColumns(["Size", "Lebar Dada", "Panjang"]);
    setRows([
      { Size: "S", "Lebar Dada": "52 cm", Panjang: "70 cm" },
      { Size: "M", "Lebar Dada": "56 cm", Panjang: "73 cm" },
      { Size: "L", "Lebar Dada": "60 cm", Panjang: "76 cm" },
      { Size: "XL", "Lebar Dada": "64 cm", Panjang: "79 cm" },
    ]);
    setNewColumnName("");
    setViewMode("edit");
    setIsModalOpen(true);
  }

  function openEditModal(guide: SerializedSizeGuide) {
    setEditingGuide(guide);
    setName(guide.name);
    setDescription(guide.description || "");
    const existingCols = guide.measurements.columns && guide.measurements.columns.length > 0
      ? [...guide.measurements.columns]
      : ["Size", "Chest Width", "Length"];
    const existingRows = guide.measurements.rows && guide.measurements.rows.length > 0
      ? guide.measurements.rows.map((r) => ({ ...r }))
      : [];
    setColumns(existingCols);
    setRows(existingRows);
    setNewColumnName("");
    setViewMode("edit");
    setIsModalOpen(true);
  }

  function applyPreset(presetIndex: number) {
    const p = PRESETS[presetIndex];
    if (!p) return;
    if (!name || name.trim() === "" || PRESETS.some((prev) => prev.name === name)) {
      setName(p.name);
    }
    if (!description || description.trim() === "" || PRESETS.some((prev) => prev.description === description)) {
      setDescription(p.description);
    }
    setColumns([...p.columns]);
    setRows(p.rows.map((r) => ({ ...r })));
  }

  function handleAddColumn() {
    const trimmed = newColumnName.trim();
    if (!trimmed) return;
    if (columns.includes(trimmed)) {
      alert("Nama kolom sudah ada.");
      return;
    }
    const updatedCols = [...columns, trimmed];
    setColumns(updatedCols);
    // Add key to all rows
    setRows(rows.map((r) => ({ ...r, [trimmed]: "" })));
    setNewColumnName("");
  }

  function handleDeleteColumn(colName: string) {
    if (columns.length <= 1) {
      alert("Tabel minimal harus memiliki 1 kolom.");
      return;
    }
    if (!confirm(`Hapus kolom "${colName}"?`)) return;
    const updatedCols = columns.filter((c) => c !== colName);
    setColumns(updatedCols);
    setRows(
      rows.map((r) => {
        const next = { ...r };
        delete next[colName];
        return next;
      })
    );
  }

  function handleColumnRename(index: number, newName: string) {
    const oldName = columns[index];
    if (!newName.trim() || oldName === newName) return;
    if (columns.some((c, i) => i !== index && c.toLowerCase() === newName.trim().toLowerCase())) {
      alert("Nama kolom tidak boleh duplikat.");
      return;
    }
    const trimmed = newName.trim();
    const updatedCols = [...columns];
    updatedCols[index] = trimmed;
    setColumns(updatedCols);
    setRows(
      rows.map((r) => {
        const next = { ...r };
        const val = next[oldName] ?? "";
        delete next[oldName];
        next[trimmed] = val;
        return next;
      })
    );
  }

  function handleAddRow() {
    const newRow: Record<string, string> = {};
    columns.forEach((c) => {
      newRow[c] = "";
    });
    setRows([...rows, newRow]);
  }

  function handleDeleteRow(index: number) {
    setRows(rows.filter((_, i) => i !== index));
  }

  function handleCellChange(rowIndex: number, colName: string, val: string) {
    const updated = [...rows];
    updated[rowIndex] = { ...updated[rowIndex], [colName]: val };
    setRows(updated);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      alert("Nama size guide wajib diisi.");
      return;
    }
    if (columns.length === 0) {
      alert("Harus ada minimal 1 kolom.");
      return;
    }
    if (rows.length === 0) {
      alert("Harus ada minimal 1 baris ukuran.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        measurements: {
          columns,
          rows,
        },
      };

      if (editingGuide) {
        const res = await fetch(`/api/admin/size-guides/${editingGuide.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Gagal memperbarui size guide");
        }
        const data = await res.json();
        setGuides((prev) =>
          prev.map((g) =>
            g.id === editingGuide.id
              ? {
                  ...g,
                  name: data.sizeGuide.name,
                  description: data.sizeGuide.description,
                  measurements: data.sizeGuide.measurements,
                  updatedAt: new Date().toISOString(),
                }
              : g
          )
        );
      } else {
        const res = await fetch("/api/admin/size-guides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Gagal menambahkan size guide");
        }
        const data = await res.json();
        const created: SerializedSizeGuide = {
          id: data.sizeGuide.id,
          name: data.sizeGuide.name,
          description: data.sizeGuide.description,
          measurements: data.sizeGuide.measurements,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          productsCount: 0,
          products: [],
        };
        setGuides((prev) => [created, ...prev]);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!guideToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/size-guides/${guideToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal menghapus size guide");
      }
      setGuides((prev) => prev.filter((g) => g.id !== guideToDelete.id));
      setGuideToDelete(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus size guide");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Ruler size={16} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f4f2ee]">Size Guide</h1>
          </div>
          <p className="text-xs text-[#8c8680] mt-1.5">
            Kelola template dan tabel panduan ukuran yang dapat dipasangkan ke berbagai produk
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-all inline-flex items-center gap-2 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Tambah Size Guide</span>
        </button>
      </div>

      {/* Guide List / Table */}
      <div className="bg-[#141412] border border-[#242320] rounded-2xl overflow-hidden shadow-sm">
        {guides.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1c1b18] border border-white/5 flex items-center justify-center mx-auto text-[#8c8680]">
              <Ruler size={22} strokeWidth={1.5} />
            </div>
            <p className="text-sm text-[#dedad3] font-medium">Belum ada Size Guide yang dibuat</p>
            <p className="text-xs text-[#8c8680] max-w-sm mx-auto">
              Buat panduan ukuran pertama Anda agar pembeli dapat melihat tabel ukuran detail di halaman produk.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-2 px-4 py-2 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus size={14} />
              <span>Buat Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#181715] border-b border-[#242320] text-[#8c8680] uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3.5 px-5">Nama & Deskripsi</th>
                  <th className="py-3.5 px-5">Kolom Ukuran</th>
                  <th className="py-3.5 px-5">Jumlah Baris</th>
                  <th className="py-3.5 px-5">Dipakai Produk</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201f1c]">
                {guides.map((guide) => {
                  const cols = guide.measurements.columns || [];
                  const rowCount = guide.measurements.rows?.length || 0;
                  return (
                    <tr key={guide.id} className="hover:bg-[#1a1917]/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-sm text-[#f4f2ee]">{guide.name}</div>
                        {guide.description && (
                          <div className="text-[11px] text-[#8c8680] mt-0.5 line-clamp-1">
                            {guide.description}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap gap-1.5">
                          {cols.map((col, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-[#1c1b18] border border-white/5 text-[10px] text-[#c4c0b8]"
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-[#c4c0b8]">
                        <span className="font-mono">{rowCount}</span> ukuran (baris)
                      </td>
                      <td className="py-4 px-5">
                        {guide.productsCount > 0 ? (
                          <div className="group relative inline-block">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              {guide.productsCount} produk
                            </span>
                            {/* Tooltip listing products */}
                            <div className="hidden group-hover:block absolute left-0 top-full mt-1.5 z-30 p-2.5 bg-[#1f1e1a] border border-[#2e2c28] rounded-xl text-[11px] text-[#dedad3] shadow-xl w-48 space-y-1">
                              <div className="text-[10px] text-[#8c8680] font-semibold uppercase tracking-wider">
                                Digunakan di:
                              </div>
                              {guide.products.map((p) => (
                                <div key={p.id} className="truncate hover:text-white">
                                  • {p.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[#68635c] text-[11px]">Belum digunakan</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewGuide(guide)}
                            title="Pratinjau Tabel"
                            className="p-2 text-[#9c968f] hover:text-[#f4f2ee] hover:bg-[#1c1b18] rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => openEditModal(guide)}
                            title="Edit Size Guide"
                            className="p-2 text-[#9c968f] hover:text-[#f4f2ee] hover:bg-[#1c1b18] rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setGuideToDelete(guide)}
                            title="Hapus Size Guide"
                            className="p-2 text-[#9c968f] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-[#141412] border border-[#242320] rounded-2xl shadow-2xl p-6 sm:p-7 max-h-[92vh] flex flex-col overflow-hidden animate-popInCenter">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#242320] shrink-0">
              <div className="flex items-center gap-2.5">
                <Ruler size={18} className="text-[#dedad3]" />
                <h2 className="text-base font-bold text-[#f4f2ee]">
                  {editingGuide ? "Edit Size Guide" : "Tambah Size Guide Baru"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#9c968f] hover:text-white rounded-lg hover:bg-[#1c1b18] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center justify-between mt-4 pb-2 shrink-0">
              {/* Presets */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-[#8c8680] text-[11px] font-medium flex items-center gap-1 shrink-0">
                  <Sparkles size={12} className="text-amber-400" /> Template Cepat:
                </span>
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(idx)}
                    className="px-2.5 py-1 rounded-lg bg-[#1c1b18] border border-[#2e2c28] text-[11px] text-[#dedad3] hover:text-white hover:border-white/30 transition-all shrink-0 cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* View/Edit Toggle */}
              <div className="flex items-center bg-[#1c1b18] rounded-lg p-0.5 border border-[#2e2c28]">
                <button
                  type="button"
                  onClick={() => setViewMode("edit")}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                    viewMode === "edit"
                      ? "bg-[#282724] text-white shadow-sm"
                      : "text-[#8c8680] hover:text-[#dedad3]"
                  }`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("preview")}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                    viewMode === "preview"
                      ? "bg-[#282724] text-white shadow-sm"
                      : "text-[#8c8680] hover:text-[#dedad3]"
                  }`}
                >
                  Pratinjau
                </button>
              </div>
            </div>

            {/* Modal Body / Scrollable Content */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-1 space-y-5 mt-2">
              {viewMode === "edit" ? (
                <>
                  {/* Name and Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#9c968f] mb-1.5">
                        Nama Size Guide <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="misal: Size Guide Baju Regular Fit"
                        className="w-full px-3.5 py-2.5 bg-[#1c1b18] border border-[#2e2c28] rounded-xl text-xs text-[#f4f2ee] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-[#5a5650]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#9c968f] mb-1.5">
                        Keterangan / Catatan (Opsional)
                      </label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="misal: Potongan boxy fit unisex, toleransi 1-2 cm"
                        className="w-full px-3.5 py-2.5 bg-[#1c1b18] border border-[#2e2c28] rounded-xl text-xs text-[#f4f2ee] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-[#5a5650]"
                      />
                    </div>
                  </div>

                  {/* Columns Builder */}
                  <div className="p-4 rounded-xl bg-[#181715] border border-[#242320] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Columns size={15} className="text-[#8c8680]" />
                        <span className="text-xs font-semibold text-[#dedad3] uppercase tracking-wider">
                          Kelola Kolom Tabel ({columns.length} kolom)
                        </span>
                      </div>
                      {/* Add column input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newColumnName}
                          onChange={(e) => setNewColumnName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddColumn();
                            }
                          }}
                          placeholder="Nama kolom baru..."
                          className="px-3 py-1.5 bg-[#1c1b18] border border-[#2e2c28] rounded-lg text-xs text-[#f4f2ee] placeholder:text-[#5a5650] focus:outline-none focus:border-white/40"
                        />
                        <button
                          type="button"
                          onClick={handleAddColumn}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#f4f2ee] rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Plus size={13} />
                          <span>Tambah Kolom</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {columns.map((col, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#201f1c] border border-white/10 text-xs"
                        >
                          <input
                            type="text"
                            defaultValue={col}
                            onBlur={(e) => handleColumnRename(idx, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.currentTarget.blur();
                              }
                            }}
                            title="Klik untuk mengubah nama kolom"
                            className="bg-transparent text-[#f4f2ee] font-medium text-xs focus:outline-none focus:bg-[#2b2a26] rounded px-1 w-24 sm:w-auto"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteColumn(col)}
                            title="Hapus kolom"
                            className="text-[#8c8680] hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Table Rows */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TableIcon size={15} className="text-[#8c8680]" />
                        <span className="text-xs font-semibold text-[#dedad3] uppercase tracking-wider">
                          Isi Baris Ukuran
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddRow}
                        className="px-3 py-1.5 bg-white text-black rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus size={13} strokeWidth={2.5} />
                        <span>Tambah Baris Ukuran</span>
                      </button>
                    </div>

                    <div className="border border-[#242320] rounded-xl overflow-x-auto bg-[#181715]">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-[#1e1d1a] border-b border-[#242320] text-[#8c8680] uppercase tracking-wider font-semibold text-[10px]">
                            <th className="py-2.5 px-3 text-center w-10">#</th>
                            {columns.map((c, i) => (
                              <th key={i} className="py-2.5 px-3 text-left">
                                {c}
                              </th>
                            ))}
                            <th className="py-2.5 px-3 text-center w-12">Hapus</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#242320]">
                          {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-[#1a1917]">
                              <td className="py-2 px-3 text-center text-[#736e67] font-mono text-[11px]">
                                {rowIndex + 1}
                              </td>
                              {columns.map((col, colIndex) => (
                                <td key={colIndex} className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row[col] ?? ""}
                                    onChange={(e) =>
                                      handleCellChange(rowIndex, col, e.target.value)
                                    }
                                    placeholder={colIndex === 0 ? "misal: S / 28" : "misal: 52 cm"}
                                    className="w-full px-2.5 py-1.5 bg-[#141412] border border-[#2b2a26] rounded-md text-xs text-[#f4f2ee] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-[#45423d]"
                                  />
                                </td>
                              ))}
                              <td className="py-2 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRow(rowIndex)}
                                  className="p-1 text-[#8c8680] hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                                  title="Hapus baris"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                /* LIVE PREVIEW */
                <div className="space-y-4 py-2">
                  <div className="p-5 rounded-2xl bg-surface border border-border max-w-md mx-auto shadow-xl">
                    <div className="flex items-center justify-center pb-3 border-b border-border mb-4">
                      <div className="flex items-center gap-2">
                        <Ruler size={14} strokeWidth={1.5} className="text-muted" />
                        <span className="text-[11px] tracking-widest uppercase font-semibold text-foreground">
                          {name || "Size Guide"}
                        </span>
                      </div>
                    </div>
                    {description && (
                      <p className="text-[11px] text-muted text-center mb-4 leading-relaxed">
                        {description}
                      </p>
                    )}
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          {columns.map((col, i) => (
                            <th
                              key={i}
                              className={`pb-2.5 text-[10px] tracking-widest text-muted uppercase ${
                                i === 0 ? "text-left" : "text-center"
                              }`}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {columns.map((col, cIdx) => (
                              <td
                                key={cIdx}
                                className={`py-3 ${
                                  cIdx === 0
                                    ? "text-foreground font-medium"
                                    : "text-center text-muted"
                                }`}
                              >
                                {row[col] || "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-center text-xs text-[#8c8680]">
                    Tampilan di atas adalah simulasi modal yang dilihat pembeli di toko.
                  </p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#242320] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#2e2c28] text-xs font-semibold text-[#dedad3] hover:bg-[#1c1b18] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-white text-black rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 disabled:opacity-40 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-black" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} strokeWidth={2.5} />
                      <span>{editingGuide ? "Simpan Perubahan" : "Buat Size Guide"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PREVIEW MODAL ── */}
      {previewGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#141412] border border-[#242320] rounded-2xl p-6 shadow-2xl animate-popInCenter">
            <div className="flex items-center justify-between pb-3 border-b border-[#242320] mb-4">
              <div className="flex items-center gap-2">
                <Ruler size={16} className="text-[#dedad3]" />
                <h3 className="text-sm font-bold text-[#f4f2ee]">{previewGuide.name}</h3>
              </div>
              <button
                onClick={() => setPreviewGuide(null)}
                className="p-1 text-[#8c8680] hover:text-white rounded transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            {previewGuide.description && (
              <p className="text-xs text-[#8c8680] mb-4 leading-relaxed">
                {previewGuide.description}
              </p>
            )}
            <div className="border border-[#242320] rounded-xl overflow-hidden bg-[#181715]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#1e1d1a] border-b border-[#242320] text-[#8c8680] uppercase tracking-wider text-[10px]">
                    {(previewGuide.measurements.columns || []).map((col, idx) => (
                      <th
                        key={idx}
                        className={`py-2.5 px-3.5 ${idx === 0 ? "text-left" : "text-center"}`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242320]">
                  {(previewGuide.measurements.rows || []).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#1a1917]">
                      {(previewGuide.measurements.columns || []).map((col, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-2.5 px-3.5 ${
                            cIdx === 0
                              ? "text-[#f4f2ee] font-medium"
                              : "text-center text-[#dedad3]"
                          }`}
                        >
                          {row[col] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setPreviewGuide(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#dedad3] rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE WARNING / CONFIRM MODAL ── */}
      {guideToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#141412] border border-[#242320] rounded-2xl p-6 shadow-2xl animate-popInCenter">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  guideToDelete.productsCount > 0
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                }`}
              >
                <AlertTriangle size={20} />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-base font-bold text-[#f4f2ee]">
                  {guideToDelete.productsCount > 0
                    ? "Peringatan: Size Guide Masih Digunakan"
                    : "Hapus Size Guide?"}
                </h3>
                <p className="text-xs text-[#8c8680] leading-relaxed">
                  Apakah Anda yakin ingin menghapus{" "}
                  <strong className="text-[#dedad3]">&quot;{guideToDelete.name}&quot;</strong>?
                </p>
              </div>
            </div>

            {/* Warning if products are currently using this guide */}
            {guideToDelete.productsCount > 0 && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                <p className="text-amber-300 font-semibold">
                  ⚠️ Size guide ini sedang digunakan oleh {guideToDelete.productsCount} produk:
                </p>
                <ul className="list-disc list-inside text-amber-200/80 space-y-0.5 max-h-28 overflow-y-auto pr-1">
                  {guideToDelete.products.map((p) => (
                    <li key={p.id} className="truncate">
                      {p.name}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-amber-300/70 pt-1 border-t border-amber-500/20">
                  Jika dihapus, produk di atas akan otomatis dilepas dari size guide ini dan kembali ke mode default tanpa size guide.
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setGuideToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-[#2e2c28] text-xs font-semibold text-[#dedad3] hover:bg-[#1c1b18] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-40"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
                    <span>Ya, Hapus Size Guide</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
