import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { getProductImage } from '../assets/productImages'

export default function ServiceCard({ service }) {
  const serviceImage = getProductImage(service)
  const categoryName = service.category?.name || service.category || 'PRINTING SERVICE'

  return (
    <Link
      to={`/services/${service.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#000000]/12 bg-[#FFFFFF] shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A82F19] hover:shadow-xl"
    >
      {/* Studio Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F8F8FA] border-b border-[#000000]/08">
        <img
          src={serviceImage}
          alt={service.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
        
        {/* Subtle Dark Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-[#000000]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Clean Top Category Badge (Positioned inside image without overlapping borders) */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#000000]/10 bg-[#FFFFFF]/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#000000] shadow-sm backdrop-blur-md transition-colors group-hover:border-[#A82F19]/40 group-hover:text-[#A82F19]">
            <Sparkles className="h-3 w-3 text-[#A82F19]" />
            {categoryName}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-6 bg-[#FFFFFF]">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A82F19]">
            {categoryName}
          </span>
          <h3 className="font-display mt-1 text-xl font-black tracking-tight text-[#000000] transition-colors group-hover:text-[#A82F19]">
            {service.name}
          </h3>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#000000]/70 line-clamp-3">
            {service.shortDescription || service.description}
          </p>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-6 flex items-center justify-between border-t border-[#000000]/10 pt-4 text-xs font-extrabold uppercase tracking-wider text-[#000000] transition-colors group-hover:text-[#A82F19]">
          <span>Explore Service</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#000000]/5 text-[#000000] transition-all group-hover:bg-[#A82F19] group-hover:text-[#FFFFFF]">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>

      {/* Signature Red Accent Bar on Hover */}
      <div className="h-1 w-0 bg-[#A82F19] transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}
