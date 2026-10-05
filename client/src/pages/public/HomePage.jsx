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
    accent: '#D4AF37',
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
    badge: 'Bespoke Luxury',
    specs: ['Architectural Core', 'Velvet Foam Inlay', 'Magnetic Flap'],
    accent: '#E5C365',
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
    badge: 'Sensory Tactile',
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
    accent: '#D4AF37',
    tag: 'Express 24h',
    image: '/assets/products/bottle_luxury_copper.jpg',
    thumb: '/assets/products/bottle_luxury_copper.jpg',
    metric: '24-Hour',
    metricLabel: 'Dispatch',
  },
]

const quickCalcCategories = [
  { id: 'business-cards', name: 'Luxury Business Cards', minQty: '100 pcs', turnaround: 'Same-Day / 24h', stock: '600 GSM Cotton / Velvet' },
  { id: 'rigid-boxes', name: 'Custom Rigid Boxes', minQty: '50 pcs', turnaround: '3–5 Days', stock: '1200 GSM Architectural Board' },
  { id: 'brochures', name: 'Executive Brochures', minQty: '250 pcs', turnaround: '24–48h', stock: '350 GSM Silk Art Stock' },
  { id: 'stickers', name: 'Die-Cut Vinyl Stickers', minQty: '100 pcs', turnaround: 'Same-Day', stock: 'Waterproof Matte / Holographic' },
  { id: 'corporate-gifts', name: 'VIP Executive Gifts', minQty: '25 pcs', turnaround: '24–48h', stock: 'Laser-Etched Metal / Thermal' },
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

  // 2026 Interactive Instant Spec Estimator State
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
    return `https://wa.me/971501234567?text=${text}`
  }

  return (
    <div className="bg-[#090A0D] text-[#FFFFFF] selection:bg-[#A82F19] selection:text-white">
      {/* SEO Head Management & Structured Data */}
      <SEOHead
        title="Printing Company in Dubai | ONPRINT – Commercial Printing Solutions"
        description="ONPRINT is Dubai’s premier luxury commercial printing company. Precision digital & offset printing, corporate gifts, business cards, brochures, and exhibition signage in UAE."
        keywords="printing company in dubai, commercial printing dubai, digital printing dubai, business card printing dubai, brochure printing dubai, sticker printing dubai, corporate gifts dubai"
        canonicalPath="/"
        faqList={homeFaqs}
      />

      {/* ========================================================================= */}
      {/* 1. 2026 ULTRA-LUXURY KINETIC HERO SECTION                                */}
      {/* ========================================================================= */}
      <section className="relative isolate overflow-hidden bg-[#090A0D] pt-12 sm:pt-16 lg:pt-24 pb-16 sm:pb-24 border-b border-white/[0.08]">
        {/* Futuristic 2026 Specular Ambient Lighting Cones */}
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-[650px] w-[650px] rounded-full bg-gradient-to-br from-[#A82F19]/25 via-[#A82F19]/10 to-transparent blur-[120px] -z-10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/4 -right-40 h-[700px] w-[700px] rounded-full bg-gradient-to-bl from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent blur-[140px] -z-10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[500px] rounded-full bg-[#00AEEF]/10 blur-[120px] -z-10"
          aria-hidden="true"
        />

        {/* 2026 Technical Laser Micro-Grid Mask */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,#000_30%,transparent_90%)]"
          aria-hidden="true"
        />

        {/* Corner Precision Registration Marks */}
        <div className="pointer-events-none absolute top-8 left-8 hidden 2xl:block opacity-25 text-white">
          <CornerMarks className="h-6 w-6" />
        </div>
        <div className="pointer-events-none absolute top-8 right-8 hidden 2xl:block opacity-25 text-white">
          <CornerMarks className="h-6 w-6" />
        </div>

        {/* 2026 CMYK Precision Color Bar Indicator */}
        <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-1.5 sm:flex flex-col opacity-80" aria-hidden="true">
          <span className="h-1/4 bg-[#00AEEF] shadow-[0_0_12px_#00AEEF]" />
          <span className="h-1/4 bg-[#EC008C] shadow-[0_0_12px_#EC008C]" />
          <span className="h-1/4 bg-[#FFF200] shadow-[0_0_12px_#FFF200]" />
          <span className="h-1/4 bg-[#231F20]" />
        </div>

        <Container className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: 2026 Kinetic Headline & Value Proposition */}
          <div className="lg:col-span-6 space-y-7">
            {/* Live Status Pill */}
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="uppercase tracking-[0.2em] text-[10.5px] font-black text-neutral-200">
                  DUBAI HAUTE IMPRIMERIE
                </span>
                <span className="h-3 w-px bg-white/20" />
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#D4AF37]">
                  <Sparkles className="h-3 w-3" />
                  AL QUOZ ATELIER
                </span>
              </div>
            </Reveal>

            {/* Kinetic 2026 Headline */}
            <Reveal delay={0.08}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4.2rem] font-black leading-[1.03] tracking-tight text-white">
                Crafting Luxury Print &amp;{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#FFFFFF] via-[#FFF0C2] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(212,175,55,0.3)]">
                    Bespoke Packaging
                  </span>
                  <span
                    className="absolute -bottom-1.5 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#A82F19] via-[#D4AF37] to-transparent"
                    aria-hidden="true"
                  />
                </span>{' '}
                for Dubai’s Elite Brands.
              </h1>
            </Reveal>

            {/* High-Contrast Value Statement */}
            <Reveal delay={0.14}>
              <p className="max-w-xl text-base sm:text-lg leading-[1.75] text-neutral-300">
                Direct in-house pressroom in <strong className="text-white font-bold">Al Quoz, Dubai</strong>. Powered by German Heidelberg offset &amp; HP Indigo digital presses for <strong className="text-[#D4AF37] font-semibold">24K hot foil business cards</strong>, luxury rigid packaging, and VIP corporate gifts with zero broker markups.
              </p>
            </Reveal>

            {/* 2026 Primary Action Buttons with Specular Glow */}
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
                <Button
                  to="/products"
                  variant="accent"
                  size="lg"
                  className="relative group overflow-hidden !rounded-xl !bg-gradient-to-r !from-[#A82F19] !to-[#C7371E] hover:!from-[#8f2513] hover:!to-[#A82F19] text-white font-black shadow-[0_12px_32px_rgba(168,47,25,0.45)] hover:-translate-y-0.5 !px-8 !py-4 justify-center transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Explore Luxury Atelier</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>

                <Button
                  to="/get-a-quote"
                  variant="secondary"
                  size="lg"
                  className="!rounded-xl !border !border-white/20 !bg-white/[0.07] hover:!bg-white/[0.14] !text-white font-bold justify-center !px-7 !py-4 backdrop-blur-md hover:-translate-y-0.5 transition-all duration-300"
                  onClick={() => trackGetQuoteClick({ source_page: 'homepage_hero' })}
                >
                  Request Bespoke Quote
                </Button>
              </div>
            </Reveal>

            {/* 2026 Value Proposition Feature Grid */}
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
                      className="group rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-white/[0.06] hover:-translate-y-0.5"
                    >
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#A82F19] to-[#7A1C0D] text-white shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="block text-[11px] font-black leading-tight text-white">{item.label}</span>
                      <span className="mt-0.5 block text-[10px] font-medium text-neutral-400">{item.sub}</span>
                    </div>
                  )
                })}
              </div>
            </Reveal>

            {/* Verified Trust Strip */}
            <Reveal delay={0.3}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <span className="font-extrabold text-white">4.9/5.0</span>
                  <span className="text-neutral-400">Google Verified</span>
                </div>
                <span className="hidden sm:inline text-neutral-700">•</span>
                <span className="font-bold text-neutral-300">500+ UAE Corporations</span>
                <span className="hidden sm:inline text-neutral-700">•</span>
                <span className="inline-flex items-center gap-1 font-bold text-neutral-300">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  White-Glove Courier
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right Column: 2026 Master 3D Material Studio Stage */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <Reveal delay={0.16}>
              <div
                className="relative mx-auto w-full max-w-[600px] rounded-3xl border border-white/[0.15] bg-gradient-to-b from-[#16171E] via-[#0F1015] to-[#0A0B0E] p-4 sm:p-5 shadow-[0_30px_90px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {/* Radiant Ambient Glows */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#D4AF37]/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#A82F19]/25 blur-3xl" />

                {/* Top Atelier Bar */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#A37E1C] text-black font-black shadow-[0_0_16px_rgba(212,175,55,0.4)]">
                      <Printer className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                          ONPRINT ATELIER
                        </span>
                        <CmykDots />
                      </div>
                      <span className="text-[9px] font-bold tracking-widest text-[#D4AF37] uppercase">
                        Master Finishes Preview
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-[9.5px] font-bold text-emerald-300 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    LIVE SPEC PREVIEW
                  </div>
                </div>

                {/* Interactive Material Finish Tabs */}
                <div className="relative z-10 mb-3 grid grid-cols-4 gap-1.5 rounded-xl bg-black/40 p-1 border border-white/[0.06] backdrop-blur-md">
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
                        className={`relative rounded-lg py-2 px-1 text-center transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-b from-[#D4AF37] to-[#A37E1C] text-neutral-950 font-black shadow-[0_4px_16px_rgba(212,175,55,0.4)]'
                            : 'text-neutral-400 hover:text-white hover:bg-white/5 font-bold'
                        }`}
                      >
                        <span className="block text-[10px] sm:text-[11px] leading-tight truncate">
                          {item.category}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Active Visual Masterpiece Stage with Specular Light Sweep */}
                <div className="relative z-10 overflow-hidden rounded-2xl border border-white/[0.12] bg-neutral-950 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                  <div className="relative h-60 sm:h-72 lg:h-[285px] w-full overflow-hidden bg-neutral-900">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeAtelierItem.id}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="relative h-full w-full"
                      >
                        <img
                          src={activeAtelierItem.image}
                          alt={activeAtelierItem.title}
                          className="h-full w-full object-cover"
                          loading="eager"
                        />
                        {/* Metallic Light Sheen Sweep Overlay */}
                        <div className="hero-card-sheen absolute inset-0 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />

                        {/* Top Badges */}
                        <div className="absolute left-3 top-3 flex items-center gap-2">
                          <span className="rounded-md bg-[#A82F19] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-md">
                            {activeAtelierItem.badge}
                          </span>
                        </div>
                        <div className="absolute right-3 top-3">
                          <span className="flex items-center gap-1.5 rounded-md border border-[#D4AF37]/50 bg-black/85 px-2.5 py-1 text-[9px] font-black text-[#D4AF37] backdrop-blur-md shadow-md">
                            <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                            {activeAtelierItem.metric}
                          </span>
                        </div>

                        {/* Bottom Overlay Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                            {activeAtelierItem.metricLabel}
                          </p>
                          <h3 className="text-sm sm:text-base font-black text-white leading-tight drop-shadow-md">
                            {activeAtelierItem.title}
                          </h3>
                          <p className="mt-0.5 text-[11px] font-medium text-neutral-300 line-clamp-1">
                            {activeAtelierItem.subtitle}
                          </p>

                          {/* Live Specs Badges */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {activeAtelierItem.specs.map((spec) => (
                              <span
                                key={spec}
                                className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[9px] font-bold text-white/90 backdrop-blur-sm"
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
                <div className="relative z-10 mt-3 grid grid-cols-4 gap-2">
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
                        className={`group relative overflow-hidden rounded-xl border p-1 text-left transition-all duration-300 ${
                          isActive
                            ? 'border-[#D4AF37] bg-white/10 shadow-[0_0_16px_rgba(212,175,55,0.35)] scale-[1.02]'
                            : 'border-white/10 bg-black/30 hover:border-white/30 hover:bg-white/5 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="relative h-12 w-full overflow-hidden rounded-lg bg-neutral-900">
                          <img
                            src={item.thumb}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {isActive && <div className="absolute inset-0 border-2 border-[#D4AF37] rounded-lg" />}
                        </div>
                        <div className="mt-1 px-0.5">
                          <span className="block truncate text-[9px] font-black text-white">
                            {item.category}
                          </span>
                          <span className="block truncate text-[8px] font-semibold text-[#D4AF37]">
                            {item.metric}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Bottom Atelier Guarantee Bar */}
                <div className="relative z-10 mt-3 flex items-center justify-between rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2 text-[10px] text-neutral-300 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#D4AF37]" />
                    <span className="font-bold text-white">Heidelberg Calibrated</span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-400">1200 DPI Ultra-HD</span>
                  </div>
                  <Link
                    to="/products"
                    className="flex items-center gap-1 font-black text-[#D4AF37] hover:text-[#f3e5ab] text-[10px] transition-colors"
                  >
                    <span>View Finishes</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>

        {/* 2026 Kinetic Continuous Marquee Strip */}
        <div className="relative mt-12 border-y border-white/[0.08] bg-black/60 py-3.5 text-white backdrop-blur-md">
          <div className="overflow-hidden">
            <div className="hero-marquee-track gap-8 pr-8">
              {[...heroMarquee, ...heroMarquee].map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="flex shrink-0 items-center gap-8 text-[11px] font-black uppercase tracking-[0.22em]"
                >
                  <span className="text-neutral-300">{item}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. 2026 INSTANT INTERACTIVE SPECIFICATION CALCULATOR RIBBON               */}
      {/* ========================================================================= */}
      <section className="relative z-20 bg-gradient-to-b from-[#090A0D] to-[#12131A] py-8 border-b border-white/[0.08]">
        <Container>
          <div className="rounded-2xl border border-white/[0.12] bg-white/[0.03] p-4 sm:p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left Selector Controls */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-[#D4AF37]" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Instant Spec &amp; Turnaround Estimator
                  </span>
                  <span className="rounded-full bg-[#A82F19]/20 border border-[#A82F19]/40 px-2 py-0.5 text-[9px] font-bold text-[#FF8573]">
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
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                          isSelected
                            ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)] scale-[1.02]'
                            : 'bg-white/[0.06] text-neutral-300 hover:bg-white/[0.12] hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right Output & 1-Click WhatsApp Trigger */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Est. Turnaround
                  </span>
                  <span className="text-sm font-black text-emerald-400 flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5" />
                    {selectedCalcCategory.turnaround}
                  </span>
                  <span className="block text-[10px] text-neutral-400">
                    Min Qty: {selectedCalcCategory.minQty}
                  </span>
                </div>

                <a
                  href={getWhatsAppCalcLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1EBE5D] hover:to-[#0F7A6E] px-5 py-3 text-xs font-black text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Get Quote on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. 2026 BENTO GRID OF CORE ATELIER CAPABILITIES                          */}
      {/* ========================================================================= */}
      <section className="bg-[#12131A] py-16 sm:py-24 border-b border-white/[0.08]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#A82F19]/20 border border-[#A82F19]/30 px-3 py-1 text-[11px] font-bold text-[#FF8573] uppercase tracking-wider mb-2">
                <Layers className="h-3.5 w-3.5" />
                <span>Atelier Disciplines</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight">
                Engineered for Tactile Perfection.
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-black text-[#D4AF37] hover:text-[#f3e5ab] flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Full Press Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Bento Tile 1 (Large 2-col) - Luxury Business Cards */}
            <div className="md:col-span-2 rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#1A1B24] to-[#13141C] p-6 sm:p-8 flex flex-col justify-between group hover:border-[#D4AF37]/50 transition-all duration-300 relative overflow-hidden">
              <div className="relative z-10">
                <span className="rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-1 text-[10px] font-black text-[#D4AF37] uppercase tracking-wider">
                  Signature Specialty
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-4 leading-snug group-hover:text-[#D4AF37] transition-colors">
                  Ultra-Thick 600 GSM Cotton &amp; 24K Hot Foil Business Cards
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-md leading-relaxed">
                  Deep letterpress indentation, Italian cotton stocks, 360° mirror gilded edges, and raised 3D spot UV crafted to make an unforgettable first impression in boardroom meetings.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['600 GSM Cotton', '24K Metallic Foil', 'Raised 3D Spot UV', 'Gilded Edges'].map((tag) => (
                    <span key={tag} className="rounded-md bg-white/[0.06] border border-white/[0.1] px-2.5 py-1 text-[10px] font-bold text-neutral-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <Link
                  to="/business-card-printing-dubai"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-[#D4AF37] group-hover:translate-x-1 transition-transform"
                >
                  <span>Configure Business Cards</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <span className="text-[11px] font-bold text-neutral-400">Same-Day Express Available</span>
              </div>
            </div>

            {/* Bento Tile 2 - Custom Rigid Boxes & Packaging */}
            <div className="rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#1A1B24] to-[#13141C] p-6 flex flex-col justify-between group hover:border-[#A82F19]/50 transition-all duration-300">
              <div>
                <span className="rounded-lg bg-[#A82F19]/20 border border-[#A82F19]/40 px-3 py-1 text-[10px] font-black text-[#FF8573] uppercase tracking-wider">
                  Rigid Boxes
                </span>
                <h3 className="text-lg font-black text-white mt-3 group-hover:text-[#FF8573] transition-colors">
                  Bespoke Rigid Gift Packaging
                </h3>
                <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                  Magnetic closures, custom EVA foam die-cuts, and soft-touch laminates for luxury retail &amp; corporate gifting.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/[0.08]">
                <Link
                  to="/packaging-printing-dubai"
                  className="inline-flex items-center gap-1 text-xs font-black text-white group-hover:text-[#D4AF37] transition-colors"
                >
                  <span>View Packaging</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Bento Tile 3 - Direct Al Quoz Pressfloor */}
            <div className="rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#1A1B24] to-[#13141C] p-6 flex flex-col justify-between group hover:border-emerald-500/50 transition-all duration-300">
              <div>
                <span className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                  In-House Press
                </span>
                <h3 className="text-lg font-black text-white mt-3 group-hover:text-emerald-300 transition-colors">
                  Heidelberg Litho &amp; HP Indigo
                </h3>
                <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                  Calibrated Pantone PMS color fidelity, 1200 DPI resolution, and zero broker markups on high-volume runs.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/[0.08]">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1 text-xs font-black text-white group-hover:text-emerald-300 transition-colors"
                >
                  <span>About Our Pressroom</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Bento Tile 4 - VIP Corporate Merchandise */}
            <div className="rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#1A1B24] to-[#13141C] p-6 flex flex-col justify-between group hover:border-[#D4AF37]/50 transition-all duration-300">
              <div>
                <span className="rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-1 text-[10px] font-black text-[#D4AF37] uppercase tracking-wider">
                  VIP Gifting
                </span>
                <h3 className="text-lg font-black text-white mt-3 group-hover:text-[#D4AF37] transition-colors">
                  Laser-Etched Executive Gifts
                </h3>
                <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                  Double-wall copper thermals, smart LED bottles, luxury ceramic mugs, and embossed executive stationery sets.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/[0.08]">
                <Link
                  to="/quote/mugs"
                  className="inline-flex items-center gap-1 text-xs font-black text-white group-hover:text-[#D4AF37] transition-colors"
                >
                  <span>Explore VIP Gifts</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Bento Tile 5 (2-col) - Large Format & Exhibition Displays */}
            <div className="md:col-span-2 lg:col-span-3 rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#1A1B24] to-[#13141C] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:border-cyan-500/50 transition-all duration-300">
              <div className="space-y-2">
                <span className="rounded-lg bg-cyan-500/20 border border-cyan-500/40 px-3 py-1 text-[10px] font-black text-cyan-300 uppercase tracking-wider">
                  Exhibition &amp; Large Format
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                  Trade Show Signage, Backdrops &amp; Architectural Vinyl
                </h3>
                <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
                  Heavy-duty rollup banners, acrylic 3D reception logos, waterproof vehicle wraps, and seamless event step-and-repeat backdrops for Dubai World Trade Centre &amp; Expo City events.
                </p>
              </div>
              <Link
                to="/services"
                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 px-5 py-2.5 text-xs font-black text-white transition-all duration-300"
              >
                <span>View Signage Options</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. QUICK-ACCESS POPULAR CATEGORIES CAROUSEL BAR                            */}
      {/* ========================================================================= */}
      <div className="relative z-20 bg-[#090A0D] py-10 border-b border-white/[0.08]">
        <Container>
          <div className="rounded-3xl border border-white/[0.1] bg-white/[0.02] p-5 sm:p-7 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] ring-2 ring-[#D4AF37]/30 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Popular Print Categories
                </span>
              </div>
              <Link
                to="/categories"
                className="text-xs font-black text-[#D4AF37] hover:text-[#f3e5ab] flex items-center gap-1 transition-colors"
              >
                <span>All Categories {categories ? `(${categories.length})` : ''}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Categories Grid */}
            <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1">
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <Link
                    key={cat.id || cat.slug}
                    to={`/categories/${cat.slug}`}
                    className="group flex sm:flex-col items-center gap-3 sm:gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:bg-white/[0.08] hover:shadow-[0_8px_24px_rgba(212,175,55,0.15)] shrink-0 min-w-[150px] sm:min-w-0"
                  >
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 p-1 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/50 transition-transform duration-300 group-hover:scale-105">
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="h-full w-full object-cover rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-[#D4AF37]" />
                      )}
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-neutral-200 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {cat.name}
                    </span>
                  </Link>
                ))
              ) : (
                Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="h-20 rounded-2xl bg-white/[0.05] animate-pulse min-w-[150px] sm:min-w-0 shrink-0" />
                ))
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE LUXURY FINISHES SHOWCASE COMPONENT                        */}
      {/* ========================================================================= */}
      <LuxuryFinishesShowcase />

      {/* ========================================================================= */}
      {/* 6. TRUST BADGES BANNER                                                   */}
      {/* ========================================================================= */}
      <section className="border-y border-white/[0.08] bg-[#0C0D12] py-10 sm:py-12">
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

      {/* ========================================================================= */}
      {/* 7. WHAT IS ONPRINT - CLEAR BUSINESS DEFINITION & CAPABILITIES            */}
      {/* ========================================================================= */}
      <section className="border-b border-white/[0.08] bg-[#090A0D] py-16 sm:py-24">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] border border-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-200">
                  <Info className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>About ONPRINT Atelier</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/20 border border-[#A82F19]/40 px-3 py-1 text-xs font-bold text-[#FF8573]">
                  Verified Commercial Press
                </span>
                <span className="text-xs font-semibold text-neutral-400">Al Quoz, Dubai, UAE</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-4">
                What is ONPRINT?
              </h2>

              <div className="space-y-4 text-neutral-300 leading-relaxed">
                <p className="text-base sm:text-lg font-medium text-white">
                  <strong>ONPRINT</strong> (also known as <strong>0nprint</strong>) is a premier commercial printing company, fine print atelier, and corporate merchandise manufacturer located in Al Quoz, Dubai, serving enterprises across the United Arab Emirates.
                </p>

                <p className="text-sm sm:text-base">
                  We specialize in digital press printing, offset lithography, VIP corporate gifts, executive office stationery, brochures, vinyl stickers, and large-format exhibition graphics. Our Al Quoz production facility houses calibrated Heidelberg offset presses and HP Indigo digital presses.
                </p>
              </div>

              {/* Quick Business Specs Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-xs text-neutral-300">
                <div><span className="font-black text-white block">Facility:</span> Al Quoz, Dubai</div>
                <div><span className="font-black text-white block">Support:</span> WhatsApp Concierge</div>
                <div><span className="font-black text-white block">Hours:</span> Mon–Sat 8:30–18:30</div>
                <div><span className="font-black text-white block">Delivery:</span> All 7 Emirates (Express 24h)</div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] mb-3">Our Core Disciplines</h3>
                  <ul className="space-y-2 text-sm text-neutral-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Heidelberg Offset &amp; HP Indigo Digital</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>600 GSM Cotton &amp; 24K Hot Foil Cards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Laser-Engraved VIP Corporate Gifts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Large Format Banners &amp; Trade Show Displays</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] mb-3">The ONPRINT Advantage</h3>
                  <ul className="space-y-2 text-sm text-neutral-300">
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
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button to="/about" variant="secondary" size="md" className="!rounded-xl text-center justify-center font-bold !bg-white !text-black hover:!bg-neutral-200">
                  Explore Our Pressroom
                </Button>
                <Button to="/services" variant="outline" size="md" className="!rounded-xl text-center justify-center border-white/30 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] font-bold">
                  View All Services
                </Button>
                <Button to="/contact" variant="ghost" size="md" className="text-xs text-[#D4AF37] hover:text-white font-bold">
                  Visit Al Quoz Pressfloor →
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 8. SERVICES GRID SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#0D0E14] border-b border-white/[0.08]">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">OUR SERVICES</span>
              <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl">
                Dubai’s Leading Commercial Printing Services
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
                Full-service commercial printing, executive office stationery, and custom packaging in Dubai with flawless Pantone precision.
              </p>
            </div>
            <ArrowLink to="/services" className="shrink-0 text-[#D4AF37]">
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

      {/* ========================================================================= */}
      {/* 9. PRODUCT SECTIONS SHOWCASE (Dynamic Collections)                       */}
      {/* ========================================================================= */}
      <ProductSectionsShowcase
        categories={categories}
        products={allProducts}
        onQuickView={setQuickViewProduct}
      />

      {/* ========================================================================= */}
      {/* 10. CAREFREE SHOPPING & EXPRESS DELIVERY SECTION                         */}
      {/* ========================================================================= */}
      <CarefreeShoppingSection />

      {/* ========================================================================= */}
      {/* 11. SAMPLE BOX CTA                                                       */}
      {/* ========================================================================= */}
      <SampleBoxCTA />

      {/* ========================================================================= */}
      {/* 12. FEATURED PRODUCTS CATALOG                                            */}
      {/* ========================================================================= */}
      <section className="border-t border-white/[0.08] bg-[#090A0D] py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">SIGNATURE PRODUCTS</span>
              <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl">
                Featured Printing Products &amp; Promotional Merchandise
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
                Browse our curated selection of premium corporate giveaways, business cards, brochures, thermal flasks, and event displays.
              </p>
            </div>
            <ArrowLink to="/products" className="shrink-0 text-[#D4AF37]">
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

      {/* ========================================================================= */}
      {/* 13. SELECTED PRESS WORK & CLIENT PORTFOLIO SHOWCASE                      */}
      {/* ========================================================================= */}
      <section className="border-t border-white/[0.08] bg-[#0D0E14] py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                SELECTED PRESS WORK
              </span>
              <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl">
                Crafted in Dubai. Delivered Across the UAE.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
                A selection of executive stationery, corporate merchandise, and high-impact print collateral produced on our Al Quoz press floor.
              </p>
            </div>
            <ArrowLink to="/portfolio" className="shrink-0 text-[#D4AF37]">
              View Full Portfolio
            </ArrowLink>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {portfolioItems.slice(0, 4).map((item, idx) => (
              <Reveal key={item.id} delay={idx * 0.08}>
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.03] shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D4AF37] hover:shadow-[0_16px_36px_rgba(212,175,55,0.15)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-black/80 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#D4AF37] backdrop-blur-xs border border-white/10">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF37]">
                        {item.clientSector}
                      </span>
                      <h3 className="font-display mt-1 text-sm font-black text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[11px] font-medium leading-snug text-neutral-400 line-clamp-2">
                        {item.specs}
                      </p>
                    </div>
                    <div className="mt-4 border-t border-white/[0.08] pt-3">
                      <ArrowLink to={`/get-a-quote?service=${encodeURIComponent(item.title)}`} className="text-xs font-bold text-[#D4AF37]">
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
      {/* 14. WHY CHOOSE US                                                        */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#090A0D] border-t border-white/[0.08]">
        <Container>
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">WHY ONPRINT</span>
            <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl">
              Why Leading Dubai Enterprises Choose ONPRINT
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
              The standard behind every press run for corporations, luxury hotels, agencies, and government entities across the UAE.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D4AF37] hover:shadow-lg group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] font-display text-xs font-black text-black shadow-md">
                    0{index + 1}
                  </div>
                  <h3 className="font-display mt-5 text-lg font-black text-white group-hover:text-[#D4AF37] transition-colors">{item.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-400">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 15. PRODUCTION PROCESS TIMELINE                                          */}
      {/* ========================================================================= */}
      <section className="border-t border-white/[0.08] bg-[#0D0E14] py-20 sm:py-28">
        <Container>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">HOW IT WORKS</span>
            <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl">
              Our 4-Step Precision Printing Process
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
              From artwork pre-flight verification to doorstep UAE delivery in 4 clear, disciplined steps.
            </p>
          </div>

          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-white/10 sm:block" />
            <motion.div
              className="absolute left-0 top-6 hidden h-0.5 bg-gradient-to-r from-[#A82F19] to-[#D4AF37] sm:block"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
            <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((item, index) => (
                <Reveal key={item.step} delay={index * 0.1}>
                  <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 shadow-xs backdrop-blur-md">
                    <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-display text-xs font-black shadow-sm">
                      {item.step}
                    </span>
                    <h3 className="font-display mt-5 text-lg font-black text-white">{item.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-400">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 16. STORY & STAT COUNTERS                                                */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#090A0D] border-t border-white/[0.08]">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">ABOUT ONPRINT</span>
              <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl">
                We Print More Than Paper. We Print Brand Trust in Dubai.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-300">
                Every piece of print that leaves our Al Quoz press floor carries a brand's reputation with it. That's why precision, paper tactile feel, and immaculate finishing are non-negotiable standards for our studio.
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <Button to="/about" variant="secondary" size="md" className="!rounded-xl border-white/20 bg-white text-black hover:bg-neutral-200">
                Learn About Our Facility
              </Button>
              <Button to="/blog" variant="outline" size="md" className="!rounded-xl border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]">
                Read Printing Guides
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-6 rounded-3xl border border-white/[0.1] bg-white/[0.03] p-8 shadow-sm backdrop-blur-xl">
              {stats.map((stat) => (
                <StatCounter key={stat.label} {...stat} />
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 17. BLOG ARTICLES / GUIDES                                               */}
      {/* ========================================================================= */}
      {blogs && blogs.length > 0 && (
        <section className="border-t border-white/[0.08] bg-[#0D0E14] py-20 sm:py-28">
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                  PRINTING KNOWLEDGE &amp; GUIDES
                </span>
                <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl">
                  Commercial Printing &amp; Branding Insights
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
                  Expert advice on substrate selection, hot foiling, Pantone CMYK matching, and pre-press standards in Dubai.
                </p>
              </div>
              <ArrowLink to="/blog" className="shrink-0 text-[#D4AF37]">
                View All Guides
              </ArrowLink>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.slice(0, 3).map((blog, idx) => (
                <Reveal key={blog.id || blog.slug} delay={idx * 0.08}>
                  <article className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-lg">
                    <div>
                      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900">
                        <img
                          src={getBlogCoverImage(blog)}
                          alt={blog.image_alt || blog.imageAlt || blog.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      <div className="mt-5 flex items-center gap-3 text-[11px] font-bold text-neutral-400">
                        <span className="rounded-full bg-[#A82F19]/20 border border-[#A82F19]/30 px-2.5 py-0.5 text-[#FF8573] uppercase tracking-wider">
                          {blog.category || 'Printing Guide'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {blog.reading_time || blog.readTime || '4 min read'}
                        </span>
                      </div>

                      <h3 className="font-display mt-3 text-lg font-bold text-white transition-colors hover:text-[#D4AF37]">
                        <Button to={`/blog/${blog.slug}`} variant="ghost" className="!p-0 !h-auto text-left font-display font-bold text-lg hover:text-[#D4AF37]">
                          {blog.title}
                        </Button>
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-neutral-400 line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-white/[0.08] pt-4">
                      <ArrowLink to={`/blog/${blog.slug}`} className="text-xs font-bold text-[#D4AF37]">
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

      {/* ========================================================================= */}
      {/* 18. FAQ ACCORDION                                                        */}
      {/* ========================================================================= */}
      <section className="border-t border-white/[0.08] bg-[#090A0D] py-20 sm:py-28">
        <Container className="max-w-4xl">
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">DUBAI PRINTING FAQ</span>
            <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl">
              Frequently Asked Questions About Printing in Dubai
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
              Key information on order turnarounds, minimum quantities, paper stocks, and corporate gifting in the UAE.
            </p>
          </div>

          <div className="mt-12 divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
            {homeFaqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <h3 className="font-display text-base font-bold text-white sm:text-lg group-hover:text-[#D4AF37] transition-colors">
                    {faq.question}
                  </h3>
                  <ChevronDown className="h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-300 group-open:rotate-180 group-hover:text-[#D4AF37]" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300 sm:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs font-bold text-neutral-400">
              Have specific project questions?{' '}
              <ArrowLink to="/contact" className="text-[#D4AF37]">
                Speak to our print studio
              </ArrowLink>
            </p>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 19. BOTTOM ULTRA-LUXURY CALL TO ACTION STRIP                             */}
      {/* ========================================================================= */}
      <section className="border-t border-white/[0.08] bg-[#07080B] py-20 text-white sm:py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(212,175,55,0.15),transparent_70%),radial-gradient(ellipse_60%_50%_at_50%_90%,rgba(168,47,25,0.22),transparent_70%)]" />

        <Container className="relative z-10 flex flex-col items-center gap-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/[0.05] px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37] backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            Ready to Elevate Your Brand?
          </div>

          <h2 className="font-display max-w-3xl text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white">
            LET’S BRING YOUR NEXT LUXURY PRINT PROJECT TO LIFE.
          </h2>

          <p className="max-w-xl text-sm sm:text-base text-neutral-300 leading-relaxed">
            From 600 GSM cotton business cards to bespoke rigid gift packaging and large-format exhibition signage, ONPRINT delivers unmatched precision across Dubai.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto">
            <Button
              to="/get-a-quote"
              variant="accent"
              size="lg"
              className="!rounded-xl !bg-gradient-to-r !from-[#A82F19] !to-[#C7371E] hover:!from-[#8f2513] hover:!to-[#A82F19] shadow-xl shadow-[#A82F19]/40 text-center justify-center font-black !py-4 !px-8"
              onClick={() => trackGetQuoteClick({ source_page: 'homepage_bottom_cta' })}
            >
              Request a Custom Quote
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="!rounded-xl border-white/30 text-white hover:bg-white/10 hover:border-white text-center justify-center font-bold !py-4 !px-8"
            >
              Contact Atelier Team
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
