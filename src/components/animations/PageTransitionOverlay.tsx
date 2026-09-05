"use client";

import React, { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { usePageTransition } from "@/context/PageTransitionContext";

const CFG = {
  FADE_IN_DURATION: 0.3,
  FADE_OUT_DURATION: 0.35,
  REDUCED_FADE_DURATION: 0.25,
};

export default function PageTransitionOverlay() {
  const { isTransitioning, targetHref, finishTransition } = usePageTransition();
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const isAnimatingRef = useRef(false);
  const routePushedRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const runPhase2Ref = useRef<() => void>(() => { });
  runPhase2Ref.current = () => {
    console.log("[PageTransition] Phase 2: fade-out start");
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    if (!overlay || !backdrop) {
      finishTransition();
      isAnimatingRef.current = false;
      return;
    }

    gsap.killTweensOf(backdrop);
    gsap.to(backdrop, {
      opacity: 0,
      duration: CFG.FADE_OUT_DURATION,
      ease: "power2.out",
      onComplete: () => {
        overlay.style.display = "none";
        isAnimatingRef.current = false;
        routePushedRef.current = false;
        finishTransition();
        console.log("[PageTransition] Phase 2: complete");
      },
    });
  };

  useEffect(() => {
    if (routePushedRef.current) {
      console.log("[PageTransition] pathname changed → triggering phase 2");
      routePushedRef.current = false;
      runPhase2Ref.current();
    }
  }, [pathname]);

  useEffect(() => {
    if (!isTransitioning || !targetHref) return;
    if (isAnimatingRef.current) {
      console.log("[PageTransition] already animating — ignored");
      return;
    }

    console.log("[PageTransition] === ANIMATION START ===", targetHref);
    isAnimatingRef.current = true;

    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;

    if (!overlay || !backdrop) {
      console.error("[PageTransition] refs missing!", { overlay, backdrop });
      isAnimatingRef.current = false;
      finishTransition();
      return;
    }

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
    gsap.killTweensOf([overlay, backdrop]);

    overlay.style.display = "block";
    overlay.style.pointerEvents = "auto";

    gsap.set(backdrop, { opacity: 0 });

    const fadeDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? CFG.REDUCED_FADE_DURATION
      : CFG.FADE_IN_DURATION;

    console.log("[PageTransition] Starting backdrop fade-in");
    gsap.to(backdrop, {
      opacity: 1,
      duration: fadeDuration,
      ease: "power2.inOut",
      onComplete: () => {
        console.log("[PageTransition] Phase 1 done — pushing route:", targetHref);
        if (targetHref === pathname) {
          window.scrollTo({ top: 0, behavior: "instant" });
          setTimeout(() => runPhase2Ref.current(), 80);
        } else {
          routePushedRef.current = true;
          router.push(targetHref);
          setTimeout(() => {
            if (routePushedRef.current) {
              console.log("[PageTransition] fallback timeout — running phase2");
              runPhase2Ref.current();
            }
          }, 800);
        }
      },
    });

  }, [isTransitioning, targetHref]);

  return (
    <div
      ref={overlayRef}
      id="page-transition-overlay"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        display: "none",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* ── Backdrop: penutup layar ──────────────────────────────────────── */}
      <div
        ref={backdropRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "var(--color-background, #10100E)",
          willChange: "opacity",
        }}
      />
    </div>
  );
}
