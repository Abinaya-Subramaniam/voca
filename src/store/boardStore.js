import { storage } from '../services/storage'

function generateId() {
  return 'board_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
}

export function getBoardsForProfile(profileId) {
  return storage.get(`boards_${profileId}`) || []
}

export function getBoard(profileId, boardId) {
  const boards = getBoardsForProfile(profileId)
  return boards.find(b => b.id === boardId) || null
}

export function updateBoard(profileId, boardId, updates) {
  const boards = getBoardsForProfile(profileId)
  const idx = boards.findIndex(b => b.id === boardId)
  if (idx === -1) return false
  boards[idx] = { ...boards[idx], ...updates }
  storage.set(`boards_${profileId}`, boards)
  return true
}

export function addSymbolToBoard(profileId, boardId, symbol) {
  const boards = getBoardsForProfile(profileId)
  const idx = boards.findIndex(b => b.id === boardId)
  if (idx === -1) return false
  const maxPos = boards[idx].symbols.reduce((m, s) => Math.max(m, s.position), -1)
  boards[idx].symbols.push({ ...symbol, position: maxPos + 1 })
  storage.set(`boards_${profileId}`, boards)
  return true
}

export function removeSymbolFromBoard(profileId, boardId, symbolId) {
  const boards = getBoardsForProfile(profileId)
  const idx = boards.findIndex(b => b.id === boardId)
  if (idx === -1) return false
  boards[idx].symbols = boards[idx].symbols.filter(s => s.symbolId !== symbolId)
  storage.set(`boards_${profileId}`, boards)
  return true
}

export function createBoard(profileId, name, category = 'custom') {
  const boards = getBoardsForProfile(profileId)
  const newBoard = {
    id: generateId(),
    profileId,
    name,
    category,
    gridColumns: 4,
    symbols: []
  }
  boards.push(newBoard)
  storage.set(`boards_${profileId}`, boards)
  return newBoard
}

export function deleteBoard(profileId, boardId) {
  let boards = getBoardsForProfile(profileId)
  boards = boards.filter(b => b.id !== boardId)
  storage.set(`boards_${profileId}`, boards)
}

export function reorderSymbols(profileId, boardId, reorderedSymbols) {
  const boards = getBoardsForProfile(profileId)
  const idx = boards.findIndex(b => b.id === boardId)
  if (idx === -1) return false
  boards[idx].symbols = reorderedSymbols.map((s, i) => ({ ...s, position: i }))
  storage.set(`boards_${profileId}`, boards)
  return true
}