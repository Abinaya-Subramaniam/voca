import { createContext, useContext, useReducer, useEffect, useMemo, useCallback, useRef, useState } from 'react'
import * as api from '../api'
import { isAuthenticated, onUnauthorized } from '../api/client'

const AppContext = createContext(null)

const ACTIVE_KEY = 'voca_active_profile'

const initialState = {
  profiles: [],
  activeProfileId: null,
  activeProfile: null,
  boards: [],
  activeBoardId: null,
  sentenceBuffer: [],
  view: 'board',
  mode: 'user',
}

function getModeForProfile(profileId) {
  return sessionStorage.getItem(`voca_mode_${profileId}`) || 'user'
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
        mode: action.activeProfileId ? getModeForProfile(action.activeProfileId) : 'user',
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
        mode: 'user',
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
        mode: getModeForProfile(action.profile.id),
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

    case 'SET_MODE': {
      if (state.activeProfileId) {
        sessionStorage.setItem(`voca_mode_${state.activeProfileId}`, action.mode)
      }
      return { ...state, mode: action.mode }
    }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, baseDispatch] = useReducer(reducer, initialState)
  const [authed, setAuthed] = useState(isAuthenticated())
  const [booting, setBooting] = useState(isAuthenticated())
  const profileIdRef = useRef(null)
  profileIdRef.current = state.activeProfileId

  const selectProfile = useCallback(async (profileId) => {
    if (!profileId) {
      localStorage.removeItem(ACTIVE_KEY)
      baseDispatch({ type: 'CLEAR_ACTIVE_PROFILE' })
      return
    }
    localStorage.setItem(ACTIVE_KEY, profileId)
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

  // Boot: load profiles and restore the active one
  useEffect(() => {
    if (!authed) return
    let cancelled = false
    async function boot() {
      try {
        const profiles = await api.listProfiles()
        if (cancelled) return
        const storedId = localStorage.getItem(ACTIVE_KEY)
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
    selectProfile,
    refreshBoards,
    refreshProfiles,
  }), [state, dispatch, authed, booting, selectProfile, refreshBoards, refreshProfiles])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
