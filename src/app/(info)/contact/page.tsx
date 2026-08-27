"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Clock, Loader2 } from "lucide-react";

const inputCls =
  "w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground focus:bg-white transition-all placeholder:text-muted/40";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formspreeEndpoint = "https://formspree.io/f/mrpgzzvw";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim pesan."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="space-y-12">
      {/* Page header */}
      <header className="space-y-3 pb-8 border-b border-border">
        <h1 className="text-page-heading">Contact Us</h1>
        <p className="text-sm text-muted leading-relaxed">
          Have questions about sizing, product availability, or your order status? Send a direct message to the RAZRBILZ studio.
        </p>
      </header>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            Icon: Mail,
            label: "Email",
            value: "razrbilz@gmail.com",
          },
          {
            Icon: Clock,
            label: "Response Time",
            value: "Senin – Jumat, 09:00 – 17:00",
          },
          {
            Icon: MapPin,
            label: "Studio",
            value: "Bandung, Indonesia",
          },
        ].map(({ Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-3 p-5 bg-white border border-border rounded-2xl"
          >
            <div className="w-8 h-8 rounded-xl bg-surface flex items-center justify-center">
              <Icon size={15} className="text-muted" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-[0.14em] text-muted mb-0.5">
                {label}
              </p>
              <p className="text-xs font-medium text-foreground leading-snug">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact form */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        {/* Form header */}
        <div className="px-6 md:px-8 py-5 border-b border-border">
          <h2 className="text-section-heading">Send a Message</h2>
        </div>

        {submitted ? (
          <div className="px-6 md:px-8 py-16 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} className="text-foreground" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h2 className="text-section-heading">Message Received!</h2>
              <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
                Thank you! Our team will respond via email within 24 hours.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="text-[11px] font-semibold tracking-widest uppercase underline underline-offset-4 text-muted hover:text-foreground transition-colors pt-2"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 md:px-8 py-7 space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2.5 border border-red-200">
                <AlertCircle size={14} strokeWidth={1.5} />
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-semibold tracking-[0.14em] text-muted">
                  Full Name <span className="text-foreground">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="E.g., Budi Santoso"
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-semibold tracking-[0.14em] text-muted">
                  Email Address <span className="text-foreground">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="email@example.com"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-semibold tracking-[0.14em] text-muted">
                Subject / No. Order
                <span className="ml-1.5 text-muted/60 normal-case tracking-normal text-[9px]">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                name="subject"
                placeholder="E.g., Size Exchange RZ-12345"
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-semibold tracking-[0.14em] text-muted">
                Message <span className="text-foreground">*</span>
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Please details your inquiry or issue here..."
                className={`${inputCls} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-foreground text-background text-[11px] font-semibold tracking-[0.16em] uppercase rounded-xl hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2.5"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.14)" }}
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  SENDING MESSAGE...
                </>
              ) : (
                <>
                  SEND MESSAGE
                  <Send size={13} strokeWidth={1.5} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </article>
  );
}
