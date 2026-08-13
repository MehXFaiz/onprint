export default function PagePlaceholder({ title, note }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold text-ink-900">{title}</h1>
      {note && <p className="mt-3 text-ink-500">{note}</p>}
    </div>
  )
}
