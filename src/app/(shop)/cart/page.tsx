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
        <div className="w-full max-w-sm card p-10 text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-surface flex items-center justify-center text-muted">
            <RefreshCw size={20} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-section-heading">Your Bag Is Empty</h1>
            <p className="text-xs text-muted leading-relaxed">
              Looks like you haven&apos;t added any RAZRBILZ pieces yet.
            </p>
          </div>
          <Link href="/" className="btn-primary w-full">
            Explore Collection
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
          <div className="space-y-1.5">
            <h1 className="text-page-heading">Shopping Bag</h1>
            <p className="text-label text-muted !tracking-normal normal-case">
              {totalCount} {totalCount === 1 ? "item" : "items"} ready for checkout
            </p>
          </div>
        </div>

        {/* 2-col responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* ── LEFT: Cart items (7 cols) ──────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-3">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="card group relative flex gap-4 p-4 hover:shadow-modal transition-shadow duration-300"
                id={`cart-item-${item.productId}-${item.size}`}
              >
                {/* Remove — subtle, top-right corner */}
                <button
                  onClick={() => removeItem(item.productId, item.size)}
                  className="absolute top-3 right-3 p-1.5 text-disabled hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={13} strokeWidth={1.5} />
                </button>

                {/* Thumbnail */}
                <Link
                  href={`/product/${item.slug}`}
                  className="relative w-24 h-28 flex-shrink-0 bg-surface rounded-xl overflow-hidden"
                >
                  <Image
                    src={item.image || "/placeholder-product.svg"}
                    alt={item.name}
                    fill
                    className="object-contain p-3 group-hover:scale-[1.04] transition-transform duration-300"
                    sizes="96px"
                  />
                </Link>

                {/* Info column */}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5 pr-6">
                  {/* Name + meta */}
                  <div className="min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      className="block text-[11px] font-semibold uppercase tracking-widest text-foreground hover:opacity-60 transition-opacity truncate"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center px-2 py-0.5 bg-surface border border-border text-[9px] font-semibold tracking-widest uppercase rounded-full text-muted">
                        Size {item.size}
                      </span>
                      <span className="text-price">
                        {formatRupiah(item.price)} / pcs
                      </span>
                    </div>
                  </div>

                  {/* Qty stepper + subtotal */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                    <div className="flex items-center border border-border rounded-full bg-surface overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground hover:bg-black/5 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={11} strokeWidth={2} />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-foreground tabular-nums select-none">
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

                    <span className="text-xs font-bold text-foreground tabular-nums">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust strip — lighter footnote treatment */}
            <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-border">
              {[
                { icon: Truck, label: "Pre Order", sub: "14–21 business days" },
                { icon: ShieldCheck, label: "100% Authentic", sub: "Made with passion" },
                { icon: RefreshCw, label: "Easy Exchange", sub: "Within 3 days" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5 min-w-0">
                  <Icon size={15} className="text-disabled flex-shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-foreground tracking-wide truncate">{label}</p>
                    <p className="text-[9px] text-muted truncate">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Order summary (5 cols sticky) ──────────────────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="card overflow-hidden">
              {/* Summary header */}
              <div className="px-6 py-5 border-b border-border">
                <h2 className="text-section-heading">
                  Order Summary ({totalCount})
                </h2>
              </div>

              {/* Price breakdown */}
              <div className="px-6 py-5 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">Subtotal ({totalCount} {totalCount === 1 ? "item" : "items"})</span>
                  <span className="text-xs font-medium text-foreground tabular-nums">{formatRupiah(subtotal())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">Shipping</span>
                  <span className="text-xs text-muted italic">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">Taxes &amp; Duties</span>
                  <span className="text-xs font-medium text-foreground">Included</span>
                </div>
              </div>

              {/* Total — the hero of this card */}
              <div className="px-6 py-5 bg-surface border-y border-border flex items-baseline justify-between">
                <span className="text-label text-muted">Estimated Total</span>
                <span className="text-2xl font-bold text-foreground tabular-nums">
                  {formatRupiah(subtotal())}
                </span>
              </div>

              {/* CTA */}
              <div className="p-6 space-y-4">
                <Link href="/checkout" className="btn-primary w-full" id="btn-checkout">
                  Proceed to Checkout
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