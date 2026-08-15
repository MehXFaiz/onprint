import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Image as ImageIcon, Save } from 'lucide-react'
import Button from '../../components/Button'
import ImageUploader from '../../components/ImageUploader'

export default function AdminPortfolioFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    title: '',
    client: '',
    category: 'Corporate Gifts',
    image: '',
    description: '',
    status: 'active',
  })

  useEffect(() => {
    if (!isEdit) return
    setForm({
      title: 'Emirates Custom Water Bottles',
      client: 'Emirates Logistics',
      category: 'Corporate Gifts',
      image: '/assets/products/1 (13).jpg',
      description: 'Custom laser engraved smart vacuum flasks for corporate staff.',
      status: 'active',
    })
  }, [id, isEdit])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Project Title is required.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      navigate('/admin/portfolio', {
        state: { toast: `Portfolio item "${form.title}" ${isEdit ? 'updated' : 'created'} successfully.` },
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
        <Link to="/admin/portfolio" className="hover:text-neutral-900 transition-colors">
          Portfolio
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-neutral-900 font-bold">{isEdit ? 'Edit Item' : 'Add New Item'}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <Link
            to="/admin/portfolio"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A82F19] hover:underline mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Portfolio
          </Link>
          <h1 className="font-display text-2xl font-black text-neutral-900">
            {isEdit ? `Edit Project: ${form.title}` : 'Add Portfolio Showcase Item'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Add completed client print projects to showcase gallery.
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
              <ImageIcon className="h-4 w-4 text-[#A82F19]" />
              Project Showcase Details
            </h3>
            <p className="text-xs text-neutral-500">Project title, client name, and category.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Executive Leather Journals"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Client Name
              </label>
              <input
                type="text"
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                placeholder="e.g. Vertex Tech Dubai"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-bold text-neutral-900 focus:border-[#A82F19] focus:outline-none cursor-pointer"
              >
                <option value="Corporate Gifts">Corporate Gifts</option>
                <option value="Stationery">Office Stationery</option>
                <option value="Large Format">Large Format Signage</option>
              </select>
            </div>

            <ImageUploader
              label="Portfolio Cover Image"
              value={form.image}
              onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
              altText={form.altText || form.title}
              onAltTextChange={(alt) => setForm((prev) => ({ ...prev, altText: alt }))}
              description="Upload portfolio project showcase image (JPG, PNG, WEBP, SVG up to 5MB)"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Project Description
            </label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe printing technique, material finishing, and client outcome..."
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-xs">
          <Link
            to="/admin/portfolio"
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
            {submitting ? 'Saving...' : isEdit ? 'Update Project' : 'Save Project'}
          </Button>
        </div>
      </form>
    </div>
  )
}
