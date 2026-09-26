import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/terms",
  title: "Terms of Service",
  description: "Terms of use for the RAZRBILZ platform, orders and services.",
});

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
          <p>
            Every order is made to order on a pre-order basis: production takes <strong>14–21 days</strong> after your payment is confirmed, and the shipping estimate shown at checkout is counted from the moment your order is ready to ship.
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
            Online payment transactions are encrypted and securely processed through the official Duitku Payment Gateway. We do not store credit card details or bank account credentials on our internal servers.
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

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            5. Order Validity, Cancellation &amp; Returns
          </h2>
          <p>
            An unpaid order automatically expires 60 minutes after it is created, so that reserved stock is not held indefinitely. Once payment is confirmed your order enters production.
          </p>
          <p>
            Requests to change or cancel an order must be sent through the{" "}
            <a href="/contact">Contact Us</a> page as soon as possible and cannot be guaranteed once production has started.
          </p>
          <p>
            Returns and refunds are governed by our{" "}
            <a href="/refund-policy">Return &amp; Refund Policy</a>: all sales are final, with a production defect or an error on our side as the only exception.
          </p>
        </section>
      </div>
    </article>
  );
}
