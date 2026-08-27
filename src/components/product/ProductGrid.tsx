"use client";

import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
}

interface ProductGridProps {
  products: Product[];
}

/** Tentukan jumlah kolom maksimal berdasarkan paritas jumlah produk */
function getMaxCols(count: number, isDesktop: boolean): number {
  const isEven = count % 2 === 0;
  if (isDesktop) return isEven ? 4 : 3;
  return isEven ? 2 : 3;
}

/**
 * Hitung grid-column-start untuk tiap item.
 * - Kalau semua produk muat dalam satu baris (count <= cols), center seluruh baris itu.
 * - Kalau ada baris terakhir yang gak penuh, center baris sisa itu saja.
 * - 0 berarti "auto" (posisi normal, gak perlu di-geser).
 */
function getColStarts(count: number, cols: number): number[] {
  const starts = new Array(count).fill(0);
  const remainder = count % cols;

  if (remainder === 0) return starts; // pas penuh, gak perlu digeser

  if (count <= cols) {
    // Semua produk muat 1 baris — center seluruh barisnya
    const offset = Math.floor((cols - count) / 2);
    for (let i = 0; i < count; i++) starts[i] = offset + 1 + i;
  } else {
    // Cuma baris terakhir yang perlu di-center
    const offset = Math.floor((cols - remainder) / 2);
    const startIndex = count - remainder;
    for (let i = startIndex; i < count; i++) {
      starts[i] = offset + 1 + (i - startIndex);
    }
  }
  return starts;
}

export default function ProductGrid({ products }: ProductGridProps) {
  const count = products.length;

  const mobileCols = getMaxCols(count, false);
  const desktopCols = getMaxCols(count, true);

  const mobileStarts = getColStarts(count, mobileCols);
  const desktopStarts = getColStarts(count, desktopCols);

  const mobileColsClass = mobileCols === 3 ? "grid-cols-3" : "grid-cols-2";
  // "md:landscape:" = hanya aktif kalau lebar >=768px DAN orientasi landscape
  // (jadi tablet portrait tetap pakai logic mobile di atas)
  const desktopColsClass =
    desktopCols === 4 ? "md:landscape:grid-cols-4" : "md:landscape:grid-cols-3";

  return (
    <div
      className={`grid ${mobileColsClass} ${desktopColsClass} gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-14 lg:gap-x-10 lg:gap-y-16`}
      id="product-grid"
    >
      {products.map((product, index) => {
        const mStart = mobileStarts[index];
        const dStart = desktopStarts[index];

        return (
          <div
            key={product.id}
            className="[grid-column-start:var(--m-start)] md:landscape:[grid-column-start:var(--d-start)]"
            style={
              {
                "--m-start": mStart || "auto",
                "--d-start": dStart || "auto",
              } as React.CSSProperties
            }
          >
            <ProductCard
              name={product.name}
              slug={product.slug}
              image={product.images[0] || "/placeholder-product.svg"}
              index={index}
            />
          </div>
        );
      })}
    </div>
  );
}