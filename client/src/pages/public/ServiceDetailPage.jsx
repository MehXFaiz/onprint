import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
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
      <Container className="py-24">
        <EmptyState title="Service not found" note="It may have been removed or renamed." />
        <div className="mt-6 text-center">
          <Link to="/services" className="text-sm font-semibold text-accent hover:text-accent-hover">
            ← Back to Services
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <div className="py-20 sm:py-28">
      <Container className="max-w-4xl">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        {service.image && (
          <div className="mt-8 aspect-[16/9] overflow-hidden border border-border bg-accent-soft">
            <img src={service.image} alt="" className="h-full w-full object-cover" />
          </div>
        )}

        {service.category?.name && (
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{service.category.name}</p>
        )}
        <h1 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          {service.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-secondary">
          {service.description || service.shortDescription}
        </p>

        <div className="mt-12 flex flex-wrap gap-5 border-t border-border pt-10">
          <Button to="/get-a-quote" variant="accent">
            Get a Quote
          </Button>
          <Button to="/contact" variant="outline" icon={false}>
            Contact Us
          </Button>
        </div>
      </Container>
    </div>
  )
}
