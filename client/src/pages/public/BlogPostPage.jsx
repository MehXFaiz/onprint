import { useEffect, useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
  Package,
  Layers,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  Check,
  HelpCircle,
  List,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Reveal from '../../components/Reveal'
import { getPublicBlogBySlug } from '../../services/blog'

/**
 * Basic HTML sanitizer to strip malicious scripts and event handlers
 */
function sanitizeHtml(html) {
  if (!html) return ''
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son\w+\s*=\s*[^>\s]+/gi, '')
    .replace(/href\s*=\s*(['"])javascript:[^'"]*\1/gi, 'href="#"')
}

/**
 * Extract H2 and H3 headings and inject anchor IDs for the Table of Contents
 */
function processHeadingsAndToc(html) {
  if (!html) return { headings: [], processedHtml: '' }
  const headings = []
  let index = 0

  const regex = /<h([23])([^>]*)>(.*?)<\/h\1>/gi
  const processedHtml = html.replace(regex, (match, level, attrs, innerText) => {
    const cleanText = innerText.replace(/<[^>]*>/g, '').trim()
    if (!cleanText) return match

    const id = `heading-${index++}-${cleanText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}`

    headings.push({
      id,
      text: cleanText,
      level: parseInt(level, 10),
    })

    const cleanAttrs = attrs.replace(/\sid=(['"]).*?\1/gi, '')
    return `<h${level}${cleanAttrs} id="${id}">${innerText}</h${level}>`
  })

  return { headings, processedHtml }
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [status, setStatus] = useState('loading')
  const [copiedLink, setCopiedLink] = useState(false)
  const [openFaqIndices, setOpenFaqIndices] = useState([0])

  useEffect(() => {
    setStatus('loading')
    getPublicBlogBySlug(slug)
      .then((data) => {
        if (data) {
          setPost(data)
          setStatus('ready')
        } else {
          setStatus('error')
        }
      })
      .catch((err) => {
        console.error('Error fetching blog post:', err)
        setStatus('error')
      })
  }, [slug])

  // Extract FAQs that are approved
  const approvedFaqs = useMemo(() => {
    if (!post?.faqs) return []
    let items = post.faqs
    if (typeof items === 'string') {
      try {
        items = JSON.parse(items)
      } catch {
        items = []
      }
    }
    if (!Array.isArray(items)) return []
    return items.filter((f) => f && f.is_approved !== false && f.question?.trim() && f.answer?.trim())
  }, [post?.faqs])

  // Custom schema markup from DB
  const customSchema = useMemo(() => {
    if (!post?.schema_markup) return null
    if (typeof post.schema_markup === 'object') return post.schema_markup
    try {
      return JSON.parse(post.schema_markup)
    } catch {
      return null
    }
  }, [post?.schema_markup])

  // Process and sanitize HTML body + extract Table of Contents
  const { headings, processedHtml } = useMemo(() => {
    if (!post?.content) return { headings: [], processedHtml: '' }
    const clean = sanitizeHtml(post.content)
    return processHeadingsAndToc(clean)
  }, [post?.content])

  const toggleFaq = (idx) => {
    setOpenFaqIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    )
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  const scrollToHeading = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (status === 'loading') return <LoadingState label="Loading article from ONPRINT database…" />

  if (status === 'error' || !post) {
    return (
      <Container className="py-24">
        <EmptyState
          title="Article Not Found"
          note="The requested printing guide may have been relocated or unpublished."
        />
        <div className="mt-6 text-center">
          <Button to="/blog" variant="outline" icon={false}>
            ← Return to Printing Guides
          </Button>
        </div>
      </Container>
    )
  }

  const categoryName = post.categoryData?.name || post.category || 'Commercial Printing'
  const categorySlug = post.categoryData?.slug || (post.category ? post.category.toLowerCase().replace(/\s+/g, '-') : null)

  const productData = post.productData || (post.product ? { name: post.product, slug: post.product.toLowerCase().replace(/\s+/g, '-') } : null)

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return null
    }
  }

  return (
    <article className="py-16 sm:py-24">
      {/* Comprehensive Dynamic SEO Head */}
      <SEOHead
        title={post.meta_title || post.seo_title || post.seoTitle || `${post.title} | ONPRINT Dubai`}
        description={post.meta_description || post.seoDescription || post.excerpt}
        keywords={post.focus_keyword || post.seoKeywords || 'commercial printing dubai, digital printing uae'}
        canonicalPath={post.canonical_url || `/blog/${post.slug}`}
        ogImage={post.og_image || post.featured_image || post.featuredImage}
        ogType="article"
        noindex={post.robots_index === 'noindex'}
        blogArticle={post}
        faqList={approvedFaqs}
        structuredData={customSchema}
        breadcrumbs={[
          { name: 'Blog', url: '/blog' },
          ...(categorySlug ? [{ name: categoryName, url: `/categories/${categorySlug}` }] : []),
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      <Container className="max-w-4xl">
        <Breadcrumbs
          items={[
            { name: 'Blog', path: '/blog' },
            ...(categorySlug ? [{ name: categoryName, path: `/categories/${categorySlug}` }] : []),
            { name: post.title },
          ]}
        />

        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Printing Guides
        </Link>

        {/* Article Header */}
        <header className="mt-8 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-secondary">
            {categorySlug ? (
              <Link
                to={`/categories/${categorySlug}`}
                className="rounded-full bg-accent-soft px-3 py-1 text-accent uppercase tracking-wider transition-colors hover:bg-accent hover:text-white"
              >
                {categoryName}
              </Link>
            ) : (
              <span className="rounded-full bg-accent-soft px-3 py-1 text-accent uppercase tracking-wider">
                {categoryName}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.reading_time || post.readTime || '4 min read'}
            </span>
            {formatDate(post.published_at || post.publishedAt) && (
              <>
                <span className="h-3 w-[1px] bg-border" />
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.published_at || post.publishedAt)}
                </span>
              </>
            )}
            <span className="h-3 w-[1px] bg-border" />
            <span>By {post.author_name || post.author || 'ONPRINT Editorial Team'}</span>
          </div>

          <h1 className="font-display mt-5 text-3xl font-black leading-[1.12] tracking-tight text-primary sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-base leading-relaxed text-secondary sm:text-lg">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Featured Hero Image with meaningful SEO alt */}
        <div className="my-8 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-accent-soft shadow-md">
          <img
            src={post.featured_image || post.featuredImage}
            alt={post.image_alt || post.imageAlt || post.title}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>

        {/* Pre-Press Studio Takeaways Highlight */}
        <aside className="mb-10 rounded-2xl border border-accent/30 bg-accent-soft/40 p-6 sm:p-8">
          <div className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-accent">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Dubai Commercial Printing Standards</span>
          </div>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-primary">
            Every commercial print project at ONPRINT follows strict European color profiling (FOGRA39 / GRACoL CMYK), accurate 3mm bleed margins, and premium paper GSM verification to guarantee brand excellence across the UAE.
          </p>
        </aside>

        {/* Table of Contents (Dynamic from H2 and H3) */}
        {headings.length > 1 && (
          <nav
            aria-label="Table of contents"
            className="my-8 rounded-2xl border border-border bg-surface p-6 shadow-xs"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-border/80 text-xs font-extrabold uppercase tracking-wider text-primary">
              <List className="h-4 w-4 text-accent" />
              <span>Table of Contents</span>
            </div>
            <ol className="mt-4 space-y-2 text-xs">
              {headings.map((h, i) => (
                <li
                  key={h.id || i}
                  className={`${h.level === 3 ? 'pl-4 border-l-2 border-border/70 ml-1' : 'font-semibold'}`}
                >
                  <button
                    type="button"
                    onClick={() => scrollToHeading(h.id)}
                    className="text-secondary hover:text-accent transition-colors text-left cursor-pointer hover:underline"
                  >
                    {h.text}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Full Article Content */}
        <main
          className="prose prose-neutral max-w-none text-base leading-relaxed text-primary [&_h2]:font-display [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-primary [&_h2]:scroll-mt-24 [&_h3]:font-display [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-primary [&_h3]:scroll-mt-24 [&_p]:mt-4 [&_p]:text-secondary [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-secondary [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-secondary [&_li]:mt-2 [&_strong]:text-primary [&_a]:text-accent [&_a]:underline [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-2xl [&_table]:w-full [&_table]:overflow-x-auto [&_table]:block [&_pre]:overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: processedHtml || post.content }}
        />

        {/* Social Sharing Section */}
        <section
          aria-label="Share article"
          className="mt-12 rounded-2xl border border-border bg-surface p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <Share2 className="h-4 w-4 text-accent" />
            <span>Share this printing guide</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-background text-secondary hover:border-accent hover:text-accent transition-colors"
              title="Share on X / Twitter"
              aria-label="Share on X"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-background text-secondary hover:border-accent hover:text-accent transition-colors"
              title="Share on LinkedIn"
              aria-label="Share on LinkedIn"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-background text-secondary hover:border-accent hover:text-accent transition-colors"
              title="Share on Facebook"
              aria-label="Share on Facebook"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-background text-secondary hover:border-accent hover:text-accent transition-colors"
              title="Share on WhatsApp"
              aria-label="Share on WhatsApp"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
            </a>

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-secondary hover:border-accent hover:text-accent transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Approved FAQ Accordion (Injected into FAQPage Schema as well) */}
        {approvedFaqs.length > 0 && (
          <section
            aria-label="Frequently Asked Questions"
            className="mt-14 rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-xs"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
              <HelpCircle className="h-4 w-4" />
              <span>Technical Q&amp;A</span>
            </div>
            <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-primary">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-xs text-secondary">
              Key considerations verified by the ONPRINT production and finishing desk.
            </p>

            <div className="mt-6 divide-y divide-border/80 border-t border-border/80">
              {approvedFaqs.map((faq, idx) => {
                const isOpen = openFaqIndices.includes(idx)
                return (
                  <div key={idx} className="py-4">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="flex w-full items-start justify-between gap-4 text-left font-display text-sm font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <span className="shrink-0 text-secondary mt-0.5">
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-accent" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="mt-3 text-xs sm:text-sm leading-relaxed text-secondary animate-in fade-in-50 duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Dynamic Related Product Section */}
        {productData && productData.name && (
          <section aria-label="Featured Print Discipline">
            <Reveal>
              <div className="mt-14 rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                  <Package className="h-4 w-4" />
                  <span>Featured Print Discipline</span>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    {productData.image && (
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-accent-soft shrink-0">
                        <img
                          src={productData.image}
                          alt={productData.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-display text-lg font-bold text-primary">
                        {productData.name}
                      </h3>
                      <p className="text-xs text-secondary mt-0.5 max-w-md">
                        {productData.description || 'Premium commercial printing tailored for Dubai brands and corporate events.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {productData.slug && (
                      <Button to={`/products/${productData.slug}`} variant="outline" size="sm">
                        View Product
                      </Button>
                    )}
                    <Button to="/get-a-quote" variant="accent" size="sm">
                      Request Quote
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* Dynamic Related Category Section */}
        {post.categoryData && (
          <section aria-label="Explore Category" className="mt-6 rounded-2xl border border-border/80 bg-neutral-50/50 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Layers className="h-5 w-5 text-accent shrink-0" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Explore Category</span>
                <div className="font-display text-sm font-bold text-primary">{post.categoryData.name}</div>
              </div>
            </div>
            <Link
              to={`/categories/${post.categoryData.slug}`}
              className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-accent hover:underline"
            >
              <span>View All Options</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>
        )}

        {/* Article Footer */}
        <footer className="mt-16 border-t border-border pt-12">
          {/* Studio Author & Verification Box */}
          <div className="flex items-center gap-5 rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary font-display text-lg font-black text-background">
              ONP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-primary">
                  {post.author_name || post.author || 'ONPRINT Editorial Team'}
                </h3>
                <span className="rounded bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent">
                  Dubai Press Studio
                </span>
              </div>
              <p className="mt-1 text-xs text-secondary leading-relaxed">
                Authored and verified by the technical pre-press, color-management, and commercial print specialists at ONPRINT Dubai.
              </p>
            </div>
          </div>

          {/* High-Converting Quote Call-to-Action */}
          <div className="mt-12 rounded-3xl border border-primary bg-primary p-6 sm:p-10 text-background shadow-xl">
            <div className="flex flex-col items-stretch sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-accent">
                  Ready to Print in Dubai?
                </span>
                <h3 className="font-display mt-3 text-xl font-extrabold text-background sm:text-2xl">
                  Need professional printing for your business?
                </h3>
                <p className="mt-1 text-xs text-background/80 sm:text-sm">
                  Request a bespoke estimate from ONPRINT with fast turnaround and free Dubai delivery.
                </p>
              </div>
              <Button to="/get-a-quote" variant="accent" size="lg" className="shrink-0 text-center justify-center">
                Request a Quote
              </Button>
            </div>
          </div>

          {/* Dynamic Related Articles */}
          {post.related && post.related.length > 0 && (
            <div className="mt-16 border-t border-border pt-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-primary">
                Related Printing Guides
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {post.related.map((item) => (
                  <div
                    key={item.id || item.slug}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-accent"
                  >
                    <div>
                      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-accent-soft">
                        <img
                          src={item.featured_image || item.featuredImage}
                          alt={item.image_alt || item.imageAlt || item.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-accent">
                        {item.category || 'Printing Guide'}
                      </span>
                      <h3 className="font-display mt-2 text-sm font-bold text-primary transition-colors hover:text-accent">
                        <Link to={`/blog/${item.slug}`}>{item.title}</Link>
                      </h3>
                      {item.excerpt && (
                        <p className="mt-1.5 text-xs text-secondary line-clamp-2">{item.excerpt}</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/50">
                      <Link
                        to={`/blog/${item.slug}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:underline"
                      >
                        <span>Read Guide</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </footer>
      </Container>
    </article>
  )
}
