import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { getProfileLog } from '../../store/logStore'
import { computeInsights } from '../../engine/insightsEngine'
import { getGapAlerts } from '../../engine/gapDetector'
import { getJournalEntries } from '../../store/journalStore'
import { getStoredCoachCard } from '../../services/geminiCoach'

export default function OverviewTab() {
  const { state } = useApp()
  const { activeProfileId, activeProfile, boards } = state

  const [insights, setInsights]   = useState(null)
  const [gapAlerts, setGapAlerts] = useState([])
  const [lastMood, setLastMood]   = useState(null)
  const [coachCard, setCoachCard] = useState(null)

  useEffect(() => {
    if (!activeProfileId) return
    async function load() {
      const log = await getProfileLog(activeProfileId)
      setInsights(computeInsights(log))
      setGapAlerts(getGapAlerts(activeProfileId, boards))
      const entries = getJournalEntries(activeProfileId)
      setLastMood(entries[0]?.moodSymbol || null)
      setCoachCard(getStoredCoachCard(activeProfileId))
    }
    load()
  }, [activeProfileId])

  if (!insights) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-warm-400 text-sm font-sans">Loading...</div>
      </div>
    )
  }

  const trend = insights.totalThisWeek - insights.totalLastWeek

  return (
    <div className="flex-1 overflow-y-auto bg-warm-50">
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* Header */}
        <div>
          <h2 className="font-display font-bold text-warm-900 text-xl leading-none">Overview</h2>
          <p className="font-sans text-warm-400 text-xs mt-1">
            {activeProfile?.name}'s week at a glance
          </p>
        </div>

        {/* Sentence count — hero stat */}
        <div className="bg-white rounded-xl p-5 border border-warm-200 shadow-subtle">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-sans text-warm-400 text-xs mb-1">Sentences this week</div>
              <div className="font-mono font-bold text-warm-900" style={{ fontSize: '2.8rem', lineHeight: 1 }}>
                {insights.totalThisWeek}
              </div>
            </div>
            <div className={`text-xs font-sans font-semibold px-3 py-1.5 rounded-xl mb-1 ${
              trend > 0 ? 'bg-teal-50 text-teal-600' :
              trend < 0 ? 'bg-red-50 text-red-500' :
              'bg-warm-100 text-warm-500'
            }`}>
              {trend > 0 ? `↑ ${trend} more` : trend < 0 ? `↓ ${Math.abs(trend)} fewer` : '— same'} than last week
            </div>
          </div>
        </div>

        {/* 2-col quick stats */}
        <div className="grid grid-cols-2 gap-3">

          {/* Last mood */}
          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
            <div className="font-sans text-warm-400 text-xs mb-2">Last journal mood</div>
            {lastMood ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{lastMood.emoji || '📝'}</span>
                <span className="font-sans font-semibold text-warm-800 text-sm capitalize">{lastMood.label}</span>
              </div>
            ) : (
              <div className="font-sans text-warm-400 text-sm">No entry yet</div>
            )}
          </div>

          {/* Gap alerts */}
          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
            <div className="font-sans text-warm-400 text-xs mb-2">Vocabulary gaps</div>
            {gapAlerts.length > 0 ? (
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-500" style={{ fontSize: '1.8rem', lineHeight: 1 }}>
                  {gapAlerts.length}
                </span>
                <span className="font-sans text-warm-500 text-xs leading-tight">
                  board{gapAlerts.length !== 1 ? 's' : ''}<br />with gaps
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <span className="font-sans text-warm-600 text-sm">No gaps</span>
              </div>
            )}
          </div>

          {/* Peak time */}
          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
            <div className="font-sans text-warm-400 text-xs mb-1">Peak time</div>
            <div className="font-display font-bold text-warm-900 text-xl mt-1">{insights.peakTime}</div>
            <div className="font-sans text-warm-400 text-xs mt-0.5">most active</div>
          </div>

          {/* Longest sentence */}
          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
            <div className="font-sans text-warm-400 text-xs mb-1">Longest sentence</div>
            <div className="font-mono font-bold text-warm-900" style={{ fontSize: '1.8rem', lineHeight: 1.1 }}>
              {insights.longestSentence}
            </div>
            <div className="font-sans text-warm-400 text-xs mt-0.5">symbols in one go</div>
          </div>

        </div>

        {/* Coach card status */}
        <div className={`rounded-xl p-4 border ${coachCard ? 'bg-teal-50 border-teal-100' : 'bg-warm-100 border-warm-200'}`}>
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">🎓</span>
            <div className="flex-1 min-w-0">
              <div className="font-sans font-semibold text-warm-800 text-sm">
                {coachCard ? 'AI coach card ready' : 'Coach card not yet generated'}
              </div>
              {coachCard?.priority && (
                <div className="font-sans text-warm-500 text-xs mt-1 leading-relaxed">
                  Priority: {coachCard.priority}
                </div>
              )}
              {!coachCard && (
                <div className="font-sans text-warm-400 text-xs mt-1">
                  Open Insights to generate this week's coaching advice
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New vocab preview */}
        {insights.newVocab.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">🌱</span>
              <span className="font-sans font-semibold text-warm-700 text-sm">New words this week</span>
              <span className="ml-auto font-mono text-teal-500 font-bold text-sm">{insights.newVocab.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {insights.newVocab.slice(0, 10).map((word, i) => (
                <span key={word + i} className="inline-flex items-center px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium border border-teal-100">
                  {word}
                </span>
              ))}
              {insights.newVocab.length > 10 && (
                <span className="text-xs text-warm-400 self-center">+{insights.newVocab.length - 10} more</span>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
