import { Fragment, useState, useRef, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ProfileMenu from '../shared/ProfileMenu'

const FEATURE_ITEMS = [
  {
    icon: 'brain',
    screenshot: 'https://i.imgur.com/sm7w2s3.png',
    title: 'AI word prediction',
    desc: "Learns each person's unique communication patterns over time and predicts their next word as they build each sentence.",
  },
  {
    icon: 'bot',
    screenshot: 'https://i.imgur.com/VXuEczO.png',
    title: 'Agentic Voca Bot',
    desc: "Doesn't just chat. It takes action on its own, adding missing words and reorganising boards as usage changes.",
  },
  {
    icon: 'dual',
    screenshot: 'https://i.imgur.com/5LSj5fE.png',
    title: 'Two dashboards, one app',
    desc: 'Caregivers get a dashboard to manage boards and coaching, while each communicator logs into their own private, secure AAC board.',
  },
  {
    icon: 'layout',
    screenshot: 'https://i.imgur.com/ZPEtQT9.png',
    title: 'Auto-organizing boards',
    desc: 'Boards reorder themselves automatically based on real usage, so the most-used symbols are always easy to find.',
  },
  {
    icon: 'search',
    screenshot: 'https://i.imgur.com/GWYKTOM.png',
    title: 'Missing vocabulary alerts',
    desc: "Flags gaps in the vocabulary as they come up and suggests exactly which symbols to add next, no guesswork required.",
  },
  {
    icon: 'cap',
    screenshot: 'https://i.imgur.com/0bPuhoj.png',
    title: 'Weekly AI coaching',
    desc: 'Personalized AI guidance for caregivers every week, highlighting progress and practical next steps, like a speech therapist on call.',
  },
]

function FeatureIcon({ name, size = 26 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'brain':
      return (
        <svg {...p}>
          <path d="M9 4.5a2.5 2.5 0 0 0-2.5 2.5v.2A3 3 0 0 0 4 10v1a3 3 0 0 0 1.3 2.5A3 3 0 0 0 7 19a2.4 2.4 0 0 0 2 1V4.5Z" />
          <path d="M15 4.5a2.5 2.5 0 0 1 2.5 2.5v.2a3 3 0 0 1 2.5 3.3v1a3 3 0 0 1-1.3 2.5A3 3 0 0 1 17 19a2.4 2.4 0 0 1-2 1V4.5Z" />
        </svg>
      )
    case 'layout':
      return (
        <svg {...p}>
          <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
          <path d="M3.5 9.5h17" />
          <path d="M9 9.5V20" />
        </svg>
      )
    case 'search':
      return (
        <svg {...p}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M19.5 19.5 15 15" />
        </svg>
      )
    case 'cap':
      return (
        <svg {...p}>
          <path d="M2 9 12 4l10 5-10 5-10-5Z" />
          <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
          <path d="M21 9v6" />
        </svg>
      )
    case 'bot':
      return (
        <svg {...p}>
          <rect x="4.5" y="8.5" width="15" height="11" rx="3" />
          <path d="M12 8.5V5" />
          <circle cx="12" cy="3.5" r="1.3" fill="currentColor" stroke="none" />
          <path d="M9 13.5v1.5M15 13.5v1.5" />
          <path d="M2.5 12.5v3M21.5 12.5v3" />
        </svg>
      )
    case 'dual':
      return (
        <svg {...p}>
          <rect x="3.5" y="4" width="7.5" height="16" rx="2" />
          <rect x="13" y="4" width="7.5" height="16" rx="2" />
        </svg>
      )
    case 'sprout':
      return (
        <svg {...p}>
          <path d="M12 21V12" />
          <path d="M12 12C12 7.5 15 5 19 5c0 4.5-3 7-7 7Z" />
          <path d="M12 14c0-3.3-2.3-5.5-6-5.5 0 3.3 2.3 5.5 6 5.5Z" />
        </svg>
      )
    case 'message':
      return (
        <svg {...p}>
          <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 3.5V17H6a2 2 0 0 1-2-2Z" />
        </svg>
      )
    case 'user':
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c0-4 3.5-6.5 7-6.5s7 2.5 7 6.5" />
        </svg>
      )
    case 'infinity':
      return (
        <svg {...p}>
          <path d="M7 15a4 4 0 1 1 0-8c2.5 0 4 2 5 4s2.5 4 5 4a4 4 0 1 0 0-8c-2.5 0-4 2-5 4s-2.5 4-5 4Z" />
        </svg>
      )
    default:
      return null
  }
}

const WHO_ITEMS = [
  {
    icon: 'sprout',
    image: 'https://i.imgur.com/EoZmzC6.png',
    title: 'Young children',
    desc: 'Kids with autism or speech delays building their first words.',
  },
  {
    icon: 'message',
    image: 'https://i.imgur.com/ZzonT8E.png',
    title: 'Apraxia of speech',
    desc: 'People who know what to say but struggle to say it.',
  },
  {
    icon: 'user',
    image: 'https://i.imgur.com/vlATuB2.png',
    title: 'Non-verbal teens & adults',
    desc: 'Communicating through symbols instead of spoken words.',
  },
  {
    icon: 'infinity',
    image: 'https://i.imgur.com/4XlFqks.png',
    title: 'Every skill level',
    desc: 'From single symbols to full sentences, at any pace.',
  },
]

const COMPARISON_ROWS = [
  { feature: 'Word prediction',    typical: 'Static, generic word lists',              voca: 'Learns patterns in real time' },
  { feature: 'Board layout',       typical: 'Fixed grid, manual editing only',        voca: 'AI auto-reorders your board by real usage' },
  { feature: 'Missing vocabulary', typical: 'No signal when a word is missing',        voca: 'Flags gaps, suggests exactly what to add' },
  { feature: 'Coaching & guidance', typical: "None, you're on your own",              voca: 'Weekly AI coaching, built in' },
  { feature: 'Cost',               typical: '$50–150/hr for therapist consultations',  voca: 'Free. Always.' },
]

function renderWithAIEmphasis(text) {
  return text.split(/(AI)/g).map((part, i) =>
    part === 'AI'
      ? <strong key={i} style={{ fontWeight: 900, color: '#8CE0C8' }}>AI</strong>
      : part
  )
}

const BTN = {
  primary: {
    padding: '15px 34px', background: '#2D9B83', color: 'white',
    border: 'none', borderRadius: '12px', fontSize: '15.5px',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
    cursor: 'pointer', transition: 'all 0.15s',
  },
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Fades + slides a section up into place the first time it scrolls into view —
// skipped entirely for users who've asked for reduced motion.
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (visible) return
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

function FeatureSlider({ items }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setIndex(i => (i + 1) % items.length)
    }, 3000)
    return () => clearInterval(id)
  }, [paused, items.length])

  function go(i) { setIndex(((i % items.length) + items.length) % items.length) }
  function prev() { go(index - 1) }
  function next() { go(index + 1) }

  const item = items[index]

  const arrowBtn = {
    width: '38px', height: '38px', borderRadius: '999px', flexShrink: 0,
    background: 'white', border: '1.5px solid #E8E6E1', color: '#6B6860',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', boxShadow: '0 4px 14px rgba(44,42,38,0.10)', transition: 'all 0.15s',
  }
  function arrowHover(e) { e.currentTarget.style.borderColor = '#2D9B83'; e.currentTarget.style.color = '#2D9B83' }
  function arrowLeave(e) { e.currentTarget.style.borderColor = '#E8E6E1'; e.currentTarget.style.color = '#6B6860' }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]"
      style={{ gap: 'clamp(28px, 5vw, 56px)', alignItems: 'center', maxWidth: '1160px', margin: '0 auto' }}
    >
      <div key={`shot-${index}`} className="feature-slide" style={{ position: 'relative', padding: '18px 0' }}>
        <div style={{
          position: 'absolute', inset: '-10px', zIndex: 0,
          background: 'radial-gradient(circle at 50% 40%, rgba(45,155,131,0.28), transparent 70%)',
          filter: 'blur(36px)',
        }} />

        <div style={{
          position: 'relative', zIndex: 1, borderRadius: '24px', padding: '3px',
          background: 'linear-gradient(135deg, #2D9B83, #8CE0C8)',
          boxShadow: '0 30px 60px -14px rgba(44,42,38,0.22), 0 10px 24px rgba(44,42,38,0.10)',
        }}>
          <div style={{
            borderRadius: '21px', overflow: 'hidden', background: 'white', padding: '10px',
          }}>
            <div style={{
              borderRadius: '15px', overflow: 'hidden', background: '#F5F4F0',
              aspectRatio: '2 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {item.screenshot ? (
                <img
                  src={item.screenshot} alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{
                  width: '72px', height: '72px', borderRadius: '18px',
                  background: 'white', border: '1.5px solid #E8E6E1', color: '#2D9B83',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FeatureIcon name={item.icon} size={32} />
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={prev} aria-label="Previous feature"
          style={{ ...arrowBtn, position: 'absolute', top: '50%', left: '-19px', transform: 'translateY(-50%)', zIndex: 2 }}
          onMouseEnter={arrowHover} onMouseLeave={arrowLeave}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          onClick={next} aria-label="Next feature"
          style={{ ...arrowBtn, position: 'absolute', top: '50%', right: '-19px', transform: 'translateY(-50%)', zIndex: 2 }}
          onMouseEnter={arrowHover} onMouseLeave={arrowLeave}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      <div key={`text-${index}`} className="feature-slide">
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
          fontSize: '1.9rem', marginBottom: '14px', letterSpacing: '-0.02em',
          background: 'linear-gradient(100deg, #2C2A26 30%, #2D9B83 100%)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text',
          WebkitTextFillColor: 'transparent', color: 'transparent',
          display: 'inline-block',
        }}>
          {item.title}
        </div>
        <div style={{ fontSize: '17px', color: '#4A473F', lineHeight: 1.65, marginBottom: '28px', maxWidth: '460px' }}>
          {item.desc}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {items.map((it, i) => (
            <button
              key={it.title}
              onClick={() => go(i)}
              aria-label={`Go to ${it.title}`}
              style={{
                width: i === index ? '28px' : '8px', height: '8px', borderRadius: '999px',
                background: i === index ? '#2D9B83' : '#E8E6E1', border: 'none',
                cursor: 'pointer', transition: 'all 0.3s', padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function WhoCard({ item }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: '100%', padding: '24px 22px', borderRadius: '16px',
        border: `1px solid ${hover ? '#B8E8DF' : '#E8E6E1'}`, background: 'white',
        boxShadow: hover ? '0 14px 30px rgba(44,42,38,0.09)' : '0 2px 10px rgba(44,42,38,0.04)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div style={{
        width: '56px', height: '56px', borderRadius: '14px', overflow: 'hidden',
        border: `1.5px solid ${hover ? '#2D9B83' : '#E8E6E1'}`,
        background: item.image ? 'white' : (hover ? '#2D9B83' : '#F5F4F0'),
        color: hover ? 'white' : '#2C2A26',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '16px', transition: 'all 0.25s ease',
      }}>
        {item.image
          ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <FeatureIcon name={item.icon} size={24} />}
      </div>
      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
        fontSize: '17px', color: '#2C2A26', marginBottom: '8px', letterSpacing: '-0.01em',
      }}>
        {item.title}
      </div>
      <div style={{ fontSize: '16.5px', fontWeight: 500, color: '#4A473F', lineHeight: 1.65 }}>
        {item.desc}
      </div>
    </div>
  )
}

function WhoGrid({ items }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      style={{ gap: '16px', maxWidth: '1040px', margin: '0 auto' }}
    >
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 0.05}>
          <WhoCard item={item} />
        </Reveal>
      ))}
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.45)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: '20px', maxWidth: '640px',
          width: '100%', maxHeight: '80vh', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.20)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 28px', borderBottom: '1px solid #E8E6E1', flexShrink: 0,
        }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '17px', color: '#2C2A26' }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #E8E6E1',
              background: 'white', cursor: 'pointer', fontSize: '16px', color: '#6B6860',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
        <div style={{ overflowY: 'auto', padding: '28px', fontSize: '15px', lineHeight: 1.8, color: '#6B6860' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

function TermsContent() {
  const s = { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '14px', color: '#2C2A26', marginTop: '20px', marginBottom: '6px', display: 'block' }
  return (
    <div>
      <p style={{ marginBottom: '12px', color: '#9B9890', fontSize: '14.5px' }}>Last updated: June 2026</p>
      <p>By using Voca, you agree to these terms. Voca is a free, web-based AAC (Augmentative and Alternative Communication) tool provided for personal, non-commercial use.</p>

      <span style={s}>1. Use of Service</span>
      <p>Voca is provided free of charge as an accessibility tool. You may use it for personal communication assistance. You may not misuse, reverse-engineer, or attempt to disrupt the service.</p>

      <span style={s}>2. Data Storage</span>
      <p>All personal data (profiles, communication logs, boards, journal entries) is stored exclusively in your browser's local storage and IndexedDB. Voca does not operate a server or database. Clearing your browser data will permanently delete your Voca data.</p>

      <span style={s}>3. Third-Party Services</span>
      <p>Voca uses the following third-party services:</p>
      <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
        <li><strong>OpenAI API</strong> (with Google Gemini as an automatic fallback): anonymised communication summaries are sent to generate coaching advice. No names or identifying information are included.</li>
        <li><strong>ARASAAC</strong>: pictographic symbols are loaded from the ARASAAC open-access library under the Creative Commons BY-NC-SA licence.</li>
        <li><strong>Web Speech API</strong>: text-to-speech runs entirely in your browser. No audio is transmitted.</li>
      </ul>

      <span style={s}>4. No Warranty</span>
      <p>Voca is provided "as is" without warranty of any kind. It is a supportive tool and does not replace professional speech-language therapy.</p>

      <span style={s}>5. Changes to Terms</span>
      <p>These terms may be updated at any time. Continued use of Voca constitutes acceptance of the updated terms.</p>

      <span style={s}>6. Contact</span>
      <p>For questions about these terms, contact us at <a href="mailto:hello@voca.app" style={{ color: '#2D9B83' }}>hello@voca.app</a>.</p>
    </div>
  )
}

function PrivacyContent() {
  const s = { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '14px', color: '#2C2A26', marginTop: '20px', marginBottom: '6px', display: 'block' }
  return (
    <div>
      <p style={{ marginBottom: '12px', color: '#9B9890', fontSize: '14.5px' }}>Last updated: June 2026</p>
      <p>Your privacy matters. Voca is designed to be private by default. Your data stays on your device.</p>

      <span style={s}>What we collect</span>
      <p>Voca does not collect, transmit, or store any personal data on external servers. The following data is stored <strong>only in your browser</strong>:</p>
      <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
        <li>Profile names and avatar colours</li>
        <li>Symbol boards and customizations</li>
        <li>Communication logs and journal entries</li>
        <li>Tap history (used for on-device AI features)</li>
        <li>Settings and preferences</li>
      </ul>

      <span style={s}>AI Coach</span>
      <p>When the weekly AI Coach runs, an <strong>anonymised</strong> summary of communication patterns (word counts, categories, timing) is sent to OpenAI's API, with Google's Gemini used as an automatic fallback if OpenAI is unavailable. No names, journal entries, or identifiable information are included. Data handling is governed by the <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#2D9B83' }}>OpenAI Privacy Policy</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#2D9B83' }}>Google Privacy Policy</a>.</p>

      <span style={s}>ARASAAC Symbols</span>
      <p>Symbol images are loaded directly from ARASAAC's public servers. ARASAAC may log image requests as part of standard web server operation.</p>

      <span style={s}>Cookies & Tracking</span>
      <p>Voca uses no cookies and no analytics trackers. There is no advertising.</p>

      <span style={s}>Children's Privacy</span>
      <p>Voca is designed for use by children with communication needs, under caregiver supervision. We do not knowingly collect data from children because we do not collect data at all. Everything stays on the device.</p>

      <span style={s}>Your Rights</span>
      <p>Because all data is stored in your browser, you have full control. You can delete your data at any time by clearing your browser's local storage, or by deleting individual profiles within the app.</p>

      <span style={s}>Contact</span>
      <p>Privacy questions? Email us at <a href="mailto:hello@voca.app" style={{ color: '#2D9B83' }}>hello@voca.app</a>.</p>
    </div>
  )
}

const FORM_LABEL = {
  display: 'block', fontSize: '15px', fontWeight: 700, color: '#2C2A26',
  marginBottom: '7px', fontFamily: "'Plus Jakarta Sans', sans-serif",
}
const FORM_INPUT = {
  width: '100%', padding: '13px 16px', borderRadius: '12px',
  border: '1.5px solid #E8E6E1', fontSize: '15.5px', fontFamily: "'DM Sans', system-ui, sans-serif",
  color: '#2C2A26', outline: 'none', transition: 'border-color 0.15s', background: 'white',
}

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const subject = `Message from ${name || 'the Voca website'}`
    const body = `${message}\n\nFrom ${name} (${email})`
    window.location.href = `mailto:hello@voca.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  function focusStyle(e) { e.currentTarget.style.borderColor = '#2D9B83' }
  function blurStyle(e) { e.currentTarget.style.borderColor = '#E8E6E1' }

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '560px', margin: '0 auto',
      background: '#FAFAF8', borderRadius: '20px', padding: 'clamp(24px, 5vw, 36px)',
      border: '1.5px solid #E8E6E1', display: 'flex', flexDirection: 'column', gap: '18px',
    }}>
      <div>
        <label style={FORM_LABEL}>Name</label>
        <input
          required value={name} onChange={e => setName(e.target.value)}
          style={FORM_INPUT} placeholder="Your name"
          onFocus={focusStyle} onBlur={blurStyle}
        />
      </div>
      <div>
        <label style={FORM_LABEL}>Email</label>
        <input
          required type="email" value={email} onChange={e => setEmail(e.target.value)}
          style={FORM_INPUT} placeholder="you@example.com"
          onFocus={focusStyle} onBlur={blurStyle}
        />
      </div>
      <div>
        <label style={FORM_LABEL}>Message</label>
        <textarea
          required rows={5} value={message} onChange={e => setMessage(e.target.value)}
          style={{ ...FORM_INPUT, resize: 'vertical' }}
          placeholder="Questions, feedback, or partnership enquiries, we'd love to hear from you."
          onFocus={focusStyle} onBlur={blurStyle}
        />
      </div>
      <button type="submit" style={{ ...BTN.primary, width: '100%', textAlign: 'center', fontSize: '17px' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#238A72' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#2D9B83' }}
      >
        Send Message
      </button>
      {sent && (
        <p style={{ fontSize: '15px', color: '#6B6860', textAlign: 'center', margin: 0 }}>
          Opening your email app to send this to hello@voca.app…
        </p>
      )}
    </form>
  )
}

const FAQ_ITEMS = [
  {
    q: 'What is an AAC board?',
    a: "AAC stands for Augmentative and Alternative Communication. An AAC board is a grid of symbols and words that a non-verbal or minimally verbal person taps to build sentences, which are then spoken aloud, giving them a voice when speech is difficult or impossible.",
  },
  {
    q: 'What is the Voca Bot?',
    a: "It's an agentic assistant built into Voca. Instead of just answering questions, it takes action on its own: adding missing vocabulary, reorganising boards, and surfacing suggestions proactively, without you having to ask.",
  },
  {
    q: 'Can I use Voca on any device?',
    a: 'Yes, tablet, phone, or laptop, in any modern browser. There\'s nothing to install and no app store required.',
  },
  {
    q: 'Can I customize the symbol boards?',
    a: 'Yes. The Caregiver dashboard lets you add, edit, reorder, and reorganise boards and symbols at any time.',
  },
]

function FAQItem({ q, a, open, onToggle }) {
  return (
    <div style={{ borderBottom: '1px solid #E8E6E1' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '16px', padding: '20px 4px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '17px', color: '#2C2A26' }}>
          {q}
        </span>
        <span style={{
          flexShrink: 0, width: '28px', height: '28px', borderRadius: '999px',
          background: open ? '#2D9B83' : '#F2F1EE', color: open ? 'white' : '#6B6860',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          fontSize: '18px', fontWeight: 600, lineHeight: 1,
        }}>
          +
        </span>
      </button>
      {open && (
        <p style={{ fontSize: '18px', fontWeight: 500, color: '#4A473F', lineHeight: 1.7, margin: '0 4px 20px', maxWidth: '640px' }}>
          {a}
        </p>
      )}
    </div>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" style={{ padding: 'clamp(48px, 8vw, 72px) clamp(1.25rem, 5vw, 2rem)', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
          fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', color: '#2C2A26', margin: '0 0 12px',
          letterSpacing: '-0.02em',
        }}>
          Frequently asked questions.
        </h2>
        <p style={{ fontSize: '1.15rem', color: '#6B6860', margin: 0 }}>
          Everything you need to know before you get started.
        </p>
      </div>

      <div style={{
        maxWidth: '760px', margin: '0 auto',
        background: 'white', borderRadius: '20px', padding: '0 clamp(16px, 4vw, 28px)',
        border: '1px solid #E8E6E1', boxShadow: '0 4px 20px rgba(44,42,38,0.04)',
      }}>
        {FAQ_ITEMS.map((item, i) => (
          <FAQItem
            key={item.q}
            q={item.q}
            a={item.a}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  )
}

export default function LandingPage({ onEnter, authed, userName, userEmail, onLogout }) {
  const [modal, setModal] = useState(null) // null | 'terms' | 'privacy'
  const [scrolled, setScrolled] = useState(false)
  const scrollRef = useRef(null)

  function handleScroll(e) {
    const isScrolled = e.currentTarget.scrollTop > 8
    setScrolled(prev => (prev === isScrolled ? prev : isScrolled))
  }

  function scrollToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      ref={scrollRef}
      className="h-screen-safe overflow-y-auto"
      onScroll={handleScroll}
      style={{ background: '#FAFAF8', fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >

      {modal === 'terms'   && <Modal title="Terms of Service" onClose={() => setModal(null)}><TermsContent /></Modal>}
      {modal === 'privacy' && <Modal title="Privacy Policy"   onClose={() => setModal(null)}><PrivacyContent /></Modal>}

      {/* Full-width glass nav */}
      <Navbar scrolled={scrolled} onLogoClick={scrollToTop}>
        <a href="#contact" className="hidden sm:inline-flex" style={{
          fontSize: '14px', fontWeight: 600, color: '#4A473F',
          textDecoration: 'none', padding: '9px 16px', borderRadius: '100px',
          border: '1px solid rgba(232,230,225,0.9)', background: 'rgba(255,255,255,0.55)',
          transition: 'all 0.15s', alignItems: 'center', gap: '5px',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2D9B83'; e.currentTarget.style.color = '#2D9B83'; e.currentTarget.style.background = 'rgba(255,255,255,0.9)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,230,225,0.9)'; e.currentTarget.style.color = '#4A473F'; e.currentTarget.style.background = 'rgba(255,255,255,0.55)' }}
        >
          Contact Us
        </a>

        {authed ? (
          <ProfileMenu name={userName} email={userEmail} onLogout={onLogout} onDashboard={onEnter} />
        ) : (
          <button onClick={onEnter} style={{
            padding: '10px 22px',
            background: 'linear-gradient(135deg, #34AB92, #1F7A65)', color: 'white',
            border: 'none', borderRadius: '100px', fontSize: '14.5px', fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.01em',
            boxShadow: '0 4px 14px rgba(45,155,131,0.35)',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(45,155,131,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(45,155,131,0.35)' }}
          >
            Try Voca
          </button>
        )}
      </Navbar>

      {/* Hero */}
      <section
        className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-[72px]"
        style={{
          maxWidth: '1100px', margin: '0 auto',
          padding: 'clamp(48px, 10vw, 88px) clamp(1.25rem, 5vw, 2rem) clamp(40px, 8vw, 64px)',
        }}
      >
        <div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
            fontSize: 'clamp(2.9rem, 5.5vw, 4.6rem)', lineHeight: 1.02,
            color: '#2C2A26', marginBottom: '22px', letterSpacing: '-0.02em',
          }}>
            A voice<br />
            for <span style={{ color: '#2D9B83' }}>everyone.</span>
          </h1>

          <p style={{
            fontSize: '1.35rem', lineHeight: 1.7, color: '#6B6860',
            marginBottom: '38px', maxWidth: '480px',
          }}>
            Voca helps non-verbal and minimally verbal individuals communicate with AI that learns how they speak and gets smarter every week.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={onEnter} style={{
              padding: '16px 32px', background: '#2D9B83', color: 'white',
              border: 'none', borderRadius: '14px', fontSize: '18px',
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
              cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '-0.01em',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#238A72'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#2D9B83'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Start communicating
            </button>
            <a href="#features" style={{
              padding: '16px 26px', background: 'white', color: '#6B6860',
              border: '1.5px solid #E8E6E1', borderRadius: '14px', fontSize: '17px',
              fontWeight: 500, cursor: 'pointer', textDecoration: 'none',
              transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2D9B83'; e.currentTarget.style.color = '#2D9B83' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E6E1'; e.currentTarget.style.color = '#6B6860' }}
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Hero visual */}
        <div style={{ position: 'relative' }}>
          <div style={{
            background: 'white', borderRadius: '20px', padding: '16px',
            boxShadow: '0 20px 60px rgba(45,155,131,0.12), 0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid #E8E6E1',
          }}>
            <div style={{
              background: '#F2F1EE', borderRadius: '12px', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px',
            }}>
              {['I', 'want', 'juice'].map(w => (
                <div key={w} style={{
                  background: '#E8F7F4', border: '1px solid #B8E8DF',
                  borderRadius: '8px', padding: '5px 10px',
                  fontSize: '14.5px', fontWeight: 600, color: '#2D9B83',
                }}>
                  {w}
                </div>
              ))}
              <div style={{ marginLeft: 'auto', background: '#2D9B83', borderRadius: '8px', padding: '6px 14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>🔊 Speak</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { label: 'I',     bg: '#FFF3E8', border: '#FDDDB8', text: '#7A5010', emoji: '👤' },
                { label: 'want',  bg: '#EAF7F0', border: '#B8DECA', text: '#1A6B58', emoji: '🤲' },
                { label: 'like',  bg: '#EAF7F0', border: '#B8DECA', text: '#1A6B58', emoji: '❤️'  },
                { label: 'go',    bg: '#EAF7F0', border: '#B8DECA', text: '#1A6B58', emoji: '🚶' },
                { label: 'home',  bg: '#FFFBE8', border: '#F5E8A0', text: '#5A4A00', emoji: '🏠' },
                { label: 'eat',   bg: '#EAF7F0', border: '#B8DECA', text: '#1A6B58', emoji: '🍽️' },
                { label: 'happy', bg: '#FBE8F0', border: '#F0BDD0', text: '#6B1830', emoji: '😊' },
                { label: 'more',  bg: '#EEE8FB', border: '#D0BEF0', text: '#3A1A7A', emoji: '➕' },
              ].map(s => (
                <div key={s.label} style={{
                  background: s.bg, border: `1.5px solid ${s.border}`,
                  borderRadius: '10px', padding: '10px 6px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                }}>
                  <span style={{ fontSize: '20px' }}>{s.emoji}</span>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: s.text }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden sm:block" style={{
            position: 'absolute', bottom: '-24px', right: '-20px',
            background: 'white', borderRadius: '14px', padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)', border: '1px solid #E8E6E1',
            maxWidth: '200px', zIndex: 2,
          }}>
            <div style={{ fontSize: '10px', color: '#2D9B83', fontWeight: 700, marginBottom: '4px', letterSpacing: '0.04em' }}>
              🎓 AI COACH
            </div>
            <div style={{ fontSize: '11px', color: '#2C2A26', lineHeight: 1.4, fontWeight: 500 }}>
              "Try adding <strong>frustrated</strong> and <strong>calm</strong> to the Feelings board."
            </div>
          </div>

          <div className="hidden sm:block" style={{
            position: 'absolute', top: '-16px', left: '-16px',
            background: '#2D9B83', borderRadius: '12px', padding: '8px 14px',
            boxShadow: '0 4px 16px rgba(45,155,131,0.3)', zIndex: 2,
          }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: '2px' }}>NEXT WORD</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['juice', 'food', 'more'].map(w => (
                <span key={w} style={{
                  background: 'rgba(255,255,255,0.2)', borderRadius: '6px',
                  padding: '3px 8px', fontSize: '11px', color: 'white', fontWeight: 600,
                }}>
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <Reveal>
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(1.25rem, 5vw, 2rem) 60px' }}>
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{
            gap: '1px', background: '#E8E6E1', borderRadius: '16px', overflow: 'hidden',
            border: '1px solid #E8E6E1',
          }}
        >
          {[
            { num: '97M+',   label: 'people worldwide cannot rely on natural speech',        accent: '#2D9B83' },
            { num: '9,000+', label: 'children diagnosed with autism in Sri Lanka',           accent: '#2D9B83' },
            { num: '0.44',   label: 'speech therapists per 100,000 people in Sri Lanka',     accent: '#C0392B' },
          ].map(({ num, label, accent }) => (
            <div key={num} style={{ background: 'white', padding: '28px 24px', textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: '2.6rem',
                color: accent, lineHeight: 1, marginBottom: '8px',
              }}>
                {num}
              </div>
              <div style={{ fontSize: '17px', color: '#6B6860', lineHeight: 1.45 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      {/* Features */}
      <Reveal>
      <section id="features" style={{ background: '#E8F7F4', padding: 'clamp(48px, 8vw, 72px) clamp(1.25rem, 5vw, 2rem)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
              fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', color: '#2C2A26', margin: '0 0 12px',
              letterSpacing: '-0.02em',
            }}>
              Everything you need, built in.
            </h2>
            <p style={{ fontSize: '1.15rem', color: '#6B6860', margin: 0 }}>
              No plug-ins, no upsells. Just one AAC app that keeps getting smarter.
            </p>
          </div>

          <FeatureSlider items={FEATURE_ITEMS} />
        </div>
      </section>
      </Reveal>

      {/* Journal feature — commented out, keep for later
      <section id="journal" style={{ padding: 'clamp(48px, 8vw, 72px) clamp(1.25rem, 5vw, 2rem)', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-[60px]">
          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'white', borderRadius: '20px', padding: '16px',
              boxShadow: '0 20px 60px rgba(45,155,131,0.10), 0 4px 16px rgba(0,0,0,0.06)',
              border: '1px solid #E8E6E1',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '15px', color: '#2C2A26' }}>My Journal</div>
                  <div style={{ fontSize: '10px', color: '#9B9890' }}>A private space, just for you</div>
                </div>
                <div style={{
                  background: '#2D9B83', borderRadius: '8px', padding: '5px 10px',
                  fontSize: '11px', fontWeight: 700, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  + New entry
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 10px', background: '#E8F7F4', borderRadius: '10px',
                border: '1px solid #B8E8DF', marginBottom: '12px',
              }}>
                <span style={{ fontSize: '16px' }}>😊</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#2D9B83' }}>Feeling happy</span>
              </div>

              {[
                { mood: '😊', label: 'happy', date: 'Today',     words: ['I', 'want', 'play', 'park'] },
                { mood: '🍽️', label: 'eat',   date: 'Yesterday', words: ['eat', 'apple', 'more', 'water'] },
              ].map((entry, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px', background: '#FAFAF8', borderRadius: '10px',
                  border: '1px solid #E8E6E1', marginBottom: '8px',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '9px',
                    background: 'white', border: '1px solid #E8E6E1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', flexShrink: 0,
                  }}>
                    {entry.mood}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#2C2A26' }}>{entry.date}</span>
                      <span style={{ fontSize: '10px', color: '#9B9890' }}>Feeling {entry.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {entry.words.map(w => (
                        <span key={w} style={{
                          background: '#E8F7F4', border: '1px solid #B8E8DF',
                          borderRadius: '5px', padding: '2px 7px',
                          fontSize: '10px', fontWeight: 600, color: '#2D9B83',
                        }}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:flex" style={{
              position: 'absolute', bottom: '-18px', left: '-16px',
              background: 'white', borderRadius: '12px', padding: '8px 14px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.09)', border: '1px solid #E8E6E1',
              zIndex: 2, alignItems: 'center', gap: '6px',
            }}>
              <span style={{ fontSize: '15px' }}>🔒</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B6860' }}>Private, only visible to you</span>
            </div>
          </div>

          <div>
            <div style={{
              display: 'inline-block', padding: '4px 14px',
              background: '#FDF3E0', borderRadius: '100px',
              fontSize: '11px', fontWeight: 600, color: '#7A5010',
              letterSpacing: '0.06em', marginBottom: '20px',
            }}>
              JOURNAL
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
              fontSize: 'clamp(1.7rem, 4.5vw, 2.3rem)', color: '#2C2A26', margin: '0 0 16px',
              letterSpacing: '-0.02em', lineHeight: 1.1,
            }}>
              A private diary, in their own words.
            </h2>
            <p style={{ fontSize: '1.15rem', color: '#6B6860', lineHeight: 1.7, marginBottom: '28px' }}>
              The Journal lets individuals record their day, feelings, and thoughts using the same symbols they communicate with. No text to type. Just tap and save.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: '🌅', title: 'Mood check-in',     desc: 'Start every entry by picking a mood symbol.' },
                { icon: '🔤', title: 'Symbol sentences',  desc: 'Build thoughts by tapping symbols, the same way they speak.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '9px',
                    background: '#FDF3E0', border: '1px solid #F5DFA0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '15px', flexShrink: 0,
                  }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '15px', color: '#2C2A26', marginBottom: '2px' }}>
                      {title}
                    </div>
                    <div style={{ fontSize: '14.5px', color: '#6B6860', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      */}

      {/* AI features — Voca vs. typical AAC apps — hidden for now, keep for later
      <Reveal>
      <section id="ai-features" style={{ padding: 'clamp(48px, 8vw, 72px) clamp(1.25rem, 5vw, 2rem)', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-block', padding: '4px 14px',
            background: '#FDF3E0', borderRadius: '100px',
            fontSize: '11px', fontWeight: 600, color: '#7A5010',
            letterSpacing: '0.06em', marginBottom: '16px',
          }}>
            AI FEATURES
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
            fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', color: '#2C2A26', margin: '0 0 12px',
            letterSpacing: '-0.02em',
          }}>
            Built different from day one.
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#6B6860', margin: 0 }}>
            Here's how Voca compares to a typical AAC app.
          </p>
        </div>

        <div className="hidden md:grid" style={{
          maxWidth: '880px', margin: '0 auto',
          gridTemplateColumns: 'minmax(150px, 1.3fr) 1fr 1fr',
          borderRadius: '20px', overflow: 'hidden', border: '1px solid #E8E6E1',
          boxShadow: '0 4px 20px rgba(44,42,38,0.04)',
        }}>
          <div style={{ background: 'white', padding: '18px 20px' }} />
          <div style={{ background: 'white', padding: '18px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: '17px', fontWeight: 800, color: '#6B6860', letterSpacing: '0.02em' }}>
              Typical AAC apps
            </span>
          </div>
          <div style={{ background: '#14523F', padding: '18px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: '17px', fontWeight: 900, color: 'white', letterSpacing: '0.02em' }}>
              Voca
            </span>
          </div>

          {COMPARISON_ROWS.map(row => (
            <Fragment key={row.feature}>
              <div style={{
                background: 'white', padding: '20px', borderTop: '1px solid #F0EFEA',
                display: 'flex', alignItems: 'center',
              }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '17px', color: '#14523F' }}>
                  {row.feature}
                </span>
              </div>
              <div style={{
                background: 'white', padding: '20px 16px', borderTop: '1px solid #F0EFEA',
                display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              }}>
                <span style={{ fontSize: '18px', fontWeight: 500, color: '#4A473F', lineHeight: 1.6 }}>{row.typical}</span>
              </div>
              <div style={{
                background: '#14523F', padding: '20px 16px', borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              }}>
                <span style={{ fontSize: '18px', fontWeight: 600, color: 'white', lineHeight: 1.6 }}>{renderWithAIEmphasis(row.voca)}</span>
              </div>
            </Fragment>
          ))}
        </div>

        <div className="md:hidden" style={{
          maxWidth: '480px', margin: '0 auto',
          borderRadius: '16px', overflow: 'hidden', border: '1px solid #E8E6E1',
          boxShadow: '0 2px 10px rgba(44,42,38,0.04)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ background: 'white', padding: '9px 10px', textAlign: 'center', borderRight: '1px solid #F0EFEA' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#6B6860', letterSpacing: '0.02em' }}>TYPICAL</span>
            </div>
            <div style={{ background: '#14523F', padding: '9px 10px', textAlign: 'center' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 900, color: 'white', letterSpacing: '0.02em' }}>VOCA</span>
            </div>
          </div>

          {COMPARISON_ROWS.map(row => (
            <div key={row.feature}>
              <div style={{ background: '#FAFAF8', padding: '6px 10px', borderTop: '1px solid #E8E6E1' }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '13px', color: '#14523F' }}>
                  {row.feature}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ background: 'white', padding: '7px 10px 11px', borderRight: '1px solid #F0EFEA' }}>
                  <span style={{ fontSize: '13.5px', color: '#6B6860', lineHeight: 1.4 }}>{row.typical}</span>
                </div>
                <div style={{ background: '#14523F', padding: '7px 10px 11px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'white', lineHeight: 1.4 }}>{renderWithAIEmphasis(row.voca)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={onEnter} style={BTN.primary}
            onMouseEnter={e => { e.currentTarget.style.background = '#238A72'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2D9B83'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Start for free
          </button>
        </div>
      </section>
      </Reveal>
      */}

      {/* Who it's for */}
      <Reveal>
      <section style={{ padding: 'clamp(48px, 8vw, 72px) clamp(1.25rem, 5vw, 2rem)', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
            fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', color: '#2C2A26', margin: '0 0 12px',
            letterSpacing: '-0.02em',
          }}>
            Built for every communication level.
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#6B6860', margin: 0 }}>
            From a first word to a full sentence, Voca meets people where they are.
          </p>
        </div>

        <WhoGrid items={WHO_ITEMS} />
      </section>
      </Reveal>

      <Reveal>
        <FAQSection />
      </Reveal>

      {/* Contact Us */}
      <Reveal>
      <section id="contact" style={{
        background: 'white', borderTop: '1px solid #E8E6E1', borderBottom: '1px solid #E8E6E1',
        padding: 'clamp(48px, 8vw, 72px) clamp(1.25rem, 5vw, 2rem)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
              fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', color: '#2C2A26', margin: '0 0 12px',
              letterSpacing: '-0.02em',
            }}>
              Get in touch
            </h2>
            <p style={{ fontSize: '1.15rem', color: '#6B6860', margin: 0 }}>
              Questions, feedback, or partnership enquiries, we'd love to hear from you.
            </p>
          </div>

          <ContactForm />

        </div>
      </section>
      </Reveal>

      {/* Footer CTA */}
      <section style={{ background: '#2D9B83', padding: 'clamp(56px, 10vw, 80px) clamp(1.25rem, 5vw, 2rem)', textAlign: 'center' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
            fontSize: 'clamp(2rem, 6vw, 2.8rem)', color: 'white', marginBottom: '16px',
            letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            Give them a voice today.
          </h2>
          <p style={{
            fontSize: '1.2rem', color: 'rgba(255,255,255,0.75)',
            marginBottom: '38px', lineHeight: 1.6,
          }}>
            Set up a profile in minutes and start building sentences right away. Everything stays private, right there on your device.
          </p>
          <button onClick={onEnter} style={{
            padding: '17px 42px', background: 'white', color: '#2D9B83',
            border: 'none', borderRadius: '14px', fontSize: '17px',
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E8F7F4'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Open Voca
          </button>

          {/* Footer bottom */}
          <div style={{ marginTop: '52px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <button
              onClick={scrollToTop}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0, margin: '0 auto 8px',
              }}
            >
              <img
                src="https://i.imgur.com/3vT9jwF.jpeg"
                alt="Voca"
                style={{ width: '32px', height: '32px', borderRadius: '9px', objectFit: 'cover', boxShadow: '0 2px 10px rgba(0,0,0,0.25)' }}
              />
              <span style={{ color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: '20px', letterSpacing: '-0.02em' }}>Voca</span>
            </button>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17.5px', margin: '0 0 18px' }}>
              Built for every family on earth.
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '22px' }}>
              <a
                href="https://www.facebook.com/share/199G3XURYk/"
                target="_blank" rel="noopener noreferrer"
                aria-label="Voca on Facebook"
                style={{
                  width: '38px', height: '38px', borderRadius: '999px',
                  background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
                </svg>
              </a>
              <a
                href="#"
                target="_blank" rel="noopener noreferrer"
                aria-label="Voca on Instagram"
                style={{
                  width: '38px', height: '38px', borderRadius: '999px',
                  background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5.5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.6" cy="6.4" r="0.4" fill="white" stroke="none" />
                </svg>
              </a>
            </div>

            {/* Legal links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '8px', rowGap: '6px' }}>
              <button
                onClick={() => setModal('terms')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '16.5px', color: 'rgba(255,255,255,0.6)',
                  padding: '4px 8px', borderRadius: '6px', transition: 'color 0.15s',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                Terms of Service
              </button>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '16.5px' }}>·</span>
              <button
                onClick={() => setModal('privacy')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '16.5px', color: 'rgba(255,255,255,0.6)',
                  padding: '4px 8px', borderRadius: '6px', transition: 'color 0.15s',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                Privacy Policy
              </button>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '16.5px' }}>·</span>
              <a href="#contact" style={{
                fontSize: '16.5px', color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none', padding: '4px 8px', borderRadius: '6px',
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                Contact
              </a>
            </div>

            {/* Copyright — own line */}
            <div style={{ marginTop: '10px', fontSize: '16.5px', color: 'rgba(255,255,255,0.4)' }}>
              © 2026 Voca
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
