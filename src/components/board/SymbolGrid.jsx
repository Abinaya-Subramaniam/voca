import SymbolCard from './SymbolCard'
import { useApp } from '../../context/AppContext'
import { writeTapEntry } from '../../services/db'
import { recordTap } from '../../engine/predictionEngine'

export default function SymbolGrid({ board, onSymbolTap }) {
  const { state, dispatch } = useApp()
  const { activeProfileId, activeProfile, sentenceBuffer } = state

  const symbolSize = activeProfile?.settings?.symbolSize || 'medium'

  const sortedSymbols = board
    ? [...board.symbols].sort((a, b) => a.position - b.position)
    : []

  async function handleTap(symbol) {
    const previousLabel = sentenceBuffer.length > 0
      ? sentenceBuffer[sentenceBuffer.length - 1].label
      : null

    dispatch({ type: 'ADD_TO_SENTENCE', symbol })
    onSymbolTap && onSymbolTap(symbol)

    recordTap(activeProfileId, previousLabel, symbol.label)

    await writeTapEntry({
      id: 'tap_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      profileId: activeProfileId,
      boardId: board.id,
      symbolId: symbol.symbolId,
      label: symbol.label,
      timestamp: new Date().toISOString()
    })
  }

  if (!board) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        No board selected
      </div>
    )
  }

  return (
    <div
      className="flex-1 p-3 overflow-y-auto"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${board.gridColumns}, minmax(0, 1fr))`,
        gap: activeProfile?.settings?.wideSpacing ? '10px' : '6px',
        alignContent: 'start',
      }}
    >
      {sortedSymbols.map((symbol) => (
        <SymbolCard
          key={symbol.symbolId + '_' + symbol.position}
          symbol={symbol}
          onTap={handleTap}
          symbolSize={symbolSize}
        />
      ))}

      {sortedSymbols.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 text-gray-300"
          style={{ gridColumn: '1 / -1' }}
        >
          <span className="text-5xl mb-3">＋</span>
          <span className="text-sm">No symbols yet. Add some in Settings.</span>
        </div>
      )}
    </div>
  )
}