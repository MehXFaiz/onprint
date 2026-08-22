import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, FileText, Save } from 'lucide-react'
import Button from '../../components/Button'
import { getStoredQuotes, createQuote, updateQuote } from '../../services/quotes'

export default function AdminQuoteFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    quoteNumber: `QT-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    name: '',
    email: '',
    phone: '',
    company: '',
    totalPrice: '2500',
    status: 'Pending',
    notes: '',
  })

  useEffect(() => {
    if (!isEdit) return
    const quotes = getStoredQuotes()
    const existing = quotes.find((q) => String(q.id) === String(id) || q._id === id || q.quoteNumber === id)
    if (existing) {
      setForm({
        quoteNumber: existing.quoteNumber || `QT-2026-${existing.id}`,
        name: existing.name || '',
        email: existing.email || '',
        phone: existing.phone || '',
        company: existing.company || '',
        totalPrice: String(existing.totalPrice || 0),
        status: existing.status || 'Pending',
        notes: existing.notes || '',
      })
    }
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      setError('Contact Name and Email address are required.')
      return
    }

    setSubmitting(true)
    const total = parseFloat(form.totalPrice) || 0

    try {
      if (isEdit) {
        await updateQuote(id, {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
          totalPrice: total,
          status: form.status,
          notes: form.notes.trim(),
        })
      } else {
        await createQuote({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
          totalPrice: total,
          status: form.status,
          notes: form.notes.trim(),
        })
      }

      const toastMessage =
        form.status === 'Approved'
          ? `Quote ${form.quoteNumber} approved and converted to active order in Orders!`
          : `Quote request ${form.quoteNumber} ${isEdit ? 'updated' : 'created'} successfully.`

      navigate('/admin/quotes', {
        state: { toast: toastMessage },
      })
    } catch (err) {
      setError(err.message || 'Failed to save quote.')
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        <Link to="/admin" className="hover:text-neutral-900 transition-colors">
          Admin
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <Link to="/admin/quotes" className="hover:text-neutral-900 transition-colors">
          Quotes
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-neutral-900 font-bold">{isEdit ? 'Edit Quote' : 'New Quote Request'}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <Link
            to="/admin/quotes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A82F19] hover:underline mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Quotes
          </Link>
          <h1 className="font-display text-2xl font-black text-neutral-900">
            {isEdit ? `Edit Quote: ${form.quoteNumber}` : 'Create Manual Quote Request'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Review custom print estimates and client specifications.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#A82F19]" />
              Quote Request Details
            </h3>
            <p className="text-xs text-neutral-500">Client contact and estimated pricing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Contact Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Khalid Real Estate"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="khalid@khalidre.ae"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Phone Number
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+971 55 444 3322"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Estimated Price (AED)
              </label>
              <input
                type="number"
                value={form.totalPrice}
                onChange={(e) => setForm({ ...form, totalPrice: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Quote Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-bold text-neutral-900 focus:border-[#A82F19] focus:outline-none cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Custom Requirements & Specifications
            </label>
            <textarea
              rows="4"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Custom size, material paper weight, foil debossing details..."
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-xs">
          <Link
            to="/admin/quotes"
            className="rounded-xl border border-neutral-300 px-5 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </Link>

          <Button
            type="submit"
            variant="accent"
            icon={false}
            disabled={submitting}
            className="!px-6 shadow-md shadow-[#A82F19]/20"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {submitting ? 'Saving...' : isEdit ? 'Update Quote' : 'Save Quote'}
          </Button>
        </div>
      </form>
    </div>
  )
}
