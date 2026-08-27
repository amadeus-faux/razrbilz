"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, type CartItem as CartItemType } from "@/store/cart-store";
import { formatRupiah } from "@/lib/utils";
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useSyncExternalStore } from "react";

const emptyItems: CartItemType[] = [];

function subscribe(callback: () => void) {
  return useCartStore.subscribe(callback);
}
function getItemsSnapshot() {
  return useCartStore.getState().items;
}
function getServerSnapshot() {
  return emptyItems;
}

export default function CartPage() {
  const items = useSyncExternalStore(subscribe, getItemsSnapshot, getServerSnapshot);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.subtotal);
  const totalCount = items.reduce((acc, it) => acc + it.quantity, 0);

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="container-shop pt-20 pb-32 min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-full max-w-sm bg-white border border-border p-10 text-center rounded-2xl shadow-sm space-y-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-surface flex items-center justify-center text-muted">
            <RefreshCw size={22} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xs font-semibold tracking-widest uppercase text-foreground">
              YOUR BAG IS EMPTY
            </h1>
            <p className="text-xs text-muted leading-relaxed">
              Looks like you haven&apos;t added any RAZRBILZ pieces yet.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-foreground text-background text-[11px] font-semibold tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity"
          >
            EXPLORE COLLECTION
            <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>
      </div>
    );
  }

  // ── Filled cart ──────────────────────────────────────────────────────────────
  return (
    <div className="container-shop pt-10 pb-32 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Page header */}
        <div className="flex items-end justify-between pb-6 border-b border-border mb-10">
          <div className="space-y-1">
            <h1 className="text-page-heading">Shopping Bag</h1>
            <p className="text-[11px] text-muted tracking-wide">
              {totalCount} {totalCount === 1 ? "item" : "items"} ready for checkout
            </p>
          </div>
          <Link
            href="/"
            className="text-[10px] font-medium text-muted hover:text-foreground transition-colors uppercase tracking-[0.14em]"
          >
            Continue Shopping
          </Link>
        </div>

        {/* 2-col responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* ── LEFT: Cart items (7 cols) ──────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-3">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex gap-4 p-4 bg-white border border-border rounded-2xl hover:border-black/15 transition-colors duration-200"
                id={`cart-item-${item.productId}-${item.size}`}
              >
                {/* Thumbnail */}
                <Link
                  href={`/product/${item.slug}`}
                  className="relative w-20 h-24 flex-shrink-0 bg-surface rounded-xl overflow-hidden"
                >
                  <Image
                    src={item.image || "/placeholder-product.svg"}
                    alt={item.name}
                    fill
                    className="object-contain p-2 hover:scale-[1.04] transition-transform duration-300"
                    sizes="80px"
                  />
                </Link>

                {/* Info column */}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                  {/* Name + delete */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        className="block text-[11px] font-semibold uppercase tracking-widest text-foreground hover:opacity-60 transition-opacity truncate"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        <span className="inline-block px-2 py-0.5 bg-surface border border-border text-[9px] font-semibold tracking-widest uppercase rounded-md text-muted">
                          SIZE {item.size}
                        </span>
                        <span className="text-[10px] text-muted">
                          {formatRupiah(item.price)} / pcs
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="flex-shrink-0 p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Qty stepper + subtotal */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center border border-border rounded-lg bg-surface overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground hover:bg-black/5 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={11} strokeWidth={2} />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-foreground select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground hover:bg-black/5 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={11} strokeWidth={2} />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-foreground">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border text-center">
              {[
                { icon: Truck, label: "Fast Dispatch", sub: "1–2 business days" },
                { icon: ShieldCheck, label: "100% Authentic", sub: "Direct from studio" },
                { icon: RefreshCw, label: "Easy Exchange", sub: "Within 3 days" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="p-4 bg-surface rounded-2xl flex flex-col items-center gap-2">
                  <Icon size={14} className="text-muted" strokeWidth={1.5} />
                  <div>
                    <p className="text-[10px] font-semibold text-foreground tracking-wide">{label}</p>
                    <p className="text-[9px] text-muted mt-0.5 leading-snug">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Order summary (5 cols sticky) ──────────────────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
              {/* Summary header */}
              <div className="px-6 py-5 border-b border-border">
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">
                  ORDER SUMMARY ({totalCount})
                </h2>
              </div>

              {/* Price breakdown */}
              <div className="px-6 py-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">Subtotal ({totalCount} items)</span>
                  <span className="text-xs font-semibold text-foreground">{formatRupiah(subtotal())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">Shipping</span>
                  <span className="text-xs text-muted italic">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">Taxes &amp; Duties</span>
                  <span className="text-xs font-medium text-foreground">Included</span>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-border flex justify-between items-baseline">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                    ESTIMATED TOTAL
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {formatRupiah(subtotal())}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6 space-y-3">
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-xl hover:opacity-90 active:scale-[0.99] transition-all shadow-md"
                  id="btn-checkout"
                >
                  PROCEED TO CHECKOUT
                  <ArrowRight size={13} strokeWidth={2.5} />
                </Link>

                <div className="flex items-center justify-center gap-5 text-[9px] text-muted">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={11} strokeWidth={1.5} />
                    SSL Encrypted
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck size={11} strokeWidth={1.5} />
                    Insured Delivery
                  </span>
                </div>

                <p className="text-[9px] text-muted text-center leading-relaxed">
                  Prices in IDR. Secure checkout via Midtrans.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
