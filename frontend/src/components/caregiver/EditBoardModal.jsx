import { useState } from 'react'
import { updateBoard, reorderSymbols } from '../../store/boardStore'
import { getSymbolImageUrl, resolveSymbolId } from '../../services/symbolService'
import { WORD_TYPES } from '../../data/defaultBoards'
import ConfirmDialog from '../shared/ConfirmDialog'

const WORD_TYPE_OPTIONS = ['none', 'pronoun', 'verb', 'noun', 'descriptor', 'social', 'question']

function symbolsEqual(a, b) {
  if (a.length !== b.length) return false
  return a.every((s, i) => s.label === b[i].label && s.wordType === b[i].wordType)
}

export default function EditBoardModal({ profileId, board, onClose, onSaved }) {
  const [name, setName] = useState(board.name)
  const [symbols, setSymbols] = useState(
    () => board.symbols.map((s, i) => ({ ...s, _key: `${s.symbolId}_${i}` }))
  )
  const [deleteKey, setDeleteKey] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [addingSymbol, setAddingSymbol] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newWordType, setNewWordType] = useState('none')
  const [resolving, setResolving] = useState(false)
  const [addNotice, setAddNotice] = useState(null)

  const nameDirty = name.trim() !== board.name
  const symbolsDirty = !symbolsEqual(symbols, board.symbols)
  const hasEmptyLabel = symbols.some(s => !s.label.trim())
  const canSave = name.trim().length > 0 && !hasEmptyLabel && (nameDirty || symbolsDirty) && !saving

  function updateSymbol(key, patch) {
    setSymbols(prev => prev.map(s => (s._key === key ? { ...s, ...patch } : s)))
  }

  const symbolPendingDelete = symbols.find(s => s._key === deleteKey) || null

  function confirmDelete() {
    setSymbols(prev => prev.filter(s => s._key !== deleteKey))
    setDeleteKey(null)
  }

  function openAddSymbol() {
    setAddingSymbol(true)
    setNewLabel('')
    setNewWordType('none')
    setAddNotice(null)
  }

  async function handleAddSymbol() {
    const label = newLabel.trim()
    if (!label || resolving) return
    if (symbols.some(s => s.label.toLowerCase() === label.toLowerCase())) {
      setAddNotice(`"${label}" is already on this board.`)
      return
    }
    setResolving(true)
    setAddNotice(null)
    const symbolId = await resolveSymbolId(label).catch(() => null)
    setSymbols(prev => [
      ...prev,
      {
        _key: `new_${Date.now()}`,
        symbolId: symbolId || `custom_${Date.now()}`,
        label,
        wordType: newWordType,
        imageUrl: null,
        isCustom: !symbolId,
      },
    ])
    setResolving(false)
    if (!symbolId) {
      setAddNotice(`No picture found for "${label}" — added without one.`)
    } else {
      setAddingSymbol(false)
    }
    setNewLabel('')
    setNewWordType('none')
  }

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    setError(null)
    try {
      if (nameDirty) {
        await updateBoard(profileId, board.id, { name: name.trim() })
      }
      if (symbolsDirty) {
        await reorderSymbols(
          profileId,
          board.id,
          symbols.map((s, i) => ({
            symbolId: s.symbolId,
            label: s.label.trim(),
            wordType: s.wordType,
            imageUrl: s.imageUrl,
            isCustom: s.isCustom,
            position: i,
          }))
        )
      }
      onSaved()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-warm-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm-200 flex-shrink-0">
          <span className="font-display font-bold text-warm-900 text-base truncate">Edit board</span>
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

          <label className="block font-sans font-semibold text-warm-700 text-sm mb-1.5">
            Board name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={100}
            className="w-full border border-warm-200 rounded-xl px-3 py-2.5 text-sm font-sans text-warm-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-5"
          />

          <div className="flex items-center justify-between mb-2.5">
            <span className="font-sans font-semibold text-warm-700 text-sm">Symbols</span>
            <div className="flex items-center gap-3">
              <span className="font-sans text-warm-400 text-xs">{symbols.length} on this board</span>
              {!addingSymbol && (
                <button
                  onClick={openAddSymbol}
                  className="flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add
                </button>
              )}
            </div>
          </div>

          {addingSymbol && (
            <div className="flex items-center gap-2.5 p-2 rounded-xl border-2 border-dashed border-teal-300 bg-teal-50/40 mb-2">
              <input
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddSymbol() }}
                placeholder="New word"
                autoFocus
                className="flex-1 min-w-0 border border-warm-200 rounded-lg px-2.5 py-2 text-sm font-sans text-warm-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <select
                value={newWordType}
                onChange={e => setNewWordType(e.target.value)}
                className="flex-shrink-0 border border-warm-200 rounded-lg px-2 py-2 text-xs font-sans text-warm-700 focus:outline-none focus:ring-2 focus:ring-teal-500 max-w-[110px]"
              >
                {WORD_TYPE_OPTIONS.map(wt => (
                  <option key={wt} value={wt}>{WORD_TYPES[wt]?.label || 'None'}</option>
                ))}
              </select>
              <button
                onClick={handleAddSymbol}
                disabled={!newLabel.trim() || resolving}
                aria-label="Confirm add symbol"
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-40 transition-colors"
              >
                {resolving ? (
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setAddingSymbol(false)}
                aria-label="Cancel add symbol"
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-warm-400 hover:bg-warm-100 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}
          {addNotice && (
            <p className="font-sans text-warm-500 text-xs mb-2.5 -mt-1">{addNotice}</p>
          )}

          {symbols.length === 0 ? (
            <p className="font-sans text-warm-400 text-sm py-6 text-center">
              No symbols left on this board.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {symbols.map(s => (
                <div
                  key={s._key}
                  className="flex items-center gap-2.5 p-2 rounded-xl border border-warm-200 bg-warm-50/50"
                >
                  <img
                    src={s.isCustom ? s.imageUrl : getSymbolImageUrl(s.symbolId)}
                    alt={s.label}
                    className="w-9 h-9 object-contain flex-shrink-0 bg-white rounded-lg border border-warm-100"
                    onError={e => { e.target.style.visibility = 'hidden' }}
                  />
                  <input
                    value={s.label}
                    onChange={e => updateSymbol(s._key, { label: e.target.value })}
                    className={`flex-1 min-w-0 border rounded-lg px-2.5 py-2 text-sm font-sans text-warm-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      s.label.trim() ? 'border-warm-200' : 'border-red-300'
                    }`}
                  />
                  <select
                    value={s.wordType || 'none'}
                    onChange={e => updateSymbol(s._key, { wordType: e.target.value })}
                    className="flex-shrink-0 border border-warm-200 rounded-lg px-2 py-2 text-xs font-sans text-warm-700 focus:outline-none focus:ring-2 focus:ring-teal-500 max-w-[110px]"
                  >
                    {WORD_TYPE_OPTIONS.map(wt => (
                      <option key={wt} value={wt}>{WORD_TYPES[wt]?.label || 'None'}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setDeleteKey(s._key)}
                    aria-label={`Delete ${s.label}`}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-warm-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {hasEmptyLabel && (
            <p className="text-red-500 text-xs mt-3">Every symbol needs a label — clear one to remove it instead.</p>
          )}
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-warm-200 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl border border-warm-200 text-warm-600 font-sans font-semibold text-sm hover:bg-warm-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 py-2.5 rounded-xl bg-teal-500 text-white font-sans font-semibold text-sm hover:bg-teal-600 disabled:opacity-40 transition-colors"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {symbolPendingDelete && (
        <ConfirmDialog
          title="Delete this symbol?"
          message={`"${symbolPendingDelete.label}" will be removed from this board once you save changes.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteKey(null)}
        />
      )}
    </div>
  )
}
