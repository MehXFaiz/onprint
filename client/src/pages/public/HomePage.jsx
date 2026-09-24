import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Zap,
  Award,
  Users,
  CheckCircle,
  Sparkles,
  ChevronDown,
  Clock,
  ArrowRight,
  Package,
  Layers,
  MapPin,
  Info,
  Star,
  Printer,
  Feather,
  Palette,
  Gift,
  PhoneCall,
  Check,
} from 'lucide-react'
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
import LuxuryFinishesShowcase from '../../components/LuxuryFinishesShowcase'
import SampleBoxCTA from '../../components/SampleBoxCTA'
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
  '24K Hot Foil Stamping',
  'Raised 3D Spot UV',
  'Velvet Soft-Touch Lamination',
  'Sculptural Debossing',
  'Pantone Color Matching',
  'Heidelberg Speedmaster',
  'HP Indigo 12000 HD',
  'Same-Day Dubai Express',
  '600 GSM Archival Cotton',
  'FSC Certified Substrates',
  'Large Format Exhibition Graphics',
]

const homeFaqs = [
  {
    question: 'What printing services does ONPRINT offer in Dubai?',
    answer:
      'ONPRINT provides a comprehensive suite of commercial printing solutions in Dubai, including digital press printing, high-volume offset printing, executive office stationery, corporate gift items, die-cut vinyl stickers, and large-format exhibition signage.',
  },
  {
    question: 'Where is ONPRINT located in Dubai?',
    answer:
      'ONPRINT is located in Al Quoz Industrial Area 3, Dubai, UAE. Our production facility houses Heidelberg offset presses and HP Indigo digital presses, serving clients across Dubai, Abu Dhabi, Sharjah, and the entire UAE.',
  },
  {
    question: 'What is the turnaround time for print orders across Dubai and the UAE?',
    answer:
      'Standard digital printing runs (business cards, flyers, brochures) typically take 24 to 48 hours once artwork is approved. Large offset runs and specialty foil-embossed projects take 3 to 7 business days. Express same-day production is available for urgent requirements.',
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
        title="Printing Company in Dubai | ONPRINT – Commercial Printing Solutions"
        description="ONPRINT is Dubai’s premier luxury commercial printing company. Precision digital & offset printing, corporate gifts, business cards, brochures, and exhibition signage in UAE."
        keywords="printing company in dubai, commercial printing dubai, digital printing dubai, business card printing dubai, brochure printing dubai, sticker printing dubai, corporate gifts dubai"
        canonicalPath="/"
        faqList={homeFaqs}
      />

      {/* 1. Ultra-Luxury Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#FAF8F5] pt-12 sm:pt-16 lg:pt-20 border-b border-amber-900/10">
        {/* Background Ambience Layers */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_15%_15%,rgba(168,47,25,0.14),transparent_50%),radial-gradient(ellipse_70%_50%_at_85%_20%,rgba(212,175,55,0.16),transparent_50%),linear-gradient(180deg,#FAF8F5_0%,#F3ECE1_60%,#ECE3D4_100%)]"
          aria-hidden="true"
        />
        <div className="hero-paper-grain pointer-events-none absolute inset-0 -z-10 opacity-30" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(20,16,12,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(20,16,12,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_35%,#000_30%,transparent_80%)]"
          aria-hidden="true"
        />

        {/* CMYK Color Edge Indicator */}
        <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-2 sm:flex flex-col" aria-hidden="true">
          <span className="h-1/4 bg-[#00AEEF]" />
          <span className="h-1/4 bg-[#EC008C]" />
          <span className="h-1/4 bg-[#FFF200]" />
          <span className="h-1/4 bg-[#231F20]" />
        </div>

        {/* Big Watermark Print Text */}
        <p
          className="pointer-events-none absolute -right-6 top-16 hidden select-none font-display text-[10rem] font-black leading-none tracking-tighter text-[#A82F19]/[0.05] xl:block"
          aria-hidden="true"
        >
          ATELIER
        </p>

        <div className="pointer-events-none absolute top-7 left-10 hidden xl:block opacity-30 text-neutral-600">
          <CornerMarks className="h-6 w-6" />
        </div>
        <div className="pointer-events-none absolute top-7 right-10 hidden xl:block opacity-30 text-neutral-600">
          <CornerMarks className="h-6 w-6" />
        </div>

        <Container className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Hero Text & Call to Actions */}
          <div className="lg:col-span-6 space-y-6">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#D4AF37]/40 bg-white/90 px-4 py-1.5 shadow-[0_8px_30px_rgba(212,175,55,0.12)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A82F19] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#A82F19]" />
                </span>
                <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span className="uppercase tracking-[0.22em] text-[10.5px] font-black text-neutral-900">
                  Dubai’s Fine Art Print &amp; Packaging Atelier
                </span>
                <span className="hidden sm:inline-block h-3 w-px bg-neutral-300" />
                <span className="hidden sm:inline-block font-mono text-[9px] font-bold tracking-wider text-[#A82F19]">
                  AL QUOZ 3
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.65rem] xl:text-[4.25rem] font-black leading-[1.04] tracking-tight text-neutral-950">
                Bespoke Commercial Printing &amp;{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#7A1C0D] via-[#A82F19] to-[#D4AF37] bg-clip-text text-transparent">
                    Luxury Finishes
                  </span>
                  <span
                    className="absolute -bottom-1.5 left-0 h-[5px] w-full rounded-full bg-gradient-to-r from-[#A82F19] via-[#D4AF37] to-transparent"
                    aria-hidden="true"
                  />
                </span>{' '}
                in Dubai, UAE
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="max-w-xl text-base sm:text-lg leading-[1.8] text-neutral-700">
                ONPRINT is an in-house commercial pressroom and fine print atelier in{' '}
                <strong className="font-bold text-neutral-950">Al Quoz Industrial Area 3, Dubai</strong>. We craft{' '}
                <strong className="font-bold text-neutral-950">24K hot foil business cards</strong>,{' '}
                multi-page catalogs, executive stationery, and VIP executive corporate gifts with flawless German Heidelberg color accuracy.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Button
                  to="/products"
                  variant="accent"
                  size="lg"
                  className="relative overflow-hidden !rounded-2xl !bg-[#A82F19] hover:!bg-[#8c2211] text-white font-black shadow-[0_16px_36px_rgba(168,47,25,0.38)] hover:-translate-y-0.5 !px-8 !py-4 justify-center"
                >
                  Explore Luxury Collection
                </Button>
                <Button
                  to="/get-a-quote"
                  variant="secondary"
                  size="lg"
                  className="!rounded-2xl !border-2 !border-neutral-950 !bg-neutral-950 !text-white hover:!bg-[#1a1a1a] font-black justify-center !px-8 !py-4 hover:-translate-y-0.5"
                  onClick={() => trackGetQuoteClick({ source_page: 'homepage_hero' })}
                >
                  Request Bespoke Quote
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 pt-1">
                {[
                  { icon: Award, label: 'ISO 12647-2', sub: 'Calibrated Press' },
                  { icon: Clock, label: '24h Turnaround', sub: 'Same-Day Express' },
                  { icon: Layers, label: '24K Gold Foil', sub: '& 3D Raised Spot UV' },
                  { icon: ShieldCheck, label: 'Direct Pressroom', sub: 'No Broker Markups' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.label}
                      className="group rounded-2xl border border-white/80 bg-white/85 p-3 shadow-[0_8px_24px_rgba(40,24,12,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-[0_16px_32px_rgba(212,175,55,0.15)]"
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
                  <span className="text-neutral-500">Verified UAE Reviews</span>
                </div>
                <span className="hidden sm:inline text-neutral-300">•</span>
                <span className="font-bold text-neutral-800">500+ Corporate Clients</span>
                <span className="hidden sm:inline text-neutral-300">•</span>
                <span className="inline-flex items-center gap-1 font-bold text-neutral-800">
                  <CheckCircle className="h-3.5 w-3.5 text-[#A82F19]" />
                  White-Glove UAE Delivery
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Master Luxury 3D Multi-Layer Atelier Showcase (ADDRESSING THE EMPTY BACKSIDE) */}
          <div className="lg:col-span-6">
            <Reveal delay={0.16}>
              <div className="relative mx-auto h-[480px] w-full max-w-[580px] sm:h-[550px] lg:h-[570px]">
                {/* Main Dark Obsidian & Warm Mahogany Backdrop Canvas */}
                <div className="absolute inset-2 sm:inset-x-4 sm:inset-y-4 rounded-[2.5rem] bg-gradient-to-br from-[#1c1410] via-[#321c15] to-[#120c09] shadow-[0_40px_100px_rgba(40,16,10,0.45)] border border-amber-900/30 overflow-hidden">
                  {/* Glowing Ambient Lights in Backdrop */}
                  <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-[#D4AF37]/25 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-16 -left-12 h-64 w-64 rounded-full bg-[#A82F19]/35 blur-3xl" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Top Studio Registration Bar inside Container */}
                <div className="absolute left-7 top-7 z-20 hidden items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.24em] text-white/85 sm:flex">
                  <Printer className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>ONPRINT ATELIER • DUBAI</span>
                  <CmykDots />
                </div>

                <div className="absolute right-7 top-7 z-20 hidden items-center gap-1.5 rounded-full bg-black/70 border border-white/15 px-3 py-1 text-[9px] font-bold text-white shadow-lg backdrop-blur-md sm:flex">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  SAME-DAY EXPRESS • DUBAI
                </div>

                {/* 1. TOP-LEFT / FRONT LAYER: 600 GSM COTTON BUSINESS CARDS */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [-7, -5, -7] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  className="hero-card-sheen absolute left-1 sm:left-3 top-20 sm:top-24 z-30 w-[54%] overflow-hidden rounded-2xl border border-white/40 bg-white p-2.5 shadow-[0_34px_70px_rgba(0,0,0,0.4)]"
                >
                  <div className="relative h-36 sm:h-44 overflow-hidden rounded-xl bg-neutral-100">
                    <img
                      src="/assets/products/luxury_business_cards.jpg"
                      alt="Executive Cotton Business Cards Dubai"
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                    <span className="absolute left-2 top-2 rounded-md bg-[#A82F19] px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-sm">
                      Hot Foil &amp; Spot UV 3D
                    </span>
                    <span className="absolute bottom-2 right-2 rounded-md bg-black/85 px-2 py-0.5 text-[8px] font-black text-white">
                      600 GSM
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between px-0.5">
                    <p className="text-xs font-black text-neutral-950">Italian Cotton Card Stock</p>
                    <span className="text-[10px] font-black text-[#A82F19]">FSC</span>
                  </div>
                </motion.div>

                {/* 2. TOP-RIGHT / ACCENT LAYER: BESPOKE LUXURY RIGID BOX PACKAGING (FILLS PREVIOUSLY EMPTY AREA) */}
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [4, 6, 4] }}
                  transition={{ duration: 7.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  className="hero-card-sheen absolute right-2 sm:right-4 top-16 sm:top-20 z-20 w-[47%] overflow-hidden rounded-2xl border border-white/40 bg-white p-2 shadow-[0_28px_60px_rgba(0,0,0,0.35)]"
                >
                  <div className="relative h-28 sm:h-36 overflow-hidden rounded-xl bg-neutral-900">
                    <img
                      src="/assets/products/service_luxury_packaging.jpg"
                      alt="Bespoke Luxury Rigid Packaging and Gift Boxes Dubai"
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                    <span className="absolute left-2 top-2 rounded-md bg-[#D4AF37] px-2 py-0.5 text-[7.5px] font-black uppercase tracking-wider text-neutral-950 shadow-sm">
                      Rigid Box &amp; Foil
                    </span>
                    <span className="absolute bottom-2 right-2 rounded-md bg-black/85 px-2 py-0.5 text-[7.5px] font-bold text-white">
                      Bespoke
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-black px-0.5">
                    <span className="text-neutral-950">Luxury Gift Boxes</span>
                    <span className="text-[#A82F19]">Custom Die-Cut</span>
                  </div>
                </motion.div>

                {/* 3. BOTTOM-RIGHT / BACK-MID LAYER: VIP COPPER FLASK & CORPORATE GIFTING */}
                <motion.div
                  animate={{ y: [0, -7, 0], rotate: [2, 0, 2] }}
                  transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="hero-card-sheen absolute right-2 sm:right-4 bottom-12 sm:bottom-14 z-25 w-[48%] overflow-hidden rounded-2xl border border-white/40 bg-white p-2 shadow-[0_26px_55px_rgba(0,0,0,0.3)]"
                >
                  <div className="relative h-24 sm:h-32 overflow-hidden rounded-xl bg-neutral-900">
                    <img
                      src="/assets/products/bottle_luxury_copper.jpg"
                      alt="VIP Corporate Gifts and Laser Engraved Drinkware Dubai"
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/85 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-amber-300">
                      VIP Corporate Gifting
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-black px-0.5">
                    <span className="text-neutral-950">Copper Thermal Flask</span>
                    <span className="text-[#A82F19]">Laser Etched</span>
                  </div>
                </motion.div>

                {/* 3. BOTTOM-LEFT / MID LAYER: LUXURY BROCHURES & MULTI-PAGE CATALOGS */}
                <motion.div
                  animate={{ y: [0, 8, 0], rotate: [-4, -2, -4] }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                  className="hero-card-sheen absolute left-3 sm:left-6 bottom-8 sm:bottom-10 z-20 w-[46%] overflow-hidden rounded-2xl border border-white/40 bg-white p-2 shadow-[0_24px_50px_rgba(0,0,0,0.25)]"
                >
                  <div className="relative h-22 sm:h-28 overflow-hidden rounded-xl bg-neutral-100">
                    <img
                      src="/assets/products/brochure_gatefold.jpg"
                      alt="Luxury Gatefold Brochures Dubai"
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                    <span className="absolute bottom-2 left-2 rounded-md bg-[#A82F19]/90 px-2 py-0.5 text-[7.5px] font-bold text-white shadow-xs">
                      Gatefold Brochures
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[9.5px] font-bold px-0.5">
                    <span className="text-neutral-950">350 GSM Silk</span>
                    <span className="text-neutral-600">Spot Gloss</span>
                  </div>
                </motion.div>

                {/* Center Floating Glassmorphic Quality Stamp */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-2xl border border-[#D4AF37]/50 bg-neutral-950/95 px-4 py-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-md"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8c701e] text-black font-black">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[12px] font-black leading-tight text-white">1200 DPI Ultra-HD</div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF37]">Heidelberg Speedmaster</div>
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </Container>

        {/* Hero Marquee Bar */}
        <div className="relative mt-10 border-y border-[#A82F19]/25 bg-neutral-950 py-3.5 text-white">
          <div className="overflow-hidden">
            <div className="hero-marquee-track gap-8 pr-8">
              {[...heroMarquee, ...heroMarquee].map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="flex shrink-0 items-center gap-8 text-[11px] font-black uppercase tracking-[0.22em]"
                >
                  <span className="text-neutral-200">{item}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Floating Category Quick-Access Panel */}
      <div className="relative z-20 bg-gradient-to-b from-[#ECE3D4] to-white pb-6 pt-8">
        <Container>
          <div className="rounded-3xl border border-[#A82F19]/15 bg-white/95 p-4 sm:p-6 shadow-[0_24px_60px_rgba(88,32,16,0.08)] backdrop-blur-md">
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#A82F19] ring-2 ring-[#A82F19]/25 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-neutral-900">
                  Popular Print Categories
                </span>
              </div>
              <Link
                to="/categories"
                className="text-xs font-black text-[#A82F19] hover:text-[#882210] flex items-center gap-1 transition-colors"
              >
                <span>All Categories {categories ? `(${categories.length})` : ''}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Categories Grid */}
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

      {/* 3. NEW: Interactive Luxury Finishes Showcase */}
      <LuxuryFinishesShowcase />

      {/* 4. Trust Badges Banner */}
      <section className="border-y border-[#A82F19]/20 bg-[#140E0C] py-8 sm:py-10">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustBadges.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-4 text-left">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A82F19] to-[#7A1C0D] text-white shadow-[0_8px_20px_rgba(168,47,25,0.35)]">
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                  </div>
                  <div>
                    <span className="block text-sm font-black leading-snug text-white">{item.label}</span>
                    {item.sub && <span className="mt-0.5 block text-xs font-semibold text-neutral-400">{item.sub}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* 5. What is ONPRINT - Clear Business Definition & Capabilities */}
      <section className="border-b border-neutral-200/80 bg-white py-14 sm:py-20">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-700">
                  <Info className="h-3.5 w-3.5" />
                  <span>About ONPRINT Atelier</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-3 py-1 text-xs font-bold text-[#A82F19]">
                  Verified Commercial Press
                </span>
                <span className="text-xs font-semibold text-neutral-500">Al Quoz 3, Dubai, UAE</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-950 mb-4">
                What is ONPRINT?
              </h2>

              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p className="text-base sm:text-lg font-medium text-neutral-900">
                  <strong>ONPRINT</strong> (also known as <strong>0nprint</strong>) is a premier commercial printing company, fine print atelier, and corporate merchandise manufacturer located in Al Quoz Industrial Area 3, Dubai, serving enterprises across the United Arab Emirates.
                </p>

                <p className="text-sm sm:text-base">
                  We specialize in digital press printing, offset lithography, VIP corporate gifts, executive office stationery, brochures, vinyl stickers, and large-format exhibition graphics. Our Al Quoz production facility houses calibrated Heidelberg offset presses and HP Indigo digital presses.
                </p>
              </div>

              {/* Quick Business Specs Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl border border-neutral-200/80 bg-neutral-50/80 p-4 text-xs text-neutral-600">
                <div><span className="font-black text-neutral-950 block">Facility:</span> Al Quoz Ind. Area 3, Dubai</div>
                <div><span className="font-black text-neutral-950 block">Support:</span> WhatsApp Concierge</div>
                <div><span className="font-black text-neutral-950 block">Hours:</span> Mon–Sat 8:30–18:30</div>
                <div><span className="font-black text-neutral-950 block">Delivery:</span> All 7 Emirates (Express 24h)</div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800 mb-3">Our Core Disciplines</h3>
                  <ul className="space-y-2 text-sm text-neutral-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span>Heidelberg Offset &amp; HP Indigo Digital</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span>600 GSM Cotton &amp; 24K Hot Foil Cards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span>Laser-Engraved VIP Corporate Gifts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span>Large Format Banners &amp; Trade Show Displays</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800 mb-3">The ONPRINT Advantage</h3>
                  <ul className="space-y-2 text-sm text-neutral-700">
                    <li className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span><strong>10+ Years Experience</strong> in Dubai commercial printing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span><strong>500+ Corporate Clients</strong> across the UAE</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span><strong>Direct Al Quoz Facility</strong> (Zero Broker Markups)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span><strong>Same-Day &amp; 24h Express</strong> dispatch available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span><strong>Pantone Color Matching</strong> &amp; Pre-Press Proofing</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button to="/about" variant="secondary" size="md" className="text-center justify-center font-bold">
                  Explore Our Pressroom
                </Button>
                <Button to="/services" variant="outline" size="md" className="text-center justify-center border-neutral-900 text-neutral-900 hover:border-[#A82F19] hover:text-[#A82F19] font-bold">
                  View All Services
                </Button>
                <Button to="/contact" variant="ghost" size="md" className="text-xs text-[#A82F19] hover:text-[#882210] font-bold">
                  Visit Al Quoz Pressfloor →
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 7. Services Grid */}
      <section className="py-20 sm:py-28 bg-[#FAF8F5]">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">OUR SERVICES</span>
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

      {/* 8. Dynamic Printing Categories Grid */}
      <section className="border-t border-[#000000]/10 bg-[#FFFFFF] py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
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

      {/* 9. Main Product Showcase Sections */}
      <ProductSectionsShowcase
        categories={categories}
        products={allProducts}
        onQuickView={setQuickViewProduct}
      />

      {/* 10. Carefree Shopping & Express Delivery Section */}
      <CarefreeShoppingSection />

      {/* 11. NEW: Complimentary Sample Box CTA */}
      <SampleBoxCTA />

      {/* 12. Featured Products Catalog */}
      <section className="border-t border-[#000000]/10 bg-[#FFFFFF] py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">SIGNATURE PRODUCTS</span>
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

      {/* 13. Selected Press Work & Client Portfolio Showcase */}
      <section className="border-t border-[#000000]/10 bg-[#FAF8F5] py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
                SELECTED PRESS WORK
              </span>
              <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-[#000000] sm:text-4xl">
                Crafted in Dubai. Delivered Across the UAE.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#000000]/70 sm:text-base">
                A selection of executive stationery, corporate merchandise, and high-impact print collateral produced on our Al Quoz press floor.
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
                      <span className="rounded-md bg-black/80 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-xs">
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

      {/* 14. Why Choose Us */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF]">
        <Container>
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">WHY ONPRINT</span>
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

      {/* 15. Production Process Timeline */}
      <section className="border-t border-[#000000]/10 bg-[#FAF8F5] py-20 sm:py-28">
        <Container>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">HOW IT WORKS</span>
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

      {/* 16. Story & Stat Counters */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF]">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">ABOUT ONPRINT</span>
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

      {/* 17. Dynamic Printing & Branding Knowledge Section */}
      {blogs && blogs.length > 0 && (
        <section className="border-t border-[#000000]/10 bg-[#FAF8F5] py-20 sm:py-28">
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
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

      {/* 18. Frequently Asked Questions */}
      <section className="border-t border-[#000000]/10 bg-[#FFFFFF] py-20 sm:py-28">
        <Container className="max-w-4xl">
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">DUBAI PRINTING FAQ</span>
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

      {/* 19. Primary Luxury Dark Call to Action */}
      <section className="border-t border-[#000000] bg-[#120D0B] py-20 text-[#FFFFFF] sm:py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(212,175,55,0.12),transparent_70%),radial-gradient(ellipse_60%_50%_at_50%_90%,rgba(168,47,25,0.18),transparent_70%)]" />

        <Container className="relative z-10 flex flex-col items-center gap-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            Ready to Bring Your Brand to Life?
          </div>

          <h2 className="font-display max-w-3xl text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-[#FFFFFF]">
            LET’S BRING YOUR NEXT PRINT PROJECT TO LIFE.
          </h2>

          <p className="max-w-xl text-sm sm:text-base text-neutral-300 leading-relaxed">
            From 600 GSM cotton business cards to bespoke rigid gift packaging and large-format exhibition signage, ONPRINT delivers unmatched precision across Dubai.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            <Button
              to="/get-a-quote"
              variant="accent"
              size="lg"
              className="!bg-[#A82F19] hover:!bg-[#8c2211] shadow-xl shadow-[#A82F19]/40 text-center justify-center font-black !py-4 !px-8"
              onClick={() => trackGetQuoteClick({ source_page: 'homepage_bottom_cta' })}
            >
              Request a Custom Quote
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white text-center justify-center font-bold !py-4 !px-8"
            >
              Contact Atelier Team
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
