import Link from 'next/link'
import Footer from '@/components/footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-blue">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>

          <h1>Terms of Service</h1>
          <p className="text-gray-600">Last updated: November 7, 2025</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using The $1 IQ Snapshot ("Service"), you accept and agree to be bound
            by the terms and provision of this agreement.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            The $1 IQ Snapshot provides an educational cognitive assessment consisting of 25
            multiple-choice questions. Upon payment of $1, users receive a personalized result
            including an estimated IQ score, percentile ranking, and interpretation.
          </p>

          <h2>3. Important Disclaimers</h2>
          <ul>
            <li>
              <strong>Not a Clinical Assessment:</strong> This is an educational tool designed for
              entertainment and informational purposes only. It is NOT a clinical diagnostic tool
              and should not be used for medical, educational placement, or employment decisions.
            </li>
            <li>
              <strong>Accuracy:</strong> Results are estimates based on a limited question set and
              should not be considered definitive or scientifically validated IQ scores.
            </li>
            <li>
              <strong>Age and Eligibility:</strong> Users must be 18 years or older, or have
              parental consent to use this service.
            </li>
          </ul>

          <h2>4. Payment Terms</h2>
          <ul>
            <li>The base service fee is $1.00 USD (one-time payment).</li>
            <li>Optional upgrade: Personalized PDF Report for $7.00 USD (one-time payment).</li>
            <li>All payments are processed securely through Stripe.</li>
            <li>No refunds are provided after results are delivered.</li>
            <li>No recurring charges or subscriptions.</li>
          </ul>

          <h2>5. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the service for any unlawful purpose</li>
            <li>Attempt to reverse engineer or copy the assessment questions</li>
            <li>Misrepresent results as clinically validated IQ scores</li>
            <li>Share your account or results with others for commercial purposes</li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>
            All content, questions, scoring algorithms, and materials are the property of The $1 IQ
            Snapshot and are protected by copyright and intellectual property laws.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, The $1 IQ Snapshot shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages resulting from your
            use of the service.
          </p>

          <h2>8. Privacy</h2>
          <p>
            Your use of the service is also governed by our{' '}
            <Link href="/legal/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the service
            after changes constitutes acceptance of the new terms.
          </p>

          <h2>10. Contact</h2>
          <p>For questions about these terms, please contact us at support@ismaelsilva.com</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
