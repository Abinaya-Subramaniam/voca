export default function Navbar({ scrolled = false, onLogoClick, children }) {
  const logo = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
      <img
        src="https://i.imgur.com/3vT9jwF.jpeg"
        alt="Voca"
        style={{
          width: '38px', height: '38px', borderRadius: '11px',
          objectFit: 'cover', boxShadow: '0 2px 10px rgba(45,155,131,0.4)',
        }}
      />
      <span style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: '23px',
        color: '#2C2A26', letterSpacing: '-0.03em', lineHeight: 1,
      }}>
        <span style={{ color: '#238A72' }}>V</span>oca
      </span>
    </div>
  )

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50, width: '100%', flexShrink: 0,
      background: scrolled ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: scrolled ? '1px solid rgba(232,230,225,0.9)' : '1px solid rgba(232,230,225,0.35)',
      boxShadow: scrolled ? '0 4px 24px rgba(44,42,38,0.06)' : 'none',
      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto', padding: '0 2rem',
        height: scrolled ? '60px' : '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '10px',
        transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {onLogoClick ? (
          <button
            onClick={onLogoClick}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            {logo}
          </button>
        ) : logo}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {children}
        </div>
      </div>
    </nav>
  )
}
