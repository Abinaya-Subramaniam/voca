// Typed endpoint functions for the Voca backend API.

import { request, setToken, clearToken } from './client'

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function register(email, password) {
  const data = await request('/api/auth/register', {
    method: 'POST', body: { email, password }, auth: false,
  })
  setToken(data.accessToken)
  return data.user
}

export async function login(email, password) {
  const data = await request('/api/auth/login', {
    method: 'POST', body: { email, password }, auth: false,
  })
  setToken(data.accessToken)
  return data.user
}

export function logout() {
  clearToken()
}

export const getMe = () => request('/api/auth/me')

// ── Profiles ──────────────────────────────────────────────────────────────────

export const listProfiles = () => request('/api/profiles')
export const createProfile = (name, avatarColor) =>
  request('/api/profiles', { method: 'POST', body: { name, avatarColor } })
export const getProfile = (profileId) => request(`/api/profiles/${profileId}`)
export const updateProfile = (profileId, updates) =>
  request(`/api/profiles/${profileId}`, { method: 'PATCH', body: updates })
export const deleteProfile = (profileId) =>
  request(`/api/profiles/${profileId}`, { method: 'DELETE' })
export const optimiseLayout = (profileId) =>
  request(`/api/profiles/${profileId}/optimise-layout`, { method: 'POST' })

// ── Boards ────────────────────────────────────────────────────────────────────

export const listBoards = (profileId) => request(`/api/profiles/${profileId}/boards`)
export const createBoard = (profileId, name, category = 'custom') =>
  request(`/api/profiles/${profileId}/boards`, { method: 'POST', body: { name, category } })
export const updateBoard = (profileId, boardId, updates) =>
  request(`/api/profiles/${profileId}/boards/${boardId}`, { method: 'PATCH', body: updates })
export const deleteBoard = (profileId, boardId) =>
  request(`/api/profiles/${profileId}/boards/${boardId}`, { method: 'DELETE' })
export const addSymbolToBoard = (profileId, boardId, symbol) =>
  request(`/api/profiles/${profileId}/boards/${boardId}/symbols`, { method: 'POST', body: symbol })
export const removeSymbolFromBoard = (profileId, boardId, symbolId) =>
  request(`/api/profiles/${profileId}/boards/${boardId}/symbols/${symbolId}`, { method: 'DELETE' })
export const reorderBoardSymbols = (profileId, boardId, symbols) =>
  request(`/api/profiles/${profileId}/boards/${boardId}/symbols`, { method: 'PUT', body: { symbols } })

// ── Communication logs / predictions ─────────────────────────────────────────

export const logSentence = (profileId, boardId, symbols, sentence) =>
  request(`/api/profiles/${profileId}/sentences`, {
    method: 'POST', body: { boardId, symbols, sentence },
  })
export const listSentences = (profileId) => request(`/api/profiles/${profileId}/sentences`)
export const logTap = (profileId, boardId, label, previousLabel = null) =>
  request(`/api/profiles/${profileId}/taps`, {
    method: 'POST', body: { boardId, label, previousLabel },
  })
export const getPredictions = (profileId, lastLabel, count = 3) => {
  const params = new URLSearchParams()
  if (lastLabel) params.set('last_label', lastLabel)
  params.set('count', String(count))
  return request(`/api/profiles/${profileId}/predictions?${params}`)
}

// ── Journal ───────────────────────────────────────────────────────────────────

export const listJournalEntries = (profileId) => request(`/api/profiles/${profileId}/journal`)
export const createJournalEntry = (profileId, entry) =>
  request(`/api/profiles/${profileId}/journal`, { method: 'POST', body: entry })
export const deleteJournalEntry = (profileId, entryId) =>
  request(`/api/profiles/${profileId}/journal/${entryId}`, { method: 'DELETE' })

// ── Intelligence: insights, gaps, coach ──────────────────────────────────────

export const getInsights = (profileId) => request(`/api/profiles/${profileId}/insights`)
export const sendGapSignal = (profileId, boardId) =>
  request(`/api/profiles/${profileId}/gaps/signal`, { method: 'POST', body: { boardId } })
export const getGapAlerts = (profileId) => request(`/api/profiles/${profileId}/gaps/alerts`)
export const getCoachCard = (profileId) => request(`/api/profiles/${profileId}/coach`)
export const generateCoachCard = (profileId, force = false) =>
  request(`/api/profiles/${profileId}/coach/generate?force=${force}`, { method: 'POST' })

// ── AI Agent (LangGraph, server-side) ────────────────────────────────────────

export const agentChat = (profileId, messages) =>
  request(`/api/profiles/${profileId}/agent/chat`, { method: 'POST', body: { messages } })
export const applyAgentAction = (profileId, action) =>
  request(`/api/profiles/${profileId}/agent/apply-action`, { method: 'POST', body: { action } })
