import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-ink-900">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm text-ink-500">{product.shortDescription}</p>
        <p className="mt-4 text-sm font-semibold text-brand-600">
          {product.price != null ? `From $${product.price}` : 'Request a Quote'}
        </p>
      </div>
    </Link>
  )
}
