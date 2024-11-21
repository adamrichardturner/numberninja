import { api } from './api'

export const userService = {
  deleteAccount: async () => {
    try {
      await api.delete('/user/delete-account')
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  },
}
