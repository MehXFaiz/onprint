import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Package, Save, Image as ImageIcon } from 'lucide-react'
import Button from '../../components/Button'
import ImageUploader from '../../components/ImageUploader'
import { getStoredProducts, addProduct } from '../../services/products'

const DEFAULT_CATEGORIES = [
  'Corporate Gift Items',
  'Office Stationery Printing',
  'Other Products',
  'Bags Printing',
  'Apparel & T-Shirts',
]

export default function AdminProductFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    name: '',
    categoryName: 'Corporate Gift Items',
    price: '50',
    minimumQuantity: '10',
    shortDescription: '',
    description: '',
    image: '',
    images: [],
    altText: '',
    featured: false,
    status: 'active',
  })

  useEffect(() => {
    if (!isEdit) return
    const all = getStoredProducts()
    const found = all.find((p) => String(p._id || p.id) === String(id))
    if (found) {
      const imgList = Array.isArray(found.images) ? found.images : found.image ? [found.image] : []
      setForm({
        name: found.name || '',
        categoryName: typeof found.category === 'object' ? found.category?.name : found.category || 'Corporate Gift Items',
        price: String(found.price || 50),
        minimumQuantity: String(found.minimumQuantity || 10),
        shortDescription: found.shortDescription || '',
        description: found.description || found.shortDescription || '',
        image: imgList[0] || '',
        images: imgList,
        altText: found.altText || found.name || '',
        featured: Boolean(found.featured),
        status: found.active !== false ? 'active' : 'inactive',
      })
    }
    setLoading(false)
  }, [id, isEdit])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Product Name is required.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        name: form.name.trim(),
        category: { name: form.categoryName },
        price: parseFloat(form.price) || 50,
        minimumQuantity: parseInt(form.minimumQuantity, 10) || 1,
        shortDescription: form.shortDescription,
        description: form.description || form.shortDescription,
        images: [form.image || '/assets/products/1 (1).jpg'],
        featured: form.featured,
        active: form.status === 'active',
      }

      if (isEdit) {
        // Edit logic
        addProduct({ ...payload, _id: id })
        navigate('/admin/products', { state: { toast: `Product "${form.name}" updated successfully.` } })
      } else {
        // Create logic
        const created = addProduct(payload)
        navigate('/admin/products', { state: { toast: `Product "${created.name}" created successfully.` } })
      }
    } catch (err) {
      setError(err?.message || 'Failed to save product.')
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
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        <Link to="/admin" className="hover:text-neutral-900 transition-colors">
          Admin
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <Link to="/admin/products" className="hover:text-neutral-900 transition-colors">
          Products
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-neutral-900 font-bold">{isEdit ? 'Edit Product' : 'Add New Product'}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A82F19] hover:underline mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Products
          </Link>
          <h1 className="font-display text-2xl font-black text-neutral-900">
            {isEdit ? `Edit Product: ${form.name}` : 'Add New Product'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {isEdit ? 'Modify product specs, pricing, and catalog image.' : 'Upload a new print item to shop catalog.'}
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
        {/* Basic Info */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <Package className="h-4 w-4 text-[#A82F19]" />
              Product Details
            </h3>
            <p className="text-xs text-neutral-500">Name, target category, and commercial description.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Custom Mug Printing Dubai"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Category
              </label>
              <select
                value={form.categoryName}
                onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-bold text-neutral-900 focus:border-[#A82F19] focus:outline-none cursor-pointer"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Price (AED)
              </label>
              <input
                type="number"
                step="0.5"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Minimum Unit Quantity
              </label>
              <input
                type="number"
                value={form.minimumQuantity}
                onChange={(e) => setForm({ ...form, minimumQuantity: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Short Description
            </label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              placeholder="High-resolution full color sublimation mug printing..."
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Full Specs / Description
            </label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detailed print specifications..."
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
            />
          </div>
        </div>

        {/* Media & Visibility */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#A82F19]" />
              Media & Options
            </h3>
            <p className="text-xs text-neutral-500">Image URL and catalog highlights.</p>
          </div>

          <div className="space-y-6">
            <ImageUploader
              label="Main Product Image *"
              value={form.image}
              onChange={(url) =>
                setForm((prev) => {
                  const mainUrl = url || ''
                  const remainingGallery = (prev.images || []).filter((u) => u !== prev.image)
                  return {
                    ...prev,
                    image: mainUrl,
                    images: mainUrl ? [mainUrl, ...remainingGallery] : remainingGallery,
                  }
                })
              }
              altText={form.altText}
              onAltTextChange={(text) => setForm((prev) => ({ ...prev, altText: text }))}
              description="Upload main product showcase image (JPG, PNG, WEBP, SVG up to 5MB)"
            />

            <ImageUploader
              label="Additional Product Gallery Images"
              multiple={true}
              value={(form.images || []).filter((u) => u !== form.image)}
              onChange={(galleryUrls) =>
                setForm((prev) => ({
                  ...prev,
                  images: prev.image ? [prev.image, ...galleryUrls] : galleryUrls,
                }))
              }
              description="Upload supplementary angle & detail photos (up to 10 images)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Catalog Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-bold text-neutral-900 focus:border-[#A82F19] focus:outline-none cursor-pointer"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="relative flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-[#A82F19] focus:ring-[#A82F19]"
                />
                <span className="text-xs font-bold text-neutral-900">Feature on Homepage Showcase</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-xs">
          <Link
            to="/admin/products"
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
            {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  )
}
