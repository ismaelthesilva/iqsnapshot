import Link from 'next/link'
import Footer from '@/components/footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-blue">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>

          <h1>Privacy Policy</h1>
          <p className="text-gray-600">Last updated: November 7, 2025</p>

          <h2>1. Information We Collect</h2>
          <h3>Information You Provide</h3>
          <ul>
            <li>Email address</li>
            <li>Quiz answers</li>
            <li>Payment information (processed and stored by Stripe; we do not store card details)</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Usage data and analytics</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Process your payment and deliver your results</li>
            <li>Send your results via email</li>
            <li>Improve our service and user experience</li>
            <li>Communicate with you about the service</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>3. Data Storage and Security</h2>
          <ul>
            <li>
              Your score results are stored in Stripe&apos;s secure payment metadata and are not stored
              in a separate database.
            </li>
            <li>We use industry-standard security measures to protect your data.</li>
            <li>Payment processing is handled by Stripe, which is PCI DSS Level 1 certified.</li>
            <li>All data transmission is encrypted using SSL/TLS.</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with:</p>
          <ul>
            <li>
              <strong>Stripe:</strong> For payment processing
            </li>
            <li>
              <strong>Resend:</strong> For email delivery
            </li>
            <li>
              <strong>Legal authorities:</strong> If required by law or to protect our rights
            </li>
          </ul>

          <h2>5. Cookies and Tracking</h2>
          <p>
            We use minimal tracking technologies to improve the service. We may use analytics tools
            to understand user behavior and improve the service.
          </p>

          <h2>6. Third-Party Links</h2>
          <p>
            Our service may contain links to third-party websites (including affiliate links). We
            are not responsible for the privacy practices of these sites.
          </p>

          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request correction of your data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
          <p>To exercise these rights, contact us at privacy@ismaelsilva.com</p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our service is not intended for children under 18. We do not knowingly collect data from
            children under 18.
          </p>

          <h2>9. Data Retention</h2>
          <p>
            We retain your data for as long as necessary to provide the service and comply with
            legal obligations. Result data is stored in Stripe metadata for payment records.
          </p>

          <h2>10. International Users</h2>
          <p>
            If you are accessing the service from outside the United States, your data may be
            transferred to and stored in the United States.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes
            by posting the new policy on this page.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            For privacy-related questions or requests, contact us at privacy@ismaelsilva.com
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
