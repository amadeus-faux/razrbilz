import type { Metadata } from "next";
import { cookies } from "next/headers";

import { NEWSLETTER_COPY, resolveNewsletterLocale } from "@/lib/newsletter-i18n";
import ConfirmClient from "./ConfirmClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const t = NEWSLETTER_COPY[resolveNewsletterLocale(cookieStore.get("user_country")?.value)];
  return {
    title: t.confirm.title,
    robots: { index: false, follow: false },
  };
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const cookieStore = await cookies();
  const locale = resolveNewsletterLocale(cookieStore.get("user_country")?.value);
  return <ConfirmClient token={token ?? ""} locale={locale} />;
}
