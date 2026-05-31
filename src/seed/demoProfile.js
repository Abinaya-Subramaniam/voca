import { createProfile } from '../store/profileStore'
import { getAllProfiles } from '../store/profileStore'
import { writeLogEntry, writeTapEntry } from '../services/db'

export async function seedDemoProfile() {
  const existing = getAllProfiles()
  if (existing.find(p => p.name === 'Layla')) return

  const profile = createProfile('Layla', '#e07b54')

  const boards = JSON.parse(
    localStorage.getItem(`boards_${profile.id}`) || '[]'
  )
  const homeBoard = boards.find(b => b.category === 'home')
  const feelingsBoard = boards.find(b => b.category === 'feelings')

  if (!homeBoard || !feelingsBoard) return

  const now = new Date()

  // Generate 3 weeks of realistic log entries
  const sentences = [
    { symbols: ['I', 'want', 'juice'],        board: homeBoard.id },
    { symbols: ['I', 'want', 'more'],          board: homeBoard.id },
    { symbols: ['go', 'home'],                 board: homeBoard.id },
    { symbols: ['I', 'like', 'play'],          board: homeBoard.id },
    { symbols: ['I', 'feel', 'happy'],         board: feelingsBoard.id },
    { symbols: ['I', 'feel', 'tired'],         board: feelingsBoard.id },
    { symbols: ['want', 'eat'],                board: homeBoard.id },
    { symbols: ['I', 'want', 'go', 'home'],    board: homeBoard.id },
    { symbols: ['no', 'more'],                 board: homeBoard.id },
    { symbols: ['help', 'me'],                 board: homeBoard.id },
    { symbols: ['I', 'feel', 'sad'],           board: feelingsBoard.id },
    { symbols: ['yes', 'please'],              board: homeBoard.id },
  ]

  const entries = []

  // Last 2 weeks — older history
  for (let day = 14; day >= 8; day--) {
    const date = new Date(now)
    date.setDate(date.getDate() - day)
    date.setHours(15 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60))

    const s = sentences[Math.floor(Math.random() * sentences.length)]
    entries.push({
      id: `demo_log_${day}_${Math.random().toString(36).slice(2)}`,
      profileId: profile.id,
      boardId: s.board,
      symbols: s.symbols,
      sentence: s.symbols.join(' '),
      timestamp: date.toISOString()
    })
  }

  // This week — more active
  for (let day = 7; day >= 0; day--) {
    const date = new Date(now)
    date.setDate(date.getDate() - day)

    const sessionsToday = day < 3 ? 4 : 2
    for (let sess = 0; sess < sessionsToday; sess++) {
      date.setHours(14 + sess, Math.floor(Math.random() * 50))
      const s = sentences[Math.floor(Math.random() * sentences.length)]
      entries.push({
        id: `demo_log_${day}_${sess}_${Math.random().toString(36).slice(2)}`,
        profileId: profile.id,
        boardId: s.board,
        symbols: s.symbols,
        sentence: s.symbols.join(' '),
        timestamp: new Date(date).toISOString()
      })
    }
  }

  // Write all log entries
  for (const entry of entries) {
    await writeLogEntry(entry)
  }

  // Add gap signals on the feelings board (simulate browsing without tapping)
  const gapSignals = []
  for (let i = 0; i < 4; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 2)
    d.setHours(16, 0)
    gapSignals.push({
      boardId: feelingsBoard.id,
      profileId: profile.id,
      timestamp: d.toISOString()
    })
  }

  const key = `gap_signals_${profile.id}`
  localStorage.setItem(key, JSON.stringify(gapSignals))

  return profile
}