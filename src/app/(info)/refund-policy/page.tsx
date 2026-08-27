import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Kebijakan pengembalian dan penukaran produk RAZRBILZ",
};

export default function RefundPolicyPage() {
  return (
    <article className="space-y-12">
      {/* Page header */}
      <header className="space-y-3 pb-8 border-b border-border">
        <h1 className="text-page-heading">Refund &amp; Exchange Policy</h1>
        <p className="text-[11px] text-muted tracking-wide">
          Last updated: 2026 · Applies to all purchases made through the official RAZRBILZ website.
        </p>
      </header>

      {/* Body */}
      <div className="space-y-10 prose-policy">
        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            1. Size Exchange Policy
          </h2>
          <p>
            We accept size exchanges within a maximum of{" "}
            <strong>3 (three) calendar days</strong> from the date the order is received, based on the courier's tracking status.
          </p>
          <ul>
            <li>Products must be in brand-new condition, unworn outdoors, and unwashed.</li>
            <li>Original hangtags, labels, and packaging must be intact and fully complete.</li>
            <li>Replacement size availability is subject to our current stock.</li>
            <li>Must include a clear unboxing video (un-cut and un-edited)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            2. Refund Policy
          </h2>
          <p>
            Refunds are only applicable if the item received has a proven major manufacturing defect or if RAZRBILZ sent the wrong model/size, and the replacement stock is no longer available.
          </p>
          <p>
            Refunds will be processed back to the original bank account or payment method via Midtrans within <strong>3–7 business days</strong> after the returned item is received and verified by our team.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            3. Shipping Costs for Returns
          </h2>
          <p>
            For size exchanges requested by the customer, all return and re-shipping costs are covered by the buyer. If the return or exchange is due to an error made by RAZRBILZ, we will cover all shipping expenses in full.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            4. How to Request a Return
          </h2>
          <p>
            Please contact our Customer Support via the{" "}
            <a href="/contact">Contact Us</a> page or send an email to{" "}
            <strong>razrbilz@gmail.com</strong> with the following details Order ID / Order Number, a clear unboxing video (un-cut and un-edited), and details of the requested size.
          </p>
        </section>
      </div>
    </article>
  );
}
