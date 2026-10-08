import { Resend } from "resend";
import { render, toPlainText } from "@react-email/render";
import type { ReactElement } from "react";

import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { resolveLocale } from "@/lib/checkout-i18n";
import { isInternationalCountry } from "@/lib/shipping-cost";
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
  /** true = email TIDAK dikirim karena jejaknya sudah ada. Bukan kegagalan. */
  skipped?: boolean;
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
  text,
  replyTo,
  fromName,
}: {
  to: string;
  subject: string;
  /** Email ber-format: semua email customer memakai jalur ini. */
  element?: ReactElement;
  /** Teks murni tanpa HTML sama sekali. Dipakai notifikasi Contact Us: isinya
   *  pesan pengunjung, jadi tidak boleh ada kotak/warna/templat di sekitarnya. */
  text?: string;
  /** Ke mana tombol Reply mengarah. Bila tidak diisi, EMAIL_REPLY_TO environment
   *  yang dipakai. Form Contact Us mengirim alamat pengunjung ke sini supaya
   *  balasan pemilik toko sampai ke pengunjung, bukan ke alamat pengirim (info@). */
  replyTo?: string | null;
  /** Label di depan alamat kita pada header From, mis. "Sam Fatih (sam@x.com)".
   *  Alamat From TIDAK PERNAH diganti: pengiriman atas nama domain pihak lain
   *  ditolak provider dan gagal lolos DMARC. */
  fromName?: string;
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
    const html = element ? await render(element) : undefined;
    const fromAddress = /<([^>]+)>/.exec(from)?.[1] ?? from;
    const quotedName = fromName?.replace(/["\\]/g, "").trim();
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: quotedName ? `"${quotedName}" <${fromAddress}>` : from,
      to,
      subject,
      // Setiap pemanggil memberi `element` ATAU `text`; `?? ""` hanya untuk
      // memenuhi tipe Resend pada jalur teks murni.
      ...(html ? { html, text: text ?? toPlainText(html) } : { text: text ?? "" }),
      replyTo: replyTo || process.env.EMAIL_REPLY_TO || undefined,
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

/**
 * Jejak audit di ShippingLog, ditulis HANYA setelah Resend menerima kiriman.
 * Dengan begitu "tidak ada baris = email belum pernah dikirim" bisa dipercaya
 * saat menelusuri keluhan, tanpa harus membuka dashboard Resend.
 */
async function logEmailSent(p: {
  orderId: string;
  event: string;
  recipient: string;
  subject: string;
  /** Disimpan utuh di `previousValue` supaya pengecekan idempoten bisa persis. */
  trackingNumber?: string;
  detail?: Record<string, unknown>;
}): Promise<void> {
  try {
    await prisma.shippingLog.create({
      data: {
        orderId: p.orderId,
        event: p.event,
        previousValue: p.trackingNumber ?? null,
        newValue: JSON.stringify({
          recipient: p.recipient,
          subject: p.subject,
          ...p.detail,
        }),
        note: `Email "${p.subject}" terkirim ke ${p.recipient}`,
      },
    });
  } catch (error) {
    console.error(`[Email] Gagal mencatat log ${p.event} untuk order ${p.orderId}:`, error);
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
  const subject = copy.orderReceived.subject(order.orderNumber);

  const result = await deliver({
    to: order.customerEmail,
    subject,
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

  if (result.success) {
    await logEmailSent({
      orderId: order.orderId,
      event: "EMAIL_ORDER_RECEIVED_SENT",
      recipient: order.customerEmail,
      subject,
      detail: { locale },
    });
  }

  return result;
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
  const subject = copy.paymentSuccess.subject(order.orderNumber);

  const result = await deliver({
    to: order.customerEmail,
    subject,
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

  if (result.success) {
    await logEmailSent({
      orderId: order.orderId,
      event: "EMAIL_PAYMENT_SENT",
      recipient: order.customerEmail,
      subject,
      detail: { locale, paymentMethod: order.paymentMethodName ?? null },
    });
  }

  return result;
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
  const subject = copy.cancellation.subject(order.orderNumber);

  const result = await deliver({
    to: order.customerEmail,
    subject,
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

  if (result.success) {
    await logEmailSent({
      orderId: order.orderId,
      event: "EMAIL_CANCELLATION_SENT",
      recipient: order.customerEmail,
      subject,
      detail: { locale, paymentMethod: order.paymentMethodName ?? null },
    });
  }

  return result;
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
    // Pencocokan PERSIS pada resi di `previousValue`, bukan substring di `newValue`:
    // resi lama yang merupakan potongan resi baru (koreksi typo) tidak boleh
    // membuat email resi baru dianggap sudah terkirim.
    const already = await prisma.shippingLog.findFirst({
      where: { orderId, event: "EMAIL_TRACKING_SENT", previousValue: trackingNumber },
      select: { id: true },
    });
    if (already) {
      console.log(
        `[Email] Notifikasi resi ${trackingNumber} untuk order ${orderNumber} sudah pernah dikirim (skip).`
      );
      return { success: true, skipped: true, message: "Email resi sudah pernah dikirim" };
    }
  } catch (error) {
    console.error(`[Email] Gagal memeriksa log email untuk order ${orderNumber}:`, error);
  }

  const locale = resolveLocale(order.country);
  const copy = EMAIL_COPY[locale];
  const subject = copy.shipment.subject(orderNumber, courier);

  const result = await deliver({
    to: customerEmail,
    subject,
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
        international={isInternationalCountry(order.country)}
        siteUrl={siteUrl()}
      />
    ),
  });

  if (!result.success) return result;

  await logEmailSent({
    orderId,
    event: "EMAIL_TRACKING_SENT",
    recipient: customerEmail,
    subject,
    trackingNumber,
    detail: { courier, service: order.service ?? null, locale },
  });

  return result;
}

/**
 * Notifikasi internal untuk pesan dari form Contact Us.
 *
 * Dikirim sebagai TEKS MURNI (tanpa HTML) dan isinya HANYA teks dari pengunjung —
 * tidak ada baris pembuka, footer, atau label dari kita. Identitas pengirim
 * dibawa di header: label From berisi alamat pengunjung + `replyTo`, dan subjek
 * dari pengunjung (namanya bila subjek kosong).
 *
 * `from` tetap alamat kita (EMAIL_FROM, domain terverifikasi) — alamat pengunjung
 * masuk ke `replyTo`, karena mengirim dengan from = email pihak lain akan ditolak
 * provider dan tidak pernah sampai. Tidak ada jejak di ShippingLog: tabel itu
 * terhubung ke satu order lewat FK, dan pesan kontak tidak punya order. Bukti
 * pengirimannya adalah log console + inbox support.
 */
export async function sendContactMessageEmail(p: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<EmailResult> {
  const to = process.env.CONTACT_EMAIL_TO || "support@razrbilz.id";
  /** Subjek = subjek yang ditulis pengunjung, apa adanya. Pengisi form itu
   *  opsional; kalau kosong, nama yang jadi subjek supaya emailnya tetap bisa
   *  diidentifikasi — di badan pesan tidak ada teks dari kita sama sekali. */
  const subject = p.subject || `Pesan dari ${p.name}`;
  const text = `${p.message}\n`;

  const result = await deliver({
    to,
    subject,
    text,
    replyTo: p.email,
    /** Hanya alamat pengunjung yang jadi label From: cukup untuk mengenali
     *  pengirim di daftar inbox, badan pesan tetap bersih. */
    fromName: p.email,
  });

  console.log(
    `[Email] Notifikasi Contact Us dari ${p.email} <${p.name}> ke ${to}: ${result.message}`
  );

  return result;
}

/**
 * Notifikasi internal ke pemilik toko saat pembayaran masuk.
 *
 * Teks murni Bahasa Indonesia tanpa templat HTML: ini pesan sistem untuk
 * pemilik, bukan komunikasi ke customer, jadi tidak mengikuti locale pesanan.
 * Tujuan dari OWNER_EMAIL_TO (fallback alamat pemilik) supaya bisa diganti
 * tanpa menyentuh kode, sama seperti CONTACT_EMAIL_TO.
 *
 * Dikirim SESUDAH status paid terkunci oleh pemegang lock, sehingga callback
 * Duitku yang retry tidak mengirim notifikasi dobel. deliver() tidak pernah
 * melempar dan pemanggil juga membungkusnya try/catch, jadi kegagalan
 * notifikasi tidak bisa membatalkan transaksi.
 */
export async function sendPaymentReceivedNotification(p: {
  orderId: string;
  orderNumber: string;
  total: number;
  paymentMethodCode?: string | null;
  customerName: string;
  customerEmail: string;
}): Promise<EmailResult> {
  const to = process.env.OWNER_EMAIL_TO || "razrbilz@gmail.com";
  const base = siteUrl();
  const subject = `Pembayaran diterima ${p.orderNumber}`;
  const lines = [
    `Nomor order: ${p.orderNumber}`,
    `Total: ${formatRupiah(p.total)}`,
    `Metode (kode Duitku): ${p.paymentMethodCode || "tidak diketahui"}`,
    `Customer: ${p.customerName} <${p.customerEmail}>`,
  ];
  if (base) lines.push(`Admin: ${base}/admin/orders`);
  const text = `${lines.join("\n")}\n`;

  const result = await deliver({ to, subject, text });

  if (result.success) {
    await logEmailSent({
      orderId: p.orderId,
      event: "EMAIL_OWNER_PAYMENT_NOTIFY",
      recipient: to,
      subject,
      detail: { paymentMethod: p.paymentMethodCode ?? null },
    });
  }

  console.log(`[Email] Notifikasi pemilik ${p.orderNumber} ke ${to}: ${result.message}`);
  return result;
}
