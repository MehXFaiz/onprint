import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { FileText, Plus, Search, Edit2, Trash2, CheckCircle2, X, AlertTriangle, ShoppingBag, ExternalLink, CheckSquare } from 'lucide-react'
import Button from '../../components/Button'
import { getStoredQuotes, fetchQuotes, deleteQuote, deleteQuotes, updateQuoteStatus } from '../../services/quotes'

export default function AdminQuotesPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL')
  const [notification, setNotification] = useState(location.state?.toast || null)
  const [deletingQuote, setDeletingQuote] = useState(null)
  const [selectedQuoteIds, setSelectedQuoteIds] = useState([])
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

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

  const getQuoteId = (q) => String(q._id || q.id || q.quoteNumber)

  const getStatusBadgeClass = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'won' || s === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-300'
    if (s === 'lost' || s === 'rejected') return 'bg-rose-50 text-rose-700 border-rose-300'
    if (s === 'quoted') return 'bg-amber-50 text-amber-700 border-amber-300'
    if (s === 'contacted') return 'bg-indigo-50 text-indigo-700 border-indigo-300'
    return 'bg-sky-50 text-sky-700 border-sky-300' // 'new', 'pending'
  }

  const handleStatusChange = async (quoteId, newStatus) => {
    const updated = await updateQuoteStatus(quoteId, newStatus)
    setQuotes(updated)
    if (newStatus === 'Won' || newStatus === 'Approved') {
      setNotification(`Quote marked as Won! Successfully converted to active order in Orders.`)
    } else {
      setNotification(`Lead status updated to "${newStatus}".`)
    }
  }

  const filtered = quotes.filter((q) => {
    const qStatus = (q.status || 'New').toUpperCase()
    if (selectedStatusFilter !== 'ALL') {
      if (selectedStatusFilter === 'WON' && !['WON', 'APPROVED'].includes(qStatus)) return false
      if (selectedStatusFilter === 'LOST' && !['LOST', 'REJECTED'].includes(qStatus)) return false
      if (selectedStatusFilter === 'NEW' && !['NEW', 'PENDING'].includes(qStatus)) return false
      if (selectedStatusFilter === 'CONTACTED' && qStatus !== 'CONTACTED') return false
      if (selectedStatusFilter === 'QUOTED' && qStatus !== 'QUOTED') return false
    }

    const matchesSearch =
      (q.quoteNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (q.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (q.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (q.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (q.status || '').toLowerCase().includes(search.toLowerCase())

    return matchesSearch
  })

  const confirmDeleteQuote = async () => {
    if (!deletingQuote) return
    const targetId = deletingQuote._id || deletingQuote.id || deletingQuote.quoteNumber
    const updated = await deleteQuote(targetId)
    setQuotes(updated)
    setSelectedQuoteIds((prev) => prev.filter((id) => id !== String(targetId)))
    setNotification(`Quote request "${deletingQuote.quoteNumber}" deleted successfully.`)
    setDeletingQuote(null)
  }

  const confirmBulkDelete = async () => {
    if (selectedQuoteIds.length === 0) return
    const count = selectedQuoteIds.length
    const updated = await deleteQuotes(selectedQuoteIds)
    setQuotes(updated)
    setSelectedQuoteIds([])
    setIsBulkDeleting(false)
    setNotification(`Successfully deleted ${count} selected quote request${count > 1 ? 's' : ''}.`)
  }

  const isAllSelected =
    filtered.length > 0 &&
    filtered.every((q) => selectedQuoteIds.includes(getQuoteId(q)))
  const isSomeSelected = selectedQuoteIds.length > 0 && !isAllSelected

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const filteredKeySet = new Set(filtered.map(getQuoteId))
      setSelectedQuoteIds((prev) => prev.filter((id) => !filteredKeySet.has(id)))
    } else {
      const allFilteredIds = filtered.map(getQuoteId)
      setSelectedQuoteIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])))
    }
  }

  const toggleSelectQuote = (id) => {
    const idStr = String(id)
    setSelectedQuoteIds((prev) =>
      prev.includes(idStr) ? prev.filter((item) => item !== idStr) : [...prev, idStr]
    )
  }

  const clearSelection = () => setSelectedQuoteIds([])

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#14213D] p-6 rounded-3xl border border-[#1E2C4F] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D6C29A]">
            <FileText className="h-4 w-4" />
            <span>Custom Print Inquiries</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-black text-[#F5F3EE]">
            Quote Request Manager
          </h1>
          <p className="mt-0.5 text-xs text-[#B8C2D9]">
            Review custom pricing requests and issue estimates to Dubai clients.
          </p>
        </div>

        <Button
          onClick={() => navigate('/admin/quotes/new')}
          variant="accent"
          icon={false}
          className="shadow-md shadow-[#D6C29A]/20 self-start sm:self-auto cursor-pointer"
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
          <button onClick={() => setNotification(null)} className="cursor-pointer">
            <X className="h-4 w-4 text-[#B8C2D9]/70 hover:text-white" />
          </button>
        </div>
      )}

      {/* Filter Toolbar & Bulk Action indicator */}
      <div className="flex flex-col gap-4 bg-[#14213D] p-4 rounded-2xl border border-[#1E2C4F] shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'ALL', label: 'All Leads' },
            { id: 'NEW', label: 'New' },
            { id: 'CONTACTED', label: 'Contacted' },
            { id: 'QUOTED', label: 'Quoted' },
            { id: 'WON', label: 'Won' },
            { id: 'LOST', label: 'Lost' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusFilter === tab.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-[#B8C2D9] hover:bg-neutral-200'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-75">
                ({tab.id === 'ALL'
                  ? quotes.length
                  : quotes.filter((q) => {
                      const s = (q.status || 'New').toUpperCase()
                      if (tab.id === 'WON') return ['WON', 'APPROVED'].includes(s)
                      if (tab.id === 'LOST') return ['LOST', 'REJECTED'].includes(s)
                      if (tab.id === 'NEW') return ['NEW', 'PENDING'].includes(s)
                      return s === tab.id
                    }).length})
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B8C2D9]/70" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quotes by number, client name, status, or email..."
              className="w-full rounded-xl border border-[#1E2C4F] bg-[#0B132B] pl-10 pr-4 py-2 text-xs font-medium text-[#F5F3EE] placeholder-neutral-400 focus:border-[#D6C29A] focus:outline-none"
            />
          </div>

        {selectedQuoteIds.length > 0 && (
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-xl border border-red-200 text-xs font-bold">
            <span>{selectedQuoteIds.length} selected</span>
            <button
              type="button"
              onClick={() => setIsBulkDeleting(true)}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title="Delete all selected quotes"
            >
              <Trash2 className="h-3 w-3" />
              <span>Delete</span>
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="text-red-600 hover:text-red-800 text-[11px] underline cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-3xl border border-[#1E2C4F] bg-[#14213D] shadow-xs">
        <table className="w-full min-w-[700px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#1E2C4F] bg-[#0B132B] text-[11px] font-extrabold uppercase tracking-wider text-[#B8C2D9]">
              <th className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isSomeSelected
                  }}
                  onChange={toggleSelectAll}
                  aria-label="Select all quotes"
                  className="h-4 w-4 rounded border-[#1E2C4F] text-[#D6C29A] focus:ring-[#D6C29A]/20 cursor-pointer accent-[#D6C29A]"
                />
              </th>
              <th className="py-3.5 px-4">Quote #</th>
              <th className="py-3.5 px-4">Client Name</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Est. Total</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium text-[#F5F3EE]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-xs text-[#B8C2D9]">
                  <FileText className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                  <p className="font-bold text-[#F5F3EE]">No quote requests recorded yet</p>
                  <p className="mt-1 text-[#B8C2D9]/70">
                    When a client requests a quote on the website, it will be listed here.
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((q) => {
                const quoteId = getQuoteId(q)
                const isSelected = selectedQuoteIds.includes(quoteId)

                return (
                  <tr
                    key={quoteId}
                    className={`transition-colors ${
                      isSelected ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-[#0B132B]/60'
                    }`}
                  >
                    <td className="py-3 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectQuote(quoteId)}
                        aria-label={`Select quote ${q.quoteNumber}`}
                        className="h-4 w-4 rounded border-[#1E2C4F] text-[#D6C29A] focus:ring-[#D6C29A]/20 cursor-pointer accent-[#D6C29A]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-[#F5F3EE]">{q.quoteNumber}</div>
                      {(q.status === 'Won' || q.status === 'Approved') && (
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
                    <td className="py-3 px-4 font-bold text-[#F5F3EE]">{q.name}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#B8C2D9]">{q.email}</td>
                    <td className="py-3 px-4 text-[#F5F3EE]">{q.company || '-'}</td>
                    <td className="py-3 px-4 font-black text-[#F5F3EE]">AED {q.totalPrice?.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <select
                        value={q.status || 'New'}
                        onChange={(e) => handleStatusChange(q._id || q.id, e.target.value)}
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase border cursor-pointer ${getStatusBadgeClass(q.status)}`}
                      >
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Awaiting Artwork">Awaiting Artwork</option>
                        <option value="Quote Prepared">Quote Prepared</option>
                        <option value="Sent to Customer">Sent to Customer</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Declined">Declined</option>
                        <option value="Converted to Order">Converted to Order</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/quotes/${q._id || q.id}/edit`)}
                          className="rounded-lg p-1.5 text-[#B8C2D9] hover:bg-[#1E2C4F] hover:text-[#F5F3EE] transition-colors cursor-pointer"
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
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#14213D] p-4 rounded-2xl border border-[#1E2C4F] shadow-xs text-xs font-semibold text-[#B8C2D9]">
        <div>
          Showing <span className="font-bold text-[#F5F3EE]">{filtered.length}</span> of{' '}
          <span className="font-bold text-[#F5F3EE]">{quotes.length}</span> quotes
          {selectedQuoteIds.length > 0 && (
            <span className="ml-2 text-[#D6C29A] font-bold">({selectedQuoteIds.length} selected)</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled
            className="rounded-xl border border-[#1E2C4F] bg-[#0B132B] px-3 py-1.5 text-[#B8C2D9]/70 opacity-60 cursor-not-allowed"
          >
            Previous
          </button>
          <button type="button" className="rounded-xl bg-[#D6C29A] px-3 py-1.5 font-bold text-white shadow-xs">
            1
          </button>
          <button
            type="button"
            disabled
            className="rounded-xl border border-[#1E2C4F] bg-[#0B132B] px-3 py-1.5 text-[#B8C2D9]/70 opacity-60 cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Floating Bottom Bulk Action Bar */}
      {selectedQuoteIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex w-[calc(100vw-2rem)] sm:w-auto max-w-full flex-wrap justify-center items-center gap-3 bg-neutral-900 text-white px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-2xl border border-neutral-700">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D6C29A] text-xs font-bold text-white">
              {selectedQuoteIds.length}
            </span>
            <span className="text-xs font-semibold">
              {selectedQuoteIds.length === 1 ? '1 quote selected' : `${selectedQuoteIds.length} quotes selected`}
            </span>
          </div>
          <div className="h-4 w-px bg-neutral-700 mx-1" />
          <button
            type="button"
            onClick={() => setIsBulkDeleting(true)}
            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Selected
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="rounded-xl border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            Deselect All
          </button>
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      {deletingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#1E2C4F] bg-[#14213D] p-4 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#F5F3EE]">Delete Quote Request?</h3>
                <p className="text-xs text-[#B8C2D9]">
                  Are you sure you want to delete quote &quot;{deletingQuote.quoteNumber}&quot;?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E2C4F]">
              <button
                type="button"
                onClick={() => setDeletingQuote(null)}
                className="rounded-xl border border-[#1E2C4F] px-4 py-2.5 text-xs font-bold text-[#F5F3EE] hover:bg-[#0B132B] cursor-pointer"
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

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#1E2C4F] bg-[#14213D] p-4 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start gap-3 text-red-600">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 mt-0.5">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#F5F3EE]">
                  Delete {selectedQuoteIds.length} Quote Request{selectedQuoteIds.length > 1 ? 's' : ''}?
                </h3>
                <p className="text-xs text-[#B8C2D9] mt-1">
                  Are you sure you want to permanently delete the {selectedQuoteIds.length} selected quote requests? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="max-h-40 overflow-y-auto rounded-2xl bg-[#0B132B] p-3 border border-[#1E2C4F] text-xs space-y-1.5">
              {quotes
                .filter((q) => selectedQuoteIds.includes(getQuoteId(q)))
                .map((q) => (
                  <div
                    key={getQuoteId(q)}
                    className="flex items-center justify-between font-medium text-[#F5F3EE] py-1 border-b border-[#1E2C4F] last:border-0"
                  >
                    <span className="font-mono font-bold text-[#F5F3EE]">{q.quoteNumber}</span>
                    <span className="text-[#B8C2D9] truncate max-w-[150px]">{q.name || 'Client'}</span>
                    <span className="font-bold text-[#F5F3EE]">AED {q.totalPrice?.toLocaleString()}</span>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E2C4F]">
              <button
                type="button"
                onClick={() => setIsBulkDeleting(false)}
                className="rounded-xl border border-[#1E2C4F] px-4 py-2.5 text-xs font-bold text-[#F5F3EE] hover:bg-[#0B132B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmBulkDelete}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
              >
                Delete {selectedQuoteIds.length} Quotes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
