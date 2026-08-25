import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, X, Clock, Calendar, ArrowRight, Sparkles, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import Container from '../../components/Container'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Reveal from '../../components/Reveal'
import { getPublicBlogs } from '../../services/blog'
import { getCategories } from '../../services/categories'

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || 'All'
  const searchParam = searchParams.get('search') || ''
  const pageParam = parseInt(searchParams.get('page') || '1', 10)

  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 })
  const [searchInput, setSearchInput] = useState(searchParam)

  // Load categories dynamically from MySQL
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
  }, [])

  // Load blog posts dynamically from MySQL API
  const fetchBlogs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getPublicBlogs({
        page: pageParam,
        limit: 12,
        category: categoryParam !== 'All' ? categoryParam : undefined,
        search: searchParam || undefined,
      })
      if (res?.success) {
        setPosts(res.data || [])
        setPagination(res.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 })
      } else {
        setPosts([])
      }
    } catch (err) {
      console.error('Failed to load blog articles:', err)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [categoryParam, searchParam, pageParam])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  const handleCategoryChange = (catSlug) => {
    const params = new URLSearchParams(searchParams)
    if (catSlug === 'All') {
      params.delete('category')
    } else {
      params.set('category', catSlug)
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchInput.trim()) {
      params.set('search', searchInput.trim())
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    const params = new URLSearchParams(searchParams)
    params.delete('search')
    params.set('page', '1')
    setSearchParams(params)
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return null
    }
  }

  const featuredPost = posts.find((p) => p.is_featured) || (pageParam === 1 && !searchParam && categoryParam === 'All' ? posts[0] : null)
  const regularPosts = featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts

  return (
    <div className="py-16 sm:py-24">
      <SEOHead
        title="Dubai Printing, Branding & Corporate Gifting Insights | ONPRINT Blog"
        description="Expert technical guides on commercial printing, luxury packaging, business stationery, Pantone color management, and promotional gifting in Dubai, UAE."
        keywords="printing blog dubai, commercial printing guide uae, corporate gifts dubai tips, business card printing advice dubai, luxury packaging guide"
        canonicalPath="/blog"
        breadcrumbs={[{ name: 'Blog', url: '/blog' }]}
      />

      <Container>
        <Breadcrumbs items={[{ name: 'Blog' }]} />

        {/* Page Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end border-b border-border pb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              <span>COMMERCIAL PRINTING &amp; PACKAGING KNOWLEDGE</span>
            </div>
            <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
              Dubai Commercial Printing &amp; Branding Insights
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">
              Comprehensive technical guides on luxury paper stocks, hot foil stamping, CMYK Pantone pre-flighting, and corporate gifting in the UAE.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search printing guides…"
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-10 py-2.5 text-xs font-semibold text-primary transition-all focus:border-accent focus:outline-none shadow-xs"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer p-1"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="mt-8 flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategoryChange('All')}
            className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              categoryParam === 'All'
                ? 'bg-primary text-background shadow-xs'
                : 'border border-border bg-surface text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            All Disciplines
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                categoryParam === cat.slug || categoryParam === cat.name
                  ? 'bg-primary text-background shadow-xs'
                  : 'border border-border bg-surface text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="mt-12">
          {loading && <LoadingState label="Loading printing guides from ONPRINT database…" />}

          {!loading && posts.length === 0 && (
            <EmptyState
              title="No blog articles found"
              note={
                searchParam
                  ? `No articles found matching "${searchParam}". Try another search term.`
                  : categoryParam !== 'All'
                  ? `No articles published in this category yet. Check back soon.`
                  : 'No articles published yet. Please check back shortly.'
              }
            />
          )}

          {/* Featured Hero Article */}
          {!loading && featuredPost && (
            <div className="mb-16">
              <Reveal>
                <div className="grid grid-cols-1 gap-8 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-10 lg:grid-cols-12 lg:items-center">
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-accent-soft lg:col-span-6">
                    <img
                      src={featuredPost.featured_image || featuredPost.featuredImage}
                      alt={featuredPost.image_alt || featuredPost.imageAlt || featuredPost.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="lg:col-span-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-secondary">
                      <span className="rounded-full bg-accent-soft px-3 py-1 text-accent uppercase tracking-wider">
                        {featuredPost.category || 'Printing Guide'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {featuredPost.reading_time || featuredPost.readTime || '4 min read'}
                      </span>
                      {formatDate(featuredPost.published_at || featuredPost.publishedAt) && (
                        <span className="flex items-center gap-1 text-secondary/70">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(featuredPost.published_at || featuredPost.publishedAt)}
                        </span>
                      )}
                    </div>

                    <h2 className="font-display mt-4 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                      <Link to={`/blog/${featuredPost.slug}`} className="transition-colors hover:text-accent">
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-secondary sm:text-base line-clamp-3">
                      {featuredPost.excerpt}
                    </p>

                    <div className="mt-6">
                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-accent transition-colors hover:underline underline-offset-4"
                      >
                        <span>Read Full Guide</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          )}

          {/* Regular Posts Grid */}
          {!loading && regularPosts.length > 0 && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post, index) => (
                <Reveal key={post.id || post.slug} delay={(index % 3) * 0.08}>
                  <article className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg">
                    <div>
                      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-accent-soft">
                        <img
                          src={post.featured_image || post.featuredImage}
                          alt={post.image_alt || post.imageAlt || post.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-2.5 text-[11px] font-bold text-secondary">
                        <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-accent uppercase tracking-wider">
                          {post.category || 'Printing Guide'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.reading_time || post.readTime || '4 min read'}
                        </span>
                      </div>

                      <h3 className="font-display mt-3 text-lg font-bold text-primary transition-colors hover:text-accent">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-secondary line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs font-semibold text-secondary">
                      <span>{formatDate(post.published_at || post.publishedAt) || 'ONPRINT Studio'}</span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 font-bold text-accent transition-colors hover:underline"
                      >
                        <span>Read More</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && pagination.totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2 border-t border-border pt-8">
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      pagination.page === pageNum
                        ? 'bg-primary text-background'
                        : 'text-secondary hover:bg-surface hover:text-primary'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
