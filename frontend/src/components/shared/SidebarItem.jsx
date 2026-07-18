// Sidebar nav row — icon badge + label, used by both the board sidebar and
// the caregiver dashboard sidebar so the two feel like one consistent system.

export default function SidebarItem({ icon, label, active, onClick, tint }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-[14.5px] font-sans font-semibold transition-all text-left ${
        active ? 'bg-teal-500 text-white shadow-subtle' : 'text-warm-700 hover:bg-warm-100'
      }`}
    >
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${
        active ? 'bg-white/20' : (tint || 'bg-warm-100')
      }`}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  )
}
