import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { getProductImage } from '../assets/productImages'

export default function ServiceCard({ service }) {
  const serviceImage = getProductImage(service)

  return (
    <Link
      to={`/services/${service.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-xs transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl"
    >
      {/* Large Image Showcase */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <img
          src={serviceImage}
          alt={service.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 contrast-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-25" />

        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-primary/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-background backdrop-blur-md shadow-xs">
            <Sparkles className="h-3 w-3 text-accent" />
            {service.category?.name || 'Printing Service'}
          </span>
        </div>
      </div>

      {/* Content Area with Clean Spacing */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7 bg-surface">
        <div>
          <h3 className="font-display text-xl font-black tracking-tight text-primary transition-colors group-hover:text-accent">
            {service.name}
          </h3>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-secondary line-clamp-3">
            {service.shortDescription || service.description}
          </p>
        </div>

        {/* Minimal CTA */}
        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs font-extrabold uppercase tracking-wider text-accent">
          <span>Learn More</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </div>
    </Link>
  )
}
