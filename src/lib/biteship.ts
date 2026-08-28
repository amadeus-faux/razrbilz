const BITESHIP_BASE_URL = "https://api.biteship.com/v1";

interface BiteshipRateItem {
  name: string;
  weight: number; // in grams
  quantity: number;
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

export async function getShippingRates(
  request: BiteshipRateRequest
): Promise<BiteshipCourierRate[]> {
  const apiKey = process.env.BITESHIP_API_KEY;
  if (!apiKey) {
    throw new Error("BITESHIP_API_KEY is not configured");
  }

  // Calculate total package weight in grams
  const totalWeight = request.items.reduce(
    (acc, item) => acc + (item.weight || 350) * (item.quantity || 1),
    0
  );

  const body = {
    origin_postal_code: request.originPostalCode,
    destination_postal_code: request.destinationPostalCode,
    couriers: request.couriers || process.env.BITESHIP_ENABLED_COURIERS || "jne,jnt,sicepat,anteraja",
    items: request.items.map((item) => ({
      name: item.name,
      weight: item.weight,
      quantity: item.quantity,
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

  // Filter out services marked unavailable by Biteship or explicitly disabled
  const disabledServices = (process.env.BITESHIP_DISABLED_SERVICES || "")
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return pricingList
    .filter((rate: any) => {
      // 1. Check availability status if provided
      if (rate.available === false || rate.status === "unavailable") {
        return false;
      }

      const serviceCode = (rate.courier_service_code || "").toLowerCase();
      const serviceName = (rate.courier_service_name || "").toLowerCase();
      const courierCode = (rate.courier_code || "").toLowerCase();

      // 2. Filter out explicitly disabled services from env (e.g. "jtr,trucking")
      if (disabledServices.some((ds) => serviceCode.includes(ds) || serviceName.includes(ds))) {
        return false;
      }

      // 3. Exclude heavy cargo / trucking (like JNE JTR / Trucking which requires 10kg min) for regular lightweight orders (< 10kg)
      if (totalWeight < 10000) {
        if (
          serviceCode === "jtr" ||
          serviceCode === "trucking" ||
          serviceName.includes("trucking") ||
          serviceName.includes("cargo") ||
          serviceName.includes("jtr")
        ) {
          return false;
        }
      }

      return true;
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

// Fallback Indonesian regions database
export const FALLBACK_REGIONS: Record<
  string,
  Record<string, { districts: string[]; postalCodes: Record<string, string[]> }>
> = {
  "DKI Jakarta": {
    "Jakarta Selatan": {
      districts: ["Kebayoran Baru", "Kebayoran Lama", "Pesanggrahan", "Cilandak", "Pasar Minggu", "Jagakarsa", "Mampang Prapatan", "Pancoran", "Tebet", "Setiabudi"],
      postalCodes: {
        "Kebayoran Baru": ["12110", "12120", "12130", "12140", "12150", "12160", "12170", "12180", "12190"],
        "Kebayoran Lama": ["12210", "12220", "12230", "12240"],
        "Cilandak": ["12410", "12420", "12430", "12440"],
        "Setiabudi": ["12910", "12920", "12930", "12940", "12950"],
        "Tebet": ["12810", "12820", "12830", "12840", "12850", "12860", "12870"],
      },
    },
    "Jakarta Pusat": {
      districts: ["Gambir", "Tanah Abang", "Menteng", "Senen", "Cempaka Putih", "Johar Baru", "Kemayoran", "Sawah Besar"],
      postalCodes: {
        "Menteng": ["10310", "10320", "10330", "10340", "10350"],
        "Tanah Abang": ["10210", "10220", "10230", "10240", "10250", "10260", "10270"],
        "Gambir": ["10110", "10120", "10130", "10140", "10150", "10160"],
      },
    },
    "Jakarta Barat": {
      districts: ["Cengkareng", "Grogol Petamburan", "Taman Sari", "Tambora", "Kebon Jeruk", "Kalideres", "Palmerah", "Kembangan"],
      postalCodes: {
        "Kebon Jeruk": ["11510", "11520", "11530"],
        "Kembangan": ["11610", "11620", "11630"],
        "Grogol Petamburan": ["11440", "11450", "11460", "11470"],
      },
    },
    "Jakarta Timur": {
      districts: ["Matraman", "Pulo Gadung", "Jatinegara", "Duren Sawit", "Kramat Jati", "Makasar", "Pasar Rebo", "Ciracas", "Cipayung", "Cakung"],
      postalCodes: {
        "Duren Sawit": ["13440", "13450", "13460", "13470"],
        "Jatinegara": ["13310", "13320", "13330", "13340", "13350"],
      },
    },
    "Jakarta Utara": {
      districts: ["Penjaringan", "Pademangan", "Tanjung Priok", "Koja", "Kelapa Gading", "Cilincing"],
      postalCodes: {
        "Kelapa Gading": ["14240", "14250"],
        "Penjaringan": ["14440", "14450", "14460", "14470"],
        "Tanjung Priok": ["14310", "14320", "14330", "14340", "14350"],
      },
    },
  },
  "Jawa Barat": {
    "Kota Bandung": {
      districts: ["Coblong", "Sukajadi", "Sumur Bandung", "Cicendo", "Andir", "Cidadap", "Bandung Wetan", "Lengkong", "Regol", "Batununggal", "Astanaanyar", "Bojongloa Kaler", "Bojongloa Kidul", "Kiaracondong", "Antapani", "Arcamanik", "Cibiru", "Ujungberung", "Panyileukan", "Gedebage", "Buahbatu", "Rancasari"],
      postalCodes: {
        "Coblong": ["40132", "40133", "40134", "40135"],
        "Sukajadi": ["40161", "40162", "40163", "40164"],
        "Sumur Bandung": ["40111", "40112", "40113"],
        "Bandung Wetan": ["40114", "40115", "40116"],
        "Lengkong": ["40261", "40262", "40263", "40264", "40265"],
      },
    },
    "Kabupaten Bandung": {
      districts: ["Soreang", "Dayeuhkolot", "Baleendah", "Bojongsoang", "Margahayu", "Margaasih", "Katapang", "Banjaran", "Cangkuang", "Pameungpeuk", "Arjasari", "Cimaung", "Pangalengan", "Ciwidey", "Rancabali", "Pasirjambu", "Cimenyan", "Cilengkrang", "Cileunyi", "Rancaekek", "Cicalengka", "Nagreg", "Ibun", "Paseh", "Majalaya", "Solokanjeruk", "Ciparay", "Pacet", "Kertasari"],
      postalCodes: {
        "Soreang": ["40911", "40912", "40913", "40914", "40915"],
        "Bojongsoang": ["40287", "40288"],
        "Baleendah": ["40375"],
        "Dayeuhkolot": ["40257", "40258"],
      },
    },
    "Kota Bekasi": {
      districts: ["Bekasi Barat", "Bekasi Timur", "Bekasi Utara", "Bekasi Selatan", "Rawa Lumbu", "Medan Satria", "Bantar Gebang", "Pondok Gede", "Jatisampurna", "Jatiasih", "Pondok Melati", "Mustika Jaya"],
      postalCodes: {
        "Bekasi Selatan": ["17148"],
        "Bekasi Barat": ["17145"],
        "Pondok Gede": ["17411"],
      },
    },
    "Kota Bogor": {
      districts: ["Bogor Barat", "Bogor Selatan", "Bogor Tengah", "Bogor Timur", "Bogor Utara", "Tanah Sareal"],
      postalCodes: {
        "Bogor Tengah": ["16121", "16122", "16124", "16126"],
        "Bogor Timur": ["16141", "16142", "16143"],
      },
    },
    "Kota Depok": {
      districts: ["Pancoran Mas", "Sukmajaya", "Cimanggis", "Sawangan", "Limo", "Beji", "Cipayung", "Cilodong", "Tapos", "Bojongsari", "Cinere"],
      postalCodes: {
        "Beji": ["16421", "16422", "16423", "16424", "16425"],
        "Cimanggis": ["16451", "16452", "16453"],
      },
    },
  },
  "Banten": {
    "Kota Tangerang": {
      districts: ["Tangerang", "Batuceper", "Benda", "Cipondoh", "Ciledug", "Karawaci", "Periuk", "Jatiuwung", "Cibodas", "Neglasari", "Pinang", "Karangtengah", "Larangan"],
      postalCodes: {
        "Karawaci": ["15115", "15116"],
        "Tangerang": ["15111", "15112", "15118"],
      },
    },
    "Kota Tangerang Selatan": {
      districts: ["Serpong", "Serpong Utara", "Pondok Aren", "Ciputat", "Ciputat Timur", "Pamulang", "Setu"],
      postalCodes: {
        "Serpong": ["15310", "15311", "15318"],
        "Pondok Aren": ["15220", "15221", "15222", "15224", "15225"],
        "Pamulang": ["15417", "15418"],
      },
    },
  },
  "Jawa Tengah": {
    "Kota Semarang": {
      districts: ["Semarang Tengah", "Semarang Utara", "Semarang Timur", "Semarang Selatan", "Semarang Barat", "Gajahmungkur", "Candisari", "Pedurungan", "Genuk", "Gayamsari", "Tembalang", "Banyumanik", "Gunungpati", "Mijen", "Ngaliyan", "Tugu"],
      postalCodes: {
        "Semarang Tengah": ["50131", "50132", "50133", "50134", "50135", "50136", "50137", "50138", "50139"],
        "Banyumanik": ["50261", "50262", "50263", "50264", "50267", "50268", "50269"],
      },
    },
    "Kota Surakarta (Solo)": {
      districts: ["Laweyan", "Serengan", "Pasar Kliwon", "Banjarsari", "Jebres"],
      postalCodes: {
        "Banjarsari": ["57131", "57132", "57133", "57134", "57135", "57136", "57137", "57138", "57139"],
        "Laweyan": ["57141", "57142", "57143", "57144", "57145", "57146", "57147", "57148", "57149"],
      },
    },
  },
  "DI Yogyakarta": {
    "Kota Yogyakarta": {
      districts: ["Danurejan", "Gedongtengen", "Gondokusuman", "Gondomanan", "Jetis", "Kotagede", "Kraton", "Mantrijeron", "Mergangsan", "Ngampilan", "Pakualaman", "Tegalrejo", "Umbulharjo", "Wirobrajan"],
      postalCodes: {
        "Gondokusuman": ["55221", "55222", "55223", "55224", "55225"],
        "Umbulharjo": ["55161", "55162", "55163", "55164", "55165", "55166", "55167"],
      },
    },
    "Kabupaten Sleman": {
      districts: ["Depok", "Mlati", "Ngaglik", "Gamping", "Kalasan", "Berbah", "Prambanan", "Sleman", "Tempel", "Turi", "Pakem", "Cangkringan", "Ngemplak", "Seyegan", "Godean", "Moyudan", "Minggir"],
      postalCodes: {
        "Depok": ["55281", "55282", "55283"],
        "Mlati": ["55284", "55285"],
      },
    },
  },
  "Jawa Timur": {
    "Kota Surabaya": {
      districts: ["Tegalsari", "Simokerto", "Genteng", "Bubutan", "Gubeng", "Gunung Anyar", "Sukolilo", "Tambaksari", "Mulyorejo", "Rungkut", "Tenggilis Mejoyo", "Wonokromo", "Sawahan", "Wiyung", "Karangpilang", "Dukuh Pakis", "Gayungan", "Jambangan", "Wonocolo"],
      postalCodes: {
        "Gubeng": ["60281", "60282", "60283", "60284", "60285", "60286"],
        "Wonokromo": ["60241", "60242", "60243", "60244", "60245"],
      },
    },
  },
  "Bali": {
    "Kota Denpasar": {
      districts: ["Denpasar Selatan", "Denpasar Barat", "Denpasar Utara", "Denpasar Timur"],
      postalCodes: {
        "Denpasar Selatan": ["80221", "80222", "80223", "80224", "80225", "80226", "80227", "80228"],
        "Denpasar Barat": ["80113", "80117", "80119"],
      },
    },
    "Kabupaten Badung": {
      districts: ["Kuta", "Kuta Selatan", "Kuta Utara", "Mengwi", "Abiansemal", "Petang"],
      postalCodes: {
        "Kuta": ["80361"],
        "Kuta Selatan": ["80362", "80363"],
        "Kuta Utara": ["80361"],
      },
    },
  },
};

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
  const parts = courierStr.split("—").map((s) => s.trim());
  let companyRaw = (parts[0] || "sicepat").toLowerCase().replace(/[^a-z0-9]/g, "");
  let serviceRaw = (parts[1] || "reg").toLowerCase().trim();

  // Normalize company names for Biteship
  if (companyRaw.includes("sicepat")) companyRaw = "sicepat";
  else if (companyRaw.includes("jne")) companyRaw = "jne";
  else if (companyRaw.includes("jnt") || companyRaw.includes("jt")) companyRaw = "jnt";
  else if (companyRaw.includes("anteraja")) companyRaw = "anteraja";
  else if (companyRaw.includes("tiki")) companyRaw = "tiki";
  else if (companyRaw.includes("pos")) companyRaw = "pos";
  else if (companyRaw.includes("ninja")) companyRaw = "ninja";
  else if (companyRaw.includes("lion")) companyRaw = "lion";

  // Normalize service types
  let type = "reg";
  if (serviceRaw.includes("reguler") || serviceRaw.includes("regular") || serviceRaw.includes("reg")) {
    type = "reg";
  } else if (serviceRaw.includes("oke")) {
    type = "oke";
  } else if (serviceRaw.includes("yes")) {
    type = "yes";
  } else if (serviceRaw.includes("ez")) {
    type = "ez";
  } else if (serviceRaw.includes("standard") || serviceRaw.includes("standar")) {
    type = "standard";
  } else if (serviceRaw.includes("cargo") || serviceRaw.includes("kargo")) {
    type = "cargo";
  } else if (serviceRaw.includes("sameday") || serviceRaw.includes("same day")) {
    type = "same_day";
  } else if (serviceRaw.includes("instant")) {
    type = "instant";
  } else {
    type = serviceRaw.split(" ")[0].toLowerCase() || "reg";
  }

  return { company: companyRaw || "sicepat", type };
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
  const originPhone = process.env.BITESHIP_ORIGIN_PHONE || "081321840161";
  const originEmail = process.env.BITESHIP_ORIGIN_EMAIL || "tcukimay2st@gmail.com";
  const originAddress =
    process.env.BITESHIP_ORIGIN_ADDRESS ||
    "Bandung Barat, Jawa Barat";
  const originPostalCode = parseInt(
    process.env.BITESHIP_ORIGIN_POSTAL_CODE ||
      process.env.ORIGIN_POSTAL_CODE ||
      "40393",
    10
  );
  const originNote = process.env.BITESHIP_ORIGIN_NOTE || "RAZRBILZ Official Warehouse";

  const destPostalCode =
    typeof params.destinationPostalCode === "number"
      ? params.destinationPostalCode
      : parseInt(String(params.destinationPostalCode), 10) || 40393;

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
      weight: item.weight || 500, // default 500g
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

