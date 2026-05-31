import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { getProfileLog } from '../../store/logStore'
import { computeInsights } from '../../engine/insightsEngine'
import { getGapAlerts } from '../../engine/gapDetector'
import { getJournalEntries } from '../../store/journalStore'
import { getStoredCoachCard } from '../../services/geminiCoach'
import { sendCompanionMessage } from '../../services/companionService'

const SUGGESTED = [
  'What should we focus on this week?',
  'Why are vocabulary gaps appearing?',
  'How can I support communication at home?',
]

export default function CompanionTab() {
  const { state } = useApp()
  const { activeProfileId, activeProfile, boards } = state

  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [profileData, setProfileData] = useState(null)
  const bottomRef                 = useRef(null)

  useEffect(() => {
    if (!activeProfileId) return
    async function load() {
      const log      = await getProfileLog(activeProfileId)
      const insights = computeInsights(log)
      const alerts   = getGapAlerts(activeProfileId, boards)
      const entries  = getJournalEntries(activeProfileId)
      const coach    = getStoredCoachCard(activeProfileId)

      const topTopics = Object.entries(insights.topicCounts || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([boardId]) => boards.find(b => b.id === boardId)?.name || boardId)

      setProfileData({
        name:            activeProfile?.name || 'the individual',
        totalThisWeek:   insights.totalThisWeek,
        totalLastWeek:   insights.totalLastWeek,
        longestSentence: insights.longestSentence,
        peakTime:        insights.peakTime,
        newVocab:        insights.newVocab || [],
        uniqueVocabCount: insights.newVocab?.length || 0,
        topTopics,
        gapAlerts:       alerts,
        lastMood:        entries[0]?.moodSymbol?.label || null,
        coachPriority:   coach?.priority || null,
      })
    }
    load()
  }, [activeProfileId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend(text) {
    const trimmed = (text || input).trim()
    if (!trimmed || loading || !profileData) return

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      setError('Add VITE_GEMINI_API_KEY to your .env file to use Companion.')
      return
    }

    setInput('')
    setError(null)
    const userMsg = { role: 'user', text: trimmed }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setLoading(true)

    try {
      const reply = await sendCompanionMessage(nextMessages, profileData, apiKey)
      setMessages(prev => [...prev, { role: 'companion', text: reply }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const hasKey = !!import.meta.env.VITE_GEMINI_API_KEY

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-warm-50">

      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-warm-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center flex-shrink-0">
            <span className="text-base">🤝</span>
          </div>
          <div>
            <div className="font-display font-bold text-warm-900 text-sm leading-none">Companion</div>
            <div className="font-sans text-warm-400 text-xs mt-0.5">
              Ask anything about {activeProfile?.name}'s communication
            </div>
          </div>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="text-center pt-8 pb-4">
            <div className="text-4xl mb-3">💬</div>
            <div className="font-display font-bold text-warm-800 text-base mb-1">
              Ask me anything
            </div>
            <p className="font-sans text-warm-400 text-sm max-w-xs mx-auto leading-relaxed">
              I have {activeProfile?.name}'s real communication data this week and can answer specific questions.
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-sans leading-relaxed ${
              msg.role === 'user'
                ? 'bg-teal-500 text-white rounded-br-md'
                : 'bg-white border border-warm-200 shadow-subtle text-warm-800 rounded-bl-md'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-warm-200 shadow-subtle rounded-2xl rounded-bl-md px-4 py-3 flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-warm-300 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs font-sans text-red-600">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested chips */}
      {messages.length === 0 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-none">
          {SUGGESTED.map(q => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={!hasKey || !profileData}
              className="flex-shrink-0 px-3 py-2 bg-white border border-warm-200 rounded-xl text-xs font-sans text-warm-600 hover:border-teal-300 hover:text-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 bg-white border-t border-warm-200 flex-shrink-0">
        {!hasKey && (
          <div className="text-xs font-sans text-warm-400 text-center mb-2">
            Add VITE_GEMINI_API_KEY to .env to enable Companion
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about communication patterns..."
            disabled={!hasKey || !profileData || loading}
            className="flex-1 px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm font-sans text-warm-800 placeholder-warm-400 focus:outline-none focus:border-teal-400 focus:bg-white transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || !hasKey || !profileData || loading}
            className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  )
}
