import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import PredictionBar from './PredictionBar'
import { CATEGORY_CARDS, WORD_TYPES } from '../../data/defaultBoards'
import { markTappedOnBoard } from '../../engine/gapDetector'
import { getSymbolImageUrl } from '../../services/symbolService'

const CATEGORY_ICON_BY_ID = Object.fromEntries(CATEGORY_CARDS.map(c => [c.category, c.icon]))

const LEGEND = [
  { color: 'bg-orange-300', label: 'Pronoun'    },
  { color: 'bg-green-300',  label: 'Action'     },
  { color: 'bg-yellow-300', label: 'Thing'      },
  { color: 'bg-blue-300',   label: 'Descriptor' },
  { color: 'bg-pink-300',   label: 'Social'     },
]

function SymbolCardWithType({ symbol, onTap, symbolSize = 'medium' }) {
  const [imgError, setImgError] = useState(false)
  const [tapped, setTapped]     = useState(false)

  const wordType = WORD_TYPES[symbol.wordType] || WORD_TYPES.none

  const SIZE_MAP = {
    small:  { card: 'min-h-[80px] p-2',    img: 'w-12 h-12', text: 'text-[11.5px]' },
    medium: { card: 'min-h-[104px] p-2.5', img: 'w-16 h-16', text: 'text-sm'       },
    large:  { card: 'min-h-[132px] p-3',   img: 'w-20 h-20', text: 'text-base'     },
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
        symbol-card flex flex-col items-center justify-center gap-1.5
        w-full ${s.card} rounded-2xl
        ${wordType.bg} border-[1.5px] ${wordType.border}
        hover:brightness-95 hover:shadow-raised hover:-translate-y-0.5 active:scale-95 active:translate-y-0
        transition-all duration-150 cursor-pointer select-none
        shadow-subtle
        ${tapped ? 'scale-95 shadow-none translate-y-0' : ''}
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
  const { state } = useApp()
  const { boards, activeBoardId, activeProfile } = state

  const rootBoard    = boards.find(b => b.isRoot === true || b.category === 'home') || boards[0]
  const currentBoard = boards.find(b => b.id === activeBoardId) || rootBoard
  const isAtRoot      = currentBoard?.id === rootBoard?.id

  function handleSymbolTap(symbol) {
    markTappedOnBoard()
    onSymbolTap && onSymbolTap(symbol)
  }

  const columns = currentBoard?.gridColumns || 4
  const symbolSize = activeProfile?.settings?.symbolSize || 'medium'
  const wideSpacing = activeProfile?.settings?.wideSpacing
  const gap = wideSpacing ? '12px' : '8px'

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Board header */}
      <div className="flex items-center gap-2.5 px-6 py-3 bg-white border-b border-warm-200 flex-shrink-0">
        <span className="font-sans font-bold text-warm-800 text-base flex items-center gap-1.5">
          {isAtRoot ? (
            <>🏠 Home</>
          ) : (
            <>{CATEGORY_ICON_BY_ID[currentBoard?.category] || '⭐'} {currentBoard?.name}</>
          )}
        </span>

        {/* Colour legend */}
        <div className="flex items-center gap-2.5 ml-auto">
          {LEGEND.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-[11px] font-sans font-medium text-warm-500 hidden lg:block">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction bar */}
      <PredictionBar onPredict={onPredict} />

      {/* Scrollable content — centered, with breathing room on both sides */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-4xl mx-auto">
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
        </div>
      </div>
    </div>
  )
}
