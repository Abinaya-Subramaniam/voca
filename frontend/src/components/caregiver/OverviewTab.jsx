import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApp } from '../../context/AppContext'
import * as api from '../../api'
import PageHeader from '../shared/PageHeader'

function MessageIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}
function TrendUpIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}
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
function MapPinIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function TargetIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}
function ZapIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="13 2 3 14 11 14 10 22 21 10 13 10 13 2" />
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
function GraduationCapIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 9.5 12 5l10 4.5-10 4.5-10-4.5z" />
      <path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
      <path d="M22 9.5V15" />
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
function ChevronIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

const AWARENESS_CARDS = [
  {
    tag: 'Did you know?',
    tagColor: '#2D9B83',
    bg: '#E8F7F4',
    border: '#B8E8DF',
    headline: '1 in 4 autistic individuals\nnever develops functional speech',
    body: 'AAC tools like Voca give non-verbal individuals a real voice — often for the first time. Early access changes life outcomes.',
    Icon: MessageIcon,
  },
  {
    tag: 'Research insight',
    tagColor: '#7A5010',
    bg: '#FDF3E0',
    border: '#F5DFA0',
    headline: 'AAC does not delay speech —\nit accelerates it',
    body: 'Decades of research confirm that introducing AAC early reduces communication frustration and actually speeds up natural speech development.',
    Icon: TrendUpIcon,
  },
  {
    tag: 'Caregiver tip',
    tagColor: '#2D9B83',
    bg: '#E8F7F4',
    border: '#B8E8DF',
    headline: 'Model the symbols yourself',
    body: 'The #1 strategy: point to symbols on Voca as you speak. This teaches your child how — without pressure or correction.',
    Icon: SproutIcon,
  },
  {
    tag: 'Sri Lanka',
    tagColor: '#C0392B',
    bg: '#FDECEA',
    border: '#F5C6C2',
    headline: '1 speech therapist per\n222,000 people in Sri Lanka',
    body: 'The global average is 1 per 10,000. Voca is built to bridge this gap — giving every child access to structured AAC support, free.',
    Icon: MapPinIcon,
  },
  {
    tag: 'Communication milestone',
    tagColor: '#7A5010',
    bg: '#FDF3E0',
    border: '#F5DFA0',
    headline: 'Multi-symbol sentences\nare a massive leap',
    body: 'When a child combines 2+ symbols ("want" + "cookie"), it signals growing language understanding. Every combination is worth celebrating.',
    Icon: TargetIcon,
  },
  {
    tag: 'How Voca works',
    tagColor: '#2D9B83',
    bg: '#E8F7F4',
    border: '#B8E8DF',
    headline: 'Three things Voca does\nautomatically for you',
    body: 'Learns which symbols are used most and moves them forward, spots missing vocabulary and alerts you, and generates weekly AI coaching from real data.',
    Icon: ZapIcon,
  },
]

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

  const [cardIdx, setCardIdx] = useState(0)

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
  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journal', activeProfileId],
    queryFn: () => api.listJournalEntries(activeProfileId),
    enabled: !!activeProfileId,
  })
  const { data: coachCard = null } = useQuery({
    queryKey: ['coach', activeProfileId],
    queryFn: () => api.getCoachCard(activeProfileId).catch(err => {
      if (err.status === 404) return null
      throw err
    }),
    enabled: !!activeProfileId,
  })
  const lastMood = journalEntries[0]?.moodSymbol || null

  useEffect(() => {
    const t = setInterval(() => setCardIdx(i => (i + 1) % AWARENESS_CARDS.length), 5000)
    return () => clearInterval(t)
  }, [])

  if (!insights) {
    return (
      <div className="flex-1 flex items-center justify-center bg-warm-50">
        <div className="text-warm-400 text-base font-sans">Loading...</div>
      </div>
    )
  }

  const trend = insights.totalThisWeek - insights.totalLastWeek
  const card  = AWARENESS_CARDS[cardIdx]

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

        {/* ── Awareness carousel + How-to steps ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start mb-6 lg:mb-8">

          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Awareness carousel */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2.5">
                <div className="font-sans font-semibold text-warm-700 text-sm sm:text-base">Awareness &amp; insights</div>
                <div className="flex gap-1.5 items-center">
                  {AWARENESS_CARDS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCardIdx(i)}
                      aria-label={`Show card ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === cardIdx ? 'bg-teal-500 w-5' : 'bg-warm-300 w-1.5'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div
                className="rounded-2xl p-4 sm:p-5 border transition-colors duration-500"
                style={{ background: card.bg, borderColor: card.border }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.65)', color: card.tagColor }}
                  >
                    <card.Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block text-xs sm:text-sm font-sans font-semibold px-2.5 py-1 rounded-lg mb-2.5"
                      style={{ color: card.tagColor, background: 'rgba(255,255,255,0.65)' }}
                    >
                      {card.tag}
                    </span>
                    <div
                      className="font-display font-bold text-warm-900 mb-2 leading-snug text-lg sm:text-[1.3rem]"
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      {card.headline}
                    </div>
                    <p className="font-sans text-warm-600 text-sm sm:text-base leading-relaxed">{card.body}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setCardIdx(i => (i - 1 + AWARENESS_CARDS.length) % AWARENESS_CARDS.length)}
                  aria-label="Previous card"
                  className="flex-1 flex items-center justify-center py-2 rounded-xl border border-warm-200 bg-white text-warm-500 hover:border-teal-300 hover:text-teal-600 transition-colors"
                >
                  <ChevronIcon className="w-4 h-4 rotate-180" />
                </button>
                <button
                  onClick={() => setCardIdx(i => (i + 1) % AWARENESS_CARDS.length)}
                  aria-label="Next card"
                  className="flex-1 flex items-center justify-center py-2 rounded-xl border border-warm-200 bg-white text-warm-500 hover:border-teal-300 hover:text-teal-600 transition-colors"
                >
                  <ChevronIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Coach card + New vocab — flows directly under the carousel,
                not gated on the how-to sidebar's height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className={`rounded-2xl p-4 sm:p-5 border ${insights.newVocab.length === 0 ? 'sm:col-span-2' : ''} ${coachCard ? 'bg-teal-50 border-teal-100' : 'bg-warm-100 border-warm-200'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${coachCard ? 'bg-white/70 text-teal-600' : 'bg-white text-warm-400'}`}>
                    <GraduationCapIcon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-sans font-semibold text-warm-800 text-sm sm:text-base">
                      {coachCard ? 'AI coach card ready' : 'Coach card not yet generated'}
                    </div>
                    {coachCard?.priority && (
                      <div className="font-sans text-warm-500 text-sm mt-1 leading-relaxed">
                        {coachCard.priority}
                      </div>
                    )}
                    {!coachCard && (
                      <div className="font-sans text-warm-400 text-sm mt-1">
                        Open Insights to generate this week's coaching advice
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {insights.newVocab.length > 0 && (
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-warm-200 shadow-subtle">
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
            </div>
          </div>

          <div className="lg:col-span-1 bg-white rounded-2xl border border-warm-200 shadow-subtle p-4 sm:p-5">
            <div className="font-sans font-semibold text-warm-700 text-sm sm:text-base mb-4">How to get the most from Voca</div>
            <div className="space-y-4">
              {HOW_TO_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-warm-50 border border-warm-200 flex items-center justify-center flex-shrink-0 text-teal-600">
                    <step.Icon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-sans font-semibold text-warm-800 text-sm">{step.title}</div>
                    <div className="font-sans text-warm-400 text-[13.5px] mt-0.5 leading-relaxed">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
