/**
 * Satu-satunya sumber untuk kode pos asal (gudang RAZRBILZ).
 *
 * Sebelumnya quote checkout memakai fallback 40393 sementara pembuatan pesanan
 * Biteship memakai 40625. Akibatnya buyer bisa ditawari layanan yang memang
 * tidak tersedia dari alamat asal aslinya — Biteship menolaknya dengan
 * "Origin coverage doesn't exists." (kode 40002021).
 */

export const ORIGIN_POSTAL_CODE_DEFAULT = "40625";

let warnedMissing = false;

/** Selalu string 5 digit; `BITESHIP_ORIGIN_POSTAL_CODE` diterima sebagai alias lama. */
export function getOriginPostalCode(): string {
  const fromEnv = (
    process.env.ORIGIN_POSTAL_CODE ||
    process.env.BITESHIP_ORIGIN_POSTAL_CODE ||
    ""
  ).trim();

  if (/^\d{5}$/.test(fromEnv)) return fromEnv;

  if (fromEnv && !warnedMissing) {
    warnedMissing = true;
    console.error(
      `[origin] ORIGIN_POSTAL_CODE="${fromEnv}" bukan 5 digit — memakai default ${ORIGIN_POSTAL_CODE_DEFAULT}.`
    );
  } else if (!fromEnv && !warnedMissing && process.env.NODE_ENV === "production") {
    warnedMissing = true;
    console.error(
      `[origin] ORIGIN_POSTAL_CODE tidak diset — memakai default ${ORIGIN_POSTAL_CODE_DEFAULT}. Set variabel ini di Vercel agar quote dan pesanan selalu sepakat.`
    );
  }

  return ORIGIN_POSTAL_CODE_DEFAULT;
}
