/**
 * Format a number as Indonesian Rupiah currency
 */
export function formatRupiah(amount: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

/**
 * Generate a unique, unguessable order number.
 * Memakai crypto.getRandomValues (tersedia di Node 19+ & browser) — BUKAN
 * Math.random() — agar orderNumber tidak praktis ditebak/di-brute-force,
 * karena nomor ini dipakai sebagai akses tracking tanpa login.
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const bytes = new Uint8Array(8); // 64-bit entropy
  crypto.getRandomValues(bytes);
  const random = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `RZ-${timestamp}-${random}`;
}

/**
 * Slugify a string for URL-safe usage
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
