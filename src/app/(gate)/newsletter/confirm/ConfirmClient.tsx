"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import type { Locale } from "@/lib/checkout-i18n";
import { newsletterCopy } from "@/lib/newsletter-i18n";

type Result =
  | { kind: "loading" }
  | { kind: "confirmed"; slotNumber: number | null; alreadyConfirmed: boolean }
  | { kind: "invalid" }
  | { kind: "unsubscribed" }
  | { kind: "error" };

/**
 * Halaman tujuan link konfirmasi email. Pemanggilan API dilakukan sekali;
 * token dikonfirmasi di server secara atomik (slot dikunci di sana).
 */
export default function ConfirmClient({ token, locale }: { token: string; locale: Locale }) {
  const t = newsletterCopy(locale).confirm;
  const [result, setResult] = useState<Result>({ kind: "loading" });
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    (async () => {
      if (!token) {
        setResult({ kind: "invalid" });
        return;
      }
      try {
        const res = await fetch("/api/newsletter/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = (await res.json().catch(() => null)) as {
          success?: boolean;
          slotNumber?: number | null;
          alreadyConfirmed?: boolean;
          code?: string;
        } | null;

        if (res.ok && data?.success) {
          setResult({
            kind: "confirmed",
            slotNumber: data.slotNumber ?? null,
            alreadyConfirmed: Boolean(data.alreadyConfirmed),
          });
        } else if (data?.code === "UNSUBSCRIBED") {
          setResult({ kind: "unsubscribed" });
        } else {
          setResult({ kind: "invalid" });
        }
      } catch {
        setResult({ kind: "error" });
      }
    })();
  }, [token]);

  return (
    <div className="flex w-full flex-col items-center text-center">
      {result.kind === "loading" ? (
        <p className="text-sm text-[var(--color-muted)]" role="status">
          …
        </p>
      ) : null}

      {result.kind === "confirmed" ? (
        <>
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] tracking-[0.04em]">
            {result.alreadyConfirmed ? t.headingAlready : t.heading}
          </h1>
          <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-[var(--color-muted)]">
            {result.slotNumber !== null ? t.slotLine(result.slotNumber) : t.noSlotLine}
          </p>
          <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-[var(--color-muted)]">
            {t.body}
          </p>
          <BackHome label={t.backHome} />
        </>
      ) : null}

      {result.kind === "invalid" ? (
        <>
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] tracking-[0.04em]">{t.invalidHeading}</h1>
          <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-[var(--color-muted)]">
            {t.invalidBody}
          </p>
          <BackHome label={t.backHome} />
        </>
      ) : null}

      {result.kind === "unsubscribed" ? (
        <>
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] tracking-[0.04em]">
            {t.unsubscribedHeading}
          </h1>
          <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-[var(--color-muted)]">
            {t.unsubscribedBody}
          </p>
          <BackHome label={t.backHome} />
        </>
      ) : null}

      {result.kind === "error" ? (
        <p className="text-sm text-[var(--color-muted)]" role="alert">
          {newsletterCopy(locale).state.generic}
        </p>
      ) : null}
    </div>
  );
}

function BackHome({ label }: { label: string }) {
  return (
    <Link
      href="/newsletter"
      className="mt-8 text-xs text-[var(--color-muted)] underline underline-offset-2 hover:text-[var(--color-foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-foreground)]"
    >
      {label}
    </Link>
  );
}
