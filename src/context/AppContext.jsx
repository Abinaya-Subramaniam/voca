import { createContext, useContext, useReducer, useEffect } from 'react'
import { storage } from '../services/storage'
import {
  getAllProfiles,
  getActiveProfileId,
  setActiveProfile,
  getProfile,
} from '../store/profileStore'
import { getBoardsForProfile } from '../store/boardStore'
import { runLayoutOptimiser } from '../engine/layoutOptimiser'
import { migrateSymbolIds, migrateMissingBoards } from '../services/symbolService'

const AppContext = createContext(null)

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

    case 'SET_ACTIVE_PROFILE': {
      if (!action.profileId) {
        storage.remove('voca_active_profile')
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
      setActiveProfile(action.profileId)
      const boards = getBoardsForProfile(action.profileId)
      return {
        ...state,
        activeProfileId: action.profileId,
        activeProfile: getProfile(action.profileId),
        boards,
        activeBoardId: boards[0]?.id || null,
        sentenceBuffer: [],
        mode: getModeForProfile(action.profileId),
      }
    }

    case 'SET_ACTIVE_BOARD': {
      return { ...state, activeBoardId: action.boardId }
    }

    case 'ADD_TO_SENTENCE': {
      if (state.sentenceBuffer.length >= 20) return state
      return {
        ...state,
        sentenceBuffer: [...state.sentenceBuffer, action.symbol],
      }
    }

    case 'CLEAR_SENTENCE': {
      return { ...state, sentenceBuffer: [] }
    }

    case 'REMOVE_LAST_SYMBOL': {
      return {
        ...state,
        sentenceBuffer: state.sentenceBuffer.slice(0, -1),
      }
    }

    case 'SET_VIEW': {
      return { ...state, view: action.view }
    }

    case 'SET_MODE': {
      if (state.activeProfileId) {
        sessionStorage.setItem(`voca_mode_${state.activeProfileId}`, action.mode)
      }
      return { ...state, mode: action.mode }
    }

    case 'REFRESH_BOARDS': {
      const boards = getBoardsForProfile(state.activeProfileId)
      return {
        ...state,
        boards,
        activeBoardId: boards.find(b => b.id === state.activeBoardId)
          ? state.activeBoardId
          : boards[0]?.id || null,
      }
    }

    case 'REFRESH_PROFILES': {
      return {
        ...state,
        profiles: getAllProfiles(),
      }
    }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Boot: load profiles and resolve active profile on mount
  useEffect(() => {
    const profiles = getAllProfiles()
    const storedId = getActiveProfileId()
    const resolvedId =
      storedId && profiles.find(p => p.id === storedId)
        ? storedId
        : profiles[0]?.id || null
    // Migrate all profiles: fix symbol IDs, then add any new category boards
    profiles.forEach(p => {
      migrateSymbolIds(p.id)
      migrateMissingBoards(p.id)
    })
    const activeProfile = resolvedId ? getProfile(resolvedId) : null
    const boards = resolvedId ? getBoardsForProfile(resolvedId) : []
    dispatch({
      type: 'INIT',
      profiles,
      activeProfileId: resolvedId,
      activeProfile,
      boards,
    })
  }, [])

  // Run layout optimiser whenever active profile changes
  useEffect(() => {
    if (state.activeProfileId) {
      runLayoutOptimiser(state.activeProfileId)
    }
  }, [state.activeProfileId])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}