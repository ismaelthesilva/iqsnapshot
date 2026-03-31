# The $1 IQ Snapshot - Complete File Tree

```
iqsnapshot/
│
├── 📱 APP (Next.js 14 App Router)
│   ├── (marketing)/
│   │   └── page.tsx                  # Landing page with HSO copy, email capture
│   ├── test/
│   │   └── page.tsx                  # 25-question quiz with progress bar
│   ├── results/
│   │   └── page.tsx                  # Score reveal + VSL offer (OTO)
│   ├── legal/
│   │   ├── terms/page.tsx            # Terms of Service
│   │   ├── privacy/page.tsx          # Privacy Policy
│   │   └── affiliate-disclosure/
│   │       └── page.tsx              # FTC-compliant disclosure
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts              # POST: Score answers, create Stripe session
│   │   ├── results/
│   │   │   └── route.ts              # POST: Fetch results from Stripe metadata
│   │   └── stripe/
│   │       └── webhook/
│   │           └── route.ts          # POST: Handle payment, send email (Node.js)
│   ├── globals.css                   # Tailwind base + shadcn/ui variables
│   └── layout.tsx                    # Root layout with Inter font, test mode banner
│
├── 🧩 COMPONENTS
│   ├── ui/                           # shadcn/ui primitives
│   │   ├── button.tsx                # Button with variants (default, outline, etc.)
│   │   ├── input.tsx                 # Text input with focus states
│   │   ├── dialog.tsx                # Modal dialog with overlay
│   │   ├── checkbox.tsx              # Checkbox with Radix UI
│   │   └── progress.tsx              # Progress bar
│   ├── quiz/
│   │   └── quiz-question.tsx         # Question card with option selection
│   ├── paywall-modal.tsx             # $1 unlock + $7 order bump checkbox
│   └── footer.tsx                    # Legal links footer
│
├── 📚 LIB (Business Logic)
│   ├── stripe.ts                     # Stripe client (server-only)
│   ├── scoring.ts                    # 25 IQ questions + scoring algorithm
│   ├── email.ts                      # Resend client + result email builder
│   ├── copy.ts                       # Marketing copy (headlines, bullets, VSL)
│   ├── ab.ts                         # A/B test variant helpers
│   └── utils.ts                      # cn() for className merging
│
├── 📧 EMAILS
│   ├── README.md                     # Email implementation guide
│   └── templates/
│       ├── day-1-followup.html       # Follow-up email (VSL reinforce)
│       └── day-3-followup.html       # Last chance email (urgency)
│
├── ⚙️  CONFIG FILES
│   ├── package.json                  # Dependencies (Next, Stripe, Resend, etc.)
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tailwind.config.ts            # Tailwind + shadcn/ui theme
│   ├── postcss.config.js             # PostCSS for Tailwind
│   ├── next.config.js                # Next.js configuration
│   ├── .eslintrc.json                # ESLint rules
│   ├── .prettierrc                   # Prettier formatting
│   ├── .env.local.example            # Environment variable template
│   └── .gitignore                    # Git ignore rules
│
├── 📖 DOCUMENTATION
│   ├── README.md                     # Full documentation (setup, deploy, testing)
│   ├── QUICKSTART.md                 # 5-minute setup guide
│   ├── IMPLEMENTATION_NOTES.md       # Security, architecture, decisions
│   └── setup.sh                      # Automated setup script
│
└── 🗂️  OTHER
    └── biome.json                    # Biome config (optional linter)
```

## Key Architectural Patterns

### 1. Server-Only Secrets

```
lib/stripe.ts     → Server-only (STRIPE_SECRET_KEY)
lib/email.ts      → Server-only (RESEND_API_KEY)
app/api/*         → All API routes are server-side
```

### 2. Client Components (Minimal)

```
'use client' directive only where needed:
  - page.tsx files (interactive forms)
  - paywall-modal.tsx (dialog state)
  - quiz-question.tsx (answer selection)
```

### 3. Data Flow (No Database)

```
Quiz answers → API route → Score calculation
                         → Stripe Checkout metadata
                         → Webhook → Email
                         → Results page fetch
```

### 4. Security Layers

```
Input Validation → Rate Limiting → Idempotency
                                 → Webhook Signature
                                 → Payment Verification
```

## Dependency Map

### Production Dependencies

- `next` ^14.2.0 - App Router framework
- `react` ^18.3.0 - UI library
- `stripe` ^14.14.0 - Payment processing
- `resend` ^3.2.0 - Email delivery
- `@radix-ui/*` - Accessible UI primitives
- `lucide-react` - Icon library
- `tailwindcss` - Utility-first CSS
- `jsonwebtoken` - Optional result tokens

### Development Dependencies

- `typescript` ^5.3.3 - Type safety
- `@types/node` - Node.js types
- `eslint` - Code linting
- `prettier` - Code formatting

## Environment Variables (12 total)

### Required (6)

1. `NEXT_PUBLIC_SITE_URL` - Public site URL
2. `STRIPE_SECRET_KEY` - Stripe API key
3. `STRIPE_WEBHOOK_SECRET` - Webhook signature secret
4. `RESEND_API_KEY` - Resend API key
5. `FROM_EMAIL` - Verified sender email
6. `AFFILIATE_VSL_URL` - Affiliate link

### Optional (6)

7. `STRIPE_PRICE_ID` - Pre-created $1 price
8. `STRIPE_BUMP_PRICE_ID` - Pre-created $7 price
9. `RESULT_JWT_SECRET` - JWT secret for tokens
10. `PRICE_DISCLOSURE_MODE` - upfront | soft
11. `HEADLINE_VARIANT` - A | B
12. `VSL_HEADLINE_VARIANT` - A | B

## API Endpoints (3)

### POST /api/checkout

**Input:**

```json
{
  "email": "user@example.com",
  "answers": {"q1": "0", "q2": "1", ...},
  "bump": false,
  "utm": {"utm_source": "fb", ...},
  "variants": {"priceDisclosure": "upfront", ...}
}
```

**Output:**

```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### POST /api/results

**Input:**

```json
{
  "session_id": "cs_xxx"
}
```

**Output:**

```json
{
  "paid": true,
  "result": {
    "iqScore": 118,
    "percentile": 88,
    "band": "Above Average",
    "interpretation": "...",
    "email": "...",
    "bump": false
  }
}
```

### POST /api/stripe/webhook

**Input:** Stripe webhook event (signature verified)
**Output:** `{ received: true }`
**Side Effect:** Sends result email via Resend

## Component Hierarchy

```
RootLayout
  └─ page.tsx (Landing)
      ├─ Footer

  └─ page.tsx (Test)
      ├─ Progress
      ├─ QuizQuestion (x25)
      ├─ PaywallModal
      │   ├─ Dialog
      │   ├─ Checkbox (order bump)
      │   └─ Button
      └─ Footer

  └─ page.tsx (Results)
      ├─ Score Display
      ├─ VSL Section
      │   └─ Button (external link)
      └─ Footer

  └─ page.tsx (Legal pages x3)
      ├─ Legal content
      └─ Footer
```

## Scoring System

**Questions:** 25 total

- 8 Verbal reasoning
- 6 Numerical reasoning
- 5 Logical reasoning
- 6 Spatial reasoning

**Algorithm:**

```
rawScore = count of correct answers
zScore = (rawScore - 12.5) / 4.0
iqScore = 100 + (zScore × 15)
Clamped to [70, 145]
```

**Bands:**

- 70-84: Below Average (16th percentile)
- 85-99: Average (42nd percentile)
- 100-114: Above Average (75th percentile)
- 115-129: Superior (90th percentile)
- 130-145: Very Superior (98th percentile)

## Conversion Funnel Breakdown

```
┌─────────────────────────────────────────────────────────┐
│ LANDING PAGE (Hook-Story-Offer)                        │
│ • Curiosity headline + trust badge                      │
│ • Email capture                                         │
│ • "What You Get" bullets                                │
│ • "Why $1?" transparency                                │
│ • CTA: "Start Your IQ Snapshot"                         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ QUIZ (25 Questions)                                     │
│ • Progress bar (micro-commitments)                      │
│ • Persistent price disclosure (if soft mode)            │
│ • Category labels (Verbal, Numerical, etc.)             │
│ • Auto-advance after selection                          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ PAYWALL MODAL ($1 Tripwire)                            │
│ • Header: "Unlock Your IQ Snapshot for $1"             │
│ • Value bullets (5 points)                              │
│ • Order Bump: $7 PDF Report (checkbox)                  │
│ • Trust badges (Stripe, SSL, cards)                     │
│ • Total display: $1 or $8                               │
│ • CTA: "Unlock My Results for $1"                       │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STRIPE CHECKOUT                                         │
│ • Secure payment (4242 test card)                       │
│ • Apple/Google Pay support                              │
│ • Success redirect to /results                          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ RESULTS PAGE (OTO)                                      │
│ • Score reveal: IQ number + band + percentile           │
│ • Interpretation copy                                   │
│ • VSL Section (above-the-fold):                         │
│   - Headline variant (A/B)                              │
│   - 4 benefit bullets                                   │
│   - CTA: "Watch Free Training"                          │
│   - Affiliate link with UTM tracking                    │
│ • Disclaimers (educational, affiliate)                  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ EMAIL FOLLOW-UP (Automated)                             │
│ • Immediate: Result email (webhook-triggered)           │
│ • Day 1: VSL reinforcement (manual setup)               │
│ • Day 3: Last chance reminder (manual setup)            │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack Summary

| Layer             | Technology               | Purpose                                |
| ----------------- | ------------------------ | -------------------------------------- |
| **Frontend**      | Next.js 14 App Router    | React framework with server components |
| **Styling**       | Tailwind CSS             | Utility-first CSS framework            |
| **UI Components** | shadcn/ui + Radix UI     | Accessible, unstyled primitives        |
| **Icons**         | Lucide React             | Open-source icon library               |
| **Payment**       | Stripe Checkout          | PCI-compliant payment processing       |
| **Email**         | Resend                   | Transactional email API                |
| **Hosting**       | Vercel                   | Edge deployment, CDN, CI/CD            |
| **Database**      | None (Stripe metadata)   | Stateless architecture                 |
| **Analytics**     | Manual (Stripe metadata) | UTM + variant tracking                 |

---

**Total Files:** ~45
**Total Lines of Code:** ~3,500
**Setup Time:** 5 minutes
**Deploy Time:** 10 minutes
**Dependencies:** 20 production, 8 dev
