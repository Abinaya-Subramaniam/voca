import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApp } from '../../context/AppContext'
import * as api from '../../api'
import CoachCard from './CoachCard'
import GapAlert from './GapAlert'

export default function InsightsDashboard() {
  const { state } = useApp()
  const { activeProfileId } = state
  const queryClient = useQueryClient()

  const { data: insights } = useQuery({
    queryKey: ['insights', activeProfileId],
    queryFn: () => api.getInsights(activeProfileId),
    enabled: !!activeProfileId,
  })
  const { data: gapAlerts = [] } = useQuery({
    queryKey: ['gapAlerts', activeProfileId],
    queryFn: () => api.getGapAlerts(activeProfileId),
    enabled: !!activeProfileId,
  })

  // Generates on first visit each week (server caches by ISO week), then serves
  // the stored card.
  const {
    data: coachCard = null,
    isFetching: loadingCoach,
    error: coachErrorObj,
  } = useQuery({
    queryKey: ['coach', activeProfileId],
    queryFn: () => api.generateCoachCard(activeProfileId),
    enabled: !!activeProfileId,
    staleTime: Infinity,
    retry: false,
  })
  const coachError = coachErrorObj?.message || null

  const refreshCoach = useMutation({
    mutationFn: () => api.generateCoachCard(activeProfileId, true),
    onSuccess: card => queryClient.setQueryData(['coach', activeProfileId], card),
  })

  function loadCoachCard() {
    queryClient.invalidateQueries({ queryKey: ['coach', activeProfileId] })
  }

  if (!insights) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-warm-400 text-sm font-sans">Loading insights...</div>
      </div>
    )
  }

  const trend      = insights.totalThisWeek - insights.totalLastWeek
  const trendLabel = trend > 0 ? `+${trend}` : trend < 0 ? `${trend}` : '—'
  const trendColor = trend > 0 ? 'text-semantic-success' : trend < 0 ? 'text-semantic-error' : 'text-warm-400'

  return (
    <div className="flex-1 overflow-y-auto bg-warm-50">
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-warm-900 text-xl leading-none">
              Weekly Insights
            </h2>
            <p className="font-sans text-warm-400 text-xs mt-1">
              Last 7 days of communication
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold flex-shrink-0"
            style={{ backgroundColor: state.activeProfile?.avatarColor || '#2D9B83' }}
          >
            {state.activeProfile?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-3">

          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
            <div className="font-sans text-warm-400 text-xs mb-1">Sentences this week</div>
            <div className="font-mono font-bold text-warm-900" style={{ fontSize: '2rem', lineHeight: 1 }}>
              {insights.totalThisWeek}
            </div>
            <div className={`font-sans text-xs font-medium mt-1.5 ${trendColor}`}>
              {trendLabel} vs last week
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
            <div className="font-sans text-warm-400 text-xs mb-1">New words this week</div>
            <div className="font-mono font-bold text-teal-500" style={{ fontSize: '2rem', lineHeight: 1 }}>
              {insights.newVocab.length}
            </div>
            <div className="font-sans text-warm-400 text-xs mt-1.5">used for first time</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
            <div className="font-sans text-warm-400 text-xs mb-1">Most active time</div>
            <div className="font-display font-bold text-warm-900 text-xl mt-1">
              {insights.peakTime}
            </div>
            <div className="font-sans text-warm-400 text-xs mt-1.5">peak communication</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
            <div className="font-sans text-warm-400 text-xs mb-1">Longest sentence</div>
            <div className="font-mono font-bold text-warm-900" style={{ fontSize: '2rem', lineHeight: 1 }}>
              {insights.longestSentence}
            </div>
            <div className="font-sans text-warm-400 text-xs mt-1.5">symbols in one go</div>
          </div>

        </div>

        {/* Coach card */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🎓</span>
            <span className="font-sans font-semibold text-warm-700 text-sm">
              AI Vocabulary Coach
            </span>
            <span className="text-[10px] font-sans text-warm-400 ml-auto">
              Powered by Gemini
            </span>
            {coachCard && !loadingCoach && (
              <button
                onClick={() => refreshCoach.mutate()}
                disabled={refreshCoach.isPending}
                className="text-[10px] font-sans text-warm-400 hover:text-teal-500 transition-colors disabled:opacity-50"
              >
                {refreshCoach.isPending ? 'Refreshing...' : '↻ Refresh'}
              </button>
            )}
          </div>

          {loadingCoach && (
            <div className="bg-white rounded-xl p-6 border border-warm-200 shadow-subtle text-center">
              <div className="text-2xl mb-2">🤔</div>
              <div className="font-sans text-sm text-warm-500">
                Analysing communication patterns...
              </div>
              <div className="font-sans text-xs text-warm-400 mt-1">
                This takes a few seconds
              </div>
            </div>
          )}

          {coachError && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="font-sans text-sm font-medium text-amber-700 mb-1">
                Could not load coach card
              </div>
              <div className="font-sans text-xs text-amber-600 font-mono break-all mb-3">
                {coachError}
              </div>
              <button
                onClick={() => loadCoachCard()}
                className="text-xs font-sans font-semibold text-amber-700 underline hover:text-amber-900 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {coachCard && !loadingCoach && <CoachCard card={coachCard} />}

          {!loadingCoach && !coachCard && !coachError && (
            <div className="bg-warm-100 rounded-xl p-4 border border-warm-200 text-center">
              <div className="font-sans text-sm text-warm-500">
                Coaching will appear once there is communication data this week
              </div>
            </div>
          )}
        </div>

        {/* New vocabulary */}
        {insights.newVocab.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🌱</span>
              <span className="font-sans font-semibold text-warm-700 text-sm">
                New vocabulary used
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {insights.newVocab.slice(0, 12).map((word, i) => (
                <span
                  key={word + i}
                  className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium border border-teal-100 whitespace-nowrap"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gap alerts */}
        {gapAlerts.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🔍</span>
              <span className="font-sans font-semibold text-warm-700 text-sm">
                Vocabulary gaps detected
              </span>
            </div>
            {gapAlerts.map((alert, i) => (
              <GapAlert key={i} alert={alert} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}