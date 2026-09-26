// Import dari @sentry/core, bukan @sentry/nextjs: modul ini dipakai juga oleh
// skrip yang jalan di luar Next (mis. scripts/test-biteship-webhooks.ts), dan
// entry server @sentry/nextjs tidak mengekspos captureException di sana.
// Client-nya tetap sama — @sentry/nextjs init mendaftarkan client ke core.
import { captureException } from "@sentry/core";

/**
 * Mencatat error yang sudah kita tangani sendiri (try/catch, lalu tetap
 * membalas respons normal atau 5xx). Jalur seperti ini tidak terlihat oleh
 * auto-instrumentasi Sentry, jadi tanpa fungsi ini kegagalannya cuma hidup di
 * `console.error` dan hilang dari log setelah container mati.
 *
 * `where` menjadi tag sehingga issue bisa difilter (mis. `tag:where:"biteship-webhook"`).
 *
 * PENTING: hanya id internal yang boleh ikut terkirim. Jangan pernah menambah
 * nama, telepon, alamat, email, atau referensi pembayaran customer — request
 * body, cookie, dan header memang sudah dimatikan lewat
 * `SENTRY_DATA_COLLECTION`, tapi arguments fungsi masih ada di stack trace.
 */
export function reportHandledError(
  where: string,
  error: unknown,
  ids: { orderNumber?: string | null; orderId?: string | null } = {}
): void {
  captureException(error, {
    tags: { where },
    extra: {
      orderNumber: ids.orderNumber ?? null,
      orderId: ids.orderId ?? null,
    },
  });
}
