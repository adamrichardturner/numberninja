import { Operation } from './session'

export type Answer = {
  questionIndex: number
  selectedAnswer: string
  timeTaken: number
  numberA: number
  numberB: number
  operation: Operation
  isCorrect: boolean
}
