import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronRight,
  Save,
  Image as ImageIcon,
  Search,
  Globe,
  Sparkles,
  BookOpen,
  Wand2,
  Calendar,
  Layers,
  Package,
  CheckCircle2,
  Eye,
  FileCode,
  MapPin,
  RefreshCw,
} from 'lucide-react'
import Button from '../../components/Button'
import ImageUploader from '../../components/ImageUploader'
import {
  getPublicBlogBySlug,
  createBlog,
  updateBlog,
  generateBlogContent,
  generateBlogImage,
} from '../../services/blog'
import { getCategories } from '../../services/categories'
import { getProducts } from '../../services/products'

export default function AdminBlogFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [slugEdited, setSlugEdited] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Dynamic dropdowns from MySQL
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])

  // AI Assistant States
  const [aiLoading, setAiLoading] = useState(false)
  const [aiImageLoading, setAiImageLoading] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiPrompt, setAiPrompt] = useState({
    topic: '',
    targetLocation: 'Dubai',
    focusKeyword: '',
  })

  // Form State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category_id: '',
    product_id: '',
    author_name: 'ONPRINT Editorial Team',
    reading_time: 4,
    excerpt: '',
    content: '',
    featured_image: '/assets/brochures-CO2Zibqf.jpg',
    image_alt: '',
    status: 'draft',
    is_featured: false,
    published_at: new Date().toISOString().slice(0, 16),
    seo_title: '',
    meta_description: '',
    focus_keyword: '',
    secondary_keywords: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: '',
    schema_type: 'BlogPosting',
    target_location: 'Dubai',
  })

  // Load Categories & Products from MySQL
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))

    getProducts({ limit: 100 })
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProducts([]))
  }, [])

  // Load Existing Blog if in Edit Mode
  useEffect(() => {
    if (!isEdit) return
    async function loadPost() {
      try {
        setLoading(true)
        const found = await getPublicBlogBySlug(id)
        if (found) {
          setForm({
            title: found.title || '',
            slug: found.slug || '',
            category_id: found.category_id ? String(found.category_id) : '',
            product_id: found.product_id ? String(found.product_id) : '',
            author_name: found.author_name || found.author || 'ONPRINT Editorial Team',
            reading_time: parseInt(found.reading_time || '4', 10) || 4,
            excerpt: found.excerpt || '',
            content: found.content || '',
            featured_image: found.featured_image || found.featuredImage || '/assets/brochures-CO2Zibqf.jpg',
            image_alt: found.image_alt || found.imageAlt || found.title || '',
            status: found.status || 'draft',
            is_featured: Boolean(found.is_featured),
            published_at: found.published_at
              ? new Date(found.published_at).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16),
            seo_title: found.seo_title || found.seoTitle || '',
            meta_description: found.meta_description || found.seoDescription || '',
            focus_keyword: found.focus_keyword || found.seoKeywords || '',
            secondary_keywords: found.secondary_keywords || '',
            canonical_url: found.canonical_url || '',
            og_title: found.og_title || '',
            og_description: found.og_description || '',
            og_image: found.og_image || '',
            schema_type: found.schema_type || 'BlogPosting',
            target_location: found.target_location || 'Dubai',
          })
          setSlugEdited(true)
        }
      } catch (err) {
        setError(err.message || 'Failed to load article from database.')
      } finally {
        setLoading(false)
      }
    }
    loadPost()
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

  const handleTitleChange = (e) => {
    const val = e.target.value
    setForm((prev) => {
      const cleanSlug = slugEdited ? prev.slug : slugify(val)
      return {
        ...prev,
        title: val,
        slug: cleanSlug,
        seo_title: prev.seo_title || (val ? `${val} | ONPRINT Dubai` : ''),
        canonical_url: `https://0nprint.com/blog/${cleanSlug}`,
        og_title: prev.og_title || val,
      }
    })
  }

  // Handle AI Content Generation
  const handleGenerateAiContent = async () => {
    setAiLoading(true)
    setError(null)
    try {
      const result = await generateBlogContent({
        title: form.title || aiPrompt.topic,
        topic: aiPrompt.topic || form.title,
        category_id: form.category_id || undefined,
        product_id: form.product_id || undefined,
        focus_keyword: aiPrompt.focusKeyword || form.focus_keyword || undefined,
        target_location: aiPrompt.targetLocation || form.target_location || 'Dubai',
      })

      if (result) {
        setForm((prev) => ({
          ...prev,
          title: prev.title || result.title,
          slug: prev.slug || result.slug,
          excerpt: result.excerpt,
          content: result.content,
          reading_time: result.reading_time || 4,
          focus_keyword: result.focus_keyword,
          secondary_keywords: result.secondary_keywords,
          seo_title: result.seo_title,
          meta_description: result.meta_description,
          canonical_url: result.canonical_url,
          target_location: result.target_location,
          image_alt: result.image_alt,
          og_title: result.seo_title,
          og_description: result.meta_description,
        }))
        setShowAiModal(false)
        setSuccessMsg('AI content and SEO metadata generated successfully!')
        setTimeout(() => setSuccessMsg(null), 4000)
      }
    } catch (err) {
      setError(err.message || 'Failed to generate AI content.')
    } finally {
      setAiLoading(false)
    }
  };

  // Handle AI Image Generation / Curation
  const handleGenerateImage = async () => {
    setAiImageLoading(true)
    try {
      const res = await generateBlogImage({
        title: form.title,
        category_id: form.category_id || undefined,
        product_id: form.product_id || undefined,
        focus_keyword: form.focus_keyword || undefined,
      })
      if (res?.imageUrl) {
        setForm((prev) => ({
          ...prev,
          featured_image: res.imageUrl,
          image_alt: res.imageAlt || prev.image_alt || `${prev.title} printing dubai`,
          og_image: res.imageUrl,
        }))
      }
    } catch (err) {
      console.error('Failed to generate image:', err)
    } finally {
      setAiImageLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!form.title.trim()) {
      setError('Article title is required.')
      return
    }
    if (!form.content.trim()) {
      setError('Article content is required.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const cleanSlug = form.slug.trim() || slugify(form.title.trim())
      const payload = {
        title: form.title.trim(),
        slug: cleanSlug,
        category_id: form.category_id ? parseInt(form.category_id, 10) : null,
        product_id: form.product_id ? parseInt(form.product_id, 10) : null,
        author_name: form.author_name.trim() || 'ONPRINT Editorial Team',
        reading_time: parseInt(form.reading_time, 10) || 4,
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        featured_image: form.featured_image,
        image_alt: form.image_alt.trim() || `${form.title.trim()} printing dubai`,
        status: form.status,
        is_featured: form.is_featured ? 1 : 0,
        published_at: form.published_at || new Date().toISOString(),
        seo_title: form.seo_title.trim() || `${form.title.trim()} | ONPRINT Dubai`,
        meta_description: form.meta_description.trim() || form.excerpt.trim(),
        focus_keyword: form.focus_keyword.trim(),
        secondary_keywords: form.secondary_keywords.trim(),
        canonical_url: form.canonical_url.trim() || `https://0nprint.com/blog/${cleanSlug}`,
        og_title: form.og_title.trim() || form.seo_title.trim() || form.title.trim(),
        og_description: form.og_description.trim() || form.meta_description.trim() || form.excerpt.trim(),
        og_image: form.og_image || form.featured_image,
        schema_type: form.schema_type || 'BlogPosting',
        target_location: form.target_location.trim() || 'Dubai',
      }

      if (isEdit) {
        await updateBlog(id, payload)
      } else {
        await createBlog(payload)
      }

      navigate('/admin/blog')
    } catch (err) {
      setError(err.message || 'Failed to save blog article.')
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

  const serpTitle = form.seo_title || (form.title ? `${form.title} | ONPRINT Dubai` : 'Article Title | ONPRINT Dubai')
  const serpDesc = form.meta_description || form.excerpt || 'Read expert insights on commercial printing, paper GSM, and corporate branding in Dubai.'
  const serpUrl = `https://0nprint.com/blog/${form.slug || 'article-slug'}`

  return (
    <div className="space-y-6">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        <Link to="/admin" className="hover:text-neutral-900 transition-colors">
          Admin
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <Link to="/admin/blog" className="hover:text-neutral-900 transition-colors">
          Blog Articles
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-neutral-900 font-bold">{isEdit ? 'Edit Article' : 'Write New Article'}</span>
      </nav>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-neutral-900">
            {isEdit ? `Edit Article: ${form.title || 'Untitled'}` : 'Write New Blog Article'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Author SEO-optimized long-form content connected directly to MySQL categories &amp; products.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* AI Generator Trigger */}
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-800 shadow-xs hover:border-[#A82F19] hover:text-[#A82F19] transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-[#A82F19]" />
            <span>Generate Content (AI)</span>
          </button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/blog')}
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
            className="text-xs font-bold shadow-md"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {submitting ? 'Saving to Database...' : isEdit ? 'Update Article' : 'Save Article'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (Main Content & SEO) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Article Info & Rich Content */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="font-display text-base font-bold text-neutral-900">
                Article Information &amp; Content
              </h2>
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !previewMode ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 inline mr-1" />
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    previewMode ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5 inline mr-1" />
                  Preview
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="e.g. The Complete Guide to Commercial & Digital Printing in Dubai"
                required
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                SEO URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-500 focus-within:border-[#A82F19]">
                <span className="text-neutral-400">/blog/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugEdited(true)
                    const val = slugify(e.target.value)
                    setForm((prev) => ({
                      ...prev,
                      slug: val,
                      canonical_url: `https://0nprint.com/blog/${val}`,
                    }))
                  }}
                  placeholder="commercial-printing-guide-dubai"
                  required
                  className="w-full bg-transparent pl-1 font-semibold text-neutral-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Relations: Category & Product */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Category Relationship (MySQL)
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                >
                  <option value="">-- General / No Category --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Related Product (MySQL)
                </label>
                <select
                  value={form.product_id}
                  onChange={(e) => setForm((prev) => ({ ...prev, product_id: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                >
                  <option value="">-- General / No Related Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Author & Reading Time & Target Location */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Author
                </label>
                <input
                  type="text"
                  value={form.author_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, author_name: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Read Time (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={form.reading_time}
                  onChange={(e) => setForm((prev) => ({ ...prev, reading_time: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Target Location
                </label>
                <div className="flex items-center rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 focus-within:border-[#A82F19]">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400 mr-1 shrink-0" />
                  <input
                    type="text"
                    value={form.target_location}
                    onChange={(e) => setForm((prev) => ({ ...prev, target_location: e.target.value }))}
                    placeholder="e.g. Dubai, Business Bay"
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Summary / Lead Excerpt
              </label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="A compelling 2-sentence summary introducing the article to search engines and readers…"
                className="w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            {/* Content / Editor */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Article Body (HTML / Semantic Content) <span className="text-red-500">*</span>
              </label>
              {!previewMode ? (
                <textarea
                  rows={14}
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="<h2>Why Commercial Printing Matters</h2><p>Article paragraphs...</p><ul><li>Point 1</li></ul>"
                  className="w-full rounded-xl border border-neutral-300 p-3 font-mono text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none leading-relaxed"
                />
              ) : (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 min-h-[300px]">
                  <div
                    className="prose prose-neutral max-w-none text-xs leading-relaxed text-neutral-900 [&_h2]:font-bold [&_h2]:text-base [&_h2]:mt-4 [&_h3]:font-bold [&_h3]:text-sm [&_h3]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1"
                    dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-neutral-400 italic">No content yet.</p>' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* SEO & Meta Tags Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Search className="h-4 w-4 text-[#A82F19]" />
              <h2 className="font-display text-base font-bold text-neutral-900">
                SEO &amp; Open Graph Meta Configuration
              </h2>
            </div>

            {/* SEO Title */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  SEO Meta Title
                </label>
                <span className={`text-[11px] font-bold ${form.seo_title.length > 60 ? 'text-amber-600' : 'text-neutral-400'}`}>
                  {form.seo_title.length} / 60 chars
                </span>
              </div>
              <input
                type="text"
                value={form.seo_title}
                onChange={(e) => setForm((prev) => ({ ...prev, seo_title: e.target.value }))}
                placeholder="e.g. Commercial Printing in Dubai | Complete Guide | ONPRINT"
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  SEO Meta Description
                </label>
                <span className={`text-[11px] font-bold ${form.meta_description.length > 160 ? 'text-amber-600' : 'text-neutral-400'}`}>
                  {form.meta_description.length} / 160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={form.meta_description}
                onChange={(e) => setForm((prev) => ({ ...prev, meta_description: e.target.value }))}
                placeholder="Accurate, compelling summary of article content with primary keywords..."
                className="w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            {/* Focus & Secondary Keywords */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Focus Keyword
                </label>
                <input
                  type="text"
                  value={form.focus_keyword}
                  onChange={(e) => setForm((prev) => ({ ...prev, focus_keyword: e.target.value }))}
                  placeholder="e.g. business card printing dubai"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Secondary Keywords
                </label>
                <input
                  type="text"
                  value={form.secondary_keywords}
                  onChange={(e) => setForm((prev) => ({ ...prev, secondary_keywords: e.target.value }))}
                  placeholder="e.g. luxury cards, hot foiling, spot uv"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>
            </div>

            {/* Canonical URL & Schema Type */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={form.canonical_url}
                  onChange={(e) => setForm((prev) => ({ ...prev, canonical_url: e.target.value }))}
                  placeholder="https://0nprint.com/blog/..."
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Structured Schema Type
                </label>
                <input
                  type="text"
                  value={form.schema_type}
                  onChange={(e) => setForm((prev) => ({ ...prev, schema_type: e.target.value }))}
                  placeholder="BlogPosting"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>
            </div>

            {/* Live Google SERP Snippet Preview */}
            <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Google Search SERP Preview
              </span>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 truncate">
                  <Globe className="h-3 w-3 text-neutral-400 shrink-0" />
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

        {/* Right Column (Publishing Controls, Image, Status) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Publishing Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Publishing Settings
            </h2>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Publication Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-bold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Live on Website)</option>
                <option value="scheduled">Scheduled (Future Date)</option>
              </select>
            </div>

            {/* Published Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Publish Date &amp; Time
              </label>
              <input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => setForm((prev) => ({ ...prev, published_at: e.target.value }))}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            {/* Featured on Homepage Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
              <div>
                <span className="block text-xs font-bold text-neutral-900">Featured Article</span>
                <span className="block text-[11px] text-neutral-500">Showcase on ONPRINT Homepage</span>
              </div>
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
                className="h-4 w-4 rounded text-[#A82F19] focus:ring-[#A82F19] cursor-pointer"
              />
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="font-display text-base font-bold text-neutral-900">
                Featured Image
              </h2>
              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={aiImageLoading}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#A82F19] hover:underline cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${aiImageLoading ? 'animate-spin' : ''}`} />
                <span>Auto Match Image</span>
              </button>
            </div>

            <ImageUploader
              value={form.featured_image}
              onChange={(url) => setForm((prev) => ({ ...prev, featured_image: url, og_image: url }))}
            />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Image ALT Text (SEO) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.image_alt}
                onChange={(e) => setForm((prev) => ({ ...prev, image_alt: e.target.value }))}
                placeholder={form.title || 'Descriptive printing ALT text'}
                required
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>

      {/* AI Assistant Generation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2 text-[#A82F19]">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-display text-lg font-bold text-neutral-900">
                  AI Blog &amp; SEO Generator
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="text-neutral-400 hover:text-neutral-900 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Generate a structured commercial printing article with pre-press specifications, GSM comparisons, finishing methods, and complete Google SEO metadata.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Article Topic or Idea
                </label>
                <input
                  type="text"
                  value={aiPrompt.topic}
                  onChange={(e) => setAiPrompt((p) => ({ ...p, topic: e.target.value }))}
                  placeholder="e.g. How to choose the best business cards for executive brands"
                  className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Target Location
                  </label>
                  <input
                    type="text"
                    value={aiPrompt.targetLocation}
                    onChange={(e) => setAiPrompt((p) => ({ ...p, targetLocation: e.target.value }))}
                    placeholder="Dubai"
                    className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Primary Focus Keyword
                  </label>
                  <input
                    type="text"
                    value={aiPrompt.focusKeyword}
                    onChange={(e) => setAiPrompt((p) => ({ ...p, focusKeyword: e.target.value }))}
                    placeholder="e.g. business card printing dubai"
                    className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAiModal(false)}
                disabled={aiLoading}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="accent"
                onClick={handleGenerateAiContent}
                disabled={aiLoading}
                className="text-xs font-bold"
              >
                {aiLoading ? 'Generating Full Article...' : 'Generate Article & SEO'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
