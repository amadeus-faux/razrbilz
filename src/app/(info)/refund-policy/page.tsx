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
          Last updated: October 2026 · Applies to all purchases made through the official RAZRBILZ website.
        </p>
      </header>

      {/* Body */}
      <div className="space-y-10 prose-policy">
        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            All Sales Are Final
          </h2>
          <p>
            All products purchased from RAZRBILZ are <strong>final sale</strong>. We do not accept returns or refunds for reasons such as change of mind, incorrect size selection, or personal preference. Please review your order carefully, including size, product name, and quantity, before completing your purchase.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            Size Exchange
          </h2>
          <p>
            If you wish to exchange your item for a different size, we will accommodate your request <strong>subject to stock availability</strong>. Please note the following:
          </p>
          <ul>
            <li>All shipping costs for sending the item back to us and reshipping the replacement, including any applicable taxes and customs duties for international customers, are <strong>entirely the customer&apos;s responsibility</strong>.</li>
            <li>We strongly recommend contacting us before sending anything to confirm size availability.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            Defects Caused by Our Error
          </h2>
          <p>
            If a product arrives with a defect or issue that is caused by our negligence such as a manufacturing defect or incorrect item shipped, we will take <strong>full responsibility</strong> and cover all associated costs, including return shipping and reshipping fees.
          </p>
          <p>
            To be eligible, you must provide a <strong>clear, uncut, and unedited unboxing video</strong> as proof of the defect at the time of opening the package. Claims submitted without a valid unboxing video cannot be processed.
          </p>
          <p>
            To submit a claim, please reach out to us via the{" "}
            <a href="/contact">Contact Us</a> page or email us at{" "}
            <strong>razrbilz@gmail.com</strong> with your Order ID and unboxing video attached.
          </p>
        </section>
      </div>
    </article>
  );
}
