export default function LandingPage({ onEnter }) {
  return (
    <div className="h-screen overflow-y-auto" style={{ background: '#FAFAF8', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

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
            <span style={{ color: 'white', fontWeight: 800, fontSize: '13px', fontFamily: 'Nunito, sans-serif' }}>V</span>
          </div>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '17px', color: '#2C2A26' }}>Voca</span>
        </div>
        <button onClick={onEnter} style={{
          padding: '8px 20px', background: '#2D9B83', color: 'white',
          border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
          cursor: 'pointer', fontFamily: 'Nunito, sans-serif', letterSpacing: '0.01em',
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.target.style.background = '#238A72'}
          onMouseLeave={e => e.target.style.background = '#2D9B83'}
        >
          Open App →
        </button>
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
          {/* Main board mockup */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: '16px',
            boxShadow: '0 20px 60px rgba(45,155,131,0.12), 0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid #E8E6E1',
          }}>
            {/* Sentence bar mock */}
            <div style={{
              background: '#F2F1EE', borderRadius: '12px', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px',
            }}>
              {['I', 'want', 'juice'].map(w => (
                <div key={w} style={{
                  background: '#E8F7F4', border: '1px solid #B8E8DF',
                  borderRadius: '8px', padding: '5px 10px',
                  fontSize: '12px', fontWeight: 600, color: '#2D9B83',
                }}>
                  {w}
                </div>
              ))}
              <div style={{ marginLeft: 'auto', background: '#2D9B83', borderRadius: '8px', padding: '6px 14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>🔊 Speak</span>
              </div>
            </div>

            {/* Symbol grid mock */}
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

          {/* Floating coach card */}
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

          {/* Floating prediction badge */}
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
      <section style={{
        maxWidth: '860px', margin: '0 auto', padding: '0 2rem 60px',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px', background: '#E8E6E1', borderRadius: '16px', overflow: 'hidden',
          border: '1px solid #E8E6E1',
        }}>
          {[
            { num: '97M+',   label: 'people worldwide cannot rely on natural speech',          accent: '#2D9B83' },
            { num: '9,000+', label: 'children diagnosed with autism in Sri Lanka',             accent: '#2D9B83' },
            { num: '0.44',   label: 'speech therapists per 100,000 people in Sri Lanka',       accent: '#C0392B' },
          ].map(({ num, label, accent }) => (
            <div key={num} style={{
              background: 'white', padding: '28px 24px', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '2.2rem',
                color: accent, lineHeight: 1, marginBottom: '6px',
              }}>
                {num}
              </div>
              <div style={{ fontSize: '12px', color: '#6B6860', lineHeight: 1.4 }}>
                {label}
              </div>
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
              { step: '03', emoji: '🔊', title: 'Speak', desc: 'One tap reads the sentence aloud using the browser\'s built-in voice. No internet needed. Works on any device.' },
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
                <div style={{ fontSize: '13px', color: '#6B6860', lineHeight: 1.6 }}>
                  {desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button onClick={onEnter} style={{
              padding: '13px 32px', background: '#2D9B83', color: 'white',
              border: 'none', borderRadius: '12px', fontSize: '14px',
              fontFamily: 'Nunito, sans-serif', fontWeight: 800,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
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
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center',
        }}>
          {/* Journal mockup */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'white', borderRadius: '20px', padding: '16px',
              boxShadow: '0 20px 60px rgba(45,155,131,0.10), 0 4px 16px rgba(0,0,0,0.06)',
              border: '1px solid #E8E6E1',
            }}>
              {/* Journal header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '14px',
              }}>
                <div>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '13px', color: '#2C2A26' }}>My Journal</div>
                  <div style={{ fontSize: '10px', color: '#9B9890' }}>A private space — just for you</div>
                </div>
                <div style={{
                  background: '#2D9B83', borderRadius: '8px', padding: '5px 10px',
                  fontSize: '11px', fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif',
                }}>
                  + New entry
                </div>
              </div>

              {/* Mood bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 10px', background: '#E8F7F4', borderRadius: '10px',
                border: '1px solid #B8E8DF', marginBottom: '12px',
              }}>
                <span style={{ fontSize: '16px' }}>😊</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#2D9B83' }}>Feeling happy</span>
              </div>

              {/* Journal entries mock */}
              {[
                { mood: '😊', label: 'happy', date: 'Today', words: ['I', 'want', 'play', 'park'] },
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

            {/* Floating privacy badge */}
            <div style={{
              position: 'absolute', bottom: '-18px', left: '-16px',
              background: 'white', borderRadius: '12px', padding: '8px 14px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.09)', border: '1px solid #E8E6E1',
              zIndex: 2, display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span style={{ fontSize: '13px' }}>🔒</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B6860' }}>Private — only visible to you</span>
            </div>

          </div>

          {/* Text */}
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
            <p style={{
              fontSize: '1rem', color: '#6B6860', lineHeight: 1.7, marginBottom: '28px',
            }}>
              The Journal lets individuals record their day, feelings, and thoughts using the same symbols they communicate with. No text to type — just tap and save.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: '🌅', title: 'Mood check-in', desc: 'Start every entry by picking a mood symbol.' },
                { icon: '🔤', title: 'Symbol sentences', desc: 'Build thoughts by tapping symbols — the same way they speak.' },
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
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '13px', color: '#2C2A26', marginBottom: '2px' }}>
                      {title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B6860', lineHeight: 1.5 }}>
                      {desc}
                    </div>
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
            { icon: '⚡', title: 'Predictive suggestions', desc: 'Predicts the next symbol in real time. Starts with common AAC patterns, gets personal over time.', bg: '#E8F7F4', border: '#B8E8DF', accent: '#2D9B83' },
            { icon: '🧭', title: 'Adaptive layout', desc: 'Most-used symbols automatically move to the most accessible positions on the grid.', bg: '#E8F7F4', border: '#B8E8DF', accent: '#2D9B83' },
            { icon: '🔍', title: 'Vocabulary gap detection', desc: 'Detects when the individual is browsing for a word they don\'t have. Tells caregivers exactly what to add.', bg: '#FDF3E0', border: '#F5DFA0', accent: '#7A5010' },
            { icon: '🎓', title: 'Gemini Vocabulary Coach', desc: 'Weekly coaching powered by Gemini AI. $150/hr therapist guidance — delivered free, automatically, every week.', bg: '#FDF3E0', border: '#F5DFA0', accent: '#7A5010' },
          ].map(({ icon, title, desc, bg, border, accent }) => (
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
              <div style={{ fontSize: '13px', color: '#6B6860', lineHeight: 1.6 }}>
                {desc}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={onEnter} style={{
            padding: '13px 32px', background: '#2D9B83', color: 'white',
            border: 'none', borderRadius: '12px', fontSize: '14px',
            fontFamily: 'Nunito, sans-serif', fontWeight: 800,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#238A72'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2D9B83'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Start for free →
          </button>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{
        background: '#2D9B83', padding: '72px 2rem', textAlign: 'center',
      }}>
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
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>
              Built for every family on earth.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}