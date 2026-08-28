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

  // Preload all images for this product
  useEffect(() => {
    images.forEach((src) => {
      if (typeof window !== "undefined" && src) {
        const img = new window.Image();
        img.src = src;
      }
    });
  }, [images]);

  // Initialize GSAP state: first slide visible at xPercent: 0, other slides hidden at xPercent: 100
  useEffect(() => {
    const ctx = gsap.context(() => {
      slidesRef.current.forEach((slide, i) => {
        if (!slide) return;
        gsap.set(slide, {
          autoAlpha: i === 0 ? 1 : 0,
          xPercent: i === 0 ? 0 : 100,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [images]);

  const runSlide = useCallback(
    (targetIndex: number, outXPercent: number, inXPercent: number) => {
      const currentSlide = slidesRef.current[currentIndexRef.current];
      const nextSlide = slidesRef.current[targetIndex];

      if (!currentSlide || !nextSlide) {
        isAnimatingRef.current = false;
        return;
      }

      // Stage incoming slide
      gsap.set(nextSlide, { xPercent: inXPercent, autoAlpha: 1 });

      const tl = gsap.timeline({
        onComplete: () => {
          currentIndexRef.current = targetIndex;
          setCurrentIndex(targetIndex);
          isAnimatingRef.current = false;
        },
      });

      // Outgoing slide animation: xPercent + autoAlpha: 0 with power2.inOut
      tl.to(
        currentSlide,
        {
          xPercent: outXPercent,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        0
      );

      // Incoming slide animation: xPercent to 0 + autoAlpha: 1 with power2.inOut
      tl.to(
        nextSlide,
        {
          xPercent: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.inOut",
        },
        0
      );
    },
    []
  );

  /** Infinite loop: Right arrow / Next */
  const goNext = useCallback(() => {
    if (isAnimatingRef.current || images.length <= 1) return;
    isAnimatingRef.current = true;
    const next = (currentIndexRef.current + 1) % images.length;
    // Current exits to left (-100%), next enters from right (100%)
    runSlide(next, -100, 100);
  }, [images.length, runSlide]);

  /** Infinite loop: Left arrow / Previous */
  const goPrev = useCallback(() => {
    if (isAnimatingRef.current || images.length <= 1) return;
    isAnimatingRef.current = true;
    const prev = (currentIndexRef.current - 1 + images.length) % images.length;
    // Current exits to right (100%), prev enters from left (-100%)
    runSlide(prev, 100, -100);
  }, [images.length, runSlide]);

  /** Dot pagination click */
  const goToIndex = useCallback(
    (targetIndex: number) => {
      if (isAnimatingRef.current || targetIndex === currentIndexRef.current) return;
      isAnimatingRef.current = true;
      const isForward = targetIndex > currentIndexRef.current;
      runSlide(
        targetIndex,
        isForward ? -100 : 100,
        isForward ? 100 : -100
      );
    },
    [runSlide]
  );

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    touchStartXRef.current = null;
  };

  if (images.length === 0) return null;

  return (
    <div ref={containerRef} className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] mx-auto select-none" id="image-gallery">
      {/* Slides Container */}
      <div
        className="relative w-full aspect-[5/4] sm:aspect-[4/3] overflow-hidden bg-white"
        onTouchStart={handleTouchStart}
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

      {/* Infinite Arrow Navigation */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-[-28px] sm:left-[-36px] top-1/2 -translate-y-1/2 p-2 text-foreground/40 hover:text-foreground active:scale-95 transition-all duration-150 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} strokeWidth={1.25} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-[-28px] sm:right-[-36px] top-1/2 -translate-y-1/2 p-2 text-foreground/40 hover:text-foreground active:scale-95 transition-all duration-150 z-10"
            aria-label="Next image"
          >
            <ChevronRight size={22} strokeWidth={1.25} />
          </button>
        </>
      )}

      {/* Pagination Dots */}
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
