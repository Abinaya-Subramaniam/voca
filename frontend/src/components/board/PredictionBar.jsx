import { useQuery } from '@tanstack/react-query'
import { useApp } from '../../context/AppContext'
import { getPredictions } from '../../engine/predictionEngine'

export default function PredictionBar({ onPredict }) {
  const { state } = useApp()
  const { sentenceBuffer, activeProfileId, activeBoardId, boards } = state

  const lastLabel = sentenceBuffer.length > 0
    ? sentenceBuffer[sentenceBuffer.length - 1].label
    : null

  const { data: predictions = [] } = useQuery({
    queryKey: ['predictions', activeProfileId, lastLabel],
    queryFn: () => getPredictions(activeProfileId, lastLabel, 3),
    enabled: !!activeProfileId,
    placeholderData: prev => prev,
  })

  function findSymbol(label) {
    const board = boards.find(b => b.id === activeBoardId)
    if (!board) return null
    return board.symbols.find(
      s => s.label.toLowerCase() === label.toLowerCase()
    ) || null
  }

  if (predictions.length === 0) return null

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-teal-50 via-teal-50/60 to-transparent border-b border-warm-200/70 flex-shrink-0">
      <span className="flex items-center gap-1 text-xs font-sans font-bold text-teal-600 uppercase tracking-wider flex-shrink-0">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
        Next
      </span>
      <div className="flex gap-2 overflow-x-auto">
        {predictions.map(label => {
          const symbol = findSymbol(label)
          return (
            <button
              key={label}
              onClick={() => onPredict(
                symbol || { symbolId: null, label, imageUrl: null, isCustom: false }
              )}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-warm-200 hover:border-teal-500 hover:bg-teal-50 transition-all text-[15px] font-sans font-semibold text-warm-700 hover:text-teal-700 shadow-subtle whitespace-nowrap flex-shrink-0 active:scale-95"
            >
              {symbol?.symbolId && (
                <img
                  src={`https://static.arasaac.org/pictograms/${symbol.symbolId}/${symbol.symbolId}_300.png`}
                  alt={label}
                  className="w-6 h-6 object-contain"
                  onError={e => { e.target.style.display = 'none' }}
                />
              )}
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
