import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles, Eye, Check, Clock } from 'lucide-react'
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
      setTilt({ x: y * -5, y: x * 6 })
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
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.5,
        delay: Math.min((index % 6) * 0.07, 0.35),
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -5 }}
      className={`group flex flex-col h-full w-full min-w-0 overflow-hidden rounded-3xl border border-[#263654] bg-[#1B2943] text-[#F5F1E8] shadow-md hover:border-[#D6BC8A] hover:shadow-[0_20px_35px_-10px_rgba(11,20,38,0.75),0_0_25px_-4px_rgba(214,188,138,0.25)] transition-all duration-300 ${className}`}
    >
      {/* Product Image Studio Stage */}
      <div
        className="relative w-full aspect-[4/3] shrink-0 overflow-hidden bg-[#101C35] border-b border-[#263654] flex items-center justify-center select-none"
        onPointerEnter={() => setIsHovered(true)}
        onPointerMove={handleMouseMove}
        onPointerLeave={resetMouse}
      >
        {/* Framed 3D Tilt Image Stage */}
        <div
          className="relative h-full w-full p-3 flex items-center justify-center will-change-transform"
          style={{
            transform: isHovered && !prefersReducedMotion
              ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
              : 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {resolvedSrc && !imageError ? (
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#0B1426] shadow-sm transition-shadow duration-500">
              <img
                src={resolvedSrc}
                alt={product.imageAlt || product.name}
                width="380"
                height="285"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Subtle Vignette on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-[#0B1426] border border-[#263654] text-[#F5F1E8] p-4 text-center select-none">
              <span className="font-black text-xs uppercase tracking-widest text-[#D6BC8A]">ONPRINT</span>
              <span className="text-[11px] font-bold text-[#F5F1E8] mt-1 line-clamp-1">{product.name}</span>
            </div>
          )}
        </div>

        {/* Top-Left Floating Badge Group */}
        <div className="absolute left-3 top-3 z-20 pointer-events-none flex flex-wrap items-center gap-1.5">
          {isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#D6BC8A] px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-[#101C35] shadow-xs">
              <Sparkles className="h-3 w-3" />
              Signature
            </span>
          ) : product.minimumQuantity ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#101C35]/90 px-2.5 py-0.5 text-[9.5px] font-bold text-[#F5F1E8] shadow-xs border border-[#263654] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D6BC8A]" />
              Min {product.minimumQuantity} pcs
            </span>
          ) : null}
        </div>

        {/* Top-Right Service Badge */}
        <div className="absolute right-3 top-3 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#101C35]/90 px-2.5 py-0.5 text-[9.5px] font-bold text-[#F5F1E8] shadow-xs border border-[#263654] backdrop-blur-md">
            <Clock className="h-3 w-3 text-[#D6BC8A]" />
            <span>24h Express</span>
          </span>
        </div>

        {/* Interactive Floating Quick-Actions Overlay (Revealed on Image Hover) */}
        <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#101C35]/90 px-2.5 py-1 text-[9px] font-semibold tracking-wider text-[#F5F1E8] backdrop-blur-md border border-[#263654] shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D6BC8A] animate-ping" />
            <span>Interactive 3D</span>
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {onQuickView && (
              <button
                type="button"
                onClick={handleQuickView}
                aria-label={`Quick View ${product.name}`}
                title="Quick View Modal"
                className="inline-flex items-center gap-1 rounded-full bg-[#1B2943] hover:bg-[#D6BC8A] text-[#F5F1E8] hover:text-[#101C35] px-2.5 py-1 text-[11px] font-bold shadow-xs backdrop-blur-md transition-all active:scale-95 cursor-pointer border border-[#263654]"
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
              aria-label={`Inquire about ${product.name} on WhatsApp`}
              title="Inquire on WhatsApp"
              className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#101C35] border border-[#263654] px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#D6BC8A] truncate max-w-full">
                <span className="h-1 w-1 rounded-full bg-[#D6BC8A]" />
                {categoryName}
              </span>
              <span className="text-[10px] font-medium text-[#94A3B8] shrink-0">Al Quoz Press</span>
            </div>
          ) : null}

          {/* Product Name */}
          <h3 className="text-base sm:text-[17px] font-bold leading-snug tracking-tight text-[#F5F1E8] group-hover:text-[#D6BC8A] transition-colors duration-200 line-clamp-1 break-words">
            <Link to={`/products/${product.slug}`} className="hover:underline focus:outline-none">
              {product.name}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs leading-relaxed text-[#94A3B8] line-clamp-2 break-words">
            {product.shortDescription || product.description || `High-precision custom commercial printing for ${product.name} in Dubai.`}
          </p>

          {/* Specifications Chips */}
          {featuresList.length > 0 && (
            <div className="pt-2.5 border-t border-[#263654] flex flex-wrap gap-1.5 min-w-0">
              {featuresList.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full bg-[#101C35] border border-[#263654] px-2.5 py-0.5 text-[10px] font-medium text-[#F5F1E8] min-w-0"
                >
                  <Check className="h-3 w-3 text-[#D6BC8A] shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">{feat}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-auto pt-4 border-t border-[#263654] flex items-center gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="group/btn flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#D6BC8A] hover:bg-[#C4A870] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#101C35] transition-all shadow-xs cursor-pointer active:scale-[0.98]"
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
            aria-label={`Inquire about ${product.name} on WhatsApp`}
            title={`Inquire about ${product.name} on WhatsApp`}
            className="inline-flex items-center justify-center gap-1.5 h-8.5 px-3 rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 text-[11px] font-bold transition-all hover:bg-[#25D366] hover:text-white active:scale-95 cursor-pointer shadow-xs shrink-0"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 fill-current shrink-0" />
            <span>WhatsApp</span>
          </a>

          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickView}
              aria-label={`Quick View ${product.name}`}
              title="Quick View"
              className="inline-flex items-center justify-center h-8.5 w-8.5 rounded-full border border-[#263654] bg-[#101C35] text-[#F5F1E8] transition-all hover:border-[#D6BC8A] hover:bg-[#1B2943] hover:text-[#D6BC8A] active:scale-95 cursor-pointer shadow-xs shrink-0"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
