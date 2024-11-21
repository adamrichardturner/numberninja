import { Operation } from '../types/session'
import { api } from './api'

export const performanceService = {
  getSessionData: () => api.get('/performance/session-data'),

  getOperationPerformance: () => api.get('/performance/operation-performance'),

  getStrugglingQuestions: (operation: Operation) =>
    api.get(`/performance/struggling-questions?operation=${operation}`),

  getTotalStats: () => api.get('/performance/total-stats'),

  getPerformanceOverTime: () => api.get('/performance/performance-over-time'),

  getCommonWrongAnswers: () => api.get('/performance/common-wrong-answers'),
}
