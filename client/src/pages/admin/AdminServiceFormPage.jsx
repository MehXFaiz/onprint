import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Wrench, Save, Image as ImageIcon } from 'lucide-react'
import Button from '../../components/Button'

const MOCK_SERVICES = [
  { id: 1, name: 'Digital & Offset Printing', slug: 'digital-offset-printing', description: 'High-precision digital and high-volume offset printing.', status: 'active', displayOrder: 1 },
  { id: 2, name: 'Luxury Packaging & Custom Boxes', slug: 'luxury-packaging-custom-boxes', description: 'Custom rigid boxes, magnetic gift boxes.', status: 'active', displayOrder: 2 },
]

export default function AdminServiceFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    image: '',
    status: 'active',
    displayOrder: 0,
  })

  useEffect(() => {
    if (!isEdit) return
    const found = MOCK_SERVICES.find((s) => String(s.id) === String(id))
    if (found) {
      setForm({
        name: found.name || '',
        slug: found.slug || '',
        shortDescription: found.description || '',
        description: found.description || '',
        image: found.image || '',
        status: found.status || 'active',
        displayOrder: found.displayOrder || 0,
      })
    }
    setLoading(false)
  }, [id, isEdit])

  const slugify = (text) => {
    return (text || '')
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Service Name is required.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      navigate('/admin/services', {
        state: { toast: `Service "${form.name}" ${isEdit ? 'updated' : 'created'} successfully.` },
      })
    }, 400)
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-neutral-200 rounded-lg" />
        <div className="h-96 rounded-3xl bg-white border border-neutral-200" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        <Link to="/admin" className="hover:text-neutral-900 transition-colors">
          Admin
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <Link to="/admin/services" className="hover:text-neutral-900 transition-colors">
          Services
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-neutral-900 font-bold">{isEdit ? 'Edit Service' : 'Add New Service'}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <Link
            to="/admin/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A82F19] hover:underline mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Services
          </Link>
          <h1 className="font-display text-2xl font-black text-neutral-900">
            {isEdit ? `Edit Service: ${form.name}` : 'Add New Print Service'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure custom printing solutions and workshop offerings.
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
              <Wrench className="h-4 w-4 text-[#A82F19]" />
              Service Specifications
            </h3>
            <p className="text-xs text-neutral-500">Service title, slug, and description.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Service Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value, slug: slugify(e.target.value) }))
                }
                placeholder="e.g. Digital & Offset Printing"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Service Slug *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                placeholder="e.g. digital-offset-printing"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-mono text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Description
            </label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe service capabilities, equipment, and turnaround time..."
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Service Image URL
              </label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/assets/products/1 (7).jpg"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
              {form.image && (
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white flex items-center justify-center">
                    <img
                      src={form.image}
                      alt="Service Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/assets/products/1 (7).jpg'
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900">Image Preview</div>
                    <div className="text-[11px] text-neutral-500 font-mono truncate max-w-xs">{form.image}</div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-bold text-neutral-900 focus:border-[#A82F19] focus:outline-none cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-xs">
          <Link
            to="/admin/services"
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
            {submitting ? 'Saving...' : isEdit ? 'Update Service' : 'Save Service'}
          </Button>
        </div>
      </form>
    </div>
  )
}
