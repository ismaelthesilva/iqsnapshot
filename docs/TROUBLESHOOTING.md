# Troubleshooting Guide

Common issues and solutions for IQ Snapshot.

## 🔴 Stripe Errors

### "Invalid API Key" Error

**Symptoms:**

- Checkout fails with "Invalid API Key provided"
- Error mentions test key when using live mode

**Causes:**

- Wrong Stripe key in environment variables
- Test/live mode mismatch
- Cached environment variables in Vercel

**Solutions:**

1. Verify `STRIPE_SECRET_KEY` in Vercel dashboard
   - Go to: Project Settings → Environment Variables
   - Should start with `sk_live_` for production
   - Ensure it's set to "Production" environment only (not All Environments)

2. Clear Vercel cache and redeploy:

   ```bash
   vercel env rm STRIPE_SECRET_KEY production --yes
   echo "sk_live_YOUR_KEY" | vercel env add STRIPE_SECRET_KEY production
   git commit --allow-empty -m "Force rebuild"
   git push origin main
   ```

3. Test Stripe key locally:
   ```bash
   curl https://api.stripe.com/v1/payment_intents \
     -u "sk_live_YOUR_KEY:" \
     -d "amount=100" \
     -d "currency=usd"
   ```

### "Connection to Stripe Failed"

**Causes:**

- Network issues
- Invalid webhook secret
- Wrong API version

**Solutions:**

1. Check Stripe status: https://status.stripe.com
2. Verify webhook secret matches Stripe dashboard
3. Ensure API version is `2023-10-16` or compatible

---

## 📧 Email Delivery Issues

### Email Not Received

**Causes:**

- Domain not verified in Resend
- Wrong `FROM_EMAIL` address
- Missing `RESEND_API_KEY`
- Email in spam folder

**Solutions:**

1. Verify domain in Resend:
   - Go to: https://resend.com/domains
   - Add your domain (e.g., `ismaelsilva.com`)
   - Add DNS records (SPF, DKIM, DMARC) to your DNS provider
   - Wait for green checkmark (can take 5-30 minutes)

2. Check environment variables:

   ```bash
   RESEND_API_KEY=re_YOUR_KEY
   FROM_EMAIL=noreply@your-verified-domain.com
   ```

3. Use only verified email addresses:
   - Before domain verification: Only `name@icloud.com` works
   - After domain verification: Any `name@yourdomain.com` works

4. Check Resend logs:
   - Go to: https://resend.com/emails
   - Check delivery status
   - Look for bounce/reject reasons

### PDF Not Attached to Email

**Causes:**

- PDF generation failed
- File size > 40MB (Resend limit)
- Missing attachment code

**Solutions:**

1. Check Vercel function logs for PDF errors
2. Test PDF generation endpoint: `/api/test-pdf`
3. Verify PDF is < 2MB (typical size: 300-500KB)
4. Check webhook handler logs for attachment errors

---

## 🔗 Webhook Issues

### Webhook Not Firing

**Causes:**

- Wrong webhook URL
- Webhook not created in Stripe
- Wrong signing secret
- Test mode vs live mode mismatch

**Solutions:**

1. Verify webhook exists in Stripe dashboard:
   - Go to: https://dashboard.stripe.com/webhooks
   - Switch to LIVE mode (toggle in top-left)
   - Should have: `https://your-domain.com/api/stripe/webhook`
   - Event: `checkout.session.completed`

2. Update webhook secret in Vercel:

   ```bash
   vercel env rm STRIPE_WEBHOOK_SECRET production --yes
   echo "whsec_YOUR_SECRET" | vercel env add STRIPE_WEBHOOK_SECRET production
   ```

3. Test webhook locally with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   stripe trigger checkout.session.completed
   ```

### Webhook Returns 500 Error

**Causes:**

- Missing environment variables
- PDF generation failure
- Email sending failure
- Code errors

**Solutions:**

1. Check Vercel function logs:
   - Go to: Vercel Dashboard → Deployments → Function Logs
   - Search for `/api/stripe/webhook`
   - Look for error stack traces

2. Verify all required env vars are set:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `RESEND_API_KEY`
   - `FROM_EMAIL`
   - `NEXT_PUBLIC_SITE_URL`

3. Test webhook handler manually:
   ```bash
   # Use Stripe CLI to send test event
   stripe trigger checkout.session.completed
   ```

---

## 🎨 Build Errors

### "Missing STRIPE_SECRET_KEY" During Build

**Cause:**

- Trying to initialize Stripe at build time

**Solution:**
Already fixed with lazy loading pattern in `lib/stripe.ts`:

```typescript
// ✅ Correct: Initialize at runtime
function getStripe() {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return stripeInstance
}
```

### "Cannot find module" Errors

**Solutions:**

1. Clear `.next` cache:

   ```bash
   rm -rf .next
   npm run build
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 🚀 Deployment Issues

### Vercel Build Fails

**Solutions:**

1. Check build logs in Vercel dashboard
2. Test build locally:
   ```bash
   npm run build
   ```
3. Clear Vercel cache:
   - Redeploy with "Use existing Build Cache" UNCHECKED

### Environment Variables Not Updating

**Cause:**

- Vercel caches environment variables

**Solution:**
Force fresh deployment:

```bash
git commit --allow-empty -m "Force redeploy"
git push origin main
```

### Custom Domain Not Working

**Solutions:**

1. Add domain in Vercel:
   - Project Settings → Domains
   - Add your domain
   - Copy DNS records

2. Update DNS provider:
   - Add A record or CNAME as shown in Vercel
   - Wait 5-60 minutes for propagation

3. Update environment variables:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
   ```

---

## 🧪 Testing Issues

### Test Payments Not Working

**Solutions:**

1. Use test mode Stripe keys (start with `sk_test_`)
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date and any 3-digit CVC

### Coupon Not Applying

**Causes:**

- Coupon doesn't exist in Stripe
- Test mode vs live mode mismatch
- Typo in coupon code

**Solutions:**

1. Create coupon in Stripe dashboard:
   - Go to: Products → Coupons
   - Create 100% off coupon
   - Code: `iqtest` (case-insensitive)

2. Verify coupon exists in correct mode (Test vs Live)

3. Test coupon in Stripe dashboard before using in app

---

## 📊 Common Error Messages

| Error                                   | Cause                          | Solution                                |
| --------------------------------------- | ------------------------------ | --------------------------------------- |
| `Invalid API Key`                       | Wrong Stripe key               | Update `STRIPE_SECRET_KEY` in Vercel    |
| `Missing RESEND_API_KEY`                | Env var not set                | Add to Vercel environment variables     |
| `Domain not verified`                   | Resend domain setup incomplete | Verify domain at resend.com/domains     |
| `Webhook signature verification failed` | Wrong webhook secret           | Update `STRIPE_WEBHOOK_SECRET`          |
| `PDF generation failed`                 | Code error or missing data     | Check Vercel function logs              |
| `Rate limit exceeded`                   | Too many requests              | Implement rate limiting or upgrade plan |

---

## 🆘 Still Need Help?

1. **Check Logs:**
   - Vercel: Function logs in deployment details
   - Stripe: Webhook logs in dashboard
   - Resend: Email logs at resend.com/emails

2. **Test Endpoints:**
   - `/api/test-pdf` - Test PDF generation
   - `/api/checkout` - Test checkout creation

3. **Contact Support:**
   - Stripe: https://support.stripe.com
   - Resend: support@resend.com
   - Vercel: https://vercel.com/support

4. **Debug Mode:**
   - Check browser console (F12) for client-side errors
   - Check Vercel function logs for server-side errors
   - Enable verbose logging in webhook handler
