import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { createProfile } from '../../store/profileStore'

const COLORS = [
  '#2D9B83', '#E8534A', '#7B8FF5',
  '#F5A623', '#4CAF7D', '#E07B9A',
]

function slugify(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
}

function randomDigits(n) {
  return String(Math.floor(Math.random() * 10 ** n)).padStart(n, '0')
}

function suggestUsername(name) {
  const base = slugify(name).slice(0, 20) || 'communicator'
  return base + randomDigits(3)
}

export default function ProfileSelector() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [name, setName]         = useState('')
  const [color, setColor]       = useState(COLORS[0])
  const [username, setUsername] = useState('')
  const [usernameEdited, setUsernameEdited] = useState(false)
  const [pin, setPin]           = useState(randomDigits(4))
  const [createError, setCreateError] = useState(null)
  const [creatingBusy, setCreatingBusy] = useState(false)
  const [createdCredentials, setCreatedCredentials] = useState(null)

  function handleSelect(profileId) {
    dispatch({ type: 'SET_ACTIVE_PROFILE', profileId })
    navigate('/caregiver/overview')
  }

  function handleNameChange(value) {
    setName(value)
    if (!usernameEdited) setUsername(suggestUsername(value))
  }

  function handleUsernameChange(value) {
    setUsernameEdited(true)
    setUsername(value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
  }

  const usernameValid = username.trim().length >= 3
  const pinValid = /^\d{4}$/.test(pin)
  const canCreate = name.trim() && usernameValid && pinValid && !creatingBusy

  async function handleCreate() {
    if (!canCreate) return
    setCreateError(null)
    setCreatingBusy(true)
    try {
      const profile = await createProfile(name.trim(), color, username.trim(), pin)
      dispatch({ type: 'REFRESH_PROFILES' })
      setCreatedCredentials({ id: profile.id, name: profile.name, username: profile.username, pin })
    } catch (err) {
      setCreateError(err.message)
    } finally {
      setCreatingBusy(false)
    }
  }

  function finishCreating() {
    const profileId = createdCredentials.id
    setCreating(false)
    setName('')
    setUsername('')
    setUsernameEdited(false)
    setPin(randomDigits(4))
    setCreatedCredentials(null)
    dispatch({ type: 'SET_ACTIVE_PROFILE', profileId })
    navigate('/caregiver/overview')
  }

  // One-time "here are the login details" confirmation — the PIN can never be
  // shown again once it leaves this screen, since only its hash is stored.
  if (createdCredentials) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'var(--color-bg)' }}>
        <div className="bg-white rounded-2xl shadow-raised p-8 w-full max-w-sm border border-warm-200">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
            <span className="text-2xl">🎉</span>
          </div>
          <h2 className="font-display font-bold text-warm-900 text-2xl mb-1">
            {createdCredentials.name} is ready
          </h2>
          <p className="font-sans text-warm-500 text-sm mb-5">
            Give {createdCredentials.name} these login details. The PIN won't be shown again —
            you can always reset it later from Settings.
          </p>

          <div className="bg-warm-50 border border-warm-200 rounded-xl p-4 mb-6 space-y-3">
            <div>
              <div className="font-sans text-warm-400 text-xs mb-0.5">Username</div>
              <div className="font-display font-bold text-warm-900 text-lg">{createdCredentials.username}</div>
            </div>
            <div>
              <div className="font-sans text-warm-400 text-xs mb-0.5">PIN</div>
              <div className="font-display font-bold text-warm-900 text-lg tracking-[0.3em]">{createdCredentials.pin}</div>
            </div>
          </div>

          <button
            onClick={finishCreating}
            className="w-full py-3 rounded-xl bg-teal-500 text-white font-display font-bold hover:bg-teal-600 transition-colors shadow-subtle"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  if (state.profiles.length === 0 || creating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #E8F7F4 55%, #D9F1EA 100%)' }}>
        <div className="bg-white rounded-2xl shadow-raised p-8 w-full max-w-sm border border-warm-200">

          <img src="https://i.imgur.com/3vT9jwF.jpeg" alt="Voca" className="w-12 h-12 rounded-xl object-cover mb-4 shadow-subtle" />

          <h2 className="font-display font-bold text-warm-900 text-2xl mb-1">
            {state.profiles.length === 0 ? 'Welcome to Voca' : 'Add a communicator'}
          </h2>
          <p className="font-sans text-warm-500 text-sm mb-6">
            {state.profiles.length === 0
              ? 'Create a profile to get started.'
              : "This creates their own login — you'll get their username and PIN to hand over."}
          </p>

          <input
            className="w-full border border-warm-200 rounded-xl px-4 py-3 font-sans text-warm-900 text-base mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-warm-400"
            placeholder="Name (e.g. Layla)"
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            autoFocus
          />

          <div className="mb-4">
            <label className="block font-sans text-warm-500 text-xs mb-1.5">Username</label>
            <input
              className="w-full border border-warm-200 rounded-xl px-4 py-3 font-sans text-warm-900 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-warm-400"
              placeholder="username"
              value={username}
              onChange={e => handleUsernameChange(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block font-sans text-warm-500 text-xs mb-1.5">PIN</label>
            <input
              className="w-full border border-warm-200 rounded-xl px-4 py-3 font-sans text-warm-900 text-lg text-center tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            />
          </div>

          <div className="mb-6">
            <div className="font-sans text-warm-500 text-xs mb-2">Choose a colour</div>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-9 h-9 rounded-full transition-all hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: c }}
                >
                  {color === c && (
                    <span className="text-white text-sm font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {createError && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-[13.5px] font-sans text-red-600 mb-4">
              {createError}
            </div>
          )}

          <div className="flex gap-2">
            {state.profiles.length > 0 && (
              <button
                onClick={() => setCreating(false)}
                className="flex-1 py-3 rounded-xl border border-warm-200 font-sans font-500 text-warm-600 hover:bg-warm-100 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleCreate}
              disabled={!canCreate}
              className="flex-1 py-3 rounded-xl bg-teal-500 text-white font-display font-bold hover:bg-teal-600 disabled:opacity-40 transition-colors shadow-subtle"
            >
              {creatingBusy ? 'Creating…' : 'Create profile'}
            </button>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #E8F7F4 55%, #D9F1EA 100%)' }}>

      <h1
        className="font-display font-black text-3xl sm:text-4xl mb-6 text-center"
        style={{ letterSpacing: '-0.02em', color: '#14523F' }}
      >
        Select a profile
      </h1>

      <div className="bg-white rounded-2xl shadow-raised p-8 w-full max-w-sm border border-warm-200">

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 mb-6 hover:opacity-75 transition-opacity text-left"
        >
          <img src="https://i.imgur.com/3vT9jwF.jpeg" alt="Voca" className="w-11 h-11 rounded-xl object-cover shadow-subtle" />
          <div>
            <h2 className="font-display font-bold text-warm-900 text-2xl leading-none"><span style={{ color: '#238A72' }}>V</span>oca</h2>
            <p className="font-sans text-warm-400 text-sm mt-1">Who are you managing today?</p>
          </div>
        </button>

        <div className="flex flex-col gap-2 mb-5">
          {state.profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => handleSelect(profile.id)}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-warm-200 hover:border-teal-500 hover:bg-teal-50 transition-all text-left group"
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: profile.avatarColor }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-sans font-600 text-warm-900 text-lg truncate">{profile.name}</div>
              </div>
              <svg className="w-5 h-5 text-warm-300 group-hover:text-teal-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          ))}
        </div>

        {state.profiles.length < 3 && (
          <button
            onClick={() => setCreating(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-warm-200 font-sans font-500 text-warm-400 hover:border-teal-400 hover:text-teal-500 transition-colors text-base"
          >
            + Add a communicator
          </button>
        )}

      </div>
    </div>
  )
}
