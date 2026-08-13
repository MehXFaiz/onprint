import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-accent-soft/40">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-secondary">
            ONPRINT CATALOG
          </div>
        )}
        {product.category?.name && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-surface/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-xs backdrop-blur-xs">
            {product.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold text-primary transition-colors group-hover:text-accent">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-secondary">{product.shortDescription}</p>

        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <p className="text-sm font-bold text-accent">
            {product.price != null ? `From $${product.price}` : 'Request a Quote'}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors group-hover:text-accent">
            Details
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

