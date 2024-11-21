import { getIdToken } from '../utils/firebase'

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const baseUrl = 'https://your.backend.server'
  const idToken = await getIdToken()
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${idToken}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(`${baseUrl}/api${endpoint}`, {
      ...options,
      headers,
    })
    if (!response.ok) {
      console.error(
        `API error: ${response.status} ${response.statusText} for ${endpoint}`
      )
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint),
  post: (endpoint: string, body: any) =>
    fetchWithAuth(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) =>
    fetchWithAuth(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: 'DELETE' }),
}
