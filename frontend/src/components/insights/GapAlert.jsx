export default function GapAlert({ alert }) {
  return (
    <div className="bg-white rounded-xl border border-warm-200 shadow-subtle overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-base">⚠️</span>
        </div>
        <div className="flex-1">
          <div className="font-sans font-semibold text-warm-800 text-base mb-0.5">
            {alert.boardName} board
          </div>
          <p className="font-sans text-warm-500 text-sm leading-relaxed mb-3">
            Browsed {alert.signalCount} times this week without finding a needed word.
            Currently has {alert.existingSymbolCount} symbols.
          </p>
          {alert.suggestedAdditions?.length > 0 && (
            <div>
              <div className="font-sans text-warm-400 text-[13px] font-medium mb-1.5">
                Consider adding:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {alert.suggestedAdditions.map((word, i) => (
                  <span
                    key={word + i}
                    className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-100 whitespace-nowrap"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}