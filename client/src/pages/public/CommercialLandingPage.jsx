import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Container from '../../components/Container'
import Reveal from '../../components/Reveal'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import { COMMERCIAL_LANDING_PAGES } from '../../data/commercialLandingPagesData'
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Layers,
  Printer,
  ArrowRight,
  Phone,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Award,
} from 'lucide-react'

export default function CommercialLandingPage({ pageKey: propKey }) {
  const { pageSlug } = useParams()
  const activeKey = propKey || pageSlug || 'printing-services-dubai'
  const pageData = COMMERCIAL_LANDING_PAGES[activeKey] || COMMERCIAL_LANDING_PAGES['printing-services-dubai']

  const [openFaq, setOpenFaq] = useState(0)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index)
  }

  const breadcrumbs = [
    { name: 'Services', url: '/services' },
    { name: pageData.title.split('|')[0].trim(), url: pageData.path },
  ]

  const serviceSchemaData = {
    name: pageData.h1,
    description: pageData.metaDescription,
    image: '/logo_icon.png',
  }

  return (
    <div className="py-12 sm:py-20">
      <SEOHead
        title={pageData.title}
        description={pageData.metaDescription}
        keywords={pageData.secondaryKeywords}
        canonicalPath={pageData.path}
        breadcrumbs={breadcrumbs}
        faqList={pageData.faqs}
        service={serviceSchemaData}
      />

      <Container>
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <div className="mt-4 border-b border-border pb-12">
          <Reveal>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{pageData.badge}</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl">
              {pageData.h1}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-secondary sm:text-lg">
              {pageData.subheading}
            </p>
          </Reveal>

          {/* Quick CTA Actions */}
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/get-a-quote"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-accent/90 hover:shadow-lg active:scale-[0.98]"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`https://wa.me/971551837995?text=Hello%20ONPRINT%20Dubai,%20I%20am%20inquiring%20about%20${encodeURIComponent(pageData.h1)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-600 transition-all duration-200 hover:bg-emerald-500/20 active:scale-[0.98]"
              >
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                <span>WhatsApp Concierge (+971 55 183 7995)</span>
              </a>
            </div>
          </Reveal>

          {/* Key Stats Bar */}
          <Reveal delay={0.2}>
            <div className="mt-10 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface-alt/50 p-4 sm:grid-cols-4 sm:p-6">
              {pageData.stats.map((stat, idx) => (
                <div key={idx} className="text-center sm:text-left">
                  <div className="text-xs font-semibold uppercase tracking-wider text-tertiary">{stat.label}</div>
                  <div className="mt-1 text-base font-bold text-primary sm:text-lg">{stat.value}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Highlights & Capabilities */}
        <section className="py-14 sm:py-18">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Engineered for Commercial Precision &amp; Brand Consistency
              </h2>
              <p className="mt-2 text-sm text-secondary sm:text-base">
                Discover why corporate brands, design agencies, and luxury retailers across the UAE partner with ONPRINT.
              </p>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pageData.highlights.map((hl, idx) => (
              <Reveal key={idx} delay={idx * 0.05}>
                <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-200 hover:border-accent/40 hover:shadow-md">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      {idx === 0 && <Printer className="h-5 w-5" />}
                      {idx === 1 && <Layers className="h-5 w-5" />}
                      {idx === 2 && <ShieldCheck className="h-5 w-5" />}
                      {idx === 3 && <Award className="h-5 w-5" />}
                    </div>
                    <h3 className="mt-4 font-semibold text-primary">{hl.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-secondary sm:text-sm">{hl.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Technical Specifications Matrix */}
        <section className="border-t border-border py-14 sm:py-18">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">TECHNICAL SPECIFICATIONS</span>
              <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Materials, Finishes &amp; Production Matrix
              </h2>
              <p className="mt-2 text-sm text-secondary sm:text-base">
                Rigorous manufacturing standards configured to satisfy ISO 12647-2 color fidelity and Dubai ESMA regulatory criteria.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              <div className="divide-y divide-border">
                {pageData.technicalSpecs.map((spec, idx) => (
                  <div key={idx} className="grid grid-cols-1 p-4 transition-colors hover:bg-surface-alt/40 sm:grid-cols-3 sm:p-5">
                    <div className="font-semibold text-primary sm:col-span-1">{spec.feature}</div>
                    <div className="mt-1 text-sm text-secondary sm:col-span-2 sm:mt-0">{spec.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* Production & Dispatch Workflow */}
        <section className="border-t border-border py-14 sm:py-18">
          <Reveal>
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">PRODUCTION WORKFLOW</span>
              <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                How Your Order Moves from Concept to Doorstep
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-secondary sm:text-base">
                Transparent 4-step B2B fulfillment managed directly inside our Al Quoz Industrial Area 3 facility.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal delay={0.05}>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-white">
                  01
                </div>
                <h3 className="mt-4 font-bold text-primary">File Check &amp; Pre-Press</h3>
                <p className="mt-2 text-xs leading-relaxed text-secondary sm:text-sm">
                  Our pre-press team audits vector resolution, CMYK profiles, bleed lines, and dieline tolerances with zero file-prep fees.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-white">
                  02
                </div>
                <h3 className="mt-4 font-bold text-primary">Soft or Hard Proofing</h3>
                <p className="mt-2 text-xs leading-relaxed text-secondary sm:text-sm">
                  Review digital PDF contract proofs or physical CAD unprinted box dummies at our Al Quoz press before press calibration.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-white">
                  03
                </div>
                <h3 className="mt-4 font-bold text-primary">Precision Press Run</h3>
                <p className="mt-2 text-xs leading-relaxed text-secondary sm:text-sm">
                  High-capacity Heidelberg offset or HP Indigo digital press run followed by automated lamination, die-cutting, or foil stamping.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-white">
                  04
                </div>
                <h3 className="mt-4 font-bold text-primary">UAE Doorstep Dispatch</h3>
                <p className="mt-2 text-xs leading-relaxed text-secondary sm:text-sm">
                  Quality check, protective shrink-wrapping, and courier dispatch across Dubai, DIFC, DWTC, Abu Dhabi, and Sharjah.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Local Logistics & Al Quoz Facility Note */}
        <section className="rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-alt/60 p-8 sm:p-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                <MapPin className="h-4 w-4" />
                <span>DUBAI PRODUCTION &amp; FULFILLMENT HUB</span>
              </div>
              <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Al Quoz Industrial Area 3 Logistics
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-secondary sm:text-base">
                Strategically positioned in Al Quoz 3 with rapid highway connectivity to Sheikh Zayed Road and Al Khail Road. We offer scheduled client walk-ins for material inspection, paper swatch selection, and emergency same-day pickups.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-secondary sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  Courier dispatch to DIFC &amp; Downtown in 30 mins
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  Direct trade show delivery to DWTC &amp; Expo City
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  Inter-emirate shipping to Abu Dhabi &amp; Sharjah
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="https://maps.google.com/?q=Al+Quoz+Industrial+Area+3+Dubai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-primary transition hover:bg-surface-alt"
              >
                <MapPin className="h-4 w-4 text-accent" />
                <span>View on Google Maps</span>
              </a>
              <a
                href="https://wa.me/971551837995?text=Hello%20ONPRINT%20Dubai,%20I%20am%20inquiring%20about%20commercial%20printing%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Contact on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* Direct Answers & FAQ Accordion (FAQPage Schema Synced) */}
        <section className="py-14 sm:py-18">
          <Reveal>
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">FREQUENTLY ASKED QUESTIONS</span>
              <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Direct Answers &amp; Commercial Printing Guidance
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-secondary sm:text-base">
                Everything corporate procurement managers, marketing directors, and business owners need to know before ordering.
              </p>
            </div>
          </Reveal>

          <div className="mx-auto mt-10 max-w-3xl divide-y divide-border">
            {pageData.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={idx} className="py-5">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-start justify-between gap-4 text-left font-semibold text-primary transition hover:text-accent"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg">{faq.question}</span>
                    <span className="mt-1 flex-shrink-0 text-secondary">
                      {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="mt-3 pr-8 text-sm leading-relaxed text-secondary sm:text-base">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Internal Contextual Linking Architecture */}
        {pageData.relatedServices && pageData.relatedServices.length > 0 && (
          <section className="border-t border-border py-12">
            <div className="text-center">
              <h3 className="font-display text-lg font-bold text-primary sm:text-xl">
                Explore Related Printing &amp; Packaging Services in Dubai
              </h3>
              <p className="mt-1 text-xs text-secondary sm:text-sm">
                Complementary branding, packaging, and commercial press capabilities.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {pageData.relatedServices.map((rel, idx) => (
                <Link
                  key={idx}
                  to={rel.path}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-primary transition hover:border-accent hover:text-accent sm:text-sm"
                >
                  <span>{rel.name}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-accent-soft px-4 py-2.5 text-xs font-semibold text-accent transition hover:bg-accent hover:text-white sm:text-sm"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        )}

        {/* Final Conversion Quote Banner */}
        <section className="mt-8 rounded-3xl bg-primary p-8 text-white shadow-xl sm:p-12">
          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">READY TO ORDER?</span>
              <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
                Get a Fast Custom Print Quote for Your Dubai Business
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                Upload your artwork or share your project requirements. Our commercial estimators respond within 60 minutes with detailed per-unit pricing, substrate samples, and delivery timelines.
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                to="/get-a-quote"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-accent/90 active:scale-[0.98]"
              >
                <span>Submit Quote Request</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/971551837995?text=Hello%20ONPRINT%20Dubai,%20I%20need%20an%20urgent%20quote."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20 active:scale-[0.98]"
              >
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </Container>
    </div>
  )
}
