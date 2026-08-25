import { useEffect, useState } from 'react'
import Container from '../../components/Container'
import ServiceCard from '../../components/ServiceCard'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Reveal from '../../components/Reveal'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import { Sparkles } from 'lucide-react'
import { getServices } from '../../services/services'
import { trackViewServices } from '../../utils/analytics'

export default function ServicesPage() {
  const [services, setServices] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    trackViewServices({ service_name: 'All Services', service_slug: 'services' })

    getServices()
      .then(setServices)
      .catch(() => setError(true))
  }, [])

  return (
    <div className="py-16 sm:py-24">
      <SEOHead
        title="Printing Services Dubai | Commercial & Digital Printing Press | ONPRINT"
        description="Comprehensive printing services in Dubai. High-volume offset printing, express digital press, luxury packaging, corporate gifts, stickers, and exhibition displays."
        keywords="printing services dubai, commercial printing dubai, digital printing dubai, offset printing dubai, packaging printing dubai"
        canonicalPath="/services"
        breadcrumbs={[{ name: 'Printing Services', url: '/services' }]}
      />

      <Container>
        <Breadcrumbs items={[{ name: 'Printing Services' }]} />

        <div className="border-b border-border pb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            <span>COMMERCIAL PRINT SOLUTIONS</span>
          </div>
          <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Commercial &amp; Digital Printing Services in Dubai
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">
            From executive office stationery and bespoke luxury packaging to large-format exhibition signage, ONPRINT covers every commercial printing need in Dubai with guaranteed color fidelity and precision finishing.
          </p>
        </div>

        <div className="mt-12">
          {services === null && !error && <LoadingState label="Loading printing services…" />}
          {error && <EmptyState title="Couldn't load services" note="Please try again shortly." />}
          {services?.length === 0 && <EmptyState title="No services available yet" note="Check back soon." />}
          {services && services.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service, index) => (
                <Reveal key={service._id || service.slug} delay={(index % 4) * 0.05} className="h-full">
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
