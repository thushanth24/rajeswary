import { Layout } from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | Raajeshwariy Groups</title>
        <meta name="description" content="Privacy policy for Raajeshwariy Groups website and online booking services." />
        <link rel="canonical" href="https://raajeshwariygroups.com/privacy-policy" />
      </Helmet>

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6 text-sm">Last updated: March 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/90">
          <p>
            <strong>Raajeshwariy Groups of Company</strong> ("we", "us", or "our") operates the website <strong>raajeshwariygroups.com</strong>. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our website and booking services.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, phone number, postal address — provided when you make a booking enquiry or contact us.</li>
            <li><strong>Booking Information:</strong> Event date, event type, number of guests, hall preference, special requests.</li>
            <li><strong>Payment Information:</strong> Payment details are processed securely through our third-party payment gateway, <strong>PayHere (Pvt) Ltd</strong>. We do not store your credit/debit card numbers on our servers.</li>
            <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time spent on the site — collected automatically through cookies and analytics tools.</li>
          </ul>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To process and confirm your hall bookings.</li>
            <li>To communicate with you about your booking, including confirmations, reminders, and updates.</li>
            <li>To process payments securely via PayHere.</li>
            <li>To improve our website, services, and customer experience.</li>
            <li>To respond to your enquiries and support requests.</li>
            <li>To comply with legal obligations.</li>
          </ul>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">3. Third-Party Services</h2>
          <p>
            We use <strong>PayHere</strong> as our payment gateway to process online payments. When you make a payment, your financial information is handled directly by PayHere in accordance with their privacy policy and PCI-DSS compliance standards. We encourage you to review <a href="https://www.payhere.lk/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">PayHere's Privacy Policy</a>.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">4. Cookies</h2>
          <p>
            Our website uses cookies to enhance your browsing experience. Cookies are small data files stored on your device. We use cookies for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Session management and authentication.</li>
            <li>Remembering your language preference (English/Tamil).</li>
            <li>Analytics to understand how visitors use our website.</li>
          </ul>
          <p>You can disable cookies through your browser settings, though this may affect website functionality.</p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">6. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. Booking records are retained for a minimum of 3 years for business and legal compliance purposes.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your personal data (subject to legal obligations).</li>
            <li>Withdraw consent for marketing communications at any time.</li>
          </ul>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8">8. Contact Us</h2>
          <p>For any questions about this Privacy Policy or your personal data, please contact us:</p>
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
