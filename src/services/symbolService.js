const ARASAAC_API = 'https://api.arasaac.org/v1/pictograms'
const SEARCH_API  = 'https://api.arasaac.org/v1/pictograms/en/search'
const CACHE_PREFIX = 'arasaac_id_'

export function getSymbolImageUrl(symbolId) {
  if (!symbolId || symbolId.startsWith('custom_')) return null
  return `https://static.arasaac.org/pictograms/${symbolId}/${symbolId}_300.png`
}

export async function resolveSymbolId(label) {
  const cacheKey = `${CACHE_PREFIX}${label.toLowerCase()}`
  const cached = localStorage.getItem(cacheKey)
  if (cached) return cached

  try {
    const res = await fetch(`${SEARCH_API}/${encodeURIComponent(label)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (!data || data.length === 0) return null
    const id = String(data[0]._id)
    localStorage.setItem(cacheKey, id)
    return id
  } catch {
    return null
  }
}