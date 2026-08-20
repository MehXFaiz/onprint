import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Sparkles, ShieldCheck, Truck, RotateCcw, HelpCircle } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import { getProductBySlug } from '../../services/products'
import { getProductImage } from '../../assets/productImages'
import { trackViewProduct, trackGetQuoteClick, trackProductInquiry } from '../../utils/analytics'

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
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState(null)
  const [material, setMaterial] = useState(null)
  const [finish, setFinish] = useState(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    setStatus('loading')
    getProductBySlug(slug)
      .then((data) => {
        setProduct(data)
        setQuantity(data.minimumQuantity || 1)
        setSize(data.specifications?.sizes?.[0] || null)
        setMaterial(data.specifications?.materials?.[0] || null)
        setFinish(data.specifications?.finishes?.[0] || null)
        setActiveImage(0)
        setStatus('ready')

        trackViewProduct({
          product_name: data.name,
          product_id: data._id || data.slug,
          category_name: data.category?.name || 'General Printing',
        })
      })
      .catch(() => setStatus('error'))
  }, [slug])

  const estimatedPrice = useMemo(() => {
    if (!product || product.price == null) return null
    const modifiers = (size?.priceModifier || 0) + (material?.priceModifier || 0) + (finish?.priceModifier || 0)
    const unit = product.minimumQuantity || 1
    return Math.round((product.price + modifiers) * (quantity / unit) * 100) / 100
  }, [product, size, material, finish, quantity])

  if (status === 'loading') return <LoadingState label="Loading product specifications…" />
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
          {/* Gallery */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
              <div className="aspect-[4/3] overflow-hidden bg-accent-soft/40">
                <img
                  src={getProductImage(product)}
                  alt={product.imageAlt || `${product.name} printing Dubai`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            {product.images?.length > 1 && (
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
              {product.specifications?.sizes && (
                <OptionGroup
                  label="Available Sizes / Dimensions"
                  options={product.specifications.sizes}
                  selected={size}
                  onSelect={setSize}
                />
              )}
              {product.specifications?.materials && (
                <OptionGroup
                  label="Paper & Material Stocks"
                  options={product.specifications.materials}
                  selected={material}
                  onSelect={setMaterial}
                />
              )}
              {product.specifications?.finishes && (
                <OptionGroup
                  label="Specialty Coatings & Finishes"
                  options={product.specifications.finishes}
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

              {/* Quote CTA */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button onClick={handleRequestQuote} variant="accent" size="lg" className="w-full justify-center sm:w-auto">
                  Request Quote for {product.name}
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
      </Container>
    </div>
  )
}
