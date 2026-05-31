import { storage } from '../services/storage'

const JOURNAL_PREFIX = 'journal_entries_'

function generateId() {
  return 'entry_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
}

export function getJournalEntries(profileId) {
  return storage.get(`${JOURNAL_PREFIX}${profileId}`) || []
}

export function saveJournalEntry(profileId, entry) {
  const entries = getJournalEntries(profileId)
  const newEntry = {
    id: generateId(),
    profileId,
    date: new Date().toISOString(),
    moodSymbol: entry.moodSymbol || null,
    sentences: entry.sentences || [],
    createdAt: new Date().toISOString(),
  }
  entries.unshift(newEntry)
  storage.set(`${JOURNAL_PREFIX}${profileId}`, entries)
  return newEntry
}

export function deleteJournalEntry(profileId, entryId) {
  let entries = getJournalEntries(profileId)
  entries = entries.filter(e => e.id !== entryId)
  storage.set(`${JOURNAL_PREFIX}${profileId}`, entries)
}

export function formatEntryDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatEntryTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}