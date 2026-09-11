export default function LoadingState({
  label = 'Loading…',
  type = 'spinner', // 'spinner' | 'cards' | 'inline'
  count = 4,
  columns = 4,
  className = '',
}) {
  if (type === 'cards') {
    const colClass =
      columns === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : columns === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : columns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1'

    return (
      <div
        role="status"
        aria-label={label}
        className={`grid gap-6 ${colClass} ${className}`}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white p-4 shadow-xs animate-pulse"
          >
            <div className="aspect-[4/3] w-full rounded-xl bg-black/6" />
            <div className="mt-4 space-y-2.5">
              <div className="h-3 w-1/3 rounded-full bg-black/6" />
              <div className="h-4 w-3/4 rounded-full bg-black/8" />
              <div className="h-3 w-full rounded-full bg-black/5" />
              <div className="h-3 w-2/3 rounded-full bg-black/5" />
            </div>
            <div className="mt-6 pt-3 border-t border-black/6 flex items-center justify-between">
              <div className="h-8 w-24 rounded-lg bg-black/6" />
              <div className="h-8 w-8 rounded-lg bg-black/6" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      role="status"
      className={`flex items-center justify-center gap-3 py-16 text-sm font-medium text-black/60 ${className}`}
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/10 border-t-[#A82F19]" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
