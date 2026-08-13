import { useEffect, useState } from 'react'
import Container from '../../components/Container'
import SectionHeading from '../../components/SectionHeading'
import ServiceCard from '../../components/ServiceCard'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Reveal from '../../components/Reveal'
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
    <div className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What We Offer"
          title="Full-service printing, built to spec."
          subtitle="From everyday stationery to large-format signage, ONPRINT covers every printing need — with the finishing to match."
        />

        <div className="mt-16">
          {services === null && !error && <LoadingState label="Loading services…" />}
          {error && <EmptyState title="Couldn't load services" note="Please try again shortly." />}
          {services?.length === 0 && <EmptyState title="No services available yet" note="Check back soon." />}
          {services && services.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Reveal key={service._id} delay={(index % 3) * 0.08}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
