/**
 * Waktu produksi pre-order — data bisnis internal, TIDAK diketahui Biteship.
 * Ubah di sini saja kalau lead time berubah; semua tampilan estimasi tiba
 * (checkout dsb.) membaca dari konstanta ini.
 */
export const PRODUCTION_TIME_MIN_DAYS = 14;
export const PRODUCTION_TIME_MAX_DAYS = 21;

// `type`, bukan `interface`: butuh implicit index signature supaya bisa
// langsung dipakai sebagai vars pada tf() di checkout-i18n.
export type DurationRange = { min: number; max: number };

// Pembanding angka saat string durasi dari Biteship kosong/tak terbaca.
// Harus tetap sepadan dengan teks fallback lama ("2-4 / "10-14 business days").
export const COURIER_DURATION_FALLBACK_DOMESTIC: DurationRange = { min: 2, max: 4 };
export const COURIER_DURATION_FALLBACK_INTL: DurationRange = { min: 10, max: 14 };

/**
 * Ekstrak min–max dari string durasi kurir Biteship atau fallback server:
 * "1-2 days", "2 - 3 hari", "10-14 business days" → {min:10,max:14}.
 * Satu angka ("1 day") dianggap rentang tunggal. Null bila tak ada angka.
 */
export function parseDurationRange(duration?: string | null): DurationRange | null {
  const numbers = (duration || "").match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;
  const first = parseInt(numbers[0], 10);
  const second = numbers.length > 1 ? parseInt(numbers[1], 10) : first;
  if (!Number.isFinite(first) || !Number.isFinite(second) || first <= 0 || second <= 0) {
    return null;
  }
  return { min: Math.min(first, second), max: Math.max(first, second) };
}

/**
 * Total estimasi tiba yang boleh dilihat customer:
 * produksi pre-order + durasi kurir. Bukan durasi kurir mentah dari Biteship —
 * menampilkannya apa adanya menyesatkan (seolah barang sampai dalam hitungan hari).
 */
export function totalArrivalEstimate(
  courierDuration: string | null | undefined,
  fallback: DurationRange
): DurationRange {
  const courier = parseDurationRange(courierDuration) ?? fallback;
  return {
    min: PRODUCTION_TIME_MIN_DAYS + courier.min,
    max: PRODUCTION_TIME_MAX_DAYS + courier.max,
  };
}
