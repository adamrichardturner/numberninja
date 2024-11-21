export type RawQuestion = {
  numberA: number
  numberB: number
  operation: string
  correctAnswer: number
}

export type FormattedQuestion = RawQuestion & {
  question: string
  options: string[]
}

export type Question = FormattedQuestion & {
  id?: string
  userAnswer?: string
  timeTaken?: number
  timestamp?: number
}
