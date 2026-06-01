import { DEFAULT_BOARDS } from '../data/defaultBoards'

const SEARCH_API  = 'https://api.arasaac.org/v1/pictograms/en/search'
const CACHE_PREFIX = 'arasaac_id_'

// Verified correct ARASAAC IDs fetched from the API, preferring aac:true entries
const VERIFIED_IDS = {
  // Core / home board
  'i':         '6632',
  'you':       '6625',
  'want':      '5441',
  'like':      '37826',
  'go':        '8142',
  'come':      '32669',
  'eat':       '6456',
  'drink':     '6061',
  'play':      '23392',
  'sleep':     '6479',
  'home':      '6964',
  'more':      '5508',
  'help':      '32648',
  'stop':      '7196',
  'yes':       '5584',
  'no':        '5526',
  // Feelings
  'happy':     '35533',
  'sad':       '35545',
  'angry':     '35539',
  'scared':    '35535',
  'tired':     '35537',
  'hungry':    '4962',
  'hurt':      '30620',
  'hurts':     '30620',
  'good':      '4581',
  // Food & drink
  'water':     '32464',
  'milk':      '2445',
  'juice':     '11461',
  'bread':     '2494',
  'apple':     '2462',
  'banana':    '2530',
  'rice':      '6911',
  'cookie':    '8312',
  // School
  'school':    '32446',
  'teacher':   '6556',
  'friend':    '25790',
  'book':      '25191',
  'write':     '2380',
  'read':      '7141',
  'draw':      '8088',
  'learn':     '37810',
  // Emergency
  'toilet':    '5921',
  // People
  'mom':       '2458',
  'dad':       '31146',
  'brother':   '2423',
  'sister':    '2422',
  'grandma':   '23710',
  'grandpa':   '23718',
  'baby':      '6060',
  'me':        '6632',
  // Activities
  'run':       '6465',
  'jump':      '39052',
  'swim':      '6568',
  'walk':      '29951',
  'sing':      '6960',
  'dance':     '35747',
  'watch':     '29123',
  'hug':       '4550',
  // Social
  'please':    '8195',
  'thank you': '8129',
  'hello':     '6522',
  'goodbye':   '6028',
  'sorry':     '11625',
  'wait':      '36914',
  'again':     '37163',
  'finished':  '28429',
}

const SYMBOL_MIGRATION_KEY = 'symid_v2_'
const BOARD_MIGRATION_KEY  = 'boards_v3_'

// Fixes wrong symbol IDs in any existing profile's boards and clears stale cache.
export function migrateSymbolIds(profileId) {
  if (!profileId) return
  if (localStorage.getItem(`${SYMBOL_MIGRATION_KEY}${profileId}`)) return

  const storageKey = `boards_${profileId}`
  const boards = JSON.parse(localStorage.getItem(storageKey) || '[]')
  const updated = boards.map(board => ({
    ...board,
    symbols: board.symbols.map(s => {
      if (s.isCustom) return s
      const verifiedId = VERIFIED_IDS[s.label.toLowerCase()]
      return verifiedId ? { ...s, symbolId: verifiedId } : s
    })
  }))
  localStorage.setItem(storageKey, JSON.stringify(updated))
  localStorage.setItem(`${SYMBOL_MIGRATION_KEY}${profileId}`, '1')

  // Clear stale resolved-ID cache
  Object.keys(localStorage)
    .filter(k => k.startsWith(CACHE_PREFIX))
    .forEach(k => localStorage.removeItem(k))
}

// Adds any boards from DEFAULT_BOARDS that are missing from an existing profile.
export function migrateMissingBoards(profileId) {
  if (!profileId) return
  if (localStorage.getItem(`${BOARD_MIGRATION_KEY}${profileId}`)) return

  const storageKey = `boards_${profileId}`
  const boards = JSON.parse(localStorage.getItem(storageKey) || '[]')
  const existingCategories = new Set(boards.map(b => b.category))

  const toAdd = DEFAULT_BOARDS
    .filter(b => !existingCategories.has(b.category))
    .map(b => ({
      ...b,
      id: `${b.id}_${profileId}`,
      profileId,
      symbols: b.symbols.map(s => ({ ...s })),
    }))

  if (toAdd.length > 0) {
    localStorage.setItem(storageKey, JSON.stringify([...boards, ...toAdd]))
  }
  localStorage.setItem(`${BOARD_MIGRATION_KEY}${profileId}`, '1')
}

export function getSymbolImageUrl(symbolId) {
  if (!symbolId || symbolId.startsWith('custom_')) return null
  return `https://static.arasaac.org/pictograms/${symbolId}/${symbolId}_300.png`
}

export async function resolveSymbolId(label) {
  const key = label.toLowerCase()
  if (VERIFIED_IDS[key]) return VERIFIED_IDS[key]

  const cacheKey = `${CACHE_PREFIX}${key}`
  const cached = localStorage.getItem(cacheKey)
  if (cached) return cached

  try {
    const res = await fetch(`${SEARCH_API}/${encodeURIComponent(label)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (!data || data.length === 0) return null
    // Prefer pictograms tagged for AAC use
    const best = data.find(d => d.aac) || data[0]
    const id = String(best._id)
    localStorage.setItem(cacheKey, id)
    return id
  } catch {
    return null
  }
}
