import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Guide — RAZRBILZ",
  description: "Panduan ukuran pakaian unisex RAZRBILZ (S, M, L, XL)",
};

export default function SizeGuidePage() {
  const tShirtSizes = [
    { size: "S", chest: "52 cm", length: "70 cm", shoulder: "48 cm" },
    { size: "M", chest: "56 cm", length: "73 cm", shoulder: "50 cm" },
    { size: "L", chest: "60 cm", length: "76 cm", shoulder: "53 cm" },
    { size: "XL", chest: "64 cm", length: "79 cm", shoulder: "56 cm" },
  ];

  const hoodieSizes = [
    { size: "S", chest: "58 cm", length: "68 cm", sleeve: "60 cm" },
    { size: "M", chest: "62 cm", length: "71 cm", sleeve: "62 cm" },
    { size: "L", chest: "66 cm", length: "74 cm", sleeve: "64 cm" },
    { size: "XL", chest: "70 cm", length: "77 cm", sleeve: "66 cm" },
  ];

  const pantsSizes = [
    { size: "S", waist: "72-82 cm", hip: "106 cm", length: "100 cm" },
    { size: "M", waist: "76-88 cm", hip: "110 cm", length: "102 cm" },
    { size: "L", waist: "82-94 cm", hip: "114 cm", length: "104 cm" },
    { size: "XL", waist: "88-100 cm", hip: "118 cm", length: "106 cm" },
  ];

  return (
    <div className="space-y-10 pb-16">
      <div>
        <h1 className="text-label text-base">SIZE GUIDE</h1>
        <p className="text-xs text-muted mt-2">
          Semua produk RAZRBILZ dirancang dengan potongan unisex relaxed & boxy fit.
          Gunakan panduan tabel di bawah untuk memilih ukuran terbaik Anda.
        </p>
      </div>

      {/* T-Shirts */}
      <div className="space-y-3">
        <h2 className="text-label text-xs">T-SHIRTS (RELAXED FIT)</h2>
        <div className="border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="p-3">Ukuran</th>
                <th className="p-3">Lebar Dada</th>
                <th className="p-3">Panjang</th>
                <th className="p-3">Bahu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tShirtSizes.map((row) => (
                <tr key={row.size}>
                  <td className="p-3 text-foreground">{row.size}</td>
                  <td className="p-3">{row.chest}</td>
                  <td className="p-3">{row.length}</td>
                  <td className="p-3">{row.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hoodies */}
      <div className="space-y-3">
        <h2 className="text-label text-xs">HOODIES (OVERSIZED FIT)</h2>
        <div className="border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="p-3">Ukuran</th>
                <th className="p-3">Lebar Dada</th>
                <th className="p-3">Panjang</th>
                <th className="p-3">Lengan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hoodieSizes.map((row) => (
                <tr key={row.size}>
                  <td className="p-3 text-foreground">{row.size}</td>
                  <td className="p-3">{row.chest}</td>
                  <td className="p-3">{row.length}</td>
                  <td className="p-3">{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pants */}
      <div className="space-y-3">
        <h2 className="text-label text-xs">PANTS (WIDE FIT)</h2>
        <div className="border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="p-3">Ukuran</th>
                <th className="p-3">Pinggang</th>
                <th className="p-3">Pinggul</th>
                <th className="p-3">Panjang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pantsSizes.map((row) => (
                <tr key={row.size}>
                  <td className="p-3 text-foreground">{row.size}</td>
                  <td className="p-3">{row.waist}</td>
                  <td className="p-3">{row.hip}</td>
                  <td className="p-3">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
