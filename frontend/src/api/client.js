// HTTP client for the Voca backend — JWT bearer auth, JSON in/out.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const TOKEN_KEY = 'voca_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return !!getToken()
}

const unauthorizedListeners = new Set()
export function onUnauthorized(fn) {
  unauthorizedListeners.add(fn)
  return () => unauthorizedListeners.delete(fn)
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the Voca server. Is the backend running?')
  }

  if (response.status === 401 && auth) {
    clearToken()
    unauthorizedListeners.forEach(fn => fn())
  }

  if (!response.ok) {
    let detail = `HTTP ${response.status}`
    try {
      const data = await response.json()
      detail = data.detail || detail
      if (Array.isArray(detail)) detail = detail.map(d => d.msg).join('; ')
    } catch { /* not JSON */ }
    throw new ApiError(response.status, detail)
  }

  if (response.status === 204) return null
  return response.json()
}
