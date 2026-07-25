import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { agentChat, applyAgentAction, dismissAgentAction, getAgentMessages } from '../../api'

const SUGGESTED = [
  'What should we focus on this week?',
  'Are there any vocabulary gaps right now?',
  'Suggest and add new words to a board',
]

function BotIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="9" width="16" height="11" rx="3" />
      <path d="M12 9V5" />
      <circle cx="12" cy="3.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="9" cy="14.5" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14.5" r="1.25" fill="currentColor" stroke="none" />
      <path d="M9 17.5c.8.6 1.9.9 3 .9s2.2-.3 3-.9" />
      <path d="M2 13h2" />
      <path d="M20 13h2" />
    </svg>
  )
}

function UserIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
    </svg>
  )
}

function toLocalMessage(m) {
  return {
    id: m.id,
    role: m.role,
    text: m.text,
    steps: m.steps,
    action: m.pendingAction
      ? { ...m.pendingAction, status: m.actionStatus || 'pending', addedCount: m.actionAddedCount }
      : null,
  }
}

export default function CompanionTab() {
  const { state, dispatch } = useApp()
  const { activeProfileId, activeProfile } = state

  const [messages, setMessages]     = useState([])
  const [input, setInput]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [error, setError]           = useState(null)
  const [liveSteps, setLiveSteps]   = useState([])
  const bottomRef                   = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, liveSteps])

  // Load the remembered conversation for this profile whenever it changes.
  useEffect(() => {
    let cancelled = false
    setMessages([])
    setError(null)
    if (!activeProfileId) { setHistoryLoading(false); return }

    setHistoryLoading(true)
    getAgentMessages(activeProfileId)
      .then(rows => { if (!cancelled) setMessages(rows.map(toLocalMessage)) })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setHistoryLoading(false) })

    return () => { cancelled = true }
  }, [activeProfileId])

  async function handleSend(text) {
    const trimmed = (text || input).trim()
    if (!trimmed || loading) return

    setInput('')
    setError(null)
    const userMsg = { role: 'user', text: trimmed }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setLoading(true)
    setLiveSteps([{ label: `Consulting ${activeProfile?.name}'s data` }])

    try {
      const result = await agentChat(
        activeProfileId,
        nextMessages.map(m => ({ role: m.role, text: m.text }))
      )
      setMessages(prev => [...prev, {
        id: result.id,
        role: 'companion',
        text: result.text,
        steps: result.steps,
        action: result.pendingAction ? { ...result.pendingAction, status: 'pending' } : null,
      }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setLiveSteps([])
    }
  }

  async function handleApprove(msgIndex) {
    const msg = messages[msgIndex]
    if (!msg.action || msg.action.status !== 'pending') return
    try {
      const { added } = await applyAgentAction(activeProfileId, msg.id)
      dispatch({ type: 'REFRESH_BOARDS' })
      setMessages(prev => prev.map((m, i) =>
        i === msgIndex ? { ...m, action: { ...m.action, status: 'applied', addedCount: added } } : m
      ))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDismiss(msgIndex) {
    const msg = messages[msgIndex]
    if (!msg.action || msg.action.status !== 'pending') return
    try {
      await dismissAgentAction(activeProfileId, msg.id)
      setMessages(prev => prev.map((m, i) =>
        i === msgIndex ? { ...m, action: { ...m.action, status: 'dismissed' } } : m
      ))
    } catch (err) {
      setError(err.message)
    }
  }

  const hasKey = true  // the Gemini key lives on the backend now

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-warm-50">

      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-warm-200 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center flex-shrink-0 shadow-subtle">
            <BotIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-warm-900 text-base leading-none">Voca Bot</div>
            <div className="font-sans text-warm-400 text-sm mt-1">
              Remembers our past chats and has live access to {activeProfile?.name}'s data — it can update boards with your approval
            </div>
          </div>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* History loading */}
        {historyLoading && (
          <div className="flex justify-center pt-8">
            <div className="flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full bg-warm-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!historyLoading && messages.length === 0 && (
          <div className="text-center pt-8 pb-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center mx-auto mb-3 shadow-subtle">
              <BotIcon className="w-8 h-8 text-white" />
            </div>
            <div className="font-display font-bold text-warm-800 text-lg mb-1">
              Ask me anything
            </div>
            <p className="font-sans text-warm-400 text-base max-w-xs mx-auto leading-relaxed">
              I check {activeProfile?.name}'s real communication data as we talk, remember our conversation, and can prepare board updates for you to approve.
            </p>
          </div>
        )}

        {/* Messages */}
        {!historyLoading && messages.map((msg, i) => (
          msg.role === 'user' ? (
            <div key={i} className="flex justify-end items-end gap-2">
              <div className="max-w-[78%] rounded-2xl px-4 py-3 text-base font-sans leading-relaxed bg-teal-500 text-white rounded-br-md">
                {msg.text}
              </div>
              <div className="w-8 h-8 rounded-full bg-warm-200 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-[18px] h-[18px] text-warm-600" />
              </div>
            </div>
          ) : (
            <div key={i} className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                <BotIcon className="w-[18px] h-[18px] text-white" />
              </div>
              <div className="flex flex-col items-start gap-1.5 min-w-0">
                {/* Tool trace */}
                {msg.steps?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 max-w-[85%]">
                    {msg.steps.map((s, j) => (
                      <span key={j} className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 border border-teal-100 rounded-full text-xs font-sans text-teal-700">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {s.label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Reply bubble */}
                <div className="max-w-[85%] rounded-2xl px-4 py-3 text-base font-sans leading-relaxed bg-white border border-warm-200 shadow-subtle text-warm-800 rounded-bl-md">
                  {msg.text}
                </div>

                {/* Staged board update — approval card */}
                {msg.action && (
                  <div className="max-w-[85%] w-full bg-white border border-teal-200 rounded-2xl shadow-subtle overflow-hidden">
                    <div className="px-4 pt-3 pb-3">
                      <div className="text-xs font-sans font-semibold uppercase tracking-wide text-teal-600 mb-1">
                        Proposed board update
                      </div>
                      <div className="font-display font-bold text-warm-900 text-base">
                        Add {msg.action.symbols.length} {msg.action.symbols.length === 1 ? 'symbol' : 'symbols'} to "{msg.action.boardName}"
                      </div>
                      {msg.action.reason && (
                        <p className="font-sans text-warm-600 text-sm mt-1 leading-relaxed">{msg.action.reason}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {msg.action.symbols.map(s => (
                          <span key={s.word} className="inline-flex items-center gap-1.5 px-2 py-1 bg-warm-50 border border-warm-200 rounded-lg text-sm font-sans text-warm-800">
                            {s.imageUrl && (
                              <img
                                src={s.imageUrl}
                                alt=""
                                className="w-5 h-5 object-contain"
                                onError={e => { e.target.style.display = 'none' }}
                              />
                            )}
                            {s.word}
                          </span>
                        ))}
                      </div>
                    </div>
                    {msg.action.status === 'pending' && (
                      <div className="px-4 py-2.5 bg-warm-50 border-t border-warm-100 flex gap-2">
                        <button
                          onClick={() => handleApprove(i)}
                          className="px-4 py-1.5 bg-teal-500 text-white rounded-lg text-sm font-sans font-semibold hover:bg-teal-600 active:scale-95 transition-all"
                        >
                          Approve & add
                        </button>
                        <button
                          onClick={() => handleDismiss(i)}
                          className="px-4 py-1.5 bg-white border border-warm-200 text-warm-600 rounded-lg text-sm font-sans hover:border-warm-400 transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                    {msg.action.status === 'applied' && (
                      <div className="px-4 py-2.5 bg-teal-50 border-t border-teal-100 text-sm font-sans font-semibold text-teal-700">
                        ✓ {msg.action.addedCount} {msg.action.addedCount === 1 ? 'symbol' : 'symbols'} added to {msg.action.boardName}
                      </div>
                    )}
                    {msg.action.status === 'dismissed' && (
                      <div className="px-4 py-2.5 bg-warm-50 border-t border-warm-100 text-sm font-sans text-warm-400">
                        Dismissed — no changes made
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        ))}

        {/* Live agent activity while loading */}
        {loading && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
              <BotIcon className="w-[18px] h-[18px] text-white" />
            </div>
            <div className="flex flex-col items-start gap-1.5">
              {liveSteps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 max-w-[85%]">
                  {liveSteps.map((s, j) => (
                    <span key={j} className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded-full text-xs font-sans ${
                      j === liveSteps.length - 1
                        ? 'bg-amber-50 border-amber-200 text-amber-900 animate-pulse'
                        : 'bg-teal-50 border-teal-100 text-teal-700'
                    }`}>
                      {j === liveSteps.length - 1 ? '⚙' : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                      {s.label}
                    </span>
                  ))}
                </div>
              )}
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
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm font-sans text-red-600">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested chips */}
      {!historyLoading && messages.length === 0 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-none">
          {SUGGESTED.map(q => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={!hasKey || loading}
              className="flex-shrink-0 px-3 py-2 bg-white border border-warm-200 rounded-xl text-sm font-sans text-warm-600 hover:border-teal-300 hover:text-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 bg-white border-t border-warm-200 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about communication patterns..."
            disabled={!hasKey || loading}
            className="flex-1 px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-base font-sans text-warm-800 placeholder-warm-400 focus:outline-none focus:border-teal-400 focus:bg-white transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || !hasKey || loading}
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
