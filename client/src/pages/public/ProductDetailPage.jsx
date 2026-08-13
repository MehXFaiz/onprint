import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import { getProductBySlug } from '../../services/products'

function OptionGroup({ label, options, selected, onSelect }) {
  if (!options?.length) return null
  return (
    <div>
      <p className="text-sm font-semibold text-primary">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onSelect(option)}
            className={`border px-4 py-2 text-sm font-medium transition-colors ${
              selected?.label === option.label
                ? 'border-accent bg-accent-soft text-accent-hover'
                : 'border-border text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {option.label}
            {option.priceModifier > 0 && <span className="ml-1.5 text-xs opacity-70">+${option.priceModifier}</span>}
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

  if (status === 'loading') return <LoadingState label="Loading product…" />
  if (status === 'error') {
    return (
      <Container className="py-24">
        <EmptyState title="Product not found" note="It may have been removed or renamed." />
        <div className="mt-6 text-center">
          <Link to="/products" className="text-sm font-semibold text-accent hover:text-accent-hover">
            ← Back to Products
          </Link>
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
    <div className="py-16 sm:py-20">
      <Container className="max-w-6xl">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-14 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="aspect-[4/3] overflow-hidden border border-border bg-accent-soft">
              {product.images?.[activeImage] && (
                <img src={product.images[activeImage]} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="mt-3 flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`aspect-square w-20 overflow-hidden border transition-colors ${
                      activeImage === index ? 'border-accent' : 'border-border hover:border-primary'
                    }`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details / configurator */}
          <div>
            {product.category?.name && (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{product.category.name}</p>
            )}
            <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 leading-relaxed text-secondary">{product.description || product.shortDescription}</p>

            <p className="font-display mt-8 text-2xl font-extrabold tabular-nums text-primary">
              {estimatedPrice != null ? `$${estimatedPrice.toFixed(2)}` : 'Request a Quote'}
            </p>
            {product.minimumQuantity > 1 && (
              <p className="mt-1 text-xs text-secondary">Minimum quantity: {product.minimumQuantity}</p>
            )}

            <div className="mt-8 space-y-7 border-t border-border pt-8">
              <div>
                <label htmlFor="quantity" className="text-sm font-semibold text-primary">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={product.minimumQuantity || 1}
                  step={product.minimumQuantity || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.minimumQuantity || 1, Number(e.target.value) || 0))}
                  className="mt-2 w-32 border border-border bg-surface px-3 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <OptionGroup label="Size" options={product.specifications?.sizes} selected={size} onSelect={setSize} />
              <OptionGroup
                label="Paper / Material"
                options={product.specifications?.materials}
                selected={material}
                onSelect={setMaterial}
              />
              <OptionGroup
                label="Finishing"
                options={product.specifications?.finishes}
                selected={finish}
                onSelect={setFinish}
              />

              <div>
                <label htmlFor="artwork" className="text-sm font-semibold text-primary">
                  Upload Artwork / Design
                </label>
                <input
                  id="artwork"
                  type="file"
                  accept="image/*,.pdf,.ai,.eps"
                  onChange={(e) => setArtworkFile(e.target.files?.[0] || null)}
                  className="mt-2 block w-full text-sm text-secondary file:mr-4 file:border file:border-border file:bg-surface file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:border-primary"
                />
                {artworkFile && <p className="mt-1 text-xs text-secondary">Selected: {artworkFile.name}</p>}
              </div>

              <div>
                <label htmlFor="notes" className="text-sm font-semibold text-primary">
                  Special Instructions
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything else we should know about this order?"
                  className="mt-2 w-full border border-border bg-surface px-3 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <Button onClick={handleRequestQuote} variant="accent" className="mt-10 w-full sm:w-auto">
              Request a Quote
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
