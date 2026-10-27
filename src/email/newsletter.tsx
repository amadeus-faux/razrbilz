import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { Locale } from "@/lib/checkout-i18n";
import { emailColors, emailFonts, emailStyles } from "./layout";
import { NEWSLETTER_COPY } from "@/lib/newsletter-i18n";

/**
 * Email newsletter (konfirmasi + early access).
 *
 * Tidak memakai EmailLayout transaksional: footer di sana berbicara soal pesanan,
 * produksi, dan kebijakan retur, yang tidak berlaku di email daftar akses.
 * Templat ini sengaja sederhana: satu pesan, satu tombol, satu link mentah, satu
 * link berhenti berlangganan.
 */

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

function formatDateWib(value: Date | string, dateLocale: string): string {
  return `${new Date(value).toLocaleString(dateLocale, {
    ...DATE_OPTS,
    timeZone: "Asia/Jakarta",
  })} WIB`;
}

function Shell({
  locale,
  preheader,
  children,
  unsubscribeUrl,
}: {
  locale: Locale;
  preheader: string;
  children: React.ReactNode;
  unsubscribeUrl: string | null;
}) {
  const c = NEWSLETTER_COPY[locale];
  return (
    <Html lang={locale}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Preview>{preheader}</Preview>
      <Body style={{ backgroundColor: emailColors.bg, margin: 0, padding: "24px 12px" }}>
        <Container width="100%">
          <Container
            width="560"
            style={{
              width: "100%",
              maxWidth: 560,
              margin: "0 auto",
              backgroundColor: emailColors.bg,
              border: `1px solid ${emailColors.border}`,
              borderRadius: 16,
              padding: "28px 24px",
            }}
          >
            <Section>
              <Text style={emailStyles.wordmark}>{c.email.brand.wordmark}</Text>
            </Section>

            {children}

            <Section style={{ marginTop: 28 }}>
              <Text style={emailStyles.footer}>
                {c.email.brand.wordmark} · {c.email.brand.city}
              </Text>
              {unsubscribeUrl ? (
                <Text style={{ ...emailStyles.footer, marginTop: 8 }}>
                  <Link href={unsubscribeUrl} style={emailStyles.footerLink}>
                    {c.email.confirmation.unsubscribe}
                  </Link>
                </Text>
              ) : null}
            </Section>
          </Container>
        </Container>
      </Body>
    </Html>
  );
}

function RawLink({ url, label }: { url: string; label: string }) {
  return (
    <Section style={{ marginTop: 18 }}>
      <Text style={emailStyles.footer}>{label}</Text>
      <Text
        style={{
          ...emailStyles.footer,
          marginTop: 6,
          fontFamily: emailFonts.mono,
          fontSize: 11,
          wordBreak: "break-all",
        }}
      >
        <Link href={url} style={{ color: emailColors.muted }}>
          {url}
        </Link>
      </Text>
    </Section>
  );
}

export function ConfirmationEmail({
  locale,
  confirmUrl,
  unsubscribeUrl,
}: {
  locale: Locale;
  confirmUrl: string;
  unsubscribeUrl: string | null;
}) {
  const c = NEWSLETTER_COPY[locale].email.confirmation;
  return (
    <Shell locale={locale} preheader={c.preheader} unsubscribeUrl={unsubscribeUrl}>
      <Text className="sectionHeading" style={emailStyles.sectionHeading}>
        {c.heading}
      </Text>
      <Text style={{ ...emailStyles.body, marginTop: 16, marginBottom: 24 }}>{c.body}</Text>

      <Section style={{ textAlign: "center" }}>
        <Button href={confirmUrl} className="cta" style={emailStyles.cta}>
          {c.cta}
        </Button>
      </Section>

      <RawLink url={confirmUrl} label={c.linkNote} />
      <Text style={{ ...emailStyles.footer, marginTop: 18 }}>{c.ignoredNote}</Text>
    </Shell>
  );
}

export function EarlyAccessEmail({
  locale,
  accessUrl,
  maxUses,
  endsAt,
  unsubscribeUrl,
}: {
  locale: Locale;
  accessUrl: string;
  maxUses: number;
  endsAt: Date | string | null;
  unsubscribeUrl: string | null;
}) {
  const copy = NEWSLETTER_COPY[locale].email;
  const c = copy.earlyAccess;
  const dateLocale = locale === "id" ? "id-ID" : "en-GB";

  return (
    <Shell locale={locale} preheader={c.preheader} unsubscribeUrl={unsubscribeUrl}>
      <Text className="sectionHeading" style={emailStyles.sectionHeading}>
        {c.heading}
      </Text>
      <Text style={{ ...emailStyles.body, marginBottom: 24 }}>{c.body}</Text>

      <Section style={{ textAlign: "center" }}>
        <Button href={accessUrl} className="cta" style={emailStyles.cta}>
          {c.cta}
        </Button>
      </Section>

      <Text style={{ ...emailStyles.footer, marginTop: 20 }}>{c.usesNote(maxUses)}</Text>
      {endsAt ? (
        <Text style={{ ...emailStyles.footer, marginTop: 8 }}>
          {c.endsNote(formatDateWib(endsAt, dateLocale))}
        </Text>
      ) : null}

      <RawLink url={accessUrl} label={c.linkNote} />
    </Shell>
  );
}
