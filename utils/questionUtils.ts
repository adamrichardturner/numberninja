import { FormattedQuestion, RawQuestion } from '../types/question'
import { Operation } from '../types/session'
import { getOperationSymbol } from './mathOperations'

export const formatQuestions = (
  questions: RawQuestion[]
): FormattedQuestion[] => {
  return questions.map((q, index) => {
    try {
      const operationSymbol = getOperationSymbol(q.operation as Operation)

      if (!operationSymbol) {
        throw new Error(`Invalid operation: ${q.operation}`)
      }

      const formattedQuestion = {
        ...q,
        question: `${q.numberA} ${operationSymbol} ${q.numberB}`,
        options: generateOptions(q.correctAnswer, q.operation as Operation),
      }

      return formattedQuestion
    } catch (error) {
      console.error(`Error formatting question ${index + 1}:`, error)
      // Return a default formatted question in case of error
      return {
        ...q,
        question: 'Error formatting question',
        options: ['Error'],
      }
    }
  })
}

const generateOptions = (
  correctAnswer: number,
  operation: Operation
): string[] => {
  try {
    const options = [correctAnswer.toString()]
    const range = operation === 'division' ? 3 : 5

    while (options.length < 4) {
      let option: number
      switch (operation) {
        case 'addition':
        case 'subtraction':
          option = correctAnswer + Math.floor(Math.random() * range * 2) - range
          break
        case 'multiplication':
          option =
            correctAnswer +
            (Math.floor(Math.random() * range) - Math.floor(range / 2))
          break
        case 'division':
          if (correctAnswer === 1) {
            option = Math.floor(Math.random() * 4) + 1 // Generate options between 1 and 4
          } else {
            option =
              correctAnswer +
              (Math.random() < 0.5 ? 1 : -1) *
                (Math.floor(Math.random() * range) + 1)
          }
          break
        default:
          throw new Error(`Invalid operation: ${operation}`)
      }

      if (!options.includes(option.toString()) && option > 0) {
        options.push(option.toString())
      }
    }
    const sortedOptions = options.sort(() => Math.random() - 0.5)
    return sortedOptions
  } catch (error) {
    console.error('Error generating options:', error)
    return [correctAnswer.toString(), 'Error', 'Error', 'Error']
  }
}
