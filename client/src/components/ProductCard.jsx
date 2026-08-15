import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Tag } from 'lucide-react'

export default function ProductCard({ product, featured = false, onQuickView }) {
  const isFeatured = featured || product.featured
  const primaryImage = product.images?.[0] || product.image
  const categoryName = product.category?.name || ''

  const handleActionClick = (e) => {
    if (onQuickView) {
      e.preventDefault()
      onQuickView(product)
    }
  }

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border/90 bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl ${
        isFeatured ? 'lg:col-span-2 lg:flex-row' : ''
      }`}
    >
      {/* Product Image Showcase Area */}
      <div
        className={`relative overflow-hidden bg-muted/20 ${
          isFeatured ? 'aspect-[16/10] lg:w-1/2 lg:aspect-auto' : 'aspect-[4/3] w-full'
        }`}
      >
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase tracking-widest text-secondary">
            ONPRINT PRESS
          </div>
        )}

        {/* Subtle overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Floating Category Badge (Bottom Left) */}
        {categoryName && (
          <span className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary shadow-xs backdrop-blur-md">
            <Tag className="h-2.5 w-2.5 text-accent" />
            {categoryName}
          </span>
        )}

        {/* Featured Badge (Top Right) */}
        {isFeatured && (
          <span className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
            <Sparkles className="h-3 w-3" />
            Featured
          </span>
        )}
      </div>

      {/* Content Area Underneath / Beside */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent">
              {product.price ? `From AED ${product.price}` : 'Custom Quote'}
            </span>
            {product.minimumQuantity && (
              <span className="text-[10px] font-semibold text-secondary">Min: {product.minimumQuantity} units</span>
            )}
          </div>

          <h3 className="font-display mt-2 text-xl font-extrabold tracking-tight text-primary transition-colors group-hover:text-accent sm:text-2xl">
            {product.name}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-secondary line-clamp-2 sm:line-clamp-3">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Action Reveal Row */}
        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <Link
            to={`/products/${product.slug}`}
            onClick={handleActionClick}
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary transition-colors group-hover:text-accent cursor-pointer"
          >
            <span>Explore Product</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 text-accent" />
          </Link>

          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-secondary transition-colors hover:border-primary hover:text-primary cursor-pointer"
            >
              Quick View
            </button>
          )}
        </div>
      </div>
    </div>
  )
}



