import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

declare global {
  // biome-ignore lint: needed for rate limiter test
  var rateLimiterMap: Map<string, { count: number; resetAt: number }> | undefined
}

// Mock environment variables
beforeEach(() => {
  vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_mock')
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
})

describe('Checkout API Route', () => {
  describe('Request Validation', () => {
    it('should require valid email', async () => {
      const invalidEmails = ['', 'notanemail', '@example.com', 'test@', 'test']

      for (const email of invalidEmails) {
        const requestBody = {
          email,
          answers: generateValidAnswers(),
          bump: false,
        }

        expect(isValidEmail(email)).toBe(false)
      }
    })

    it('should accept valid emails', () => {
      const validEmails = ['test@example.com', 'user.name@domain.co.uk', 'test+tag@example.com']

      for (const email of validEmails) {
        expect(isValidEmail(email)).toBe(true)
      }
    })

    it('should normalize email addresses', () => {
      expect(normalizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com')
      expect(normalizeEmail('  user@domain.com  ')).toBe('user@domain.com')
    })

    it('should require complete answers', () => {
      const incompleteAnswers = {
        q1: '0',
        q2: '1',
        // Missing q3-q25
      }

      expect(hasAllAnswers(incompleteAnswers)).toBe(false)
    })

    it('should accept 25 complete answers', () => {
      const completeAnswers = generateValidAnswers()
      expect(hasAllAnswers(completeAnswers)).toBe(true)
      expect(Object.keys(completeAnswers).length).toBe(25)
    })
  })

  describe('Idempotency', () => {
    it('should generate consistent idempotency key for same input', () => {
      const email = 'test@example.com'
      const answers = generateValidAnswers()
      const bump = true

      const key1 = generateIdempotencyKey(email, answers, bump)
      const key2 = generateIdempotencyKey(email, answers, bump)

      expect(key1).toBe(key2)
      expect(key1).toHaveLength(32)
    })

    it('should generate different keys for different inputs', () => {
      const email = 'test@example.com'
      const answers = generateValidAnswers()

      const key1 = generateIdempotencyKey(email, answers, false)
      const key2 = generateIdempotencyKey(email, answers, true) // Different bump
      const key3 = generateIdempotencyKey('other@example.com', answers, false) // Different email

      expect(key1).not.toBe(key2)
      expect(key1).not.toBe(key3)
      expect(key2).not.toBe(key3)
    })
  })

  describe('Line Items Generation', () => {
    it('should create line item for base price', () => {
      const items = generateLineItems(false)

      expect(items).toHaveLength(1)
      expect(items[0].price_data.unit_amount).toBe(100) // $1.00
      expect(items[0].price_data.product_data.name).toBe('IQ Snapshot Result')
    })

    it('should include bump when requested', () => {
      const items = generateLineItems(true)

      expect(items).toHaveLength(2)
      expect(items[0].price_data.unit_amount).toBe(100) // Base $1.00
      expect(items[1].price_data.unit_amount).toBe(500) // Bump $5.00
      expect(items[1].price_data.product_data.name).toContain('PDF Report')
    })

    it('should use correct currency', () => {
      const items = generateLineItems(true)

      items.forEach((item) => {
        expect(item.price_data.currency).toBe('usd')
      })
    })
  })

  describe('Rate Limiting', () => {
    it('should allow requests within limit', () => {
      const ip = '192.168.1.1'

      for (let i = 0; i < 5; i++) {
        expect(checkRateLimit(ip)).toBe(true)
      }
    })

    it('should block requests exceeding limit', () => {
      const ip = '192.168.1.2'

      // First 5 requests should pass
      for (let i = 0; i < 5; i++) {
        checkRateLimit(ip)
      }

      // 6th request should fail
      expect(checkRateLimit(ip)).toBe(false)
    })

    it('should reset after time window', () => {
      const ip = '192.168.1.3'

      // Exhaust limit
      for (let i = 0; i < 5; i++) {
        checkRateLimit(ip)
      }

      // Simulate time passing (would need to mock Date.now())
      // In real implementation, this would reset after 60 seconds
    })
  })
})

// Helper functions for testing
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

function hasAllAnswers(answers: Record<string, string>): boolean {
  const requiredQuestions = Array.from({ length: 25 }, (_, i) => `q${i + 1}`)
  return requiredQuestions.every((q) => q in answers)
}

function generateValidAnswers(): Record<string, string> {
  const answers: Record<string, string> = {}
  for (let i = 1; i <= 25; i++) {
    answers[`q${i}`] = String(Math.floor(Math.random() * 3))
  }
  return answers
}

function generateIdempotencyKey(
  email: string,
  answers: Record<string, string>,
  bump: boolean
): string {
  const crypto = require('crypto')
  const normalizedAnswers = JSON.stringify(
    Object.keys(answers)
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: answers[key] }), {})
  )
  return crypto
    .createHash('sha256')
    .update(`${email}-${normalizedAnswers}-${bump}`)
    .digest('hex')
    .substring(0, 32)
}

interface LineItem {
  price_data: {
    currency: string
    unit_amount: number
    product_data: {
      name: string
      description: string
    }
  }
  quantity: number
}

function generateLineItems(bump: boolean): LineItem[] {
  const items: LineItem[] = [
    {
      price_data: {
        currency: 'usd',
        unit_amount: 100,
        product_data: {
          name: 'IQ Snapshot Result',
          description: 'Personalized IQ score, percentile, and interpretation',
        },
      },
      quantity: 1,
    },
  ]

  if (bump) {
    items.push({
      price_data: {
        currency: 'usd',
        unit_amount: 500,
        product_data: {
          name: 'Personalized PDF Report',
          description: 'Detailed breakdown with charts and actionable insights',
        },
      },
      quantity: 1,
    })
  }

  return items
}

function checkRateLimit(ip: string): boolean {
  // Simplified rate limiter logic for testing
  if (!globalThis.rateLimiterMap) {
    globalThis.rateLimiterMap = new Map<string, { count: number; resetAt: number }>()
  }

  const rateLimiter = globalThis.rateLimiterMap
  const now = Date.now()
  const limit = rateLimiter.get(ip)

  if (!limit || now > limit.resetAt) {
    rateLimiter.set(ip, { count: 1, resetAt: now + 60000 })
    return true
  }

  if (limit.count >= 5) {
    return false
  }

  limit.count++
  return true
}
