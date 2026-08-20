import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Package, Save, Image as ImageIcon, Search, Globe } from 'lucide-react'
import Button from '../../components/Button'
import ImageUploader from '../../components/ImageUploader'
import { getStoredProducts, addProduct } from '../../services/products'
import { getCategories } from '../../services/categories'

export default function AdminProductFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [slugEdited, setSlugEdited] = useState(false)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    categoryName: 'Office Stationery Printing',
    price: '50',
    minimumQuantity: '10',
    shortDescription: '',
    description: '',
    image: '',
    images: [],
    imageAlt: '',
    featured: false,
    status: 'active',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    seoHeading: '',
  })

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (!isEdit) return
    const all = getStoredProducts()
    const found = all.find((p) => String(p._id || p.id) === String(id))
    if (found) {
      const imgList = Array.isArray(found.images) ? found.images : found.image ? [found.image] : []
      setForm({
        name: found.name || '',
        slug: found.slug || '',
        categoryName: typeof found.category === 'object' ? found.category?.name : found.category || 'Office Stationery Printing',
        price: String(found.price || 50),
        minimumQuantity: String(found.minimumQuantity || 10),
        shortDescription: found.shortDescription || '',
        description: found.description || found.shortDescription || '',
        image: imgList[0] || '',
        images: imgList,
        imageAlt: found.imageAlt || found.altText || found.name || '',
        featured: Boolean(found.featured),
        status: found.active !== false ? 'active' : 'inactive',
        seoTitle: found.seoTitle || '',
        seoDescription: found.seoDescription || '',
        seoKeywords: found.seoKeywords || '',
        seoHeading: found.seoHeading || '',
      })
      setSlugEdited(true)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Product Name is required.')
      return
    }

    setSubmitting(true)
    try {
      const cleanSlug = form.slug.trim() || slugify(form.name.trim())
      const payload = {
        name: form.name.trim(),
        slug: cleanSlug,
        category: { name: form.categoryName },
        price: parseFloat(form.price) || 50,
        minimumQuantity: parseInt(form.minimumQuantity, 10) || 1,
        shortDescription: form.shortDescription,
        description: form.description || form.shortDescription,
        images: [form.image || '/assets/products/1 (1).jpg'],
        image_alt: form.imageAlt || form.name.trim(),
        imageAlt: form.imageAlt || form.name.trim(),
        featured: form.featured,
        active: form.status === 'active',
        seo_title: form.seoTitle || `${form.name.trim()} | ONPRINT Dubai`,
        seoTitle: form.seoTitle || `${form.name.trim()} | ONPRINT Dubai`,
        seo_description: form.seoDescription || form.shortDescription || form.description,
        seoDescription: form.seoDescription || form.shortDescription || form.description,
        seo_keywords: form.seoKeywords,
        seoKeywords: form.seoKeywords,
        seo_heading: form.seoHeading || form.name.trim(),
        seoHeading: form.seoHeading || form.name.trim(),
        canonical_url: `https://0nprint.com/products/${cleanSlug}`,
      }

      if (isEdit) {
        addProduct({ ...payload, _id: id, id })
        navigate('/admin/products', { state: { toast: `Product "${form.name}" updated successfully.` } })
      } else {
        const created = addProduct(payload)
        navigate('/admin/products', { state: { toast: `Product "${created.name}" created successfully.` } })
      }
    } catch (err) {
      setError(err.message || 'Failed to save product.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#A82F19] border-t-transparent" />
      </div>
    )
  }

  const serpTitle = form.seoTitle || (form.name ? `${form.name} Dubai | ONPRINT` : 'Product Title | ONPRINT Dubai')
  const serpDesc = form.seoDescription || form.shortDescription || 'Custom commercial printing and branded merchandise in Dubai, UAE.'
  const serpUrl = `https://0nprint.com/products/${form.slug || 'product-slug'}`

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        <Link to="/admin" className="hover:text-neutral-900 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/admin/products" className="hover:text-neutral-900 transition-colors">
          Products
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-900">{isEdit ? 'Edit Product' : 'Add Product'}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-neutral-900">
            {isEdit ? `Edit Product: ${form.name}` : 'Add New Product'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage product specs, pricing, imagery, and Google Search metadata.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
            disabled={submitting}
            className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Cancel
          </Button>
          <Button
            type="button"
            variant="accent"
            onClick={handleSubmit}
            disabled={submitting}
            className="text-xs font-bold"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-8">
          {/* General Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Product Information
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleNameChange}
                placeholder="e.g. Executive Leather Hardcover Notebook"
                required
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-500 focus-within:border-[#A82F19]">
                <span className="text-neutral-400">/products/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugEdited(true)
                    setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                  }}
                  placeholder="executive-leather-notebook"
                  required
                  className="w-full bg-transparent pl-1 font-semibold text-neutral-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Category
                </label>
                <select
                  value={form.categoryName}
                  onChange={(e) => setForm((prev) => ({ ...prev, categoryName: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                >
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <option key={c._id || c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Corporate Gift Items">Corporate Gift Items</option>
                      <option value="Office Stationery Printing">Office Stationery Printing</option>
                      <option value="Other Products">Other Products</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Base Price (AED)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Minimum Quantity (MOQ)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.minimumQuantity}
                  onChange={(e) => setForm((prev) => ({ ...prev, minimumQuantity: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Short Summary (Card Preview)
              </label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="High-grade thermal bottles with LED smart display…"
                className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Full Technical Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed specifications, paper stocks, print methods, and finishing options…"
                className="w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          {/* SEO & Meta Tags Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Search className="h-4 w-4 text-[#A82F19]" />
              <h2 className="font-display text-base font-bold text-neutral-900">
                Google Search Optimization (SEO)
              </h2>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  SEO Meta Title
                </label>
                <span className={`text-[11px] font-bold ${form.seoTitle.length > 60 ? 'text-amber-600' : 'text-neutral-400'}`}>
                  {form.seoTitle.length} / 60 chars
                </span>
              </div>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="e.g. Custom Mugs Printing Dubai | Corporate Photo Mugs | ONPRINT"
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  SEO Meta Description
                </label>
                <span className={`text-[11px] font-bold ${form.seoDescription.length > 160 ? 'text-amber-600' : 'text-neutral-400'}`}>
                  {form.seoDescription.length} / 160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={form.seoDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
                placeholder="Write a clear meta description highlighting Dubai delivery, quality materials, and custom printing..."
                className="w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={form.seoKeywords}
                  onChange={(e) => setForm((prev) => ({ ...prev, seoKeywords: e.target.value }))}
                  placeholder="mug printing dubai, custom mugs uae"
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Primary H1 Heading
                </label>
                <input
                  type="text"
                  value={form.seoHeading}
                  onChange={(e) => setForm((prev) => ({ ...prev, seoHeading: e.target.value }))}
                  placeholder={form.name || 'Defaults to Product Name'}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>
            </div>

            {/* Live Google SERP Snippet Preview */}
            <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Google SERP Snippet Preview
              </span>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 truncate">
                  <Globe className="h-3 w-3 text-neutral-400" />
                  <span>{serpUrl}</span>
                </div>
                <div className="text-sm font-bold text-blue-800 hover:underline cursor-pointer">
                  {serpTitle}
                </div>
                <div className="text-xs text-neutral-600 line-clamp-2">
                  {serpDesc}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-4">
          {/* Status & Options */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Publishing Options
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Visibility Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              >
                <option value="active">Active (Visible in Catalog)</option>
                <option value="inactive">Inactive (Draft / Hidden)</option>
              </select>
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4 rounded border-neutral-300 text-[#A82F19] focus:ring-[#A82F19]"
              />
              <span className="text-xs font-bold text-neutral-800">Feature on Homepage</span>
            </label>
          </div>

          {/* Product Image & ALT */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Product Image &amp; ALT
            </h2>

            <ImageUploader
              value={form.image}
              onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
            />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Image ALT Text (SEO)
              </label>
              <input
                type="text"
                value={form.imageAlt}
                onChange={(e) => setForm((prev) => ({ ...prev, imageAlt: e.target.value }))}
                placeholder={form.name || 'Descriptive ALT tag for Google Image search'}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
