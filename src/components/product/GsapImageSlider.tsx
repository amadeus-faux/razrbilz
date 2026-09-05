"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GsapImageSliderProps {
  images: string[];
  productName: string;
}

export default function GsapImageSlider({
  images,
  productName,
}: GsapImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  /** Tracks the currently running slide timeline so we can kill it on rapid clicks */
  const activeTlRef = useRef<gsap.core.Timeline | null>(null);

  // Preload all images for this product
  useEffect(() => {
    images.forEach((src) => {
      if (typeof window !== "undefined" && src) {
        const img = new window.Image();
        img.src = src;
      }
    });
  }, [images]);

  // Initialize GSAP state: first slide visible at x:0, others hidden at x:0
  // Hidden slides stay at x:0 — they're invisible (autoAlpha:0) so position
  // doesn't matter; we stage them correctly just before each animation.
  useEffect(() => {
    const ctx = gsap.context(() => {
      slidesRef.current.forEach((slide, i) => {
        if (!slide) return;
        gsap.set(slide, { autoAlpha: i === 0 ? 1 : 0, x: 0 });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [images]);

  // Kill active timeline on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      activeTlRef.current?.kill();
    };
  }, []);

  /**
   * runSlide — core animation engine.
   *
   * Travel distance is calculated in PIXELS from the live viewport width
   * and the container's current bounding rect, so the slide exits/enters
   * PAST the actual screen edge regardless of the container's narrow width.
   *
   * direction "next" → current exits LEFT  | next enters from RIGHT
   * direction "prev" → current exits RIGHT | prev enters from LEFT
   */
  const runSlide = useCallback(
    (targetIndex: number, direction: "next" | "prev") => {
      const currentSlide = slidesRef.current[currentIndexRef.current];
      const nextSlide = slidesRef.current[targetIndex];

      if (!currentSlide || !nextSlide) {
        isAnimatingRef.current = false;
        return;
      }

      // Kill any in-progress animation to prevent overlap on rapid clicks
      if (activeTlRef.current) {
        activeTlRef.current.kill();
        activeTlRef.current = null;
      }
      gsap.killTweensOf([currentSlide, nextSlide]);

      // ─── Calculate full-viewport pixel distances ──────────────────────
      // containerRef has no transform applied, so getBoundingClientRect()
      // always reflects its natural (x=0) position in the viewport.
      // The .gsap-slide elements are inset:0 within the same-width inner
      // div, so they share containerRef's left/right viewport coordinates.
      const vw = window.innerWidth;
      const BUFFER = 20; // extra px so slides fully clear the screen edge
      let exitX: number;  // pixels: how far current slide must travel to exit
      let startX: number; // pixels: where incoming slide starts off-screen

      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        if (direction === "next") {
          // Current exits LEFT:  right edge of slide reaches 0 (viewport left)
          exitX = -(rect.right + BUFFER);
          // Next enters from RIGHT: left edge of slide starts at viewport right
          startX = vw - rect.left + BUFFER;
        } else {
          // Current exits RIGHT: left edge reaches vw (viewport right)
          exitX = vw - rect.left + BUFFER;
          // Prev enters from LEFT: right edge starts at viewport left
          startX = -(rect.right + BUFFER);
        }
      } else {
        // Fallback: safe ± full-viewport estimate
        exitX = direction === "next" ? -(vw + BUFFER) : vw + BUFFER;
        startX = direction === "next" ? vw + BUFFER : -(vw + BUFFER);
      }
      // ─────────────────────────────────────────────────────────────────

      // Stage incoming slide off-screen (invisible so no flash on stage)
      gsap.set(nextSlide, { x: startX, autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 0.45 },
        onComplete: () => {
          currentIndexRef.current = targetIndex;
          setCurrentIndex(targetIndex);
          isAnimatingRef.current = false;
          activeTlRef.current = null;
          // Reset outgoing slide to x:0 so it's ready for the next run
          gsap.set(currentSlide, { x: 0, autoAlpha: 0 });
        },
      });

      // Outgoing: slide out to edge + fade out
      tl.to(currentSlide, { x: exitX, autoAlpha: 0 }, 0);
      // Incoming: slide in from edge + fade in simultaneously
      tl.to(nextSlide, { x: 0, autoAlpha: 1 }, 0);

      activeTlRef.current = tl;
    },
    []
  );

  /** Right arrow / Next — infinite loop */
  const goNext = useCallback(() => {
    if (isAnimatingRef.current || images.length <= 1) return;
    isAnimatingRef.current = true;
    const next = (currentIndexRef.current + 1) % images.length;
    runSlide(next, "next");
  }, [images.length, runSlide]);

  /** Left arrow / Previous — infinite loop */
  const goPrev = useCallback(() => {
    if (isAnimatingRef.current || images.length <= 1) return;
    isAnimatingRef.current = true;
    const prev = (currentIndexRef.current - 1 + images.length) % images.length;
    runSlide(prev, "prev");
  }, [images.length, runSlide]);

  /** Dot pagination click */
  const goToIndex = useCallback(
    (targetIndex: number) => {
      if (isAnimatingRef.current || targetIndex === currentIndexRef.current) return;
      isAnimatingRef.current = true;
      runSlide(
        targetIndex,
        targetIndex > currentIndexRef.current ? "next" : "prev"
      );
    },
    [runSlide]
  );

  // Touch swipe handlers with directional locking for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isHorizontalSwipeRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = Math.abs(e.touches[0].clientX - touchStartXRef.current);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartYRef.current);

    if (isHorizontalSwipeRef.current === null && (deltaX > 6 || deltaY > 6)) {
      isHorizontalSwipeRef.current = deltaX > deltaY * 1.5;
    }

    if (isHorizontalSwipeRef.current === true) {
      e.stopPropagation();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;

    if (
      isHorizontalSwipeRef.current === true ||
      (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.5)
    ) {
      if (Math.abs(diffX) > 40) {
        diffX > 0 ? goNext() : goPrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    isHorizontalSwipeRef.current = null;
  };

  if (images.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] mx-auto select-none"
      id="image-gallery"
    >
      {/*
        ── Slides Stage ────────────────────────────────────────────────────
        overflow-hidden is intentionally REMOVED here so slides can travel
        all the way to the viewport edge during animation.
        The outer .product-detail-page { overflow: hidden } (globals.css)
        serves as the true clip boundary at the viewport edges.
        Slides move HORIZONTALLY, so they never overlap the text/button
        that sits below this container.
        ────────────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full aspect-[5/4] sm:aspect-[4/3] bg-transparent touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((src, index) => (
          <div
            key={`slide-${index}`}
            ref={(el) => {
              slidesRef.current[index] = el;
            }}
            className="gsap-slide flex items-center justify-center"
            style={{
              opacity: index === 0 ? 1 : 0,
              visibility: index === 0 ? "visible" : "hidden",
            }}
          >
            <Image
              src={src}
              alt={`${productName} - Image ${index + 1}`}
              fill
              className="object-contain p-2 md:p-0 pointer-events-none"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 420px"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* ── Arrow Navigation (Desktop only) ─────────────────────────── */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="hidden lg:flex items-center justify-center absolute left-[-28px] sm:left-[-36px] top-1/2 -translate-y-1/2 p-2 text-foreground/40 hover:text-foreground active:scale-95 transition-all duration-150 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} strokeWidth={1.25} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="hidden lg:flex items-center justify-center absolute right-[-28px] sm:right-[-36px] top-1/2 -translate-y-1/2 p-2 text-foreground/40 hover:text-foreground active:scale-95 transition-all duration-150 z-10"
            aria-label="Next image"
          >
            <ChevronRight size={22} strokeWidth={1.25} />
          </button>
        </>
      )}

      {/* ── Pagination Dots ──────────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToIndex(index)}
              className={`pagination-dot ${index === currentIndex ? "active" : ""}`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
