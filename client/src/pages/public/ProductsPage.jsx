import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, Sparkles } from 'lucide-react'
import Container from '../../components/Container'
import ProductCard from '../../components/ProductCard'
import ProductDetailModal from '../../components/ProductDetailModal'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Reveal from '../../components/Reveal'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'
import { trackViewCategory, trackSearch } from '../../utils/analytics'

const categoryMeta = {
  'corporate-gift-items': {
    eyebrow: 'CORPORATE GIFTS DUBAI',
    heading: 'Corporate Gifts & Promotional Merchandise Dubai',
    title: 'Corporate Gifts Dubai | Custom Promotional Gifts & Merchandise | ONPRINT',
    description:
      'Premium corporate gift printing in Dubai. Custom printed mugs, thermal smart flasks, apparel, notebooks, and promotional merchandise for UAE brands.',
    keywords: 'corporate gifts dubai, promotional gifts dubai, corporate gift printing dubai, custom gifts dubai, branded merchandise uae',
  },
  'office-stationery-printing': {
    eyebrow: 'OFFICE STATIONERY PRINTING',
    heading: 'Executive Office Stationery Printing Dubai',
    title: 'Office Stationery Printing Dubai | Executive Business Stationery | ONPRINT',
    description:
      'Executive leather notebooks, metallic rollerball pens, soft-touch business cards, and official letterheads crafted for seamless corporate communication in Dubai.',
    keywords: 'office stationery printing dubai, business card printing dubai, corporate letterheads dubai, executive notebooks uae',
  },
  'other-products': {
    eyebrow: 'LARGE FORMAT & PROMOTIONAL DISPLAYS',
    heading: 'Large-Format Displays, Signage & Stickers in Dubai',
    title: 'Large Format Printing & Custom Displays Dubai | ONPRINT',
    description:
      'Heavy-duty aluminum roll-ups, outdoor beach flags, die-cut vinyl stickers, and acrylic executive desk & door nameplates manufactured in Dubai.',
    keywords: 'large format printing dubai, roll up printing dubai, sticker printing dubai, beach flags dubai, acrylic nameplates uae',
  },
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || ''

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(false)
    getProducts({ page: 1, pageSize: 50 })
      .then((res) => {
        setProducts(res.data || [])
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  // Track Category View Event
  useEffect(() => {
    if (categoryParam) {
      const catObj = categories.find((c) => c.slug === categoryParam || c._id === categoryParam)
      const catName = catObj?.name || categoryMeta[categoryParam]?.heading || categoryParam
      trackViewCategory({
        category_name: catName,
        category_slug: categoryParam,
      })
    } else {
      trackViewCategory({
        category_name: 'All Products',
        category_slug: 'all',
      })
    }
  }, [categoryParam, categories])

  // Track Search Queries (Debounced 600ms)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return
    const timer = setTimeout(() => {
      trackSearch({ search_term: searchQuery.trim() })
    }, 600)
    return () => clearTimeout(timer)
  }, [searchQuery])

  function handleCategoryChange(slug) {
    setSearchParams(slug ? { category: slug } : {})
  }

  // Filter products by active category & instant search query
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCat =
        !categoryParam ||
        item.category?.slug === categoryParam ||
        item.category?._id === categoryParam ||
        item.category?.name?.toLowerCase() === categoryParam.toLowerCase()

      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.shortDescription && item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchCat && matchSearch
    })
  }, [products, categoryParam, searchQuery])

  // Group products by category when "All" is active
  const groupedCategories = useMemo(() => {
    if (categoryParam) return []
    const groups = {}
    products.forEach((p) => {
      const catSlug = p.category?.slug || 'other-products'
      if (!groups[catSlug]) {
        groups[catSlug] = {
          meta: categoryMeta[catSlug] || {
            eyebrow: 'SHOWCASE',
            heading: p.category?.name || 'PRODUCTS',
            description: 'Browse our specialized printing catalog.',
          },
          items: [],
        }
      }
      groups[catSlug].items.push(p)
    })
    return Object.values(groups)
  }, [products, categoryParam])

  // Active Category Meta
  const activeMeta = categoryMeta[categoryParam] || {
    eyebrow: 'ONPRINT PRODUCT CATALOG',
    heading: 'Custom Printing Products & Promotional Supplies in Dubai',
    title: 'Custom Printing Products Dubai | Corporate Merchandise & Stationery | ONPRINT',
    description:
      'Explore our full catalog of corporate gifts, business cards, letterheads, roll-up banners, and waterproof stickers in Dubai, UAE.',
    keywords: 'custom printing products dubai, printing company dubai, promotional products dubai, business stationery printing uae',
  }

  const breadcrumbsList = categoryParam
    ? [
        { name: 'Products', url: '/products' },
        { name: activeMeta.heading, url: `/products?category=${categoryParam}` },
      ]
    : [{ name: 'Products', url: '/products' }]

  return (
    <div className="py-16 sm:py-24">
      {/* SEO Head Management */}
      <SEOHead
        title={activeMeta.title}
        description={activeMeta.description}
        keywords={activeMeta.keywords}
        canonicalPath={categoryParam ? `/products?category=${categoryParam}` : '/products'}
        breadcrumbs={breadcrumbsList}
      />

      <Container>
        <Breadcrumbs
          items={
            categoryParam
              ? [
                  { name: 'Products', path: '/products' },
                  { name: categories.find((c) => c.slug === categoryParam)?.name || activeMeta.eyebrow },
                ]
              : [{ name: 'Products' }]
          }
        />

        {/* Editorial Page Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end border-b border-border pb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{activeMeta.eyebrow}</span>
            </div>
            <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
              {activeMeta.heading}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-secondary sm:text-base">
              {activeMeta.description}
            </p>
          </div>

          {/* Instant Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-xs font-semibold text-primary transition-all focus:border-accent focus:outline-none shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer"
                aria-label="Clear search query"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="mt-8 flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategoryChange('')}
            className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              !categoryParam
                ? 'bg-primary text-background shadow-xs'
                : 'border border-border bg-surface text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            All Products
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              type="button"
              onClick={() => handleCategoryChange(c.slug || c._id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                categoryParam === c.slug || categoryParam === c._id
                  ? 'bg-primary text-background shadow-xs'
                  : 'border border-border bg-surface text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="mt-12">
          {loading && <LoadingState label="Loading ONPRINT catalog products…" />}
          {error && <EmptyState title="Unable to load product catalog" note="Please check your connection and refresh." />}

          {!loading && !error && filteredProducts.length === 0 && (
            <EmptyState
              title="No matching products found"
              note={searchQuery ? `No results for "${searchQuery}". Try a different keyword.` : 'Select a different category above.'}
            />
          )}

          {/* VIEW 1: Filtered / Single Category or Search Active */}
          {!loading && !error && (categoryParam || searchQuery) && filteredProducts.length > 0 && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <Reveal key={product._id} delay={(index % 3) * 0.08}>
                    <ProductCard
                      product={product}
                      featured={index === 0 && !searchQuery}
                      onQuickView={setQuickViewProduct}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 2: All Categories Editorial Grouped Layout */}
          {!loading && !error && !categoryParam && !searchQuery && (
            <div className="space-y-20">
              {groupedCategories.map((group, groupIdx) => (
                <section key={groupIdx} className="space-y-8">
                  {/* Editorial Category Header */}
                  <div className="border-b border-border/80 pb-6">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-accent">
                      {group.meta.eyebrow}
                    </span>
                    <h2 className="font-display mt-1 text-2xl font-extrabold tracking-tight text-primary sm:text-4xl">
                      {group.meta.heading}
                    </h2>
                    <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-secondary">
                      {group.meta.description}
                    </p>
                  </div>

                  {/* Asymmetric Editorial Grid Layout */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((product, idx) => (
                      <Reveal key={product._id} delay={(idx % 3) * 0.08}>
                        <ProductCard
                          product={product}
                          featured={idx === 0}
                          onQuickView={setQuickViewProduct}
                        />
                      </Reveal>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Conversion CTA Section at Bottom */}
        <div className="mt-20 rounded-3xl border border-primary bg-primary p-8 text-background shadow-xl sm:p-12">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <span className="rounded-full bg-accent/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-accent">
                Custom Press Orders
              </span>
              <h2 className="font-display mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl text-background">
                Have a custom printing requirement in Dubai?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-background/80">
                Let's create something extraordinary for your brand. From custom embossing and spot UV to bespoke packaging sizes, our press team is ready in Al Quoz, Dubai.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 shrink-0">
              <Button to="/get-a-quote" variant="accent" size="lg">
                Request a Quote
              </Button>
              <Button to="/contact" variant="outline" size="lg" className="border-background/30 text-background hover:bg-background hover:text-primary">
                Contact Studio
              </Button>
            </div>
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
