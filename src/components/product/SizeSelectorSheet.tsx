"use client";

import { useState } from "react";
import { X, Ruler, Check, Package2, ChevronDown, ChevronUp } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatRupiah } from "@/lib/utils";

interface SizeOption {
  size: string;
  stock: number;
}

interface SizeSelectorPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    images: string[];
  };
  sizes: SizeOption[];
}

// Static size chart data
const SIZE_CHART = [
  { size: "S", chest: "51 cm", length: "53 cm" },
  { size: "M", chest: "53 cm", length: "55 cm" },
  { size: "L", chest: "55 cm", length: "58 cm" },
  { size: "XL", chest: "58 cm", length: "60 cm" },
];

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

export default function SizeSelectorPopover({
  isOpen,
  onClose,
  product,
  sizes,
}: SizeSelectorPopoverProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showShipping, setShowShipping] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  if (!isOpen) return null;

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size,
      price: product.price,
      image: product.images[0] || "/placeholder-product.svg",
    });
    setTimeout(() => {
      onClose();
      setSelectedSize(null);
      setShowShipping(false);
      setShowSizeChart(false);
    }, 350);
  };

  const sortedSizes = [...sizes].sort(
    (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size)
  );

  return (
    <>
      {/* ── LAYER 1: Shared backdrop (z-60) ── */}
      <div
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[3px] animate-fadeIn"
        onClick={() => {
          if (showSizeChart) {
            setShowSizeChart(false);
          } else {
            onClose();
          }
        }}
        aria-hidden="true"
      />

      {/* ── LAYER 2: SIZE SELECTOR centered modal (z-65) ── */}
      {!showSizeChart && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center p-4 pointer-events-none"
          aria-modal="true"
          role="dialog"
          aria-label="Select size"
        >
          <div
            className="relative w-full max-w-[340px] bg-surface backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-5 pointer-events-auto animate-popInCenter"
            id="size-selector-popover"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header row */}
            <div className="flex items-center justify-center pb-3 border-b border-border">
              <span className="text-[11px] tracking-widest uppercase">
                SELECT SIZE
              </span>
            </div>

            {/* Price */}
            <div className="text-center py-3">
              <span className="text-sm font-medium tracking-wide text-foreground">
                {formatRupiah(product.price)}
              </span>
            </div>

            {/* Size grid — 4 cols */}
            <div className="grid grid-cols-4 gap-2">
              {sortedSizes.map(({ size, stock }) => {
                const isOutOfStock = stock === 0;
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => !isOutOfStock && handleSizeSelect(size)}
                    disabled={isOutOfStock}
                    className={[
                      "relative h-12 rounded-xl text-xs uppercase tracking-wider",
                      "flex flex-col items-center justify-center gap-0.5",
                      "transition-all duration-200",
                      isSelected
                        ? "bg-foreground text-background ring-2 ring-foreground ring-offset-2 ring-offset-surface scale-[0.96]"
                        : isOutOfStock
                          ? "bg-surface text-disabled cursor-not-allowed opacity-40 line-through"
                          : "bg-surface hover:bg-surface-hover text-foreground active:scale-95",
                    ].join(" ")}
                    id={`popover-size-${size.toLowerCase()}`}
                  >
                    <span>{size}</span>
                    <span className="text-[8px] font-normal opacity-60">
                      {isOutOfStock ? "SOLD" : `${stock} left`}
                    </span>
                    {isSelected && (
                      <Check
                        size={9}
                        strokeWidth={2.5}
                        className="absolute top-1.5 right-1.5 text-background"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Shipping info accordion */}
            <div className="mt-4 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setShowShipping(!showShipping)}
                className="w-full flex items-center justify-between text-[10px] tracking-widest font-medium text-muted hover:text-foreground uppercase transition-colors py-0.5"
                id="btn-shipping-info-toggle"
              >
                <span className="flex items-center gap-1.5 pb-2.5">
                  <Package2 size={11} strokeWidth={1.5} />
                  SHIPPING INFORMATION
                </span>
                {showShipping ? (
                  <ChevronUp size={11} strokeWidth={1.5} />
                ) : (
                  <ChevronDown size={11} strokeWidth={1.5} />
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowSizeChart(true)}
                className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest text-muted hover:text-foreground transition-colors uppercase"
                aria-label="Open size guide"
                id="btn-size-guide"
              >
                <Ruler size={13} strokeWidth={1.5} />
                SIZE GUIDE
              </button>

              {showShipping && (
                <div className="mt-2.5 text-[11px] text-muted leading-relaxed space-y-1.5 animate-fadeIn">
                  <p className="text-foreground text-[10px] uppercase tracking-widest">
                    PRE-ORDER ITEM
                  </p>
                  <p>
                    Estimated dispatch within <strong className="text-foreground">2–3 weeks</strong> from order date.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── LAYER 3: SIZE GUIDE modal ── */}
      {showSizeChart && (
        <div
          className="fixed inset-0 z-[75] flex items-center justify-center p-4 pointer-events-none"
          aria-modal="true"
          role="dialog"
          aria-label="Size guide"
        >
          <div
            className="relative w-full max-w-sm bg-surface rounded-2xl shadow-2xl border border-border p-6 pointer-events-auto animate-popInCenter"
            onClick={(e) => e.stopPropagation()}
            id="size-chart-modal"
          >
            {/* Modal header */}
            <div className="flex items-center justify-center pb-3 border-b border-border mb-5">
              <div className="flex items-center gap-2">
                <Ruler size={14} strokeWidth={1.5} className="text-muted" />
                <span className="text-[11px] tracking-widest uppercase">
                  Size Guide
                </span>
              </div>
            </div>

            {/* Size chart table */}
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-2.5 text-[10px] tracking-widest text-muted uppercase">
                    SIZE
                  </th>
                  <th className="text-center pb-2.5 text-[10px] tracking-widest text-muted uppercase">
                    CHEST WIDTH
                  </th>
                  <th className="text-center pb-2.5 text-[10px] tracking-widest text-muted uppercase">
                    LENGTH
                  </th>
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className="border-b border-border/40 last:border-0">
                    <td className="py-3 text-foreground">{row.size}</td>
                    <td className="py-3 text-center text-muted">{row.chest}</td>
                    <td className="py-3 text-center text-muted">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-5 text-[10px] text-muted leading-relaxed border-t border-border pt-4">
              All measurements are body measurements in centimetres.
              We recommend sizing up for a relaxed fit.
            </p>

            {/* Back to selector */}
            <button
              onClick={() => setShowSizeChart(false)}
              className="mt-4 w-full py-2.5 text-[11px] tracking-widest uppercase text-foreground bg-surface hover:bg-surface-hover rounded-xl transition-colors"
            >
              ← BACK TO SIZE SELECTION
            </button>
          </div>
        </div>
      )}
    </>
  );
}
