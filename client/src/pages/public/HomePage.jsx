import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Container from '../../components/Container'
import Button from '../../components/Button'
import ArrowLink from '../../components/ArrowLink'
import SectionHeading from '../../components/SectionHeading'
import Reveal from '../../components/Reveal'
import StatCounter from '../../components/StatCounter'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import { CornerMarks } from '../../components/PrintMarks'
import { getServices } from '../../services/services'
import { getProducts } from '../../services/products'

const trustItems = ['Quality Print', 'Fast Turnaround', 'Custom Solutions', 'Professional Service']

const whyUs = [
  { title: 'Precision', description: 'Consistent quality from design to final print.' },
  { title: 'Quality', description: 'Professional materials and finishing.' },
  { title: 'Speed', description: 'Reliable turnaround for every project.' },
  { title: 'Partnership', description: 'We work with businesses, brands and individuals.' },
]

const processSteps = [
  { step: '01', title: 'Discover', description: 'We learn your brand, your project and what success looks like.' },
  { step: '02', title: 'Design', description: 'Specs, materials and finishes are locked in before anything runs.' },
  { step: '03', title: 'Print', description: 'Production on calibrated equipment, checked at every stage.' },
  { step: '04', title: 'Deliver', description: 'Finished, inspected and in your hands on schedule.' },
]

const stats = [
  { value: 10, suffix: '+', label: 'Years Experience' },
  { value: 500, suffix: '+', label: 'Projects Completed' },
  { value: 100, suffix: '+', label: 'Business Clients' },
  { value: 50, suffix: '+', label: 'Print Solutions' },
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

  const [featureProduct, ...supportingProducts] = products || []

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <Container className="grid grid-cols-1 items-center gap-16 py-20 sm:py-28 lg:grid-cols-2 lg:py-32">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
              Printing &middot; Packaging &middot; Branding
            </span>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              FROM PIXEL
              <br />
              TO <span className="text-accent">PRESS.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-secondary">
              ONPRINT is where digital precision meets physical craft — business cards, packaging,
              signage and everything your brand puts into the world.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button to="/get-a-quote" variant="accent">
                Start a Project
              </Button>
              <ArrowLink to="/portfolio">Explore Our Work</ArrowLink>
            </div>
          </div>

          <div className="relative mx-auto flex h-[380px] w-full max-w-md items-center justify-center sm:h-[440px]">
            <CornerMarks className="absolute -left-2 -top-2 h-8 w-8 text-primary/30" />
            <CornerMarks className="absolute -bottom-2 -right-2 h-8 w-8 rotate-180 text-primary/30" />

            <motion.div
              initial={{ opacity: 0, y: 16, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: -6 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-4 top-6 h-56 w-40 border border-border bg-surface shadow-[0_20px_50px_-20px_rgba(21,20,15,0.25)] sm:h-64 sm:w-48"
            >
              <div className="flex h-full flex-col justify-between p-4">
                <div className="flex gap-1">
                  {['#00AEEF', '#EC008C', '#FFF200', '#101010'].map((c) => (
                    <span key={c} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 w-3/4 bg-primary/15" />
                  <div className="h-1.5 w-1/2 bg-primary/15" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: 4 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-2 top-24 flex h-44 w-64 flex-col justify-between border border-border bg-primary p-4 shadow-[0_20px_50px_-20px_rgba(21,20,15,0.35)] sm:right-0 sm:top-28"
            >
              <span className="font-display text-sm font-extrabold tracking-tight text-background">
                ON<span className="text-accent">PRINT</span>
              </span>
              <div className="space-y-1.5">
                <div className="h-1.5 w-2/3 bg-background/25" />
                <div className="h-1.5 w-1/3 bg-background/25" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-2 left-16 h-24 w-24 border border-accent/40 bg-accent-soft sm:left-24"
            />
          </div>
        </Container>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-surface">
        <Container className="grid grid-cols-2 gap-6 py-8 sm:grid-cols-4 sm:gap-4">
          {trustItems.map((item) => (
            <p
              key={item}
              className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-secondary sm:text-left"
            >
              {item}
            </p>
          ))}
        </Container>
      </section>

      {/* Services */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="What We Offer" title="Services built for every stage of print." />
            <ArrowLink to="/services" className="shrink-0">
              View All Services
            </ArrowLink>
          </div>

          <div className="mt-14 border-t border-border">
            {services === null && <LoadingState label="Loading services…" />}
            {services?.length === 0 && (
              <EmptyState title="Services coming soon" note="Check back shortly, or explore our product catalog." />
            )}
            {services && services.length > 0 && (
              <ul>
                {services.map((service, index) => (
                  <li key={service._id} className="group border-b border-border">
                    <Link to={`/services/${service.slug}`} className="flex items-center gap-6 py-6 sm:py-8">
                      <span className="font-display text-sm font-bold tabular-nums text-secondary transition-colors group-hover:text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display flex-1 text-xl font-bold tracking-tight text-primary transition-transform duration-300 group-hover:translate-x-2 sm:text-2xl">
                        {service.name}
                      </span>
                      <span className="hidden max-w-xs flex-1 text-sm text-secondary lg:block">
                        {service.shortDescription}
                      </span>
                      <ArrowRightIcon className="h-5 w-5 shrink-0 text-secondary transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </section>

      {/* Featured products */}
      <section className="border-t border-border bg-surface py-24 sm:py-32">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Popular Picks" title="A print catalog worth browsing." />
            <ArrowLink to="/products" className="shrink-0">
              View All Products
            </ArrowLink>
          </div>

          <div className="mt-14">
            {products === null && <LoadingState label="Loading products…" />}
            {products?.length === 0 && (
              <EmptyState title="Products coming soon" note="Our catalog is being stocked — check back shortly." />
            )}
            {featureProduct && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Link
                  to={`/products/${featureProduct.slug}`}
                  className="group relative col-span-1 flex aspect-[4/5] flex-col justify-end overflow-hidden border border-border bg-primary lg:col-span-2 lg:aspect-auto"
                >
                  {featureProduct.images?.[0] && (
                    <img
                      src={featureProduct.images[0]}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="relative z-10 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/60">Featured</p>
                    <h3 className="font-display mt-2 text-2xl font-extrabold text-background sm:text-3xl">
                      {featureProduct.name}
                    </h3>
                    <p className="mt-3 text-sm font-semibold text-accent">
                      {featureProduct.price != null ? `From $${featureProduct.price}` : 'Request a Quote'}
                    </p>
                  </div>
                </Link>

                <div className="grid grid-cols-2 gap-6 lg:grid-cols-1">
                  {supportingProducts.map((product) => (
                    <Link
                      key={product._id}
                      to={`/products/${product.slug}`}
                      className="group relative flex aspect-square flex-col justify-end overflow-hidden border border-border bg-primary"
                    >
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="relative z-10 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent p-4">
                        <h3 className="font-display text-sm font-bold text-background">{product.name}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Why ONPRINT */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="Why ONPRINT" title="Printing built around your brand." center />
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className="border-t-2 border-primary pt-5">
                  <h3 className="font-display text-lg font-bold text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="border-t border-border bg-surface py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="How It Works" title="From request to delivery." />
          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-border sm:block" />
            <motion.div
              className="absolute left-0 top-5 hidden h-px bg-accent sm:block"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((item, index) => (
                <Reveal key={item.step} delay={index * 0.1}>
                  <div className="relative">
                    <span className="relative z-10 flex h-10 w-10 items-center justify-center border border-primary bg-surface font-display text-sm font-bold tabular-nums text-primary">
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

      {/* About teaser + stats */}
      <section className="py-24 sm:py-32">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="About ONPRINT"
              title="We print more than paper. We print identities."
              subtitle="Every project that leaves our press carries a brand's reputation with it. That's why precision, consistency and craft aren't optional — they're the whole job."
            />
            <div className="mt-8">
              <ArrowLink to="/about">Our Story</ArrowLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-border pt-10">
              {stats.map((stat) => (
                <StatCounter key={stat.label} {...stat} />
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary py-24 sm:py-32">
        <Container className="flex flex-col items-center gap-8 text-center">
          <h2 className="font-display max-w-3xl text-3xl font-extrabold tracking-tight text-background sm:text-5xl">
            HAVE SOMETHING TO PRINT?
          </h2>
          <p className="max-w-xl text-lg text-background/70">
            Tell us what you're building and we'll help bring it to life.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Button to="/get-a-quote" variant="accent">
              Get a Quote
            </Button>
            <Link
              to="/contact"
              className="text-sm font-semibold text-background/80 underline decoration-background/30 underline-offset-4 transition-colors hover:text-background"
            >
              Talk to Us
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}

function ArrowRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
