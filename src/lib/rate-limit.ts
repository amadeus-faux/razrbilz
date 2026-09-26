/**
 * Rate limiter in-memory dengan window geser.
 *
 * Batas yang perlu diketahui jujur: di serverless (Vercel) tiap instance punya
 * Map sendiri dan isinya hilang saat cold start. Jadi ini menahan skrip yang
 * menembak satu instance secara beruntun, bukan pembendungan global. Lapisan
 * utama penolakan bot tetap honeypot di form; ini lapisan kedua. Kalau nanti
 * perlu batas yang benar-benar lintas-instance, pindahkan bucket ke Redis/Upstash.
 */

export interface RateWindow {
  max: number;
  windowMs: number;
}

const buckets = new Map<string, number[]>();

/** Menghapus key yang seluruh waktunya sudah lewat, supaya Map tidak tumbuh tanpa batas. */
function sweep(windowMs: number): void {
  const cutoff = Date.now() - windowMs;
  for (const [key, hits] of buckets) {
    if (hits.length === 0 || hits[hits.length - 1] < cutoff) buckets.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  { max, windowMs }: RateWindow
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const cutoff = now - windowMs;
  const hits = (buckets.get(key) ?? []).filter((t) => t >= cutoff);

  if (hits.length >= max) {
    buckets.set(key, hits);
    if (buckets.size > 5000) sweep(windowMs);
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((hits[0] + windowMs - now) / 1000)),
    };
  }

  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) sweep(windowMs);
  return { allowed: true, retryAfterSec: 0 };
}

/**
 * IP pengunjung di belakang proxy. x-forwarded-for berisi daftar
 * "klien, proxy1, proxy2" — yang pertama adalah sisi klien. Bila header hilang
 * (dev langsung / misconfig), semua pemanggil masuk satu bucket "unknown" —
 * membatasi diri di jalur ini lebih aman daripada membiarkan form tanpa batas
 * sama sekali.
 *
 * Catatan jujur: header ini boleh berisi nilai yang dikirim pemanggil, jadi
 * bot yang tahu triknya bisa memutar-putar kunci bucket dan melewati batas ini.
 * Rate limit di sini gesekan anti-abuse, bukan pembendung yang tak bisa ditembus
 * — honeypot tetap lapisan utama.
 */
export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
