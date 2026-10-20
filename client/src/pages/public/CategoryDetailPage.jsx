import { useEffect, useState, useMemo } from 'react'
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
  Search,
  ChevronRight,
  FolderTree,
  Building2,
  X,
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
import {
  isDepartmentSlug,
  getDepartmentBySlug,
  getDepartmentForCategory,
  MASTER_DEPARTMENTS,
} from '../../data/masterDepartments'

export default function CategoryDetailPage() {
  const { slug } = useParams()

  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [otherCategories, setOtherCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [selectedSubcatFilter, setSelectedSubcatFilter] = useState('all')
  const [deptSearchQuery, setDeptSearchQuery] = useState('')

  const isDept = isDepartmentSlug(slug)
  const departmentInfo = useMemo(() => {
    if (isDept) {
      return getDepartmentBySlug(slug)
    }
    return getDepartmentForCategory(slug)
  }, [isDept, slug])

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(false)
    setSelectedSubcatFilter('all')
    setDeptSearchQuery('')

    async function loadCategoryData() {
      try {
        const allCats = await getCategories().catch(() => [])

        if (isDept) {
          const dept = getDepartmentBySlug(slug)
          if (!dept) {
            if (isMounted) setError(true)
            return
          }

          if (isMounted) {
            setCategory({
              name: dept.name,
              slug: dept.slug,
              eyebrow: dept.eyebrow,
              badge: dept.badge,
              description: dept.description,
              image: dept.heroImage,
              image_url: dept.heroImage,
              isDepartment: true,
              department: dept,
              seoTitle: dept.metaTitle,
              seoDescription: dept.metaDescription,
            })
          }

          // Fetch all products to filter by department subcategories
          const prodsRes = await getProducts({ limit: 120, active: true }).catch(() => ({ data: [] }))
          const allProds = prodsRes.data || []
          const deptProds = allProds.filter((p) => {
            return dept.subcategories.some(
              (sub) => sub.productSlugs.includes(p.slug) || p.category?.slug === sub.slug
            )
          })

          if (isMounted) {
            setProducts(deptProds)
            setOtherCategories(MASTER_DEPARTMENTS.filter((d) => d.slug !== slug))
          }
        } else {
          // Standard Category / Subcategory Lookup
          const catData = await getCategoryById(slug)
          const matched = catData || allCats.find((c) => c.slug === slug || String(c.id) === slug)

          if (matched && isMounted) {
            setCategory(matched)
            if (Array.isArray(allCats)) {
              setOtherCategories(allCats.filter((c) => c.slug !== slug && String(c.id) !== slug).slice(0, 6))
            }

            // Fetch products matching category
            const prodsRes = await getProducts({ category: slug, limit: 60 }).catch(() => ({ data: [] }))
            setProducts(prodsRes.data || [])
          } else if (isMounted) {
            setError(true)
          }
        }
      } catch (err) {
        console.error('Failed to load category details:', err)
        if (isMounted) setError(true)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadCategoryData()

    return () => {
      isMounted = false
    }
  }, [slug, isDept])

  // Filter products on department view if subcategory filter or search is active
  const displayedProducts = useMemo(() => {
    let result = products

    if (isDept && selectedSubcatFilter !== 'all') {
      const subObj = departmentInfo?.subcategories.find((s) => s.slug === selectedSubcatFilter)
      if (subObj) {
        result = result.filter(
          (p) => subObj.productSlugs.includes(p.slug) || p.category?.slug === subObj.slug
        )
      }
    }

    if (deptSearchQuery.trim()) {
      const q = deptSearchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.shortDescription || '').toLowerCase().includes(q)
      )
    }

    return result
  }, [products, isDept, selectedSubcatFilter, departmentInfo, deptSearchQuery])

  if (loading) {
    return (
      <div className="py-24 bg-[#101C35]">
        <Container>
          <LoadingState label="Loading printing department details..." />
        </Container>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="py-24 text-center bg-[#101C35]">
        <Container>
          <div className="max-w-md mx-auto space-y-4">
            <h1 className="font-display text-2xl font-black text-white">Category Not Found</h1>
            <p className="text-sm text-slate-300">
              The category you are looking for does not exist or has been restructured.
            </p>
            <div className="flex justify-center gap-3">
              <Button to="/categories" variant="accent" size="sm">
                Browse Departments
              </Button>
              <Button to="/products" variant="secondary" size="sm">
                All 110+ Products
              </Button>
            </div>
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

  const seoTitle = category.seoTitle || category.seo_title || `${categoryName} in Dubai | ONPRINT`
  const seoDescription = category.seoDescription || category.seo_description || categoryDesc
  const seoKeywords = category.seoKeywords || category.seo_keywords || `${categoryName.toLowerCase()}, commercial printing in dubai, onprint uae`
  const seoHeading = category.seoHeading || category.seo_heading || categoryName
  const canonicalPath = `/categories/${category.slug}`

  // Build breadcrumbs reflecting hierarchy
  const breadcrumbsList = [
    { name: 'Home', url: '/' },
    { name: 'Departments', url: '/categories' },
  ]
  if (!isDept && departmentInfo) {
    breadcrumbsList.push({ name: departmentInfo.name, url: `/categories/${departmentInfo.slug}` })
  }
  breadcrumbsList.push({ name: categoryName, url: canonicalPath })

  const breadcrumbsUi = [
    { name: 'Home', path: '/' },
    { name: 'Departments', path: '/categories' },
  ]
  if (!isDept && departmentInfo) {
    breadcrumbsUi.push({ name: departmentInfo.name, path: `/categories/${departmentInfo.slug}` })
  }
  breadcrumbsUi.push({ name: categoryName })

  const categoryFaqs = [
    {
      question: `What materials and print stocks are used for ${categoryName} in Dubai?`,
      answer: `ONPRINT crafts ${categoryName} using FSC-certified stocks from 120gsm to 450gsm, premium cotton boards, heavy aluminum cassettes, synthetic waterproof films, and luxury metallic foiling.`,
    },
    {
      question: `What is the delivery turnaround time in Dubai and across the UAE?`,
      answer: `We provide 24-hour rush dispatch for urgent corporate jobs in Dubai, and 2–3 business days standard delivery across Abu Dhabi, Sharjah, and all Northern Emirates.`,
    },
    {
      question: `Can I get physical color-matched samples or pre-flight proofs?`,
      answer: `Yes. Our Al Quoz pressroom conducts free pre-flight artwork inspections, PDF proofs, and physical Pantone spot-color match verification upon request.`,
    },
    {
      question: `Do you provide bulk order discounts for UAE businesses?`,
      answer: `Yes. Volume tier pricing is automatically applied for corporate stationery reorders, exhibitions, and marketing campaigns. Contact our hotline or WhatsApp for trade pricing.`,
    },
  ]

  return (
    <div className="bg-[#101C35] text-slate-200 py-10 sm:py-16">
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

      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbsUi} />

        {/* Hero Section */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Information */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D6BC8A]/40 bg-[#1B2943] px-3.5 py-1 text-xs font-black uppercase tracking-widest text-[#D6BC8A] shadow-xs">
                  <Sparkles className="h-3.5 w-3.5 text-[#D6BC8A]" />
                  {isDept ? (category.badge || 'MASTER DEPARTMENT') : (departmentInfo ? departmentInfo.name : 'COMMERCIAL SUITE')}
                </span>
                {isDept && (
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300">
                    {products.length} Products Catalog
                  </span>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl">
                {seoHeading}
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
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
                  <span>Get WhatsApp Quote</span>
                </a>
                <Button to="/get-a-quote" variant="accent" size="lg" className="shadow-lg shadow-[#D6BC8A]/25 text-center justify-center">
                  Request Instant Quote
                </Button>
                <Button
                  to="/products"
                  variant="secondary"
                  size="lg"
                  className="border-[#263654] text-white hover:border-[#D6BC8A] hover:text-[#D6BC8A] text-center justify-center"
                >
                  Browse Full Catalog
                </Button>
              </div>
            </Reveal>

            {/* Quality Checklist */}
            <Reveal delay={0.4}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 border-t border-[#263654] pt-6 text-xs font-bold text-white">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#D6BC8A] shrink-0" />
                  <span>German Heidelberg &amp; HP Indigo Presses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#D6BC8A] shrink-0" />
                  <span>FSC-Certified Stocks &amp; 24K Gold Foils</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#D6BC8A] shrink-0" />
                  <span>24–48h Express Dubai Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#D6BC8A] shrink-0" />
                  <span>Doorstep UAE Delivery &amp; Tracking</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Hero Category Image */}
          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <div className="group relative overflow-hidden rounded-3xl border border-[#263654] bg-[#1B2943] p-2 shadow-2xl transition-transform duration-300 hover:scale-[1.01]">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#101C35]">
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
                <div className="p-3 flex items-center justify-between text-[11px] font-bold text-slate-300">
                  <span>Dubai Commercial Press • Al Quoz</span>
                  <span className="text-[#D6BC8A] font-black">100% Quality Inspected</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* IF MASTER DEPARTMENT: RENDER SUBCATEGORY EXPLORATION CARDS */}
        {isDept && departmentInfo && (
          <div className="mt-16 border-t border-[#263654] pt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#D6BC8A]">
                  EXPLORE DEPARTMENT CATEGORIES
                </span>
                <h3 className="font-display text-2xl font-black text-white mt-1">
                  Subcategories in {departmentInfo.name}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                Click any category for direct specifications
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {departmentInfo.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  to={`/categories/${sub.slug}`}
                  className="group relative rounded-2xl border border-[#263654] bg-[#1B2943] p-4 hover:border-[#D6BC8A] transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#101C35] mb-3">
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/assets/products/luxury_business_cards_dubai.jpg'
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-display text-sm font-bold text-white group-hover:text-[#D6BC8A] transition-colors">
                        {sub.name}
                      </h4>
                      <span className="rounded-full bg-[#101C35] border border-[#263654] px-2 py-0.5 text-[10px] font-bold text-[#D6BC8A]">
                        {sub.productSlugs.length} items
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {sub.shortDesc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#263654] flex items-center justify-between text-xs font-bold text-[#D6BC8A]">
                    <span>{sub.featuredBadge || 'View Collection'}</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* IF SINGLE CATEGORY: SIBLING PILLS IN SAME DEPARTMENT */}
        {!isDept && departmentInfo && departmentInfo.subcategories?.length > 1 && (
          <div className="mt-12 rounded-2xl border border-[#263654] bg-[#1B2943] p-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-[#D6BC8A] mr-2">
              Related in {departmentInfo.name}:
            </span>
            {departmentInfo.subcategories.map((sub) => {
              const isCurrent = sub.slug === slug
              return (
                <Link
                  key={sub.slug}
                  to={`/categories/${sub.slug}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#D6BC8A] text-[#101C35]'
                      : 'bg-[#101C35] text-slate-300 hover:text-white hover:border-[#D6BC8A] border border-[#263654]'
                  }`}
                >
                  {sub.name}
                </Link>
              )
            })}
          </div>
        )}

        {/* Dynamic Products Showcase */}
        <div className="mt-16 border-t border-[#263654] pt-12">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#D6BC8A]">
                PRODUCT CATALOG
              </span>
              <h2 className="font-display mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                {categoryName} Products ({displayedProducts.length})
              </h2>
            </div>

            {/* Department In-Page Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={deptSearchQuery}
                onChange={(e) => setDeptSearchQuery(e.target.value)}
                placeholder={`Search in ${categoryName}...`}
                className="w-full rounded-xl border border-[#263654] bg-[#1B2943] pl-9 pr-8 py-2 text-xs font-semibold text-white placeholder:text-slate-400 focus:border-[#D6BC8A] focus:outline-none"
              />
              {deptSearchQuery && (
                <button
                  type="button"
                  onClick={() => setDeptSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Subcategory Filter Tabs for Department Pages */}
          {isDept && departmentInfo && (
            <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedSubcatFilter('all')}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  selectedSubcatFilter === 'all'
                    ? 'bg-[#D6BC8A] text-[#101C35] shadow-sm'
                    : 'bg-[#1B2943] border border-[#263654] text-slate-300 hover:text-white'
                }`}
              >
                All Products ({products.length})
              </button>
              {departmentInfo.subcategories.map((sub) => {
                const count = sub.productSlugs.length
                return (
                  <button
                    key={sub.slug}
                    type="button"
                    onClick={() => setSelectedSubcatFilter(sub.slug)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      selectedSubcatFilter === sub.slug
                        ? 'bg-[#D6BC8A] text-[#101C35] shadow-sm'
                        : 'bg-[#1B2943] border border-[#263654] text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{sub.name}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                )
              })}
            </div>
          )}

          {displayedProducts.length === 0 ? (
            <div className="rounded-3xl border border-[#263654] bg-[#1B2943] p-10 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-200">
                {deptSearchQuery
                  ? `No products found matching "${deptSearchQuery}". Try clearing search.`
                  : `Custom orders available for ${categoryName}. Get in touch for tailored specifications.`}
              </p>
              {deptSearchQuery ? (
                <Button onClick={() => setDeptSearchQuery('')} variant="accent" size="sm">
                  Clear Search
                </Button>
              ) : (
                <Button to="/get-a-quote" variant="accent" size="sm">
                  Request Custom Quotation
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
              {displayedProducts.map((product, idx) => (
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
          <div className="mt-12 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 to-[#101C35] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-extrabold text-base text-white">
                Need tailored sizing, bulk discounts, or urgent 24h printing for {categoryName}?
              </p>
              <p className="text-xs text-emerald-300 mt-1">
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
        <div className="mt-20 rounded-3xl border border-[#263654] bg-[#1B2943] p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D6BC8A]">
              PRODUCTION SPECIFICATIONS
            </span>
            <h3 className="font-display mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Professional Production Standards for {categoryName}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#263654] bg-[#101C35] p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#D6BC8A]">
                <Printer className="h-4 w-4" />
                <span>Print Technology</span>
              </div>
              <p className="text-xs font-medium text-slate-300">
                HP Indigo Digital Press &amp; Heidelberg Offset presses with Fogra39 color calibration.
              </p>
            </div>

            <div className="rounded-2xl border border-[#263654] bg-[#101C35] p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#D6BC8A]">
                <Layers className="h-4 w-4" />
                <span>Paper Stocks</span>
              </div>
              <p className="text-xs font-medium text-slate-300">
                Curated FSC-certified 120gsm to 450gsm cardstocks, cotton boards, and synthetic tear-proof sheets.
              </p>
            </div>

            <div className="rounded-2xl border border-[#263654] bg-[#101C35] p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#D6BC8A]">
                <Award className="h-4 w-4" />
                <span>Specialty Finishes</span>
              </div>
              <p className="text-xs font-medium text-slate-300">
                Velvet soft-touch lamination, raised 3D spot UV, hot metallic foil stamping, and painted edges.
              </p>
            </div>

            <div className="rounded-2xl border border-[#263654] bg-[#101C35] p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#D6BC8A]">
                <Clock className="h-4 w-4" />
                <span>Turnaround Times</span>
              </div>
              <p className="text-xs font-medium text-slate-300">
                Express same-day or 24–48 hours delivery across Dubai, Abu Dhabi, Sharjah, and all UAE Emirates.
              </p>
            </div>
          </div>
        </div>

        {/* Category FAQs for SEO Rich Snippets */}
        <div className="mt-16 rounded-3xl border border-[#263654] bg-[#1B2943] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#D6BC8A]">
            <HelpCircle className="h-4 w-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
            {categoryName} Specifications &amp; Ordering FAQs
          </h2>
          <div className="mt-6 divide-y divide-[#263654] border-t border-[#263654]">
            {categoryFaqs.map((faq, index) => (
              <div key={index} className="py-5">
                <h3 className="font-display text-base font-bold text-white">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Product Detail Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  )
}
