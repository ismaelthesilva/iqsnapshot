'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/header'
import { landingPage, headlines } from '@/lib/copy'
import { Lock, CheckCircle2, Shield, Clock } from 'lucide-react'
import Footer from '@/components/footer'

export default function LandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get headline variant from env (would be server-side in production)
  const headlineVariant: 'A' | 'B' =
    (process.env.NEXT_PUBLIC_HEADLINE_VARIANT as 'A' | 'B') || 'A'
  const priceDisclosure =
    (process.env.NEXT_PUBLIC_PRICE_DISCLOSURE_MODE as 'upfront' | 'soft') || 'upfront'

  const handleStart = () => {
    if (email && email.includes('@')) {
      sessionStorage.setItem('userEmail', email)
      router.push('/test')
    } else {
      alert('Please enter a valid email address')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <CheckCircle2 className="h-4 w-4" />
              {landingPage.hook.trustBadge}
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {headlines[headlineVariant]}
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-8">{landingPage.hook.subtitle}</p>

            {priceDisclosure === 'upfront' && (
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg text-sm font-medium mb-8">
                <span className="text-2xl font-bold">$1</span>
                <span>to unlock your results</span>
              </div>
            )}

            {/* Email Capture */}
            <div className="max-w-md mx-auto mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 text-lg"
                  disabled={isSubmitting}
                />
                <Button
                  size="lg"
                  onClick={handleStart}
                  disabled={isSubmitting}
                  className="h-12 px-8 text-lg"
                >
                  {landingPage.offer.cta}
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" />
              {landingPage.offer.guarantee}
            </p>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What You&apos;ll Discover</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {landingPage.story.whatYouGet.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why $1 Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Why $1?</h2>
            <p className="text-lg text-gray-700 text-center">{landingPage.story.whyOneDollar}</p>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">100% Secure</h3>
                <p className="text-sm text-gray-600">
                  Payments processed through Stripe. We never see your card details.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">Instant Delivery</h3>
                <p className="text-sm text-gray-600">
                  Get your results immediately on-screen and via email.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle2 className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">One-Time Fee</h3>
                <p className="text-sm text-gray-600">No subscriptions. No recurring charges. Just $1.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Discover Your IQ?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join 1,000+ people who&apos;ve already taken their IQ Snapshot.
            </p>
            <div className="max-w-md mx-auto mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 text-lg"
                />
                <Button size="lg" onClick={handleStart} className="h-12 px-8 text-lg">
                  Start Now
                </Button>
              </div>
            </div>
            {priceDisclosure === 'upfront' && (
              <p className="text-sm text-gray-500 mt-4">{landingPage.offer.priceDisclosure}</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
