import { useState } from 'react'
import { login, register } from '../../api'

export default function AuthPage({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return
    setError(null)
    setLoading(true)
    try {
      const user = mode === 'login'
        ? await login(email.trim(), password)
        : await register(email.trim(), password)
      onAuthed(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
      <div className="bg-white rounded-2xl shadow-raised p-8 w-full max-w-sm border border-warm-200">

        <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center mb-4 shadow-subtle">
          <span className="text-white font-display font-bold text-xl">V</span>
        </div>

        <h2 className="font-display font-bold text-warm-900 text-2xl mb-1">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="font-sans text-warm-500 text-sm mb-6">
          {mode === 'login'
            ? 'Sign in to access your profiles.'
            : 'One caregiver account manages all profiles.'}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            required
            className="w-full border border-warm-200 rounded-xl px-4 py-3 font-sans text-warm-900 text-base mb-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-warm-400"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            required
            minLength={8}
            className="w-full border border-warm-200 rounded-xl px-4 py-3 font-sans text-warm-900 text-base mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-warm-400"
            placeholder={mode === 'login' ? 'Password' : 'Password (min 8 characters)'}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-[13.5px] font-sans text-red-600 mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || password.length < 8}
            className="w-full py-3 rounded-xl bg-teal-500 text-white font-display font-bold hover:bg-teal-600 disabled:opacity-40 transition-colors shadow-subtle"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          onClick={() => { setMode(m => (m === 'login' ? 'register' : 'login')); setError(null) }}
          className="w-full mt-4 text-sm font-sans text-warm-500 hover:text-teal-600 transition-colors"
        >
          {mode === 'login' ? "No account yet? Create one" : 'Already have an account? Sign in'}
        </button>

      </div>
    </div>
  )
}
