/**
 * Satu-satunya sumber konstanta Early Access Gate.
 *
 * Semua angka dan daftar path yang menentukan siapa boleh masuk dikumpulkan di
 * sini supaya tidak ada nomor atau pengecualian yang tersebar di route, proxy,
 * dan UI lalu saling bertentangan.
 */

export type GateStatus = "closed" | "early_access" | "public";

export const GATE_STATUSES: readonly GateStatus[] = ["closed", "early_access", "public"];

export function isGateStatus(value: unknown): value is GateStatus {
  return typeof value === "string" && (GATE_STATUSES as readonly string[]).includes(value);
}

/** "100 orang pertama". Angka yang sama dijaga CHECK constraint + fungsi SQL. */
export const EARLY_ACCESS_CAP = 100;

/** Umur periode early access sejak admin menekan tombol, juga expiry cookie. */
export const PERIOD_DURATION_DAYS = 14;

/** Cookie httpOnly penanda pengunjung boleh masuk selama periode berjalan. */
export const GATE_COOKIE = "rz_early_access";

/** Batas pakai satu link /early?token=… sebelum link itu mati. */
export const TOKEN_MAX_USES = 5;

/**
 * Jendela anti klik-ganda untuk "Mulai early access". Di dalam jendela ini
 * permintaan kedua memakai periode yang sudah ada, bukan membuat periode baru,
 * sehingga email tidak terkirim dua kali.
 */
export const START_EARLY_ACCESS_GUARD_MS = 10 * 60_000;

/** Umur cache status gate di Edge. Tombol admin terasa dalam <= angka ini. */
export const GATE_STATUS_TTL_MS = 5_000;

/** Nama field honeypot form newsletter (pola sama dengan form Contact Us). */
export const NEWSLETTER_HONEYPOT_FIELD = "website_url";

export const SIGNUP_IP_RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 };
export const SIGNUP_EMAIL_RATE_LIMIT = { max: 3, windowMs: 10 * 60_000 };
export const RESEND_IP_RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 };
export const RESEND_EMAIL_RATE_LIMIT = { max: 3, windowMs: 10 * 60_000 };

/**
 * Pengecualian gate. Entri berakhiran `/*` = cocok untuk seluruh path di
 * bawahnya (termasuk path induknya). Daftar ini sengaja spesifik: tidak ada
 * `/api/*` atau prefix lebar lain, karena satu prefix lebar bisa membuka
 * lubang yang tidak terlihat.
 */
export const GATE_EXEMPT_PATHS = [
  // Halaman gate sendiri
  "/newsletter",
  "/newsletter/confirm/*",
  "/newsletter/unsubscribe/*",
  "/early",

  // Halaman informasi & legal
  "/about",
  "/contact",
  "/policy",
  "/privacy-policy",
  "/refund-policy",
  "/size-guide",
  "/terms",

  // Halaman pasca-bayar: orang yang sedang membayar tidak boleh terkunci
  "/payment/finish",
  "/payment/error",
  "/payment/unfinish",
  "/payment/instructions/*", // return URL Duitku
  "/order-confirmation/*",
  "/paypal/return",

  // API pembayaran (server pihak ketiga tanpa cookie, atau kelanjutan alur bayar)
  "/api/payments/duitku/callback",
  "/api/payments/duitku/check-status",
  "/api/payments/duitku/methods",
  "/api/paypal/webhook",
  "/api/paypal/orders/*",
  "/api/webhooks/biteship",
  "/api/webhooks/biteship/price",
  "/api/webhooks/biteship/status",
  "/api/webhooks/biteship/waybill",

  // Halaman /contact bebas gate, jadi endpointnya juga harus
  "/api/contact",

  // Laporan CSP bisa berasal dari halaman gate sendiri, jadi tidak boleh diblokir
  "/api/csp-report",

  // API newsletter
  "/api/newsletter/signup",
  "/api/newsletter/confirm",
  "/api/newsletter/resend",
  "/api/newsletter/slots",
  "/api/newsletter/unsubscribe",
  "/api/newsletter/early-access",

  // Admin (setiap handler tetap memverifikasi requireAdmin di server)
  "/admin/*",
  "/api/admin/*",

  // Aset statis
  "/_next/*",
  "/products/*",
  "/logo/*",
  "/og/*",
  "/favicon.ico",
  "/icon.ico",
  "/logo.svg",
  "/robots.txt",
  "/sitemap.xml",
] as const;

/** Menghapus trailing slash supaya `/early/` diperlakukan sama dengan `/early`. */
function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

/**
 * Apakah path dikecualikan dari gate.
 *
 * Selain daftar eksplisit, path yang segmen terakhirnya bertitik dianggap berkas
 * statis (mis. `/next.svg`, `/og/home.png`) dan dilewatkan: berkas publik tidak
 * pernah berisi halaman yang bisa dibocorkan gate, dan menambahkannya satu per
 * satu ke daftar hanya memperpanjang daftar tanpa menambah keamanan.
 */
export function isGateExempt(pathname: string): boolean {
  const path = normalizePath(pathname);

  const lastSegment = path.slice(path.lastIndexOf("/") + 1);
  if (lastSegment.includes(".")) return true;

  for (const pattern of GATE_EXEMPT_PATHS) {
    if (pattern.endsWith("/*")) {
      const base = pattern.slice(0, -2);
      if (path === base || path.startsWith(`${base}/`)) return true;
      continue;
    }
    if (path === pattern) return true;
  }

  return false;
}

/**
 * Kode galat yang stabil. Frontend menerjemahkannya; API tidak pernah
 * mengirim kalimat, supaya teks bisa diubah tanpa merusak klien lama.
 */
export const NEWSLETTER_ERROR_CODES = [
  "INVALID_EMAIL",
  "INVALID_INPUT",
  "SLOTS_FULL",
  "RATE_LIMITED",
  "GATE_CLOSED",
  "TOKEN_INVALID",
  "TOKEN_EXPIRED",
  "TOKEN_USED",
  "ALREADY_CONFIRMED",
  "NOT_FOUND",
  "UNSUBSCRIBED",
  "EMAIL_SENT",
  "UNSUBSCRIBE_INVALID",
  "INTERNAL_ERROR",
] as const;

export type NewsletterErrorCode = (typeof NEWSLETTER_ERROR_CODES)[number];
