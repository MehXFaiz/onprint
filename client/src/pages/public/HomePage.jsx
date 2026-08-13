import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Award, Users, CheckCircle, Sparkles } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import ArrowLink from '../../components/ArrowLink'
import SectionHeading from '../../components/SectionHeading'
import Reveal from '../../components/Reveal'
import StatCounter from '../../components/StatCounter'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import ServiceCard from '../../components/ServiceCard'
import ProductCard from '../../components/ProductCard'
import { CornerMarks } from '../../components/PrintMarks'
import { getServices } from '../../services/services'
import { getProducts } from '../../services/products'

const trustBadges = [
  { label: 'Precision Offset & Digital Print', icon: ShieldCheck },
  { label: 'Express Turnaround Dubai', icon: Zap },
  { label: 'Custom Luxury Finishes', icon: Award },
  { label: 'Trusted by 500+ UAE Brands', icon: Users },
]

const whyUs = [
  {
    title: 'Flawless Precision',
    description: 'Calibrated color management systems ensure true-to-brand color consistency from screen to paper.',
  },
  {
    title: 'Premium Materials',
    description: 'Curated selection of FSC-certified card stocks, luxury foils, soft-touch laminates, and textured papers.',
  },
  {
    title: 'Rapid Production',
    description: 'State-of-the-art print presses in Dubai delivering tight deadlines without compromising detail.',
  },
  {
    title: 'End-to-End Craft',
    description: 'Dedicated print specialists guiding your specs, artwork pre-flight, and finishing requirements.',
  },
]

const processSteps = [
  { step: '01', title: 'Consultation & Spec', description: 'Select your stock, dimensions, finishes, and quantity with instant quote clarity.' },
  { step: '02', title: 'Pre-flight Artwork', description: 'Our prepress studio inspects bleed, resolution, and CMYK color profiles.' },
  { step: '03', title: 'Press Production', description: 'Printed on high-precision offset and digital presses with multi-stage quality control.' },
  { step: '04', title: 'Inspected & Delivered', description: 'Hand-checked, packaged in protective covers, and delivered straight to your door.' },
]

const stats = [
  { value: 10, suffix: '+', label: 'Years Experience' },
  { value: 500, suffix: '+', label: 'UAE Corporate Clients' },
  { value: 1500, suffix: '+', label: 'Print Runs Delivered' },
  { value: 99, suffix: '%', label: 'On-Time Dispatch Rate' },
]

export default function HomePage() {
  const [services, setServices] = useState(null)
  const [products, setProducts] = useState(null)

  useEffect(() => {
    getServices()
      .then((data) => setServices(data.slice(0, 6)))
      .catch(() => setServices([]))

    getProducts({ featured: true })
      .then((res) => setProducts(res.data.slice(0, 4)))
      .catch(() => setProducts([]))
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-background py-16 sm:py-24 lg:py-32">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Dubai’s Premier Print &amp; Creative Studio
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display mt-6 text-4xl font-extrabold leading-[1.02] tracking-tight text-primary sm:text-6xl xl:text-7xl">
                DIGITAL PRECISION.
                <br />
                <span className="text-accent">PHYSICAL CRAFT.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-secondary sm:text-lg">
                ONPRINT transforms brand identities into tangible physical masterpieces. From bespoke corporate gifts and executive stationery to high-volume luxury packaging and signage.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
                <Button to="/get-a-quote" variant="accent" size="lg">
                  Request a Custom Quote
                </Button>
                <Button to="/products" variant="secondary" size="lg">
                  Browse Catalog
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-border/80 pt-6 text-xs font-semibold text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Free Design Pre-flight</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Express Same-Day Printing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Doorstep UAE Delivery</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Hero Visual Studio Showcase */}
          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <div className="relative mx-auto flex h-[360px] w-full max-w-md items-center justify-center sm:h-[440px]">
                <CornerMarks className="absolute -left-3 -top-3 h-8 w-8 text-primary/40" />
                <CornerMarks className="absolute -bottom-3 -right-3 h-8 w-8 rotate-180 text-primary/40" />

                {/* Back card: Soft finish stock */}
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: -6 }}
                  animate={{ opacity: 1, y: 0, rotate: -6 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-2 top-4 flex h-64 w-44 flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-xl sm:h-72 sm:w-52"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {['#00AEEF', '#EC008C', '#FFF200', '#101010'].map((c) => (
                        <span key={c} className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">CMYK 350GSM</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 rounded bg-primary/10" />
                    <div className="h-2 w-1/2 rounded bg-primary/10" />
                    <div className="h-2 w-5/6 rounded bg-accent/20" />
                  </div>
                  <div className="rounded-lg bg-accent-soft p-2.5 text-center text-xs font-bold text-accent">
                    EMBOSSED FOIL
                  </div>
                </motion.div>

                {/* Front card: ONPRINT Dark Primary card */}
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: 5 }}
                  animate={{ opacity: 1, y: 0, rotate: 5 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-20 flex h-48 w-68 flex-col justify-between rounded-2xl border border-primary bg-primary p-6 shadow-2xl sm:right-2 sm:top-24 sm:w-72"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-extrabold tracking-tight text-background">
                      ON<span className="text-accent">PRINT</span>
                    </span>
                    <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">STUDIO</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-background/70">CORPORATE GIFTING &amp; PRESS</p>
                    <p className="mt-1 text-sm font-bold text-background">Precision Printing Dubai</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-background/15 pt-3 text-[10px] font-semibold text-background/60">
                    <span>JOB ID: #OP-9824</span>
                    <span className="text-accent">PASSED QC</span>
                  </div>
                </motion.div>

                {/* Decorative Accent Swatch */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="absolute bottom-4 left-10 flex h-28 w-28 items-center justify-center rounded-2xl border border-accent/30 bg-accent-soft/90 p-4 shadow-lg sm:left-16"
                >
                  <div className="text-center">
                    <span className="font-display text-2xl font-black text-accent">300 DPI</span>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">Ultra HD</p>
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Trust Badges Banner */}
      <section className="border-b border-border bg-surface py-8">
        <Container>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
            {trustBadges.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center justify-center gap-3 text-center sm:justify-start">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-primary">{item.label}</span>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="What We Print"
              title="Tailored printing solutions for every project."
              subtitle="From small corporate batches to massive commercial production runs."
            />
            <ArrowLink to="/services" className="shrink-0">
              View All Services
            </ArrowLink>
          </div>

          <div className="mt-12">
            {services === null && <LoadingState label="Loading print services…" />}
            {services?.length === 0 && (
              <EmptyState title="Services coming soon" note="Check back shortly or request a quote." />
            )}
            {services && services.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Featured Products Catalog */}
      <section className="border-t border-border bg-surface py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Best Selling Items"
              title="Explore our signature products."
              subtitle="Premium quality stocks, crisp resolution, and fast turnarounds."
            />
            <ArrowLink to="/products" className="shrink-0">
              Explore Full Catalog
            </ArrowLink>
          </div>

          <div className="mt-12">
            {products === null && <LoadingState label="Loading product catalog…" />}
            {products?.length === 0 && (
              <EmptyState title="Products coming soon" note="Our catalog is being stocked." />
            )}
            {products && products.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Why ONPRINT"
            title="The standard behind every press run."
            subtitle="Why leading Dubai enterprises and creative agencies partner with us."
            center
          />

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft font-display text-sm font-bold text-accent">
                    0{index + 1}
                  </div>
                  <h3 className="font-display mt-5 text-lg font-bold text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Production Process Timeline */}
      <section className="border-t border-border bg-surface py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="How It Works"
            title="From artwork submission to final delivery."
            subtitle="Four straightforward steps to bring your project into print."
          />

          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-border sm:block" />
            <motion.div
              className="absolute left-0 top-6 hidden h-0.5 bg-accent sm:block"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
            <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((item, index) => (
                <Reveal key={item.step} delay={index * 0.1}>
                  <div className="rounded-2xl border border-border bg-background p-6 shadow-xs">
                    <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary bg-primary font-display text-sm font-bold text-background shadow-sm">
                      {item.step}
                    </span>
                    <h3 className="font-display mt-5 text-lg font-bold text-primary">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-secondary">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Story & Stat Counters */}
      <section className="py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="About ONPRINT"
              title="We print more than paper. We print brand trust."
              subtitle="Every piece of print that leaves our floor carries a brand's reputation with it. That's why precision, paper feel, and immaculate finishing are non-negotiable."
            />
            <div className="mt-8">
              <Button to="/about" variant="outline" size="md">
                Learn About Our History
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border bg-surface p-8 shadow-xs">
              {stats.map((stat) => (
                <StatCounter key={stat.label} {...stat} />
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Primary Dark Call to Action */}
      <section className="border-t border-border bg-primary py-20 text-background sm:py-28">
        <Container className="flex flex-col items-center gap-8 text-center">
          <span className="rounded-full bg-accent/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Ready to Print?
          </span>
          <h2 className="font-display max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
            LET’S BRING YOUR NEXT PRINT PROJECT TO LIFE.
          </h2>
          <p className="max-w-xl text-base text-background/80 sm:text-lg">
            Get an instant custom quote, request sample stocks, or talk directly with our Dubai print production experts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button to="/get-a-quote" variant="accent" size="lg">
              Start Quote Wizard
            </Button>
            <Button to="/contact" variant="outline" size="lg" className="border-background/30 text-background hover:bg-background/10 hover:border-background">
              Contact Sales Team
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}

