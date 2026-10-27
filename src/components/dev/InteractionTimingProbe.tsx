"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * TEMPORARY: mencatat waktu interaksi di console browser, tanpa UI dan tanpa
 * data pengguna. Hapus bersama instrumen server setelah angka terkumpul.
 *
 * - `event`       : klik/ketik → paint berikutnya (target < 100ms).
 * - `longtask`    : tugas main thread > 50ms yang bisa menahan umpan balik.
 * - `route-change`: klik → halaman baru selesai dirender.
 */
export default function InteractionTimingProbe() {
  const pathname = usePathname();
  const clickAtRef = useRef(0);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    const onClick = () => {
      clickAtRef.current = performance.now();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    const start = clickAtRef.current;
    if (!start) return;
    clickAtRef.current = 0;
    console.log(
      `[perf] route-change ${(performance.now() - start).toFixed(1)}ms`
    );
  }, [pathname]);

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;

    let eventObserver: PerformanceObserver | null = null;
    try {
      eventObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceEventTiming[]) {
          const delay = entry.processingStart - entry.startTime;
          const work = entry.processingEnd - entry.processingStart;
          console.log(
            `[perf] event ${entry.name} total=${entry.duration.toFixed(1)}ms delay=${delay.toFixed(1)}ms work=${work.toFixed(1)}ms`
          );
        }
      });
      eventObserver.observe({
        type: "event",
        buffered: true,
        durationThreshold: 16,
      } as PerformanceObserverInit);
    } catch {
      eventObserver = null;
    }

    let longTaskObserver: PerformanceObserver | null = null;
    try {
      longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`[perf] longtask ${entry.duration.toFixed(1)}ms`);
        }
      });
      longTaskObserver.observe({ type: "longtask", buffered: true });
    } catch {
      longTaskObserver = null;
    }

    return () => {
      eventObserver?.disconnect();
      longTaskObserver?.disconnect();
    };
  }, []);

  return null;
}
