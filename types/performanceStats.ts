import { Translations } from '../contexts/languageContext'
import { Operation } from './session'

export type PerformancePeriod = 'all' | '6M' | '3M' | '1M' | '1W' | '1D'

// API Responses

export interface OperationPerformanceResponse {
  operation: Operation
  total_questions: string
  correct_answers: string
  wrong_answers: string
  percentage: string
  date: string
}

export interface TotalStatsResponse {
  total_questions: string
  correct_answers: string
  wrong_answers: string
  date: string
}

// Formatted Types

export type SessionData = {
  id: string
  mode: string
  operation: string
  range: string
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  averageTime: number
  totalTime: number
  accuracy: number
  answeredAt: Date
}

export type OperationPerformance = {
  operation: Operation
  accuracy: number
  wrongAnswers: number
  correctAnswers: number
  totalQuestions: number
  translations?: Translations
  date?: string
}

export interface TotalStats {
  totalQuestions: number
  correctAnswers: number
  averageAccuracy: number
  wrongAnswers: number
  date?: string
}

export type CommonWrongAnswer = {
  question: string
  operation?: string
  wrong_attempts: string
  date?: string
}

export type CommonWrongAnswersType = {
  [key in Operation]: CommonWrongAnswer[]
}
