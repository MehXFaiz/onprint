import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  BookOpen,
  CreditCard,
  FileText,
  UserCheck,
  Award,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react'
import { getProductImage } from '../assets/productImages'

const serviceIconMap = {
  'brochures-printing': BookOpen,
  'brochures-printing-dubai': BookOpen,
  'business-cards-printing': CreditCard,
  'business-cards-printing-dubai': CreditCard,
  'flyers-printing-in-dubai': FileText,
  'flyers-printing-dubai': FileText,
  'id-card-printing-dubai': UserCheck,
  'lanyard-printing-dubai': Award,
  'letterheads-printing-dubai': FileSpreadsheet,
  'letterhead-printing-dubai': FileSpreadsheet,
  'name-badges-printing-dubai': UserCheck,
}

export default function ServiceCard({ service, className = '' }) {
  const serviceImage = getProductImage(service)
  const IconComponent = (service.slug && serviceIconMap[service.slug]) || Sparkles

  return (
    <Link
      to={`/services/${service.slug}`}
      aria-label={service.name}
      className={`group/card relative block h-56 sm:h-64 w-full cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-neutral-900 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#A82F19] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A82F19] ${className}`}
    >
      {/* Background Image with smooth subtle zoom */}
      <img
        src={serviceImage}
        alt={service.name}
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = '/assets/products/1 (1).jpg'
        }}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover/card:scale-108"
      />

      {/* Gradient overlay for perfect text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20 transition-opacity duration-300 group-hover/card:via-black/65" />

      {/* Top Floating Badge */}
      <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md border border-white/15 shadow-xs">
          <IconComponent className="h-3.5 w-3.5 text-[#FF7A59]" />
          <span>Dubai Press</span>
        </span>
      </div>

      {/* Card Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white z-10">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug group-hover/card:text-[#FF8A65] transition-colors">
          {service.name}
        </h3>

        {service.shortDescription && (
          <p className="mt-1 text-[11px] sm:text-xs text-white/80 line-clamp-2 font-normal leading-relaxed">
            {service.shortDescription}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#FF7A59] group-hover/card:text-white transition-colors">
            <span>Explore Service</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
          </span>
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-white/50">
            Express UAE
          </span>
        </div>
      </div>
    </Link>
  )
}

