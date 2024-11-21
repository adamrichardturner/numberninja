import { api } from './api'

export const resultsService = {
  getSessionResults: (sessionId: string) =>
    api.get(`/sessions/${sessionId}/results`),
}
