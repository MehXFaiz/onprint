import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, FolderTree, Save, Image as ImageIcon, Search, Globe, Sparkles } from 'lucide-react'
import Button from '../../components/Button'
import ImageUploader from '../../components/ImageUploader'
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
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    seoHeading: '',
    imageAlt: '',
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
            seoTitle: cat.seoTitle || '',
            seoDescription: cat.seoDescription || '',
            seoKeywords: cat.seoKeywords || '',
            seoHeading: cat.seoHeading || '',
            imageAlt: cat.imageAlt || '',
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

  const handleSlugChange = (e) => {
    setSlugEdited(true)
    setForm((prev) => ({
      ...prev,
      slug: slugify(e.target.value),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.name.trim()) {
      setError('Category name is required.')
      return
    }

    if (!form.slug.trim()) {
      setError('Category slug is required.')
      return
    }

    if (!form.image_url && !form.image) {
      setError('Category Image is required. Please choose an image file.')
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        image: form.image_url || form.image,
        image_url: form.image_url || form.image,
        status: form.status,
        displayOrder: Number(form.displayOrder) || 0,
        display_order: Number(form.displayOrder) || 0,
        seo_title: form.seoTitle.trim() || `${form.name.trim()} | ONPRINT Dubai`,
        seoTitle: form.seoTitle.trim() || `${form.name.trim()} | ONPRINT Dubai`,
        seo_description: form.seoDescription.trim() || form.description.trim(),
        seoDescription: form.seoDescription.trim() || form.description.trim(),
        seo_keywords: form.seoKeywords.trim(),
        seoKeywords: form.seoKeywords.trim(),
        seo_heading: form.seoHeading.trim() || form.name.trim(),
        seoHeading: form.seoHeading.trim() || form.name.trim(),
        image_alt: form.imageAlt.trim() || form.name.trim(),
        imageAlt: form.imageAlt.trim() || form.name.trim(),
      }

      if (isEdit) {
        await updateCategory(id, payload)
      } else {
        await createCategory(payload)
      }

      navigate('/admin/categories')
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save category.')
    } finally {
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

  const serpTitle = form.seoTitle || (form.name ? `${form.name} | ONPRINT Dubai` : 'Category Title | ONPRINT Dubai')
  const serpDesc = form.seoDescription || (form.description ? form.description : 'High-impact printing and branding solutions manufactured in Dubai, UAE.')
  const serpUrl = `https://0nprint.com/categories/${form.slug || 'category-slug'}`

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        <Link to="/admin" className="hover:text-neutral-900 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/admin/categories" className="hover:text-neutral-900 transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-900">{isEdit ? 'Edit Category' : 'Create Category'}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-neutral-900">
            {isEdit ? `Edit Category: ${form.name}` : 'Add New Category'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Configure category metadata, imagery, and Google Search Optimization settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/categories')}
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
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Category'}
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
        {/* Left Column: Details & SEO */}
        <div className="space-y-6 lg:col-span-8">
          {/* General Information Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              General Information
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleNameChange}
                placeholder="e.g. Brochures Printing"
                required
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-500 focus-within:border-[#A82F19]">
                <span className="text-neutral-400">/categories/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="brochures-printing"
                  required
                  className="w-full bg-transparent pl-1 font-semibold text-neutral-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the products grouped under this category…"
                className="w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          {/* SEO & Meta Tags Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Search className="h-4 w-4 text-[#A82F19]" />
              <h2 className="font-display text-base font-bold text-neutral-900">
                Google Search Engine Optimization (SEO)
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
                placeholder="e.g. Corporate Gifts Dubai | Custom Promotional Items | ONPRINT"
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
                placeholder="Write an enticing summary for Google searchers (130-160 characters)..."
                className="w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  SEO Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={form.seoKeywords}
                  onChange={(e) => setForm((prev) => ({ ...prev, seoKeywords: e.target.value }))}
                  placeholder="corporate gifts dubai, promotional gifts uae"
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Primary H1 Heading Override
                </label>
                <input
                  type="text"
                  value={form.seoHeading}
                  onChange={(e) => setForm((prev) => ({ ...prev, seoHeading: e.target.value }))}
                  placeholder={form.name || 'Defaults to Category Name'}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
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

        {/* Right Column: Image & Publishing */}
        <div className="space-y-6 lg:col-span-4">
          {/* Publishing Settings */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Publishing
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
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: e.target.value, display_order: e.target.value }))}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          {/* Image & Alt Text */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Category Image &amp; ALT
            </h2>

            <ImageUploader
              value={form.image_url || form.image}
              onChange={(url) => setForm((prev) => ({ ...prev, image: url, image_url: url }))}
            />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Image ALT Text (SEO)
              </label>
              <input
                type="text"
                value={form.imageAlt}
                onChange={(e) => setForm((prev) => ({ ...prev, imageAlt: e.target.value }))}
                placeholder={form.name || 'Descriptive ALT tag for screen readers & Google Images'}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
