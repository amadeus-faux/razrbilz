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
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentWrapperRef = useRef<HTMLDivElement>(null);
  const incomingWrapperRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const sheetOpenRef = useRef(sheetOpen);
  const currentIndexRef = useRef(currentIndex);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);

  sheetOpenRef.current = sheetOpen;
  currentIndexRef.current = currentIndex;

  const totalProducts = products.length;
  const hasMultipleProducts = totalProducts > 1;
  const currentProduct = products[currentIndex] || products[0];
  const incomingProduct = incomingIndex !== null ? products[incomingIndex] : null;

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

  // ─── 3. Simultaneous Overlapping GSAP Product Transition ─────────────────
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
      const targetProduct = products[targetIndex];
      if (!targetProduct) {
        isAnimatingRef.current = false;
        return;
      }

      // Mount incoming product layer in React
      setIncomingIndex(targetIndex);

      // direction "down" (scroll down -> next product):
      // Outgoing exits UP (-50px / -40%), Incoming enters from DOWN (50px / 40%)
      const exitYPercent = direction === "down" ? -40 : 40;
      const entryYPercent = direction === "down" ? 40 : -40;

      // Small tick for incoming layer ref to mount
      requestAnimationFrame(() => {
        const currentWrapper = currentWrapperRef.current;
        const incomingWrapper = incomingWrapperRef.current;

        if (!currentWrapper || !incomingWrapper) {
          setCurrentIndex(targetIndex);
          setIncomingIndex(null);
          isAnimatingRef.current = false;
          return;
        }

        if (activeTimelineRef.current) {
          activeTimelineRef.current.kill();
        }

        // Stage incoming layer off-screen
        gsap.set(incomingWrapper, {
          yPercent: entryYPercent,
          autoAlpha: 0,
          scale: 0.96,
        });

        // Create simultaneous overlapping timeline with identical duration (0.45s) and ease (power2.inOut)
        const tl = gsap.timeline({
          defaults: { duration: 0.45, ease: "power2.inOut" },
          onComplete: () => {
            setCurrentIndex(targetIndex);
            setIncomingIndex(null);

            if (typeof window !== "undefined") {
              window.history.replaceState(null, "", `/product/${targetProduct.slug}`);
              document.title = `${targetProduct.name} | RAZRBILZ`;
            }

            // Reset current wrapper to clean rest state
            if (currentWrapper) {
              gsap.set(currentWrapper, { yPercent: 0, autoAlpha: 1, scale: 1 });
            }

            isAnimatingRef.current = false;
            activeTimelineRef.current = null;
          },
        });

        // Animate BOTH outgoing and incoming SIMULTANEOUSLY at time 0 (true overlap)
        tl.to(currentWrapper, { yPercent: exitYPercent, autoAlpha: 0, scale: 0.96 }, 0);
        tl.to(incomingWrapper, { yPercent: 0, autoAlpha: 1, scale: 1 }, 0);

        activeTimelineRef.current = tl;
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

  // ─── 4. Initial Entrance & GSAP Observer Setup with Directional Lock ─────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const wrapper = currentWrapperRef.current;
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

      // Setup GSAP Observer with strict directional filtering
      if (hasMultipleProducts && containerRef.current) {
        Observer.create({
          target: containerRef.current,
          type: "wheel,touch,pointer",
          wheelSpeed: -1,
          tolerance: 20,
          preventDefault: false,
          onChangeY: (self) => {
            if (isAnimatingRef.current || sheetOpenRef.current) return;
            const isWheel = self.event.type === "wheel";
            const deltaY = self.deltaY;
            const deltaX = self.deltaX;

            if (isWheel) {
              if (deltaY > 0) goToNextProduct();
              else if (deltaY < 0) goToPrevProduct();
            } else {
              // Touch/pointer gesture: require dominant vertical movement (> 25px and |deltaY| > 1.5 * |deltaX|)
              if (Math.abs(deltaY) > 25 && Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
                if (deltaY > 0) goToNextProduct();
                else if (deltaY < 0) goToPrevProduct();
              }
            }
          },
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
      activeTimelineRef.current?.kill();
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

      {/* ─── Center Product Stage with Overlapping Layer Support ─── */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-auto my-auto flex items-center justify-center min-h-[380px] sm:min-h-[420px]">
        {/* Active / Current Product Layer */}
        <div
          ref={currentWrapperRef}
          key={`product-${currentProduct.id}`}
          className="w-full flex flex-col items-center justify-center will-change-transform"
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

        {/* Incoming Product Layer (Visible only during simultaneous overlapping transition) */}
        {incomingProduct && (
          <div
            ref={incomingWrapperRef}
            key={`incoming-${incomingProduct.id}`}
            className="absolute inset-0 w-full flex flex-col items-center justify-center will-change-transform"
            style={{ visibility: "visible" }}
          >
            <GsapImageSlider
              images={incomingProduct.images}
              productName={incomingProduct.name}
            />

            <div className="text-center mt-3 sm:mt-4 space-y-1">
              <h1
                className="text-product-name font-bold tracking-widest text-foreground"
                style={{ fontSize: "0.68rem" }}
              >
                {incomingProduct.name}
              </h1>
              <p className="text-price font-medium text-neutral-800">
                {formatRupiah(incomingProduct.price)}
              </p>
            </div>

            <div className="flex justify-center mt-4 sm:mt-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-black/10 bg-white flex items-center justify-center">
                <Plus size={18} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom Area: Micro Scroll Hint ─── */}
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
