import { writeLogEntry, getLogEntriesByProfile } from '../services/db'

function generateId() {
  return 'log_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
}

export async function logSentence(profileId, boardId, symbols, sentence) {
  const entry = {
    id: generateId(),
    profileId,
    boardId,
    symbols,
    sentence,
    timestamp: new Date().toISOString()
  }
  await writeLogEntry(entry)
  return entry
}

export async function getProfileLog(profileId) {
  return getLogEntriesByProfile(profileId)
}