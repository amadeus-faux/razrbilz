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
