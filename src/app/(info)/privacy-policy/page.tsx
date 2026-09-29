import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/privacy-policy",
  title: "Privacy Policy",
  description:
    "What personal data RAZRBILZ collects to fulfil an order, who we share it with (payment and shipping partners), how long we keep it, and how to exercise your rights under Indonesian law.",
});

export default function PrivacyPolicyPage() {
  return (
    <article className="space-y-12">
      {/* Page header */}
      <header className="space-y-3 pb-8 border-b border-border">
        <h1 className="text-page-heading">Privacy Policy</h1>
        <p className="text-[11px] text-muted tracking-wide">
          Protection and governance of RAZRBILZ customer personal data. Last
          updated: 29 September 2026.
        </p>
      </header>

      {/* Body */}
      <div className="space-y-10 prose-policy">
        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            1. Who We Are
          </h2>
          <p>
            RAZRBILZ CREATIVE STUDIO LLC. For the purposes of Indonesian Law No. 27 of
            2022 on Personal Data Protection (the &ldquo;PDP Law&rdquo;), we are
            the data controller of the personal data described in this Policy.
          </p>
          <ul>
            <li>
              <strong>Business name:</strong> RAZRBILZ CREATIVE STUDIO
            </li>
            <li>
              <strong>Address:</strong> West Bandung, West Java, Indonesia
            </li>
            <li>
              <strong>General enquiries:</strong>{" "}
              <a href="mailto:razrbilz@gmail.com">razrbilz@gmail.com</a>
            </li>
            <li>
              <strong>Data protection, data rights and complaints:</strong>{" "}
              <a href="mailto:support@razrbilz.id">support@razrbilz.id</a>
            </li>
          </ul>
          <p>
            This Policy explains what personal data we collect, why we collect
            it, who we share it with, how long we keep it, how we protect it,
            and what rights you have. It applies to the Site and to any message
            you send us about an order.
          </p>
          <p>
            Please read this Policy together with our Terms of Service and our
            Refund Policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            2. What Personal Data We Collect
          </h2>
          <p>
            <strong>2.1 Data you give us directly.</strong> When you place an
            order we collect: first name, last name (optional), email address,
            phone number, country, province or state, street address,
            apartment/unit (optional), district (optional), city, postal code,
            your chosen courier and service, and your chosen payment method.
            When you use the contact form we collect: your name, email address,
            subject, and the message you write. When you make a return or
            refund claim we collect: your order number and any photographs or
            video (for example an unboxing video) that you attach to your
            email.
          </p>
          <p>
            We do not offer customer accounts. We do not ask for, and you
            should never send us, passwords, card numbers, bank account
            credentials, government identification numbers, or data about your
            health, biometrics, genetics, religion, or political views.
          </p>
          <p>
            <strong>2.2 Data about other people.</strong> The delivery details
            you enter at checkout do not have to be your own. If you give us
            the name, address, or phone number of another person as the
            recipient of a parcel, you confirm that you are allowed to share
            that person&rsquo;s data with us and that you have told them we
            will use it to deliver the order.
          </p>
          <p>
            <strong>2.3 Data collected automatically.</strong>
          </p>
          <ul>
            <li>
              <strong>Country of visit.</strong> We set one cookie, named
              user_country, holding a two-letter country code. It is derived
              from your IP address by our hosting provider&rsquo;s geolocation
              header, or from the country you select. It lasts one year. We use
              it to show a reference price in your currency and to display the
              checkout in the right language.
            </li>
            <li>
              <strong>Shopping cart.</strong> The contents of your cart are
              stored in your browser&rsquo;s local storage, on your device.
              They are not sent to us until you check out.
            </li>
            <li>
              <strong>Error reports.</strong> When the Site fails, our error
              monitoring service records the error message, the stack trace,
              the page path, and an internal order number. We have deliberately
              configured it not to record cookies, HTTP headers, request or
              response bodies, URL query parameters, database query values, or
              the values of local variables in the code.
            </li>
            <li>
              <strong>Aggregate analytics.</strong> We use first-party web
              analytics that count page views and visits in aggregate. This
              service does not use cookies, does not build a cross-site profile
              of you, and does not identify you to us.
            </li>
            <li>
              <strong>Server logs.</strong> Our hosting platform keeps standard
              request logs, which may include your IP address, browser type,
              and the time of the request.
            </li>
            <li>
              <strong>Abuse prevention.</strong> When you submit the contact
              form we read your IP address briefly, in server memory only, to
              limit repeated automated submissions. It is not written to our
              database.
            </li>
          </ul>
          <p>
            <strong>2.4 Data we receive from third parties.</strong>
          </p>
          <ul>
            <li>
              From our payment gateway: the payment reference, payment method
              used, virtual account number or QR/payment code, any fee, and the
              payment status.
            </li>
            <li>
              From our shipping aggregator: the tracking number and courier
              status events.
            </li>
            <li>
              From our hosting provider: the country inferred from your IP
              address.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            3. Why We Process Your Data and on What Legal Basis
          </h2>
          <p>
            Under Article 20(2) of the PDP Law, each processing activity must
            rest on a legal basis. Ours are:
          </p>
          <ul>
            <li>
              <strong>Performance of a contract with you (Article
              20(2)(b)):</strong> producing, packing, and handing over your
              order; processing your payment and recording its status;
              arranging delivery and giving you tracking details; answering
              your messages, handling returns and refund claims, and responding
              to warranty questions; showing a reference price in your currency
              and displaying the checkout in the appropriate language.
            </li>
            <li>
              <strong>Compliance with a legal obligation (Article
              20(2)(c)):</strong> keeping accounting records and meeting tax
              obligations.
            </li>
            <li>
              <strong>Our legitimate interest, balanced against your rights
              (Article 20(2)(f)):</strong> detecting and preventing fraud,
              abuse, and automated submission of our forms; keeping the Site
              working and diagnosing failures; understanding, in aggregate, how
              the Site is used.
            </li>
          </ul>
          <p>
            We process data only for these purposes, only as much as is needed
            for them, and we keep it accurate and up to date (Articles 27 to 29
            of the PDP Law).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            4. Consent and Withdrawing It
          </h2>
          <p>
            We do not currently rely on your consent for anything we do. We
            send no promotional email, run no advertising, use no advertising
            cookies, and build no profile of you. Every purpose listed in
            section 3 rests on contract, legal obligation, or legitimate
            interest.
          </p>
          <p>
            If we ever start sending promotional email, we will ask for your
            separate, explicit, recorded consent first (Articles 21 and 22 of
            the PDP Law), we will not pre-tick the box for you, and refusing it
            will not affect your ability to buy from us.
          </p>
          <p>
            Where we do rely on consent, you may withdraw it at any time by
            writing to{" "}
            <a href="mailto:support@razrbilz.id">support@razrbilz.id</a>.
            Withdrawing consent does not make earlier processing unlawful. Once
            we receive a withdrawal request we must stop the relevant
            processing within 3 &times; 24 hours (Article 40(2) of the PDP Law).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            5. Who We Share Your Data With
          </h2>
          <p>
            We share only what each recipient needs to do its job. We never
            sell your personal data, and we never share it with anyone for
            their own advertising.
          </p>
          <ul>
            <li>
              <strong>Payment gateway: Duitku (Indonesia).</strong> Your name,
              email, phone, billing and shipping address, item details, amount,
              and payment method. Duitku processes the payment. We never
              receive your card number or bank credentials.
            </li>
            <li>
              <strong>Shipping: Biteship (Indonesia) and the courier it
              dispatches.</strong> Recipient name, phone, email, full delivery
              address, postal code, delivery note, and the name, value,
              quantity, weight, and dimensions of each item.
            </li>
            <li>
              <strong>Database hosting: Supabase.</strong> Our order, product,
              and settings records. The database is hosted in Singapore.
            </li>
            <li>
              <strong>Site hosting: Vercel.</strong> The Site itself, server
              logs, and first-party aggregate analytics.
            </li>
            <li>
              <strong>Email delivery: Resend.</strong> Transactional email
              only: order confirmation, cancellation notice, and notification
              to us when you use the contact form.
            </li>
            <li>
              <strong>Error monitoring: Sentry.</strong> Error messages, stack
              traces, page paths, and internal identifiers, with personal data
              fields excluded as described in section 2.3.
            </li>
            <li>
              <strong>Professional advisers.</strong> Where we engage an
              accountant or tax adviser, they receive only the records needed
              for accounting and tax filings.
            </li>
            <li>
              <strong>Public authorities.</strong> Where a statute, court
              order, or lawful request obliges us to disclose data.
            </li>
          </ul>
          <p>
            Our shipping and payment providers act as processors for the
            delivery and payment steps and are bound by their own terms and by
            Indonesian law. Where a provider processes data on our instruction,
            we require it to act only on that instruction (Article 51 of the
            PDP Law).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            6. Cookies and Similar Technologies
          </h2>
          <ul>
            <li>
              <strong>user_country: cookie, essential, 1 year.</strong>{" "}
              Remembers your country so prices and the checkout language are
              correct.
            </li>
            <li>
              <strong>Cart contents: browser local storage, until you clear
              it.</strong> Keeps your cart between visits. Stays on your device;
              not sent to us until checkout.
            </li>
            <li>
              <strong>Vercel Web Analytics: first-party analytics, not set by
              us.</strong> Counts visits and page views in aggregate. No
              cookies, no cross-site profile.
            </li>
            <li>
              <strong>Sentry: operational, 90 days.</strong> Records technical
              failures so we can fix them.
            </li>
          </ul>
          <p>
            You can delete or block cookies in your browser settings. If you
            do, the Site still works: we simply re-detect your country from
            your IP address on each visit instead of remembering it. Prices are
            stored and charged in Indonesian Rupiah and are not affected by
            your cookie settings. Blocking cookies does not empty your cart,
            because the cart is kept in local storage rather than in a cookie;
            clearing your browser&rsquo;s site data will.
          </p>
          <p>
            We do not respond to Do Not Track or Global Privacy Control
            signals. This is not an oversight: we run no targeted advertising
            and we do not sell or share personal data for anyone else&rsquo;s
            advertising, so there is nothing for those signals to switch off.
          </p>
          <p>
            We do not currently show a cookie consent banner, because we place
            no advertising or third-party tracking cookies. If that changes,
            this section will change with it.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            7. Transfers of Your Data Outside Indonesia
          </h2>
          <p>
            Some of the services in section 5 are operated outside Indonesia.
            In particular, our database is hosted in Singapore, and our
            hosting, email, and error monitoring providers may process data in
            the United States or in other countries where they operate.
          </p>
          <p>
            Article 56 of the PDP Law permits these transfers and sets a
            hierarchy of safeguards: the receiving country must provide a level
            of protection equal to or higher than the PDP Law (Article 56(2));
            if it does not, there must be adequate and binding protection
            arrangements (Article 56(3)); and if neither is available, the
            controller must obtain the data subject&rsquo;s consent (Article
            56(4)).
          </p>
          <p>
            No adequacy determination covering the countries where our
            providers operate has been issued under Indonesian law at the time
            of writing, so we rely on Article 56(3): adequate and binding
            protection. Each provider named in section 5 is bound by data
            protection terms in our agreement with it that restrict what it may
            do with your data and oblige it to keep your data protected. We
            limit what we send each provider to the minimum it needs. Where
            adequate and binding protection cannot be ensured for a particular
            transfer, we will obtain your consent under Article 56(4) before
            that transfer takes place.
          </p>
          <p>
            You may ask us for further information about the safeguards in
            place for a specific provider by writing to{" "}
            <a href="mailto:support@razrbilz.id">support@razrbilz.id</a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            8. Buyers Outside Indonesia
          </h2>
          <p>
            We ship internationally. If you order from outside Indonesia, your
            personal data is still processed as described in this Policy and is
            subject to Indonesian law, because we are established in Indonesia.
          </p>
          <p>
            The law of the country you live in may give you additional rights
            over your personal data. We do not claim to comply with every
            foreign privacy regime, and this Policy is not written as a GDPR,
            CCPA, or UK GDPR notice. If you believe you have a right under your
            local law that we should honour, write to{" "}
            <a href="mailto:support@razrbilz.id">support@razrbilz.id</a> and we
            will consider your request in good faith.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            9. How Long We Keep Your Data
          </h2>
          <p>
            We keep personal data only as long as it is needed for the purpose
            it was collected for, and no longer, unless a legal retention duty
            requires otherwise.
          </p>
          <ul>
            <li>
              <strong>Order records:</strong> your name, contact details,
              delivery address, items, amounts, courier, payment reference and
              status. We keep them for 10 years from the end of the relevant
              financial year, as required for company records and accounting
              evidence under Article 11(1) of Law No. 8 of 1997 and Indonesian
              tax record-keeping rules.
            </li>
            <li>
              <strong>Contact form messages:</strong> 3 years from the date of
              the last correspondence on the matter.
            </li>
            <li>
              <strong>Return / refund claim material, including any photos or
              video you send:</strong> 3 years from the date the claim is
              closed.
            </li>
            <li>
              <strong>Shipping event logs attached to an order:</strong>{" "}
              retained with the order record.
            </li>
            <li>
              <strong>Error reports:</strong> 90 days from the date of the
              report, per our error monitoring retention setting.
            </li>
            <li>
              <strong>Aggregate analytics:</strong> per the analytics
              provider&rsquo;s own retention policy.
            </li>
            <li>
              <strong>Cart contents in your browser:</strong> until you clear
              your browser storage.
            </li>
          </ul>
          <p>
            When a retention period ends, we delete or destroy the data, or
            anonymise it so it can no longer be linked to you (Articles 43 and
            44 of the PDP Law), and we will notify you that this has been done
            (Article 45).
          </p>
          <p>
            You may ask us to delete your data earlier. We will do so unless we
            are legally required to keep it, for example to complete an order
            in progress, to satisfy the 10-year record-keeping duty above, or
            to handle a dispute. Where we refuse, we will tell you which
            exception applies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            10. How We Protect Your Data
          </h2>
          <p>
            Connections to the Site are encrypted in transit over HTTPS. Our
            measures include, in proportion to the risk:
          </p>
          <ul>
            <li>
              restricting access to order data to authenticated administrator
              users only;
            </li>
            <li>
              holding database and service credentials ourselves and never
              exposing them to the browser;
            </li>
            <li>
              verifying courier status callbacks against a shared secret using
              a timing-safe comparison, so that status updates cannot be
              forged;
            </li>
            <li>
              generating order numbers cryptographically at random, so that one
              customer&rsquo;s order cannot be reached by guessing another
              order&rsquo;s address;
            </li>
            <li>
              validating and length-limiting every field submitted through
              public forms, and rate-limiting the contact form to resist
              automated abuse;
            </li>
            <li>
              configuring our error monitoring service to exclude cookies,
              headers, request bodies, query parameters, database values, and
              local variable values, so that crash reports do not carry your
              name, address, or phone number;
            </li>
            <li>keeping off-site backups of the database.</li>
          </ul>
          <p>
            No security measure is perfect and we cannot promise that data will
            never be intercepted or misused. Please do not send us sensitive
            information through an insecure channel, and tell us promptly if
            you believe your data has been misused.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            11. Your Rights
          </h2>
          <p>
            As a data subject you have the following rights under the PDP Law:
          </p>
          <ul>
            <li>
              to be informed about the identity, legal interest, and purpose of
              the party requesting your data (Article 5);
            </li>
            <li>
              to complete, update, and correct inaccurate or incomplete data
              (Article 6);
            </li>
            <li>to access your data and obtain a copy of it (Article 7);</li>
            <li>to end processing, delete, and/or destroy your data (Article 8);</li>
            <li>to withdraw consent you have given (Article 9);</li>
            <li>
              to object to a decision based solely on automated processing,
              including profiling, that has legal or significant effects for
              you (Article 10);
            </li>
            <li>
              to delay or restrict processing, in proportion to its purpose
              (Article 11);
            </li>
            <li>
              to sue for and receive compensation where processing of your data
              violates the law (Article 12);
            </li>
            <li>
              to receive your data in a commonly used, machine-readable format
              and to send it to another controller where the systems can
              communicate securely (Article 13).
            </li>
          </ul>
          <p>
            <strong>How to make a request.</strong> Email{" "}
            <a href="mailto:support@razrbilz.id">support@razrbilz.id</a> with
            the subject line &ldquo;Data Privacy Request&rdquo;. Include your
            order number if you have one, and say clearly which right you are
            exercising. We may ask you to confirm your identity before we
            respond, and we will use anything you send only to verify you and
            to answer the request. There is no charge. We respond as follows:
          </p>
          <ul>
            <li>
              <strong>Correction or update of your data:</strong> 3 &times; 24
              hours (Article 30(1)).
            </li>
            <li>
              <strong>Access to your data and a copy of it:</strong> 3 &times;
              24 hours (Article 32(2)).
            </li>
            <li>
              <strong>Withdrawal of consent, which stops the
              processing:</strong> 3 &times; 24 hours (Article 40(2)).
            </li>
            <li>
              <strong>Delay or restriction of processing:</strong> 3 &times; 24
              hours (Article 41).
            </li>
            <li>
              <strong>Notification that data has been deleted or
              destroyed:</strong> after we act (Article 45).
            </li>
          </ul>
          <p>
            These rights are not absolute. Articles 15 and 50 of the PDP Law
            allow us to refuse or limit certain requests where necessary for
            national defence and security, law enforcement, the public interest
            in running the state, or supervision of the financial sector. If we
            refuse a request, we will tell you why and which exception applies.
            We will not treat you worse because you exercised a right.
          </p>
          <p>
            <strong>Complaints.</strong> Please contact us first at{" "}
            <a href="mailto:support@razrbilz.id">support@razrbilz.id</a> so that
            we can try to resolve the matter. If you are not satisfied, you may
            complain to the data protection authority established under the PDP
            Law. At the time this Policy was written that authority had not yet
            been formally established. Until it is, you may also direct your
            complaint to the Ministry of Communication and Digital Affairs
            (Kementerian Komunikasi dan Digital, &ldquo;Komdigi&rdquo;), the
            ministry responsible for the digital sector, without prejudice to
            your right to complain to the authority once it exists.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            12. Children&rsquo;s Data
          </h2>
          <p>
            Our products are not marketed to children and we do not knowingly
            collect personal data from children. Under Article 25 of the PDP
            Law, processing a child&rsquo;s personal data requires the consent
            of the child&rsquo;s parent or guardian.
          </p>
          <p>
            If you are under 18, please do not place an order without a parent
            or guardian acting for you. If you are a parent or guardian and
            believe we hold your child&rsquo;s personal data without your
            consent, write to{" "}
            <a href="mailto:support@razrbilz.id">support@razrbilz.id</a>. We
            will verify the situation and delete the data promptly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            13. If There Is a Data Breach
          </h2>
          <p>
            If our protection of your personal data fails, we will notify you
            and the competent authority in writing no later than 3 &times; 24
            hours after we become aware of it, as required by Article 46 of the
            PDP Law. The notification will state at least which personal data
            was disclosed, when and how it was disclosed, and what we are doing
            to handle and recover from it. In certain cases we will also notify
            the public.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            14. Data Protection Officer
          </h2>
          <p>
            We have not formally appointed a Data Protection Officer. For
            questions, data rights requests, or complaints, contact{" "}
            <a href="mailto:support@razrbilz.id">support@razrbilz.id</a>.
          </p>
          <p>
            Article 53(1) of the PDP Law requires a data protection officer
            only where processing serves the public, where core activities
            require regular and systematic monitoring of personal data at large
            scale, or where core activities consist of large-scale processing
            of specific personal data or data relating to criminal offences. We
            have assessed that we do not meet these conditions: we provide no
            public service, we carry out no systematic monitoring, and we do
            not process specific personal data at scale. The payment details we
            keep are references issued by our payment gateway: payment method,
            status, and reference or virtual account codes, together with the
            amount paid. The underlying card or bank account data is held by
            the gateway and never reaches us. We will review this assessment
            whenever our processing changes, and in particular before we start
            processing any category of specific personal data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            15. Links to Other Sites
          </h2>
          <p>
            Completing a purchase takes you to a payment page operated by
            Duitku, and tracking a parcel may take you to a courier&rsquo;s
            site. Those services are run by third parties under their own
            privacy policies, which we do not control. We are not responsible
            for what happens on them.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            16. Changes to This Policy
          </h2>
          <p>
            We may update this Policy to reflect changes in our practices, in
            the law, or in our services. The revised version will be posted on
            this page with a new &ldquo;Last updated&rdquo; date. For changes
            that materially affect your rights, we will give notice on the Site
            and, where the law requires it, by email, before the change takes
            effect. We will not apply a material change retroactively in a way
            that reduces your rights without telling you first.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            17. Contact
          </h2>
          <ul>
            <li>
              <strong>Data protection, data rights, and complaints:</strong>{" "}
              <a href="mailto:support@razrbilz.id">support@razrbilz.id</a>
            </li>
            <li>
              <strong>General business enquiries:</strong>{" "}
              <a href="mailto:razrbilz@gmail.com">razrbilz@gmail.com</a>
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
}
