import { useLocation } from 'react-router-dom'
import PagePlaceholder from '../../components/PagePlaceholder'

export default function GetQuotePage() {
  const { state } = useLocation()

  if (!state) {
    return <PagePlaceholder title="Get a Quote" note="Full quote request form lands in Phase 7." />
  }

  const rows = [
    ['Product', state.product],
    ['Quantity', state.quantity],
    ['Size', state.size],
    ['Material', state.material],
    ['Finish', state.finish],
    ['Artwork', state.artworkFileName],
    ['Notes', state.notes],
    ['Estimated Price', state.estimatedPrice != null ? `$${state.estimatedPrice.toFixed(2)}` : null],
  ].filter(([, value]) => value)

  return (
    <div className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-3xl font-semibold text-ink-900">Get a Quote</h1>
      <p className="mt-3 text-ink-500">
        Thanks — we've captured your selections below. The full quote request form (with contact details and
        submission) lands in Phase 7.
      </p>
      <dl className="mt-8 divide-y divide-gray-200 rounded-xl border border-gray-200">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 px-4 py-3 text-sm">
            <dt className="font-medium text-ink-700">{label}</dt>
            <dd className="text-right text-ink-500">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
