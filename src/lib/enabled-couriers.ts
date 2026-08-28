/**
 * Configuration Whitelist untuk Layanan Kurir Biteship.
 *
 * Hanya kombinasi (courier_code + courier_service_code) yang terdaftar di sini
 * yang akan ditampilkan sebagai opsi pengiriman di halaman checkout.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PANDUAN PENGATURAN / CARA UPDATE:
 *
 * 1. Jika ingin MENGAKTIFKAN layanan baru (misal JNE YES atau SiCepat BEST):
 *    Tambahkan kode layanannya ke array kurir terkait, contoh:
 *    jne: ["reg", "yes"],
 *    sicepat: ["reg", "best"],
 *
 * 2. Jika ingin MENONAKTIFKAN layanan (misal matikan J&T EZ):
 *    Hapus kode dari array atau hapus baris kurirnya:
 *    jnt: [],
 *
 * 3. Daftar kode kurir & service standar di Biteship:
 *    - gojek    : "instant", "same_day"
 *    - anteraja : "reg", "next_day", "same_day", "cargo"
 *    - jnt      : "ez", "jnt_jemari", "super"
 *    - jne      : "reg", "yes", "oke", "jtr"
 *    - sicepat  : "reg", "best", "gokil", "sicepat_cargo", "siunt"
 *    - pos      : "reg", "pos", "next_day", "sameday", "jumbo"
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const ENABLED_COURIER_SERVICES: Record<string, string[]> = {
  gojek: ["instant", "same_day"],
  anteraja: [],
  jnt: ["ez"],
  jne: ["reg"],
  sicepat: ["reg", "siunt"],
  pos: ["reg", "pos"],
};

/**
 * Filter fungsi untuk mengecek apakah suatu rate lolos whitelist
 */
export function isCourierServiceEnabled(
  courierCode?: string,
  serviceCode?: string
): boolean {
  if (!courierCode || !serviceCode) return false;

  const cCode = courierCode.toLowerCase().trim();
  const sCode = serviceCode.toLowerCase().trim();

  const allowedServices = ENABLED_COURIER_SERVICES[cCode];
  if (!allowedServices || !Array.isArray(allowedServices)) return false;

  return allowedServices.includes(sCode);
}
