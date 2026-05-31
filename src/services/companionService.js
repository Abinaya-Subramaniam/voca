const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

function buildSystemContext(profileData) {
  return `You are a warm, knowledgeable AAC (Augmentative and Alternative Communication) companion for caregivers of non-verbal individuals.

You have the following real data about the individual this week:

NAME: ${profileData.name}
- Sentences this week: ${profileData.totalThisWeek} (last week: ${profileData.totalLastWeek})
- Longest sentence: ${profileData.longestSentence} symbols
- Peak communication time: ${profileData.peakTime}
- New words used this week: ${profileData.newVocab.slice(0, 15).join(', ') || 'none'}
- Total recent unique vocabulary: ${profileData.uniqueVocabCount} words
- Most active boards: ${profileData.topTopics.join(', ') || 'none recorded'}
- Vocabulary gap alerts: ${profileData.gapAlerts.length > 0 ? profileData.gapAlerts.map(a => a.boardName).join(', ') : 'none'}
- Last journal mood: ${profileData.lastMood || 'not recorded'}
- AI coach priority this week: ${profileData.coachPriority || 'not yet generated'}

Answer the caregiver's questions using this real data. Be warm, specific, and practical. Keep responses to 2-4 sentences unless the question genuinely requires more detail. Never make up data — only reference what is provided above.`
}

export async function sendCompanionMessage(messages, profileData, apiKey) {
  const systemContext = buildSystemContext(profileData)

  const contents = [
    {
      role: 'user',
      parts: [{ text: systemContext + "\n\nI'm the caregiver. Please confirm you have the data and are ready." }],
    },
    {
      role: 'model',
      parts: [{ text: `I have ${profileData.name}'s communication data for this week. I'm ready to help — what would you like to know?` }],
    },
    ...messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
  ]

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 600,
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  })

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}))
    throw new Error(errBody?.error?.message || `HTTP ${response.status}`)
  }

  const data = await response.json()
  const parts = data.candidates?.[0]?.content?.parts || []
  const text = parts.map(p => p.text || '').join('')
  if (!text) throw new Error('Empty response from Gemini')
  return text
}
