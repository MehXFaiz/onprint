import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Tag, Eye, Layers } from 'lucide-react'
import { getProductImage } from '../assets/productImages'

export default function ProductCard({
  product,
  featured = false,
  variant = 'glass', // 'glass' | 'executive' | 'minimal'
  onQuickView
}) {
  const isFeatured = featured || product.featured
  const productImage = getProductImage(product)
  const categoryName = product.category?.name || product.category || ''

  const handleQuickView = (e) => {
    if (onQuickView) {
      e.preventDefault()
      e.stopPropagation()
      onQuickView(product)
    }
  }

  // Variant 1: Modern Floating Glass Banner Overlay Card (Ultra Executive & Unique)
  if (variant === 'glass') {
    return (
      <div
        className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-xs transition-all duration-500 hover:-translate-y-2 hover:border-accent/40 hover:shadow-2xl ${
          isFeatured ? 'lg:col-span-2 lg:flex-row' : ''
        }`}
      >
        {/* Studio Image Showcase Area */}
        <div
          className={`relative overflow-hidden bg-gradient-to-b from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 ${
            isFeatured ? 'aspect-[16/10] lg:w-1/2 lg:aspect-auto' : 'aspect-[4/3] w-full'
          }`}
        >
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 contrast-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase tracking-widest text-secondary">
              ONPRINT PRESS
            </div>
          )}

          {/* Soft Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

          {/* Top Badges Bar */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
            {categoryName ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-primary/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-background backdrop-blur-md shadow-xs">
                <Tag className="h-2.5 w-2.5 text-accent" />
                {typeof categoryName === 'string' ? categoryName : 'Corporate Gift'}
              </span>
            ) : <span />}

            {isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md shadow-accent/20">
                <Sparkles className="h-3 w-3" />
                Featured
              </span>
            )}
          </div>

          {/* Floating Frosted Glass Banner Overlay */}
          <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/30 bg-surface/85 p-3.5 backdrop-blur-md shadow-lg transition-all duration-300 group-hover:bg-surface/95 group-hover:border-accent/40">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent">
                {product.price ? `From AED ${product.price}` : 'Custom Quote'}
              </span>
              {product.minimumQuantity && (
                <span className="text-[10px] font-bold text-secondary">
                  Min: {product.minimumQuantity} units
                </span>
              )}
            </div>

            <h3 className="font-display mt-1 text-base font-black tracking-tight text-primary transition-colors group-hover:text-accent line-clamp-1 sm:text-lg">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Card Content & Action Trigger Bar */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 bg-surface">
          <div>
            <p className="text-xs leading-relaxed text-secondary line-clamp-2 sm:line-clamp-3">
              {product.shortDescription || product.description}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
            <Link
              to={`/products/${product.slug}`}
              className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary transition-colors group-hover:text-accent cursor-pointer"
            >
              <span>Explore Specs</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 text-accent" />
            </Link>

            {onQuickView && (
              <button
                type="button"
                onClick={handleQuickView}
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-secondary transition-all hover:border-primary hover:text-primary cursor-pointer active:scale-95"
              >
                <Eye className="h-3 w-3" />
                <span>Quick View</span>
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Fallback / Executive Minimal Variant
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/20">
        <img
          src={productImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 rounded-full bg-surface/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
          {product.price ? `AED ${product.price}` : 'Quote'}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="font-display text-lg font-bold text-primary transition-colors group-hover:text-accent">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-secondary line-clamp-2">{product.shortDescription}</p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs font-bold text-accent">
          <span>View Details</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  )
}
