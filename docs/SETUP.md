# The $1 IQ Snapshot - Quick Start Guide

## What You've Got

A complete, production-ready Next.js 14 funnel optimized with Russell Brunson's conversion frameworks:

- ✅ **Landing page** with Hook-Story-Offer copy
- ✅ **25-question IQ quiz** with progress tracking
- ✅ **$1 paywall** with $7 order bump
- ✅ **Stripe Checkout** integration
- ✅ **Results page** with VSL affiliate offer
- ✅ **Automated email** delivery via Resend
- ✅ **Legal pages** (Terms, Privacy, Affiliate Disclosure)
- ✅ **A/B testing** via environment flags
- ✅ **No database** (all data in Stripe metadata)

## 5-Minute Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your keys:

```env
# Required
STRIPE_SECRET_KEY=sk_test_...          # From https://dashboard.stripe.com/test/apikeys
RESEND_API_KEY=re_...                  # From https://resend.com/api-keys
FROM_EMAIL=noreply@ismaelsilva.com     # Must be verified in Resend
AFFILIATE_VSL_URL=https://...          # Your affiliate link
```

### 3. Start Stripe Webhook Listener

In a **new terminal**:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook secret (`whsec_...`) and add to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Run Development Server

```bash
npm run dev
```

Visit **http://localhost:3000**

### 5. Test the Flow

1. Enter your email on the landing page
2. Answer all 25 quiz questions
3. Click "Unlock My Results for $1"
4. Use test card: `4242 4242 4242 4242`
5. Check your email for results!

## Deploy to Vercel

```bash
vercel

# Set environment variables in Vercel dashboard
# Configure production Stripe webhook
# Verify Resend domain

vercel --prod
```

See **README.md** for full deployment instructions.

## File Structure

```
app/
  (marketing)/page.tsx      → Landing page
  test/page.tsx             → Quiz
  results/page.tsx          → Results + VSL
  api/
    checkout/route.ts       → Create Stripe session
    results/route.ts        → Fetch results
    stripe/webhook/route.ts → Handle payment

lib/
  stripe.ts        → Stripe client
  scoring.ts       → 25 questions + scoring
  email.ts         → Resend integration
  copy.ts          → Marketing copy variants
  ab.ts            → A/B test helpers

components/
  ui/              → shadcn/ui components
  quiz/            → Quiz components
  paywall-modal    → $1 + $7 order bump
  footer           → Legal links
```

## Key Features

### No Database
All score data stored in Stripe metadata. No need for Postgres, MongoDB, etc.

### Webhook-Based Email
Payment completion triggers webhook → sends result email via Resend.

### A/B Testing
```env
PRICE_DISCLOSURE_MODE=upfront|soft
HEADLINE_VARIANT=A|B
VSL_HEADLINE_VARIANT=A|B
```

### Security
- Server-only secrets
- Webhook signature verification
- Input validation
- Rate limiting
- Idempotency keys

## Support

- **Documentation**: See `README.md`
- **Implementation Notes**: See `IMPLEMENTATION_NOTES.md`
- **Email Templates**: See `emails/README.md`

---

**Built with Next.js 14 • Stripe • Resend • Tailwind CSS • shadcn/ui**
