"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import ImageGallery from "@/components/product/ImageGallery";
import SizeSelectorSheet from "@/components/product/SizeSelectorSheet";
import { formatRupiah } from "@/lib/utils";

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
  };
  sizes: {
    size: string;
    stock: number;
  }[];
  prevSlug: string | null;
  nextSlug: string | null;
}

export default function ProductDetailClient({
  product,
  sizes,
  prevSlug,
  nextSlug,
}: ProductDetailClientProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4"
      id="product-detail"
    >
      {/* Product navigation chevrons */}
      {prevSlug && (
        <Link
          href={`/product/${prevSlug}`}
          className="nav-chevron left-4 md:left-12"
          aria-label="Previous product"
          id="nav-prev-product"
        >
          <ChevronLeft size={24} strokeWidth={1.5} />
        </Link>
      )}

      {nextSlug && (
        <Link
          href={`/product/${nextSlug}`}
          className="nav-chevron right-4 md:right-12"
          aria-label="Next product"
          id="nav-next-product"
        >
          <ChevronRight size={24} strokeWidth={1.5} />
        </Link>
      )}

      {/* Product content */}
      <div className="w-full max-w-md mx-auto">
        {/* Image Gallery */}
        <ImageGallery images={product.images} productName={product.name} />

        {/* Product info */}
        <div className="text-center mt-7 space-y-1.5">
          <h1
            className="text-product-name"
            style={{ fontSize: "0.65rem", letterSpacing: "0.18em" }}
          >
            {product.name}
          </h1>
          <p className="text-price">{formatRupiah(product.price)}</p>
        </div>

        {/* Add to cart CTA */}
        <div className="flex justify-center mt-9">
          <button
            onClick={() => setSheetOpen(!sheetOpen)}
            className="group flex items-center justify-center w-14 h-14 rounded-full border border-black/10 bg-white hover:bg-foreground hover:border-foreground active:scale-95 transition-all duration-200"
            style={{
              boxShadow: sheetOpen
                ? "none"
                : "0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
            }}
            aria-label="Select size & add to cart"
            id="btn-add-to-cart"
          >
            <Plus
              size={20}
              strokeWidth={1.5}
              className={`transition-all duration-300 group-hover:text-white ${
                sheetOpen ? "rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* Size Selector */}
        <SizeSelectorSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          product={product}
          sizes={sizes}
        />
      </div>
    </div>
  );
}
