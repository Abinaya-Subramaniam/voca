// Consistent page title block for caregiver dashboard tabs — gives every
// screen the same breathing room and hierarchy instead of content sitting
// flush against the top edge.

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-7">
      <div className="min-w-0">
        <h1 className="font-display font-bold text-warm-900 text-[30px] leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-warm-500 text-base mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
