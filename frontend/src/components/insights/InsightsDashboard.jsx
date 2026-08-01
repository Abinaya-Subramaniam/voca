import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApp } from '../../context/AppContext'
import * as api from '../../api'
import PageHeader from '../shared/PageHeader'
import CoachCard from './CoachCard'
import GapAlert from './GapAlert'

export default function InsightsDashboard() {
  const { state } = useApp()
  const { activeProfileId, activeProfile } = state
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
      <div className="flex-1 flex items-center justify-center bg-warm-50">
        <div className="text-warm-400 text-base font-sans">Loading insights...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-warm-50">
      <div className="max-w-5xl mx-auto px-8 py-8">

        <PageHeader
          title="Vocab Coach"
          subtitle={`This week's coaching and vocabulary insights for ${activeProfile?.name || 'them'}`}
        />

        {/* Coach card */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[12.5px] font-sans text-warm-400">
              Powered by AI
            </span>
            {coachCard && !loadingCoach && (
              <button
                onClick={() => refreshCoach.mutate()}
                disabled={refreshCoach.isPending}
                className="ml-auto text-[12.5px] font-sans text-warm-400 hover:text-teal-500 transition-colors disabled:opacity-50"
              >
                {refreshCoach.isPending ? 'Refreshing...' : '↻ Refresh'}
              </button>
            )}
          </div>

          {loadingCoach && (
            <div className="bg-white rounded-2xl p-8 border border-warm-200 shadow-subtle text-center">
              <div className="text-2xl mb-2">🤔</div>
              <div className="font-sans text-base text-warm-500">
                Analysing communication patterns...
              </div>
              <div className="font-sans text-sm text-warm-400 mt-1">
                This takes a few seconds
              </div>
            </div>
          )}

          {coachError && (
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <div className="font-sans text-base font-medium text-amber-700 mb-1">
                Could not load coach card
              </div>
              <div className="font-sans text-sm text-amber-600 font-mono break-all mb-3">
                {coachError}
              </div>
              <button
                onClick={() => loadCoachCard()}
                className="text-sm font-sans font-semibold text-amber-700 underline hover:text-amber-900 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {coachCard && !loadingCoach && <CoachCard card={coachCard} />}

          {!loadingCoach && !coachCard && !coachError && (
            <div className="bg-warm-100 rounded-2xl p-6 border border-warm-200 text-center">
              <div className="font-sans text-base text-warm-500">
                Coaching will appear once there is communication data this week
              </div>
            </div>
          )}
        </div>

        {/* Vocabulary gaps */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔍</span>
            <span className="font-sans font-semibold text-warm-700 text-base">
              Vocabulary gaps detected
            </span>
            {gapAlerts.length > 0 && (
              <span className="text-[12.5px] font-sans text-warm-400 ml-auto">
                {gapAlerts.length} {gapAlerts.length === 1 ? 'board needs' : 'boards need'} attention
              </span>
            )}
          </div>

          {gapAlerts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gapAlerts.map((alert, i) => (
                <GapAlert key={i} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="bg-warm-100 rounded-2xl p-6 border border-warm-200 text-center">
              <div className="text-xl mb-1">✅</div>
              <div className="font-sans text-base text-warm-500">
                No vocabulary gaps right now — nice work!
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
