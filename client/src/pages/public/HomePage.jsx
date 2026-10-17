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
    accent: '#D4AF65',
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
    accent: '#D4AF65',
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
    accent: '#D4AF65',
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
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 })

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width
    const relY = (e.clientY - rect.top) / rect.height
    setHeroTilt({
      x: (0.5 - relY) * 10,
      y: (relX - 0.5) * 12,
      glareX: relX * 100,
      glareY: relY * 100,
    })
  }

  const handleHeroMouseLeave = () => {
    setHeroTilt({ x: 0, y: 0, glareX: 50, glareY: 50 })
    setIsAutoPlaying(true)
  }

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
    <div className="bg-white text-[#343D4F] selection:bg-[#D4AF65] selection:text-[#101D35]">
      {/* SEO Head Management & Structured Data */}
      <SEOHead
        title="Printing Company in Dubai | ONPRINT – Commercial & Luxury Printing UAE"
        description="ONPRINT is Dubai's leading commercial pressroom in Al Quoz. Precision digital & Heidelberg offset printing, luxury 600 GSM business cards, stickers, brochures, and corporate gifts with same-day express UAE delivery."
        keywords="printing company in dubai, printing services dubai, commercial printing dubai, luxury business cards dubai, business card printing dubai, sticker printing dubai, brochure printing dubai, same day printing dubai, corporate gifts dubai, offset printing dubai, digital printing press uae"
        canonicalPath="/"
        faqList={homeFaqs}
      />

      {/* ========================================================================= */}
      {/* 1. WARM EDITORIAL & MODERN CRAFT HERO WITH 3D INTERACTIVE BENTO STAGE     */}
      {/* ========================================================================= */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#101D35] via-[#0E1A30] to-[#101D35] text-white pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-24 border-b border-[#343D4F]/50">
        {/* Warm Editorial Ambient Radial Glows */}
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-[#D4AF65]/20 via-[#101D35] to-transparent blur-[120px] -z-10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/4 -right-40 h-[520px] w-[520px] rounded-full bg-gradient-to-bl from-[#D4AF65]/15 via-[#101D35] to-transparent blur-[120px] -z-10"
          aria-hidden="true"
        />

        {/* Subtle Archival Paper Grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_40%,#000_65%,transparent_100%)] opacity-35"
          aria-hidden="true"
        />

        <Container className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Editorial Headline & Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Top Small Atelier Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 shadow-2xs backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="uppercase tracking-[0.2em] text-[10.5px] font-black text-[#F5F2EB]">
                DUBAI COMMERCIAL PRESSROOM
              </span>
              <span className="h-3 w-px bg-white/20" />
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#D4AF65] uppercase tracking-wider">
                <Sparkles className="h-3 w-3 text-[#D4AF65]" />
                AL QUOZ ATELIER
              </span>
            </div>

            {/* Main Heading in Elegant Editorial Serif Font */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.4rem] xl:text-[3.9rem] font-bold leading-[1.08] tracking-tight text-white">
              Tactile Luxury &amp; Commercial<br />
              Printing in{' '}
              <span className="relative inline-block font-serif italic text-[#D4AF65] font-black">
                Dubai, UAE
                <span
                  className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#D4AF65] via-[#D4AF65]/60 to-transparent"
                  aria-hidden="true"
                />
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="max-w-xl text-base sm:text-lg leading-[1.75] text-[#F5F2EB]/80 font-normal">
              Direct in-house pressroom in <strong className="text-white font-bold">Al Quoz, Dubai</strong>. Crafting calibrated German Heidelberg color accuracy, <strong className="text-[#D4AF65] font-bold">600 GSM cotton &amp; 24K foil business cards</strong>, exhibition roll-up banners, waterproof stickers, and official company seals with same-day UAE dispatch.
            </p>

            {/* 4 Tactile Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {heroFeatures.map((feat, idx) => {
                const Icon = feat.icon
                return (
                  <motion.div
                    key={feat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.07, duration: 0.45 }}
                    className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs sm:text-[12.5px] font-semibold text-[#F5F2EB] shadow-2xs"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#D4AF65]/20 text-[#D4AF65] border border-white/15 shrink-0">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span>{feat.label}</span>
                  </motion.div>
                )
              })}
            </div>

            {/* Action Buttons: Primary Gold, Secondary White Outline & WhatsApp */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              {/* Primary CTA: Champagne Gold with Midnight Navy text */}
              <Button
                to="/get-a-quote"
                variant="primary"
                size="lg"
                className="!rounded-full px-8 py-4 text-sm sm:text-base font-black shadow-lg shadow-[#D4AF65]/20 hover:shadow-xl hover:shadow-[#D4AF65]/30 text-center justify-center"
                onClick={() => trackGetQuoteClick({ source_page: 'hero_primary_cta' })}
              >
                <span>Get Instant Quote</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>

              {/* Secondary CTA: Navy-compatible white outline */}
              <Button
                to="/services"
                variant="navyOutline"
                size="lg"
                className="!rounded-full px-7 py-4 text-sm sm:text-base font-bold text-center justify-center"
              >
                <span>Explore Disciplines</span>
              </Button>

              {/* WhatsApp Concierge Action */}
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={getServiceWhatsAppUrl('general')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source_page: '/',
                    service_name: 'general_hero',
                    button_location: 'hero_whatsapp_cta',
                    label: 'hero_whatsapp_concierge',
                  })
                }
                className="rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-5 py-4 inline-flex items-center justify-center gap-2 text-sm sm:text-base shadow-md shadow-emerald-950/20 transition-all text-center cursor-pointer"
                title="Direct WhatsApp Concierge"
              >
                <WhatsAppIcon className="h-5 w-5 fill-white" />
                <span className="hidden xl:inline">WhatsApp</span>
              </motion.a>
            </div>

            {/* Social Proof Star Rating */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#F5F2EB]/80 pt-1">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#D4AF65] text-[#D4AF65]" />
                  ))}
                </div>
                <span className="font-extrabold text-white">4.9 / 5.0</span>
                <span className="text-[#D4AF65]">Google Verified</span>
              </div>
              <span className="hidden sm:inline text-[#D5CBB8]">•</span>
              <span className="font-bold text-[#F5F2EB]">500+ UAE Enterprises</span>
              <span className="hidden sm:inline text-[#D5CBB8]">•</span>
              <span className="inline-flex items-center gap-1 font-bold text-[#F5F2EB]">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                Direct Al Quoz Pressroom
              </span>
            </div>
          </motion.div>

          {/* Right Column: Interactive 3D Tactile Bento Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-[590px] mx-auto">
              {/* Interactive Finish Switcher Tabs above the 3D Stage */}
              <div className="mb-3.5 flex items-center justify-between gap-2 rounded-2xl border border-white/15 bg-white/10 p-1.5 shadow-2xs backdrop-blur-md">
                <div className="flex items-center gap-1 flex-wrap">
                  {atelierShowcaseItems.map((item, idx) => {
                    const isActive = idx === activeAtelierIdx
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveAtelierIdx(idx)
                          setIsAutoPlaying(false)
                        }}
                        className={`relative rounded-xl px-3 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                          isActive ? 'text-[#101D35] font-black' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="heroAtelierTab"
                            className="absolute inset-0 rounded-xl bg-[#D4AF65] border border-[#D4AF65] shadow-xs -z-10"
                            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                          />
                        )}
                        <span className="relative z-10">{item.category}</span>
                      </button>
                    )
                  })}
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 pr-2 text-[10px] font-bold uppercase tracking-wider text-[#D4AF65]">
                  <Sparkles className="h-3 w-3 text-[#D4AF65]" /> 3D Preview
                </span>
              </div>

              {/* Editorial Bento Photo Composition Grid */}
              <div className="grid grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
                {/* Main Interactive 3D Tilt Visual (Left 7 Cols) */}
                <div
                  onMouseMove={handleHeroMouseMove}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={handleHeroMouseLeave}
                  style={{
                    transform: `perspective(1100px) rotateX(${heroTilt.x}deg) rotateY(${heroTilt.y}deg)`,
                    transition: heroTilt.x === 0 && heroTilt.y === 0 ? 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.08s linear',
                  }}
                  className="col-span-7 relative group overflow-hidden rounded-3xl border border-white/15 bg-[#0B1426] p-2 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] transition-shadow duration-300"
                >
                  {/* Specular Champagne Foil Glare */}
                  <div
                    className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at ${heroTilt.glareX}% ${heroTilt.glareY}%, rgba(223,185,115,0.28), transparent 60%)`,
                    }}
                  />

                  <Link
                    to="/business-card-printing-dubai"
                    className="relative block h-[340px] sm:h-[404px] w-full overflow-hidden rounded-2xl bg-zinc-950"
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeAtelierItem.id}
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.45 }}
                        src={activeAtelierItem.image}
                        alt={activeAtelierItem.title}
                        width="480"
                        height="404"
                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                      />
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-zinc-950/85 border border-[#E5E7EB] px-2.5 py-1 text-[9.5px] font-black uppercase tracking-wider text-[#D4AF65] backdrop-blur-md">
                        {activeAtelierItem.badge}
                      </span>
                      <span className="rounded-lg bg-[#D4AF65] px-2.5 py-1 text-[9.5px] font-black uppercase tracking-wider text-white shadow-xs">
                        {activeAtelierItem.metric}
                      </span>
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <span className="text-[9.5px] font-black uppercase tracking-[0.2em] text-[#D4AF65]">
                        {activeAtelierItem.tag} • FROM AED {activeAtelierItem.price}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-white mt-0.5 leading-snug">
                        {activeAtelierItem.title}
                      </h3>
                      <p className="text-[11px] text-zinc-300 mt-1 line-clamp-2">
                        {activeAtelierItem.subtitle}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {activeAtelierItem.specs.map((spec) => (
                          <span
                            key={spec}
                            className="rounded-md bg-white/12 border border-white/15 px-2 py-0.5 text-[9.5px] font-semibold text-zinc-100 backdrop-blur-xs"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Right Stacked Bento Visuals (Right 5 Cols) */}
                <div className="col-span-5 flex flex-col gap-3.5 sm:gap-4">
                  {/* Top Card: Executive Stationery */}
                  <Link
                    to="/categories/letterheads-printing-dubai"
                    className="rounded-3xl border border-white/15 bg-[#0B1426] relative group flex-1 overflow-hidden p-2 block"
                  >
                    <div className="relative h-[162px] sm:h-[192px] w-full overflow-hidden rounded-xl bg-zinc-100">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <span className="text-[8.5px] font-black uppercase tracking-widest text-[#D4AF65]">
                          BESPOKE STATIONERY
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
                    className="rounded-3xl border border-white/15 bg-[#0B1426] relative group flex-1 overflow-hidden p-2 block"
                  >
                    <div className="relative h-[162px] sm:h-[192px] w-full overflow-hidden rounded-xl bg-zinc-100">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <span className="text-[8.5px] font-black uppercase tracking-widest text-[#D4AF65]">
                          700 GSM TRIPLEX
                        </span>
                        <h4 className="font-serif text-xs sm:text-sm font-bold leading-tight mt-0.5">
                          Gilded Metallic Edges
                        </h4>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Floating UAE Atelier Serving Banner */}
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-xs shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-[#F5F2EB]">
                  <span className="text-base leading-none">🇦🇪</span>
                  <span>Direct Al Quoz Pressroom • Serving All 7 Emirates</span>
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1 font-bold text-[#D4AF65] hover:text-white transition-colors text-xs"
                >
                  <span>Full Catalog</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 1B. INFINITE ANIMATED PRESSROOM MARQUEE RIBBON                            */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1426] border-y border-[#343D4F]/40 py-3 overflow-hidden select-none">
        <div className="hero-marquee-track flex items-center gap-8 whitespace-nowrap">
          {[...heroMarquee, ...heroMarquee].map((item, idx) => (
            <div key={`${item}-${idx}`} className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.14em] uppercase text-zinc-100/90">
              <span className="h-1.5 w-1.5 rotate-45 bg-[#D4AF65]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CORE DUBAI PRINTING SERVICES (4 TACTILE BENTO DISCIPLINES)             */}
      {/* ========================================================================= */}
      <section className="bg-[#F5F2EB] py-16 sm:py-24 border-b border-[#E5E7EB]">
        <Container>
          <Reveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 mb-10 border-b border-[#E5E7EB]">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF65]">
                  CORE PRINT DISCIPLINES • DUBAI &amp; UAE
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#101D35] mt-1">
                  Our Four Core Commercial Printing Services
                </h2>
                <p className="text-xs sm:text-sm text-[#343D4F] mt-1.5 max-w-2xl">
                  Industrial precision with tactile European paper stocks, in-house Heidelberg presses, and express same-day UAE delivery. Select any discipline to inquire directly on WhatsApp.
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF65] hover:text-[#101D35] transition-colors shrink-0"
              >
                <span>Explore All Print Services</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>

          {/* 4 Tactile Bento Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Card 1: Business Card Printing */}
            <Reveal delay={0.05}>
              <div className="rounded-3xl border border-[#E5E7EB] bg-white group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D4AF65] hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 mb-4 border border-[#E5E7EB]">
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
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-full bg-[#D4AF65] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                        Flagship Craft
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg bg-zinc-950/85 border border-[#E5E7EB] px-2 py-0.5 text-[10px] font-bold text-[#D4AF65] backdrop-blur-xs">
                        Same-Day / 24h
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-[#101D35] group-hover:text-[#D4AF65] transition-colors">
                        Business Card Printing
                      </h3>
                      <span className="text-xs font-extrabold text-[#D4AF65]">From AED 85</span>
                    </div>
                    <p className="text-xs text-[#343D4F] leading-relaxed">
                      Executive 350–600 GSM Italian cotton &amp; silk artboard. 24K hot gold foil, velvet soft-touch, 3D spot UV &amp; gilded painted edges.
                    </p>
                    <ul className="pt-2 border-t border-[#E5E7EB] space-y-1 text-[11px] font-medium text-[#343D4F]">
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

                <div className="mt-5 pt-4 border-t border-[#E5E7EB] space-y-2">
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
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                  <Link
                    to="/business-card-printing-dubai"
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-zinc-700 hover:text-[#D4AF65] py-1 transition-colors"
                  >
                    <span>View All Card Finishes</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Card 2: Roll-Up Banners */}
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-[#E5E7EB] bg-white group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D4AF65] hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 mb-4 border border-[#E5E7EB]">
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
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
                        DWTC &amp; Expo
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg bg-zinc-950/85 border border-[#E5E7EB] px-2 py-0.5 text-[10px] font-bold text-[#D4AF65] backdrop-blur-xs">
                        Rush 24h Ready
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-[#101D35] group-hover:text-[#D4AF65] transition-colors">
                        Roll-Up Banners
                      </h3>
                      <span className="text-xs font-extrabold text-[#D4AF65]">From AED 145</span>
                    </div>
                    <p className="text-xs text-[#343D4F] leading-relaxed">
                      Retractable exhibition pull-up banners with heavy-duty aluminum base, stoplight blockout grey-back film, and padded carry bag.
                    </p>
                    <ul className="pt-2 border-t border-[#E5E7EB] space-y-1 text-[11px] font-medium text-[#343D4F]">
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

                <div className="mt-5 pt-4 border-t border-[#E5E7EB] space-y-2">
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
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                  <Link
                    to="/services/rollup-banners"
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-zinc-700 hover:text-[#D4AF65] py-1 transition-colors"
                  >
                    <span>View Banner Options</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Card 3: Custom Sticker Printing */}
            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-[#E5E7EB] bg-white group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D4AF65] hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 mb-4 border border-[#E5E7EB]">
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
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
                        Waterproof Die-Cut
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg bg-zinc-950/85 border border-[#E5E7EB] px-2 py-0.5 text-[10px] font-bold text-[#D4AF65] backdrop-blur-xs">
                        Same-Day
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-[#101D35] group-hover:text-[#D4AF65] transition-colors">
                        Sticker &amp; Label Printing
                      </h3>
                      <span className="text-xs font-extrabold text-[#D4AF65]">From AED 40</span>
                    </div>
                    <p className="text-xs text-[#343D4F] leading-relaxed">
                      Custom contour die-cut waterproof vinyl stickers, clear transparent decals, bottle labels, and eye-catching holographic finishes.
                    </p>
                    <ul className="pt-2 border-t border-[#E5E7EB] space-y-1 text-[11px] font-medium text-[#343D4F]">
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

                <div className="mt-5 pt-4 border-t border-[#E5E7EB] space-y-2">
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
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                  <Link
                    to="/services/stickers-labels-printing"
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-zinc-700 hover:text-[#D4AF65] py-1 transition-colors"
                  >
                    <span>View Sticker Options</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Card 4: Custom Stamp Printing */}
            <Reveal delay={0.2}>
              <div className="rounded-3xl border border-[#E5E7EB] bg-white group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D4AF65] hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 mb-4 border border-[#E5E7EB]">
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
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
                        Official Seal
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg bg-zinc-950/85 border border-[#E5E7EB] px-2 py-0.5 text-[10px] font-bold text-[#D4AF65] backdrop-blur-xs">
                        2h Express
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-[#101D35] group-hover:text-[#D4AF65] transition-colors">
                        Custom Stamps &amp; Seals
                      </h3>
                      <span className="text-xs font-extrabold text-[#D4AF65]">From AED 85</span>
                    </div>
                    <p className="text-xs text-[#343D4F] leading-relaxed">
                      Official corporate self-inking rubber stamps, portable pocket folding stamps, heavy-duty daters, and brass wax notary seals.
                    </p>
                    <ul className="pt-2 border-t border-[#E5E7EB] space-y-1 text-[11px] font-medium text-[#343D4F]">
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

                <div className="mt-5 pt-4 border-t border-[#E5E7EB] space-y-2">
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
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                  <Link
                    to="/services/stamps-printing-dubai"
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-zinc-700 hover:text-[#D4AF65] py-1 transition-colors"
                  >
                    <span>View Stamp Options</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* DEDICATED BUSINESS CARD PRINTING SECTION — ESPRESSO INK & BRUSHED BRASS BENTO SUITE */}
          <Reveal delay={0.1}>
            <div className="mt-14 rounded-3xl border border-[#343D4F]/60 bg-[#101D35] p-6 sm:p-10 relative overflow-hidden shadow-2xl">
              <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-zinc-100 blur-3xl" />
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-white/12 relative z-10">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 border border-[#E5E7EB] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#D4AF65] mb-2.5">
                    <Award className="h-3.5 w-3.5" />
                    SIGNATURE ATELIER EDITION
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    Executive &amp; Luxury Business Card Printing in Dubai
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                    Engineered to command attention across Dubai boardrooms and international summits. Manufactured in Al Quoz on heavy European cotton &amp; triplex stocks with hand-finished embellishments.
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
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 cursor-pointer text-center"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>Inquire About Business Cards</span>
                  </a>
                  <Link
                    to="/business-card-printing-dubai"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white/10 hover:bg-white/18 px-6 py-3.5 text-xs font-bold text-zinc-100 transition-all text-center"
                  >
                    <span>Explore 16 Card Finishes</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#D4AF65]" />
                  </Link>
                </div>
              </div>

              {/* 5 Signature Finishes Quick Comparison */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
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
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-white/12 bg-white/[0.05] hover:bg-white/[0.09] hover:border-[#E5E7EB] p-4 transition-all"
                  >
                    <span className="text-[10px] font-bold text-[#D4AF65] uppercase tracking-wider block">
                      Edition 0{idx + 1}
                    </span>
                    <h4 className="font-bold text-xs text-white mt-1">{style.name}</h4>
                    <span className="inline-block text-[11px] font-extrabold text-[#D4AF65] mt-0.5">
                      {style.price}
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{style.desc}</p>
                    <span className="inline-block mt-2.5 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-400/25 px-2 py-0.5 rounded-md">
                      {style.turnaround}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. INSTANT SPECIFICATION & TURNAROUND ESTIMATOR RIBBON                    */}
      {/* ========================================================================= */}
      <section className="bg-zinc-100 py-10 border-b border-[#E5E7EB]">
        <Container>
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-7">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left Selector Controls */}
              <div className="space-y-3.5 flex-1">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-[#D4AF65]" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#101D35]">
                    Interactive Spec &amp; Turnaround Estimator
                  </span>
                  <span className="rounded-full bg-zinc-100 border border-[#E5E7EB] px-2.5 py-0.5 text-[9px] font-bold text-zinc-700">
                    Live Al Quoz Schedule
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
                        className={`relative rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-950 text-zinc-100 shadow-sm border border-[#E5E7EB]'
                            : 'bg-zinc-100 text-[#343D4F] hover:bg-zinc-200/70 hover:text-[#101D35] border border-transparent'
                        }`}
                      >
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right Output & WhatsApp Trigger */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-5 border-t lg:border-t-0 lg:border-l border-[#E5E7EB] pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCalcCategory.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="min-w-[180px]"
                  >
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Est. Turnaround &amp; Stock
                    </span>
                    <span className="text-sm font-black text-emerald-700 flex items-center gap-1 mt-0.5">
                      <Zap className="h-3.5 w-3.5 text-[#D4AF65]" />
                      {selectedCalcCategory.turnaround}
                    </span>
                    <span className="block text-[11px] font-semibold text-[#343D4F] mt-0.5">
                      {selectedCalcCategory.stock} • Min: {selectedCalcCategory.minQty}
                    </span>
                  </motion.div>
                </AnimatePresence>

                <a
                  href={getWhatsAppCalcLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-5 py-3.5 text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 group cursor-pointer"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
                  <span>Get Price on WhatsApp ({FORMATTED_PHONE})</span>
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
      <section className="border-t border-[#E5E7EB] bg-white py-16 sm:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">FEATURED COLLECTION</span>
              <h2 className="font-serif mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                Trending Corporate Merchandise &amp; Print Products
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                Browse our curated selection of premium business cards, thermal flasks, branded stationery, and exhibition rollups.
              </p>
            </div>
            <ArrowLink to="/products" className="shrink-0 text-[#D4AF65] font-bold">
              Explore Full Catalog
            </ArrowLink>
          </div>

          <div>
            {featuredProducts === null && <LoadingState type="cards" columns={4} count={4} label="Loading products…" />}
            {featuredProducts && featuredProducts.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product, idx) => (
                  <ProductCard key={product._id} product={product} index={idx} onQuickView={setQuickViewProduct} />
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
      <section className="border-t border-[#E5E7EB] bg-[#F5F2EB] py-16 sm:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">
                SELECTED ATELIER WORK
              </span>
              <h2 className="font-serif mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                Crafted in Dubai. Delivered Across the UAE.
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                A curated look at executive stationery suites, marketing brochures, and VIP corporate gifts produced in our Al Quoz pressroom.
              </p>
            </div>
            <ArrowLink to="/portfolio" className="shrink-0 text-[#D4AF65] font-bold">
              View Full Portfolio
            </ArrowLink>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {portfolioItems.slice(0, 4).map((item, idx) => (
              <Reveal key={item.id} delay={idx * 0.08}>
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF65] hover:shadow-md">
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
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF65]">
                        {item.clientSector}
                      </span>
                      <h3 className="font-display mt-1 text-sm font-bold text-slate-900 group-hover:text-[#D4AF65] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                        {item.specs}
                      </p>
                    </div>
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <ArrowLink to={`/get-a-quote?service=${encodeURIComponent(item.title)}`} className="text-xs font-bold text-[#D4AF65]">
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
      <section id="production-process" className="py-16 sm:py-24 bg-white border-t border-[#E5E7EB]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">THE ONPRINT ADVANTAGE</span>
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
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF65] hover:shadow-md group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF65] font-display text-xs font-bold text-white shadow-xs">
                    0{index + 1}
                  </div>
                  <h3 className="font-display mt-4 text-base font-bold text-slate-900 group-hover:text-[#D4AF65] transition-colors">{item.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Process Steps */}
          <div className="mt-16 pt-12 border-t border-slate-200/80">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">DISCIPLINED WORKFLOW</span>
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
        <section className="border-t border-[#E5E7EB] bg-[#F5F2EB] py-16 sm:py-24">
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end mb-10">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">
                  PRINTING KNOWLEDGE &amp; INSIGHTS
                </span>
                <h2 className="font-serif mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                  Commercial Printing &amp; Luxury Branding Guides
                </h2>
                <p className="mt-1 max-w-xl text-sm text-slate-600">
                  Expert advice on substrate selection, hot foiling, Pantone CMYK matching, and pre-press standards from our Dubai pressroom.
                </p>
              </div>
              <ArrowLink to="/blog" className="shrink-0 text-[#D4AF65] font-bold">
                View All Guides
              </ArrowLink>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.slice(0, 3).map((blog, idx) => (
                <Reveal key={blog.id || blog.slug} delay={idx * 0.08}>
                  <article className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF65] hover:shadow-md">
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
                        <span className="rounded-full bg-[#D4AF65]/10 px-2.5 py-0.5 text-[#D4AF65] uppercase tracking-wider">
                          {blog.category || 'Printing Guide'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {blog.reading_time || blog.readTime || '4 min read'}
                        </span>
                      </div>

                      <h3 className="font-display mt-2.5 text-base font-bold text-slate-900 hover:text-[#D4AF65] transition-colors">
                        <Link to={`/blog/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <ArrowLink to={`/blog/${blog.slug}`} className="text-xs font-bold text-[#D4AF65]">
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
      <section className="border-t border-[#E5E7EB] bg-white py-16 sm:py-24">
        <Container className="max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">DUBAI PRINTING FAQ</span>
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
                  <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-[#D4AF65] transition-colors">
                    {faq.question}
                  </h3>
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180 group-hover:text-[#D4AF65]" />
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
      <section className="border-t border-[#343D4F]/50 bg-[#101D35] py-16 sm:py-20 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#D4AF65]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#D4AF65]/10 blur-3xl" />

        <Container className="relative z-10 flex flex-col items-center gap-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65] bg-[#D4AF65]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF65]" />
            Dubai's Trusted Commercial &amp; Luxury Printing Partner
          </div>

          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Ready to Start Your Print Project in Dubai?
          </h2>

          <p className="text-sm sm:text-base text-[#F5F2EB]/80 leading-relaxed max-w-2xl">
            From presidential cotton business cards and event roll-up banners to waterproof product stickers and official company stamps, get immediate pricing and turnaround times directly from our Al Quoz pressroom.
          </p>

          {/* Quick Service Inquiry WhatsApp Chips */}
          <div className="w-full max-w-3xl pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-3">
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
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#343D4F]/60 bg-[#0B1426] px-3 py-2.5 text-xs font-bold text-white shadow-xs hover:border-[#25D366] hover:bg-[#162544] hover:text-[#D4AF65] transition-all group"
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
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-500/20 hover:-translate-y-0.5 transition-all group cursor-pointer"
            >
              <WhatsAppIcon className="h-5 w-5 fill-current group-hover:scale-110 transition-transform" />
              <span>Get a Quote on WhatsApp ({FORMATTED_PHONE})</span>
            </a>
            <Button
              to="/get-a-quote"
              variant="accent"
              size="lg"
              className="!rounded-full !bg-[#D4AF65] hover:!bg-[#B89245] shadow-lg shadow-[#D4AF65]/25 text-center justify-center font-black !py-3.5 !px-8 !text-[#101D35]"
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
