/**
 * Konversi tampilan harga IDR ke mata uang negara pembeli.
 *
 * Harga dasar dihitung server dalam IDR (lihat resolveDisplayPrice). Untuk
 * pembeli internasional, angka itu hanya dikonversi ulang ke mata uang lokal
 * saat ditampilkan; nominal yang ditagih PayPal tetap USD dari total IDR.
 */

import { formatRupiah } from "@/lib/utils";

export interface DisplayCurrency {
  currency: string;
  usdToCurrency: number;
}

export const DEFAULT_DISPLAY_CURRENCY: DisplayCurrency = {
  currency: "IDR",
  usdToCurrency: 1,
};

const fractionDigitsCache = new Map<string, number>();

function fractionDigitsFor(currency: string): number {
  const cached = fractionDigitsCache.get(currency);
  if (cached !== undefined) return cached;

  let digits = 2;
  try {
    const resolved = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).resolvedOptions();
    if (typeof resolved.maximumFractionDigits === "number") {
      digits = resolved.maximumFractionDigits;
    }
  } catch {
    digits = 2;
  }
  fractionDigitsCache.set(currency, digits);
  return digits;
}

export function isRupiah(currency: string): boolean {
  return currency.toUpperCase() === "IDR";
}

function roundToDigits(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/**
 * Konversi satu nominal IDR ke mata uang tampilan, dibulatkan ke digit minor
 * mata uang (2 untuk EUR/USD, 0 untuk JPY). IDR dikembalikan tanpa desimal.
 */
export function convertIdrPrice(
  amountIdr: number,
  usdToIdr: number,
  display: DisplayCurrency
): number {
  if (!Number.isFinite(amountIdr) || amountIdr <= 0) return 0;
  if (isRupiah(display.currency)) return Math.round(amountIdr);
  if (!Number.isFinite(usdToIdr) || usdToIdr <= 0) return 0;
  if (!Number.isFinite(display.usdToCurrency) || display.usdToCurrency <= 0) {
    return 0;
  }

  const value = (amountIdr / usdToIdr) * display.usdToCurrency;
  return roundToDigits(value, fractionDigitsFor(display.currency));
}

/** Bulatkan hasil kali harga satuan × jumlah ke digit minor mata uang. */
export function roundDisplayAmount(
  amount: number,
  currency: string
): number {
  if (!Number.isFinite(amount)) return 0;
  return roundToDigits(
    amount,
    isRupiah(currency) ? 0 : fractionDigitsFor(currency)
  );
}

/** Format nominal yang sudah dikonversi. IDR memakai format Rupiah lama. */
export function formatPriceAmount(amount: number, currency: string): string {
  const value = Number.isFinite(amount) ? amount : 0;
  if (isRupiah(currency)) return formatRupiah(value);

  const digits = fractionDigitsFor(currency);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(digits)}`;
  }
}

/** Konversi + format satu harga IDR ke mata uang tampilan. */
export function formatPriceFromIdr(
  amountIdr: number,
  usdToIdr: number,
  display: DisplayCurrency
): string {
  return formatPriceAmount(
    convertIdrPrice(amountIdr, usdToIdr, display),
    display.currency
  );
}
