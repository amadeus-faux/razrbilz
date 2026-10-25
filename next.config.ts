import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

/**
 * Halaman transaksional & panel admin. robots.txt hanya melarang CRAWLING;
 * yang mengeluarkan URL dari indeks adalah X-Robots-Tag. Header dipakai (bukan
 * `metadata.robots`) karena /cart dan /checkout client component sehingga tidak
 * punya metadata sendiri, dan karena header tetap terkirim walau request-nya
 * gagal di tengah jalan.
 */
const NO_INDEX = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

const NO_INDEX_PATHS = [
  "/admin/:path*",
  "/cart",
  "/checkout",
  "/order-confirmation/:path*",
  "/payment/:path*",
];

/**
 * Header berlaku untuk semua route. CSP sengaja Report-Only dulu: kalau ada
 * inline script/asset yang belum terdaftar, browser hanya melapor, halaman
 * tidak rusak. Setelah laporan bersih, header ini bisa dijadikan enforcing.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://va.vercel-scripts.com",
      "frame-src 'self' https://www.paypal.com https://www.sandbox.paypal.com",
      "form-action 'self' https://passport.duitku.com https://sandbox.duitku.com https://www.paypal.com https://www.sandbox.paypal.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
      "report-uri /api/csp-report",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "webgxubrzpbcajfatfgm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      ...NO_INDEX_PATHS.map((source) => ({ source, headers: NO_INDEX })),
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // `org`, `project`, dan `authToken` dibaca sendiri dari env oleh SDK, jadi
  // tidak perlu ditulis di sini. Pasang SENTRY_ORG / SENTRY_PROJECT /
  // SENTRY_AUTH_TOKEN di Vercel — bukan di repo. Tanpa token, build tetap
  // sukses hanya tanpa unggah source map (stack trace tidak terbaca).
  tunnelRoute: "/error-monitoring",

  // Build SDK mengirim telemetri pemakaian anonim ke Sentry. Tidak diperlukan
  // di sini, dan nonaktifkan supaya build log bersih.
  telemetry: false,
});
