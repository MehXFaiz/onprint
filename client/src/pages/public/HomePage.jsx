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
  Star,
  Printer,
  Sliders,
  Play,
  ArrowUpRight,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import ArrowLink from '../../components/ArrowLink'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import Reveal from '../../components/Reveal'
import LoadingState from '../../components/LoadingState'
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
  { label: 'German Heidelberg & Indigo Press', sub: 'Calibrated CMYK & Pantone accuracy', icon: ShieldCheck },
  { label: 'Express Dubai Turnaround', sub: 'Same-day & 24h rapid UAE dispatch', icon: Zap },
  { label: 'Luxury Finishing Techniques', sub: '24K Hot foil, 3D Spot UV & debossing', icon: Award },
  { label: 'Direct Al Quoz Atelier', sub: 'In-house UAE commercial pressroom', icon: Users },
]

const heroFeatures = [
  { label: 'Same-Day Express Dubai Delivery', icon: Zap },
  { label: 'German Heidelberg Color Accuracy', icon: ShieldCheck },
  { label: '600+ GSM Cotton & 24K Foil Finishes', icon: Award },
  { label: 'Direct Pressroom (No Broker Markups)', icon: Users },
]

const whyUs = [
  {
    title: 'Calibrated Heidelberg & Indigo Precision',
    description: 'Operating under strict ISO color management, our German Heidelberg and HP Indigo presses guarantee pinpoint Pantone matching and vibrant CMYK consistency on every single print run.',
  },
  {
    title: 'Certified Luxury European Substrates',
    description: 'Direct access to an extensive inventory of 300–700 GSM Italian cotton boards, velvet soft-touch laminates, mirror metallic foils, and sustainable FSC-certified papers.',
  },
  {
    title: 'Direct Al Quoz Pressroom (Zero Broker Fees)',
    description: 'By manufacturing everything in-house in Al Quoz, Dubai, we eliminate middleman markups, provide direct pre-press advice, and guarantee express turnaround for urgent deadlines.',
  },
  {
    title: 'Rigorous Pre-Flight Engineering',
    description: 'Every design file undergoes thorough pre-press inspection by dedicated print engineers for vector trap, bleed margins, resolution fidelity, and color separation before plating.',
  },
]

const processSteps = [
  { step: '01', title: 'Consultation & Instant Spec', description: 'Select your stock, dimensions, finishes, and quantity with transparent tiered pricing.' },
  { step: '02', title: 'Pre-Flight File Curation', description: 'Our pre-press engineers inspect bleed, high-res rasterization, and Pantone separations.' },
  { step: '03', title: 'Mastercraft Press Run', description: 'Printed on high-precision Heidelberg & HP Indigo presses with continuous density control.' },
  { step: '04', title: 'Hand Inspection & Dispatch', description: 'Every piece is hand-inspected, moisture-sealed, and delivered via express courier across Dubai & the UAE.' },
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
    question: 'What commercial printing services does ONPRINT offer in Dubai?',
    answer:
      'ONPRINT operates a full-scale commercial pressroom in Al Quoz, Dubai. We provide high-volume German Heidelberg offset printing, rapid HP Indigo digital press printing, luxury 600 GSM business cards, bespoke rigid and folding packaging, marketing brochures, flyers, die-cut waterproof vinyl stickers, corporate stationery, and VIP corporate gifts.',
  },
  {
    question: 'Where is your printing facility located in Dubai?',
    answer:
      'Our dedicated production atelier is located in Al Quoz, Dubai, UAE. We welcome corporate clients by appointment for press proofs and material consultations, and we provide rapid daily dispatch across Dubai, Abu Dhabi, Sharjah, and all seven Emirates.',
  },
  {
    question: 'What is your turnaround time for urgent print orders in Dubai?',
    answer:
      'Digital printing jobs (business cards, flyers, brochures, stickers) can be dispatched same-day or within 24 hours once artwork is approved. Bespoke rigid packaging, heavy multi-ply duplexed cotton cards, and multi-stage foil/embossed projects typically require 3 to 5 business days. Express priority press scheduling is available for time-sensitive corporate events and trade shows.',
  },
  {
    question: 'What makes ONPRINT different from print brokers and digital agencies?',
    answer:
      'ONPRINT is a direct manufacturer with its own pressfloor in Al Quoz. When you work with us, you deal directly with print engineers and press operators—eliminating agency markups, preventing communication delays, and ensuring strict color calibration on every run.',
  },
  {
    question: 'Do you offer custom corporate gifts and branded VIP merchandise?',
    answer:
      'Yes. We specialize in luxury corporate gifting across Dubai and the UAE, including laser-engraved copper and stainless steel thermal bottles, custom ceramic mugs, executive hardcover notebooks with debossed logos, luxury pen sets, and curated onboarding gift boxes.',
  },
  {
    question: 'What luxury paper stocks and specialty finishes are available?',
    answer:
      'We maintain an extensive inventory of European FSC-certified papers ranging from 120 GSM to 800 GSM, including 100% Italian Cotton, Gmund textured stocks, and heavyweight duplex/triplex boards. Finishing techniques include 24K hot foil stamping (gold, silver, copper, holographic), raised 3D spot UV polymer, velvet soft-touch lamination, blind sculptural debossing, and metallic painted edges.',
  },
  {
    question: 'Can I approve a physical proof before my project goes to full production?',
    answer:
      'Yes. In addition to our complimentary digital pre-flight PDF proof, we offer physical press proofs on your exact specified paper stock and finish for high-volume offset runs and color-critical corporate branding projects.',
  },
  {
    question: 'Do you deliver across all Emirates in the UAE?',
    answer:
      'Yes, we provide insured doorstep courier delivery across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. Dubai and Sharjah deliveries typically arrive within 24 hours of completion.',
  },
  {
    question: 'How do I request an instant quotation for my print project?',
    answer:
      'You can request a custom quote via our online quote builder, chat with our print specialists directly on WhatsApp at +44 7344 546056, or email us at 0nprint183@gmail.com. We provide itemized, transparent quotations within 2 hours.',
  },
]

const atelierShowcaseItems = [
  {
    id: 'gold-foil',
    category: '24K Gold Foil',
    title: '24K Gold Foil & Embossed Cards',
    subtitle: 'Presidential 600 GSM Italian Cotton with Raised 3D Foil & Sculptural Monogram',
    badge: 'Signature Luxury',
    specs: ['24K Gold Foil', '600 GSM Italian Cotton', 'Heidelberg Calibrated'],
    accent: '#A82F19',
    tag: 'Same-Day Dubai',
    image: '/assets/products/luxury_business_cards_dubai.jpg',
    metric: '600 GSM',
    metricLabel: 'Cotton Duplex',
    price: '120',
  },
  {
    id: 'painted-edge',
    category: 'Painted Edge',
    title: 'Gilded Metallic Painted Edge Cards',
    subtitle: '700 GSM Triplexed Velvet Cards with Custom Metallic Foil Edges',
    badge: 'Triplex Edge',
    specs: ['Mirror Gold Edge', '700 GSM Triplex', 'Velvet Soft-Touch'],
    accent: '#A82F19',
    tag: 'Hand-Gilded',
    image: '/assets/products/card-painted-edge.jpg',
    metric: '700 GSM',
    metricLabel: 'Triplex Stock',
    price: '160',
  },
  {
    id: 'rigid-packaging',
    category: 'Luxury Packaging',
    title: 'Bespoke Rigid Magnetic Packaging',
    subtitle: '1200 GSM Greyboard with Custom Die-Cut Velvet Foam Insets',
    badge: 'Atelier Packaging',
    specs: ['Magnetic Closure', 'Debossed Gold Foil', 'Custom Foam Die'],
    accent: '#A82F19',
    tag: 'Custom Die-Line',
    image: '/assets/products/service_luxury_packaging.jpg',
    metric: '1200 GSM',
    metricLabel: 'Rigid Greyboard',
    price: '250',
  },
  {
    id: 'velvet-foil',
    category: 'Velvet Soft-Touch',
    title: 'Velvet Soft-Touch Silk Business Cards',
    subtitle: 'Tactile Peach-Skin Feel with Precision 3D Spot UV Highlights',
    badge: 'Executive Suite',
    specs: ['Velvet Soft-Touch', 'Raised 3D Spot UV', 'Pantone Solid Trap'],
    accent: '#A82F19',
    tag: 'Spot Gloss UV',
    image: '/assets/products/card-velvet-foil.jpg',
    metric: '450 GSM',
    metricLabel: 'Silk Duplex',
    price: '140',
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
        title="Printing Company in Dubai | ONPRINT – Commercial & Luxury Printing UAE"
        description="ONPRINT is Dubai's leading commercial pressroom in Al Quoz. Precision digital & Heidelberg offset printing, luxury 600 GSM business cards, rigid packaging, stickers, brochures, and corporate gifts with same-day express UAE delivery."
        keywords="printing company in dubai, printing services dubai, commercial printing dubai, luxury business cards dubai, business card printing dubai, custom packaging dubai, sticker printing dubai, brochure printing dubai, same day printing dubai, corporate gifts dubai, offset printing dubai, digital printing press uae"
        canonicalPath="/"
        faqList={homeFaqs}
      />

      {/* ========================================================================= */}
      {/* 1. LUXURY EDITORIAL HERO SECTION                                          */}
      {/* ========================================================================= */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40 pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-24 border-b border-slate-200/80">
        {/* Subtle Ambient Light Accents */}
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#A82F19]/8 to-transparent blur-[100px] -z-10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-[#A82F19]/5 to-transparent blur-[100px] -z-10"
          aria-hidden="true"
        />

        {/* Subtle Geometric Micro-Grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35"
          aria-hidden="true"
        />

        <Container className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top Small Location / Category Labels */}
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-2xs backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="uppercase tracking-[0.2em] text-[10.5px] font-black text-slate-800">
                  DUBAI COMMERCIAL PRESSROOM
                </span>
                <span className="h-3 w-px bg-slate-200" />
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#A82F19] uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  AL QUOZ ATELIER
                </span>
              </div>
            </Reveal>

            {/* Main Heading in Elegant Serif Font */}
            <Reveal delay={0.08}>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.35rem] xl:text-[3.85rem] font-bold leading-[1.1] tracking-tight text-[#0F172A]">
                Premium Printing<br />
                That Makes Your<br />
                Brand{' '}
                <span className="relative inline-block font-serif italic text-[#A82F19]">
                  Stand Out
                  <span
                    className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#A82F19] to-[#A82F19]/30"
                    aria-hidden="true"
                  />
                </span><br />
                in Dubai.
              </h1>
            </Reveal>

            {/* Supporting Text */}
            <Reveal delay={0.14}>
              <p className="max-w-xl text-base sm:text-lg leading-[1.75] text-slate-600 font-normal">
                Direct in-house pressroom in <strong className="text-slate-900 font-bold">Al Quoz, Dubai</strong>. Delivering calibrated German Heidelberg color accuracy, <strong className="text-slate-900 font-bold">luxury 600 GSM business cards</strong>, bespoke packaging, marketing collateral, and VIP corporate gifts with express UAE turnaround.
              </p>
            </Reveal>

            {/* 4 Premium Feature Points */}
            <Reveal delay={0.18}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {heroFeatures.map((feat) => {
                  const Icon = feat.icon
                  return (
                    <div key={feat.label} className="flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-slate-800">
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#A82F19]/10 text-[#A82F19] shrink-0">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span>{feat.label}</span>
                    </div>
                  )
                })}
              </div>
            </Reveal>

            {/* Action Buttons: Primary & Secondary */}
            <Reveal delay={0.22}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                {/* Primary Button */}
                <Button
                  to="/products"
                  variant="accent"
                  size="lg"
                  className="relative group overflow-hidden !rounded-xl !bg-[#A82F19] hover:!bg-[#8F2412] text-white font-bold shadow-lg shadow-[#A82F19]/25 hover:shadow-xl hover:shadow-[#A82F19]/35 hover:-translate-y-0.5 !px-8 !py-4 justify-center transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <span>Explore Our Products</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Button>

                {/* Secondary Button */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('production-process')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-7 py-4 text-sm font-bold text-slate-800 shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#A82F19] text-white shadow-2xs">
                    <Play className="h-3 w-3 fill-current ml-0.5" />
                  </div>
                  <span>Watch Our Process</span>
                </button>
              </div>
            </Reveal>

            {/* Social Proof Star Rating */}
            <Reveal delay={0.26}>
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
                <span className="font-bold text-slate-800">500+ UAE Corporations</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  Direct Pressroom
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Luxury Editorial Print Composition */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <Reveal delay={0.16}>
              <div className="relative w-full max-w-[580px] mx-auto">
                {/* Soft warm ambient background glow */}
                <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-[#A82F19]/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />

                {/* Editorial Photo Composition Grid */}
                <div className="grid grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
                  {/* Main Large Visual (Left 7 Cols) */}
                  <Link
                    to="/business-card-printing-dubai"
                    className="col-span-7 relative group overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-2 shadow-xl shadow-slate-200/60 hover:shadow-2xl transition-all duration-300 block"
                  >
                    <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src="/assets/products/luxury_business_cards_dubai.jpg"
                        alt="Luxury Business Card Printing Dubai"
                        width="480"
                        height="400"
                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="rounded-md bg-[#A82F19] px-2.5 py-1 text-[9.5px] font-black uppercase tracking-wider text-white shadow-sm">
                          SIGNATURE CRAFT
                        </span>
                      </div>
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                        <span className="text-[9.5px] font-black uppercase tracking-widest text-amber-300">
                          DUBAI ATELIER
                        </span>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-white mt-0.5 leading-snug">
                          24K Gold Foil &amp; Embossing
                        </h3>
                        <p className="text-[11px] text-slate-200 mt-0.5">
                          600 GSM Italian Cotton Stock
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Right Stacked Visuals (Right 5 Cols) */}
                  <div className="col-span-5 flex flex-col gap-3.5 sm:gap-4">
                    {/* Top Card: Luxury Packaging */}
                    <Link
                      to="/categories"
                      className="relative group flex-1 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 shadow-md hover:shadow-xl transition-all duration-300 block"
                    >
                      <div className="relative h-[162px] sm:h-[192px] w-full overflow-hidden rounded-xl bg-slate-100">
                        <img
                          src="/assets/products/service_luxury_packaging.jpg"
                          alt="Luxury Rigid Packaging Dubai"
                          width="300"
                          height="192"
                          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          loading="eager"
                          fetchPriority="high"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                          <span className="text-[8.5px] font-black uppercase tracking-widest text-amber-300">
                            RIGID BOXES
                          </span>
                          <h4 className="font-serif text-xs sm:text-sm font-bold leading-tight mt-0.5">
                            Magnetic Luxury Boxes
                          </h4>
                        </div>
                      </div>
                    </Link>

                    {/* Bottom Card: Painted Edge Cards */}
                    <Link
                      to="/products/luxury-business-cards"
                      className="relative group flex-1 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 shadow-md hover:shadow-xl transition-all duration-300 block"
                    >
                      <div className="relative h-[162px] sm:h-[192px] w-full overflow-hidden rounded-xl bg-slate-100">
                        <img
                          src="/assets/products/card-painted-edge.jpg"
                          alt="Painted Edge Business Cards Dubai"
                          width="300"
                          height="192"
                          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                          <span className="text-[8.5px] font-black uppercase tracking-widest text-amber-300">
                            GILDED EDGES
                          </span>
                          <h4 className="font-serif text-xs sm:text-sm font-bold leading-tight mt-0.5">
                            Metallic Edge Painted
                          </h4>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Floating UAE Serving Banner */}
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-200/80 px-4 py-3 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span className="text-base leading-none">🇦🇪</span>
                    <span>Proudly Serving Businesses Across UAE</span>
                  </div>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1 font-bold text-[#A82F19] hover:underline text-xs"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. PRODUCT / CATEGORY SHOWCASE IMMEDIATELY BELOW HERO                     */}
      {/* ========================================================================= */}
      <section className="bg-white py-14 sm:py-20 border-b border-slate-200/80">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-slate-100">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
                CORE PRINT DISCIPLINES
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-1">
                Mastercrafted Print Collections
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                From tactile 600 GSM cotton business cards to bespoke rigid packaging — precision engineered in our Dubai pressroom.
              </p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A82F19] hover:underline"
            >
              <span>View All Categories</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Horizontal Layout: Large Featured Business Card on Left + Grid on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Large Featured Card: BUSINESS CARDS */}
            <div className="lg:col-span-5 flex">
              <Link
                to="/business-card-printing-dubai"
                className="group relative flex flex-col justify-between w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Background Artwork */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="/assets/products/luxury_business_cards_dubai.jpg"
                    alt="Luxury Business Cards in Dubai"
                    className="h-full w-full object-cover opacity-45 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="rounded-full bg-[#A82F19] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                    BUSINESS CARDS
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform group-hover:scale-110 group-hover:bg-[#A82F19]">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 pt-32 sm:pt-40">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-white">
                    Make a Lasting<br />
                    <span className="text-amber-300 italic">First Impression</span>
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-sm">
                    Architectural business cards crafted on 600 GSM Italian cotton, accented with 24K hot foil stamping, raised 3D spot UV, and mirror painted edges.
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-300 group-hover:underline">
                    <span>Shop Business Cards</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Smaller Category Cards Grid on Right */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Business Cards',
                  sub: '600 GSM Cotton & 24K Foil',
                  to: '/business-card-printing-dubai',
                  img: '/assets/products/luxury_business_cards.jpg',
                  tag: 'Signature',
                },
                {
                  title: 'Brochures & Flyers',
                  sub: 'Tri-Fold, Bi-Fold & Booklets',
                  to: '/categories/brochure-printing-dubai',
                  img: '/assets/products/brochures.jpg',
                  tag: 'Fast 24h',
                },
                {
                  title: 'Custom Packaging',
                  sub: 'Rigid Boxes & Mailers',
                  to: '/packaging-printing-dubai',
                  img: '/assets/products/1 (7).jpg',
                  tag: 'Bespoke',
                },
                {
                  title: 'Stickers & Labels',
                  sub: 'Die-Cut Waterproof Vinyl',
                  to: '/categories/sticker-printing-dubai',
                  img: '/assets/products/stickers.jpg',
                  tag: 'Same-Day',
                },
                {
                  title: 'VIP Gifts',
                  sub: 'Copper Flasks, Mugs & Pens',
                  to: '/categories/corporate-gifts-dubai',
                  img: '/assets/products/bottle_luxury_copper.jpg',
                  tag: 'Merchandise',
                },
                {
                  title: 'More Products',
                  sub: 'All Catalog Categories',
                  to: '/categories',
                  img: '/assets/products/card-velvet-foil.jpg',
                  tag: 'Explore',
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#A82F19]/50 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="rounded bg-black/75 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs">
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#A82F19] transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.sub}
                      </p>
                    </div>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all group-hover:bg-[#A82F19] group-hover:text-white">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. INSTANT SPECIFICATION & TURNAROUND ESTIMATOR RIBBON                    */}
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
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-5 py-3 text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 group cursor-pointer"
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
      {/* 4. DYNAMIC PRODUCT SECTIONS SHOWCASE (Brochures, Stickers, Boxes, etc.)   */}
      {/* ========================================================================= */}
      <ProductSectionsShowcase
        categories={categories}
        products={allProducts}
        onQuickView={setQuickViewProduct}
      />

      {/* ========================================================================= */}
      {/* 5. LUXURY FINISHES SHOWCASE                                              */}
      {/* ========================================================================= */}
      <LuxuryFinishesShowcase />

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
              <h2 className="font-serif mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
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
                SELECTED ATELIER WORK
              </span>
              <h2 className="font-serif mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                Crafted in Dubai. Delivered Across the UAE.
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                A curated look at bespoke rigid packaging, executive stationery suites, and VIP corporate gifts produced in our Al Quoz pressroom.
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
      <section id="production-process" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-wider text-[#A82F19]">THE ONPRINT ADVANTAGE</span>
            <h2 className="font-serif mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              Why Leading UAE Enterprises Choose ONPRINT
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              The benchmark in Heidelberg offset precision, tactile luxury finishing, and express UAE dispatch for corporations, luxury hotels, agencies, and government entities.
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
              <span className="text-xs font-black uppercase tracking-wider text-[#A82F19]">DISCIPLINED WORKFLOW</span>
              <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mt-1">
                Our 4-Step Production Pipeline
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((item) => (
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
                  PRINTING KNOWLEDGE &amp; INSIGHTS
                </span>
                <h2 className="font-serif mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                  Commercial Printing &amp; Luxury Branding Guides
                </h2>
                <p className="mt-1 max-w-xl text-sm text-slate-600">
                  Expert advice on substrate selection, hot foiling, Pantone CMYK matching, and pre-press standards from our Dubai pressroom.
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
            <h2 className="font-serif mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
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
      <section className="border-t border-slate-200/80 bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20 text-slate-900 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#A82F19]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#A82F19]/5 blur-3xl" />

        <Container className="relative z-10 flex flex-col items-center gap-6 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19]/20 bg-[#A82F19]/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <Sparkles className="h-3.5 w-3.5 text-[#A82F19]" />
            Ready to Elevate Your Brand's Physical Presence?
          </div>

          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">
            Let’s Engineer Your Next Print Project with Flawless Precision.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            From 100 presidential cotton business cards to 10,000 bespoke rigid packaging units, our Al Quoz pressroom delivers perfection on deadline with same-day express delivery across Dubai.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto pt-2">
            <Button
              to="/get-a-quote"
              variant="accent"
              size="lg"
              className="!rounded-xl !bg-[#A82F19] hover:!bg-[#8F2412] shadow-lg shadow-[#A82F19]/25 text-center justify-center font-bold !py-3.5 !px-8 text-white"
              onClick={() => trackGetQuoteClick({ source_page: 'homepage_bottom_cta' })}
            >
              Request a Custom Quote →
            </Button>
            <a
              href="https://wa.me/447344546056?text=Hello%20ONPRINT%20Dubai%2C%20I%20would%20like%20to%20discuss%20a%20commercial%20print%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 text-center font-bold !py-3.5 !px-8 shadow-xs hover:-translate-y-0.5 transition-all group"
            >
              <WhatsAppIcon className="h-4 w-4 fill-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Fast-Track on WhatsApp</span>
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
