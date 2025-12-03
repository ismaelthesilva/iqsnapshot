# The $1 IQ Snapshot - Security & Implementation Notes

## Architecture Decisions

### No Database Rationale
1. **Stripe as Database**: Payment metadata stores all score data
2. **Stateless Architecture**: No server-side sessions
3. **Simplified Compliance**: PII only in Stripe (PCI-compliant)
4. **Cost Efficiency**: No database hosting fees
5. **Instant Scalability**: Vercel Edge functions are stateless

### Data Flow
```
User answers quiz
    → POST /api/checkout with { email, answers, bump, utm, variants }
    → Server scores answers (lib/scoring.ts)
    → Creates Stripe Checkout Session with metadata
    → User pays via Stripe
    → Stripe webhook fires checkout.session.completed
    → POST /api/stripe/webhook verifies signature
    → Sends result email via Resend
    → User lands on /results?session_id=cs_xxx
    → POST /api/results fetches from Stripe metadata
    → Renders score + VSL offer
```

## Security Measures

### 1. Server-Only Secrets
- All API keys (`STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `STRIPE_WEBHOOK_SECRET`) are server-only
- Never exposed to client via `NEXT_PUBLIC_` prefix
- Used only in API routes and server components

### 2. Webhook Verification
```typescript
// Verify Stripe signature on every webhook call
const signature = headers.get('stripe-signature')
const event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
```

### 3. Input Validation
- Email: Regex + format check
- Answers: Validate all 25 questions answered, valid option indices
- Session ID: Must start with `cs_` prefix

### 4. Idempotency
```typescript
// Hash of email + normalized answers + bump flag
const idempotencyKey = crypto
  .createHash('sha256')
  .update(`${email}-${normalizedAnswers}-${bump}`)
  .digest('hex')
  .substring(0, 32)
```
Prevents duplicate charges if user resubmits same quiz.

### 5. Rate Limiting
```typescript
// Simple in-memory limiter (production would use Redis)
// Max 5 checkout requests per minute per IP
if (!checkRateLimit(ip)) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
}
```

### 6. Webhook Idempotency
```typescript
// Track processed Stripe event IDs
const processedEvents = new Set<string>()
if (processedEvents.has(event.id)) {
  return NextResponse.json({ received: true })
}
```

## Stripe Integration

### Checkout Session Creation
```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [
    { price: 'price_xxx', quantity: 1 },  // $1 base
    { price: 'price_yyy', quantity: 1 },  // $7 bump (if selected)
  ],
  success_url: `${SITE_URL}/results?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${SITE_URL}/test`,
  customer_email: email,
  payment_intent_data: {
    metadata: {
      email, iqScore, rawScore, percentile, band, interpretation,
      bump, utm_source, utm_medium, utm_campaign,
      headline_variant, vsl_headline_variant, price_disclosure_mode
    }
  },
  metadata: { email, iqScore, rawScore, percentile, band, bump }
}, { idempotencyKey })
```

### Metadata Storage Strategy
- **PaymentIntent metadata**: Full score payload + UTM + variants
- **Session metadata**: Minimal data (email, score, bump)
- **Why both?**: Session metadata always available; PaymentIntent has richer data

### Result Retrieval
```typescript
const session = await stripe.checkout.sessions.retrieve(session_id, {
  expand: ['payment_intent']
})

// Check payment_intent metadata first, fallback to session metadata
const metadata = session.payment_intent?.metadata || session.metadata
```

## Scoring Algorithm

```typescript
// 25 questions, mean raw score = 12.5, SD = 4.0
const zScore = (rawScore - 12.5) / 4.0
const iqScore = Math.round(100 + zScore * 15)
// Clamp to [70, 145]
```

**Interpretation Bands:**
- < 85: Below Average (16th percentile)
- 85-99: Average (42nd percentile)
- 100-114: Above Average (75th percentile)
- 115-129: Superior (90th percentile)
- 130+: Very Superior (98th percentile)

## A/B Testing Implementation

### Environment-Driven Variants
```typescript
// lib/ab.ts
export function getActiveVariants(): VariantData {
  return {
    priceDisclosure: process.env.PRICE_DISCLOSURE_MODE || 'upfront',
    headline: process.env.HEADLINE_VARIANT || 'A',
    vslHeadline: process.env.VSL_HEADLINE_VARIANT || 'A',
  }
}
```

### Variant Tracking
All variants stored in Stripe metadata:
```json
{
  "headline_variant": "A",
  "vsl_headline_variant": "B",
  "price_disclosure_mode": "upfront",
  "utm_source": "iq-snapshot",
  "utm_medium": "email",
  "utm_campaign": "A"
}
```

Retrieve from Stripe for analytics:
```bash
stripe payment_intents list --limit 100 \
  | jq '.data[] | {id, metadata}'
```

## Email Delivery

### Immediate (Webhook-Triggered)
```typescript
// /api/stripe/webhook/route.ts
if (event.type === 'checkout.session.completed') {
  const metadata = expandedSession.payment_intent.metadata
  
  const vslUrl = new URL(AFFILIATE_VSL_URL)
  vslUrl.searchParams.set('utm_source', 'iq-snapshot')
  vslUrl.searchParams.set('utm_medium', 'email')
  vslUrl.searchParams.set('utm_campaign', metadata.headline)
  vslUrl.searchParams.set('session_id', session.id)
  
  await sendResultEmail({
    email: metadata.email,
    iqScore: parseInt(metadata.iqScore, 10),
    percentile: parseInt(metadata.percentile, 10),
    band: metadata.band,
    interpretation: metadata.interpretation,
    vslUrl: vslUrl.toString(),
  })
}
```

### Follow-Ups (Manual Setup)
Templates in `emails/templates/`:
- `day-1-followup.html`: Reinforce VSL offer
- `day-3-followup.html`: Last chance, social proof

Implementation options:
1. Resend Audiences + Sequences
2. ConvertKit/Mailchimp integration via webhook
3. Custom cron job + database (if adding later)

## Conversion Optimization (Brunson Framework)

### Landing Page (Hook-Story-Offer)
1. **Hook**: Curiosity headline + trust badge
2. **Story**: "What You Get" bullets + "Why $1?" transparency
3. **Offer**: Email capture + CTA + price disclosure

### Quiz Page (Micro-Commitments)
- Progress bar creates commitment
- Optional price reminder (soft mode)
- Instant feedback on answer selection

### Paywall Modal (Tripwire + Order Bump)
- $1 base offer (low friction)
- $7 order bump (increase AOV by 8x)
- Trust badges (Stripe, SSL, cards accepted)
- Clear value bullets

### Results Page (OTO)
- Score reveal + validation
- VSL above-the-fold
- Benefit bullets + risk reversal
- Affiliate disclosure

## Production Deployment Checklist

### Pre-Deployment
- [ ] Switch to Stripe live keys
- [ ] Update `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Verify Resend domain (SPF, DKIM, DMARC records)
- [ ] Set all environment variables in Vercel
- [ ] Test webhook endpoint is publicly accessible

### Post-Deployment
- [ ] Configure Stripe production webhook
- [ ] Test complete flow with real card (refund after)
- [ ] Verify email delivery
- [ ] Check analytics tracking (if implemented)
- [ ] Monitor Stripe + Vercel logs for errors

### Ongoing
- [ ] Weekly: Check Stripe webhook delivery logs
- [ ] Weekly: Monitor email bounce/spam rates in Resend
- [ ] Monthly: Review Stripe dispute rate
- [ ] Monthly: Analyze variant performance in metadata

## Performance Optimizations

### Next.js App Router
- Server components for static content
- Client components only where needed (`'use client'`)
- Automatic code splitting
- Font optimization via `next/font/google`

### Vercel Edge Functions
- Global CDN deployment
- Instant cold starts
- Automatic scaling
- Built-in DDoS protection

### Image Optimization
- None required (no images in MVP)
- If adding: use `next/image` for automatic optimization

## Compliance Notes

### FTC Affiliate Disclosure
- Clear disclosure on results page
- Disclosure in email footer
- Dedicated `/legal/affiliate-disclosure` page

### Terms of Service
- Clear "not a clinical assessment" disclaimer
- No refunds after delivery
- Age requirement (18+ or parental consent)

### Privacy Policy
- Minimal data collection
- Clear data sharing (Stripe, Resend)
- User rights (access, deletion, opt-out)

### GDPR/CCPA
- Data stored in Stripe (processor agreement)
- Easy deletion via Stripe dashboard
- Opt-out via email unsubscribe

## Future Enhancements (Optional)

### Add Database (if needed)
```typescript
// Prisma schema example
model Purchase {
  id          String   @id @default(cuid())
  email       String
  sessionId   String   @unique
  iqScore     Int
  bump        Boolean
  createdAt   DateTime @default(now())
}
```

### Advanced Analytics
- Segment/Mixpanel for funnel tracking
- Google Analytics 4 for traffic sources
- Hotjar for session recordings

### Email Automation
- Resend Audiences for segmentation
- Automated follow-up sequences
- A/B test email subject lines

### Order Bump Optimization
- Test different price points ($5, $7, $9)
- Test different deliverables (PDF vs video)
- Add countdown timer for urgency

### Additional Upsells
- OTO 2: Course bundle at $97
- Downsell: Mini-course at $27
- Subscription: Monthly cognitive training at $19/mo

---

**Last Updated:** November 7, 2025
