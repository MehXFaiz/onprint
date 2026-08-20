import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Save, Image as ImageIcon, Search, Globe, Sparkles, BookOpen } from 'lucide-react'
import Button from '../../components/Button'
import ImageUploader from '../../components/ImageUploader'
import { getBlogPostBySlug, createBlogPost, updateBlogPost, getStoredBlogPosts } from '../../services/blog'

const CATEGORIES = ['Printing Guide', 'Corporate Gifting', 'Business Stationery', 'Industry Insights']

export default function AdminBlogFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [slugEdited, setSlugEdited] = useState(false)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Printing Guide',
    author: 'ONPRINT Studio',
    readTime: '5 min read',
    excerpt: '',
    content: '',
    featuredImage: '/assets/products/1 (1).jpg',
    imageAlt: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    status: 'active',
  })

  useEffect(() => {
    if (!isEdit) return
    async function loadPost() {
      try {
        setLoading(true)
        const all = getStoredBlogPosts()
        const found = all.find((p) => String(p._id || p.id) === String(id) || p.slug === id)
        if (found) {
          setForm({
            title: found.title || '',
            slug: found.slug || '',
            category: found.category || 'Printing Guide',
            author: found.author || 'ONPRINT Studio',
            readTime: found.readTime || '5 min read',
            excerpt: found.excerpt || '',
            content: found.content || '',
            featuredImage: found.featuredImage || found.featured_image || '/assets/products/1 (1).jpg',
            imageAlt: found.imageAlt || found.image_alt || found.title || '',
            seoTitle: found.seoTitle || found.seo_title || '',
            seoDescription: found.seoDescription || found.seo_description || '',
            seoKeywords: found.seoKeywords || found.seo_keywords || '',
            status: 'active',
          })
          setSlugEdited(true)
        }
      } catch (err) {
        setError(err.message || 'Failed to load article.')
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
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: slugEdited ? prev.slug : slugify(val),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Article title is required.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const cleanSlug = form.slug.trim() || slugify(form.title.trim())
      const payload = {
        title: form.title.trim(),
        slug: cleanSlug,
        category: form.category,
        author: form.author.trim() || 'ONPRINT Studio',
        readTime: form.readTime.trim() || '5 min read',
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        featuredImage: form.featuredImage,
        featured_image: form.featuredImage,
        imageAlt: form.imageAlt.trim() || form.title.trim(),
        image_alt: form.imageAlt.trim() || form.title.trim(),
        seoTitle: form.seoTitle.trim() || `${form.title.trim()} | ONPRINT Blog`,
        seo_title: form.seoTitle.trim() || `${form.title.trim()} | ONPRINT Blog`,
        seoDescription: form.seoDescription.trim() || form.excerpt.trim(),
        seo_description: form.seoDescription.trim() || form.excerpt.trim(),
        seoKeywords: form.seoKeywords.trim(),
        seo_keywords: form.seoKeywords.trim(),
        canonical_url: `https://0nprint.com/blog/${cleanSlug}`,
        published_at: new Date().toISOString(),
      }

      if (isEdit) {
        await updateBlogPost(id, payload)
      } else {
        await createBlogPost(payload)
      }

      navigate('/admin/blog')
    } catch (err) {
      setError(err.message || 'Failed to save article.')
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

  const serpTitle = form.seoTitle || (form.title ? `${form.title} | ONPRINT Blog` : 'Article Title | ONPRINT Blog')
  const serpDesc = form.seoDescription || form.excerpt || 'Read expert insights on commercial printing and corporate branding in Dubai.'
  const serpUrl = `https://0nprint.com/blog/${form.slug || 'article-slug'}`

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        <Link to="/admin" className="hover:text-neutral-900 transition-colors">
          Admin
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <Link to="/admin/blog" className="hover:text-neutral-900 transition-colors">
          Blog Articles
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-neutral-900">{isEdit ? 'Edit Article' : 'Write Article'}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-neutral-900">
            {isEdit ? `Edit Article: ${form.title}` : 'Write New Blog Article'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Author SEO-optimized long-form content for Dubai print searchers.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
            className="text-xs font-bold"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {submitting ? 'Publishing...' : isEdit ? 'Update Article' : 'Publish Article'}
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
          {/* Article Info */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Article Content &amp; Details
            </h2>

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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-500 focus-within:border-[#A82F19]">
                <span className="text-neutral-400">/blog/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugEdited(true)
                    setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                  }}
                  placeholder="commercial-printing-guide-dubai"
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
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Author
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Estimated Read Time
                </label>
                <input
                  type="text"
                  value={form.readTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, readTime: e.target.value }))}
                  placeholder="e.g. 6 min read"
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Summary / Excerpt (Lead Paragraph)
              </label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="A compelling 2-sentence summary introducing the article…"
                className="w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Article Body (HTML / Semantic Content)
              </label>
              <textarea
                rows={12}
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="<h2>Subheading</h2><p>Article body paragraphs...</p><ul><li>Key points</li></ul>"
                className="w-full rounded-xl border border-neutral-300 p-3 font-mono text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
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
                placeholder="e.g. Commercial Printing in Dubai | Complete Guide | ONPRINT"
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
                placeholder="Detailed meta description with primary target keywords..."
                className="w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                SEO Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={form.seoKeywords}
                onChange={(e) => setForm((prev) => ({ ...prev, seoKeywords: e.target.value }))}
                placeholder="printing services dubai, digital printing guide uae"
                className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            {/* Live SERP Snippet Preview */}
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
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Featured Image &amp; ALT Tag
            </h2>

            <ImageUploader
              value={form.featuredImage}
              onChange={(url) => setForm((prev) => ({ ...prev, featuredImage: url }))}
            />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Image ALT Text (SEO)
              </label>
              <input
                type="text"
                value={form.imageAlt}
                onChange={(e) => setForm((prev) => ({ ...prev, imageAlt: e.target.value }))}
                placeholder={form.title || 'Descriptive ALT text'}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
