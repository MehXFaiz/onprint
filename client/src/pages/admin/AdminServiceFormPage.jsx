import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Wrench, Save, Image as ImageIcon, Search, Globe, Sparkles, CheckCircle2 } from 'lucide-react'
import Button from '../../components/Button'
import ImageUploader from '../../components/ImageUploader'
import { getServices, getStoredServices, addService, updateService } from '../../services/services'
import { generateEntitySeoDraft } from '../../utils/seoDraftGenerator'

export default function AdminServiceFormPage() {
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
    shortDescription: '',
    description: '',
    image: '',
    status: 'active',
    displayOrder: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    seoHeading: '',
    imageAlt: '',
    seoReviewStatus: 'approved',
  })

  useEffect(() => {
    if (!isEdit) return
    getServices()
      .then((services) => {
        const found = services.find((s) => String(s._id || s.id) === String(id) || s.slug === id)
        if (found) {
          setForm({
            name: found.name || '',
            slug: found.slug || '',
            shortDescription: found.shortDescription || found.description || '',
            description: found.description || found.shortDescription || '',
            image: found.image || '',
            status: found.active !== false ? 'active' : 'inactive',
            displayOrder: found.order || 0,
            seoTitle: found.seoTitle || '',
            seoDescription: found.seoDescription || '',
            seoKeywords: found.seoKeywords || '',
            seoHeading: found.seoHeading || '',
            imageAlt: found.imageAlt || '',
            seoReviewStatus: found.seoReviewStatus || 'approved',
          })
          setSlugEdited(true)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
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

  const handleGenerateSeoDraft = () => {
    if (!form.name.trim()) {
      setError('Please enter a Service Name first so the SEO engine can generate accurate metadata.')
      return
    }
    setError(null)
    const allServices = getStoredServices()
    const draft = generateEntitySeoDraft({
      entityType: 'service',
      name: form.name.trim(),
      slug: form.slug || form.name,
      shortDescription: form.shortDescription,
      description: form.description,
      existingCatalogItems: allServices,
    })
    setForm((prev) => ({
      ...prev,
      slug: prev.slug || draft.slug,
      seoTitle: draft.seoTitle,
      seoDescription: draft.seoDescription,
      seoKeywords: draft.seoKeywords,
      seoHeading: draft.seoHeading,
      imageAlt: prev.imageAlt || draft.imageAlt,
      seoReviewStatus: 'needs_review',
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Service Name is required.')
      return
    }

    setSubmitting(true)
    try {
      const cleanSlug = form.slug.trim() || slugify(form.name.trim())
      const payload = {
        name: form.name.trim(),
        slug: cleanSlug,
        shortDescription: form.shortDescription,
        description: form.description || form.shortDescription,
        image: form.image || '/uploads/categories/business-cards-printing.jpg',
        image_url: form.image || '/uploads/categories/business-cards-printing.jpg',
        active: form.status === 'active',
        order: Number(form.displayOrder || 0),
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        seoKeywords: form.seoKeywords,
        seoHeading: form.seoHeading,
        imageAlt: form.imageAlt,
        canonicalUrl: `https://www.0nprint.com/services/${cleanSlug}`,
        seoReviewStatus: form.seoReviewStatus || 'needs_review',
      }

      if (isEdit) {
        updateService(id, payload)
      } else {
        addService(payload)
      }

      navigate('/admin/services', {
        state: { toast: `Service "${form.name}" ${isEdit ? 'updated' : 'created'} successfully.` },
      })
    } catch (err) {
      setError(err.message || 'Failed to save service.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D6C29A] border-t-transparent" />
      </div>
    )
  }

  const serpTitle = form.seoTitle || (form.name ? `${form.name} in Dubai | ONPRINT` : 'Service Title | ONPRINT Dubai')
  const serpDesc = form.seoDescription || form.shortDescription || 'Commercial printing and branding services in Dubai, UAE.'
  const serpUrl = `https://www.0nprint.com/services/${form.slug || 'service-slug'}`

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#B8C2D9]">
        <Link to="/admin" className="hover:text-[#F5F3EE] transition-colors">
          Admin
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#B8C2D9]/70" />
        <Link to="/admin/services" className="hover:text-[#F5F3EE] transition-colors">
          Services
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#B8C2D9]/70" />
        <span className="text-[#F5F3EE]">{isEdit ? 'Edit Service' : 'Add Service'}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#122240] pb-5">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-[#F5F3EE]">
            {isEdit ? `Edit Service: ${form.name}` : 'Add New Service'}
          </h1>
          <p className="text-xs text-[#B8C2D9] mt-1">
            Manage printing service details and search engine ranking parameters.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/services')}
            disabled={submitting}
            className="w-full sm:w-auto justify-center border-[#122240] text-[#F5F3EE] hover:bg-[#040A18] text-xs"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Cancel
          </Button>
          <Button
            type="button"
            variant="accent"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full sm:w-auto justify-center text-xs font-bold"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Service'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-[#122240] bg-[#081226] p-6 shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-[#F5F3EE] border-b border-[#122240] pb-3">
              Service Details
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F5F3EE] mb-1.5">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleNameChange}
                placeholder="e.g. Digital & Offset Printing"
                required
                className="w-full rounded-xl border border-[#122240] px-4 py-2.5 text-xs font-semibold text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F5F3EE] mb-1.5">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center rounded-xl border border-[#122240] px-3 py-2 text-xs font-semibold text-[#B8C2D9] focus-within:border-[#D6C29A]">
                <span className="text-[#B8C2D9]/70">/services/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugEdited(true)
                    setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                  }}
                  placeholder="digital-offset-printing"
                  required
                  className="w-full bg-transparent pl-1 font-semibold text-[#F5F3EE] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F5F3EE] mb-1.5">
                Short Description
              </label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="High-speed digital press and high-volume offset printing in Dubai…"
                className="w-full rounded-xl border border-[#122240] px-4 py-2 text-xs font-medium text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F5F3EE] mb-1.5">
                Full Detailed Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Explain the machinery, paper stock options, and quality guarantees…"
                className="w-full rounded-xl border border-[#122240] p-3 text-xs font-medium text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>
          </div>

          {/* SEO Card */}
          <div className="rounded-2xl border border-[#122240] bg-[#081226] p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#122240] pb-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-[#D6C29A]" />
                <h2 className="font-display text-base font-bold text-[#F5F3EE]">
                  Google Search &amp; AI Answer Optimization (SEO + GEO)
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={form.seoReviewStatus}
                  onChange={(e) => setForm((prev) => ({ ...prev, seoReviewStatus: e.target.value }))}
                  className="rounded-lg border border-[#122240] bg-[#040A18] px-2.5 py-1.5 text-[11px] font-bold text-[#D6C29A] focus:border-[#D6C29A] focus:outline-none"
                >
                  <option value="needs_review">Status: Draft (Needs Admin Review)</option>
                  <option value="approved">Status: Reviewed &amp; Approved</option>
                </select>
                <button
                  type="button"
                  onClick={handleGenerateSeoDraft}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#D6C29A] px-3 py-1.5 text-xs font-extrabold text-[#040A18] hover:bg-[#e5d4b0] transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Auto-Generate SEO Draft
                </button>
              </div>
            </div>
            <p className="text-[11px] text-[#B8C2D9]">
              <CheckCircle2 className="inline h-3.5 w-3.5 text-emerald-400 mr-1 -mt-0.5" />
              Generates unique Dubai/UAE SEO Title, Meta Description, H1, Primary + Secondary Keywords, Canonical URL, and Image Alt text from your service data.
            </p>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F5F3EE] mb-1.5">
                  SEO Meta Title
                </label>
                <span className={`text-[11px] font-bold ${form.seoTitle.length > 60 ? 'text-amber-600' : 'text-[#B8C2D9]/70'}`}>
                  {form.seoTitle.length} / 60 chars
                </span>
              </div>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="e.g. Digital & Offset Printing Dubai | Fast Turnaround | ONPRINT"
                className="w-full rounded-xl border border-[#122240] px-4 py-2.5 text-xs font-semibold text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F5F3EE] mb-1.5">
                  SEO Meta Description
                </label>
                <span className={`text-[11px] font-bold ${form.seoDescription.length > 160 ? 'text-amber-600' : 'text-[#B8C2D9]/70'}`}>
                  {form.seoDescription.length} / 160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={form.seoDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
                placeholder="Clear summary for Google search snippet..."
                className="w-full rounded-xl border border-[#122240] p-3 text-xs font-medium text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F5F3EE] mb-1.5">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={form.seoKeywords}
                  onChange={(e) => setForm((prev) => ({ ...prev, seoKeywords: e.target.value }))}
                  placeholder="digital printing dubai, offset printing dubai"
                  className="w-full rounded-xl border border-[#122240] px-4 py-2 text-xs font-semibold text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F5F3EE] mb-1.5">
                  Primary H1 Heading
                </label>
                <input
                  type="text"
                  value={form.seoHeading}
                  onChange={(e) => setForm((prev) => ({ ...prev, seoHeading: e.target.value }))}
                  placeholder={form.name || 'Defaults to Service Name'}
                  className="w-full rounded-xl border border-[#122240] px-4 py-2 text-xs font-semibold text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
                />
              </div>
            </div>

            {/* Live SERP Preview */}
            <div className="mt-4 rounded-xl border border-[#122240] bg-[#040A18] p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8C2D9]">
                Google SERP Snippet Preview
              </span>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#B8C2D9] truncate">
                  <Globe className="h-3 w-3 text-[#B8C2D9]/70" />
                  <span>{serpUrl}</span>
                </div>
                <div className="text-sm font-bold text-blue-800 hover:underline cursor-pointer">
                  {serpTitle}
                </div>
                <div className="text-xs text-[#B8C2D9] line-clamp-2">
                  {serpDesc}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-2xl border border-[#122240] bg-[#081226] p-6 shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-[#F5F3EE] border-b border-[#122240] pb-3">
              Service Status
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F5F3EE] mb-1.5">
                Visibility Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full rounded-xl border border-[#122240] px-3 py-2.5 text-xs font-semibold text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F5F3EE] mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: e.target.value }))}
                className="w-full rounded-xl border border-[#122240] px-3 py-2 text-xs font-semibold text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#122240] bg-[#081226] p-6 shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-[#F5F3EE] border-b border-[#122240] pb-3">
              Service Image &amp; ALT
            </h2>

            <ImageUploader
              value={form.image}
              onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
            />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F5F3EE] mb-1.5">
                Image ALT Text (SEO)
              </label>
              <input
                type="text"
                value={form.imageAlt}
                onChange={(e) => setForm((prev) => ({ ...prev, imageAlt: e.target.value }))}
                placeholder={form.name || 'Descriptive ALT tag for Google search'}
                className="w-full rounded-xl border border-[#122240] px-3 py-2 text-xs font-semibold text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
