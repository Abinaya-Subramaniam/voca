// Tool layer for the Voca Companion agent.
// Each tool wraps a real data source or action in the app. The agent decides
// which tools to call and in what order — nothing here is pre-bundled.

import { getProfileLog } from '../store/logStore'
import { computeInsights } from '../engine/insightsEngine'
import { getGapAlerts } from '../engine/gapDetector'
import { getJournalEntries } from '../store/journalStore'
import { getStoredCoachCard } from '../services/geminiCoach'
import { addSymbolToBoard } from '../store/boardStore'
import { resolveSymbolId, getSymbolImageUrl } from '../services/symbolService'

const WORD_TYPE_ENUM = ['pronoun', 'verb', 'noun', 'descriptor', 'social', 'question', 'none']

// Gemini functionDeclarations — the agent's capability surface
export const TOOL_DECLARATIONS = [
  {
    name: 'get_weekly_insights',
    description:
      "Get this week's communication metrics: sentence counts (this week vs last week), longest sentence, peak communication time, new vocabulary used this week, and most active boards.",
  },
  {
    name: 'get_communication_log',
    description:
      'Read the actual sentences the individual has built recently, newest first. Use this to see what they are really saying, not just counts.',
    parameters: {
      type: 'OBJECT',
      properties: {
        days: { type: 'INTEGER', description: 'How many days back to look. Default 7.' },
        limit: { type: 'INTEGER', description: 'Maximum sentences to return. Default 15.' },
      },
    },
  },
  {
    name: 'get_vocabulary_gaps',
    description:
      'Get active vocabulary gap alerts — boards the individual browsed repeatedly without tapping, suggesting they looked for a word that is missing. Includes suggested expansion words per board.',
  },
  {
    name: 'get_board_contents',
    description:
      'List the symbol boards. Without boardName, returns every board with its symbol count. With boardName, returns all symbols currently on that board — call this before proposing additions so you never suggest duplicates.',
    parameters: {
      type: 'OBJECT',
      properties: {
        boardName: { type: 'STRING', description: "Exact board name, e.g. 'Feelings'. Omit to list all boards." },
      },
    },
  },
  {
    name: 'get_journal_moods',
    description:
      "Get the individual's recent journal moods (date + mood only). Journal sentences are private and never shared with caregivers.",
    parameters: {
      type: 'OBJECT',
      properties: {
        limit: { type: 'INTEGER', description: 'Maximum entries to return. Default 5.' },
      },
    },
  },
  {
    name: 'get_coach_recommendation',
    description:
      "Get this week's AI vocabulary coach card: summary, strength, priority, suggested words and reasoning. May not exist yet.",
  },
  {
    name: 'search_symbol',
    description:
      'Check whether an ARASAAC pictogram exists for a word. Use before proposing a word so every addition has a real symbol image.',
    parameters: {
      type: 'OBJECT',
      properties: {
        word: { type: 'STRING', description: 'The word to look up.' },
      },
      required: ['word'],
    },
  },
  {
    name: 'propose_symbols_for_board',
    description:
      "Stage new vocabulary symbols to be added to a board. This does NOT change the board directly — it prepares the change and shows the caregiver an approval card. Use when the caregiver asks to add words, or after they agree with your suggestion. Check the board's current contents first to avoid duplicates.",
    parameters: {
      type: 'OBJECT',
      properties: {
        boardName: { type: 'STRING', description: "Name of an existing board, e.g. 'Feelings'." },
        words: {
          type: 'ARRAY',
          description: 'The words to add, each with its grammatical word type.',
          items: {
            type: 'OBJECT',
            properties: {
              word: { type: 'STRING' },
              wordType: {
                type: 'STRING',
                enum: WORD_TYPE_ENUM,
                description: 'Grammatical category — controls the symbol colour on the board.',
              },
            },
            required: ['word'],
          },
        },
        reason: { type: 'STRING', description: 'One sentence for the caregiver: why these words help right now.' },
      },
      required: ['boardName', 'words'],
    },
  },
]

// Short human-readable labels shown in the UI while the agent works
export const STEP_LABELS = {
  get_weekly_insights: "Analysing this week's communication",
  get_communication_log: 'Reading recent sentences',
  get_vocabulary_gaps: 'Checking vocabulary gap alerts',
  get_board_contents: 'Inspecting board contents',
  get_journal_moods: 'Checking recent moods',
  get_coach_recommendation: 'Reviewing coach recommendation',
  search_symbol: 'Searching ARASAAC pictograms',
  propose_symbols_for_board: 'Preparing board update',
}

function formatWhen(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
  })
}

// Executes one tool call. `ctx` = { profileId, profile, boards, pendingAction }
// — propose_symbols_for_board stages its action on ctx for the UI to confirm.
export async function executeTool(name, args, ctx) {
  const { profileId, boards } = ctx

  switch (name) {
    case 'get_weekly_insights': {
      const log = await getProfileLog(profileId)
      const insights = computeInsights(log)
      const activeBoards = Object.entries(insights.topicCounts || {})
        .sort((a, b) => b[1] - a[1])
        .map(([boardId, count]) => ({
          board: boards.find(b => b.id === boardId)?.name || 'Unknown',
          sentences: count,
        }))
      return {
        sentencesThisWeek: insights.totalThisWeek,
        sentencesLastWeek: insights.totalLastWeek,
        longestSentenceSymbols: insights.longestSentence,
        peakTime: insights.peakTime,
        newVocabThisWeek: insights.newVocab,
        mostActiveBoards: activeBoards,
      }
    }

    case 'get_communication_log': {
      const days = args.days || 7
      const limit = args.limit || 15
      const log = await getProfileLog(profileId)
      const cutoff = Date.now() - days * 86400000
      const recent = log
        .filter(e => new Date(e.timestamp).getTime() > cutoff)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit)
        .map(e => ({ sentence: e.sentence, when: formatWhen(e.timestamp) }))
      return { count: recent.length, sentences: recent }
    }

    case 'get_vocabulary_gaps': {
      const alerts = getGapAlerts(profileId, boards)
      if (alerts.length === 0) return { gaps: [], note: 'No active gap alerts this week.' }
      return {
        gaps: alerts.map(a => ({
          board: a.boardName,
          browseWithoutTapSignals: a.signalCount,
          currentSymbolCount: a.existingSymbolCount,
          suggestedAdditions: a.suggestedAdditions,
        })),
      }
    }

    case 'get_board_contents': {
      if (args.boardName) {
        const board = boards.find(b => b.name.toLowerCase() === args.boardName.toLowerCase())
        if (!board) {
          return { error: `No board named "${args.boardName}". Available: ${boards.map(b => b.name).join(', ')}` }
        }
        return {
          name: board.name,
          category: board.category,
          symbols: board.symbols.map(s => s.label),
        }
      }
      return {
        boards: boards.map(b => ({ name: b.name, category: b.category, symbolCount: b.symbols.length })),
      }
    }

    case 'get_journal_moods': {
      const limit = args.limit || 5
      const entries = getJournalEntries(profileId)
      return {
        moods: entries.slice(0, limit).map(e => ({
          date: formatWhen(e.date),
          mood: e.moodSymbol?.label || 'not recorded',
        })),
        note: 'Journal sentences are private to the individual and not available.',
      }
    }

    case 'get_coach_recommendation': {
      const card = getStoredCoachCard(profileId)
      if (!card) return { status: 'No coach card generated yet this week.' }
      return {
        summary: card.summary,
        strength: card.strength,
        priority: card.priority,
        suggestedWords: card.suggestions,
        reasoning: card.reasoning,
      }
    }

    case 'search_symbol': {
      const id = await resolveSymbolId(args.word)
      return { word: args.word, pictogramFound: !!id, symbolId: id }
    }

    case 'propose_symbols_for_board': {
      const board = boards.find(b => b.name.toLowerCase() === (args.boardName || '').toLowerCase())
      if (!board) {
        return { error: `No board named "${args.boardName}". Available: ${boards.map(b => b.name).join(', ')}` }
      }

      const existing = new Set(board.symbols.map(s => s.label.toLowerCase()))
      const requested = (args.words || []).filter(w => w?.word)
      const alreadyPresent = requested.filter(w => existing.has(w.word.toLowerCase())).map(w => w.word)
      const candidates = requested.filter(w => !existing.has(w.word.toLowerCase()))

      const resolved = await Promise.all(
        candidates.map(async w => ({
          word: w.word,
          wordType: WORD_TYPE_ENUM.includes(w.wordType) ? w.wordType : 'none',
          symbolId: await resolveSymbolId(w.word),
        }))
      )
      const withPictogram = resolved.filter(s => s.symbolId)
      const noPictogram = resolved.filter(s => !s.symbolId).map(s => s.word)

      if (withPictogram.length === 0) {
        return {
          status: 'nothing_to_add',
          alreadyPresent,
          noPictogramFound: noPictogram,
        }
      }

      ctx.pendingAction = {
        boardId: board.id,
        boardName: board.name,
        reason: args.reason || '',
        symbols: withPictogram.map(s => ({ ...s, imageUrl: getSymbolImageUrl(s.symbolId) })),
      }

      return {
        status: 'awaiting_caregiver_confirmation',
        board: board.name,
        stagedWords: withPictogram.map(s => s.word),
        alreadyPresent,
        noPictogramFound: noPictogram,
        note: 'An approval card is now shown to the caregiver. Briefly tell them what you prepared and that they can approve it below your message.',
      }
    }

    default:
      return { error: `Unknown tool: ${name}` }
  }
}

// Called by the UI when the caregiver approves a staged action.
export function applyPendingAction(profileId, action) {
  let added = 0
  action.symbols.forEach(s => {
    const ok = addSymbolToBoard(profileId, action.boardId, {
      symbolId: s.symbolId,
      label: s.word,
      wordType: s.wordType,
      imageUrl: null,
      isCustom: false,
    })
    if (ok) added++
  })
  return added
}
