import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { stripe, STRIPE_PRICE_ID, STRIPE_BUMP_PRICE_ID } from '@/lib/stripe'
import { scoreAnswers, validateAnswers } from '@/lib/scoring'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

interface CheckoutRequest {
  email: string
  answers: Record<string, string>
  bump?: boolean
  utm?: {
    source?: string
    medium?: string
    campaign?: string
  }
  variants?: {
    priceDisclosure?: string
    headline?: string
    vslHeadline?: string
  }
}

// Simple in-memory rate limiter (production would use Redis)
const rateLimiter = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimiter.get(ip)

  if (!limit || now > limit.resetAt) {
    rateLimiter.set(ip, { count: 1, resetAt: now + 60000 }) // 1 minute window
    return true
  }

  if (limit.count >= 5) {
    return false // Max 5 requests per minute
  }

  limit.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body: CheckoutRequest = await req.json()
    const { email, answers, bump = false, utm = {}, variants = {} } = body

    // Normalize and validate email
    const normalizedEmail = email?.toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 })
    }

    if (!validateAnswers(answers)) {
      return NextResponse.json({ error: 'Incomplete or invalid answers' }, { status: 400 })
    }

    // Score the answers
    const scoreResult = scoreAnswers(answers)

    // Create idempotency key with timestamp to allow retries
    const normalizedAnswers = JSON.stringify(
      Object.keys(answers)
        .sort()
        .reduce((acc, key) => ({ ...acc, [key]: answers[key] }), {})
    )
    const timestamp = Date.now()
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(`${normalizedEmail}-${normalizedAnswers}-${bump}-${timestamp}`)
      .digest('hex')
      .substring(0, 32)

    // Build line items
    const lineItems: Array<{
      price?: string
      price_data?: {
        currency: string
        unit_amount: number
        product_data: { name: string; description?: string }
      }
      quantity: number
    }> = []

    // Main IQ Snapshot result ($1)
    if (STRIPE_PRICE_ID) {
      lineItems.push({ price: STRIPE_PRICE_ID, quantity: 1 })
    } else {
      lineItems.push({
        price_data: {
          currency: 'usd',
          unit_amount: 100, // $1.00
          product_data: {
            name: 'IQ Snapshot Result',
            description: 'Personalized IQ score, percentile, and interpretation',
          },
        },
        quantity: 1,
      })
    }

    // Order bump: Personalized PDF Report ($5)
    if (bump) {
      if (STRIPE_BUMP_PRICE_ID) {
        lineItems.push({ price: STRIPE_BUMP_PRICE_ID, quantity: 1 })
      } else {
        lineItems.push({
          price_data: {
            currency: 'usd',
            unit_amount: 500, // $5.00
            product_data: {
              name: 'Personalized PDF Report',
              description: 'Detailed breakdown with charts and actionable insights',
            },
          },
          quantity: 1,
        })
      }
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: normalizedEmail,
        // Note: allow_promotion_codes has limited support with price_data
        // For full coupon support, use STRIPE_PRICE_ID instead of price_data
        allow_promotion_codes: true,
        line_items: lineItems,
        success_url: `${SITE_URL}/results?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_URL}/test`,
        metadata: {
          email: normalizedEmail,
          iqScore: scoreResult.iqScore.toString(),
          rawScore: scoreResult.rawScore.toString(),
          percentile: scoreResult.percentile.toString(),
          band: scoreResult.band,
          bump: bump.toString(),
        },
        // Explicitly set currency for coupon compatibility
        currency: 'usd',
      },
      {
        idempotencyKey,
      }
    )

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    console.error('Checkout error:', error)

    // More specific error handling for Stripe errors
    if (error && typeof error === 'object' && 'type' in error) {
      const stripeError = error as { type: string; message: string; statusCode?: number }
      return NextResponse.json(
        { error: `Stripe error: ${stripeError.message}` },
        { status: stripeError.statusCode || 500 }
      )
    }

    const message = error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
