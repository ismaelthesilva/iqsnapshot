import { describe, it, expect } from 'vitest'
import { generateIQReport } from '../pdf-generator'

describe('PDF Generator', () => {
  const mockResultData = {
    email: 'test@example.com',
    iqScore: 115,
    rawScore: 18,
    percentile: 84,
    band: 'Above Average',
    interpretation: 'Your score indicates above average cognitive abilities.',
    reportId: 'test-report-123',
    date: new Date().toISOString(),
  }

  it('should generate PDF buffer', async () => {
    const pdfBuffer = await generateIQReport(mockResultData)

    expect(pdfBuffer).toBeInstanceOf(Buffer)
    expect(pdfBuffer.length).toBeGreaterThan(0)
  })

  it('should generate PDF with correct header', async () => {
    const pdfBuffer = await generateIQReport(mockResultData)
    const pdfString = pdfBuffer.toString('binary')

    // Check PDF header
    expect(pdfString).toContain('%PDF')
  })

  it('should handle different IQ score ranges', async () => {
    const scores = [
      { iqScore: 75, band: 'Below Average' },
      { iqScore: 95, band: 'Average' },
      { iqScore: 115, band: 'Above Average' },
      { iqScore: 125, band: 'Superior' },
      { iqScore: 135, band: 'Very Superior' },
    ]

    for (const score of scores) {
      const pdfBuffer = await generateIQReport({
        ...mockResultData,
        ...score,
      })

      expect(pdfBuffer).toBeInstanceOf(Buffer)
      expect(pdfBuffer.length).toBeGreaterThan(0)
    }
  })

  it('should generate PDF regardless of data variations', async () => {
    const withDifferentEmail = await generateIQReport({
      ...mockResultData,
      email: 'different@example.com',
    })
    const withDifferentScore = await generateIQReport({
      ...mockResultData,
      iqScore: 120,
    })

    expect(withDifferentEmail).toBeInstanceOf(Buffer)
    expect(withDifferentScore).toBeInstanceOf(Buffer)
  })

  it('should handle edge case IQ scores', async () => {
    const edgeCases = [70, 145] // Min and max IQ scores

    for (const iqScore of edgeCases) {
      const pdfBuffer = await generateIQReport({
        ...mockResultData,
        iqScore,
      })

      expect(pdfBuffer).toBeInstanceOf(Buffer)
      expect(pdfBuffer.length).toBeGreaterThan(0)
    }
  })

  it('should be under 2MB file size limit', async () => {
    const pdfBuffer = await generateIQReport(mockResultData)
    const sizeInMB = pdfBuffer.length / (1024 * 1024)

    expect(sizeInMB).toBeLessThan(2) // Resend 2MB limit
  })
})
