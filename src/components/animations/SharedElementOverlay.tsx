"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useProductTransition } from "@/context/ProductTransitionContext";
import { usePathname } from "next/navigation";

export default function SharedElementOverlay() {
  const { transitionState, clearTransition } = useProductTransition();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!transitionState) return;

    if (!pathname.startsWith(`/product/${transitionState.slug}`)) {
      clearTransition();
      return;
    }

    const checkAndAnimate = () => {
      const targetElement =
        document.querySelector("#image-gallery .gsap-slide") ||
        document.querySelector("#image-gallery");
      const overlay = overlayRef.current;

      if (targetElement && overlay) {
        const targetRect = targetElement.getBoundingClientRect();
        const first = transitionState.firstRect;

        // Render overlay langsung di posisi & ukuran FINAL (target)
        gsap.set(overlay, {
          position: "fixed",
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
        });

        // Hitung offset FLIP: seberapa jauh & seberapa beda skala dari posisi awal
        const scaleX = first.width / targetRect.width;
        const scaleY = first.height / targetRect.height;
        const deltaX =
          first.left + first.width / 2 - (targetRect.left + targetRect.width / 2);
        const deltaY =
          first.top + first.height / 2 - (targetRect.top + targetRect.height / 2);

        // Set posisi AWAL murni lewat transform (GPU-accelerated, tidak trigger reflow)
        gsap.set(overlay, {
          x: deltaX,
          y: deltaY,
          scaleX,
          scaleY,
          transformOrigin: "center center",
        });

        // Animasikan transform kembali ke identity — inilah gerakan zoom-nya
        gsap.to(overlay, {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            clearTransition();
          },
        });
      } else {
        const timer = setTimeout(checkAndAnimate, 20);
        return () => clearTimeout(timer);
      }
    };

    const timer = setTimeout(checkAndAnimate, 10);
    return () => clearTimeout(timer);
  }, [pathname, transitionState, clearTransition]);

  if (!transitionState) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed pointer-events-none z-[9999] overflow-hidden flex items-center justify-center bg-white"
      style={{
        top: transitionState.firstRect.top,
        left: transitionState.firstRect.left,
        width: transitionState.firstRect.width,
        height: transitionState.firstRect.height,
        willChange: "transform",
      }}
    >
      <Image
        src={transitionState.imageSrc}
        alt="Transitioning product"
        fill
        className="object-contain p-2 md:landscape:p-3"
        priority
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
    </div>
  );
}