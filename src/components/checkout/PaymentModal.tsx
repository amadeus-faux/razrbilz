"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Clock,
  AlertCircle,
  X,
  RefreshCw,
  Building2,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import QRCode from "qrcode";
import { formatRupiah } from "@/lib/utils";
import { classifyPaymentMethod, retailOutletLabel } from "@/lib/payment-display";
import { t, tf, messageParts, type CheckoutKey, type Locale } from "@/lib/checkout-i18n";

export interface PaymentModalData {
  orderNumber: string;
  total: number;
  paymentMethod: string;
  paymentName: string;
  paymentImage?: string;
  vaNumber?: string | null;
  qrString?: string | null;
  paymentCode?: string | null;
  paymentUrl?: string | null;
  reference?: string | null;
  instructionsUrl: string;
  /** ISO string batas bayar dari server (`Order.expiredAt`); null bila tidak ada. */
  expiresAt?: string | null;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PaymentModalData | null;
  locale: Locale;
}

/** Pesan dictionary; nilai `{placeholder}` ditebalkan/di-mono supaya angka penting
 *  (nomor VA, nominal, kode) cepat ditemukan lagi saat customer berpindah aplikasi. */
function Msg({
  k,
  locale,
  vars,
  mono = true,
}: {
  k: CheckoutKey;
  locale: Locale;
  vars?: Record<string, string | number>;
  mono?: boolean;
}) {
  return (
    <>
      {messageParts(k, locale, vars).map((part, i) =>
        part.isVar ? (
          <span
            key={i}
            className={
              mono ? "font-mono text-foreground font-semibold" : "text-foreground font-semibold"
            }
          >
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
}

/** Dipakai kalau server tidak mengirim `expiresAt`; sama dengan EXPIRY_MINUTES
 *  di `api/checkout` karena modal dibuka sesaat setelah order dibuat. */
const FALLBACK_EXPIRY_SECONDS = 60 * 60;

function secondsUntilExpiry(expiresAt?: string | null): number {
  if (!expiresAt) return FALLBACK_EXPIRY_SECONDS;
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Number.isFinite(ms)
    ? Math.max(0, Math.ceil(ms / 1000))
    : FALLBACK_EXPIRY_SECONDS;
}

export function PaymentModal({ isOpen, onClose, data, locale }: PaymentModalProps) {
  const [copiedVa, setCopiedVa] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid" | "failed">("pending");
  const [statusKey, setStatusKey] = useState<CheckoutKey | "">("");
  const [activeGuideTab, setActiveGuideTab] = useState<"mobile" | "atm" | "ibanking">("mobile");
  const [timeLeft, setTimeLeft] = useState<number>(() =>
    secondsUntilExpiry(data?.expiresAt)
  );
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [generatingQr, setGeneratingQr] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate QR Code data URL locally using qrcode package
  useEffect(() => {
    if (!data?.qrString) {
      setQrDataUrl(null);
      return;
    }

    setGeneratingQr(true);
    QRCode.toDataURL(data.qrString, {
      width: 280,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("Failed to generate QR Code locally:", err);
      })
      .finally(() => {
        setGeneratingQr(false);
      });
  }, [data?.qrString]);

  // Lock body scroll when modal is open to avoid background page movement
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Expiry countdown timer
  useEffect(() => {
    if (!isOpen || paymentStatus === "paid") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, paymentStatus]);

  // Format seconds into HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Poll payment status every 4 seconds
  useEffect(() => {
    if (!isOpen || !data?.orderNumber || paymentStatus === "paid") {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/payments/duitku/check-status?orderNumber=${encodeURIComponent(data.orderNumber)}`);
        if (res.ok) {
          const result = await res.json();
          if (result.paymentStatus === "paid") {
            setPaymentStatus("paid");
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          } else if (result.paymentStatus === "failed") {
            setPaymentStatus("failed");
          }
        }
      } catch {
        // silent catch during background polling
      }
    };

    pollIntervalRef.current = setInterval(checkStatus, 4000);
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen, data?.orderNumber, paymentStatus]);

  // Manual check status button
  const handleManualCheck = async () => {
    if (!data?.orderNumber || checkingStatus) return;
    setCheckingStatus(true);
    setStatusKey("");
    try {
      const res = await fetch(`/api/payments/duitku/check-status?orderNumber=${encodeURIComponent(data.orderNumber)}&sync=1`);
      if (res.ok) {
        const result = await res.json();
        if (result.paymentStatus === "paid") {
          setPaymentStatus("paid");
        } else {
          setStatusKey("pmStatusNotFound");
        }
      } else {
        setStatusKey("pmStatusCheckFailed");
      }
    } catch {
      setStatusKey("pmNetworkError");
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleCopyVa = () => {
    if (!data?.vaNumber) return;
    navigator.clipboard.writeText(data.vaNumber);
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2000);
  };

  const handleCopyCode = () => {
    const code = data?.paymentCode || data?.vaNumber;
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyAmount = () => {
    if (!data?.total) return;
    navigator.clipboard.writeText(String(data.total));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  if (!isOpen || !data) return null;

  const category = classifyPaymentMethod({ code: data.paymentMethod, name: data.paymentName });
  const isQRIS = Boolean(data.qrString) || category === "qris";
  const isRetail = !isQRIS && category === "retail";
  const isVA = !isQRIS && !isRetail && Boolean(data.vaNumber);
  const retailCode = data.paymentCode || data.vaNumber || null;
  const outlet = retailOutletLabel(data.paymentName, locale);
  const amountLabel = formatRupiah(data.total);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/55 backdrop-blur-md animate-in fade-in duration-200"
      data-lenis-prevent="true"
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
        data-lenis-prevent="true"
      >
        {/* Top Header Bar */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-border flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <p className="text-[11px] uppercase tracking-widest text-foreground/80 font-mono">
              {tf("pmOrder", locale, { number: data.orderNumber })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-foreground/[0.06] transition-colors cursor-pointer"
            title={t("pmClose", locale)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body (Scrollable with Lenis prevent) */}
        <div
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 overscroll-contain"
          data-lenis-prevent="true"
          style={{ overscrollBehavior: "contain" }}
        >
          {/* Status: SUCCESS */}
          {paymentStatus === "paid" ? (
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={36} className="animate-bounce" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-foreground tracking-wide uppercase">
                  {t("pmPaidTitle", locale)}
                </h3>
                <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                  {t("pmPaidDesc", locale)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border text-xs space-y-2 text-left font-mono">
                <div className="flex justify-between">
                  <span className="text-muted">{t("pmOrderNo", locale)}</span>
                  <span className="text-foreground font-semibold">{data.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t("pmTotalPaid", locale)}</span>
                  <span className="text-emerald-700 font-semibold">{formatRupiah(data.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t("pmMethod", locale)}</span>
                  <span className="text-foreground">{data.paymentName}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href={`/order-confirmation/${encodeURIComponent(data.orderNumber)}`}
                  className="w-full py-3.5 bg-foreground text-background text-xs font-semibold tracking-widest uppercase rounded-xl inline-flex justify-center items-center gap-2 hover:bg-foreground/90 transition-all"
                >
                  {t("pmViewConfirmation", locale)} <ArrowRight size={14} />
                </Link>
                <Link
                  href="/"
                  className="w-full py-3 bg-surface text-foreground text-xs tracking-wider uppercase rounded-xl hover:bg-surface-hover transition-colors text-center"
                >
                  {t("pmBackHome", locale)}
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Payment Method Badge & Expiry Countdown */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-border">
                <div className="flex items-center gap-3">
                  {data.paymentImage ? (
                    <div className="w-10 h-6 bg-white border border-border rounded flex items-center justify-center p-0.5">
                      <img
                        src={data.paymentImage}
                        alt={data.paymentName}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <Building2 size={20} className="text-muted" />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-foreground tracking-wide">
                      {data.paymentName}
                    </p>
                    <p className="text-[10px] text-muted">{t("pmDuitkuDirect", locale)}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-amber-700 font-mono text-xs font-medium">
                    <Clock size={13} />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                  <p className="text-[9px] text-muted mt-0.5">{t("pmPayBy", locale)}</p>
                </div>
              </div>

              {/* Retail Outlet Display (Indomaret / Alfamart) */}
              {isRetail && (
                <div className="space-y-4">
                  {/* Payment Code Box */}
                  <div className="p-4 rounded-xl bg-surface border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-muted">
                        {t("pmPaymentCode", locale)}
                      </span>
                      <span className="text-[9px] text-amber-700 uppercase font-mono tracking-wide bg-amber-500/10 px-2 py-0.5 rounded">
                        {t("pmPayAtCounter", locale)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="font-mono text-lg sm:text-xl font-bold tracking-wider text-foreground select-all break-all">
                        {retailCode || "-"}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer ${
                          copiedCode
                            ? "bg-emerald-700 text-white"
                            : "bg-foreground text-background hover:bg-foreground/85"
                        }`}
                      >
                        {copiedCode ? (
                          <>
                            <Check size={13} /> {t("pmCopied", locale)}
                          </>
                        ) : (
                          <>
                            <Copy size={13} /> {t("pmCopy", locale)}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Total Amount Box */}
                  <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted block">
                        {t("pmTotalToPay", locale)}
                      </span>
                      <span className="text-base font-bold text-foreground font-mono mt-0.5 block">
                        {amountLabel}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAmount}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer ${
                        copiedAmount
                          ? "bg-emerald-700 text-white"
                          : "bg-foreground text-background hover:bg-foreground/85"
                      }`}
                    >
                      {copiedAmount ? `${t("pmCopied", locale)} ✓` : t("pmCopyAmount", locale)}
                    </button>
                  </div>

                  {/* Retail Payment Guide */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground">
                      {tf("pmRetailHowTo", locale, { outlet })}
                    </p>
                    <div className="text-[11px] text-foreground/80 leading-relaxed p-3 bg-surface rounded-xl border border-border">
                      <ol className="list-decimal list-inside space-y-1">
                        <li>
                          <Msg k="pmRetailStep1" locale={locale} vars={{ outlet }} mono={false} />
                        </li>
                        <li>{t("pmRetailStep2", locale)}</li>
                        <li>
                          <Msg k="pmRetailStep3" locale={locale} vars={{ code: retailCode || "-" }} />
                        </li>
                        <li>
                          <Msg k="pmRetailStep4" locale={locale} vars={{ amount: amountLabel }} />
                        </li>
                        <li>{t("pmRetailStep5", locale)}</li>
                      </ol>
                    </div>
                    {data.paymentUrl && (
                      <a
                        href={data.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-muted hover:text-foreground inline-flex items-center gap-1 underline underline-offset-4"
                      >
                        {t("pmOpenDuitkuPage", locale)} <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Virtual Account Display */}
              {isVA && (
                <div className="space-y-4">
                  {/* VA Number Box */}
                  <div className="p-4 rounded-xl bg-surface border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-muted">
                        {t("pmVaNumber", locale)}
                      </span>
                      <span className="text-[9px] text-emerald-700 uppercase font-mono tracking-wide bg-emerald-500/10 px-2 py-0.5 rounded">
                        {t("pmAutoVerify", locale)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="font-mono text-lg sm:text-xl font-bold tracking-wider text-foreground select-all break-all">
                        {data.vaNumber}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyVa}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer ${
                          copiedVa
                            ? "bg-emerald-700 text-white"
                            : "bg-foreground text-background hover:bg-foreground/85"
                        }`}
                      >
                        {copiedVa ? (
                          <>
                            <Check size={13} /> {t("pmCopied", locale)}
                          </>
                        ) : (
                          <>
                            <Copy size={13} /> {t("pmCopy", locale)}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Total Amount Box */}
                  <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted block">
                        {t("pmTotalToPay", locale)}
                      </span>
                      <span className="text-base font-bold text-foreground font-mono mt-0.5 block">
                        {amountLabel}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAmount}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer ${
                        copiedAmount
                          ? "bg-emerald-700 text-white"
                          : "bg-foreground text-background hover:bg-foreground/85"
                      }`}
                    >
                      {copiedAmount ? (
                        <>
                          <Check size={13} /> {t("pmCopied", locale)}
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> {t("pmCopyAmount", locale)}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Payment Guide Tabs */}
                  <div className="space-y-2 pt-1">
                    <div className="flex border-b border-border text-xs">
                      <button
                        type="button"
                        onClick={() => setActiveGuideTab("mobile")}
                        className={`pb-2 px-3 font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
                          activeGuideTab === "mobile"
                            ? "border-foreground text-foreground"
                            : "border-transparent text-muted hover:text-foreground"
                        }`}
                      >
                        {t("pmTabMobile", locale)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveGuideTab("atm")}
                        className={`pb-2 px-3 font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
                          activeGuideTab === "atm"
                            ? "border-foreground text-foreground"
                            : "border-transparent text-muted hover:text-foreground"
                        }`}
                      >
                        {t("pmTabAtm", locale)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveGuideTab("ibanking")}
                        className={`pb-2 px-3 font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
                          activeGuideTab === "ibanking"
                            ? "border-foreground text-foreground"
                            : "border-transparent text-muted hover:text-foreground"
                        }`}
                      >
                        {t("pmTabIb", locale)}
                      </button>
                    </div>

                    <div className="text-[11px] text-foreground/80 leading-relaxed p-3 bg-surface rounded-xl border border-border space-y-1.5">
                      {activeGuideTab === "mobile" && (
                        <ol className="list-decimal list-inside space-y-1">
                          <li>{t("pmVaMobile1", locale)}</li>
                          <li>{t("pmVaMobile2", locale)}</li>
                          <li>
                            <Msg
                              k="pmVaMobile3"
                              locale={locale}
                              vars={{ va: data.vaNumber ?? "" }}
                            />
                          </li>
                          <li>
                            <Msg
                              k="pmVaMobile4"
                              locale={locale}
                              vars={{ amount: amountLabel }}
                            />
                          </li>
                          <li>{t("pmVaMobile5", locale)}</li>
                        </ol>
                      )}
                      {activeGuideTab === "atm" && (
                        <ol className="list-decimal list-inside space-y-1">
                          <li>{t("pmVaAtm1", locale)}</li>
                          <li>{t("pmVaAtm2", locale)}</li>
                          <li>{t("pmVaAtm3", locale)}</li>
                          <li>
                            <Msg
                              k="pmVaAtm4"
                              locale={locale}
                              vars={{ va: data.vaNumber ?? "" }}
                            />
                          </li>
                          <li>{t("pmVaAtm5", locale)}</li>
                        </ol>
                      )}
                      {activeGuideTab === "ibanking" && (
                        <ol className="list-decimal list-inside space-y-1">
                          <li>{t("pmVaIb1", locale)}</li>
                          <li>{t("pmVaIb2", locale)}</li>
                          <li>
                            <Msg
                              k="pmVaIb3"
                              locale={locale}
                              vars={{ va: data.vaNumber ?? "" }}
                            />
                          </li>
                          <li>{t("pmVaIb4", locale)}</li>
                        </ol>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* QRIS Display */}
              {isQRIS && data.qrString && (
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-white border border-border rounded-2xl inline-block mx-auto shadow-md">
                    {generatingQr ? (
                      <div className="w-56 h-56 flex flex-col items-center justify-center gap-2 text-foreground">
                        <Loader2 size={24} className="animate-spin text-foreground" />
                        <span className="text-xs font-medium">{t("pmQrGenerating", locale)}</span>
                      </div>
                    ) : qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="QRIS Code"
                        className="w-56 h-56 mx-auto object-contain"
                      />
                    ) : (
                      <div className="w-56 h-56 flex flex-col items-center justify-center gap-2 text-foreground p-2">
                        <QrCode size={36} />
                        <span className="text-xs">{t("pmQrFailed", locale)}</span>
                      </div>
                    )}
                    <div className="mt-2 text-center text-foreground">
                      <p className="text-[10px] font-bold tracking-widest uppercase">{t("pmQrisNational", locale)}</p>
                      <p className="text-[9px] text-muted">{t("pmQrisApps", locale)}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center justify-between text-left">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted block">
                        {t("pmTotalToPay", locale)}
                      </span>
                      <span className="text-base font-bold text-foreground font-mono mt-0.5 block">
                        {amountLabel}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAmount}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-foreground text-background hover:bg-foreground/85 transition-all cursor-pointer"
                    >
                      {copiedAmount ? `${t("pmCopied", locale)} ✓` : t("pmCopyAmount", locale)}
                    </button>
                  </div>

                  <p className="text-[11px] text-muted leading-relaxed max-w-sm mx-auto">
                    {t("pmScanQr", locale)}
                  </p>
                </div>
              )}

              {/* Fallback / Payment URL Link (for E-Wallet, CC, or backup QR) */}
              {(!isVA && !isQRIS && !isRetail && data.paymentUrl) || (isQRIS && data.paymentUrl) ? (
                <div className="space-y-2 text-center pt-1">
                  {!isVA && !isQRIS && !isRetail && (
                    <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                      <p className="text-xs text-foreground/80">
                        {tf("pmViaMethod", locale, { method: data.paymentName })}
                      </p>
                      <a
                        href={data.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-foreground text-background font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-foreground/85 transition-all shadow-md cursor-pointer"
                      >
                        {tf("pmContinueTo", locale, { method: data.paymentName })} <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                  {isQRIS && data.paymentUrl && (
                    <a
                      href={data.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-muted hover:text-foreground inline-flex items-center gap-1 underline underline-offset-4"
                    >
                      {t("pmOpenFullQr", locale)} <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              ) : null}

              {/* Status Message Alert */}
              {statusKey && (
                <div className="p-3 bg-amber-500/10 border border-amber-600/30 text-amber-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={14} className="flex-shrink-0 text-amber-700" />
                  <span>{t(statusKey, locale)}</span>
                </div>
              )}

              {/* Real-time Status Verification CTA */}
              <div className="space-y-2.5 pt-2 pb-4">
                <button
                  type="button"
                  onClick={handleManualCheck}
                  disabled={checkingStatus}
                  className="w-full py-3.5 bg-surface hover:bg-surface-hover active:scale-[0.99] text-foreground text-xs font-semibold tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-border disabled:opacity-50 shadow-sm"
                >
                  <RefreshCw size={13} className={checkingStatus ? "animate-spin text-amber-700" : ""} />
                  {checkingStatus ? t("pmCheckingStatus", locale) : t("pmCheckStatusCta", locale)}
                </button>

                <div className="flex items-center justify-between text-[11px] text-muted px-1 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-700" /> {t("pmAutoSync", locale)}
                  </span>
                  <Link
                    href={data.instructionsUrl}
                    className="hover:text-foreground underline underline-offset-4"
                  >
                    {t("pmInstructionsPage", locale)} ↗
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
