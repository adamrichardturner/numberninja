import { SessionConfig } from '../types/session'
import { api } from './api'

export const sessionService = {
  createSession: async (config: SessionConfig) => {
    const response = await api.post('/sessions/create', config)
    return response
  },
  getGameModes: () => api.get('/game-modes'),
  getRangesAndDifficulties: () => api.get('/ranges-and-difficulties'),
  endSession: (sessionId: string) => api.post(`/sessions/${sessionId}/end`, {}),
}
