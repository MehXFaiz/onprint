import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle,
  Clock,
  Printer,
  Layers,
  Award,
  ArrowRight,
  HelpCircle,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import ProductCard from '../../components/ProductCard'
import ProductDetailModal from '../../components/ProductDetailModal'
import LoadingState from '../../components/LoadingState'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import { getCategoryById, getCategories } from '../../services/categories'
import { getProducts } from '../../services/products'

export default function CategoryDetailPage() {
  const { slug } = useParams()

  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(false)

    async function loadCategoryData() {
      try {
        const catData = await getCategoryById(slug)
        if (!catData) {
          // If not found by direct ID/slug lookup, fetch list and find by slug
          const allCats = await getCategories()
          const matched = allCats.find((c) => c.slug === slug || String(c.id) === slug)
          if (matched && isMounted) {
            setCategory(matched)
          } else if (isMounted) {
            setError(true)
          }
        } else if (isMounted) {
          setCategory(catData)
        }

        // Fetch products matching category
        const prodsRes = await getProducts({ category: slug, pageSize: 20 })
        if (isMounted) {
          setProducts(prodsRes.data || [])
        }
      } catch (err) {
        console.error('Failed to load category:', err)
        if (isMounted) setError(true)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadCategoryData()

    return () => {
      isMounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="py-24">
        <Container>
          <LoadingState label="Loading category details..." />
        </Container>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="py-24 text-center">
        <Container>
          <div className="max-w-md mx-auto space-y-4">
            <h1 className="font-display text-2xl font-black text-[#000000]">Category Not Found</h1>
            <p className="text-sm text-[#000000]/70">
              The category you are looking for does not exist or has been moved.
            </p>
            <Button to="/categories" variant="accent" size="sm">
              Browse All Categories
            </Button>
          </div>
        </Container>
      </div>
    )
  }

  const categoryName = category.name || 'Printing Category'
  const categoryImage = category.image_url || category.image || '/assets/products/1 (1).jpg'
  const categoryDesc =
    category.description ||
    `Order high-precision ${categoryName} in Dubai with ONPRINT. Premium cardstocks, rich Pantone colors, and express same-day delivery across the UAE.`

  const seoTitle = category.seo_title || category.seoTitle || `${categoryName} in Dubai | ONPRINT`
  const seoDescription = category.seo_description || category.seoDescription || categoryDesc
  const seoKeywords = category.seo_keywords || category.seoKeywords || `${categoryName.toLowerCase()}, printing in dubai, onprint uae`
  const seoHeading = category.seo_heading || category.seoHeading || `${categoryName} in Dubai`
  const canonicalPath = `/categories/${category.slug}`

  const breadcrumbsList = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
    { name: categoryName, url: canonicalPath },
  ]

  // Structured Data (CollectionPage + LocalBusiness)
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seoTitle,
    description: seoDescription,
    url: `https://0nprint.com${canonicalPath}`,
    image: categoryImage.startsWith('http') ? categoryImage : `https://0nprint.com${categoryImage}`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'ONPRINT Printing & Branding Solutions',
      telephone: '+971 4 800 PRINT',
      email: 'info@onprint.ae',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dubai',
        addressRegion: 'Dubai',
        addressCountry: 'AE',
      },
    },
  }

  return (
    <div className="bg-[#FFFFFF] text-[#000000] py-12 sm:py-16">
      {/* SEO Head Management */}
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalPath={canonicalPath}
        breadcrumbs={breadcrumbsList}
        ogImage={categoryImage}
        ogType="website"
      />

      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Categories', path: '/categories' },
            { name: categoryName },
          ]}
        />

        {/* Hero Section */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Information */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19] bg-[#FFFFFF] px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#A82F19] shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#A82F19]" />
                Commercial Printing Press Dubai
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display text-3xl font-black leading-[1.08] tracking-tight text-[#000000] sm:text-5xl">
                {seoHeading}
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-base leading-relaxed text-[#000000]/75 sm:text-lg">
                {categoryDesc}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button to="/get-a-quote" variant="accent" size="lg" className="shadow-lg shadow-[#A82F19]/25">
                  Request a Free Quote
                </Button>
                <Button
                  to={`/products?category=${category.slug}`}
                  variant="secondary"
                  size="lg"
                  className="border-[#000000] text-[#000000] hover:border-[#A82F19] hover:text-[#A82F19]"
                >
                  View Products Catalog
                </Button>
              </div>
            </Reveal>

            {/* Quality Checklist */}
            <Reveal delay={0.4}>
              <div className="grid grid-cols-2 gap-4 border-t border-[#000000]/10 pt-6 text-xs font-bold text-[#000000]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0" />
                  <span>300+ DPI Precision CMYK</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0" />
                  <span>Free Design Pre-flight Check</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0" />
                  <span>24–48h Express Dubai Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0" />
                  <span>Doorstep UAE Delivery</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Hero Category Image */}
          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <div className="group relative overflow-hidden rounded-3xl border border-[#000000]/15 bg-[#FFFFFF] p-2 shadow-2xl transition-transform duration-300 hover:scale-[1.01]">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#FFFFFF]">
                  <img
                    src={categoryImage}
                    alt={category.image_alt || category.imageAlt || categoryName}
                    loading="eager"
                    width={1200}
                    height={900}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/assets/products/1 (1).jpg'
                    }}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 flex items-center justify-between text-[11px] font-bold text-[#000000]/70">
                  <span>Dubai Commercial Press</span>
                  <span className="text-[#A82F19] font-black">100% Quality Inspected</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Dynamic Products Showcase for this Category */}
        <div className="mt-20 border-t border-[#000000]/10 pt-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end mb-10">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#A82F19]">
                PRODUCT CATALOG
              </span>
              <h2 className="font-display mt-1 text-2xl font-black tracking-tight text-[#000000] sm:text-3xl">
                {categoryName} Products
              </h2>
            </div>
            <Link
              to={`/products?category=${category.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A82F19] hover:underline"
            >
              Browse All {categoryName} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="rounded-3xl border border-[#000000]/10 bg-[#FFFFFF] p-10 text-center space-y-3">
              <p className="text-sm font-semibold text-[#000000]/70">
                Custom orders available for {categoryName}. Get in touch for tailored specifications.
              </p>
              <Button to="/get-a-quote" variant="accent" size="sm">
                Request Custom Quotation
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </div>

        {/* Technical Specs & Printing Details */}
        <div className="mt-20 rounded-3xl border border-[#000000]/10 bg-[#FFFFFF] p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#A82F19]">
              PRODUCTION SPECIFICATIONS
            </span>
            <h3 className="font-display mt-2 text-xl font-bold tracking-tight text-[#000000] sm:text-2xl">
              Professional Production Standards for {categoryName}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#000000]/10 bg-neutral-50/50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#A82F19]">
                <Printer className="h-4 w-4" />
                <span>Print Technology</span>
              </div>
              <p className="text-xs font-medium text-[#000000]/80">
                HP Indigo Digital Press &amp; Heidelberg Offset presses with Fogra39 color calibration.
              </p>
            </div>

            <div className="rounded-2xl border border-[#000000]/10 bg-neutral-50/50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#A82F19]">
                <Layers className="h-4 w-4" />
                <span>Paper Stocks</span>
              </div>
              <p className="text-xs font-medium text-[#000000]/80">
                Curated FSC-certified 120gsm to 450gsm cardstocks, cotton boards, and synthetic tear-proof sheets.
              </p>
            </div>

            <div className="rounded-2xl border border-[#000000]/10 bg-neutral-50/50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#A82F19]">
                <Award className="h-4 w-4" />
                <span>Specialty Finishes</span>
              </div>
              <p className="text-xs font-medium text-[#000000]/80">
                Velvet soft-touch lamination, raised 3D spot UV, hot metallic foil stamping, and painted edges.
              </p>
            </div>

            <div className="rounded-2xl border border-[#000000]/10 bg-neutral-50/50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#A82F19]">
                <Clock className="h-4 w-4" />
                <span>Turnaround Times</span>
              </div>
              <p className="text-xs font-medium text-[#000000]/80">
                Express same-day or 24–48 hours delivery across Dubai, Abu Dhabi, Sharjah, and all UAE Emirates.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 rounded-3xl border border-[#000000] bg-[#000000] p-8 sm:p-12 text-[#FFFFFF] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-black text-[#FFFFFF] sm:text-3xl">
              Ready to Order {categoryName}?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#FFFFFF]/70 max-w-lg">
              Send us your artwork or consult with our prepress team for instant digital proofs and volume discounts.
            </p>
          </div>
          <Button to="/get-a-quote" variant="accent" size="lg" className="shrink-0 font-bold">
            Get an Instant Quote
          </Button>
        </div>
      </Container>

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  )
}
