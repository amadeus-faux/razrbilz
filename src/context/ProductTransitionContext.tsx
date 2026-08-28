"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface TransitionState {
  slug: string;
  imageSrc: string;
  firstRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

interface ProductTransitionContextType {
  transitionState: TransitionState | null;
  setTransitionState: (state: TransitionState | null) => void;
  startTransition: (slug: string, imageSrc: string, element: HTMLElement) => void;
  clearTransition: () => void;
}

const ProductTransitionContext = createContext<ProductTransitionContextType | null>(null);

export function ProductTransitionProvider({ children }: { children: React.ReactNode }) {
  const [transitionState, setTransitionState] = useState<TransitionState | null>(null);

  const startTransition = useCallback((slug: string, imageSrc: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setTransitionState({
      slug,
      imageSrc,
      firstRect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
    });
  }, []);

  const clearTransition = useCallback(() => {
    setTransitionState(null);
  }, []);

  return (
    <ProductTransitionContext.Provider
      value={{
        transitionState,
        setTransitionState,
        startTransition,
        clearTransition,
      }}
    >
      {children}
    </ProductTransitionContext.Provider>
  );
}

export function useProductTransition() {
  const context = useContext(ProductTransitionContext);
  if (!context) {
    throw new Error("useProductTransition must be used within ProductTransitionProvider");
  }
  return context;
}
