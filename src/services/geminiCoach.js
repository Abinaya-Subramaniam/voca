const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

function buildPrompt(summary) {
  return `You are an AAC speech-language pathologist. Analyse this weekly communication summary and return coaching advice.

SUMMARY:
- Sentences this week: ${summary.totalThisWeek}
- Top topics: ${summary.topTopics.join(', ') || 'none'}
- Vocabulary gaps: ${summary.gapAlerts.length > 0 ? summary.gapAlerts.map(a => a.boardName).join(', ') : 'none'}
- Unique words: ${summary.uniqueVocabCount}
- New words this week: ${summary.newVocab.slice(0, 8).join(', ') || 'none'}
- Longest sentence: ${summary.longestSentence} symbols

Reply with ONLY this JSON, no extra text, no markdown, no code fences:
{"summary":"1-2 short sentences about their communication this week.","strength":"One specific strength (1 sentence).","priority":"The single most important next step (1 sentence).","suggestions":["word1","word2","word3","word4","word5"],"reasoning":"Why these 5 words (1 sentence)."}`
}

export async function fetchCoachCard(summary, apiKey) {
  const prompt = buildPrompt(summary)

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      }
    })
  })

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}))
    const message = errBody?.error?.message || `HTTP ${response.status}`
    throw new Error(message)
  }

  const data = await response.json()
  const parts = data.candidates?.[0]?.content?.parts || []
  const text = parts.map(p => p.text || '').join('')
  if (!text) throw new Error('Empty response from Gemini')

  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error(`Unexpected response: ${text.slice(0, 200)}`)
  return JSON.parse(match[0])
}

export function getStoredCoachCard(profileId) {
  const key = `coachCard_${profileId}_${getCurrentWeek()}`
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : null
}

export function storeCoachCard(profileId, card) {
  const key = `coachCard_${profileId}_${getCurrentWeek()}`
  localStorage.setItem(key, JSON.stringify({ ...card, generatedAt: new Date().toISOString() }))
}

function getCurrentWeek() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${week}`
}
