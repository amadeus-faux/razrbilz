"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { RefreshCw, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export interface OrderItemType {
  id: string;
  size: string;
  quantity: number;
  priceAtBuy: number;
  product?: {
    name: string;
  } | null;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  shippingAddress: string;
  district: string | null;
  city: string;
  province: string | null;
  postalCode: string;
  courier: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  shippingOrderStatus?: string | null;
  shippingOrderError?: string | null;
  shippingRetryCount?: number;
  biteshipOrderId?: string | null;
  trackingNumber?: string | null;
  createdAt: any;
  items: OrderItemType[];
}

export default function OrdersTableClient({ initialOrders }: { initialOrders: OrderType[] }) {
  const router = useRouter();
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleRetryShipping(order: OrderType) {
    if (!confirm(`Coba ulang buat label pengiriman Biteship untuk order ${order.orderNumber}?`)) {
      return;
    }

    setRetryingId(order.id);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/retry-shipping/${order.id}`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mencoba ulang pengiriman Biteship");
      }

      setActionMessage({
        type: "success",
        text: `✅ Berhasil! Order ${order.orderNumber} berhasil dibuatkan label di Biteship (ID: ${data.biteshipOrderId}).`,
      });
      router.refresh();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: `❌ Gagal: ${err instanceof Error ? err.message : "Terjadi kesalahan saat memanggil Biteship"}`,
      });
    } finally {
      setRetryingId(null);
    }
  }

  if (initialOrders.length === 0) {
    return (
      <div className="py-16 text-center text-xs text-[#8c8680]">
        Belum ada pesanan masuk di sistem.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actionMessage && (
        <div
          className={`p-3.5 mx-4 mt-4 rounded-xl text-xs flex items-center justify-between border ${
            actionMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-300 border-rose-500/20"
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="text-[11px] underline font-medium ml-4 cursor-pointer hover:opacity-80"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#181715] border-b border-[#242320] text-[#8c8680] uppercase tracking-wider font-semibold text-[11px]">
              <th className="py-3.5 px-4">No. Pesanan</th>
              <th className="py-3.5 px-4">Waktu Pesan</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Alamat Pengiriman</th>
              <th className="py-3.5 px-4">Item & Ukuran</th>
              <th className="py-3.5 px-4">Total</th>
              <th className="py-3.5 px-4">Kurir</th>
              <th className="py-3.5 px-4">Pembayaran</th>
              <th className="py-3.5 px-4">Status Biteship</th>
              <th className="py-3.5 px-4">No. Resi</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#201f1c]">
            {initialOrders.map((order) => {
              const isPaid = order.paymentStatus === "paid";
              const isFailed =
                order.shippingOrderStatus === "FAILED" ||
                (isPaid && !order.biteshipOrderId && order.shippingOrderError);
              const isCreated = order.shippingOrderStatus === "CREATED" || !!order.biteshipOrderId;
              const isRetrying = retryingId === order.id;

              return (
                <tr key={order.id} className="hover:bg-[#1a1917]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#f4f2ee]">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-[#9c968f] whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#f4f2ee]">{order.customerName}</p>
                    <p className="text-[11px] text-[#8c8680] mt-0.5">{order.phone}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] max-w-[220px]">
                    <p className="text-[#dedad3] line-clamp-2">{order.shippingAddress}</p>
                    <p className="text-[#8c8680] text-[10px] mt-0.5">
                      {[order.district, order.city, order.province, order.postalCode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {order.items.map((it, idx) => (
                        <p key={idx} className="text-[11px] text-[#dedad3]">
                          <span className="font-medium text-[#f4f2ee]">
                            {it.product ? it.product.name : "Item"}
                          </span>{" "}
                          ({it.size}) × {it.quantity}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#f4f2ee]">
                    {formatRupiah(order.total)}
                  </td>
                  <td className="py-3.5 px-4 text-[#dedad3] font-medium uppercase text-[11px]">
                    {order.courier}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-full border ${
                        isPaid
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {isCreated ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                          <CheckCircle2 size={12} strokeWidth={2} />
                          Terkirim ke Biteship
                        </span>
                        {order.biteshipOrderId && (
                          <p className="text-[10px] text-[#8c8680] font-mono truncate max-w-[150px]">
                            ID: {order.biteshipOrderId}
                          </p>
                        )}
                      </div>
                    ) : isFailed ? (
                      <div className="space-y-1.5 max-w-[220px]">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-lg">
                          <AlertCircle size={12} strokeWidth={2} />
                          Gagal Kirim ke Biteship
                        </span>
                        {order.shippingOrderError && (
                          <p className="text-[10.5px] text-rose-300 bg-rose-500/15 p-2 rounded-lg border border-rose-500/30 leading-snug">
                            {order.shippingOrderError}
                          </p>
                        )}
                        {(order.shippingRetryCount || 0) > 0 && (
                          <p className="text-[10px] text-[#8c8680]">
                            Percobaan: {order.shippingRetryCount}x
                          </p>
                        )}
                      </div>
                    ) : isPaid ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
                        <Clock size={12} strokeWidth={2} />
                        Menunggu Proses
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#8c8680]">
                        Menunggu Pembayaran
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs">
                    {order.trackingNumber ? (
                      <span className="font-semibold text-white px-2 py-0.5 rounded bg-[#1e1d1a] border border-[#2e2c28]">
                        {order.trackingNumber}
                      </span>
                    ) : (
                      <span className="text-[#6a6660]">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {isPaid && !isCreated && (
                      <button
                        onClick={() => handleRetryShipping(order)}
                        disabled={isRetrying}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm ${
                          isFailed
                            ? "bg-rose-600 hover:bg-rose-500 text-white"
                            : "bg-white hover:bg-neutral-200 text-black"
                        } disabled:opacity-50`}
                      >
                        <RefreshCw size={12} className={isRetrying ? "animate-spin" : ""} />
                        <span>{isRetrying ? "Memproses..." : "Retry Shipping"}</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
