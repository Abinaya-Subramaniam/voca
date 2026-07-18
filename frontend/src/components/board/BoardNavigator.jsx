import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import CategoryCard from './CategoryCard'
import PredictionBar from './PredictionBar'
import { CATEGORY_CARDS, WORD_TYPES } from '../../data/defaultBoards'
import { markTappedOnBoard, startBrowseTimer } from '../../engine/gapDetector'
import { getSymbolImageUrl } from '../../services/symbolService'

function SymbolCardWithType({ symbol, onTap, symbolSize = 'medium' }) {
  const [imgError, setImgError] = useState(false)
  const [tapped, setTapped]     = useState(false)

  const wordType = WORD_TYPES[symbol.wordType] || WORD_TYPES.none

  const SIZE_MAP = {
    small:  { card: 'min-h-[72px] p-1.5',  img: 'w-10 h-10', text: 'text-[10px]' },
    medium: { card: 'min-h-[92px] p-2',    img: 'w-14 h-14', text: 'text-xs'     },
    large:  { card: 'min-h-[112px] p-2.5', img: 'w-16 h-16', text: 'text-sm'     },
  }
  const s = SIZE_MAP[symbolSize] || SIZE_MAP.medium

  const imageUrl = symbol.isCustom
    ? symbol.imageUrl
    : getSymbolImageUrl(symbol.symbolId)

  function handleTap() {
    setTapped(true)
    setTimeout(() => setTapped(false), 150)
    onTap(symbol)
  }

  return (
    <button
      onClick={handleTap}
      className={`
        symbol-card flex flex-col items-center justify-center gap-1
        w-full ${s.card} rounded-xl
        ${wordType.bg} border-[1.5px] ${wordType.border}
        hover:brightness-95 active:scale-95
        transition-all duration-100 cursor-pointer select-none
        shadow-subtle
        ${tapped ? 'scale-95 shadow-none' : ''}
      `}
    >
      {!imgError ? (
        <img
          src={imageUrl}
          alt={symbol.label}
          className={`${s.img} object-contain flex-shrink-0`}
          onError={() => setImgError(true)}
          draggable={false}
        />
      ) : (
        <div className={`${s.img} flex items-center justify-center bg-warm-100 rounded-lg flex-shrink-0`}>
          <span className="text-xl text-warm-600">
            {symbol.label.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <span
        className={`${s.text} font-sans font-medium text-center leading-tight w-full px-0.5 ${wordType.text}`}
        style={{ fontSize: 'var(--symbol-font-size)' }}
      >
        {symbol.label}
      </span>
    </button>
  )
}

export default function BoardNavigator({ onSymbolTap, onPredict }) {
  const { state, dispatch } = useApp()
  const { boards, activeBoardId, activeProfileId, activeProfile } = state

  const [currentBoardId, setCurrentBoardId] = useState(null)

  useEffect(() => {
    if (boards.length > 0 && !currentBoardId) {
      const root = boards.find(b => b.isRoot === true || b.category === 'home') || boards[0]
      setCurrentBoardId(root.id)
    }
  }, [boards])

  const rootBoard    = boards.find(b => b.isRoot === true || b.category === 'home') || boards[0]
  const currentBoard = currentBoardId
    ? (boards.find(b => b.id === currentBoardId) || rootBoard)
    : rootBoard
  const isAtRoot     = currentBoard?.id === rootBoard?.id

  function handleCategoryTap(category) {
    // Find the actual board by category name, not hardcoded ID
    const board = boards.find(b => b.category === category)
    if (!board) return
    setCurrentBoardId(board.id)
    dispatch({ type: 'SET_ACTIVE_BOARD', boardId: board.id })
    if (activeProfileId) startBrowseTimer(activeProfileId, board.id)
  }

  function handleBack() {
    setCurrentBoardId(rootBoard.id)
    dispatch({ type: 'SET_ACTIVE_BOARD', boardId: rootBoard.id })
    if (activeProfileId) startBrowseTimer(activeProfileId, rootBoard.id)
  }

  function handleSymbolTap(symbol) {
    markTappedOnBoard()
    onSymbolTap && onSymbolTap(symbol)
  }

  const columns = currentBoard?.gridColumns || 4
  const symbolSize = activeProfile?.settings?.symbolSize || 'medium'
  const wideSpacing = activeProfile?.settings?.wideSpacing
  const gap = wideSpacing ? '10px' : '6px'

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Board header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-warm-200 flex-shrink-0">
        {!isAtRoot && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warm-100 hover:bg-warm-200 transition-colors flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            <span className="text-xs font-sans font-semibold text-warm-700">Back</span>
          </button>
        )}
        <span className="font-sans font-semibold text-warm-600 text-sm">
          {isAtRoot ? 'Communication Board' : currentBoard?.name}
        </span>

        {/* Colour legend */}
        <div className="flex items-center gap-2 ml-auto">
          {[
            { color: 'bg-orange-300', label: 'Pronoun'    },
            { color: 'bg-green-300',  label: 'Action'     },
            { color: 'bg-yellow-300', label: 'Thing'      },
            { color: 'bg-blue-300',   label: 'Descriptor' },
            { color: 'bg-pink-300',   label: 'Social'     },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1 flex-shrink-0">
              <span className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-[9px] font-sans text-warm-400 hidden md:block">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction bar */}
      <PredictionBar onPredict={onPredict} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-3">

        {/* Symbol grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap,
            alignContent: 'start',
          }}
        >
          {[...(currentBoard?.symbols || [])]
            .sort((a, b) => a.position - b.position)
            .map(symbol => (
              <SymbolCardWithType
                key={symbol.symbolId + '_' + symbol.position}
                symbol={symbol}
                onTap={handleSymbolTap}
                symbolSize={symbolSize}
              />
            ))
          }
        </div>

        {/* Category cards — shown at root level below core symbols */}
        {isAtRoot && (
          <div className="mt-5">
            <div className="text-[10px] font-sans font-semibold text-warm-400 uppercase tracking-wider mb-2">
              Categories
            </div>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORY_CARDS.map(cat => (
                <CategoryCard
                  key={cat.boardId}
                  category={cat}
                  onTap={handleCategoryTap}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}