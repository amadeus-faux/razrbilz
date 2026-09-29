import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/terms",
  title: "Terms of Service",
  description:
    "Terms of use for the RAZRBILZ store: our pre-order production model, prices in IDR, payment through Duitku, delivery and risk, cancellations, warranty, and consumer dispute resolution under Indonesian law.",
});

export default function TermsOfServicePage() {
  return (
    <article className="space-y-12">
      {/* Page header */}
      <header className="space-y-3 pb-8 border-b border-border">
        <h1 className="text-page-heading">Terms of Service</h1>
        <p className="text-[11px] text-muted tracking-wide">
          Terms of use for the RAZRBILZ store and all orders placed through it.
          Last updated: 29 September 2026.
        </p>
      </header>

      {/* Body */}
      <div className="space-y-10 prose-policy">
        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            1. Who We Are and How to Reach Us
          </h2>
          <p>
            RAZRBILZ CREATIVE STUDIO operates the online store at
            https://razrbilz.id (the &ldquo;Site&rdquo;). We sell apparel
            produced in limited, made-to-order batches.
          </p>
          <ul>
            <li>
              <strong>Business name:</strong> RAZRBILZ CREATIVE STUDIO
            </li>
            <li>
              <strong>Legal form:</strong> LLC
            </li>
            <li>
              <strong>Address:</strong> West Bandung, West Java, Indonesia
            </li>
            <li>
              <strong>Customer service and complaints:</strong>{" "}
              <a href="mailto:support@razrbilz.id">support@razrbilz.id</a>
            </li>
            <li>
              <strong>General enquiries:</strong>{" "}
              <a href="mailto:razrbilz@gmail.com">razrbilz@gmail.com</a>
            </li>
            <li>
              <strong>Online complaint form:</strong>{" "}
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
          <p>
            You may reach us through these channels at any point before, during,
            or after your Order.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            2. Definitions
          </h2>
          <p>In these Terms:</p>
          <ul>
            <li>
              <strong>&ldquo;Order&rdquo;</strong> means a request you submit
              through the Site to purchase one or more Products.
            </li>
            <li>
              <strong>&ldquo;Product&rdquo;</strong> means any item we list for
              sale on the Site.
            </li>
            <li>
              <strong>&ldquo;Pre-Order&rdquo;</strong> means an Order for a
              Product that is not held in finished stock and is produced only
              after your payment is confirmed.
            </li>
            <li>
              <strong>&ldquo;Production Window&rdquo;</strong> means the 14–21
              day period in which we expect to produce your Product after
              payment is confirmed.
            </li>
            <li>
              <strong>&ldquo;Confirmation&rdquo;</strong> means the point at
              which we accept your Order, evidenced by an order confirmation
              email or by dispatch of your parcel.
            </li>
            <li>
              <strong>&ldquo;Content&rdquo;</strong> means text, images,
              designs, logos, photography, and any other material on the Site.
            </li>
            <li>
              <strong>&ldquo;Personal Data&rdquo;</strong> has the meaning given
              in our <a href="/privacy-policy">Privacy Policy</a>.
            </li>
            <li>
              <strong>&ldquo;Consumer&rdquo;</strong> means you as an individual
              acting for purposes that are outside your trade, business, or
              profession.
            </li>
            <li>
              <strong>&ldquo;Business Buyer&rdquo;</strong> means you acting for
              purposes relating to your trade, business, or profession,
              including reselling.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            3. Acceptance of These Terms
          </h2>
          <p>
            By using the Site or placing an Order, you agree to these Terms. If
            you do not agree, do not use the Site or place an Order.
          </p>
          <p>These Terms sit alongside two other documents, which apply to your Order:</p>
          <ul>
            <li>
              our <a href="/refund-policy">Return &amp; Refund Policy</a>, which
              is the single source of truth on returns and refunds; and
            </li>
            <li>
              our <a href="/privacy-policy">Privacy Policy</a>, which explains
              how we handle your Personal Data.
            </li>
          </ul>
          <p>
            Nothing in these Terms removes or limits a right you have as a
            consumer under Indonesian law that cannot lawfully be excluded. If
            any clause here conflicts with a mandatory provision of law, that
            clause does not apply and the rest of these Terms continue in force.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            4. Who May Use the Site
          </h2>
          <ul>
            <li>
              You must be at least 18 years old, or acting with the consent and
              under the supervision of a parent or legal guardian, to place an
              Order. Indonesian law does not treat a contract entered into by a
              person who is not legally competent as enforceable.
            </li>
            <li>
              You confirm the details you give us are accurate and that you are
              authorised to use the payment method you select.
            </li>
            <li>
              You may buy Products for personal use. We also allow small-scale
              resale, subject to Section 8.
            </li>
            <li>
              We may refuse an Order or restrict access to the Site where we
              have reasonable grounds, including suspected fraud, repeated
              abuse of returns, or a breach of Section 14. Where it is
              reasonable and lawful to do so, we will tell you why and give you
              a chance to respond before we act.
            </li>
            <li>
              You are responsible for checking that your own local laws allow
              you to use the Site and import our Products.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            5. Product Information, Images, and Sizing
          </h2>
          <ul>
            <li>
              Every Product is described on its page, including the sizes
              available. Some descriptions mention a fabric or a weight; read
              Section 13 for what that does and does not mean. We aim to make
              our descriptions accurate and complete, and we do not describe a
              Product as something it is not.
            </li>
            <li>
              Colours on your screen depend on your device. The colour you see
              may differ from the colour of the garment you receive.
            </li>
            <li>
              Sizes are one of the few things about an Order you cannot change
              later, so please check the{" "}
              <a href="/size-guide">Size Guide</a> before you order.
              Measurements on a finished garment can vary from the Size Guide by
              up to <strong>2 cm</strong> per point of measure; that tolerance
              is normal for cut-and-sew production and is not a defect.
            </li>
            <li>
              Because Products are made in batches, a garment from a later batch
              can differ slightly from the photographed sample.
            </li>
            <li>
              Stock indicators and availability estimates are our best current
              expectation, not a guarantee.
            </li>
            <li>
              Product pages and prices may be changed or removed at any time
              before you place an Order. Once your Order is Confirmed, the
              description and price that applied at that moment govern that
              Order.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            6. Prices
          </h2>
          <ul>
            <li>
              All prices are in Indonesian Rupiah (IDR). We do not take orders
              in another currency.
            </li>
            <li>
              The price you pay is the price shown for the Product and the
              shipping option when you confirm your Order.
            </li>
            <li>
              Any foreign-currency figure shown on the Site is an estimate
              converted at a reference rate. Your card issuer, e-wallet, or bank
              applies its own rate and may apply its own fees. We charge in IDR.
            </li>
            <li>
              Shipping is calculated at checkout and shown separately before you
              pay.
            </li>
            <li>
              <strong>Promotions and vouchers.</strong> We do not currently run
              promotional codes, vouchers, or discounts, and no such feature
              exists on the Site. If we introduce one, its validity period,
              minimum spend, exclusions, and one-use or multi-use limits will be
              stated at the point we offer it. A promotion code that is not
              applied before payment is completed cannot be applied afterwards.
            </li>
            <li>
              If we cancel an Order for a reason in Section 10, we refund the
              full amount you paid, including shipping. We do not charge a
              cancellation fee.
            </li>
          </ul>
          <p>
            <strong>Price errors.</strong> If a Product is listed at a price
            that is obviously wrong because of a typographical, technical, or
            sync error, we will contact you as soon as we find it and may cancel
            the Order and refund anything you have paid. We will not silently
            cancel and leave the refund for you to chase, and we will not hold
            you to a price that no reasonable person would consider to be our
            genuine asking price.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            7. Ordering and When a Contract Is Formed
          </h2>
          <p>
            Presenting a Product on the Site is an invitation to place an Order,
            not a binding offer from us. The contract is formed as follows:
          </p>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>
              You add Products to your cart and submit an Order. Your Order is
              your offer to buy.
            </li>
            <li>
              We send an email acknowledging receipt. An acknowledgement is not
              acceptance.
            </li>
            <li>
              We accept your offer when we confirm the Order by email after your
              payment is confirmed, or when we dispatch the parcel, whichever
              comes first.
            </li>
            <li>Until acceptance, either of us may step back from the transaction.</li>
          </ol>
          <p>
            If we neither confirm nor cancel your Order within 14 days of
            receiving your payment, you may treat the Order as cancelled and we
            will refund you in full.
          </p>
          <p>
            Use of automated ordering tools, scripts, or &ldquo;order
            bots&rdquo; to place Orders is prohibited.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            8. Quantity Limits and Reselling
          </h2>
          <ul>
            <li>
              You may order a maximum of <strong>5 units of any single Product</strong>{" "}
              in one Order. This limit is enforced on our side and counts all
              sizes of that Product together. Five units of one shirt across
              three sizes is allowed; six units is not.
            </li>
            <li>
              There is no limit on the total number of different Products in an
              Order.
            </li>
            <li>
              You may resell Products you have bought, provided you stay within
              the per-Product limit above and you sell the garment as it is.
              Beyond that scale, ordering through the Site is not the right
              channel for you, and we may cancel such an Order and refund you.
            </li>
            <li>
              If you resell, you may describe and photograph the physical item
              you are selling. You may not present yourself as an official or
              authorised RAZRBILZ stockist, use our wordmark or logo as your own
              branding, or modify our labels or designs.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            9. The Pre-Order Model and Production Time
          </h2>
          <p>This is the most important thing to understand about ordering from us.</p>
          <ul>
            <li>
              Every Product is made to order. We do not hold finished stock.
              Production begins only after your payment is confirmed.
            </li>
            <li>
              Our Production Window is{" "}
              <strong>14–21 days after payment is confirmed</strong>.
            </li>
            <li>
              The arrival estimate shown at checkout is the Production Window
              plus the courier&rsquo;s transit time for the service you
              selected. It is an estimate, not a guaranteed delivery date.
            </li>
            <li>
              If production will run beyond the Production Window, we will tell
              you before the window ends and give you a choice: continue to
              wait, or cancel the Order and receive a full refund including
              shipping. We will not extend the deadline and keep your money.
            </li>
            <li>
              If we cannot produce the Product at all, for example because a
              fabric supplier fails us or a batch does not meet our standard, we
              will tell you and refund you in full.
            </li>
            <li>
              Delays caused by the courier or by customs are handled under
              Section 11 and Section 12.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            10. Payment
          </h2>
          <ul>
            <li>
              Payment is taken through Duitku, our payment provider. The methods
              available to you are the ones Duitku makes available at checkout
              and may change over time. They currently include QRIS, e-wallets,
              bank virtual accounts, retail outlet payment, and cards.
            </li>
            <li>
              Payment is due in full before production starts. We do not offer
              instalments, deposits, or cash on delivery.
            </li>
            <li>
              An unpaid Order expires automatically <strong>60 minutes</strong>{" "}
              after it is created, so reserved stock is not held indefinitely. If
              you still want the items, you can place a new Order, subject to
              availability at that time.
            </li>
            <li>
              Card numbers and bank credentials are handled by Duitku. We do not
              store them on our servers. We keep your Order details, the amount,
              and the payment status.
            </li>
            <li>
              If a payment is reversed, disputed, or turns out to be
              unauthorised, we may cancel the Order and we will not ship until
              the position is resolved.
            </li>
            <li>
              If you paid through a retail outlet or a bank transfer method, we
              mark the Order as paid only when Duitku confirms receipt of the
              funds.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            11. Shipping and Delivery
          </h2>
          <ul>
            <li>
              The courier services offered to you at checkout are the ones we
              use on your route. The one you select is the one we ship with.
            </li>
            <li>
              Parcels are dispatched after production is complete. Tracking
              details are sent to you by email when the parcel is handed to the
              courier.
            </li>
            <li>
              Delivery timeframes quoted by couriers are estimates. Couriers may
              add or remove services, and remote areas can take longer.
            </li>
            <li>
              <strong>Risk of loss.</strong> We bear the risk that the parcel is
              lost or damaged in transit until it is delivered to the address you
              gave us. If a parcel is lost, or arrives damaged, contact us and we
              will resolve it by reshipping or by refunding you. This does not
              apply if you receive the parcel, sign for it, and it is lost or
              stolen afterwards.
            </li>
            <li>
              <strong>Wrong or incomplete address.</strong> If the address you
              gave us is wrong, incomplete, or undeliverable, tell us as soon as
              you notice. We will try to correct it or redirect the parcel at
              actual cost, and we will not charge you more than we actually pay
              to fix it. If the parcel is returned to us because of an address
              error on your side, we will refund the Product price once we have
              it back; we may deduct the additional shipping we actually
              incurred.
            </li>
            <li>
              <strong>Refusal or non-collection.</strong> If you refuse a parcel
              or do not collect it from the courier, tell us. Without a
              communication from you, a refusal is not treated as a cancellation,
              and we will contact you to settle what happens next before we take
              any money back or charge anything.
            </li>
            <li>
              <strong>International orders.</strong> You are the importer of
              record. Customs duties, import taxes, and any broker or handling
              charges in the destination country are entirely your
              responsibility and are not included in what you pay us. Customs
              clearance is outside our control and can add time to delivery. If
              you refuse a parcel because of duties you were not expecting, we
              will refund the Product price minus the real additional costs we
              incur, and we will give you an itemised breakdown of those costs
              rather than a flat deduction.
            </li>
            <li>
              We keep the courier&rsquo;s proof of delivery and tracking record
              on file for a limited period. Keep your confirmation email as your
              own copy.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            12. Cancellation, Changes, Returns, Exchanges and Refunds
          </h2>
          <p>
            <strong>Changing or cancelling before production starts.</strong>{" "}
            Contact us through the <a href="/contact">Contact Us</a> page as soon
            as possible. If production has not started, you may cancel and we
            will refund you in full.
          </p>
          <p>
            <strong>Once production has started.</strong> Because each Product is
            cut and made specifically for your Order, the Order can no longer be
            changed or cancelled. Requests after that point are handled on a
            best-effort basis and are not guaranteed.
          </p>
          <p>
            Production has started when your Order is released to our production
            partner and the garment begins to be made. That is when cutting or
            sewing of your pieces commences. It is not the date we send a
            confirmation email, and not the date the parcel is handed to the
            courier. Before that point, your cancellation is effective. We will
            tell you on request which side of that line your Order is on.
          </p>
          <p>
            <strong>Returns and refunds.</strong> These are governed by our{" "}
            <a href="/refund-policy">Return &amp; Refund Policy</a>, and that
            page is the authoritative version. In short: all sales are final,
            because a made-to-order garment cannot be restocked. The one
            exception is a defect or an error on our side, in which case we take
            full responsibility and cover the associated costs.
          </p>
          <p>
            <strong>Your legal rights are not affected.</strong> This section
            does not exclude our responsibility for a Product that is defective,
            not as described, or not what you ordered. Nor does it exclude our
            liability for our own negligence. A clause that did so would have no
            legal effect, and we have not written one. We may need to see
            evidence of a defect in order to act on it quickly; see the Return
            &amp; Refund Policy for what we ask for.
          </p>
          <p>
            <strong>How refunds are paid.</strong> We refund through the same
            channel you paid us through. The time it takes to appear in your
            account depends on Duitku, your bank, or your e-wallet provider, and
            is not something we control. We do not deduct a restocking or
            administrative fee.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            13. Warranty
          </h2>
          <p>
            We are responsible for manufacturing defects present in the Product
            at the time you receive it, and for sending you what you actually
            ordered.
          </p>
          <p>
            <strong>Materials and care information.</strong> We do not print a
            fibre-composition or care label on our garments, and we do not
            publish composition or washing instructions on Product pages. Where
            a Product description names a fabric, a weight, or a finish, that is
            our own description of the batch as we understand it. It is not a
            laboratory certification, and it is not a promise that a garment
            from a later batch is identical in hand or measurement. We tell you
            this plainly rather than let you assume a label exists.
          </p>
          <p>
            If you have a fabric or dye allergy, or if you need composition or
            washing information before you buy, email{" "}
            <a href="mailto:support@razrbilz.id">support@razrbilz.id</a> and ask
            before you order. If we cannot answer you before you need to pay, do
            not order.
          </p>
          <p>
            Wash cold, inside out, do not bleach, do not tumble dry, and do not
            iron directly over a printed area. Garments that are pre-shrunk and
            garment-dyed can still shrink or shift in colour with heat and
            agitation.
          </p>
          <p>
            We do not offer an extended warranty, a repair service, or spare
            parts. Damage that arises after delivery from misuse, alteration,
            accident, or care that does not follow the guidance above is not a
            manufacturing defect. Normal wear, fading, and change in shape over
            time are not defects.
          </p>
          <p>
            Apparel is not protective equipment. Our garments are not certified
            as personal protective equipment, flame resistant, or suitable for
            any activity where they could impair your safety, and you should not
            buy them for that purpose.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            14. Prohibited Use of the Site
          </h2>
          <p>You agree not to:</p>
          <ul>
            <li>
              break any law, or use the Site for anything unlawful, fraudulent,
              or deceptive;
            </li>
            <li>infringe our rights or anyone else&rsquo;s intellectual property rights;</li>
            <li>
              scrape, crawl, or harvest product data, prices, or content from
              the Site;
            </li>
            <li>use automated tools to place, cancel, or manipulate Orders;</li>
            <li>
              attempt to gain unauthorised access to any account, system, or
              data belonging to us or our providers, or to interfere with the
              Site&rsquo;s operation;
            </li>
            <li>introduce malicious code, or overload the Site;</li>
            <li>submit false, misleading, or someone else&rsquo;s details when ordering;</li>
            <li>
              send us abusive, unlawful, or infringing material through the
              Contact page or our email addresses.
            </li>
          </ul>
          <p>
            We may suspend or restrict access to the Site for a breach of this
            section. Where it is reasonable, we will give notice and an
            opportunity to explain first.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            15. Your Cart and the Absence of Accounts
          </h2>
          <p>
            The Site does not have customer accounts. Your cart is stored only in
            the browser you are using, on your own device. If you clear your site
            data, use a different browser or device, or use private browsing,
            your cart will not carry over.
          </p>
          <p>
            Your order confirmation email is the record of your purchase. Keep
            it. If you lose it, we can still help you, but we will need to find
            your Order from the email address and details you give us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            16. Intellectual Property
          </h2>
          <p>
            All Content on the Site belongs to us or is used by us under
            licence. That includes the RAZRBILZ wordmark and logos, our apparel
            designs, graphics, typography, product photography, page layout, and
            text. It is protected by Indonesian copyright and trademark law and
            by international treaties.
          </p>
          <p>
            You may browse the Site, and you may copy or print parts of it for
            your own personal use or to place and record an Order. You may not
            republish, sell, distribute, modify, or incorporate our Content into
            your own products, marketing, or business without our written
            permission.
          </p>
          <p>
            Buying a garment gives you ownership of that physical item. It does
            not transfer any rights in the design printed on it, and it does not
            make you our agent, distributor, employee, or partner.
          </p>
          <p>
            We will not treat your personal, non-commercial repost of a photo you
            took of a garment you bought as infringement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            17. Material You Send Us
          </h2>
          <p>
            Anything you send us is treated as confidential to the extent it is
            your own Personal Data, which we handle under our{" "}
            <a href="/privacy-policy">Privacy Policy</a>. This covers messages
            sent through the Contact page, notes attached to an Order, and email
            to our addresses.
          </p>
          <p>
            We may use your message to reply to you, process your Order,
            investigate an issue, and keep records of the transaction. We will
            not publish your name, your words, or your photographs on the Site or
            in our marketing without your separate written permission.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            18. Disclaimer
          </h2>
          <p>
            The Site is provided as it is and as available. We do not promise
            that it will be uninterrupted, error-free, secure, or that any
            particular Product will always be available, at a particular price,
            or in a particular size.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            19. Liability
          </h2>
          <p>
            <strong>What we do not exclude.</strong> Nothing in these Terms
            limits or excludes our liability for:
          </p>
          <ul>
            <li>death or personal injury caused by our negligence;</li>
            <li>fraud or fraudulent misrepresentation;</li>
            <li>
              a Product that does not match its description or that was defective
              when you received it;
            </li>
            <li>our failure to supply the goods you paid for;</li>
            <li>anything else that cannot lawfully be excluded or limited.</li>
          </ul>
          <p>
            <strong>What we do limit.</strong> Where the law allows us to, we are
            not liable for indirect or consequential loss arising from your use
            of the Site, such as lost profits, lost data, loss of business
            opportunity, or loss of goodwill. Our total liability for any claim
            connected to an Order is limited to the amount you paid for that
            Order.
          </p>
          <p>
            <strong>Carriers, customs, and payment providers.</strong> We are not
            liable for the acts of couriers, customs authorities, or payment
            providers where the cause is outside our control. We are, however,
            responsible for choosing them reasonably and for passing on what they
            tell us. If you are injured by a Product, or a Product presents a
            genuine safety risk, tell us immediately and stop using it. Nothing
            here limits our responsibility for placing a defective Product into
            circulation.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            20. Force Majeure
          </h2>
          <p>
            Neither of us is liable for a failure or delay in performing an
            obligation caused by an event outside that party&rsquo;s reasonable
            control (a &ldquo;Force Majeure Event&rdquo;). This includes natural
            disasters, fire, flood, landslide, earthquake, epidemic, war,
            terrorism, civil unrest, labour disputes affecting suppliers or
            couriers, government or regulatory action, import or export
            restrictions, sanctions, power or internet failure, telecommunications
            failure, and outage of a payment, hosting, or shipping provider we
            depend on.
          </p>
          <p>If a Force Majeure Event affects your Order:</p>
          <ul>
            <li>
              we will tell you as soon as we reasonably can, and at least once
              while the event continues;
            </li>
            <li>our obligation is suspended only for as long as the event lasts;</li>
            <li>
              if the event prevents dispatch for more than 30 days beyond the end
              of the Production Window, you may cancel and we will refund you in
              full, including shipping;
            </li>
            <li>
              a Force Majeure Event is never a reason for us to keep money you
              have already paid for goods you did not receive.
            </li>
          </ul>
          <p>
            Force Majeure does not excuse us from responsibility for a defect
            that was already present in your Product, and it does not cover our
            own financial hardship or a supplier we could reasonably have
            replaced.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            21. Changes to These Terms
          </h2>
          <p>
            We may update these Terms. When we do, we will revise the &ldquo;Last
            updated&rdquo; date at the top of this page and post the current
            version here, so you can always read the version in force.
          </p>
          <ul>
            <li>A changed version applies to Orders placed after it is posted.</li>
            <li>
              The version in force when you placed your Order continues to govern
              that Order. We will not apply a new clause to an Order you have
              already placed in a way that makes your position worse.
            </li>
            <li>
              If a change materially affects an Order that is already in
              production, we will email you about it before it takes effect.
            </li>
            <li>
              If you do not agree to a change, you can stop using the Site, and
              you may cancel an Order that has not yet entered production.
            </li>
          </ul>
          <p>
            We will not bind you to new, additional, or amended rules that we
            invent while you are already using a service you have paid for.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            22. Privacy
          </h2>
          <p>
            Our collection, use, sharing, and retention of your Personal Data is
            described in our <a href="/privacy-policy">Privacy Policy</a>, which
            forms part of these Terms. Please read it. In short: we collect what
            we need to take your Order, deliver it, and answer you; we do not
            send marketing email; we do not run advertising pixels; and our
            payment provider, not us, handles your card or bank credentials.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            23. Governing Law and Dispute Resolution
          </h2>
          <p>These Terms are governed by Indonesian law.</p>
          <p>
            If something goes wrong, please talk to us first. Most problems are
            resolved there, and it is faster for both of us.
          </p>
          <p>
            <strong>Step 1: Contact us.</strong> Write to{" "}
            <a href="mailto:support@razrbilz.id">support@razrbilz.id</a> or use
            the <a href="/contact">Contact Us</a> page. Include your Order
            number, what you believe went wrong, and what you would like us to do
            about it. We will acknowledge and try to resolve it directly.
          </p>
          <p>
            <strong>Step 2: Out-of-court settlement.</strong> If we cannot
            settle it between us, you may as a consumer bring the dispute to a{" "}
            <strong>Badan Penyelesaian Sengketa Konsumen (BPSK)</strong>. BPSK is
            the consumer dispute settlement body at regency or city level. It
            handles consumer disputes outside court by mediation, conciliation,
            or arbitration. Going to BPSK does not remove your other legal
            remedies.
          </p>
          <p>
            <strong>Step 3: Court.</strong> Either of us may bring proceedings
            in an Indonesian court. As a consumer, you may file at the court in
            your own place of residence, and nothing in these Terms takes that
            choice away from you.
          </p>
          <p>
            <strong>Business Buyers.</strong> Where you order as a Business
            Buyer, the dispute-resolution steps above still apply, and the
            appropriate Indonesian court will have jurisdiction according to the
            rules of Indonesian procedural law.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            24. Complaints
          </h2>
          <p>
            We take complaints seriously and would rather hear one than have it
            become a dispute.
          </p>
          <ul>
            <li>
              Send a complaint to{" "}
              <a href="mailto:support@razrbilz.id">support@razrbilz.id</a> or
              through the <a href="/contact">Contact Us</a> page.
            </li>
            <li>
              Tell us your Order number, the Product, what went wrong, when, and
              the outcome you want.
            </li>
            <li>
              Photographs, and any courier or payment evidence you have, help us
              resolve it faster.
            </li>
            <li>
              We acknowledge and reply to a complaint within <strong>3 days</strong>{" "}
              of receiving it. That reply will tell you what we found, what we
              will do, and by when. If we need something from you first, it will
              say exactly what.
            </li>
            <li>
              If your complaint is about your Personal Data, the{" "}
              <a href="/privacy-policy">Privacy Policy</a> sets out how to raise
              it and how we respond.
            </li>
          </ul>
          <p>
            Three days is our commitment to get back to you. It is not a deadline
            by which the issue is necessarily closed.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            25. General
          </h2>
          <ul>
            <li>
              <strong>Severability.</strong> If a court or the consumer dispute
              body finds any part of these Terms invalid or unenforceable, that
              part is treated as severed or adjusted to the minimum extent needed,
              and the rest continues to apply. We will amend an offending clause
              rather than rely on it.
            </li>
            <li>
              <strong>No waiver.</strong> If we do not enforce a clause at one
              point, that is not a waiver of our right to enforce it later.
            </li>
            <li>
              <strong>Entire agreement.</strong> These Terms, together with the
              Return &amp; Refund Policy and the Privacy Policy, are the whole
              agreement between us about your Order. They supersede anything said
              or written before, including our own earlier versions of this page.
              Statements on the Site about Products are descriptions, not
              promises that override the terms of the Order you actually placed.
            </li>
            <li>
              <strong>Assignment.</strong> You may not transfer your rights or
              obligations under these Terms. We may transfer them to a successor
              to our business, and we will tell you if that happens.
            </li>
            <li>
              <strong>Survival.</strong> Sections 16, 17, 19, and 23 survive the
              end of these Terms or your use of the Site.
            </li>
            <li>
              <strong>Third parties.</strong> Our couriers, payment provider,
              hosting providers, and other service providers act as independent
              contractors. Nothing in these Terms makes you their customer or
              gives you rights against them, except as consumer law or the
              relevant service&rsquo;s own terms allow.
            </li>
            <li>
              <strong>Links.</strong> The Site may link to third-party websites.
              We are not responsible for their content or their terms.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            26. Contact
          </h2>
          <p>Questions about these Terms, or a problem with an Order:</p>
          <ul>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
            <li>
              <a href="mailto:support@razrbilz.id">support@razrbilz.id</a>
            </li>
            <li>
              RAZRBILZ CREATIVE STUDIO, West Bandung, West Java, Indonesia
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
}
