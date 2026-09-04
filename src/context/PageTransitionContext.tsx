"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";

interface PageTransitionContextType {
  isTransitioning: boolean;
  targetHref: string | null;
  navigateWithTransition: (href: string) => void;
  finishTransition: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);
  const isTransitioningRef = useRef(false);

  const navigateWithTransition = useCallback((href: string) => {
    // Atomic debounce: ignore any new clicks if a transition is already running
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setTargetHref(href);
  }, []);

  const finishTransition = useCallback(() => {
    isTransitioningRef.current = false;
    setIsTransitioning(false);
    setTargetHref(null);
  }, []);

  return (
    <PageTransitionContext.Provider
      value={{
        isTransitioning,
        targetHref,
        navigateWithTransition,
        finishTransition,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within PageTransitionProvider");
  }
  return context;
}
