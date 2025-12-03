# IQ Snapshot

> AI-Powered IQ Assessment with Automated PDF Reports

A Next.js 14 conversion funnel for IQ testing. Users take a 25-question assessment, pay $1 to unlock results, with an optional $7 PDF report upgrade. Built following Russell Brunson's Hook-Story-Offer framework.

**🌐 Live:** [iqsnapshot.vercel.app](https://iqsnapshot.vercel.app) | [iq.ismaelsilva.com](https://iq.ismaelsilva.com)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

- **[Setup Guide](docs/SETUP.md)** - Installation & local development
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment to Vercel
- **[PDF Guide](docs/PDF_GUIDE.md)** - PDF report generation details
- **[Features](docs/FEATURES.md)** - Implementation notes & features
- **[Architecture](docs/ARCHITECTURE.md)** - Project structure & file tree
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues & solutions
- **[Project Overview](docs/OVERVIEW.md)** - Detailed project summary
- **[Branding](docs/BRANDING.md)** - Logo setup & brand guidelines

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Payments:** Stripe (Checkout + Webhooks)
- **Email:** Resend API
- **PDF Generation:** @react-pdf/renderer
- **Styling:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel
- **No Database** - All data in Stripe metadata

---

## ✨ Key Features

- ✅ **25-Question IQ Assessment** - Multiple choice quiz with auto-scoring
- ✅ **Stripe Checkout Integration** - $1 base price + $7 PDF upgrade
- ✅ **Personalized PDF Reports** - 6-page AI-generated analysis
- ✅ **Automated Email Delivery** - Results sent via Resend with PDF attachment
- ✅ **No Database Required** - All data stored in Stripe metadata
- ✅ **Mobile-First Design** - Responsive UI with Tailwind CSS
- ✅ **A/B Testing Ready** - Environment-driven variants
- ✅ **Webhook-Driven Flow** - Automated post-payment processing

---

## 💰 Business Model

1. **Tripwire ($1):** Base IQ results unlock
2. **Order Bump ($7):** Personalized PDF report upgrade
3. **OTO (Optional):** High-ticket affiliate VSL redirect

**Target AOV:** $8 per customer (with bump)

---

## 🧪 Testing

### Test with Stripe Coupons

Create a 100% discount coupon in Stripe for testing without charges:

```bash
# In Stripe Dashboard:
# Products → Coupons → Create coupon
# - Code: iqtest
# - Discount: 100% off
# - Duration: Forever
```

Use coupon code `iqtest` at checkout for $0.00 testing.

### Test Cards (Stripe Test Mode)

- **Success:** `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

---

## 📦 Project Structure

```
iqsnapshot/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Landing page
│   ├── test/               # 25-question quiz
│   ├── results/            # Results display
│   └── api/                # API routes
│       ├── checkout/       # Create Stripe session
│       ├── results/        # Fetch results
│       └── stripe/webhook/ # Payment webhooks
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── quiz/               # Quiz components
│   └── paywall-modal.tsx   # Checkout modal
├── lib/                    # Utility functions
│   ├── stripe.ts           # Stripe client
│   ├── scoring.ts          # IQ scoring logic
│   ├── pdf-generator.tsx   # PDF report builder
│   └── email.ts            # Email templates
├── docs/                   # 📚 Documentation
└── public/                 # Static assets
```

---

## 🔒 Security

- ✅ No database = no data breach risk
- ✅ PII stored only in Stripe (PCI compliant)
- ✅ Webhook signature verification
- ✅ Server-side API routes only
- ✅ Environment variables for secrets
- ✅ Rate limiting on checkout endpoint
- ✅ Input validation & sanitization

---

## 🌐 Deployment

Deployed on **Vercel** with automatic CI/CD from GitHub.

See **[Deployment Guide](docs/DEPLOYMENT.md)** for detailed instructions.

---

## 📧 Contact

- **Support:** support@ismaelsilva.com
- **Website:** [ismaelsilva.com](https://ismaelsilva.com)

---

**Built with ❤️ using Next.js 14, Stripe, Resend, and @react-pdf/renderer**
