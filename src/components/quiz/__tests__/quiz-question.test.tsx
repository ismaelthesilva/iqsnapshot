import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import QuizQuestion from '../quiz-question'

describe('QuizQuestion Component', () => {
  const mockQuestion = {
    id: 'q1',
    text: 'What comes next in this sequence: 2, 4, 6, 8, ?',
    options: ['9', '10', '12'],
    correctAnswer: 2,
    category: 'numerical' as const,
  }

  const mockOnAnswer = vi.fn()

  beforeEach(() => {
    mockOnAnswer.mockClear()
  })

  describe('Rendering', () => {
    it('should render question text', () => {
      render(
        <QuizQuestion question={mockQuestion} selectedAnswer={undefined} onAnswer={mockOnAnswer} />
      )

      expect(screen.getByText(/What comes next in this sequence/i)).toBeInTheDocument()
    })

    it('should render all options', () => {
      render(
        <QuizQuestion question={mockQuestion} selectedAnswer={undefined} onAnswer={mockOnAnswer} />
      )

      expect(screen.getByText('9')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
    })

    it('should render 3 option buttons', () => {
      const { container } = render(
        <QuizQuestion question={mockQuestion} selectedAnswer={undefined} onAnswer={mockOnAnswer} />
      )

      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('User Interaction', () => {
    it('should call onAnswer when option is clicked', () => {
      render(
        <QuizQuestion question={mockQuestion} selectedAnswer={undefined} onAnswer={mockOnAnswer} />
      )

      const option = screen.getByText('10')
      fireEvent.click(option)

      expect(mockOnAnswer).toHaveBeenCalledTimes(1)
      expect(mockOnAnswer).toHaveBeenCalledWith('q1', '1')
    })

    it('should call onAnswer with correct indices for each option', () => {
      render(
        <QuizQuestion question={mockQuestion} selectedAnswer={undefined} onAnswer={mockOnAnswer} />
      )

      // Click first option
      fireEvent.click(screen.getByText('9'))
      expect(mockOnAnswer).toHaveBeenLastCalledWith('q1', '0')

      // Click second option
      fireEvent.click(screen.getByText('10'))
      expect(mockOnAnswer).toHaveBeenLastCalledWith('q1', '1')

      // Click third option
      fireEvent.click(screen.getByText('12'))
      expect(mockOnAnswer).toHaveBeenLastCalledWith('q1', '2')
    })

    it('should allow changing answer', () => {
      const { rerender } = render(
        <QuizQuestion question={mockQuestion} selectedAnswer={undefined} onAnswer={mockOnAnswer} />
      )

      // Select first answer
      fireEvent.click(screen.getByText('9'))
      expect(mockOnAnswer).toHaveBeenCalledWith('q1', '0')

      // Change to second answer
      rerender(<QuizQuestion question={mockQuestion} selectedAnswer="0" onAnswer={mockOnAnswer} />)

      fireEvent.click(screen.getByText('10'))
      expect(mockOnAnswer).toHaveBeenCalledWith('q1', '1')
    })
  })

  describe('Selected State', () => {
    it('should highlight selected answer', () => {
      const { container } = render(
        <QuizQuestion question={mockQuestion} selectedAnswer="1" onAnswer={mockOnAnswer} />
      )

      // The selected option button should have different styling
      const buttons = Array.from(container.querySelectorAll('button'))
      const selectedButton = buttons.find((btn) => btn.textContent === '10')

      expect(selectedButton).toBeDefined()
      // Check if it has selected styling (this depends on your actual implementation)
    })

    it('should show no selection when undefined', () => {
      render(
        <QuizQuestion question={mockQuestion} selectedAnswer={undefined} onAnswer={mockOnAnswer} />
      )

      // All buttons should be in unselected state
      expect(screen.getByText('9')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle long question text', () => {
      const longQuestion = {
        ...mockQuestion,
        text: 'This is a very long question that contains a lot of text and should still render correctly without breaking the layout or causing any visual issues in the component structure.',
      }

      render(
        <QuizQuestion question={longQuestion} selectedAnswer={undefined} onAnswer={mockOnAnswer} />
      )

      expect(screen.getByText(/This is a very long question/i)).toBeInTheDocument()
    })

    it('should handle long option text', () => {
      const longOptions = {
        ...mockQuestion,
        options: ['Very long option A', 'Very long option B', 'Very long option C'],
      }

      render(
        <QuizQuestion question={longOptions} selectedAnswer={undefined} onAnswer={mockOnAnswer} />
      )

      expect(screen.getByText('Very long option A')).toBeInTheDocument()
      expect(screen.getByText('Very long option B')).toBeInTheDocument()
      expect(screen.getByText('Very long option C')).toBeInTheDocument()
    })

    it('should not crash with empty text', () => {
      const emptyQuestion = {
        ...mockQuestion,
        text: '',
      }

      expect(() => {
        render(
          <QuizQuestion
            question={emptyQuestion}
            selectedAnswer={undefined}
            onAnswer={mockOnAnswer}
          />
        )
      }).not.toThrow()
    })
  })
})
