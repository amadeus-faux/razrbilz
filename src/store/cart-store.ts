"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { MAX_QTY_PER_PRODUCT } from "@/lib/order-limits";

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

/**
 * Quantity maksimum yang boleh dipegang SATU baris (productId + size) agar total
 * produk itu tetap di bawah batas 5. Batas ini menggabungkan semua ukuran, jadi
 * clamp per baris saja akan salah: 3 pcs size M hanya menyisakan 2 pcs untuk
 * baris size L, bukan 5.
 */
export function maxQtyForLine(
  items: readonly CartItem[],
  productId: string,
  excludeSize: string
): number {
  const others = items
    .filter((i) => i.productId === productId && i.size !== excludeSize)
    .reduce((sum, i) => sum + i.quantity, 0);
  return Math.max(0, MAX_QTY_PER_PRODUCT - others);
}

/**
 * Potong keranjang yang melewati batas 5 per produk. Baris paling akhir yang
 * dikurangi lebih dulu, dan baris yang sisanya 0 dibuang. Mengembalikan array
 * yang sama bila tidak ada yang perlu diubah.
 */
function enforcePerProductLimit(items: CartItem[]): CartItem[] {
  const used = new Map<string, number>();
  let changed = false;

  const next = items.reduce<CartItem[]>((acc, item) => {
    const seen = used.get(item.productId) ?? 0;
    const allowed = Math.max(
      0,
      Math.min(item.quantity, MAX_QTY_PER_PRODUCT - seen)
    );
    used.set(item.productId, seen + allowed);

    if (allowed === item.quantity) {
      acc.push(item);
      return acc;
    }
    changed = true;
    if (allowed > 0) acc.push({ ...item, quantity: allowed });
    return acc;
  }, []);

  return changed ? next : items;
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
        const stockMax =
          typeof item.stock === "number" && item.stock > 0 ? item.stock : Infinity;
        const max = Math.min(
          stockMax,
          maxQtyForLine(items, item.productId, item.size)
        );

        if (existing) {
          const nextQty = Math.min(existing.quantity + 1, max);
          // Tidak ada ruang tersisa: jangan ubah apa pun, terutama jangan
          // menurunkan quantity baris ini.
          if (nextQty <= existing.quantity) return;
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.size === item.size
                ? { ...i, quantity: nextQty, stock: item.stock ?? i.stock }
                : i
            ),
          });
        } else {
          if (max < 1) return;
          set({ items: [...items, { ...item, quantity: 1 }] });
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
        const { items } = get();
        const budget = maxQtyForLine(items, productId, size);
        set({
          items: items
            .map((i) => {
              if (i.productId === productId && i.size === size) {
                const stockMax =
                  typeof i.stock === "number" && i.stock > 0 ? i.stock : Infinity;
                return { ...i, quantity: Math.min(quantity, stockMax, budget) };
              }
              return i;
            })
            // Baris yang kehabisan kuota (hanya mungkin pada keranjang lama)
            // dibuang, bukan ditinggal dengan quantity 0.
            .filter((i) => i.quantity > 0),
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
      // Normalisasi saat hydrate: keranjang yang disimpan sebelum batas 5 ini
      // ada (atau yang diedit langsung di localStorage) dipotong di sini, supaya
      // customer tidak pernah melihat keranjang yang pasti ditolak saat submit.
      merge: (persistedState, currentState) => {
        const merged = {
          ...currentState,
          ...(persistedState as Partial<CartState>),
        };
        return { ...merged, items: enforcePerProductLimit(merged.items ?? []) };
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
