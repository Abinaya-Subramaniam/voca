import { storage } from '../services/storage'
import categoryVocab from '../data/categoryVocab.json'

const GAP_SIGNALS_KEY = 'gap_signals_'
const GAP_ALERTS_KEY = 'gap_alerts_'
const SIGNAL_THRESHOLD = 3
const WINDOW_DAYS = 7
const BROWSE_TIMEOUT_MS = 8000

let browseTimer = null
let currentBoardId = null
let currentProfileId = null
let didTapOnBoard = false

export function startBrowseTimer(profileId, boardId) {
  clearBrowseTimer()
  currentBoardId = boardId
  currentProfileId = profileId
  didTapOnBoard = false

  browseTimer = setTimeout(() => {
    // Timer fired without a tap — record gap signal
    if (!didTapOnBoard) {
      recordGapSignal(profileId, boardId)
    }
  }, BROWSE_TIMEOUT_MS)
}

export function clearBrowseTimer() {
  if (browseTimer) {
    clearTimeout(browseTimer)
    browseTimer = null
  }
}

export function markTappedOnBoard() {
  didTapOnBoard = true
  clearBrowseTimer()
}

function recordGapSignal(profileId, boardId) {
  const key = `${GAP_SIGNALS_KEY}${profileId}`
  const signals = storage.get(key) || []
  signals.push({
    boardId,
    profileId,
    timestamp: new Date().toISOString()
  })
  storage.set(key, signals)
  evaluateGaps(profileId)
}

function evaluateGaps(profileId) {
  const key = `${GAP_SIGNALS_KEY}${profileId}`
  const signals = storage.get(key) || []

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - WINDOW_DAYS)
  const recent = signals.filter(s => new Date(s.timestamp) > cutoff)

  // Count signals per board
  const counts = {}
  recent.forEach(s => {
    counts[s.boardId] = (counts[s.boardId] || 0) + 1
  })

  // Generate alerts for boards over threshold
  const alertsKey = `${GAP_ALERTS_KEY}${profileId}`
  const existingAlerts = storage.get(alertsKey) || []

  Object.entries(counts).forEach(([boardId, count]) => {
    if (count >= SIGNAL_THRESHOLD) {
      const alreadyAlerted = existingAlerts.find(
        a => a.boardId === boardId && a.weekOf === getCurrentWeek()
      )
      if (!alreadyAlerted) {
        existingAlerts.push({
          boardId,
          profileId,
          signalCount: count,
          weekOf: getCurrentWeek(),
          createdAt: new Date().toISOString()
        })
      }
    }
  })

  storage.set(alertsKey, existingAlerts)
}

export function getGapAlerts(profileId, boards) {
  const alertsKey = `${GAP_ALERTS_KEY}${profileId}`
  const alerts = storage.get(alertsKey) || []
  const thisWeek = getCurrentWeek()

  return alerts
    .filter(a => a.weekOf === thisWeek)
    .map(alert => {
      const board = boards.find(b => b.id === alert.boardId)
      if (!board) return null
      const existingLabels = board.symbols.map(s => s.label.toLowerCase())
      const category = board.category || 'custom'
      const expansionList = categoryVocab[category] || categoryVocab.custom
      const suggestions = expansionList
        .filter(word => !existingLabels.includes(word.toLowerCase()))
        .slice(0, 5)
      return {
        ...alert,
        boardName: board.name,
        existingSymbolCount: board.symbols.length,
        suggestedAdditions: suggestions
      }
    })
    .filter(Boolean)
}

function getCurrentWeek() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${week}`
}