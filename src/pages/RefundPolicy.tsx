import { Layout } from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";

export default function RefundPolicy() {
  return (
    <Layout>
      <Helmet>
        <title>Refund Policy | Raajeshwariy Groups</title>
        <meta name="description" content="Refund and cancellation policy for wedding hall bookings at Raajeshwariy Groups, Jaffna." />
        <link rel="canonical" href="https://raajeshwariygroups.com/refund-policy" />
      </Helmet>

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-8">Refund Policy</h1>
        <p className="text-muted-foreground mb-6 text-sm">Last updated: March 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/90">
          <p>
            Thank you for choosing <strong>Raajeshwariy Groups of Company</strong> for your wedding and event needs. This Refund Policy outlines the terms under which refunds are processed for hall bookings and related services.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">1. Advance Payment</h2>
          <p>
            All hall bookings require an advance payment to confirm the reservation. The advance amount varies depending on the hall, event type, and date. Bookings are only confirmed upon receipt of the advance payment through our accepted payment methods, including online payments via <strong>PayHere</strong>.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">2. Cancellation by the Customer</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>More than 30 days before the event date:</strong> A refund of 50% of the advance payment will be processed. The remaining 50% will be retained as a cancellation fee.
            </li>
            <li>
              <strong>15–30 days before the event date:</strong> A refund of 25% of the advance payment will be processed.
            </li>
            <li>
              <strong>Less than 15 days before the event date:</strong> No refund will be provided. The full advance payment is non-refundable.
            </li>
          </ul>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">3. Cancellation by Raajeshwariy Groups</h2>
          <p>
            In the unlikely event that Raajeshwariy Groups cancels a confirmed booking due to unforeseen circumstances (e.g., natural disasters, structural emergencies), a <strong>full refund</strong> of the advance payment will be processed within 14 business days. We will also make reasonable efforts to offer an alternative date or venue.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">4. Date Changes & Rescheduling</h2>
          <p>
            Customers may request to reschedule their event to an alternative available date at no additional charge, subject to availability. Rescheduling requests must be made at least <strong>15 days</strong> before the original event date. Only one reschedule is permitted per booking.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">5. Refund Method</h2>
          <p>
            Refunds will be processed through the original payment method. For payments made via PayHere, the refund will be credited back to the same payment source (bank account, card, or mobile wallet) within <strong>7–14 business days</strong> after the refund is approved.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">6. Non-Refundable Scenarios</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>No-show on the event date without prior cancellation notice.</li>
            <li>Cancellations made less than 15 days before the event.</li>
            <li>Additional services (decoration, catering, photography) already arranged by third-party vendors on behalf of the customer.</li>
          </ul>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">7. Contact Us</h2>
          <p>
            For refund requests or questions regarding this policy, please contact us:
          </p>
          <ul className="list-none space-y-1">
            <li><strong>Raajeshwariy Groups of Company</strong></li>
            <li>132, Palali Road, Kondavil, Jaffna</li>
            <li>Phone: +94 77 022 8820</li>
            <li>Email: info@raajeshwariygroups.com</li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}
