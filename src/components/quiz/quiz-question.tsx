'use client'

import { Question } from '@/lib/scoring'
import { cn } from '@/lib/utils'

interface QuizQuestionProps {
  question: Question
  selectedAnswer?: string
  onAnswer: (questionId: string, answer: string) => void
}

export default function QuizQuestion({ question, selectedAnswer, onAnswer }: QuizQuestionProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
          {question.category}
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">{question.text}</h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index.toString()
          return (
            <button
              key={index}
              onClick={() => onAnswer(question.id, index.toString())}
              className={cn(
                'w-full text-left p-4 rounded-lg border-2 transition-all',
                'hover:border-blue-400 hover:bg-blue-50',
                isSelected
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 bg-white'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  )}
                >
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-gray-900 font-medium">{option}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
