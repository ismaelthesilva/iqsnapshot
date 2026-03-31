/**
 * A/B Testing Utilities
 * Feature flags controlled via environment variables
 */

export type PriceDisclosureMode = 'upfront' | 'soft'
export type HeadlineVariant = 'A' | 'B'
export type VSLHeadlineVariant = 'A' | 'B'

export function getPriceDisclosureMode(): PriceDisclosureMode {
  const mode = process.env.PRICE_DISCLOSURE_MODE || 'upfront'
  return mode === 'soft' ? 'soft' : 'upfront'
}

export function getHeadlineVariant(): HeadlineVariant {
  const variant = process.env.HEADLINE_VARIANT || 'A'
  return variant === 'B' ? 'B' : 'A'
}

export function getVSLHeadlineVariant(): VSLHeadlineVariant {
  const variant = process.env.VSL_HEADLINE_VARIANT || 'A'
  return variant === 'B' ? 'B' : 'A'
}

export interface VariantData {
  priceDisclosure: PriceDisclosureMode
  headline: HeadlineVariant
  vslHeadline: VSLHeadlineVariant
}

export function getActiveVariants(): VariantData {
  return {
    priceDisclosure: getPriceDisclosureMode(),
    headline: getHeadlineVariant(),
    vslHeadline: getVSLHeadlineVariant(),
  }
}
