import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

interface ResultsRequest {
  session_id: string
}

export async function POST(req: NextRequest) {
  try {
    const body: ResultsRequest = await req.json()
    const { session_id } = body

    if (!session_id || !session_id.startsWith('cs_')) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 })
    }

    // Retrieve the Checkout Session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['payment_intent'],
    })

    // Verify payment status
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed', paid: false },
        { status: 402 }
      )
    }

    // Extract score data from metadata
    const metadata =
      session.payment_intent && typeof session.payment_intent !== 'string'
        ? session.payment_intent.metadata
        : session.metadata

    if (!metadata || !metadata.iqScore) {
      return NextResponse.json(
        { error: 'Result data not found' },
        { status: 404 }
      )
    }

    // Return the score result
    return NextResponse.json({
      paid: true,
      result: {
        iqScore: parseInt(metadata.iqScore, 10),
        rawScore: parseInt(metadata.rawScore || '0', 10),
        percentile: parseInt(metadata.percentile, 10),
        band: metadata.band,
        interpretation: metadata.interpretation,
        email: metadata.email,
        bump: metadata.bump === 'true',
      },
    })
  } catch (error: unknown) {
    console.error('Results fetch error:', error)
    const message = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
