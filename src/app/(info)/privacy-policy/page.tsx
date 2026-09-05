import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Protection and governance of RAZRBILZ customer personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="space-y-12">
      {/* Page header */}
      <header className="space-y-3 pb-8 border-b border-border">
        <h1 className="text-page-heading">Privacy Policy</h1>
        <p className="text-[11px] text-muted tracking-wide">
          Protection and governance of RAZRBILZ customer personal data.
        </p>
      </header>

      {/* Body */}
      <div className="space-y-10 prose-policy">
        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            1. Information We Collect
          </h2>
          <p>
            When you complete a transaction or contact us, we collect the necessary information required for order processing and delivery, including: Full Name, Email Address, Phone Number, Full Shipping Address, and Postal Code.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            2. Use of Information
          </h2>
          <p>Your information is used exclusively to:</p>
          <ul>
            <li>Process, verify, and fulfill your apparel orders.</li>
            <li>
              Arrange package delivery with official logistics partners.
            </li>
            <li>Send payment status updates and shipping tracking numbers.</li>
            <li>
              Respond to customer service inquiries.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            3. Data Protection &amp; Confidentiality
          </h2>
          <p>
            We guarantee that your personal data will never be sold, rented, or shared with third parties, except as required for official transaction processing and logistics operations.
          </p>
        </section>
      </div>
    </article>
  );
}
