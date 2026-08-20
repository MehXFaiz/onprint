import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ShieldCheck, Clock, Sparkles, Layers, ArrowRight } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import { getServiceBySlug } from '../../services/services'
import { getProductImage } from '../../assets/productImages'
import { trackViewServices, trackGetQuoteClick, trackProductInquiry } from '../../utils/analytics'

const standardFeatures = [
  'Prepress artwork verification & CMYK bleed check',
  'FSC-certified sustainable paper & card stocks',
  'Precision color matching to Pantone specifications',
  'Custom finishes: Embossing, Debossing, Foil, UV, Lamination',
  'Express production & doorstep UAE dispatch',
]

const serviceFaqs = {
  'digital-offset-printing': [
    { question: 'What is the difference between digital and offset printing?', answer: 'Digital printing is ideal for short runs and fast turnaround times without plate setup fees. Offset printing is cost-effective for large commercial runs and offers exceptional Pantone color accuracy.' },
    { question: 'What is the fastest turnaround available for digital printing in Dubai?', answer: 'We offer express 24-hour and same-day turnaround for digital printing orders in Dubai once artwork proof is approved.' }
  ],
  'luxury-packaging-custom-boxes': [
    { question: 'Can you produce custom dimensions for rigid gift boxes?', answer: 'Yes, all our packaging boxes are fully custom engineered according to your exact product dimensions, insert requirements, and closure preferences.' },
    { question: 'What luxury finishes can be added to custom boxes?', answer: 'Options include soft-touch velvet lamination, hot foil stamping (gold, silver, rose gold), spot UV gloss, blind embossing, magnetic closures, and custom EVA foam inserts.' }
  ]
}

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
        trackViewServices({ service_name: data.name, service_slug: data.slug })
      })
      .catch(() => setStatus('error'))
  }, [slug])

  if (status === 'loading') return <LoadingState label="Loading service details…" />
  if (status === 'error' || !service) {
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

  const customFaqs = serviceFaqs[slug] || [
    { question: `How long does ${service.name} take in Dubai?`, answer: 'Standard production takes 2 to 4 business days. Urgent rush production is available upon request.' },
    { question: 'Can I request custom material samples?', answer: 'Yes, our Al Quoz print facility provides physical sample swatches and digital prepress proofs for all corporate orders.' }
  ]

  return (
    <div className="py-16 sm:py-24">
      {/* SEO Head & Structured Data */}
      <SEOHead
        title={service.seoTitle || `${service.name} in Dubai | ONPRINT`}
        description={service.seoDescription || service.description || service.shortDescription}
        keywords={service.seoKeywords || `${service.name.toLowerCase()} dubai, printing services dubai, custom printing uae`}
        canonicalPath={`/services/${service.slug}`}
        service={service}
        faqList={customFaqs}
        breadcrumbs={[
          { name: 'Printing Services', url: '/services' },
          { name: service.name, url: `/services/${service.slug}` },
        ]}
      />

      <Container className="max-w-5xl">
        <Breadcrumbs
          items={[
            { name: 'Printing Services', path: '/services' },
            { name: service.name },
          ]}
        />

        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Print Services
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
              {service.seoHeading || service.name}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-secondary sm:text-lg">
              {service.description || service.shortDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                to="/get-a-quote"
                variant="accent"
                size="lg"
                onClick={() => trackGetQuoteClick({ source_page: 'service_detail', product_name: service.name })}
              >
                Request Quote for {service.name}
              </Button>
              <Button
                to="/contact"
                variant="secondary"
                size="lg"
                onClick={() => trackProductInquiry({ source_page: 'service_detail', service_name: service.name })}
              >
                Inquire With Studio
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
              <div className="aspect-[4/3] overflow-hidden bg-accent-soft">
                <img
                  src={getProductImage(service)}
                  alt={service.imageAlt || `${service.name} in Dubai`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-primary">Service Guarantee</h3>
                <div className="mt-4 space-y-3 text-xs font-semibold text-secondary">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span>Calibrated Pantone Color Proofing</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-accent" />
                    <span>Express UAE Turnaround Available</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Layers className="h-4 w-4 text-accent" />
                    <span>Premium FSC-Certified Paper Stocks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Capabilities Grid */}
        <div className="mt-16 rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-12">
          <h2 className="font-display text-2xl font-bold tracking-tight text-primary">Production Specifications &amp; Quality Assurances</h2>
          <p className="mt-2 text-sm text-secondary">Delivered with precision across every press run in Dubai.</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {standardFeatures.map((feature) => (
              <div key={feature} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                <span className="text-sm font-semibold text-primary">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service FAQs */}
        <div className="mt-12 rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-12">
          <h2 className="font-display text-xl font-bold tracking-tight text-primary">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-6 divide-y divide-border/60">
            {customFaqs.map((faq, index) => (
              <div key={index} className={index > 0 ? 'pt-6' : ''}>
                <h3 className="font-display text-base font-bold text-primary">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products CTA */}
        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-primary bg-primary p-8 text-background sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-xl font-bold text-background">Looking for custom products matching this service?</h3>
            <p className="mt-1 text-sm text-background/80">Explore our signature product catalog with instant price modifiers.</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-accent/90 shrink-0"
          >
            <span>Browse Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </div>
  )
}
