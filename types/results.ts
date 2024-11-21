import { Question } from './question'

export type GameResults = {
  correctAnswers: number
  wrongAnswers: number
  mode: string
  totalTime: number
  questions: Question[]
}

export type SessionResults = {
  sessionId: string
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  totalTime: number
}
