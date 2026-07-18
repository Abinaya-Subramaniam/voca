import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { getProfileLog } from '../../store/logStore'
import { computeInsights } from '../../engine/insightsEngine'
import { getGapAlerts } from '../../engine/gapDetector'
import { getJournalEntries } from '../../store/journalStore'
import { getStoredCoachCard } from '../../services/geminiCoach'

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
  { icon: '📋', title: 'Set up boards', desc: 'Go to Board Editor to customise symbols by topic — feelings, food, school, and more.' },
  { icon: '👀', title: 'Watch, don\'t correct', desc: 'Let your child explore freely. Model the symbol yourself instead of correcting their choice.' },
  { icon: '📊', title: 'Check Insights weekly', desc: 'See which topics they communicate most about and generate a personalised AI coaching card.' },
  { icon: '🔍', title: 'Act on gap alerts', desc: 'When Voca flags a vocabulary gap, add that symbol to the board within a day for best results.' },
]

export default function OverviewTab() {
  const { state } = useApp()
  const { activeProfileId, activeProfile, boards } = state

  const [insights, setInsights]     = useState(null)
  const [gapAlerts, setGapAlerts]   = useState([])
  const [lastMood, setLastMood]     = useState(null)
  const [coachCard, setCoachCard]   = useState(null)
  const [cardIdx, setCardIdx]       = useState(0)

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

  useEffect(() => {
    const t = setInterval(() => setCardIdx(i => (i + 1) % AWARENESS_CARDS.length), 5000)
    return () => clearInterval(t)
  }, [])

  if (!insights) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-warm-400 text-sm font-sans">Loading...</div>
      </div>
    )
  }

  const trend = insights.totalThisWeek - insights.totalLastWeek
  const card  = AWARENESS_CARDS[cardIdx]

  return (
    <div className="flex-1 overflow-y-auto bg-warm-50">
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">

        {/* ── Hero ── */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-5 text-white shadow-md">
          <div className="text-[13.5px] font-sans opacity-75 mb-0.5">Good to see you 👋</div>
          <div className="font-display font-bold leading-tight mb-4" style={{ fontSize: '1.5rem' }}>
            {activeProfile?.name}'s week at a glance
          </div>
          <div className="flex items-end gap-4">
            <div>
              <div className="font-mono font-bold leading-none" style={{ fontSize: '3rem' }}>
                {insights.totalThisWeek}
              </div>
              <div className="text-[13.5px] font-sans opacity-80 mt-1">sentences this week</div>
            </div>
            <div className={`text-[13.5px] font-sans font-semibold px-3 py-1.5 rounded-xl ${
              trend > 0 ? 'bg-white/20' : trend < 0 ? 'bg-red-400/30' : 'bg-white/10'
            }`}>
              {trend > 0 ? `↑ ${trend} more` : trend < 0 ? `↓ ${Math.abs(trend)} fewer` : '— same'} than last week
            </div>
          </div>
        </div>

        {/* ── Quick stats ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 border border-warm-200 shadow-subtle text-center">
            <div className="font-mono font-bold text-warm-900 text-xl">{insights.longestSentence}</div>
            <div className="text-[13.5px] font-sans text-warm-400 mt-0.5 leading-tight">longest<br/>sentence</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-warm-200 shadow-subtle text-center">
            <div className={`font-mono font-bold text-xl ${gapAlerts.length > 0 ? 'text-amber-500' : 'text-teal-500'}`}>
              {gapAlerts.length > 0 ? gapAlerts.length : '✓'}
            </div>
            <div className="text-[13.5px] font-sans text-warm-400 mt-0.5 leading-tight">vocab<br/>gaps</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-warm-200 shadow-subtle text-center">
            <div className="text-xl">{lastMood?.emoji || '📝'}</div>
            <div className="text-[13.5px] font-sans text-warm-400 mt-0.5 leading-tight capitalize">
              {lastMood?.label || 'no mood yet'}
            </div>
          </div>
        </div>

        {/* ── Awareness carousel ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="font-sans font-semibold text-warm-700 text-sm">Awareness &amp; insights</div>
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
            className="rounded-2xl p-5 border transition-colors duration-500"
            style={{ background: card.bg, borderColor: card.border }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span
                  className="inline-block text-[13.5px] font-sans font-semibold px-2.5 py-1 rounded-lg mb-3"
                  style={{ color: card.tagColor, background: 'rgba(255,255,255,0.65)' }}
                >
                  {card.tag}
                </span>
                <div
                  className="font-display font-bold text-warm-900 mb-2 leading-snug"
                  style={{ fontSize: '1.05rem', whiteSpace: 'pre-line' }}
                >
                  {card.headline}
                </div>
                <p className="font-sans text-warm-600 text-sm leading-relaxed">{card.body}</p>
              </div>
              <div className="text-4xl flex-shrink-0 mt-1">{card.icon}</div>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setCardIdx(i => (i - 1 + AWARENESS_CARDS.length) % AWARENESS_CARDS.length)}
              className="flex-1 py-2 rounded-xl border border-warm-200 bg-white text-warm-500 text-sm font-sans hover:border-teal-300 hover:text-teal-600 transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setCardIdx(i => (i + 1) % AWARENESS_CARDS.length)}
              className="flex-1 py-2 rounded-xl border border-warm-200 bg-white text-warm-500 text-sm font-sans hover:border-teal-300 hover:text-teal-600 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        {/* ── How to use ── */}
        <div className="bg-white rounded-2xl border border-warm-200 shadow-subtle p-5">
          <div className="font-sans font-semibold text-warm-700 text-sm mb-4">How to get the most from Voca</div>
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

        {/* ── Coach card ── */}
        <div className={`rounded-xl p-4 border ${coachCard ? 'bg-teal-50 border-teal-100' : 'bg-warm-100 border-warm-200'}`}>
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">🎓</span>
            <div className="flex-1 min-w-0">
              <div className="font-sans font-semibold text-warm-800 text-sm">
                {coachCard ? 'AI coach card ready' : 'Coach card not yet generated'}
              </div>
              {coachCard?.priority && (
                <div className="font-sans text-warm-500 text-[13.5px] mt-1 leading-relaxed">
                  {coachCard.priority}
                </div>
              )}
              {!coachCard && (
                <div className="font-sans text-warm-400 text-[13.5px] mt-1">
                  Open Insights to generate this week's coaching advice
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── New vocab ── */}
        {insights.newVocab.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-subtle">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">🌱</span>
              <span className="font-sans font-semibold text-warm-700 text-sm">New words this week</span>
              <span className="ml-auto font-mono text-teal-500 font-bold text-sm">{insights.newVocab.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {insights.newVocab.slice(0, 10).map((word, i) => (
                <span key={word + i} className="inline-flex items-center px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-[13.5px] font-medium border border-teal-100">
                  {word}
                </span>
              ))}
              {insights.newVocab.length > 10 && (
                <span className="text-[13.5px] text-warm-400 self-center">+{insights.newVocab.length - 10} more</span>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
