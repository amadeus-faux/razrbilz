"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import "./gooey.css";
import type { Locale } from "@/lib/checkout-i18n";
import { NEWSLETTER_HONEYPOT_FIELD } from "@/lib/early-access/constants";
import { newsletterCopy } from "@/lib/newsletter-i18n";

type Phase = "idle" | "submitting" | "sent";

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

const STAGE_HEIGHT = 56;
const GOO_PAD = 32;
const BUTTON_SHIFT = 34;

/**
 * Empat kondisi gooey:
 * - DIAM: circle tersembunyi di ujung kanan pill; panah opacity 0.
 * - TERBUKA: pill bergeser 34px ke kiri, circle keluar 34px ke kanan; celah 12px.
 * - MUNCUL/KEMBALI: transisi transform di antara keduanya, filter membentuk leher.
 *
 * Bentuk dan filter hidup di dalam satu <svg>. Input dan tombol HTML berada di
 * lapisan atas tanpa filter, jadi teks dan panah tidak pernah ikut diblur.
 * Border adalah lapisan kedua yang 1px lebih besar; warnanya opak karena
 * filter alpha menghapus fill transparan.
 */
function GooShapes({ width }: { width: number }) {
  const svgWidth = width + GOO_PAD * 2;
  const svgHeight = STAGE_HEIGHT + GOO_PAD * 2;

  return (
    <svg
      className="goo-svg"
      width={svgWidth}
      height={svgHeight}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          id="rz-goo"
          x="0"
          y="0"
          /* Circle aktif berada di +68px lokal sebelum grup digeser -34px;
             region filter harus mencakup posisi lokal itu plus bayangan. */
          width={svgWidth + BUTTON_SHIFT}
          height={svgHeight}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
            result="goo"
          />
        </filter>
      </defs>
      <g className="goo-slide">
        <g className="goo-blob" filter="url(#rz-goo)">
          <rect
            className="goo-border"
            x={GOO_PAD + BUTTON_SHIFT - 1}
            y={GOO_PAD - 1}
            width={width - 68 + 2}
            height={STAGE_HEIGHT + 2}
            rx={STAGE_HEIGHT / 2 + 1}
          />
          <circle
            className="goo-circle goo-border"
            cx={GOO_PAD + width - 62}
            cy={GOO_PAD + STAGE_HEIGHT / 2}
            r={STAGE_HEIGHT / 2 + 1}
          />
          <rect
            className="goo-pill"
            x={GOO_PAD + BUTTON_SHIFT}
            y={GOO_PAD}
            width={width - 68}
            height={STAGE_HEIGHT}
            rx={STAGE_HEIGHT / 2}
          />
          <circle
            className="goo-circle"
            cx={GOO_PAD + width - 62}
            cy={GOO_PAD + STAGE_HEIGHT / 2}
            r={STAGE_HEIGHT / 2}
          />
        </g>
      </g>
    </svg>
  );
}

export default function NewsletterClient({
  locale,
  showResend,
}: {
  locale: Locale;
  showResend: boolean;
}) {
  const t = newsletterCopy(locale);

  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState<{ kind: "error" | "info"; text: string } | null>(null);
  const [focusWithin, setFocusWithin] = useState(false);
  const [stageWidth, setStageWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const next = Math.round(entries[0].contentRect.width);
      if (next > 0) {
        setStageWidth((prev) => (Math.abs(prev - next) >= 1 ? next : prev));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filled = email.trim().length > 0;
  const active = focusWithin || filled || phase === "submitting";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (phase === "submitting") return;
    setMessage(null);

    // Bot mengisi honeypot: balas sukses palsu tanpa memanggil server.
    if (honeypot) {
      setPhase("sent");
      return;
    }

    if (!EMAIL_SHAPE.test(email.trim())) {
      setMessage({ kind: "error", text: t.state.invalidEmail });
      inputRef.current?.focus();
      return;
    }

    setPhase("submitting");
    try {
      const res = await fetch("/api/newsletter/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), [NEWSLETTER_HONEYPOT_FIELD]: honeypot }),
      });
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        code?: string;
        retryAfterSec?: number;
      } | null;

      if (res.ok && data?.success) {
        setPhase("sent");
        return;
      }

      if (data?.code === "RATE_LIMITED") {
        setMessage({ kind: "error", text: t.state.rateLimited(data.retryAfterSec ?? 60) });
      } else {
        setMessage({ kind: "error", text: t.state.generic });
      }
      setPhase("idle");
    } catch {
      setMessage({ kind: "error", text: t.state.generic });
      setPhase("idle");
    }
  }

  async function handleResend() {
    setMessage(null);
    if (!EMAIL_SHAPE.test(email.trim())) {
      setMessage({ kind: "error", text: t.state.invalidEmail });
      inputRef.current?.focus();
      return;
    }
    try {
      const res = await fetch("/api/newsletter/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json().catch(() => null)) as { retryAfterSec?: number } | null;
      if (res.ok) {
        setMessage({ kind: "info", text: t.state.resendSent });
      } else if (res.status === 429) {
        setMessage({ kind: "error", text: t.state.rateLimited(data?.retryAfterSec ?? 60) });
      } else {
        setMessage({ kind: "error", text: t.state.generic });
      }
    } catch {
      setMessage({ kind: "error", text: t.state.generic });
    }
  }

  return (
    <div lang={locale} className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex justify-center">
        <span className="gate-wordmark text-[0.8rem] text-[var(--nw-ink)]" aria-label="RAZRBILZ">
          RAZRBILZ
        </span>
      </div>

      <div className="gate-newsletter-inner my-auto flex w-full flex-col items-center py-16 text-center">
        <p
          className="gate-enter text-[0.6875rem] uppercase tracking-[0.22em] text-[var(--nw-warm)]"
          style={{ animationDelay: "0ms" }}
        >
          {t.page.label}
        </p>
        <h1
          className="gate-enter gate-headline gate-serif mt-5 text-balance text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02] tracking-[-0.02em]"
          style={{ animationDelay: "80ms" }}
        >
          {t.page.headline}
        </h1>
        <p
          className="gate-enter gate-lead mt-5 max-w-[34ch] text-[0.95rem] leading-relaxed text-[var(--nw-warm)] sm:text-base"
          style={{ animationDelay: "160ms" }}
        >
          {t.page.subhead}
        </p>

        <div
          className="gate-enter gate-form mt-10 w-full max-w-[380px]"
          style={{ animationDelay: "240ms" }}
        >
          {phase === "sent" ? (
            <p className="mx-auto max-w-[34ch] py-4 text-sm leading-relaxed text-[var(--nw-ink)]">
              {t.state.confirmPending}
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div
                ref={stageRef}
                className="goo-stage"
                data-filled={filled ? "true" : "false"}
                data-busy={phase === "submitting" ? "true" : "false"}
                onFocus={() => setFocusWithin(true)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setFocusWithin(false);
                  }
                }}
              >
                {stageWidth >= 160 ? (
                  <GooShapes width={stageWidth} />
                ) : (
                  <span className="goo-static" aria-hidden="true" />
                )}

                <label htmlFor="newsletter-email" className="sr-only">
                  {t.page.emailLabel}
                </label>
                <input
                  ref={inputRef}
                  id="newsletter-email"
                  className="goo-input"
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  enterKeyHint="send"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder={t.page.emailPlaceholder}
                  value={email}
                  disabled={phase === "submitting"}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button
                  type="submit"
                  className="goo-btn"
                  tabIndex={active ? 0 : -1}
                  aria-label={phase === "submitting" ? t.page.submitting : t.page.submitLabel}
                  disabled={phase === "submitting"}
                >
                  <svg
                    className="goo-arrow"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>

                <span className="goo-ring" aria-hidden="true" />

                <input
                  className="goo-hp"
                  type="text"
                  name={NEWSLETTER_HONEYPOT_FIELD}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </div>
            </form>
          )}

          <p
            className="mt-5 min-h-5 text-xs leading-relaxed"
            role="status"
            aria-live="polite"
          >
            {message ? (
              <span
                className={
                  message.kind === "error"
                    ? "text-[var(--nw-ink)]"
                    : "text-[var(--nw-warm)]"
                }
              >
                {message.text}
              </span>
            ) : phase === "sent" ? null : (
              <span className="text-[var(--nw-warm)]">{t.page.note}</span>
            )}
          </p>

          {showResend && phase !== "submitting" ? (
            <button
              type="button"
              onClick={handleResend}
              className="mt-4 text-xs text-[var(--nw-warm)] underline decoration-1 underline-offset-4 hover:text-[var(--nw-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nw-ink)]"
            >
              {t.page.resendLink}
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          href="/privacy-policy"
          className="text-xs text-[var(--nw-warm)] underline decoration-1 underline-offset-4 hover:text-[var(--nw-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nw-ink)]"
        >
          {t.page.privacyLink}
        </Link>
      </div>
    </div>
  );
}
