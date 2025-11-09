#!/bin/bash

# The $1 IQ Snapshot - First Run Instructions
# This file will be displayed the first time you navigate to the project

cat << "EOF"

╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║                   🧠 THE $1 IQ SNAPSHOT MVP                          ║
║                                                                      ║
║                  Production-Ready Next.js Funnel                     ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝

✅ PROJECT STATUS: COMPLETE AND READY TO DEPLOY

📦 What's Included:
   • Landing page with Hook-Story-Offer copy
   • 25-question IQ quiz with progress tracking
   • $1 paywall + $7 order bump
   • Stripe Checkout integration
   • Results page with VSL affiliate offer
   • Automated email delivery via Resend
   • Legal pages (Terms, Privacy, Affiliate Disclosure)
   • A/B testing via environment flags
   • No database (Stripe metadata only)

🚀 Quick Start (5 minutes):

   1. Run the setup script:
      ./setup.sh

   2. Edit .env.local with your API keys:
      • STRIPE_SECRET_KEY
      • RESEND_API_KEY
      • FROM_EMAIL
      • AFFILIATE_VSL_URL

   3. Start Stripe webhook listener (new terminal):
      stripe listen --forward-to localhost:3000/api/stripe/webhook

   4. Copy webhook secret to .env.local:
      STRIPE_WEBHOOK_SECRET=whsec_...

   5. Start development server:
      npm run dev

   6. Visit http://localhost:3000

📖 Documentation:
   • README.md             - Full setup and deployment guide
   • QUICKSTART.md         - 5-minute setup instructions
   • IMPLEMENTATION_NOTES  - Architecture and security details
   • FILE_TREE.md          - Complete file structure
   • PROJECT_SUMMARY.md    - Delivery summary and metrics

🧪 Test the Flow:
   1. Enter your email on landing page
   2. Answer all 25 quiz questions
   3. Click "Unlock My Results for $1"
   4. Use test card: 4242 4242 4242 4242
   5. Check your email for results!

🌐 Deploy to Vercel:
   vercel                  # Initial setup
   vercel --prod           # Production deployment

   Don't forget to:
   • Set environment variables in Vercel dashboard
   • Configure production Stripe webhook
   • Verify Resend domain

🔒 Security Features:
   ✓ Server-only secrets
   ✓ Webhook signature verification
   ✓ Input validation
   ✓ Rate limiting
   ✓ Idempotency keys

💰 Monetization:
   • $1 base (tripwire)
   • $7 order bump (8x AOV)
   • Affiliate VSL (commission)
   • UTM tracking built-in

📊 Tech Stack:
   • Next.js 14 App Router
   • TypeScript
   • Tailwind CSS + shadcn/ui
   • Stripe Checkout
   • Resend
   • Vercel

🎯 Ready for production at: https://iq.ismaelsilva.com

════════════════════════════════════════════════════════════════════════

Need help? Read the documentation files listed above.
All questions are answered in README.md and IMPLEMENTATION_NOTES.md.

Happy launching! 🚀

EOF
