import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import {
  getJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
  formatEntryDate,
  formatEntryTime,
} from '../../store/journalStore'
import { getSymbolImageUrl } from '../../services/symbolService'

const MOOD_SYMBOLS = [
  { symbolId: '5524', label: 'happy',    emoji: '😊' },
  { symbolId: '5525', label: 'sad',      emoji: '😢' },
  { symbolId: '5526', label: 'angry',    emoji: '😠' },
  { symbolId: '5528', label: 'tired',    emoji: '😴' },
  { symbolId: '5527', label: 'scared',   emoji: '😨' },
  { symbolId: '5531', label: 'good',     emoji: '😌' },
  { symbolId: '5530', label: 'hurt',     emoji: '🤕' },
  { symbolId: '5529', label: 'hungry',   emoji: '🥺' },
]

const QUICK_SYMBOLS = [
  { symbolId: '25427', label: 'I'       },
  { symbolId: '25429', label: 'want'    },
  { symbolId: '25430', label: 'like'    },
  { symbolId: '5510',  label: 'go'      },
  { symbolId: '5515',  label: 'eat'     },
  { symbolId: '5514',  label: 'drink'   },
  { symbolId: '5517',  label: 'play'    },
  { symbolId: '5516',  label: 'sleep'   },
  { symbolId: '5518',  label: 'home'    },
  { symbolId: '5519',  label: 'more'    },
  { symbolId: '5520',  label: 'help'    },
  { symbolId: '5522',  label: 'yes'     },
  { symbolId: '5523',  label: 'no'      },
  { symbolId: '5524',  label: 'happy'   },
  { symbolId: '5525',  label: 'sad'     },
  { symbolId: '5526',  label: 'angry'   },
  { symbolId: '5528',  label: 'tired'   },
  { symbolId: '5531',  label: 'good'    },
  { symbolId: '5532',  label: 'water'   },
  { symbolId: '5536',  label: 'apple'   },
  { symbolId: '5517',  label: 'fun'     },
  { symbolId: '5543',  label: 'book'    },
  { symbolId: '5542',  label: 'friend'  },
]

export default function JournalView() {
  const { state } = useApp()
  const { activeProfileId, activeProfile } = state

  const [screen, setScreen]           = useState('list')
  const [entries, setEntries]         = useState([])
  const [selectedMood, setSelectedMood] = useState(null)
  const [currentSentence, setCurrentSentence] = useState([])
  const [sentences, setSentences]     = useState([])
  const [viewEntry, setViewEntry]     = useState(null)
  const [step, setStep]               = useState('mood')

  useEffect(() => {
    if (activeProfileId) {
      setEntries(getJournalEntries(activeProfileId))
    }
  }, [activeProfileId])

  function handleStartNew() {
    setSelectedMood(null)
    setCurrentSentence([])
    setSentences([])
    setStep('mood')
    setScreen('new')
  }

  function handleMoodSelect(mood) {
    setSelectedMood(mood)
    setStep('write')
  }

  function handleSymbolTap(symbol) {
    if (currentSentence.length >= 15) return
    setCurrentSentence(prev => [...prev, symbol])
  }

  function handleRemoveLast() {
    setCurrentSentence(prev => prev.slice(0, -1))
  }

  function handleAddSentence() {
    if (currentSentence.length === 0) return
    setSentences(prev => [...prev, [...currentSentence]])
    setCurrentSentence([])
  }

  function handleSaveEntry() {
    if (sentences.length === 0 && currentSentence.length === 0) return
    const finalSentences = currentSentence.length > 0
      ? [...sentences, [...currentSentence]]
      : sentences
    const entry = saveJournalEntry(activeProfileId, {
      moodSymbol: selectedMood,
      sentences: finalSentences,
    })
    setEntries(getJournalEntries(activeProfileId))
    setScreen('list')
  }

  function handleDelete(entryId) {
    if (!confirm('Delete this journal entry?')) return
    deleteJournalEntry(activeProfileId, entryId)
    setEntries(getJournalEntries(activeProfileId))
    setViewEntry(null)
    setScreen('list')
  }

  function handleExportPDF() {
    window.print()
  }

  if (screen === 'new') {
    return (
      <NewEntryScreen
        step={step}
        selectedMood={selectedMood}
        currentSentence={currentSentence}
        sentences={sentences}
        activeProfile={activeProfile}
        onMoodSelect={handleMoodSelect}
        onSymbolTap={handleSymbolTap}
        onRemoveLast={handleRemoveLast}
        onAddSentence={handleAddSentence}
        onSave={handleSaveEntry}
        onBack={() => setScreen('list')}
      />
    )
  }

  if (screen === 'view' && viewEntry) {
    return (
      <EntryDetailScreen
        entry={viewEntry}
        activeProfile={activeProfile}
        onBack={() => setScreen('list')}
        onDelete={() => handleDelete(viewEntry.id)}
        onExport={handleExportPDF}
      />
    )
  }

  return (
    <JournalListScreen
      entries={entries}
      activeProfile={activeProfile}
      onNew={handleStartNew}
      onView={(entry) => { setViewEntry(entry); setScreen('view') }}
      onExport={handleExportPDF}
    />
  )
}

// ── List screen ──────────────────────────────────────────────────────────────

function JournalListScreen({ entries, activeProfile, onNew, onView, onExport }) {
  return (
    <div className="flex-1 overflow-y-auto bg-warm-50">
      <div className="max-w-2xl mx-auto px-4 py-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-warm-900 text-xl leading-none">
              My Journal
            </h2>
            <p className="font-sans text-warm-400 text-xs mt-1">
              A private space — just for you
            </p>
          </div>
          <div className="flex items-center gap-2">
            {entries.length > 0 && (
              <button
                onClick={onExport}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-warm-200 bg-white text-warm-600 text-xs font-medium hover:bg-warm-100 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Save PDF
              </button>
            )}
            <button
              onClick={onNew}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 text-white text-sm font-display font-bold hover:bg-teal-600 active:scale-95 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New entry
            </button>
          </div>
        </div>

        {/* Empty state */}
        {entries.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📔</div>
            <h3 className="font-display font-bold text-warm-800 text-lg mb-2">
              Your journal is empty
            </h3>
            <p className="font-sans text-warm-400 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              This is your private space. Tap symbols to record your day, your feelings, your thoughts.
            </p>
            <button
              onClick={onNew}
              className="px-6 py-3 bg-teal-500 text-white rounded-xl font-display font-bold text-sm hover:bg-teal-600 active:scale-95 transition-all"
            >
              Write first entry →
            </button>
          </div>
        )}

        {/* Entry list */}
        <div className="space-y-3 journal-content">
          {entries.map(entry => (
            <button
              key={entry.id}
              onClick={() => onView(entry)}
              className="w-full text-left bg-white rounded-xl border border-warm-200 shadow-subtle hover:border-teal-300 hover:shadow-raised transition-all p-4"
            >
              <div className="flex items-start gap-3">
                {/* Mood */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-warm-50 border border-warm-200 flex items-center justify-center">
                  {entry.moodSymbol ? (
                    <img
                      src={getSymbolImageUrl(entry.moodSymbol.symbolId)}
                      alt={entry.moodSymbol.label}
                      className="w-9 h-9 object-contain"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <span className="text-xl">📝</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-sans font-semibold text-warm-800 text-sm">
                      {formatEntryDate(entry.date)}
                    </div>
                    <div className="font-sans text-warm-400 text-xs flex-shrink-0 ml-2">
                      {formatEntryTime(entry.date)}
                    </div>
                  </div>

                  {entry.moodSymbol && (
                    <div className="font-sans text-warm-500 text-xs mb-2">
                      Feeling <span className="font-semibold text-teal-600">{entry.moodSymbol.label}</span>
                    </div>
                  )}

                  {/* Symbol preview strip */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.sentences.flat().slice(0, 8).map((sym, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 bg-warm-100 text-warm-700 rounded-md text-xs font-medium"
                      >
                        {sym.label}
                      </span>
                    ))}
                    {entry.sentences.flat().length > 8 && (
                      <span className="text-xs text-warm-400">
                        +{entry.sentences.flat().length - 8} more
                      </span>
                    )}
                  </div>
                </div>

                <svg className="w-4 h-4 text-warm-300 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

// ── New entry screen ──────────────────────────────────────────────────────────

function NewEntryScreen({
  step, selectedMood, currentSentence, sentences,
  activeProfile, onMoodSelect, onSymbolTap,
  onRemoveLast, onAddSentence, onSave, onBack
}) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-warm-50">

      {/* Entry header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-warm-200 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-warm-500 hover:text-warm-800 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="text-center">
          <div className="font-display font-bold text-warm-900 text-sm">{today}</div>
          <div className="font-sans text-warm-400 text-xs">New journal entry</div>
        </div>
        <button
          onClick={onSave}
          disabled={sentences.length === 0 && currentSentence.length === 0}
          className="px-4 py-2 bg-teal-500 text-white rounded-xl text-sm font-display font-bold hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
          Save
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* Mood picker step */}
        {step === 'mood' && (
          <div className="px-4 py-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🌅</div>
              <h3 className="font-display font-bold text-warm-900 text-lg mb-1">
                How are you feeling?
              </h3>
              <p className="font-sans text-warm-400 text-sm">
                Pick a mood to start your entry
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
              {MOOD_SYMBOLS.map(mood => (
                <button
                  key={mood.symbolId}
                  onClick={() => onMoodSelect(mood)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border-2 border-warm-200 hover:border-teal-400 hover:bg-teal-50 active:scale-95 transition-all"
                >
                  <img
                    src={getSymbolImageUrl(mood.symbolId)}
                    alt={mood.label}
                    className="w-10 h-10 object-contain"
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                  <span className="text-2xl hidden">{mood.emoji}</span>
                  <span className="text-xs font-sans font-semibold text-warm-700">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => onMoodSelect(null)}
                className="text-sm text-warm-400 hover:text-warm-600 transition-colors"
              >
                Skip mood →
              </button>
            </div>
          </div>
        )}

        {/* Write step */}
        {step === 'write' && (
          <div className="flex flex-col h-full">

            {/* Mood display + saved sentences */}
            <div className="px-4 py-3 space-y-2">
              {selectedMood && (
                <div className="flex items-center gap-2 px-3 py-2 bg-teal-50 rounded-xl border border-teal-100 w-fit">
                  <img
                    src={getSymbolImageUrl(selectedMood.symbolId)}
                    alt={selectedMood.label}
                    className="w-7 h-7 object-contain"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  <span className="text-sm font-sans font-semibold text-teal-700">
                    Feeling {selectedMood.label}
                  </span>
                </div>
              )}

              {/* Saved sentences */}
              {sentences.map((sentence, si) => (
                <div key={si} className="flex flex-wrap gap-1.5 px-3 py-2 bg-white rounded-xl border border-warm-200">
                  {sentence.map((sym, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      <img
                        src={getSymbolImageUrl(sym.symbolId)}
                        alt={sym.label}
                        className="w-8 h-8 object-contain"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                      <span className="text-[9px] font-sans text-warm-500 font-medium">
                        {sym.label}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Current sentence builder */}
            <div className="px-4 py-2 flex-shrink-0">
              <div className="bg-white rounded-xl border border-warm-200 p-3 min-h-[64px] flex items-center gap-2 flex-wrap">
                {currentSentence.length === 0 ? (
                  <span className="text-warm-300 text-sm font-sans">
                    Tap symbols below to write...
                  </span>
                ) : (
                  currentSentence.map((sym, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5 chip-in">
                      <img
                        src={getSymbolImageUrl(sym.symbolId)}
                        alt={sym.label}
                        className="w-9 h-9 object-contain"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                      <span className="text-[10px] font-sans text-teal-700 font-semibold">
                        {sym.label}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Sentence actions */}
              <div className="flex items-center gap-2 mt-2">
                {currentSentence.length > 0 && (
                  <button
                    onClick={onRemoveLast}
                    className="px-3 py-1.5 rounded-lg bg-warm-100 text-warm-500 text-xs font-medium hover:bg-warm-200 transition-colors"
                  >
                    ⌫ Remove
                  </button>
                )}
                {currentSentence.length > 0 && (
                  <button
                    onClick={onAddSentence}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium hover:bg-teal-100 transition-colors"
                  >
                    + Add thought
                  </button>
                )}
                <div className="ml-auto text-xs text-warm-300 font-sans">
                  {currentSentence.length}/15
                </div>
              </div>
            </div>

            {/* Symbol picker */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <div className="text-[10px] font-sans font-semibold text-warm-400 uppercase tracking-wider mb-2">
                Tap to add
              </div>
              <div className="grid grid-cols-5 gap-2">
                {QUICK_SYMBOLS.map((sym, i) => (
                  <button
                    key={sym.symbolId + i}
                    onClick={() => onSymbolTap(sym)}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-warm-200 hover:border-teal-400 hover:bg-teal-50 active:scale-95 transition-all"
                  >
                    <img
                      src={getSymbolImageUrl(sym.symbolId)}
                      alt={sym.label}
                      className="w-9 h-9 object-contain"
                      onError={e => {
                        e.target.parentElement.querySelector('span').style.display = 'flex'
                        e.target.style.display = 'none'
                      }}
                    />
                    <span className="text-[10px] font-sans font-medium text-warm-600 leading-none">
                      {sym.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

// ── Entry detail screen ───────────────────────────────────────────────────────

function EntryDetailScreen({ entry, activeProfile, onBack, onDelete, onExport }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-warm-50">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-warm-200 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-warm-500 hover:text-warm-800 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span className="text-sm font-medium">Journal</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-warm-200 bg-white text-warm-600 text-xs font-medium hover:bg-warm-100 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Save PDF
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-100 bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Entry content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6 journal-content">

          {/* Date header */}
          <div className="text-center mb-6">
            <div className="font-display font-bold text-warm-900 text-xl">
              {formatEntryDate(entry.date)}
            </div>
            <div className="font-sans text-warm-400 text-sm mt-1">
              {formatEntryTime(entry.date)}
            </div>
          </div>

          {/* Mood */}
          {entry.moodSymbol && (
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-teal-100 flex items-center justify-center shadow-subtle mb-2">
                <img
                  src={getSymbolImageUrl(entry.moodSymbol.symbolId)}
                  alt={entry.moodSymbol.label}
                  className="w-14 h-14 object-contain"
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
              <span className="font-sans text-sm text-warm-600 font-semibold">
                Feeling {entry.moodSymbol.label}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-warm-200" />
            <span className="text-warm-300 text-xs font-sans">My thoughts</span>
            <div className="flex-1 h-px bg-warm-200" />
          </div>

          {/* Sentences */}
          <div className="space-y-4">
            {entry.sentences.map((sentence, si) => (
              <div key={si} className="bg-white rounded-2xl border border-warm-200 shadow-subtle p-4">
                <div className="flex flex-wrap gap-3 justify-center">
                  {sentence.map((sym, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-xl bg-warm-50 border border-warm-200 flex items-center justify-center">
                        <img
                          src={getSymbolImageUrl(sym.symbolId)}
                          alt={sym.label}
                          className="w-10 h-10 object-contain"
                          onError={e => {
                            e.target.style.display = 'none'
                            e.target.parentElement.innerHTML = `<span style="font-size:1.2rem;color:#6B6860">${sym.label.charAt(0).toUpperCase()}</span>`
                          }}
                        />
                      </div>
                      <span className="text-xs font-sans font-semibold text-warm-700">
                        {sym.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Private note */}
          <div className="mt-8 text-center">
            <span className="text-xs text-warm-300 font-sans">
              🔒 This entry is private and only visible to you
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}