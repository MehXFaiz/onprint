import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, ArrowRight, Sparkles, Building2, Package, Layers, CheckCircle2 } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Reveal from '../../components/Reveal'
import { getPublicBlogBySlug } from '../../services/blog'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [status, setStatus] = useState('loading')

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
    <div className="py-16 sm:py-24">
      {/* Comprehensive Dynamic SEO Head */}
      <SEOHead
        title={post.seo_title || post.seoTitle || `${post.title} | ONPRINT Dubai`}
        description={post.meta_description || post.seoDescription || post.excerpt}
        keywords={post.focus_keyword || post.seoKeywords || 'commercial printing dubai, digital printing uae'}
        canonicalPath={`/blog/${post.slug}`}
        ogImage={post.og_image || post.featured_image || post.featuredImage}
        ogType="article"
        blogArticle={post}
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
        <div className="mb-10 rounded-2xl border border-accent/30 bg-accent-soft/40 p-6 sm:p-8">
          <div className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-accent">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Dubai Commercial Printing Standards</span>
          </div>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-primary">
            Every commercial print project at ONPRINT follows strict European color profiling (FOGRA39 / GRACoL CMYK), accurate 3mm bleed margins, and premium paper GSM verification to guarantee brand excellence across the UAE.
          </p>
        </div>

        {/* Full Article Content */}
        <div
          className="prose prose-neutral max-w-none text-base leading-relaxed text-primary [&_h2]:font-display [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-primary [&_h3]:font-display [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-primary [&_p]:mt-4 [&_p]:text-secondary [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-secondary [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-secondary [&_li]:mt-2 [&_strong]:text-primary [&_a]:text-accent [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Dynamic Related Product Section */}
        {productData && productData.name && (
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

                <div className="flex items-center gap-3 shrink-0">
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
        )}

        {/* Dynamic Related Category Section */}
        {post.categoryData && (
          <div className="mt-6 rounded-2xl border border-border/80 bg-neutral-50/50 p-5 flex items-center justify-between gap-4">
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
          </div>
        )}

        {/* Studio Author & Verification Box */}
        <div className="mt-12 flex items-center gap-5 rounded-2xl border border-border bg-surface p-6 sm:p-8">
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
        <div className="mt-12 rounded-3xl border border-primary bg-primary p-8 text-background shadow-xl sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-accent">
                Ready to Print in Dubai?
              </span>
              <h3 className="font-display mt-3 text-xl font-extrabold text-background sm:text-2xl">
                Need professional printing for your business?
              </h3>
              <p className="mt-1 text-xs text-background/80 sm:text-sm">
                Request a bespoke estimate from ONPRINT with fast turnaround and free Dubai delivery.
              </p>
            </div>
            <Button to="/get-a-quote" variant="accent" size="lg" className="shrink-0">
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
                <article
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
                </article>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
