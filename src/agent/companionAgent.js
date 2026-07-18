// The Voca Companion agent loop.
// Gemini plans which tools to call, observes each result, and iterates until
// it can answer — a full reason → act → observe cycle, not a single prompt.

import { TOOL_DECLARATIONS, STEP_LABELS, executeTool } from './agentTools'

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const MAX_STEPS = 8

function buildSystemInstruction(name) {
  return `You are the Voca Companion — an AI agent that supports the caregiver of ${name}, a non-verbal individual who communicates by tapping pictogram symbols on the Voca AAC board.

You do not have any data in advance. You have tools that read ${name}'s real communication records and one tool that can stage changes to their symbol boards.

Rules:
- Ground every answer in real data: call the relevant tools before answering questions about communication, vocabulary, moods, or progress. Never guess or invent numbers, words, or moods.
- Combine tools when the question needs it (e.g. gaps + board contents + coach recommendation to plan the week).
- When the caregiver asks to add vocabulary, or agrees with a suggestion to add words: first call get_board_contents for that board to avoid duplicates, then call propose_symbols_for_board. It only stages the change — the caregiver approves it with a button under your message. Never claim words were added; say they are ready for approval.
- Journal sentences are private to ${name}. You can only see journal moods.
- Be warm, specific and practical. Keep replies to 2-4 sentences unless the question genuinely needs more. Plain conversational text — no markdown headings or bullet lists.`
}

async function callGemini(contents, systemText, apiKey) {
  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemText }] },
      contents,
      tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  })

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}))
    throw new Error(errBody?.error?.message || `HTTP ${response.status}`)
  }
  return response.json()
}

/**
 * Runs the agent until it produces a final text answer.
 *
 * @param {Object}   opts
 * @param {Array}    opts.messages  chat history [{ role: 'user'|'companion', text }]
 * @param {string}   opts.profileId
 * @param {Object}   opts.profile   active profile object
 * @param {Array}    opts.boards    boards for the active profile
 * @param {string}   opts.apiKey    Gemini API key
 * @param {Function} [opts.onStep]  called with { name, label, args } as each tool runs
 * @returns {Promise<{ text: string, steps: Array, pendingAction: Object|null }>}
 */
export async function runCompanionAgent({ messages, profileId, profile, boards, apiKey, onStep }) {
  const systemText = buildSystemInstruction(profile?.name || 'the individual')
  const ctx = { profileId, profile, boards, pendingAction: null }
  const steps = []

  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }))

  for (let turn = 0; turn < MAX_STEPS; turn++) {
    const data = await callGemini(contents, systemText, apiKey)
    const parts = data.candidates?.[0]?.content?.parts || []
    const functionCalls = parts.filter(p => p.functionCall)

    // No tool calls left — the agent is done and has answered
    if (functionCalls.length === 0) {
      const text = parts.map(p => p.text || '').join('').trim()
      if (!text) throw new Error('Empty response from Gemini')
      return { text, steps, pendingAction: ctx.pendingAction }
    }

    // Record the model's tool request, execute each call, feed results back
    contents.push({ role: 'model', parts })
    const responseParts = []
    for (const part of functionCalls) {
      const { name, args } = part.functionCall
      const step = { name, label: STEP_LABELS[name] || name, args: args || {} }
      steps.push(step)
      onStep?.(step)

      let result
      try {
        result = await executeTool(name, args || {}, ctx)
      } catch (err) {
        result = { error: err.message }
      }
      responseParts.push({ functionResponse: { name, response: { result } } })
    }
    contents.push({ role: 'user', parts: responseParts })
  }

  throw new Error('The companion took too many steps. Please try asking again.')
}
