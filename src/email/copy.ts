import type { Locale } from "@/lib/checkout-i18n";

/**
 * Copy email transaksional. Sama seperti checkout: EN untuk tujuan internasional,
 * ID untuk tujuan domestik — diturunkan dari `resolveLocale(Order.country)` di
 * `src/lib/email.tsx`, jadi tidak ada kolom bahasa baru.
 *
 * Tipe diambil dari `en` (`typeof en`), sehingga TypeScript gagal kalau ada string
 * yang belum diterjemahkan ke Bahasa Indonesia.
 *
 * Gaya bahasa: kalimat pendek, fakta operasional dulu, tanpa hiasan. Yang berubah
 * di sini sebaiknya hanya nada — bukan fakta (14–21 hari produksi, all sales final
 * kecuali cacat produksi, refund manual tanpa tenggat pasti).
 */
const en = {
  dateLocale: "en-GB",

  brand: {
    wordmark: "RAZRBILZ",
    tagline: "FIND YOUR NORTH",
    city: "Bandung, Indonesia",
    greeting: (name: string) => `Hi ${name},`,
    questions:
      "Questions about this order? Reply to this email, or use the contact form on razrbilz.id.",
    production:
      "Every piece is made to order at our studio in Bandung.",
    policy: "All sales are final, except for production defects.",
    policyLink: "Return & refund policy",
    home: "razrbilz.id",
  },

  labels: {
    orderNumber: "Order no.",
    date: "Date",
    items: "Items",
    size: "Size",
    qty: "Qty",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    courier: "Courier",
    service: "Service",
    trackingNumber: "Tracking number",
    shippedOn: "Shipped on",
    note: "Note",
    paymentMethod: "Payment method",
    paidOn: "Paid on",
    expiresOn: "Pay before",
  },

  orderReceived: {
    subject: (n: string) => `Order #${n} received`,
    preheader: "Your items are held until the payment deadline.",
    heading: "ORDER RECEIVED",
    body: (n: string) =>
      `We have received order #${n} and set the items aside for you. Production starts as soon as payment is confirmed, and takes 14–21 days.`,
    totalDue: "Amount due",
    payCta: "COMPLETE PAYMENT",
    windowHeading: "Payment deadline",
    windowBody: (when: string) =>
      `This order expires on ${when}. After that the hold is released automatically and the items go back on sale.`,
  },

  paymentSuccess: {
    subject: (n: string) => `Payment received — #${n}`,
    preheader: "Production starts now. Tracking follows when your parcel ships.",
    heading: "PAYMENT CONFIRMED",
    body: (n: string) =>
      `We have received your payment for order #${n}. Your items are confirmed and have gone into production.`,
    totalPaid: "Total paid",
    nextHeading: "WHAT HAPPENS NEXT",
    next1: "Production takes 14–21 days.",
    next2: "We email you a separate tracking notice when the parcel is handed to the courier.",
    viewCta: "VIEW ORDER",
  },

  shipment: {
    subject: (n: string, courier: string) =>
      `Order #${n} shipped via ${courier}`,
    preheader: "Tracking details are inside.",
    heading: "ORDER SHIPPED",
    body: (n: string, courier: string, service: string) =>
      `Order #${n} has been handed over to ${courier}${
        service ? ` (${service})` : ""
      }.`,
    trackCta: "TRACK PACKAGE",
    noLinkNote:
      "Copy the tracking number above into the courier's own website for the latest status.",
    delayNote:
      "Once the parcel leaves Indonesia, updates at the destination can take a few business days to appear.",
    defaultService: "Standard",
  },

  cancellation: {
    subject: (n: string) => `Order #${n} cancelled`,
    preheader: "We are arranging your refund.",
    heading: "ORDER CANCELLED",
    body: (n: string) =>
      `Order #${n} has been cancelled and will not be shipped.`,
    refundHeading: "REFUND",
    refundBody:
      "We do not keep payment for a cancelled order. Our team issues the refund by hand, and a separate confirmation is sent once the transfer is made.",
    refundAmountLabel: "Refund amount",
    refundNote:
      "The money goes back to the payment channel you used. If it does not arrive, reply to this email with your payment receipt and we will trace it.",
  },
};

type EmailCopy = typeof en;

const id: EmailCopy = {
  dateLocale: "id-ID",

  brand: {
    wordmark: "RAZRBILZ",
    tagline: "FIND YOUR NORTH",
    city: "Bandung, Indonesia",
    greeting: (name: string) => `Halo ${name},`,
    questions:
      "Ada pertanyaan tentang pesanan ini? Balas email ini atau isi formulir kontak di razrbilz.id.",
    production:
      "Semua produk dibuat sesuai pesanan di studio kami di Bandung.",
    policy: "Semua penjualan bersifat final, kecuali terdapat cacat produksi.",
    policyLink: "Kebijakan retur & refund",
    home: "razrbilz.id",
  },

  labels: {
    orderNumber: "No. pesanan",
    date: "Tanggal",
    items: "Item",
    size: "Ukuran",
    qty: "Jumlah",
    subtotal: "Subtotal",
    shipping: "Ongkir",
    total: "Total",
    courier: "Kurir",
    service: "Layanan",
    trackingNumber: "Nomor resi",
    shippedOn: "Dikirim pada",
    note: "Catatan",
    paymentMethod: "Metode pembayaran",
    paidOn: "Dibayar pada",
    expiresOn: "Bayar sebelum",
  },

  orderReceived: {
    subject: (n: string) => `Pesanan #${n} diterima`,
    preheader: "Item kami tahan sampai batas waktu bayar berakhir.",
    heading: "PESANAN DITERIMA",
    body: (n: string) =>
      `Pesanan #${n} sudah kami terima dan itemnya kami tahan untuk kamu. Produksi dimulai begitu pembayaran kami terima dan membutuhkan waktu 14–21 hari.`,
    totalDue: "Total pembayaran",
    payCta: "SELESAIKAN PEMBAYARAN",
    windowHeading: "BATAS WAKTU BAYAR",
    windowBody: (when: string) =>
      `Pesanan ini kedaluwarsa pada ${when}. Setelah itu tahan stok dilepas otomatis dan item kembali dijual.`,
  },

  paymentSuccess: {
    subject: (n: string) => `Pembayaran diterima — #${n}`,
    preheader: "Pesanan masuk produksi. Nomor resi dikirim saat paket berangkat.",
    heading: "PEMBAYARAN DITERIMA",
    body: (n: string) =>
      `Pembayaran untuk pesanan #${n} sudah kami terima. Pesananmu terkonfirmasi dan masuk antrean produksi.`,
    totalPaid: "Total dibayar",
    nextHeading: "LANGKAH SELANJUTNYA",
    next1: "Produksi membutuhkan waktu 14–21 hari.",
    next2: "Email berisi nomor resi kami kirim terpisah begitu paket diserahkan ke kurir.",
    viewCta: "LIHAT PESANAN",
  },

  shipment: {
    subject: (n: string, courier: string) =>
      `Pesanan #${n} dikirim via ${courier}`,
    preheader: "Detail pelacakan ada di email ini.",
    heading: "PESANAN DIKIRIM",
    body: (n: string, courier: string, service: string) =>
      `Pesanan #${n} sudah kami serahkan ke ${courier}${
        service ? ` (${service})` : ""
      }.`,
    trackCta: "LACAK PAKET",
    noLinkNote:
      "Salin nomor resi di atas ke situs resmi kurir untuk melihat status terbaru.",
    delayNote:
      "Setelah paket berangkat dari Indonesia, status di negara tujuan bisa baru terisi beberapa hari kerja.",
    defaultService: "Standar",
  },

  cancellation: {
    subject: (n: string) => `Pesanan #${n} dibatalkan`,
    preheader: "Refund sedang kami urus.",
    heading: "PESANAN DIBATALKAN",
    body: (n: string) =>
      `Pesanan #${n} dibatalkan dan tidak akan dikirim ke alamatmu.`,
    refundHeading: "REFUND",
    refundBody:
      "Kami tidak menahan uang untuk pesanan yang dibatalkan. Refund kami proses manual oleh tim, dan konfirmasi terpisah dikirim begitu transfernya dilakukan.",
    refundAmountLabel: "Nominal refund",
    refundNote:
      "Dana dikembalikan ke kanal pembayaran yang kamu gunakan. Jika belum masuk, balas email ini dengan bukti bayarmu dan akan kami telusuri.",
  },
};

export const EMAIL_COPY: Record<Locale, EmailCopy> = { en, id };
