import { getShippingRates, type BiteshipCourierRate } from "@/lib/biteship";

/**
 * Sumber tunggal (server-authoritative) untuk ongkos pengiriman.
 * Dipakai bersama oleh /api/shipping/rates (untuk menampilkan opsi ke buyer)
 * dan /api/checkout (untuk menagih). Dengan begitu harga yang dilihat client
 * dan yang dihitung server selalu berasal dari logika yang sama, dan client
 * TIDAK PERNAH menentukan ongkirnya sendiri.
 */

// Berat acuan per item (gram) untuk quote Biteship. Harus sama antara saat
// menampilkan tarif dan saat checkout agar harganya konsisten.
export const WEIGHT_PER_ITEM_GRAMS = 350;

// Ongkir internasional flat. Saat ini satu tarif global untuk semua negara.
// Isi INTERNATIONAL_FLAT_RATES bila nanti perlu tarif khusus per negara,
// mis. { US: 950000, SG: 250000 }. Negara yang tidak terdaftar memakai default.
export const DEFAULT_INTERNATIONAL_FLAT_RATE = 820_000;
export const INTERNATIONAL_FLAT_RATES: Record<string, number> = {};

// 6.5: SATU sumber kebenaran untuk kurir internasional. Label ini yang dikirim
// ke client (checkout) DAN yang tersimpan ke order.courier (dilihat admin),
// jadi nama kurir fisik yang dipilih admin saat mengirim paket = yang dilihat
// customer. Jangan hardcode label terpisah di tempat lain.
export const INTERNATIONAL_COURIER = {
  courier_name: "POS INDONESIA",
  courier_code: "intl_express",
  courier_service_name: "International Shipping",
  courier_service_code: "intl_priority",
  description: "POS Indonesia International Tracked Shipping (Flat Rate)",
  duration: "10-14 business days",
};

// Fallback domestik saat BITESHIP_API_KEY tidak dikonfigurasi.
const DOMESTIC_RATES_WITHOUT_API_KEY: BiteshipCourierRate[] = [
  {
    courier_name: "SiCepat",
    courier_code: "sicepat",
    courier_service_name: "SIUNT (Reguler)",
    courier_service_code: "siunt",
    description: "SiCepat Untung Reguler",
    duration: "1-2 hari",
    price: 18000,
  },
  {
    courier_name: "JNE",
    courier_code: "jne",
    courier_service_name: "REG (Reguler)",
    courier_service_code: "reg",
    description: "Layanan Reguler JNE",
    duration: "2-3 hari",
    price: 20000,
  },
  {
    courier_name: "J&T",
    courier_code: "jnt",
    courier_service_name: "EZ",
    courier_service_code: "ez",
    description: "J&T Express Reguler",
    duration: "2-3 hari",
    price: 19000,
  },
];

// Fallback domestik saat Biteship error / tidak melayani tujuan.
const DOMESTIC_RATES_STANDARD_FALLBACK: BiteshipCourierRate[] = [
  {
    courier_name: "J&T",
    courier_code: "jnt",
    courier_service_name: "EZ",
    courier_service_code: "ez",
    description: "Layanan Reguler J&T",
    duration: "2-3 hari",
    price: 8000,
  },
  {
    courier_name: "JNE",
    courier_code: "jne",
    courier_service_name: "REG",
    courier_service_code: "reg",
    description: "Layanan Reguler JNE",
    duration: "2-3 hari",
    price: 9000,
  },
  {
    courier_name: "SiCepat",
    courier_code: "sicepat",
    courier_service_name: "Reguler",
    courier_service_code: "reg",
    description: "Layanan Reguler SiCepat",
    duration: "1-2 hari",
    price: 8000,
  },
];

export function isInternationalCountry(country?: string | null): boolean {
  if (!country) return false;
  const c = country.trim().toUpperCase();
  return c !== "" && c !== "ID" && c !== "INDONESIA";
}

/** Ongkir internasional yang ditentukan SERVER berdasarkan negara tujuan. */
export function getInternationalShippingCost(countryCode: string): number {
  const code = (countryCode || "").trim().toUpperCase();
  if (code in INTERNATIONAL_FLAT_RATES) {
    return INTERNATIONAL_FLAT_RATES[code];
  }
  return DEFAULT_INTERNATIONAL_FLAT_RATE;
}

export interface ShippingQuoteItem {
  name?: string;
  quantity: number;
  // 2.5: berat asli per unit (gram) dari DB. Bila tidak diisi, fallback ke
  // WEIGHT_PER_ITEM_GRAMS. Server yang menyuplai nilai ini (dari Product),
  // bukan client, supaya ongkir tidak bisa dimanipulasi.
  weightGrams?: number;
}

export interface ShippingRatesParams {
  country?: string | null;
  destinationPostalCode?: string;
  items: ShippingQuoteItem[];
  couriers?: string;
}

export type ShippingRatesResult =
  | { ok: true; rates: BiteshipCourierRate[]; isFallback?: boolean; fallbackReason?: string }
  | { ok: false; error: string };

/**
 * Menghasilkan daftar tarif pengiriman otoritatif dari server.
 * - Internasional: flat rate (tanpa panggilan API apa pun).
 * - Domestik (ID): quote Biteship; fallback ke konstanta server bila API
 *   tidak tersedia/gagal. Client tidak pernah memasok harga.
 */
export async function getServerShippingRates(
  params: ShippingRatesParams
): Promise<ShippingRatesResult> {
  const { country, destinationPostalCode, items, couriers } = params;

  if (isInternationalCountry(country)) {
    return {
      ok: true,
      rates: [
        {
          ...INTERNATIONAL_COURIER,
          price: getInternationalShippingCost(String(country)),
        },
      ],
    };
  }

  const cleanPostal = (destinationPostalCode || "").trim();
  if (cleanPostal.length < 5) {
    return { ok: false, error: "Kode pos tujuan tidak valid (harus 5 digit)" };
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return { ok: false, error: "Item tidak boleh kosong" };
  }

  const originPostalCode = process.env.ORIGIN_POSTAL_CODE || "40393";
  const rateItems = items.map((item) => ({
    name: item.name || "Produk RAZRBILZ",
    weight:
      typeof item.weightGrams === "number" && item.weightGrams > 0
        ? item.weightGrams
        : WEIGHT_PER_ITEM_GRAMS,
    quantity: item.quantity,
  }));

  if (!process.env.BITESHIP_API_KEY) {
    console.warn(
      "[ShippingCost] BITESHIP_API_KEY tidak dikonfigurasi — memakai tarif fallback statis (BUKAN harga real-time). Set BITESHIP_API_KEY untuk tarif kurir langsung."
    );
    return {
      ok: true,
      rates: DOMESTIC_RATES_WITHOUT_API_KEY,
      isFallback: true,
      fallbackReason: "no_api_key",
    };
  }

  try {
    const rates = await getShippingRates({
      originPostalCode,
      destinationPostalCode: cleanPostal,
      items: rateItems,
      couriers,
    });
    if (rates && rates.length > 0) {
      return { ok: true, rates };
    }
    console.warn(
      "[ShippingCost] Biteship tidak mengembalikan tarif untuk tujuan ini — memakai tarif fallback statis (BUKAN harga real-time).",
      { originPostalCode, destinationPostalCode: cleanPostal, couriers }
    );
  } catch (biteshipError) {
    console.warn(
      "[ShippingCost] Biteship live API returned an error, using reliable fallback rates (BUKAN harga real-time):",
      biteshipError
    );
  }

  return {
    ok: true,
    rates: DOMESTIC_RATES_STANDARD_FALLBACK,
    isFallback: true,
    fallbackReason: "biteship_unavailable",
  };
}

/** Cari tarif domestik yang persis cocok dengan kurir+layanan pilihan buyer. */
export function findMatchingRate(
  rates: BiteshipCourierRate[],
  courierCode: string,
  courierServiceCode: string
): BiteshipCourierRate | null {
  const cc = (courierCode || "").toLowerCase().trim();
  const sc = (courierServiceCode || "").toLowerCase().trim();
  if (!cc || !sc) return null;
  return (
    rates.find(
      (r) =>
        (r.courier_code || "").toLowerCase() === cc &&
        (r.courier_service_code || "").toLowerCase() === sc
    ) || null
  );
}
