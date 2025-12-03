/**
 * Test script to validate PDF generation
 * Run with: node --loader tsx test-pdf-generation.js
 */

const fs = require('fs')
const path = require('path')

// Dynamic import for ESM module
async function testPDF() {
  try {
    console.log('🧪 Testing PDF Generation...\n')

    // Import the PDF generator (use dynamic import for TypeScript/TSX)
    const { generateIQReport } = await import('../../lib/pdf-generator.tsx')

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

    console.log('📊 Test Data:')
    console.log(JSON.stringify(testData, null, 2))
    console.log('\n📄 Generating PDF...')

    // Generate PDF
    const pdfBuffer = await generateIQReport(testData)

    console.log(`✅ PDF Generated Successfully!`)
    console.log(`   - Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`)
    console.log(`   - Under 2MB limit: ${pdfBuffer.length < 2 * 1024 * 1024 ? '✅ Yes' : '❌ No'}`)

    // Save PDF to file for inspection
    const outputPath = path.join(__dirname, 'test-output.pdf')
    fs.writeFileSync(outputPath, pdfBuffer)
    console.log(`\n💾 PDF saved to: ${outputPath}`)
    console.log('   Open this file to inspect the PDF content')

    console.log('\n🎉 Test Passed! PDF generation is working correctly.')
  } catch (error) {
    console.error('\n❌ Test Failed!')
    console.error('Error:', error)
    process.exit(1)
  }
}

testPDF()
