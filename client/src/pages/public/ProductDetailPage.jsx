import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Upload, Sparkles } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import { getProductBySlug } from '../../services/products'

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
            className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
              selected?.label === option.label
                ? 'border-accent bg-accent-soft text-accent shadow-xs'
                : 'border-border bg-surface text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {option.label}
            {option.priceModifier > 0 && <span className="ml-1 text-[11px] opacity-70">+${option.priceModifier}</span>}
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
  const [artworkFile, setArtworkFile] = useState(null)
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
  if (status === 'error') {
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
    navigate('/get-a-quote', {
      state: {
        product: product.name,
        slug: product.slug,
        quantity,
        size: size?.label,
        material: material?.label,
        finish: finish?.label,
        notes,
        artworkFileName: artworkFile?.name,
        estimatedPrice,
      },
    })
  }

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-6xl">
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
                {product.images?.[activeImage] ? (
                  <img src={product.images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center p-8 text-center">
                    <Sparkles className="h-12 w-12 text-accent" />
                  </div>
                )}
              </div>
            </div>
            {product.images?.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`aspect-square w-20 overflow-hidden rounded-xl border transition-all ${
                      activeImage === index ? 'border-accent shadow-xs scale-105' : 'border-border hover:border-primary'
                    }`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Configurator */}
          <div className="lg:col-span-6">
            {product.category?.name && (
              <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                {product.category.name}
              </span>
            )}
            <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-base">
              {product.description || product.shortDescription}
            </p>

            <div className="mt-6 flex items-baseline gap-3 rounded-xl bg-surface p-4 border border-border">
              <span className="font-display text-3xl font-extrabold tabular-nums text-primary">
                {estimatedPrice != null ? `$${estimatedPrice.toFixed(2)}` : 'Request Quote'}
              </span>
              {product.minimumQuantity > 1 && (
                <span className="text-xs font-semibold text-secondary">
                  (Min Order: {product.minimumQuantity} units)
                </span>
              )}
            </div>

            <div className="mt-8 space-y-6 border-t border-border pt-8">
              <div>
                <label htmlFor="quantity" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Select Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={product.minimumQuantity || 1}
                  step={product.minimumQuantity || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.minimumQuantity || 1, Number(e.target.value) || 0))}
                  className="mt-2 w-36 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <OptionGroup label="Select Size" options={product.specifications?.sizes} selected={size} onSelect={setSize} />
              <OptionGroup
                label="Paper / Material Stock"
                options={product.specifications?.materials}
                selected={material}
                onSelect={setMaterial}
              />
              <OptionGroup
                label="Finishing & Lamination"
                options={product.specifications?.finishes}
                selected={finish}
                onSelect={setFinish}
              />

              <div>
                <label htmlFor="artwork" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Attach Artwork File (Optional)
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <label
                    htmlFor="artwork"
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-primary transition-colors hover:border-primary"
                  >
                    <Upload className="h-4 w-4 text-accent" />
                    <span>Choose File</span>
                  </label>
                  <input
                    id="artwork"
                    type="file"
                    accept="image/*,.pdf,.ai,.eps"
                    onChange={(e) => setArtworkFile(e.target.files?.[0] || null)}
                    className="sr-only"
                  />
                  <span className="text-xs text-secondary truncate">
                    {artworkFile ? artworkFile.name : 'PDF, AI, EPS or high-res images'}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Special Customization Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention Pantone codes, embossing requirements, or deadline constraints…"
                  className="mt-2 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <Button onClick={handleRequestQuote} variant="accent" size="lg" className="mt-8 w-full justify-center">
              Request Official Quote for {product.name}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

