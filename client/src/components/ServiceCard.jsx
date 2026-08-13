import { Link } from 'react-router-dom'

export default function ServiceCard({ service }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        {service.image && (
          <img
            src={service.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-ink-900">{service.name}</h3>
        <p className="mt-2 flex-1 text-sm text-ink-500">{service.shortDescription}</p>
        <Link
          to={`/services/${service.slug}`}
          className="mt-4 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}
