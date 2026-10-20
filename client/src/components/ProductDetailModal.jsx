import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Package, Tag, Compass, Image as ImageIcon } from 'lucide-react'
import Button from './Button'
import WhatsAppIcon from './WhatsAppIcon'
import Product360Viewer from './Product360Viewer'
import { getProductImage } from '../assets/productImages'
import { trackViewProduct, trackGetQuoteClick, trackWhatsAppClick } from '../utils/analytics'
import { getServiceWhatsAppUrl } from '../utils/whatsapp'

export default function ProductDetailModal({ product, onClose }) {
  const [viewMode, setViewMode] = useState('360') // '360' | 'photo'

  useEffect(() => {
    if (product) {
      trackViewProduct({
        product_name: product.name,
        product_id: product._id || product.slug,
        category_name: product.category?.name || 'ONPRINT Product',
      })
    }
  }, [product])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!product) return null

  const isFeatured = product.featured
  const categoryName = product.category?.name || 'ONPRINT Product'
  const primaryImage = getProductImage(product)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl text-slate-900"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product modal"
            className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 shadow-md transition-colors hover:bg-[#D4AF65] hover:text-[#0F172A] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* 360 Inspection Canvas Column */}
            <div className="relative flex flex-col justify-between bg-slate-50 p-5 sm:p-7 md:col-span-6 md:border-r border-slate-200">
              {/* Mode Toggle Switch */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('360')}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      viewMode === '360'
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>360° View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('photo')}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      viewMode === 'photo'
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>Static Photo</span>
                  </button>
                </div>

                {isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#B89245] shadow-2xs">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </span>
                )}
              </div>

              {/* Viewer Stage */}
              <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
                {viewMode === '360' ? (
                  <Product360Viewer
                    product={product}
                    autoSpin={true}
                    height="aspect-[4/3]"
                  />
                ) : (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    {primaryImage ? (
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase tracking-widest text-slate-400">
                        ONPRINT PRESS
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footnote note */}
              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Category: <strong className="text-slate-800">{categoryName}</strong></span>
                <span className="text-[#B89245] font-bold">Interactive 3D Preview</span>
              </div>
            </div>

            {/* Content Details Column */}
            <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-6">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B89245]">
                  Custom Quote Available
                </span>

                <h2 className="font-display mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {product.name}
                </h2>

                <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {product.description || product.shortDescription}
                </p>

                {/* Specs Pill Summary */}
                <div className="mt-6 space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {product.minimumQuantity && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-600">
                        <Package className="h-3.5 w-3.5 text-[#B89245]" />
                        Minimum Order:
                      </span>
                      <span className="font-bold text-slate-900">{product.minimumQuantity} units</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-600">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#B89245]" />
                      Quality Check:
                    </span>
                    <span className="font-bold text-slate-900">Pre-flight QC Included</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#B89245]" />
                      Production:
                    </span>
                    <span className="font-bold text-slate-900">Dubai Express Press</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-2.5">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Button
                    to={`/get-a-quote?product=${product.slug}`}
                    variant="accent"
                    size="md"
                    className="flex-1 justify-center text-xs sm:text-sm font-bold shadow-md shadow-accent/20"
                    onClick={() => {
                      trackGetQuoteClick({
                        source_page: 'product_quick_view_modal',
                        product_name: product.name,
                        category_name: categoryName,
                      })
                      onClose()
                    }}
                  >
                    Request Official Quote
                  </Button>

                  <a
                    href={getServiceWhatsAppUrl(product.category?.slug || product.slug, {
                      productName: product.name,
                      slug: product.slug,
                      pageUrl: `https://www.0nprint.com/products/${product.slug}`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackWhatsAppClick({
                        source_page: typeof window !== 'undefined' ? window.location.pathname : 'product_modal',
                        product_name: product.name,
                        service_name: categoryName || product.name,
                        button_location: 'product_quick_view_modal',
                        product_id: product.slug || product._id,
                        label: `modal_inquiry_${product.slug || product.name}`,
                      })
                      onClose()
                    }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer shrink-0"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>

                <Link
                  to={`/products/${product.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-1.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors hover:text-[#B89245] cursor-pointer text-center"
                >
                  <span>View Complete Specifications</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
