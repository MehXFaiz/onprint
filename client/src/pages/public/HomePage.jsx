import React, { useEffect, useState } from 'react'
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
import CorporateGiftsSection from '../../components/CorporateGiftsSection'
import ProductSectionsShowcase from '../../components/ProductSectionsShowcase'
import CarefreeShoppingSection from '../../components/CarefreeShoppingSection'
import ProductDetailModal from '../../components/ProductDetailModal'
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
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  useEffect(() => {
    getServices()
      .then((data) => setServices(data.slice(0, 6)))
      .catch(() => setServices([]))

    getProducts({ featured: true })
      .then((res) => setProducts(res.data.slice(0, 4)))
      .catch(() => setProducts([]))
  }, [])

  return (
    <div className="bg-[#FFFFFF] text-[#000000]">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-[#000000]/10 bg-[#FFFFFF] py-16 sm:py-24 lg:py-32">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19] bg-[#FFFFFF] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#A82F19] shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#A82F19]" />
                ONPRINT • Dubai’s Premier Printing &amp; Branding Solutions
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display mt-6 text-4xl font-black leading-[1.02] tracking-tight text-[#000000] sm:text-6xl xl:text-7xl">
                DIGITAL PRECISION.
                <br />
                <span className="text-[#A82F19]">PHYSICAL CRAFT.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#000000]/75 sm:text-lg">
                ONPRINT transforms brand identities into tangible physical masterpieces. From bespoke corporate gifts and executive stationery to high-volume luxury packaging and signage.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
                <Button to="/get-a-quote" variant="accent" size="lg" className="shadow-lg shadow-[#A82F19]/25">
                  Request a Custom Quote
                </Button>
                <Button to="/products" variant="secondary" size="lg" className="border-[#000000] text-[#000000] hover:border-[#A82F19] hover:text-[#A82F19]">
                  Browse Catalog
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[#000000]/10 pt-6 text-xs font-bold text-[#000000]/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#A82F19]" />
                  <span>Free Design Pre-flight</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#A82F19]" />
                  <span>Express Same-Day Printing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#A82F19]" />
                  <span>Doorstep UAE Delivery</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Hero Visual Studio Showcase (Bespoke Corporate Print Cards - No Multi-Colors) */}
          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <div className="relative mx-auto flex h-[360px] w-full max-w-md items-center justify-center sm:h-[440px]">
                <CornerMarks className="absolute -left-3 -top-3 h-8 w-8 text-[#000000]/40" />
                <CornerMarks className="absolute -bottom-3 -right-3 h-8 w-8 rotate-180 text-[#000000]/40" />

                {/* Back card: Luxury Stock Spec */}
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: -6 }}
                  animate={{ opacity: 1, y: 0, rotate: -6 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-2 top-4 flex h-64 w-44 flex-col justify-between rounded-2xl border border-[#000000]/15 bg-[#FFFFFF] p-5 shadow-xl sm:h-72 sm:w-52"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {['#000000', '#A82F19', '#000000'].map((c, i) => (
                        <span key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#000000]/60">350 GSM STOCK</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 rounded bg-[#000000]/15" />
                    <div className="h-2 w-1/2 rounded bg-[#000000]/15" />
                    <div className="h-2 w-5/6 rounded bg-[#A82F19]/25" />
                  </div>
                  <div className="rounded-xl border border-[#A82F19] bg-[#FFFFFF] p-2.5 text-center text-xs font-black text-[#A82F19]">
                    RED FOIL EMBOSS
                  </div>
                </motion.div>

                {/* Front card: ONPRINT Signature Black Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: 5 }}
                  animate={{ opacity: 1, y: 0, rotate: 5 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-20 flex h-48 w-68 flex-col justify-between rounded-2xl border border-[#000000] bg-[#000000] p-6 shadow-2xl sm:right-2 sm:top-24 sm:w-72"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-black tracking-tight text-[#FFFFFF]">
                      ON<span className="text-[#A82F19]">PRINT</span>
                    </span>
                    <span className="rounded-full bg-[#A82F19] px-2.5 py-0.5 text-[10px] font-extrabold text-[#FFFFFF]">PRESS</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#FFFFFF]/70">CORPORATE GIFTING &amp; PRESS</p>
                    <p className="mt-1 text-sm font-bold text-[#FFFFFF]">Precision Printing Dubai</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#FFFFFF]/20 pt-3 text-[10px] font-bold text-[#FFFFFF]/70">
                    <span>SPEC: ULTRA HD</span>
                    <span className="text-[#A82F19] font-black">PASSED QC</span>
                  </div>
                </motion.div>

                {/* Decorative Accent Swatch */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="absolute bottom-4 left-10 flex h-28 w-28 items-center justify-center rounded-2xl border border-[#A82F19] bg-[#FFFFFF] p-4 shadow-lg sm:left-16"
                >
                  <div className="text-center">
                    <span className="font-display text-2xl font-black text-[#A82F19]">1200 DPI</span>
                    <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#000000]">Offset Press</p>
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 2. Trust Badges Banner */}
      <section className="border-b border-[#000000]/10 bg-[#FFFFFF] py-8">
        <Container>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
            {trustBadges.map((item) => {
              const Icon = item.icon
              const renderBadgeIcon = () => {
                if (!Icon) return null
                if (React.isValidElement(Icon)) return Icon
                if (typeof Icon === 'function' || typeof Icon === 'string' || (typeof Icon === 'object' && Icon !== null && Icon.$$typeof)) {
                  const IconComp = Icon
                  return <IconComp className="h-5 w-5" />
                }
                return null
              }
              return (
                <div key={item.label} className="flex items-center justify-center gap-3 text-center sm:justify-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A82F19]/10 text-[#A82F19]">
                    {renderBadgeIcon()}
                  </div>
                  <span className="text-xs font-extrabold text-[#000000]">{item.label}</span>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* 3. Services Grid */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="OUR SERVICES"
              title="Professional printing solutions built for modern businesses."
              subtitle="Full-service commercial printing, bespoke corporate gifts, office stationery, and packaging in Dubai."
            />
            <ArrowLink to="/services" className="shrink-0 text-[#A82F19]">
              View All Services
            </ArrowLink>
          </div>

          <div className="mt-12">
            {services === null && <LoadingState label="Loading print services…" />}
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

      {/* 4. Main Product Showcase Sections (Corporate Gift Items, Office Stationery Printing, Other Products) */}
      <ProductSectionsShowcase onQuickView={setQuickViewProduct} />

      {/* 5. Carefree Shopping & Express Delivery Section */}
      <CarefreeShoppingSection />

      {/* 6. Featured Products Catalog */}
      <section className="border-t border-[#000000]/10 bg-[#FFFFFF] py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="OUR PRODUCTS"
              title="Explore our signature products."
              subtitle="Browse our catalog of premium corporate giveaways, business cards, brochures, and event displays."
            />
            <ArrowLink to="/products" className="shrink-0 text-[#A82F19]">
              Explore Full Catalog
            </ArrowLink>
          </div>

          <div className="mt-12">
            {products === null && <LoadingState label="Loading product catalog…" />}
            {products && products.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            )}
          </div>
        </Container>

        {quickViewProduct && (
          <ProductDetailModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </section>

      {/* 7. Why Choose Us */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF]">
        <Container>
          <SectionHeading
            eyebrow="WHY ONPRINT"
            title="The standard behind every press run."
            subtitle="Why leading Dubai enterprises, government entities, and creative agencies trust ONPRINT."
            center
          />

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-[#000000]/15 bg-[#FFFFFF] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A82F19] hover:shadow-lg group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A82F19] font-display text-xs font-black text-[#FFFFFF]">
                    0{index + 1}
                  </div>
                  <h3 className="font-display mt-5 text-lg font-black text-[#000000] group-hover:text-[#A82F19] transition-colors">{item.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#000000]/70">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 8. Production Process Timeline */}
      <section className="border-t border-[#000000]/10 bg-[#FFFFFF] py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="HOW IT WORKS"
            title="From artwork submission to final doorstep delivery."
            subtitle="Four straightforward steps to bring your custom print project to life."
          />

          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-[#000000]/10 sm:block" />
            <motion.div
              className="absolute left-0 top-6 hidden h-0.5 bg-[#A82F19] sm:block"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
            <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((item, index) => (
                <Reveal key={item.step} delay={index * 0.1}>
                  <div className="rounded-2xl border border-[#000000]/15 bg-[#FFFFFF] p-6 shadow-xs">
                    <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#000000] font-display text-xs font-black text-[#FFFFFF] shadow-sm">
                      {item.step}
                    </span>
                    <h3 className="font-display mt-5 text-lg font-black text-[#000000]">{item.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#000000]/70">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 9. Story & Stat Counters */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF]">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="ABOUT ONPRINT"
              title="We print more than paper. We print brand trust."
              subtitle="Every piece of print that leaves our floor carries a brand's reputation with it. That's why precision, paper feel, and immaculate finishing are non-negotiable."
            />
            <div className="mt-8">
              <Button to="/about" variant="secondary" size="md" className="border-[#000000] text-[#000000] hover:border-[#A82F19] hover:text-[#A82F19]">
                Learn About Our History
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-6 rounded-2xl border border-[#000000]/15 bg-[#FFFFFF] p-8 shadow-sm">
              {stats.map((stat) => (
                <StatCounter key={stat.label} {...stat} />
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 10. Primary Dark Call to Action */}
      <section className="border-t border-[#000000] bg-[#000000] py-20 text-[#FFFFFF] sm:py-28">
        <Container className="flex flex-col items-center gap-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19] bg-[#000000] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#A82F19]">
            <Sparkles className="h-3.5 w-3.5 text-[#A82F19]" />
            Ready to Bring Your Brand to Life?
          </div>
          
          <h2 className="font-display max-w-3xl text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-[#FFFFFF]">
            LET’S BRING YOUR NEXT PRINT PROJECT TO LIFE.
          </h2>

          <p className="max-w-xl text-sm sm:text-base text-[#FFFFFF]/80 leading-relaxed">
            From business cards to large-format printing, ONPRINT helps your brand stand out with unmatched precision across Dubai.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button to="/get-a-quote" variant="accent" size="lg" className="shadow-lg shadow-[#A82F19]/30">
              Request a Quote
            </Button>
            <Button to="/contact" variant="outline" size="lg" className="border-[#FFFFFF]/30 text-[#FFFFFF] hover:bg-[#FFFFFF]/10 hover:border-[#FFFFFF]">
              Contact Sales Team
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}

