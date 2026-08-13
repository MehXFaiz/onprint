import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, X, ArrowUpRight } from 'lucide-react'
import Container from '../../components/Container'
import ProductCard from '../../components/ProductCard'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Reveal from '../../components/Reveal'
import Button from '../../components/Button'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'

const categoryMeta = {
  'corporate-gift-items': {
    eyebrow: 'BRANDED MERCHANDISE & GIFTS',
    heading: 'CORPORATE GIFT ITEMS',
    description:
      'Premium custom-printed gifts, apparel, mugs, and corporate giveaways designed to elevate brand visibility across Dubai.',
  },
  'office-stationery-printing': {
    eyebrow: 'OFFICIAL CORRESPONDENCE & PAPER',
    heading: 'OFFICE STATIONERY PRINTING',
    description:
      'Executive leather notebooks, metallic pens, soft-touch business cards, and letterheads crafted for seamless corporate communication.',
  },
  'other-products': {
    eyebrow: 'LARGE FORMAT & SIGNAGE',
    heading: 'OTHER PRODUCTS',
    description:
      'Heavy-duty aluminum roll-ups, outdoor beach flags, die-cut vinyl stickers, and acrylic executive desk & door nameplates.',
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

  function handleCategoryChange(slug) {
    setSearchParams(slug ? { category: slug } : {})
  }

  // Filter products by active category & instant search query
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCat =
        !categoryParam ||
        item.category?.slug === categoryParam ||
        item.category?._id === categoryParam

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

  return (
    <div className="py-16 sm:py-24">
      <Container>
        {/* Editorial Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end border-b border-border pb-10">
          <div>
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
              ONPRINT Catalog 2026
            </span>
            <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
              Precision Print Catalog.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-secondary sm:text-base">
              Explore our complete suite of corporate gift items, office stationery, and custom large-format printing produced in Al Quoz, Dubai.
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
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-xs font-medium text-primary transition-all focus:border-accent focus:outline-none shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Pills (Mobile Horizontal Scrollable) */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategoryChange('')}
            className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              !categoryParam
                ? 'bg-primary text-background shadow-xs'
                : 'border border-border bg-surface text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              type="button"
              onClick={() => handleCategoryChange(c.slug || c._id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
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
              {categoryParam && categoryMeta[categoryParam] && (
                <div className="rounded-2xl border border-border/80 bg-surface p-8 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    {categoryMeta[categoryParam].eyebrow}
                  </span>
                  <h2 className="font-display mt-1.5 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                    {categoryMeta[categoryParam].heading}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-secondary leading-relaxed max-w-2xl">
                    {categoryMeta[categoryParam].description}
                  </p>
                </div>
              )}

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

                  {/* Asymmetric Editorial Grid */}
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
        <div className="mt-20 rounded-2xl border border-primary bg-primary p-8 text-background shadow-xl sm:p-12">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <span className="rounded-full bg-accent px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">
                Custom Press Orders
              </span>
              <h3 className="font-display mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl">
                Have a custom printing requirement?
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-background/80">
                Let's create something extraordinary for your brand. From custom embossing and spot UV to bespoke packaging sizes, our press team is ready.
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

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-background text-primary hover:bg-accent-soft hover:text-accent transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="overflow-hidden rounded-xl bg-accent-soft/30 aspect-square">
                <img
                  src={quickViewProduct.images?.[0]}
                  alt={quickViewProduct.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                    {quickViewProduct.category?.name || 'ONPRINT Product'}
                  </span>
                  <h3 className="font-display mt-3 text-2xl font-extrabold text-primary">
                    {quickViewProduct.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-secondary">
                    {quickViewProduct.description || quickViewProduct.shortDescription}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-secondary">
                    {quickViewProduct.minimumQuantity && (
                      <p>
                        <strong className="text-primary">Minimum Order:</strong> {quickViewProduct.minimumQuantity} units
                      </p>
                    )}
                    {quickViewProduct.price && (
                      <p>
                        <strong className="text-primary">Starting Price:</strong> AED {quickViewProduct.price}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2.5">
                  <Button
                    to={`/get-a-quote?product=${quickViewProduct.slug}`}
                    variant="accent"
                    size="md"
                    className="w-full justify-center"
                  >
                    Request Quote For Product
                  </Button>
                  <Link
                    to={`/products/${quickViewProduct.slug}`}
                    className="inline-flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-accent pt-2"
                  >
                    <span>View Full Product Specs</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

