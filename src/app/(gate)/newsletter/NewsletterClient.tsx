"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import "./gooey.css";
import type { Locale } from "@/lib/checkout-i18n";
import { NEWSLETTER_HONEYPOT_FIELD } from "@/lib/early-access/constants";
import { newsletterCopy } from "@/lib/newsletter-i18n";

type Phase = "idle" | "submitting" | "sent";

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
          <feDropShadow
            in="goo"
            dx="0"
            dy="6"
            stdDeviation="8"
            floodColor="#111111"
            floodOpacity="0.08"
          />
        </filter>
      </defs>
      <g className="goo-slide">
        <g className="goo-blob" filter="url(#rz-goo)">
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
  const [slots, setSlots] = useState<{ remaining: number; total: number } | null>(null);
  const [serverFull, setServerFull] = useState(false);
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

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/newsletter/slots", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.remaining === "number") setSlots(data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const isFull = serverFull || (slots !== null && slots.remaining <= 0);
  const filled = email.trim().length > 0;

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
      } else if (data?.code === "SLOTS_FULL") {
        setServerFull(true);
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
    <div className="flex w-full max-w-[380px] flex-col items-center text-center">
      <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">
        {t.page.eyebrow}
      </p>
      <h1 className="mt-4 text-balance text-[clamp(1.75rem,5vw,2.5rem)] font-medium leading-[1.1]">
        {t.page.headline}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">{t.page.body}</p>

      <div className="mt-8 w-full">
        {isFull ? (
          <p className="text-sm leading-relaxed text-[var(--color-foreground)]">
            {t.state.slotsFull}
          </p>
        ) : phase === "sent" ? (
          <p className="text-sm leading-relaxed text-[var(--color-foreground)]">
            {t.state.confirmPending}
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div
              ref={stageRef}
              className="goo-stage"
              data-filled={filled ? "true" : "false"}
              data-busy={phase === "submitting" ? "true" : "false"}
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

        <p className="mt-2 min-h-5 text-xs" role="status" aria-live="polite">
          {message ? (
            <span
              className={
                message.kind === "error"
                  ? "text-[var(--color-foreground)]"
                  : "text-[var(--color-muted)]"
              }
            >
              {message.text}
            </span>
          ) : null}
        </p>

        {!isFull ? (
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            {slots
              ? `${t.page.slotsLeft(slots.remaining)} · ${t.page.noSpam}`
              : t.page.noSpam}
          </p>
        ) : null}

        {showResend && !isFull && phase !== "submitting" ? (
          <button
            type="button"
            onClick={handleResend}
            className="mt-4 text-xs text-[var(--color-muted)] underline underline-offset-2 hover:text-[var(--color-foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-foreground)]"
          >
            {t.page.resendLink}
          </button>
        ) : null}

        <p className="mt-6 text-xs text-[var(--color-muted)]">
          <Link
            href="/privacy-policy"
            className="underline underline-offset-2 hover:text-[var(--color-foreground)]"
          >
            {t.page.privacyLink}
          </Link>
        </p>
      </div>
    </div>
  );
}
