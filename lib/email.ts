import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

if (!process.env.FROM_EMAIL) {
  throw new Error('Missing FROM_EMAIL environment variable')
}

export const resend = new Resend(process.env.RESEND_API_KEY)
export const FROM_EMAIL = process.env.FROM_EMAIL

export interface ResultEmailData {
  email: string
  iqScore: number
  percentile: number
  band: string
  interpretation: string
  vslUrl: string
}

export function buildResultEmail(data: ResultEmailData): { subject: string; html: string } {
  const subject = 'Your IQ Snapshot Results Are Ready'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 3px solid #2563eb; }
    .header h1 { margin: 0; color: #2563eb; font-size: 24px; }
    .results { background: #f9fafb; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center; }
    .score { font-size: 48px; font-weight: bold; color: #2563eb; margin: 10px 0; }
    .band { font-size: 20px; color: #059669; font-weight: 600; margin: 10px 0; }
    .percentile { font-size: 16px; color: #6b7280; margin: 10px 0; }
    .interpretation { text-align: left; margin: 20px 0; padding: 20px; background: white; border-radius: 6px; border-left: 4px solid #2563eb; }
    .cta { text-align: center; margin: 30px 0; }
    .cta a { display: inline-block; background: #2563eb; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 18px; }
    .cta a:hover { background: #1d4ed8; }
    .benefits { margin: 20px 0; }
    .benefits li { margin: 10px 0; }
    .disclosure { font-size: 12px; color: #6b7280; padding: 20px; background: #f9fafb; border-radius: 6px; margin: 30px 0; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧠 Your IQ Snapshot Results</h1>
    </div>

    <div class="results">
      <div class="score">${data.iqScore}</div>
      <div class="band">${data.band}</div>
      <div class="percentile">You scored higher than approximately ${data.percentile}% of test-takers</div>
      
      <div class="interpretation">
        <strong>What This Means:</strong><br/>
        ${data.interpretation}
      </div>
    </div>

    <h2 style="text-align: center; color: #1f2937;">Ready to Maximize Your Cognitive Potential?</h2>
    
    <p>Now that you know where you stand, discover the science-backed system that can help you sharpen your mental edge, improve focus, and boost your performance in just 30 days.</p>

    <div class="cta">
      <a href="${data.vslUrl}">Watch Free Training →</a>
    </div>

    <div class="benefits">
      <p><strong>In this exclusive training, you'll discover:</strong></p>
      <ul>
        <li>✓ Evidence-based techniques to enhance memory and recall</li>
        <li>✓ Daily habits of high-performers for sustained focus</li>
        <li>✓ Neuroplasticity strategies to build cognitive resilience</li>
        <li>✓ Real-world applications to see results fast</li>
      </ul>
    </div>

    <div class="disclosure">
      <strong>Disclosure:</strong> This email contains an affiliate link. If you choose to purchase through our recommendation, we may receive a commission at no additional cost to you. We only recommend products we believe can genuinely help you improve. This assessment is for educational and entertainment purposes only and is not a clinical diagnostic tool.
    </div>

    <div class="footer">
      <p><strong>The $1 IQ Snapshot</strong></p>
      <p>Educational assessment • Non-diagnostic • For entertainment purposes</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/legal/terms" style="color: #2563eb; text-decoration: none;">Terms</a> • 
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/legal/privacy" style="color: #2563eb; text-decoration: none;">Privacy</a> • 
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/legal/affiliate-disclosure" style="color: #2563eb; text-decoration: none;">Affiliate Disclosure</a>
      </p>
    </div>
  </div>
</body>
</html>
  `

  return { subject, html }
}

export async function sendResultEmail(data: ResultEmailData): Promise<void> {
  const { subject, html } = buildResultEmail(data)

  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject,
    html,
  })
}
