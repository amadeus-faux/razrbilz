"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useCartStore, type CartItem } from "@/store/cart-store";
import { useCartDrawerStore } from "@/store/cart-drawer-store";
import { isInternational } from "@/lib/pricing";

const SDK_ID = "paypal-js-sdk";

interface PayPalButtonsConfig {
  style: Record<string, string | number | boolean>;
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => Promise<void>;
  onCancel: () => void;
  onError: (error: unknown) => void;
}

interface PayPalButtonsInstance {
  render: (target: HTMLElement) => Promise<void>;
  close: () => void;
}

interface PayPalNamespace {
  Buttons: (config: PayPalButtonsConfig) => PayPalButtonsInstance;
}

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

let sdkPromise: Promise<void> | null = null;

function loadPayPalSdk(clientId: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("PayPal SDK membutuhkan browser."));
  }
  if (window.paypal) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SDK_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");

    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => {
        sdkPromise = null;
        reject(new Error("Gagal memuat PayPal SDK."));
      },
      { once: true }
    );

    if (!existing) {
      script.id = SDK_ID;
      script.async = true;
      script.src =
        `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}` +
        "&currency=USD&intent=capture&components=buttons&disable-funding=card,paylater,venmo";
      document.body.appendChild(script);
    }
  });

  return sdkPromise;
}

function messageForCode(code: string | undefined, phase: "create" | "capture") {
  switch (code) {
    case "RATE_CHANGED":
      return "Prices were updated. Please try again.";
    case "OUT_OF_STOCK":
      return "One of your items just sold out. Please review your cart.";
    case "EXPRESS_UNAVAILABLE":
      return "PayPal Express is not available for this order.";
    case "RATE_LIMITED":
      return "Too many attempts. Please wait a moment and try again.";
    case "ADDRESS_MISSING":
      return "PayPal did not share a shipping address. Update it in PayPal and try again.";
    case "CAPTURE_FAILED":
      return "PayPal could not complete the payment. Please try again.";
    default:
      return phase === "create"
        ? "PayPal could not start. Please try again."
        : "PayPal could not complete the payment. Please try again.";
  }
}

interface PayPalExpressCheckoutProps {
  country: string;
  exchangeRate: number;
  items: CartItem[];
}

/**
 * Tombol Express Checkout untuk pembeli internasional. Alamat kirim diambil
 * dari akun PayPal dan baru disimpan ke order pada langkah capture.
 */
export default function PayPalExpressCheckout({
  country,
  exchangeRate,
  items,
}: PayPalExpressCheckoutProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<PayPalButtonsInstance | null>(null);
  const checkoutRef = useRef({ country, exchangeRate, items });
  const friendlyErrorRef = useRef(false);

  const [clientId, setClientId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const enabled = isInternational(country) && items.length > 0;

  useEffect(() => {
    checkoutRef.current = { country, exchangeRate, items };
  }, [country, exchangeRate, items]);

  useEffect(() => {
    if (!enabled) return;

    let alive = true;
    fetch("/api/paypal/config")
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        if (data?.enabled && typeof data.clientId === "string" && data.clientId) {
          setClientId(data.clientId);
        }
      })
      .catch(() => {
        if (alive) setMessage("PayPal is temporarily unavailable.");
      });

    return () => {
      alive = false;
    };
  }, [enabled]);

  const startOrder = useCallback(async (): Promise<string> => {
    const current = checkoutRef.current;
    let res: Response;
    try {
      res = await fetch("/api/paypal/express/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: current.country,
          exchangeRateUsed: current.exchangeRate,
          items: current.items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });
    } catch {
      throw new Error(messageForCode(undefined, "create"));
    }

    const data = (await res.json().catch(() => null)) as
      | { id?: string; code?: string }
      | null;

    if (!res.ok || !data?.id) {
      const text = messageForCode(data?.code, "create");
      setMessage(text);
      friendlyErrorRef.current = true;
      throw new Error(text);
    }

    return data.id;
  }, []);

  const finishOrder = useCallback(
    async (orderID: string) => {
      let res: Response;
      try {
        res = await fetch("/api/paypal/express/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID }),
        });
      } catch {
        setMessage(messageForCode(undefined, "capture"));
        return;
      }

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; orderNumber?: string; code?: string }
        | null;

      if (!res.ok || !data?.ok || !data.orderNumber) {
        setMessage(messageForCode(data?.code, "capture"));
        return;
      }

      useCartStore.getState().clearCart();
      useCartDrawerStore.getState().close();
      router.push(`/order-confirmation/${encodeURIComponent(data.orderNumber)}`);
    },
    [router]
  );

  useEffect(() => {
    if (!clientId || !enabled) return;

    let alive = true;
    const container = containerRef.current;

    loadPayPalSdk(clientId)
      .then(() => {
        if (!alive || !container || !window.paypal) return;

        const buttons = window.paypal.Buttons({
          style: {
            layout: "vertical",
            shape: "rect",
            color: "gold",
            label: "paypal",
            height: 48,
            tagline: false,
          },
          createOrder: startOrder,
          onApprove: (data) => finishOrder(data.orderID),
          onCancel: () => setMessage("PayPal checkout cancelled."),
          onError: (error) => {
            console.error("[PayPal Express] button error:", error);
            if (friendlyErrorRef.current) {
              friendlyErrorRef.current = false;
              return;
            }
            setMessage(messageForCode(undefined, "capture"));
          },
        });

        buttonsRef.current = buttons;
        return buttons.render(container);
      })
      .catch((error) => {
        console.error("[PayPal Express] SDK error:", error);
        if (alive) setMessage("PayPal is temporarily unavailable.");
      });

    return () => {
      alive = false;
      buttonsRef.current?.close();
      buttonsRef.current = null;
      container?.replaceChildren();
    };
  }, [clientId, enabled, startOrder, finishOrder]);

  if (!enabled || !clientId) return null;

  return (
    <div className="mt-5">
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[9px] uppercase tracking-[0.18em] text-muted">
          Express Checkout
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div ref={containerRef} className="mt-3 min-h-[48px]" />

      {message && (
        <p role="status" className="mt-2 text-[10px] leading-relaxed text-red-600">
          {message}
        </p>
      )}
    </div>
  );
}
