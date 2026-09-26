// Titik masuk instrumentasi server Next.js. Fungsi `register()` dipanggil
// sebelum server menerima request pertama.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Menangkap error yang terjadi di dalam Next.js sendiri (server component,
// route handler, fungsi data-fetching) tanpa perlu membungkus tiap route.
export const onRequestError = Sentry.captureRequestError;
