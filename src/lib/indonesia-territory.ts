/**
 * Indonesia Territory Data
 * Source: daftar-wilayah-indonesia (Kemendagri official codes)
 * Provides complete province → kota/kabupaten → kecamatan hierarchy
 * 34 provinces, 516 cities/kabupaten, 7,246 kecamatan
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const rawWilayah = require("daftar-wilayah-indonesia");
const wilayah =
  typeof rawWilayah?.provinsi === "function"
    ? rawWilayah
    : typeof rawWilayah?.default?.provinsi === "function"
    ? rawWilayah.default
    : rawWilayah;

export const ALL_INDONESIAN_PROVINCES = [
  "Aceh",
  "Bali",
  "Banten",
  "Bengkulu",
  "DI Yogyakarta",
  "DKI Jakarta",
  "Gorontalo",
  "Jambi",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Kalimantan Barat",
  "Kalimantan Selatan",
  "Kalimantan Tengah",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Kepulauan Bangka Belitung",
  "Kepulauan Riau",
  "Lampung",
  "Maluku",
  "Maluku Utara",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Papua",
  "Papua Barat",
  "Papua Barat Daya",
  "Papua Pegunungan",
  "Papua Selatan",
  "Papua Tengah",
  "Riau",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Sulawesi Tengah",
  "Sulawesi Tenggara",
  "Sulawesi Utara",
  "Sumatera Barat",
  "Sumatera Selatan",
  "Sumatera Utara",
];

interface WilayahItem {
  kode: string;
  nama: string;
  kode_provinsi?: string;
  kode_kabupaten?: string;
  kode_kecamatan?: string;
}

// ── Lazy-loaded indexes ───────────────────────────────────────────────────────
let _provinsiList: WilayahItem[] | null = null;
/** Map: lowercase province name → kode */
let _provinsiByName: Map<string, string> | null = null;
/** Map: kode_provinsi → sorted list of kota/kabupaten items */
let _kabupatenByProv: Map<string, WilayahItem[]> | null = null;
/** Map: lowercase kota/kab name → kode */
let _kabupatenNameToKode: Map<string, string> | null = null;

function formatProvinceName(rawName: string): string {
  const lower = rawName.toLowerCase().trim();
  if (lower === "dki jakarta") return "DKI Jakarta";
  if (lower === "di yogyakarta" || lower === "daerah istimewa yogyakarta") return "DI Yogyakarta";
  // Title case
  return rawName
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getProvinsiList(): WilayahItem[] {
  if (!_provinsiList) {
    try {
      if (typeof wilayah?.provinsi === "function") {
        const rawList = wilayah.provinsi() as WilayahItem[];
        _provinsiList = rawList.map((p) => ({
          ...p,
          nama: formatProvinceName(p.nama),
        }));
      }
    } catch {
      // ignore
    }
    if (!_provinsiList || _provinsiList.length === 0) {
      _provinsiList = ALL_INDONESIAN_PROVINCES.map((name, idx) => ({
        kode: String(idx + 1),
        nama: name,
      }));
    }
  }
  return _provinsiList;
}

function buildKabupatenIndex() {
  if (_kabupatenByProv) return;
  _kabupatenByProv = new Map();
  _kabupatenNameToKode = new Map();
  try {
    if (typeof wilayah?.kabupaten === "function") {
      const allKab: WilayahItem[] = wilayah.kabupaten() as WilayahItem[];
      for (const k of allKab) {
        const provCode = k.kode_provinsi!;
        if (!_kabupatenByProv.has(provCode)) {
          _kabupatenByProv.set(provCode, []);
        }
        _kabupatenByProv.get(provCode)!.push(k);
        // Exact name → kode
        _kabupatenNameToKode!.set(k.nama.toLowerCase(), k.kode);
      }
    }
  } catch {
    // ignore
  }
}

function getProvinsiByNameMap(): Map<string, string> {
  if (!_provinsiByName) {
    _provinsiByName = new Map();
    for (const p of getProvinsiList()) {
      _provinsiByName.set(p.nama.toLowerCase(), p.kode);
    }
  }
  return _provinsiByName;
}

/** Find the kode for a province by any reasonable name variant */
export function findProvinceKode(provinceName: string): string | null {
  if (!provinceName) return null;
  const map = getProvinsiByNameMap();
  const lower = provinceName.toLowerCase().trim();

  // 1. Exact match
  if (map.has(lower)) return map.get(lower)!;

  // 2. Partial: query contains stored name OR stored name contains query
  for (const [storedName, kode] of map.entries()) {
    if (storedName.includes(lower) || lower.includes(storedName)) {
      return kode;
    }
  }
  return null;
}

/** Find the kode for a kabupaten by any reasonable name variant */
export function findKabKode(cityName: string, provinceName?: string): string | null {
  if (!cityName) return null;
  buildKabupatenIndex();
  const lowerCity = cityName.toLowerCase().trim();

  // If province is provided, search scoped to that province first
  if (provinceName) {
    const provKode = findProvinceKode(provinceName);
    if (provKode && _kabupatenByProv?.has(provKode)) {
      const list = _kabupatenByProv.get(provKode)!;
      // 1. exact match
      const exact = list.find((k) => k.nama.toLowerCase() === lowerCity);
      if (exact) return exact.kode;

      // 2. strip "kota " or "kabupaten " prefix
      const strippedInput = lowerCity.replace(/^(kota|kabupaten|kab\.)\s+/i, "");
      const matchedNoPrefix = list.find((k) => {
        const itemStripped = k.nama.toLowerCase().replace(/^(kota|kabupaten|kab\.)\s+/i, "");
        return itemStripped === strippedInput;
      });
      if (matchedNoPrefix) return matchedNoPrefix.kode;

      // 3. partial match
      const partial = list.find(
        (k) =>
          k.nama.toLowerCase().includes(lowerCity) ||
          lowerCity.includes(k.nama.toLowerCase())
      );
      if (partial) return partial.kode;
    }
  }

  // Fallback global search
  if (!_kabupatenNameToKode) return null;
  if (_kabupatenNameToKode.has(lowerCity)) return _kabupatenNameToKode.get(lowerCity)!;

  for (const [storedName, kode] of _kabupatenNameToKode.entries()) {
    if (storedName.includes(lowerCity) || lowerCity.includes(storedName)) {
      return kode;
    }
  }
  return null;
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Returns all 34 Indonesian province names */
export function getAllProvinces(): string[] {
  return getProvinsiList().map((p) => p.nama).sort();
}

/** Returns all kota/kabupaten for a given province name (any case variant) */
export function getCitiesByProvince(provinceName: string): string[] {
  buildKabupatenIndex();
  const kode = findProvinceKode(provinceName);
  if (!kode || !_kabupatenByProv) return [];
  const kabList = _kabupatenByProv.get(kode) || [];
  return kabList.map((k) => k.nama).sort();
}

/** Returns all kecamatan for a given kota/kabupaten name (any case variant) */
export function getDistrictsByCity(
  provinceName: string,
  cityName: string
): string[] {
  try {
    buildKabupatenIndex();
    const kabKode = findKabKode(cityName, provinceName);
    if (!kabKode || typeof wilayah?.kecamatan !== "function") return [];
    const kecList: WilayahItem[] = wilayah.kecamatan(kabKode) as WilayahItem[];
    return (kecList || []).map((k) => k.nama).sort();
  } catch {
    return [];
  }
}


