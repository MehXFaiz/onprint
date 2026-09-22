import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Award, Users, CheckCircle, Sparkles, ChevronDown, Clock, ArrowRight, Package, Layers, MapPin, Info, Star, Printer } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import ArrowLink from '../../components/ArrowLink'
import SectionHeading from '../../components/SectionHeading'
import Reveal from '../../components/Reveal'
import StatCounter from '../../components/StatCounter'
import LoadingState from '../../components/LoadingState'
import ServiceCard from '../../components/ServiceCard'
import CategoryCard from '../../components/CategoryCard'
import ProductCard from '../../components/ProductCard'
import ProductSectionsShowcase from '../../components/ProductSectionsShowcase'
import CarefreeShoppingSection from '../../components/CarefreeShoppingSection'
import ProductDetailModal from '../../components/ProductDetailModal'
import SEOHead from '../../components/SEOHead'
import { CornerMarks, CmykDots } from '../../components/PrintMarks'
import { getServices } from '../../services/services'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'
import { getPublicBlogs } from '../../services/blog'
import { trackViewHomepage, trackGetQuoteClick } from '../../utils/analytics'
import { portfolioItems } from '../../data/portfolio'
import { getBlogCoverImage } from '../../assets/productImages'

const trustBadges = [
  { label: 'German Offset & Digital Press', sub: 'Calibrated CMYK & Pantone accuracy', icon: ShieldCheck },
  { label: 'Express Dubai Turnaround', sub: 'Same-day & 24h rapid dispatch', icon: Zap },
  { label: 'Luxury Finishing Techniques', sub: 'Spot UV, hot foil & debossing', icon: Award },
  { label: 'Al Quoz Production Facility', sub: 'Direct UAE commercial pressroom', icon: Users },
]

const whyUs = [
  {
    title: 'Calibrated Color Fidelity',
    description: 'Heidelberg & HP Indigo press calibration profiles guarantee true-to-brand CMYK and Pantone precision on every run.',
  },
  {
    title: 'Certified Luxury Substrates',
    description: 'Extensive inventory of 300–600 GSM FSC-certified stocks, cotton boards, soft-touch laminates, and metallic foils.',
  },
  {
    title: 'Direct Al Quoz Pressroom',
    description: 'In-house commercial printing in Dubai eliminates broker markups and guarantees rapid turnaround for urgent deadlines.',
  },
  {
    title: 'Pre-Press Specialist Proofing',
    description: 'Every file is pre-flight checked by dedicated print engineers for bleed, resolution, and vector trap accuracy before plating.',
  },
]

const processSteps = [
  { step: '01', title: 'Consultation & Spec', description: 'Select your stock, dimensions, finishes, and quantity with instant quote clarity.' },
  { step: '02', title: 'Pre-flight Artwork', description: 'Our prepress studio inspects bleed, resolution, and CMYK color profiles.' },
  { step: '03', title: 'Press Production', description: 'Printed on high-precision offset and digital presses with multi-stage quality control.' },
  { step: '04', title: 'Inspected & Delivered', description: 'Hand-checked, packaged in protective covers, and delivered straight to your door in Dubai & UAE.' },
]

const stats = [
  { value: 600, suffix: ' GSM', label: 'Max Stock Weight Capacity' },
  { value: 24, suffix: '–48h', label: 'Standard Digital Turnaround' },
  { value: 7, suffix: ' Emirates', label: 'Direct UAE Delivery Coverage' },
  { value: 100, suffix: '%', label: 'Pre-Press Pre-Flight Inspection' },
]

const heroMarquee = [
  'Hot Foil Stamping',
  'Spot UV',
  'Soft-Touch Lamination',
  'Debossing',
  'Pantone Matching',
  'Rigid Boxes',
  'Heidelberg Offset',
  'HP Indigo Digital',
  'Same-Day Dubai',
  '600 GSM Cotton Stock',
  'FSC Certified Papers',
  'Large Format Signage',
]

const homeFaqs = [
  {
    question: 'What printing services does ONPRINT offer in Dubai?',
    answer:
      'ONPRINT provides a comprehensive suite of commercial printing solutions in Dubai, including digital press printing, high-volume offset printing, executive office stationery, luxury packaging boxes, corporate gift items, die-cut vinyl stickers, and large-format exhibition signage.',
  },
  {
    question: 'Where is ONPRINT located in Dubai?',
    answer:
      'ONPRINT is located in Al Quoz Industrial Area 3, Dubai, UAE. Our production facility houses Heidelberg offset presses and HP Indigo digital presses, serving clients across Dubai, Abu Dhabi, Sharjah, and the entire UAE.',
  },
  {
    question: 'What is the turnaround time for print orders across Dubai and the UAE?',
    answer:
      'Standard digital printing runs (business cards, flyers, brochures) typically take 24 to 48 hours once artwork is approved. Large offset runs, custom rigid gift boxes, and specialty foil-embossed projects take 3 to 7 business days. Express same-day production is available for urgent requirements.',
  },
  {
    question: 'What is the difference between digital and offset printing?',
    answer:
      'Digital printing is ideal for small to medium quantities (up to 1,000 units) with faster turnaround and no plate setup costs. Offset printing is more cost-effective for large volume runs (1,000+ units) and offers superior color consistency for brand-critical projects. Both methods are available at ONPRINT.',
  },
  {
    question: 'Do you offer corporate gift printing and branded merchandise?',
    answer:
      'Yes. We specialize in custom corporate gifts in Dubai, including laser-engraved thermal smart water bottles, ceramic mugs, executive hardcover notebooks, custom polo shirts, embroidered caps, and curated VIP executive gift sets.',
  },
  {
    question: 'What paper stocks and materials do you offer?',
    answer:
      'ONPRINT maintains an extensive inventory of FSC-certified paper stocks ranging from 120gsm to 600gsm, including smooth uncoated white, glossy art paper, matte coated stock, premium cotton business card stock, and specialty papers. We also offer luxury finishing options like soft-touch lamination, spot UV, and metallic foil stamping.',
  },
  {
    question: 'How much does printing cost in Dubai?',
    answer:
      'Printing costs vary based on quantity, material, size, and finishing options. Digital business cards start from AED 120 for 100 cards, while custom packaging and large format printing are quoted based on specifications. Contact us for a detailed instant quote tailored to your exact requirements.',
  },
  {
    question: 'Can I see a proof before my project goes to press?',
    answer:
      'Every order includes a thorough pre-flight artwork review and a digital PDF proof for approval before production begins. Physical printed proofs on your chosen paper stock are also available upon request for high-volume or color-critical runs.',
  },
  {
    question: 'Do you deliver across Dubai and the UAE?',
    answer:
      'Yes, ONPRINT delivers to all areas of Dubai, Abu Dhabi, Sharjah, Ajman, RAK, and across the UAE. Dubai and Sharjah deliveries typically arrive within 24 hours, while Abu Dhabi and other emirates receive delivery within 48 hours of dispatch.',
  },
  {
    question: 'How do I request a custom quotation for bulk printing?',
    answer:
      'You can request an instant quote online via our Get a Quote page, message our team on WhatsApp, or email us at 0nprint183@gmail.com. Our print specialists provide itemized quotations within 2 hours.',
  },
]

export default function HomePage() {
  const [services, setServices] = useState(null)
  const [categories, setCategories] = useState(null)
  const [allProducts, setAllProducts] = useState(null)
  const [featuredProducts, setFeaturedProducts] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  useEffect(() => {
    trackViewHomepage()

    getServices()
      .then((data) => setServices(data || []))
      .catch(() => setServices([]))

    getCategories({ status: 'active', sort: 'display_order_asc' })
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]))

    getProducts()
      .then((res) => {
        const list = res?.data || []
        setAllProducts(list)
        const feat = list.filter((p) => p.featured)
        setFeaturedProducts(feat.length > 0 ? feat.slice(0, 4) : list.slice(0, 4))
      })
      .catch(() => {
        setAllProducts([])
        setFeaturedProducts([])
      })

    getPublicBlogs({ limit: 3, sort: 'newest' })
      .then((res) => setBlogs(res?.data || []))
      .catch(() => setBlogs([]))
  }, [])

  return (
    <div className="bg-[#FFFFFF] text-[#000000]">
      {/* SEO Head Management & Structured Data */}
      <SEOHead
        title="Printing Company in Dubai | ONPRINT – Printing & Branding Solutions"
        description="ONPRINT is Dubai’s premier printing company. Precision digital & offset printing, corporate gifts, business cards, office stationery, packaging, and large-format signage in UAE."
        keywords="printing company in dubai, commercial printing dubai, digital printing dubai, business card printing dubai, brochure printing dubai, sticker printing dubai, custom packaging dubai, banner printing dubai, corporate gifts dubai"
        canonicalPath="/"
        faqList={homeFaqs}
      />

      {/* 1. Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#F4EFE8] pt-12 sm:pt-16 lg:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(168,47,25,0.16),transparent_34%),radial-gradient(circle_at_86%_8%,rgba(245,158,11,0.14),transparent_32%),radial-gradient(circle_at_72%_78%,rgba(14,116,144,0.1),transparent_36%),linear-gradient(180deg,#F8F3EC_0%,#F1E9DF_55%,#EDE4D8_100%)]" aria-hidden="true" />
        <div className="hero-paper-grain pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(20,16,12,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(20,16,12,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,#000_20%,transparent_80%)]" aria-hidden="true" />

        <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-2 sm:flex flex-col" aria-hidden="true">
          <span className="h-1/4 bg-[#00AEEF]" />
          <span className="h-1/4 bg-[#EC008C]" />
          <span className="h-1/4 bg-[#FFF200]" />
          <span className="h-1/4 bg-[#231F20]" />
        </div>

        <p className="pointer-events-none absolute -right-6 top-16 hidden select-none font-display text-[9.5rem] font-black leading-none tracking-tighter text-[#A82F19]/[0.06] xl:block" aria-hidden="true">
          PRINT
        </p>

        <div className="pointer-events-none absolute top-7 left-10 hidden xl:block opacity-40 text-neutral-500">
          <CornerMarks className="h-6 w-6" />
        </div>
        <div className="pointer-events-none absolute top-7 right-10 hidden xl:block opacity-40 text-neutral-500">
          <CornerMarks className="h-6 w-6" />
        </div>

        <Container className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 space-y-6">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#A82F19]/20 bg-white/80 px-4 py-1.5 shadow-[0_8px_30px_rgba(168,47,25,0.08)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A82F19] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#A82F19]" />
                </span>
                <Sparkles className="h-3.5 w-3.5 text-[#A82F19]" />
                <span className="uppercase tracking-[0.2em] text-[10.5px] font-black text-neutral-900">
                  Dubai’s Premier Print &amp; Branding Press
                </span>
                <span className="hidden sm:inline-block h-3 w-px bg-neutral-300" />
                <span className="hidden sm:inline-block font-mono text-[9px] font-bold tracking-wider text-neutral-500">
                  AL QUOZ 3
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.65rem] xl:text-[4.15rem] font-black leading-[1.05] tracking-tight text-neutral-950">
                Custom Packaging &amp;{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#7A1C0D] via-[#A82F19] to-[#E08A3C] bg-clip-text text-transparent">
                    Printing Services
                  </span>
                  <span className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-gradient-to-r from-[#A82F19] via-amber-400 to-transparent" aria-hidden="true" />
                </span>{' '}
                in Dubai, UAE
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="max-w-xl text-base sm:text-lg leading-[1.75] text-neutral-700">
                ONPRINT is a commercial printing press and custom packaging studio located in{' '}
                <strong className="font-semibold text-neutral-950">Al Quoz Industrial Area 3, Dubai</strong>. We deliver{' '}
                <strong className="font-semibold text-neutral-950">precision digital and offset printing</strong>,{' '}
                <strong className="font-semibold text-neutral-950">bespoke luxury packaging</strong>, fast-turnaround business stationery, and corporate merchandise across Dubai and the UAE.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Button
                  to="/products"
                  variant="accent"
                  size="lg"
                  className="relative overflow-hidden !rounded-2xl !bg-[#A82F19] hover:!bg-[#8c2211] text-white font-extrabold shadow-[0_14px_34px_rgba(168,47,25,0.38)] hover:-translate-y-0.5 !px-7 !py-4 justify-center"
                >
                  Explore Our Products
                </Button>
                <Button
                  to="/get-a-quote"
                  variant="secondary"
                  size="lg"
                  className="!rounded-2xl !border-2 !border-neutral-950 !bg-neutral-950 !text-white hover:!bg-[#1a1a1a] font-extrabold justify-center !px-7 !py-4 hover:-translate-y-0.5"
                  onClick={() => trackGetQuoteClick({ source_page: 'homepage_hero' })}
                >
                  Get a Quote
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  { icon: Award, label: 'Premium Quality', sub: 'ISO 12647-2 Press' },
                  { icon: Clock, label: 'Fast Turnaround', sub: '24h Express' },
                  { icon: Layers, label: 'Custom Solutions', sub: 'Bespoke Finishes' },
                  { icon: Users, label: 'Expert Support', sub: 'Pre-Press Team' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.label}
                      className="group rounded-2xl border border-white/70 bg-white/70 p-3 shadow-[0_10px_28px_rgba(40,24,12,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#A82F19]/35 hover:shadow-[0_16px_32px_rgba(168,47,25,0.12)]"
                    >
                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#A82F19] to-[#7A1C0D] text-white shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="block text-[11px] font-black leading-tight text-neutral-950">{item.label}</span>
                      <span className="mt-0.5 block text-[10px] font-semibold text-neutral-500">{item.sub}</span>
                    </div>
                  )
                })}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-extrabold text-neutral-900">4.9/5</span>
                  <span className="text-neutral-500">Verified UAE reviews</span>
                </div>
                <span className="hidden sm:inline text-neutral-300">•</span>
                <span className="font-bold text-neutral-800">500+ Corporate Clients</span>
                <span className="hidden sm:inline text-neutral-300">•</span>
                <span className="inline-flex items-center gap-1 font-bold text-neutral-800">
                  <CheckCircle className="h-3.5 w-3.5 text-[#A82F19]" />
                  Direct Al Quoz Pressroom
                </span>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.16}>
              <div className="relative mx-auto h-[430px] w-full max-w-[560px] sm:h-[520px]">
                <div className="absolute inset-x-6 inset-y-8 rounded-[2rem] bg-gradient-to-br from-[#1c120e] via-[#3a1c14] to-[#A82F19] shadow-[0_40px_90px_rgba(88,24,12,0.35)]" />
                <div className="absolute inset-x-6 inset-y-8 overflow-hidden rounded-[2rem]">
                  <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl" />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="absolute left-10 top-12 z-10 hidden items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/80 sm:flex">
                  <Printer className="h-3.5 w-3.5" />
                  ONPRINT Studio • Dubai
                  <CmykDots />
                </div>

                <motion.div
                  animate={{ y: [0, -12, 0], rotate: [-7, -5, -7] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  className="hero-card-sheen absolute left-2 top-20 z-20 w-[58%] overflow-hidden rounded-2xl border border-white/20 bg-white p-2.5 shadow-[0_30px_60px_rgba(0,0,0,0.28)] sm:left-4 sm:top-24"
                >
                  <div className="relative h-40 overflow-hidden rounded-xl sm:h-52">
                    <img src="/assets/products/luxury_business_cards.jpg" alt="Executive Cotton Business Cards Dubai" className="h-full w-full object-cover" loading="eager" />
                    <span className="absolute left-2 top-2 rounded-md bg-gradient-to-r from-amber-600 to-amber-500 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">
                      Hot Foil &amp; Spot UV
                    </span>
                    <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-[8px] font-black text-white">600 GSM</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between px-0.5">
                    <p className="text-xs font-black text-neutral-950">Luxury Cotton Card Stock</p>
                    <span className="text-[10px] font-black text-[#A82F19]">FSC</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [8, 11, 8] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="hero-card-sheen absolute right-1 top-8 z-30 w-[46%] overflow-hidden rounded-2xl border border-white/40 bg-white p-2 shadow-[0_24px_50px_rgba(0,0,0,0.22)] sm:right-3 sm:top-10"
                >
                  <div className="relative h-28 overflow-hidden rounded-xl sm:h-32">
                    <img src="/assets/products/tote_bags.jpg" alt="Luxury Branded Packaging and Bags in Dubai" className="h-full w-full object-cover" loading="eager" />
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/80 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                      Bespoke Packaging
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-bold">
                    <span>Foil Bags</span>
                    <span className="text-[#A82F19]">Luxury Grade</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0], rotate: [4, 2, 4] }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                  className="hero-card-sheen absolute bottom-8 right-4 z-20 w-[48%] overflow-hidden rounded-2xl border border-white/40 bg-white p-2 shadow-[0_22px_46px_rgba(0,0,0,0.22)] sm:bottom-10 sm:right-8"
                >
                  <div className="relative h-24 overflow-hidden rounded-xl sm:h-28">
                    <img src="/assets/products/brochures.jpg" alt="Corporate Marketing Brochures Dubai" className="h-full w-full object-cover" loading="eager" />
                    <span className="absolute bottom-2 left-2 text-[8px] font-bold text-white drop-shadow">Multi-Page Brochures</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-bold">
                    <span>Art Paper 300 GSM</span>
                    <span>Heidelberg</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-6 left-4 z-40 flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/95 px-3 py-2 shadow-[0_16px_32px_rgba(0,0,0,0.18)] backdrop-blur-md sm:left-8"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A82F19] text-white">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[12px] font-black leading-tight text-neutral-950">1200 DPI</div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-[#A82F19]">HD Digital Press</div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute right-6 top-2 z-40 hidden items-center gap-1.5 rounded-full bg-neutral-950 px-3 py-1.5 text-[9px] font-bold text-white shadow-lg sm:flex"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  SAME-DAY EXPRESS • DUBAI
                </motion.div>
              </div>
            </Reveal>
          </div>
        </Container>

        <div className="relative mt-8 border-y border-[#A82F19]/15 bg-neutral-950 py-3 text-white">
          <div className="overflow-hidden">
            <div className="hero-marquee-track gap-8 pr-8">
              {[...heroMarquee, ...heroMarquee].map((item, i) => (
                <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-8 text-[11px] font-extrabold uppercase tracking-[0.22em]">
                  <span className="text-white/85">{item}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A82F19]" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 Floating Category Quick-Access Panel */}
      <div className="relative z-20 bg-gradient-to-b from-[#EDE4D8] to-white pb-6 pt-8">
        <Container>
          <div className="rounded-3xl border border-[#A82F19]/15 bg-white/90 p-3.5 sm:p-5 shadow-[0_24px_60px_rgba(88,32,16,0.1)] backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#A82F19] ring-2 ring-[#A82F19]/25 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-neutral-900">
                  Popular Print Categories
                </span>
              </div>
              <Link
                to="/categories"
                className="text-xs font-extrabold text-[#A82F19] hover:text-[#882210] flex items-center gap-1 transition-colors"
              >
                <span>All Categories {categories ? `(${categories.length})` : ''}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Categories scrollable container: Horizontal scroll on mobile, responsive grid on desktop */}
            <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1">
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <Link
                    key={cat.id || cat.slug}
                    to={`/categories/${cat.slug}`}
                    className="group flex sm:flex-col items-center gap-2.5 sm:gap-2 rounded-xl border border-neutral-100 bg-neutral-50/70 p-2 sm:p-2.5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#A82F19]/40 hover:bg-white hover:shadow-md shrink-0 min-w-[140px] sm:min-w-0"
                  >
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden bg-white border border-neutral-200/80 p-1 flex items-center justify-center shrink-0 group-hover:border-[#A82F19]/40 transition-transform duration-300 group-hover:scale-105">
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="h-full w-full object-cover rounded"
                          loading="lazy"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-[#A82F19]" />
                      )}
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-neutral-800 group-hover:text-[#A82F19] transition-colors line-clamp-1">
                      {cat.name}
                    </span>
                  </Link>
                ))
              ) : (
                Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="h-16 sm:h-20 rounded-xl bg-neutral-100 animate-pulse min-w-[140px] sm:min-w-0 shrink-0" />
                ))
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* 1.8 What is ONPRINT - Clear Business Definition for AI/GEO */}
      <section className="border-b border-neutral-200/80 bg-white py-12 sm:py-16">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-700">
                  <Info className="h-3.5 w-3.5" />
                  <span>About ONPRINT</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-3 py-1 text-xs font-bold text-[#A82F19]">
                  Verified Business Profile
                </span>
                <span className="text-xs font-semibold text-neutral-500">Al Quoz 3, Dubai, UAE</span>
              </div>
              
              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 mb-4">
                What is ONPRINT?
              </h2>
              
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p className="text-base sm:text-lg font-medium text-neutral-900">
                  <strong>ONPRINT</strong> (also known as <strong>0nprint</strong>) is a commercial printing company, custom packaging atelier, and corporate branding press located in Al Quoz Industrial Area 3, Dubai, serving businesses across the United Arab Emirates with comprehensive printing and branding solutions.
                </p>
                
                <p className="text-sm sm:text-base">
                  We specialize in digital printing, offset printing, luxury packaging, corporate gifts, 
                  office stationery, business cards, brochures, flyers, banners, signage, and custom branded merchandise. 
                  Our Al Quoz production facility houses Heidelberg offset presses and HP Indigo digital presses, 
                  enabling us to deliver everything from small-run digital projects to high-volume commercial printing.
                </p>
              </div>

              {/* Quick Business Specs Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-3.5 text-xs text-neutral-600">
                <div><span className="font-extrabold text-neutral-900 block">Facility:</span> Al Quoz Ind. Area 3, Dubai</div>
                <div><span className="font-extrabold text-neutral-900 block">Support:</span> WhatsApp Concierge</div>
                <div><span className="font-extrabold text-neutral-900 block">Hours:</span> Mon–Sat 8:30–18:30</div>
                <div><span className="font-extrabold text-neutral-900 block">Delivery:</span> All 7 Emirates (Express 24h)</div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-700 mb-2.5">Our Services</h3>
                  <ul className="space-y-2 text-sm text-neutral-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span>Digital & Offset Printing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span>Business Cards & Corporate Stationery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span>Brochures, Flyers & Marketing Materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span>Luxury Packaging & Custom Boxes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span>Corporate Gifts & Branded Merchandise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span>Large Format Printing, Banners & Signage</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-700 mb-2.5">Why Choose ONPRINT?</h3>
                  <ul className="space-y-2 text-sm text-neutral-700">
                    <li className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span><strong>10+ Years Experience</strong> in commercial printing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span><strong>500+ Corporate Clients</strong> across UAE</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span><strong>Al Quoz Production Facility</strong> in Dubai</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span><strong>Same-Day & 24-Hour</strong> turnaround available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span><strong>Pantone Color Matching</strong> guarantee</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Package className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span><strong>FSC-Certified Paper</strong> stocks available</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button to="/about" variant="secondary" size="md" className="text-center justify-center font-bold">
                  Learn More About Us
                </Button>
                <Button to="/services" variant="outline" size="md" className="text-center justify-center border-neutral-900 text-neutral-900 hover:border-[#A82F19] hover:text-[#A82F19] font-bold">
                  View All Services
                </Button>
                <Button to="/contact" variant="ghost" size="md" className="text-xs text-[#A82F19] hover:text-[#882210] font-bold">
                  Visit Pressroom →
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. Trust Badges Banner */}
      <section className="border-y border-[#A82F19]/15 bg-[#1C120E] py-7 sm:py-9">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {trustBadges.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-3.5 text-left">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#A82F19] text-white shadow-[0_8px_20px_rgba(168,47,25,0.35)]">
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                  </div>
                  <div>
                    <span className="block text-xs font-black leading-snug text-white">{item.label}</span>
                    {item.sub && <span className="mt-0.5 block text-[11px] font-semibold text-white/60">{item.sub}</span>}
                  </div>
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
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#A82F19]">OUR SERVICES</span>
              <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-[#000000] sm:text-4xl">
                Dubai’s Leading Commercial Printing Services
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#000000]/70 sm:text-base">
                Full-service commercial printing, executive office stationery, and custom packaging in Dubai with flawless Pantone precision.
              </p>
            </div>
            <ArrowLink to="/services" className="shrink-0 text-[#A82F19]">
              View All Print Services
            </ArrowLink>
          </div>

          <div className="mt-12">
            {services === null && <LoadingState type="cards" columns={4} count={4} label="Loading print services…" />}
            {services && services.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {services.map((service, idx) => (
                  <Reveal key={service._id || service.slug} delay={idx * 0.05}>
                    <ServiceCard service={service} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* 4. Dynamic Printing Categories Grid */}
      <section className="border-t border-[#000000]/10 bg-[#FFFFFF] py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#A82F19]">
                PRINTING CATEGORIES
              </span>
              <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-[#000000] sm:text-4xl">
                Commercial Printing Categories in Dubai
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#000000]/70 sm:text-base">
                Discover our specialized printing disciplines, from luxury brochures and executive cards to secure employee ID badges.
              </p>
            </div>
            <ArrowLink to="/categories" className="shrink-0 text-[#A82F19]">
              Explore All Categories
            </ArrowLink>
          </div>

          <div className="mt-12">
            {categories === null && <LoadingState type="cards" columns={4} count={4} label="Loading printing categories…" />}
            {categories && categories.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((cat, idx) => (
                  <Reveal key={cat.id || cat.slug} delay={idx * 0.05}>
                    <CategoryCard category={cat} priority={idx < 4} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* 5. Main Product Showcase Sections */}
      <ProductSectionsShowcase
        categories={categories}
        products={allProducts}
        onQuickView={setQuickViewProduct}
      />

      {/* 6. Carefree Shopping & Express Delivery Section */}
      <CarefreeShoppingSection />

      {/* 6. Featured Products Catalog */}
      <section className="border-t border-[#000000]/10 bg-[#FFFFFF] py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#A82F19]">SIGNATURE PRODUCTS</span>
              <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-[#000000] sm:text-4xl">
                Featured Printing Products &amp; Promotional Merchandise
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#000000]/70 sm:text-base">
                Browse our curated selection of premium corporate giveaways, business cards, brochures, thermal flasks, and event displays.
              </p>
            </div>
            <ArrowLink to="/products" className="shrink-0 text-[#A82F19]">
              Explore Full Product Catalog
            </ArrowLink>
          </div>

          <div className="mt-12">
            {featuredProducts === null && <LoadingState type="cards" columns={4} count={4} label="Loading product catalog…" />}
            {featuredProducts && featuredProducts.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product) => (
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

      {/* 7. Selected Press Work & Client Portfolio Showcase */}
      <section className="border-t border-[#000000]/10 bg-[#FFFFFF] py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#A82F19]">
                SELECTED PRESS WORK
              </span>
              <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-[#000000] sm:text-4xl">
                Crafted in Dubai. Delivered Across the UAE.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#000000]/70 sm:text-base">
                A selection of luxury packaging, executive stationery, and high-impact print collateral produced on our Al Quoz press floor.
              </p>
            </div>
            <ArrowLink to="/portfolio" className="shrink-0 text-[#A82F19]">
              View Full Portfolio
            </ArrowLink>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {portfolioItems.slice(0, 4).map((item, idx) => (
              <Reveal key={item.id} delay={idx * 0.08}>
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A82F19] hover:shadow-xl">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-black/80 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white backdrop-blur-xs">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#A82F19]">
                        {item.clientSector}
                      </span>
                      <h3 className="font-display mt-1 text-sm font-black text-black group-hover:text-[#A82F19] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[11px] font-medium leading-snug text-neutral-600 line-clamp-2">
                        {item.specs}
                      </p>
                    </div>
                    <div className="mt-4 border-t border-black/8 pt-3">
                      <ArrowLink to={`/get-a-quote?service=${encodeURIComponent(item.title)}`} className="text-xs font-bold text-[#A82F19]">
                        Inquire Spec
                      </ArrowLink>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 8. Why Choose Us */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF]">
        <Container>
          <div className="text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#A82F19]">WHY ONPRINT</span>
            <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-[#000000] sm:text-4xl">
              Why Leading Dubai Enterprises Choose ONPRINT
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-[#000000]/70 sm:text-base">
              The standard behind every press run for corporations, luxury hotels, agencies, and government entities across the UAE.
            </p>
          </div>

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
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#A82F19]">HOW IT WORKS</span>
            <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-[#000000] sm:text-4xl">
              Our 4-Step Precision Printing Process
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#000000]/70 sm:text-base">
              From artwork pre-flight verification to doorstep UAE delivery in 4 clear, disciplined steps.
            </p>
          </div>

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
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#A82F19]">ABOUT ONPRINT</span>
              <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-[#000000] sm:text-4xl">
                We Print More Than Paper. We Print Brand Trust in Dubai.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#000000]/75">
                Every piece of print that leaves our Al Quoz press floor carries a brand's reputation with it. That's why precision, paper tactile feel, and immaculate finishing are non-negotiable standards for our studio.
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <Button to="/about" variant="secondary" size="md" className="border-[#000000] text-[#000000] hover:border-[#A82F19] hover:text-[#A82F19]">
                Learn About Our Facility
              </Button>
              <Button to="/blog" variant="outline" size="md" className="border-[#000000]/20 text-[#000000] hover:border-[#A82F19] hover:text-[#A82F19]">
                Read Printing Guides
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

      {/* Dynamic Printing & Branding Knowledge Section */}
      {blogs && blogs.length > 0 && (
        <section className="border-t border-[#000000]/10 bg-[#FFFFFF] py-20 sm:py-28">
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#A82F19]">
                  PRINTING KNOWLEDGE &amp; GUIDES
                </span>
                <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-[#000000] sm:text-4xl">
                  Commercial Printing &amp; Branding Insights
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#000000]/70 sm:text-base">
                  Expert advice on substrate selection, hot foiling, Pantone CMYK matching, and pre-press standards in Dubai.
                </p>
              </div>
              <ArrowLink to="/blog" className="shrink-0 text-[#A82F19]">
                View All Guides
              </ArrowLink>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.slice(0, 3).map((blog, idx) => (
                <Reveal key={blog.id || blog.slug} delay={idx * 0.08}>
                  <article className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#000000]/15 bg-[#FFFFFF] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#A82F19] hover:shadow-lg">
                    <div>
                      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
                        <img
                          src={getBlogCoverImage(blog)}
                          alt={blog.image_alt || blog.imageAlt || blog.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      <div className="mt-5 flex items-center gap-3 text-[11px] font-bold text-neutral-500">
                        <span className="rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 text-[#A82F19] uppercase tracking-wider">
                          {blog.category || 'Printing Guide'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {blog.reading_time || blog.readTime || '4 min read'}
                        </span>
                      </div>

                      <h3 className="font-display mt-3 text-lg font-bold text-[#000000] transition-colors hover:text-[#A82F19]">
                        <Button to={`/blog/${blog.slug}`} variant="ghost" className="!p-0 !h-auto text-left font-display font-bold text-lg hover:text-[#A82F19]">
                          {blog.title}
                        </Button>
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-[#000000]/70 line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-[#000000]/10 pt-4">
                      <ArrowLink to={`/blog/${blog.slug}`} className="text-xs font-bold text-[#A82F19]">
                        Read Full Guide
                      </ArrowLink>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 10. Frequently Asked Questions (SEO Keyword Content Section) */}
      <section className="border-t border-[#000000]/10 bg-[#FFFFFF] py-20 sm:py-28">
        <Container className="max-w-4xl">
          <div className="text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#A82F19]">DUBAI PRINTING FAQ</span>
            <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-[#000000] sm:text-4xl">
              Frequently Asked Questions About Printing in Dubai
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#000000]/70 sm:text-base">
              Key information on order turnarounds, minimum quantities, paper stocks, and corporate gifting in the UAE.
            </p>
          </div>

          <div className="mt-12 divide-y divide-[#000000]/10 border-t border-b border-[#000000]/10">
            {homeFaqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <h3 className="font-display text-base font-bold text-[#000000] sm:text-lg group-hover:text-[#A82F19] transition-colors">
                    {faq.question}
                  </h3>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#000000]/50 transition-transform duration-300 group-open:rotate-180 group-hover:text-[#A82F19]" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#000000]/70 sm:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs font-bold text-[#000000]/60">
              Have specific project questions?{' '}
              <ArrowLink to="/contact" className="text-[#A82F19]">
                Speak to our print studio
              </ArrowLink>
            </p>
          </div>
        </Container>
      </section>

      {/* 11. Primary Dark Call to Action */}
      <section className="border-t border-[#000000] bg-[#000000] py-20 text-[#FFFFFF] sm:py-28">
        <Container className="flex flex-col items-center gap-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19]/40 bg-white/5 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#A82F19]">
            <Sparkles className="h-3.5 w-3.5 text-[#A82F19]" />
            Ready to Bring Your Brand to Life?
          </div>
          
          <h2 className="font-display max-w-3xl text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-[#FFFFFF]">
            LET’S BRING YOUR NEXT PRINT PROJECT TO LIFE.
          </h2>

          <p className="max-w-xl text-sm sm:text-base text-[#FFFFFF]/80 leading-relaxed">
            From business cards to luxury packaging and large-format printing, ONPRINT helps your brand stand out with unmatched precision across Dubai.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Button
              to="/get-a-quote"
              variant="accent"
              size="lg"
              className="shadow-lg shadow-[#A82F19]/30 text-center justify-center"
              onClick={() => trackGetQuoteClick({ source_page: 'homepage_bottom_cta' })}
            >
              Request a Custom Quote
            </Button>
            <Button to="/contact" variant="outline" size="lg" className="border-[#FFFFFF]/30 text-[#FFFFFF] hover:bg-[#FFFFFF]/10 hover:border-[#FFFFFF] text-center justify-center">
              Contact Sales Team
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
