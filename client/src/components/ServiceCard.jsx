import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { getProductImage } from '../assets/productImages'

export default function ServiceCard({ service, className = '' }) {
  const serviceImage = getProductImage(service)
  const categoryName = service.category?.name || service.category || 'Office Stationery Printing'

  return (
    <Link
      to={`/services/${service.slug}`}
      role="listitem"
      aria-label={`${service.name}, ${categoryName}`}
      tabIndex={0}
      className={`group/card relative h-80 sm:h-96 w-full cursor-pointer overflow-hidden rounded-xl bg-cover bg-center shadow-lg transition-all duration-500 ease-in-out
        group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px]
        hover:!scale-105 hover:!opacity-100 hover:!blur-none hover:shadow-2xl hover:z-20
        focus-visible:!scale-105 focus-visible:!opacity-100 focus-visible:!blur-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A82F19] ring-offset-white ${className}`}
      style={{ backgroundImage: `url(${serviceImage})` }}
    >
      {/* Gradient overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover/card:via-black/50" />

      {/* Card Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
        <p className="text-xs sm:text-sm font-light uppercase tracking-widest opacity-80 text-white/90">
          {categoryName}
        </p>
        <h3 className="mt-1 text-xl sm:text-2xl font-semibold text-white tracking-tight">
          {service.name}
        </h3>
        {service.shortDescription && (
          <p className="mt-2 text-xs sm:text-sm text-white/80 line-clamp-2 font-normal leading-relaxed opacity-90">
            {service.shortDescription}
          </p>
        )}
        <div className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400 group-hover/card:text-[#A82F19] transition-colors">
          <span>Explore Service</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/card:translate-x-1 group-hover/card:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  )
}
