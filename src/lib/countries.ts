import countries from "world-countries";

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES: CountryOption[] = countries
  .map((c) => ({
    code: c.cca2,
    name: c.name.common,
    flag: c.flag,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "id", { sensitivity: "base" }));

const CURRENCY_BY_COUNTRY = new Map<string, string>(
  countries.flatMap((country) => {
    const [currency] = Object.keys(country.currencies ?? {});
    return currency ? [[country.cca2, currency] as const] : [];
  })
);

export function currencyForCountry(country?: string | null): string {
  const code = (country ?? "").trim().toUpperCase();
  return CURRENCY_BY_COUNTRY.get(code) ?? "USD";
}
