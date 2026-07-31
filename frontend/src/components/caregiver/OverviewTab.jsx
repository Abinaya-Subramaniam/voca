import { useQuery } from '@tanstack/react-query'
import { useApp } from '../../context/AppContext'
import * as api from '../../api'
import PageHeader from '../shared/PageHeader'

function SproutIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 20h10" />
      <path d="M12 20v-8" />
      <path d="M12 12c0-3 2-5 6-5 0 4-2 6-6 6" />
      <path d="M12 12c0-2.5-1.7-4.2-5-4.2 0 3.3 1.7 5 5 5" />
    </svg>
  )
}
function ClipboardIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6M9 15h6" />
    </svg>
  )
}
function EyeIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
function BarChartIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="6" y1="20" x2="6" y2="14" /><line x1="12" y1="20" x2="12" y2="9" /><line x1="18" y1="20" x2="18" y2="4" />
    </svg>
  )
}
function SearchIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.2" y2="16.2" />
    </svg>
  )
}
function CheckIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function NoteIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
    </svg>
  )
}

const HOW_TO_STEPS = [
  { Icon: ClipboardIcon, title: 'Set up boards', desc: 'Customize symbols by topic in Board Editor — feelings, food, school, and more.' },
  { Icon: EyeIcon, title: "Watch, don't correct", desc: 'Let your child explore freely. Model the symbol yourself instead of correcting their choice.' },
  { Icon: BarChartIcon, title: 'Check Insights weekly', desc: 'See which topics come up most and generate a personalised AI coaching card.' },
  { Icon: SearchIcon, title: 'Act on gap alerts', desc: 'When Voca flags a vocabulary gap, add that symbol to the board within a day.' },
]

function greetingWord() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

function StatCard({ label, value, valueColor, trend, note }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-warm-200 shadow-subtle min-w-0">
      <div className="font-sans text-warm-400 text-xs sm:text-sm font-medium mb-2 truncate">{label}</div>
      <div className={`font-mono font-bold leading-none text-3xl sm:text-[2.3rem] ${valueColor || 'text-warm-900'}`}>
        {value}
      </div>
      {trend !== undefined ? (
        <div className={`text-xs sm:text-sm font-sans font-semibold mt-2.5 ${
          trend > 0 ? 'text-semantic-success' : trend < 0 ? 'text-semantic-error' : 'text-warm-400'
        }`}>
          {trend > 0 ? `↑ ${trend} more` : trend < 0 ? `↓ ${Math.abs(trend)} fewer` : '— same'} vs last week
        </div>
      ) : (
        <div className="text-xs sm:text-sm font-sans text-warm-400 mt-2.5 capitalize truncate">{note}</div>
      )}
    </div>
  )
}

export default function OverviewTab() {
  const { state } = useApp()
  const { activeProfileId, activeProfile } = state

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
  const { data: journalMoods = [] } = useQuery({
    queryKey: ['journalMoods', activeProfileId],
    queryFn: () => api.listJournalMoods(activeProfileId),
    enabled: !!activeProfileId,
  })
  const lastMood = journalMoods[0]?.moodSymbol || null

  if (!insights) {
    return (
      <div className="flex-1 flex items-center justify-center bg-warm-50">
        <div className="text-warm-400 text-base font-sans">Loading...</div>
      </div>
    )
  }

  const trend = insights.totalThisWeek - insights.totalLastWeek

  return (
    <div className="flex-1 overflow-y-auto bg-warm-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        <PageHeader
          title="Overview"
          subtitle={`Good ${greetingWord()}! Here's how ${activeProfile?.name || 'they'} are doing this week.`}
        />

        {/* ── Stat row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
          <StatCard label="Sentences this week" value={insights.totalThisWeek} trend={trend} />
          <StatCard label="Longest sentence" value={insights.longestSentence} note="symbols in one go" />
          <StatCard
            label="Vocabulary gaps"
            value={gapAlerts.length > 0 ? gapAlerts.length : <CheckIcon className="w-8 h-8" />}
            valueColor={gapAlerts.length > 0 ? 'text-amber-500' : 'text-teal-500'}
            note={gapAlerts.length > 0 ? 'need attention' : 'all clear'}
          />
          <StatCard
            label="Last mood"
            value={lastMood?.emoji || <NoteIcon className="w-8 h-8 text-warm-300" />}
            note={lastMood?.label || 'no mood yet'}
          />
        </div>

        {/* ── New vocab ── */}
        {insights.newVocab.length > 0 && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-warm-200 shadow-subtle mb-6 lg:mb-8">
            <div className="flex items-center gap-2 mb-3">
              <SproutIcon className="w-4 h-4 text-teal-600" />
              <span className="font-sans font-semibold text-warm-700 text-sm sm:text-base">New words this week</span>
              <span className="ml-auto font-mono text-teal-500 font-bold text-base">{insights.newVocab.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {insights.newVocab.slice(0, 10).map((word, i) => (
                <span key={word + i} className="inline-flex items-center px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium border border-teal-100">
                  {word}
                </span>
              ))}
              {insights.newVocab.length > 10 && (
                <span className="text-sm text-warm-400 self-center">+{insights.newVocab.length - 10} more</span>
              )}
            </div>
          </div>
        )}

        {/* ── How to get the most from Voca ── */}
        <div>
          <div className="font-sans font-semibold text-warm-700 text-sm sm:text-base mb-3">
            How to get the most from Voca
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_TO_STEPS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-warm-200 shadow-subtle p-4 sm:p-5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-3">
                  <step.Icon className="w-5 h-5" />
                </div>
                <div className="font-sans font-semibold text-warm-800 text-sm sm:text-base">{step.title}</div>
                <div className="font-sans text-warm-400 text-sm mt-1 leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
