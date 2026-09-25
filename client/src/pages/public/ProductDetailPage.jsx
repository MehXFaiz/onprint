import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Sparkles, ShieldCheck, Truck, RotateCcw, HelpCircle, Compass, Image as ImageIcon, Layers, ZoomIn } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import ProductCard from '../../components/ProductCard'
import Product360Viewer from '../../components/Product360Viewer'
import { getProductBySlug, getProducts } from '../../services/products'
import { getProductImage, getProductCategoriesWithImages, getAllProductCategoryImages } from '../../assets/productImages'
import { trackViewProduct, trackGetQuoteClick, trackProductInquiry } from '../../utils/analytics'
import WhatsAppIcon from '../../components/WhatsAppIcon'

const CARD_FALLBACK_SIZES = [
  { label: 'EU Standard (85 × 55 mm)', priceModifier: 0 },
  { label: 'US Standard (90 × 50 mm)', priceModifier: 0 },
  { label: 'Square (65 × 65 mm)', priceModifier: 15 },
]

const CARD_FALLBACK_MATERIALS = [
  { label: '350 GSM Premium Silk Artboard', priceModifier: 0 },
  { label: '400 GSM Heavyweight Matte', priceModifier: 25 },
  { label: '450 GSM Velvet Soft-Touch', priceModifier: 50 },
  { label: '600 GSM Archival Italian Cotton', priceModifier: 95 },
]

const CARD_FALLBACK_FINISHES = [
  { label: 'Standard Matte Lamination', priceModifier: 0 },
  { label: '24K Hot Stamped Gold Foil', priceModifier: 75 },
  { label: 'Raised 3D Spot UV (Scodix)', priceModifier: 65 },
  { label: 'Blind Letterpress Debossing', priceModifier: 85 },
  { label: 'Gold Gilded / Painted Edges', priceModifier: 95 },
]

function OptionGroup({ label, options, selected, onSelect }) {
  if (!options?.length) return null
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-primary">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              selected?.label === option.label
                ? 'border-accent bg-accent-soft text-accent shadow-xs'
                : 'border-border bg-surface text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {option.label}
            {option.priceModifier > 0 && <span className="ml-1 text-[11px] opacity-70">+AED {option.priceModifier}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading')

  const [activeImage, setActiveImage] = useState(0)
  const [viewMode, setViewMode] = useState('360') // '360' | 'photo'
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState(null)
  const [material, setMaterial] = useState(null)
  const [finish, setFinish] = useState(null)
  const [notes, setNotes] = useState('')
  const [relatedProducts, setRelatedProducts] = useState([])
  const [activeCategoryTab, setActiveCategoryTab] = useState(0)
  const [categoryLightbox, setCategoryLightbox] = useState(null)

  const isCardOrPrint = useMemo(() => {
    if (!product) return false
    return /card|visiting|stationery|print|luxury|cotton|foil|uv|box|packaging|brochure|flyer/i.test(
      `${product.name || ''} ${product.slug || ''} ${product.category?.name || ''}`
    )
  }, [product])

  const resolvedSizes = useMemo(() => {
    if (product?.specifications?.sizes?.length) return product.specifications.sizes
    if (isCardOrPrint) return CARD_FALLBACK_SIZES
    return []
  }, [product, isCardOrPrint])

  const resolvedMaterials = useMemo(() => {
    if (product?.specifications?.materials?.length) return product.specifications.materials
    if (isCardOrPrint) return CARD_FALLBACK_MATERIALS
    return []
  }, [product, isCardOrPrint])

  const resolvedFinishes = useMemo(() => {
    if (product?.specifications?.finishes?.length) return product.specifications.finishes
    if (isCardOrPrint) return CARD_FALLBACK_FINISHES
    return []
  }, [product, isCardOrPrint])

  useEffect(() => {
    setStatus('loading')
    getProductBySlug(slug)
      .then((data) => {
        setProduct(data)
        setQuantity(data.minimumQuantity || 1)
        const isCard = /card|visiting|stationery|print|luxury|cotton|foil|uv|box|packaging|brochure|flyer/i.test(
          `${data.name || ''} ${data.slug || ''} ${data.category?.name || ''}`
        )
        const initSizes = data.specifications?.sizes?.length ? data.specifications.sizes : (isCard ? CARD_FALLBACK_SIZES : [])
        const initMaterials = data.specifications?.materials?.length ? data.specifications.materials : (isCard ? CARD_FALLBACK_MATERIALS : [])
        const initFinishes = data.specifications?.finishes?.length ? data.specifications.finishes : (isCard ? CARD_FALLBACK_FINISHES : [])

        setSize(initSizes[0] || null)
        setMaterial(initMaterials[0] || null)
        setFinish(initFinishes[0] || null)
        setActiveImage(0)
        setStatus('ready')

        trackViewProduct({
          product_name: data.name,
          product_id: data._id || data.slug,
          category_name: data.category?.name || 'General Printing',
        })

        // Fetch related products from same category or catalog for internal link architecture
        const catKey = data.category?.slug || data.category?._id || data.category?.id || data.category
        getProducts({ category: catKey || undefined, pageSize: 6 })
          .then((res) => {
            const list = res?.data || res || []
            const filtered = list.filter((p) => (p.slug || p._id) !== (data.slug || data._id)).slice(0, 3)
            setRelatedProducts(filtered)
          })
          .catch(() => {})
      })
      .catch(() => setStatus('error'))
  }, [slug])

  const estimatedPrice = useMemo(() => {
    if (!product || product.price == null) return null
    const modifiers = (size?.priceModifier || 0) + (material?.priceModifier || 0) + (finish?.priceModifier || 0)
    const unit = product.minimumQuantity || 1
    return Math.round((product.price + modifiers) * (quantity / unit) * 100) / 100
  }, [product, size, material, finish, quantity])

  const enrichedCategories = useMemo(() => getProductCategoriesWithImages(product), [product])
  const allCategoryImagesFlat = useMemo(() => getAllProductCategoryImages(product), [product])

  if (status === 'loading') {
    return (
      <Container className="py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[4/3] rounded-3xl bg-black/6" />
          <div className="space-y-4">
            <div className="h-4 w-1/4 rounded-full bg-black/6" />
            <div className="h-8 w-3/4 rounded-full bg-black/8" />
            <div className="h-4 w-full rounded-full bg-black/5" />
            <div className="h-4 w-2/3 rounded-full bg-black/5" />
            <div className="mt-8 h-12 w-1/2 rounded-xl bg-black/6" />
          </div>
        </div>
      </Container>
    )
  }
  if (status === 'error' || !product) {
    return (
      <Container className="py-24">
        <EmptyState title="Product not found" note="It may have been removed or catalog updated." />
        <div className="mt-6 text-center">
          <Button to="/products" variant="outline" icon={false}>
            ← Back to Products Catalog
          </Button>
        </div>
      </Container>
    )
  }

  function handleRequestQuote() {
    trackGetQuoteClick({
      source_page: 'product_detail',
      product_name: product.name,
      category_name: product.category?.name,
    })

    navigate('/get-a-quote', {
      state: {
        product: product.name,
        slug: product.slug,
        quantity,
        size: size?.label,
        material: material?.label,
        finish: finish?.label,
        notes,
        estimatedPrice,
      },
    })
  }

  const breadcrumbsList = [
    { name: 'Products', url: '/products' },
    ...(product.category ? [{ name: product.category.name, url: `/products?category=${product.category.slug || product.category._id}` }] : []),
    { name: product.name, url: `/products/${product.slug}` },
  ]

  const productFaqs = [
    {
      question: `What is the minimum order quantity for ${product.name}?`,
      answer: `The minimum order quantity for ${product.name} is ${product.minimumQuantity || 1} units. Bulk volume pricing is automatically applied on larger quantities.`
    },
    {
      question: `Can I customize the dimensions and finishes for ${product.name}?`,
      answer: 'Yes. We offer fully custom dimensions, paper weights, laminate coatings, spot UV varnish, and foil stamping tailored to your brand.'
    }
  ]

  return (
    <div className="py-16 sm:py-24">
      {/* Dynamic SEOHead & Product Schema */}
      <SEOHead
        title={product.seoTitle || `${product.name} Dubai | Custom Printing | ONPRINT`}
        description={product.seoDescription || product.description || product.shortDescription}
        keywords={product.seoKeywords || `${product.name.toLowerCase()} dubai, printing services dubai, custom printing uae`}
        canonicalPath={`/products/${product.slug}`}
        product={product}
        breadcrumbs={breadcrumbsList}
        faqList={productFaqs}
      />

      <Container className="max-w-6xl">
        <Breadcrumbs
          items={[
            { name: 'Products', path: '/products' },
            ...(product.category ? [{ name: product.category.name, path: `/products?category=${product.category.slug || product.category._id}` }] : []),
            { name: product.name },
          ]}
        />

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Gallery & 360 Viewer */}
          <div className="lg:col-span-6">
            {/* Mode Toggle Switch */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-1 rounded-xl border border-black/10 bg-white p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('360')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    viewMode === '360'
                      ? 'bg-[#A82F19] text-white shadow-xs'
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>360° Interactive View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('photo')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    viewMode === 'photo'
                      ? 'bg-[#A82F19] text-white shadow-xs'
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Static Photo</span>
                </button>
              </div>

              {product.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#A82F19] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </span>
              )}
            </div>

            {/* Viewer Stage */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
              {viewMode === '360' ? (
                <Product360Viewer
                  product={product}
                  autoSpin={true}
                  height="aspect-[4/3]"
                />
              ) : (
                <div className="aspect-[4/3] overflow-hidden bg-accent-soft/40">
                  <img
                    src={getProductImage(product)}
                    alt={product.imageAlt || `${product.name} printing Dubai`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {viewMode === 'photo' && product.images?.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`aspect-square w-20 overflow-hidden rounded-xl border transition-all cursor-pointer ${
                      activeImage === index ? 'border-accent shadow-xs scale-105' : 'border-border hover:border-primary'
                    }`}
                  >
                    <img
                      src={getProductImage(product)}
                      alt={`${product.name} angle ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quality & Delivery Assurance */}
            <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-border/80 bg-surface p-6 sm:grid-cols-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-secondary">
                <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
                <span>Prepress Proof Included</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-secondary">
                <Truck className="h-5 w-5 text-accent shrink-0" />
                <span>UAE Doorstep Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-secondary">
                <RotateCcw className="h-5 w-5 text-accent shrink-0" />
                <span>100% Quality Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Details & Configurator */}
          <div className="lg:col-span-6">
            {product.category?.name && (
              <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                {product.category.name}
              </span>
            )}
            <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              {product.seoHeading || product.name}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-base">
              {product.description || product.shortDescription}
            </p>

            {/* Base Price & MOQ */}
            <div className="mt-6 flex items-baseline gap-4 border-y border-border/60 py-4">
              <div>
                <span className="text-xs font-semibold text-secondary">Starting from</span>
                <p className="font-display text-2xl font-black text-primary">
                  AED {product.price ? product.price.toFixed(2) : '50.00'}
                </p>
              </div>
              <div className="border-l border-border/60 pl-4">
                <span className="text-xs font-semibold text-secondary">Minimum Order</span>
                <p className="text-sm font-bold text-primary">{product.minimumQuantity || 1} Units</p>
              </div>
            </div>

            {/* Specification Option Selectors */}
            <div className="mt-6 space-y-6">
              {resolvedSizes.length > 0 && (
                <OptionGroup
                  label="Available Sizes / Dimensions"
                  options={resolvedSizes}
                  selected={size}
                  onSelect={setSize}
                />
              )}
              {resolvedMaterials.length > 0 && (
                <OptionGroup
                  label="Paper & Material Stocks"
                  options={resolvedMaterials}
                  selected={material}
                  onSelect={setMaterial}
                />
              )}
              {resolvedFinishes.length > 0 && (
                <OptionGroup
                  label="Specialty Coatings & Finishes"
                  options={resolvedFinishes}
                  selected={finish}
                  onSelect={setFinish}
                />
              )}

              {/* Quantity Input */}
              <div>
                <label htmlFor="quantity" className="block text-xs font-bold uppercase tracking-wider text-primary">
                  Quantity (Units)
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={product.minimumQuantity || 1}
                  step={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.minimumQuantity || 1, parseInt(e.target.value, 10) || 1))}
                  className="mt-2 w-32 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>

              {/* Special Instructions */}
              <div>
                <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-primary">
                  Custom Notes / Pantone Codes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention custom colors, embossing requirements, or deadline urgency…"
                  className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              {/* High-Converting Multi-Channel Conversion CTAs */}
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <Button onClick={handleRequestQuote} variant="accent" size="lg" className="w-full justify-center sm:w-auto">
                  Request Official Quote
                </Button>
                <Button
                  to="/contact"
                  variant="secondary"
                  size="lg"
                  className="w-full justify-center sm:w-auto"
                  onClick={() => trackProductInquiry({
                    source_page: 'product_detail',
                    product_name: product.name,
                  })}
                >
                  Inquire Custom Specs
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Gallery Showcase */}
        {enrichedCategories.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-2">
              <Layers className="h-4 w-4" />
              <span>Category Applications &amp; Contexts</span>
            </div>
            <h2 className="font-display text-2xl font-black tracking-tight text-primary mb-2">
              Available in {enrichedCategories.length} Print Categories
            </h2>
            <p className="text-sm text-secondary mb-8 max-w-2xl">
              Explore how {product.name} is crafted and applied across different print disciplines, each captured in three dedicated views — hero presentation, close-up finish detail, and real-world office usage.
            </p>

            {/* Category Tab Switcher */}
            <div className="flex flex-wrap gap-2 mb-8">
              {enrichedCategories.map((cat, idx) => (
                <button
                  key={cat.slug || idx}
                  type="button"
                  onClick={() => { setActiveCategoryTab(idx); setCategoryLightbox(null) }}
                  className={`rounded-xl border px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategoryTab === idx
                      ? 'border-[#A82F19] bg-[#A82F19] text-white shadow-xs'
                      : 'border-border bg-surface text-secondary hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat.name}
                  {cat.images?.length > 0 && (
                    <span className={`ml-2 inline-flex items-center justify-center h-4 min-w-[1rem] rounded-full px-1 text-[10px] ${
                      activeCategoryTab === idx ? 'bg-white/20' : 'bg-black/5'
                    }`}>
                      {cat.images.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Active Category Image Grid */}
            {enrichedCategories[activeCategoryTab] && (
              <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-primary">
                      {enrichedCategories[activeCategoryTab]?.name}
                    </h3>
                    <p className="text-xs text-secondary mt-1">
                      {['Hero Front Presentation', 'Macro Finish &amp; Texture Detail', 'Lifestyle Office Usage'][0]} — {['Hero Front Presentation', 'Macro Finish &amp; Texture Detail', 'Lifestyle Office Usage'][1]} — {['Hero Front Presentation', 'Macro Finish &amp; Texture Detail', 'Lifestyle Office Usage'][2]}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {['Hero Shot', 'Detail Close-up', 'Lifestyle Usage'].map((label, imgIdx) => {
                    const cat = enrichedCategories[activeCategoryTab]
                    const imgUrl = cat?.images?.[imgIdx]
                    if (!imgUrl) return null
                    return (
                      <button
                        key={imgIdx}
                        type="button"
                        onClick={() => setCategoryLightbox({ cat, imgIdx, label })}
                        className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-accent-soft/30 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                      >
                        <img
                          src={imgUrl}
                          alt={`${product.name} — ${cat.name} — ${label}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/80">{label}</p>
                            <p className="text-xs font-bold text-white mt-0.5">{cat.name}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#A82F19] shadow-xs">
                            <ZoomIn className="h-3 w-3" />
                            View
                          </span>
                        </div>
                        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-[#A82F19]/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                          {imgIdx === 0 ? '01 / Hero' : imgIdx === 1 ? '02 / Detail' : '03 / Usage'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Category Image Lightbox */}
        {categoryLightbox && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-8 backdrop-blur-sm"
            onClick={() => setCategoryLightbox(null)}
          >
            <div
              className="relative w-full max-w-5xl rounded-3xl bg-surface p-4 sm:p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setCategoryLightbox(null)}
                className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#A82F19] text-white shadow-lg hover:bg-[#8a2715] transition-colors cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-accent-soft/30">
                    <img
                      src={categoryLightbox.cat?.images?.[categoryLightbox.imgIdx]}
                      alt={`${product.name} — ${categoryLightbox.cat?.name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-accent">
                    {categoryLightbox.label}
                  </p>
                  <h3 className="font-display text-2xl font-black text-primary mt-2">
                    {categoryLightbox.cat?.name}
                  </h3>
                  <p className="text-sm text-secondary mt-4 leading-relaxed">
                    {categoryLightbox.imgIdx === 0 && `Hero studio presentation of ${product.name} crafted for the ${categoryLightbox.cat?.name} division. Shot eye-level on a clean seamless backdrop with premium soft-box studio lighting to showcase print quality and material finish.`}
                    {categoryLightbox.imgIdx === 1 && `Macro close-up detail revealing the texture, coating, and ink fidelity of ${product.name} within the ${categoryLightbox.cat?.name} line. Every fibre, laminate surface, and emboss is rendered in crisp 4K detail for print quality inspection.`}
                    {categoryLightbox.imgIdx === 2 && `Lifestyle composition capturing ${product.name} in a modern Dubai corporate office. Natural window light illuminates how the finished piece performs in real-world brand presentation and client-facing scenarios.`}
                  </p>
                  <div className="mt-8 flex gap-3">
                    {categoryLightbox.cat?.images?.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCategoryLightbox({ ...categoryLightbox, imgIdx: i })}
                        className={`aspect-square w-16 overflow-hidden rounded-xl border transition-all cursor-pointer ${
                          categoryLightbox.imgIdx === i
                            ? 'border-[#A82F19] ring-2 ring-[#A82F19]/30 scale-105'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        <img
                          src={categoryLightbox.cat?.images?.[i]}
                          alt={`Thumbnail ${i + 1}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product FAQs */}
        <div className="mt-16 rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-4">
            <HelpCircle className="h-4 w-4" />
            <span>Product Questions &amp; Specifications</span>
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-primary">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-6 divide-y divide-border/60">
            {productFaqs.map((faq, index) => (
              <div key={index} className={index > 0 ? 'pt-6' : ''}>
                <h3 className="font-display text-base font-bold text-primary">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Printing Products & Internal Links */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Related Print Disciplines</span>
                <h2 className="font-display mt-1 text-2xl font-black tracking-tight text-primary">
                  Complementary Printing Solutions
                </h2>
              </div>
              {product.category?.slug && (
                <Link
                  to={`/categories/${product.category.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent hover:underline"
                >
                  <span>Explore all {product.category.name}</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relProd) => (
                <ProductCard key={relProd._id || relProd.slug} product={relProd} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
