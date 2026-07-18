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
    <div className="flex items-center gap-2 px-3 py-1.5 bg-warm-100 border-b border-warm-200 flex-shrink-0">
      <span className="text-[10px] font-sans font-500 text-warm-400 uppercase tracking-wider flex-shrink-0">
        Next
      </span>
      <div className="flex gap-1.5 overflow-x-auto">
        {predictions.map(label => {
          const symbol = findSymbol(label)
          return (
            <button
              key={label}
              onClick={() => onPredict(
                symbol || { symbolId: null, label, imageUrl: null, isCustom: false }
              )}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-warm-200 hover:border-teal-500 hover:bg-teal-50 transition-all text-sm font-sans font-500 text-warm-700 hover:text-teal-700 shadow-subtle whitespace-nowrap flex-shrink-0 active:scale-95"
            >
              {symbol?.symbolId && (
                <img
                  src={`https://static.arasaac.org/pictograms/${symbol.symbolId}/${symbol.symbolId}_300.png`}
                  alt={label}
                  className="w-5 h-5 object-contain"
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
