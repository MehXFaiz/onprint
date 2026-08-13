import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import { getServiceBySlug } from '../../services/services'

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const [service, setService] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    getServiceBySlug(slug)
      .then((data) => {
        setService(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [slug])

  if (status === 'loading') return <LoadingState label="Loading service…" />
  if (status === 'error') {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <EmptyState title="Service not found" note="It may have been removed or renamed." />
        <div className="mt-6 text-center">
          <Link to="/services" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            ← Back to Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link to="/services" className="text-sm font-medium text-brand-600 hover:text-brand-700">
        ← Back to Services
      </Link>

      {service.image && (
        <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
          <img src={service.image} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <h1 className="mt-8 text-3xl font-bold text-ink-900">{service.name}</h1>
      {service.category?.name && (
        <p className="mt-2 text-sm font-medium uppercase tracking-wide text-brand-600">{service.category.name}</p>
      )}
      <p className="mt-6 text-lg text-ink-500">{service.description || service.shortDescription}</p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          to="/get-a-quote"
          className="rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Get a Quote
        </Link>
        <Link
          to="/contact"
          className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-ink-900 hover:border-brand-600 hover:text-brand-600"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}
