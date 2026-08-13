import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden border border-border bg-surface transition-colors hover:border-primary"
    >
      <div className="aspect-[4/3] overflow-hidden bg-accent-soft">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {product.category?.name && (
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">{product.category.name}</p>
        )}
        <h3 className="mt-2 font-display text-base font-bold text-primary">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary">{product.shortDescription}</p>
        <p className="mt-5 text-sm font-semibold text-accent">
          {product.price != null ? `From $${product.price}` : 'Request a Quote'}
        </p>
      </div>
    </Link>
  )
}
