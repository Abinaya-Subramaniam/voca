import * as api from '../api'

export function getBoardsForProfile(profileId) {
  return api.listBoards(profileId)
}

export function createBoard(profileId, name, category = 'custom') {
  return api.createBoard(profileId, name, category)
}

export function updateBoard(profileId, boardId, updates) {
  return api.updateBoard(profileId, boardId, updates)
}

export function deleteBoard(profileId, boardId) {
  return api.deleteBoard(profileId, boardId)
}

export function addSymbolToBoard(profileId, boardId, symbol) {
  return api.addSymbolToBoard(profileId, boardId, symbol)
}

export function removeSymbolFromBoard(profileId, boardId, symbolId) {
  return api.removeSymbolFromBoard(profileId, boardId, symbolId)
}

export function reorderSymbols(profileId, boardId, symbols) {
  return api.reorderBoardSymbols(profileId, boardId, symbols)
}
