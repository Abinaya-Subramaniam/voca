import { useApp } from '../../context/AppContext'
import { updateProfileSettings } from '../../store/profileStore'
import { createBoard, deleteBoard } from '../../store/boardStore'

export default function SettingsPanel({ onClose }) {
  const { state, dispatch } = useApp()
  const { activeProfile, activeProfileId, boards } = state
  const settings = activeProfile?.settings || {}

  function updateSetting(key, value) {
    updateProfileSettings(activeProfileId, { [key]: value })
    dispatch({ type: 'SET_ACTIVE_PROFILE', profileId: activeProfileId })
  }

  function handleAddBoard() {
    const name = prompt('Board name:')
    if (!name?.trim()) return
    createBoard(activeProfileId, name.trim())
    dispatch({ type: 'REFRESH_BOARDS' })
  }

  function handleDeleteBoard(boardId) {
    if (!confirm('Delete this board?')) return
    deleteBoard(activeProfileId, boardId)
    dispatch({ type: 'REFRESH_BOARDS' })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-warm-900/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm-200 flex-shrink-0">
          <div>
            <h2 className="font-display font-bold text-warm-900 text-lg leading-none">Settings</h2>
            <p className="font-sans text-warm-400 text-xs mt-0.5">
              {activeProfile?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-warm-100 text-warm-400 hover:text-warm-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

          {/* Symbol size */}
          <div>
            <label className="block font-sans font-semibold text-warm-700 text-sm mb-2">
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
          <div>
            <label className="block font-sans font-semibold text-warm-700 text-sm mb-2">
              Grid columns
              <span className="ml-2 font-mono text-teal-500 font-bold">
                {settings.gridColumns || 4}
              </span>
            </label>
            <input
              type="range"
              min="3"
              max="6"
              step="1"
              value={settings.gridColumns || 4}
              onChange={e => updateSetting('gridColumns', parseInt(e.target.value))}
              className="w-full accent-teal-500"
            />
            <div className="flex justify-between text-xs text-warm-400 mt-1 font-mono">
              <span>3</span><span>4</span><span>5</span><span>6</span>
            </div>
          </div>

          {/* Font size */}
          <div>
            <label className="block font-sans font-semibold text-warm-700 text-sm mb-2">
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

          {/* Toggle switches */}
          <div>
            <label className="block font-sans font-semibold text-warm-700 text-sm mb-3">
              Accessibility
            </label>
            <div className="space-y-1">
              {[
                { key: 'highContrast',          label: 'High contrast mode',     desc: 'Dark backgrounds, high visibility' },
                { key: 'wideSpacing',            label: 'Wide button spacing',    desc: 'More space between symbols' },
                { key: 'adaptiveLayoutEnabled',  label: 'Adaptive layout (AI)',   desc: 'Auto-reorder by usage frequency' },
              ].map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-warm-50 transition-colors"
                >
                  <div>
                    <div className="font-sans font-medium text-warm-800 text-sm">{label}</div>
                    <div className="font-sans text-warm-400 text-xs mt-0.5">{desc}</div>
                  </div>
                  <button
                    onClick={() => updateSetting(key, !settings[key])}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-3 ${
                      settings[key] ? 'bg-teal-500' : 'bg-warm-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                        settings[key] ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-warm-200" />

          {/* Boards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-sans font-semibold text-warm-700 text-sm">
                Boards
              </label>
              <button
                onClick={handleAddBoard}
                className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add board
              </button>
            </div>
            <div className="space-y-1.5">
              {boards.map(board => (
                <div
                  key={board.id}
                  className="flex items-center justify-between px-3 py-2.5 bg-warm-50 rounded-xl border border-warm-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {{ home: '🏠', feelings: '💛', food: '🍎', school: '📚', emergency: '🆘', custom: '⭐' }[board.category] || '⭐'}
                    </span>
                    <span className="font-sans font-medium text-warm-800 text-sm">
                      {board.name}
                    </span>
                  </div>
                  {board.category !== 'emergency' && (
                    <button
                      onClick={() => handleDeleteBoard(board.id)}
                      className="text-xs text-warm-400 hover:text-semantic-error transition-colors font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-warm-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-teal-500 text-white rounded-xl font-display font-bold hover:bg-teal-600 active:scale-95 transition-all shadow-subtle"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  )
}