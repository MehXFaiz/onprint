import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { FileText, Plus, Search, Edit2, Trash2, CheckCircle2, X, AlertTriangle, ShoppingBag, ExternalLink } from 'lucide-react'
import Button from '../../components/Button'
import { getStoredQuotes, fetchQuotes, deleteQuote, updateQuoteStatus } from '../../services/quotes'

export default function AdminQuotesPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(location.state?.toast || null)
  const [deletingQuote, setDeletingQuote] = useState(null)

  const reloadQuotes = async () => {
    setLoading(true)
    const list = await fetchQuotes()
    setQuotes(list)
    setLoading(false)
  }

  useEffect(() => {
    reloadQuotes()
  }, [])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleStatusChange = async (quoteId, newStatus) => {
    const updated = await updateQuoteStatus(quoteId, newStatus)
    setQuotes(updated)
    if (newStatus === 'Approved') {
      setNotification(`Quote approved! Successfully converted to active order in Orders.`)
    } else {
      setNotification(`Quote status updated to "${newStatus}".`)
    }
  }

  const filtered = quotes.filter(
    (q) =>
      (q.quoteNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (q.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (q.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (q.status || '').toLowerCase().includes(search.toLowerCase())
  )

  const confirmDeleteQuote = () => {
    if (!deletingQuote) return
    const updated = deleteQuote(deletingQuote._id || deletingQuote.id)
    setQuotes(updated)
    setNotification(`Quote request "${deletingQuote.quoteNumber}" deleted successfully.`)
    setDeletingQuote(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <FileText className="h-4 w-4" />
            <span>Custom Print Inquiries</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-black text-neutral-900">
            Quote Request Manager
          </h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            Review custom pricing requests and issue estimates to Dubai clients.
          </p>
        </div>

        <Button
          onClick={() => navigate('/admin/quotes/new')}
          variant="accent"
          icon={false}
          className="shadow-md shadow-[#A82F19]/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Create Quote
        </Button>
      </div>

      {notification && (
        <div className="rounded-2xl border border-neutral-700 bg-neutral-900 p-4 text-xs font-bold text-white flex items-center justify-between shadow-xl">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {notification}
          </span>
          <button onClick={() => setNotification(null)}>
            <X className="h-4 w-4 text-neutral-400 hover:text-white" />
          </button>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quotes by number, client name, status, or email..."
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-4 py-2 text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-extrabold uppercase tracking-wider text-neutral-500">
              <th className="py-3.5 px-4">Quote #</th>
              <th className="py-3.5 px-4">Client Name</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Est. Total</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-xs text-neutral-500">
                  <FileText className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                  <p className="font-bold text-neutral-800">No quote requests recorded yet</p>
                  <p className="mt-1 text-neutral-400">
                    When a client requests a quote on the website, it will be listed here.
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((q) => (
                <tr key={q._id || q.id || q.quoteNumber} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-neutral-900">{q.quoteNumber}</div>
                    {q.status === 'Approved' && (
                      <Link
                        to="/admin/orders"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline mt-0.5"
                        title="View in Orders"
                      >
                        <ShoppingBag className="h-3 w-3" />
                        In Orders
                      </Link>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-neutral-900">{q.name}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">{q.email}</td>
                  <td className="py-3 px-4 text-neutral-700">{q.company || '-'}</td>
                  <td className="py-3 px-4 font-black text-neutral-900">AED {q.totalPrice?.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <select
                      value={q.status || 'Pending'}
                      onChange={(e) => handleStatusChange(q._id || q.id, e.target.value)}
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase border cursor-pointer ${
                        q.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : q.status === 'Rejected'
                            ? 'bg-red-50 text-red-700 border-red-300'
                            : 'bg-purple-50 text-purple-700 border-purple-300'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/quotes/${q._id || q.id}/edit`)}
                        className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
                        title="Edit Quote"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingQuote(q)}
                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Quote"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs text-xs font-semibold text-neutral-600">
        <div>
          Showing <span className="font-bold text-neutral-900">{filtered.length}</span> of{' '}
          <span className="font-bold text-neutral-900">{quotes.length}</span> quotes
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-neutral-400 opacity-60 cursor-not-allowed"
          >
            Previous
          </button>
          <button type="button" className="rounded-xl bg-[#A82F19] px-3 py-1.5 font-bold text-white shadow-xs">
            1
          </button>
          <button
            type="button"
            disabled
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-neutral-400 opacity-60 cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-900">Delete Quote Request?</h3>
                <p className="text-xs text-neutral-500">
                  Are you sure you want to delete quote &quot;{deletingQuote.quoteNumber}&quot;?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setDeletingQuote(null)}
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteQuote}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
              >
                Delete Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
