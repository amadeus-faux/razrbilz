import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import {
  DetailRow,
  emailColors,
  emailFonts,
  emailResponsiveCss,
  emailStyles,
} from "./layout";

/**
 * Notifikasi internal untuk pesan dari form Contact Us.
 *
 * Shell-nya menyalin EmailLayout (token + CSS responsif yang sama) tapi SENGAJA
 * tidak memakainya langsung: footer EmailLayout berisi kalimat untuk customer
 * ("Questions about this order", "all sales are final") yang salah konteks di
 * inbox internal. Bahasa email ini Indonesia karena penerimanya pemilik toko,
 * sama seperti halaman admin.
 */

const DATE_TIME_OPTS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

function formatWib(value: Date): string {
  return `${value.toLocaleString("id-ID", {
    ...DATE_TIME_OPTS,
    timeZone: "Asia/Jakarta",
  })} WIB`;
}

export function ContactNotificationEmail({
  name,
  email,
  subject,
  message,
  receivedAt,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: Date;
}) {
  return (
    <Html lang="id">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        <style>{emailResponsiveCss}</style>
      </Head>
      <Preview>{`Pesan baru dari ${name} lewat form Contact Us`}</Preview>
      <Body style={{ backgroundColor: emailColors.bg, margin: 0, padding: "24px 12px" }}>
        <Container width="100%">
          <Container
            width="560"
            className="shell"
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
              <Text style={emailStyles.wordmark}>RAZRBILZ</Text>
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
                INBOX CONTACT US
              </Text>
            </Section>

            <Hr style={{ borderColor: emailColors.border, margin: "24px 0" }} />

            <Section>
              <Text style={emailStyles.sectionHeading}>PESAN BARU</Text>
              <DetailRow label="Nama" value={name} />
              <DetailRow label="Email pengirim" value={email} />
              {subject ? <DetailRow label="Subject / No. Order" value={subject} /> : null}
              <DetailRow label="Diterima" value={formatWib(receivedAt)} />
            </Section>

            <Section
              style={{
                ...emailStyles.card,
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  ...emailStyles.body,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  margin: 0,
                }}
              >
                {message}
              </Text>
            </Section>

            <Hr style={{ borderColor: emailColors.border, margin: "0 0 24px" }} />

            <Section>
              <Text style={emailStyles.footer}>
                Tombol Reply pada email ini mengarah ke {email}, jadi balasan Anda
                langsung sampai ke pengirim. Email ini sendiri notifikasi sistem dan
                tidak perlu dibalas.
              </Text>
              <Text style={{ ...emailStyles.footer, marginTop: 14 }}>
                RAZRBILZ · Bandung, Indonesia
              </Text>
            </Section>
          </Container>
        </Container>
      </Body>
    </Html>
  );
}
