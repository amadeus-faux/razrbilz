/**
 * Label Bahasa Inggris untuk enum status pesanan/pembayaran.
 *
 * Nilai `orderStatus`/`paymentStatus` disimpan sebagai string bebas di DB, bukan
 * enum Prisma, jadi tidak bisa diterjemahkan dari schema. Peta ini menjadi satu
 * sumber label untuk halaman customer-facing (yang permanen Inggris).
 *
 * Catatan: order retur/cancel TETAP ber-paymentStatus "paid" (sesuai desain), jadi
 * label-status bukan alat penyaring revenue — penyaringan ada di dashboard-stats.
 */

const ORDER_STATUS_LABELS: Record<string, string> = {
  order_received: "Order received",
  processing: "Processing",
  in_production: "In production (pre-order, 14–21 days)",
  ready_to_ship: "Ready to ship (awaiting courier)",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed (delivered)",
  cancelled: "Cancelled",
  returned: "Returned",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
};

/** Fallback manusiawi: "in_prod" -> "In prod", alih-alih mencetak SCREAMING_SNAKE. */
function humanize(raw: string): string {
  const spaced = raw.replace(/[_-]+/g, " ").trim();
  if (!spaced) return "";
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

export function orderStatusLabel(status?: string | null): string {
  const key = (status ?? "").trim().toLowerCase();
  return ORDER_STATUS_LABELS[key] ?? humanize(key);
}

export function paymentStatusLabel(status?: string | null): string {
  const key = (status ?? "").trim().toLowerCase();
  return PAYMENT_STATUS_LABELS[key] ?? humanize(key);
}
