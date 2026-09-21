"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore, type CartItem } from "@/store/cart-store";
import { formatRupiah } from "@/lib/utils";
import { resolveDisplayPrice } from "@/lib/pricing";
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

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="text-[11px] text-red-500 mt-1">{message}</p>
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

const PAYMENT_CATEGORIES = [
  {
    id: "va",
    title: "Virtual Account",
    badge: "BCA, Mandiri, BNI, BRI, Permata, dll",
  },
  {
    id: "ewallet",
    title: "E-Wallet",
    badge: "DANA, OVO, ShopeePay App, LinkAja",
  },
  {
    id: "qris",
    title: "QRIS",
    badge: "BCA Mobile, Livin, GoPay, OVO, DANA, dll",
  },
  {
    id: "cc",
    title: "Credit Card",
    badge: "Visa, Mastercard, JCB",
  },
  {
    id: "other",
    title: "Other Payments",
    badge: "Indomaret, Retail, Paylater",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useSyncExternalStore(subscribe, getItemsSnapshot, getServerSnapshot);
  const subtotal = useCartStore((state) => state.subtotal);
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
  const isIndonesia = selectedCountry === "ID" || selectedCountry === "Indonesia";
  const isInternational = isCountrySelected && !isIndonesia;

  const [exchangeRate, setExchangeRate] = useState<number>(17500);

  // Sync pricing when country changes
  useEffect(() => {
    let isMounted = true;
    async function updatePricing() {
      try {
        const country = selectedCountry || "ID";
        if (typeof document !== "undefined") {
          document.cookie = `user_country=${country}; path=/; max-age=31536000; SameSite=Lax`;
        }
        const res = await fetch(`/api/pricing?country=${encodeURIComponent(country)}`);
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
  }, [selectedCountry]);

  const getItemPrice = useCallback(
    (it: CartItem) => {
      return resolveDisplayPrice(it.basePrice ?? it.price, selectedCountry, exchangeRate);
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
  const fetchShippingRates = useCallback(
    async (countryCode: string, destPostalCode: string) => {
      setLoadingRates(true);
      setRateError("");
      try {
        const res = await fetch("/api/shipping/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: countryCode,
            destinationPostalCode: destPostalCode || "00000",
            items: items.map((item) => ({
              name: item.name,
              weight: 350,
              quantity: item.quantity,
            })),
          }),
        });
        if (!res.ok) throw new Error("Failed to fetch rates");
        const data = await res.json();
        const rates: BiteshipCourierRate[] = data.rates || [];
        setShippingRates(rates);
        if (rates.length > 0) setSelectedCourier(rates[0]);
      } catch {
        setRateError("Gagal memuat tarif pengiriman. Coba kembali.");
        setShippingRates([]);
      } finally {
        setLoadingRates(false);
      }
    },
    [items]
  );

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
        setRateError("");
      }
    }
  }, [selectedCountry, postalCode, isInternational, isIndonesia, fetchShippingRates]);

  // ── 6. Load Payment Methods from Duitku ─────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    async function loadPaymentMethods() {
      setLoadingMethods(true);
      try {
        const amount = subtotal() + (selectedCourier?.price || 0);
        const res = await fetch(`/api/payments/duitku/methods?amount=${amount}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.methods && data.methods.length > 0) {
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
        console.error("Failed to load payment methods:", err);
      } finally {
        if (isMounted) setLoadingMethods(false);
      }
    }

    loadPaymentMethods();
    return () => {
      isMounted = false;
    };
  }, [subtotal, selectedCourier]);

  // ── Submit Checkout ────────────────────────────────────────────────────────
  async function onSubmit(data: CheckoutFormData) {
    if (!selectedCourier) {
      alert("Silakan pilih opsi pengiriman.");
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
          shippingCost: selectedCourier.price,
          paymentMethod: selectedPaymentMethod?.paymentMethod || "VA",
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
        throw new Error(errData.error || "Checkout gagal diproses");
      }

      const result = await res.json();
      clearCart();

      // If method is VA or QRIS (or returns vaNumber / qrString), show modal on-page!
      if (
        result.vaNumber ||
        result.qrString ||
        selectedCategory === "va" ||
        selectedCategory === "qris"
      ) {
        setModalData({
          orderNumber: result.orderNumber,
          total:
            result.amount ||
            total + (selectedPaymentMethod ? Number(selectedPaymentMethod.totalFee) : 0),
          paymentMethod:
            result.paymentMethod || selectedPaymentMethod?.paymentMethod || "VA",
          paymentName: selectedPaymentMethod?.paymentName || "Virtual Account",
          paymentImage: selectedPaymentMethod?.paymentImage,
          vaNumber: result.vaNumber || null,
          qrString: result.qrString || null,
          paymentUrl: result.paymentUrl || null,
          reference: result.reference || null,
          instructionsUrl: result.paymentInstructionsUrl,
        });
        setShowModal(true);
      } else {
        router.push(result.paymentInstructionsUrl);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan pada sistem.");
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
              YOUR BAG IS EMPTY
            </h1>
            <p className="text-xs text-muted leading-relaxed">
              Tambahkan produk RAZRBILZ ke keranjang sebelum melakukan checkout.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-foreground text-background text-[11px] tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity"
          >
            RETURN TO SHOP
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
            Back to Bag
          </Link>
          <span className="text-[10px] uppercase tracking-[0.18em] text-foreground">
            Secure Checkout
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
                      CONTACT INFORMATION
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <FieldLabel>Email Address *</FieldLabel>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="alex@example.com"
                      className={inputCls}
                    />
                    <FieldError message={errors.email?.message} />
                  </div>

                  <div>
                    <FieldLabel>Phone Number *</FieldLabel>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="08123456789"
                      className={inputCls}
                    />
                    <FieldError message={errors.phone?.message} />
                  </div>

                  <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                    <input
                      {...register("newsOffers")}
                      type="checkbox"
                      className="rounded border-border bg-surface text-foreground focus:ring-foreground"
                    />
                    <span className="text-[11px] text-muted">
                      Email me with news and exclusive offers
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
                      DELIVERY ADDRESS
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Country Selector */}
                  <div>
                    <FieldLabel>Country / Region *</FieldLabel>
                    <div className="relative">
                      <select {...register("country")} className={selectCls}>
                        <option value="">Pilih Negara</option>
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
                    <FieldError message={errors.country?.message} />
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>First Name *</FieldLabel>
                      <input
                        {...register("firstName")}
                        type="text"
                        placeholder="Alex"
                        className={inputCls}
                      />
                      <FieldError message={errors.firstName?.message} />
                    </div>
                    <div>
                      <FieldLabel>Last Name</FieldLabel>
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
                    <FieldLabel>Street Address *</FieldLabel>
                    <input
                      {...register("address")}
                      type="text"
                      placeholder="Nama jalan, nomor rumah / gedung"
                      className={inputCls}
                    />
                    <FieldError message={errors.address?.message} />
                  </div>

                  {/* Apartment / Suite */}
                  <div>
                    <FieldLabel>Apartment, suite, unit (optional)</FieldLabel>
                    <input
                      {...register("apartment")}
                      type="text"
                      placeholder="Lantai, blok, atau unit (opsional)"
                      className={inputCls}
                    />
                  </div>

                  {/* ── Indonesia Cascading Location Fields ────────────── */}
                  {isIndonesia && (
                    <>
                      {/* Province */}
                      <div>
                        <FieldLabel>Province *</FieldLabel>
                        <div className="relative">
                          <select
                            {...register("province")}
                            className={selectCls}
                            disabled={loadingProvinces}
                          >
                            <option value="">
                              {loadingProvinces ? "Memuat Provinsi..." : "Pilih Provinsi"}
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
                        <FieldError message={errors.province?.message} />
                      </div>

                      {/* City */}
                      <div>
                        <FieldLabel>City / Regency *</FieldLabel>
                        <div className="relative">
                          <select
                            {...register("city")}
                            className={selectCls}
                            disabled={!selectedProvince || loadingCities}
                          >
                            <option value="">
                              {!selectedProvince
                                ? "Pilih provinsi terlebih dahulu"
                                : loadingCities
                                  ? "Memuat Kota/Kabupaten..."
                                  : "Pilih Kota / Kabupaten"}
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
                        <FieldError message={errors.city?.message} />
                      </div>

                      {/* District & Postal Code */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* District */}
                        <div>
                          <FieldLabel>District (Kecamatan) *</FieldLabel>
                          <div className="relative">
                            <select
                              {...register("district")}
                              className={selectCls}
                              disabled={!selectedCity || loadingDistricts}
                            >
                              <option value="">
                                {!selectedCity
                                  ? "Pilih kota dulu"
                                  : loadingDistricts
                                    ? "Memuat..."
                                    : "Pilih Kecamatan"}
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
                          <FieldError message={errors.district?.message} />
                        </div>

                        {/* Postal Code */}
                        <div>
                          <FieldLabel>Postal Code *</FieldLabel>
                          {availablePostalCodes.length > 1 ? (
                            <div className="relative">
                              <select {...register("postalCode")} className={selectCls}>
                                <option value="">Pilih Kode Pos</option>
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
                                  : "Contoh: 12345"
                              }
                              className={inputCls}
                            />
                          )}
                          <FieldError message={errors.postalCode?.message} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── International Address Fields ─────────────────────── */}
                  {isInternational && (
                    <>
                      <div>
                        <FieldLabel>State / Province / Region</FieldLabel>
                        <input
                          {...register("province")}
                          type="text"
                          placeholder="e.g. California, Ontario, NSW"
                          className={inputCls}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FieldLabel>City *</FieldLabel>
                          <input
                            {...register("city")}
                            type="text"
                            placeholder="e.g. Los Angeles"
                            className={inputCls}
                          />
                          <FieldError message={errors.city?.message} />
                        </div>
                        <div>
                          <FieldLabel>Postal / ZIP Code *</FieldLabel>
                          <input
                            {...register("postalCode")}
                            type="text"
                            placeholder="e.g. 90001"
                            className={inputCls}
                          />
                          <FieldError message={errors.postalCode?.message} />
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
                      SHIPPING METHOD
                    </h2>
                  </div>
                  {shippingRates.length > 0 && (
                    <span className="text-[10px] text-muted uppercase tracking-wider">
                      {shippingRates.length} opsi tersedia
                    </span>
                  )}
                </div>

                {/* Shipping rates loading indicator */}
                {loadingRates && (
                  <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted">
                    <Loader2 size={16} className="animate-spin text-foreground" />
                    <span>Menghitung tarif pengiriman Biteship...</span>
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
                    <p>Lengkapi alamat pengiriman di atas untuk melihat opsi kurir.</p>
                  </div>
                )}

                {/* Rates list */}
                {!loadingRates && shippingRates.length > 0 && (
                  <div className="space-y-2 pt-1">
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
                                {isInternational
                                  ? "POS INDONESIA — INTERNATIONAL SHIPPING"
                                  : `${rate.courier_name} — ${rate.courier_service_name}`}
                              </p>
                              <p className="text-[10px] text-muted mt-0.5">
                                {isInternational
                                  ? "Estimated arrival: 10–14 business days"
                                  : `Estimasi tiba: ${rate.duration || "2-4 hari kerja"}`}
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
                      {isInternational ? (
                        <>
                          Shipping estimate is counted <strong className="text-foreground/70">from when your order is ready to ship</strong>.
                          {" "}As all items are <strong className="text-foreground/70">pre-order (14–21 days production)</strong>, total delivery time = production + shipping duration above.
                        </>
                      ) : (
                        <>
                          Estimasi tiba dihitung <strong className="text-foreground/70">sejak produk siap dikirimkan</strong>.
                          {" "}Karena semua produk bersifat <strong className="text-foreground/70">pre-order (produksi 14–21 hari)</strong>, total waktu pengiriman = produksi + durasi pengiriman di atas.
                        </>
                      )}
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
                      PAYMENT METHOD
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted">
                    <ShieldCheck size={14} className="text-foreground" />
                    <span className="text-[10px] uppercase tracking-wider">Tersertifikasi BI</span>
                  </div>
                </div>

                {loadingMethods ? (
                  <div className="p-6 bg-surface rounded-xl flex items-center justify-center gap-2 text-xs text-muted border border-border">
                    <Loader2 size={15} className="animate-spin text-foreground" />
                    <span>Memuat pilihan metode pembayaran...</span>
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
                                    {cat.title}
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
                                Pilih {cat.title}:
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
                                        {feeNumber > 0 ? `+ ${formatRupiah(feeNumber)}` : "Bebas Biaya"}
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
                    Setelah menekan <strong>PRE-ORDER NOW</strong>, instruksi pembayaran Duitku akan ditampilkan di halaman selanjutnya.
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
                    ORDER SUMMARY ({totalCount})
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
                          SIZE {it.size} &times; {it.quantity}
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
                    Product prices are adjusted for international buyers ({selectedCountry}) based on live USD/IDR exchange rates.
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="px-6 py-5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Subtotal ({totalCount} items)</span>
                    <span className="text-foreground">{formatRupiah(calculatedSubtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted flex items-center gap-1">
                      Shipping
                      <HelpCircle size={12} className="text-muted/80" />
                    </span>
                    <span className="text-foreground">
                      {selectedCourier ? formatRupiah(selectedCourier.price) : "Pilih kurir"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Service Fee</span>
                    <span className="text-foreground">
                      {selectedPaymentMethod
                        ? isCustomerBearsFee(selectedPaymentMethod)
                          ? Number(selectedPaymentMethod.totalFee) > 0
                            ? `+ ${formatRupiah(Number(selectedPaymentMethod.totalFee))}`
                            : "Bebas Biaya"
                          : "-"
                        : "—"}
                    </span>
                  </div>

                  {/* Total Due */}
                  <div className="pt-4 border-t border-border flex justify-between items-baseline">
                    <div>
                      <span className="text-[11px] uppercase tracking-widest text-foreground block">
                        TOTAL DUE
                      </span>
                      {selectedPaymentMethod && Number(selectedPaymentMethod.totalFee) > 0 && (
                        <span className="text-[10px] text-muted block mt-0.5">
                          Termasuk ongkir & biaya layanan
                        </span>
                      )}
                    </div>
                    <span className="text-lg text-foreground">
                      {formatRupiah(total + (selectedPaymentMethod ? Number(selectedPaymentMethod.totalFee) : 0))}
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
                        <span>MEMPROSES PESANAN...</span>
                      </>
                    ) : (
                      <span>PRE-ORDER NOW</span>
                    )}
                  </button>
                  <p className="text-[10px] text-muted text-center mt-3 tracking-wide">
                    Taxes calculated at next step &bull; Guaranteed safe checkout
                  </p>
                </div>
              </div>
            </div>

          </div>
        </form>

      </div>

      {/* On-Page Payment Modal for Direct VA & QRIS settlement */}
      <PaymentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          if (modalData?.instructionsUrl) {
            router.push(modalData.instructionsUrl);
          }
        }}
        data={modalData}
      />
    </div>
  );
}
