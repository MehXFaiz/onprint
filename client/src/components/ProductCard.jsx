import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles, Eye, Check, Tag, Clock } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { getProductImage } from '../assets/productImages'
import { getServiceWhatsAppUrl } from '../utils/whatsapp'
import { trackWhatsAppClick } from '../utils/analytics'

export default function ProductCard({
  product,
  featured = false,
  variant: _variant = 'glass',
  onQuickView,
  index = 0,
  className = '',
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const rafRef = useRef(null)

  const productImage = product ? getProductImage(product) : ''
  const [currentImg, setCurrentImg] = useState(productImage)

  // Keep state in sync with props/product resolution
  useEffect(() => {
    if (product) {
      setCurrentImg(productImage)
    }
  }, [productImage, product])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (!product) return null

  const isFeatured = featured || product.featured

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
      list.push(`Min. ${product.minimumQuantity} units`)
    }
    if (product.specifications?.materials?.[0]?.label) {
      list.push(product.specifications.materials[0].label)
    } else {
      list.push('High-Precision Offset/Digital')
    }
    if (product.specifications?.finishes?.[0]?.label) {
      list.push(product.specifications.finishes[0].label)
    } else {
      list.push('Bespoke Luxury Finishing')
    }
    return list.slice(0, 3)
  }

  const featuresList = deriveFeatures()

  const handleMouseMove = (event) => {
    if (event.pointerType !== 'mouse') return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const currentTarget = event.currentTarget
    const clientX = event.clientX
    const clientY = event.clientY

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const bounds = currentTarget.getBoundingClientRect()
      const x = ((clientX - bounds.left) / bounds.width - 0.5) * 2
      const y = ((clientY - bounds.top) / bounds.height - 0.5) * 2
      setTilt({ x: y * -5, y: x * 6 })
    })
  }

  const resetMouse = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  const resolvedSrc = currentImg || productImage
  const webpSrc =
    typeof resolvedSrc === 'string' && (resolvedSrc.endsWith('.jpg') || resolvedSrc.endsWith('.png'))
      ? resolvedSrc.replace(/\.(jpg|png)$/, '.webp')
      : null

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.45,
        delay: Math.min((index % 6) * 0.07, 0.35),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
      className={`group relative flex flex-col h-full w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-[#A82F19]/40 hover:shadow-[0_20px_35px_-8px_rgba(168,47,25,0.13),0_10px_20px_-6px_rgba(15,23,42,0.05)] ${className}`}
    >
      {/* Product Image Studio Stage */}
      <div
        className="relative w-full aspect-[4/3] shrink-0 overflow-hidden bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/70 border-b border-slate-100 flex items-center justify-center select-none"
        onPointerEnter={() => setIsHovered(true)}
        onPointerMove={handleMouseMove}
        onPointerLeave={resetMouse}
      >
        {/* Fine Dot Matrix Texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#0F172A 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Ambient Top Spotlight Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.9),transparent_70%)] pointer-events-none" />

        {/* Framed 3D Tilt Image Stage */}
        <div
          className="relative h-full w-full p-2.5 sm:p-3 flex items-center justify-center will-change-transform"
          style={{
            transform: isHovered && !prefersReducedMotion
              ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.025, 1.025, 1.025)`
              : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {productImage ? (
            <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-shadow duration-500">
              <picture>
                {webpSrc && <source type="image/webp" srcSet={webpSrc} />}
                <img
                  src={resolvedSrc}
                  alt={product.imageAlt || product.name}
                  width="380"
                  height="285"
                  loading="lazy"
                  decoding="async"
                  onError={() => {
                    if (currentImg !== productImage) {
                      setCurrentImg(productImage)
                    }
                  }}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />
              </picture>

              {/* Bottom Contrast Vignette on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Luxury Anamorphic Foil / Gloss Light Sheen on Hover */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -translate-x-[160%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-25deg] pointer-events-none z-10"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400">
              ONPRINT PRESS
            </div>
          )}
        </div>

        {/* Top-Left Floating Badge Group */}
        <div className="absolute left-3 top-3 z-20 pointer-events-none flex flex-wrap items-center gap-1.5">
          {isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#A82F19] to-[#C93B1E] px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-white shadow-md ring-1 ring-white/20 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
              Featured
            </span>
          ) : product.minimumQuantity ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[9.5px] font-bold text-slate-700 shadow-xs border border-slate-200/80 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Min {product.minimumQuantity} pcs
            </span>
          ) : null}
        </div>

        {/* Top-Right Price / Service Badge */}
        <div className="absolute right-3 top-3 z-20 pointer-events-none">
          {product.price && Number(product.price) > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/90 px-2.5 py-0.5 text-[10.5px] font-bold text-white shadow-md border border-white/10 backdrop-blur-md">
              <Tag className="h-3 w-3 text-amber-400" />
              <span>AED {product.price}</span>
              <span className="text-[9px] font-normal text-slate-300">+</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/85 px-2.5 py-0.5 text-[9.5px] font-bold text-slate-200 shadow-xs border border-white/10 backdrop-blur-md">
              <Clock className="h-3 w-3 text-amber-400" />
              <span>24h Express</span>
            </span>
          )}
        </div>

        {/* Interactive Floating Quick-Actions Overlay (Revealed on Image Hover) */}
        <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 px-2.5 py-1 text-[9px] font-semibold tracking-wider text-slate-200 backdrop-blur-md border border-white/10 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            {isHovered ? '3D Active' : 'Hover 3D'}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {onQuickView && (
              <button
                type="button"
                onClick={handleQuickView}
                aria-label={`Quick View ${product.name}`}
                title="Quick View Modal"
                className="inline-flex items-center gap-1 rounded-full bg-white/95 hover:bg-[#A82F19] text-slate-800 hover:text-white px-2.5 py-1 text-[11px] font-bold shadow-md backdrop-blur-md transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            )}

            <a
              href={getServiceWhatsAppUrl(
                product.category?.slug || product.slug,
                {
                  productName: product.name,
                  price: product.price || undefined,
                }
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackWhatsAppClick({
                  source_page: typeof window !== 'undefined' ? window.location.pathname : 'product_card',
                  service_name: product.category?.name || product.category?.slug || product.name,
                  button_location: 'product_card_overlay',
                  product_id: product.slug || product._id,
                  label: `card_quick_wa_${product.slug || product.name}`,
                })
              }}
              aria-label={`WhatsApp chat for ${product.name}`}
              title="Instant WhatsApp Quote"
              className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 fill-current" />
            </a>
          </div>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 min-w-0">
        <div className="min-w-0 space-y-1.5">
          {categoryName ? (
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#A82F19] truncate max-w-full">
                <span className="h-1 w-1 rounded-full bg-[#A82F19]" />
                {categoryName}
              </span>
              <span className="text-[10px] font-medium text-slate-400 shrink-0">Dubai Press</span>
            </div>
          ) : null}

          {/* Product Name */}
          <h3 className="font-display text-sm sm:text-base font-bold leading-snug tracking-tight text-slate-900 group-hover:text-[#A82F19] transition-colors duration-200 line-clamp-1 break-words">
            <Link to={`/products/${product.slug}`} className="hover:underline focus:outline-none">
              {product.name}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs leading-relaxed text-slate-500 line-clamp-2 break-words">
            {product.shortDescription || product.description || `High-precision custom commercial printing for ${product.name} in Dubai.`}
          </p>

          {/* Specifications Chips */}
          {featuresList.length > 0 && (
            <div className="pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5 min-w-0">
              {featuresList.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-50 border border-slate-200/70 px-2 py-0.5 text-[10.5px] font-medium text-slate-600 transition-colors group-hover:bg-[#A82F19]/5 group-hover:border-[#A82F19]/20 group-hover:text-[#A82F19] min-w-0"
                >
                  <Check className="h-3 w-3 text-[#A82F19] shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">{feat}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="group/btn flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-[#A82F19] px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer active:scale-[0.98]"
          >
            <span>Explore</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>

          <a
            href={getServiceWhatsAppUrl(
              product.category?.slug || product.slug,
              {
                productName: product.name,
                price: product.price || undefined,
              }
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackWhatsAppClick({
                source_page: typeof window !== 'undefined' ? window.location.pathname : 'product_card',
                service_name: product.category?.name || product.category?.slug || product.name,
                button_location: 'product_card_footer',
                product_id: product.slug || product._id,
                label: `card_inquiry_${product.slug || product.name}`,
              })
            }}
            aria-label={`Inquire about ${product.name} on WhatsApp`}
            title={`Get Quote for ${product.name} on WhatsApp`}
            className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-emerald-200 bg-emerald-50/90 text-emerald-600 transition-all duration-200 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white active:scale-95 cursor-pointer shadow-xs"
          >
            <WhatsAppIcon className="h-4 w-4 fill-current" />
          </a>

          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickView}
              aria-label={`Quick View ${product.name}`}
              title="Quick View"
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-slate-50/90 text-slate-700 transition-all duration-200 hover:border-slate-800 hover:bg-slate-900 hover:text-white active:scale-95 cursor-pointer shadow-xs"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
