"use client";

import { DIMENSION_MAX_CM, DIMENSION_MIN_CM } from "@/lib/package-dimensions";

export interface DimensionDraft {
  lengthCm: string;
  widthCm: string;
  heightCm: string;
}

interface DimensionFieldsProps {
  value: DimensionDraft;
  onChange: (next: DimensionFieldsProps["value"]) => void;
}

const FIELDS: { key: keyof DimensionDraft; label: string; placeholder: string }[] = [
  { key: "lengthCm", label: "Panjang", placeholder: "mis. 32" },
  { key: "widthCm", label: "Lebar", placeholder: "mis. 25" },
  { key: "heightCm", label: "Tinggi", placeholder: "mis. 6" },
];

/**
 * Diukur pada kemasan siap kirim (plastik + isi), bukan pada badan produk.
 * Biteship menjumlah volume seluruh baris item, jadi angka per unit harus
 * mencerminkan tempat produk itu benar-benar duduk di dalam paket.
 */
export default function DimensionFields({ value, onChange }: DimensionFieldsProps) {
  const filled = FIELDS.filter((f) => value[f.key].trim() !== "").length;
  const complete = filled === FIELDS.length;

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#9c968f] mb-2">
        Dimensi Kemasan per Unit (cm)
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <input
              type="number"
              min={DIMENSION_MIN_CM}
              max={DIMENSION_MAX_CM}
              step={1}
              inputMode="numeric"
              value={value[f.key]}
              onChange={(e) => onChange({ ...value, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              aria-label={`Dimensi ${f.label} (cm)`}
              className="w-full px-4 py-3 bg-[#1c1b18] border border-[#2e2c28] rounded-xl text-sm text-[#f4f2ee] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-[#5a5650]"
            />
            <p className="text-[11px] text-[#736e67] mt-1.5">{f.label}</p>
          </div>
        ))}
      </div>

      {complete ? (
        <p className="text-[11px] text-[#736e67] mt-1.5">
          Biteship menghitung berat volumetrik dari dimensi ini dan memakainya bila
          lebih besar dari berat aktual. Isi {DIMENSION_MIN_CM}&ndash;{DIMENSION_MAX_CM} cm.
        </p>
      ) : (
        <p className="text-[11px] text-amber-400/90 mt-1.5">
          {filled === 0
            ? "Belum diisi \u2014 ongkir produk ini hanya dihitung dari berat."
            : "Belum lengkap (ketiganya harus terisi) \u2014 dimensi ini belum dipakai."}{" "}
          Paket besar tapi ringan (jaket, hoodie) berisiko kurang tagih bila tanpa
          dimensi.
        </p>
      )}
    </div>
  );
}
