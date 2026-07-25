// Prominent teal-gradient CTA used at the bottom of a sidebar to switch
// between the child's board view and the caregiver dashboard.

export default function SidebarSwitchButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-sans font-bold text-white hover:shadow-raised hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all text-left shadow-subtle"
      style={{ background: 'linear-gradient(135deg, #34AB92, #1F7A65)' }}
    >
      <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-80">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  )
}
