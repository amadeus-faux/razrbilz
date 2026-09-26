import type { Locale } from "@/lib/checkout-i18n";

/**
 * Klasifikasi metode pembayaran Duitku ke kategori tampilan, supaya instruksi
 * pembayaran yang dirender SESUAI metode yang benar-benar dipilih customer.
 *
 * murni (tanpa Node API) → aman di-import dari client component (PaymentModal)
 * maupun server component (halaman instruksi).
 *
 * PENTING: kategori ditentukan dari nama/kode metode, BUKAN dari field mana yang
 * terisi. Duitku kadang mengembalikan kode pembayaran retail (Indomaret/Alfamart)
 * di field `vaNumber`; kalau kita render berdasarkan "ada vaNumber → VA", metode
 * retail akan salah ditampilkan sebagai transfer Virtual Account (Bug 3).
 */
export type PaymentMethodCategory =
  | "qris"
  | "retail"
  | "ewallet"
  | "cc"
  | "va"
  | "other";

// Kode retail yang terkonfirmasi dari data produksi (IR = Indomaret).
// Kode bank/VA lain sengaja TIDAK dimasukkan ke retail agar tidak salah klasifikasi.
const RETAIL_CODES = new Set(["IR"]);
const QRIS_CODES = new Set(["NQ", "SP", "LQ", "GQ"]);
const EWALLET_CODES = new Set(["DA", "OV", "SA", "LA"]);

export function classifyPaymentMethod(input: {
  code?: string | null;
  name?: string | null;
}): PaymentMethodCategory {
  const code = (input.code ?? "").trim().toUpperCase();
  const name = (input.name ?? "").trim().toUpperCase();

  if (name.includes("QRIS") || QRIS_CODES.has(code)) return "qris";

  if (
    name.includes("INDOMARET") ||
    name.includes("ALFAMART") ||
    name.includes("ALFA") ||
    name.includes("RETAIL") ||
    RETAIL_CODES.has(code)
  ) {
    return "retail";
  }

  if (
    name.includes("OVO") ||
    name.includes("DANA") ||
    name.includes("SHOPEEPAY") ||
    name.includes("LINKAJA") ||
    name.includes("GOPAY") ||
    EWALLET_CODES.has(code)
  ) {
    return "ewallet";
  }

  if (name.includes("CREDIT CARD") || name.includes("KARTU KREDIT") || code === "VC") {
    return "cc";
  }

  if (name.includes("VIRTUAL") || name.includes("VA") || name.includes("BANK")) {
    return "va";
  }

  return "other";
}

/** Label retailer yang ramah untuk instruksi (mis. "Indomaret" / "Alfamart"). */
export function retailOutletLabel(
  nameOrCode?: string | null,
  locale: Locale = "id"
): string {
  const n = (nameOrCode ?? "").toUpperCase();
  if (n.includes("ALFA")) return "Alfamart";
  // "IR" = kode Indomaret yang terkonfirmasi dari data produksi.
  if (n.includes("INDO") || n === "IR") return "Indomaret";
  // Nama retailer tak dikenal → kembalikan apa adanya; hanya fallback-nya yang
  // sadar-lokal, supaya UI Inggris tidak menampilkan "gerai retail".
  return nameOrCode?.trim() || (locale === "en" ? "retail outlet" : "gerai retail");
}
