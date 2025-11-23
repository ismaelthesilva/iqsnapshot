import { NextResponse } from 'next/server'
import { generateIQReport } from '@/lib/pdf-generator'

/**
 * Test endpoint to verify PDF generation
 * Visit: http://localhost:3000/api/test-pdf
 */
export async function GET() {
  try {
    console.log('🧪 Testing PDF Generation...')

    // Test data
    const testData = {
      email: 'ismaelsilva@icloud.com',
      iqScore: 130,
      rawScore: 20,
      percentile: 95,
      band: 'Superior',
      interpretation:
        'Your score of 130 places you in the "Superior" range, indicating exceptional cognitive abilities. You demonstrate strong pattern recognition, analytical thinking, and problem-solving skills.',
    }

    console.log('📊 Test Data:', testData)
    console.log('📄 Generating PDF...')

    // Generate PDF
    const pdfBuffer = await generateIQReport(testData)

    console.log('✅ PDF Generated Successfully!')
    console.log(`   - Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`)
    console.log(`   - Under 2MB: ${pdfBuffer.length < 2 * 1024 * 1024 ? 'Yes' : 'No'}`)

    // Return PDF as download
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="IQ-Analysis-Report-Test-130.pdf"',
      },
    })
  } catch (error) {
    console.error('❌ PDF Generation Error:', error)
    return NextResponse.json(
      {
        error: 'PDF generation failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
