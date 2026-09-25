/**
 * Centralized Pricing Module
 *
 * Rules:
 * - Indonesia (ID): Original base IDR price → dibulatkan ke kelipatan Rp 5.000 lalu dikurangi Rp 1.000
 *     Contoh: Rp 350.000 → Rp 349.000
 * - International (non-ID):
 *     hargaUSD = basePriceIDR / 10.000 (fixed internal rate)
 *     hargaBaru = hargaUSD * usdToIdr
 *     hargaFinal = dibulatkan ke kelipatan Rp 5.000 lalu dikurangi Rp 1.000 (selalu berakhiran ...9.000 / Rp ...999)
 *     Contoh:
 *       Rp 630.000 → Rp 629.000
 *       Rp 626.752 → ceil(626.752 / 5000) * 5000 = Rp 630.000 → Rp 629.000
 */

export const INTERNAL_USD_RATE = 10_000;
export const DEFAULT_FALLBACK_USD_IDR = 17_500;

/**
 * Check if the given country/region is international (outside Indonesia)
 */
export function isInternational(region?: string | null): boolean {
  if (!region) return false;
  return region.trim().toUpperCase() !== "ID";
}

/**
 * Rounds a price to nearest multiple of 5,000 and subtracts 1,000:
 * Formula: Math.ceil(amount / 5000) * 5000 - 1000
 *
 * Sifat:
 * - Otomatis idempotent: f(f(x)) === f(x)
 *   Misal: 350.000 -> 349.000. Lalu f(349.000) = ceil(349000 / 5000) * 5000 - 1000 = 350.000 - 1000 = 349.000.
 */
export function roundToNearest5000Minus1000(amount: number): number {
  if (amount <= 0) return 0;
  const rounded = Math.ceil(amount / 5000) * 5000 - 1000;
  return rounded > 0 ? rounded : amount;
}

// Aliases for compatibility
export const roundToNearest1000Minus1000 = roundToNearest5000Minus1000;
export const roundUpTo5000 = roundToNearest5000Minus1000;

/**
 * Resolves the display/checkout price for a product.
 * Used everywhere across shop, product detail, cart, checkout, and payment.
 *
 * - Local (ID): basePriceIDR → ceil to 5.000, minus 1.000 (e.g. 350.000 -> 349.000)
 * - International: converted via usdToIdr rate → ceil to 5.000, minus 1.000 (e.g. 626.752 -> 629.000)
 */
export function resolveDisplayPrice(
  basePriceIDR: number,
  region: string | null | undefined,
  usdToIdr: number
): number {
  if (!basePriceIDR || basePriceIDR <= 0) return 0;

  if (!isInternational(region)) {
    return roundToNearest5000Minus1000(basePriceIDR);
  }

  const rate = usdToIdr > 0 ? usdToIdr : DEFAULT_FALLBACK_USD_IDR;
  const priceUSD = basePriceIDR / INTERNAL_USD_RATE;
  const converted = priceUSD * rate;
  return roundToNearest5000Minus1000(converted);
}
