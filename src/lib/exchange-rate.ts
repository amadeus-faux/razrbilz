import { prisma } from "@/lib/prisma";
import { DEFAULT_FALLBACK_USD_IDR } from "./pricing";
import type { Probe } from "@/lib/perf-probe";

const OPEN_ER_API_URL = "https://open.er-api.com/v6/latest/USD";
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface ExchangeRateInfo {
  usdToIdr: number;
  source: string;
  isOverride: boolean;
  updatedAt: Date;
  expiresAt: Date | null;
}

/**
 * Fetch latest USD -> IDR exchange rate from open.er-api.com and cache in DB
 */
export async function fetchAndCacheExchangeRate(
  probe?: Probe
): Promise<ExchangeRateInfo> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const fetchRate = async () => {
      const response = await fetch(OPEN_ER_API_URL, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      clearTimeout(timeoutId);
      return response;
    };

    const response = probe ? await probe.time("fx_external", fetchRate) : await fetchRate();

    if (!response.ok) {
      throw new Error(`Exchange rate API responded with status ${response.status}`);
    }

    const data = await response.json();
    const idrRate = Number(data?.rates?.IDR);

    if (!idrRate || isNaN(idrRate) || idrRate <= 0) {
      throw new Error("Invalid rate received from open.er-api.com");
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_DURATION_MS);

    // Update existing API rate or create new
    const findExisting = () =>
      prisma.exchangeRate.findFirst({
        where: { isOverride: false },
        orderBy: { updatedAt: "desc" },
      });
    const existing = probe ? await probe.time("db_fx_read", findExisting) : await findExisting();

    let saved;
    if (existing) {
      const update = () =>
        prisma.exchangeRate.update({
          where: { id: existing.id },
          data: {
            usdToIdr: idrRate,
            source: "api",
            updatedAt: now,
            expiresAt,
          },
        });
      saved = probe ? await probe.time("db_fx_write", update) : await update();
    } else {
      const create = () =>
        prisma.exchangeRate.create({
          data: {
            usdToIdr: idrRate,
            source: "api",
            isOverride: false,
            updatedAt: now,
            expiresAt,
          },
        });
      saved = probe ? await probe.time("db_fx_write", create) : await create();
    }

    return {
      usdToIdr: saved.usdToIdr,
      source: saved.source,
      isOverride: saved.isOverride,
      updatedAt: saved.updatedAt,
      expiresAt: saved.expiresAt,
    };
  } catch (error) {
    console.error("[exchange-rate] Error fetching from external API:", error);

    // Fallback: check if we have any previous record in DB
    const latest = await prisma.exchangeRate.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (latest) {
      return {
        usdToIdr: latest.usdToIdr,
        source: latest.source,
        isOverride: latest.isOverride,
        updatedAt: latest.updatedAt,
        expiresAt: latest.expiresAt,
      };
    }

    // Default fallback if DB has no records at all
    const fallback = await prisma.exchangeRate.create({
      data: {
        usdToIdr: DEFAULT_FALLBACK_USD_IDR,
        source: "fallback",
        isOverride: false,
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + CACHE_DURATION_MS),
      },
    });

    return {
      usdToIdr: fallback.usdToIdr,
      source: fallback.source,
      isOverride: fallback.isOverride,
      updatedAt: fallback.updatedAt,
      expiresAt: fallback.expiresAt,
    };
  }
}

/**
 * Returns current active exchange rate info.
 * Priority:
 * 1. Manual override (if active)
 * 2. Cached API rate (if not expired)
 * 3. Fresh fetch from external API
 * 4. Stale DB record
 * 5. Default fallback (17,500)
 */
export async function getActiveExchangeRateInfo(probe?: Probe): Promise<ExchangeRateInfo> {
  try {
    // 1. Check for manual override
    const findOverride = () =>
      prisma.exchangeRate.findFirst({
        where: { isOverride: true },
        orderBy: { updatedAt: "desc" },
      });
    const override = probe ? await probe.time("db_fx_override", findOverride) : await findOverride();
    if (override) {
      return {
        usdToIdr: override.usdToIdr,
        source: override.source,
        isOverride: true,
        updatedAt: override.updatedAt,
        expiresAt: override.expiresAt,
      };
    }

    // 2. Check for active unexpired cache
    const findActive = () =>
      prisma.exchangeRate.findFirst({
        where: {
          isOverride: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { updatedAt: "desc" },
      });
    const activeCache = probe ? await probe.time("db_fx_active", findActive) : await findActive();
    if (activeCache) {
      return {
        usdToIdr: activeCache.usdToIdr,
        source: activeCache.source,
        isOverride: false,
        updatedAt: activeCache.updatedAt,
        expiresAt: activeCache.expiresAt,
      };
    }

    // 3. Cache expired or not found -> fetch fresh
    return await fetchAndCacheExchangeRate(probe);
  } catch (error) {
    console.error("[exchange-rate] Error resolving active rate:", error);
    return {
      usdToIdr: DEFAULT_FALLBACK_USD_IDR,
      source: "fallback",
      isOverride: false,
      updatedAt: new Date(),
      expiresAt: null,
    };
  }
}

/**
 * Convenience helper returning just the number (used in pricing calculations)
 */
export async function getActiveExchangeRate(probe?: Probe): Promise<number> {
  const info = await getActiveExchangeRateInfo(probe);
  return info.usdToIdr;
}

/**
 * Set manual override exchange rate
 */
export async function setManualOverrideRate(rate: number): Promise<ExchangeRateInfo> {
  const roundedRate = Math.round(rate * 100) / 100;
  const existing = await prisma.exchangeRate.findFirst({
    where: { isOverride: true },
  });

  let record;
  if (existing) {
    record = await prisma.exchangeRate.update({
      where: { id: existing.id },
      data: {
        usdToIdr: roundedRate,
        source: "manual",
        isOverride: true,
        updatedAt: new Date(),
        expiresAt: null,
      },
    });
  } else {
    record = await prisma.exchangeRate.create({
      data: {
        usdToIdr: roundedRate,
        source: "manual",
        isOverride: true,
        updatedAt: new Date(),
        expiresAt: null,
      },
    });
  }

  return {
    usdToIdr: record.usdToIdr,
    source: record.source,
    isOverride: record.isOverride,
    updatedAt: record.updatedAt,
    expiresAt: record.expiresAt,
  };
}

/**
 * Clear manual override, restoring automatic API rate
 */
export async function clearManualOverrideRate(): Promise<ExchangeRateInfo> {
  await prisma.exchangeRate.deleteMany({
    where: { isOverride: true },
  });
  return await getActiveExchangeRateInfo();
}
