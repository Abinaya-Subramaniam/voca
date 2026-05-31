import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { updateWhoIAm, updateProfileSettings } from '../../store/profileStore'
import { getSymbolImageUrl } from '../../services/symbolService'

const LOVE_SYMBOL_OPTIONS = [
  { symbolId: '5517', label: 'play'     },
  { symbolId: '5516', label: 'sleep'    },
  { symbolId: '5515', label: 'eat'      },
  { symbolId: '5543', label: 'book'     },
  { symbolId: '5542', label: 'friend'   },
  { symbolId: '5524', label: 'happy'    },
  { symbolId: '5518', label: 'home'     },
  { symbolId: '5536', label: 'apple'    },
  { symbolId: '5514', label: 'drink'    },
  { symbolId: '5544', label: 'write'    },
  { symbolId: '5545', label: 'read'     },
  { symbolId: '5546', label: 'draw'     },
  { symbolId: '5510', label: 'go'       },
  { symbolId: '5519', label: 'more'     },
  { symbolId: '5531', label: 'good'     },
  { symbolId: '5522', label: 'yes'      },
]

export default function WhoIAmCard({ onClose }) {
  const { state, dispatch } = useApp()
  const { activeProfile, activeProfileId } = state
  const [editing, setEditing] = useState(false)

  const whoIAm = activeProfile?.whoIAm || {}

  const [form, setForm] = useState({
    age:               whoIAm.age || '',
    communicationNote: whoIAm.communicationNote || '',
    loveSymbols:       whoIAm.loveSymbols || [],
    helpTips:          whoIAm.helpTips || [
      'Give me time to find my words.',
      'Watch my screen, not just my face.',
      'Yes or no questions work well.',
    ],
    emergencyName:     whoIAm.emergencyName || '',
    emergencyPhone:    whoIAm.emergencyPhone || '',
  })

  function handleSave() {
    updateWhoIAm(activeProfileId, form)
    dispatch({ type: 'SET_ACTIVE_PROFILE', profileId: activeProfileId })
    setEditing(false)
  }

  function toggleLoveSymbol(sym) {
    const exists = form.loveSymbols.find(s => s.symbolId === sym.symbolId)
    if (exists) {
      setForm(f => ({ ...f, loveSymbols: f.loveSymbols.filter(s => s.symbolId !== sym.symbolId) }))
    } else if (form.loveSymbols.length < 6) {
      setForm(f => ({ ...f, loveSymbols: [...f.loveSymbols, sym] }))
    }
  }

  function updateTip(index, value) {
    const tips = [...form.helpTips]
    tips[index] = value
    setForm(f => ({ ...f, helpTips: tips }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-warm-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪪</span>
            <span className="font-display font-bold text-warm-900 text-base">Who I Am</span>
          </div>
          <div className="flex items-center gap-2">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 text-white text-xs font-medium hover:bg-teal-600 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
            )}
            {editing && (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-3 py-1.5 rounded-xl border border-warm-200 text-warm-600 text-xs font-medium hover:bg-warm-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 rounded-xl bg-teal-500 text-white text-xs font-medium hover:bg-teal-600 transition-colors"
                >
                  Save
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-warm-400 hover:bg-warm-100 transition-colors ml-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── VIEW MODE ── */}
          {!editing && (
            <div className="who-i-am-print">

              {/* Card header */}
              <div
                className="px-6 py-8 text-center"
                style={{ background: 'linear-gradient(135deg, #E8F7F4 0%, #F2F1EE 100%)' }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-display font-bold text-3xl mx-auto mb-4 shadow-raised"
                  style={{ backgroundColor: activeProfile?.avatarColor || '#2D9B83' }}
                >
                  {activeProfile?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="font-display font-extrabold text-warm-900 text-2xl leading-none mb-1">
                  {activeProfile?.name}
                </h2>
                {whoIAm.age && (
                  <p className="font-sans text-warm-500 text-sm">
                    {whoIAm.age} years old
                  </p>
                )}
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 rounded-full border border-teal-100">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="font-sans text-teal-700 text-xs font-semibold">
                    Voca AAC User
                  </span>
                </div>
              </div>

              <div className="px-5 py-5 space-y-5">

                {/* Communication note */}
                <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">💬</span>
                    <span className="font-sans font-bold text-teal-800 text-sm">
                      How I communicate
                    </span>
                  </div>
                  <p className="font-sans text-teal-900 text-sm leading-relaxed">
                    {whoIAm.communicationNote ||
                      'I use Voca to communicate. I tap symbols to tell you what I think and feel. Please be patient and give me time.'}
                  </p>
                </div>

                {/* Love symbols */}
                {whoIAm.loveSymbols?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base">❤️</span>
                      <span className="font-sans font-bold text-warm-800 text-sm">
                        Things I love
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {whoIAm.loveSymbols.map((sym, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-warm-200 shadow-subtle"
                        >
                          <img
                            src={getSymbolImageUrl(sym.symbolId)}
                            alt={sym.label}
                            className="w-12 h-12 object-contain"
                            onError={e => { e.target.style.display = 'none' }}
                          />
                          <span className="font-sans font-semibold text-warm-700 text-xs">
                            {sym.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Help tips */}
                {whoIAm.helpTips?.filter(t => t.trim()).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base">🤝</span>
                      <span className="font-sans font-bold text-warm-800 text-sm">
                        How you can help me
                      </span>
                    </div>
                    <div className="space-y-2">
                      {whoIAm.helpTips.filter(t => t.trim()).map((tip, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100"
                        >
                          <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-amber-800 text-xs font-bold">{i + 1}</span>
                          </div>
                          <span className="font-sans text-amber-900 text-sm leading-relaxed">
                            {tip}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emergency contact */}
                {(whoIAm.emergencyName || whoIAm.emergencyPhone) && (
                  <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">📞</span>
                      <span className="font-sans font-bold text-red-800 text-sm">
                        Emergency contact
                      </span>
                    </div>
                    {whoIAm.emergencyName && (
                      <p className="font-sans text-red-900 font-semibold text-sm">
                        {whoIAm.emergencyName}
                      </p>
                    )}
                    {whoIAm.emergencyPhone && (
                      <p className="font-sans text-red-700 text-sm">
                        {whoIAm.emergencyPhone}
                      </p>
                    )}
                  </div>
                )}

                {/* Empty state prompt */}
                {!whoIAm.communicationNote &&
                 !whoIAm.loveSymbols?.length &&
                 !whoIAm.emergencyName && (
                  <div className="text-center py-6">
                    <p className="font-sans text-warm-400 text-sm leading-relaxed mb-3">
                      This card helps strangers understand {activeProfile?.name} instantly.
                      Tap Edit to fill it in.
                    </p>
                    <button
                      onClick={() => setEditing(true)}
                      className="px-5 py-2.5 bg-teal-500 text-white rounded-xl font-display font-bold text-sm hover:bg-teal-600 transition-colors"
                    >
                      Set up my card →
                    </button>
                  </div>
                )}

                {/* Powered by */}
                <div className="text-center pt-2 pb-2">
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-teal-500 flex items-center justify-center">
                      <span className="text-white font-display font-bold text-[10px]">V</span>
                    </div>
                    <span className="font-sans text-warm-400 text-xs">
                      Made with Voca — Free AAC for everyone
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ── EDIT MODE ── */}
          {editing && (
            <div className="px-5 py-5 space-y-5">

              {/* Name + age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-sans font-semibold text-warm-700 text-xs mb-1.5 uppercase tracking-wide">
                    Name
                  </label>
                  <div className="px-3 py-2.5 bg-warm-100 rounded-xl text-sm text-warm-500 font-sans border border-warm-200">
                    {activeProfile?.name}
                  </div>
                </div>
                <div>
                  <label className="block font-sans font-semibold text-warm-700 text-xs mb-1.5 uppercase tracking-wide">
                    Age
                  </label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                    placeholder="e.g. 8"
                    className="w-full px-3 py-2.5 bg-white border border-warm-200 rounded-xl text-sm font-sans text-warm-900 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Communication note */}
              <div>
                <label className="block font-sans font-semibold text-warm-700 text-xs mb-1.5 uppercase tracking-wide">
                  How I communicate
                </label>
                <textarea
                  value={form.communicationNote}
                  onChange={e => setForm(f => ({ ...f, communicationNote: e.target.value }))}
                  placeholder="e.g. I use Voca to communicate. I tap symbols to tell you what I think and feel. Please be patient and give me time."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-white border border-warm-200 rounded-xl text-sm font-sans text-warm-900 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none leading-relaxed"
                />
              </div>

              {/* Love symbols picker */}
              <div>
                <label className="block font-sans font-semibold text-warm-700 text-xs mb-1 uppercase tracking-wide">
                  Things I love
                </label>
                <p className="font-sans text-warm-400 text-xs mb-3">
                  Pick up to 6 symbols
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {LOVE_SYMBOL_OPTIONS.map(sym => {
                    const selected = form.loveSymbols.find(s => s.symbolId === sym.symbolId)
                    return (
                      <button
                        key={sym.symbolId}
                        onClick={() => toggleLoveSymbol(sym)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                          selected
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-warm-200 bg-white hover:border-teal-300'
                        }`}
                      >
                        <img
                          src={getSymbolImageUrl(sym.symbolId)}
                          alt={sym.label}
                          className="w-9 h-9 object-contain"
                          onError={e => { e.target.style.display = 'none' }}
                        />
                        <span className="text-[10px] font-sans font-medium text-warm-600">
                          {sym.label}
                        </span>
                        {selected && (
                          <div className="w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Help tips */}
              <div>
                <label className="block font-sans font-semibold text-warm-700 text-xs mb-1.5 uppercase tracking-wide">
                  How you can help me
                </label>
                <div className="space-y-2">
                  {form.helpTips.map((tip, i) => (
                    <input
                      key={i}
                      type="text"
                      value={tip}
                      onChange={e => updateTip(i, e.target.value)}
                      placeholder={`Tip ${i + 1}`}
                      className="w-full px-3 py-2.5 bg-white border border-warm-200 rounded-xl text-sm font-sans text-warm-900 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                    />
                  ))}
                </div>
              </div>

              {/* Emergency contact */}
              <div>
                <label className="block font-sans font-semibold text-warm-700 text-xs mb-1.5 uppercase tracking-wide">
                  Emergency contact
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={form.emergencyName}
                    onChange={e => setForm(f => ({ ...f, emergencyName: e.target.value }))}
                    placeholder="Contact name"
                    className="w-full px-3 py-2.5 bg-white border border-warm-200 rounded-xl text-sm font-sans text-warm-900 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    value={form.emergencyPhone}
                    onChange={e => setForm(f => ({ ...f, emergencyPhone: e.target.value }))}
                    placeholder="Phone number"
                    className="w-full px-3 py-2.5 bg-white border border-warm-200 rounded-xl text-sm font-sans text-warm-900 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}