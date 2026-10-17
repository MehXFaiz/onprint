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
import WhatsAppIcon from '../../components/WhatsAppIcon'
import { getServiceWhatsAppUrl } from '../../utils/whatsapp'
import { trackWhatsAppClick, trackGetQuoteClick } from '../../utils/analytics'

export default function CategoryDetailPage() {
  const { slug } = useParams()

  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [otherCategories, setOtherCategories] = useState([])
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
        const allCats = await getCategories()
        if (isMounted && Array.isArray(allCats)) {
          setOtherCategories(allCats.filter((c) => c.slug !== slug && String(c.id) !== slug).slice(0, 6))
        }

        if (!catData) {
          // If not found by direct ID/slug lookup, fetch list and find by slug
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
        const prodsRes = await getProducts({ category: slug, pageSize: 50 })
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
            <h1 className="font-display text-2xl font-black text-[#101D35]">Category Not Found</h1>
            <p className="text-sm text-[#343D4F]">
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
  const categoryFallbackImage = `/uploads/categories/${category.slug}.jpg`
  const rawImg = category.image_url || category.image
  const categoryImage = (!rawImg || rawImg.includes('trae.ai')) ? categoryFallbackImage : rawImg
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

  const categoryFaqs = [
    {
      question: `What materials and cardstocks are available for ${categoryName} in Dubai?`,
      answer: `ONPRINT provides an extensive selection of premium FSC-certified stocks ranging from 120gsm fine stationery papers to 450gsm heavy cotton and silk boards, as well as waterproof synthetic substrates and presentation boards.`
    },
    {
      question: `What is the standard production turnaround time for ${categoryName}?`,
      answer: `We offer express same-day and 24-hour turnaround for rush corporate orders in Dubai, and standard 2–3 business days dispatch across Abu Dhabi, Sharjah, and all UAE Emirates.`
    },
    {
      question: `Can I request physical color-matched proofs before mass printing?`,
      answer: `Yes. Our prepress studio in Al Quoz, Dubai provides digital PDF proofs and physical ISO-calibrated press proofs with exact Pantone color matching and finish verification.`
    },
    {
      question: `Do you provide bulk order discounts for UAE businesses?`,
      answer: `Yes. Volume tier pricing is automatically calculated for large quantities, corporate stationery contracts, and exhibition events. Contact our print sales team for tailored corporate accounts.`
    }
  ]

  // Structured Data (CollectionPage + LocalBusiness)
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seoTitle,
    description: seoDescription,
    url: `https://www.0nprint.com${canonicalPath}`,
    image: categoryImage.startsWith('http') ? categoryImage : `https://www.0nprint.com${categoryImage}`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'ONPRINT Printing & Branding Solutions',
      email: '0nprint183@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Al Quoz',
        addressLocality: 'Dubai',
        addressRegion: 'Dubai',
        addressCountry: 'AE',
      },
    },
  }

  return (
    <div className="bg-[#FFFFFF] text-[#343D4F] py-12 sm:py-16">
      {/* SEO Head Management */}
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalPath={canonicalPath}
        breadcrumbs={breadcrumbsList}
        faqList={categoryFaqs}
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
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65] bg-[#FFFFFF] px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#D4AF65] shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#D4AF65]" />
                Commercial Printing Press Dubai
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display text-3xl font-black leading-[1.08] tracking-tight text-[#101D35] sm:text-5xl">
                {seoHeading}
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-base leading-relaxed text-[#343D4F] sm:text-lg">
                {categoryDesc}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                <a
                  href={getServiceWhatsAppUrl(category.slug || slug, { productName: categoryName })}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: typeof window !== 'undefined' ? window.location.pathname : 'category_detail',
                      service_name: categoryName,
                      button_location: 'category_detail_hero',
                      label: `category_hero_inquiry_${category.slug || slug}`,
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 cursor-pointer text-center"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-white" />
                  <span>Get a Quote on WhatsApp</span>
                </a>
                <Button to="/get-a-quote" variant="accent" size="lg" className="shadow-lg shadow-[#D4AF65]/25 text-center justify-center">
                  Request a Free Quote
                </Button>
                <Button
                  to={`/products?category=${category.slug}`}
                  variant="secondary"
                  size="lg"
                  className="border-[#101D35] text-[#101D35] hover:border-[#D4AF65] hover:text-[#D4AF65] text-center justify-center"
                >
                  View Products Catalog
                </Button>
              </div>
            </Reveal>

            {/* Quality Checklist */}
            <Reveal delay={0.4}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 border-t border-[#E5E1D8] pt-6 text-xs font-bold text-[#101D35]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#D4AF65] shrink-0" />
                  <span>300+ DPI Precision CMYK</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#D4AF65] shrink-0" />
                  <span>Free Design Pre-flight Check</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#D4AF65] shrink-0" />
                  <span>24–48h Express Dubai Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#D4AF65] shrink-0" />
                  <span>Doorstep UAE Delivery</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Hero Category Image */}
          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <div className="group relative overflow-hidden rounded-3xl border border-[#E5E1D8] bg-[#FFFFFF] p-2 shadow-2xl transition-transform duration-300 hover:scale-[1.01]">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#FFFFFF]">
                  <img
                    src={categoryImage}
                    alt={category.image_alt || category.imageAlt || categoryName}
                    loading="eager"
                    width={1200}
                    height={900}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = categoryFallbackImage
                    }}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 flex items-center justify-between text-[11px] font-bold text-[#343D4F]">
                  <span>Dubai Commercial Press</span>
                  <span className="text-[#D4AF65] font-black">100% Quality Inspected</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Dynamic Products Showcase for this Category */}
        <div className="mt-20 border-t border-[#E5E1D8] pt-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end mb-10">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF65]">
                PRODUCT CATALOG
              </span>
              <h2 className="font-display mt-1 text-2xl font-black tracking-tight text-[#101D35] sm:text-3xl">
                {categoryName} Products
              </h2>
            </div>
            <Link
              to={`/products?category=${category.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF65] hover:underline"
            >
              Browse All {categoryName} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="rounded-3xl border border-[#E5E1D8] bg-[#FFFFFF] p-10 text-center space-y-3">
              <p className="text-sm font-semibold text-[#343D4F]">
                Custom orders available for {categoryName}. Get in touch for tailored specifications.
              </p>
              <Button to="/get-a-quote" variant="accent" size="sm">
                Request Custom Quotation
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product, idx) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  index={idx}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}

          {/* Natural Repeated In-Page WhatsApp Conversion Banner */}
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50/50 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-extrabold text-base text-emerald-950">
                Need tailored sizing, bulk discounts, or urgent 24h printing for {categoryName}?
              </p>
              <p className="text-xs text-emerald-800 mt-1">
                Our Dubai pre-press team is online to review artwork, confirm paper swatches, and quote instantly.
              </p>
            </div>
            <a
              href={getServiceWhatsAppUrl(category.slug || slug, { productName: categoryName })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppClick({
                  source_page: typeof window !== 'undefined' ? window.location.pathname : 'category_detail',
                  service_name: categoryName,
                  button_location: 'category_detail_mid_page',
                  label: `category_mid_inquiry_${category.slug || slug}`,
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 cursor-pointer shrink-0"
            >
              <WhatsAppIcon className="h-4 w-4 fill-white" />
              <span>Chat with Dubai Pressman</span>
            </a>
          </div>
        </div>

        {/* Technical Specs & Printing Details */}
        <div className="mt-20 rounded-3xl border border-[#E5E1D8] bg-[#FFFFFF] p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF65]">
              PRODUCTION SPECIFICATIONS
            </span>
            <h3 className="font-display mt-2 text-xl font-bold tracking-tight text-[#101D35] sm:text-2xl">
              Professional Production Standards for {categoryName}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#E5E1D8] bg-[#F5F2EB]/50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#D4AF65]">
                <Printer className="h-4 w-4" />
                <span>Print Technology</span>
              </div>
              <p className="text-xs font-medium text-[#343D4F]">
                HP Indigo Digital Press &amp; Heidelberg Offset presses with Fogra39 color calibration.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E1D8] bg-[#F5F2EB]/50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#D4AF65]">
                <Layers className="h-4 w-4" />
                <span>Paper Stocks</span>
              </div>
              <p className="text-xs font-medium text-[#343D4F]">
                Curated FSC-certified 120gsm to 450gsm cardstocks, cotton boards, and synthetic tear-proof sheets.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E1D8] bg-[#F5F2EB]/50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#D4AF65]">
                <Award className="h-4 w-4" />
                <span>Specialty Finishes</span>
              </div>
              <p className="text-xs font-medium text-[#343D4F]">
                Velvet soft-touch lamination, raised 3D spot UV, hot metallic foil stamping, and painted edges.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E1D8] bg-[#F5F2EB]/50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#D4AF65]">
                <Clock className="h-4 w-4" />
                <span>Turnaround Times</span>
              </div>
              <p className="text-xs font-medium text-[#343D4F]">
                Express same-day or 24–48 hours delivery across Dubai, Abu Dhabi, Sharjah, and all UAE Emirates.
              </p>
            </div>
          </div>
        </div>

        {/* Category FAQs for SEO Rich Snippets */}
        <div className="mt-16 rounded-3xl border border-[#E5E1D8] bg-[#FFFFFF] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#D4AF65]">
            <HelpCircle className="h-4 w-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-[#101D35] sm:text-2xl">
            {categoryName} Specifications &amp; Ordering FAQs
          </h2>
          <div className="mt-6 divide-y divide-border/60 border-t border-border/60">
            {categoryFaqs.map((faq, index) => (
              <div key={index} className="py-5">
                <h3 className="font-display text-base font-bold text-[#101D35]">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#343D4F]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Other Printing Disciplines Internal Linking */}
        {otherCategories.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF65]">
                EXPLORE PRINT DISCIPLINES
              </span>
              <Link
                to="/categories"
                className="text-xs font-bold text-secondary hover:text-[#D4AF65] transition-colors"
              >
                View all categories &rarr;
              </Link>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {otherCategories.map((cat) => (
                <Link
                  key={cat.slug || cat.id}
                  to={`/categories/${cat.slug}`}
                  className="rounded-xl border border-[#E5E1D8] bg-[#FFFFFF] px-4 py-2.5 text-xs font-bold text-[#343D4F] shadow-xs transition-all hover:border-[#D4AF65] hover:text-[#D4AF65] hover:-translate-y-0.5"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-16 rounded-3xl border border-[#101D35] bg-[#101D35] p-6 sm:p-10 md:p-12 text-[#FFFFFF] shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-black text-[#FFFFFF] sm:text-3xl">
              Ready to Order {categoryName}?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#FFFFFF]/70 max-w-lg">
              Send us your artwork or consult with our prepress team for instant digital proofs and volume discounts.
            </p>
          </div>
          <Button to="/get-a-quote" variant="accent" size="lg" className="shrink-0 font-bold text-center justify-center">
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
