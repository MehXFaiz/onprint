import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  Send,
  Sliders,
  ChevronRight,
  ExternalLink,
  MessageCircle,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import ArrowLink from '../../components/ArrowLink'
import WhatsAppIcon from '../../components/WhatsAppIcon'
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
      'ONPRINT is located in Al Quoz, Dubai, UAE. Our production facility houses Heidelberg offset presses and HP Indigo digital presses, serving clients across Dubai, Abu Dhabi, Sharjah, and the entire UAE.',
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
      'Printing costs vary based on quantity, material, size, and finishing options. Standard business cards start from just AED 45 for 100 cards, while custom packaging, exhibition banners, and large format printing are quoted based on exact specifications. Contact us for a detailed instant quote tailored to your requirements.',
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

const atelierShowcaseItems = [
  {
    id: 'cotton-foil',
    category: 'Cotton Foil Cards',
    title: '24K Hot Foil & Raised 3D Spot UV',
    subtitle: 'Presidential 600 GSM Italian Archival Cotton Stock',
    badge: 'Signature Craft',
    specs: ['Brass Die-Cast', 'Zero Flaking', 'Heidelberg Calibrated'],
    accent: '#A82F19',
    tag: 'Same-Day Dubai',
    image: '/assets/products/luxury_business_cards.jpg',
    thumb: '/assets/products/luxury_business_cards.jpg',
    metric: '600 GSM',
    metricLabel: 'Cotton Board',
  },
  {
    id: 'rigid-packaging',
    category: 'Rigid Gift Boxes',
    title: 'Bespoke Hand-Assembled Rigid Packaging',
    subtitle: 'Custom Die-Cut Magnetic Boxes with Gold Foil Debossing',
    badge: 'Bespoke Packaging',
    specs: ['Architectural Core', 'Velvet Foam Inlay', 'Magnetic Flap'],
    accent: '#A82F19',
    tag: 'Custom Die-Cut',
    image: '/assets/products/service_luxury_packaging.jpg',
    thumb: '/assets/products/service_luxury_packaging.jpg',
    metric: '1200 GSM',
    metricLabel: 'Rigid Core',
  },
  {
    id: 'velvet-foil',
    category: 'Velvet Soft-Touch',
    title: 'Velvet Soft-Touch Business Cards',
    subtitle: 'Peach-Skin Matte Finish with 360° Gilded Metallic Edges',
    badge: 'Tactile Finish',
    specs: ['Anti-Fingerprint', '100% Anti-Scuff', 'Pantone Gilded'],
    accent: '#A82F19',
    tag: 'Spot Gloss UV',
    image: '/assets/products/card-velvet-foil.jpg',
    thumb: '/assets/products/card-velvet-foil.jpg',
    metric: '700 GSM',
    metricLabel: 'Duplexed Stock',
  },
  {
    id: 'copper-gifting',
    category: 'VIP Corporate Gifts',
    title: 'VIP Laser-Etched Executive Drinkware',
    subtitle: 'Double-Wall Thermal Copper Flask & Milestone Gift Sets',
    badge: 'Fiber Laser Etch',
    specs: ['Food-Grade Steel', 'Micron Precision', 'Silk Presentation Box'],
    accent: '#A82F19',
    tag: 'Express 24h',
    image: '/assets/products/bottle_luxury_copper.jpg',
    thumb: '/assets/products/bottle_luxury_copper.jpg',
    metric: '24-Hour',
    metricLabel: 'Dispatch',
  },
]

const quickCalcCategories = [
  { id: 'business-cards', name: 'Business Cards', minQty: '100 pcs', turnaround: 'Same-Day / 24h', stock: '350–600 GSM Cotton / Velvet' },
  { id: 'rigid-boxes', name: 'Packaging & Boxes', minQty: '50 pcs', turnaround: '3–5 Days', stock: '1200 GSM Rigid Board' },
  { id: 'brochures', name: 'Brochures & Flyers', minQty: '250 pcs', turnaround: '24–48h', stock: '170–350 GSM Silk Art' },
  { id: 'stickers', name: 'Stickers & Labels', minQty: '100 pcs', turnaround: 'Same-Day', stock: 'Waterproof Vinyl / Matte' },
  { id: 'corporate-gifts', name: 'Corporate Gifts', minQty: '25 pcs', turnaround: '24–48h', stock: 'Laser-Etched Metal / Thermal' },
]

export default function HomePage() {
  const [services, setServices] = useState(null)
  const [categories, setCategories] = useState(null)
  const [allProducts, setAllProducts] = useState(null)
  const [featuredProducts, setFeaturedProducts] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [activeAtelierIdx, setActiveAtelierIdx] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Interactive Instant Spec Estimator State
  const [selectedCalcCategory, setSelectedCalcCategory] = useState(quickCalcCategories[0])
  const [selectedFinish, setSelectedFinish] = useState('24K Gold Foil')

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setActiveAtelierIdx((prev) => (prev + 1) % atelierShowcaseItems.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  useEffect(() => {
    trackViewHomepage()

    getServices()
      .then((data) => setServices(data || []))
      .catch(() => setServices([]))

    getCategories({ status: 'active', sort: 'display_order_asc' })
      .then((data) => {
        const filteredCategories = (data || []).filter(
          (cat) =>
            !cat.slug?.includes('custom-packaging') &&
            !cat.slug?.includes('luxury-packaging') &&
            !cat.name?.toLowerCase().includes('custom packaging') &&
            !cat.name?.toLowerCase().includes('luxury packaging')
        )
        setCategories(filteredCategories)
      })
      .catch(() => setCategories([]))

    getProducts()
      .then((res) => {
        const list = res?.data || []
        const filteredProducts = list.filter((p) => {
          const catSlug = typeof p.category === 'object' ? p.category?.slug : p.category
          const catName = typeof p.category === 'object' ? p.category?.name : p.category
          return (
            !catSlug?.includes('custom-packaging') &&
            !catSlug?.includes('luxury-packaging') &&
            !catName?.toLowerCase().includes('custom packaging') &&
            !catName?.toLowerCase().includes('luxury packaging')
          )
        })
        const uniqueProducts = Array.from(
          new Map(filteredProducts.map((p) => [p._id || p.slug, p])).values()
        )
        setAllProducts(uniqueProducts)
        const feat = uniqueProducts.filter((p) => p.featured)
        setFeaturedProducts(feat.length > 0 ? feat.slice(0, 4) : uniqueProducts.slice(0, 4))
      })
      .catch(() => {
        setAllProducts([])
        setFeaturedProducts([])
      })

    getPublicBlogs({ limit: 3, sort: 'newest' })
      .then((res) => setBlogs(res?.data || []))
      .catch(() => setBlogs([]))
  }, [])

  const activeAtelierItem = atelierShowcaseItems[activeAtelierIdx] || atelierShowcaseItems[0]

  const getWhatsAppCalcLink = () => {
    const text = encodeURIComponent(
      `Hello ONPRINT Dubai, I would like an express quotation for:\n• Product: ${selectedCalcCategory.name}\n• Finish/Spec: ${selectedFinish}\n• Minimum Qty: ${selectedCalcCategory.minQty}\n• Delivery Location: Dubai/UAE\n\nPlease provide pricing and turnaround.`
    )
    return `https://wa.me/447344546056?text=${text}`
  }

  return (
    <div className="bg-[#FFFFFF] text-[#0F172A] selection:bg-[#A82F19] selection:text-white">
      {/* SEO Head Management & Structured Data */}
      <SEOHead
        title="Printing Company in Dubai | ONPRINT – Commercial Printing Solutions"
        description="ONPRINT is Dubai’s premier commercial printing company. Precision digital & offset printing, corporate gifts, business cards, brochures, and exhibition signage in UAE."
        keywords="printing company in dubai, commercial printing dubai, digital printing dubai, business card printing dubai, brochure printing dubai, sticker printing dubai, corporate gifts dubai"
        canonicalPath="/"
        faqList={homeFaqs}
      />

      {/* ========================================================================= */}
      {/* 1. CLEAN MODERN LIGHT HERO SECTION                                       */}
      {/* ========================================================================= */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 border-b border-slate-200/80">
        {/* Subtle Ambient Light Gradients */}
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#A82F19]/8 to-transparent blur-[100px] -z-10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-[#A82F19]/5 to-transparent blur-[100px] -z-10"
          aria-hidden="true"
        />

        {/* Subtle Geometric Micro-Dot Grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40"
          aria-hidden="true"
        />

        {/* Corner Marks */}
        <div className="pointer-events-none absolute top-8 left-8 hidden 2xl:block opacity-30 text-slate-400">
          <CornerMarks className="h-6 w-6" />
        </div>
        <div className="pointer-events-none absolute top-8 right-8 hidden 2xl:block opacity-30 text-slate-400">
          <CornerMarks className="h-6 w-6" />
        </div>

        <Container className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Powerful Headline & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            {/* Live Status Pill */}
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-xs backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="uppercase tracking-[0.2em] text-[10.5px] font-black text-slate-800">
                  DUBAI COMMERCIAL PRESSROOM
                </span>
                <span className="h-3 w-px bg-slate-200" />
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#A82F19]">
                  <Sparkles className="h-3 w-3" />
                  AL QUOZ ATELIER
                </span>
              </div>
            </Reveal>

            {/* Powerful Headline */}
            <Reveal delay={0.08}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] xl:text-[4rem] font-black leading-[1.08] tracking-tight text-slate-900">
                Premium Printing That Makes Your Brand{' '}
                <span className="relative inline-block text-[#A82F19]">
                  Stand Out
                  <span
                    className="absolute -bottom-1.5 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#A82F19] to-[#A82F19]/30"
                    aria-hidden="true"
                  />
                </span>{' '}
                in Dubai.
              </h1>
            </Reveal>

            {/* Professional Value Statement */}
            <Reveal delay={0.14}>
              <p className="max-w-xl text-base sm:text-lg leading-[1.75] text-slate-600">
                Direct in-house pressroom in <strong className="text-slate-900 font-bold">Al Quoz, Dubai</strong>. Delivering flawless German Heidelberg color accuracy, <strong className="text-slate-900 font-bold">luxury business cards</strong>, custom packaging, brochures, and VIP corporate gifts with express UAE turnaround.
              </p>
            </Reveal>

            {/* Primary Action Buttons */}
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                <Button
                  to="/products"
                  variant="accent"
                  size="lg"
                  className="relative group overflow-hidden !rounded-xl !bg-[#A82F19] hover:!bg-[#8F2412] text-white font-bold shadow-lg shadow-[#A82F19]/25 hover:shadow-xl hover:shadow-[#A82F19]/35 hover:-translate-y-0.5 !px-7 !py-4 justify-center transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <span>Explore Collections</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Button>

                <Button
                  to="/get-a-quote"
                  variant="secondary"
                  size="lg"
                  className="!rounded-xl !border !border-slate-300 !bg-white hover:!bg-slate-50 !text-slate-900 font-bold justify-center !px-6 !py-4 shadow-xs hover:-translate-y-0.5 transition-all duration-200"
                  onClick={() => trackGetQuoteClick({ source_page: 'homepage_hero' })}
                >
                  Request Instant Quote
                </Button>

                <a
                  href="https://wa.me/447344546056?text=Hi%20ONPRINT%2C%20I%20need%20a%20printing%20quote"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300/80 bg-emerald-50/90 hover:bg-emerald-100/90 text-emerald-900 font-extrabold px-5 py-3.5 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group"
                  aria-label="Direct WhatsApp Hotline (+44 7344 546056)"
                >
                  <WhatsAppIcon className="h-4 w-4 text-emerald-600 fill-current group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold tracking-tight">+44 7344 546056</span>
                </a>
              </div>
            </Reveal>

            {/* Trust Indicators Grid */}
            <Reveal delay={0.26}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
                {[
                  { icon: Award, label: 'ISO 12647-2', sub: 'Calibrated Press' },
                  { icon: Clock, label: '24h Express', sub: 'Same-Day Dispatch' },
                  { icon: Layers, label: '24K Hot Foil', sub: '& 3D Raised UV' },
                  { icon: ShieldCheck, label: 'Direct Pressroom', sub: 'No Broker Fees' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.label}
                      className="group rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition-all duration-200 hover:border-[#A82F19]/40 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#A82F19]/10 text-[#A82F19]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="block text-[11px] font-black leading-tight text-slate-900">{item.label}</span>
                      <span className="mt-0.5 block text-[10px] font-medium text-slate-500">{item.sub}</span>
                    </div>
                  )
                })}
              </div>
            </Reveal>

            {/* Verified Social Proof */}
            <Reveal delay={0.3}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-extrabold text-slate-900">4.9 / 5.0</span>
                  <span className="text-slate-500">Google Verified</span>
                </div>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="font-bold text-slate-800">500+ Corporate Clients</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  White-Glove Courier
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Layered Interactive Showcase Card */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <Reveal delay={0.16}>
              <div
                className="relative mx-auto w-full max-w-[580px] rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xl overflow-hidden"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {/* Top Atelier Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A82F19] text-white shadow-sm">
                      <Printer className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                          ONPRINT PRESSROOM
                        </span>
                        <CmykDots />
                      </div>
                      <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                        Al Quoz, Dubai Facility
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[9.5px] font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    SAME-DAY EXPRESS
                  </div>
                </div>

                {/* Interactive Material Finish Tabs */}
                <div className="mb-3.5 grid grid-cols-4 gap-1.5 rounded-xl bg-slate-100 p-1">
                  {atelierShowcaseItems.map((item, idx) => {
                    const isActive = activeAtelierIdx === idx
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveAtelierIdx(idx)
                          setIsAutoPlaying(false)
                        }}
                        className={`relative rounded-lg py-2 px-1 text-center transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-white text-slate-900 font-black shadow-sm'
                            : 'text-slate-600 hover:text-slate-900 font-semibold'
                        }`}
                      >
                        <span className="block text-[10px] sm:text-[11px] leading-tight truncate">
                          {item.category}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Active Visual Showcase Stage */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-md">
                  <div className="relative h-60 sm:h-72 lg:h-[280px] w-full overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeAtelierItem.id}
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="relative h-full w-full"
                      >
                        <img
                          src={activeAtelierItem.image}
                          alt={activeAtelierItem.title}
                          className="h-full w-full object-cover"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute left-3 top-3 flex items-center gap-2">
                          <span className="rounded-md bg-[#A82F19] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
                            {activeAtelierItem.badge}
                          </span>
                        </div>
                        <div className="absolute right-3 top-3">
                          <span className="flex items-center gap-1 rounded-md bg-black/80 border border-white/20 px-2.5 py-1 text-[9px] font-black text-amber-300 shadow-sm backdrop-blur-xs">
                            <Sparkles className="h-3 w-3" />
                            {activeAtelierItem.metric}
                          </span>
                        </div>

                        {/* Bottom Overlay Details */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                            {activeAtelierItem.metricLabel}
                          </p>
                          <h3 className="text-sm sm:text-base font-black leading-tight drop-shadow-sm">
                            {activeAtelierItem.title}
                          </h3>
                          <p className="mt-0.5 text-[11px] font-medium text-slate-200 line-clamp-1">
                            {activeAtelierItem.subtitle}
                          </p>

                          {/* Live Specs Badges */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {activeAtelierItem.specs.map((spec) => (
                              <span
                                key={spec}
                                className="rounded-md bg-white/15 border border-white/20 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Material Swatch Library (Bottom Row) */}
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {atelierShowcaseItems.map((item, idx) => {
                    const isActive = activeAtelierIdx === idx
                    return (
                      <button
                        key={`thumb-${item.id}`}
                        type="button"
                        onClick={() => {
                          setActiveAtelierIdx(idx)
                          setIsAutoPlaying(false)
                        }}
                        className={`group relative overflow-hidden rounded-xl border p-1 text-left transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'border-[#A82F19] bg-[#A82F19]/5 shadow-xs scale-[1.02]'
                            : 'border-slate-200 bg-white hover:border-slate-300 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="relative h-12 w-full overflow-hidden rounded-lg bg-slate-100">
                          <img
                            src={item.thumb}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {isActive && <div className="absolute inset-0 border-2 border-[#A82F19] rounded-lg" />}
                        </div>
                        <div className="mt-1 px-0.5">
                          <span className="block truncate text-[9px] font-black text-slate-900">
                            {item.category}
                          </span>
                          <span className="block truncate text-[8px] font-semibold text-[#A82F19]">
                            {item.metric}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Bottom Guarantee Bar */}
                <div className="mt-3.5 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#A82F19]" />
                    <span className="font-bold text-slate-900">Heidelberg Speedmaster</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">1200 DPI Ultra-HD</span>
                  </div>
                  <Link
                    to="/products"
                    className="flex items-center gap-1 font-black text-[#A82F19] hover:underline text-[11px]"
                  >
                    <span>View Catalog</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>

        {/* Marquee Ticker */}
        <div className="relative mt-12 border-y border-slate-200/80 bg-white py-3 text-slate-800 shadow-xs">
          <div className="overflow-hidden">
            <div className="hero-marquee-track gap-8 pr-8">
              {[...heroMarquee, ...heroMarquee].map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="flex shrink-0 items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em]"
                >
                  <span className="text-slate-700">{item}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A82F19]" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INSTANT SPECIFICATION & TURNAROUND ESTIMATOR RIBBON                    */}
      {/* ========================================================================= */}
      <section className="bg-slate-50 py-8 border-b border-slate-200/80">
        <Container>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left Selector Controls */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-[#A82F19]" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Instant Spec &amp; Turnaround Estimator
                  </span>
                  <span className="rounded-full bg-[#A82F19]/10 px-2 py-0.5 text-[9px] font-bold text-[#A82F19]">
                    Express Dubai
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {quickCalcCategories.map((cat) => {
                    const isSelected = selectedCalcCategory.id === cat.id
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCalcCategory(cat)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#A82F19] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right Output & WhatsApp Trigger */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Est. Turnaround
                  </span>
                  <span className="text-sm font-black text-emerald-600 flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5" />
                    {selectedCalcCategory.turnaround}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    Min Qty: {selectedCalcCategory.minQty}
                  </span>
                </div>

                <a
                  href={getWhatsAppCalcLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-5 py-3 text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 group"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
                  <span>Get Quote on WhatsApp (+44 7344 546056)</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. FEATURED PRINTING CATEGORIES                                          */}
      {/* ========================================================================= */}
      <section className="bg-white py-14 sm:py-20 border-b border-slate-200/80">
        <Container>
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#A82F19]">
                CORE PRINTING DISCIPLINES
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Explore Popular Print Categories
              </h2>
            </div>
            <Link
              to="/categories"
              className="text-xs font-bold text-[#A82F19] hover:underline flex items-center gap-1"
            >
              <span>View All Categories {categories ? `(${categories.length})` : ''}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Categories Horizontal Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories && categories.length > 0 ? (
              categories.slice(0, 7).map((cat) => (
                <Link
                  key={cat.id || cat.slug}
                  to={`/categories/${cat.slug}`}
                  className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-3.5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-[#A82F19]/40 hover:shadow-md"
                >
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0 group-hover:border-[#A82F19]/30 transition-transform duration-200 group-hover:scale-105">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="h-full w-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-[#A82F19]" />
                    )}
                  </div>
                  <span className="mt-2.5 text-xs font-bold text-slate-800 group-hover:text-[#A82F19] transition-colors line-clamp-1">
                    {cat.name}
                  </span>
                </Link>
              ))
            ) : (
              Array.from({ length: 7 }).map((_, idx) => (
                <div key={idx} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
              ))
            )}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. BUSINESS CARDS FLAGSHIP SHOWCASE SECTION                              */}
      {/* ========================================================================= */}
      <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200/80">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#A82F19]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#A82F19]">
                <Award className="h-3.5 w-3.5" />
                <span>Dubai's Flagship Business Cards</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Crafted to Leave an Unforgettable First Impression.
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                From presidential <strong>600 GSM Italian Archival Cotton Stock</strong> to 24K hot foil stamping, raised 3D spot UV, and gilded metallic edges, our Al Quoz pressroom delivers the UAE’s highest-specification executive cards.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  '600 GSM Cotton Stock',
                  '24K Hot Foil Stamping',
                  'Raised 3D Spot UV',
                  'Velvet Soft-Touch',
                  '360° Gilded Edge',
                  'Sculptural Debossing',
                ].map((finish) => (
                  <div key={finish} className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <CheckCircle className="h-4 w-4 text-[#A82F19] shrink-0" />
                    <span>{finish}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  to="/business-card-printing-dubai"
                  variant="accent"
                  className="!rounded-xl !bg-[#A82F19] hover:!bg-[#8F2412] !px-7 !py-3.5 text-xs font-bold text-white shadow-md shadow-[#A82F19]/25 justify-center"
                >
                  Configure Business Cards
                </Button>
                <Button
                  to="/get-a-quote"
                  variant="secondary"
                  className="!rounded-xl !border !border-slate-300 !bg-white hover:!bg-slate-50 !text-slate-800 !px-6 !py-3.5 text-xs font-bold justify-center"
                >
                  Request Sample Pack
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src="/assets/products/luxury_business_cards.jpg"
                      alt="Gold Foil Business Cards"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">24K Hot Foil Cards</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Mirror gold foil on heavy cotton stock</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src="/assets/products/card-velvet-foil.jpg"
                      alt="Velvet Soft-Touch Cards"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Velvet Soft-Touch</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Peach-skin matte with 3D gloss UV</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 5. DYNAMIC PRODUCT SECTIONS SHOWCASE (Brochures, Stickers, Boxes, etc.)   */}
      {/* ========================================================================= */}
      <ProductSectionsShowcase
        categories={categories}
        products={allProducts}
        onQuickView={setQuickViewProduct}
      />

      {/* ========================================================================= */}
      {/* 6. CAREFREE SHOPPING & PRODUCTION GUARANTEE                              */}
      {/* ========================================================================= */}
      <CarefreeShoppingSection />

      {/* ========================================================================= */}
      {/* 7. COMPLIMENTARY SAMPLE BOX CTA                                          */}
      {/* ========================================================================= */}
      <SampleBoxCTA />

      {/* ========================================================================= */}
      {/* 8. FEATURED PRODUCTS CATALOG                                             */}
      {/* ========================================================================= */}
      <section className="border-t border-slate-200/80 bg-white py-16 sm:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#A82F19]">FEATURED COLLECTION</span>
              <h2 className="font-display mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Trending Corporate Merchandise &amp; Print Products
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                Browse our curated selection of premium business cards, thermal flasks, custom packaging, and exhibition rollups.
              </p>
            </div>
            <ArrowLink to="/products" className="shrink-0 text-[#A82F19] font-bold">
              Explore Full Catalog
            </ArrowLink>
          </div>

          <div>
            {featuredProducts === null && <LoadingState type="cards" columns={4} count={4} label="Loading products…" />}
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

      {/* ========================================================================= */}
      {/* 9. SELECTED PRESS WORK & PORTFOLIO                                       */}
      {/* ========================================================================= */}
      <section className="border-t border-slate-200/80 bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#A82F19]">
                SELECTED WORK
              </span>
              <h2 className="font-display mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Crafted in Dubai. Delivered Across the UAE.
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                A selection of executive stationery, corporate merchandise, and high-impact print collateral produced in Al Quoz.
              </p>
            </div>
            <ArrowLink to="/portfolio" className="shrink-0 text-[#A82F19] font-bold">
              View Full Portfolio
            </ArrowLink>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {portfolioItems.slice(0, 4).map((item, idx) => (
              <Reveal key={item.id} delay={idx * 0.08}>
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#A82F19] hover:shadow-md">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-md bg-slate-900/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#A82F19]">
                        {item.clientSector}
                      </span>
                      <h3 className="font-display mt-1 text-sm font-bold text-slate-900 group-hover:text-[#A82F19] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                        {item.specs}
                      </p>
                    </div>
                    <div className="mt-4 border-t border-slate-100 pt-3">
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

      {/* ========================================================================= */}
      {/* 10. WHY CHOOSE US & PRODUCTION PROCESS                                    */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-wider text-[#A82F19]">WHY ONPRINT</span>
            <h2 className="font-display mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Why Leading UAE Enterprises Choose ONPRINT
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              The standard behind every press run for corporations, luxury hotels, agencies, and government entities across the UAE.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#A82F19] hover:shadow-md group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A82F19] font-display text-xs font-bold text-white shadow-xs">
                    0{index + 1}
                  </div>
                  <h3 className="font-display mt-4 text-base font-bold text-slate-900 group-hover:text-[#A82F19] transition-colors">{item.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Process Steps */}
          <div className="mt-16 pt-12 border-t border-slate-200/80">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-[#A82F19]">DISCIPLINED PROCESS</span>
              <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Our 4-Step Production Pipeline
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((item, index) => (
                <div key={item.step} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-xs font-bold">
                    {item.step}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-3">{item.title}</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 11. BLOG ARTICLES / GUIDES                                               */}
      {/* ========================================================================= */}
      {blogs && blogs.length > 0 && (
        <section className="border-t border-slate-200/80 bg-slate-50 py-16 sm:py-24">
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end mb-10">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#A82F19]">
                  PRINTING KNOWLEDGE &amp; GUIDES
                </span>
                <h2 className="font-display mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  Commercial Printing &amp; Branding Insights
                </h2>
                <p className="mt-1 max-w-xl text-sm text-slate-600">
                  Expert advice on substrate selection, hot foiling, Pantone CMYK matching, and pre-press standards in Dubai.
                </p>
              </div>
              <ArrowLink to="/blog" className="shrink-0 text-[#A82F19] font-bold">
                View All Guides
              </ArrowLink>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.slice(0, 3).map((blog, idx) => (
                <Reveal key={blog.id || blog.slug} delay={idx * 0.08}>
                  <article className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#A82F19] hover:shadow-md">
                    <div>
                      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                        <img
                          src={getBlogCoverImage(blog)}
                          alt={blog.image_alt || blog.imageAlt || blog.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      <div className="mt-4 flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                        <span className="rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 text-[#A82F19] uppercase tracking-wider">
                          {blog.category || 'Printing Guide'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {blog.reading_time || blog.readTime || '4 min read'}
                        </span>
                      </div>

                      <h3 className="font-display mt-2.5 text-base font-bold text-slate-900 hover:text-[#A82F19] transition-colors">
                        <Link to={`/blog/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <ArrowLink to={`/blog/${blog.slug}`} className="text-xs font-bold text-[#A82F19]">
                        Read Guide
                      </ArrowLink>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 12. DUBAI PRINTING FAQ ACCORDION                                         */}
      {/* ========================================================================= */}
      <section className="border-t border-slate-200/80 bg-white py-16 sm:py-24">
        <Container className="max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-[#A82F19]">DUBAI PRINTING FAQ</span>
            <h2 className="font-display mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Frequently Asked Questions About Printing in Dubai
            </h2>
            <p className="mx-auto mt-1 max-w-xl text-sm text-slate-600">
              Key information on order turnarounds, minimum quantities, paper stocks, and corporate gifting in the UAE.
            </p>
          </div>

          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {homeFaqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-[#A82F19] transition-colors">
                    {faq.question}
                  </h3>
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180 group-hover:text-[#A82F19]" />
                </summary>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 13. BOTTOM CONVERSION CALL TO ACTION                                      */}
      {/* ========================================================================= */}
      <section className="border-t border-slate-200/80 bg-slate-900 py-16 sm:py-20 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#A82F19]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#A82F19]/20 blur-3xl" />

        <Container className="relative z-10 flex flex-col items-center gap-6 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Ready to Bring Your Brand to Life?
          </div>

          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl text-white">
            Let’s Print Your Next Project with Perfection.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            From 600 GSM cotton business cards to bespoke rigid gift packaging and large-format exhibition signage, ONPRINT delivers unmatched precision across Dubai.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto pt-2">
            <Button
              to="/get-a-quote"
              variant="accent"
              size="lg"
              className="!rounded-xl !bg-[#A82F19] hover:!bg-[#8F2412] shadow-lg shadow-[#A82F19]/40 text-center justify-center font-bold !py-3.5 !px-8 text-white"
              onClick={() => trackGetQuoteClick({ source_page: 'homepage_bottom_cta' })}
            >
              Request a Custom Quote
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="!rounded-xl border-white/30 text-white hover:bg-white/10 text-center justify-center font-bold !py-3.5 !px-8"
            >
              Contact Our Studio
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
