import { getSymbolImageUrl, resolveSymbolId } from '../../services/symbolService'
import { useState, useEffect } from 'react'

const SIZE_MAP = {
  small:  { card: 'min-h-[72px] p-1.5',  img: 'w-10 h-10', text: 'text-[10px]' },
  medium: { card: 'min-h-[92px] p-2',    img: 'w-14 h-14', text: 'text-xs'     },
  large:  { card: 'min-h-[112px] p-2.5', img: 'w-16 h-16', text: 'text-sm'     },
}

export default function SymbolCard({ symbol, onTap, symbolSize = 'medium' }) {
  const [imgError, setImgError]   = useState(false)
  const [tapped, setTapped]       = useState(false)
  const [resolvedUrl, setResolvedUrl] = useState(null)

  const s = SIZE_MAP[symbolSize] || SIZE_MAP.medium

  const primaryUrl = symbol.isCustom
    ? symbol.imageUrl
    : getSymbolImageUrl(symbol.symbolId)

  const displayUrl = resolvedUrl || primaryUrl

  // If primary URL fails, search ARASAAC by label
  useEffect(() => {
    if (imgError && !symbol.isCustom && symbol.label) {
      resolveSymbolId(symbol.label).then(id => {
        if (id) setResolvedUrl(getSymbolImageUrl(id))
      })
    }
  }, [imgError, symbol.label, symbol.isCustom])

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
        bg-white border-[1.5px] border-warm-200
        hover:border-teal-500 hover:bg-teal-50
        transition-all duration-100 cursor-pointer select-none
        shadow-subtle hover:shadow-raised
        ${tapped ? 'scale-95 bg-teal-100 border-teal-500 shadow-none' : ''}
      `}
    >
      {displayUrl && !imgError ? (
        <img
          src={displayUrl}
          alt={symbol.label}
          className={`${s.img} object-contain flex-shrink-0`}
          onError={() => {
            if (resolvedUrl) return
            setImgError(true)
          }}
          draggable={false}
        />
      ) : resolvedUrl ? (
        <img
          src={resolvedUrl}
          alt={symbol.label}
          className={`${s.img} object-contain flex-shrink-0`}
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
        className={`${s.text} font-sans font-medium text-warm-900 text-center leading-tight w-full px-0.5`}
        style={{ fontSize: 'var(--symbol-font-size)' }}
      >
        {symbol.label}
      </span>
    </button>
  )
}