import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowUpRight, Sparkles, Eye, Check, Tag } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { getProductImage } from '../assets/productImages'

export default function ProductCard({
  product,
  featured = false,
  variant = 'glass',
  onQuickView,
}) {
  const [isMockupActive, setIsMockupActive] = useState(false)
  const [mockupTilt, setMockupTilt] = useState({ x: 0, y: 0 })

  if (!product) return null

  const isFeatured = featured || product.featured
  const productImage = getProductImage(product)
  const [currentImg, setCurrentImg] = useState(productImage)

  // Keep state in sync with props/product resolution
  useEffect(() => {
    setCurrentImg(productImage)
  }, [productImage, product?.slug, product?.image])

  const categoryName =
    typeof product.category === 'object'
      ? product.category?.name
      : product.category || ''

  const handleQuickView = (e) => {
    if (onQuickView) {
      e.preventDefault()
      e.stopPropagation()
      onQuickView(product)
    }
  }

  const deriveFeatures = () => {
    if (Array.isArray(product.features) && product.features.length > 0) {
      return product.features.slice(0, 3)
    }
    const list = []
    if (product.minimumQuantity) {
      list.push(`Min. Order: ${product.minimumQuantity} units`)
    }
    if (product.specifications?.materials?.[0]?.label) {
      list.push(product.specifications.materials[0].label)
    } else {
      list.push('High-Precision Custom Print')
    }
    if (product.specifications?.finishes?.[0]?.label) {
      list.push(product.specifications.finishes[0].label)
    } else {
      list.push('Bespoke Corporate Finishing')
    }
    return list.slice(0, 3)
  }

  const featuresList = deriveFeatures()
  const handleMockupMove = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    setMockupTilt({ x: y * -6, y: x * 8 })
  }

  const resetMockup = () => {
    setIsMockupActive(false)
    setMockupTilt({ x: 0, y: 0 })
  }

  return (
    <div className="group relative flex flex-col h-full w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#A82F19]/50 hover:shadow-lg hover:z-10">
      {/* Product Image Stage */}
      <div
        className="product-mockup-stage group/mockup relative w-full aspect-[4/3] shrink-0 overflow-hidden bg-slate-50 flex items-center justify-center border-b border-slate-100"
        onPointerEnter={() => setIsMockupActive(true)}
        onPointerMove={handleMockupMove}
        onPointerLeave={resetMockup}
      >
        {productImage ? (
          <div
            className="product-mockup-object absolute inset-[10%] flex items-center justify-center"
            style={{
              transform: `perspective(900px) rotateX(${mockupTilt.x}deg) rotateY(${mockupTilt.y}deg)`,
            }}
          >
            <div className="product-mockup-shadow absolute inset-[8%] rounded-[1.25rem] bg-slate-900/10 blur-lg" />
            <div className="product-mockup-face relative h-full w-full overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-white shadow-md">
              <img
                src={currentImg || productImage}
                alt={product.imageAlt || product.name}
                loading="lazy"
                decoding="async"
                onError={() => {
                  if (currentImg !== productImage) {
                    setCurrentImg(productImage)
                  }
                }}
                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400">
            ONPRINT PRESS
          </div>
        )}

        <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full border border-slate-200 bg-white/90 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600 shadow-xs backdrop-blur-xs">
          {isMockupActive ? '3D Active' : 'Hover 3D'}
        </div>

        {/* Top-left badge */}
        {isFeatured && (
          <div className="absolute left-3 top-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#A82F19] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          </div>
        )}

        {/* Price badge */}
        {product.price && Number(product.price) > 0 && (
          <div className="absolute right-3 top-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              <Tag className="h-3 w-3 text-amber-400" />
              AED {product.price}+
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4.5 min-w-0">
        <div className="min-w-0 space-y-1.5">
          {categoryName ? (
            <div>
              <span className="inline-block rounded-full bg-[#A82F19]/10 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#A82F19] truncate max-w-full">
                {categoryName}
              </span>
            </div>
          ) : null}

          {/* Product name */}
          <h3 className="font-display text-sm sm:text-base font-bold leading-snug tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-[#A82F19] line-clamp-1 break-words">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs leading-relaxed text-slate-500 line-clamp-2 break-words">
            {product.shortDescription || product.description}
          </p>

          {/* Features */}
          {featuresList.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-1 min-w-0">
              {featuresList.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] font-medium text-slate-600 min-w-0">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A82F19]" />
                  <span className="line-clamp-1 break-words min-w-0">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center gap-1.5">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#A82F19] hover:bg-[#8F2412] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-all duration-200 shadow-xs cursor-pointer"
          >
            <span>Explore</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          <a
            href={`https://wa.me/447344546056?text=${encodeURIComponent(
              `Hello ONPRINT Dubai, I would like to inquire about "${product.name}"${product.price ? ` (from AED ${product.price})` : ''}. Please confirm turnaround and pricing.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Inquire about ${product.name} on WhatsApp`}
            className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-emerald-600 transition-all hover:border-emerald-500 hover:bg-[#25D366] hover:text-white active:scale-95 cursor-pointer"
          >
            <WhatsAppIcon className="h-4 w-4 fill-current" />
          </a>

          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickView}
              aria-label={`Quick View ${product.name}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 transition-all hover:border-[#A82F19] hover:bg-[#A82F19] hover:text-white active:scale-95 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
