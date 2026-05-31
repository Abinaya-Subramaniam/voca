import { useApp } from '../../context/AppContext'

const BOARD_ICONS = {
  home:      '🏠',
  feelings:  '💛',
  food:      '🍎',
  school:    '📚',
  emergency: '🆘',
  custom:    '⭐',
}

export default function BoardTabBar({ onSwitch }) {
  const { state, dispatch } = useApp()
  const { boards, activeBoardId } = state

  function handleSwitch(boardId) {
    dispatch({ type: 'SET_ACTIVE_BOARD', boardId })
    onSwitch && onSwitch(boardId)
  }

  return (
    <div className="flex gap-1.5 px-3 pt-2 pb-2 bg-white border-b border-warm-200 overflow-x-auto flex-shrink-0">
      {boards.map(board => {
        const isActive = activeBoardId === board.id
        const icon = BOARD_ICONS[board.category] || BOARD_ICONS.custom
        return (
          <button
            key={board.id}
            onClick={() => handleSwitch(board.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
              font-sans font-500 whitespace-nowrap transition-all flex-shrink-0
              ${isActive
                ? 'bg-teal-500 text-white shadow-subtle'
                : 'text-warm-600 hover:bg-warm-100 hover:text-warm-900'
              }
            `}
          >
            <span className="text-base leading-none">{icon}</span>
            <span>{board.name}</span>
          </button>
        )
      })}
    </div>
  )
}