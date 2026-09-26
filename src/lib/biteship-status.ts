export interface BiteshipWebhookPayload {
  event?: string;
  type?: string;
  order_id?: string;
  status?: string;
  price?: number;
  old_price?: number;
  previous_price?: number;
  waybill_id?: string;
  courier_waybill_id?: string;
  courier_tracking_id?: string;
  courier_company?: string;
  courier_type?: string;
  courier?: {
    tracking_id?: string;
    waybill_id?: string;
    company?: string;
    type?: string;
  };
  metadata?: {
    order_number?: string;
    [key: string]: any;
  };
  updated_at?: string;
}

export function mapBiteshipStatusToInternal(biteshipStatus: string): {
  orderStatus: "processing" | "ready_to_ship" | "shipped" | "delivered" | "cancelled" | "returned";
  description: string;
} {
  const normalized = (biteshipStatus || "").toLowerCase().trim();

  switch (normalized) {
    case "allocated":
    case "confirmed":
    case "scheduled":
      return { orderStatus: "ready_to_ship", description: "Kurir ditugaskan / pesanan terkonfirmasi" };
    case "picking_up":
      return { orderStatus: "ready_to_ship", description: "Kurir dalam perjalanan menjemput paket" };
    case "picked":
      return { orderStatus: "shipped", description: "Paket berhasil di-pickup oleh kurir" };
    case "dropping_off":
    case "in_transit":
    case "delivered_to_courier":
      return { orderStatus: "shipped", description: "Paket sedang dikirim ke alamat tujuan" };
    case "delivered":
      return { orderStatus: "delivered", description: "Paket telah sampai dan diterima" };
    case "cancelled":
      return { orderStatus: "cancelled", description: "Pengiriman dibatalkan" };
    case "rejected":
    case "courier_not_found":
      return { orderStatus: "cancelled", description: "Kurir tidak ditemukan atau pengiriman ditolak" };
    case "returned":
    case "disposed":
      return { orderStatus: "returned", description: "Paket dikembalikan ke pengirim" };
    default:
      return { orderStatus: "ready_to_ship", description: `Status Biteship: ${biteshipStatus}` };
  }
}
