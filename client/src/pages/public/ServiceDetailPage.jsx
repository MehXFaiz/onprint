import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Layers,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Sliders,
  Users,
  Workflow,
  HelpCircle,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import { getServiceBySlug } from '../../services/services'
import { getProductImage } from '../../assets/productImages'
import { trackViewServices, trackGetQuoteClick, trackProductInquiry } from '../../utils/analytics'
import { getServiceSectionEData } from '../../data/serviceGeoContent'

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const [service, setService] = useState(null)
  const [status, setStatus] = useState('loading')
  const [mockupTilt, setMockupTilt] = useState({ x: 0, y: 0 })

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

  const sectionE = getServiceSectionEData(service, slug)

  const handleMockupMove = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    setMockupTilt({ x: y * -5, y: x * 7 })
  }

  const resetMockup = () => setMockupTilt({ x: 0, y: 0 })

  return (
    <div className="py-16 sm:py-24">
      {/* SEO Head & Structured Data (Includes FAQPage and Service Schemas) */}
      <SEOHead
        title={service.seoTitle || `${service.name} in Dubai | ONPRINT`}
        description={service.seoDescription || sectionE.intro.slice(0, 160)}
        keywords={service.seoKeywords || `${service.name.toLowerCase()} dubai, commercial printing dubai, custom packaging uae`}
        canonicalPath={`/services/${service.slug}`}
        service={service}
        faqList={sectionE.faqs}
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

        {/* ========================================================================= */}
        {/* SECTION E: 1. H1 & 2. Intro (What it is, who it is for, why ONPRINT)       */}
        {/* ========================================================================= */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            {service.category?.name && (
              <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                {service.category.name}
              </span>
            )}

            {/* H1: Target keyword + Dubai/UAE */}
            <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
              {sectionE.h1}
            </h1>

            {/* Intro: Answer-first direct factual summary */}
            <div className="mt-6 rounded-2xl bg-neutral-50/90 border border-neutral-200/80 p-5 text-sm sm:text-base leading-relaxed text-neutral-800">
              <p>{sectionE.intro}</p>
            </div>

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
              <div
                className="product-mockup-stage group/mockup relative aspect-[4/3] overflow-hidden bg-[#e9e5df]"
                onPointerMove={handleMockupMove}
                onPointerLeave={resetMockup}
              >
                <img
                  src={getProductImage(service)}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover opacity-25 blur-[1px]"
                  loading="lazy"
                />
                <div
                  className="product-mockup-object absolute inset-[9%] flex items-center justify-center"
                  style={{
                    transform: `perspective(900px) rotateX(${mockupTilt.x}deg) rotateY(${mockupTilt.y}deg)`,
                  }}
                >
                  <div className="product-mockup-shadow absolute inset-[5%] rounded-2xl bg-black/30 blur-xl" />
                  <div className="product-mockup-face relative h-full w-full overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[12px_18px_30px_rgba(0,0,0,0.25)]">
                    <img
                      src={getProductImage(service)}
                      alt={service.imageAlt || `${service.name} in Dubai`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-black/15" />
                  </div>
                  <div className="product-mockup-edge absolute right-[-2%] top-[6%] h-[88%] w-[5%] rounded-r-lg bg-[#c8c0b7]" />
                </div>
                <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full border border-white/60 bg-white/85 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-black/65 shadow-sm backdrop-blur-md">
                  3D product view
                </span>
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
                    <span>Express UAE Turnaround (24–48 Hours)</span>
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

        {/* ========================================================================= */}
        {/* SECTION E: 3. H2: What ONPRINT Provides                                   */}
        {/* ========================================================================= */}
        <div className="mt-16 rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-2">
            <ShieldCheck className="h-4 w-4" /> Production Capabilities
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            What ONPRINT Provides
          </h2>
          <p className="mt-2 text-sm text-secondary max-w-2xl">
            Commercial manufacturing built on industrial reliability, color precision, and bespoke finishing.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sectionE.whatProvides.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-4 shadow-2xs">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                <span className="text-sm font-semibold text-primary leading-snug">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION E: 4. H2: Available Options (materials, sizes, finishes)          */}
        {/* ========================================================================= */}
        <div className="mt-12 rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-2">
            <Sliders className="h-4 w-4" /> Customization Spectrum
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Available Options
          </h2>
          <p className="mt-2 text-sm text-secondary max-w-2xl">
            Tailor every specification to your brand aesthetic, functional requirements, and target quantity.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Materials */}
            <div className="rounded-xl border border-border/70 bg-neutral-50/60 p-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-3">
                Materials &amp; Substrates
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-800 font-medium">
                {sectionE.availableOptions.materials.map((mat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sizes */}
            <div className="rounded-xl border border-border/70 bg-neutral-50/60 p-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-3">
                Sizes &amp; Dimensions
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-800 font-medium">
                {sectionE.availableOptions.sizes.map((sz, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                    <span>{sz}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Finishes */}
            <div className="rounded-xl border border-border/70 bg-neutral-50/60 p-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-3">
                Finishes &amp; Embellishments
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-800 font-medium">
                {sectionE.availableOptions.finishes.map((fn, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                    <span>{fn}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION E: 5. H2: Who Uses This Service (industries, use cases)           */}
        {/* ========================================================================= */}
        <div className="mt-12 rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-2">
            <Users className="h-4 w-4" /> Commercial Target Audiences
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Who Uses This Service
          </h2>
          <p className="mt-2 text-sm text-secondary max-w-2xl">
            Trusted by diverse organizations across the UAE for premium print execution and brand consistency.
          </p>

          <div className="mt-6 space-y-3">
            {sectionE.whoUses.map((aud, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-background border border-border/60 text-xs sm:text-sm font-semibold text-neutral-800">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-xs">
                  {i + 1}
                </span>
                <span>{aud}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION E: 6. H2: How the ONPRINT Process Works (order, proof, print, deliver) */}
        {/* ========================================================================= */}
        <div className="mt-12 rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-2">
            <Workflow className="h-4 w-4" /> Streamlined Turnaround
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            How the ONPRINT Process Works
          </h2>
          <p className="mt-2 text-sm text-secondary max-w-2xl">
            Our frictionless 4-step commercial printing workflow guarantees precision from proofing to dispatch.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sectionE.processSteps.map((step) => (
              <div key={step.step} className="rounded-xl border border-border/70 bg-neutral-50/50 p-5 relative">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white font-mono font-bold text-xs mb-3">
                  0{step.step}
                </span>
                <h3 className="font-display text-sm font-bold text-neutral-900 mb-1.5">{step.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION E: 7. H2: Artwork Requirements (formats, resolution, bleed, color) */}
        {/* ========================================================================= */}
        <div className="mt-12 rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-2">
            <FileCheck className="h-4 w-4" /> Prepress Guidelines
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Artwork Requirements
          </h2>
          <p className="mt-2 text-sm text-secondary max-w-2xl">
            Adhere to these commercial prepress standards to ensure crisp output and prevent delays.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-border/70 bg-neutral-50/60 p-4">
              <span className="font-bold text-neutral-900 block mb-1">Accepted File Formats</span>
              <p className="text-neutral-600">{sectionE.artworkRequirements.formats}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-neutral-50/60 p-4">
              <span className="font-bold text-neutral-900 block mb-1">Resolution</span>
              <p className="text-neutral-600">{sectionE.artworkRequirements.resolution}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-neutral-50/60 p-4">
              <span className="font-bold text-neutral-900 block mb-1">Bleed &amp; Safety Margin</span>
              <p className="text-neutral-600">{sectionE.artworkRequirements.bleed}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-neutral-50/60 p-4">
              <span className="font-bold text-neutral-900 block mb-1">Color Mode &amp; Profiling</span>
              <p className="text-neutral-600">{sectionE.artworkRequirements.colorMode}</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION E: 8. H2: Frequently Asked Questions                              */}
        {/* ========================================================================= */}
        <div className="mt-12 rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-2">
            <HelpCircle className="h-4 w-4" /> GEO / AEO Questions &amp; Answers
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-6 divide-y divide-border/60">
            {sectionE.faqs.map((faq, index) => (
              <div key={index} className={index > 0 ? 'pt-6' : ''}>
                <h3 className="font-display text-base font-bold text-primary">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION E: 9. H2: Request a Quote (Clear CTA with contact details)         */}
        {/* ========================================================================= */}
        <div className="mt-12 rounded-2xl border border-neutral-900 bg-neutral-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent mb-3">
                Immediate Estimates &amp; Studio Consultation
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white">
                Request a Quote
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed">
                Connect with our Al Quoz print specialists for tailored pricing, substrate physical swatches, and express delivery arrangements across the UAE.
              </p>

              {/* Direct NAP Details */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-accent shrink-0" />
                  <span>{sectionE.requestQuote.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-accent shrink-0" />
                  <span>{sectionE.requestQuote.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-accent shrink-0" />
                  <span>{sectionE.requestQuote.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-accent shrink-0" />
                  <span>{sectionE.requestQuote.turnaround}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <Button
                to="/get-a-quote"
                variant="accent"
                size="lg"
                onClick={() => trackGetQuoteClick({ source_page: 'service_detail_cta', product_name: service.name })}
                className="w-full text-center"
              >
                Configure Custom Quote
              </Button>
              <a
                href={`https://wa.me/971551837995?text=Hello%20ONPRINT%20Dubai%2C%20I%20would%20like%20a%20commercial%20quote%20for%20${encodeURIComponent(service.name)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-base font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
              >
                <span>WhatsApp Quote</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Related Products Catalog Link */}
        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-accent transition-colors"
          >
            <span>Explore Complementary Products in Our Store Catalog</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Container>
    </div>
  )
}
