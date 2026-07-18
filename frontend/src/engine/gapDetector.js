// Gap detection — the 8-second browse timer stays in the browser (it reflects
// live user behaviour); signals and alert evaluation live on the backend.

import * as api from '../api'

const BROWSE_TIMEOUT_MS = 8000

let browseTimer = null
let didTapOnBoard = false

export function startBrowseTimer(profileId, boardId) {
  clearBrowseTimer()
  didTapOnBoard = false
  browseTimer = setTimeout(() => {
    if (!didTapOnBoard) {
      api.sendGapSignal(profileId, boardId).catch(() => {})
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

export function getGapAlerts(profileId) {
  return api.getGapAlerts(profileId)
}
