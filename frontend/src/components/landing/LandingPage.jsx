import { Fragment, useState, useRef, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ProfileMenu from '../shared/ProfileMenu'

const FEATURE_ITEMS = [
  {
    icon: '🧠', bg: '#E8F7F4', border: '#B8E8DF', accent: '#2D9B83',
    title: 'AI word prediction',
    desc: 'Learns each person\'s unique communication patterns and predicts the next word in real time.',
  },
  {
    icon: '🗂️', bg: '#FDF3E0', border: '#F5DFA0', accent: '#C98A1F',
    title: 'Auto-organising boards',
    desc: 'Boards reorder themselves based on real usage — no manual dragging or editing required.',
  },
  {
    icon: '🔍', bg: '#FBE8F0', border: '#F0BDD0', accent: '#C24A78',
    title: 'Missing vocabulary alerts',
    desc: 'Flags gaps in the vocabulary and suggests exactly which symbols to add next.',
  },
  {
    icon: '🎓', bg: '#EEE8FB', border: '#D0BEF0', accent: '#7A5AC9',
    title: 'Weekly AI coaching',
    desc: 'Personalised guidance for caregivers, powered by AI — like a virtual speech therapist.',
  },
  {
    icon: '🤖', bg: '#E8F7F4', border: '#B8E8DF', accent: '#1F8A7A',
    title: 'Agentic Voca Bot',
    desc: "Doesn't just chat — takes action on its own, reorganising boards and adding vocabulary for you.",
  },
  {
    icon: '🌐', bg: '#E5F1FB', border: '#BBDAF5', accent: '#3D8FD1',
    title: 'Free & works offline',
    desc: 'Speaks fully offline in any modern browser, on any device. No subscriptions, ever.',
  },
]

const COMPARISON_ROWS = [
  { feature: 'Word prediction',    typical: 'Static, generic word lists',              voca: 'Learns patterns in real time' },
  { feature: 'Board layout',       typical: 'Fixed grid, manual editing only',        voca: 'AI auto-reorders your board by real usage' },
  { feature: 'Missing vocabulary', typical: 'No signal when a word is missing',        voca: 'Flags gaps, suggests exactly what to add' },
  { feature: 'Coaching & guidance', typical: "None — you're on your own",              voca: 'Weekly AI coaching, built in' },
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

function FeatureCarousel({ items }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setIndex(i => (i + 1) % items.length)
    }, 4200)
    return () => clearInterval(id)
  }, [paused, items.length])

  function go(i) { setIndex(((i % items.length) + items.length) % items.length) }
  function prev() { go(index - 1) }
  function next() { go(index + 1) }

  const arrowBase = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    width: '40px', height: '40px', borderRadius: '999px',
    background: 'white', border: '1.5px solid #E8E6E1', color: '#6B6860',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: '20px', lineHeight: 1, zIndex: 3,
    boxShadow: '0 4px 14px rgba(44,42,38,0.10)', transition: 'all 0.15s',
  }
  function arrowHover(e) { e.currentTarget.style.borderColor = '#2D9B83'; e.currentTarget.style.color = '#2D9B83' }
  function arrowLeave(e) { e.currentTarget.style.borderColor = '#E8E6E1'; e.currentTarget.style.color = '#6B6860' }

  return (
    <div
      style={{ maxWidth: '880px', margin: '0 auto' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{
        position: 'relative', borderRadius: '24px', overflow: 'hidden',
        border: '1.5px solid #E8E6E1', boxShadow: '0 12px 40px rgba(44,42,38,0.06)',
        background: 'white',
      }}>
        <div style={{
          display: 'flex',
          transform: `translateX(-${index * 100}%)`,
          transition: 'transform 0.6s cubic-bezier(0.65,0,0.35,1)',
        }}>
          {items.map(({ icon, bg, border, accent, title, desc }) => (
            <div key={title} style={{ flex: '0 0 100%', width: '100%' }}>
              <div style={{
                position: 'relative', overflow: 'hidden',
                background: `linear-gradient(135deg, ${bg} 0%, white 70%)`,
                minHeight: '280px',
              }}>
                {/* drifting decorative blobs */}
                <div className="feature-bg-blob" style={{
                  position: 'absolute', top: '-40px', right: '-30px',
                  width: '160px', height: '160px', borderRadius: '50%',
                  background: border, opacity: 0.35, filter: 'blur(1px)',
                }} />
                <div className="feature-bg-blob" style={{
                  position: 'absolute', bottom: '-36px', left: '6%',
                  width: '90px', height: '90px', borderRadius: '50%',
                  background: border, opacity: 0.25, animationDelay: '-3s',
                }} />

                {/* wavy accent line threading behind the content */}
                <svg
                  viewBox="0 0 400 40" preserveAspectRatio="none"
                  style={{ position: 'absolute', bottom: '18px', left: 0, width: '100%', height: '32px', opacity: 0.5 }}
                >
                  <path d="M0,20 Q50,2 100,20 T200,20 T300,20 T400,20" fill="none" stroke={accent} strokeWidth="2" />
                </svg>

                <div
                  className="flex flex-col md:flex-row items-center text-center md:text-left"
                  style={{ position: 'relative', zIndex: 1, gap: '32px', padding: 'clamp(36px, 6vw, 56px)' }}
                >
                  <div className="feature-icon-blob" style={{
                    width: '104px', height: '104px', flexShrink: 0,
                    background: `linear-gradient(145deg, ${accent}, ${border})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '46px', boxShadow: `0 14px 30px ${accent}40`,
                  }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
                      fontSize: '1.6rem', color: '#2C2A26', marginBottom: '10px', letterSpacing: '-0.01em',
                    }}>
                      {title}
                    </div>
                    <div style={{ fontSize: '17px', color: '#6B6860', lineHeight: 1.6, maxWidth: '480px' }}>
                      {desc}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prev} aria-label="Previous feature"
          style={{ ...arrowBase, left: '16px' }}
          onMouseEnter={arrowHover} onMouseLeave={arrowLeave}
        >
          ‹
        </button>
        <button
          onClick={next} aria-label="Next feature"
          style={{ ...arrowBase, right: '16px' }}
          onMouseEnter={arrowHover} onMouseLeave={arrowLeave}
        >
          ›
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '22px' }}>
        {items.map((item, i) => (
          <button
            key={item.title}
            onClick={() => go(i)}
            aria-label={`Go to ${item.title}`}
            style={{
              width: i === index ? '28px' : '8px', height: '8px', borderRadius: '999px',
              background: i === index ? '#2D9B83' : '#E8E6E1', border: 'none',
              cursor: 'pointer', transition: 'all 0.3s', padding: 0,
            }}
          />
        ))}
      </div>
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
      <p>All personal data — profiles, communication logs, boards, journal entries — is stored exclusively in your browser's local storage and IndexedDB. Voca does not operate a server or database. Clearing your browser data will permanently delete your Voca data.</p>

      <span style={s}>3. Third-Party Services</span>
      <p>Voca uses the following third-party services:</p>
      <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
        <li><strong>OpenAI API</strong> (with Google Gemini as an automatic fallback) — anonymised communication summaries are sent to generate coaching advice. No names or identifying information are included.</li>
        <li><strong>ARASAAC</strong> — pictographic symbols are loaded from the ARASAAC open-access library under the Creative Commons BY-NC-SA licence.</li>
        <li><strong>Web Speech API</strong> — text-to-speech runs entirely in your browser. No audio is transmitted.</li>
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
      <p>Your privacy matters. Voca is designed to be private by default — your data stays on your device.</p>

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
      <p>Voca is designed for use by children with communication needs, under caregiver supervision. We do not knowingly collect data from children because we do not collect data at all — everything stays on the device.</p>

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
  border: '1.5px solid #E8E6E1', fontSize: '16.5px', fontFamily: "'DM Sans', system-ui, sans-serif",
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
    const body = `${message}\n\n— ${name} (${email})`
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
    a: "AAC stands for Augmentative and Alternative Communication. An AAC board is a grid of symbols and words that a non-verbal or minimally verbal person taps to build sentences, which are then spoken aloud — giving them a voice when speech is difficult or impossible.",
  },
  {
    q: 'Is Voca really free?',
    a: 'Yes — completely free, with no subscriptions, trials, or hidden costs. Voca is built as an accessibility tool, not a business.',
  },
  {
    q: 'What is the Voca Bot?',
    a: "It's an agentic assistant built into Voca — instead of just answering questions, it takes action on its own: adding missing vocabulary, reorganising boards, and surfacing suggestions proactively, without you having to ask.",
  },
  {
    q: 'What age group is Voca designed for?',
    a: "Any age. It's used by young children with autism or apraxia of speech, as well as non-verbal or minimally verbal teens and adults.",
  },
  {
    q: 'Can I use Voca on any device?',
    a: 'Yes — tablet, phone, or laptop, in any modern browser. There\'s nothing to install and no app store required.',
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
        <div style={{
          display: 'inline-block', padding: '4px 14px',
          background: '#E8F7F4', borderRadius: '100px',
          fontSize: '11px', fontWeight: 600, color: '#2D9B83',
          letterSpacing: '0.06em', marginBottom: '16px',
        }}>
          FAQ
        </div>
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
      className="h-screen overflow-y-auto"
      onScroll={handleScroll}
      style={{ background: '#FAFAF8', fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >

      {modal === 'terms'   && <Modal title="Terms of Service" onClose={() => setModal(null)}><TermsContent /></Modal>}
      {modal === 'privacy' && <Modal title="Privacy Policy"   onClose={() => setModal(null)}><PrivacyContent /></Modal>}

      {/* Full-width glass nav */}
      <Navbar scrolled={scrolled} onLogoClick={scrollToTop}>
        <a href="#contact" style={{
          fontSize: '14px', fontWeight: 600, color: '#4A473F',
          textDecoration: 'none', padding: '9px 16px', borderRadius: '100px',
          border: '1px solid rgba(232,230,225,0.9)', background: 'rgba(255,255,255,0.55)',
          transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: '5px',
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

      {/* Features */}
      <section id="features" style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg, #F1FAF6 0%, #ECF8F2 100%)',
        padding: 'clamp(72px, 10vw, 100px) 0',
      }}>
        <svg
          viewBox="0 0 1440 74" preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '56px', display: 'block' }}
        >
          <path d="M0,40 C240,90 480,0 720,20 C960,40 1200,90 1440,40 L1440,0 L0,0 Z" fill="#FAFAF8" />
        </svg>
        <svg
          viewBox="0 0 1440 74" preserveAspectRatio="none"
          style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '56px', display: 'block', transform: 'scaleY(-1)' }}
        >
          <path d="M0,40 C240,90 480,0 720,20 C960,40 1200,90 1440,40 L1440,74 L0,74 Z" fill="white" />
        </svg>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(1.25rem, 5vw, 2rem)' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{
              display: 'inline-block', padding: '4px 14px',
              background: 'white', borderRadius: '100px',
              fontSize: '11px', fontWeight: 600, color: '#2D9B83',
              letterSpacing: '0.06em', marginBottom: '16px',
            }}>
              FEATURES
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
              fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', color: '#2C2A26', margin: '0 0 12px',
              letterSpacing: '-0.02em',
            }}>
              Everything you need, built in.
            </h2>
            <p style={{ fontSize: '1.3rem', color: '#6B6860', margin: 0 }}>
              No plug-ins, no upsells — just one AAC app that keeps getting smarter.
            </p>
          </div>

          <FeatureCarousel items={FEATURE_ITEMS} />
        </div>
      </section>

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
                  <div style={{ fontSize: '10px', color: '#9B9890' }}>A private space — just for you</div>
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
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B6860' }}>Private — only visible to you</span>
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
              A private diary — in their own words.
            </h2>
            <p style={{ fontSize: '1.15rem', color: '#6B6860', lineHeight: 1.7, marginBottom: '28px' }}>
              The Journal lets individuals record their day, feelings, and thoughts using the same symbols they communicate with. No text to type — just tap and save.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: '🌅', title: 'Mood check-in',     desc: 'Start every entry by picking a mood symbol.' },
                { icon: '🔤', title: 'Symbol sentences',  desc: 'Build thoughts by tapping symbols — the same way they speak.' },
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

      {/* AI features — Voca vs. typical AAC apps */}
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

        {/* Desktop / tablet: side-by-side comparison table */}
        <div className="hidden md:grid" style={{
          maxWidth: '880px', margin: '0 auto',
          gridTemplateColumns: 'minmax(150px, 1.3fr) 1fr 1fr',
          borderRadius: '20px', overflow: 'hidden', border: '1px solid #E8E6E1',
          boxShadow: '0 4px 20px rgba(44,42,38,0.04)',
        }}>
          {/* Header row */}
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

          {/* Rows */}
          {COMPARISON_ROWS.map(row => (
            <Fragment key={row.feature}>
              <div style={{
                background: 'white', padding: '20px', borderTop: '1px solid #F0EFEA',
                display: 'flex', alignItems: 'center',
              }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '15px', color: '#14523F' }}>
                  {row.feature}
                </span>
              </div>
              <div style={{
                background: 'white', padding: '20px 16px', borderTop: '1px solid #F0EFEA',
                display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              }}>
                <span style={{ fontSize: '15px', color: '#6B6860', lineHeight: 1.5 }}>{row.typical}</span>
              </div>
              <div style={{
                background: '#14523F', padding: '20px 16px', borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'white', lineHeight: 1.5 }}>{renderWithAIEmphasis(row.voca)}</span>
              </div>
            </Fragment>
          ))}
        </div>

        {/* Mobile: compact two-column table */}
        <div className="md:hidden" style={{
          maxWidth: '480px', margin: '0 auto',
          borderRadius: '16px', overflow: 'hidden', border: '1px solid #E8E6E1',
          boxShadow: '0 2px 10px rgba(44,42,38,0.04)',
        }}>
          {/* Header row */}
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

      <FAQSection />

      {/* Contact Us */}
      <section id="contact" style={{
        background: 'white', borderTop: '1px solid #E8E6E1', borderBottom: '1px solid #E8E6E1',
        padding: 'clamp(48px, 8vw, 72px) clamp(1.25rem, 5vw, 2rem)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{
              display: 'inline-block', padding: '4px 14px',
              background: '#E8F7F4', borderRadius: '100px',
              fontSize: '11px', fontWeight: 600, color: '#2D9B83',
              letterSpacing: '0.06em', marginBottom: '16px',
            }}>
              CONTACT
            </div>
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

      {/* Footer CTA */}
      <section style={{ background: '#2D9B83', padding: 'clamp(56px, 10vw, 80px) clamp(1.25rem, 5vw, 2rem)', textAlign: 'center' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
            fontSize: 'clamp(2rem, 6vw, 2.8rem)', color: 'white', marginBottom: '16px',
            letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            Free. Always.
          </h2>
          <p style={{
            fontSize: '1.2rem', color: 'rgba(255,255,255,0.75)',
            marginBottom: '38px', lineHeight: 1.6,
          }}>
            No app store. No download. No cost. Works on any device with a browser — tablet, phone, laptop.
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
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '16px', margin: '0 0 18px' }}>
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
                  fontSize: '15.5px', color: 'rgba(255,255,255,0.6)',
                  padding: '4px 8px', borderRadius: '6px', transition: 'color 0.15s',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                Terms of Service
              </button>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '15.5px' }}>·</span>
              <button
                onClick={() => setModal('privacy')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '15.5px', color: 'rgba(255,255,255,0.6)',
                  padding: '4px 8px', borderRadius: '6px', transition: 'color 0.15s',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                Privacy Policy
              </button>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '15.5px' }}>·</span>
              <a href="#contact" style={{
                fontSize: '15.5px', color: 'rgba(255,255,255,0.6)',
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
            <div style={{ marginTop: '10px', fontSize: '15.5px', color: 'rgba(255,255,255,0.4)' }}>
              © 2026 Voca
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
