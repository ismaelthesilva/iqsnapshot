import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register fonts (using system fonts for compatibility)
Font.register({
  family: 'Helvetica',
  fonts: [{ src: 'Helvetica' }, { src: 'Helvetica-Bold', fontWeight: 'bold' }],
})

// Define types
export interface ReportData {
  email: string
  iqScore: number
  rawScore: number
  percentile: number
  band: string
  interpretation: string
  reportId: string
  date: string
}

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2pt solid #667eea',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  scoreSection: {
    marginTop: 20,
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f8f9ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  largeScore: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  bandText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#764ba2',
    marginBottom: 5,
  },
  percentileText: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: '1pt solid #e0e0e0',
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.8,
    color: '#444',
    marginBottom: 10,
    textAlign: 'justify',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 20,
  },
  statBox: {
    width: '30%',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  bulletList: {
    marginTop: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 10,
  },
  bullet: {
    width: 20,
    fontSize: 14,
    color: '#667eea',
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.6,
    color: '#444',
  },
  recommendationBox: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f9ff',
    borderLeft: '3pt solid #667eea',
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#555',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 15,
    borderTop: '1pt solid #e0e0e0',
    fontSize: 8,
    color: '#999',
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    right: 40,
    fontSize: 9,
    color: '#999',
  },
  chartPlaceholder: {
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginTop: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    fontSize: 10,
    color: '#999',
  },
})

// Get recommendations based on IQ band
function getRecommendations(band: string): Array<{ title: string; text: string }> {
  const allRecommendations = [
    {
      title: '🧠 Engage in Complex Problem-Solving',
      text: 'Challenge your mind with puzzles, strategy games, and logic problems. Activities like chess, Sudoku, and brain teasers strengthen neural pathways and enhance cognitive flexibility.',
    },
    {
      title: '📚 Commit to Continuous Learning',
      text: 'Learn new skills regularly—whether a language, musical instrument, or technical skill. Neuroplasticity research shows that learning new things creates new neural connections throughout life.',
    },
    {
      title: '💪 Prioritize Physical Exercise',
      text: 'Regular aerobic exercise increases blood flow to the brain, promotes neurogenesis, and improves memory and executive function. Aim for 150 minutes of moderate exercise weekly.',
    },
    {
      title: '😴 Optimize Your Sleep Quality',
      text: 'Quality sleep is essential for memory consolidation and cognitive performance. Aim for 7-9 hours nightly, maintain consistent sleep schedules, and create a dark, cool sleeping environment.',
    },
    {
      title: '🥗 Fuel Your Brain with Nutrition',
      text: 'A Mediterranean-style diet rich in omega-3 fatty acids, antioxidants, and whole foods supports cognitive health. Stay hydrated and limit processed foods and excessive sugar.',
    },
    {
      title: '🧘 Practice Mindfulness and Meditation',
      text: 'Regular meditation improves attention, working memory, and emotional regulation. Even 10-15 minutes daily can produce measurable improvements in cognitive function.',
    },
    {
      title: '🤝 Maintain Strong Social Connections',
      text: 'Social engagement stimulates cognitive function and may protect against cognitive decline. Engage in meaningful conversations, join clubs, and nurture relationships.',
    },
  ]

  // Return 5-7 recommendations based on band
  if (band === 'Very Superior' || band === 'Superior') {
    return allRecommendations.slice(0, 6)
  } else if (band === 'High Average' || band === 'Average') {
    return allRecommendations.slice(0, 7)
  } else {
    return allRecommendations.slice(0, 5)
  }
}

// Get cognitive profile based on band
function getCognitiveProfile(
  band: string,
  rawScore: number
): {
  strengths: string[]
  opportunities: string[]
} {
  const totalQuestions = 25

  if (band === 'Very Superior' || band === 'Superior') {
    return {
      strengths: [
        'Exceptional pattern recognition and abstract reasoning',
        'Strong analytical and critical thinking skills',
        'Advanced problem-solving capabilities',
        'High capacity for learning and retaining complex information',
      ],
      opportunities: [
        'Continue challenging yourself with advanced materials',
        'Consider mentoring others to deepen your own understanding',
        'Explore interdisciplinary learning to broaden perspectives',
      ],
    }
  } else if (band === 'High Average') {
    return {
      strengths: [
        'Above-average logical reasoning abilities',
        'Good capacity for learning new concepts',
        'Solid analytical thinking skills',
        `Strong performance (${rawScore}/${totalQuestions} correct answers)`,
      ],
      opportunities: [
        'Practice more complex problem-solving scenarios',
        'Develop speed and accuracy through timed exercises',
        'Explore advanced topics in areas of interest',
      ],
    }
  } else if (band === 'Average') {
    return {
      strengths: [
        'Solid foundational reasoning skills',
        'Balanced cognitive abilities',
        `Good performance (${rawScore}/${totalQuestions} correct answers)`,
        'Practical problem-solving capabilities',
      ],
      opportunities: [
        'Build confidence through regular practice',
        'Focus on pattern recognition exercises',
        'Develop systematic problem-solving strategies',
      ],
    }
  } else {
    return {
      strengths: [
        'Willingness to challenge yourself',
        'Room for significant growth',
        'Foundational skills to build upon',
      ],
      opportunities: [
        'Practice fundamental logic and reasoning exercises',
        'Work through problems systematically and patiently',
        'Consider working with a tutor or cognitive training program',
        'Focus on building confidence through small wins',
      ],
    }
  }
}

// PDF Document Component
const IQReportDocument: React.FC<{ data: ReportData }> = ({ data }) => {
  const recommendations = getRecommendations(data.band)
  const cognitiveProfile = getCognitiveProfile(data.band, data.rawScore)

  return (
    <Document>
      {/* Page 1: Cover & Score */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Personalized IQ Analysis Report</Text>
          <Text style={styles.subtitle}>Generated: {data.date}</Text>
          <Text style={styles.subtitle}>Report ID: {data.reportId}</Text>
          <Text style={styles.subtitle}>Email: {data.email}</Text>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.largeScore}>{data.iqScore}</Text>
          <Text style={styles.scoreLabel}>Your Estimated IQ Score</Text>
          <Text style={styles.bandText}>{data.band}</Text>
          <Text style={styles.percentileText}>
            {data.percentile}th Percentile - Higher than {data.percentile}% of the population
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{data.rawScore}/25</Text>
            <Text style={styles.statLabel}>Correct Answers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{data.percentile}%</Text>
            <Text style={styles.statLabel}>Percentile Rank</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{Math.round((data.rawScore / 25) * 100)}%</Text>
            <Text style={styles.statLabel}>Accuracy Rate</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Understanding Your Score</Text>
          <Text style={styles.paragraph}>{data.interpretation}</Text>
          <Text style={styles.paragraph}>
            This report provides a comprehensive analysis of your cognitive abilities based on your
            performance on our standardized assessment. While IQ scores are one measure of cognitive
            ability, they represent potential rather than destiny. The insights and recommendations
            in this report are designed to help you maximize your cognitive potential.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            The $1 IQ Snapshot © 2025 - This report is for personal use only and should not be used
            for clinical diagnosis.
          </Text>
        </View>
        <Text style={styles.pageNumber}>Page 1</Text>
      </Page>

      {/* Page 2: Score Distribution & What It Means */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score Distribution Analysis</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>
              Your score: {data.iqScore} | Population Average: 100
            </Text>
            <Text style={styles.chartText}>Classification: {data.band}</Text>
          </View>
          <Text style={styles.paragraph}>
            IQ scores follow a normal distribution in the population, with a mean of 100 and a
            standard deviation of 15. Your score of {data.iqScore} places you in the &quot;
            {data.band}&quot; category, which represents approximately{' '}
            {data.percentile >= 98 ? '2%' : data.percentile >= 90 ? '9%' : '16%'} of the population.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Your Score Means in Practice</Text>

          {data.band === 'Very Superior' || data.band === 'Superior' ? (
            <>
              <Text style={styles.paragraph}>
                Your score indicates exceptional cognitive abilities. Individuals in this range
                typically excel in complex problem-solving, abstract reasoning, and pattern
                recognition. You likely find it easy to grasp new concepts quickly and can handle
                multiple complex variables simultaneously.
              </Text>
              <Text style={styles.paragraph}>
                In academic and professional settings, you may notice that you process information
                faster than peers, see connections others miss, and can work through complex
                problems with relative ease. This cognitive advantage can be leveraged in fields
                requiring high-level analytical thinking, strategic planning, and innovation.
              </Text>
            </>
          ) : data.band === 'High Average' ? (
            <>
              <Text style={styles.paragraph}>
                Your score indicates above-average cognitive abilities. You have strong analytical
                and reasoning skills that serve you well in academic and professional environments.
                You can handle complex tasks effectively and learn new skills with relative ease.
              </Text>
              <Text style={styles.paragraph}>
                You likely excel in structured problem-solving and can manage multiple priorities
                effectively. With focused effort and practice, you can achieve excellence in most
                cognitive domains. Your score suggests solid potential for success in careers
                requiring analytical thinking and strategic decision-making.
              </Text>
            </>
          ) : data.band === 'Average' ? (
            <>
              <Text style={styles.paragraph}>
                Your score falls within the average range, shared by the majority of the population.
                This indicates solid, well-rounded cognitive abilities. You have the fundamental
                reasoning and problem-solving skills needed for success in most academic and
                professional pursuits.
              </Text>
              <Text style={styles.paragraph}>
                Success in life depends on many factors beyond IQ, including emotional intelligence,
                persistence, creativity, and practical skills. With dedicated effort and effective
                learning strategies, you can achieve your goals and continue developing your
                cognitive abilities throughout life.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.paragraph}>
                Your score indicates areas for growth in certain cognitive domains. Remember that IQ
                tests measure specific types of reasoning and problem-solving, not your overall
                worth or potential. Many successful individuals have average or below-average IQ
                scores but excel through determination, creativity, and practical intelligence.
              </Text>
              <Text style={styles.paragraph}>
                This assessment represents a starting point for development. With targeted practice,
                effective learning strategies, and persistence, you can significantly improve your
                cognitive abilities. The brain is remarkably plastic, and cognitive skills can be
                developed throughout life.
              </Text>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text>
            The $1 IQ Snapshot © 2025 - This report is for personal use only and should not be used
            for clinical diagnosis.
          </Text>
        </View>
        <Text style={styles.pageNumber}>Page 2</Text>
      </Page>

      {/* Page 3: Cognitive Profile */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Cognitive Profile</Text>
          <Text style={styles.paragraph}>
            Based on your performance across different question types, here&apos;s an analysis of
            your cognitive strengths and opportunities for growth.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Strengths</Text>
          <View style={styles.bulletList}>
            {cognitiveProfile.strengths.map((strength, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bullet}>✓</Text>
                <Text style={styles.bulletText}>{strength}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Opportunities</Text>
          <View style={styles.bulletList}>
            {cognitiveProfile.opportunities.map((opportunity, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bullet}>→</Text>
                <Text style={styles.bulletText}>{opportunity}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Breakdown</Text>
          <Text style={styles.paragraph}>
            You answered {data.rawScore} out of 25 questions correctly, demonstrating a{' '}
            {Math.round((data.rawScore / 25) * 100)}% accuracy rate. This performance, combined with
            the difficulty weighting of the questions, resulted in your IQ estimate of{' '}
            {data.iqScore}.
          </Text>
          <Text style={styles.paragraph}>
            The questions in this assessment were designed to evaluate multiple cognitive domains
            including pattern recognition, logical reasoning, spatial awareness, and abstract
            thinking. Your performance indicates relative strengths in areas where you scored
            highest and opportunities for development in more challenging question types.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            The $1 IQ Snapshot © 2025 - This report is for personal use only and should not be used
            for clinical diagnosis.
          </Text>
        </View>
        <Text style={styles.pageNumber}>Page 3</Text>
      </Page>

      {/* Pages 4-5: Recommendations */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Science-Backed Strategies to Enhance Cognitive Performance
          </Text>
          <Text style={styles.paragraph}>
            Research in neuroscience and cognitive psychology has identified several evidence-based
            strategies for enhancing cognitive function. Here are personalized recommendations based
            on your profile:
          </Text>
        </View>

        {recommendations.slice(0, 4).map((rec, index) => (
          <View key={index} style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>{rec.title}</Text>
            <Text style={styles.recommendationText}>{rec.text}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text>
            The $1 IQ Snapshot © 2025 - This report is for personal use only and should not be used
            for clinical diagnosis.
          </Text>
        </View>
        <Text style={styles.pageNumber}>Page 4</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        {recommendations.slice(4).map((rec, index) => (
          <View key={index} style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>{rec.title}</Text>
            <Text style={styles.recommendationText}>{rec.text}</Text>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creating Your Personal Development Plan</Text>
          <Text style={styles.paragraph}>
            Choose 2-3 recommendations from this report to focus on initially. Consistency is more
            important than perfection. Small, daily actions compound over time to produce
            significant improvements in cognitive function.
          </Text>
          <Text style={styles.paragraph}>
            Track your progress and reassess every 3-6 months. Cognitive enhancement is a journey,
            not a destination. Celebrate small wins and maintain a growth mindset throughout the
            process.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>1.</Text>
              <Text style={styles.bulletText}>
                Review this report carefully and identify 2-3 strategies that resonate with you
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>2.</Text>
              <Text style={styles.bulletText}>
                Create specific, actionable goals for implementing these strategies
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>3.</Text>
              <Text style={styles.bulletText}>
                Set calendar reminders to maintain consistency with your new habits
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>4.</Text>
              <Text style={styles.bulletText}>
                Consider retaking the assessment in 6-12 months to track your progress
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            The $1 IQ Snapshot © 2025 - This report is for personal use only and should not be used
            for clinical diagnosis.
          </Text>
        </View>
        <Text style={styles.pageNumber}>Page 5</Text>
      </Page>

      {/* Page 6: Disclaimer & Resources */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Disclaimer</Text>
          <Text style={styles.paragraph}>
            This IQ assessment is designed for entertainment and educational purposes. While based
            on established cognitive testing principles, it is not a substitute for professional
            psychological assessment. For clinical purposes, consult a licensed psychologist who can
            administer comprehensive, standardized IQ tests.
          </Text>
          <Text style={styles.paragraph}>
            IQ scores represent one measure of cognitive ability and do not capture the full range
            of human intelligence, including emotional intelligence, creativity, practical
            intelligence, and social skills. Success in life depends on many factors beyond
            cognitive ability.
          </Text>
          <Text style={styles.paragraph}>
            The recommendations in this report are general guidelines based on cognitive science
            research. Individual results may vary. Consult healthcare professionals before making
            significant changes to your lifestyle, especially regarding exercise or nutrition.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Assessment</Text>
          <Text style={styles.paragraph}>
            The $1 IQ Snapshot uses a 25-question assessment designed to evaluate multiple cognitive
            domains. Questions are weighted by difficulty, and scores are calibrated against
            population norms to produce an estimated IQ score.
          </Text>
          <Text style={styles.paragraph}>
            This assessment measures fluid intelligence (the ability to solve novel problems) and
            pattern recognition skills. It does not measure crystallized intelligence (accumulated
            knowledge), which also contributes to overall cognitive ability.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Resources</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                &quot;Peak: Secrets from the New Science of Expertise&quot; by Anders Ericsson
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                &quot;Thinking, Fast and Slow&quot; by Daniel Kahneman
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                &quot;The Brain That Changes Itself&quot; by Norman Doidge
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Lumosity, Elevate, or Peak apps for cognitive training
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Khan Academy for structured learning in various subjects
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thank You</Text>
          <Text style={styles.paragraph}>
            Thank you for taking The $1 IQ Snapshot assessment. We hope this report provides
            valuable insights into your cognitive abilities and inspires you to continue your
            personal development journey.
          </Text>
          <Text style={styles.paragraph}>
            Remember: Intelligence is not fixed. With the right strategies, consistent effort, and a
            growth mindset, you can continue developing your cognitive abilities throughout your
            life.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            The $1 IQ Snapshot © 2025 - This report is for personal use only and should not be used
            for clinical diagnosis.
          </Text>
          <Text>Report ID: {data.reportId}</Text>
        </View>
        <Text style={styles.pageNumber}>Page 6</Text>
      </Page>
    </Document>
  )
}

/**
 * Generate a personalized IQ report PDF
 * @param data Report data including IQ score, percentile, etc.
 * @returns Promise<Buffer> PDF file as buffer
 */
export async function generateIQReport(
  data: Omit<ReportData, 'reportId' | 'date'>
): Promise<Buffer> {
  const { renderToBuffer } = await import('@react-pdf/renderer')

  // Generate report metadata
  const reportId = `IQ-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const fullData: ReportData = {
    ...data,
    reportId,
    date,
  }

  try {
    // Render PDF to buffer
    const pdfBuffer = await renderToBuffer(<IQReportDocument data={fullData} />)
    return pdfBuffer
  } catch (error) {
    console.error('❌ PDF generation error:', error)
    throw new Error('Failed to generate PDF report')
  }
}
