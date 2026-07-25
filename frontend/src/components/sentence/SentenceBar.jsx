import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { speak } from '../../services/speechService'
import { logSentence } from '../../store/logStore'
import { getSymbolImageUrl } from '../../services/symbolService'

export default function SentenceBar() {
  const { state, dispatch } = useApp()
  const { sentenceBuffer, activeProfileId, activeBoardId } = state
  const [speaking, setSpeaking] = useState(false)

  const sentenceText = sentenceBuffer.map(s => s.label).join(' ')

  async function handleSpeak() {
    if (!sentenceText || speaking) return
    setSpeaking(true)
    speak(sentenceText, () => setSpeaking(false))
    if (sentenceBuffer.length > 0) {
      await logSentence(
        activeProfileId,
        activeBoardId,
        sentenceBuffer.map(s => s.label),
        sentenceText
      )
    }
  }

  function handleClear() {
    dispatch({ type: 'CLEAR_SENTENCE' })
  }

  function handleBackspace() {
    dispatch({ type: 'REMOVE_LAST_SYMBOL' })
  }

  return (
    <div className="bg-white border-b border-warm-200 flex-shrink-0 shadow-subtle">
      <div className="flex items-stretch" style={{ minHeight: '80px' }}>

        {/* Symbol chips */}
        <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 overflow-x-auto">
          {sentenceBuffer.length === 0 ? (
            <span className="font-sans text-warm-400 text-base select-none">
              Tap symbols to build a sentence...
            </span>
          ) : (
            sentenceBuffer.map((symbol, i) => (
              <div
                key={i}
                className="chip-in flex flex-col items-center flex-shrink-0 bg-teal-50 border border-teal-100 rounded-xl px-2.5 py-1.5 min-w-[58px] max-w-[70px]"
              >
                {symbol.imageUrl ? (
                  <img src={symbol.imageUrl} alt={symbol.label}
                    className="w-9 h-9 object-contain" />
                ) : symbol.symbolId ? (
                  <img
                    src={getSymbolImageUrl(symbol.symbolId)}
                    alt={symbol.label}
                    className="w-9 h-9 object-contain"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div className="w-9 h-9 flex items-center justify-center">
                    <span className="text-base text-teal-600">
                      {symbol.label.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-[11.5px] font-sans font-semibold text-teal-700 mt-0.5 leading-none text-center w-full truncate">
                  {symbol.label}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Controls */}
        <div className="flex items-stretch flex-shrink-0 border-l border-warm-200">
          {sentenceBuffer.length > 0 && (
            <button
              onClick={handleBackspace}
              className="px-3.5 text-warm-400 hover:bg-warm-100 hover:text-warm-700 transition-colors text-lg font-sans"
              title="Remove last word"
            >
              ⌫
            </button>
          )}
          {sentenceBuffer.length > 0 && (
            <button
              onClick={handleClear}
              className="px-4 text-sm font-sans font-semibold text-warm-500 hover:bg-warm-100 transition-colors border-l border-warm-200"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleSpeak}
            disabled={!sentenceText}
            className={`
              px-6 font-display font-bold text-base text-white
              flex items-center gap-2 transition-all border-l border-teal-700
              disabled:opacity-40 disabled:cursor-not-allowed
              active:scale-95
            `}
            style={{
              background: speaking
                ? 'linear-gradient(135deg, #238A72, #1A6B58)'
                : 'linear-gradient(135deg, #34AB92, #1F7A65)',
              boxShadow: sentenceText ? '0 2px 12px rgba(45,155,131,0.35)' : 'none',
            }}
          >
            {speaking ? (
              <span className="flex items-end gap-0.5 h-4">
                {[0, 150, 300].map(delay => (
                  <span
                    key={delay}
                    className="speak-bar w-0.5 h-full bg-white rounded-full block"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </span>
            ) : (
              <span className="text-lg">🔊</span>
            )}
            <span>{speaking ? 'Speaking' : 'Speak'}</span>
          </button>
        </div>

      </div>
    </div>
  )
}