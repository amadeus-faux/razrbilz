"use client";

import { useState } from "react";
import Link from "next/link";

import type { Locale } from "@/lib/checkout-i18n";
import { newsletterCopy } from "@/lib/newsletter-i18n";

type Phase = "ask" | "working" | "done" | "invalid" | "error";

/**
 * Unsubscribe harus lewat klik sadar (bukan GET otomatis dari pemindai email),
 * jadi halaman ini menampilkan konfirmasi dua tombol sebelum memanggil API.
 */
export default function UnsubscribeClient({ token, locale }: { token: string; locale: Locale }) {
  const t = newsletterCopy(locale).unsubscribe;
  const [phase, setPhase] = useState<Phase>("ask");

  async function handleUnsubscribe() {
    setPhase("working");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => null)) as { success?: boolean; code?: string } | null;
      if (res.ok && data?.success) {
        setPhase("done");
      } else if (data?.code === "UNSUBSCRIBE_INVALID") {
        setPhase("invalid");
      } else {
        setPhase("error");
      }
    } catch {
      setPhase("error");
    }
  }

  return (
    <div className="flex w-full flex-col items-center text-center">
      {(phase === "ask" || phase === "working") && (
        <>
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] tracking-[0.04em]">{t.heading}</h1>
          <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-[var(--color-muted)]">
            {t.body}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleUnsubscribe}
              disabled={phase === "working" || !token}
              className="rounded-full bg-[var(--color-foreground)] px-6 py-3 text-xs uppercase tracking-[0.12em] text-[var(--color-background)] disabled:cursor-not-allowed disabled:bg-[var(--color-disabled)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-foreground)]"
            >
              {t.confirm}
            </button>
            <Link
              href="/newsletter"
              className="rounded-full border border-[var(--color-border)] px-6 py-3 text-xs uppercase tracking-[0.12em] text-[var(--color-foreground)] hover:bg-[var(--color-background)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-foreground)]"
            >
              {t.cancel}
            </Link>
          </div>
        </>
      )}

      {phase === "done" && (
        <>
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] tracking-[0.04em]">{t.doneHeading}</h1>
          <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-[var(--color-muted)]">
            {t.doneBody}
          </p>
        </>
      )}

      {phase === "invalid" && (
        <>
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] tracking-[0.04em]">{t.invalidHeading}</h1>
          <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-[var(--color-muted)]">
            {t.invalidBody}
          </p>
        </>
      )}

      {phase === "error" && (
        <p className="text-sm text-[var(--color-muted)]" role="alert">
          {newsletterCopy(locale).state.generic}
        </p>
      )}
    </div>
  );
}
