import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { CSSProperties, ReactNode } from "react";

import type { Locale } from "@/lib/checkout-i18n";
import { EMAIL_COPY } from "./copy";

/**
 * Shell email + token gaya. Sengaja menyalin token brand dari globals.css, BUKAN
 * pakai Tailwind: email client tidak membaca class, jadi semua gaya harus inline.
 * Font brand (Tanker) adalah woff2 lokal dan tidak bisa dimuat email client, jadi
 * di sini memakai stack sans + letter-spacing yang sama.
 */
export const emailColors = {
  bg: "#000000",
  surface: "#1e1c1a",
  border: "#2a2825",
  fg: "#f0ede8",
  muted: "#7a7570",
};

export const emailFonts = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
};

/**
 * Dikirim sebagai <style> di <head> karena gaya inline tidak bisa memakai media
 * query. Hanya selector class: Gmail membuang selector turunan/atribut. Klien yang
 * mengabaikan blok ini tetap tampil benar karena semua gaya dasar ada inline.
 */
const responsiveCss = `
@media only screen and (max-width:480px) {
  .shell { padding:18px 14px !important; border-radius:12px !important; }
  .drow { table-layout:fixed !important; }
  .dl, .dv, .iname, .iprice { display:block !important; width:100% !important; }
  .dl { padding-bottom:0 !important; }
  .dv { padding-top:1px !important; text-align:left !important; }
  .iname { padding-bottom:0 !important; }
  .iprice { padding-top:1px !important; text-align:left !important; }
  .cta { padding:13px 14px !important; font-size:11px !important; letter-spacing:0.1em !important; }
  .sectionHeading { font-size:13px !important; letter-spacing:0.12em !important; }
}
`;

export const emailStyles: Record<string, CSSProperties> = {
  wordmark: {
    margin: 0,
    color: emailColors.fg,
    fontFamily: emailFonts.sans,
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "0.22em",
  },
  sectionHeading: {
    margin: "0 0 12px",
    color: emailColors.fg,
    fontFamily: emailFonts.sans,
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },
  label: {
    margin: 0,
    color: emailColors.muted,
    fontFamily: emailFonts.sans,
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },
  body: {
    margin: 0,
    color: emailColors.fg,
    fontFamily: emailFonts.sans,
    fontSize: 14,
    lineHeight: "22px",
  },
  monoValue: {
    margin: 0,
    color: emailColors.fg,
    fontFamily: emailFonts.mono,
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "0.06em",
  },
  card: {
    backgroundColor: emailColors.surface,
    border: `1px solid ${emailColors.border}`,
    borderRadius: 12,
    padding: "16px",
  },
  cta: {
    display: "inline-block",
    backgroundColor: emailColors.fg,
    color: emailColors.bg,
    fontFamily: emailFonts.sans,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.16em",
    lineHeight: "16px",
    padding: "14px 22px",
    borderRadius: 12,
    textAlign: "center",
    textDecoration: "none",
    textTransform: "uppercase",
  },
  footer: {
    margin: 0,
    color: emailColors.muted,
    fontFamily: emailFonts.sans,
    fontSize: 11,
    lineHeight: "18px",
  },
  footerLink: { color: emailColors.muted, textDecoration: "underline" },
};

/** Baris label / nilai yang dipakai di ketiga template. */
export function DetailRow({
  label,
  value,
  mono = false,
  strong = false,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  strong?: boolean;
}) {
  return (
    /* Lebar kolom dikunci dalam persen: tanpa ini tabel auto-layout melebar mengikuti
     * nilai terpanjang (nomor order 31 karakter, nomor VA) dan mendorong email ke
     * scroll horizontal di layar sempit. */
    <Row className="drow">
      <Column
        className="dl"
        style={{ width: "46%", paddingTop: 6, paddingBottom: 6 }}
      >
        <Text style={emailStyles.label}>{label}</Text>
      </Column>
      <Column
        className="dv"
        align="right"
        style={{
          width: "54%",
          paddingTop: 6,
          paddingBottom: 6,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        <Text
          style={{
            margin: 0,
            color: emailColors.fg,
            fontFamily: mono ? emailFonts.mono : emailFonts.sans,
            fontSize: mono ? 14 : 13,
            fontWeight: strong || mono ? 700 : 400,
            letterSpacing: mono ? "0.06em" : "0",
          }}
        >
          {value}
        </Text>
      </Column>
    </Row>
  );
}

export function EmailLayout({
  locale,
  preheader,
  siteUrl,
  showPolicy = true,
  children,
}: {
  locale: Locale;
  preheader: string;
  siteUrl?: string | null;
  /** Email pembatalan berisi janji refund, jadi baris "semua penjualan final"
   *  harus dimatikan — kalau tidak, isinya saling menyangkal. */
  showPolicy?: boolean;
  children: ReactNode;
}) {
  const c = EMAIL_COPY[locale];
  return (
    <Html lang={locale}>
      <Head>
        {/* Tanpa meta ini, Gmail/Samsung Mail di Android me-render email pada
         * kanvas ~700-900px lalu memperkecilnya, jadi media query tidak pernah
         * aktif dan tabel 560px terpotong. */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        <style>{responsiveCss}</style>
      </Head>
      <Preview>{preheader}</Preview>
      <Body style={{ backgroundColor: emailColors.bg, margin: 0, padding: "24px 12px" }}>
        <Container width="100%">
          <Container
            width="560"
            className="shell"
            style={{
              /* Atribut width="560" dipakai Outlook desktop; lebar fluida di atasnya
               * dipakai semua klien WebKit/Blink. Tanpa width:100% ini, tabel
               * terkunci 560px dan overflow di HP. */
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
              <Text style={emailStyles.wordmark}>{c.brand.wordmark}</Text>
              <Text
                style={{
                  margin: "6px 0 0",
                  color: emailColors.muted,
                  fontFamily: emailFonts.sans,
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                {c.brand.tagline}
              </Text>
            </Section>

            <Hr style={{ borderColor: emailColors.border, margin: "24px 0" }} />

            {children}

            <Hr style={{ borderColor: emailColors.border, margin: "24px 0" }} />

            <Section>
              <Text style={emailStyles.footer}>{c.brand.questions}</Text>
              <Text style={{ ...emailStyles.footer, marginTop: 10 }}>
                {c.brand.production}
              </Text>
              {showPolicy ? (
                <Text style={{ ...emailStyles.footer, marginTop: 10 }}>
                  {c.brand.policy}{" "}
                  {siteUrl ? (
                    <Link
                      href={`${siteUrl}/refund-policy`}
                      style={emailStyles.footerLink}
                    >
                      {c.brand.policyLink}
                    </Link>
                  ) : null}
                </Text>
              ) : null}
              <Text style={{ ...emailStyles.footer, marginTop: 14 }}>
                {c.brand.wordmark} · {c.brand.city}
              </Text>
            </Section>
          </Container>
        </Container>
      </Body>
    </Html>
  );
}
