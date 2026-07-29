import { createContext, useContext, useReducer, useEffect, useMemo, useCallback, useRef, useState } from 'react'
import * as api from '../api'
import { isAuthenticated, onUnauthorized, getActiveScope, ACTIVE_PROFILE_KEY } from '../api/client'

const AppContext = createContext(null)

const initialState = {
  profiles: [],
  activeProfileId: null,
  activeProfile: null,
  boards: [],
  activeBoardId: null,
  sentenceBuffer: [],
  view: 'board',
}

function reducer(state, action) {
  switch (action.type) {

    case 'INIT': {
      return {
        ...state,
        profiles: action.profiles,
        activeProfileId: action.activeProfileId,
        activeProfile: action.activeProfile,
        boards: action.boards,
        activeBoardId: action.boards[0]?.id || null,
      }
    }

    case 'CLEAR_ACTIVE_PROFILE': {
      return {
        ...state,
        activeProfileId: null,
        activeProfile: null,
        boards: [],
        activeBoardId: null,
        sentenceBuffer: [],
      }
    }

    case 'PROFILE_LOADED': {
      return {
        ...state,
        activeProfileId: action.profile.id,
        activeProfile: action.profile,
        boards: action.boards,
        activeBoardId: action.boards[0]?.id || null,
        sentenceBuffer: [],
      }
    }

    case 'BOARDS_LOADED': {
      return {
        ...state,
        boards: action.boards,
        activeBoardId: action.boards.find(b => b.id === state.activeBoardId)
          ? state.activeBoardId
          : action.boards[0]?.id || null,
      }
    }

    case 'PROFILES_LOADED': {
      return { ...state, profiles: action.profiles }
    }

    case 'PROFILE_UPDATED': {
      return {
        ...state,
        activeProfile: action.profile,
        profiles: state.profiles.map(p => (p.id === action.profile.id ? action.profile : p)),
      }
    }

    case 'SET_ACTIVE_BOARD':
      return { ...state, activeBoardId: action.boardId }

    case 'ADD_TO_SENTENCE': {
      if (state.sentenceBuffer.length >= 20) return state
      return { ...state, sentenceBuffer: [...state.sentenceBuffer, action.symbol] }
    }

    case 'CLEAR_SENTENCE':
      return { ...state, sentenceBuffer: [] }

    case 'REMOVE_LAST_SYMBOL':
      return { ...state, sentenceBuffer: state.sentenceBuffer.slice(0, -1) }

    case 'SET_VIEW':
      return { ...state, view: action.view }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, baseDispatch] = useReducer(reducer, initialState)
  const [authed, setAuthed] = useState(isAuthenticated())
  const [booting, setBooting] = useState(isAuthenticated())
  const [user, setUser] = useState(null)
  const profileIdRef = useRef(null)
  profileIdRef.current = state.activeProfileId

  const selectProfile = useCallback(async (profileId) => {
    if (!profileId) {
      localStorage.removeItem(ACTIVE_PROFILE_KEY)
      baseDispatch({ type: 'CLEAR_ACTIVE_PROFILE' })
      return
    }
    localStorage.setItem(ACTIVE_PROFILE_KEY, profileId)
    const [profile, boards] = await Promise.all([
      api.getProfile(profileId),
      api.listBoards(profileId),
    ])
    baseDispatch({ type: 'PROFILE_LOADED', profile, boards })
    // Server-side adaptive layout: reorder by decay-weighted usage, then refresh
    api.optimiseLayout(profileId)
      .then(({ changed }) => {
        if (changed) {
          api.listBoards(profileId).then(fresh =>
            baseDispatch({ type: 'BOARDS_LOADED', boards: fresh })
          )
        }
      })
      .catch(() => {})
  }, [])

  const refreshBoards = useCallback(async () => {
    const profileId = profileIdRef.current
    if (!profileId) return
    const boards = await api.listBoards(profileId)
    baseDispatch({ type: 'BOARDS_LOADED', boards })
  }, [])

  const refreshProfiles = useCallback(async () => {
    const profiles = await api.listProfiles()
    baseDispatch({ type: 'PROFILES_LOADED', profiles })
  }, [])

  const refreshActiveProfile = useCallback(async () => {
    const profileId = profileIdRef.current
    if (!profileId) return
    const profile = await api.getProfile(profileId)
    baseDispatch({ type: 'PROFILE_UPDATED', profile })
  }, [])

  // Compatibility dispatch: async data actions are routed through the API;
  // pure UI actions hit the reducer directly.
  const dispatch = useCallback((action) => {
    switch (action.type) {
      case 'SET_ACTIVE_PROFILE':
        selectProfile(action.profileId).catch(err => console.error('selectProfile:', err))
        return
      case 'REFRESH_BOARDS':
        refreshBoards().catch(err => console.error('refreshBoards:', err))
        return
      case 'REFRESH_PROFILES':
        refreshProfiles().catch(err => console.error('refreshProfiles:', err))
        return
      case 'REFRESH_ACTIVE_PROFILE':
        refreshActiveProfile().catch(err => console.error('refreshActiveProfile:', err))
        return
      default:
        baseDispatch(action)
    }
  }, [selectProfile, refreshBoards, refreshProfiles, refreshActiveProfile])

  // Boot: load the account, profiles, and restore the active one
  useEffect(() => {
    if (!authed) { setUser(null); return }
    // Covers the gap between a fresh login resolving and this effect's INIT
    // landing — without it, activeProfileId is briefly null while booting is
    // already false, which can bounce a brand-new kid session through /profiles.
    setBooting(true)
    let cancelled = false

    // A board session is scoped to exactly one profile — it can't call listProfiles
    // or getMe (both require a caregiver token), and must never enumerate siblings.
    async function bootBoard() {
      const profileId = localStorage.getItem(ACTIVE_PROFILE_KEY)
      if (!profileId) { setAuthed(false); return }
      const [profile, boards] = await Promise.all([
        api.getProfile(profileId),
        api.listBoards(profileId),
      ])
      if (cancelled) return
      setUser(null)
      baseDispatch({ type: 'INIT', profiles: [], activeProfileId: profile.id, activeProfile: profile, boards })
    }

    async function bootCaregiver() {
      const [profiles, me] = await Promise.all([
        api.listProfiles(),
        api.getMe().catch(() => null),
      ])
      if (cancelled) return
      setUser(me)
      const storedId = localStorage.getItem(ACTIVE_PROFILE_KEY)
      const resolved = profiles.find(p => p.id === storedId) || null
      if (resolved) {
        const boards = await api.listBoards(resolved.id)
        if (cancelled) return
        baseDispatch({
          type: 'INIT',
          profiles,
          activeProfileId: resolved.id,
          activeProfile: resolved,
          boards,
        })
        api.optimiseLayout(resolved.id).catch(() => {})
      } else {
        baseDispatch({ type: 'INIT', profiles, activeProfileId: null, activeProfile: null, boards: [] })
      }
    }

    async function boot() {
      try {
        await (getActiveScope() === 'board' ? bootBoard() : bootCaregiver())
      } catch (err) {
        console.error('Boot failed:', err)
      } finally {
        if (!cancelled) setBooting(false)
      }
    }
    boot()
    return () => { cancelled = true }
  }, [authed])

  // Token expired or revoked → back to login
  useEffect(() => onUnauthorized(() => setAuthed(false)), [])

  const value = useMemo(() => ({
    state,
    dispatch,
    authed,
    setAuthed,
    booting,
    user,
    selectProfile,
    refreshBoards,
    refreshProfiles,
  }), [state, dispatch, authed, booting, user, selectProfile, refreshBoards, refreshProfiles])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
