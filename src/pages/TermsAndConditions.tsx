import { Layout } from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";

export default function TermsAndConditions() {
  return (
    <Layout>
      <Helmet>
        <title>Terms & Conditions | Raajeshwariy Groups</title>
        <meta name="description" content="Terms and conditions for booking wedding halls and services at Raajeshwariy Groups, Jaffna." />
        <link rel="canonical" href="https://raajeshwariygroups.com/terms-and-conditions" />
      </Helmet>

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-8">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-6 text-sm">Last updated: March 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/90">
          <p>
            Welcome to <strong>Raajeshwariy Groups of Company</strong>. By using our website (<strong>raajeshwariygroups.com</strong>) and booking our services, you agree to the following terms and conditions. Please read them carefully.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">1. Booking & Reservation</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>A booking is considered confirmed only after receipt of the required advance payment.</li>
            <li>Booking requests submitted through the website are enquiries until confirmed by our team and payment is received.</li>
            <li>Availability is subject to change until the booking is officially confirmed.</li>
            <li>The customer must provide accurate personal and event details at the time of booking.</li>
          </ul>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">2. Payment Terms</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Advance payments can be made online via <strong>PayHere</strong> or through other accepted payment methods.</li>
            <li>The balance payment must be settled before or on the day of the event, as agreed.</li>
            <li>All prices are quoted in <strong>Sri Lankan Rupees (LKR)</strong> unless otherwise stated.</li>
            <li>Prices are subject to change without prior notice for new bookings. Confirmed bookings will honour the agreed price.</li>
          </ul>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">3. Cancellation & Refunds</h2>
          <p>
            Cancellation and refund terms are outlined in our <a href="/refund-policy" className="text-primary underline">Refund Policy</a>. By making a booking, you acknowledge and agree to the cancellation terms specified therein.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">4. Venue Usage Rules</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>The venue must be used only for the purpose specified in the booking (e.g., wedding, reception, religious ceremony).</li>
            <li>The customer is responsible for the conduct of all guests and attendees during the event.</li>
            <li>Any damage to the property, equipment, or furnishings caused by the customer or their guests will be charged to the customer.</li>
            <li>Decorations must not damage walls, ceilings, or fixtures. Use of nails, screws, or adhesives on venue surfaces is prohibited without prior approval.</li>
            <li>The venue must be vacated by the agreed end time. Extended usage will incur additional charges.</li>
            <li>Alcohol consumption and smoking are <strong>strictly prohibited</strong> inside all Raajeshwariy Groups venues.</li>
          </ul>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">5. Liability</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Raajeshwariy Groups is not liable for loss or damage to personal belongings of customers or their guests.</li>
            <li>We are not responsible for delays or service disruptions caused by circumstances beyond our control (force majeure), including but not limited to natural disasters, government restrictions, or utility failures.</li>
            <li>The customer assumes responsibility for obtaining any necessary permits or approvals for their event.</li>
          </ul>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">6. Additional Services</h2>
          <p>
            Raajeshwariy Groups offers additional services such as decoration, catering, photography, and music through our network of partners. These services are subject to separate terms and availability. Charges for additional services are over and above the hall rental fee.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">7. Intellectual Property</h2>
          <p>
            All content on this website — including text, images, logos, and design — is the property of Raajeshwariy Groups of Company and is protected by copyright law. Unauthorized reproduction or distribution is prohibited.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of <strong>Sri Lanka</strong>. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Jaffna, Sri Lanka.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">9. Changes to Terms</h2>
          <p>
            We reserve the right to update these terms and conditions at any time. Changes will be effective immediately upon posting on this page. Continued use of our website and services constitutes acceptance of the updated terms.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">10. Contact Us</h2>
          <p>For any questions regarding these Terms & Conditions, please contact us:</p>
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
