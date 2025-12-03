# 🧪 Testing Documentation

This document explains the test structure and how to run tests for the IQ Snapshot app.

---

## 📁 Test Organization

Tests are **co-located** with source code using the `__tests__/` pattern:

```
iqsnapshot/
├── lib/
│   ├── scoring.ts
│   ├── pdf-generator.tsx
│   └── __tests__/
│       ├── scoring.test.ts              ✅ Unit tests for scoring logic
│       └── pdf-generator.test.ts        ✅ PDF generation tests
├── app/
│   ├── test/
│   │   └── __tests__/
│       │   └── quiz-logic.test.ts       ✅ Quiz flow & navigation logic
│   └── api/
│       └── checkout/
│           └── __tests__/
│               └── route.test.ts        ✅ Checkout API tests
└── components/
    └── quiz/
        └── __tests__/
            └── quiz-question.test.tsx   ✅ Quiz component tests
```

---

## 🚀 Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npm test scoring
npm test pdf-generator
npm test quiz-question
```

### Watch Mode (Auto-rerun on Changes)

```bash
npm test -- --watch
# or
npm run test:watch
```

### Run Tests Once (CI Mode)

```bash
npm test -- --run
```

### Generate Coverage Report

```bash
npm run test:coverage
```

### Visual Test UI (Optional)

```bash
# Install UI first
npm install -D @vitest/ui

# Run with UI
npm run test:ui
```

---

## 📊 Test Coverage

### Current Test Suite:

| Module             | Test File                                          | Tests    | Coverage              |
| ------------------ | -------------------------------------------------- | -------- | --------------------- |
| **Scoring Logic**  | `lib/__tests__/scoring.test.ts`                    | 7 tests  | ✅ Core logic         |
| **PDF Generator**  | `lib/__tests__/pdf-generator.test.ts`              | 6 tests  | ✅ PDF creation       |
| **Checkout API**   | `app/api/checkout/__tests__/route.test.ts`         | 12 tests | ✅ Validation & logic |
| **Quiz Component** | `components/quiz/__tests__/quiz-question.test.tsx` | 12 tests | ✅ User interaction   |
| **Quiz Logic**     | `app/test/__tests__/quiz-logic.test.ts`            | 18 tests | ✅ Flow & navigation  |

**Total:** ~55 automated tests

---

## ✅ What's Tested

### 1. **Scoring Logic** (`lib/__tests__/scoring.test.ts`)

- ✅ Answer validation (25 questions required)
- ✅ Score calculation (70-145 IQ range)
- ✅ Percentile calculation
- ✅ IQ bands (Below Average → Very Superior)
- ✅ Edge cases (all correct, all wrong, incomplete)

### 2. **PDF Generation** (`lib/__tests__/pdf-generator.test.ts`)

- ✅ PDF buffer generation
- ✅ Valid PDF format (header check)
- ✅ Different IQ score ranges
- ✅ File size limits (< 2MB for Resend)
- ✅ Edge case scores (70, 145)

### 3. **Checkout API** (`app/api/checkout/__tests__/route.test.ts`)

- ✅ Email validation & normalization
- ✅ Answer completeness checks
- ✅ Idempotency key generation
- ✅ Line items generation (base + bump)
- ✅ Rate limiting logic

### 4. **Quiz Component** (`components/quiz/__tests__/quiz-question.test.tsx`)

- ✅ Question rendering
- ✅ Option selection
- ✅ Answer callbacks
- ✅ Selected state highlighting
- ✅ Long text handling
- ✅ Edge cases (empty question)

### 5. **Quiz Flow** (`app/test/__tests__/quiz-logic.test.ts`)

- ✅ Answer tracking (25 questions)
- ✅ Progress calculation
- ✅ Navigation logic (prev/next)
- ✅ Session storage (email persistence)
- ✅ Paywall trigger conditions
- ✅ Auto-advance behavior
- ✅ Question validation

---

## 🔧 Test Configuration

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

### `vitest.setup.ts`

```typescript
import '@testing-library/jest-dom'
```

---

## 📝 Writing New Tests

### Example: Testing a Utility Function

Create `lib/__tests__/my-util.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '../my-util'

describe('myFunction', () => {
  it('should return expected value', () => {
    const result = myFunction('input')
    expect(result).toBe('expected')
  })

  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('')
    expect(myFunction(null)).toBeNull()
  })
})
```

### Example: Testing a Component

Create `components/__tests__/my-component.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from '../my-component'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const onClick = vi.fn()
    render(<MyComponent onClick={onClick} />)

    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

---

## 🎯 Test Guidelines

### ✅ DO:

- Write tests for critical business logic
- Test edge cases and error conditions
- Use descriptive test names
- Keep tests focused (one concept per test)
- Mock external dependencies (Stripe, Resend)
- Test user interactions, not implementation details

### ❌ DON'T:

- Test third-party libraries
- Write brittle tests (coupled to DOM structure)
- Skip edge cases
- Test implementation details
- Ignore failing tests

---

## 🐛 Debugging Tests

### See Test Output

```bash
npm test -- --reporter=verbose
```

### Run Single Test

```bash
npm test -- --grep="should validate answers"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test", "--", "--run"],
  "console": "integratedTerminal"
}
```

---

## 📈 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install
      - run: npm test -- --run
      - run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 🎓 Learning Resources

- **Vitest Docs:** https://vitest.dev
- **Testing Library:** https://testing-library.com/docs/react-testing-library/intro
- **Test Best Practices:** https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests passing: `npm test -- --run`
- [ ] No TypeScript errors: `npm run build`
- [ ] Coverage acceptable: `npm run test:coverage`
- [ ] Manual testing complete (with coupons)
- [ ] Environment variables verified

---

**Last Updated:** December 2025
