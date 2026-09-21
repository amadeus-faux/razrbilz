/**
 * Centralized Pricing Module
 * 
 * Rules:
 * - Indonesia (ID): Original base IDR price
 * - International (non-ID):
 *     hargaUSD = basePriceIDR / 10.000 (fixed internal rate)
 *     hargaBaru = hargaUSD * usdToIdr
 *     hargaFinal = ceil(hargaBaru / 5000) * 5000 (rounded up to nearest 5.000)
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
 * Rounds up an amount to the nearest multiple of 5,000.
 * If the amount is already an exact multiple of 5,000, it stays unchanged.
 */
export function roundUpTo5000(amount: number): number {
  if (amount <= 0) return 0;
  return Math.ceil(amount / 5000) * 5000;
}

/**
 * Resolves the display/checkout price for a product.
 * Used everywhere across shop, product detail, cart, checkout, and payment.
 */
export function resolveDisplayPrice(
  basePriceIDR: number,
  region: string | null | undefined,
  usdToIdr: number
): number {
  if (!basePriceIDR || basePriceIDR <= 0) return 0;
  if (!isInternational(region)) {
    return basePriceIDR;
  }

  const rate = usdToIdr > 0 ? usdToIdr : DEFAULT_FALLBACK_USD_IDR;
  const priceUSD = basePriceIDR / INTERNAL_USD_RATE;
  const converted = priceUSD * rate;
  return roundUpTo5000(converted);
}
