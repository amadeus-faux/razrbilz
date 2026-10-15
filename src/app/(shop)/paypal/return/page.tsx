"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  resolveLocale,
  t,
  translatePayPalError,
  type Locale,
} from "@/lib/checkout-i18n";
import { readUserCountryCookie } from "@/lib/pricing";
import { useCartStore } from "@/store/cart-store";

/**
 * Bahasa harus sama seperti saat buyer meninggalkan checkout. Sumber otoritatif
 * adalah cookie `rz_locale` yang di-set /api/paypal/orders dari negara kirim;
 * fallback ke cookie geo `user_country` bila `rz_locale` belum ada.
 */
function readCheckoutLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)rz_locale=([^;]*)/);
  const value = match ? decodeURIComponent(match[1]) : "";
  if (value === "id" || value === "en") return value;
  return resolveLocale(readUserCountryCookie());
}

function ReturnHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const startedRef = useRef(false);
  const [locale] = useState<Locale>(readCheckoutLocale);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Anti double-capture: StrictMode dev menjalankan effect dua kali, dan
    // refresh tidak boleh menagih ulang. Server juga idempoten sebagai lapisan kedua.
    if (startedRef.current) return;
    startedRef.current = true;

    async function run() {
      if (!token) {
        setError(translatePayPalError("CAPTURE_FAILED", locale));
        return;
      }
      try {
        const res = await fetch(
          `/api/paypal/orders/${encodeURIComponent(token)}/capture`,
          { method: "POST" }
        );
        const data = (await res.json().catch(() => null)) as
          | { ok?: boolean; orderNumber?: string; code?: string }
          | null;

        if (res.ok && data?.ok && data?.orderNumber) {
          // Capture sukses: order sudah dibayar. Kosongkan cart di sini (bukan di
          // checkout) supaya buyer yang membatalkan di PayPal tetap punya cart utuh.
          // Jalur error tidak mengosongkan cart agar bisa dicoba lagi.
          useCartStore.getState().clearCart();
          router.replace(
            `/payment/finish?order_id=${encodeURIComponent(data.orderNumber)}`
          );
          return;
        }

        if (data?.orderNumber) {
          router.replace(
            `/payment/error?order_id=${encodeURIComponent(data.orderNumber)}`
          );
          return;
        }

        setError(translatePayPalError(data?.code, locale));
      } catch {
        setError(translatePayPalError("CAPTURE_FAILED", locale));
      }
    }

    run();
  }, [token, locale, router]);

  return (
    <div className="container-shop pt-12 pb-24 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-surface border border-border p-8 rounded-2xl text-center space-y-5">
        {error ? (
          <>
            <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={30} strokeWidth={1.8} />
            </div>
            <p className="text-sm text-foreground leading-relaxed">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full py-3.5 bg-foreground text-background text-xs tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity"
            >
              {t("returnToShop", locale)}
            </Link>
          </>
        ) : (
          <>
            <Loader2
              size={30}
              className="animate-spin mx-auto text-foreground"
              strokeWidth={1.8}
            />
            <p className="text-sm text-muted leading-relaxed">
              {t("paypalProcessing", locale)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function PayPalReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="container-shop pt-12 pb-24 min-h-[80vh] flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-foreground" />
        </div>
      }
    >
      <ReturnHandler />
    </Suspense>
  );
}
