"use client";

import React, { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { usePageTransition } from "@/context/PageTransitionContext";

// ============================================================================
// ANIMATION CONFIGURATION — Sesuaikan parameter durasi di sini
// ============================================================================
const CFG = {
  ZOOM_DURATION: 0.75,         // Detik: logo membesar + berputar
  FADE_OUT_DURATION: 0.45,     // Detik: overlay fade-out mengungkap halaman baru
  ROTATION_DEG: 540,           // Derajat putaran logo (540 = 1.5 putaran penuh)
  REDUCED_FADE_DURATION: 0.3,  // Fallback untuk prefers-reduced-motion
};

export default function PageTransitionOverlay() {
  const { isTransitioning, targetHref, finishTransition } = usePageTransition();
  const router = useRouter();
  const pathname = usePathname();

  // Semua DOM refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Tracking refs — TIDAK pakai state React agar tidak ada re-render yang merusak timeline
  const isAnimatingRef = useRef(false);
  const routePushedRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // ─── Phase 2: Fade out overlay, restore navbar logo ─────────────────────
  const runPhase2Ref = useRef<() => void>(() => {});
  runPhase2Ref.current = () => {
    console.log("[PageTransition] Phase 2: fade-out start");
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const logo = logoRef.current;
    if (!overlay || !backdrop || !logo) {
      finishTransition();
      isAnimatingRef.current = false;
      return;
    }

    // Restore navbar logo sekarang (halaman baru sudah ready)
    const navLogo = document.getElementById("nav-logo");
    if (navLogo) navLogo.style.visibility = "";

    gsap.killTweensOf([backdrop, logo]);
    gsap.to([logo, backdrop], {
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

  // ─── Pantau pathname: saat route sudah berubah, trigger phase 2 ─────────
  useEffect(() => {
    if (routePushedRef.current) {
      console.log("[PageTransition] pathname changed → triggering phase 2");
      routePushedRef.current = false; // reset DULU sebelum panggil, cegah double call
      runPhase2Ref.current();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ─── Efek utama animasi ──────────────────────────────────────────────────
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
    const logo = logoRef.current;

    if (!overlay || !backdrop || !logo) {
      console.error("[PageTransition] refs missing!", { overlay, backdrop, logo });
      isAnimatingRef.current = false;
      finishTransition();
      return;
    }

    // ── Kill animasi aktif jika ada ────────────────────────────────────────
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
    gsap.killTweensOf([overlay, backdrop, logo]);

    // ── Ukuran dan posisi ──────────────────────────────────────────────────
    const navLogo = document.getElementById("nav-logo");
    const navRect = navLogo?.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Scale: harus cukup besar untuk cover diagonal layar penuh dari logo 32px
    const diagonal = Math.sqrt(vw * vw + vh * vh);
    const targetScale = Math.ceil(diagonal / 28); // 28px inner content logo
    console.log(`[PageTransition] vw=${vw} vh=${vh} diagonal=${Math.round(diagonal)} targetScale=${targetScale}`);

    // Posisi awal logo di layar (navbar bawah tengah)
    const navCX = navRect ? navRect.left + navRect.width / 2 : vw / 2;
    const navCY = navRect ? navRect.top + navRect.height / 2 : vh - 44;
    console.log(`[PageTransition] navLogo found=${!!navRect}, navCX=${Math.round(navCX)} navCY=${Math.round(navCY)}`);

    // Logo container ada di center viewport via CSS (left:50%, top:50%, margin:-16px)
    // GSAP x/y adalah offset dari posisi CSS tersebut
    const offsetX = navCX - vw / 2;
    const offsetY = navCY - vh / 2;

    // ── Tampilkan overlay (IMPERATIF, bukan via React state) ───────────────
    overlay.style.display = "block";
    overlay.style.pointerEvents = "auto";

    // Reset semua transform via GSAP set
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(logo, {
      x: offsetX,
      y: offsetY,
      scale: 1,
      rotation: 0,
      opacity: 1,
      transformOrigin: "center center",
      force3D: true,
    });

    // Sembunyikan logo navbar asli
    if (navLogo) navLogo.style.visibility = "hidden";

    // ── Cek prefers-reduced-motion ─────────────────────────────────────────
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      console.log("[PageTransition] reduced motion — using fade only");
      gsap.to(backdrop, {
        opacity: 1,
        duration: CFG.REDUCED_FADE_DURATION,
        onComplete: () => {
          if (targetHref === pathname) {
            window.scrollTo({ top: 0, behavior: "instant" });
            setTimeout(() => runPhase2Ref.current(), 80);
          } else {
            routePushedRef.current = true;
            router.push(targetHref);
            setTimeout(() => {
              if (routePushedRef.current) runPhase2Ref.current();
            }, 700);
          }
        },
      });
      return;
    }

    // ── GSAP Timeline: Fase 1 — Logo zoom-in + rotate ────────────────────
    console.log("[PageTransition] Starting GSAP timeline, scale target:", targetScale);
    const tl = gsap.timeline({
      onStart: () => console.log("[PageTransition] TL started"),
      onComplete: () => console.log("[PageTransition] TL phase1 complete"),
    });
    tlRef.current = tl;

    // Step 1: Logo bergerak dari posisi navbar ke CENTER, membesar DAN berputar
    tl.to(logo, {
      x: 0,
      y: 0,
      scale: targetScale,
      rotation: CFG.ROTATION_DEG,
      duration: CFG.ZOOM_DURATION,
      ease: "power2.inOut",
      force3D: true,
      onUpdate: function () {
        // Log pertama kali saja untuk konfirmasi animasi berjalan
        if (Math.round(this.progress() * 10) === 1) {
          console.log("[PageTransition] TL 10% progress, scale now:", gsap.getProperty(logo, "scale"));
        }
      },
    }, 0);

    // Step 2: Backdrop memudar masuk secara simultan (delay sedikit agar logo terlihat dulu)
    tl.to(backdrop, {
      opacity: 1,
      duration: CFG.ZOOM_DURATION * 0.65,
      ease: "power1.in",
    }, CFG.ZOOM_DURATION * 0.35);

    // Step 3: Setelah fase 1 selesai — push route
    tl.call(() => {
      console.log("[PageTransition] Phase 1 done — pushing route:", targetHref);
      if (targetHref === pathname) {
        window.scrollTo({ top: 0, behavior: "instant" });
        setTimeout(() => runPhase2Ref.current(), 80);
      } else {
        routePushedRef.current = true;
        router.push(targetHref);
        // Fallback: jika pathname effect tidak muncul dalam 800ms
        setTimeout(() => {
          if (routePushedRef.current) {
            console.log("[PageTransition] fallback timeout — running phase2");
            runPhase2Ref.current();
          }
        }, 800);
      }
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, targetHref]);

  return (
    <div
      ref={overlayRef}
      id="page-transition-overlay"
      aria-hidden="true"
      style={{
        // Seluruh visibilitas dikontrol IMPERATIF via .style — BUKAN via React re-render
        position: "fixed",
        inset: 0,
        zIndex: 2147483647, // int32 max — PALING TINGGI yang mungkin di CSS
        display: "none",    // GSAP mengubah ke "block" saat animasi mulai
        overflow: "hidden",
        userSelect: "none",
        // pointerEvents diset imperatif juga
      }}
    >
      {/* ── Backdrop: penutup layar di belakang logo ────────────────────── */}
      <div
        ref={backdropRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "var(--color-background, #ffffff)",
          willChange: "opacity",
        }}
      />

      {/* ── Logo container: dikunci di CENTER viewport ───────────────────── */}
      {/* CSS menempatkan ini di center, GSAP menggeser via x/y offset */}
      <div
        ref={logoRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "32px",
          height: "32px",
          // -16px = -50% of 32px, menempatkan titik transformOrigin tepat di center
          marginLeft: "-16px",
          marginTop: "-16px",
          transformOrigin: "center center",
          willChange: "transform, opacity",
          zIndex: 1,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/cardinal-compass.svg"
          alt=""
          style={{ width: "32px", height: "32px", objectFit: "contain", display: "block" }}
        />
      </div>
    </div>
  );
}
