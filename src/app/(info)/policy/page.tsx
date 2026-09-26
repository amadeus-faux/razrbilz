import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/policy",
  title: "Policy & Shipping",
  description:
    "How RAZRBILZ ships: couriers, delivery windows inside Indonesia and overseas, made-to-order production time, and payment channels.",
});

interface PolicySectionProps {
  title: string;
  children: React.ReactNode;
}
function PolicySection({ title, children }: PolicySectionProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-[10px] tracking-[0.18em] uppercase text-foreground">
        {title}
      </h2>
      <div className="text-[13px] text-muted leading-[1.85] space-y-3">{children}</div>
    </div>
  );
}

export default function PolicyPage() {
  return (
    <div className="space-y-10">
      {/* Page heading */}
      <div className="space-y-2 pb-8 border-b border-border">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
          Legal & Information
        </p>
        <h1 className="text-xl font-light tracking-tight text-foreground">
          Policy & Shipping
        </h1>
      </div>

      {/* Sections */}
      <div className="space-y-8 divide-y divide-border">
        <PolicySection title="Production &amp; Shipping">
          <p>
            Every RAZRBILZ piece is made to order. Production takes{" "}
            <strong className="text-foreground font-medium">14–21 days</strong>, and the delivery
            estimate shown at checkout is counted from the moment your order is ready to ship —
            so total time from payment to arrival is the production period plus the shipping
            duration.
          </p>
          <p>
            Domestic delivery uses our partner couriers through the Biteship integration
            (JNE REG, J&amp;T EZ, SiCepat REG &amp; SiUNT, Pos Indonesia REG, and Gojek
            instant / same-day). International orders are shipped with Pos Indonesia. The
            available options and live rates are calculated for your address at checkout.
          </p>
          <p>
            The tracking number is provided as soon as the parcel is handed over to the courier.
          </p>
        </PolicySection>

        <div className="pt-8">
          <PolicySection title="Returns &amp; Refunds">
            <p>
              All sales are final. We do not accept returns, refunds, or size exchanges for
              change of mind or incorrect size selection. The only exception is a production
              defect or an error on our side.
            </p>
            <p>
              The full conditions, including the unboxing-video requirement for defect claims,
              are set out on the{" "}
              <a href="/refund-policy" className="text-foreground underline underline-offset-4">
                Return &amp; Refund Policy
              </a>{" "}
              page, which is the authoritative version.
            </p>
          </PolicySection>
        </div>

        <div className="pt-8">
          <PolicySection title="Payment">
            <p>
              All transactions are processed securely through the{" "}
              <strong className="text-foreground font-medium">Duitku Payment Gateway</strong>. We
              accept a wide range of payment methods, including bank and virtual account
              transfers, e-wallets, QRIS, credit cards, and retail outlet payments. The methods
              currently available to you are shown at checkout.
            </p>
          </PolicySection>
        </div>
      </div>
    </div>
  );
}
