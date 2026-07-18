import { useEffect, useRef, useState } from 'react'

function displayName(email) {
  if (!email) return 'Account'
  const local = email.split('@')[0]
  const match = local.match(/[A-Za-z][A-Za-z0-9._-]*/)
  const name = match ? match[0] : local
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export default function ProfileMenu({ email, onLogout, onDashboard, dashboardLabel = 'Dashboard' }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const name = displayName(email)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={rootRef} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(v => !v)}
        title={name}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-display font-bold text-sm hover:brightness-105 active:scale-95 transition-all shadow-subtle"
      >
        {name.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] w-52 bg-white rounded-xl border border-warm-200 shadow-raised overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-warm-100">
            <div className="text-sm font-sans font-semibold text-warm-800 truncate">
              {name}
            </div>
          </div>

          {onDashboard && (
            <button
              role="menuitem"
              onClick={() => { setOpen(false); onDashboard() }}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-sans font-medium text-warm-700 hover:bg-warm-50 transition-colors text-left"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              {dashboardLabel}
            </button>
          )}

          <button
            role="menuitem"
            onClick={() => { setOpen(false); onLogout() }}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-sans font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
