import Stripe from 'stripe'

// Initialize Stripe lazily at runtime to avoid build-time errors
let stripeInstance: Stripe | null = null

function getStripe() {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  }
  return stripeInstance
}

export const stripe = new Proxy({} as Stripe, {
  get: (target, prop) => {
    const stripe = getStripe()
    return stripe[prop as keyof Stripe]
  }
})

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID
export const STRIPE_BUMP_PRICE_ID = process.env.STRIPE_BUMP_PRICE_ID
