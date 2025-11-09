/**
 * Copy variants and marketing content
 * Aligned with Russell Brunson's Hook-Story-Offer framework
 */

export const headlines = {
  A: 'How Smart Are You Compared to Other Americans? Take The $1 IQ Snapshot.',
  B: '7‑Minute IQ Snapshot: Discover Your Score and Percentile for Just $1.',
}

export const vslHeadlines = {
  A: 'Boost Your Cognitive Edge in 30 Days — The Science‑Backed System.',
  B: 'Turn Your IQ Insights into Daily Performance Gains — Here Is How.',
}

export const landingPage = {
  hook: {
    title: (variant: 'A' | 'B') => headlines[variant],
    subtitle: "It's free to take. Unlock your personalized score and percentile for $1.",
    trustBadge: 'Trusted by 1,000+ test-takers',
  },
  story: {
    whatYouGet: [
      'Your personalized IQ score (70-145 scale)',
      'Percentile ranking vs. other Americans',
      'Detailed interpretation of your cognitive strengths',
      'Instant on-screen delivery + email backup',
      'Science-based assessment (25 questions)',
    ],
    whyOneDollar:
      'The assessment is free to take. The $1 one-time fee covers secure scoring, instant delivery, and your personalized report. No subscriptions, no recurring charges.',
  },
  offer: {
    cta: 'Start Your IQ Snapshot',
    priceDisclosure: 'Results unlock for $1 after completion',
    guarantee: '100% secure payment via Stripe',
  },
}

export const paywallCopy = {
  header: "You're Done! Unlock Your IQ Snapshot for $1",
  subheader: 'Your personalized score, percentile, and interpretation are ready.',
  valueBullets: [
    '✓ Your IQ score on the standard 70-145 scale',
    '✓ Percentile ranking compared to other test-takers',
    '✓ Detailed cognitive profile and interpretation',
    '✓ Instant on-screen results + email delivery',
    '✓ One-time $1 fee • No subscriptions • Stripe secured',
  ],
  orderBump: {
    title: 'Add Personalized PDF Report',
    description:
      'Get a beautifully formatted PDF report with detailed breakdowns, charts, and actionable insights. Perfect for sharing or keeping as a record.',
    price: '$7 (one-time)',
  },
  cta: 'Unlock My Results for $1',
  disclaimer:
    'This is a one-time payment. Your results will be delivered instantly on-screen and via email.',
}

export const resultsPageCopy = {
  congratulations: 'Your Results Are Ready!',
  nextSteps: 'What Is Next?',
  vslIntro:
    'Now that you know your cognitive baseline, discover how to maximize your mental performance with science-backed strategies.',
  vslCta: 'Watch Free Training',
  vslBenefits: [
    'Proven techniques to enhance memory and focus',
    'Daily habits of top performers',
    'Neuroplasticity strategies for long-term cognitive health',
    'Real-world applications you can start today',
  ],
  disclosure:
    'This assessment is for educational and entertainment purposes only. It is not a clinical diagnostic tool. Results are estimates based on a limited question set.',
  affiliateDisclosure:
    'Disclosure: The training link above is an affiliate link. If you choose to purchase, we may receive a commission at no additional cost to you. We only recommend products we genuinely believe can help you.',
}

export const legalFooter = {
  links: [
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Privacy Policy', href: '/legal/privacy' },
  ],
  copyright: `© ${new Date().getFullYear()} The $1 IQ Snapshot. All rights reserved.`,
  disclaimer:
    'Educational and entertainment purposes only. Not a clinical assessment.',
}
