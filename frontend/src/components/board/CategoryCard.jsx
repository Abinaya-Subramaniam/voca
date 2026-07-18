export default function CategoryCard({ category, onTap }) {
  return (
    <button
      onClick={() => onTap(category.category)}
      className={`
        flex flex-col items-center justify-center gap-2
        w-full min-h-[92px] p-3 rounded-xl
        border-[1.5px] ${category.color}
        hover:scale-95 active:scale-90
        transition-all duration-100 cursor-pointer select-none
        shadow-subtle hover:shadow-raised
      `}
    >
      <span className="text-3xl">{category.icon}</span>
      <span className="text-xs font-sans font-semibold text-warm-800 text-center leading-tight">
        {category.name}
      </span>
    </button>
  )
}