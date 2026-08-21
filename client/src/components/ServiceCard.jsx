import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { getProductImage } from '../assets/productImages'

// Helper to derive quick spec feature pills based on service slug/category
function getServiceHighlights(service) {
  if (Array.isArray(service.highlights) && service.highlights.length > 0) {
    return service.highlights.slice(0, 2)
  }
  const slug = service.slug || ''
  if (slug.includes('digital') || slug.includes('offset')) {
    return ['CMYK & Pantone', 'High Volume']
  }
  if (slug.includes('packaging') || slug.includes('box')) {
    return ['Custom Rigid', 'Foil Stamping']
  }
  if (slug.includes('gift') || slug.includes('corporate-gift')) {
    return ['Laser Engraved', 'Bespoke Merch']
  }
  if (slug.includes('signage') || slug.includes('format')) {
    return ['UV Resistant', 'Indoor / Outdoor']
  }
  if (slug.includes('label') || slug.includes('sticker')) {
    return ['Waterproof Vinyl', 'Custom Die-Cut']
  }
  if (slug.includes('stationery') || slug.includes('executive')) {
    return ['Cotton Stock', 'Luxury Spot UV']
  }
  return ['Premium Quality', 'Express Dispatch']
}

export default function ServiceCard({ service, className = '' }) {
  const serviceImage = getProductImage(service)
  const categoryName = service.category?.name || service.category || 'PRINTING SERVICE'
  const highlights = getServiceHighlights(service)

  return (
    <Link
      to={`/services/${service.slug}`}
      tabIndex={0}
      role="listitem"
      aria-label={`${service.name}, ${categoryName}`}
      className={`group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-500 ease-in-out cursor-pointer
        group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[1.5px]
        hover:!scale-[1.03] hover:!opacity-100 hover:!blur-none hover:shadow-2xl hover:shadow-[#A82F19]/15 hover:border-[#A82F19]/50 hover:z-20
        focus-visible:!scale-[1.03] focus-visible:!opacity-100 focus-visible:!blur-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A82F19] focus-visible:ring-offset-2 ring-offset-white ${className}`}
    >
      {/* Studio Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={serviceImage}
          alt={service.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover/card:scale-110"
        />
        
        {/* Soft Gradient Overlay for Depth & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-40 transition-opacity duration-500 group-hover/card:opacity-20" />

        {/* Clean Glassmorphic Category Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-900 shadow-sm backdrop-blur-md transition-all duration-300 group-hover/card:bg-white group-hover/card:border-[#A82F19]/40 group-hover/card:text-[#A82F19]">
            <Sparkles className="h-3 w-3 text-[#A82F19]" />
            {categoryName}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-6 bg-white">
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover/card:text-[#A82F19]">
            {service.name}
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-3 font-normal">
            {service.shortDescription || service.description}
          </p>

          {/* Feature Spec Tag Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {highlights.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200/80 transition-colors group-hover/card:border-slate-300 group-hover/card:bg-slate-50"
              >
                <CheckCircle2 className="h-3 w-3 text-[#A82F19]" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors group-hover/card:text-[#A82F19]">
          <span className="flex items-center gap-1">Explore Service</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all duration-300 group-hover/card:bg-[#A82F19] group-hover/card:text-white group-hover/card:shadow-md group-hover/card:shadow-[#A82F19]/30">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
          </div>
        </div>
      </div>

      {/* Signature Red Accent Bar on Hover */}
      <div className="h-1 w-0 bg-[#A82F19] transition-all duration-500 group-hover/card:w-full" />
    </Link>
  )
}
