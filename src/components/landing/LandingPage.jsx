import { useState } from 'react'

const BTN = {
  primary: {
    padding: '13px 32px', background: '#2D9B83', color: 'white',
    border: 'none', borderRadius: '12px', fontSize: '14px',
    fontFamily: 'Nunito, sans-serif', fontWeight: 800,
    cursor: 'pointer', transition: 'all 0.15s',
  },
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
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '17px', color: '#2C2A26' }}>
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
  const s = { fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '14px', color: '#2C2A26', marginTop: '20px', marginBottom: '6px', display: 'block' }
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
        <li><strong>Google Gemini API</strong> — anonymised communication summaries are sent to generate coaching advice. No names or identifying information are included.</li>
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
  const s = { fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '14px', color: '#2C2A26', marginTop: '20px', marginBottom: '6px', display: 'block' }
  return (
    <div>
      <p style={{ marginBottom: '12px', color: '#9B9890', fontSize: '14.5px' }}>Last updated: June 2026</p>
      <p>Your privacy matters. Voca is designed to be private by default — your data stays on your device.</p>

      <span style={s}>What we collect</span>
      <p>Voca does not collect, transmit, or store any personal data on external servers. The following data is stored <strong>only in your browser</strong>:</p>
      <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
        <li>Profile names and avatar colours</li>
        <li>Symbol boards and customisations</li>
        <li>Communication logs and journal entries</li>
        <li>Tap history (used for on-device AI features)</li>
        <li>Settings and preferences</li>
      </ul>

      <span style={s}>Gemini AI Coach</span>
      <p>When the weekly AI Coach runs, an <strong>anonymised</strong> summary of communication patterns (word counts, categories, timing) is sent to Google's Gemini API. No names, journal entries, or identifiable information are included. Google's data handling is governed by the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#2D9B83' }}>Google Privacy Policy</a>.</p>

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

export default function LandingPage({ onEnter }) {
  const [modal, setModal] = useState(null) // null | 'terms' | 'privacy'

  return (
    <div className="h-screen overflow-y-auto" style={{ background: '#FAFAF8', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {modal === 'terms'   && <Modal title="Terms of Service" onClose={() => setModal(null)}><TermsContent /></Modal>}
      {modal === 'privacy' && <Modal title="Privacy Policy"   onClose={() => setModal(null)}><PrivacyContent /></Modal>}

      {/* Sticky nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '60px',
        background: 'rgba(250,250,248,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E8E6E1',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: '#2D9B83', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '15px', fontFamily: 'Nunito, sans-serif' }}>V</span>
          </div>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '17px', color: '#2C2A26' }}>Voca</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="#contact" style={{
            fontSize: '15px', fontWeight: 600, color: '#6B6860',
            textDecoration: 'none', padding: '6px 14px', borderRadius: '8px',
            border: '1.5px solid #E8E6E1', background: 'white',
            transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: '5px',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2D9B83'; e.currentTarget.style.color = '#2D9B83' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E6E1'; e.currentTarget.style.color = '#6B6860' }}
          >
            Contact Us
          </a>
          <button onClick={onEnter} style={{
            padding: '8px 20px', background: '#2D9B83', color: 'white',
            border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Nunito, sans-serif', letterSpacing: '0.01em',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.target.style.background = '#238A72'}
            onMouseLeave={e => e.target.style.background = '#2D9B83'}
          >
            Open App →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: '860px', margin: '0 auto', padding: '80px 2rem 60px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', background: '#E8F7F4', borderRadius: '100px',
            border: '1px solid #B8E8DF', marginBottom: '28px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2D9B83', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', color: '#2D9B83', fontWeight: 600, letterSpacing: '0.04em' }}>
              FREE · WEB-BASED · AI-POWERED
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Nunito, sans-serif', fontWeight: 900,
            fontSize: 'clamp(2.6rem, 5vw, 3.8rem)', lineHeight: 1.0,
            color: '#2C2A26', marginBottom: '20px', letterSpacing: '-0.02em',
          }}>
            A voice<br />
            for <span style={{ color: '#2D9B83', fontStyle: 'italic' }}>everyone.</span>
          </h1>

          <p style={{
            fontSize: '1.05rem', lineHeight: 1.7, color: '#6B6860',
            marginBottom: '36px', maxWidth: '420px',
          }}>
            Voca helps non-verbal and minimally verbal individuals communicate — with AI that learns how they speak and gets smarter every week.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={onEnter} style={{
              padding: '14px 28px', background: '#2D9B83', color: 'white',
              border: 'none', borderRadius: '14px', fontSize: '15px',
              fontFamily: 'Nunito, sans-serif', fontWeight: 800,
              cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '-0.01em',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#238A72'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#2D9B83'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Start communicating →
            </button>
            <a href="#how-it-works" style={{
              padding: '14px 24px', background: 'white', color: '#6B6860',
              border: '1.5px solid #E8E6E1', borderRadius: '14px', fontSize: '14px',
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

          <div style={{
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

          <div style={{
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
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '0 2rem 60px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px', background: '#E8E6E1', borderRadius: '16px', overflow: 'hidden',
          border: '1px solid #E8E6E1',
        }}>
          {[
            { num: '97M+',   label: 'people worldwide cannot rely on natural speech',        accent: '#2D9B83' },
            { num: '9,000+', label: 'children diagnosed with autism in Sri Lanka',           accent: '#2D9B83' },
            { num: '0.44',   label: 'speech therapists per 100,000 people in Sri Lanka',     accent: '#C0392B' },
          ].map(({ num, label, accent }) => (
            <div key={num} style={{ background: 'white', padding: '28px 24px', textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '2.2rem',
                color: accent, lineHeight: 1, marginBottom: '6px',
              }}>
                {num}
              </div>
              <div style={{ fontSize: '14.5px', color: '#6B6860', lineHeight: 1.4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{
        background: 'white', borderTop: '1px solid #E8E6E1', borderBottom: '1px solid #E8E6E1',
        padding: '72px 2rem',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{
              display: 'inline-block', padding: '4px 14px',
              background: '#E8F7F4', borderRadius: '100px',
              fontSize: '11px', fontWeight: 600, color: '#2D9B83',
              letterSpacing: '0.06em', marginBottom: '16px',
            }}>
              HOW IT WORKS
            </div>
            <h2 style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 900,
              fontSize: '2.2rem', color: '#2C2A26', margin: '0 0 10px',
              letterSpacing: '-0.02em',
            }}>
              Simple to use. Intelligent underneath.
            </h2>
            <p style={{ fontSize: '1rem', color: '#6B6860', margin: 0 }}>
              Three steps between a thought and a spoken word.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { step: '01', emoji: '🟦', title: 'Tap symbols', desc: 'Choose from thousands of pictographic symbols organised into context boards — home, school, feelings, food.' },
              { step: '02', emoji: '💬', title: 'Build sentences', desc: 'Symbols build up in the sentence bar. AI predicts what comes next based on personal communication patterns.' },
              { step: '03', emoji: '🔊', title: 'Speak', desc: "One tap reads the sentence aloud using the browser's built-in voice. No internet needed. Works on any device." },
            ].map(({ step, emoji, title, desc }) => (
              <div key={step} style={{
                background: '#FAFAF8', borderRadius: '16px', padding: '28px 24px',
                border: '1.5px solid #E8E6E1', position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: '20px', right: '20px',
                  fontFamily: 'DM Mono, monospace', fontSize: '11px',
                  color: '#C4C1BA', fontWeight: 500,
                }}>
                  {step}
                </div>
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>{emoji}</div>
                <div style={{
                  fontFamily: 'Nunito, sans-serif', fontWeight: 800,
                  fontSize: '1.1rem', color: '#2C2A26', marginBottom: '10px',
                }}>
                  {title}
                </div>
                <div style={{ fontSize: '15px', color: '#6B6860', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button onClick={onEnter} style={BTN.primary}
              onMouseEnter={e => { e.currentTarget.style.background = '#238A72'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#2D9B83'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Try it now →
            </button>
          </div>
        </div>
      </section>

      {/* Journal feature */}
      <section id="journal" style={{ padding: '72px 2rem', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'white', borderRadius: '20px', padding: '16px',
              boxShadow: '0 20px 60px rgba(45,155,131,0.10), 0 4px 16px rgba(0,0,0,0.06)',
              border: '1px solid #E8E6E1',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '15px', color: '#2C2A26' }}>My Journal</div>
                  <div style={{ fontSize: '10px', color: '#9B9890' }}>A private space — just for you</div>
                </div>
                <div style={{
                  background: '#2D9B83', borderRadius: '8px', padding: '5px 10px',
                  fontSize: '11px', fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif',
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

            <div style={{
              position: 'absolute', bottom: '-18px', left: '-16px',
              background: 'white', borderRadius: '12px', padding: '8px 14px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.09)', border: '1px solid #E8E6E1',
              zIndex: 2, display: 'flex', alignItems: 'center', gap: '6px',
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
              fontFamily: 'Nunito, sans-serif', fontWeight: 900,
              fontSize: '2.0rem', color: '#2C2A26', margin: '0 0 14px',
              letterSpacing: '-0.02em', lineHeight: 1.1,
            }}>
              A private diary — in their own words.
            </h2>
            <p style={{ fontSize: '1rem', color: '#6B6860', lineHeight: 1.7, marginBottom: '28px' }}>
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
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '15px', color: '#2C2A26', marginBottom: '2px' }}>
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

      {/* AI features */}
      <section id="ai-features" style={{ padding: '72px 2rem', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{
            display: 'inline-block', padding: '4px 14px',
            background: '#FDF3E0', borderRadius: '100px',
            fontSize: '11px', fontWeight: 600, color: '#7A5010',
            letterSpacing: '0.06em', marginBottom: '16px',
          }}>
            AI FEATURES
          </div>
          <h2 style={{
            fontFamily: 'Nunito, sans-serif', fontWeight: 900,
            fontSize: '2.2rem', color: '#2C2A26', margin: '0 0 10px',
            letterSpacing: '-0.02em',
          }}>
            Intelligence no AAC tool has.
          </h2>
          <p style={{ fontSize: '1rem', color: '#6B6860', margin: 0 }}>
            Every feature is woven into the core — not bolted on.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { icon: '⚡', title: 'Predictive suggestions',    desc: 'Predicts the next symbol in real time. Starts with common AAC patterns, gets personal over time.',              bg: '#E8F7F4', border: '#B8E8DF', accent: '#2D9B83' },
            { icon: '🧭', title: 'Adaptive layout',           desc: 'Most-used symbols automatically move to the most accessible positions on the grid.',                           bg: '#E8F7F4', border: '#B8E8DF', accent: '#2D9B83' },
            { icon: '🔍', title: 'Vocabulary gap detection',  desc: "Detects when the individual is browsing for a word they don't have. Tells caregivers exactly what to add.",     bg: '#FDF3E0', border: '#F5DFA0', accent: '#7A5010' },
            { icon: '🎓', title: 'Gemini Vocabulary Coach',   desc: 'Weekly coaching powered by Gemini AI. $150/hr therapist guidance — delivered free, automatically, every week.', bg: '#FDF3E0', border: '#F5DFA0', accent: '#7A5010' },
          ].map(({ icon, title, desc, bg, border }) => (
            <div key={title} style={{
              background: bg, borderRadius: '16px', padding: '24px',
              border: `1.5px solid ${border}`,
            }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '12px' }}>{icon}</div>
              <div style={{
                fontFamily: 'Nunito, sans-serif', fontWeight: 800,
                fontSize: '1rem', color: '#2C2A26', marginBottom: '8px',
              }}>
                {title}
              </div>
              <div style={{ fontSize: '15px', color: '#6B6860', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={onEnter} style={BTN.primary}
            onMouseEnter={e => { e.currentTarget.style.background = '#238A72'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2D9B83'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Start for free →
          </button>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" style={{
        background: 'white', borderTop: '1px solid #E8E6E1', borderBottom: '1px solid #E8E6E1',
        padding: '72px 2rem',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
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
              fontFamily: 'Nunito, sans-serif', fontWeight: 900,
              fontSize: '2.2rem', color: '#2C2A26', margin: '0 0 10px',
              letterSpacing: '-0.02em',
            }}>
              Get in touch
            </h2>
            <p style={{ fontSize: '1rem', color: '#6B6860', margin: 0 }}>
              Questions, feedback, or partnership enquiries — we'd love to hear from you.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              {
                icon: '✉️',
                title: 'General Enquiries',
                desc: 'Questions about Voca, how it works, or how to get started.',
                contact: 'hello@voca.app',
                href: 'mailto:hello@voca.app',
              },
              {
                icon: '🛠️',
                title: 'Technical Support',
                desc: 'Something not working as expected? We\'ll help you sort it out.',
                contact: 'support@voca.app',
                href: 'mailto:support@voca.app',
              },
              {
                icon: '🤝',
                title: 'Partnerships',
                desc: 'Clinics, schools, and NGOs — let\'s talk about working together.',
                contact: 'partner@voca.app',
                href: 'mailto:partner@voca.app',
              },
            ].map(({ icon, title, desc, contact, href }) => (
              <div key={title} style={{
                background: '#FAFAF8', borderRadius: '16px', padding: '28px 24px',
                border: '1.5px solid #E8E6E1', display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: '#E8F7F4', border: '1px solid #B8E8DF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px',
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'Nunito, sans-serif', fontWeight: 800,
                    fontSize: '15px', color: '#2C2A26', marginBottom: '6px',
                  }}>
                    {title}
                  </div>
                  <div style={{ fontSize: '15px', color: '#6B6860', lineHeight: 1.6, marginBottom: '14px' }}>
                    {desc}
                  </div>
                  <a href={href} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontSize: '15px', fontWeight: 600, color: '#2D9B83',
                    textDecoration: 'none', borderBottom: '1.5px solid #B8E8DF',
                    paddingBottom: '1px', transition: 'border-color 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#2D9B83'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#B8E8DF'}
                  >
                    {contact}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Response time note */}
          <div style={{
            marginTop: '32px', padding: '16px 24px',
            background: '#E8F7F4', borderRadius: '12px', border: '1px solid #B8E8DF',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '16px' }}>⏱️</span>
            <span style={{ fontSize: '15px', color: '#2C2A26' }}>
              <strong>We typically respond within 24 hours.</strong>{' '}
              <span style={{ color: '#6B6860' }}>Voca is built by a small team with a big mission — we read every message.</span>
            </span>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ background: '#2D9B83', padding: '72px 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Nunito, sans-serif', fontWeight: 900,
            fontSize: '2.4rem', color: 'white', marginBottom: '14px',
            letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            Free. Always.
          </h2>
          <p style={{
            fontSize: '1rem', color: 'rgba(255,255,255,0.75)',
            marginBottom: '36px', lineHeight: 1.6,
          }}>
            No app store. No download. No cost. Works on any device with a browser — tablet, phone, laptop.
          </p>
          <button onClick={onEnter} style={{
            padding: '16px 40px', background: 'white', color: '#2D9B83',
            border: 'none', borderRadius: '14px', fontSize: '16px',
            fontFamily: 'Nunito, sans-serif', fontWeight: 900,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E8F7F4'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Open Voca →
          </button>

          {/* Footer bottom */}
          <div style={{ marginTop: '52px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '7px',
                background: 'rgba(255,255,255,0.2)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: '11px', fontFamily: 'Nunito, sans-serif' }}>V</span>
              </div>
              <span style={{ color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '15px' }}>Voca</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14.5px', margin: '0 0 20px' }}>
              Built for every family on earth.
            </p>

            {/* Legal links */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <button
                onClick={() => setModal('terms')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '11px', color: 'rgba(255,255,255,0.55)',
                  padding: '4px 8px', borderRadius: '6px', transition: 'color 0.15s',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
              >
                Terms of Service
              </button>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>·</span>
              <button
                onClick={() => setModal('privacy')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '11px', color: 'rgba(255,255,255,0.55)',
                  padding: '4px 8px', borderRadius: '6px', transition: 'color 0.15s',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
              >
                Privacy Policy
              </button>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>·</span>
              <a href="#contact" style={{
                fontSize: '11px', color: 'rgba(255,255,255,0.55)',
                textDecoration: 'none', padding: '4px 8px', borderRadius: '6px',
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
              >
                Contact
              </a>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>·</span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>© 2026 Voca</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
