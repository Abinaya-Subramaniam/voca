import { useState, useEffect } from 'react'
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


function greetingWord() {
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
          {greetingWord()}, {name}!
        </div>
        <div className="text-sm font-sans text-warm-500">
          Tap symbols below to say what's on your mind.
        </div>
      </div>
    </div>
  )
}


export default function App() {
  const { state, dispatch, authed, setAuthed, booting, user } = useApp()
  const { activeProfileId, activeProfile, boards, activeBoardId, sentenceBuffer, mode } = state

  const [appStage, setAppStage]     = useState(() => sessionStorage.getItem('voca_stage') || 'landing')
  const [showJournal, setShowJournal] = useState(false)
  const [showWhoIAm, setShowWhoIAm] = useState(false)
  const [caregiverTab, setCaregiverTab] = useState('overview')

  function goToStage(stage) {
    sessionStorage.setItem('voca_stage', stage)
    setAppStage(stage)
  }

  function handleLogout() {
    logout()
    setAuthed(false)
  }

  function switchMode(newMode) {
    dispatch({ type: 'SET_MODE', mode: newMode })
  }

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
    if (activeProfileId && activeBoardId && mode === 'user') {
      startBrowseTimer(activeProfileId, activeBoardId)
    }
  }, [activeBoardId, activeProfileId, mode])

  function handleSelectBoard(boardId) {
    if (!boardId) return
    dispatch({ type: 'SET_ACTIVE_BOARD', boardId })
    setShowJournal(false)
  }

  function handleBoardSymbolTap(symbol) {
    const previousLabel = sentenceBuffer.length > 0 ? sentenceBuffer[sentenceBuffer.length - 1].label : null
    dispatch({ type: 'ADD_TO_SENTENCE', symbol })
    recordTap(activeProfileId, previousLabel, symbol.label, activeBoardId)
    markTappedOnBoard()
  }

  if (appStage === 'landing') {
    return (
      <LandingPage
        onEnter={() => goToStage('app')}
        authed={authed}
        userName={user?.name}
        userEmail={user?.email}
        onLogout={handleLogout}
      />
    )
  }

  if (!authed) {
    return <AuthPage onAuthed={() => setAuthed(true)} onBackToLanding={() => goToStage('landing')} />
  }

  if (booting) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-warm-400 text-sm font-sans">Loading...</div>
      </div>
    )
  }

  if (!activeProfileId) {
    return (
      <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--color-bg)' }}>
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-warm-200 flex-shrink-0 shadow-subtle">
          <button onClick={() => goToStage('landing')} className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <img src="https://i.imgur.com/3vT9jwF.jpeg" alt="Voca" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-display font-bold text-warm-900 text-base">Voca</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-warm-400 font-sans">Select a profile</span>
            <ProfileMenu name={user?.name} email={user?.email} onLogout={handleLogout} />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <ProfileSelector />
        </div>
      </div>
    )
  }

  if (mode === 'caregiver') {
    return (
      <div className="h-screen flex overflow-hidden bg-warm-50">
        <CaregiverSidebar
          activeProfile={activeProfile}
          activeTab={caregiverTab}
          onTabChange={setCaregiverTab}
          onSwitchToUser={() => switchMode('user')}
          onLogoClick={() => goToStage('landing')}
          userName={user?.name}
          userEmail={user?.email}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-hidden flex flex-col" style={{ background: 'var(--color-bg)' }}>
          {caregiverTab === 'overview'    && <OverviewTab />}
          {caregiverTab === 'insights'   && <InsightsDashboard />}
          {caregiverTab === 'boardeditor' && <BoardEditorTab />}
          {caregiverTab === 'companion'  && <CompanionTab />}
        </main>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden bg-warm-50">
      <Sidebar
        activeProfile={activeProfile}
        boards={boards}
        activeBoardId={activeBoardId}
        showJournal={showJournal}
        onSelectBoard={handleSelectBoard}
        onLogoClick={() => goToStage('landing')}
        onJournalToggle={() => setShowJournal(v => !v)}
        onWhoAmI={() => setShowWhoIAm(true)}
        onSwitchProfile={() => dispatch({ type: 'SET_ACTIVE_PROFILE', profileId: null })}
        onSwitchToCaregiver={() => switchMode('caregiver')}
      />

      <main
        className="flex-1 flex flex-col overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${activeProfile?.avatarColor || '#2D9B83'}14 0%, var(--color-bg) 260px)` }}
      >
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
