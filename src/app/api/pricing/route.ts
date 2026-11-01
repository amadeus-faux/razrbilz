import { NextResponse, type NextRequest } from "next/server";
import { getActiveExchangeRate } from "@/lib/exchange-rate";
import { currencyForCountry } from "@/lib/countries";
import { getUsdToCurrency } from "@/lib/fx-rates";
import { isInternational, normalizeCountryCode } from "@/lib/pricing";
import { withProbe, type Probe } from "@/lib/perf-probe";

async function handleGET(request: NextRequest, probe: Probe) {
  try {
    const { searchParams } = new URL(request.url);
    const countryParam = searchParams.get("country");
    const cookieCountry = request.cookies.get("user_country")?.value;
    const headerCountry =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry");

    const region = normalizeCountryCode(
      countryParam || cookieCountry || headerCountry || "ID"
    );
    const international = isInternational(region);
    const currencyCode = international ? currencyForCountry(region) : "IDR";

    const [rate, localRate] = await Promise.all([
      probe.time("fx", () => getActiveExchangeRate(probe)),
      international
        ? probe.time("fx_local", () => getUsdToCurrency(currencyCode))
        : Promise.resolve(null),
    ]);

    // Tanpa kurs lokal, tampilkan USD (dan nominalnya sama dengan tagihan
    // PayPal) daripada diam-diam kembali ke IDR.
    const hasLocalRate =
      international && typeof localRate === "number" && localRate > 0;
    const currency = international && !hasLocalRate ? "USD" : currencyCode;
    const usdToCurrency = hasLocalRate ? (localRate as number) : 1;

    const response = NextResponse.json({
      region,
      usdToIdr: rate,
      isInternational: international,
      currency,
      usdToCurrency,
    });

    // If explicit country parameter was provided, sync user_country cookie
    const normalizedParam = countryParam
      ? normalizeCountryCode(countryParam, "")
      : "";
    if (normalizedParam) {
      response.cookies.set("user_country", normalizedParam, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }

    response.headers.set("Vary", "Cookie");
    return response;
  } catch (error) {
    console.error("[api/pricing] GET error:", error);
    return NextResponse.json(
      { error: "Failed to resolve pricing info" },
      { status: 500 }
    );
  }
}

export const GET = withProbe(handleGET);
