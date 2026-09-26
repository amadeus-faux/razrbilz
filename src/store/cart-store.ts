"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  size: string;
  price: number;
  // basePrice = harga dasar IDR mentah (belum dikonversi wilayah). WAJIB ada.
  // Item cart lama yang tidak punya basePrice dibuang saat migrasi (lihat bawah),
  // supaya tidak pernah terjadi fallback ke `price` yang bisa menyebabkan
  // harga dikonversi dua kali.
  basePrice: number;
  quantity: number;
  image: string;
  // 6.3: snapshot stok tersedia saat item ditambahkan, dipakai untuk clamp
  // quantity di client. Server (checkout) tetap jadi otoritas final.
  stock?: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const existing = items.find(
          (i) => i.productId === item.productId && i.size === item.size
        );

        // 6.3: clamp ke stok tersedia (snapshot). Tanpa stock → tak dibatasi di
        // client, tapi server tetap menolak saat checkout.
        const max =
          typeof item.stock === "number" && item.stock > 0 ? item.stock : Infinity;

        if (existing) {
          const nextQty = Math.min(existing.quantity + 1, max);
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.size === item.size
                ? { ...i, quantity: nextQty, stock: item.stock ?? i.stock }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: Math.min(1, max) }] });
        }
      },

      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.size === size)
          ),
        });
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set({
          items: get().items.map((i) => {
            if (i.productId === productId && i.size === size) {
              const max =
                typeof i.stock === "number" && i.stock > 0 ? i.stock : Infinity;
              return { ...i, quantity: Math.min(quantity, max) };
            }
            return i;
          }),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "razrbilz-cart",
      version: 1,
      // Migrasi cart lama: buang item yang tidak punya basePrice valid.
      // Item semacam itu berasal dari versi store sebelum basePrice ada; kalau
      // dibiarkan, kode harga akan fallback ke `price` (yang mungkin sudah
      // terkonversi) sehingga harga ter-convert dua kali.
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as { items?: CartItem[] } | undefined;
        if (version < 1 && state && Array.isArray(state.items)) {
          state.items = state.items.filter(
            (i) => typeof i?.basePrice === "number" && i.basePrice > 0
          );
        }
        return (state ?? { items: [] }) as CartState;
      },
    }
  )
);

// Sinkronisasi antar-tab: event `storage` hanya memicu di tab LAIN (bukan tab
// yang menulis), jadi saat cart diubah di satu tab, tab aktif me-rehydrate agar
// tidak menampilkan data basi.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "razrbilz-cart") {
      useCartStore.persist.rehydrate();
    }
  });
}
