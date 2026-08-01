const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const CAREGIVER_TOKEN_KEY = 'voca_token'
const BOARD_TOKEN_KEY = 'voca_board_token'
const ACTIVE_SCOPE_KEY = 'voca_active_scope' // 'caregiver' | 'board'
export const ACTIVE_PROFILE_KEY = 'voca_active_profile'

export function getActiveScope() {
  return localStorage.getItem(ACTIVE_SCOPE_KEY) || 'caregiver'
}

export function getToken() {
  return getActiveScope() === 'board'
    ? localStorage.getItem(BOARD_TOKEN_KEY)
    : localStorage.getItem(CAREGIVER_TOKEN_KEY)
}

export function setCaregiverToken(token) {
  localStorage.setItem(CAREGIVER_TOKEN_KEY, token)
  localStorage.setItem(ACTIVE_SCOPE_KEY, 'caregiver')
}

export function setBoardToken(token) {
  // Physically discard the caregiver bearer credential — leaving it in storage
  // during a kid session means anyone with devtools can replay it directly
  // against the API, bypassing any UI-level gate.
  localStorage.removeItem(CAREGIVER_TOKEN_KEY)
  localStorage.setItem(BOARD_TOKEN_KEY, token)
  localStorage.setItem(ACTIVE_SCOPE_KEY, 'board')
}

export function clearToken() {
  localStorage.removeItem(CAREGIVER_TOKEN_KEY)
  localStorage.removeItem(BOARD_TOKEN_KEY)
  localStorage.removeItem(ACTIVE_SCOPE_KEY)
  localStorage.removeItem(ACTIVE_PROFILE_KEY)
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
