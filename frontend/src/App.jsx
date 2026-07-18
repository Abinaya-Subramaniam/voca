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
import JournalView from './components/journal/JournalView'
import WhoIAmCard from './components/profile/WhoIAmCard'
import OverviewTab from './components/caregiver/OverviewTab'
import BoardEditorTab from './components/caregiver/BoardEditorTab'
import CompanionTab from './components/caregiver/CompanionTab'


function UserNav({ activeProfile, showJournal, onLogoClick, onJournalToggle, onProfileClick, onSwitchProfile, onSwitchToCaregiver }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-warm-200 flex-shrink-0 shadow-subtle">
      <button onClick={onLogoClick} className="flex items-center gap-2 hover:opacity-75 transition-opacity">
        <img src="https://i.imgur.com/3vT9jwF.jpeg" alt="Voca" className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
        <span className="font-display font-bold text-warm-900 text-base">Voca</span>
      </button>

      <div className="flex items-center gap-2">
        {activeProfile && (
          <>
            {/* Journal toggle */}
            <button
              onClick={onJournalToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showJournal
                  ? 'bg-teal-500 text-white shadow-subtle'
                  : 'bg-warm-100 text-warm-600 hover:text-warm-900'
              }`}
            >
              <span className="text-base leading-none">📔</span>
              Journal
            </button>

            {/* Avatar */}
            <button
              onClick={onProfileClick}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0 hover:opacity-80 transition-opacity"
              style={{ backgroundColor: activeProfile.avatarColor || '#2D9B83' }}
              title={`${activeProfile.name} — Who I Am`}
            >
              {activeProfile.name?.charAt(0).toUpperCase()}
            </button>

            {/* Switch profile */}
            <button
              onClick={onSwitchProfile}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-warm-400 hover:bg-warm-100 hover:text-warm-700 transition-colors"
              title="Switch user"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </button>

            {/* Caregiver link */}
            <button
              onClick={onSwitchToCaregiver}
              className="text-xs font-sans text-warm-400 hover:text-teal-500 transition-colors whitespace-nowrap"
            >
              Caregiver View
            </button>
          </>
        )}
      </div>
    </header>
  )
}


const CAREGIVER_TABS = [
  { id: 'overview',    label: 'Overview'     },
  { id: 'insights',   label: 'Insights'     },
  { id: 'boardeditor',label: 'Board Editor' },
  { id: 'companion',  label: 'Companion'    },
]

function CaregiverNav({ activeProfile, activeTab, onTabChange, onSwitchToUser, onLogoClick, userName, userEmail, onLogout }) {
  return (
    <header className="flex flex-col bg-white border-b border-warm-200 flex-shrink-0 shadow-subtle">
      {/* Top row */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <button onClick={onLogoClick} className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <img src="https://i.imgur.com/3vT9jwF.jpeg" alt="Voca" className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
            <span className="font-display font-bold text-warm-900 text-base">Voca</span>
          </button>
          <span className="text-xs font-sans text-warm-400 ml-1 bg-warm-100 px-2 py-0.5 rounded-full">
            Caregiver View
          </span>
        </div>

        <div className="flex items-center gap-3">
          {activeProfile && (
            <button
              onClick={onSwitchToUser}
              className="flex items-center gap-1.5 text-xs font-sans font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back to {activeProfile.name}'s Board
            </button>
          )}
          <ProfileMenu name={userName} email={userEmail} onLogout={onLogout} />
        </div>
      </div>

      {/* Tab bar */}
      {activeProfile && (
        <div className="flex px-4 pb-0 gap-1">
          {CAREGIVER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-teal-600 border-teal-500'
                  : 'text-warm-500 border-transparent hover:text-warm-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}


export default function App() {
  const { state, dispatch, authed, setAuthed, booting, user } = useApp()
  const { activeProfileId, activeProfile, activeBoardId, sentenceBuffer, mode } = state

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
      <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--color-bg)' }}>
        <CaregiverNav
          activeProfile={activeProfile}
          activeTab={caregiverTab}
          onTabChange={setCaregiverTab}
          onSwitchToUser={() => switchMode('user')}
          onLogoClick={() => goToStage('landing')}
          userName={user?.name}
          userEmail={user?.email}
          onLogout={handleLogout}
        />

        {caregiverTab === 'overview'    && <OverviewTab />}
        {caregiverTab === 'insights'   && <InsightsDashboard />}
        {caregiverTab === 'boardeditor' && <BoardEditorTab />}
        {caregiverTab === 'companion'  && <CompanionTab />}
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <UserNav
        activeProfile={activeProfile}
        showJournal={showJournal}
        onLogoClick={() => goToStage('landing')}
        onJournalToggle={() => setShowJournal(v => !v)}
        onProfileClick={() => setShowWhoIAm(true)}
        onSwitchProfile={() => dispatch({ type: 'SET_ACTIVE_PROFILE', profileId: null })}
        onSwitchToCaregiver={() => switchMode('caregiver')}
      />

      {showJournal ? (
        <JournalView />
      ) : (
        <>
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

      {showWhoIAm && <WhoIAmCard onClose={() => setShowWhoIAm(false)} />}
    </div>
  )
}
