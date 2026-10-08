import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../../components/Container'
import ServiceCard from '../../components/ServiceCard'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Reveal from '../../components/Reveal'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import { Sparkles, CheckCircle2, ShieldCheck, Truck, Layers, ArrowRight, Award } from 'lucide-react'
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
        title="Printing Services in Dubai, UAE | Commercial & Digital Press | ONPRINT"
        description="Professional printing services in Dubai, UAE. Custom packaging, business cards, corporate gifts, offset printing, digital press, luxury finishing. Al Quoz facility with fast turnaround."
        keywords="printing services dubai uae, commercial printing dubai, digital printing services dubai, custom packaging dubai, corporate printing uae, business card printing dubai"
        canonicalPath="/services"
        breadcrumbs={[{ name: 'Printing Services', url: '/services' }]}
      />

      <Container>
        <Breadcrumbs items={[{ name: 'Printing Services' }]} />

        {/* Page Header */}
        <div className="border-b border-border pb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            <span>COMMERCIAL PRINT SOLUTIONS</span>
          </div>
          <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Custom Packaging &amp; Printing Services in Dubai, UAE
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-secondary sm:text-base">
            From executive office stationery and luxury foil-stamped business cards to bespoke rigid packaging and large-format exhibition graphics, ONPRINT provides end-to-end commercial printing services across Dubai and the UAE with guaranteed color accuracy and ISO-certified quality.
          </p>
        </div>

        {/* Services Grid */}
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

        {/* Technical Capabilities & Print Specializations (High Word Count & SEO Rich) */}
        <div className="mt-20 border-t border-border pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-primary">
              Full-Spectrum In-House Printing Technology
            </h2>
            <p className="mt-3 text-sm text-secondary">
              Our state-of-the-art facility in Al Quoz, Dubai combines traditional German engineering with next-generation digital press technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent mb-5">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary mb-2">High-Volume Heidelberg Offset</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-secondary">
                Engineered for medium to high-run commercial print runs. Our multi-color Heidelberg presses deliver micro-registered dot reproduction, Pantone PMS spot color matching, and exceptional cost-efficiency for corporate brochures, catalogs, and product packaging.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-secondary">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  <span>Pantone Formula Guide Color Fidelity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  <span>500 to 500,000+ Unit Volume Scale</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent mb-5">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary mb-2">Precision Digital &amp; Variable Press</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-secondary">
                Fast-turnaround high-definition digital production for short runs, prototype proofing, and personalized collateral. Featuring ultra-fine toner technology capable of rendering crisp 1200 DPI typography, barcodes, and variable data QR codes.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-secondary">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  <span>Same-Day &amp; Express 24h Turnaround</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  <span>Short-Run Prototype Packaging &amp; Samples</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary mb-2">Luxury Embellishments &amp; Finishes</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-secondary">
                Transform standard paper into high-tactile luxury statements. In-house hot foil stamping (metallic gold, silver, copper, holographic), raised Spot UV varnishing, blind debossing, painted gilded edges, and soft-touch velvet lamination.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-secondary">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  <span>24K Metallic Gold &amp; Silver Foiling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  <span>3D Raised Dimensional Gloss Spot UV</span>
                </li>
              </ul>
            </div>
          </div>

          {/* UAE Delivery and Service Coverage */}
          <div className="mt-12 rounded-3xl bg-surface-dark border border-slate-800 p-8 sm:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 border border-accent/30 px-3 py-1 text-xs font-bold text-accent mb-3">
                  <Truck className="h-3.5 w-3.5" />
                  <span>UAE-WIDE LOGISTICS &amp; DELIVERY</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Express Commercial Dispatch Across Dubai &amp; All 7 Emirates
                </h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-2xl">
                  We offer dedicated courier dispatch and same-day delivery throughout Dubai (DIFC, Business Bay, Downtown, Dubai Marina, JLT, Al Quoz, Deira) and next-day distribution to Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain.
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <Link
                  to="/get-a-quote"
                  className="inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent-hover px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all"
                >
                  <span>Request Custom Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
