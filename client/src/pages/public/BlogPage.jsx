import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, Clock, ArrowRight, Sparkles, BookOpen } from 'lucide-react'
import Container from '../../components/Container'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Reveal from '../../components/Reveal'
import { getBlogPosts } from '../../services/blog'

const CATEGORIES = ['All', 'Printing Guide', 'Corporate Gifting', 'Business Stationery', 'Industry Insights']

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    getBlogPosts()
      .then((data) => {
        setPosts(data || [])
        setLoading(false)
      })
      .catch(() => {
        setPosts([])
        setLoading(false)
      })
  }, [])

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = activeCategory === 'All' || (p.category && p.category.toLowerCase() === activeCategory.toLowerCase())
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchCat && matchSearch
    })
  }, [posts, activeCategory, searchQuery])

  const featuredPost = filteredPosts[0]
  const regularPosts = filteredPosts.slice(1)

  return (
    <div className="py-16 sm:py-24">
      <SEOHead
        title="Dubai Printing & Corporate Branding Insights | ONPRINT Blog"
        description="Expert guides on commercial printing, corporate gifts, luxury packaging, and executive business cards in Dubai, UAE. Practical pre-press advice from ONPRINT."
        keywords="printing blog dubai, commercial printing guide uae, corporate gifts dubai tips, business card printing advice"
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
              <span>INDUSTRY GUIDES &amp; KNOWLEDGE</span>
            </div>
            <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
              Dubai Printing, Branding &amp; Gifting Insights
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">
              Practical guides on paper stocks, Pantone color fidelity, corporate gifting trends, and pre-press file setup from our Al Quoz print studio.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-xs font-semibold text-primary transition-all focus:border-accent focus:outline-none shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary text-background shadow-xs'
                  : 'border border-border bg-surface text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-12">
          {loading && <LoadingState label="Loading blog articles…" />}
          {!loading && filteredPosts.length === 0 && (
            <EmptyState
              title="No articles found"
              note={searchQuery ? `No articles matching "${searchQuery}".` : 'Select a different category above.'}
            />
          )}

          {/* Featured Post */}
          {!loading && featuredPost && (
            <div className="mb-16">
              <Reveal>
                <div className="grid grid-cols-1 gap-8 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-10 lg:grid-cols-12 lg:items-center">
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-accent-soft lg:col-span-6">
                    <img
                      src={featuredPost.featuredImage}
                      alt={featuredPost.imageAlt || featuredPost.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="lg:col-span-6">
                    <div className="flex items-center gap-3 text-xs font-bold text-secondary">
                      <span className="rounded-full bg-accent-soft px-3 py-1 text-accent uppercase tracking-wider">
                        {featuredPost.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <h2 className="font-display mt-4 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                      <Link to={`/blog/${featuredPost.slug}`} className="transition-colors hover:text-accent">
                        {featuredPost.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-secondary sm:text-base">
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

          {/* Regular Grid */}
          {!loading && regularPosts.length > 0 && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post, index) => (
                <Reveal key={post._id || post.id} delay={(index % 3) * 0.08}>
                  <article className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg">
                    <div>
                      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-accent-soft">
                        <img
                          src={post.featuredImage}
                          alt={post.imageAlt || post.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-5 flex items-center gap-3 text-[11px] font-bold text-secondary">
                        <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-accent uppercase tracking-wider">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="font-display mt-3 text-lg font-bold text-primary transition-colors hover:text-accent">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-secondary line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-border/60 pt-4">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-accent transition-colors hover:underline"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
