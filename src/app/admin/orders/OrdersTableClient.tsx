"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import {
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  PackageCheck,
  Send,
  Copy,
  Check,
  XCircle,
  Sparkles,
} from "lucide-react";
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
  isPreOrder?: boolean | null;
  biteshipStatus?: string | null;
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
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"ready" | "retry" | "sync" | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedResi, setCopiedResi] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  async function handleMarkReadyToShip(order: OrderType) {
    if (
      !confirm(
        `Tandai order ${order.orderNumber} sebagai SIAP KIRIM?\n\nSistem akan memanggil API Biteship dan meminta pickup ke kurir ${order.courier.toUpperCase()}.`
      )
    ) {
      return;
    }

    setProcessingId(order.id);
    setActionType("ready");
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/ready-to-ship`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memproses siap kirim ke Biteship");
      }

      setActionMessage({
        type: "success",
        text: `✅ Sukses! Order ${order.orderNumber} ditandai siap kirim ke Biteship (ID: ${data.biteshipOrderId}).`,
      });
      router.refresh();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: `❌ Gagal: ${err instanceof Error ? err.message : "Terjadi kesalahan saat memanggil Biteship"}`,
      });
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  }

  async function handleRetryShipping(order: OrderType) {
    if (!confirm(`Coba buat ulang label pengiriman Biteship untuk order ${order.orderNumber}?`)) {
      return;
    }

    setProcessingId(order.id);
    setActionType("retry");
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
      setProcessingId(null);
      setActionType(null);
    }
  }

  async function handleSyncShipping(order: OrderType) {
    setProcessingId(order.id);
    setActionType("sync");
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/sync-shipping`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal sinkronisasi status dari Biteship");
      }

      setActionMessage({
        type: "success",
        text: `✅ ${data.message}`,
      });
      router.refresh();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: `❌ Gagal sinkronisasi: ${err instanceof Error ? err.message : "Terjadi kesalahan"}`,
      });
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  }

  async function handleSyncAllOrders() {
    const ordersWithBiteship = initialOrders.filter((o) => !!o.biteshipOrderId);
    if (ordersWithBiteship.length === 0) {
      alert("Belum ada pesanan yang memiliki ID Biteship untuk disinkronkan.");
      return;
    }

    setIsSyncingAll(true);
    setActionMessage(null);

    let successCount = 0;
    for (const order of ordersWithBiteship) {
      try {
        const res = await fetch(`/api/admin/orders/${order.id}/sync-shipping`, {
          method: "POST",
        });
        if (res.ok) successCount++;
      } catch {
        // continue with next
      }
    }

    setIsSyncingAll(false);
    setActionMessage({
      type: "success",
      text: `✅ Berhasil menyinkronkan ${successCount} dari ${ordersWithBiteship.length} pesanan dengan data terkini Biteship.`,
    });
    router.refresh();
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedResi(text);
    setTimeout(() => setCopiedResi(null), 2000);
  }

  // Filter orders
  const filteredOrders = initialOrders.filter((order) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "in_production") {
      return (
        order.paymentStatus === "paid" &&
        (order.orderStatus === "in_production" || order.shippingOrderStatus === "WAITING_PRODUCTION") &&
        !order.biteshipOrderId
      );
    }
    if (activeFilter === "ready_to_ship") {
      return (
        order.orderStatus === "ready_to_ship" ||
        (order.biteshipStatus && ["allocated", "confirmed", "scheduled", "picking_up"].includes(order.biteshipStatus.toLowerCase()))
      );
    }
    if (activeFilter === "shipping") {
      return (
        order.orderStatus === "shipped" ||
        (order.biteshipStatus && ["picked", "dropping_off", "in_transit", "delivered_to_courier"].includes(order.biteshipStatus.toLowerCase()))
      );
    }
    if (activeFilter === "delivered") {
      return order.orderStatus === "delivered" || order.biteshipStatus?.toLowerCase() === "delivered";
    }
    if (activeFilter === "cancelled") {
      return (
        order.orderStatus === "cancelled" ||
        order.biteshipStatus?.toLowerCase() === "cancelled" ||
        order.biteshipStatus?.toLowerCase() === "returned"
      );
    }
    if (activeFilter === "failed") {
      return (
        order.shippingOrderStatus === "FAILED" ||
        (order.paymentStatus === "paid" && !order.biteshipOrderId && order.shippingOrderError)
      );
    }
    return true;
  });

  const countInProduction = initialOrders.filter(
    (o) =>
      o.paymentStatus === "paid" &&
      (o.orderStatus === "in_production" || o.shippingOrderStatus === "WAITING_PRODUCTION") &&
      !o.biteshipOrderId
  ).length;

  const countFailed = initialOrders.filter(
    (o) =>
      o.paymentStatus === "paid" &&
      (o.shippingOrderStatus === "FAILED" || (!o.biteshipOrderId && o.shippingOrderError))
  ).length;

  const countCancelled = initialOrders.filter(
    (o) =>
      o.orderStatus === "cancelled" ||
      o.biteshipStatus?.toLowerCase() === "cancelled" ||
      o.biteshipStatus?.toLowerCase() === "returned"
  ).length;

  if (initialOrders.length === 0) {
    return (
      <div className="py-16 text-center text-xs text-[#8c8680]">
        Belum ada pesanan masuk di sistem.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action Notification Alert */}
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

      {/* Filter Tabs & Sync All Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 pt-4 border-b border-[#242320] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeFilter === "all"
                ? "bg-white text-black font-semibold"
                : "text-[#8c8680] hover:text-[#f4f2ee] hover:bg-[#1f1e1c]"
            }`}
          >
            Semua ({initialOrders.length})
          </button>

          <button
            onClick={() => setActiveFilter("in_production")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeFilter === "in_production"
                ? "bg-purple-600 text-white font-semibold"
                : "text-purple-300/80 hover:text-purple-200 hover:bg-purple-950/30"
            }`}
          >
            <Sparkles size={12} />
            Dalam Produksi ({countInProduction})
          </button>

          <button
            onClick={() => setActiveFilter("ready_to_ship")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeFilter === "ready_to_ship"
                ? "bg-amber-500 text-black font-semibold"
                : "text-[#8c8680] hover:text-[#f4f2ee] hover:bg-[#1f1e1c]"
            }`}
          >
            Siap Kirim
          </button>

          <button
            onClick={() => setActiveFilter("shipping")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeFilter === "shipping"
                ? "bg-sky-600 text-white font-semibold"
                : "text-[#8c8680] hover:text-[#f4f2ee] hover:bg-[#1f1e1c]"
            }`}
          >
            Dalam Perjalanan
          </button>

          <button
            onClick={() => setActiveFilter("delivered")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeFilter === "delivered"
                ? "bg-emerald-600 text-white font-semibold"
                : "text-[#8c8680] hover:text-[#f4f2ee] hover:bg-[#1f1e1c]"
            }`}
          >
            Selesai / Terkirim
          </button>

          {countCancelled > 0 && (
            <button
              onClick={() => setActiveFilter("cancelled")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeFilter === "cancelled"
                  ? "bg-rose-600 text-white font-semibold"
                  : "text-rose-300 hover:bg-rose-950/30"
              }`}
            >
              <XCircle size={12} />
              Dibatalkan ({countCancelled})
            </button>
          )}

          {countFailed > 0 && (
            <button
              onClick={() => setActiveFilter("failed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeFilter === "failed"
                  ? "bg-rose-600 text-white font-semibold"
                  : "text-rose-300 hover:bg-rose-950/30"
              }`}
            >
              <AlertCircle size={12} />
              Gagal Biteship ({countFailed})
            </button>
          )}
        </div>

        {/* Sync All Button */}
        <button
          onClick={handleSyncAllOrders}
          disabled={isSyncingAll}
          title="Tarik status pengiriman real-time dari API Biteship untuk semua pesanan"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1e1d1a] hover:bg-[#2c2a26] text-[#dedad3] border border-[#33312c] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={12} className={isSyncingAll ? "animate-spin text-amber-400" : ""} />
          <span>{isSyncingAll ? "Menyinkronkan..." : "Sinkronkan Semua ke Biteship"}</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#181715] border-b border-[#242320] text-[#8c8680] uppercase tracking-wider font-semibold text-[11px]">
              <th className="py-3.5 px-4">No. Pesanan</th>
              <th className="py-3.5 px-4">Waktu Pesan</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Item & Ukuran</th>
              <th className="py-3.5 px-4">Total</th>
              <th className="py-3.5 px-4">Kurir</th>
              <th className="py-3.5 px-4">Pembayaran</th>
              <th className="py-3.5 px-4">Status Pengiriman (Biteship)</th>
              <th className="py-3.5 px-4">No. Resi</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#201f1c]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-xs text-[#8c8680]">
                  Tidak ada pesanan yang sesuai dengan filter ini.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isPaid = order.paymentStatus === "paid";
                const isFailed =
                  order.shippingOrderStatus === "FAILED" ||
                  (isPaid && !order.biteshipOrderId && order.shippingOrderError);
                const isWaitingProduction =
                  isPaid &&
                  (order.orderStatus === "in_production" ||
                    order.shippingOrderStatus === "WAITING_PRODUCTION") &&
                  !order.biteshipOrderId;
                const isProcessing = processingId === order.id;

                const rawBStatus = (order.biteshipStatus || "").toLowerCase().trim();

                return (
                  <tr key={order.id} className="hover:bg-[#1a1917]/60 transition-colors">
                    {/* No. Pesanan */}
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-semibold text-[#f4f2ee]">{order.orderNumber}</p>
                      {order.isPreOrder && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9.5px] uppercase font-bold tracking-wider rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          Pre-Order
                        </span>
                      )}
                    </td>

                    {/* Waktu Pesan */}
                    <td className="py-3.5 px-4 text-[11px] text-[#9c968f] whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#f4f2ee]">{order.customerName}</p>
                      <p className="text-[11px] text-[#8c8680] mt-0.5">{order.phone}</p>
                      <p className="text-[10px] text-[#78736d] truncate max-w-[180px]">
                        {[order.city, order.province].filter(Boolean).join(", ")}
                      </p>
                    </td>

                    {/* Items */}
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

                    {/* Total */}
                    <td className="py-3.5 px-4 font-semibold text-[#f4f2ee] whitespace-nowrap">
                      {formatRupiah(order.total)}
                    </td>

                    {/* Kurir */}
                    <td className="py-3.5 px-4 text-[#dedad3] font-medium uppercase text-[11px] whitespace-nowrap">
                      {order.courier}
                    </td>

                    {/* Pembayaran */}
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

                    {/* Status Pengiriman (Biteship Dynamic Life-Cycle + Sync Button) */}
                    <td className="py-3.5 px-4 min-w-[220px]">
                      <div className="space-y-1.5">
                        {!isPaid ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-[#8c8680] bg-[#181715] border border-[#262422] rounded-lg">
                            <Clock size={12} strokeWidth={2} />
                            Menunggu Pembayaran
                          </span>
                        ) : isWaitingProduction ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-lg">
                              <Sparkles size={12} className="animate-pulse" />
                              Dalam Produksi (PO)
                            </span>
                            <p className="text-[10px] text-[#9c968f]">
                              Menunggu tanda siap kirim
                            </p>
                          </div>
                        ) : isFailed ? (
                          <div className="space-y-1 max-w-[220px]">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-lg">
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
                        ) : rawBStatus === "cancelled" || rawBStatus === "returned" || rawBStatus === "rejected" ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-lg">
                              <XCircle size={12} className="text-rose-400" />
                              Dibatalkan di Biteship
                            </span>
                            <p className="text-[10px] text-[#8c8680]">
                              Pengiriman dibatalkan / retur
                            </p>
                          </div>
                        ) : rawBStatus === "allocated" || rawBStatus === "confirmed" || rawBStatus === "scheduled" ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg">
                              <Clock size={12} />
                              Kurir Ditugaskan
                            </span>
                            <p className="text-[10px] text-[#8c8680]">Menunggu kurir pickup</p>
                          </div>
                        ) : rawBStatus === "picking_up" ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-amber-500/15 text-amber-200 border border-amber-500/30 rounded-lg">
                              <Truck size={12} className="animate-pulse" />
                              Kurir Menuju Lokasi
                            </span>
                            <p className="text-[10px] text-[#8c8680]">Proses penjemputan paket</p>
                          </div>
                        ) : rawBStatus === "picked" ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-lg">
                              <PackageCheck size={12} />
                              Paket Diambil Kurir
                            </span>
                            <p className="text-[10px] text-[#8c8680]">Telah diserahkan ke kurir</p>
                          </div>
                        ) : rawBStatus === "dropping_off" || rawBStatus === "in_transit" || rawBStatus === "delivered_to_courier" ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/30 rounded-lg">
                              <Truck size={12} />
                              Dalam Perjalanan
                            </span>
                            <p className="text-[10px] text-[#8c8680]">Menuju alamat tujuan</p>
                          </div>
                        ) : rawBStatus === "delivered" ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg">
                              <CheckCircle2 size={12} />
                              Paket Telah Diterima
                            </span>
                            <p className="text-[10px] text-[#8c8680]">Pengiriman selesai</p>
                          </div>
                        ) : order.biteshipOrderId ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                              <CheckCircle2 size={12} />
                              Siap Kirim ke Biteship
                            </span>
                            <p className="text-[10px] text-[#8c8680] font-mono truncate max-w-[140px]">
                              ID: {order.biteshipOrderId}
                            </p>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
                            <Clock size={12} strokeWidth={2} />
                            Menunggu Proses
                          </span>
                        )}

                        {/* Direct Sync Button for Order with Biteship ID */}
                        {order.biteshipOrderId && (
                          <div>
                            <button
                              onClick={() => handleSyncShipping(order)}
                              disabled={isProcessing}
                              title="Tarik status pengiriman terkini langsung dari API Biteship"
                              className="inline-flex items-center gap-1 text-[10px] font-medium text-[#9c968f] hover:text-white px-2 py-0.5 rounded bg-[#1f1e1c] hover:bg-[#2c2a26] border border-[#2e2c28] transition-all cursor-pointer disabled:opacity-50"
                            >
                              <RefreshCw
                                size={10}
                                className={isProcessing && actionType === "sync" ? "animate-spin text-amber-400" : ""}
                              />
                              <span>
                                {isProcessing && actionType === "sync" ? "Cek Status..." : "Sync Status"}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* No. Resi */}
                    <td className="py-3.5 px-4 font-mono text-xs whitespace-nowrap">
                      {order.trackingNumber ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white px-2 py-0.5 rounded bg-[#1e1d1a] border border-[#2e2c28]">
                            {order.trackingNumber}
                          </span>
                          <button
                            onClick={() => handleCopy(order.trackingNumber!)}
                            title="Salin No. Resi"
                            className="p-1 rounded text-[#8c8680] hover:text-white hover:bg-[#2a2825] transition-colors cursor-pointer"
                          >
                            {copiedResi === order.trackingNumber ? (
                              <Check size={12} className="text-emerald-400" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[#6a6660]">—</span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isWaitingProduction && (
                        <button
                          onClick={() => handleMarkReadyToShip(order)}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer shadow-sm disabled:opacity-50"
                        >
                          {isProcessing && actionType === "ready" ? (
                            <RefreshCw size={12} className="animate-spin" />
                          ) : (
                            <Send size={12} />
                          )}
                          <span>
                            {isProcessing && actionType === "ready"
                              ? "Memanggil Biteship..."
                              : "Tandai Siap Kirim"}
                          </span>
                        </button>
                      )}

                      {(isFailed || rawBStatus === "cancelled" || rawBStatus === "returned") && (
                        <button
                          onClick={() => handleRetryShipping(order)}
                          disabled={isProcessing}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-white transition-all cursor-pointer shadow-sm disabled:opacity-50 ${
                            rawBStatus === "cancelled"
                              ? "bg-amber-600 hover:bg-amber-500"
                              : "bg-rose-600 hover:bg-rose-500"
                          }`}
                        >
                          <RefreshCw
                            size={12}
                            className={isProcessing && actionType === "retry" ? "animate-spin" : ""}
                          />
                          <span>
                            {isProcessing && actionType === "retry"
                              ? "Mencoba Ulang..."
                              : rawBStatus === "cancelled"
                              ? "Kirim Ulang"
                              : "Retry Shipping"}
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
