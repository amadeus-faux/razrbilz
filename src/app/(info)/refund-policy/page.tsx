import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/refund-policy",
  title: "Return & Refund Policy",
  description:
    "RAZRBILZ return and refund policy. All sales are final except production defects, and we explain how we handle a parcel that comes back to us.",
});

export default function RefundPolicyPage() {
  return (
    <article className="space-y-12">
      {/* Page header */}
      <header className="space-y-3 pb-8 border-b border-border">
        <h1 className="text-page-heading">Return &amp; Refund Policy</h1>
        <p className="text-[11px] text-muted tracking-wide">
          Last updated: November 2026 · Applies to all purchases made through the official RAZRBILZ website.
        </p>
      </header>

      {/*
        Halaman ini adalah SATU-SATUNya rujukan kebijakan retur. /policy hanya
        meringkas dan menaut ke sini. Jangan menulis ulang ketentuannya di
        tempat lain supaya tidak bercabang jadi dua versi yang saling
        bertentangan.
      */}
      <div className="space-y-10 prose-policy">
        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            All Sales Are Final
          </h2>
          <p>
            All products purchased from RAZRBILZ are <strong>final sale</strong>. We do not accept returns, refunds, or size exchanges for reasons such as change of mind, incorrect size selection, or personal preference. Please review your order carefully, including size, product name, and quantity, before completing your purchase.
          </p>
          <p>
            Every piece is made to order, so production starts as soon as your payment is confirmed. Once production has begun the order can no longer be changed or cancelled.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            The Only Exception: Defects or Errors on Our Side
          </h2>
          <p>
            If a product arrives with a defect or issue that is caused by our negligence such as a manufacturing defect or an incorrect item being shipped, we will take <strong>full responsibility</strong> and cover all associated costs, including return shipping and reshipping fees. This is the only exception to the final-sale rule above.
          </p>
          <p>
            To be eligible, provide a <strong>clear, uncut, and unedited unboxing video</strong>, filmed as you open the package. It shows the state of the parcel and the garment at the moment of delivery, which is what we need in order to act on a claim without asking you to prove a point twice.
          </p>
          <p>
            The video is one of the conditions of this policy. If it is missing, cut, edited, or recorded after the package was already opened, we may decline to process the claim. If you are not sure your footage is usable, send it anyway with a short note describing what you saw. We will look at it before we decide.
          </p>
          <p>
            To submit a claim, please reach out to us via the{" "}
            <a href="/contact">Contact Us</a> page or email us at{" "}
            <strong>support@razrbilz.id</strong> with your Order ID and unboxing video attached.
          </p>
        </section>
      </div>
    </article>
  );
}
