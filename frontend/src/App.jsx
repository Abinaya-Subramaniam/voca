import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom'
import { useApp } from './context/AppContext'
import LandingPage from './components/landing/LandingPage'
import ProfileSelector from './components/profile/ProfileSelector'
import SentenceBar from './components/sentence/SentenceBar'
import AuthPage from './components/auth/AuthPage'
import InsightsDashboard from './components/insights/InsightsDashboard'
import ProfileMenu from './components/shared/ProfileMenu'
import { logout } from './api'
import { recordTap } from './engine/predictionEngine'
import { startBrowseTimer, markTappedOnBoard } from './engine/gapDetector'
import BoardNavigator from './components/board/BoardNavigator'
import Sidebar from './components/board/Sidebar'
import JournalView from './components/journal/JournalView'
import WhoIAmCard from './components/profile/WhoIAmCard'
import OverviewTab from './components/caregiver/OverviewTab'
import BoardEditorTab from './components/caregiver/BoardEditorTab'
import CompanionTab from './components/caregiver/CompanionTab'
import CaregiverSidebar from './components/caregiver/CaregiverSidebar'

const CAREGIVER_TAB_IDS = ['overview', 'insights', 'boardeditor', 'companion']
const CAREGIVER_TAB_LABELS = { overview: 'Overview', insights: 'Insights', boardeditor: 'Board Editor', companion: 'Voca Bot' }

function greetingPhrase() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function GreetingBanner({ name, avatarColor }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3.5 flex-shrink-0"
      style={{ background: `linear-gradient(90deg, ${avatarColor || '#2D9B83'}1F, transparent 70%)` }}
    >
      <span className="text-2xl leading-none">👋</span>
      <div className="min-w-0">
        <div className="font-display font-bold text-warm-900 text-xl leading-tight truncate">
          {greetingPhrase()}, {name}!
        </div>
        <div className="text-sm font-sans text-warm-500">
          Tap symbols below to say what's on your mind.
        </div>
      </div>
    </div>
  )
}

function MobileTopBar({ onMenuClick, label }) {
  return (
    <div className="md:hidden flex items-center gap-3 px-4 py-2.5 bg-white border-b border-warm-200 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="w-9 h-9 -ml-1 rounded-lg flex items-center justify-center text-warm-600 hover:bg-warm-100 transition-colors flex-shrink-0"
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <img src="https://i.imgur.com/3vT9jwF.jpeg" alt="Voca" className="w-6 h-6 rounded-md object-cover flex-shrink-0" />
      <span className="font-display font-bold text-warm-900 text-sm truncate">{label}</span>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <div className="text-warm-400 text-sm font-sans">Loading...</div>
    </div>
  )
}

// Where "take me home" should land, based on auth + whether a profile is active.
function homePathFor(authed, activeProfileId) {
  if (!authed) return '/login'
  return activeProfileId ? '/board' : '/profiles'
}

function RequireProfile({ children }) {
  const { authed, booting, state } = useApp()
  if (!authed) return <Navigate to="/login" replace />
  if (booting) return <LoadingScreen />
  if (!state.activeProfileId) return <Navigate to="/profiles" replace />
  return children
}


function LandingRoute() {
  const navigate = useNavigate()
  const { authed, user, setAuthed, state } = useApp()

  function handleLogout() {
    logout()
    setAuthed(false)
  }

  return (
    <LandingPage
      onEnter={() => navigate(homePathFor(authed, state.activeProfileId))}
      authed={authed}
      userName={user?.name}
      userEmail={user?.email}
      onLogout={handleLogout}
    />
  )
}

function LoginRoute() {
  const navigate = useNavigate()
  const { authed, booting, setAuthed, state } = useApp()

  if (authed) {
    if (booting) return <LoadingScreen />
    return <Navigate to={homePathFor(true, state.activeProfileId)} replace />
  }

  return (
    <AuthPage
      onAuthed={() => setAuthed(true)}
      onBackToLanding={() => navigate('/')}
    />
  )
}

function ProfilesRoute() {
  const navigate = useNavigate()
  const { authed, booting, user, setAuthed } = useApp()

  if (!authed) return <Navigate to="/login" replace />
  if (booting) return <LoadingScreen />

  function handleLogout() {
    logout()
    setAuthed(false)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-warm-200 flex-shrink-0 shadow-subtle">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-75 transition-opacity">
          <img src="https://i.imgur.com/3vT9jwF.jpeg" alt="Voca" className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-display font-bold text-warm-900 text-lg"><span style={{ color: '#238A72' }}>V</span>oca</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-warm-400 font-sans">Select a profile</span>
          <ProfileMenu name={user?.name} email={user?.email} onLogout={handleLogout} />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <ProfileSelector />
      </div>
    </div>
  )
}


function BoardRoute() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, dispatch } = useApp()
  const { activeProfileId, activeProfile, boards, activeBoardId, sentenceBuffer } = state
  const [showWhoIAm, setShowWhoIAm] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const showJournal = location.pathname === '/board/journal'

  // High contrast
  useEffect(() => {
    document.body.classList.toggle('high-contrast', !!activeProfile?.settings?.highContrast)
  }, [activeProfile?.settings?.highContrast])

  // Font size
  useEffect(() => {
    const size = activeProfile?.settings?.fontSize || 12
    document.documentElement.style.setProperty('--symbol-font-size', `${size}px`)
  }, [activeProfile?.settings?.fontSize])

  // Gap timer
  useEffect(() => {
    if (activeProfileId && activeBoardId && !showJournal) {
      startBrowseTimer(activeProfileId, activeBoardId)
    }
  }, [activeBoardId, activeProfileId, showJournal])

  function handleSelectBoard(boardId) {
    if (!boardId) return
    dispatch({ type: 'SET_ACTIVE_BOARD', boardId })
    if (showJournal) navigate('/board')
  }

  function handleBoardSymbolTap(symbol) {
    const previousLabel = sentenceBuffer.length > 0 ? sentenceBuffer[sentenceBuffer.length - 1].label : null
    dispatch({ type: 'ADD_TO_SENTENCE', symbol })
    recordTap(activeProfileId, previousLabel, symbol.label, activeBoardId)
    markTappedOnBoard()
  }

  return (
    <div className="h-screen flex overflow-hidden bg-warm-50">
      <Sidebar
        activeProfile={activeProfile}
        boards={boards}
        activeBoardId={activeBoardId}
        showJournal={showJournal}
        onSelectBoard={handleSelectBoard}
        onLogoClick={() => navigate('/')}
        onJournalToggle={() => navigate(showJournal ? '/board' : '/board/journal')}
        onWhoAmI={() => setShowWhoIAm(true)}
        onSwitchProfile={() => { dispatch({ type: 'SET_ACTIVE_PROFILE', profileId: null }); navigate('/profiles') }}
        onSwitchToCaregiver={() => navigate('/caregiver/overview')}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <main
        className="flex-1 flex flex-col overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${activeProfile?.avatarColor || '#2D9B83'}14 0%, var(--color-bg) 260px)` }}
      >
        <MobileTopBar onMenuClick={() => setMobileNavOpen(true)} label={showJournal ? 'Journal' : (activeProfile?.name || 'Voca')} />
        {showJournal ? (
          <JournalView />
        ) : (
          <>
            <GreetingBanner name={activeProfile?.name} avatarColor={activeProfile?.avatarColor} />
            <SentenceBar />
            <BoardNavigator
              onSymbolTap={handleBoardSymbolTap}
              onPredict={(sym) => {
                const previousLabel = sentenceBuffer.length > 0 ? sentenceBuffer[sentenceBuffer.length - 1].label : null
                dispatch({ type: 'ADD_TO_SENTENCE', symbol: sym })
                recordTap(activeProfileId, previousLabel, sym.label, activeBoardId)
              }}
            />
          </>
        )}
      </main>

      {showWhoIAm && <WhoIAmCard onClose={() => setShowWhoIAm(false)} />}
    </div>
  )
}

function CaregiverRoute() {
  const navigate = useNavigate()
  const { tab } = useParams()
  const { state, user, setAuthed } = useApp()
  const { activeProfile } = state
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  if (!CAREGIVER_TAB_IDS.includes(tab)) {
    return <Navigate to="/caregiver/overview" replace />
  }

  function handleLogout() {
    logout()
    setAuthed(false)
  }

  return (
    <div className="h-screen flex overflow-hidden bg-warm-50">
      <CaregiverSidebar
        activeProfile={activeProfile}
        activeTab={tab}
        onTabChange={id => navigate(`/caregiver/${id}`)}
        onSwitchToUser={() => navigate('/board')}
        onLogoClick={() => navigate('/')}
        userName={user?.name}
        userEmail={user?.email}
        onLogout={handleLogout}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <main className="flex-1 overflow-hidden flex flex-col" style={{ background: 'var(--color-bg)' }}>
        <MobileTopBar onMenuClick={() => setMobileNavOpen(true)} label={CAREGIVER_TAB_LABELS[tab]} />
        {tab === 'overview'    && <OverviewTab />}
        {tab === 'insights'    && <InsightsDashboard />}
        {tab === 'boardeditor' && <BoardEditorTab />}
        {tab === 'companion'   && <CompanionTab />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/profiles" element={<ProfilesRoute />} />
      <Route path="/board" element={<RequireProfile><BoardRoute /></RequireProfile>} />
      <Route path="/board/journal" element={<RequireProfile><BoardRoute /></RequireProfile>} />
      <Route path="/caregiver" element={<Navigate to="/caregiver/overview" replace />} />
      <Route path="/caregiver/:tab" element={<RequireProfile><CaregiverRoute /></RequireProfile>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
