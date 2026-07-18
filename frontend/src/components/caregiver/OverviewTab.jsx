import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApp } from '../../context/AppContext'
import * as api from '../../api'
import PageHeader from '../shared/PageHeader'

const AWARENESS_CARDS = [
  {
    tag: 'Did you know?',
    tagColor: '#2D9B83',
    bg: '#E8F7F4',
    border: '#B8E8DF',
    headline: '1 in 4 autistic individuals\nnever develops functional speech',
    body: 'AAC tools like Voca give non-verbal individuals a real voice — often for the first time. Early access changes life outcomes.',
    icon: '💬',
  },
  {
    tag: 'Research insight',
    tagColor: '#7A5010',
    bg: '#FDF3E0',
    border: '#F5DFA0',
    headline: 'AAC does not delay speech —\nit accelerates it',
    body: 'Decades of research confirm that introducing AAC early reduces communication frustration and actually speeds up natural speech development.',
    icon: '📈',
  },
  {
    tag: 'Caregiver tip',
    tagColor: '#2D9B83',
    bg: '#E8F7F4',
    border: '#B8E8DF',
    headline: 'Model the symbols yourself',
    body: 'The #1 strategy: point to symbols on Voca as you speak. This teaches your child how — without pressure or correction.',
    icon: '🌱',
  },
  {
    tag: 'Sri Lanka',
    tagColor: '#C0392B',
    bg: '#FDECEA',
    border: '#F5C6C2',
    headline: '1 speech therapist per\n222,000 people in Sri Lanka',
    body: 'The global average is 1 per 10,000. Voca is built to bridge this gap — giving every child access to structured AAC support, free.',
    icon: '🇱🇰',
  },
  {
    tag: 'Communication milestone',
    tagColor: '#7A5010',
    bg: '#FDF3E0',
    border: '#F5DFA0',
    headline: 'Multi-symbol sentences\nare a massive leap',
    body: 'When a child combines 2+ symbols ("want" + "cookie"), it signals growing language understanding. Every combination is worth celebrating.',
    icon: '🎯',
  },
  {
    tag: 'How Voca works',
    tagColor: '#2D9B83',
    bg: '#E8F7F4',
    border: '#B8E8DF',
    headline: 'Three things Voca does\nautomatically for you',
    body: '① Learns which symbols are used most and moves them forward. ② Spots missing vocabulary and alerts you. ③ Generates weekly AI coaching from real data.',
    icon: '⚡',
  },
]

const HOW_TO_STEPS = [
  { icon: '📋', title: 'Set up boards', desc: 'Customise symbols by topic in Board Editor — feelings, food, school, and more.' },
  { icon: '👀', title: "Watch, don't correct", desc: 'Let your child explore freely. Model the symbol yourself instead of correcting their choice.' },
  { icon: '📊', title: 'Check Insights weekly', desc: 'See which topics come up most and generate a personalised AI coaching card.' },
  { icon: '🔍', title: 'Act on gap alerts', desc: 'When Voca flags a vocabulary gap, add that symbol to the board within a day.' },
]

function greetingWord() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

function StatCard({ label, value, valueColor, trend, note }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-warm-200 shadow-subtle">
      <div className="font-sans text-warm-400 text-sm font-medium mb-2">{label}</div>
      <div className={`font-mono font-bold leading-none ${valueColor || 'text-warm-900'}`} style={{ fontSize: '2.3rem' }}>
        {value}
      </div>
      {trend !== undefined ? (
        <div className={`text-sm font-sans font-semibold mt-2.5 ${
          trend > 0 ? 'text-semantic-success' : trend < 0 ? 'text-semantic-error' : 'text-warm-400'
        }`}>
          {trend > 0 ? `↑ ${trend} more` : trend < 0 ? `↓ ${Math.abs(trend)} fewer` : '— same'} vs last week
        </div>
      ) : (
        <div className="text-sm font-sans text-warm-400 mt-2.5 capitalize">{note}</div>
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
      <div className="max-w-5xl mx-auto px-8 py-8">

        <PageHeader
          title="Overview"
          subtitle={`Good ${greetingWord()}! Here's how ${activeProfile?.name || 'they'} are doing this week.`}
        />

        {/* ── Stat row ── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Sentences this week" value={insights.totalThisWeek} trend={trend} />
          <StatCard label="Longest sentence" value={insights.longestSentence} note="symbols in one go" />
          <StatCard
            label="Vocabulary gaps"
            value={gapAlerts.length > 0 ? gapAlerts.length : '✓'}
            valueColor={gapAlerts.length > 0 ? 'text-amber-500' : 'text-teal-500'}
            note={gapAlerts.length > 0 ? 'need attention' : 'all clear'}
          />
          <StatCard
            label="Last mood"
            value={lastMood?.emoji || '📝'}
            note={lastMood?.label || 'no mood yet'}
          />
        </div>

        {/* ── Awareness carousel + How-to steps ── */}
        <div className="grid grid-cols-3 gap-5 mb-6">

          <div className="col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <div className="font-sans font-semibold text-warm-700 text-base">Awareness &amp; insights</div>
              <div className="flex gap-1.5 items-center">
                {AWARENESS_CARDS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCardIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === cardIdx ? 'bg-teal-500 w-5' : 'bg-warm-300 w-1.5'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div
              className="flex-1 rounded-2xl p-5 border transition-colors duration-500"
              style={{ background: card.bg, borderColor: card.border }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span
                    className="inline-block text-sm font-sans font-semibold px-2.5 py-1 rounded-lg mb-3"
                    style={{ color: card.tagColor, background: 'rgba(255,255,255,0.65)' }}
                  >
                    {card.tag}
                  </span>
                  <div
                    className="font-display font-bold text-warm-900 mb-2 leading-snug"
                    style={{ fontSize: '1.3rem', whiteSpace: 'pre-line' }}
                  >
                    {card.headline}
                  </div>
                  <p className="font-sans text-warm-600 text-base leading-relaxed">{card.body}</p>
                </div>
                <div className="text-4xl flex-shrink-0 mt-1">{card.icon}</div>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setCardIdx(i => (i - 1 + AWARENESS_CARDS.length) % AWARENESS_CARDS.length)}
                className="flex-1 py-2 rounded-xl border border-warm-200 bg-white text-warm-500 text-base font-sans hover:border-teal-300 hover:text-teal-600 transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCardIdx(i => (i + 1) % AWARENESS_CARDS.length)}
                className="flex-1 py-2 rounded-xl border border-warm-200 bg-white text-warm-500 text-base font-sans hover:border-teal-300 hover:text-teal-600 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="col-span-1 bg-white rounded-2xl border border-warm-200 shadow-subtle p-5">
            <div className="font-sans font-semibold text-warm-700 text-base mb-4">How to get the most from Voca</div>
            <div className="space-y-4">
              {HOW_TO_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-warm-50 border border-warm-200 flex items-center justify-center flex-shrink-0 text-lg">
                    {step.icon}
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-warm-800 text-sm">{step.title}</div>
                    <div className="font-sans text-warm-400 text-[13.5px] mt-0.5 leading-relaxed">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Coach card + New vocab ── */}
        <div className="grid grid-cols-2 gap-5">
          <div className={`rounded-2xl p-5 border ${insights.newVocab.length === 0 ? 'col-span-2' : ''} ${coachCard ? 'bg-teal-50 border-teal-100' : 'bg-warm-100 border-warm-200'}`}>
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">🎓</span>
              <div className="flex-1 min-w-0">
                <div className="font-sans font-semibold text-warm-800 text-base">
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
            <div className="bg-white rounded-2xl p-5 border border-warm-200 shadow-subtle">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">🌱</span>
                <span className="font-sans font-semibold text-warm-700 text-base">New words this week</span>
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
    </div>
  )
}
