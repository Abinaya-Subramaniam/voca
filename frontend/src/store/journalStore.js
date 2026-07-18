import * as api from '../api'

export async function getJournalEntries(profileId) {
  const entries = await api.listJournalEntries(profileId)
  // Older components read `entry.date`
  return entries.map(e => ({ ...e, date: e.createdAt }))
}

export function saveJournalEntry(profileId, entry) {
  return api.createJournalEntry(profileId, {
    moodSymbol: entry.moodSymbol || null,
    sentences: entry.sentences || [],
  })
}

export function deleteJournalEntry(profileId, entryId) {
  return api.deleteJournalEntry(profileId, entryId)
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
