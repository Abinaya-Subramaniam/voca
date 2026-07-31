import { useState } from 'react'
import { login, register, kidLogin } from '../../api'
import Navbar from '../shared/Navbar'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function PasswordField({ id, label, value, onChange, autoComplete, placeholder, show, onToggleShow, error, hint }) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between mb-1.5">
        <label htmlFor={id} className="font-sans font-semibold text-warm-700 text-sm">
          {label}
        </label>
      </div>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none">
          <LockIcon />
        </span>
        <input
          id={id}
          name={id}
          type={show ? 'text' : 'password'}
          required
          autoComplete={autoComplete}
          className={`w-full border rounded-xl pl-10 pr-11 py-3 font-sans text-warm-900 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-warm-400 transition-colors ${
            error ? 'border-red-300' : 'border-warm-200'
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={onToggleShow}
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-warm-400 hover:text-warm-700 transition-colors rounded-md"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {hint}
      {error && <p className="text-[12.5px] font-sans text-red-500 mt-1.5">{error}</p>}
    </div>
  )
}

export default function AuthPage({ onAuthed, onBackToLanding }) {
  const [loginAs, setLoginAs] = useState('caregiver') // 'caregiver' | 'kid'
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const [kidUsername, setKidUsername] = useState('')
  const [kidPin, setKidPin] = useState('')
  const [kidTouched, setKidTouched] = useState(false)
  const [kidError, setKidError] = useState(null)
  const [kidLoading, setKidLoading] = useState(false)

  const isRegister = mode === 'register'
  const nameValid = name.trim().length > 0
  const emailValid = EMAIL_RE.test(email.trim())
  const passwordLongEnough = password.length >= 8
  const passwordsMatch = !isRegister || password === confirmPassword
  const confirmError = touched && isRegister && confirmPassword && !passwordsMatch
    ? 'Passwords do not match'
    : null

  const canSubmit = emailValid
    && (isRegister ? nameValid : true)
    && (isRegister ? passwordLongEnough : password.length > 0)
    && (isRegister ? confirmPassword === password : true)
    && !loading

  function switchMode() {
    setMode(m => (m === 'login' ? 'register' : 'login'))
    setName('')
    setPassword('')
    setConfirmPassword('')
    setTouched(false)
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (!canSubmit) return

    setError(null)
    setLoading(true)
    try {
      const user = mode === 'login'
        ? await login(email.trim(), password)
        : await register(name.trim(), email.trim(), password)
      onAuthed(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function switchLoginAs(next) {
    setLoginAs(next)
    setError(null)
    setKidError(null)
    setTouched(false)
    setKidTouched(false)
  }

  const kidUsernameValid = kidUsername.trim().length >= 3
  const kidPinValid = /^\d{4}$/.test(kidPin)
  const kidCanSubmit = kidUsernameValid && kidPinValid && !kidLoading

  async function handleKidSubmit(e) {
    e.preventDefault()
    setKidTouched(true)
    if (!kidCanSubmit) return

    setKidError(null)
    setKidLoading(true)
    try {
      await kidLogin(kidUsername.trim(), kidPin)
      onAuthed(null)
    } catch (err) {
      setKidError(err.message)
    } finally {
      setKidLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <Navbar onLogoClick={onBackToLanding}>
        {onBackToLanding && (
          <button onClick={onBackToLanding} style={{
            fontSize: '14px', fontWeight: 600, color: '#4A473F',
            padding: '9px 16px', borderRadius: '100px',
            border: '1px solid rgba(232,230,225,0.9)', background: 'rgba(255,255,255,0.55)',
            transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: '6px',
            cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2D9B83'; e.currentTarget.style.color = '#2D9B83'; e.currentTarget.style.background = 'rgba(255,255,255,0.9)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,230,225,0.9)'; e.currentTarget.style.color = '#4A473F'; e.currentTarget.style.background = 'rgba(255,255,255,0.55)' }}
          >
            Back to Home
          </button>
        )}
      </Navbar>

      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-2xl shadow-raised p-8 w-full max-w-md border border-warm-200 my-auto">

        <img src="https://i.imgur.com/3vT9jwF.jpeg" alt="Voca" className="w-12 h-12 rounded-xl object-cover mb-4 shadow-subtle" />

        {/* I'm a caregiver / I'm a communicator */}
        <div className="flex gap-2 p-2 mb-7 bg-warm-100 rounded-xl">
          {[
            { id: 'caregiver', label: "I'm a caregiver" },
            { id: 'kid', label: "I'm a communicator" },
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => switchLoginAs(opt.id)}
              className={`flex-1 py-3 px-3 rounded-lg font-sans text-base font-semibold text-center whitespace-nowrap transition-colors ${
                loginAs === opt.id
                  ? 'bg-white text-teal-600 shadow-subtle'
                  : 'text-warm-500 hover:text-warm-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loginAs === 'kid' ? (
          <>
            <h2 className="font-display font-bold text-warm-900 text-2xl mb-1">
              Log in
            </h2>
            <p className="font-sans text-warm-500 text-sm mb-6">
              Ask your caregiver for your username and PIN.
            </p>

            <form onSubmit={handleKidSubmit} noValidate>
              <div className="mb-4">
                <label htmlFor="kidUsername" className="block font-sans font-semibold text-warm-700 text-sm mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none">
                    <UserIcon />
                  </span>
                  <input
                    id="kidUsername"
                    name="kidUsername"
                    type="text"
                    required
                    autoComplete="username"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 font-sans text-warm-900 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-warm-400 transition-colors ${
                      kidTouched && !kidUsernameValid ? 'border-red-300' : 'border-warm-200'
                    }`}
                    placeholder="e.g. layla"
                    value={kidUsername}
                    onChange={e => setKidUsername(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="kidPin" className="block font-sans font-semibold text-warm-700 text-sm mb-1.5">
                  PIN
                </label>
                <input
                  id="kidPin"
                  name="kidPin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  required
                  autoComplete="current-password"
                  className={`w-full border rounded-xl px-4 py-3 font-sans text-warm-900 text-2xl text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-warm-300 placeholder:tracking-normal placeholder:text-base transition-colors ${
                    kidTouched && !kidPinValid ? 'border-red-300' : 'border-warm-200'
                  }`}
                  placeholder="4-digit PIN"
                  value={kidPin}
                  onChange={e => setKidPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                />
              </div>

              {kidError && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-[13.5px] font-sans text-red-600 mb-4">
                  {kidError}
                </div>
              )}

              <button
                type="submit"
                disabled={kidTouched ? !kidCanSubmit : kidLoading}
                className="w-full py-3 rounded-xl bg-teal-500 text-white font-display font-bold hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                {kidLoading && (
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                )}
                {kidLoading ? 'Please wait...' : 'Log in'}
              </button>
            </form>
          </>
        ) : (
        <>
        <h2 className="font-display font-bold text-warm-900 text-2xl mb-1">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="font-sans text-warm-500 text-sm mb-6">
          {isRegister
            ? 'One caregiver account manages all profiles.'
            : 'Sign in to access your profiles.'}
        </p>

        <form onSubmit={handleSubmit} noValidate>

          {/* Name — register only */}
          {isRegister && (
            <div className="mb-4">
              <label htmlFor="name" className="block font-sans font-semibold text-warm-700 text-xs mb-1.5">
                Full name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none">
                  <UserIcon />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className={`w-full border rounded-xl pl-10 pr-4 py-3 font-sans text-warm-900 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-warm-400 transition-colors ${
                    touched && !nameValid ? 'border-red-300' : 'border-warm-200'
                  }`}
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
              </div>
              {touched && !nameValid && (
                <p className="text-[12.5px] font-sans text-red-500 mt-1.5">Enter your name</p>
              )}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block font-sans font-semibold text-warm-700 text-sm mb-1.5">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none">
                <MailIcon />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={`w-full border rounded-xl pl-10 pr-4 py-3 font-sans text-warm-900 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-warm-400 transition-colors ${
                  touched && email && !emailValid ? 'border-red-300' : 'border-warm-200'
                }`}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus={!isRegister}
              />
            </div>
            {touched && email && !emailValid && (
              <p className="text-[12.5px] font-sans text-red-500 mt-1.5">Enter a valid email address</p>
            )}
          </div>

          {/* Password */}
          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            placeholder={isRegister ? 'Create a password' : 'Enter your password'}
            show={showPassword}
            onToggleShow={() => setShowPassword(v => !v)}
            error={touched && isRegister && password && !passwordLongEnough ? 'Must be at least 8 characters' : null}
            hint={isRegister && (
              <div className={`flex items-center gap-1.5 mt-1.5 text-[12.5px] font-sans transition-colors ${
                passwordLongEnough ? 'text-teal-600' : 'text-warm-400'
              }`}>
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  passwordLongEnough ? 'bg-teal-500 text-white' : 'bg-warm-200 text-transparent'
                }`}>
                  <CheckIcon />
                </span>
                At least 8 characters
              </div>
            )}
          />

          {/* Confirm password — register only */}
          {isRegister && (
            <PasswordField
              id="confirmPassword"
              label="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              show={showConfirm}
              onToggleShow={() => setShowConfirm(v => !v)}
              error={confirmError}
            />
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-[13.5px] font-sans text-red-600 mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={touched ? !canSubmit : loading}
            className="w-full py-3 rounded-xl bg-teal-500 text-white font-display font-bold hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-subtle flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <button
          onClick={switchMode}
          className="w-full mt-4 text-sm font-sans text-warm-500 hover:text-teal-600 transition-colors"
        >
          {isRegister ? 'Already have an account? Sign in' : 'No account yet? Create one'}
        </button>
        </>
        )}

      </div>
      </div>
    </div>
  )
}
