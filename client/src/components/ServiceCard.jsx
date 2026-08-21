import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { getProductImage } from '../assets/productImages'
import { cn } from '@/lib/utils'

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

export default function ServiceCard({ service, className }) {
  const serviceImage = getProductImage(service)
  const categoryName = service.category?.name || service.category || 'PRINTING SERVICE'
  const highlights = getServiceHighlights(service)

  return (
    <Link
      to={`/services/${service.slug}`}
      tabIndex={0}
      aria-label={`${service.name}, ${categoryName}`}
      className={cn(
        'group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs transition-all duration-500 ease-in-out',
        // Parent grid hover effect: de-emphasize all cards in grid on hover
        'group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px]',
        // Current card hover/focus: pop out and highlight
        'hover:!scale-[1.03] hover:!opacity-100 hover:!blur-none hover:border-[#A82F19]/50 hover:shadow-2xl hover:shadow-[#A82F19]/15',
        'focus-visible:!scale-[1.03] focus-visible:!opacity-100 focus-visible:!blur-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A82F19] focus-visible:ring-offset-2',
        className
      )}
    >
      {/* Studio Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        <img
          src={serviceImage}
          alt={service.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover/card:scale-108"
        />
        
        {/* Soft Gradient Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover/card:opacity-40" />

        {/* Clean Glassmorphic Category Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-900 shadow-md backdrop-blur-md transition-all duration-300 group-hover/card:bg-white group-hover/card:border-[#A82F19]/40 group-hover/card:text-[#A82F19]">
            <Sparkles className="h-3 w-3 text-[#A82F19]" />
            {categoryName}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-6 bg-white">
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight text-neutral-900 transition-colors duration-200 group-hover/card:text-[#A82F19]">
            {service.name}
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-neutral-600 line-clamp-3 font-normal">
            {service.shortDescription || service.description}
          </p>

          {/* Feature Spec Tag Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {highlights.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 border border-neutral-200/60 transition-colors group-hover/card:border-neutral-300 group-hover/card:bg-neutral-50"
              >
                <CheckCircle2 className="h-3 w-3 text-[#A82F19]" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 text-xs font-bold uppercase tracking-wider text-neutral-900 transition-colors group-hover/card:text-[#A82F19]">
          <span className="flex items-center gap-1">Explore Service</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 transition-all duration-300 group-hover/card:bg-[#A82F19] group-hover/card:text-white group-hover/card:shadow-md group-hover/card:shadow-[#A82F19]/30">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
          </div>
        </div>
      </div>

      {/* Signature Red Accent Bar on Hover */}
      <div className="h-1 w-0 bg-[#A82F19] transition-all duration-300 group-hover/card:w-full" />
    </Link>
  )
}

