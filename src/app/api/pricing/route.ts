import { NextResponse, type NextRequest } from "next/server";
import { getActiveExchangeRate } from "@/lib/exchange-rate";
import { isInternational } from "@/lib/pricing";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryParam = searchParams.get("country");
    const cookieCountry = request.cookies.get("user_country")?.value;
    const headerCountry =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry");

    const region = (countryParam || cookieCountry || headerCountry || "ID").toUpperCase();
    const rate = await getActiveExchangeRate();
    const international = isInternational(region);

    const response = NextResponse.json({
      region,
      usdToIdr: rate,
      isInternational: international,
    });

    // If explicit country parameter was provided, sync user_country cookie
    if (countryParam && countryParam.length === 2) {
      response.cookies.set("user_country", countryParam.toUpperCase(), {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }

    response.headers.set("Vary", "Cookie");
    return response;
  } catch (error: any) {
    console.error("[api/pricing] GET error:", error);
    return NextResponse.json(
      { error: "Failed to resolve pricing info" },
      { status: 500 }
    );
  }
}
