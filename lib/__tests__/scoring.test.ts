import { describe, it, expect } from 'vitest'
import { scoreAnswers, validateAnswers } from '../scoring'

describe('IQ Scoring', () => {
  describe('validateAnswers', () => {
    it('should validate correct answers format', () => {
      const answers = {
        q1: '0',
        q2: '1',
        q3: '2',
        q4: '0',
        q5: '1',
        q6: '2',
        q7: '0',
        q8: '1',
        q9: '2',
        q10: '0',
        q11: '1',
        q12: '2',
        q13: '0',
        q14: '1',
        q15: '2',
        q16: '0',
        q17: '1',
        q18: '2',
        q19: '0',
        q20: '1',
        q21: '2',
        q22: '0',
        q23: '1',
        q24: '2',
        q25: '0',
      }

      expect(validateAnswers(answers)).toBe(true)
    })

    it('should reject incomplete answers', () => {
      const answers = {
        q1: '0',
        q2: '1',
        // Missing remaining questions
      }

      expect(validateAnswers(answers)).toBe(false)
    })

    it('should reject empty answers', () => {
      expect(validateAnswers({})).toBe(false)
    })

    it('should reject invalid question IDs', () => {
      const answers = {
        q1: '0',
        q2: '1',
        q3: '2',
        q4: '0',
        q5: '1',
        q6: '2',
        q7: '0',
        q8: '1',
        q9: '2',
        q10: '0',
        q11: '1',
        q12: '2',
        q13: '0',
        q14: '1',
        q15: '2',
        q16: '0',
        q17: '1',
        q18: '2',
        q19: '0',
        q20: '1',
        q21: '2',
        q22: '0',
        q23: '1',
        q24: '2',
        invalid: '0', // Invalid question ID
      }

      expect(validateAnswers(answers)).toBe(false)
    })
  })

  describe('scoreAnswers', () => {
    it('should calculate score for all correct answers', () => {
      const answers = {
        q1: '2',
        q2: '1',
        q3: '0',
        q4: '2',
        q5: '1',
        q6: '0',
        q7: '2',
        q8: '1',
        q9: '0',
        q10: '2',
        q11: '1',
        q12: '0',
        q13: '2',
        q14: '1',
        q15: '0',
        q16: '2',
        q17: '1',
        q18: '0',
        q19: '2',
        q20: '1',
        q21: '0',
        q22: '2',
        q23: '1',
        q24: '0',
        q25: '2',
      }

      const result = scoreAnswers(answers)

      expect(result).toHaveProperty('iqScore')
      expect(result).toHaveProperty('rawScore')
      expect(result).toHaveProperty('percentile')
      expect(result).toHaveProperty('band')
      expect(result).toHaveProperty('interpretation')
      expect(result.rawScore).toBeGreaterThan(0)
      expect(result.rawScore).toBeLessThanOrEqual(25)
      expect(result.iqScore).toBeGreaterThanOrEqual(70)
      expect(result.iqScore).toBeLessThanOrEqual(145)
      expect(result.percentile).toBeGreaterThanOrEqual(0)
      expect(result.percentile).toBeLessThanOrEqual(100)
    })

    it('should calculate score for all incorrect answers', () => {
      const answers = {
        q1: '0',
        q2: '0',
        q3: '0',
        q4: '0',
        q5: '0',
        q6: '0',
        q7: '0',
        q8: '0',
        q9: '0',
        q10: '0',
        q11: '0',
        q12: '0',
        q13: '0',
        q14: '0',
        q15: '0',
        q16: '0',
        q17: '0',
        q18: '0',
        q19: '0',
        q20: '0',
        q21: '0',
        q22: '0',
        q23: '0',
        q24: '0',
        q25: '0',
      }

      const result = scoreAnswers(answers)

      expect(result.rawScore).toBeGreaterThanOrEqual(0)
      expect(result.iqScore).toBeGreaterThanOrEqual(70)
    })

    it('should return consistent bands for different score ranges', () => {
      // Test with different answer patterns to check band consistency
      const perfectAnswers = {
        q1: '2',
        q2: '2',
        q3: '2',
        q4: '2',
        q5: '2',
        q6: '2',
        q7: '2',
        q8: '2',
        q9: '2',
        q10: '2',
        q11: '2',
        q12: '2',
        q13: '2',
        q14: '2',
        q15: '2',
        q16: '2',
        q17: '2',
        q18: '2',
        q19: '2',
        q20: '2',
        q21: '2',
        q22: '2',
        q23: '2',
        q24: '2',
        q25: '2',
      }

      const result = scoreAnswers(perfectAnswers)

      expect(['Below Average', 'Average', 'Above Average', 'Superior', 'Very Superior']).toContain(
        result.band
      )
      expect(result.interpretation).toBeTruthy()
      expect(typeof result.interpretation).toBe('string')
    })
  })
})
