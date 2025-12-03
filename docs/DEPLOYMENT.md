# Task: Configure IQ Snapshot for Production Launch

## Context

I have a fully functional IQ Snapshot MVP built with Next.js 14, Stripe, and Resend. The app sells a $1 IQ test with a $7 PDF report order bump. All features work locally in test mode, but I need to configure it for production deployment to accept real payments and send emails to actual customers.

## Current Status

- ✅ Quiz with 25 questions works perfectly
- ✅ Stripe Checkout integration complete (test mode)
- ✅ PDF generation with @react-pdf/renderer implemented
- ✅ Resend email delivery with PDF attachments working
- ✅ Webhook handler processes payments correctly
- ⚠️ Using test Stripe keys (can't accept real payments)
- ⚠️ Using `onboarding@resend.dev` (can only email me, not real customers)
- ⚠️ Not yet deployed to production

## Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Hosting:** Vercel
- **Payment:** Stripe Checkout (currently test mode)
- **Email:** Resend API (currently test domain)
- **Domain:** ismaelsilva.com (owned, needs verification in Resend)

## Current Environment Variables (Test Mode)

Located in `.env.local`:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Stripe Keys (TEST MODE - need to switch to LIVE)
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE

# Resend (TEST DOMAIN - need to verify ismaelsilva.com)
RESEND_API_KEY=re_YOUR_KEY_HERE
FROM_EMAIL=onboarding@resend.dev  # Can only send to ismaelsilva@icloud.com

# Affiliate VSL URL (placeholder - will add real affiliate link later)
NEXT_PUBLIC_AFFILIATE_VSL_URL=https://www.ismaelsilva.com/

# Other configs
STRIPE_PRICE_ID=
STRIPE_BUMP_PRICE_ID=
RESULT_JWT_SECRET=your-secret-key-min-32-chars
NEXT_PUBLIC_PRICE_DISCLOSURE_MODE=upfront
NEXT_PUBLIC_HEADLINE_VARIANT=A
NEXT_PUBLIC_VSL_HEADLINE_VARIANT=A
```

## Repository Information

- **GitHub Repo:** https://github.com/ismaelthesilva/iqsnapshot
- **Owner:** ismaelthesilva
- **Branch:** main
- **Vercel Project:** (needs to be connected or already connected)

## Critical Issues to Fix

### Issue #1: Resend Domain Verification (PRIORITY)

**Problem:** Currently using `onboarding@resend.dev` which can ONLY send emails to `ismaelsilva@icloud.com`. Real customers won't receive their IQ results or PDF reports!

**What I Need:**

1. Step-by-step guide to verify `ismaelsilva.com` in Resend
2. Instructions on where to add DNS records (I use [DNS provider: Cloudflare/GoDaddy/Namecheap - specify if known])
3. What DNS records to add (SPF, DKIM, DMARC)
4. How to test verification is complete
5. Update `.env.local` to use `FROM_EMAIL=noreply@ismaelsilva.com`
6. Environment variable setup for Vercel production

**Expected Outcome:**

- `ismaelsilva.com` verified in Resend dashboard
- Can send emails to ANY customer email address
- Production-ready email configuration

---

### Issue #2: Stripe Live Mode Configuration (PRIORITY)

**Problem:** Currently using test Stripe keys (`sk_test_...`). Can't accept real payments from customers!

**What I Need:**

1. Step-by-step guide to get live Stripe keys from dashboard
2. How to create a production webhook endpoint
3. Webhook configuration for `checkout.session.completed` event
4. How to get the production webhook signing secret
5. Update environment variables for production
6. Instructions for Vercel environment variable setup
7. Testing plan with a real $1 payment

**Stripe Account Details:**

- Test keys start with: `sk_test_51RcjZD...`
- Live keys will start with: `sk_live_51RcjZD...`
- Webhook endpoint will be: `https://iqsnapshot.vercel.app/api/stripe/webhook` (or custom domain)

**Expected Outcome:**

- Live Stripe keys configured
- Production webhook endpoint active
- Can accept real credit card payments
- Webhook events trigger email delivery correctly

---

### Issue #3: Vercel Production Deployment

**Problem:** App only runs locally. Need to deploy to production for customers to access.

**What I Need:**

1. Pre-deployment checklist (what to verify before pushing)
2. How to connect GitHub repo to Vercel (if not already connected)
3. Step-by-step deployment process
4. How to add ALL environment variables to Vercel (production values)
5. Custom domain setup (if using iq.ismaelsilva.com or similar)
6. How to test production deployment before going live
7. Rollback plan if something breaks

**Expected Outcome:**

- App deployed at Vercel URL (e.g., https://iqsnapshot.vercel.app)
- All environment variables configured correctly in Vercel
- Production webhook connected to Stripe
- Can accept real payments and deliver PDFs

---

### Issue #4: End-to-End Production Testing

**What I Need:**

1. Complete testing checklist before announcing to customers
2. How to test with real payment (my own card)
3. Verification steps for email delivery
4. PDF attachment validation
5. Webhook event verification in Stripe dashboard
6. Results page functionality check
7. What to monitor in first 24 hours after launch

**Test Scenarios:**

- [ ] Customer pays $1 only (no bump) - receives email with results
- [ ] Customer pays $8 ($1 + $7 bump) - receives email with PDF attached
- [ ] Email arrives from `noreply@ismaelsilva.com` (not `onboarding@resend.dev`)
- [ ] PDF is personalized with correct IQ score
- [ ] Results page displays correctly
- [ ] "Watch Free Training" button works (even if placeholder link)
- [ ] Webhook logs show successful processing

---

## Additional Configuration (Optional but Recommended)

### Custom Domain Setup

If I want to use `iq.ismaelsilva.com` instead of `iqsnapshot.vercel.app`:

1. How to add custom domain in Vercel
2. DNS records to add in domain registrar
3. SSL certificate setup (automatic?)
4. Update `NEXT_PUBLIC_SITE_URL` environment variable

### Monitoring & Analytics

1. How to monitor Stripe webhook events
2. Resend email delivery logs (where to check)
3. Vercel function logs for debugging
4. Error tracking setup (Sentry? Built-in Vercel?)

### Security Checklist

1. Verify all secrets are in environment variables (not hardcoded)
2. Check `.gitignore` includes `.env.local`
3. Rate limiting review (already implemented in checkout route)
4. CORS configuration if needed

---

## Deliverables Needed

Please provide:

1. **Comprehensive Setup Guide** with:
   - Step-by-step instructions for each issue above
   - Screenshots or links to relevant dashboard pages
   - Exact commands to run
   - Expected output/success indicators

2. **Environment Variable Checklist** with:
   - Complete list of production environment variables
   - Where to get each value (Stripe dashboard, Resend, etc.)
   - Which variables are different in production vs. development
   - Vercel environment variable setup instructions

3. **Testing Plan** with:
   - Pre-launch checklist
   - Post-launch monitoring guide
   - Common issues and solutions
   - Rollback procedure if needed

4. **DNS Configuration Guide** with:
   - Exact DNS records to add for Resend domain verification
   - Format for each record type (TXT, CNAME, etc.)
   - Where to add them in my DNS provider
   - Verification testing commands

5. **Production Deployment Script** (if applicable):
   - Git commands to prepare for deployment
   - Vercel deployment commands
   - Verification steps after deployment

---

## Success Criteria

I'll know the setup is complete when:

- [ ] Real customers can purchase the $1 IQ test with any email address
- [ ] Customers paying $8 receive a personalized PDF report via email
- [ ] Emails come from `noreply@ismaelsilva.com` (verified domain)
- [ ] Stripe processes real payments (not test mode)
- [ ] Webhook events trigger correctly in production
- [ ] App is live at a public URL (Vercel or custom domain)
- [ ] I've successfully tested with my own real payment
- [ ] Monitoring/logging is in place for debugging

---

## Timeline & Constraints

- **Target Launch:** Within 1-2 days
- **Blocker:** DNS propagation can take up to 24 hours
- **Budget:** Already have Stripe, Resend, and Vercel accounts
- **Experience Level:** Comfortable with command line, but need clear instructions for DNS/Stripe/Vercel setup

---

## Questions to Answer

1. What's the fastest path to production? (Can I deploy before DNS verification completes?)
2. Should I use a custom domain or Vercel's default URL?
3. How do I test Stripe webhooks in production without Stripe CLI?
4. What's the proper sequence: Deploy first, then configure webhooks? Or configure everything, then deploy?
5. How do I handle environment variable changes after deployment?
6. What are the most common mistakes to avoid during this setup?

---

## Current Working Directory

```
/Users/ismaelsilva/Dev-Mini/ismaHOST/iqsnapshot
```

All files are committed to `main` branch. Ready to deploy once configuration is complete.

---

Please provide a complete, production-ready setup guide that I can follow step-by-step to launch this app and start accepting real payments from customers. Include all necessary commands, dashboard configurations, and testing procedures.

**Priority Order:**

1. Resend domain verification (blocks email delivery to customers)
2. Stripe live mode setup (blocks real payments)
3. Vercel deployment (blocks public access)
4. End-to-end testing (validates everything works)

Thank you!
