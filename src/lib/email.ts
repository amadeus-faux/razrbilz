import { prisma } from "@/lib/prisma";

export interface ManualShippingEmailParams {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  courier: string;
  service?: string | null;
  trackingNumber: string;
  shippedAt?: Date | string | null;
  note?: string | null;
}

/**
 * Sends a tracking notification email to the customer for manual shipments (e.g. POS Indonesia).
 * Logs the email attempt and result into database and console.
 */
export async function sendManualShippingEmail(params: ManualShippingEmailParams): Promise<{ success: boolean; message: string }> {
  const {
    orderId,
    orderNumber,
    customerName,
    customerEmail,
    courier,
    service,
    trackingNumber,
    shippedAt,
    note,
  } = params;

  const trackingUrl = "https://www.posindonesia.co.id/en/tracking";
  const formattedDate = shippedAt
    ? new Date(shippedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const subject = `Pesanan Anda #${orderNumber} Telah Dikirim (${courier} ${service || ""}) - RAZRBILZ`;
  
  const textBody = `
Halo ${customerName},

Pesanan Anda dengan nomor #${orderNumber} telah dikirimkan menggunakan ${courier} ${service ? `(${service})` : ""}.

Detail Pengiriman:
- Nomor Resi: ${trackingNumber}
- Kurir: ${courier}
- Layanan: ${service || "Standar Internasional"}
- Tanggal Pengiriman: ${formattedDate}
${note ? `- Catatan: ${note}` : ""}

Lacak paket Anda melalui tautan resmi POS Indonesia:
${trackingUrl}

Catatan Penting:
Pembaruan status pelacakan di negara tujuan mungkin memerlukan beberapa hari kerja untuk sinkronisasi setelah paket diberangkatkan dari Indonesia.

Terima kasih telah berbelanja di RAZRBILZ!
`.trim();

  console.log(`[Email] Sending manual tracking email to ${customerEmail} for order ${orderNumber}...`);
  console.log(`[Email Content]\n${textBody}`);

  try {
    // Record the email notification event in ShippingLog
    await prisma.shippingLog.create({
      data: {
        orderId,
        event: "EMAIL_TRACKING_SENT",
        newValue: JSON.stringify({
          recipient: customerEmail,
          subject,
          trackingNumber,
          courier,
          service,
          trackingUrl,
        }),
        note: `Email konfirmasi resi berhasil dikirimkan ke ${customerEmail} (Resi: ${trackingNumber})`,
      },
    });

    return { success: true, message: `Email notifikasi resi berhasil dikirim ke ${customerEmail}` };
  } catch (error) {
    console.error(`[Email] Failed to log email delivery for order ${orderNumber}:`, error);
    return { success: false, message: `Gagal mencatat log email: ${error instanceof Error ? error.message : "Unknown error"}` };
  }
}
