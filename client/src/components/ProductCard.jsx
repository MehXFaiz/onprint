import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function ProductCard({ product, featured = false, onQuickView }) {
  const isFeatured = featured || product.featured

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl ${
        isFeatured ? 'lg:col-span-2 lg:flex-row' : ''
      }`}
    >
      {/* Product Image Area */}
      <div
        className={`relative overflow-hidden bg-accent-soft/30 ${
          isFeatured ? 'aspect-[4/3] lg:w-1/2 lg:aspect-auto' : 'aspect-[4/3] w-full'
        }`}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-secondary uppercase tracking-widest">
            ONPRINT PRESS
          </div>
        )}

        {/* Floating Category Badge (Bottom Left of Image) */}
        {product.category?.name && (
          <span className="absolute left-4 bottom-4 rounded-full bg-surface/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary shadow-xs backdrop-blur-md">
            {product.category.name}
          </span>
        )}

        {/* Featured Badge (Top Right of Image) */}
        {isFeatured && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
            <Sparkles className="h-3 w-3" />
            Featured
          </span>
        )}
      </div>

      {/* Content Area Underneath / Beside */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
              {product.price ? `From AED ${product.price}` : 'Custom Quote'}
            </span>
            {product.minimumQuantity && (
              <span className="text-[10px] font-medium text-secondary">Min: {product.minimumQuantity} units</span>
            )}
          </div>

          <h3 className="font-display mt-2 text-xl font-bold tracking-tight text-primary transition-colors group-hover:text-accent sm:text-2xl">
            {product.name}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-secondary line-clamp-3">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Action Row */}
        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <Link
            to={`/products/${product.slug}`}
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


