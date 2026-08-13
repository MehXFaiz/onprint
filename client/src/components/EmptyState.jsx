export default function EmptyState({ title, note }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
      <p className="font-medium text-ink-900">{title}</p>
      {note && <p className="mt-1 text-sm text-ink-500">{note}</p>}
    </div>
  )
}
