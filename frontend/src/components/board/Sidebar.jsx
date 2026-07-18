import { CATEGORY_CARDS } from '../../data/defaultBoards'
import SidebarItem from '../shared/SidebarItem'
import SidebarSwitchButton from '../shared/SidebarSwitchButton'

function IdCardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      <circle cx="8.5" cy="12" r="2" />
      <line x1="14" y1="9.5" x2="19" y2="9.5" />
      <line x1="14" y1="14" x2="19" y2="14" />
    </svg>
  )
}

function SwitchUserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

export default function Sidebar({
  activeProfile, boards, activeBoardId, showJournal,
  onSelectBoard, onLogoClick, onJournalToggle, onWhoAmI, onSwitchProfile, onSwitchToCaregiver,
}) {
  const rootBoard   = boards.find(b => b.isRoot === true || b.category === 'home') || boards[0]
  const activeBoard = boards.find(b => b.id === activeBoardId)
  const isHome      = !showJournal && activeBoard?.id === rootBoard?.id

  return (
    <aside className="w-64 flex-shrink-0 h-full bg-white border-r border-warm-200 flex flex-col overflow-hidden">

      {/* Logo */}
      <button
        onClick={onLogoClick}
        className="flex items-center gap-2.5 px-4 py-4 border-b border-warm-100 hover:bg-warm-50 transition-colors flex-shrink-0"
      >
        <img src="https://i.imgur.com/3vT9jwF.jpeg" alt="Voca" className="w-9 h-9 rounded-xl object-cover shadow-subtle" />
        <span className="font-display font-bold text-warm-900 text-lg">Voca</span>
      </button>

      {/* Profile chip */}
      <div className="px-4 py-3 border-b border-warm-100 flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-warm-50">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0 shadow-subtle"
            style={{ backgroundColor: activeProfile?.avatarColor || '#2D9B83' }}
          >
            {activeProfile?.name?.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="text-[10.5px] font-sans font-semibold text-warm-400 uppercase tracking-wide leading-none mb-0.5">
              Communicating as
            </div>
            <div className="text-sm font-sans font-bold text-warm-900 truncate">{activeProfile?.name}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="text-[10.5px] font-sans font-bold text-warm-400 uppercase tracking-wider px-2.5 mb-2">
          Board
        </div>
        <div className="space-y-1 mb-5">
          <SidebarItem
            icon="🏠"
            label="Home"
            active={isHome}
            onClick={() => rootBoard && onSelectBoard(rootBoard.id)}
            tint="bg-teal-50"
          />
          {CATEGORY_CARDS.map(cat => {
            const board = boards.find(b => b.category === cat.category)
            return (
              <SidebarItem
                key={cat.category}
                icon={cat.icon}
                label={cat.name}
                active={!showJournal && activeBoard?.category === cat.category}
                onClick={() => board && onSelectBoard(board.id)}
                tint={cat.color}
              />
            )
          })}
        </div>

        <div className="text-[10.5px] font-sans font-bold text-warm-400 uppercase tracking-wider px-2.5 mb-2">
          More
        </div>
        <div className="space-y-1">
          <SidebarItem
            icon="📔"
            label="Journal"
            active={showJournal}
            onClick={onJournalToggle}
            tint="bg-pink-50"
          />
          <SidebarItem
            icon={<IdCardIcon />}
            label="Who Am I"
            active={false}
            onClick={onWhoAmI}
            tint="bg-purple-50"
          />
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-warm-100 flex-shrink-0 space-y-1">
        <button
          onClick={onSwitchProfile}
          className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-[13.5px] font-sans font-semibold text-warm-500 hover:bg-warm-100 hover:text-warm-800 transition-all text-left"
        >
          <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
            <SwitchUserIcon />
          </span>
          Switch user
        </button>
        <div className="pt-1">
          <SidebarSwitchButton icon={<ShieldIcon />} label="Caregiver View" onClick={onSwitchToCaregiver} />
        </div>
      </div>
    </aside>
  )
}
