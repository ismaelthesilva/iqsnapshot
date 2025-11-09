# The $1 IQ Snapshot - Production MVP

A Next.js 14 conversion-optimized funnel following Russell Brunson's Hook-Story-Offer framework. Users take a 25-question IQ assessment, pay $1 to unlock results (with optional $7 PDF upgrade), and are presented with an affiliate VSL offer.

**Live Domain:** https://iq.ismaelsilva.com

## 🎯 Key Features

- **No Database Required:** All data stored in Stripe payment metadata
- **Brunson-Optimized Funnel:** Hook-Story-Offer landing page, tripwire offer, order bump, OTO
- **A/B Testing:** Environment-driven variants for price disclosure, headlines, and VSL
- **Security-First:** Webhook signature verification, server-only secrets, input validation, rate limiting
- **Stripe Checkout:** $1 base + $7 order bump, idempotency keys, metadata persistence
- **Email Delivery:** Automated result emails via Resend + webhook integration
- **Mobile-First UI:** Tailwind CSS + shadcn/ui components

## 📁 Project Structure

```
iqsnapshot/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx              # Landing page with HSO copy
│   ├── test/
│   │   └── page.tsx              # 25-question quiz with progress
│   ├── results/
│   │   └── page.tsx              # Results + VSL offer page
│   ├── legal/
│   │   ├── terms/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── affiliate-disclosure/page.tsx
│   ├── api/
│   │   ├── checkout/route.ts     # Create Stripe Checkout Session
│   │   ├── results/route.ts      # Fetch results from Stripe metadata
│   │   └── stripe/
│   │       └── webhook/route.ts  # Handle payment completion, send email
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── checkbox.tsx
│   │   └── progress.tsx
│   ├── quiz/
│   │   └── quiz-question.tsx     # Individual question component
│   ├── paywall-modal.tsx         # $1 unlock + $7 order bump
│   └── footer.tsx
├── lib/
│   ├── stripe.ts                 # Stripe client (server-only)
│   ├── scoring.ts                # 25 questions + scoring logic
│   ├── email.ts                  # Resend email builder
│   ├── copy.ts                   # HSO copy variants
│   ├── ab.ts                     # A/B test variant helpers
│   └── utils.ts                  # cn() helper
├── emails/
│   ├── README.md
│   └── templates/
│       ├── day-1-followup.html   # Follow-up email templates
│       └── day-3-followup.html
├── .env.local.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Stripe account (test mode)
- Resend account
- Vercel account (for deployment)

### 1. Clone and Install

```bash
cd iqsnapshot
npm install
```

### 2. Environment Setup

Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

**Required Environment Variables:**

```env
# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=                   # Optional: pre-created $1 price
STRIPE_BUMP_PRICE_ID=              # Optional: pre-created $7 price

# Resend (get from https://resend.com/api-keys)
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@ismaelsilva.com

# Affiliate VSL
AFFILIATE_VSL_URL=https://example.com/course?aff=123

# JWT Secret (optional, for result tokens)
RESULT_JWT_SECRET=min-32-character-secret

# A/B Testing Flags
PRICE_DISCLOSURE_MODE=upfront      # upfront | soft
HEADLINE_VARIANT=A                 # A | B
VSL_HEADLINE_VARIANT=A             # A | B
```

### 3. Set Up Stripe Webhook (Local Development)

In a new terminal:

```bash
# Install Stripe CLI if needed
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local API
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret (`whsec_...`) to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 5. Test the Flow

1. **Landing Page:** Enter an email and click "Start Your IQ Snapshot"
2. **Quiz:** Answer all 25 questions
3. **Paywall Modal:** Check/uncheck the $7 order bump, click "Unlock My Results for $1"
4. **Stripe Checkout:** Use test card `4242 4242 4242 4242`, any future expiry, any CVC
5. **Results Page:** View your score, percentile, interpretation, and VSL offer
6. **Email:** Check the email address you provided for the result email

## 🌐 Vercel Deployment

### 1. Create New Vercel Project

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow prompts to create a new project.

### 2. Configure Custom Domain

In Vercel dashboard:
1. Go to Project Settings → Domains
2. Add `iq.ismaelsilva.com`
3. Follow DNS configuration instructions

### 3. Set Environment Variables

In Vercel dashboard → Settings → Environment Variables, add all variables from `.env.local.example`:

```
NEXT_PUBLIC_SITE_URL=https://iq.ismaelsilva.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  (production webhook secret, see step 4)
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@ismaelsilva.com
AFFILIATE_VSL_URL=https://...
RESULT_JWT_SECRET=...
PRICE_DISCLOSURE_MODE=upfront
HEADLINE_VARIANT=A
VSL_HEADLINE_VARIANT=A
```

### 4. Configure Production Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://iq.ismaelsilva.com/api/stripe/webhook`
4. Events to send: `checkout.session.completed`
5. Copy the signing secret and update `STRIPE_WEBHOOK_SECRET` in Vercel

### 5. Verify Resend Domain

1. Go to https://resend.com/domains
2. Add `ismaelsilva.com`
3. Add DNS records (SPF, DKIM, DMARC)
4. Verify domain
5. Use `noreply@ismaelsilva.com` as `FROM_EMAIL`

### 6. Deploy

```bash
vercel --prod
```

## 🧪 Testing Checklist

### Local Development

- [ ] Landing page loads with correct headline variant
- [ ] Email capture works, redirects to `/test`
- [ ] All 25 quiz questions render correctly
- [ ] Progress bar updates as questions are answered
- [ ] Paywall modal opens after completing quiz
- [ ] Order bump checkbox toggles total ($1 vs $8)
- [ ] Stripe Checkout creates successfully with test card
- [ ] Redirect to `/results?session_id=...` after payment
- [ ] Results page fetches score from Stripe metadata
- [ ] VSL link includes UTM parameters
- [ ] Result email arrives with correct score
- [ ] Legal pages (/legal/terms, /legal/privacy, /legal/affiliate-disclosure) load

### Production

- [ ] Custom domain (iq.ismaelsilva.com) resolves
- [ ] SSL certificate active (HTTPS)
- [ ] Production Stripe keys in use
- [ ] Webhook receives `checkout.session.completed` events
- [ ] Emails send from verified domain
- [ ] Test complete flow with real card (refund after testing)
- [ ] Affiliate VSL link works and tracks correctly

## 🔒 Security Notes

1. **No Database = Stateless Security**
   - All score data stored in Stripe metadata
   - No server-side session state
   - No persistent storage of PII beyond Stripe/Resend

2. **Server-Only Secrets**
   - `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `STRIPE_WEBHOOK_SECRET` never exposed to client
   - All API routes are server-side only

3. **Webhook Verification**
   - Stripe signature verification on every webhook call
   - Raw body parsing in Node.js runtime
   - Event idempotency tracking

4. **Input Validation**
   - Email validation on frontend and backend
   - Answer validation (correct question IDs, valid option indices)
   - Session ID validation before fetching results

5. **Rate Limiting**
   - Basic in-memory rate limiter on `/api/checkout` (5 requests/minute per IP)
   - Production would use Redis or Vercel Edge Config

6. **Idempotency**
   - Checkout creation uses hash of email + answers + bump flag
   - Prevents duplicate charges for same submission

## 📊 A/B Testing

Controlled via environment variables:

### `PRICE_DISCLOSURE_MODE`
- **`upfront`** (default): Shows "$1 to unlock your results" on landing page
- **`soft`**: Shows price disclosure only at start of quiz

### `HEADLINE_VARIANT`
- **`A`**: "How Smart Are You Compared to Other Americans? Take The $1 IQ Snapshot."
- **`B`**: "7‑Minute IQ Snapshot: Discover Your Score and Percentile for Just $1."

### `VSL_HEADLINE_VARIANT`
- **`A`**: "Boost Your Cognitive Edge in 30 Days — The Science‑Backed System."
- **`B`**: "Turn Your IQ Insights into Daily Performance Gains — Here's How."

Variant data is captured in Stripe metadata for each checkout session.

## 💰 Monetization Flow

1. **Tripwire ($1):** Base IQ result unlock
2. **Order Bump ($7):** Personalized PDF report (checkbox in paywall modal)
3. **OTO (Affiliate):** VSL on results page with commission tracking

**UTM Tracking:**
```
?utm_source=iq-snapshot
&utm_medium=email|web
&utm_campaign={headline_variant}
&session_id={cs_xxx}
```

## 🎨 Brunson Framework Alignment

### Hook
- Curiosity-driven headline with social comparison
- Trust badge ("Trusted by 1,000+ test-takers")
- Clear value proposition

### Story
- "What You'll Discover" section with benefit bullets
- "Why $1?" transparency section
- Trust indicators (Stripe, instant delivery, one-time fee)

### Offer
- Email capture + CTA
- $1 unlock (tripwire)
- $7 order bump (increase AOV)
- VSL OTO on results page (affiliate commission)

## 📧 Email Strategy

### Immediate (Automated)
- **Trigger:** Stripe webhook `checkout.session.completed`
- **Content:** Results + VSL link + affiliate disclosure
- **Delivery:** Resend API via webhook handler

### Follow-Ups (Manual Setup Required)
- **Day 1:** Reinforce VSL offer, provide additional value
- **Day 3:** Last chance reminder, social proof, urgency

Templates located in `emails/templates/`. See `emails/README.md` for implementation options.

## 🛠️ Technical Decisions

### Why No Database?
- **Simplicity:** Fewer moving parts = fewer failure points
- **Security:** No PII storage beyond payment processor
- **Cost:** No database hosting fees
- **Compliance:** Easier GDPR/CCPA compliance (data in Stripe)
- **Scalability:** Stateless architecture scales horizontally

### Why Stripe Metadata?
- Built-in data persistence with payment records
- Automatic PCI compliance
- Stripe's durability and redundancy
- Easy retrieval via session ID

### Why Next.js App Router?
- Server components for better SEO
- API routes with proper Node.js runtime for webhooks
- Built-in optimization (images, fonts)
- Vercel deployment integration

## 🐛 Troubleshooting

### Webhook Not Receiving Events

```bash
# Check webhook signature verification
stripe logs tail

# Verify endpoint URL in Stripe dashboard
# Ensure STRIPE_WEBHOOK_SECRET is correct
```

### Results Not Loading

```bash
# Check session_id in URL
# Verify payment completed in Stripe dashboard
# Check API route logs for errors
```

### Email Not Sending

```bash
# Verify Resend domain is verified
# Check FROM_EMAIL matches verified domain
# Check Resend API logs
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run build
```

## 📝 License

Private project. All rights reserved.

## 🤝 Support

For questions or issues, contact: support@ismaelsilva.com

---

**Built with Next.js 14, Stripe, Resend, Tailwind CSS, and shadcn/ui**
The $1 IQ Snapshot
