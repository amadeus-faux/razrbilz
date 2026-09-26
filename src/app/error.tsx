"use client";

import Link from "next/link";
import StatusScreen from "@/components/layout/StatusScreen";

/**
 * Boundary untuk error tak terduga di sisi customer-facing. Sengaja tanpa
 * Footer/BottomNav: kalau yang rusak justru salah satu komponen layout,
 * boundary ini tetap bisa tampil.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusScreen
      eyebrow="Unexpected error"
      title="We couldn't load this page"
      body={
        <>
          <p>
            Something went wrong on our side. Try again — if it keeps happening,
            send us the address of this page through the contact form.
          </p>
          {process.env.NODE_ENV === "development" && error.digest && (
            <p className="mt-4 font-mono text-[11px] text-muted">
              digest {error.digest}
            </p>
          )}
        </>
      }
      actions={
        <>
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-ghost">
            Back to shop
          </Link>
        </>
      }
    />
  );
}
