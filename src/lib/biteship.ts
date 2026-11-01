const BITESHIP_BASE_URL = "https://api.biteship.com/v1";

interface BiteshipRateItem {
  name: string;
  weight: number; // in grams
  quantity: number;
  // cm. Dikirim hanya bila ketiga sisi terisi; Biteship menghitung berat
  // volumetrik sendiri dan memakainya bila lebih besar dari berat aktual.
  dimensions?: DimensionsCm | null;
}

interface BiteshipRateRequest {
  originPostalCode: string;
  destinationPostalCode: string;
  items: BiteshipRateItem[];
  couriers?: string; // comma-separated courier codes e.g. "jne,jnt,sicepat"
}

export interface BiteshipCourierRate {
  courier_name: string;
  courier_code: string;
  courier_service_name: string;
  courier_service_code: string;
  description: string;
  duration: string;
  price: number;
}

import { isCourierServiceEnabled, ENABLED_COURIER_SERVICES } from "./enabled-couriers";
import { getOriginPostalCode } from "./origin";
import type { DimensionsCm } from "./package-dimensions";

export async function getShippingRates(
  request: BiteshipRateRequest
): Promise<BiteshipCourierRate[]> {
  const apiKey = process.env.BITESHIP_API_KEY;
  if (!apiKey) {
    throw new Error("BITESHIP_API_KEY is not configured");
  }

  // Active courier codes configured in enabled-couriers whitelist
  const activeCourierCodes = Object.keys(ENABLED_COURIER_SERVICES).join(",");

  const body = {
    origin_postal_code: request.originPostalCode,
    destination_postal_code: request.destinationPostalCode,
    couriers: request.couriers || activeCourierCodes || "jne,jnt,sicepat,anteraja,gojek,pos",
    items: request.items.map((item) => ({
      name: item.name,
      weight: item.weight,
      quantity: item.quantity,
      ...(item.dimensions ? { ...item.dimensions } : {}),
    })),
  };

  const response = await fetch(`${BITESHIP_BASE_URL}/rates/couriers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Biteship API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  const pricingList: any[] = data.pricing || [];

  // Filter strictly according to our enabled courier & service whitelist
  return pricingList
    .filter((rate: any) => {
      // 1. Check Biteship availability flag if present
      if (rate.available === false || rate.status === "unavailable") {
        return false;
      }

      // 2. Strict whitelist check on courier_code + courier_service_code
      return isCourierServiceEnabled(rate.courier_code, rate.courier_service_code);
    })
    .map(
      (rate: {
        courier_name: string;
        courier_code: string;
        courier_service_name: string;
        courier_service_code: string;
        description: string;
        duration: string;
        price: number;
      }) => ({
        courier_name: rate.courier_name,
        courier_code: rate.courier_code,
        courier_service_name: rate.courier_service_name,
        courier_service_code: rate.courier_service_code,
        description: rate.description,
        duration: rate.duration,
        price: rate.price,
      })
    );
}

export interface BiteshipArea {
  id: string;
  name: string;
  country_name: string;
  country_code: string;
  administrative_division_level_1_name: string;
  administrative_division_level_1_type: string;
  administrative_division_level_2_name: string;
  administrative_division_level_2_type: string;
  administrative_division_level_3_name: string;
  administrative_division_level_3_type: string;
  postal_code: number;
}

export const FALLBACK_INDONESIAN_PROVINCES = [
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

export async function searchBiteshipAreas(input: string): Promise<BiteshipArea[]> {
  const apiKey = process.env.BITESHIP_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(
      `${BITESHIP_BASE_URL}/maps/areas?countries=ID&type=single&input=${encodeURIComponent(input)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) return [];
    const data = await response.json();
    return data.areas || [];
  } catch {
    return [];
  }
}

export async function getProvinces(): Promise<string[]> {
  const apiKey = process.env.BITESHIP_API_KEY;
  if (!apiKey) {
    return FALLBACK_INDONESIAN_PROVINCES;
  }

  try {
    const areas = await searchBiteshipAreas("Indonesia");
    if (areas.length > 0) {
      const provinceSet = new Set<string>();
      for (const area of areas) {
        if (area.administrative_division_level_1_name) {
          provinceSet.add(area.administrative_division_level_1_name);
        }
      }
      if (provinceSet.size > 0) {
        return Array.from(provinceSet).sort((a, b) =>
          a.localeCompare(b, "id", { sensitivity: "base" })
        );
      }
    }
    return FALLBACK_INDONESIAN_PROVINCES;
  } catch {
    return FALLBACK_INDONESIAN_PROVINCES;
  }
}

export async function getCities(province: string): Promise<string[]> {
  if (!province) return [];

  const apiKey = process.env.BITESHIP_API_KEY;
  if (!apiKey) return []; // no key → let caller use local data

  try {
    const areas = await searchBiteshipAreas(province);
    const citiesSet = new Set<string>();
    for (const area of areas) {
      if (
        area.administrative_division_level_2_name &&
        area.administrative_division_level_1_name?.toLowerCase().includes(province.toLowerCase())
      ) {
        citiesSet.add(area.administrative_division_level_2_name);
      }
    }
    return Array.from(citiesSet).sort((a, b) =>
      a.localeCompare(b, "id", { sensitivity: "base" })
    );
  } catch {
    return []; // let caller use local data
  }
}

export async function getDistricts(
  province: string,
  city: string
): Promise<{ districts: string[]; postalCodes: Record<string, string[]> }> {
  if (!city) return { districts: [], postalCodes: {} };

  const apiKey = process.env.BITESHIP_API_KEY;
  if (!apiKey) return { districts: [], postalCodes: {} }; // no key → let caller use local data

  try {
    const areas = await searchBiteshipAreas(`${city} ${province}`);
    const districtSet = new Set<string>();
    const postalCodeMap: Record<string, string[]> = {};

    for (const area of areas) {
      const dName = area.administrative_division_level_3_name;
      if (dName) {
        districtSet.add(dName);
        if (area.postal_code) {
          const pCode = String(area.postal_code);
          if (!postalCodeMap[dName]) postalCodeMap[dName] = [];
          if (!postalCodeMap[dName].includes(pCode)) postalCodeMap[dName].push(pCode);
        }
      }
    }

    return {
      districts: Array.from(districtSet).sort((a, b) =>
        a.localeCompare(b, "id", { sensitivity: "base" })
      ),
      postalCodes: postalCodeMap,
    };
  } catch {
    return { districts: [], postalCodes: {} }; // let caller use local data
  }
}

export interface CreateBiteshipOrderParams {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  destinationAddress: string;
  destinationPostalCode: string | number;
  destinationNote?: string;
  courier: string;
  items: {
    name: string;
    quantity: number;
    value: number;
    weight?: number; // grams
    dimensions?: DimensionsCm | null; // cm, hanya bila admin sudah mengukur
  }[];
}

export interface BiteshipOrderResponse {
  success: boolean;
  orderId?: string;
  trackingId?: string;
  waybillId?: string;
  status?: string;
  price?: number;
  courierCompany?: string;
  courierType?: string;
  error?: string;
  code?: number;
  raw?: any;
}


export function parseCourierString(courierStr: string): {
  company: string;
  type: string;
} {
  // Support multiple delimiters: —, –, -, â€”, Â€“
  const parts = courierStr.split(/—|–|-|â€”|Â€“/).map((s) => s.trim());
  let companyRaw = (parts[0] || "sicepat").toLowerCase().replace(/[^a-z0-9]/g, "");
  let serviceRaw = (parts[1] || "").toLowerCase().trim();

  // Normalize company names for Biteship
  let company = "sicepat";
  if (companyRaw.includes("sicepat")) company = "sicepat";
  else if (companyRaw.includes("jne")) company = "jne";
  else if (companyRaw.includes("jnt") || companyRaw.includes("jt")) company = "jnt";
  else if (companyRaw.includes("anteraja")) company = "anteraja";
  else if (companyRaw.includes("tiki")) company = "tiki";
  else if (companyRaw.includes("pos")) company = "pos";
  else if (companyRaw.includes("ninja")) company = "ninja";
  else if (companyRaw.includes("lion")) company = "lion";

  // Normalize service types specifically per company
  let type = "reg";

  if (company === "jnt") {
    // J&T in Biteship: 'ez', 'super', 'jnt_jemari'
    // J&T has NO 'reg' in Biteship. Its regular service is 'ez'.
    if (serviceRaw.includes("super")) type = "super";
    else if (serviceRaw.includes("jemari")) type = "jnt_jemari";
    else type = "ez";
  } else if (company === "jne") {
    // JNE in Biteship: 'reg', 'yes', 'oke', 'jtr'
    if (serviceRaw.includes("yes")) type = "yes";
    else if (serviceRaw.includes("oke")) type = "oke";
    else if (serviceRaw.includes("jtr")) type = "jtr";
    else type = "reg";
  } else if (company === "sicepat") {
    // SiCepat: 'reg', 'siunt', 'best', 'gokil'
    if (serviceRaw.includes("siunt")) type = "siunt";
    else if (serviceRaw.includes("best")) type = "best";
    else if (serviceRaw.includes("gokil")) type = "gokil";
    else type = "reg";
  } else if (company === "anteraja") {
    if (serviceRaw.includes("next")) type = "next_day";
    else if (serviceRaw.includes("same")) type = "same_day";
    else if (serviceRaw.includes("cargo")) type = "cargo";
    else type = "reg";
  } else {
    if (serviceRaw.includes("ez")) type = "ez";
    else if (serviceRaw.includes("instant")) type = "instant";
    else if (serviceRaw.includes("sameday") || serviceRaw.includes("same day")) type = "same_day";
    else if (serviceRaw.includes("cargo") || serviceRaw.includes("kargo")) type = "cargo";
    else type = "reg";
  }

  return { company, type };
}

export async function createBiteshipOrder(
  params: CreateBiteshipOrderParams
): Promise<BiteshipOrderResponse> {
  const apiKey = process.env.BITESHIP_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ BITESHIP_API_KEY is not set. Skipping Biteship order creation.");
    return { success: false, raw: "BITESHIP_API_KEY missing" };
  }

  const { company, type } = parseCourierString(params.courier);

  const originName = process.env.BITESHIP_ORIGIN_NAME || "RAZRBILZ Studio";
  const originPhone = process.env.BITESHIP_ORIGIN_PHONE || "087763997856";
  const originEmail = process.env.BITESHIP_ORIGIN_EMAIL || "razrbilz@gmail.com";
  const originAddress =
    process.env.BITESHIP_ORIGIN_ADDRESS ||
    "Bandung, Jawa Barat";
  const originPostalCode = parseInt(getOriginPostalCode(), 10);
  const originNote = process.env.BITESHIP_ORIGIN_NOTE || "RAZRBILZ Official Warehouse";

  const destPostalCode =
    typeof params.destinationPostalCode === "number"
      ? params.destinationPostalCode
      : parseInt(String(params.destinationPostalCode), 10);

  // Kode pos tujuan tidak boleh ditebak. Order dengan postalCode kosong dulu
  // lolos dan dibuat dengan tujuan 40393 (kode asal) — paketnya akan salah alamat.
  if (!Number.isInteger(destPostalCode) || destPostalCode < 10000) {
    const errorMsg =
      "Kode pos tujuan tidak valid atau kosong. Periksa data pesanan sebelum menandai siap kirim.";
    console.error(`[Biteship] ❌ ${errorMsg} order=${params.orderNumber}`);
    return { success: false, error: errorMsg };
  }

  const payload = {
    shipper_contact_name: originName,
    shipper_contact_phone: originPhone,
    shipper_contact_email: originEmail,
    origin_contact_name: originName,
    origin_contact_phone: originPhone,
    origin_address: originAddress,
    origin_note: originNote,
    origin_postal_code: originPostalCode,
    destination_contact_name: params.customerName,
    destination_contact_phone: params.customerPhone,
    destination_contact_email: params.customerEmail,
    destination_address: params.destinationAddress,
    destination_postal_code: destPostalCode,
    destination_note: params.destinationNote || "",
    courier_company: company,
    courier_type: type,
    delivery_type: "now",
    order_note: `Order ${params.orderNumber}`,
    metadata: {
      order_number: params.orderNumber,
    },
    items: params.items.map((item) => ({
      name: item.name,
      description: "Apparel / Clothing",
      value: item.value,
      quantity: item.quantity,
      weight: item.weight || 500,
      // Dimensi harus sama dengan yang dipakai saat quote, kalau tidak harga
      // label yang ditagihkan kurir menyimpang dari ongkir yang dibayar customer.
      ...(item.dimensions ? { ...item.dimensions } : {}),
    })),
  };

  console.log(`[Biteship] Creating shipping order for ${params.orderNumber} with courier ${company}-${type}...`);

  const response = await fetch(`${BITESHIP_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok || responseData.success === false) {
    const errorMsg =
      responseData.error ||
      responseData.message ||
      (responseData.description ? String(responseData.description) : null) ||
      `Biteship API Error (HTTP ${response.status})`;

    console.error(
      `[Biteship] ❌ Failed to create order for ${params.orderNumber}: HTTP ${response.status} - ${errorMsg}`,
      responseData
    );
    return {
      success: false,
      error: errorMsg,
      code: responseData.code,
      raw: responseData,
    };
  }


  console.log(`[Biteship] Order created successfully for ${params.orderNumber}:`, {
    id: responseData.id,
    status: responseData.status,
    waybill_id: responseData.courier?.waybill_id,
    tracking_id: responseData.courier?.tracking_id,
  });

  return {
    success: true,
    orderId: responseData.id,
    trackingId: responseData.courier?.tracking_id,
    waybillId: responseData.courier?.waybill_id,
    status: responseData.status,
    price: responseData.price,
    courierCompany: responseData.courier?.company || company,
    courierType: responseData.courier?.type || type,
    raw: responseData,
  };
}

/**
 * Membatalkan pesanan pengiriman di sisi Biteship (waybill ikut ditarik).
 *
 * Hanya masuk akal sebelum paket diserahkan ke kurir. Setelah itu Biteship
 * menolak, dan penolakan itu hasil yang NORMAL — bukan bug — jadi error-nya
 * harus diteruskan ke admin apa adanya, jangan disembunyikan.
 */
export async function cancelBiteshipOrder(
  biteshipOrderId: string,
  reasonCode = "others",
  reason = "Cancelled by store admin - RAZRBILZ"
): Promise<{
  success: boolean;
  status?: string;
  error?: string;
  httpStatus?: number;
  raw?: Record<string, unknown>;
}> {
  const apiKey = process.env.BITESHIP_API_KEY;
  if (!apiKey) {
    return { success: false, error: "BITESHIP_API_KEY is not configured" };
  }

  try {
    const response = await fetch(
      `${BITESHIP_BASE_URL}/orders/${encodeURIComponent(biteshipOrderId)}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancellation_reason_code: reasonCode,
          cancellation_reason: reason,
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      const errorMsg =
        data.error ||
        data.message ||
        data.description ||
        `Biteship API Error (HTTP ${response.status})`;

      console.error(
        `[Biteship] ❌ Cancel ditolak untuk ${biteshipOrderId}: HTTP ${response.status} - ${errorMsg}`
      );
      return { success: false, error: errorMsg, httpStatus: response.status, raw: data };
    }

    console.log(
      `[Biteship] ✅ Order ${biteshipOrderId} dibatalkan di sisi Biteship (status: ${data.status ?? "-"})`
    );
    return { success: true, status: data.status, raw: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal menghubungi API Biteship",
    };
  }
}

/**
 * Fetches real-time order details from Biteship API by Biteship Order ID
 */
export async function getBiteshipOrder(biteshipOrderId: string): Promise<{
  success: boolean;
  id?: string;
  status?: string;
  waybillId?: string;
  trackingId?: string;
  courierCompany?: string;
  error?: string;
  raw?: any;
}> {
  const apiKey = process.env.BITESHIP_API_KEY;
  if (!apiKey) {
    return { success: false, error: "BITESHIP_API_KEY is not configured" };
  }

  try {
    const response = await fetch(`${BITESHIP_BASE_URL}/orders/${biteshipOrderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`,
        raw: data,
      };
    }

    return {
      success: true,
      id: data.id,
      status: data.status,
      waybillId: data.courier?.waybill_id,
      trackingId: data.courier?.tracking_id,
      courierCompany: data.courier?.company,
      raw: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal menghubungi API Biteship",
    };
  }
}


