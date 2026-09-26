// Inisialisasi Sentry di sisi browser. Next.js memuat file ini otomatis
// (konvensi `instrumentation-client.ts`) sebelum kode klien lain jalan.
import * as Sentry from "@sentry/nextjs";
import { SENTRY_DATA_COLLECTION } from "@/lib/sentry-data-collection";

Sentry.init({
  // Kalau env belum dipasang (dev lokal, branch tanpa secret), Sentry tidak
  // aktif dan tidak mengirim apa pun.
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Trace lintas client<->server. 10% cukup untuk situs sekecil ini; 100%
  // hanya menghabiskan kuota span.
  tracesSampleRate: 0.1,

  // Replay dipakai untuk melihat konteks saat error UI terjadi, bukan untuk
  // memantau trafik — jadi hanya direkam ketika error (kuota plan gratis 50
  // replay/bulan). Teks dan input di-mask secara default; media diblokir.
  integrations: [Sentry.replayIntegration({ blockAllMedia: true })],
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,

  dataCollection: SENTRY_DATA_COLLECTION,

  // Log SDK hanya di dev supaya salah konfigurasi langsung terlihat.
  debug: process.env.NODE_ENV === "development",
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
