import * as api from '../api'

export function logSentence(profileId, boardId, symbols, sentence) {
  return api.logSentence(profileId, boardId, symbols, sentence)
}

export function getProfileLog(profileId) {
  return api.listSentences(profileId)
}
