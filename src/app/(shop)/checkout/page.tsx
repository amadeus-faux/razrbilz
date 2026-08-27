"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore, type CartItem } from "@/store/cart-store";
import { formatRupiah } from "@/lib/utils";
import { checkoutSchema, type CheckoutFormData } from "@/lib/checkout-schema";
import { COUNTRIES } from "@/lib/countries";
import { INDONESIA_PROVINCES } from "@/lib/indonesia-provinces";
import type { BiteshipCourierRate } from "@/lib/biteship";
import Link from "next/link";
import Image from "next/image";
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
  "w-full px-4 py-3 bg-surface border border-border rounded-xl text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface/50 transition-all";
const selectCls =
  "w-full px-4 py-3 bg-surface border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface/50 transition-all appearance-none pr-10 cursor-pointer";

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
        if (isMounted) setProvinces(INDONESIA_PROVINCES);
      } finally {
        if (isMounted) setLoadingProvinces(false);
      }
    }

    // Reset subordinate fields on country change
    setValue("province", "");
    setValue("city", "");
    setValue("district", "");
    setValue("postalCode", "");
    setCities([]);
    setDistricts([]);
    setPostalCodesMap({});
    setAvailablePostalCodes([]);
    setSelectedCourier(null);
    setShippingRates([]);

    if (isIndonesia) {
      loadProvinces();
    } else {
      setProvinces([]);
    }
    return () => {
      isMounted = false;
    };
  }, [selectedCountry, isIndonesia, setValue]);

  // ── 2. Load Cities when Province changes (Indonesia) ────────────────────────
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
          `/api/shipping/areas?type=cities&province=${encodeURIComponent(selectedProvince)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.cities) {
            setCities(data.cities);
          }
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
      setPostalCodesMap({});
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

  // ── Submit Checkout ─────────────────────────────────────────────────────────
  async function onSubmit(data: CheckoutFormData) {
    if (!selectedCourier) {
      alert("Silakan pilih opsi pengiriman.");
      return;
    }
    setSubmitting(true);
    const fullName = `${data.firstName} ${data.lastName || ""}`.trim();
    const fullAddress = data.apartment ? `${data.address}, ${data.apartment}` : data.address;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          customerName: fullName,
          address: fullAddress,
          courier: `${selectedCourier.courier_name} — ${selectedCourier.courier_service_name}`,
          shippingCost: selectedCourier.price,
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
            priceAtBuy: item.price,
          })),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Checkout gagal diproses");
      }

      const { snapToken, orderId } = await res.json();

      if (snapToken && typeof window !== "undefined" && window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: () => {
            clearCart();
            router.push(`/payment/finish?order_id=${orderId}`);
          },
          onPending: () => {
            clearCart();
            router.push(`/payment/unfinish?order_id=${orderId}`);
          },
          onError: () => {
            router.push(`/payment/error?order_id=${orderId}`);
          },
          onClose: () => {
            // User closed payment dialog
          },
        });
      } else {
        clearCart();
        router.push(`/payment/finish?order_id=${orderId}`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan pada sistem.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Empty Cart State ────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="container-shop pt-20 pb-36 min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-full max-w-sm bg-white border border-border p-10 text-center rounded-2xl shadow-sm space-y-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-surface flex items-center justify-center text-muted">
            <ShoppingBag size={22} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xs font-semibold tracking-widest uppercase text-foreground">
              YOUR BAG IS EMPTY
            </h1>
            <p className="text-xs text-muted leading-relaxed">
              Tambahkan produk RAZRBILZ ke keranjang sebelum melakukan checkout.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-foreground text-background text-[11px] font-semibold tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity"
          >
            RETURN TO SHOP
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = selectedCourier?.price || 0;
  const total = subtotal() + shippingCost;
  const totalCount = items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="container-shop pt-10 pb-36 min-h-screen">
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
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">
            Secure Checkout
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

            {/* ── LEFT COLUMN: Form Sections (7 cols) ─────────────────────── */}
            <div className="lg:col-span-7 space-y-6">

              {/* 1. Contact Information */}
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center flex-shrink-0 font-semibold">
                      1
                    </span>
                    <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">
                      CONTACT INFORMATION
                    </h2>
                  </div>
                  <Link
                    href="/login"
                    className="text-[10px] uppercase font-medium tracking-[0.14em] text-muted hover:text-foreground transition-colors"
                  >
                    Sign in
                  </Link>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <FieldLabel>Email Address *</FieldLabel>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="alex@example.com"
                      className={inputCls}
                      id="checkout-email"
                    />
                    <FieldError message={errors.email?.message} />
                  </div>

                  <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                    <input
                      {...register("newsOffers")}
                      type="checkbox"
                      className="w-4 h-4 rounded border-border text-foreground accent-foreground focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-muted">
                      Email me with news and exclusive RAZRBILZ drops
                    </span>
                  </label>
                </div>
              </div>

              {/* 2. Delivery / Shipping Address */}
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center flex-shrink-0 font-semibold">
                    2
                  </span>
                  <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">
                    DELIVERY ADDRESS
                  </h2>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Country Selection */}
                  <div>
                    <FieldLabel>Country / Region *</FieldLabel>
                    <div className="relative">
                      <select
                        {...register("country")}
                        className={selectCls}
                        id="checkout-country"
                      >
                        <option value="">— Pilih Negara —</option>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name} ({c.code})
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                      />
                    </div>
                    <FieldError message={errors.country?.message} />
                  </div>

                  {/* First name & Last name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>First Name *</FieldLabel>
                      <input
                        {...register("firstName")}
                        type="text"
                        placeholder="First name"
                        className={inputCls}
                        id="checkout-firstname"
                      />
                      <FieldError message={errors.firstName?.message} />
                    </div>
                    <div>
                      <FieldLabel>Last Name</FieldLabel>
                      <input
                        {...register("lastName")}
                        type="text"
                        placeholder="Last name"
                        className={inputCls}
                        id="checkout-lastname"
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <FieldLabel>Address *</FieldLabel>
                    <input
                      {...register("address")}
                      type="text"
                      placeholder="Street address, house/building number"
                      className={inputCls}
                      id="checkout-address"
                    />
                    <FieldError message={errors.address?.message} />
                  </div>

                  {/* Apartment, suite, etc. */}
                  <div>
                    <FieldLabel>Apartment, suite, etc. (optional)</FieldLabel>
                    <input
                      {...register("apartment")}
                      type="text"
                      placeholder="Unit, suite, floor (optional)"
                      className={inputCls}
                      id="checkout-apartment"
                    />
                  </div>

                  {/* ── Cascading Location Fields ──────────────────────────── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Province */}
                    <div>
                      <FieldLabel>{isIndonesia ? "Provinsi *" : "State / Province *"}</FieldLabel>
                      {isIndonesia ? (
                        <div className="relative">
                          <select
                            {...register("province")}
                            className={selectCls}
                            id="checkout-province"
                            disabled={!isCountrySelected || loadingProvinces}
                          >
                            <option value="">
                              {!isCountrySelected
                                ? "Pilih negara terlebih dahulu"
                                : loadingProvinces
                                ? "Memuat daftar provinsi..."
                                : "— Pilih Provinsi —"}
                            </option>
                            {provinces.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                          />
                        </div>
                      ) : (
                        <input
                          {...register("province")}
                          type="text"
                          placeholder="State / Province"
                          className={inputCls}
                          id="checkout-province"
                          disabled={!isCountrySelected}
                        />
                      )}
                      <FieldError message={errors.province?.message} />
                    </div>

                    {/* City / Kota */}
                    <div>
                      <FieldLabel>City / Kota *</FieldLabel>
                      {isIndonesia ? (
                        <div className="relative">
                          <select
                            {...register("city")}
                            className={selectCls}
                            id="checkout-city"
                            disabled={!selectedProvince || loadingCities}
                          >
                            <option value="">
                              {!selectedProvince
                                ? "Pilih provinsi terlebih dahulu"
                                : loadingCities
                                ? "Memuat daftar kota..."
                                : "— Pilih Kota / Kabupaten —"}
                            </option>
                            {cities.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                          />
                        </div>
                      ) : (
                        <input
                          {...register("city")}
                          type="text"
                          placeholder="City"
                          className={inputCls}
                          id="checkout-city"
                          disabled={!isCountrySelected}
                        />
                      )}
                      <FieldError message={errors.city?.message} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* District / Kecamatan */}
                    <div>
                      <FieldLabel>{isIndonesia ? "Kecamatan / District *" : "District / Area"}</FieldLabel>
                      {isIndonesia ? (
                        <div className="relative">
                          <select
                            {...register("district")}
                            className={selectCls}
                            id="checkout-district"
                            disabled={!selectedCity || loadingDistricts}
                          >
                            <option value="">
                              {!selectedCity
                                ? "Pilih kota terlebih dahulu"
                                : loadingDistricts
                                ? "Memuat daftar kecamatan..."
                                : "— Pilih Kecamatan —"}
                            </option>
                            {districts.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                          />
                        </div>
                      ) : (
                        <input
                          {...register("district")}
                          type="text"
                          placeholder="District / Area (optional)"
                          className={inputCls}
                          id="checkout-district"
                          disabled={!isCountrySelected}
                        />
                      )}
                      <FieldError message={errors.district?.message} />
                    </div>

                    {/* Postal Code / Kode Pos */}
                    <div>
                      <FieldLabel>Postal Code / Kode Pos *</FieldLabel>
                      {isIndonesia && availablePostalCodes.length > 1 ? (
                        <div className="relative">
                          <select
                            {...register("postalCode")}
                            className={selectCls}
                            id="checkout-postal"
                            disabled={!selectedDistrict}
                          >
                            <option value="">— Pilih Kode Pos —</option>
                            {availablePostalCodes.map((pc) => (
                              <option key={pc} value={pc}>
                                {pc}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                          />
                        </div>
                      ) : (
                        <input
                          {...register("postalCode")}
                          type="text"
                          placeholder={
                            isIndonesia && !selectedDistrict
                              ? "Pilih kecamatan dahulu"
                              : "40123"
                          }
                          maxLength={10}
                          className={inputCls}
                          id="checkout-postal"
                          disabled={isIndonesia ? !selectedDistrict : !isCountrySelected}
                        />
                      )}
                      <FieldError message={errors.postalCode?.message} />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <FieldLabel>Phone Number *</FieldLabel>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+62 812 3456 7890"
                      className={inputCls}
                      id="checkout-phone"
                    />
                    <FieldError message={errors.phone?.message} />
                  </div>
                </div>
              </div>

              {/* 3. Shipping Method */}
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center flex-shrink-0 font-semibold">
                    3
                  </span>
                  <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">
                    SHIPPING METHOD
                  </h2>
                </div>

                {loadingRates ? (
                  <div className="p-6 bg-surface rounded-xl flex items-center justify-center gap-2.5 text-xs text-muted border border-border">
                    <Loader2 size={15} className="animate-spin text-foreground" />
                    <span>Menghitung opsi kurir Biteship...</span>
                  </div>
                ) : rateError ? (
                  <div className="p-4 bg-surface text-red-500 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                    <AlertCircle size={15} />
                    <span>{rateError}</span>
                  </div>
                ) : shippingRates.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    {shippingRates.map((rate, idx) => {
                      const isSelected =
                        selectedCourier?.courier_code === rate.courier_code &&
                        selectedCourier?.courier_service_code === rate.courier_service_code;
                      return (
                        <button
                          key={`${rate.courier_code}-${rate.courier_service_code}-${idx}`}
                          type="button"
                          onClick={() => setSelectedCourier(rate)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-foreground bg-surface ring-1 ring-foreground"
                              : "border-border hover:border-black/25 bg-white"
                          }`}
                          id={`courier-option-${idx}`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                                isSelected
                                  ? "border-foreground bg-foreground"
                                  : "border-border bg-white"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-background" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold uppercase tracking-wider text-foreground truncate">
                                {rate.courier_name} — {rate.courier_service_name}
                              </p>
                              <p className="text-[10px] text-muted mt-0.5">
                                {rate.duration} ({rate.description})
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-foreground whitespace-nowrap ml-3">
                            {formatRupiah(rate.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 bg-surface rounded-xl text-center text-xs text-muted border border-border leading-relaxed">
                    {!isCountrySelected
                      ? "Pilih negara pengiriman di atas untuk melihat metode pengiriman."
                      : isIndonesia && (!postalCode || postalCode.length < 4)
                      ? "Lengkapi pemilihan provinsi, kota, kecamatan, dan kode pos untuk memuat kurir Biteship."
                      : "Tidak ada opsi pengiriman yang tersedia."}
                  </div>
                )}
              </div>

              {/* 4. Payment Gateway Info */}
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center flex-shrink-0 font-semibold">
                      4
                    </span>
                    <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">
                      PAYMENT METHOD
                    </h2>
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Setelah menekan <strong>PAY NOW</strong>, popup pembayaran Midtrans akan muncul.
                </p>
              </div>

            </div>

            {/* ── RIGHT COLUMN: Order Summary (5 cols sticky) ──────────────── */}
            <div className="lg:col-span-5 lg:sticky lg:top-8">
              <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">

                {/* Summary Header */}
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">
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
                        <span className="absolute top-1 right-1 bg-foreground text-background text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                          {it.quantity}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-foreground truncate">
                          {it.name}
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">
                          SIZE {it.size} &times; {it.quantity}
                        </p>
                      </div>

                      {/* Item Total */}
                      <span className="text-xs font-bold text-foreground whitespace-nowrap">
                        {formatRupiah(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="px-6 py-5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Subtotal ({totalCount} items)</span>
                    <span className="font-semibold text-foreground">{formatRupiah(subtotal())}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted flex items-center gap-1">
                      Shipping
                      <HelpCircle size={12} className="text-muted/80" />
                    </span>
                    <span className="font-semibold text-foreground">
                      {selectedCourier ? formatRupiah(selectedCourier.price) : "Pilih kurir"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Taxes &amp; Duties</span>
                    <span className="font-medium text-foreground">Included</span>
                  </div>

                  {/* Total Due */}
                  <div className="pt-4 border-t border-border flex justify-between items-baseline">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                      TOTAL DUE
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      {formatRupiah(total)}
                    </span>
                  </div>
                </div>

                {/* Submit / Pay CTA */}
                <div className="px-6 pb-6 space-y-3">
                  <button
                    type="submit"
                    disabled={!selectedCourier || submitting}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-xl hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
                    id="btn-pay"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        PROCESSING ORDER...
                      </>
                    ) : (
                      `PAY NOW`
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[9px] text-muted">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={11} strokeWidth={1.5} />
                      SSL Encrypted
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck size={11} strokeWidth={1.5} />
                      Insured Delivery
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}

// Declare Midtrans Snap global type
declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: () => void;
          onPending?: () => void;
          onError?: () => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}
