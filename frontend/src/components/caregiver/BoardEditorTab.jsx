import { useApp } from '../../context/AppContext'
import { updateProfileSettings } from '../../store/profileStore'
import { createBoard, deleteBoard } from '../../store/boardStore'

const BOARD_ICONS = { home: '🏠', feelings: '💛', food: '🍎', school: '📚', emergency: '🆘', custom: '⭐' }

export default function BoardEditorTab() {
  const { state, dispatch } = useApp()
  const { activeProfile, activeProfileId, boards } = state
  const settings = activeProfile?.settings || {}

  async function updateSetting(key, value) {
    await updateProfileSettings(activeProfileId, { [key]: value })
    dispatch({ type: 'REFRESH_ACTIVE_PROFILE' })
  }

  async function handleAddBoard() {
    const name = prompt('Board name:')
    if (!name?.trim()) return
    await createBoard(activeProfileId, name.trim())
    dispatch({ type: 'REFRESH_BOARDS' })
  }

  async function handleDeleteBoard(boardId) {
    if (!confirm('Delete this board?')) return
    await deleteBoard(activeProfileId, boardId)
    dispatch({ type: 'REFRESH_BOARDS' })
  }

  return (
    <div className="flex-1 overflow-y-auto bg-warm-50">
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-6">

        {/* Header */}
        <div>
          <h2 className="font-display font-bold text-warm-900 text-xl leading-none">Board Editor</h2>
          <p className="font-sans text-warm-400 text-[13.5px] mt-1">
            Display and accessibility settings for {activeProfile?.name}
          </p>
        </div>

        {/* Symbol size */}
        <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
          <label className="block font-sans font-semibold text-warm-700 text-sm mb-3">
            Symbol size
          </label>
          <div className="flex gap-2">
            {['small', 'medium', 'large'].map(size => (
              <button
                key={size}
                onClick={() => updateSetting('symbolSize', size)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all capitalize ${
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

        {/* Grid columns */}
        <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
          <label className="block font-sans font-semibold text-warm-700 text-sm mb-3">
            Grid columns
            <span className="ml-2 font-mono text-teal-500 font-bold">{settings.gridColumns || 4}</span>
          </label>
          <input
            type="range" min="3" max="6" step="1"
            value={settings.gridColumns || 4}
            onChange={e => updateSetting('gridColumns', parseInt(e.target.value))}
            className="w-full accent-teal-500"
          />
          <div className="flex justify-between text-[13.5px] text-warm-400 mt-1 font-mono">
            <span>3</span><span>4</span><span>5</span><span>6</span>
          </div>
        </div>

        {/* Font size */}
        <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
          <label className="block font-sans font-semibold text-warm-700 text-sm mb-3">
            Symbol label size
          </label>
          <div className="flex gap-2">
            {[10, 12, 14, 16].map(size => (
              <button
                key={size}
                onClick={() => updateSetting('fontSize', size)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
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

        {/* Accessibility toggles */}
        <div className="bg-white rounded-xl border border-warm-200 shadow-subtle overflow-hidden">
          <div className="px-4 py-3 border-b border-warm-100">
            <span className="font-sans font-semibold text-warm-700 text-sm">Accessibility</span>
          </div>
          {[
            { key: 'highContrast',         label: 'High contrast mode',    desc: 'Dark backgrounds, high visibility' },
            { key: 'wideSpacing',           label: 'Wide button spacing',   desc: 'More space between symbols' },
            { key: 'adaptiveLayoutEnabled', label: 'Adaptive layout (AI)',  desc: 'Auto-reorder by usage frequency' },
          ].map(({ key, label, desc }, i, arr) => (
            <div
              key={key}
              className={`flex items-center justify-between px-4 py-3 hover:bg-warm-50 transition-colors ${i < arr.length - 1 ? 'border-b border-warm-100' : ''}`}
            >
              <div>
                <div className="font-sans font-medium text-warm-800 text-sm">{label}</div>
                <div className="font-sans text-warm-400 text-[13.5px] mt-0.5">{desc}</div>
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
        <div className="bg-white rounded-xl border border-warm-200 shadow-subtle overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-warm-100">
            <span className="font-sans font-semibold text-warm-700 text-sm">Boards</span>
            <button
              onClick={handleAddBoard}
              className="flex items-center gap-1.5 text-[13.5px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add board
            </button>
          </div>
          {boards.map((board, i) => (
            <div
              key={board.id}
              className={`flex items-center justify-between px-4 py-3 hover:bg-warm-50 transition-colors ${i < boards.length - 1 ? 'border-b border-warm-100' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{BOARD_ICONS[board.category] || '⭐'}</span>
                <span className="font-sans font-medium text-warm-800 text-sm">{board.name}</span>
              </div>
              {board.category !== 'emergency' && (
                <button
                  onClick={() => handleDeleteBoard(board.id)}
                  className="text-[13.5px] text-warm-400 hover:text-red-500 transition-colors font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
