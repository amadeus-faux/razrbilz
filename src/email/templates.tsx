import { Button, Column, Section, Row, Text } from "@react-email/components";
import type { Locale } from "@/lib/checkout-i18n";
import { formatRupiah } from "@/lib/utils";
import { EMAIL_COPY } from "./copy";
import { DetailRow, EmailLayout, emailColors, emailFonts, emailStyles } from "./layout";

export interface EmailItemLine {
  name: string;
  size: string;
  quantity: number;
  priceAtBuy: number;
}

interface BaseProps {
  locale: Locale;
  orderNumber: string;
  customerName: string;
  siteUrl?: string | null;
}

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

const DATE_TIME_OPTS: Intl.DateTimeFormatOptions = {
  ...DATE_OPTS,
  hour: "2-digit",
  minute: "2-digit",
};

/** Toko beroperasi di WIB; timestamp DB disimpan UTC. Zona waktu ditulis
 *  eksplisit supaya batas bayar tidak terbaca sebagai waktu lokal penerima. */
function formatDate(value: Date | string | null | undefined, dateLocale: string): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString(dateLocale, DATE_OPTS);
}

function formatDateTime(
  value: Date | string | null | undefined,
  dateLocale: string
): string {
  if (!value) return "";
  const d = new Date(value);
  return `${d.toLocaleString(dateLocale, {
    ...DATE_TIME_OPTS,
    timeZone: "Asia/Jakarta",
  })} WIB`;
}

function Greeting({ locale, name }: { locale: Locale; name: string }) {
  return (
    <Text style={{ ...emailStyles.body, marginBottom: 16 }}>
      {EMAIL_COPY[locale].brand.greeting(name)}
    </Text>
  );
}

function ItemTable({
  locale,
  items,
}: {
  locale: Locale;
  items: EmailItemLine[];
}) {
  const c = EMAIL_COPY[locale];
  return (
    <Section>
      {items.map((item, i) => (
        <Row key={`${item.name}-${item.size}-${i}`} style={{ marginBottom: 10 }}>
          <Column>
            <Text style={{ ...emailStyles.body, fontSize: 13 }}>{item.name}</Text>
            <Text style={{ ...emailStyles.footer, marginTop: 2 }}>
              {c.labels.size}: {item.size} · {c.labels.qty}: {item.quantity}
            </Text>
          </Column>
          <Column align="right">
            <Text
              style={{
                ...emailStyles.body,
                fontSize: 13,
                fontFamily: emailFonts.mono,
              }}
            >
              {formatRupiah(item.priceAtBuy * item.quantity)}
            </Text>
          </Column>
        </Row>
      ))}
    </Section>
  );
}

export function OrderReceivedEmail(
  props: BaseProps & {
    items: EmailItemLine[];
    shippingCost: number;
    total: number;
    courier: string;
    instructionsUrl?: string | null;
    expiresAt?: Date | string | null;
  }
) {
  const { locale, items, total, shippingCost, courier, instructionsUrl, expiresAt } =
    props;
  const c = EMAIL_COPY[locale];
  const subtotal = items.reduce((s, i) => s + i.priceAtBuy * i.quantity, 0);

  return (
    <EmailLayout
      locale={locale}
      preheader={c.orderReceived.preheader}
      siteUrl={props.siteUrl}
    >
      <Text style={emailStyles.sectionHeading}>{c.orderReceived.heading}</Text>
      <Greeting locale={locale} name={props.customerName} />
      <Text style={{ ...emailStyles.body, marginBottom: 20 }}>
        {c.orderReceived.body(props.orderNumber)}
      </Text>

      <Section style={emailStyles.card}>
        <DetailRow label={c.labels.orderNumber} value={props.orderNumber} mono />
        <Row>
          <Column style={{ paddingTop: 10, paddingBottom: 4 }}>
            <Text style={emailStyles.label}>{c.labels.items}</Text>
          </Column>
        </Row>
        <ItemTable locale={locale} items={items} />
        <DetailRow label={c.labels.subtotal} value={formatRupiah(subtotal)} />
        <DetailRow
          label={`${c.labels.shipping} — ${courier}`}
          value={formatRupiah(shippingCost)}
        />
        <Hr />
        <DetailRow label={c.orderReceived.totalDue} value={formatRupiah(total)} strong mono />
      </Section>

      {expiresAt ? (
        <Section style={{ ...emailStyles.card, marginTop: 16 }}>
          <Text style={emailStyles.sectionHeading}>
            {c.orderReceived.windowHeading}
          </Text>
          <Text style={emailStyles.body}>
            {c.orderReceived.windowBody(formatDateTime(expiresAt, c.dateLocale))}
          </Text>
        </Section>
      ) : null}

      {instructionsUrl ? (
        <Section style={{ marginTop: 24, textAlign: "center" }}>
          <Button href={instructionsUrl} style={emailStyles.cta}>
            {c.orderReceived.payCta}
          </Button>
        </Section>
      ) : null}
    </EmailLayout>
  );
}

export function PaymentSuccessEmail(
  props: BaseProps & {
    items: EmailItemLine[];
    total: number;
    paymentMethodName?: string | null;
    paidAt?: Date | string | null;
    confirmationUrl?: string | null;
  }
) {
  const { locale, items, total, paymentMethodName, paidAt, confirmationUrl } = props;
  const c = EMAIL_COPY[locale];

  return (
    <EmailLayout
      locale={locale}
      preheader={c.paymentSuccess.preheader}
      siteUrl={props.siteUrl}
    >
      <Text style={emailStyles.sectionHeading}>{c.paymentSuccess.heading}</Text>
      <Greeting locale={locale} name={props.customerName} />
      <Text style={{ ...emailStyles.body, marginBottom: 20 }}>
        {c.paymentSuccess.body(props.orderNumber)}
      </Text>

      <Section style={emailStyles.card}>
        <DetailRow label={c.labels.orderNumber} value={props.orderNumber} mono />
        <Row>
          <Column style={{ paddingTop: 10, paddingBottom: 4 }}>
            <Text style={emailStyles.label}>{c.labels.items}</Text>
          </Column>
        </Row>
        <ItemTable locale={locale} items={items} />
        <Hr />
        <DetailRow label={c.paymentSuccess.totalPaid} value={formatRupiah(total)} strong mono />
        {paymentMethodName ? (
          <DetailRow label={c.labels.paymentMethod} value={paymentMethodName} />
        ) : null}
        {paidAt ? (
          <DetailRow
            label={c.labels.paidOn}
            value={formatDate(paidAt, c.dateLocale)}
          />
        ) : null}
      </Section>

      <Section style={{ ...emailStyles.card, marginTop: 16 }}>
        <Text style={emailStyles.sectionHeading}>
          {c.paymentSuccess.nextHeading}
        </Text>
        <Text style={{ ...emailStyles.body, marginBottom: 8 }}>
          1. {c.paymentSuccess.next1}
        </Text>
        <Text style={emailStyles.body}>2. {c.paymentSuccess.next2}</Text>
      </Section>

      {confirmationUrl ? (
        <Section style={{ marginTop: 24, textAlign: "center" }}>
          <Button href={confirmationUrl} style={emailStyles.cta}>
            {c.paymentSuccess.viewCta}
          </Button>
        </Section>
      ) : null}
    </EmailLayout>
  );
}

export function ShipmentEmail(
  props: BaseProps & {
    courier: string;
    service?: string | null;
    trackingNumber: string;
    shippedAt?: Date | string | null;
    trackingUrl?: string | null;
    note?: string | null;
  }
) {
  const { locale, courier, service, trackingNumber, shippedAt, trackingUrl, note } =
    props;
  const c = EMAIL_COPY[locale];

  return (
    <EmailLayout locale={locale} preheader={c.shipment.preheader} siteUrl={props.siteUrl}>
      <Text style={emailStyles.sectionHeading}>{c.shipment.heading}</Text>
      <Greeting locale={locale} name={props.customerName} />
      <Text style={{ ...emailStyles.body, marginBottom: 20 }}>
        {c.shipment.body(props.orderNumber, courier, service || "")}
      </Text>

      <Section style={emailStyles.card}>
        <DetailRow label={c.labels.trackingNumber} value={trackingNumber} mono />
        <DetailRow label={c.labels.courier} value={courier} />
        <DetailRow
          label={c.labels.service}
          value={service || c.shipment.defaultService}
        />
        {shippedAt ? (
          <DetailRow label={c.labels.shippedOn} value={formatDate(shippedAt, c.dateLocale)} />
        ) : null}
        {note ? <DetailRow label={c.labels.note} value={note} /> : null}
      </Section>

      {trackingUrl ? (
        <Section style={{ marginTop: 24, textAlign: "center" }}>
          <Button href={trackingUrl} style={emailStyles.cta}>
            {c.shipment.trackCta}
          </Button>
        </Section>
      ) : (
        <Text style={{ ...emailStyles.body, marginTop: 20, textAlign: "center" }}>
          {c.shipment.noLinkNote}
        </Text>
      )}

      <Section style={{ ...emailStyles.card, marginTop: 16 }}>
        <Text style={emailStyles.body}>{c.shipment.delayNote}</Text>
      </Section>
    </EmailLayout>
  );
}

function Hr() {
  return (
    <hr
      style={{
        border: "none",
        borderTop: `1px solid ${emailColors.border}`,
        margin: "12px 0",
      }}
    />
  );
}
