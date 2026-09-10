import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowUpRight, Sparkles, Eye, Check, Tag } from 'lucide-react'
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

  // Derive 2–3 key features dynamically
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
    setMockupTilt({ x: y * -7, y: x * 9 })
  }

  const resetMockup = () => {
    setIsMockupActive(false)
    setMockupTilt({ x: 0, y: 0 })
  }

  return (
    <div className="group relative flex flex-col h-full w-full min-w-0 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#A82F19]/60 hover:shadow-lg hover:z-10">
      {/* Product Image */}
      <div
        className="product-mockup-stage group/mockup relative w-full aspect-[4/3] shrink-0 overflow-hidden bg-[#f5f3ef] flex items-center justify-center"
        onPointerEnter={() => setIsMockupActive(true)}
        onPointerMove={handleMockupMove}
        onPointerLeave={resetMockup}
      >
        {productImage ? (
          <div
            className="product-mockup-object absolute inset-[12%] flex items-center justify-center"
            style={{
              transform: `perspective(900px) rotateX(${mockupTilt.x}deg) rotateY(${mockupTilt.y}deg)`,
            }}
          >
            <div className="product-mockup-shadow absolute inset-[8%] rounded-[1.25rem] bg-black/20 blur-xl" />
            <div className="product-mockup-face relative h-full w-full overflow-hidden rounded-[1.25rem] border border-white/80 bg-white shadow-[12px_16px_28px_rgba(0,0,0,0.2)]">
              <img
                src={productImage}
                alt={product.imageAlt || product.name}
                loading="lazy"
                className="h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-black/10" />
            </div>
            <div className="product-mockup-edge absolute right-[-3%] top-[6%] h-[88%] w-[5%] rounded-r-lg bg-[#d8d2ca]" />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black/5 text-[11px] font-black uppercase tracking-widest text-black/30">
            ONPRINT PRESS
          </div>
        )}

        <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full border border-white/60 bg-white/85 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.16em] text-black/65 shadow-sm backdrop-blur-md transition-all duration-300 group-hover/mockup:-translate-y-1 group-hover/mockup:bg-white">
          {isMockupActive ? '3D preview' : 'Hover to preview'}
        </div>

        {/* Dark overlay on hover */}
<div className="pointer-events-none absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/[0.03]" />

        {/* Top-left badges */}
        {isFeatured && (
          <div className="absolute left-3 top-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#A82F19] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-sm">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          </div>
        )}

        {/* Price badge — top-right */}
        {product.price && Number(product.price) > 0 && (
          <div className="absolute right-3 top-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-lg bg-black/85 px-2.5 py-1 text-[11px] font-extrabold tracking-wider text-white backdrop-blur-sm shadow-xs">
              <Tag className="h-3 w-3 text-[#A82F19]" />
              AED {product.price}+
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 min-w-0">
        <div className="min-w-0 space-y-2">
          {/* Category pill */}
          {categoryName ? (
            <div>
              <span className="inline-block rounded-full border border-[#A82F19]/20 bg-[#A82F19]/8 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#A82F19] truncate max-w-full">
                {categoryName}
              </span>
            </div>
          ) : null}

          {/* Product name */}
          <h3 className="font-display text-base font-black leading-snug tracking-tight text-black transition-colors duration-200 group-hover:text-[#A82F19] line-clamp-2 break-words">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs leading-relaxed text-black/60 line-clamp-2 break-words">
            {product.shortDescription || product.description}
          </p>

          {/* Features */}
          {featuresList.length > 0 && (
            <div className="pt-2.5 border-t border-black/8 space-y-1.5 min-w-0">
              <span className="block text-[9px] font-extrabold uppercase tracking-wider text-black/40">
                Key Features
              </span>
              {featuresList.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] font-medium text-black/75 min-w-0">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A82F19]" />
                  <span className="line-clamp-1 break-words min-w-0">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action CTA Bar — pinned to bottom via mt-auto */}
        <div className="mt-auto pt-4 border-t border-black/8 flex items-center gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#A82F19] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-white transition-all duration-200 hover:bg-black active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>Explore</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickView}
              aria-label={`Quick View ${product.name}`}
              className="inline-flex items-center justify-center rounded-xl border border-black/15 bg-white p-2.5 text-black transition-all hover:border-[#A82F19] hover:bg-[#A82F19] hover:text-white active:scale-95 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom red accent line */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#A82F19] transition-all duration-300 ease-out group-hover:w-full pointer-events-none" />
    </div>
  )
}
