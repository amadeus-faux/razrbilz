// Inisialisasi Sentry untuk runtime Node.js (server component, route handler,
// dan kode build).
import * as Sentry from "@sentry/nextjs";
import { SENTRY_DATA_COLLECTION } from "@/lib/sentry-data-collection";

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 0.1,

  dataCollection: SENTRY_DATA_COLLECTION,

  debug: process.env.NODE_ENV === "development",
});
