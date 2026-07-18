import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { runCompanionAgent } from '../../agent/companionAgent'
import { applyPendingAction } from '../../agent/agentTools'

const SUGGESTED = [
  'What should we focus on this week?',
  'Are there any vocabulary gaps right now?',
  'Suggest and add new words to a board',
]

export default function CompanionTab() {
  const { state, dispatch } = useApp()
  const { activeProfileId, activeProfile, boards } = state

  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [liveSteps, setLiveSteps] = useState([])
  const bottomRef                 = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, liveSteps])

  async function handleSend(text) {
    const trimmed = (text || input).trim()
    if (!trimmed || loading) return

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
    setLiveSteps([])

    try {
      const result = await runCompanionAgent({
        messages: nextMessages.map(m => ({ role: m.role, text: m.text })),
        profileId: activeProfileId,
        profile: activeProfile,
        boards,
        apiKey,
        onStep: step => setLiveSteps(prev => [...prev, step]),
      })
      setMessages(prev => [...prev, {
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

  function handleApprove(msgIndex) {
    const action = messages[msgIndex].action
    if (!action || action.status !== 'pending') return
    const added = applyPendingAction(activeProfileId, action)
    dispatch({ type: 'REFRESH_BOARDS' })
    setMessages(prev => prev.map((m, i) =>
      i === msgIndex ? { ...m, action: { ...m.action, status: 'applied', addedCount: added } } : m
    ))
  }

  function handleDismiss(msgIndex) {
    setMessages(prev => prev.map((m, i) =>
      i === msgIndex ? { ...m, action: { ...m.action, status: 'dismissed' } } : m
    ))
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
            <div className="font-sans text-warm-400 text-[13.5px] mt-0.5">
              An agent with live access to {activeProfile?.name}'s data — it can update boards with your approval
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
              I check {activeProfile?.name}'s real communication data as we talk, and I can prepare board updates for you to approve.
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          msg.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm font-sans leading-relaxed bg-teal-500 text-white rounded-br-md">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-col items-start gap-1.5">
              {/* Tool trace */}
              {msg.steps?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 max-w-[80%]">
                  {msg.steps.map((s, j) => (
                    <span key={j} className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 border border-teal-100 rounded-full text-[11px] font-sans text-teal-700">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {s.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Reply bubble */}
              <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm font-sans leading-relaxed bg-white border border-warm-200 shadow-subtle text-warm-800 rounded-bl-md">
                {msg.text}
              </div>

              {/* Staged board update — approval card */}
              {msg.action && (
                <div className="max-w-[80%] w-full bg-white border border-teal-200 rounded-2xl shadow-subtle overflow-hidden">
                  <div className="px-4 pt-3 pb-3">
                    <div className="text-[11px] font-sans font-semibold uppercase tracking-wide text-teal-600 mb-1">
                      Proposed board update
                    </div>
                    <div className="font-display font-bold text-warm-900 text-sm">
                      Add {msg.action.symbols.length} {msg.action.symbols.length === 1 ? 'symbol' : 'symbols'} to "{msg.action.boardName}"
                    </div>
                    {msg.action.reason && (
                      <p className="font-sans text-warm-600 text-[13px] mt-1 leading-relaxed">{msg.action.reason}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {msg.action.symbols.map(s => (
                        <span key={s.word} className="inline-flex items-center gap-1.5 px-2 py-1 bg-warm-50 border border-warm-200 rounded-lg text-[13px] font-sans text-warm-800">
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
                        className="px-4 py-1.5 bg-teal-500 text-white rounded-lg text-[13px] font-sans font-semibold hover:bg-teal-600 active:scale-95 transition-all"
                      >
                        Approve & add
                      </button>
                      <button
                        onClick={() => handleDismiss(i)}
                        className="px-4 py-1.5 bg-white border border-warm-200 text-warm-600 rounded-lg text-[13px] font-sans hover:border-warm-400 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                  {msg.action.status === 'applied' && (
                    <div className="px-4 py-2.5 bg-teal-50 border-t border-teal-100 text-[13px] font-sans font-semibold text-teal-700">
                      ✓ {msg.action.addedCount} {msg.action.addedCount === 1 ? 'symbol' : 'symbols'} added to {msg.action.boardName}
                    </div>
                  )}
                  {msg.action.status === 'dismissed' && (
                    <div className="px-4 py-2.5 bg-warm-50 border-t border-warm-100 text-[13px] font-sans text-warm-400">
                      Dismissed — no changes made
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        ))}

        {/* Live agent activity while loading */}
        {loading && (
          <div className="flex flex-col items-start gap-1.5">
            {liveSteps.length > 0 && (
              <div className="flex flex-wrap gap-1.5 max-w-[80%]">
                {liveSteps.map((s, j) => (
                  <span key={j} className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded-full text-[11px] font-sans ${
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
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[13.5px] font-sans text-red-600">
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
              disabled={!hasKey || loading}
              className="flex-shrink-0 px-3 py-2 bg-white border border-warm-200 rounded-xl text-[13.5px] font-sans text-warm-600 hover:border-teal-300 hover:text-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 bg-white border-t border-warm-200 flex-shrink-0">
        {!hasKey && (
          <div className="text-[13.5px] font-sans text-warm-400 text-center mb-2">
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
            disabled={!hasKey || loading}
            className="flex-1 px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm font-sans text-warm-800 placeholder-warm-400 focus:outline-none focus:border-teal-400 focus:bg-white transition-colors disabled:opacity-50"
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
