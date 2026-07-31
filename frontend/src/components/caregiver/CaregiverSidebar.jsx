import SidebarItem from '../shared/SidebarItem'
import SidebarSwitchButton from '../shared/SidebarSwitchButton'
import ProfileMenu from '../shared/ProfileMenu'

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function RobotIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="9" width="16" height="11" rx="3" />
      <path d="M12 9V5" />
      <circle cx="12" cy="3.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="9" cy="14.5" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14.5" r="1.25" fill="currentColor" stroke="none" />
      <path d="M9 17.5c.8.6 1.9.9 3 .9s2.2-.3 3-.9" />
      <path d="M2 13h2" />
      <path d="M20 13h2" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

const TABS = [
  { id: 'overview',    label: 'Overview',     icon: <GridIcon />,  tint: 'bg-teal-50'   },
  { id: 'insights',    label: 'Vocab Coach', icon: <RobotIcon />, tint: 'bg-blue-50' },
  { id: 'boardeditor', label: 'Settings',     icon: <SettingsIcon />, tint: 'bg-yellow-50' },
  { id: 'companion',   label: 'Voca Bot',     icon: <ChatIcon />,  tint: 'bg-purple-50' },
]

export default function CaregiverSidebar({
  activeProfile, activeTab, onTabChange, onManageKids, onLogoClick, userName, userEmail, onLogout,
  mobileOpen = false, onMobileClose,
}) {
  function withClose(fn) {
    return (...args) => { fn?.(...args); onMobileClose?.() }
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 md:z-auto
        w-64 max-w-[80vw] flex-shrink-0 h-full bg-white border-r border-warm-200 flex flex-col overflow-hidden
        transform transition-transform duration-200 ease-out md:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

      {/* Logo + account */}
      <div className="flex items-center justify-between gap-2 px-4 py-4 border-b border-warm-100 flex-shrink-0">
        <button onClick={withClose(onLogoClick)} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity min-w-0">
          <img src="https://i.imgur.com/3vT9jwF.jpeg" alt="Voca" className="w-9 h-9 rounded-xl object-cover shadow-subtle flex-shrink-0" />
          <span className="font-display font-bold text-warm-900 text-lg truncate"><span style={{ color: '#238A72' }}>V</span>oca</span>
        </button>
        <div className="flex items-center gap-1 flex-shrink-0">
          <ProfileMenu name={userName} email={userEmail} onLogout={onLogout} />
          <button
            onClick={onMobileClose}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-warm-400 hover:bg-warm-100 hover:text-warm-700 transition-colors"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Managing profile chip */}
      {activeProfile && (
        <div className="px-4 py-3 border-b border-warm-100 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-warm-50">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0 shadow-subtle"
              style={{ backgroundColor: activeProfile.avatarColor || '#2D9B83' }}
            >
              {activeProfile.name?.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="text-[10.5px] font-sans font-semibold text-warm-400 uppercase tracking-wide leading-none mb-0.5">
                Caregiver view for
              </div>
              <div className="text-sm font-sans font-bold text-warm-900 truncate">{activeProfile.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="text-[10.5px] font-sans font-bold text-warm-400 uppercase tracking-wider px-2.5 mb-2">
          Dashboard
        </div>
        <div className="space-y-1">
          {TABS.map(tab => (
            <SidebarItem
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={withClose(() => onTabChange(tab.id))}
              tint={tab.tint}
            />
          ))}
        </div>
      </nav>

      {/* Footer — switch which communicator you're managing, or add another */}
      <div className="px-3 py-3 border-t border-warm-100 flex-shrink-0">
        <SidebarSwitchButton
          icon={<UsersIcon />}
          label="Manage communicators"
          onClick={withClose(onManageKids)}
        />
      </div>
      </aside>
    </>
  )
}
