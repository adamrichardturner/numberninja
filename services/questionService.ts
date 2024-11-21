import { Answer } from '../types/answer'
import { Question } from '../types/question'
import { SessionResults } from '../types/results'
import { api } from './api'

export const questionService = {
  getQuestions: (sessionId: string): Promise<Question[]> =>
    api.get(`/questions/${sessionId}/questions`),

  submitAnswers: (
    sessionId: string,
    answers: Answer[]
  ): Promise<{
    correctAnswers: number
    totalQuestions: number
    totalTime: number
  }> => api.post(`/questions/${sessionId}/submit`, { answers }),

  getSessionResults: (sessionId: string): Promise<SessionResults> =>
    api.get(`/questions/${sessionId}/results`),
}
