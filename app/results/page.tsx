'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { resultsPageCopy, vslHeadlines } from '@/lib/copy'
import { CheckCircle2, ExternalLink } from 'lucide-react'
import Footer from '@/components/footer'

interface ResultData {
  iqScore: number
  rawScore: number
  percentile: number
  band: string
  interpretation: string
  email: string
  bump: boolean
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [result, setResult] = useState<ResultData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const vslVariant: 'A' | 'B' =
    (process.env.NEXT_PUBLIC_VSL_HEADLINE_VARIANT as 'A' | 'B') || 'A'

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided')
      setIsLoading(false)
      return
    }

    const fetchResults = async () => {
      try {
        const response = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch results')
        }

        if (!data.paid) {
          throw new Error('Payment not completed')
        }

        setResult(data.result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">{error || 'Could not load results'}</p>
          <Button onClick={() => (window.location.href = '/')}>Return Home</Button>
        </div>
      </div>
    )
  }

  const affiliateVslUrl =
    process.env.NEXT_PUBLIC_AFFILIATE_VSL_URL || 'https://example.com/course'
  const vslUrl = `${affiliateVslUrl}${affiliateVslUrl.includes('?') ? '&' : '?'}utm_source=iq-snapshot&utm_medium=web&utm_campaign=${vslVariant}&session_id=${sessionId}`

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        {/* Results Section */}
        <div className="max-w-4xl mx-auto">
          {/* Congratulations Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <CheckCircle2 className="h-4 w-4" />
              {resultsPageCopy.congratulations}
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Your IQ Snapshot Results</h1>
          </div>

          {/* Score Display */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-8 text-center">
            <div className="mb-4">
              <div className="text-6xl md:text-7xl font-bold text-blue-600">{result.iqScore}</div>
              <div className="text-xl font-semibold text-gray-700 mt-2">{result.band}</div>
              <div className="text-gray-600 mt-2">
                Higher than approximately {result.percentile}% of test-takers
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 text-left mt-6">
              <h3 className="font-semibold text-lg mb-2">What This Means:</h3>
              <p className="text-gray-700">{result.interpretation}</p>
            </div>

            {result.bump && (
              <div className="bg-blue-100 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-900">
                  📄 Your personalized PDF report will be sent to {result.email} within 24 hours.
                </p>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-lg p-6 mb-12 text-sm text-gray-600">
            <strong>Disclaimer:</strong> {resultsPageCopy.disclosure}
          </div>

          {/* VSL Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8 border-2 border-blue-200">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{vslHeadlines[vslVariant]}</h2>
              <p className="text-lg text-gray-600">{resultsPageCopy.vslIntro}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-xl mb-4">What You&apos;ll Discover:</h3>
              <ul className="space-y-3">
                {resultsPageCopy.vslBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <Button size="xl" asChild className="text-lg px-12">
                <a href={vslUrl} target="_blank" rel="noopener noreferrer">
                  {resultsPageCopy.vslCta} <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <p className="text-xs text-gray-500 mt-4">Opens in new window • Free to watch</p>
            </div>
          </div>

          {/* Affiliate Disclosure */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-sm text-gray-700">
            <strong>Affiliate Disclosure:</strong> {resultsPageCopy.affiliateDisclosure}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
