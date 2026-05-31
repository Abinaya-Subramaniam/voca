import globalPredictions from '../data/globalPredictions.json'
import { storage } from '../services/storage'

const PREDICTIONS_PREFIX = 'predictions_'

export function getPredictionTable(profileId) {
  return storage.get(`${PREDICTIONS_PREFIX}${profileId}`) || {}
}

function savePredictionTable(profileId, table) {
  storage.set(`${PREDICTIONS_PREFIX}${profileId}`, table)
}

export function recordTap(profileId, previousLabel, currentLabel) {
  if (!previousLabel || !currentLabel) return
  const table = getPredictionTable(profileId)
  if (!table[previousLabel]) table[previousLabel] = {}
  table[previousLabel][currentLabel] = (table[previousLabel][currentLabel] || 0) + 1
  savePredictionTable(profileId, table)
}

export function getPredictions(profileId, lastLabel, count = 3) {
  if (!lastLabel) return getTopGlobalStarters(count)

  const personal = getPredictionTable(profileId)
  const personalNext = personal[lastLabel] || {}
  const globalNext = globalPredictions[lastLabel] || {}

  // Merge personal (weighted 3x) with global fallback
  const merged = {}
  Object.entries(globalNext).forEach(([label, score]) => {
    merged[label] = (merged[label] || 0) + score
  })
  Object.entries(personalNext).forEach(([label, score]) => {
    merged[label] = (merged[label] || 0) + score * 3
  })

  return Object.entries(merged)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([label]) => label)
}

function getTopGlobalStarters(count) {
  const starters = { 'I': 50, 'want': 30, 'go': 20, 'help': 15, 'more': 12, 'yes': 10, 'no': 10 }
  return Object.entries(starters)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([label]) => label)
}