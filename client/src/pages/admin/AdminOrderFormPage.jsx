import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, ShoppingBag, Save } from 'lucide-react'
import Button from '../../components/Button'

export default function AdminOrderFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    orderNumber: 'ORD-2026-104921',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    company: '',
    productName: '',
    quantity: '500',
    totalPrice: '4250',
    status: 'In Production',
    notes: '',
  })

  useEffect(() => {
    if (!isEdit) return
    setForm({
      orderNumber: 'ORD-2026-104921',
      customerName: 'Ahmed Al Mansoori',
      customerEmail: 'ahmed@emirateslogistics.ae',
      customerPhone: '+971 50 123 4567',
      company: 'Emirates Logistics',
      productName: 'Custom Water Bottles Printing in Dubai',
      quantity: '500',
      totalPrice: '4250',
      status: 'In Production',
      notes: 'Smart LED temperature display with laser engraving logo.',
    })
  }, [id, isEdit])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.customerName.trim() || !form.productName.trim()) {
      setError('Customer Name and Product Name are required.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      navigate('/admin/orders', {
        state: { toast: `Order ${form.orderNumber} ${isEdit ? 'updated' : 'created'} successfully.` },
      })
    }, 400)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        <Link to="/admin" className="hover:text-neutral-900 transition-colors">
          Admin
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <Link to="/admin/orders" className="hover:text-neutral-900 transition-colors">
          Orders
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-neutral-900 font-bold">{isEdit ? 'Edit Order' : 'Create New Order'}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A82F19] hover:underline mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Orders
          </Link>
          <h1 className="font-display text-2xl font-black text-neutral-900">
            {isEdit ? `Edit Order: ${form.orderNumber}` : 'Create Manual Production Order'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage client order details, production status, and price totals.
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
              <ShoppingBag className="h-4 w-4 text-[#A82F19]" />
              Order Specifications
            </h3>
            <p className="text-xs text-neutral-500">Customer information and ordered items.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                placeholder="Ahmed Al Mansoori"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Customer Email
              </label>
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                placeholder="ahmed@emirateslogistics.ae"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Ordered Item / Product *
              </label>
              <input
                type="text"
                required
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                placeholder="Custom Water Bottles Printing in Dubai"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Company Name
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Emirates Logistics"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Quantity (Units)
              </label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Total Price (AED)
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
                Production Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-bold text-neutral-900 focus:border-[#A82F19] focus:outline-none cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="In Production">In Production</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Print Notes & Vector Artwork Links
            </label>
            <textarea
              rows="3"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Special debossing, spot UV, or courier delivery notes..."
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-xs">
          <Link
            to="/admin/orders"
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
            {submitting ? 'Saving...' : isEdit ? 'Update Order' : 'Save Order'}
          </Button>
        </div>
      </form>
    </div>
  )
}
