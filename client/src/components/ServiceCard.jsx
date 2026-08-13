import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function ServiceCard({ service }) {
  return (
    <Link
      to={`/services/${service.slug}`}
      className="group flex flex-col overflow-hidden border border-border bg-surface transition-colors hover:border-primary"
    >
      <div className="aspect-[4/3] overflow-hidden bg-accent-soft">
        {service.image && (
          <img
            src={service.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-base font-bold text-primary">{service.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary">{service.shortDescription}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
          View Details
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
