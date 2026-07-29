import * as api from '../api'

export function createProfile(name, avatarColor, username, pin) {
  return api.createProfile(name, avatarColor || '#2D9B83', username, pin)
}

export function updateProfileSettings(profileId, settings) {
  return api.updateProfile(profileId, { settings })
}

export function updateWhoIAm(profileId, whoIAm) {
  return api.updateWhoIAm(profileId, whoIAm)
}

export function deleteProfile(profileId) {
  return api.deleteProfile(profileId)
}
