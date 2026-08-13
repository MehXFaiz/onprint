import { Link } from 'react-router-dom'
import { ArrowUpRight, Printer, Sparkles, Layers, FileText, Tag, Gift } from 'lucide-react'

// Helper icon picker based on service slug or name
function getServiceIcon(slug = '', name = '') {
  const key = (slug + ' ' + name).toLowerCase()
  if (key.includes('digital') || key.includes('press')) return Printer
  if (key.includes('packag')) return Layers
  if (key.includes('label') || key.includes('sticker')) return Tag
  if (key.includes('stationery') || key.includes('card')) return FileText
  if (key.includes('promo') || key.includes('gift')) return Gift
  return Sparkles
}

export default function ServiceCard({ service }) {
  const Icon = getServiceIcon(service.slug, service.name)

  return (
    <Link
      to={`/services/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 sm:p-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-secondary transition-colors group-hover:border-primary group-hover:text-primary">
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>

      <div className="mt-8 flex flex-1 flex-col">
        <h3 className="font-display text-xl font-bold tracking-tight text-primary transition-colors group-hover:text-accent">
          {service.name}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-secondary">{service.shortDescription}</p>
        <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
          <span>Explore Service</span>
          <span className="h-0.5 w-4 bg-accent transition-all duration-300 group-hover:w-7" />
        </div>
      </div>
    </Link>
  )
}

