"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import { useCartStore, type CartItem } from "@/store/cart-store";
import { useCartDrawerStore } from "@/store/cart-drawer-store";
import { formatRupiah } from "@/lib/utils";
import { resolveDisplayPrice } from "@/lib/pricing";
import { usePageTransition } from "@/context/PageTransitionContext";

const emptyItems: CartItem[] = [];

function subscribeItems(callback: () => void) {
  return useCartStore.subscribe(callback);
}
function getItemsSnapshot() {
  return useCartStore.getState().items;
}
function getServerItems() {
  return emptyItems;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

// "Sudah di client?" tanpa efek: useSyncExternalStore memberi snapshot `false`
// saat render server dan `true` setelah hydration.
function subscribeNoop() {
  return () => {};
}
function getClientSnapshot() {
  return true;
}
function getServerClientSnapshot() {
  return false;
}

export default function CartDrawer() {
  const router = useRouter();
  const { navigateWithTransition } = usePageTransition();

  const isOpen = useCartDrawerStore((state) => state.isOpen);
  const open = useCartDrawerStore((state) => state.open);
  const close = useCartDrawerStore((state) => state.close);

  const items = useSyncExternalStore(
    subscribeItems,
    getItemsSnapshot,
    getServerItems
  );
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  // Portal butuh document.body, jadi tidak ada yang dirender di server maupun
  // pada render hydration pertama — sekaligus menghindari mismatch untuk isi
  // cart yang berasal dari localStorage.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerClientSnapshot
  );

  const [country, setCountry] = useState("ID");
  const [exchangeRate, setExchangeRate] = useState(17_500);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const pricingFetchedRef = useRef(false);

  // Buka drawer dari URL /?cart=1 (dipakai redirect /cart), lalu buang
  // parameternya. Harus lewat router, bukan `history.replaceState` langsung:
  // cara itu tidak bertahan (URL tetap `/?cart=1` di Chromium, WebKit, dan
  // Firefox) karena App Router menulis ulang history state setelah navigasi.
  useEffect(() => {
    if (!mounted) return;
    if (new URL(window.location.href).searchParams.get("cart") !== "1") return;
    open();
    router.replace("/", { scroll: false });
  }, [mounted, open, router]);

  // Harga wilayah + kurs diambil sekali, saat drawer pertama kali dibuka — bukan
  // di setiap page load.
  useEffect(() => {
    if (!isOpen || pricingFetchedRef.current) return;
    pricingFetchedRef.current = true;

    const controller = new AbortController();
    fetch("/api/pricing", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.region) setCountry(data.region);
        if (data.usdToIdr) setExchangeRate(data.usdToIdr);
      })
      .catch((err) => {
        if ((err as Error)?.name !== "AbortError") {
          console.error("Error fetching cart pricing:", err);
        }
      });

    return () => controller.abort();
  }, [isOpen]);

  // Fokus pindah ke tombol tutup saat terbuka, lalu dikembalikan ke elemen
  // pemicunya saat tertutup.
  useEffect(() => {
    if (!isOpen) return;

    // WebKit/Safari tidak memindahkan fokus ke <button> yang diklik, jadi
    // activeElement bisa masih <body>. Fallback-nya: elemen yang mengaku sebagai
    // pemicu drawer lewat aria-controls.
    const active = document.activeElement;
    lastFocusedRef.current =
      active instanceof HTMLElement && active !== document.body
        ? active
        : document.querySelector<HTMLElement>('[aria-controls="cart-drawer"]');

    closeButtonRef.current?.focus();

    return () => {
      const node = lastFocusedRef.current;
      if (node && document.contains(node)) node.focus();
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      // getClientRects(), bukan offsetParent: offsetParent selalu null untuk
      // elemen ber-position fixed, dan panel drawer ini fixed. `tabIndex >= 0`
      // membuang link thumbnail yang memang sengaja tabindex="-1".
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((node) => node.tabIndex >= 0 && node.getClientRects().length > 0);
      if (focusable.length === 0) return;

      // Siklus dikelola sendiri, bukan "cegat di elemen pertama/terakhir":
      // WebKit/Safari tidak men-Tab elemen <a> (hanya kontrol form), jadi
      // membandingkan activeElement dengan elemen terakhir tidak pernah cocok
      // dan fokus lolos keluar drawer.
      event.preventDefault();
      const active = document.activeElement as HTMLElement | null;
      const index = active ? focusable.indexOf(active) : -1;

      if (event.shiftKey) {
        focusable[index <= 0 ? focusable.length - 1 : index - 1].focus();
      } else {
        focusable[index >= focusable.length - 1 ? 0 : index + 1].focus();
      }
    },
    [close]
  );

  const go = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // Klik dengan modifier dibiarkan jadi perilaku browser normal (tab baru).
      if (
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      event.preventDefault();
      close();
      navigateWithTransition(href);
    },
    [close, navigateWithTransition]
  );

  const unitPrice = useCallback(
    (item: CartItem) =>
      resolveDisplayPrice(item.basePrice, country, exchangeRate),
    [country, exchangeRate]
  );

  if (!mounted) return null;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + unitPrice(item) * item.quantity,
    0
  );

  return createPortal(
    <div className="cart-drawer-root" data-open={isOpen ? "true" : "false"}>
      {/* Scrim. `data-lenis-prevent` membuat Lenis mengabaikan wheel/touch di
          atasnya, jadi halaman di belakang tidak ikut tergulir — tanpa mengunci
          overflow body, yang akan berebut dengan Lenis. */}
      <div
        className="cart-drawer-scrim"
        data-lenis-prevent
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className="cart-drawer-panel"
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        data-lenis-prevent
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <h2 className="text-section-heading text-foreground">
            CART
            {totalCount > 0 && (
              <span className="ml-2 text-muted">
                ({totalCount} {totalCount === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="p-1.5 -mr-1.5 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
            aria-label="Close cart"
            id="cart-drawer-close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-muted">
              <ShoppingBag size={18} strokeWidth={1.5} />
            </div>
            <div className="space-y-1.5">
              <p className="text-label text-foreground">YOUR BAG IS EMPTY</p>
              <p className="text-[11px] text-muted leading-relaxed">
                Add a piece and it will show up here.
              </p>
            </div>
            <Link href="/" onClick={(event) => go(event, "/")} className="btn-primary w-full">
              EXPLORE COLLECTION
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer-scroll">
              {items.map((item) => {
                const price = unitPrice(item);
                const atMax =
                  typeof item.stock === "number" && item.quantity >= item.stock;

                return (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex gap-3 py-4 border-b border-white/10"
                    id={`cart-drawer-item-${item.productId}-${item.size}`}
                  >
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={(event) => go(event, `/product/${item.slug}`)}
                      className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white/5"
                      aria-label={item.name}
                      tabIndex={-1}
                    >
                      <Image
                        src={item.image || "/placeholder-product.svg"}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-contain p-1.5"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={(event) => go(event, `/product/${item.slug}`)}
                        className="text-[10px] uppercase tracking-widest text-foreground hover:opacity-60 transition-opacity truncate"
                      >
                        {item.name}
                      </Link>

                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-[9px] uppercase tracking-widest text-muted">
                          Size {item.size}
                        </span>
                        <span className="text-[9px] text-disabled">·</span>
                        <span className="text-price">{formatRupiah(price)}</span>
                      </div>

                      <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center rounded-full border border-white/10 bg-white/5 overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus size={10} strokeWidth={2} />
                          </button>
                          <span className="w-6 text-center text-[11px] text-foreground tabular-nums select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            disabled={atMax}
                            className="w-7 h-7 flex items-center justify-center text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus size={10} strokeWidth={2} />
                          </button>
                        </div>

                        <span className="text-[11px] text-foreground tabular-nums">
                          {formatRupiah(price * item.quantity)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        {atMax ? (
                          <span className="text-[9px] uppercase tracking-wider text-amber-400/90">
                            Max qty {item.stock}
                          </span>
                        ) : (
                          <span />
                        )}
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.size)}
                          className="text-[9px] uppercase tracking-widest text-muted hover:text-red-400 transition-colors"
                          aria-label={`Remove ${item.name} size ${item.size}`}
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={clearCart}
                className="mt-4 text-[9px] uppercase tracking-widest text-muted hover:text-red-400 transition-colors"
                id="cart-drawer-remove-all"
              >
                REMOVE ALL
              </button>
            </div>

            <div className="cart-drawer-footer">
              <div className="flex items-baseline justify-between">
                <span className="text-label text-muted">TOTAL</span>
                <span className="text-lg text-foreground tabular-nums">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <p className="mt-1.5 text-[9px] text-muted">
                Shipping calculated at checkout. Prices in IDR.
              </p>

              <Link
                href="/checkout"
                onClick={(event) => go(event, "/checkout")}
                className="btn-primary w-full mt-4"
                id="cart-drawer-checkout"
              >
                CHECKOUT
                <ArrowRight size={13} strokeWidth={2.5} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
