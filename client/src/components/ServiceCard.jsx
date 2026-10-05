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
      className={`group/card relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#A82F19]/40 hover:shadow-md ${className}`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 border-b border-slate-100">
        <img
          src={serviceImage}
          alt={service.imageAlt || service.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = '/assets/products/1 (1).jpg'
          }}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover/card:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-800 shadow-xs border border-slate-100">
            <IconComponent className="h-3 w-3 text-[#A82F19]" />
            <span>Dubai Press</span>
          </span>
        </div>

        <div className="absolute right-3 top-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-900/85 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
            Express 24h
          </span>
        </div>
      </div>

      {/* Card Body Content */}
      <div className="flex flex-1 flex-col justify-between p-4.5 bg-white">
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#A82F19]">
            COMMERCIAL SERVICE
          </span>
          <h3 className="font-display mt-1 text-sm sm:text-base font-bold tracking-tight text-slate-900 transition-colors group-hover/card:text-[#A82F19] leading-snug line-clamp-1">
            <Link to={serviceLink} className="focus:outline-none">
              <span className="absolute inset-0 z-10" aria-hidden="true" />
              {service.name}
            </Link>
          </h3>

          {service.shortDescription && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
              {service.shortDescription}
            </p>
          )}
        </div>

        {/* Footer Action */}
        <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#A82F19]">
          <span className="inline-flex items-center gap-1">
            <span>Explore Service</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/card:translate-x-0.5" />
          </span>
          <span className="text-[9.5px] font-semibold text-slate-400 uppercase">
            Al Quoz Press
          </span>
        </div>
      </div>
    </div>
  )
}
