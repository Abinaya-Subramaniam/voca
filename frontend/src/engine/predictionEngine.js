// Next-word prediction — served by the backend bigram engine.
// recordTap also writes the tap log used by the adaptive layout optimiser.

import * as api from '../api'

export function recordTap(profileId, previousLabel, currentLabel, boardId = null) {
  if (!profileId || !currentLabel) return
  api.logTap(profileId, boardId, currentLabel, previousLabel).catch(() => {})
}

export async function getPredictions(profileId, lastLabel, count = 3) {
  const { predictions } = await api.getPredictions(profileId, lastLabel, count)
  return predictions
}
