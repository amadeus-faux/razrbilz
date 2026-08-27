import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of use for the RAZRBILZ platform and services.",
};

export default function TermsOfServicePage() {
  return (
    <article className="space-y-12">
      {/* Page header */}
      <header className="space-y-3 pb-8 border-b border-border">
        <h1 className="text-page-heading">Terms of Service</h1>
        <p className="text-[11px] text-muted tracking-wide">
          Terms of use for the RAZRBILZ platform and services.
        </p>
      </header>

      {/* Body */}
      <div className="space-y-10 prose-policy">
        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            1. General Terms
          </h2>
          <p>
            By accessing and placing an order on the RAZRBILZ website, you agree to be bound by all the terms and conditions outlined on this page. All items presented are produced in limited batches.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            2. Pricing &amp; Product Availability
          </h2>
          <p>
            All prices listed are in Indonesian Rupiah (IDR). We reserve the right to change product prices and estimated stock availability at any time without prior notice. Confirmed and fully paid orders will be processed according to the price at the time of transaction.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            3. Payment &amp; Security
          </h2>
          <p>
            Online payment transactions are encrypted and securely processed through the official Midtrans Payment Gateway. We do not store credit card details or bank account credentials on our internal servers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            4. Intellectual Property Rights
          </h2>
          <p>
            All content, trademarks, graphic logos, typography, product photography, and apparel designs on this website are the exclusive copyright of RAZRBILZ. Any duplication or unauthorized use of our assets without written permission is strictly prohibited.
          </p>
        </section>
      </div>
    </article>
  );
}
