import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { sendResultEmail } from '@/lib/email'

export const runtime = 'nodejs' // Required for raw body access

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!
const AFFILIATE_VSL_URL =
  process.env.AFFILIATE_VSL_URL || 'https://example.com/course?aff=123'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Track processed events to prevent duplicates
const processedEvents = new Set<string>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('No stripe signature found')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('Webhook signature verification failed:', message)
      return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
    }

    // Idempotency check
    if (processedEvents.has(event.id)) {
      console.log('Event already processed:', event.id)
      return NextResponse.json({ received: true })
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Verify payment is completed
      if (session.payment_status === 'paid') {
        // Expand payment intent to get metadata
        const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['payment_intent'],
        })

        const metadata =
          expandedSession.payment_intent &&
          typeof expandedSession.payment_intent !== 'string'
            ? expandedSession.payment_intent.metadata
            : expandedSession.metadata

        if (metadata && metadata.email && metadata.iqScore) {
          // Build VSL URL with UTM params
          const vslUrl = new URL(AFFILIATE_VSL_URL)
          vslUrl.searchParams.set('utm_source', 'iq-snapshot')
          vslUrl.searchParams.set('utm_medium', 'email')
          vslUrl.searchParams.set('utm_campaign', metadata.headline || 'A')
          vslUrl.searchParams.set('session_id', session.id)

          // Send result email
          await sendResultEmail({
            email: metadata.email,
            iqScore: parseInt(metadata.iqScore, 10),
            percentile: parseInt(metadata.percentile, 10),
            band: metadata.band,
            interpretation: metadata.interpretation,
            vslUrl: vslUrl.toString(),
          })

          console.log('Result email sent to:', metadata.email)
          processedEvents.add(event.id)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    console.error('Webhook handler error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
