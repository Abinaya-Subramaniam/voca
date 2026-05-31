import { storage } from '../services/storage'
import { DEFAULT_BOARDS } from '../data/defaultBoards'

const PROFILES_KEY = 'voca_profiles'
const ACTIVE_KEY = 'voca_active_profile'

function generateId() {
  return 'profile_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
}

export function getAllProfiles() {
  return storage.get(PROFILES_KEY) || []
}

export function getActiveProfileId() {
  return storage.get(ACTIVE_KEY)
}

export function setActiveProfile(profileId) {
  storage.set(ACTIVE_KEY, profileId)
}

export function getProfile(profileId) {
  const profiles = getAllProfiles()
  return profiles.find(p => p.id === profileId) || null
}

export function createProfile(name, avatarColor) {
  const id = generateId()
  const profile = {
    id,
    name,
    avatarColor: avatarColor || '#2D9B83',
    createdAt: new Date().toISOString(),
    settings: {
      symbolSize: 'medium',
      fontSize: 12,
      highContrast: false,
      wideSpacing: false,
      gridColumns: 4,
      adaptiveLayoutEnabled: true,
    },
    whoIAm: {
      age: '',
      communicationNote: '',
      loveSymbols: [],
      helpTips: ['Give me time to find my words.', 'Watch my screen, not just my face.', 'Yes or no questions work well.'],
      emergencyName: '',
      emergencyPhone: '',
    }
  }
  const profiles = getAllProfiles()
  profiles.push(profile)
  storage.set(PROFILES_KEY, profiles)
  initBoardsForProfile(id)
  return profile
}

export function updateProfileSettings(profileId, settings) {
  const profiles = getAllProfiles()
  const idx = profiles.findIndex(p => p.id === profileId)
  if (idx === -1) return false
  profiles[idx].settings = { ...profiles[idx].settings, ...settings }
  storage.set(PROFILES_KEY, profiles)
  return true
}

export function deleteProfile(profileId) {
  let profiles = getAllProfiles()
  profiles = profiles.filter(p => p.id !== profileId)
  storage.set(PROFILES_KEY, profiles)
  storage.remove(`boards_${profileId}`)
  storage.remove(`predictions_${profileId}`)
}

function initBoardsForProfile(profileId) {
  const boards = DEFAULT_BOARDS.map(b => ({
    ...b,
    id: `${b.id}_${profileId}`,
    profileId,
    symbols: b.symbols.map(s => ({ ...s }))
  }))
  storage.set(`boards_${profileId}`, boards)
}

export function updateWhoIAm(profileId, whoIAm) {
  const profiles = getAllProfiles()
  const idx = profiles.findIndex(p => p.id === profileId)
  if (idx === -1) return false
  profiles[idx].whoIAm = { ...profiles[idx].whoIAm, ...whoIAm }
  storage.set(PROFILES_KEY, profiles)
  return true
}