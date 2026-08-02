import { useEffect, useState } from 'react'
import { createBoard, addSymbolToBoard, getBoardTemplates } from '../../store/boardStore'
import { getSymbolImageUrl } from '../../services/symbolService'
import CategoryIcon, { CATEGORY_META } from '../shared/CategoryIcon'

export default function AddBoardModal({ profileId, existingCategories, onClose, onCreated }) {
  const [templates, setTemplates] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [selectedSymbolIds, setSelectedSymbolIds] = useState(new Set())
  const [boardName, setBoardName] = useState('')
  const [customName, setCustomName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    getBoardTemplates()
      .then(setTemplates)
      .catch(err => setLoadError(err.message))
  }, [])

  const available = (templates || []).filter(t => !existingCategories.has(t.category))

  function chooseTemplate(template) {
    setSelected(template)
    setBoardName(template.name)
    setSelectedSymbolIds(new Set(template.symbols.map(s => s.symbolId)))
    setSaveError(null)
  }

  function toggleSymbol(symbolId) {
    setSelectedSymbolIds(prev => {
      const next = new Set(prev)
      if (next.has(symbolId)) next.delete(symbolId)
      else next.add(symbolId)
      return next
    })
  }

  async function handleCreateFromTemplate() {
    if (!selected || !boardName.trim() || selectedSymbolIds.size === 0 || saving) return
    setSaving(true)
    setSaveError(null)
    try {
      const board = await createBoard(profileId, boardName.trim(), selected.category)
      const chosen = selected.symbols.filter(s => selectedSymbolIds.has(s.symbolId))
      for (const s of chosen) {
        await addSymbolToBoard(profileId, board.id, {
          symbolId: s.symbolId,
          label: s.label,
          wordType: s.wordType || 'none',
        })
      }
      onCreated()
    } catch (err) {
      setSaveError(err.message)
      setSaving(false)
    }
  }

  async function handleCreateBlank() {
    if (!customName.trim() || saving) return
    setSaving(true)
    setSaveError(null)
    try {
      await createBoard(profileId, customName.trim(), 'custom')
      onCreated()
    } catch (err) {
      setSaveError(err.message)
      setSaving(false)
    }
  }

  const loading = !templates && !loadError

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-warm-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm-200 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {selected && (
              <button
                onClick={() => setSelected(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-warm-400 hover:bg-warm-100 transition-colors flex-shrink-0"
                aria-label="Back to board list"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <span className="font-display font-bold text-warm-900 text-base truncate">
              {selected ? selected.name : 'Add a board'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-warm-400 hover:bg-warm-100 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          {loading && (
            <p className="text-center text-warm-400 text-sm py-10">Loading board templates…</p>
          )}
          {loadError && (
            <p className="text-center text-red-500 text-sm py-6">{loadError}</p>
          )}

          {/* ── Step 1: pick a board ── */}
          {!loading && !loadError && !selected && (
            <>
              {available.length > 0 ? (
                <>
                  <p className="font-sans text-warm-500 text-sm mb-4">
                    Choose a ready-made board to see and pick its symbols, or create a blank one below.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {available.map(t => {
                      const meta = CATEGORY_META[t.category] || CATEGORY_META.custom
                      return (
                        <button
                          key={t.category}
                          onClick={() => chooseTemplate(t)}
                          className="flex flex-col items-start gap-2.5 p-4 rounded-xl border border-warm-200 hover:border-teal-400 hover:bg-teal-50 transition-all text-left"
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: meta.bg }}
                          >
                            <CategoryIcon category={t.category} className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-sans font-semibold text-warm-900 text-sm">{t.name}</div>
                            <div className="font-sans text-warm-400 text-xs mt-0.5">{t.symbols.length} symbols</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </>
              ) : (
                <p className="font-sans text-warm-500 text-sm mb-6">
                  Every ready-made board has already been added. You can still create a blank custom board below.
                </p>
              )}

              <div className="border-t border-warm-100 pt-4">
                <label className="block font-sans font-semibold text-warm-700 text-sm mb-2">
                  Or create a custom board
                </label>
                <div className="flex gap-2">
                  <input
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="Board name"
                    className="flex-1 border border-warm-200 rounded-xl px-3 py-2.5 text-sm font-sans text-warm-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleCreateBlank}
                    disabled={!customName.trim() || saving}
                    className="px-4 py-2.5 rounded-xl bg-teal-500 text-white font-sans font-semibold text-sm hover:bg-teal-600 disabled:opacity-40 transition-colors flex-shrink-0"
                  >
                    {saving ? 'Creating…' : 'Create'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── Step 2: pick symbols for the chosen template ── */}
          {!loading && selected && (
            <>
              <div className="mb-4">
                <label className="block font-sans font-semibold text-warm-700 text-sm mb-1.5">
                  Board name
                </label>
                <input
                  value={boardName}
                  onChange={e => setBoardName(e.target.value)}
                  className="w-full border border-warm-200 rounded-xl px-3 py-2.5 text-sm font-sans text-warm-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between mb-2.5">
                <span className="font-sans font-semibold text-warm-700 text-sm">Symbols</span>
                <span className="font-sans text-warm-400 text-xs">
                  {selectedSymbolIds.size} of {selected.symbols.length} selected
                </span>
              </div>
              <p className="font-sans text-warm-400 text-xs mb-3">
                Tap to remove a symbol before adding this board.
              </p>

              <div className="grid grid-cols-4 gap-2 mb-2">
                {selected.symbols.map(s => {
                  const checked = selectedSymbolIds.has(s.symbolId)
                  return (
                    <button
                      key={s.symbolId}
                      onClick={() => toggleSymbol(s.symbolId)}
                      className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                        checked
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-warm-200 bg-white opacity-45 hover:opacity-70'
                      }`}
                    >
                      <img
                        src={getSymbolImageUrl(s.symbolId)}
                        alt={s.label}
                        className="w-9 h-9 object-contain"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                      <span className="text-[10px] font-sans font-medium text-warm-700 truncate w-full text-center">
                        {s.label}
                      </span>
                      {checked && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-teal-500 flex items-center justify-center">
                          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {saveError && <p className="text-red-500 text-sm mt-3">{saveError}</p>}
        </div>

        {/* Footer actions for step 2 */}
        {!loading && selected && (
          <div className="flex gap-2 px-5 py-4 border-t border-warm-200 flex-shrink-0">
            <button
              onClick={() => setSelected(null)}
              className="flex-1 py-2.5 rounded-xl border border-warm-200 text-warm-600 font-sans font-semibold text-sm hover:bg-warm-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCreateFromTemplate}
              disabled={!boardName.trim() || selectedSymbolIds.size === 0 || saving}
              className="flex-1 py-2.5 rounded-xl bg-teal-500 text-white font-sans font-semibold text-sm hover:bg-teal-600 disabled:opacity-40 transition-colors"
            >
              {saving ? 'Adding…' : `Add board (${selectedSymbolIds.size})`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
