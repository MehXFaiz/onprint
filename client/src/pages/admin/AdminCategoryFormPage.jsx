import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, FolderTree, Save, Image as ImageIcon } from 'lucide-react'
import Button from '../../components/Button'
import { getCategoryById, createCategory, updateCategory } from '../../services/categories'

export default function AdminCategoryFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [slugEdited, setSlugEdited] = useState(false)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    image_url: '',
    status: 'active',
    displayOrder: 0,
    display_order: 0,
  })

  // Load existing category for editing
  useEffect(() => {
    if (!isEdit) return
    async function loadCategory() {
      try {
        setLoading(true)
        const cat = await getCategoryById(id)
        if (cat) {
          const img = cat.image_url || cat.image || ''
          const order = cat.display_order ?? cat.displayOrder ?? 0
          setForm({
            name: cat.name || '',
            slug: cat.slug || '',
            description: cat.description || '',
            image: img,
            image_url: img,
            status: cat.status || (cat.active ? 'active' : 'inactive'),
            displayOrder: order,
            display_order: order,
          })
          setSlugEdited(true)
        }
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load category data.')
      } finally {
        setLoading(false)
      }
    }
    loadCategory()
  }, [id, isEdit])

  const slugify = (text) => {
    return (text || '')
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  const handleNameChange = (e) => {
    const val = e.target.value
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: slugEdited ? prev.slug : slugify(val),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.name.trim()) {
      setError('Category Name is required.')
      return
    }
    if (!form.slug.trim()) {
      setError('Category Slug is required.')
      return
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      image: form.image || form.image_url || '',
      image_url: form.image_url || form.image || '',
      status: form.status,
      displayOrder: Number(form.displayOrder ?? form.display_order ?? 0),
      display_order: Number(form.display_order ?? form.displayOrder ?? 0),
    }

    setSubmitting(true)
    try {
      if (isEdit) {
        await updateCategory(id, payload)
        navigate('/admin/categories', { state: { toast: `Category "${form.name}" updated successfully.` } })
      } else {
        await createCategory(payload)
        navigate('/admin/categories', { state: { toast: `Category "${form.name}" created successfully.` } })
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save category.')
    } finally {
      setSubmitting(false)
    }
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
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        <Link to="/admin" className="hover:text-neutral-900 transition-colors">
          Admin
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <Link to="/admin/categories" className="hover:text-neutral-900 transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-neutral-900 font-bold">{isEdit ? 'Edit Category' : 'Add New Category'}</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A82F19] hover:underline mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Categories
          </Link>
          <h1 className="font-display text-2xl font-black text-neutral-900">
            {isEdit ? `Edit Category: ${form.name}` : 'Add New Category'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {isEdit
              ? 'Update category details and settings in MySQL database.'
              : 'Create a new product category in GoDaddy MySQL database.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Main Form Layout */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-[#A82F19]" />
              Basic Information
            </h3>
            <p className="text-xs text-neutral-500">Primary category naming and catalog identifiers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Name */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={handleNameChange}
                placeholder="e.g. Corporate Gift Items"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            {/* Category Slug */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Category Slug *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugEdited(true)
                  setForm({ ...form, slug: slugify(e.target.value) })
                }}
                placeholder="e.g. corporate-gift-items"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Description
            </label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Provide a detailed overview of items included in this category..."
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Media & Settings */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#A82F19]" />
              Media & Display Options
            </h3>
            <p className="text-xs text-neutral-500">Configure visual banner image and ordering sequence.</p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Category Image URL
            </label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="/assets/products/1 (1).jpg or image link"
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none"
            />
            {form.image && (
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white flex items-center justify-center">
                  <img
                    src={form.image}
                    alt="Category Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/assets/products/1 (1).jpg'
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
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

            {/* Display Order */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Display Order
              </label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-xs">
          <Link
            to="/admin/categories"
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
            {submitting ? 'Saving...' : isEdit ? 'Update Category' : 'Save Category'}
          </Button>
        </div>
      </form>
    </div>
  )
}
