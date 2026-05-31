const DB_NAME = 'voca_db'
const DB_VERSION = 1
const LOG_STORE = 'communication_log'
const TAP_STORE = 'tap_log'

let db = null

function openDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db)
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => { db = request.result; resolve(db) }
    request.onupgradeneeded = (e) => {
      const database = e.target.result
      if (!database.objectStoreNames.contains(LOG_STORE)) {
        const logStore = database.createObjectStore(LOG_STORE, { keyPath: 'id' })
        logStore.createIndex('profileId', 'profileId', { unique: false })
        logStore.createIndex('timestamp', 'timestamp', { unique: false })
      }
      if (!database.objectStoreNames.contains(TAP_STORE)) {
        const tapStore = database.createObjectStore(TAP_STORE, { keyPath: 'id' })
        tapStore.createIndex('profileId', 'profileId', { unique: false })
      }
    }
  })
}

export async function writeLogEntry(entry) {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(LOG_STORE, 'readwrite')
    tx.objectStore(LOG_STORE).add(entry)
    tx.oncomplete = () => resolve(true)
    tx.onerror = () => reject(tx.error)
  })
}

export async function getLogEntriesByProfile(profileId) {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(LOG_STORE, 'readonly')
    const index = tx.objectStore(LOG_STORE).index('profileId')
    const request = index.getAll(profileId)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function writeTapEntry(entry) {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(TAP_STORE, 'readwrite')
    tx.objectStore(TAP_STORE).add(entry)
    tx.oncomplete = () => resolve(true)
    tx.onerror = () => reject(tx.error)
  })
}

export async function getTapsByProfile(profileId) {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(TAP_STORE, 'readonly')
    const index = tx.objectStore(TAP_STORE).index('profileId')
    const request = index.getAll(profileId)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}