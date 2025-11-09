import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID
export const STRIPE_BUMP_PRICE_ID = process.env.STRIPE_BUMP_PRICE_ID
