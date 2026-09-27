"use client";

import { create } from "zustand";

/**
 * State buka/tutup CartDrawer.
 *
 * Sengaja dipisah dari `cart-store`: store cart di-persist ke localStorage, dan
 * menaruh `isOpen` di sana akan membuat drawer ikut terbuka sendiri setelah
 * refresh kalau kebetulan ditutup saat tab lain menulis state.
 */
interface CartDrawerState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCartDrawerStore = create<CartDrawerState>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
