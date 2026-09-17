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
  'digital-offset-printing': FileText,
  'luxury-packaging-custom-boxes': Sparkles,
  'corporate-gift-customization': Award,
  'custom-labels-die-cut-stickers': Sparkles,
  'executive-business-stationery': CreditCard,
  'large-format-exhibition-signage': Sparkles,
}

export default function ServiceCard({ service, className = '' }) {
  if (!service) return null

  const serviceImage = getProductImage(service)
  const IconComponent = (service.slug && serviceIconMap[service.slug]) || Sparkles
  const serviceLink = `/services/${service.slug}`

  return (
    <div
      className={`group/card relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A82F19] hover:shadow-xl ${className}`}
    >
      {/* Top Image Container: 100% CLEAR, bright, crisp, zero dark overlay */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f8f7f5]">
        <img
          src={serviceImage}
          alt={service.imageAlt || service.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = '/assets/products/1 (1).jpg'
          }}
          className="h-full w-full object-cover object-center transition-transform duration-500 will-change-transform group-hover/card:scale-105"
        />

        {/* Subtle hover gradient for polish */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-neutral-900 backdrop-blur-md shadow-xs border border-black/5">
            <IconComponent className="h-3.5 w-3.5 text-[#A82F19]" />
            <span>Dubai Press</span>
          </span>
        </div>

        <div className="absolute right-3 top-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-white backdrop-blur-md">
            Express UAE
          </span>
        </div>
      </div>

      {/* Card Body Content */}
      <div className="flex flex-1 flex-col justify-between p-5 bg-white">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#A82F19]">
            COMMERCIAL SERVICE
          </span>
          <h3 className="font-display mt-1 text-base sm:text-lg font-bold tracking-tight text-neutral-900 transition-colors group-hover/card:text-[#A82F19] leading-snug line-clamp-1">
            <Link to={serviceLink} className="focus:outline-none">
              <span className="absolute inset-0 z-10" aria-hidden="true" />
              {service.name}
            </Link>
          </h3>

          {service.shortDescription && (
            <p className="mt-1.5 text-xs text-neutral-600 line-clamp-2 leading-relaxed font-normal">
              {service.shortDescription}
            </p>
          )}
        </div>

        {/* Footer Action Button */}
        <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#A82F19] transition-transform duration-200 group-hover/card:translate-x-1">
            <span>Explore Service</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
            Al Quoz Press
          </span>
        </div>
      </div>
    </div>
  )
}


