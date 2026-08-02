import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import * as api from '../../api'
import { updateProfileSettings } from '../../store/profileStore'
import { deleteBoard } from '../../store/boardStore'
import PageHeader from '../shared/PageHeader'
import CategoryIcon, { CATEGORY_META } from '../shared/CategoryIcon'
import AddBoardModal from './AddBoardModal'

function randomPin() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0')
}

export default function BoardEditorTab() {
  const { state, dispatch } = useApp()
  const { activeProfile, activeProfileId, boards } = state
  const settings = activeProfile?.settings || {}

  const [newUsername, setNewUsername] = useState(activeProfile?.username || '')
  const [usernameError, setUsernameError] = useState(null)
  const [resettingPin, setResettingPin] = useState(false)
  const [pendingPin, setPendingPin] = useState(randomPin())
  const [revealedPin, setRevealedPin] = useState(null)
  const [addingBoard, setAddingBoard] = useState(false)

  async function updateSetting(key, value) {
    await updateProfileSettings(activeProfileId, { [key]: value })
    dispatch({ type: 'REFRESH_ACTIVE_PROFILE' })
  }

  function handleBoardCreated() {
    setAddingBoard(false)
    dispatch({ type: 'REFRESH_BOARDS' })
  }

  async function handleDeleteBoard(boardId) {
    if (!confirm('Delete this board?')) return
    await deleteBoard(activeProfileId, boardId)
    dispatch({ type: 'REFRESH_BOARDS' })
  }

  async function handleSaveUsername() {
    setUsernameError(null)
    try {
      await api.updateProfile(activeProfileId, { username: newUsername.trim().toLowerCase() })
      dispatch({ type: 'REFRESH_ACTIVE_PROFILE' })
    } catch (err) {
      setUsernameError(err.message)
    }
  }

  async function confirmPinReset() {
    await api.updateProfile(activeProfileId, { pin: pendingPin })
    setRevealedPin(pendingPin)
    setResettingPin(false)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-warm-50">
      <div className="max-w-5xl mx-auto px-8 py-8">

        <PageHeader
          title="Settings"
          subtitle="Communicator login, display, and accessibility settings for the communication board"
        />

        {/* Communicator login */}
        <div className="bg-white rounded-2xl border border-warm-200 shadow-subtle p-5 mb-5">
          <div className="mb-4">
            <span className="font-sans font-semibold text-warm-700 text-lg">Communicator login</span>
          </div>

          <label className="block font-sans font-semibold text-warm-700 text-base mb-2">Username</label>
          <div className="flex gap-2 mb-1">
            <input
              className="flex-1 border border-warm-200 rounded-xl px-4 py-2.5 font-sans text-warm-900 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            />
            <button
              onClick={handleSaveUsername}
              disabled={!newUsername.trim() || newUsername === activeProfile?.username}
              className="px-4 py-2.5 rounded-xl bg-teal-500 text-white font-sans font-semibold text-base hover:bg-teal-600 disabled:opacity-40 transition-colors"
            >
              Save
            </button>
          </div>
          {usernameError && <p className="text-sm font-sans text-red-500 mb-2">{usernameError}</p>}

          <div className="border-t border-warm-100 mt-4 pt-4">
            <label className="block font-sans font-semibold text-warm-700 text-base mb-2">PIN</label>
            {revealedPin && (
              <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 mb-3">
                <div className="font-sans text-teal-700 text-xs mb-1">New PIN — write it down, it won't be shown again</div>
                <div className="font-display font-bold text-teal-900 text-xl tracking-[0.3em]">{revealedPin}</div>
              </div>
            )}
            {resettingPin ? (
              <div className="flex items-center gap-2">
                <input
                  className="border border-warm-200 rounded-xl px-4 py-2.5 font-sans text-warm-900 text-lg text-center tracking-[0.4em] w-32 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={pendingPin}
                  onChange={e => setPendingPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                />
                <button
                  onClick={confirmPinReset}
                  disabled={!/^\d{4}$/.test(pendingPin)}
                  className="px-4 py-2.5 rounded-xl bg-teal-500 text-white font-sans font-semibold text-base hover:bg-teal-600 disabled:opacity-40 transition-colors"
                >
                  Confirm reset
                </button>
                <button
                  onClick={() => setResettingPin(false)}
                  className="px-4 py-2.5 rounded-xl border border-warm-200 text-warm-600 font-sans text-base hover:bg-warm-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setPendingPin(randomPin()); setResettingPin(true); setRevealedPin(null) }}
                className="px-4 py-2.5 rounded-xl border border-warm-200 text-warm-600 font-sans font-semibold text-base hover:border-teal-400 hover:text-teal-600 transition-colors"
              >
                Reset PIN
              </button>
            )}
          </div>
        </div>

        {/* Symbol size + Font size — side by side */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div className="bg-white rounded-2xl p-5 border border-warm-200 shadow-subtle">
            <label className="block font-sans font-semibold text-warm-700 text-base mb-3">
              Symbol size
            </label>
            <div className="flex gap-2">
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  onClick={() => updateSetting('symbolSize', size)}
                  className={`flex-1 py-2.5 rounded-xl text-base font-medium border-2 transition-all capitalize ${
                    settings.symbolSize === size
                      ? 'bg-teal-500 text-white border-teal-500 shadow-subtle'
                      : 'border-warm-200 text-warm-600 hover:border-teal-300 hover:text-teal-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-warm-200 shadow-subtle">
            <label className="block font-sans font-semibold text-warm-700 text-base mb-3">
              Symbol label size
            </label>
            <div className="flex gap-2">
              {[10, 12, 14, 16].map(size => (
                <button
                  key={size}
                  onClick={() => updateSetting('fontSize', size)}
                  className={`flex-1 py-2.5 rounded-xl text-base font-medium border-2 transition-all ${
                    settings.fontSize === size
                      ? 'bg-teal-500 text-white border-teal-500 shadow-subtle'
                      : 'border-warm-200 text-warm-600 hover:border-teal-300 hover:text-teal-600'
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid columns */}
        <div className="bg-white rounded-2xl p-5 border border-warm-200 shadow-subtle mb-5">
          <label className="block font-sans font-semibold text-warm-700 text-base mb-3">
            Grid columns
            <span className="ml-2 font-mono text-teal-500 font-bold">{settings.gridColumns || 4}</span>
          </label>
          <input
            type="range" min="3" max="6" step="1"
            value={settings.gridColumns || 4}
            onChange={e => updateSetting('gridColumns', parseInt(e.target.value))}
            className="w-full accent-teal-500"
          />
          <div className="flex justify-between text-sm text-warm-400 mt-1 font-mono">
            <span>3</span><span>4</span><span>5</span><span>6</span>
          </div>
        </div>

        {/* Accessibility toggles */}
        <div className="bg-white rounded-2xl border border-warm-200 shadow-subtle overflow-hidden mb-5">
          <div className="px-5 py-3.5 border-b border-warm-100">
            <span className="font-sans font-semibold text-warm-700 text-base">Accessibility</span>
          </div>
          {[
            { key: 'highContrast',         label: 'High contrast mode',    desc: 'Dark backgrounds, high visibility' },
            { key: 'wideSpacing',           label: 'Wide button spacing',   desc: 'More space between symbols' },
            { key: 'adaptiveLayoutEnabled', label: 'Adaptive layout (AI)',  desc: 'Auto-reorder by usage frequency' },
          ].map(({ key, label, desc }, i, arr) => (
            <div
              key={key}
              className={`flex items-center justify-between px-5 py-3.5 hover:bg-warm-50 transition-colors ${i < arr.length - 1 ? 'border-b border-warm-100' : ''}`}
            >
              <div>
                <div className="font-sans font-medium text-warm-800 text-base">{label}</div>
                <div className="font-sans text-warm-400 text-sm mt-0.5">{desc}</div>
              </div>
              <button
                onClick={() => updateSetting(key, !settings[key])}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${settings[key] ? 'bg-teal-500' : 'bg-warm-200'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${settings[key] ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Boards */}
        <div className="bg-white rounded-2xl border border-warm-200 shadow-subtle overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-warm-100">
            <span className="font-sans font-semibold text-warm-700 text-base">Boards</span>
            <button
              onClick={() => setAddingBoard(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add board
            </button>
          </div>
          {boards.map((board, i) => {
            const meta = CATEGORY_META[board.category] || CATEGORY_META.custom
            return (
            <div
              key={board.id}
              className={`flex items-center justify-between px-5 py-3.5 hover:bg-warm-50 transition-colors ${i < boards.length - 1 ? 'border-b border-warm-100' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: meta.bg }}
                >
                  <CategoryIcon category={board.category} className="w-[18px] h-[18px]" />
                </div>
                <span className="font-sans font-medium text-warm-800 text-base">{board.name}</span>
              </div>
              {board.category !== 'emergency' && (
                <button
                  onClick={() => handleDeleteBoard(board.id)}
                  className="text-sm text-warm-400 hover:text-red-500 transition-colors font-medium"
                >
                  Delete
                </button>
              )}
            </div>
            )
          })}
        </div>

      </div>

      {addingBoard && (
        <AddBoardModal
          profileId={activeProfileId}
          existingCategories={new Set(boards.map(b => b.category))}
          onClose={() => setAddingBoard(false)}
          onCreated={handleBoardCreated}
        />
      )}
    </div>
  )
}
