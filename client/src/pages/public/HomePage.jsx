import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Award, Users, CheckCircle, Sparkles, ChevronDown, Clock, ArrowRight, Package, Layers, MapPin, Info, Star } from 'lucide-react'
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
import { CornerMarks, CmykDots, RegistrationMark } from '../../components/PrintMarks'
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

      {/* 1. Hero Section - Luxury Atelier Edition */}
      <section className="relative isolate overflow-hidden border-b border-neutral-200/80 bg-white py-14 sm:py-20 lg:py-24">
        {/* Luxury Cotton Micro-Dot Canvas Texture (Replaces sterile wireframe grid) */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#0000000f_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,#000_25%,transparent_85%)]"
          aria-hidden="true"
        />

        {/* Multi-Layered Ambient Studio Lighting (Obsidian & Garnet Bloom) */}
        <div
          className="pointer-events-none absolute -top-24 left-1/4 -z-10 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-[#A82F19]/8 via-[#c9361e]/4 to-transparent blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/3 -right-16 -z-10 h-[560px] w-[560px] rounded-full bg-gradient-to-bl from-amber-500/5 via-[#A82F19]/4 to-transparent blur-[130px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-10 left-10 -z-10 h-64 w-64 rounded-full bg-slate-900/5 blur-[100px]"
          aria-hidden="true"
        />

        {/* Atelier Technical Registration Marks & Precision Millimeter Scales */}
        <div className="pointer-events-none absolute top-6 left-8 hidden xl:block opacity-25 text-neutral-400">
          <CornerMarks className="h-6 w-6" />
        </div>
        <div className="pointer-events-none absolute top-6 right-8 hidden xl:block opacity-25 text-neutral-400">
          <CornerMarks className="h-6 w-6" />
        </div>
        <div className="pointer-events-none absolute top-1/2 left-6 hidden 2xl:flex flex-col items-center gap-2 opacity-25 text-neutral-400 -translate-y-1/2">
          <div className="h-10 w-[1px] bg-neutral-300" />
          <span className="font-mono text-[8px] uppercase tracking-[0.25em] rotate-90 text-neutral-400">
            0mm • CMYK
          </span>
          <div className="h-10 w-[1px] bg-neutral-300" />
        </div>

        <Container className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-6">
            {/* Bespoke Atelier Seal Badge */}
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-neutral-900/10 bg-white/95 px-4 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md ring-1 ring-black/[0.04] transition-all hover:border-[#A82F19]/30 hover:shadow-[0_4px_16px_rgba(168,47,25,0.08)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A82F19] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A82F19]"></span>
                </span>
                <Sparkles className="h-3.5 w-3.5 text-[#A82F19]" />
                <span className="uppercase tracking-[0.22em] text-[10.5px] font-black text-neutral-900">
                  Dubai’s Premier Print &amp; Branding Press
                </span>
                <span className="hidden sm:inline-block h-3 w-[1px] bg-neutral-200" aria-hidden="true" />
                <span className="hidden sm:inline-block font-mono text-[9px] font-bold text-neutral-400 tracking-wider">
                  AL QUOZ 3
                </span>
              </div>
            </Reveal>

            {/* Monumental Editorial Headline */}
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-black leading-[1.07] tracking-tight text-neutral-950">
                Custom Packaging &amp;{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#A82F19] via-[#cf3a22] to-[#882210] bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(168,47,25,0.18)]">
                    Printing Services
                  </span>
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-[#A82F19] via-[#e2553b] to-transparent opacity-85"
                    aria-hidden="true"
                  />
                </span>{' '}
                in Dubai, UAE
              </h1>
            </Reveal>

            {/* Supporting Paragraph */}
            <Reveal delay={0.18}>
              <p className="text-base sm:text-lg leading-[1.75] text-neutral-600 font-normal max-w-xl">
                ONPRINT is a commercial printing press and custom packaging studio located in{' '}
                <strong className="font-semibold text-neutral-900">Al Quoz Industrial Area 3, Dubai</strong>. We deliver{' '}
                <strong className="font-semibold text-neutral-900">precision digital and offset printing</strong>,{' '}
                <strong className="font-semibold text-neutral-900">bespoke luxury packaging</strong>, fast-turnaround business stationery, and corporate merchandise across Dubai and the UAE.
              </p>
            </Reveal>

            {/* 4 Luxury Atelier Value Pillars */}
            <Reveal delay={0.24}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="group relative rounded-xl border border-neutral-200/90 bg-white/95 p-3 sm:p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:border-[#A82F19]/40 hover:shadow-[0_12px_24px_rgba(168,47,25,0.08)] hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#fdf2f0] to-[#fbf0ee] border border-[#A82F19]/15 text-[#A82F19] shadow-2xs group-hover:bg-[#A82F19] group-hover:text-white transition-colors duration-300">
                      <Award className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-black text-neutral-900 tracking-tight group-hover:text-[#A82F19] transition-colors truncate">
                        Premium Quality
                      </span>
                      <span className="block text-[10px] font-semibold text-neutral-400 mt-0.5 tracking-normal truncate">
                        ISO 12647-2 Press
                      </span>
                    </div>
                  </div>
                </div>

                <div className="group relative rounded-xl border border-neutral-200/90 bg-white/95 p-3 sm:p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:border-[#A82F19]/40 hover:shadow-[0_12px_24px_rgba(168,47,25,0.08)] hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#fdf2f0] to-[#fbf0ee] border border-[#A82F19]/15 text-[#A82F19] shadow-2xs group-hover:bg-[#A82F19] group-hover:text-white transition-colors duration-300">
                      <Clock className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-black text-neutral-900 tracking-tight group-hover:text-[#A82F19] transition-colors truncate">
                        Fast Turnaround
                      </span>
                      <span className="block text-[10px] font-semibold text-neutral-400 mt-0.5 tracking-normal truncate">
                        24h Express Available
                      </span>
                    </div>
                  </div>
                </div>

                <div className="group relative rounded-xl border border-neutral-200/90 bg-white/95 p-3 sm:p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:border-[#A82F19]/40 hover:shadow-[0_12px_24px_rgba(168,47,25,0.08)] hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#fdf2f0] to-[#fbf0ee] border border-[#A82F19]/15 text-[#A82F19] shadow-2xs group-hover:bg-[#A82F19] group-hover:text-white transition-colors duration-300">
                      <Layers className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-black text-neutral-900 tracking-tight group-hover:text-[#A82F19] transition-colors truncate">
                        Custom Solutions
                      </span>
                      <span className="block text-[10px] font-semibold text-neutral-400 mt-0.5 tracking-normal truncate">
                        Bespoke Finishes
                      </span>
                    </div>
                  </div>
                </div>

                <div className="group relative rounded-xl border border-neutral-200/90 bg-white/95 p-3 sm:p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:border-[#A82F19]/40 hover:shadow-[0_12px_24px_rgba(168,47,25,0.08)] hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#fdf2f0] to-[#fbf0ee] border border-[#A82F19]/15 text-[#A82F19] shadow-2xs group-hover:bg-[#A82F19] group-hover:text-white transition-colors duration-300">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-black text-neutral-900 tracking-tight group-hover:text-[#A82F19] transition-colors truncate">
                        Expert Support
                      </span>
                      <span className="block text-[10px] font-semibold text-neutral-400 mt-0.5 tracking-normal truncate">
                        Pre-Press Concierge
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Two CTA Buttons with Luxury Styling */}
            <Reveal delay={0.3}>
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
                  <Button
                    to="/products"
                    variant="accent"
                    size="lg"
                    className="relative overflow-hidden !rounded-xl !bg-gradient-to-r !from-[#A82F19] !via-[#b8311a] !to-[#8c2211] hover:!from-[#932814] hover:!via-[#a22b16] hover:!to-[#7a1c0d] text-white font-extrabold shadow-[0_10px_26px_rgba(168,47,25,0.32)] hover:shadow-[0_14px_34px_rgba(168,47,25,0.45)] hover:-translate-y-0.5 transition-all text-center justify-center !px-7 !py-4 group"
                  >
                    <span
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
                      aria-hidden="true"
                    />
                    <span className="relative z-10 tracking-wide">Explore Our Products</span>
                    <ArrowRight className="relative z-10 h-4 w-4 ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Button>

                  <Button
                    to="/get-a-quote"
                    variant="secondary"
                    size="lg"
                    className="relative !rounded-xl border-2 border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 hover:border-neutral-800 font-extrabold text-center justify-center !px-7 !py-4 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:-translate-y-0.5"
                    onClick={() => trackGetQuoteClick({ source_page: 'homepage_hero' })}
                  >
                    <span className="tracking-wide">Get a Quote</span>
                  </Button>
                </div>

                {/* Luxury Client Proof Ribbon */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-extrabold text-neutral-900">4.9/5</span>
                    <span className="text-neutral-400">(Verified UAE Client Reviews)</span>
                  </div>
                  <span className="hidden sm:inline-block text-neutral-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A82F19]" />
                    <span className="font-bold text-neutral-800">500+ Corporate Clients</span>
                  </div>
                  <span className="hidden sm:inline-block text-neutral-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-[#A82F19]" />
                    <span className="font-bold text-neutral-800">Direct Al Quoz Pressroom</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT COLUMN: Luxury Atelier Vitrine Product Showcase */}
          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <div className="relative mx-auto flex h-[480px] sm:h-[530px] w-full max-w-[480px] items-center justify-center">
                {/* Studio Pedestal Base Frame */}
                <div className="absolute inset-1 sm:inset-3 rounded-3xl border border-neutral-200/90 bg-gradient-to-br from-white/95 via-neutral-50/90 to-neutral-100/70 p-4 sm:p-5 shadow-[0_30px_90px_rgba(0,0,0,0.1),0_10px_30px_rgba(168,47,25,0.05)] ring-1 ring-black/[0.04]">
                  {/* Top Studio Calibration Bar */}
                  <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3 text-[10px] font-black uppercase tracking-wider text-neutral-500">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A82F19] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A82F19]"></span>
                      </span>
                      <span className="tracking-widest font-black text-neutral-800">ONPRINT ATELIER • DUBAI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CmykDots />
                      <span className="font-mono text-[9px] font-bold text-neutral-400">ISO 12647-2</span>
                    </div>
                  </div>
                </div>

                {/* Layer 1: Luxury Shopping Bags & Bespoke Packaging (Top Right) */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute right-1 sm:right-3 top-7 sm:top-9 z-10 w-48 sm:w-56 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_22px_45px_rgba(0,0,0,0.14)] transition-shadow duration-300"
                >
                  <div className="relative h-28 sm:h-32 w-full overflow-hidden rounded-xl bg-neutral-100">
                    <img
                      src="/assets/products/tote_bags.jpg"
                      alt="Luxury Branded Packaging and Bags in Dubai"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/85 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                      Bespoke Packaging
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[9.5px] font-bold text-neutral-800">
                    <span className="truncate">Embossed Foil Bags</span>
                    <span className="text-[#A82F19] font-black shrink-0 ml-1">Luxury Grade</span>
                  </div>
                </motion.div>

                {/* Layer 2: Centerpiece - 600 GSM Velvet Card & Gold Hot Foil (Center / Left) */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-1 sm:left-3 top-14 sm:top-18 z-20 w-60 sm:w-68 overflow-hidden rounded-2xl border border-black/10 bg-white p-3 sm:p-3.5 shadow-[0_28px_60px_rgba(0,0,0,0.14),0_8px_20px_rgba(168,47,25,0.06)] hover:shadow-[0_32px_70px_rgba(0,0,0,0.18)] transition-shadow duration-300"
                >
                  <div className="relative h-38 sm:h-44 w-full overflow-hidden rounded-xl bg-neutral-100">
                    <img
                      src="/assets/products/luxury_business_cards.jpg"
                      alt="Executive Cotton Business Cards Dubai"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="eager"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="rounded-md bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white shadow-xs">
                        Hot Foil &amp; Spot UV
                      </span>
                    </div>
                    <span className="absolute bottom-2 right-2 rounded-md bg-black/85 px-2 py-0.5 text-[8px] font-black text-white backdrop-blur-xs">
                      600 GSM
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-wider text-neutral-500">
                      <span>Executive Press</span>
                      <span className="text-[#A82F19] font-black">FSC Certified</span>
                    </div>
                    <p className="text-xs sm:text-[13px] font-black text-neutral-950 leading-snug">
                      Luxury Cotton Card Stock
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-neutral-100 pt-2 text-[9px] font-bold text-neutral-600">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Precision Laser Bleed
                    </span>
                    <span className="text-[#A82F19] font-black">Passed QC ✓</span>
                  </div>
                </motion.div>

                {/* Layer 3: Executive Brochures & Corporate Materials (Bottom Right) */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute right-2 sm:right-4 bottom-4 sm:bottom-6 z-15 w-46 sm:w-52 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_22px_45px_rgba(0,0,0,0.14)] transition-shadow duration-300"
                >
                  <div className="relative h-20 sm:h-24 w-full overflow-hidden rounded-xl bg-neutral-100">
                    <img
                      src="/assets/products/brochures.jpg"
                      alt="Corporate Marketing Brochures Dubai"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-2 text-[8px] font-bold text-white">
                      Multi-Page Brochures
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[9px] font-bold text-neutral-700">
                    <span>Art Paper 300 GSM</span>
                    <span className="text-neutral-950 font-extrabold">Heidelberg</span>
                  </div>
                </motion.div>

                {/* Floating Technical Badge: 1200 DPI HD Digital Press */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-2 sm:bottom-2 left-2 sm:left-4 z-30 flex h-14 items-center gap-2.5 rounded-xl border border-neutral-200/90 bg-white/95 px-3 py-1.5 shadow-[0_12px_28px_rgba(0,0,0,0.1)] backdrop-blur-md"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#A82F19] text-white shadow-xs">
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 pr-1">
                    <div className="text-[11px] font-black text-neutral-950 leading-tight">1200 DPI</div>
                    <div className="text-[8px] font-bold uppercase tracking-wider text-[#A82F19]">HD Digital Press</div>
                  </div>
                </motion.div>

                {/* Floating Dispatch Badge: Same-Day Dubai Courier */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-2 -right-1 sm:right-1 z-30 hidden sm:flex items-center gap-1.5 rounded-full border border-neutral-900/10 bg-neutral-950 text-white px-3 py-1 text-[9px] font-bold shadow-lg"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SAME-DAY EXPRESS • DUBAI</span>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 1.5 Floating Category Quick-Access Panel (Overlapping bottom of Hero) */}
      <div className="relative -mt-10 sm:-mt-14 z-20 pb-4">
        <Container>
          <div className="rounded-2xl border border-neutral-200/90 bg-white/95 p-3.5 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-md ring-1 ring-black/[0.03]">
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
      <section className="border-b border-[#000000]/10 bg-[#FFFFFF] py-6 sm:py-8">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
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
                <div key={item.label} className="flex items-center gap-3.5 text-left">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#A82F19]/10 text-[#A82F19]">
                    {renderBadgeIcon()}
                  </div>
                  <div>
                    <span className="block text-xs font-black text-[#000000] leading-snug">{item.label}</span>
                    {item.sub && <span className="block text-[11px] font-semibold text-[#000000]/60 mt-0.5">{item.sub}</span>}
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
