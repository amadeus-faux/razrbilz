import { Resend } from "resend";
import { render, toPlainText } from "@react-email/render";
import type { ReactElement } from "react";

import { prisma } from "@/lib/prisma";
import { resolveLocale } from "@/lib/checkout-i18n";
import { EMAIL_COPY } from "@/email/copy";
import {
  CancellationEmail,
  OrderReceivedEmail,
  PaymentSuccessEmail,
  ShipmentEmail,
  type EmailItemLine,
} from "@/email/templates";

export interface EmailResult {
  success: boolean;
  message: string;
}

/** Data pesanan yang dibutuhkan semua template. */
interface EmailOrder {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  /** Kode negara tujuan pengiriman. Bahasa email SELALU diturunkan dari sini
   *  (`resolveLocale`), sama seperti halaman checkout — tidak ada kolom khusus. */
  country: string;
  items: EmailItemLine[];
  total: number;
}

const POS_TRACKING_URL = "https://www.posindonesia.co.id/en/tracking";

/**
 * Satu-satunya tautan pelacakan yang bisa kita jamin benar adalah milik POS
 * Indonesia (kurir internasional + jalur manual). Pengiriman Biteship bisa memakai
 * kurir apa pun, dan menebak URL kurir lain berisiko mengirim customer ke halaman
 * yang salah — tanpa tautan, email menampilkan resi plus instruksi memakai situs
 * resmi kurir terkait.
 */
function trackingUrlFor(courier: string): string | null {
  return /\bpos\b/i.test(courier) ? POS_TRACKING_URL : null;
}

function siteUrl(): string | null {
  return process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL || null;
}

/**
 * Render elemen React Email lalu kirim lewat Resend.
 *
 * Tidak pernah melempar: email adalah efek samping, bukan bagian dari transaksi
 * pembayaran. Kalau API key belum dipasang (dev/staging) atau Resend sedang
 * gagal, pemanggil tetap bisa membalas customer dengan sukses + pesan kegagalan
 * yang bisa dibaca di log.
 */
async function deliver({
  to,
  subject,
  element,
}: {
  to: string;
  subject: string;
  element: ReactElement;
}): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn(
      `[Email] RESEND_API_KEY / EMAIL_FROM belum diisi — email "${subject}" ke ${to} TIDAK dikirim.`
    );
    return { success: false, message: "Konfigurasi email belum lengkap" };
  }

  try {
    const html = await render(element);
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text: toPlainText(html),
      replyTo: process.env.EMAIL_REPLY_TO || undefined,
    });

    if (error) {
      console.error(`[Email] Resend menolak kirim "${subject}" ke ${to}:`, error.message);
      return { success: false, message: `Resend: ${error.message}` };
    }

    console.log(`[Email] ✅ Terkirim via Resend: "${subject}" → ${to}`);
    return { success: true, message: `Email terkirim ke ${to}` };
  } catch (error) {
    console.error(`[Email] ❌ Gagal mengirim "${subject}" ke ${to}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengirim email",
    };
  }
}

/** Email "pesanan diterima" — dikirim tepat setelah order + transaksi Duitku dibuat. */
export async function sendOrderReceivedEmail(
  order: EmailOrder & {
    shippingCost: number;
    courier: string;
    expiresAt?: Date | string | null;
    instructionsUrl?: string | null;
  }
): Promise<EmailResult> {
  if (!order.customerEmail) {
    return { success: false, message: "Email customer kosong" };
  }
  const locale = resolveLocale(order.country);
  const copy = EMAIL_COPY[locale];
  const base = siteUrl();

  return deliver({
    to: order.customerEmail,
    subject: copy.orderReceived.subject(order.orderNumber),
    element: (
      <OrderReceivedEmail
        locale={locale}
        orderNumber={order.orderNumber}
        customerName={order.customerName}
        items={order.items}
        shippingCost={order.shippingCost}
        total={order.total}
        courier={order.courier}
        expiresAt={order.expiresAt ?? null}
        siteUrl={base}
        instructionsUrl={
          order.instructionsUrl || (base ? `${base}/payment/instructions/${order.orderNumber}` : null)
        }
      />
    ),
  });
}

/** Email "pembayaran diterima" — dipanggil dari satu-satunya titik transisi ke paid. */
export async function sendPaymentSuccessEmail(
  order: EmailOrder & {
    paymentMethodName?: string | null;
    paidAt?: Date | string | null;
  }
): Promise<EmailResult> {
  if (!order.customerEmail) {
    return { success: false, message: "Email customer kosong" };
  }
  const locale = resolveLocale(order.country);
  const copy = EMAIL_COPY[locale];
  const base = siteUrl();

  return deliver({
    to: order.customerEmail,
    subject: copy.paymentSuccess.subject(order.orderNumber),
    element: (
      <PaymentSuccessEmail
        locale={locale}
        orderNumber={order.orderNumber}
        customerName={order.customerName}
        items={order.items}
        total={order.total}
        paymentMethodName={order.paymentMethodName ?? null}
        paidAt={order.paidAt ?? null}
        siteUrl={base}
        confirmationUrl={
          base ? `${base}/order-confirmation/${encodeURIComponent(order.orderNumber)}` : null
        }
      />
    ),
  });
}

/**
 * Email "pesanan dibatalkan" + info refund manual.
 *
 * Hanya untuk order yang benar-benar sudah dibayar: order belum bayar tidak punya
 * apa pun untuk dikembalikan, jadi menulis "refund" di sana adalah klaim palsu.
 */
export async function sendCancellationEmail(
  order: Omit<EmailOrder, "items"> & {
    paymentMethodName?: string | null;
    cancelledAt?: Date | string | null;
  }
): Promise<EmailResult> {
  if (!order.customerEmail) {
    return { success: false, message: "Email customer kosong" };
  }
  const locale = resolveLocale(order.country);
  const copy = EMAIL_COPY[locale];
  const base = siteUrl();

  return deliver({
    to: order.customerEmail,
    subject: copy.cancellation.subject(order.orderNumber),
    element: (
      <CancellationEmail
        locale={locale}
        orderNumber={order.orderNumber}
        customerName={order.customerName}
        total={order.total}
        paymentMethodName={order.paymentMethodName ?? null}
        cancelledAt={order.cancelledAt ?? null}
        siteUrl={base}
      />
    ),
  });
}

/**
 * Email "pesanan dikirim / nomor resi". Idempoten per nomor resi: webhook Biteship
 * bisa mengirim status yang sama berulang kali, dan resi tidak boleh membuat
 * customer menerima email yang dua kali.
 */
export async function sendShippingEmail(
  order: Omit<EmailOrder, "total" | "items"> & {
    courier: string;
    service?: string | null;
    trackingNumber: string;
    shippedAt?: Date | string | null;
    trackingUrl?: string | null;
    note?: string | null;
  }
): Promise<EmailResult> {
  const { orderId, orderNumber, customerEmail, trackingNumber, courier } = order;
  if (!customerEmail) {
    return { success: false, message: "Email customer kosong" };
  }

  try {
    const already = await prisma.shippingLog.findFirst({
      where: {
        orderId,
        event: "EMAIL_TRACKING_SENT",
        newValue: { contains: trackingNumber },
      },
      select: { id: true },
    });
    if (already) {
      console.log(
        `[Email] Notifikasi resi ${trackingNumber} untuk order ${orderNumber} sudah pernah dikirim (skip).`
      );
      return { success: true, message: "Email resi sudah pernah dikirim" };
    }
  } catch (error) {
    console.error(`[Email] Gagal memeriksa log email untuk order ${orderNumber}:`, error);
  }

  const locale = resolveLocale(order.country);
  const copy = EMAIL_COPY[locale];
  const result = await deliver({
    to: customerEmail,
    subject: copy.shipment.subject(orderNumber, courier),
    element: (
      <ShipmentEmail
        locale={locale}
        orderNumber={orderNumber}
        customerName={order.customerName}
        courier={courier}
        service={order.service ?? null}
        trackingNumber={trackingNumber}
        shippedAt={order.shippedAt ?? null}
        trackingUrl={order.trackingUrl || trackingUrlFor(courier)}
        note={order.note ?? null}
        siteUrl={siteUrl()}
      />
    ),
  });

  if (!result.success) return result;

  // Jejak audit di ShippingLog (dipakai tabel riwayat pesanan admin).
  try {
    await prisma.shippingLog.create({
      data: {
        orderId,
        event: "EMAIL_TRACKING_SENT",
        newValue: JSON.stringify({
          recipient: customerEmail,
          subject: copy.shipment.subject(orderNumber, courier),
          trackingNumber,
          courier,
          service: order.service ?? null,
          locale,
        }),
        note: `Email konfirmasi resi (locale=${locale}) terkirim ke ${customerEmail} (Resi: ${trackingNumber})`,
      },
    });
  } catch (error) {
    console.error(`[Email] Gagal mencatat log email untuk order ${orderNumber}:`, error);
  }

  return result;
}
