"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import GsapImageSlider from "@/components/product/GsapImageSlider";
import SizeSelectorSheet from "@/components/product/SizeSelectorSheet";
import { formatRupiah } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer);
}

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  images: string[];
}

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
  allProducts: ProductItem[];
  currentIndex: number;
}

export default function ProductDetailClient({
  product,
  sizes,
  allProducts,
  currentIndex,
}: ProductDetailClientProps) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const productWrapperRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const sheetOpenRef = useRef(sheetOpen);

  sheetOpenRef.current = sheetOpen;

  const totalProducts = allProducts.length;
  const hasMultipleProducts = totalProducts > 1;

  const prevIndex = (currentIndex - 1 + totalProducts) % totalProducts;
  const nextIndex = (currentIndex + 1) % totalProducts;
  const prevProduct = hasMultipleProducts ? allProducts[prevIndex] : null;
  const nextProduct = hasMultipleProducts ? allProducts[nextIndex] : null;

  // ─── Preload adjacent product images & routes ───
  useEffect(() => {
    if (!hasMultipleProducts) return;

    const prefetchTargets = [prevProduct, nextProduct].filter(Boolean) as ProductItem[];

    prefetchTargets.forEach((p) => {
      // Preload Next.js page bundle
      router.prefetch(`/product/${p.slug}`);

      // Preload primary image
      if (p.images?.[0] && typeof window !== "undefined") {
        const img = new window.Image();
        img.src = p.images[0];
      }
    });
  }, [hasMultipleProducts, prevProduct, nextProduct, router]);

  // ─── Vertical Transition Handlers ───
  const transitionToProduct = useCallback(
    (targetSlug: string, direction: "up" | "down") => {
      if (isAnimatingRef.current || sheetOpenRef.current || !hasMultipleProducts) return;
      isAnimatingRef.current = true;

      const wrapper = productWrapperRef.current;
      if (!wrapper) {
        router.push(`/product/${targetSlug}`);
        return;
      }

      // Scroll Down (next): current exits UP (-100%)
      // Scroll Up (prev): current exits DOWN (100%)
      const exitYPercent = direction === "down" ? -80 : 80;

      gsap.to(wrapper, {
        yPercent: exitYPercent,
        autoAlpha: 0,
        scale: 0.96,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          router.push(`/product/${targetSlug}`);
        },
      });
    },
    [hasMultipleProducts, router]
  );

  const goToNextProduct = useCallback(() => {
    if (nextProduct) {
      transitionToProduct(nextProduct.slug, "down");
    }
  }, [nextProduct, transitionToProduct]);

  const goToPrevProduct = useCallback(() => {
    if (prevProduct) {
      transitionToProduct(prevProduct.slug, "up");
    }
  }, [prevProduct, transitionToProduct]);

  // ─── Entrance Animation & GSAP Observer Setup ───
  useEffect(() => {
    const ctx = gsap.context(() => {
      const wrapper = productWrapperRef.current;
      if (wrapper) {
        gsap.fromTo(
          wrapper,
          { autoAlpha: 0, scale: 0.97 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.45,
            ease: "power2.out",
            onComplete: () => {
              isAnimatingRef.current = false;
            },
          }
        );
      }

      // Setup Observer ONLY if there are multiple active products
      if (hasMultipleProducts && containerRef.current) {
        Observer.create({
          target: containerRef.current,
          type: "wheel,touch,pointer",
          wheelSpeed: -1,
          tolerance: 15,
          preventDefault: false,
          onDown: () => {
            // Drag / wheel downward -> previous product
            goToPrevProduct();
          },
          onUp: () => {
            // Drag / wheel upward -> next product
            goToNextProduct();
          },
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [hasMultipleProducts, goToNextProduct, goToPrevProduct]);

  return (
    <div
      ref={containerRef}
      id="product-detail"
      className="product-detail-page relative w-full flex flex-col items-center justify-between px-4 py-4 sm:py-6 md:py-8 select-none"
    >
      {/* ─── Top Spacer for aesthetic balance ─── */}
      <div className="w-full h-4 sm:h-6 shrink-0" aria-hidden="true" />

      {/* ─── Animated Center Product Content (Fit-to-Screen) ─── */}
      <div
        ref={productWrapperRef}
        className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center justify-center my-auto will-change-transform"
      >
        {/* Horizontal GSAP Image Slider */}
        <GsapImageSlider
          images={product.images}
          productName={product.name}
        />

        {/* Product Info */}
        <div className="text-center mt-3 sm:mt-4 space-y-1">
          <h1
            className="text-product-name"
            style={{ fontSize: "0.68rem", letterSpacing: "0.2em" }}
          >
            {product.name}
          </h1>
          <p className="text-price font-light">{formatRupiah(product.price)}</p>
        </div>

        {/* Add to Cart CTA Button */}
        <div className="flex justify-center mt-4 sm:mt-5">
          <button
            type="button"
            onClick={() => setSheetOpen(!sheetOpen)}
            className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-black/10 bg-white hover:bg-foreground hover:border-foreground active:scale-95 transition-all duration-200"
            style={{
              boxShadow: sheetOpen
                ? "none"
                : "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
            }}
            aria-label="Select size & add to cart"
            id="btn-add-to-cart"
          >
            <Plus
              size={18}
              strokeWidth={1.5}
              className={`transition-all duration-300 group-hover:text-white ${
                sheetOpen ? "rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ─── Bottom Area: Micro Scroll Hint ─── */}
      <div className="w-full flex flex-col items-center justify-end pb-12 sm:pb-14 shrink-0 pointer-events-none">
        {hasMultipleProducts ? (
          <div className="flex flex-col items-center gap-0.5 scroll-hint select-none">
            <span>Scroll to change product</span>
            <ChevronDown size={10} strokeWidth={1.5} className="animate-bounce" />
          </div>
        ) : (
          <div className="h-4" aria-hidden="true" />
        )}
      </div>

      {/* ─── Size Selector Bottom Sheet ─── */}
      <SizeSelectorSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        product={product}
        sizes={sizes}
      />
    </div>
  );
}
