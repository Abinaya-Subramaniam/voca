export default function CoachCard({ card }) {
  return (
    <div className="bg-white rounded-xl border border-warm-200 shadow-subtle overflow-hidden">

      {/* Header */}
      <div className="bg-teal-500 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">🎓</span>
        </div>
        <div>
          <div className="font-display font-bold text-white text-sm leading-none">
            Vocabulary Coach
          </div>
          <div className="font-sans text-teal-100 text-xs mt-0.5">
            Powered by Gemini AI · Updated this week
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* Summary */}
        <p className="font-sans text-warm-700 text-sm leading-relaxed">
          {card.summary}
        </p>

        {/* Strength */}
        <div className="bg-teal-50 rounded-xl p-3 border border-teal-100">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm">✅</span>
            <div className="font-sans font-semibold text-teal-700 text-xs uppercase tracking-wide">
              Strength
            </div>
          </div>
          <p className="font-sans text-teal-800 text-sm leading-relaxed">
            {card.strength}
          </p>
        </div>

        {/* Priority */}
        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm">🎯</span>
            <div className="font-sans font-semibold text-amber-700 text-xs uppercase tracking-wide">
              Priority this week
            </div>
          </div>
          <p className="font-sans text-amber-800 text-sm leading-relaxed">
            {card.priority}
          </p>
        </div>

        {/* Suggestions */}
        <div>
          <div className="font-sans font-semibold text-warm-600 text-xs uppercase tracking-wide mb-2">
            Suggested vocabulary
          </div>
          <div className="flex flex-wrap gap-2">
            {card.suggestions?.map(word => (
              <span
                key={word}
                className="inline-flex items-center px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium border border-teal-100 whitespace-nowrap"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Reasoning */}
        <div className="bg-warm-50 rounded-xl p-3 border border-warm-200">
          <div className="font-sans font-semibold text-warm-500 text-xs uppercase tracking-wide mb-1">
            Why these words
          </div>
          <p className="font-sans text-warm-600 text-xs leading-relaxed">
            {card.reasoning}
          </p>
        </div>

      </div>
    </div>
  )
}