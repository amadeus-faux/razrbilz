"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Plus, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import GsapImageSlider from "@/components/product/GsapImageSlider";
import SizeSelectorSheet from "@/components/product/SizeSelectorSheet";
import { formatRupiah } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer);
}

export interface ClientProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  sizes: {
    size: string;
    stock: number;
  }[];
}

interface ProductDetailClientProps {
  products: ClientProduct[];
  initialIndex: number;
}

export default function ProductDetailClient({
  products,
  initialIndex,
}: ProductDetailClientProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [sheetOpen, setSheetOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const productWrapperRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const sheetOpenRef = useRef(sheetOpen);
  const currentIndexRef = useRef(currentIndex);

  sheetOpenRef.current = sheetOpen;
  currentIndexRef.current = currentIndex;

  const totalProducts = products.length;
  const hasMultipleProducts = totalProducts > 1;
  const currentProduct = products[currentIndex] || products[0];

  // ─── 1. Aggressive Image & Resource Preloading ───────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || products.length === 0) return;

    // Preload ALL images across all products in background
    products.forEach((p) => {
      p.images?.forEach((src) => {
        if (src) {
          const img = new window.Image();
          img.src = src;
        }
      });
    });
  }, [products]);

  // ─── 2. Handle browser Back/Forward (popstate) ───────────────────────────
  useEffect(() => {
    const handlePopState = () => {
      const pathSegments = window.location.pathname.split("/");
      const slugFromUrl = pathSegments[pathSegments.length - 1];
      const matchIndex = products.findIndex((p) => p.slug === slugFromUrl);
      if (matchIndex >= 0 && matchIndex !== currentIndexRef.current) {
        setCurrentIndex(matchIndex);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [products]);

  // ─── 3. Fluid Vertical GSAP Product Transition Orchestration ─────────────
  const transitionToProduct = useCallback(
    (targetIndex: number, direction: "down" | "up") => {
      if (
        isAnimatingRef.current ||
        sheetOpenRef.current ||
        !hasMultipleProducts ||
        targetIndex === currentIndexRef.current
      ) {
        return;
      }

      isAnimatingRef.current = true;
      const wrapper = productWrapperRef.current;
      const targetProduct = products[targetIndex];

      if (!wrapper || !targetProduct) {
        setCurrentIndex(targetIndex);
        isAnimatingRef.current = false;
        return;
      }

      // direction "down" (scroll down -> next product):
      // Current product exits UP (-60%), Next product enters from DOWN (60%)
      // direction "up" (scroll up -> prev product):
      // Current product exits DOWN (60%), Next product enters from UP (-60%)
      const exitYPercent = direction === "down" ? -60 : 60;
      const entryYPercent = direction === "down" ? 60 : -60;

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });

      // ── Step A: Fade-out & slide out the outgoing product
      tl.to(wrapper, {
        yPercent: exitYPercent,
        autoAlpha: 0,
        scale: 0.96,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => {
          // Immediately switch active product state in React
          setCurrentIndex(targetIndex);

          // Update URL and browser title without triggering full page reload/fetch
          if (typeof window !== "undefined") {
            window.history.replaceState(null, "", `/product/${targetProduct.slug}`);
            document.title = `${targetProduct.name} | RAZRBILZ`;
          }

          // Stage incoming product at starting transform
          gsap.set(wrapper, {
            yPercent: entryYPercent,
            autoAlpha: 0,
            scale: 0.96,
          });
        },
      });

      // ── Step B: Fade-in & slide in the incoming product smoothly
      tl.to(wrapper, {
        yPercent: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.38,
        ease: "power2.out",
      });
    },
    [hasMultipleProducts, products]
  );

  const goToNextProduct = useCallback(() => {
    const nextIdx = (currentIndexRef.current + 1) % totalProducts;
    transitionToProduct(nextIdx, "down");
  }, [totalProducts, transitionToProduct]);

  const goToPrevProduct = useCallback(() => {
    const prevIdx = (currentIndexRef.current - 1 + totalProducts) % totalProducts;
    transitionToProduct(prevIdx, "up");
  }, [totalProducts, transitionToProduct]);

  // ─── 4. Initial Entrance & GSAP Observer Setup ───────────────────────────
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

      // Setup GSAP Observer for mouse wheel & touch gestures
      if (hasMultipleProducts && containerRef.current) {
        Observer.create({
          target: containerRef.current,
          type: "wheel,touch,pointer",
          wheelSpeed: -1,
          tolerance: 15,
          preventDefault: false,
          onDown: () => {
            goToPrevProduct();
          },
          onUp: () => {
            goToNextProduct();
          },
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [hasMultipleProducts, goToNextProduct, goToPrevProduct]);

  if (!currentProduct) return null;

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
        key={currentProduct.id}
        className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center justify-center my-auto will-change-transform"
      >
        {/* Horizontal GSAP Image Slider */}
        <GsapImageSlider
          images={currentProduct.images}
          productName={currentProduct.name}
        />

        {/* Product Info */}
        <div className="text-center mt-3 sm:mt-4 space-y-1">
          <h1
            className="text-product-name font-bold tracking-widest text-foreground"
            style={{ fontSize: "0.68rem" }}
          >
            {currentProduct.name}
          </h1>
          <p className="text-price font-medium text-neutral-800">
            {formatRupiah(currentProduct.price)}
          </p>
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
      {/*
        Responsive adjustment:
        pb-24 sm:pb-24 ensures the scroll hint text is positioned comfortably
        ABOVE the floating bottom navigation on Mobile and Tablet without being obscured.
        md:pb-14 preserves the desktop layout.
      */}
      <div className="w-full flex flex-col items-center justify-end pb-24 sm:pb-24 md:pb-14 shrink-0 pointer-events-none">
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
        product={currentProduct}
        sizes={currentProduct.sizes}
      />
    </div>
  );
}
