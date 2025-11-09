'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { questions } from '@/lib/scoring'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import QuizQuestion from '@/components/quiz/quiz-question'
import PaywallModal from '@/components/paywall-modal'
import Footer from '@/components/footer'

export default function TestPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showPaywall, setShowPaywall] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('userEmail')
    if (!storedEmail) {
      router.push('/')
    } else {
      setEmail(storedEmail)
    }
  }, [router])

  const progress = (Object.keys(answers).length / questions.length) * 100
  const isComplete = Object.keys(answers).length === questions.length

  const handleAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)

    // Auto-advance to next question
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1)
      }, 300)
    } else if (Object.keys(newAnswers).length === questions.length) {
      // Last question answered - auto-open paywall
      setTimeout(() => {
        setShowPaywall(true)
      }, 500)
    }
  }

  const handleSubmit = () => {
    if (isComplete) {
      setShowPaywall(true)
    }
  }

  const handleCheckout = async (includeBump: boolean, utmParams: Record<string, string>) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          answers,
          bump: includeBump,
          utm: utmParams,
          variants: {
            priceDisclosure: process.env.NEXT_PUBLIC_PRICE_DISCLOSURE_MODE || 'upfront',
            headline: process.env.NEXT_PUBLIC_HEADLINE_VARIANT || 'A',
            vslHeadline: process.env.NEXT_PUBLIC_VSL_HEADLINE_VARIANT || 'A',
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout'
      alert(`Error: ${errorMessage}\n\nPlease try again or contact support if the issue persists.`)
      setIsSubmitting(false)
    }
  }

  if (!email) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {Object.keys(answers).length} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Price Disclosure (if soft mode) */}
          {process.env.NEXT_PUBLIC_PRICE_DISCLOSURE_MODE === 'soft' &&
            currentQuestion === 0 &&
            Object.keys(answers).length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-blue-900">
                  <strong>Results unlock for $1</strong> after you complete all questions.
                </p>
              </div>
            )}

          {/* Current Question */}
          {currentQuestion < questions.length && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <QuizQuestion
                question={questions[currentQuestion]}
                selectedAnswer={answers[questions[currentQuestion].id]}
                onAnswer={handleAnswer}
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            <div className="text-sm text-gray-500">
              {isComplete ? 'All questions answered!' : `${questions.length - Object.keys(answers).length} remaining`}
            </div>

            {currentQuestion < questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                disabled={!answers[questions[currentQuestion].id]}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!isComplete} size="lg">
                See My Results
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onCheckout={handleCheckout}
        isLoading={isSubmitting}
      />
    </div>
  )
}
