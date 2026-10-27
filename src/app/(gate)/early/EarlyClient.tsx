"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import type { Locale } from "@/lib/checkout-i18n";
import { TOKEN_MAX_USES } from "@/lib/early-access/constants";
import { newsletterCopy } from "@/lib/newsletter-i18n";

type Result =
  | { kind: "loading" }
  | { kind: "granted" }
  | { kind: "closed" }
  | { kind: "expired" }
  | { kind: "used" }
  | { kind: "invalid" }
  | { kind: "error" };

/**
 * Tujuan link early access dari email: token ditukar dengan cookie akses di
 * server, lalu pengunjung masuk toko lewat tombol di bawah.
 */
export default function EarlyClient({ token, locale }: { token: string; locale: Locale }) {
  const copy = newsletterCopy(locale);
  const t = copy.early;
  const [result, setResult] = useState<Result>({ kind: "loading" });
  const [resendNote, setResendNote] = useState<string | null>(null);
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
        const res = await fetch("/api/newsletter/early-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = (await res.json().catch(() => null)) as {
          success?: boolean;
          code?: string;
        } | null;

        if (res.ok && data?.success) {
          setResult({ kind: "granted" });
        } else if (data?.code === "GATE_CLOSED") {
          setResult({ kind: "closed" });
        } else if (data?.code === "TOKEN_EXPIRED") {
          setResult({ kind: "expired" });
        } else if (data?.code === "TOKEN_USED") {
          setResult({ kind: "used" });
        } else {
          setResult({ kind: "invalid" });
        }
      } catch {
        setResult({ kind: "error" });
      }
    })();
  }, [token]);

  async function handleResend() {
    setResendNote(null);
    try {
      const res = await fetch("/api/newsletter/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        setResendNote(copy.state.resendSent);
      } else {
        setResendNote(copy.state.generic);
      }
    } catch {
      setResendNote(copy.state.generic);
    }
  }

  const showResend =
    result.kind === "closed" || result.kind === "expired" || result.kind === "used" || result.kind === "invalid";

  return (
    <div lang={locale} className="flex w-full flex-col items-center text-center">
      {result.kind === "loading" ? (
        <p className="text-sm text-[var(--nw-warm)]" role="status">
          …
        </p>
      ) : null}

      {result.kind === "granted" ? (
        <>
          <h1 className="gate-serif text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.05] tracking-[-0.01em]">
            {t.heading}
          </h1>
          <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-[var(--nw-warm)]">
            {t.body}
          </p>
          <Link
            href="/"
            className="mt-8 rounded-full bg-[var(--nw-ink)] px-8 py-3 text-xs uppercase tracking-[0.12em] text-[var(--nw-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nw-ink)]"
          >
            {t.enter}
          </Link>
        </>
      ) : null}

      {result.kind === "closed" ? (
        <StateBlock heading={t.closedHeading} body={t.closedBody} />
      ) : null}

      {result.kind === "expired" ? (
        <StateBlock heading={t.expiredHeading} body={t.expiredBody} />
      ) : null}

      {result.kind === "used" ? (
        <StateBlock heading={t.usedHeading} body={t.usedBody(TOKEN_MAX_USES)} />
      ) : null}

      {result.kind === "invalid" ? (
        <StateBlock heading={t.invalidHeading} body={t.invalidBody} />
      ) : null}

      {result.kind === "error" ? (
        <p className="text-sm text-[var(--nw-warm)]" role="alert">
          {copy.state.generic}
        </p>
      ) : null}

      {showResend ? (
        <>
          <button
            type="button"
            onClick={handleResend}
            className="mt-8 text-xs text-[var(--nw-warm)] underline decoration-1 underline-offset-4 hover:text-[var(--nw-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nw-ink)]"
          >
            {t.resendLink}
          </button>
          <p className="mt-3 min-h-[1.25rem] text-xs text-[var(--nw-warm)]" role="status" aria-live="polite">
            {resendNote}
          </p>
        </>
      ) : null}
    </div>
  );
}

function StateBlock({ heading, body }: { heading: string; body: string }) {
  return (
    <>
      <h1 className="gate-serif text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.05] tracking-[-0.01em]">
        {heading}
      </h1>
      <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-[var(--nw-warm)]">{body}</p>
    </>
  );
}
