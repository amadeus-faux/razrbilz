import { describe, it } from "node:test";
import assert from "node:assert";
import { resolveDisplayPrice, roundUpTo5000, isInternational } from "../src/lib/pricing";

describe("Pricing Logic (Bagian 2)", () => {
  it("should round up to nearest 5000 correctly", () => {
    assert.strictEqual(roundUpTo5000(624085), 625000);
    assert.strictEqual(roundUpTo5000(625000), 625000);
    assert.strictEqual(roundUpTo5000(620001), 625000);
    assert.strictEqual(roundUpTo5000(620000), 620000);
    assert.strictEqual(roundUpTo5000(0), 0);
  });

  it("should detect international region correctly", () => {
    assert.strictEqual(isInternational("ID"), false);
    assert.strictEqual(isInternational("id"), false);
    assert.strictEqual(isInternational(""), false);
    assert.strictEqual(isInternational(undefined), false);
    assert.strictEqual(isInternational(null), false);
    assert.strictEqual(isInternational("US"), true);
    assert.strictEqual(isInternational("SG"), true);
    assert.strictEqual(isInternational("MY"), true);
    assert.strictEqual(isInternational("AU"), true);
  });

  it("should return base price unchanged for Indonesia", () => {
    assert.strictEqual(resolveDisplayPrice(350000, "ID", 17831), 350000);
    assert.strictEqual(resolveDisplayPrice(375000, "ID", 17831), 375000);
    assert.strictEqual(resolveDisplayPrice(350000, "id", 17831), 350000);
    assert.strictEqual(resolveDisplayPrice(350000, "", 17831), 350000);
  });

  it("should match required calculation examples for international customers", () => {
    // 350.000 IDR -> 35 USD -> * 17.831 = 624.085 -> ceil(624.085 / 5000) * 5000 = 625.000
    const price1 = resolveDisplayPrice(350000, "US", 17831);
    assert.strictEqual(price1, 625000);

    // 375.000 IDR -> 37.5 USD -> * 17.831 = 668.662,5 -> ceil(668.662,5 / 5000) * 5000 = 670.000
    const price2 = resolveDisplayPrice(375000, "US", 17831);
    assert.strictEqual(price2, 670000);
  });

  it("should use fallback rate if usdToIdr is 0 or negative", () => {
    // Default fallback is 17.500
    // 350.000 IDR -> 35 USD -> * 17.500 = 612.500 -> ceil(612.500 / 5000) * 5000 = 615.000
    const priceFallback = resolveDisplayPrice(350000, "US", 0);
    assert.strictEqual(priceFallback, 615000);
  });
});
