"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { RefreshCw, AlertCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
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
      <div className="p-8 text-center text-xs text-muted">
        Belum ada pesanan masuk.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actionMessage && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center justify-between ${
            actionMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="text-[11px] underline font-medium ml-4 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted bg-surface/50">
              <th className="p-4">No. Pesanan</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Item & Ukuran</th>
              <th className="p-4">Total</th>
              <th className="p-4">Kurir</th>
              <th className="p-4">Pembayaran</th>
              <th className="p-4">Status Pengiriman Biteship</th>
              <th className="p-4">No. Resi</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {initialOrders.map((order) => {
              const isPaid = order.paymentStatus === "paid";
              const isFailed = order.shippingOrderStatus === "FAILED" || (isPaid && !order.biteshipOrderId && order.shippingOrderError);
              const isCreated = order.shippingOrderStatus === "CREATED" || !!order.biteshipOrderId;
              const isRetrying = retryingId === order.id;

              return (
                <tr key={order.id} className="hover:bg-surface/50">
                  <td className="p-4 font-mono font-medium">
                    {order.orderNumber}
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-[10px] text-muted">{order.phone}</p>
                  </td>
                  <td className="p-4">
                    {order.items.map((it, idx) => (
                      <p key={idx} className="text-[11px]">
                        {it.product ? it.product.name : "Item"} ({it.size}) ×{" "}
                        {it.quantity}
                      </p>
                    ))}
                  </td>
                  <td className="p-4 font-medium">
                    {formatRupiah(order.total)}
                  </td>
                  <td className="p-4">{order.courier}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] uppercase font-medium rounded-full ${
                        isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    {isCreated ? (
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-green-50 text-green-700 border border-green-200 rounded-md">
                          <CheckCircle2 size={11} />
                          Terkirim ke Biteship
                        </span>
                        {order.biteshipOrderId && (
                          <p className="text-[10px] text-muted font-mono truncate max-w-[140px]">
                            ID: {order.biteshipOrderId}
                          </p>
                        )}
                      </div>
                    ) : isFailed ? (
                      <div className="space-y-1 max-w-[200px]">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-red-100 text-red-700 border border-red-300 rounded-md">
                          <AlertCircle size={11} />
                          Gagal Kirim ke Biteship
                        </span>
                        {order.shippingOrderError && (
                          <p className="text-[10.5px] text-red-600 leading-tight bg-red-50 p-1.5 rounded border border-red-100 font-sans">
                            {order.shippingOrderError}
                          </p>
                        )}
                        {(order.shippingRetryCount || 0) > 0 && (
                          <p className="text-[9.5px] text-muted">
                            Dicoba: {order.shippingRetryCount}x
                          </p>
                        )}
                      </div>
                    ) : isPaid ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                        <Clock size={11} />
                        Menunggu Proses
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted">
                        Menunggu Pembayaran
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono">
                    {order.trackingNumber ? (
                      <span className="font-semibold text-foreground">{order.trackingNumber}</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {isPaid && !isCreated && (
                      <button
                        onClick={() => handleRetryShipping(order)}
                        disabled={isRetrying}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                          isFailed
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-foreground hover:bg-foreground/90 text-background"
                        } disabled:opacity-50`}
                      >
                        <RefreshCw size={11} className={isRetrying ? "animate-spin" : ""} />
                        {isRetrying ? "Memproses..." : "Retry Shipping"}
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
