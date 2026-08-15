export default function EmptyState({ title, note, icon: Icon }) {
  const IconComponent = typeof Icon === 'function' || typeof Icon === 'object' ? Icon : null
  return (
    <div className="flex flex-col items-center gap-3 border border-dashed border-border bg-surface px-6 py-16 text-center">
      {IconComponent && <IconComponent className="h-6 w-6 text-secondary" strokeWidth={1.5} aria-hidden="true" />}
      <p className="font-display text-base font-semibold text-primary">{title}</p>
      {note && <p className="max-w-sm text-sm text-secondary">{note}</p>}
    </div>
  )
}
