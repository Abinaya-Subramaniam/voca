import { getTapsByProfile } from '../services/db'
import { getBoardsForProfile } from '../store/boardStore'
import { storage } from '../services/storage'

const MIN_TAPS = 20
const DAYS_WINDOW = 30
const SESSION_KEY = 'layout_optimised_session_'

export async function runLayoutOptimiser(profileId) {
  // Only run once per session
  const sessionKey = `${SESSION_KEY}${profileId}`
  const today = new Date().toDateString()
  if (storage.get(sessionKey) === today) return

  const profile = JSON.parse(localStorage.getItem('voca_profiles') || '[]')
    .find(p => p.id === profileId)
  if (!profile?.settings?.adaptiveLayoutEnabled) return

  const allTaps = await getTapsByProfile(profileId)
  if (allTaps.length < MIN_TAPS) return

  // Filter to last 30 days
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - DAYS_WINDOW)
  const recentTaps = allTaps.filter(t => new Date(t.timestamp) > cutoff)
  if (recentTaps.length < MIN_TAPS) return

  // Count frequency per board per symbol
  const freqMap = {}
  recentTaps.forEach(tap => {
    if (!freqMap[tap.boardId]) freqMap[tap.boardId] = {}
    freqMap[tap.boardId][tap.label] =
      (freqMap[tap.boardId][tap.label] || 0) + 1
  })

  // Apply optimised layout to each board
  const boards = getBoardsForProfile(profileId)
  const updatedBoards = boards.map(board => {
    const boardFreq = freqMap[board.id]
    if (!boardFreq) return board

    const symbols = [...board.symbols]
    // Sort by frequency descending
    symbols.sort((a, b) => {
      const fa = boardFreq[a.label] || 0
      const fb = boardFreq[b.label] || 0
      return fb - fa
    })
    // Reassign positions
    const reordered = symbols.map((s, i) => ({ ...s, position: i }))
    return { ...board, symbols: reordered }
  })

  storage.set(`boards_${profileId}`, updatedBoards)
  storage.set(sessionKey, today)
}