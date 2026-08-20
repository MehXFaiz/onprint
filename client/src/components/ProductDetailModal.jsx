import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Package, Tag } from 'lucide-react'
import Button from './Button'
import { getProductImage } from '../assets/productImages'
import { trackViewProduct, trackGetQuoteClick } from '../utils/analytics'

export default function ProductDetailModal({ product, onClose }) {
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
          className="absolute inset-0 bg-primary/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product modal"
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-primary shadow-xs transition-colors hover:bg-accent hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Image Canvas Column */}
            <div className="relative flex items-center justify-center bg-muted/20 p-6 md:col-span-6 md:p-8 border-b md:border-b-0 md:border-r border-border/80">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-xs">
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase tracking-widest text-secondary">
                    ONPRINT PRESS
                  </div>
                )}

                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary shadow-xs backdrop-blur-md">
                    <Tag className="h-3 w-3 text-accent" />
                    {categoryName}
                  </span>
                </div>

                {isFeatured && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Content Details Column */}
            <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-6">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-accent">
                  {product.price ? `Starting from AED ${product.price}` : 'Custom Quote Available'}
                </span>

                <h2 className="font-display mt-1 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                  {product.name}
                </h2>

                <p className="mt-3 text-xs leading-relaxed text-secondary sm:text-sm">
                  {product.description || product.shortDescription}
                </p>

                {/* Specs Pill Summary */}
                <div className="mt-6 space-y-2.5 rounded-2xl border border-border/80 bg-background/80 p-4">
                  {product.minimumQuantity && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-secondary">
                        <Package className="h-3.5 w-3.5 text-accent" />
                        Minimum Order:
                      </span>
                      <span className="font-bold text-primary">{product.minimumQuantity} units</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-secondary">
                      <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                      Quality Check:
                    </span>
                    <span className="font-bold text-primary">Pre-flight QC Included</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-secondary">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                      Production:
                    </span>
                    <span className="font-bold text-primary">Dubai Express Press</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-3">
                <Button
                  to={`/get-a-quote?product=${product.slug}`}
                  variant="accent"
                  size="md"
                  className="w-full justify-center text-sm font-bold shadow-md shadow-accent/20"
                  onClick={() => {
                    trackGetQuoteClick({
                      source_page: 'product_quick_view_modal',
                      product_name: product.name,
                      category_name: categoryName,
                    })
                    onClose()
                  }}
                >
                  Request Quote for Product
                </Button>

                <Link
                  to={`/products/${product.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-1.5 py-1 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-accent cursor-pointer"
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
