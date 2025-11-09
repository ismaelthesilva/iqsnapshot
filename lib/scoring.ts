/**
 * IQ Snapshot Scoring System
 *
 * Assumptions:
 * - 25 questions total
 * - Mean raw score: 12.5 (50% correct)
 * - Standard deviation: 4.0
 * - IQ scale: Mean 100, SD 15
 * - Score range: 70-145
 */

export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number // 0-indexed
  category: 'verbal' | 'logical' | 'spatial' | 'numerical'
}

export const questions: Question[] = [
  {
    id: 'q1',
    text: 'Which word does NOT belong with the others?',
    options: ['Apple', 'Carrot', 'Orange', 'Banana'],
    correctAnswer: 1,
    category: 'verbal',
  },
  {
    id: 'q2',
    text: 'What comes next in the sequence: 2, 4, 8, 16, ?',
    options: ['24', '32', '20', '28'],
    correctAnswer: 1,
    category: 'numerical',
  },
  {
    id: 'q3',
    text: 'Book is to Reading as Fork is to:',
    options: ['Drawing', 'Writing', 'Stirring', 'Eating'],
    correctAnswer: 3,
    category: 'verbal',
  },
  {
    id: 'q4',
    text: 'Which figure completes the pattern? [Square, Circle, Triangle, Square, Circle, ?]',
    options: ['Square', 'Circle', 'Triangle', 'Rectangle'],
    correctAnswer: 2,
    category: 'spatial',
  },
  {
    id: 'q5',
    text: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
    options: ['Yes', 'No', 'Maybe', 'Not enough information'],
    correctAnswer: 0,
    category: 'logical',
  },
  {
    id: 'q6',
    text: 'What is 15% of 200?',
    options: ['25', '30', '35', '40'],
    correctAnswer: 1,
    category: 'numerical',
  },
  {
    id: 'q7',
    text: 'Which word is the opposite of ABUNDANCE?',
    options: ['Scarcity', 'Plenty', 'Excess', 'Wealth'],
    correctAnswer: 0,
    category: 'verbal',
  },
  {
    id: 'q8',
    text: 'What number should replace the question mark: 3, 9, 27, 81, ?',
    options: ['162', '243', '324', '405'],
    correctAnswer: 1,
    category: 'numerical',
  },
  {
    id: 'q9',
    text: 'Mary is taller than Sue. Sue is taller than Jane. Who is the shortest?',
    options: ['Mary', 'Sue', 'Jane', 'Cannot determine'],
    correctAnswer: 2,
    category: 'logical',
  },
  {
    id: 'q10',
    text: 'Which shape can be folded to make a cube?',
    options: [
      'Six squares in a cross pattern',
      'Five squares in a row',
      'Four triangles',
      'Six triangles',
    ],
    correctAnswer: 0,
    category: 'spatial',
  },
  {
    id: 'q11',
    text: 'RELIABLE is to DEPENDABLE as HOSTILE is to:',
    options: ['Friendly', 'Aggressive', 'Neutral', 'Kind'],
    correctAnswer: 1,
    category: 'verbal',
  },
  {
    id: 'q12',
    text: 'What is the next number in the series: 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '13', '15', '10'],
    correctAnswer: 1,
    category: 'numerical',
  },
  {
    id: 'q13',
    text: 'If the day before yesterday was Thursday, what day will it be tomorrow?',
    options: ['Sunday', 'Monday', 'Saturday', 'Tuesday'],
    correctAnswer: 0,
    category: 'logical',
  },
  {
    id: 'q14',
    text: 'Which word is most similar to CANDID?',
    options: ['Deceptive', 'Frank', 'Mysterious', 'Reserved'],
    correctAnswer: 1,
    category: 'verbal',
  },
  {
    id: 'q15',
    text: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
    options: ['0 degrees', '7.5 degrees', '30 degrees', '45 degrees'],
    correctAnswer: 1,
    category: 'spatial',
  },
  {
    id: 'q16',
    text: 'Complete the analogy: Eye is to Seeing as Ear is to:',
    options: ['Listening', 'Hearing', 'Speaking', 'Touching'],
    correctAnswer: 1,
    category: 'verbal',
  },
  {
    id: 'q17',
    text: 'What comes next: J, F, M, A, M, ?',
    options: ['J', 'N', 'S', 'D'],
    correctAnswer: 0,
    category: 'logical',
  },
  {
    id: 'q18',
    text: 'If 5 machines make 5 widgets in 5 minutes, how long does it take 100 machines to make 100 widgets?',
    options: ['5 minutes', '20 minutes', '100 minutes', '500 minutes'],
    correctAnswer: 0,
    category: 'numerical',
  },
  {
    id: 'q19',
    text: 'Which shape is the odd one out?',
    options: ['Square', 'Rectangle', 'Circle', 'Rhombus'],
    correctAnswer: 2,
    category: 'spatial',
  },
  {
    id: 'q20',
    text: 'METICULOUS most nearly means:',
    options: ['Careless', 'Detailed', 'Quick', 'Large'],
    correctAnswer: 1,
    category: 'verbal',
  },
  {
    id: 'q21',
    text: 'What number comes next: 100, 50, 25, 12.5, ?',
    options: ['6.25', '6', '5', '10'],
    correctAnswer: 0,
    category: 'numerical',
  },
  {
    id: 'q22',
    text: 'All roses are flowers. Some flowers fade quickly. Therefore:',
    options: [
      'All roses fade quickly',
      'Some roses may fade quickly',
      'No roses fade quickly',
      'All flowers are roses',
    ],
    correctAnswer: 1,
    category: 'logical',
  },
  {
    id: 'q23',
    text: 'Which two words are most similar in meaning?',
    options: [
      'Happy and Sad',
      'Big and Large',
      'Fast and Slow',
      'Hot and Cold',
    ],
    correctAnswer: 1,
    category: 'verbal',
  },
  {
    id: 'q24',
    text: 'How many squares are in a 3x3 grid?',
    options: ['9', '10', '13', '14'],
    correctAnswer: 3,
    category: 'spatial',
  },
  {
    id: 'q25',
    text: 'What is 2/5 expressed as a percentage?',
    options: ['20%', '25%', '40%', '50%'],
    correctAnswer: 2,
    category: 'numerical',
  },
]

export interface ScoreResult {
  rawScore: number
  iqScore: number
  percentile: number
  band: string
  interpretation: string
}

const MEAN_RAW = 12.5
const SD_RAW = 4.0

export function scoreAnswers(answers: Record<string, string>): ScoreResult {
  // Count correct answers
  let rawScore = 0
  questions.forEach((q) => {
    const userAnswer = answers[q.id]
    if (userAnswer !== undefined) {
      const answerIndex = parseInt(userAnswer, 10)
      if (answerIndex === q.correctAnswer) {
        rawScore++
      }
    }
  })

  // Convert to IQ scale (mean 100, SD 15)
  const zScore = (rawScore - MEAN_RAW) / SD_RAW
  let iqScore = Math.round(100 + zScore * 15)

  // Clamp to realistic range
  iqScore = Math.max(70, Math.min(145, iqScore))

  // Determine band and interpretation
  let band: string
  let interpretation: string
  let percentile: number

  if (iqScore < 85) {
    band = 'Below Average'
    percentile = 16
    interpretation =
      'Your score suggests you have solid foundational reasoning skills. With practice and focus, you can continue to develop your cognitive abilities.'
  } else if (iqScore < 100) {
    band = 'Average'
    percentile = 42
    interpretation =
      'Your score falls in the average range, shared by nearly half of all test-takers. You have good problem-solving abilities and practical intelligence.'
  } else if (iqScore < 115) {
    band = 'Above Average'
    percentile = 75
    interpretation =
      'Your score is above average! You demonstrate strong reasoning and analytical skills. You likely excel in learning new concepts and solving complex problems.'
  } else if (iqScore < 130) {
    band = 'Superior'
    percentile = 90
    interpretation =
      'Excellent work! Your score places you in the superior range. You have exceptional cognitive abilities and likely thrive in intellectually demanding environments.'
  } else {
    band = 'Very Superior'
    percentile = 98
    interpretation =
      'Outstanding! Your score is in the very superior range, placing you among the top 2% of test-takers. You have remarkable intellectual capacity.'
  }

  return {
    rawScore,
    iqScore,
    percentile,
    band,
    interpretation,
  }
}

export function validateAnswers(answers: Record<string, string>): boolean {
  // Check that all questions are answered
  if (Object.keys(answers).length !== questions.length) {
    return false
  }

  // Validate each answer is a valid option index
  for (const question of questions) {
    const answer = answers[question.id]
    if (answer === undefined) return false

    const answerIndex = parseInt(answer, 10)
    if (isNaN(answerIndex) || answerIndex < 0 || answerIndex >= question.options.length) {
      return false
    }
  }

  return true
}
