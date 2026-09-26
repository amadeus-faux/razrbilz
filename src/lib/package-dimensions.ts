/**
 * Satu sumber kebenaran untuk dimensi kemasan produk.
 *
 * Biteship menerima `length` / `width` / `height` per item dalam CENTIMETER
 * (berat dalam GRAM) dan menghitung sendiri berat volumetriknya — hasilnya
 * dipakai hanya bila lebih besar dari berat aktual. Nilai 0, kosong, atau
 * salah satu sisi tidak dikirim → Biteship mengabaikannya tanpa error, jadi
 * validasi harus di pihak kita.
 *
 * Batas 120 cm per sisi: produk apparel tidak ada yang dikemas melebihi itu,
 * dan API Biteship TIDAK menolak angka absurd. Satu typo (mis. 600 karena
 * mengira satuannya mm) menghasilkan quote ratusan juta rupiah.
 */

export const DIMENSION_MIN_CM = 1;
export const DIMENSION_MAX_CM = 120;

/** Nama kolom di Prisma + label Indonesia untuk pesan validasi. */
export const DIMENSION_FIELDS = [
  ["lengthCm", "Panjang"],
  ["widthCm", "Lebar"],
  ["heightCm", "Tinggi"],
] as const;

export type DimensionColumn = (typeof DIMENSION_FIELDS)[number][0];

export interface DimensionsCm {
  length: number;
  width: number;
  height: number;
}

interface DimensionSource {
  lengthCm?: number | null;
  widthCm?: number | null;
  heightCm?: number | null;
}

function inRange(n: unknown): n is number {
  return (
    typeof n === "number" &&
    Number.isInteger(n) &&
    n >= DIMENSION_MIN_CM &&
    n <= DIMENSION_MAX_CM
  );
}

/**
 * Kembalikan hanya bila ketiga sisi terisi dan wajar. Dimensi tidak lengkap
 * sengaja dibuang seluruhnya, bukan sebagian — mengirim 2 dari 3 sisi tidak
 * berpengaruh apa pun di Biteship dan hanya menyamarkan data yang belum diisi.
 */
export function resolveDimensionsCm(
  src: DimensionSource | null | undefined,
  label = "produk"
): DimensionsCm | null {
  if (!src) return null;

  const filled = [src.lengthCm, src.widthCm, src.heightCm].filter(
    (v) => v !== null && v !== undefined
  ).length;
  if (filled === 0) return null;

  if (!inRange(src.lengthCm) || !inRange(src.widthCm) || !inRange(src.heightCm)) {
    console.warn(
      `[Dimensions] Dimensi ${label} tidak dipakai (harus bilangan bulat ${DIMENSION_MIN_CM}-${DIMENSION_MAX_CM} cm dan ketiganya terisi):`,
      { lengthCm: src.lengthCm, widthCm: src.widthCm, heightCm: src.heightCm }
    );
    return null;
  }

  return { length: src.lengthCm, width: src.widthCm, height: src.heightCm };
}

/**
 * Untuk jalur tulis (admin). Kosong/null → simpan NULL ("belum diukur").
 * Nilai di luar rentang ditolak, bukan diam-diam di-clamp: admin yang mengetik
 * 600 sedang salah satuan, dan clamp ke 120 akan menghasilkan ongkir salah
 * yang terlihat sudah divalidasi.
 */
export function parseDimensionInput(
  raw: unknown,
  fieldLabel: string
): { ok: true; value: number | null } | { ok: false; error: string } {
  if (raw === null || raw === undefined || raw === "") return { ok: true, value: null };

  const n = Number(raw);
  if (!Number.isInteger(n) || n < DIMENSION_MIN_CM || n > DIMENSION_MAX_CM) {
    return {
      ok: false,
      error: `${fieldLabel} harus bilangan bulat antara ${DIMENSION_MIN_CM} dan ${DIMENSION_MAX_CM} cm (atau dikosongkan).`,
    };
  }
  return { ok: true, value: n };
}

/**
 * Untuk formulir produk (client): kolom bertanda string kosong ikut dikirim
 * sebagai null. PATCH di server memakai semantics "field tidak dikirim = jangan
 * sentuh", jadi helper ini khusus jalur form yang selalu mengirim ketiganya.
 */
export function buildDimensionPayload(
  raw: Partial<Record<DimensionColumn, unknown>>
):
  | { ok: true; values: Record<DimensionColumn, number | null> }
  | { ok: false; error: string } {
  const values: Record<DimensionColumn, number | null> = {
    lengthCm: null,
    widthCm: null,
    heightCm: null,
  };
  for (const [field, label] of DIMENSION_FIELDS) {
    const parsed = parseDimensionInput(raw[field], label);
    if (!parsed.ok) return { ok: false, error: parsed.error };
    values[field] = parsed.value;
  }
  return { ok: true, values };
}
