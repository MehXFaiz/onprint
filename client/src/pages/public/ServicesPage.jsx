import { useEffect, useState } from 'react'
import SectionHeading from '../../components/SectionHeading'
import ServiceCard from '../../components/ServiceCard'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import { getServices } from '../../services/services'

export default function ServicesPage() {
  const [services, setServices] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch(() => setError(true))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="What We Offer"
        title="Our Services"
        subtitle="Full-service printing for businesses, brands and individuals — from everyday stationery to large-format signage."
      />

      <div className="mt-12">
        {services === null && !error && <LoadingState label="Loading services…" />}
        {error && <EmptyState title="Couldn't load services" note="Please try again shortly." />}
        {services?.length === 0 && <EmptyState title="No services available yet" note="Check back soon." />}
        {services && services.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
