import { useState, useEffect } from 'react'
import { FileText, Plus, CheckCircle2, Clock, Package } from 'lucide-react'
import Button from '../../components/Button'
import { getStoredQuotes } from '../../services/quotes'

export default function MyQuotesPage() {
  const [quotes, setQuotes] = useState([])

  useEffect(() => {
    setQuotes(getStoredQuotes())
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="font-display text-2xl font-black text-neutral-900">My Quote Requests</h1>
          <p className="text-xs text-neutral-500">View estimates, pricing proposals, and custom project inquiries.</p>
        </div>
        <Button to="/get-a-quote" variant="accent" size="sm" icon={false}>
          <Plus className="h-4 w-4 mr-1" />
          Request New Quote
        </Button>
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center shadow-xs">
          <FileText className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-neutral-900">No quote requests yet</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Need custom finishes, bulk pricing, or unique dimensions? Submit a quote request today.
          </p>
          <Button to="/get-a-quote" variant="accent" size="md" icon={false} className="mt-6">
            Start Quote Request
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div
              key={quote._id || quote.id || quote.quoteNumber}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-neutral-300 transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-purple-700">{quote.quoteNumber}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      quote.status === 'Approved'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : quote.status === 'Rejected'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-purple-50 border-purple-200 text-purple-700'
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-neutral-900 mt-1">{quote.productName || 'Custom Print Job'}</h3>
                {quote.specs && <p className="text-xs text-neutral-600 mt-1">{quote.specs}</p>}
                {quote.notes && <p className="text-[11px] text-neutral-500 italic mt-1">Note: {quote.notes}</p>}
                {quote.artworkFile && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                    📎 {quote.artworkFile}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 border-t md:border-t-0 border-neutral-100 pt-3 md:pt-0 shrink-0">
                <div>
                  <div className="text-[10px] font-bold uppercase text-neutral-400">Est. Total</div>
                  <div className="font-black text-neutral-900 text-sm">
                    {quote.totalPrice ? `AED ${Number(quote.totalPrice).toLocaleString()}` : 'Pricing on Request'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase text-neutral-400">Quantity</div>
                  <div className="font-bold text-neutral-800 text-xs">{quote.quantity || 1} units</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
