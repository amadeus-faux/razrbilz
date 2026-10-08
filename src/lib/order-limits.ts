// Batas quantity per pesanan sesuai Terms of Service bagian 8: maksimum 5 unit
// untuk satu Produk, dihitung menggabungkan semua ukuran. Satu sumber kebenaran
// supaya client dan server tidak mungkin berbeda.
//
// Modul ini sengaja tanpa dependensi apa pun agar aman diimpor dari server route,
// cart store (client), dan halaman checkout.
export const MAX_QTY_PER_PRODUCT = 5;

interface HasProductQuantity {
  productId: string;
  quantity: number;
}

/** Total quantity per productId, ukuran diabaikan (dijumlahkan). */
export function sumQuantityPerProduct<T extends HasProductQuantity>(
  items: readonly T[]
): Map<string, number> {
  const totals = new Map<string, number>();
  for (const item of items) {
    totals.set(item.productId, (totals.get(item.productId) ?? 0) + item.quantity);
  }
  return totals;
}

/**
 * Produk pertama yang melewati batas, atau null kalau semua patuh. Dipakai client
 * untuk menolak sebelum submit; server tetap melakukan pemeriksaan sendiri.
 */
export function firstProductOverLimit<T extends HasProductQuantity>(
  items: readonly T[]
): { productId: string; total: number } | null {
  for (const [productId, total] of sumQuantityPerProduct(items)) {
    if (total > MAX_QTY_PER_PRODUCT) return { productId, total };
  }
  return null;
}
