import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import { getProductBySlug } from '../../services/products'

function OptionGroup({ label, options, selected, onSelect }) {
  if (!options?.length) return null
  return (
    <div>
      <p className="text-sm font-medium text-ink-900">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
              selected?.label === option.label
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-gray-300 text-ink-700 hover:border-brand-600'
            }`}
          >
            {option.label}
            {option.priceModifier > 0 && <span className="ml-1 text-xs text-ink-500">+${option.priceModifier}</span>}
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
      <div className="mx-auto max-w-3xl px-6 py-16">
        <EmptyState title="Product not found" note="It may have been removed or renamed." />
        <div className="mt-6 text-center">
          <Link to="/products" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            ← Back to Products
          </Link>
        </div>
      </div>
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
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link to="/products" className="text-sm font-medium text-brand-600 hover:text-brand-700">
        ← Back to Products
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
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
                  className={`aspect-square w-20 overflow-hidden rounded-lg border-2 ${
                    activeImage === index ? 'border-brand-600' : 'border-transparent'
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
            <p className="text-sm font-medium uppercase tracking-wide text-brand-600">{product.category.name}</p>
          )}
          <h1 className="mt-2 text-3xl font-bold text-ink-900">{product.name}</h1>
          <p className="mt-4 text-ink-500">{product.description || product.shortDescription}</p>

          <p className="mt-6 text-2xl font-bold text-ink-900">
            {estimatedPrice != null ? `$${estimatedPrice.toFixed(2)}` : 'Request a Quote'}
          </p>
          <p className="mt-1 text-xs text-ink-500">
            {product.minimumQuantity > 1 ? `Minimum quantity: ${product.minimumQuantity}` : null}
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label htmlFor="quantity" className="text-sm font-medium text-ink-900">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min={product.minimumQuantity || 1}
                step={product.minimumQuantity || 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.minimumQuantity || 1, Number(e.target.value) || 0))}
                className="mt-2 w-32 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
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
              <label htmlFor="artwork" className="text-sm font-medium text-ink-900">
                Upload Artwork / Design
              </label>
              <input
                id="artwork"
                type="file"
                accept="image/*,.pdf,.ai,.eps"
                onChange={(e) => setArtworkFile(e.target.files?.[0] || null)}
                className="mt-2 block w-full text-sm text-ink-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink-700 hover:file:bg-gray-200"
              />
              {artworkFile && <p className="mt-1 text-xs text-ink-500">Selected: {artworkFile.name}</p>}
            </div>

            <div>
              <label htmlFor="notes" className="text-sm font-medium text-ink-900">
                Special Instructions
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything else we should know about this order?"
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleRequestQuote}
            className="mt-8 w-full rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 sm:w-auto"
          >
            Request a Quote
          </button>
        </div>
      </div>
    </div>
  )
}
