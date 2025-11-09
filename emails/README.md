# Email Templates for The $1 IQ Snapshot

This directory contains email templates for follow-up campaigns. The immediate result email is sent automatically via the webhook. These additional templates are provided for future use with an email service provider (ESP) like Resend, ConvertKit, or Mailchimp.

## Immediate Email (Automated)
**Triggered by:** Stripe webhook on successful payment
**Subject:** "Your IQ Snapshot Results Are Ready"
**Sent via:** Webhook → Resend API
**Location:** Built in `lib/email.ts`

## Follow-up Email Templates

### Day 1 Follow-up
**File:** `day-1-followup.html`
**Timing:** 24 hours after purchase
**Purpose:** Reinforce VSL offer, provide additional value

### Day 3 Follow-up
**File:** `day-3-followup.html`
**Timing:** 72 hours after purchase
**Purpose:** Last chance reminder, social proof, testimonial

## Implementation Notes

These templates are provided as static HTML files. To implement automated follow-ups in production:

1. **Option A - Resend Sequences:**
   - Create a Resend Audience
   - Add purchasers to the audience via webhook
   - Set up automated email sequences in Resend dashboard

2. **Option B - ConvertKit/Mailchimp:**
   - Integrate ESP with webhook
   - Tag users on purchase
   - Set up automated sequences in ESP

3. **Option C - Custom Scheduler:**
   - Store purchase timestamp in database (if adding DB later)
   - Use cron job to check and send scheduled emails
   - Use Resend API to send

## Variables to Replace

When implementing, replace these placeholders:
- `{{first_name}}` or use email address if name not collected
- `{{iq_score}}`
- `{{percentile}}`
- `{{vsl_url}}`
- `{{unsubscribe_url}}`

## Compliance

All follow-up emails must include:
- Clear sender identification
- Unsubscribe link (required by CAN-SPAM)
- Physical mailing address
- Honest subject lines
- Affiliate disclosure if linking to affiliate offers
