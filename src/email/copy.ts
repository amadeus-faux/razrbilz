import type { Locale } from "@/lib/checkout-i18n";

/**
 * Copy email transaksional. Sama seperti checkout: EN untuk tujuan internasional,
 * ID untuk tujuan domestik — diturunkan dari `resolveLocale(Order.country)` di
 * `src/lib/email.tsx`, jadi tidak ada kolom bahasa baru.
 *
 * Tipe diambil dari `en` (`typeof en`), sehingga TypeScript gagal kalau ada string
 * yang belum diterjemahkan ke Bahasa Indonesia.
 */
const en = {
  dateLocale: "en-GB",

  brand: {
    wordmark: "RAZRBILZ",
    tagline: "UNISEX STREETWEAR · MADE TO ORDER",
    city: "Bandung, Indonesia",
    greeting: (name: string) => `Hi ${name},`,
    thanks: "Thank you for shopping at RAZRBILZ.",
    questions:
      "Questions about this order? Reply to this email, or use the contact form on our site.",
    production:
      "Every piece is made to order, so production takes 14–21 days before dispatch.",
    policy: "All sales are final except production defects.",
    policyLink: "Read our return & refund policy",
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
    subject: (n: string) => `Order received — #${n}`,
    preheader: "We have your order. Payment confirms it.",
    heading: "ORDER RECEIVED",
    body: (n: string) =>
      `We received order #${n}. Nothing is cut or sewn until payment lands — the links below are reserved for you only until the payment window closes.`,
    totalDue: "Total to pay",
    payCta: "COMPLETE PAYMENT",
    windowHeading: "Payment window",
    windowBody: (when: string) =>
      `This order expires ${when}. After that the reservation is released automatically and the items go back on sale.`,
  },

  paymentSuccess: {
    subject: (n: string) => `Payment confirmed — #${n}`,
    preheader: "Payment received. Your order is now in production.",
    heading: "PAYMENT CONFIRMED",
    body: (n: string) =>
      `We received your payment for order #${n}. The reserved items are now confirmed and move straight into production.`,
    totalPaid: "Total paid",
    nextHeading: "WHAT HAPPENS NEXT",
    next1: "We produce your pieces — allow 14–21 days for made-to-order items.",
    next2: "You will get a separate email with the tracking number once the parcel is handed to the courier.",
    viewCta: "VIEW ORDER",
  },

  shipment: {
    subject: (n: string, courier: string) =>
      `Your order #${n} has been shipped via ${courier}`,
    preheader: "Your parcel is on its way.",
    heading: "ORDER SHIPPED",
    body: (n: string, courier: string, service: string) =>
      `Order #${n} has left our studio and is on its way with ${courier}${
        service ? ` (${service})` : ""
      }.`,
    trackCta: "TRACK PACKAGE",
    noLinkNote:
      "Enter the tracking number above on the courier's official website to see the latest status.",
    delayNote:
      "Tracking updates in the destination country can take a few business days to sync after the package leaves Indonesia.",
    defaultService: "Standard",
  },

  cancellation: {
    subject: (n: string) => `Order #${n} has been cancelled`,
    preheader: "Your order is cancelled — your refund is being processed.",
    heading: "ORDER CANCELLED",
    body: (n: string) =>
      `Order #${n} has been cancelled by our team. This order will not be shipped to you.`,
    refundHeading: "YOUR REFUND",
    refundBody:
      "The amount you paid is not kept. Refunds are processed by hand by our team, and we will send you a separate confirmation as soon as the transfer has been made.",
    refundAmountLabel: "Amount to be refunded",
    refundNote:
      "The refund goes back to the payment channel you used. If anything looks wrong, reply to this email with your payment receipt and we will check it.",
  },
};

type EmailCopy = typeof en;

const id: EmailCopy = {
  dateLocale: "id-ID",

  brand: {
    wordmark: "RAZRBILZ",
    tagline: "UNISEX STREETWEAR · DIBUAT SESUAI PESANAN",
    city: "Bandung, Indonesia",
    greeting: (name: string) => `Halo ${name},`,
    thanks: "Terima kasih telah berbelanja di RAZRBILZ.",
    questions:
      "Ada pertanyaan soal pesanan ini? Balas email ini atau gunakan formulir kontak di situs kami.",
    production:
      "Semua produk dibuat sesuai pesanan, sehingga masa produksi 14–21 hari sebelum pengiriman.",
    policy: "Semua penjualan final, kecuali cacat produksi.",
    policyLink: "Baca kebijakan retur & refund kami",
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
    subject: (n: string) => `Pesanan diterima — #${n}`,
    preheader: "Pesananmu sudah kami terima. Pembayaran mengonfirmasinya.",
    heading: "PESANAN DITERIMA",
    body: (n: string) =>
      `Kami sudah menerima pesanan #${n}. Belum ada satu helai pun yang dipotong sebelum pembayaran masuk — item di bawah kami tahan hanya sampai batas waktu pembayaran berakhir.`,
    totalDue: "Total yang harus dibayar",
    payCta: "SELESAIKAN PEMBAYARAN",
    windowHeading: "BATAS WAKTU BAYAR",
    windowBody: (when: string) =>
      `Pesanan ini kedaluwarsa pada ${when}. Setelah itu tahan stok dilepas otomatis dan item kembali dijual.`,
  },

  paymentSuccess: {
    subject: (n: string) => `Pembayaran dikonfirmasi — #${n}`,
    preheader: "Pembayaran masuk. Pesananmu mulai diproduksi.",
    heading: "PEMBAYARAN DITERIMA",
    body: (n: string) =>
      `Pembayaran untuk pesanan #${n} sudah kami terima. Item yang ditahan kini resmi menjadi milikmu dan langsung masuk produksi.`,
    totalPaid: "Total dibayar",
    nextHeading: "LANGKAH SELANJUTNYA",
    next1: "Kami memproduksi pesananmu — perkiraan 14–21 hari untuk produk made-to-order.",
    next2: "Email terpisah berisi nomor resi akan dikirim begitu paket diserahkan ke kurir.",
    viewCta: "LIHAT PESANAN",
  },

  shipment: {
    subject: (n: string, courier: string) =>
      `Pesanan #${n} telah dikirim via ${courier}`,
    preheader: "Paketmu sedang dalam perjalanan.",
    heading: "PESANAN DIKIRIM",
    body: (n: string, courier: string, service: string) =>
      `Pesanan #${n} sudah berangkat dari studio kami menggunakan ${courier}${
        service ? ` (${service})` : ""
      }.`,
    trackCta: "LACAK PAKET",
    noLinkNote:
      "Masukkan nomor resi di atas di situs resmi kurir terkait untuk melihat status terkini.",
    delayNote:
      "Status pelacakan kadang baru muncul beberapa saat setelah paket diterima kurir. Bila belum terlihat, coba cek kembali dalam 1–2 hari kerja.",
    defaultService: "Standar",
  },

  cancellation: {
    subject: (n: string) => `Pesanan #${n} dibatalkan`,
    preheader: "Pesananmu dibatalkan — refund sedang kami proses.",
    heading: "PESANAN DIBATALKAN",
    body: (n: string) =>
      `Pesanan #${n} sudah kami batalkan oleh tim kami. Pesanan ini tidak akan dikirim ke alamatmu.`,
    refundHeading: "REFUND KAMU",
    refundBody:
      "Uang yang sudah kamu bayarkan tidak kami tahan. Refund kami proses manual oleh tim, dan kami akan kirim konfirmasi terpisah begitu transfernya dilakukan.",
    refundAmountLabel: "Nominal yang dikembalikan",
    refundNote:
      "Refund dikirim ke kanal pembayaran yang kamu gunakan sebelumnya. Kalau ada yang tidak sesuai, balas email ini dengan bukti bayarmu dan akan kami cek.",
  },
};

export const EMAIL_COPY: Record<Locale, EmailCopy> = { en, id };
