import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, Sparkles } from 'lucide-react'
import Container from '../../components/Container'
import ProductCard from '../../components/ProductCard'
import ProductDetailModal from '../../components/ProductDetailModal'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'
import { trackViewCategory, trackSearch } from '../../utils/analytics'

const categoryMeta = {
  'brochures-printing': {
    eyebrow: 'BROCHURES PRINTING DUBAI',
    heading: 'Commercial Brochure Printing Dubai',
    title: 'Brochures Printing in Dubai | Premium Brochure Printing | ONPRINT',
    description:
      'Professional brochure printing in Dubai. Custom bi-fold, tri-fold, and multi-page brochures with soft-touch matte lamination and fast turnaround.',
    keywords: 'brochures printing dubai, brochure printing dubai, corporate brochures uae, custom bi fold brochures',
  },
  'business-cards-printing': {
    eyebrow: 'BUSINESS CARDS PRINTING',
    heading: 'Standard & Executive Business Card Printing Dubai',
    title: 'Business Card Printing in Dubai | Standard & Executive Cards | ONPRINT',
    description:
      'From clean, durable 300gsm/350gsm everyday standard business cards to executive soft-touch, 24K hot foil stamping, and luxury cotton finishes in Dubai.',
    keywords: 'standard business cards dubai, basic business cards dubai, affordable card printing uae, luxury business cards dubai',
  },
  'flyers-printing-in-dubai': {
    eyebrow: 'FLYERS PRINTING IN DUBAI',
    heading: 'High-Impact Marketing Flyer Printing Dubai',
    title: 'Flyer Printing in Dubai | Same Day Marketing Flyer Printing | ONPRINT',
    description:
      'Order custom marketing flyer printing in Dubai. Single and double-sided promo flyers on premium art paper with express same-day delivery.',
    keywords: 'flyers printing in dubai, flyer printing dubai, promotional flyers uae, marketing leaflets dubai',
  },
  'id-card-printing-dubai': {
    eyebrow: 'ID CARD PRINTING DUBAI',
    heading: 'Corporate PVC ID Card Printing Solutions Dubai',
    title: 'ID Card Printing Dubai | Corporate Employee & PVC Cards | ONPRINT',
    description:
      'High-security corporate PVC ID card printing in Dubai. Crisp photo resolution, smart NFC chips, barcodes, and custom lanyards for UAE businesses.',
    keywords: 'id card printing dubai, pvc id cards dubai, corporate employee badges uae, student id card printing',
  },
  'lanyard-printing-dubai': {
    eyebrow: 'LANYARD PRINTING DUBAI',
    heading: 'Custom Branded Neck Lanyard Printing Dubai',
    title: 'Lanyard Printing Dubai | Custom Branded Neck Lanyards | ONPRINT',
    description:
      'Custom branded neck lanyard printing in Dubai. High-density polyester and satin lanyards with safety buckles and swivel hooks for corporate events.',
    keywords: 'lanyard printing dubai, custom lanyards dubai, branded neck straps uae, event lanyards dubai',
  },
  'letterheads-printing-dubai': {
    eyebrow: 'LETTERHEADS PRINTING DUBAI',
    heading: 'Executive Corporate Letterhead Printing Dubai',
    title: 'Letterhead Printing in Dubai | Official Corporate Stationery | ONPRINT',
    description:
      'Executive corporate letterhead printing in Dubai. 120gsm smooth laser-guaranteed paper for official contracts, proposals, and invoices.',
    keywords: 'letterheads printing dubai, letterhead printing dubai, corporate stationery uae, official letterhead paper',
  },
  'name-badges-printing-dubai': {
    eyebrow: 'NAME BADGES PRINTING DUBAI',
    heading: 'Professional Magnetic Name Badges Printing Dubai',
    title: 'Name Badges Printing Dubai | Magnetic Metal & Acrylic Badges | ONPRINT',
    description:
      'Professional staff name badges printing in Dubai. Brushed silver, gold, and acrylic magnetic badges with domed epoxy resin for corporate teams.',
    keywords: 'name badges printing dubai, magnetic name badges dubai, staff badge printing uae, acrylic name tag printing',
  },
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
  'mug-printing-dubai': {
    eyebrow: 'MUG PRINTING DUBAI',
    heading: 'Custom Ceramic & Travel Mug Printing Dubai',
    title: 'Mug Printing Dubai | Custom Ceramic & Magic Mugs | ONPRINT',
    description:
      'High-quality custom ceramic mug printing, magic heat-reveal mugs, travel tumblers, and vintage enamel mugs in Dubai with vibrant dye-sublimation.',
    keywords: 'mug printing dubai, custom mugs dubai, magic mug printing uae, ceramic mug printing dubai',
  },
  'bottle-printing-dubai': {
    eyebrow: 'WATER BOTTLE PRINTING DUBAI',
    heading: 'Custom Water Bottle Printing & Laser Engraving Dubai',
    title: 'Water Bottle Printing Dubai | Custom Flasks & Sports Bottles | ONPRINT',
    description:
      'Custom water bottle printing and laser engraving in Dubai. Double-wall insulated flasks, smart LED temp bottles, aluminium sports bottles with fast UAE delivery.',
    keywords: 'bottle printing dubai, water bottle printing dubai, custom flasks uae, branded sports bottles dubai',
  },
  'stamps-printing-dubai': {
    eyebrow: 'CUSTOM STAMPS & SEALS DUBAI',
    heading: 'Official Company Rubber Stamps & Legal Seals Dubai',
    title: 'Custom Rubber Stamp Making in Dubai | Self-Inking Company Stamps | ONPRINT',
    description:
      'Official company stamp making in Dubai. Self-inking rubber stamps, round company seals, pocket mobile stamps, heavy-duty dater stamps, and luxury brass wax seals with express 2-hour production.',
    keywords: 'rubber stamp dubai, company stamp maker dubai, self inking stamps dubai, official seal stamp uae, wax seal stamp',
  },
  'rollup-banners': {
    eyebrow: 'ROLLUP BANNERS DUBAI',
    heading: 'Premium Retractable Roll-Up Banner Stands Dubai',
    title: 'Rollup Banner Printing Dubai | Retractable Pull-Up Banner Stands | ONPRINT',
    description:
      'High-quality roll-up banner printing in Dubai. Standard 85x200cm, Wide 100x200cm, double-sided, and luxury teardrop retractable pull-up banners with express same-day delivery across UAE.',
    keywords: 'rollup banner dubai, roll up banner printing dubai, pull up banner stand dubai, retractable banner dubai, trade show banner stand',
  },
  'stickers-labels-printing': {
    eyebrow: 'STICKERS & LABELS DUBAI',
    heading: 'Custom Die-Cut Vinyl Stickers & Product Labels Dubai',
    title: 'Stickers & Product Label Printing Dubai | Waterproof Vinyl & Foil | ONPRINT',
    description:
      'Precision die-cut stickers and product roll labels in Dubai. Waterproof vinyl, metallic foil, holographic, and transparent packaging stickers with UV durability.',
    keywords: 'sticker printing dubai, custom labels dubai, die cut stickers uae, packaging labels dubai, holographic stickers',
  },
  'signage-banners-printing': {
    eyebrow: 'SIGNAGE & EXHIBITION DISPLAYS',
    heading: 'Large Format Signage, Flags & Exhibition Displays Dubai',
    title: 'Signage & Exhibition Banner Printing Dubai | Indoor & Outdoor | ONPRINT',
    description:
      'Large format printing and exhibition signage in Dubai. High-impact pull-up banners, outdoor beach flags, foam boards, and acrylic wall displays.',
    keywords: 'signage printing dubai, exhibition banners dubai, beach flags dubai, acrylic wall signs uae',
  },
  'custom-apparel-printing': {
    eyebrow: 'CUSTOM APPAREL & UNIFORMS',
    heading: 'Custom Screen Printed & Embroidered Corporate Apparel Dubai',
    title: 'Custom Apparel & T-Shirt Screen Printing Dubai | Corporate Polos | ONPRINT',
    description:
      'Custom branded t-shirts, corporate polo uniforms, embroidered caps, and hoodies in Dubai with high-density screen printing and DTG precision.',
    keywords: 't shirt printing dubai, custom apparel dubai, corporate uniform printing uae, embroidered caps dubai',
  },
  'catalogs-booklets-printing': {
    eyebrow: 'CATALOGS & BOOKLETS DUBAI',
    heading: 'Multi-Page Catalogs, Booklets & Annual Reports Dubai',
    title: 'Catalogs & Corporate Booklets Printing Dubai | Saddle-Stitch & Perfect Bound | ONPRINT',
    description:
      'Executive multi-page booklet and catalog printing in Dubai. Saddle-stitched and perfect-bound company profiles, annual reports, and product lookbooks.',
    keywords: 'catalog printing dubai, booklet printing uae, annual report printing dubai, company profile printing',
  },
  'hospitality-event-printing': {
    eyebrow: 'HOSPITALITY & EVENT STATIONERY',
    heading: 'Spill-Resistant Menus, Invitations & Event Stationery Dubai',
    title: 'Hospitality & Event Stationery Printing Dubai | Menus & Invitations | ONPRINT',
    description:
      'Luxury hospitality and event print solutions in Dubai. Spill-resistant restaurant menus, luxury wedding invitations, and VIP event collaterals.',
    keywords: 'restaurant menu printing dubai, wedding invitation printing dubai, event stationery uae, hospitality printing dubai',
  },
  'promotional-drinkware-tech': {
    eyebrow: 'PROMOTIONAL DRINKWARE & TECH',
    heading: 'Custom Branded Tech Accessories & Drinkware Dubai',
    title: 'Promotional Drinkware & Branded Tech Dubai | USBs & Power Banks | ONPRINT',
    description:
      'Custom printed mugs, insulated stainless steel water bottles, branded USB flash drives, power banks, and desk mats for corporate promotional campaigns in Dubai.',
    keywords: 'promotional tech items uae, branded power banks dubai, custom usb flash drives dubai, corporate tech gifts',
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
      const isStickerParam = categoryParam === 'stickers-labels-printing' || categoryParam === 'stickers-printing-dubai'
      const matchCat =
        !categoryParam ||
        item.category?.slug === categoryParam ||
        item.category?._id === categoryParam ||
        String(item.category_id) === categoryParam ||
        String(item.category?.id) === categoryParam ||
        item.category?.name?.toLowerCase() === categoryParam.toLowerCase() ||
        (Array.isArray(item.categories) && item.categories.some((c) => c?.slug === categoryParam || c?._id === categoryParam || String(c?.id) === categoryParam)) ||
        (isStickerParam && (item.category?.slug === 'stickers-labels-printing' || item.category?.slug === 'stickers-printing-dubai'))

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
              key={c.id || c.slug || c._id}
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
          {loading && <LoadingState type="cards" columns={4} count={8} label="Loading ONPRINT catalog products…" />}
          {error && <EmptyState title="Unable to load product catalog" note="Please check your connection and refresh." />}

          {!loading && !error && filteredProducts.length === 0 && (
            <EmptyState
              title="No matching products found"
              note={searchQuery ? `No results for "${searchQuery}". Try a different keyword.` : 'Select a different category above.'}
              actionLabel={searchQuery ? 'Clear Search' : categoryParam ? 'View All Products' : undefined}
              onAction={searchQuery ? () => setSearchQuery('') : categoryParam ? () => handleCategoryChange('') : undefined}
            />
          )}

          {/* VIEW 1: Filtered / Single Category or Search Active */}
          {!loading && !error && (categoryParam || searchQuery) && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product._id || product.slug || product.id}
                  product={product}
                  index={idx}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}

          {/* VIEW 2: All Categories Editorial Grouped Layout */}
          {!loading && !error && !categoryParam && !searchQuery && (
            <div className="space-y-16">
              {groupedCategories.map((group, groupIdx) => (
                <section key={groupIdx} className="space-y-6">
                  {/* Editorial Category Header */}
                  <div className="flex items-end justify-between border-b border-black/10 pb-5">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D4AF65]">
                        {group.meta.eyebrow}
                      </span>
                      <h2 className="font-display mt-1 text-xl font-extrabold tracking-tight text-black sm:text-3xl">
                        {group.meta.heading}
                      </h2>
                    </div>
                  </div>

                  {/* Standard Responsive Product Grid */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
                    {group.items.map((product, idx) => (
                      <ProductCard
                        key={product._id || product.slug || product.id}
                        product={product}
                        index={idx}
                        onQuickView={setQuickViewProduct}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Conversion CTA Section at Bottom */}
        <Reveal>
          <div className="mt-20 rounded-3xl border border-primary bg-primary p-8 text-background shadow-xl sm:p-12 card-hover-lift hover-shimmer">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <span className="rounded-full bg-accent/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-accent">
                  Custom Press Orders
                </span>
                <h2 className="font-display mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl text-background">
                  Have a custom printing requirement in Dubai?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-background/80">
                  Let's create something extraordinary for your brand. From custom embossing and spot UV to bespoke printing formats, our press team is ready in Al Quoz, Dubai.
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
        </Reveal>
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
