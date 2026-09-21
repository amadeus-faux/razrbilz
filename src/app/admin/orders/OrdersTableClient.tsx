"use client";

import { useState, Fragment } from "react";
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
  RotateCcw,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ManualShippingCard from "./ManualShippingCard";

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
  email?: string | null;
  phone: string;
  shippingAddress: string;
  apartment?: string | null;
  district: string | null;
  city: string;
  province: string | null;
  stateProvince?: string | null;
  postalCode: string;
  country?: string;
  courier: string;
  total: number;
  priceRegion?: string;
  exchangeRate?: number | null;
  paymentStatus: string;
  orderStatus: string;
  isPreOrder?: boolean | null;
  biteshipStatus?: string | null;
  shippingOrderStatus?: string | null;
  shippingOrderError?: string | null;
  shippingRetryCount?: number;
  biteshipOrderId?: string | null;
  trackingNumber?: string | null;
  manualCourier?: string | null;
  manualService?: string | null;
  manualShippedAt?: any;
  manualTrackingNote?: string | null;
  createdAt: any;
  items: OrderItemType[];
}

export default function OrdersTableClient({ initialOrders }: { initialOrders: OrderType[] }) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"ready" | "retry" | "sync" | "return" | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedResi, setCopiedResi] = useState<string | null>(null);
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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

  async function handleMarkReturned(order: OrderType) {
    if (
      !confirm(
        `Tandai order ${order.orderNumber} sebagai RETUR?\n\nIni menandakan barang dikembalikan ke merchant. Tindakan ini tidak bisa dibatalkan.`
      )
    ) {
      return;
    }

    setProcessingId(order.id);
    setActionType("return");
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: "returned" }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengubah status ke retur");
      }

      setActionMessage({
        type: "success",
        text: `✅ Order ${order.orderNumber} berhasil ditandai sebagai Retur.`,
      });
      router.refresh();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: `❌ Gagal: ${err instanceof Error ? err.message : "Terjadi kesalahan"}`,
      });
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  }

  async function handleMarkDeliveredManual(order: OrderType) {
    if (
      !confirm(
        `Tandai pesanan internasional ${order.orderNumber} sebagai SELESAI (DELIVERED)?\n\nPesanan akan dihitung sebagai pesanan sukses selesai pada dashboard.`
      )
    ) {
      return;
    }

    setProcessingId(order.id);
    setActionType("sync");
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: "delivered" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menandai pesanan selesai");
      }

      setActionMessage({
        type: "success",
        text: `✅ Pesanan ${order.orderNumber} telah ditandai Selesai (Delivered).`,
      });
      router.refresh();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: `❌ Gagal: ${err instanceof Error ? err.message : "Terjadi kesalahan"}`,
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

  // Helper: resolve country name from code
  const COUNTRY_NAMES: Record<string, string> = {
    ID: "Indonesia", US: "United States", GB: "United Kingdom", AU: "Australia",
    CA: "Canada", SG: "Singapore", MY: "Malaysia", JP: "Japan", KR: "South Korea",
    DE: "Germany", FR: "France", NL: "Netherlands", IT: "Italy", ES: "Spain",
    NZ: "New Zealand", PH: "Philippines", TH: "Thailand", VN: "Vietnam",
  };
  function getCountryName(code?: string | null) {
    if (!code) return "Indonesia";
    return COUNTRY_NAMES[code.toUpperCase()] || code;
  }

  // Build copy-ready address string
  function buildCopyAddress(order: OrderType): string {
    const isID = !order.country || order.country.toUpperCase() === "ID";
    const countryName = getCountryName(order.country);
    if (isID) {
      const parts: string[] = [
        order.customerName,
        order.phone,
        [order.shippingAddress, order.apartment].filter(Boolean).join(", "),
        order.district ? `Kec. ${order.district}` : "",
        order.city,
        [order.province, order.postalCode].filter(Boolean).join(" "),
        "Indonesia",
      ].filter(Boolean);
      return parts.join("\n");
    } else {
      const parts: string[] = [
        order.customerName,
        order.phone,
        [order.shippingAddress, order.apartment].filter(Boolean).join(", "),
        [order.city, order.stateProvince, order.postalCode].filter(Boolean).join(", "),
        countryName,
      ].filter(Boolean);
      return parts.join("\n");
    }
  }

  function handleCopyAddress(order: OrderType) {
    const text = buildCopyAddress(order);
    navigator.clipboard.writeText(text);
    setCopiedAddr(order.id);
    setTimeout(() => setCopiedAddr(null), 2500);
  }

  function toggleExpand(orderId: string) {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
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
        order.biteshipStatus?.toLowerCase() === "cancelled"
      );
    }
    if (activeFilter === "returned") {
      return (
        order.orderStatus === "returned" ||
        order.biteshipStatus?.toLowerCase() === "returned"
      );
    }
    if (activeFilter === "needs_manual_resi") {
      return (
        order.country &&
        order.country.toUpperCase() !== "ID" &&
        order.paymentStatus === "paid" &&
        !order.trackingNumber
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

  const countNeedsManualResi = initialOrders.filter(
    (o) =>
      o.country &&
      o.country.toUpperCase() !== "ID" &&
      o.paymentStatus === "paid" &&
      !o.trackingNumber
  ).length;

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
      o.biteshipStatus?.toLowerCase() === "cancelled"
  ).length;

  const countReturned = initialOrders.filter(
    (o) =>
      o.orderStatus === "returned" ||
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

          {countNeedsManualResi > 0 && (
            <button
              onClick={() => setActiveFilter("needs_manual_resi")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFilter === "needs_manual_resi"
                  ? "bg-amber-500 text-black font-semibold shadow-sm"
                  : "bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Perlu Input Resi ({countNeedsManualResi})
            </button>
          )}

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

          {countReturned > 0 && (
            <button
              onClick={() => setActiveFilter("returned")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeFilter === "returned"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold"
                  : "text-rose-300/80 hover:bg-rose-950/30"
              }`}
            >
              <RotateCcw size={12} />
              Retur ({countReturned})
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
                const isIntl = order.country && order.country.toUpperCase() !== "ID";
                const isIntlNeedsResi = isIntl && isPaid && !order.trackingNumber;

                return (
                  <Fragment key={order.id}>
                  <tr className="hover:bg-[#1a1917]/60 transition-colors">
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
                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="text-left group cursor-pointer"
                        title="Klik untuk lihat detail alamat"
                      >
                        <p className="font-semibold text-[#f4f2ee] group-hover:text-white transition-colors flex items-center gap-1">
                          {order.customerName}
                          <ChevronDown
                            size={12}
                            className={`text-[#8c8680] transition-transform duration-200 ${
                              expandedOrderId === order.id ? "rotate-180" : ""
                            }`}
                          />
                        </p>
                        <p className="text-[11px] text-[#8c8680] mt-0.5">{order.phone}</p>
                        <p className="text-[10px] text-[#78736d] truncate max-w-[180px]">
                          {order.country && order.country !== "ID"
                            ? [order.city, order.country].filter(Boolean).join(" · ")
                            : [order.city, order.province].filter(Boolean).join(", ")}
                        </p>
                      </button>
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
                        ) : isIntl ? (
                          <div className="space-y-1">
                            {order.orderStatus === "delivered" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg">
                                <CheckCircle2 size={12} />
                                Selesai (Delivered)
                              </span>
                            ) : order.orderStatus === "shipped" || order.trackingNumber ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/30 rounded-lg">
                                <Truck size={12} />
                                Dikirim ({order.manualCourier || "POS Indonesia"})
                              </span>
                            ) : isIntlNeedsResi ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-lg animate-pulse">
                                <AlertCircle size={12} />
                                Perlu diinput resi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
                                <Clock size={12} strokeWidth={2} />
                                Menunggu Proses
                              </span>
                            )}
                            <p className="text-[10px] text-[#8c8680]">
                              {order.manualService || "Pengiriman Luar Negeri"}
                            </p>
                          </div>
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
                        ) : order.orderStatus === "returned" ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-lg">
                              <RotateCcw size={12} className="text-rose-400" />
                              Pesanan Diretur
                            </span>
                            <p className="text-[10px] text-[#8c8680]">
                              Barang diretur ke merchant
                            </p>
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
                      ) : isIntlNeedsResi ? (
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-semibold hover:bg-amber-500/25 transition-colors cursor-pointer"
                          title="Klik untuk buka form input resi"
                        >
                          <AlertCircle size={10} />
                          <span>Input Resi</span>
                        </button>
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
                      {/* Tombol Tandai Selesai Manual (Internasional) */}
                      {isIntl && isPaid && order.orderStatus === "shipped" && (
                        <button
                          onClick={() => handleMarkDeliveredManual(order)}
                          disabled={isProcessing}
                          title="Tandai pesanan internasional ini telah sampai di tujuan"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white transition-all cursor-pointer shadow-sm disabled:opacity-50 ml-1.5"
                        >
                          <PackageCheck size={12} />
                          <span>Tandai Selesai</span>
                        </button>
                      )}

                      {/* Tombol Retur & status retur */}
                      {order.orderStatus === "returned" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <RotateCcw size={11} />
                          Diretur
                        </span>
                      ) : (
                        isPaid &&
                        order.orderStatus !== "cancelled" && (
                          <button
                            onClick={() => handleMarkReturned(order)}
                            disabled={isProcessing}
                            title="Tandai pesanan ini diretur oleh pelanggan"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-600/30 border border-rose-500/30 transition-all cursor-pointer disabled:opacity-50 ml-2"
                          >
                            {isProcessing && actionType === "return" ? (
                              <RefreshCw size={12} className="animate-spin" />
                            ) : (
                              <RotateCcw size={12} />
                            )}
                            <span>
                              {isProcessing && actionType === "return"
                                ? "Memproses..."
                                : "Retur"}
                            </span>
                          </button>
                        )
                      )}
                    </td>
                  </tr>

                  {/* ── Expandable Detail Row ─────────────────────────────── */}
                  {expandedOrderId === order.id && (
                    <tr key={`${order.id}-detail`} className="bg-[#111110]">
                      <td colSpan={10} className="px-6 py-5">
                        {(() => {
                          const isID = !order.country || order.country.toUpperCase() === "ID";
                          const countryName = getCountryName(order.country);
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                              {/* Kontak */}
                              <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-widest text-[#6a6660] font-semibold pb-1 border-b border-[#242320]">Informasi Customer</p>
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <span className="text-[#6a6660] mt-0.5 shrink-0"><Globe size={12} /></span>
                                    <div>
                                      <p className="text-[10px] text-[#6a6660] uppercase tracking-wider">Nama Lengkap</p>
                                      <p className="text-xs text-[#f4f2ee] font-medium mt-0.5">{order.customerName}</p>
                                    </div>
                                  </div>
                                  {order.email && (
                                    <div className="flex items-start gap-2">
                                      <span className="text-[#6a6660] mt-0.5 shrink-0"><Mail size={12} /></span>
                                      <div>
                                        <p className="text-[10px] text-[#6a6660] uppercase tracking-wider">Email</p>
                                        <a
                                          href={`mailto:${order.email}`}
                                          className="text-xs text-sky-400 hover:text-sky-300 transition-colors mt-0.5 block"
                                        >
                                          {order.email}
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex items-start gap-2">
                                    <span className="text-[#6a6660] mt-0.5 shrink-0"><Phone size={12} /></span>
                                    <div>
                                      <p className="text-[10px] text-[#6a6660] uppercase tracking-wider">Telepon</p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <a
                                          href={`tel:${order.phone}`}
                                          className="text-xs text-[#f4f2ee] hover:text-white transition-colors"
                                        >
                                          {order.phone}
                                        </a>
                                        <a
                                          href={`https://wa.me/${order.phone.replace(/[^0-9]/g, "").replace(/^0/, "62")}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors border border-emerald-500/25"
                                        >
                                          WA
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Alamat Pengiriman */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between pb-1 border-b border-[#242320]">
                                  <p className="text-[10px] uppercase tracking-widest text-[#6a6660] font-semibold">Alamat Pengiriman</p>
                                  <button
                                    onClick={() => handleCopyAddress(order)}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all cursor-pointer bg-[#1e1d1a] hover:bg-[#2a2826] border-[#33312c] text-[#dedad3] hover:text-white"
                                    title="Salin alamat dalam format siap tempel"
                                  >
                                    {copiedAddr === order.id ? (
                                      <><Check size={11} className="text-emerald-400" /><span className="text-emerald-400">Tersalin!</span></>
                                    ) : (
                                      <><Copy size={11} /><span>Salin Alamat</span></>
                                    )}
                                  </button>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-[#6a6660] mt-0.5 shrink-0"><MapPin size={12} /></span>
                                  <div className="space-y-1">
                                    <p className="text-xs text-[#f4f2ee]">
                                      {order.shippingAddress}
                                      {order.apartment && (
                                        <span className="text-[#9c968f]">, {order.apartment}</span>
                                      )}
                                    </p>
                                    {isID ? (
                                      <>
                                        {order.district && <p className="text-[11px] text-[#9c968f]">Kec. {order.district}</p>}
                                        <p className="text-[11px] text-[#9c968f]">{order.city}</p>
                                        {order.province && <p className="text-[11px] text-[#9c968f]">{order.province}</p>}
                                        <p className="text-[11px] text-[#9c968f]">
                                          {order.postalCode && <span>Kode Pos: {order.postalCode} · </span>}
                                          <span className="font-medium">Indonesia</span>
                                        </p>
                                      </>
                                    ) : (
                                      <>
                                        <p className="text-[11px] text-[#9c968f]">{order.city}</p>
                                        {order.stateProvince && <p className="text-[11px] text-[#9c968f]">{order.stateProvince}</p>}
                                        <p className="text-[11px] text-[#9c968f]">
                                          {order.postalCode && <span>{order.postalCode} · </span>}
                                          <span className="font-medium">{countryName}</span>
                                          {order.country && (
                                            <span className="ml-1 px-1 py-0.5 bg-amber-500/10 text-amber-400 text-[9px] rounded border border-amber-500/20 uppercase font-bold">{order.country}</span>
                                          )}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Pengiriman Manual POS Indonesia (Internasional Paid) */}
                              {isIntl && isPaid && (
                                <div className="col-span-1 md:col-span-2 pt-2">
                                  <ManualShippingCard
                                    order={order}
                                    onSuccess={() => router.refresh()}
                                  />
                                </div>
                              )}

                            </div>
                          );
                        })()}
                      </td>
                    </tr>
                  )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
