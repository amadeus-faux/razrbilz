"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore, type CartItem } from "@/store/cart-store";
import { formatRupiah } from "@/lib/utils";
import { resolveDisplayPrice, normalizeCountryCode } from "@/lib/pricing";
import {
  resolveLocale,
  t,
  tf,
  translateMessage,
  type CheckoutKey,
  type Locale,
} from "@/lib/checkout-i18n";
import { checkoutSchema, type CheckoutFormData } from "@/lib/checkout-schema";
import { COUNTRIES } from "@/lib/countries";
import { INDONESIA_PROVINCES } from "@/lib/indonesia-provinces";
import type { BiteshipCourierRate } from "@/lib/biteship";
import Link from "next/link";
import Image from "next/image";
import { PaymentModal, type PaymentModalData } from "@/components/checkout/PaymentModal";
import {
  ArrowLeft,
  Loader2,
  ChevronDown,
  ShieldCheck,
  Truck,
  CreditCard,
  AlertCircle,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";

const emptyItems: CartItem[] = [];

interface PaymentMethodOption {
  paymentMethod: string;
  paymentName: string;
  paymentImage: string;
  totalFee: string;
}

function subscribe(callback: () => void) {
  return useCartStore.subscribe(callback);
}
function getItemsSnapshot() {
  return useCartStore.getState().items;
}
function getServerSnapshot() {
  return emptyItems;
}

// ── Reusable Field Label & Error ─────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] uppercase font-medium text-muted tracking-[0.14em] mb-1.5">
      {children}
    </label>
  );
}

function FieldError({ message, locale }: { message?: string; locale: Locale }) {
  return message ? (
    <p className="text-[11px] text-red-500 mt-1">{translateMessage(message, locale)}</p>
  ) : null;
}

const inputCls =
  "w-full px-4 py-3 bg-surface border border-border rounded-xl text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground focus:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface/50 transition-all";
const selectCls =
  "w-full px-4 py-3 bg-surface border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground focus:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface/50 transition-all appearance-none pr-10 cursor-pointer";

function getMethodCategory(m: PaymentMethodOption): string {
  const code = m.paymentMethod.toUpperCase();
  const name = m.paymentName.toUpperCase();

  if (code === "VC" || name.includes("CREDIT CARD") || name.includes("KARTU KREDIT")) return "cc";
  if (name.includes("QRIS") || code === "NQ" || code === "SP" || code === "LQ" || code === "GQ") return "qris";
  if (code === "DA" || code === "OV" || code === "SA" || code === "LA" || name.includes("OVO") || name.includes("DANA") || name.includes("SHOPEEPAY") || name.includes("LINKAJA")) return "ewallet";
  if (name.includes("VA") || name.includes("VIRTUAL") || code === "BC" || code === "M2" || code === "I1" || code === "BR" || code === "BT" || code === "B1" || code === "BV" || code === "VA" || code === "A1" || code === "NC" || code === "AG" || code === "S1") return "va";
  return "other";
}

/**
 * Returns true for payment methods where the service fee is borne by the customer
 * (OVO, ShopeePay e-wallet, and Credit Card).
 */
function isCustomerBearsFee(method: PaymentMethodOption | null): boolean {
  if (!method) return false;
  const code = method.paymentMethod.toUpperCase();
  const name = method.paymentName.toUpperCase();
  return (
    code === "VC" || name.includes("CREDIT CARD") || name.includes("KARTU KREDIT") ||
    code === "OV" || name.includes("OVO") ||
    code === "SA" || name.includes("SHOPEEPAY")
  );
}

const PAYMENT_CATEGORIES: { id: string; titleKey: CheckoutKey }[] = [
  { id: "va", titleKey: "catVa" },
  { id: "ewallet", titleKey: "catEwallet" },
  { id: "qris", titleKey: "catQris" },
  { id: "cc", titleKey: "catCc" },
  { id: "other", titleKey: "catOther" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useSyncExternalStore(subscribe, getItemsSnapshot, getServerSnapshot);
  const clearCart = useCartStore((state) => state.clearCart);

  // ── Cascading location states ──────────────────────────────────────────────
  const [provinces, setProvinces] = useState<string[]>(INDONESIA_PROVINCES);
  const [cities, setCities] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [postalCodesMap, setPostalCodesMap] = useState<Record<string, string[]>>({});
  const [availablePostalCodes, setAvailablePostalCodes] = useState<string[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // ── Shipping & Order states ────────────────────────────────────────────────
  const [shippingRates, setShippingRates] = useState<BiteshipCourierRate[]>([]);
  const [shippingRatesFallback, setShippingRatesFallback] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<BiteshipCourierRate | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rateError, setRateError] = useState("");

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodOption | null>(null);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("va");
  const [modalData, setModalData] = useState<PaymentModalData | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: "ID",
      province: "",
      city: "",
      district: "",
      postalCode: "",
      newsOffers: true,
    },
  });

  const selectedCountry = watch("country");
  const selectedProvince = watch("province");
  const selectedCity = watch("city");
  const selectedDistrict = watch("district");
  const postalCode = watch("postalCode");

  const isCountrySelected = Boolean(selectedCountry);
  // Predikat region KANONIK (sama seperti resolveLocale) — menggantikan definisi
  // lokal lama yang berbeda dari pricing.isInternational.
  const isIndonesia = normalizeCountryCode(selectedCountry) === "ID";
  const isInternational = isCountrySelected && !isIndonesia;
  // Bahasa checkout mengikuti ke MANA barang dikirim.
  const locale: Locale = resolveLocale(selectedCountry);

  // Membedakan "default ID" dari pilihan aktif user, supaya kita tidak menimpa
  // cookie user_country (sinyal geo) hanya karena halaman checkout dibuka.
  const userChoseCountryRef = useRef(false);

  // Default negara awal = sinyal geo pengunjung (cookie user_country, diisi
  // middleware dari header geo), supaya checkout dibuka dalam bahasa region
  // asal pengunjung. Pilihan manual user di form tetap menang karena efek ini
  // hanya jalan sekali saat mount.
  useEffect(() => {
    const geo = normalizeCountryCode(
      document.cookie.match(/(?:^|;\s*)user_country=([^;]*)/)?.[1]
    );
    if (COUNTRIES.some((c) => c.code === geo)) {
      setValue("country", geo);
    }
  }, [setValue]);

  const [exchangeRate, setExchangeRate] = useState<number>(17500);
  // 6.2: dinaikkan untuk memaksa re-fetch kurs (mis. setelah server menolak
  // submit karena kurs berubah / RATE_CHANGED).
  const [pricingNonce, setPricingNonce] = useState(0);

  // Sync pricing when country changes.
  // - Sebelum user memilih: panggil /api/pricing TANPA param → server memakai
  //   cookie user_country / header geo, TIDAK menulis ulang cookie. (Fix
  //   self-clobber: pengunjung internasional tidak lagi kehilangan region-nya.)
  // - Setelah user memilih negara: kirim ?country= → server sinkronkan cookie ke
  //   pilihan itu (sumber kebenaran baru = alamat pengiriman).
  useEffect(() => {
    let isMounted = true;
    async function updatePricing() {
      try {
        const url = userChoseCountryRef.current
          ? `/api/pricing?country=${encodeURIComponent(normalizeCountryCode(selectedCountry))}`
          : `/api/pricing`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.usdToIdr) {
            setExchangeRate(data.usdToIdr);
          }
        }
      } catch (err) {
        console.error("Failed to fetch regional pricing:", err);
      }
    }
    updatePricing();
    return () => {
      isMounted = false;
    };
  }, [selectedCountry, pricingNonce]);

  // Perbarui <html lang> selama checkout aktif; kembalikan ke "en" saat keluar.
  useEffect(() => {
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [locale]);

  const getItemPrice = useCallback(
    (it: CartItem) => {
      return resolveDisplayPrice(it.basePrice, selectedCountry, exchangeRate);
    },
    [selectedCountry, exchangeRate]
  );

  // ── 1. Load Provinces when country is Indonesia ─────────────────────────────
  useEffect(() => {
    let isMounted = true;
    async function loadProvinces() {
      setLoadingProvinces(true);
      try {
        const res = await fetch("/api/shipping/areas?type=provinces");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.provinces && data.provinces.length > 0) {
            setProvinces(data.provinces);
          }
        }
      } catch (err) {
        console.error("Failed to load provinces:", err);
      } finally {
        if (isMounted) setLoadingProvinces(false);
      }
    }

    if (isIndonesia) {
      loadProvinces();
    }
    return () => {
      isMounted = false;
    };
  }, [isIndonesia]);

  // ── 2. Load Cities when Province changes (Indonesia) ───────────────────────
  useEffect(() => {
    let isMounted = true;
    async function loadCities() {
      if (!selectedProvince) {
        setCities([]);
        return;
      }
      setLoadingCities(true);
      try {
        const res = await fetch(
          `/api/shipping/areas?type=cities&province=${encodeURIComponent(
            selectedProvince
          )}`
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setCities(data.cities || []);
        }
      } catch (err) {
        console.error("Failed to load cities:", err);
      } finally {
        if (isMounted) setLoadingCities(false);
      }
    }

    if (isIndonesia && selectedProvince) {
      setValue("city", "");
      setValue("district", "");
      setValue("postalCode", "");
      setDistricts([]);
      setAvailablePostalCodes([]);
      setSelectedCourier(null);
      setShippingRates([]);
      loadCities();
    }
    return () => {
      isMounted = false;
    };
  }, [selectedProvince, isIndonesia, setValue]);

  // ── 3. Load Districts & Postal Codes when City changes (Indonesia) ──────────
  useEffect(() => {
    let isMounted = true;
    async function loadDistricts() {
      if (!selectedCity || !selectedProvince) {
        setDistricts([]);
        setPostalCodesMap({});
        return;
      }
      setLoadingDistricts(true);
      try {
        const res = await fetch(
          `/api/shipping/areas?type=districts&province=${encodeURIComponent(
            selectedProvince
          )}&city=${encodeURIComponent(selectedCity)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setDistricts(data.districts || []);
            setPostalCodesMap(data.postalCodes || {});
          }
        }
      } catch (err) {
        console.error("Failed to load districts:", err);
      } finally {
        if (isMounted) setLoadingDistricts(false);
      }
    }

    if (isIndonesia && selectedCity) {
      setValue("district", "");
      setValue("postalCode", "");
      setAvailablePostalCodes([]);
      setSelectedCourier(null);
      setShippingRates([]);
      loadDistricts();
    }
    return () => {
      isMounted = false;
    };
  }, [selectedCity, selectedProvince, isIndonesia, setValue]);

  // ── 4. Update available Postal Codes when District changes (Indonesia) ──────
  useEffect(() => {
    if (isIndonesia && selectedDistrict) {
      const pCodes = postalCodesMap[selectedDistrict] || [];
      setAvailablePostalCodes(pCodes);
      if (pCodes.length === 1) {
        setValue("postalCode", pCodes[0]);
      } else if (pCodes.length === 0) {
        setValue("postalCode", "");
      }
    }
  }, [selectedDistrict, postalCodesMap, isIndonesia, setValue]);

  // ── 5. Fetch shipping rates ─────────────────────────────────────────────────
  // 2.4: AbortController + token urutan. Ganti kode pos/kurir/negara berturut-turut
  // bisa membuat response lama tiba belakangan; kita batalkan request sebelumnya
  // dan abaikan response yang sudah usang agar state tidak tertimpa data basi.
  const ratesAbortRef = useRef<AbortController | null>(null);
  const ratesSeqRef = useRef(0);
  const fetchShippingRates = useCallback(
    async (countryCode: string, destPostalCode: string) => {
      ratesAbortRef.current?.abort();
      const controller = new AbortController();
      ratesAbortRef.current = controller;
      const seq = ++ratesSeqRef.current;

      setLoadingRates(true);
      setRateError("");
      try {
        const res = await fetch("/api/shipping/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            country: countryCode,
            destinationPostalCode: destPostalCode || "00000",
            // 2.5: kirim productId + quantity; berat asli diambil server dari DB.
            items: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          }),
        });
        if (!res.ok) throw new Error("Failed to fetch rates");
        const data = await res.json();
        // Abaikan response usang (request lebih baru sudah jalan).
        if (seq !== ratesSeqRef.current || controller.signal.aborted) return;
        const rates: BiteshipCourierRate[] = data.rates || [];
        setShippingRates(rates);
        setShippingRatesFallback(Boolean(data.isFallback));
        if (rates.length > 0) setSelectedCourier(rates[0]);
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        if (seq !== ratesSeqRef.current) return;
        setRateError(t("rateLoadError", locale));
        setShippingRates([]);
        setShippingRatesFallback(false);
      } finally {
        if (seq === ratesSeqRef.current && !controller.signal.aborted) {
          setLoadingRates(false);
        }
      }
    },
    [items, locale]
  );

  // Batalkan request tarif yang masih berjalan saat komponen lepas.
  useEffect(() => {
    return () => ratesAbortRef.current?.abort();
  }, []);

  // 2.3 Reset kurir & tarif SEKETIKA saat negara berubah (sebelum fetch tarif
  //     baru selesai), supaya tombol submit tidak pernah bisa diklik dengan
  //     kurir/ongkir yang tidak cocok dengan negara tujuan yang baru dipilih.
  useEffect(() => {
    setSelectedCourier(null);
    setShippingRates([]);
    setRateError("");
  }, [selectedCountry]);

  useEffect(() => {
    if (isInternational) {
      const timer = setTimeout(() => {
        fetchShippingRates(selectedCountry, "");
      }, 300);
      return () => clearTimeout(timer);
    }

    if (isIndonesia) {
      const cleanPostal = (postalCode || "").trim();
      // Indonesian postal codes are exactly 5 digits
      if (/^\d{5}$/.test(cleanPostal)) {
        const timer = setTimeout(() => {
          fetchShippingRates("ID", cleanPostal);
        }, 350);
        return () => clearTimeout(timer);
      } else {
        // Reset rates while typing incomplete postal code
        setShippingRates([]);
        setSelectedCourier(null);
        setShippingRatesFallback(false);
        setRateError("");
      }
    }
  }, [selectedCountry, postalCode, isInternational, isIndonesia, fetchShippingRates]);

  // ── 6. Load Payment Methods from Duitku ─────────────────────────────────────
  // 2.4: AbortController + token urutan agar response methods yang usang (dari
  // subtotal/kurir sebelumnya) tidak menimpa state saat user berubah cepat.
  const methodsAbortRef = useRef<AbortController | null>(null);
  const methodsSeqRef = useRef(0);
  useEffect(() => {
    methodsAbortRef.current?.abort();
    const controller = new AbortController();
    methodsAbortRef.current = controller;
    const seq = ++methodsSeqRef.current;

    async function loadPaymentMethods() {
      setLoadingMethods(true);
      try {
        const currentSubtotal = items.reduce(
          (sum, it) => sum + getItemPrice(it) * it.quantity,
          0
        );
        const amount = currentSubtotal + (selectedCourier?.price || 0);
        const res = await fetch(`/api/payments/duitku/methods?amount=${amount}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          if (seq !== methodsSeqRef.current || controller.signal.aborted) return;
          if (data.methods && data.methods.length > 0) {
            setPaymentMethods(data.methods);
            setSelectedPaymentMethod((prev) => {
              if (prev) {
                const found = data.methods.find((m: PaymentMethodOption) => m.paymentMethod === prev.paymentMethod);
                if (found) return found;
              }
              return (
                data.methods.find((m: PaymentMethodOption) => m.paymentMethod === "BC") ||
                data.methods.find((m: PaymentMethodOption) => m.paymentMethod === "VA") ||
                data.methods[0]
              );
            });
          }
        }
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        console.error("Failed to load payment methods:", err);
      } finally {
        if (seq === methodsSeqRef.current && !controller.signal.aborted) {
          setLoadingMethods(false);
        }
      }
    }

    loadPaymentMethods();
    return () => {
      controller.abort();
    };
  }, [items, getItemPrice, selectedCourier]);

  // ── Submit Checkout ────────────────────────────────────────────────────────
  async function onSubmit(data: CheckoutFormData) {
    if (!selectedCourier) {
      alert(t("selectShippingFirst", locale));
      return;
    }
    setSubmitting(true);
    const fullName = `${data.firstName} ${data.lastName || ""}`.trim();

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          customerName: fullName,
          address: data.address,
          apartment: data.apartment || null,
          stateProvince: isInternational ? (data.province || null) : null,
          province: isIndonesia ? data.province : "",
          courier: `${selectedCourier.courier_name} - ${selectedCourier.courier_service_name}`,
          courierCode: selectedCourier.courier_code,
          courierServiceCode: selectedCourier.courier_service_code,
          paymentMethod: selectedPaymentMethod?.paymentMethod || "VA",
          // 6.2: kurs yang dipakai client menampilkan harga, divalidasi server.
          exchangeRateUsed: exchangeRate,
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
            priceAtBuy: getItemPrice(item),
          })),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        // 6.2: kurs berubah saat user berada di halaman checkout. Segarkan kurs
        // (dan harga) otomatis, lalu minta user meninjau ulang sebelum submit.
        if (errData?.code === "RATE_CHANGED") {
          setPricingNonce((n) => n + 1);
        }
        throw new Error(
          translateMessage(
            errData.errorKey || errData.error || "checkoutFailed",
            locale,
            errData.errorParams ?? undefined
          )
        );
      }

      const result = await res.json();
      // Hanya kosongkan cart kalau pesanan benar-benar tersimpan di server
      // (orderNumber ada). Kalau respons sukses tapi tanpa orderNumber, biarkan
      // cart utuh supaya user tidak kehilangan item tanpa pesanan yang tercatat.
      if (result.orderNumber) {
        clearCart();
      }

      // If method is VA or QRIS (or returns vaNumber / qrString), show modal on-page!
      if (
        result.vaNumber ||
        result.qrString ||
        result.paymentCode ||
        selectedCategory === "va" ||
        selectedCategory === "qris"
      ) {
        setModalData({
          orderNumber: result.orderNumber,
          total: (result.amount ?? total) + paymentFee,
          paymentMethod:
            result.paymentMethod || selectedPaymentMethod?.paymentMethod || "VA",
          paymentName: selectedPaymentMethod?.paymentName || "Virtual Account",
          paymentImage: selectedPaymentMethod?.paymentImage,
          vaNumber: result.vaNumber || null,
          qrString: result.qrString || null,
          paymentCode: result.paymentCode || null,
          paymentUrl: result.paymentUrl || null,
          reference: result.reference || null,
          instructionsUrl: result.paymentInstructionsUrl,
          expiresAt: result.expiresAt || null,
        });
        setShowModal(true);
      } else {
        router.push(result.paymentInstructionsUrl);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : t("systemError", locale));
    } finally {
      setSubmitting(false);
    }
  }

  // ── Empty Cart State ───────────────────────────────────────────────────────
  if (items.length === 0 && !showModal) {
    return (
      <div className="container-shop pt-20 pb-36 min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-full max-w-sm bg-surface border border-border p-10 text-center rounded-2xl space-y-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-surface flex items-center justify-center text-muted">
            <ShoppingBag size={22} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xs tracking-widest uppercase text-foreground">
              {t("bagIsEmpty", locale)}
            </h1>
            <p className="text-xs text-muted leading-relaxed">
              {t("bagIsEmptyDesc", locale)}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-foreground text-background text-[11px] tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity"
          >
            {t("returnToShop", locale)}
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = selectedCourier?.price || 0;
  const calculatedSubtotal = items.reduce(
    (sum, it) => sum + getItemPrice(it) * it.quantity,
    0
  );
  const total = calculatedSubtotal + shippingCost;
  const totalCount = items.reduce((acc, it) => acc + it.quantity, 0);

  // 2.6: Fee layanan HANYA dibebankan ke customer untuk metode customer-bears
  // (VC/kartu kredit, OVO, ShopeePay). Untuk metode yang fee-nya ditanggung
  // merchant, jangan tambahkan ke angka yang ditampilkan — supaya TOTAL DUE dan
  // modal sama dengan yang benar-benar dibayar customer. (serverTotal = subtotal
  // + ongkir tanpa fee; Duitku menambahkan fee ini di sisi pembayaran untuk
  // metode customer-bears.)
  const customerBearsFee = isCustomerBearsFee(selectedPaymentMethod);
  const paymentFee =
    customerBearsFee && selectedPaymentMethod
      ? Number(selectedPaymentMethod.totalFee) || 0
      : 0;
  const totalDue = total + paymentFee;

  return (
    <div className="container-shop pt-10 pb-10 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border mb-10">
          <Link
            href="/cart"
            className="group inline-flex items-center gap-2 text-[10px] font-medium text-muted hover:text-foreground transition-colors uppercase tracking-[0.14em]"
          >
            <ArrowLeft size={13} strokeWidth={2} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            {t("backToBag", locale)}
          </Link>
          <span className="text-[10px] uppercase tracking-[0.18em] text-foreground">
            {t("secureCheckout", locale)}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

            {/* ── LEFT COLUMN: Form Sections (7 cols) ─────────────────────── */}
            <div className="lg:col-span-7 space-y-6">

              {/* 1. Contact Information */}
              <div className="bg-surface border border-border p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center flex-shrink-0">
                      1
                    </span>
                    <h2 className="text-[10px] uppercase tracking-[0.18em] text-foreground">
                      {t("contactInformation", locale)}
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <FieldLabel>{t("emailAddress", locale)} *</FieldLabel>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="alex@example.com"
                      className={inputCls}
                    />
                    <FieldError message={errors.email?.message} locale={locale} />
                  </div>

                  <div>
                    <FieldLabel>{t("phoneNumber", locale)} *</FieldLabel>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="08123456789"
                      className={inputCls}
                    />
                    <FieldError message={errors.phone?.message} locale={locale} />
                  </div>

                  <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                    <input
                      {...register("newsOffers")}
                      type="checkbox"
                      className="rounded border-border bg-surface text-foreground focus:ring-foreground"
                    />
                    <span className="text-[11px] text-muted">
                      {t("newsOffers", locale)}
                    </span>
                  </label>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="bg-surface border border-border p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center flex-shrink-0">
                      2
                    </span>
                    <h2 className="text-[10px] uppercase tracking-[0.18em] text-foreground">
                      {t("deliveryAddress", locale)}
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Country Selector */}
                  <div>
                    <FieldLabel>{t("countryRegion", locale)} *</FieldLabel>
                    <div className="relative">
                      <select
                        {...register("country", {
                          onChange: () => {
                            userChoseCountryRef.current = true;
                          },
                        })}
                        className={selectCls}
                      >
                        <option value="">{t("selectCountry", locale)}</option>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                      />
                    </div>
                    <FieldError message={errors.country?.message} locale={locale} />
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>{t("firstName", locale)} *</FieldLabel>
                      <input
                        {...register("firstName")}
                        type="text"
                        placeholder="Alex"
                        className={inputCls}
                      />
                      <FieldError message={errors.firstName?.message} locale={locale} />
                    </div>
                    <div>
                      <FieldLabel>{t("lastName", locale)}</FieldLabel>
                      <input
                        {...register("lastName")}
                        type="text"
                        placeholder="Doe"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <FieldLabel>{t("streetAddress", locale)} *</FieldLabel>
                    <input
                      {...register("address")}
                      type="text"
                      placeholder={t("streetPlaceholder", locale)}
                      className={inputCls}
                    />
                    <FieldError message={errors.address?.message} locale={locale} />
                  </div>

                  {/* Apartment / Suite */}
                  <div>
                    <FieldLabel>{t("apartmentUnit", locale)}</FieldLabel>
                    <input
                      {...register("apartment")}
                      type="text"
                      placeholder={t("apartmentPlaceholder", locale)}
                      className={inputCls}
                    />
                  </div>

                  {/* ── Indonesia Cascading Location Fields ────────────── */}
                  {isIndonesia && (
                    <>
                      {/* Province */}
                      <div>
                        <FieldLabel>{t("province", locale)} *</FieldLabel>
                        <div className="relative">
                          <select
                            {...register("province")}
                            className={selectCls}
                            disabled={loadingProvinces}
                          >
                            <option value="">
                              {loadingProvinces ? t("loadingProvinces", locale) : t("selectProvince", locale)}
                            </option>
                            {provinces.map((prov) => (
                              <option key={prov} value={prov}>
                                {prov}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                          />
                        </div>
                        <FieldError message={errors.province?.message} locale={locale} />
                      </div>

                      {/* City */}
                      <div>
                        <FieldLabel>{t("cityRegency", locale)} *</FieldLabel>
                        <div className="relative">
                          <select
                            {...register("city")}
                            className={selectCls}
                            disabled={!selectedProvince || loadingCities}
                          >
                            <option value="">
                              {!selectedProvince
                                ? t("selectProvinceFirst", locale)
                                : loadingCities
                                  ? t("loadingCities", locale)
                                  : t("selectCity", locale)}
                            </option>
                            {cities.map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                          />
                        </div>
                        <FieldError message={errors.city?.message} locale={locale} />
                      </div>

                      {/* District & Postal Code */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* District */}
                        <div>
                          <FieldLabel>{t("district", locale)} *</FieldLabel>
                          <div className="relative">
                            <select
                              {...register("district")}
                              className={selectCls}
                              disabled={!selectedCity || loadingDistricts}
                            >
                              <option value="">
                                {!selectedCity
                                  ? t("selectCityFirst", locale)
                                  : loadingDistricts
                                    ? t("loadingGeneric", locale)
                                    : t("selectDistrict", locale)}
                              </option>
                              {districts.map((dist) => (
                                <option key={dist} value={dist}>
                                  {dist}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={14}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                            />
                          </div>
                          <FieldError message={errors.district?.message} locale={locale} />
                        </div>

                        {/* Postal Code */}
                        <div>
                          <FieldLabel>{t("postalCode", locale)} *</FieldLabel>
                          {availablePostalCodes.length > 1 ? (
                            <div className="relative">
                              <select {...register("postalCode")} className={selectCls}>
                                <option value="">{t("selectPostalCode", locale)}</option>
                                {availablePostalCodes.map((code) => (
                                  <option key={code} value={code}>
                                    {code}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown
                                size={14}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                              />
                            </div>
                          ) : (
                            <input
                              {...register("postalCode")}
                              type="text"
                              maxLength={5}
                              placeholder={
                                availablePostalCodes.length === 1
                                  ? availablePostalCodes[0]
                                  : t("postalExample", locale)
                              }
                              className={inputCls}
                            />
                          )}
                          <FieldError message={errors.postalCode?.message} locale={locale} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── International Address Fields ─────────────────────── */}
                  {isInternational && (
                    <>
                      <div>
                        <FieldLabel>{t("stateRegion", locale)}</FieldLabel>
                        <input
                          {...register("province")}
                          type="text"
                          placeholder={t("statePlaceholder", locale)}
                          className={inputCls}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FieldLabel>{t("city", locale)} *</FieldLabel>
                          <input
                            {...register("city")}
                            type="text"
                            placeholder={t("cityPlaceholder", locale)}
                            className={inputCls}
                          />
                          <FieldError message={errors.city?.message} locale={locale} />
                        </div>
                        <div>
                          <FieldLabel>{t("zipCode", locale)} *</FieldLabel>
                          <input
                            {...register("postalCode")}
                            type="text"
                            placeholder={t("zipPlaceholder", locale)}
                            className={inputCls}
                          />
                          <FieldError message={errors.postalCode?.message} locale={locale} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 3. Shipping Options */}
              <div className="bg-surface border border-border p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center flex-shrink-0">
                      3
                    </span>
                    <h2 className="text-[10px] uppercase tracking-[0.18em] text-foreground">
                      {t("shippingMethod", locale)}
                    </h2>
                  </div>
                  {shippingRates.length > 0 && (
                    <span className="text-[10px] text-muted uppercase tracking-wider">
                      {tf(shippingRates.length === 1 ? "optionsAvailableOne" : "optionsAvailable", locale, { count: shippingRates.length })}
                    </span>
                  )}
                </div>

                {/* Shipping rates loading indicator */}
                {loadingRates && (
                  <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted">
                    <Loader2 size={16} className="animate-spin text-foreground" />
                    <span>{t("calculatingRates", locale)}</span>
                  </div>
                )}

                {/* Rate error state */}
                {!loadingRates && rateError && (
                  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-3">
                    <AlertCircle size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-400 leading-relaxed">{rateError}</p>
                  </div>
                )}

                {/* Empty state: location not completed yet */}
                {!loadingRates && !rateError && shippingRates.length === 0 && (
                  <div className="py-6 text-center text-xs text-muted space-y-1">
                    <Truck size={20} strokeWidth={1.5} className="mx-auto mb-2 text-muted" />
                    <p>{t("completeAddressForRates", locale)}</p>
                  </div>
                )}

                {/* Rates list */}
                {!loadingRates && shippingRates.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {shippingRatesFallback && (
                      <div className="mb-1 flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200/90 leading-relaxed">
                        <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-amber-300" />
                        <span>
                          {t("ratesFallbackLead", locale)}{" "}
                          <strong className="text-amber-100">{t("ratesFallbackEmph", locale)}</strong>
                          {t("ratesFallbackTail", locale)}
                        </span>
                      </div>
                    )}
                    {shippingRates.map((rate) => {
                      const isSelected =
                        selectedCourier?.courier_code === rate.courier_code &&
                        selectedCourier?.courier_service_code === rate.courier_service_code;
                      return (
                        <button
                          key={`${rate.courier_code}-${rate.courier_service_code}`}
                          type="button"
                          onClick={() => setSelectedCourier(rate)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                            ? "border-foreground bg-surface ring-1 ring-foreground"
                            : "border-border hover:border-foreground/30 bg-surface"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected
                                ? "border-foreground bg-foreground"
                                : "border-border bg-surface-hover"
                                }`}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-background" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wider text-foreground">
                                {`${rate.courier_name} — ${rate.courier_service_name}`}
                              </p>
                              <p className="text-[10px] text-muted mt-0.5">
                                {`${t("estimatedArrival", locale)} ${
                                  rate.duration ||
                                  t(
                                    isInternational ? "estDurationIntl" : "estDurationDomestic",
                                    locale
                                  )
                                }`}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-foreground font-mono">
                            {formatRupiah(rate.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Pre-order shipping notice */}
                {shippingRates.length > 0 && (
                  <div className="mt-3 flex items-start gap-2 px-1">
                    <span className="text-muted mt-0.5 flex-shrink-0 text-[11px]">⏱</span>
                    <p className="text-[10px] text-muted leading-relaxed">
                      {t("preOrderLead", locale)}{" "}
                      <strong className="text-foreground/70">{t("preOrderEmph1", locale)}</strong>
                      {t("preOrderMid", locale)}{" "}
                      <strong className="text-foreground/70">{t("preOrderEmph2", locale)}</strong>
                      {t("preOrderTail", locale)}
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Payment Gateway Info */}
              <div className="bg-surface border border-border p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center flex-shrink-0">
                      4
                    </span>
                    <h2 className="text-[10px] uppercase tracking-[0.18em] text-foreground">
                      {t("paymentMethod", locale)}
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted">
                    <ShieldCheck size={14} className="text-foreground" />
                    <span className="text-[10px] uppercase tracking-wider">{t("biCertified", locale)}</span>
                  </div>
                </div>

                {loadingMethods ? (
                  <div className="p-6 bg-surface rounded-xl flex items-center justify-center gap-2 text-xs text-muted border border-border">
                    <Loader2 size={15} className="animate-spin text-foreground" />
                    <span>{t("loadingPaymentMethods", locale)}</span>
                  </div>
                ) : paymentMethods.length > 0 ? (
                  <div className="space-y-2.5 pt-1">
                    {PAYMENT_CATEGORIES.map((cat) => {
                      const categoryMethods = paymentMethods.filter(
                        (m) => getMethodCategory(m) === cat.id
                      );
                      if (categoryMethods.length === 0) return null;

                      const isExpanded = selectedCategory === cat.id;
                      const isCategoryActive =
                        selectedPaymentMethod &&
                        getMethodCategory(selectedPaymentMethod) === cat.id;

                      return (
                        <div
                          key={cat.id}
                          className={`border rounded-xl transition-all overflow-hidden ${isCategoryActive
                            ? "border-foreground/80 bg-surface/80 shadow-sm"
                            : "border-border bg-surface hover:border-foreground/30"
                            }`}
                        >
                          {/* Accordion Category Header */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              if (!isCategoryActive && categoryMethods.length > 0) {
                                setSelectedPaymentMethod(categoryMethods[0]);
                              }
                            }}
                            className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${isCategoryActive
                                  ? "border-foreground bg-foreground"
                                  : "border-border bg-surface-hover"
                                  }`}
                              >
                                {isCategoryActive && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-background" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs uppercase tracking-wider text-foreground font-semibold">
                                    {t(cat.titleKey, locale)}
                                  </p>
                                  {isCategoryActive && selectedPaymentMethod && (
                                    <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-foreground text-background font-medium tracking-wide">
                                      {selectedPaymentMethod.paymentName}
                                    </span>
                                  )}
                                </div>

                              </div>
                            </div>
                            <ChevronDown
                              size={15}
                              className={`text-muted transition-transform duration-200 flex-shrink-0 ml-2 ${isExpanded ? "rotate-180 text-foreground" : ""
                                }`}
                            />
                          </button>

                          {/* Expanded Sub-Methods List */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 space-y-2 border-t border-border/50">
                              <p className="text-[10px] uppercase text-muted tracking-wider pt-2 pb-1 font-medium">
                                {t("choose", locale)} {t(cat.titleKey, locale)}:
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                {categoryMethods.map((method) => {
                                  const isSelected =
                                    selectedPaymentMethod?.paymentMethod === method.paymentMethod;
                                  const feeNumber = Number(method.totalFee);
                                  return (
                                    <button
                                      key={method.paymentMethod}
                                      type="button"
                                      onClick={() => setSelectedPaymentMethod(method)}
                                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                                        ? "border-foreground bg-surface-hover ring-1 ring-foreground"
                                        : "border-border hover:border-foreground/30 bg-surface/60"
                                        }`}
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div
                                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${isSelected
                                            ? "border-foreground bg-foreground"
                                            : "border-border bg-surface"
                                            }`}
                                        >
                                          {isSelected && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-background" />
                                          )}
                                        </div>
                                        {method.paymentImage && (
                                          <div className="relative w-10 h-5 flex-shrink-0 bg-white rounded p-0.5 flex items-center justify-center">
                                            <img
                                              src={method.paymentImage}
                                              alt={method.paymentName}
                                              className="max-h-full max-w-full object-contain"
                                            />
                                          </div>
                                        )}
                                        <p className="text-xs text-foreground truncate font-medium">
                                          {method.paymentName}
                                        </p>
                                      </div>
                                      <span className="text-[10px] text-muted whitespace-nowrap ml-2">
                                        {feeNumber > 0 ? `+ ${formatRupiah(feeNumber)}` : t("noFee", locale)}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted leading-relaxed">
                    {t("paymentNoteLead", locale)} <strong>{t("submitCta", locale)}</strong>
                    {t("paymentNoteTail", locale)}
                  </p>
                )}
              </div>

            </div>

            {/* ── RIGHT COLUMN: Order Summary (5 cols sticky) ─────────────── */}
            <div className="lg:col-span-5 lg:sticky lg:top-8">
              <div className="bg-surface border border-border rounded-2xl overflow-hidden">

                {/* Summary Header */}
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="text-[10px] uppercase tracking-[0.18em] text-foreground">
                    {t("orderSummary", locale)} ({totalCount})
                  </h2>
                </div>

                {/* Items List */}
                <div className="px-6 py-5 space-y-3.5 max-h-[320px] overflow-y-auto border-b border-border">
                  {items.map((it) => (
                    <div
                      key={`${it.productId}-${it.size}`}
                      className="flex items-center gap-3.5"
                    >
                      {/* Thumbnail with quantity badge */}
                      <div className="relative w-14 h-16 bg-surface rounded-xl border border-border flex-shrink-0 overflow-hidden">
                        <Image
                          src={it.image || "/placeholder-product.svg"}
                          alt={it.name}
                          fill
                          className="object-contain p-1.5"
                          sizes="56px"
                        />
                        <span className="absolute top-1 right-1 bg-foreground text-background text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                          {it.quantity}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-foreground truncate">
                          {it.name}
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">
                          {t("sizeWord", locale)} {it.size} &times; {it.quantity}
                        </p>
                      </div>

                      {/* Item Total */}
                      <span className="text-xs text-foreground whitespace-nowrap">
                        {formatRupiah(getItemPrice(it) * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {isInternational && (
                  <div className="mx-6 mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200/90 leading-relaxed">
                    {tf("intlPriceNote", locale, { country: selectedCountry })}
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="px-6 py-5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">{tf(totalCount === 1 ? "subtotalOne" : "subtotalCount", locale, { count: totalCount })}</span>
                    <span className="text-foreground">{formatRupiah(calculatedSubtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted flex items-center gap-1">
                      {t("shipping", locale)}
                      <HelpCircle size={12} className="text-muted/80" />
                    </span>
                    <span className="text-foreground">
                      {selectedCourier ? formatRupiah(selectedCourier.price) : t("selectCourier", locale)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">{t("serviceFee", locale)}</span>
                    <span className="text-foreground">
                      {selectedPaymentMethod
                        ? isCustomerBearsFee(selectedPaymentMethod)
                          ? Number(selectedPaymentMethod.totalFee) > 0
                            ? `+ ${formatRupiah(Number(selectedPaymentMethod.totalFee))}`
                            : t("noFee", locale)
                          : "-"
                        : "—"}
                    </span>
                  </div>

                  {/* Total Due */}
                  <div className="pt-4 border-t border-border flex justify-between items-baseline">
                    <div>
                      <span className="text-[11px] uppercase tracking-widest text-foreground block">
                        {t("totalDue", locale)}
                      </span>
                      {paymentFee > 0 && (
                        <span className="text-[10px] text-muted block mt-0.5">
                          {t("includesFees", locale)}
                        </span>
                      )}
                    </div>
                    <span className="text-lg text-foreground">
                      {formatRupiah(totalDue)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-6 pb-6">
                  <button
                    type="submit"
                    disabled={submitting || !selectedCourier}
                    className="w-full py-4 bg-foreground text-background text-xs tracking-widest uppercase rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer font-medium shadow-sm"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{t("processing", locale)}</span>
                      </>
                    ) : (
                      <span>{t("submitCta", locale)}</span>
                    )}
                  </button>
                  <p className="text-[10px] text-muted text-center mt-3 tracking-wide">
                    {t("safeCheckout", locale)}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </form>

      </div>

      {/* On-Page Payment Modal for Direct VA & QRIS settlement */}
      <PaymentModal
        // Remount per order supaya hitung mundur, polling dan QR selalu segar.
        key={modalData?.orderNumber ?? "payment-modal"}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          if (modalData?.instructionsUrl) {
            router.push(modalData.instructionsUrl);
          }
        }}
        data={modalData}
        locale={locale}
      />
    </div>
  );
}
