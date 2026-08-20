import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, ArrowRight, BookOpen, Share2, Sparkles, Building2 } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import { getBlogPostBySlug } from '../../services/blog'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    getBlogPostBySlug(slug)
      .then((data) => {
        setPost(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [slug])

  if (status === 'loading') return <LoadingState label="Loading article content…" />
  if (status === 'error' || !post) {
    return (
      <Container className="py-24">
        <EmptyState title="Article not found" note="The requested article may have been relocated." />
        <div className="mt-6 text-center">
          <Button to="/blog" variant="outline" icon={false}>
            ← Return to Blog Index
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <div className="py-16 sm:py-24">
      {/* SEO Head with BlogPosting Schema */}
      <SEOHead
        title={post.seoTitle || `${post.title} | ONPRINT Blog`}
        description={post.seoDescription || post.excerpt}
        keywords={post.seoKeywords || 'printing services dubai, commercial printing uae'}
        canonicalPath={`/blog/${post.slug}`}
        ogImage={post.featuredImage}
        ogType="article"
        blogArticle={post}
        breadcrumbs={[
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      <Container className="max-w-4xl">
        <Breadcrumbs
          items={[
            { name: 'Blog', path: '/blog' },
            { name: post.title },
          ]}
        />

        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog Guides
        </Link>

        {/* Article Header */}
        <header className="mt-8 border-b border-border pb-8">
          <div className="flex items-center gap-3 text-xs font-bold text-secondary">
            <span className="rounded-full bg-accent-soft px-3 py-1 text-accent uppercase tracking-wider">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
            <span className="h-3 w-[1px] bg-border" />
            <span>By {post.author || 'ONPRINT Studio'}</span>
          </div>

          <h1 className="font-display mt-4 text-3xl font-black leading-[1.08] tracking-tight text-primary sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-base leading-relaxed text-secondary sm:text-lg">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Featured Image */}
        <div className="my-8 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-accent-soft shadow-md">
          <img
            src={post.featuredImage}
            alt={post.imageAlt || post.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Key Takeaways Callout Box */}
        <div className="mb-10 rounded-2xl border border-accent/30 bg-accent-soft/30 p-6 sm:p-8">
          <div className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-accent">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Key Takeaways for Dubai Businesses</span>
          </div>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-primary">
            Quality print finishing, correct CMYK pre-flight parameters, and dedicated local press coordination ensure your brand collateral stands out in the UAE corporate landscape.
          </p>
        </div>

        {/* Article Content */}
        <div
          className="prose prose-neutral max-w-none text-base leading-relaxed text-primary [&_h2]:font-display [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-primary [&_h3]:font-display [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-primary [&_p]:mt-4 [&_p]:text-secondary [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-secondary [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-secondary [&_li]:mt-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Studio Author Box */}
        <div className="mt-14 flex items-center gap-5 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary font-display text-lg font-black text-background">
            ONP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-primary">ONPRINT Prepress Studio</h3>
              <span className="rounded bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent">Dubai Press Facility</span>
            </div>
            <p className="mt-1 text-xs text-secondary leading-relaxed">
              Published by the technical print &amp; color-management team at ONPRINT Al Quoz Industrial Area 3, Dubai.
            </p>
          </div>
        </div>

        {/* Quote Call-to-Action */}
        <div className="mt-12 rounded-3xl border border-primary bg-primary p-8 text-background shadow-xl sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-accent">
                Ready to Print in Dubai?
              </span>
              <h3 className="font-display mt-3 text-xl font-extrabold text-background sm:text-2xl">
                Bring your next print project to life.
              </h3>
              <p className="mt-1 text-xs text-background/80 sm:text-sm">
                Get an instant quote with customized paper stocks, dimensions, and finishes.
              </p>
            </div>
            <Button to="/get-a-quote" variant="accent" size="lg" className="shrink-0">
              Request a Quote
            </Button>
          </div>
        </div>

        {/* Related Articles */}
        {post.related && post.related.length > 0 && (
          <div className="mt-16 border-t border-border pt-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-primary">Related Printing Guides</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {post.related.map((item) => (
                <article key={item.slug} className="rounded-2xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-accent">
                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-accent-soft">
                    <img
                      src={item.featuredImage}
                      alt={item.imageAlt || item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-accent">
                    {item.category}
                  </span>
                  <h3 className="font-display mt-2 text-sm font-bold text-primary transition-colors hover:text-accent">
                    <Link to={`/blog/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="mt-1.5 text-xs text-secondary line-clamp-2">{item.excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
