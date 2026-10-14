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
import { trackViewHomepage, trackGetQuoteClick, trackWhatsAppClick } from '../../utils/analytics'
import { portfolioItems } from '../../data/portfolio'
import { getBlogCoverImage } from '../../assets/productImages'
import { getServiceWhatsAppUrl, FORMATTED_PHONE } from '../../utils/whatsapp'

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
    question: 'What are your primary commercial printing services in Dubai?',
    answer:
      'ONPRINT specializes in 4 core commercial print categories: Premium Business Card Printing (cotton, 24K gold foil, spot UV), Roll-Up Banner Printing for DWTC trade shows and corporate exhibitions, Custom Waterproof Sticker & Label Printing (die-cut vinyl, foils), and Official Company Stamp & Legal Seal Manufacturing. We also produce brochures, flyers, executive stationery, and VIP corporate gifts in our Al Quoz pressroom.',
  },
  {
    question: 'How do I order custom business cards with luxury finishes in Dubai?',
    answer:
      'Choose your cardstock (350 GSM matte silk to 600 GSM double-thick Italian cotton) and select signature finishes such as 24K hot foil stamping, raised 3D spot UV, velvet soft-touch lamination, or gilded edges. Inquire directly on WhatsApp with your artwork or specifications for instant pricing and express same-day / 24-hour turnaround in Dubai.',
  },
  {
    question: 'Can you print roll-up banners urgently for exhibitions and events in Dubai?',
    answer:
      'Yes. We print vivid, curl-free premium roll-up banners (standard 85x200cm, wide 100x200cm, and 120x200cm) with heavy-duty aluminum retracting cassettes and padded carry bags. We regularly cater to urgent requirements at Dubai World Trade Centre (DWTC), DIFC, and Madinat Jumeirah with same-day express delivery.',
  },
  {
    question: 'What options are available for custom sticker and product label printing?',
    answer:
      'We supply custom die-cut vinyl stickers, kiss-cut sheets, clear transparent labels, and luxury metallic foil stickers. All stickers are printed using waterproof, UV-resistant inks suitable for product packaging, cosmetics, food containers, beverage bottles, outdoor vehicles, and retail merchandise.',
  },
  {
    question: 'Do you manufacture official company stamps and legal seals in Dubai?',
    answer:
      'Yes, ONPRINT manufactures durable self-inking company stamps (Trodat / Colop mechanisms), pocket mobile stamps, heavy-duty dater stamps, and luxury brass wax seals. We engrave high-precision rubber dies adhering to UAE company registration and banking formatting standards.',
  },
  {
    question: 'Where is your printing facility located in Dubai?',
    answer:
      'Our dedicated production atelier is located in Al Quoz, Dubai, UAE. We welcome corporate clients by appointment for press proofs and material consultations, and we provide rapid daily dispatch across Dubai, Abu Dhabi, Sharjah, and all seven Emirates.',
  },
  {
    question: 'What is your turnaround time for urgent print orders in Dubai?',
    answer:
      'Digital printing jobs (business cards, stickers, roll-up banners, flyers) can be dispatched same-day or within 24 hours once artwork is approved. Heavy multi-ply duplexed cotton cards and multi-stage foil/embossed projects typically require 2 to 4 business days. Express priority press scheduling is available for time-sensitive corporate events.',
  },
  {
    question: 'What makes ONPRINT different from print brokers and digital agencies?',
    answer:
      'ONPRINT is a direct manufacturer with its own pressfloor in Al Quoz. When you work with us, you deal directly with print engineers and press operators—eliminating agency markups, preventing communication delays, and ensuring strict color calibration on every run.',
  },
  {
    question: 'Do you deliver across all Emirates in the UAE?',
    answer:
      'Yes, we provide insured doorstep courier delivery across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. Dubai and Sharjah deliveries typically arrive within 24 hours of completion.',
  },
  {
    question: 'How do I request an instant quotation for my print project?',
    answer:
      `You can request a custom quote via our online quote builder, chat with our print specialists directly on WhatsApp at ${FORMATTED_PHONE}, or email us at 0nprint183@gmail.com. We provide itemized, transparent quotations within 2 hours.`,
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
  { id: 'stickers', name: 'Stickers & Labels', minQty: '100 pcs', turnaround: 'Same-Day', stock: 'Waterproof Vinyl / Matte' },
  { id: 'rollup-banners', name: 'Roll-Up Banners', minQty: '1 unit', turnaround: 'Same-Day / 24h', stock: 'Anti-Curl Film / Aluminium Cassette' },
  { id: 'bottle-printing', name: 'Custom Bottles', minQty: '25 pcs', turnaround: '24–48h', stock: 'Stainless Steel / Aluminium / Laser-Etched' },
  { id: 'stationery', name: 'Letterheads & Stationery', minQty: '100 pcs', turnaround: '24–48h', stock: '120 GSM Smooth Uncoated' },
  { id: 'brochures', name: 'Brochures & Flyers', minQty: '250 pcs', turnaround: '24–48h', stock: '170–350 GSM Silk Art' },
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
    return getServiceWhatsAppUrl(selectedCalcCategory.id, {
      productName: selectedCalcCategory.name,
      material: selectedCalcCategory.stock,
      finish: selectedFinish,
      quantity: selectedCalcCategory.minQty,
      deadline: selectedCalcCategory.turnaround,
    })
  }

  return (
    <div className="bg-[#FFFFFF] text-[#0F172A] selection:bg-[#A82F19] selection:text-white">
      {/* SEO Head Management & Structured Data */}
      <SEOHead
        title="Printing Company in Dubai | ONPRINT – Commercial & Luxury Printing UAE"
        description="ONPRINT is Dubai's leading commercial pressroom in Al Quoz. Precision digital & Heidelberg offset printing, luxury 600 GSM business cards, stickers, brochures, and corporate gifts with same-day express UAE delivery."
        keywords="printing company in dubai, printing services dubai, commercial printing dubai, luxury business cards dubai, business card printing dubai, sticker printing dubai, brochure printing dubai, same day printing dubai, corporate gifts dubai, offset printing dubai, digital printing press uae"
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

            {/* Main Heading in Elegant Serif Font */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.35rem] xl:text-[3.85rem] font-bold leading-[1.1] tracking-tight text-[#0F172A]">
              Commercial &amp; Luxury<br />
              Printing Services in{' '}
              <span className="relative inline-block font-serif italic text-[#A82F19]">
                Dubai, UAE
                <span
                  className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#A82F19] to-[#A82F19]/30"
                  aria-hidden="true"
                />
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="max-w-xl text-base sm:text-lg leading-[1.75] text-slate-600 font-normal">
              Direct in-house pressroom in <strong className="text-slate-900 font-bold">Al Quoz, Dubai</strong>. Delivering calibrated German Heidelberg color accuracy, <strong className="text-slate-900 font-bold">luxury business cards</strong>, roll-up banners, waterproof stickers, and official stamps with express same-day UAE dispatch.
            </p>

            {/* 4 Premium Feature Points */}
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

            {/* Action Buttons: Primary & Secondary */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              {/* Primary WhatsApp Button */}
              <a
                href={getServiceWhatsAppUrl('general')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source_page: '/',
                    service_name: 'general_hero',
                    button_location: 'hero_primary_cta',
                    label: 'hero_get_quote_whatsapp',
                  })
                }
                className="relative group overflow-hidden rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 hover:-translate-y-0.5 px-8 py-4 justify-center transition-all duration-200 inline-flex items-center gap-2.5 cursor-pointer text-sm sm:text-base text-center"
              >
                <WhatsAppIcon className="h-5 w-5 fill-white" />
                <span>Get a Quote on WhatsApp</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              {/* Secondary Button */}
              <Button
                to="/services"
                variant="outline"
                size="lg"
                className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-7 py-4 text-sm font-bold text-slate-800 shadow-xs hover:-translate-y-0.5 transition-all duration-200 text-center justify-center"
              >
                <span>Explore Printing Services</span>
              </Button>
            </div>

            {/* Social Proof Star Rating */}
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
          </div>

          {/* Right Column: Luxury Editorial Print Composition */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
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
                    <picture>
                      <source
                        type="image/webp"
                        media="(max-width: 640px)"
                        srcSet="/assets/products/luxury_business_cards_dubai_mobile.webp"
                      />
                      <source
                        type="image/webp"
                        srcSet="/assets/products/luxury_business_cards_dubai.webp"
                      />
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
                    </picture>
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
                  {/* Top Card: Executive Stationery */}
                  <Link
                    to="/categories/letterheads-printing-dubai"
                    className="relative group flex-1 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 shadow-md hover:shadow-xl transition-all duration-300 block"
                  >
                    <div className="relative h-[162px] sm:h-[192px] w-full overflow-hidden rounded-xl bg-slate-100">
                      <picture>
                        <source
                          type="image/webp"
                          srcSet="/assets/products/service_executive_stationery.webp"
                        />
                        <img
                          src="/assets/products/service_executive_stationery.jpg"
                          alt="Executive Corporate Stationery Dubai"
                          width="300"
                          height="192"
                          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          fetchPriority="low"
                          decoding="async"
                        />
                      </picture>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <span className="text-[8.5px] font-black uppercase tracking-widest text-amber-300">
                          STATIONERY
                        </span>
                        <h4 className="font-serif text-xs sm:text-sm font-bold leading-tight mt-0.5">
                          Executive Corporate Suites
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
                      <picture>
                        <source
                          type="image/webp"
                          srcSet="/assets/products/card-painted-edge.webp"
                        />
                        <img
                          src="/assets/products/card-painted-edge.jpg"
                          alt="Painted Edge Business Cards Dubai"
                          width="300"
                          height="192"
                          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
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
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. CORE DUBAI PRINTING SERVICES (4 FOCUS DISCIPLINES)                     */}
      {/* ========================================================================= */}
      <section className="bg-white py-14 sm:py-20 border-b border-slate-200/80">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 mb-10 border-b border-slate-100">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
                CORE PRINT DISCIPLINES • DUBAI &amp; UAE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-1">
                Our Four Core Commercial Printing Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Industrial precision with luxury finishing, in-house Heidelberg presses, and express same-day UAE delivery. Select any service to inquire instantly on WhatsApp.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A82F19] hover:underline shrink-0"
            >
              <span>Explore All Print Services</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* 4 Visually Attractive Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Card 1: Business Card Printing */}
            <div className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#A82F19]/50 hover:shadow-xl">
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 mb-4">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet="/assets/products/luxury_business_cards_dubai.webp"
                    />
                    <img
                      src="/assets/products/luxury_business_cards_dubai.jpg"
                      alt="Business Card Printing Dubai"
                      width="400"
                      height="300"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-full bg-[#A82F19] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                      Highest Priority
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="rounded-lg bg-black/75 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-xs">
                      Same-Day / 24h
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#A82F19] transition-colors">
                      Business Card Printing
                    </h3>
                    <span className="text-xs font-extrabold text-[#A82F19]">From AED 85</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Executive 350–600 GSM Italian cotton &amp; silk artboard. 24K hot gold foil, velvet soft-touch, 3D spot UV &amp; gilded painted edges.
                  </p>
                  <ul className="pt-2 border-t border-slate-100 space-y-1 text-[11px] font-medium text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>350gsm to 600gsm Cotton Stocks</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>24K Gold/Silver Foil &amp; Spot UV</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Quantities from 100 to 5,000+ units</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <a
                  href={getServiceWhatsAppUrl('business-cards')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: '/',
                      service_name: 'business_cards',
                      button_location: 'homepage_service_cards',
                      label: 'card_whatsapp_inquiry',
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-white" />
                  <span>Inquire on WhatsApp</span>
                </a>
                <Link
                  to="/business-card-printing-dubai"
                  className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-slate-700 hover:text-[#A82F19] py-1 transition-colors"
                >
                  <span>View All Options</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Roll-Up Banners */}
            <div className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#A82F19]/50 hover:shadow-xl">
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 mb-4">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet="/assets/products/rollup_banner.webp"
                    />
                    <img
                      src="/assets/products/rollup_banner.jpg"
                      alt="Roll-Up Banner Printing Dubai"
                      width="400"
                      height="300"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                      Event &amp; Expo
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="rounded-lg bg-black/75 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-xs">
                      Rush 24h Ready
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#A82F19] transition-colors">
                      Roll-Up Banners
                    </h3>
                    <span className="text-xs font-extrabold text-[#A82F19]">From AED 145</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Retractable exhibition pull-up banners with heavy-duty aluminum base, stoplight blockout grey-back film, and padded carry bag.
                  </p>
                  <ul className="pt-2 border-t border-slate-100 space-y-1 text-[11px] font-medium text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Sizes: 85×200, 100×200, 120×200 cm</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Anti-Curl, Non-Tearing Blockout Film</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Standard &amp; Luxury Teardrop Chrome Stands</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <a
                  href={getServiceWhatsAppUrl('rollup-banners')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: '/',
                      service_name: 'rollup_banners',
                      button_location: 'homepage_service_cards',
                      label: 'rollup_whatsapp_inquiry',
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-white" />
                  <span>Inquire on WhatsApp</span>
                </a>
                <Link
                  to="/services/rollup-banners"
                  className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-slate-700 hover:text-[#A82F19] py-1 transition-colors"
                >
                  <span>View Banner Options</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: Custom Sticker Printing */}
            <div className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#A82F19]/50 hover:shadow-xl">
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 mb-4">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet="/assets/products/stickers.webp"
                    />
                    <img
                      src="/assets/products/stickers.jpg"
                      alt="Custom Sticker Printing Dubai"
                      width="400"
                      height="300"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                      Waterproof
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="rounded-lg bg-black/75 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-xs">
                      Same-Day
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#A82F19] transition-colors">
                      Sticker &amp; Label Printing
                    </h3>
                    <span className="text-xs font-extrabold text-[#A82F19]">From AED 40</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Custom contour die-cut waterproof vinyl stickers, clear transparent decals, bottle labels, and eye-catching holographic finishes.
                  </p>
                  <ul className="pt-2 border-t border-slate-100 space-y-1 text-[11px] font-medium text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Custom Shape Die-Cut &amp; Roll Labels</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>White Vinyl, Clear &amp; Holographic</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>UV &amp; Scratch Resistant Lamination</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <a
                  href={getServiceWhatsAppUrl('stickers')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: '/',
                      service_name: 'stickers',
                      button_location: 'homepage_service_cards',
                      label: 'sticker_whatsapp_inquiry',
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-white" />
                  <span>Inquire on WhatsApp</span>
                </a>
                <Link
                  to="/services/stickers-labels-printing"
                  className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-slate-700 hover:text-[#A82F19] py-1 transition-colors"
                >
                  <span>View Sticker Options</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 4: Custom Stamp Printing */}
            <div className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#A82F19]/50 hover:shadow-xl">
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 mb-4">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet="/assets/products/stamps/self-inking-company-stamp.webp"
                    />
                    <img
                      src="/assets/products/stamps/self-inking-company-stamp.jpg"
                      alt="Custom Stamp Printing Dubai"
                      width="400"
                      height="300"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                      Official Seal
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="rounded-lg bg-black/75 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-xs">
                      2h Express
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#A82F19] transition-colors">
                      Custom Stamps &amp; Seals
                    </h3>
                    <span className="text-xs font-extrabold text-[#A82F19]">From AED 85</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Official corporate self-inking rubber stamps, portable pocket folding stamps, heavy-duty daters, and brass wax notary seals.
                  </p>
                  <ul className="pt-2 border-t border-slate-100 space-y-1 text-[11px] font-medium text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Trodat &amp; Colop Self-Inking Housings</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Round Corporate Seals &amp; Pocket Stamps</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>UAE Trade License Compliant Verification</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <a
                  href={getServiceWhatsAppUrl('stamps')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: '/',
                      service_name: 'custom_stamps',
                      button_location: 'homepage_service_cards',
                      label: 'stamp_whatsapp_inquiry',
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-white" />
                  <span>Inquire on WhatsApp</span>
                </a>
                <Link
                  to="/services/stamps-printing-dubai"
                  className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-slate-700 hover:text-[#A82F19] py-1 transition-colors"
                >
                  <span>View Stamp Options</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* DEDICATED BUSINESS CARD PRINTING SECTION (HIGHEST PRIORITY) */}
          <div className="mt-14 rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50/80 to-white p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-200">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#A82F19]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#A82F19] mb-2">
                  <Award className="h-3.5 w-3.5" />
                  HIGHEST PRIORITY CRAFT
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  Executive &amp; Luxury Business Card Printing in Dubai
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Engineered to command attention across Dubai boardrooms and international summits. Manufactured in Al Quoz on heavy European stocks with precision post-press embellishments.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
                <a
                  href={getServiceWhatsAppUrl('business-cards')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: '/',
                      service_name: 'business_cards_spotlight',
                      button_location: 'homepage_bc_spotlight',
                      label: 'bc_spotlight_whatsapp',
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 cursor-pointer text-center"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-white" />
                  <span>Inquire About Business Cards</span>
                </a>
                <Link
                  to="/business-card-printing-dubai"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-6 py-3.5 text-xs font-bold text-slate-800 transition-all text-center"
                >
                  <span>Explore 16 Styles</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* 5 Signature Finishes Quick Comparison */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  name: '350 GSM Silk Matte',
                  price: 'AED 85 / 100 pcs',
                  desc: 'Double-sided matte lamination with crisp CMYK fidelity.',
                  turnaround: 'Same-Day / 24h',
                },
                {
                  name: '400 GSM Soft-Touch',
                  price: 'AED 120 / 100 pcs',
                  desc: 'Anti-scuff velvet laminate with glare-free luxury touch.',
                  turnaround: '24h Express',
                },
                {
                  name: '24K Gold Foil Stamped',
                  price: 'AED 180 / 100 pcs',
                  desc: 'Heat-fused metallic gold, silver or copper brass die foil.',
                  turnaround: '2–3 Days',
                },
                {
                  name: '600 GSM Italian Cotton',
                  price: 'AED 240 / 100 pcs',
                  desc: 'Pillowy 100% natural tree-free cotton with deep debossing.',
                  turnaround: '3–4 Days',
                },
                {
                  name: '700 GSM Gilded Edge',
                  price: 'AED 290 / 100 pcs',
                  desc: 'Ultra-thick multi-ply card with mirror metallic painted edges.',
                  turnaround: '3–4 Days',
                },
              ].map((style, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-[#A82F19]/40 transition-colors"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Option 0{idx + 1}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-1">{style.name}</h4>
                  <span className="inline-block text-[11px] font-extrabold text-[#A82F19] mt-0.5">
                    {style.price}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{style.desc}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {style.turnaround}
                  </span>
                </div>
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
                  <span>Get Quote on WhatsApp ({FORMATTED_PHONE})</span>
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
                Browse our curated selection of premium business cards, thermal flasks, branded stationery, and exhibition rollups.
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
                A curated look at executive stationery suites, marketing brochures, and VIP corporate gifts produced in our Al Quoz pressroom.
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

        <Container className="relative z-10 flex flex-col items-center gap-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19]/20 bg-[#A82F19]/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <Sparkles className="h-3.5 w-3.5 text-[#A82F19]" />
            Dubai's Trusted Commercial &amp; Luxury Printing Partner
          </div>

          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">
            Ready to Start Your Print Project in Dubai?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            From presidential cotton business cards and event roll-up banners to waterproof product stickers and official company stamps, get immediate pricing and turnaround times directly from our Al Quoz pressroom.
          </p>

          {/* Quick Service Inquiry WhatsApp Chips */}
          <div className="w-full max-w-3xl pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              One-Click WhatsApp Inquiry by Service:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { label: 'Business Cards', key: 'business-cards' },
                { label: 'Stickers & Labels', key: 'stickers' },
                { label: 'Roll-Up Banners', key: 'rollup-banners' },
                { label: 'Custom Bottles', key: 'bottle-printing' },
                { label: 'Custom Stamps', key: 'stamps' },
              ].map((svc) => (
                <a
                  key={svc.key}
                  href={getServiceWhatsAppUrl(svc.key)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: 'homepage_bottom_chips',
                      service: svc.key,
                      button_location: 'bottom_service_chips',
                    })
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-800 shadow-xs hover:border-[#25D366] hover:bg-emerald-50/50 hover:text-emerald-800 transition-all group"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 fill-[#25D366] group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate">{svc.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto pt-3">
            <a
              href={getServiceWhatsAppUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppClick({
                  source_page: 'homepage_bottom_cta',
                  service: 'general',
                  button_location: 'bottom_primary_cta',
                })
              }
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-500/20 hover:-translate-y-0.5 transition-all group cursor-pointer"
            >
              <WhatsAppIcon className="h-5 w-5 fill-current group-hover:scale-110 transition-transform" />
              <span>Get a Quote on WhatsApp ({FORMATTED_PHONE})</span>
            </a>
            <Button
              to="/get-a-quote"
              variant="accent"
              size="lg"
              className="!rounded-xl !bg-[#A82F19] hover:!bg-[#8F2412] shadow-lg shadow-[#A82F19]/25 text-center justify-center font-bold !py-3.5 !px-8 text-white"
              onClick={() => trackGetQuoteClick({ source_page: 'homepage_bottom_cta' })}
            >
              Request a Custom Quote →
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
