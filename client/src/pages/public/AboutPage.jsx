import React from 'react'
import Container from '../../components/Container'
import SectionHeading from '../../components/SectionHeading'
import Reveal from '../../components/Reveal'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import { CornerMarks } from '../../components/PrintMarks'
import { ShieldCheck, Award, Zap, HeartHandshake, MapPin, Phone, Mail, Clock, CheckCircle2, Factory, Printer, Sparkles } from 'lucide-react'

const operationalHighlights = [
  { value: 'Al Quoz', label: 'Direct Production Pressroom', detail: 'In-house digital & offset facilities in Dubai' },
  { value: '80–600', suffix: ' GSM', label: 'Substrate Weights', detail: 'From lightweight flyers to heavy rigid board' },
  { value: '24–48h', label: 'Standard Digital Speed', detail: 'Express rush dispatch available for urgent needs' },
  { value: '7', suffix: ' Emirates', label: 'UAE-Wide Direct Logistics', detail: 'Doorstep delivery across all emirates' },
]

const values = [
  {
    icon: Award,
    title: 'Craft over shortcuts',
    description: 'Every single print job is inspected by hand for registration, bleed, and color accuracy before it leaves our press floor.',
  },
  {
    icon: Zap,
    title: 'Clarity over guesswork',
    description: 'You receive clear stock specifications, samples, transparent pricing, and confirmed dispatch timelines upfront.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliability over promises',
    description: 'When we commit to a production window and delivery schedule in Dubai or across the UAE, that commitment holds.',
  },
  {
    icon: HeartHandshake,
    title: 'Partnership over transactions',
    description: 'We act as an extension of your creative studio, corporate brand team, or retail operations, order after order.',
  },
]

const geoQuestions = [
  {
    id: 'who-is-onprint',
    question: 'Who is ONPRINT?',
    answer:
      'ONPRINT (also known as 0nprint) is a commercial printing, custom packaging, and physical branding press located in Al Quoz, Dubai, United Arab Emirates. Founded to deliver uncompromised print quality, ONPRINT operates in-house digital and offset printing equipment, serving corporate brands, agencies, and retail enterprises with calibrated color fidelity, luxury finishes, and dependable delivery.',
    keyPoints: [
      'Commercial printing press based in Al Quoz, Dubai',
      'Dual capability: Rapid digital printing & high-volume offset lithography',
      'Specialized in corporate collaterals',
    ],
  },
  {
    id: 'what-does-onprint-do',
    question: 'What does ONPRINT do?',
    answer:
      'ONPRINT produces high-precision physical print and packaging materials. Our core services include executive business card printing (cotton, silk, velvet with foil and spot UV), custom rigid boxes and retail product cartons, machine roll labels and stickers, marketing brochures, event roll-up banners, acrylic and outdoor signage, and branded corporate gifts and VIP presentation sets.',
    keyPoints: [
      'Commercial Print: Business cards, brochures, flyers, catalogs, presentation folders',
      'Packaging: Luxury rigid boxes, folding cartons, perfume and retail packaging',
      'Labels & Signage: Machine roll labels, die-cut stickers, rollup banners, acrylic signs',
      'Corporate Merchandise: Laser-engraved VIP sets, notebooks, drinkware, uniform apparel',
    ],
  },
  {
    id: 'where-does-onprint-operate',
    question: 'Where does ONPRINT operate?',
    answer:
      'ONPRINT operates its direct manufacturing and print facility at Al Quoz in Dubai, United Arab Emirates. We serve clients across all seven emirates, with fast localized dispatch to key Dubai business districts including DIFC, Business Bay, Downtown Dubai, Dubai Marina, Dubai World Trade Centre (DWTC), and Expo City Dubai, as well as regular corporate delivery to Abu Dhabi and Sharjah.',
    keyPoints: [
      'Pressroom Address: Al Quoz, Dubai, UAE',
      'Daily courier dispatch across Dubai, Abu Dhabi, and Sharjah',
      'Full logistics coverage across all 7 UAE Emirates',
    ],
  },
  {
    id: 'who-does-onprint-serve',
    question: 'Who does ONPRINT serve?',
    answer:
      'ONPRINT serves B2B commercial clients across the UAE, including multinational corporations, financial institutions, hospitality groups, luxury fashion and cosmetics retailers, creative design agencies, property developers, healthcare organizations, and high-growth startups requiring consistent brand color reproduction and high-grade tactile substrates.',
    keyPoints: [
      'Corporate & Financial: Annual reports, executive stationery, presentation collateral',
      'Luxury & Retail: Perfume boxes, cosmetics cartons, branded shopping bags',
      'Hospitality & Events: Event signage, rollups, banquet menus, exhibitor collateral',
      'Agencies & Studios: Exact CMYK/PMS color proofing for demanding brand designers',
    ],
  },
  {
    id: 'what-makes-onprint-different',
    question: 'What makes ONPRINT different?',
    answer:
      'Unlike online print aggregators that outsource production to unvetted third parties, ONPRINT owns and manages its press operations directly in Dubai. Every order passes through pre-flight artwork inspection by dedicated prepress technicians, multi-point color calibration (CMYK & Pantone PMS), and manual post-press finishing verification before dispatch. Clients work directly with print specialists who understand substrate weights, grain directions, foil dies, and dieline engineering.',
    keyPoints: [
      'Direct Press Floor: No middlemen or broker markups',
      'Prepress Engineering: Every artwork file is pre-flight checked before plating',
      'Tactile Finishes: In-house hot foil stamping, blind embossing, and 3D spot UV',
      'Guaranteed Schedules: Clear dispatch timelines with same-day and express options',
    ],
  },
]

export default function AboutPage() {
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About ONPRINT Dubai',
    description:
      'Information about ONPRINT, a commercial printing and physical branding press located in Al Quoz, Dubai, UAE.',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'ONPRINT',
      alternateName: '0nprint',
      url: 'https://0nprint.com',
      email: '0nprint183@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Al Quoz',
        addressLocality: 'Dubai',
        addressCountry: 'AE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 25.1328,
        longitude: 55.2348,
      },
    },
  }

  return (
    <div>
      <SEOHead
        title="About ONPRINT | Commercial Printing & Packaging Press in Dubai"
        description="Learn about ONPRINT (0nprint), Dubai’s commercial printing and custom packaging press in Al Quoz, Dubai. In-house digital & offset printing across the UAE."
        keywords="about onprint, 0nprint, printing press dubai, al quoz printing company, commercial printer uae, packaging manufacturer dubai"
        canonicalPath="/about"
        breadcrumbs={[{ name: 'About Us', url: '/about' }]}
        structuredData={aboutPageSchema}
      />

      {/* Hero Section */}
      <section className="border-b border-border bg-background py-16 sm:py-24 lg:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <Breadcrumbs items={[{ name: 'About Us' }]} />
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent shadow-xs">
              About ONPRINT Dubai
            </span>
            <h1 className="font-display mt-6 text-3xl font-extrabold leading-[1.08] tracking-tight text-primary sm:text-5xl lg:text-6xl">
              Commercial Printing Press &amp; Packaging Studio in Dubai
            </h1>
            <p className="mt-6 max-w-lg text-sm sm:text-base leading-relaxed text-secondary sm:text-lg">
              ONPRINT (0nprint) was established with a singular conviction: physical brand collateral — executive stationery, custom rigid packaging, product labels, and event signage — should communicate the true excellence of the brand it represents.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Button to="/contact" variant="accent" size="lg" className="text-center justify-center">
                Talk to Our Print Studio
              </Button>
              <Button to="/portfolio" variant="secondary" size="lg" className="text-center justify-center">
                View Past Projects
              </Button>
            </div>
          </div>

          <div className="relative mx-auto flex h-[320px] w-full max-w-xs sm:max-w-md items-center justify-center sm:h-[400px]">
            <CornerMarks className="absolute -left-2 -top-2 h-8 w-8 text-primary/40" />
            <CornerMarks className="absolute -bottom-2 -right-2 h-8 w-8 rotate-180 text-primary/40" />
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
              <div className="flex h-full flex-col justify-between p-8">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <span className="font-display text-lg font-extrabold text-primary">ONPRINT UAE</span>
                  <span className="text-xs font-bold text-accent">AL QUOZ FACILITY</span>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-secondary">Verified Operations</p>
                  <h2 className="font-display text-xl font-bold text-primary">In-House Digital &amp; Offset</h2>
                  <p className="text-sm text-secondary leading-relaxed">Direct press floor production in Dubai with calibrated color profiles, custom dielines, and certified paper stocks.</p>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs font-bold text-primary">
                  <span>CMYK / PANTONE PMS</span>
                  <span className="text-accent">DIRECT FACILITY</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Operational Highlights Section */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {operationalHighlights.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.08}>
                <div className="rounded-2xl border border-border bg-background p-6 shadow-xs">
                  <div className="font-display text-2xl sm:text-3xl font-black text-primary">
                    {item.value}
                    {item.suffix && <span className="text-accent text-xl">{item.suffix}</span>}
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-primary">{item.label}</h3>
                  <p className="mt-1 text-xs text-secondary leading-relaxed">{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Answer-First GEO Knowledge Architecture Section */}
      <section className="py-20 sm:py-28 bg-background border-b border-border">
        <Container className="max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Entity &amp; Business Intelligence
            </span>
            <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              Essential Facts About ONPRINT
            </h2>
            <p className="mt-3 text-base text-secondary">
              Direct, transparent answers regarding our identity, production capabilities, facility location, and customer standards.
            </p>
          </div>

          <div className="space-y-10">
            {geoQuestions.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 0.06}>
                <article id={item.id} className="rounded-2xl border border-border bg-surface p-8 shadow-xs hover:border-primary/40 transition-colors">
                  <header>
                    <span className="text-xs font-bold uppercase tracking-wider text-accent">Fact 0{idx + 1}</span>
                    <h3 className="font-display text-2xl font-extrabold text-primary mt-1">
                      {item.question}
                    </h3>
                  </header>
                  
                  {/* Direct Answer Snippet for Search & AI Engines */}
                  <div className="mt-4 rounded-xl border border-border/80 bg-background/80 p-5">
                    <p className="text-base leading-relaxed text-primary font-medium">
                      {item.answer}
                    </p>
                  </div>

                  {/* Bullet Summary Points */}
                  <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-secondary">
                    {item.keyPoints.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Verified NAP & Facility Location Card */}
      <section className="border-b border-border bg-surface py-16">
        <Container>
          <div className="rounded-2xl border border-border bg-background p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-1 space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">Direct Contact</span>
                <h3 className="font-display text-2xl font-black text-primary">
                  Visit or Contact ONPRINT Pressroom
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  Have a custom print specification or want to inspect stock swatches in person? Our print specialists are available on the press floor Monday through Saturday.
                </p>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span>Facility Location</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Al Quoz, Dubai, United Arab Emirates
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-accent">Serving all 7 Emirates</span>
                </div>

                <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span>Direct Quote Desk</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Fast Online Inquiries
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-accent">Quotes in 2 Hours</span>
                </div>

                <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Mail className="h-4 w-4 text-accent" />
                    <span>Email Inquiries</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    0nprint183@gmail.com
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-accent">Artwork proofing desk</span>
                </div>

                <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Clock className="h-4 w-4 text-accent" />
                    <span>Working Hours</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Mon–Sat: 8:30 AM – 6:30 PM<br />
                    Sunday: Closed
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-accent">Production runs 6 days/week</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Our Approach" title="Built on the press floor, not a broker desk." />
          <div className="space-y-6 text-base leading-relaxed text-secondary sm:text-lg">
            <p>
              ONPRINT was founded in Dubai on a straightforward premise: businesses deserve a print partner who treats their brand identity with genuine technical care. Not a faceless online form that routes files to unknown third parties — but a dedicated team that understands paper weights, tactile finishes, precise color calibration, and hard commercial deadlines.
            </p>
            <p>
              Our Al Quoz print facility houses digital presses, high-volume offset lithography, hot foil stamping, and precision die-cutting equipment. We serve everyone from new ventures needing their first run of executive business cards to corporate enterprises producing recurring luxury gift boxes.
            </p>
            <p>
              Every order moves through our disciplined production workflow: clear quotation, pre-flight file inspection, proof approval, multi-stage quality control, and protective packaging before dispatch across Dubai and the UAE.
            </p>
          </div>
        </Container>
      </section>

      {/* Core Values Grid */}
      <section className="border-t border-border bg-surface py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="What We Believe"
            title="The principles behind every single press run."
            subtitle="How we maintain consistent standards across every commercial print order in the UAE."
            center
          />

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {values.map((item, index) => {
              const Icon = item.icon
              const renderValueIcon = () => {
                if (!Icon) return null
                if (React.isValidElement(Icon)) return Icon
                if (typeof Icon === 'function' || typeof Icon === 'string' || (typeof Icon === 'object' && Icon !== null && Icon.$$typeof)) {
                  const IconComp = Icon
                  return <IconComp className="h-6 w-6" strokeWidth={1.75} />
                }
                return null
              }
              return (
                <Reveal key={item.title} delay={index * 0.08}>
                  <div className="flex gap-5 rounded-2xl border border-border bg-background p-8 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      {renderValueIcon()}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-primary">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-secondary">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>
    </div>
  )
}
