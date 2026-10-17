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
  const [imageError, setImageError] = useState(false)
  const rafRef = useRef(null)

  const productImage = product ? getProductImage(product) : ''
  const [currentImg, setCurrentImg] = useState(productImage)

  useEffect(() => {
    if (product) {
      setCurrentImg(productImage)
      setImageError(false)
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

  const handleImageError = (e) => {
    e.target.onerror = null
    const catSlug =
      (typeof product.category === 'object' ? product.category?.slug : product.category) || ''
    const fallbackCategoryImg = catSlug
      ? `/uploads/categories/${catSlug}.jpg`
      : '/uploads/categories/business-cards-printing.jpg'

    if (currentImg !== fallbackCategoryImg && !String(currentImg).includes(catSlug)) {
      setCurrentImg(fallbackCategoryImg)
    } else {
      setImageError(true)
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
      list.push('Heidelberg Offset / Digital')
    }
    if (product.specifications?.finishes?.[0]?.label) {
      list.push(product.specifications.finishes[0].label)
    } else {
      list.push('Bespoke Tactile Finishing')
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
      setTilt({ x: y * -6, y: x * 7 })
    })
  }

  const resetMouse = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  const resolvedSrc = currentImg || productImage

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.5,
        delay: Math.min((index % 6) * 0.07, 0.35),
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -7 }}
      className={`group bento-card flex flex-col h-full w-full min-w-0 overflow-hidden ${className}`}
    >
      {/* Top Brushed Brass & Terracotta Hairline Accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#C89D54]/40 via-[#B83A22] to-[#C89D54]/40 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Product Image Studio Stage */}
      <div
        className="relative w-full aspect-[4/3] shrink-0 overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F3EDE2] to-[#FAF7F2] border-b border-[#E4DCD0]/80 flex items-center justify-center select-none"
        onPointerEnter={() => setIsHovered(true)}
        onPointerMove={handleMouseMove}
        onPointerLeave={resetMouse}
      >
        {/* Warm Editorial Dot Matrix Texture */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#181411 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Ambient Studio Spotlight Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.9),rgba(200,157,84,0.08)_55%,transparent_80%)] pointer-events-none" />

        {/* Framed 3D Tilt Image Stage */}
        <div
          className="relative h-full w-full p-2.5 sm:p-3.5 flex items-center justify-center will-change-transform"
          style={{
            transform: isHovered && !prefersReducedMotion
              ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.03, 1.03, 1.03)`
              : 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {resolvedSrc && !imageError ? (
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[#E4DCD0] bg-white shadow-[0_6px_18px_rgba(24,20,17,0.07)] group-hover:shadow-[0_14px_30px_rgba(24,20,17,0.14)] transition-shadow duration-500">
              <img
                src={resolvedSrc}
                alt={product.imageAlt || product.name}
                width="380"
                height="285"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
              />

              {/* Espresso Vignette on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#181411]/75 via-[#181411]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Anamorphic Champagne Brass Foil Light Sheen on Hover */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -translate-x-[160%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-[#F9F3E6]/45 to-transparent skew-x-[-25deg] pointer-events-none z-10"
              />
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-[#F3EDE2] border border-[#E4DCD0] text-[#6E6257] p-4 text-center select-none">
              <span className="font-display font-black text-xs uppercase tracking-widest text-[#9C8F80]">ONPRINT ATELIER</span>
              <span className="text-[11px] font-bold text-[#3B332C] mt-1 line-clamp-1">{product.name}</span>
            </div>
          )}
        </div>

        {/* Top-Left Floating Badge Group */}
        <div className="absolute left-3.5 top-3.5 z-20 pointer-events-none flex flex-wrap items-center gap-1.5">
          {isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#B83A22] to-[#962C17] px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-white shadow-md ring-1 ring-white/25 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-[#F3D292] animate-pulse" />
              Signature
            </span>
          ) : product.minimumQuantity ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF7F2]/95 px-2.5 py-0.5 text-[9.5px] font-bold text-[#26201B] shadow-xs border border-[#E4DCD0] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C89D54]" />
              Min {product.minimumQuantity} pcs
            </span>
          ) : null}
        </div>

        {/* Top-Right Price / Service Badge */}
        <div className="absolute right-3.5 top-3.5 z-20 pointer-events-none">
          {product.price && Number(product.price) > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#181411]/90 px-2.5 py-0.5 text-[10.5px] font-bold text-[#FAF7F2] shadow-md border border-[#C89D54]/30 backdrop-blur-md">
              <Tag className="h-3 w-3 text-[#C89D54]" />
              <span>AED {product.price}</span>
              <span className="text-[9px] font-normal text-[#D2C7B8]">+</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#181411]/88 px-2.5 py-0.5 text-[9.5px] font-bold text-[#FAF7F2] shadow-xs border border-[#C89D54]/30 backdrop-blur-md">
              <Clock className="h-3 w-3 text-[#C89D54]" />
              <span>24h Express</span>
            </span>
          )}
        </div>

        {/* Interactive Floating Quick-Actions Overlay (Revealed on Image Hover) */}
        <div className="absolute inset-x-3.5 bottom-3.5 z-20 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#181411]/90 px-2.5 py-1 text-[9px] font-semibold tracking-wider text-[#F9F3E6] backdrop-blur-md border border-[#C89D54]/30 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C89D54] animate-ping" />
            {isHovered ? '3D Tactile View' : 'Hover 3D'}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {onQuickView && (
              <button
                type="button"
                onClick={handleQuickView}
                aria-label={`Quick View ${product.name}`}
                title="Quick View Modal"
                className="inline-flex items-center gap-1 rounded-full bg-[#FAF7F2]/95 hover:bg-[#B83A22] text-[#181411] hover:text-white px-2.5 py-1 text-[11px] font-bold shadow-md backdrop-blur-md transition-all duration-200 active:scale-95 cursor-pointer"
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
                  slug: product.slug,
                  pageUrl: `https://www.0nprint.com/products/${product.slug}`,
                  price: product.price || undefined,
                }
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackWhatsAppClick({
                  source_page: typeof window !== 'undefined' ? window.location.pathname : 'product_card',
                  product_name: product.name,
                  service_name: product.category?.name || product.category?.slug || product.name,
                  button_location: 'product_card_overlay',
                  product_id: product.slug || product._id,
                  label: `card_quick_wa_${product.slug || product.name}`,
                })
              }}
              aria-label={`Get price on WhatsApp for ${product.name}`}
              title="Get Price on WhatsApp"
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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F9F3E6] border border-[#C89D54]/35 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#8C6523] truncate max-w-full">
                <span className="h-1 w-1 rounded-full bg-[#B83A22]" />
                {categoryName}
              </span>
              <span className="text-[10px] font-semibold text-[#9C8F80] shrink-0">Al Quoz Craft</span>
            </div>
          ) : null}

          {/* Product Name */}
          <h3 className="font-serif text-base sm:text-[17px] font-bold leading-snug tracking-tight text-[#181411] group-hover:text-[#B83A22] transition-colors duration-200 line-clamp-1 break-words">
            <Link to={`/products/${product.slug}`} className="hover:underline focus:outline-none">
              {product.name}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs leading-relaxed text-[#574E46] line-clamp-2 break-words">
            {product.shortDescription || product.description || `High-precision custom commercial printing for ${product.name} in Dubai.`}
          </p>

          {/* Specifications Chips */}
          {featuresList.length > 0 && (
            <div className="pt-2.5 border-t border-[#E4DCD0]/70 flex flex-wrap gap-1.5 min-w-0">
              {featuresList.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#FAF7F2] border border-[#E4DCD0] px-2 py-0.5 text-[10.5px] font-semibold text-[#3B332C] transition-colors group-hover:bg-[#FDF3EF] group-hover:border-[#B83A22]/25 group-hover:text-[#B83A22] min-w-0"
                >
                  <Check className="h-3 w-3 text-[#B83A22] shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">{feat}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-auto pt-4 border-t border-[#E4DCD0]/70 flex items-center gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="group/btn flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#181411] hover:bg-[#B83A22] px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FAF7F2] transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer active:scale-[0.98]"
          >
            <span>Explore</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>

          <a
            href={getServiceWhatsAppUrl(
              product.category?.slug || product.slug,
              {
                productName: product.name,
                slug: product.slug,
                pageUrl: `https://www.0nprint.com/products/${product.slug}`,
                price: product.price || undefined,
              }
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackWhatsAppClick({
                source_page: typeof window !== 'undefined' ? window.location.pathname : 'product_card',
                product_name: product.name,
                service_name: product.category?.name || product.category?.slug || product.name,
                button_location: 'product_card_footer',
                product_id: product.slug || product._id,
                label: `card_inquiry_${product.slug || product.name}`,
              })
            }}
            aria-label={`Get Price for ${product.name} on WhatsApp`}
            title={`Get Price for ${product.name} on WhatsApp`}
            className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl border border-emerald-300/80 bg-emerald-50 text-emerald-800 text-[11px] font-bold transition-all duration-200 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white active:scale-95 cursor-pointer shadow-xs shrink-0"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 fill-current shrink-0" />
            <span>Price</span>
          </a>

          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickView}
              aria-label={`Quick View ${product.name}`}
              title="Quick View"
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-[#E4DCD0] bg-[#FAF7F2] text-[#3B332C] transition-all duration-200 hover:border-[#181411] hover:bg-[#181411] hover:text-[#FAF7F2] active:scale-95 cursor-pointer shadow-xs shrink-0"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
