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
    return NO_INDEX_PATHS.map((source) => ({ source, headers: NO_INDEX }));
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
