import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ShieldCheck, Clock, Sparkles } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import { getServiceBySlug } from '../../services/services'
import { getProductImage } from '../../assets/productImages'

const standardFeatures = [
  'Prepress artwork verification & CMYK bleed check',
  'FSC-certified sustainable paper & card stocks',
  'Precision color matching to Pantone specifications',
  'Custom finishes: Embossing, Debossing, Foil, UV, Lamination',
  'Express production & doorstep UAE dispatch',
]

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

  if (status === 'loading') return <LoadingState label="Loading service details…" />
  if (status === 'error') {
    return (
      <Container className="py-24">
        <EmptyState title="Service not found" note="It may have been updated or relocated." />
        <div className="mt-6 text-center">
          <Button to="/services" variant="outline" icon={false}>
            ← Return to Services Catalog
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-5xl">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        {/* Hero Card */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            {service.category?.name && (
              <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                {service.category.name}
              </span>
            )}
            <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
              {service.name}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-secondary sm:text-lg">
              {service.description || service.shortDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/get-a-quote" variant="accent" size="lg">
                Request Quote for {service.name}
              </Button>
              <Button to="/contact" variant="secondary" size="lg">
                Ask Questions
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
              {service ? (
                <div className="aspect-[4/3] overflow-hidden bg-accent-soft">
                  <img src={getProductImage(service)} alt={service.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-accent-soft p-8 text-center">
                  <Sparkles className="h-12 w-12 text-accent" strokeWidth={1.5} />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-primary">Service Guarantee</h3>
                <div className="mt-4 space-y-3 text-xs font-semibold text-secondary">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span>Calibrated Color Proofing</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-accent" />
                    <span>Express Turnaround Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Capabilities Grid */}
        <div className="mt-16 rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-12">
          <h2 className="font-display text-2xl font-bold tracking-tight text-primary">What’s Included</h2>
          <p className="mt-2 text-sm text-secondary">Standard quality assurances delivered with every production run.</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {standardFeatures.map((feature) => (
              <div key={feature} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                <span className="text-sm font-semibold text-primary">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

