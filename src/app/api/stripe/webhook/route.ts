import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { generateIQReport } from '@/lib/pdf-generator'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Initialize Resend lazily to avoid build-time errors
let resendClient: Resend | null = null
function getResendClient() {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY || 're_placeholder')
  }
  return resendClient
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Get metadata from session
      const { email, iq_score, raw_score, percentile, band, bump } = session.metadata || {}

      if (!email || !iq_score) {
        console.error('Missing required metadata in session:', session.id)
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      const hasBump = bump === 'true'

      // Get interpretation from metadata (it's already stored there from checkout)
      const interpretation =
        session.metadata?.interpretation ||
        'Your cognitive assessment results show your current performance level.'

      // Generate PDF if customer purchased the bump
      let pdfBuffer: Buffer | null = null
      if (hasBump) {
        try {
          console.log('📄 Generating personalized PDF report...')
          pdfBuffer = await generateIQReport({
            email,
            iqScore: parseInt(iq_score),
            rawScore: parseInt(raw_score || '0'),
            percentile: parseInt(percentile || '0'),
            band,
            interpretation,
          })
          console.log('✅ PDF generated successfully')
        } catch (pdfError) {
          console.error('❌ PDF generation failed (will still send email):', pdfError)
          // Continue without PDF - don't block email delivery
        }
      }

      // Prepare email with optional PDF attachment
      const emailOptions: any = {
        from: process.env.FROM_EMAIL!,
        to: email,
        subject: `Your IQ Snapshot Results - ${iq_score} IQ Score`,
        html: generateResultsEmail({
          iqScore: parseInt(iq_score),
          rawScore: parseInt(raw_score || '0'),
          percentile: parseInt(percentile || '0'),
          band,
          interpretation,
          hasBump,
          vslUrl: process.env.NEXT_PUBLIC_AFFILIATE_VSL_URL || '',
        }),
      }

      // Add PDF attachment if it was generated
      if (pdfBuffer) {
        emailOptions.attachments = [
          {
            filename: `IQ-Analysis-Report-${iq_score}.pdf`,
            content: pdfBuffer,
          },
        ]
      }

      // Send email with results
      const resend = getResendClient()
      await resend.emails.send(emailOptions)

      console.log(
        `✅ Results email sent to ${email} (IQ: ${iq_score}, Bump: ${hasBump}, PDF: ${pdfBuffer ? 'attached' : 'none'})`
      )

      return NextResponse.json({ received: true })
    } catch (error) {
      console.error('Error processing webhook:', error)
      return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

// Email template
function generateResultsEmail({
  iqScore,
  rawScore,
  percentile,
  band,
  interpretation,
  hasBump,
  vslUrl,
}: {
  iqScore: number
  rawScore: number
  percentile: number
  band: string
  interpretation: string
  hasBump: boolean
  vslUrl: string
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your IQ Snapshot Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f7fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                Your IQ Snapshot Results
              </h1>
              <p style="margin: 10px 0 0 0; color: #e6e6ff; font-size: 16px;">
                Congratulations on completing your assessment!
              </p>
            </td>
          </tr>

          <!-- Main Results -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- IQ Score Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafc; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <div style="font-size: 64px; font-weight: bold; color: #667eea; line-height: 1;">
                      ${iqScore}
                    </div>
                    <div style="font-size: 18px; color: #4a5568; margin-top: 10px; font-weight: 600;">
                      Your Estimated IQ Score
                    </div>
                    <div style="font-size: 14px; color: #718096; margin-top: 5px;">
                      ${band} • Top ${100 - percentile}% Percentile
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Interpretation -->
              <h2 style="color: #2d3748; font-size: 22px; margin: 0 0 15px 0;">
                What This Means
              </h2>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                ${interpretation}
              </p>

              <!-- Stats Grid -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td width="33%" style="padding: 20px; background-color: #f7fafc; border-radius: 8px; text-align: center;">
                    <div style="font-size: 28px; font-weight: bold; color: #667eea;">
                      ${rawScore}/25
                    </div>
                    <div style="font-size: 14px; color: #718096; margin-top: 5px;">
                      Correct Answers
                    </div>
                  </td>
                  <td width="2%"></td>
                  <td width="33%" style="padding: 20px; background-color: #f7fafc; border-radius: 8px; text-align: center;">
                    <div style="font-size: 28px; font-weight: bold; color: #667eea;">
                      ${percentile}%
                    </div>
                    <div style="font-size: 14px; color: #718096; margin-top: 5px;">
                      Percentile Rank
                    </div>
                  </td>
                  <td width="2%"></td>
                  <td width="30%" style="padding: 20px; background-color: #f7fafc; border-radius: 8px; text-align: center;">
                    <div style="font-size: 18px; font-weight: bold; color: #667eea;">
                      ${band}
                    </div>
                    <div style="font-size: 14px; color: #718096; margin-top: 5px;">
                      Classification
                    </div>
                  </td>
                </tr>
              </table>

              ${
                hasBump
                  ? `
              <!-- PDF Report Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 30px; margin-bottom: 30px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 20px;">
                      📊 Your Personalized PDF Report (Attached)
                    </h3>
                    <p style="margin: 0 0 20px 0; color: #e6e6ff; font-size: 15px; line-height: 1.5;">
                      Your detailed 6-page cognitive analysis report is attached to this email. It includes:
                    </p>
                    <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #e6e6ff; font-size: 14px;">
                      <li style="margin-bottom: 8px;">In-depth interpretation of your ${iqScore} IQ score</li>
                      <li style="margin-bottom: 8px;">Cognitive strengths and growth opportunities</li>
                      <li style="margin-bottom: 8px;">7 science-backed strategies to enhance mental performance</li>
                      <li style="margin-bottom: 8px;">Personalized development plan and next steps</li>
                    </ul>
                    <p style="margin: 0; color: #ffffff; font-size: 13px; background-color: rgba(255,255,255,0.1); padding: 12px; border-radius: 6px;">
                      💡 <strong>Tip:</strong> Download the PDF attachment at the bottom of this email. The file is named "IQ-Analysis-Report-${iqScore}.pdf"
                    </p>
                  </td>
                </tr>
              </table>
              `
                  : ''
              }

              <!-- VSL CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafc; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 20px;">
                      🎯 Ready to Maximize Your Potential?
                    </h3>
                    <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 15px; line-height: 1.5;">
                      Now that you know your cognitive baseline, discover proven strategies to enhance your mental performance.
                    </p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 6px; padding: 14px 32px;">
                          <a href="${vslUrl}" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: block;">
                            Watch Free Training →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Disclaimer -->
              <p style="color: #a0aec0; font-size: 12px; line-height: 1.5; margin: 0;">
                <strong>Important:</strong> This assessment is for educational and entertainment purposes only. It is not a clinical diagnostic tool. Results are estimates based on a limited question set and should not be used for official purposes.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                Questions? Reply to this email or visit our website.
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                © ${new Date().getFullYear()} IQ Snapshot. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
