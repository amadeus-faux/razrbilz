import type { Metadata } from "next";
import { cookies } from "next/headers";

import { GATE_COOKIE } from "@/lib/early-access/constants";
import { readGateState } from "@/lib/early-access/gate";
import { NEWSLETTER_COPY, resolveNewsletterLocale } from "@/lib/newsletter-i18n";
import { reportHandledError } from "@/lib/sentry";
import NewsletterClient from "./NewsletterClient";

// Halaman ini pintu masuk gate; tidak boleh ter-cache CDN dalam bahasa salah
// atau bocor ke indeks.
export const dynamic = "force-dynamic";

async function pageLocale() {
  const cookieStore = await cookies();
  return resolveNewsletterLocale(cookieStore.get("user_country")?.value);
}

export async function generateMetadata(): Promise<Metadata> {
  const t = NEWSLETTER_COPY[await pageLocale()];
  return {
    title: t.meta.title,
    description: t.meta.description,
    robots: { index: false, follow: false },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
    },
  };
}

export default async function NewsletterPage() {
  const cookieStore = await cookies();
  const locale = resolveNewsletterLocale(cookieStore.get("user_country")?.value);

  // Server yang memutuskan, bukan client: tombol "kirim ulang" hanya berguna
  // saat akses sudah dibuka dan browser ini belum memegang cookie periode itu.
  let showResend = false;
  try {
    const gate = await readGateState();
    showResend =
      gate.status === "early_access" &&
      Boolean(gate.currentPeriodId) &&
      cookieStore.get(GATE_COOKIE)?.value !== gate.currentPeriodId;
  } catch (error) {
    reportHandledError("newsletter-page-gate-state", error);
  }

  return <NewsletterClient locale={locale} showResend={showResend} />;
}
