/**
 * Kurs USD → mata uang lain untuk tampilan harga internasional.
 *
 * Sumbernya sama dengan kurs USD→IDR (open.er-api.com), tetapi respons penuh
 * di-cache di memori proses selama 24 jam supaya /api/pricing tidak menambah
 * satu request eksternal per kunjungan. Cache sengaja tidak disimpan di DB:
 * angka ini hanya untuk tampilan, sedangkan harga bertagihan tetap dihitung
 * server dari kurs USD→IDR yang tersimpan.
 */

const OPEN_ER_API_URL = "https://open.er-api.com/v6/latest/USD";
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 5_000;

interface FxRateCache {
  rates: Record<string, number>;
  fetchedAt: number;
}

interface FxRateGlobal {
  __razrbilzFxRates?: FxRateCache;
  __razrbilzFxRatesInFlight?: Promise<FxRateCache | null>;
}

const globalStore = globalThis as FxRateGlobal;

function isFresh(cache: FxRateCache | undefined): cache is FxRateCache {
  return Boolean(cache && Date.now() - cache.fetchedAt < CACHE_DURATION_MS);
}

async function fetchRates(): Promise<FxRateCache | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(OPEN_ER_API_URL, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = (await res.json()) as { rates?: Record<string, unknown> };
    const rates: Record<string, number> = {};
    for (const [code, value] of Object.entries(data?.rates ?? {})) {
      const rate = Number(value);
      if (Number.isFinite(rate) && rate > 0) rates[code] = rate;
    }
    if (Object.keys(rates).length === 0) throw new Error("respons tanpa kurs");

    return { rates, fetchedAt: Date.now() };
  } catch (error) {
    console.error("[fx-rates] Gagal mengambil kurs:", error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function loadRates(): Promise<FxRateCache | null> {
  const cached = globalStore.__razrbilzFxRates;
  if (isFresh(cached)) return cached;

  const inFlight = globalStore.__razrbilzFxRatesInFlight;
  if (inFlight) return inFlight;

  // Guard di atas menyempitkan `cached` menjadi undefined; simpan versi luasnya
  // untuk fallback saat API gagal (angka lama masih lebih baik daripada IDR).
  const stale = cached as FxRateCache | undefined;

  const promise = fetchRates()
    .then((fresh) => {
      if (fresh) {
        globalStore.__razrbilzFxRates = fresh;
        return fresh;
      }
      return stale ?? null;
    })
    .finally(() => {
      globalStore.__razrbilzFxRatesInFlight = undefined;
    });

  globalStore.__razrbilzFxRatesInFlight = promise;
  return promise;
}

/** Kurs USD→`currency`, atau null bila kurs tidak tersedia. USD selalu 1. */
export async function getUsdToCurrency(
  currency: string
): Promise<number | null> {
  const code = (currency ?? "").trim().toUpperCase();
  if (!code) return null;
  if (code === "USD") return 1;

  const cache = await loadRates();
  const rate = cache?.rates[code];
  return typeof rate === "number" && rate > 0 ? rate : null;
}
