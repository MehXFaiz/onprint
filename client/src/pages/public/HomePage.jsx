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
  Clock,
  ArrowRight,
  Package,
  Layers,
  MapPin,
  Printer,
  Play,
  ArrowUpRight,
  Star,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import ArrowLink from '../../components/ArrowLink'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import Reveal from '../../components/Reveal'
import LoadingState from '../../components/LoadingState'
import ProductCard from '../../components/ProductCard'
import CarefreeShoppingSection from '../../components/CarefreeShoppingSection'
import ProductDetailModal from '../../components/ProductDetailModal'
import LuxuryFinishesShowcase from '../../components/LuxuryFinishesShowcase'
import HorizontalProductCarousel from '../../components/HorizontalProductCarousel'
import InfiniteProductMarquee from '../../components/InfiniteProductMarquee'
import HeroPrintEstimator from '../../components/HeroPrintEstimator'
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
  { step: '01', title: '1. Select Your Product', description: 'Browse our catalog of luxury business cards, roll-up banners, waterproof stickers, or corporate stationery.' },
  { step: '02', title: '2. Share Specs & Artwork', description: 'Provide dimensions, quantity, and paper preferences, or upload your artwork for a complimentary 300 DPI pre-flight check.' },
  { step: '03', title: '3. Instant Quote & Confirm', description: 'Receive an itemized, transparent quotation within 2 hours with direct WhatsApp concierge support.' },
  { step: '04', title: '4. Proof Approval & Press Run', description: 'Review your PDF digital proof. Once approved, our Al Quoz press floor begins precision Heidelberg & HP Indigo production.' },
  { step: '05', title: '5. Hand Inspection & UAE Delivery', description: 'Every single piece is quality-inspected, moisture-sealed, and delivered via express courier across Dubai and all 7 Emirates.' },
]



const homeFaqs = [
  {
    question: 'What are your primary commercial printing services in Dubai?',
    answer:
      'ONPRINT specializes in high-speed digital and commercial print disciplines: Premium Business Card Printing (cotton, 24K gold foil, spot UV), Marketing Flyers & Leaflets, Official Letterhead & Envelope Stationery, Multi-Page Brochures & Catalogs, Custom Waterproof Stickers & Labels, Official Company Stamps, and Security Vouchers. We also produce roll-up banners, exhibition signage, and corporate gifts in our Al Quoz pressroom.',
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

  return (
    <div className="bg-[#101D35] text-[#F5F2EB]">
      {/* SEO Head Management & Structured Data */}
      <SEOHead
        title="Business Card Printing & Custom Printing | ONPRINT"
        description="Order custom business cards with premium printing and finishing options. Explore your choices and request a personalized printing quote from ONPRINT."
        keywords="printing company in dubai, printing services dubai, commercial printing dubai, luxury business cards dubai, business card printing dubai, sticker printing dubai, brochure printing dubai, same day printing dubai, corporate gifts dubai, offset printing dubai, digital printing press uae"
        canonicalPath="/"
        faqList={homeFaqs}
      />

      {/* ========================================================================= */}
      {/* 1. LUXURY MIDNIGHT NAVY & GOLD EDITORIAL HERO                 */}
      {/* ========================================================================= */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#101D35] via-[#172644] to-[#101D35] text-[#F5F2EB] pt-8 sm:pt-12 lg:pt-14 pb-14 sm:pb-20">
        {/* Subtle Ambient Radial Glows */}
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#D4AF65]/10 blur-[120px] -z-10"
          aria-hidden="true"
        />
        <Container className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Editorial Headline & Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Top Small Atelier Eyebrow Pill */}
            <div className="inline-flex flex-wrap items-center gap-2 sm:gap-2.5 rounded-2xl sm:rounded-full border border-[#203357] bg-[#172644] px-3.5 sm:px-4 py-1.5 shadow-2xs backdrop-blur-md text-[#F5F2EB] max-w-full">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[10px] sm:text-[10.5px] font-black text-[#F5F2EB]">
                DUBAI COMMERCIAL PRESSROOM
              </span>
              <span className="hidden sm:inline-block h-3 w-px bg-[#203357]" />
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#D4AF65] uppercase tracking-wider">
                <Sparkles className="h-3 w-3 text-[#D4AF65] shrink-0" />
                AL QUOZ ATELIER
              </span>
            </div>

            {/* Main Heading in Elegant Editorial Serif Font */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.3rem] xl:text-[3.8rem] font-bold leading-[1.1] tracking-tight text-[#F5F2EB]">
              Commercial &amp; Luxury<br className="hidden sm:inline" />{' '}
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
            <p className="max-w-xl text-sm sm:text-base leading-[1.75] text-[#B0BECE] font-normal">
              Direct in-house pressroom in <strong className="text-[#F5F2EB] font-bold">Al Quoz, Dubai</strong>. German Heidelberg offset accuracy, HP Indigo digital, <strong className="text-[#F5F2EB] font-bold">600 GSM cotton &amp; 24K foil business cards</strong>, roll-up exhibition banners, waterproof stickers, and official company seals with same-day UAE dispatch.
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
                    className="flex items-center gap-2.5 rounded-xl border border-[#203357] bg-[#172644] px-3.5 py-2.5 text-xs sm:text-[12.5px] font-semibold text-[#F5F2EB] shadow-2xs"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#D4AF65]/15 text-[#D4AF65] border border-[#203357] shrink-0">
                      <Icon className="h-3.5 w-3.5 text-[#D4AF65]" />
                    </div>
                    <span className="text-[#F5F2EB] font-semibold">{feat.label}</span>
                  </motion.div>
                )
              })}
            </div>

            {/* Action Buttons: Get a Quote on WhatsApp & Explore Products */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-3.5 pt-2">
              {/* Primary Action: Get a Quote on WhatsApp */}
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
                    button_location: 'hero_primary_whatsapp',
                    label: 'hero_get_quote_whatsapp',
                  })
                }
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-5 sm:px-7 py-3.5 sm:py-4 text-sm sm:text-base font-black text-white shadow-lg shadow-emerald-600/20 transition-all cursor-pointer text-center"
                title="Get a Quote on WhatsApp"
              >
                <WhatsAppIcon className="h-5 w-5 fill-white shrink-0" />
                <span>Get Price on WhatsApp</span>
              </motion.a>

              {/* Explore Products Button */}
              <Button
                to="/products"
                variant="primary"
                size="lg"
                icon={false}
                className="!rounded-full px-5 sm:px-7 py-3.5 sm:py-4 text-sm sm:text-base font-black !bg-[#D4AF65] hover:!bg-[#D4AF65] !text-[#101D35] shadow-md shadow-[#D4AF65]/20 hover:shadow-lg text-center justify-center"
              >
                <span>Explore Products</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>

          {/* Right Column: Interactive Print Estimator & Order Hub */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex items-center justify-center min-w-0"
          >
            <HeroPrintEstimator />
          </motion.div>
        </Container>
      </section>



      {/* ========================================================================= */}
      {/* 2. CORE DUBAI PRINTING SERVICES (4 TACTILE BENTO DISCIPLINES)             */}
      {/* ========================================================================= */}
      <section className="bg-[#0C1629] py-16 sm:py-24 text-[#F5F2EB]">
        <Container>
          <Reveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 mb-10 border-b border-[#203357]">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF65]">
                  DIGITAL PRINTING DISCIPLINES • DUBAI &amp; UAE
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F2EB] mt-1">
                  Our Core Digital Printing Services
                </h2>
                <p className="text-xs sm:text-sm text-[#B0BECE] mt-1.5 max-w-2xl">
                  High-speed digital printing with tactile European paper stocks, in-house Heidelberg presses, and express same-day UAE delivery. Select any digital print discipline to inquire directly on WhatsApp.
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF65] hover:text-[#F5F2EB] transition-colors shrink-0"
              >
                <span>Explore All Print Services</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>

          {/* 8 Digital Printing Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Card 1: Business Card Printing */}
            <Reveal delay={0.05}>
              <div className="rounded-3xl border border-[#203357] bg-[#172644] text-[#F5F2EB] group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D4AF65] hover:shadow-xl transition-all duration-300 card-hover-lift hover-shimmer">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#0C1629] mb-4 border border-[#203357]">
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
                      <span className="rounded-full bg-[#0F172A] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
                        Flagship Craft
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg bg-[#101D35]/90 border border-[#203357] px-2 py-0.5 text-[10px] font-bold text-[#F5F2EB] backdrop-blur-xs shadow-xs">
                        Same-Day / 24h
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">
                      <Link to="/business-card-printing-dubai" className="hover:underline">
                        Business Card Printing
                      </Link>
                    </h3>
                    <p className="text-xs text-[#B0BECE] leading-relaxed">
                      Executive 350–600 GSM Italian cotton &amp; silk artboard. 24K hot gold foil, velvet soft-touch, 3D spot UV &amp; gilded painted edges.
                    </p>
                    <ul className="pt-2 border-t border-[#203357] space-y-1 text-[11px] font-medium text-[#A0AEC0]">
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

                <div className="mt-5 pt-4 border-t border-[#203357] space-y-2">
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
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-[#A0AEC0] hover:text-[#D4AF65] py-1 transition-colors"
                  >
                    <span>View All Card Finishes</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Card 2: Flyer Printing */}
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-[#203357] bg-[#172644] text-[#F5F2EB] group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D4AF65] hover:shadow-xl transition-all duration-300 card-hover-lift hover-shimmer">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#0C1629] mb-4 border border-[#203357]">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="/assets/products/flyers/flyer-a5-promotional.webp"
                      />
                      <img
                        src="/assets/products/flyers.jpg"
                        alt="Flyer and Leaflet Printing Dubai"
                        width="400"
                        height="300"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-full bg-[#0F172A] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
                        Promotional Print
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg bg-[#101D35]/90 border border-[#203357] px-2 py-0.5 text-[10px] font-bold text-[#F5F2EB] backdrop-blur-xs shadow-xs">
                        Same-Day / 4h
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">
                      <Link to="/categories/flyers-printing-in-dubai" className="hover:underline focus:outline-none">
                        Flyer &amp; Leaflet Printing
                      </Link>
                    </h3>
                    <p className="text-xs text-[#B0BECE] leading-relaxed">
                      High-impact commercial marketing flyers, folded leaflets, and promotional handbills on premium 130–350 GSM gloss or silk paper.
                    </p>
                    <ul className="pt-2 border-t border-[#203357] space-y-1 text-[11px] font-medium text-[#A0AEC0]">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>A6, A5, A4 &amp; DL Slim Formats</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>130gsm to 350gsm Gloss, Matte &amp; Silk</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Single &amp; Double-Sided High-Def CMYK</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#203357] space-y-2">
                  <a
                    href={getServiceWhatsAppUrl('flyers')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackWhatsAppClick({
                        source_page: '/',
                        service_name: 'flyers',
                        button_location: 'homepage_service_cards',
                        label: 'flyer_whatsapp_inquiry',
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                  <Link
                    to="/categories/flyers-printing-in-dubai"
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-[#A0AEC0] hover:text-[#D4AF65] py-1 transition-colors"
                  >
                    <span>View Flyer Options</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Card 3: Letterhead Printing */}
            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-[#203357] bg-[#172644] text-[#F5F2EB] group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D4AF65] hover:shadow-xl transition-all duration-300 card-hover-lift hover-shimmer">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#0C1629] mb-4 border border-[#203357]">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="/assets/products/stationery/stationery-executive-letterheads.webp"
                      />
                      <img
                        src="/assets/products/letterhead_executive_120gsm.jpg"
                        alt="Official Letterhead Printing Dubai"
                        width="400"
                        height="300"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-full bg-[#0F172A] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
                        Corporate Prestige
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg bg-[#101D35]/90 border border-[#203357] px-2 py-0.5 text-[10px] font-bold text-[#F5F2EB] backdrop-blur-xs shadow-xs">
                        Same-Day / 24h
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">
                      Letterhead Printing
                    </h3>
                    <p className="text-xs text-[#B0BECE] leading-relaxed">
                      Official corporate letterheads on 100–120 GSM laser-guaranteed smooth bond, textured linen, royal laid cotton, and metallic foil stamping.
                    </p>
                    <ul className="pt-2 border-t border-[#203357] space-y-1 text-[11px] font-medium text-[#A0AEC0]">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>100gsm &amp; 120gsm Laser-Safe Uncoated Stocks</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Prestige Textured Linen &amp; Cotton Artboard</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Metallic 24K Gold/Silver Foil Letterheads</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#203357] space-y-2">
                  <a
                    href={getServiceWhatsAppUrl('letterheads')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackWhatsAppClick({
                        source_page: '/',
                        service_name: 'letterheads',
                        button_location: 'homepage_service_cards',
                        label: 'letterhead_whatsapp_inquiry',
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                  <Link
                    to="/products/executive-letterheads-120gsm"
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-[#A0AEC0] hover:text-[#D4AF65] py-1 transition-colors"
                  >
                    <span>View Letterhead Options</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Card 4: Brochure Printing */}
            <Reveal delay={0.2}>
              <div className="rounded-3xl border border-[#203357] bg-[#172644] text-[#F5F2EB] group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D4AF65] hover:shadow-xl transition-all duration-300 card-hover-lift hover-shimmer">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#0C1629] mb-4 border border-[#203357]">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="/assets/products/brochure_bifold.jpg"
                      />
                      <img
                        src="/assets/products/brochure_bifold.jpg"
                        alt="Brochure and Booklet Printing Dubai"
                        width="400"
                        height="300"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-full bg-[#0F172A] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
                        Multi-Page Catalog
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg bg-[#101D35]/90 border border-[#203357] px-2 py-0.5 text-[10px] font-bold text-[#F5F2EB] backdrop-blur-xs shadow-xs">
                        24-48h Express
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">
                      Brochure &amp; Catalog Printing
                    </h3>
                    <p className="text-xs text-[#B0BECE] leading-relaxed">
                      Luxury bi-fold, tri-fold, gate-fold, and saddle-stitched product catalogs with velvet soft-touch lamination and precision fold scoring.
                    </p>
                    <ul className="pt-2 border-t border-[#203357] space-y-1 text-[11px] font-medium text-[#A0AEC0]">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Bi-Fold, Tri-Fold, Gate-Fold &amp; Saddle Stitch</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>170gsm to 300gsm Silk Art Paper &amp; Covers</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Velvet Soft-Touch &amp; Spot Gloss UV Coating</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#203357] space-y-2">
                  <a
                    href={getServiceWhatsAppUrl('brochures')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackWhatsAppClick({
                        source_page: '/',
                        service_name: 'brochures',
                        button_location: 'homepage_service_cards',
                        label: 'brochure_whatsapp_inquiry',
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                  <Link
                    to="/services/brochures-printing"
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-[#A0AEC0] hover:text-[#D4AF65] py-1 transition-colors"
                  >
                    <span>View Brochure Options</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Card 5: Envelope Printing */}
            <Reveal delay={0.05}>
              <div className="rounded-3xl border border-[#203357] bg-[#172644] text-[#F5F2EB] group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D4AF65] hover:shadow-xl transition-all duration-300 card-hover-lift hover-shimmer">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#0C1629] mb-4 border border-[#203357]">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="/assets/products/stationery/stationery-corporate-envelopes.webp"
                      />
                      <img
                        src="/assets/products/letterhead_envelopes_suite.jpg"
                        alt="Custom Envelope Printing Dubai"
                        width="400"
                        height="300"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-full bg-[#0F172A] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
                        Official Correspondence
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg bg-[#101D35]/90 border border-[#203357] px-2 py-0.5 text-[10px] font-bold text-[#F5F2EB] backdrop-blur-xs shadow-xs">
                        Same-Day Ready
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">
                      Envelope Printing
                    </h3>
                    <p className="text-xs text-[#B0BECE] leading-relaxed">
                      Corporate branded business envelopes with secure peel-and-seal adhesive strips in standard DL, C5, and C4 business mailing formats.
                    </p>
                    <ul className="pt-2 border-t border-[#203357] space-y-1 text-[11px] font-medium text-[#A0AEC0]">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>DL (Window / Non-Window), C5 &amp; C4 Sizes</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>100gsm &amp; 120gsm Peel &amp; Seal Self-Adhesive</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Full-Flap &amp; Spot Color Precision Branding</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#203357] space-y-2">
                  <a
                    href={getServiceWhatsAppUrl('envelopes')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackWhatsAppClick({
                        source_page: '/',
                        service_name: 'envelopes',
                        button_location: 'homepage_service_cards',
                        label: 'envelope_whatsapp_inquiry',
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                  <Link
                    to="/products/corporate-envelopes"
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-[#A0AEC0] hover:text-[#D4AF65] py-1 transition-colors"
                  >
                    <span>View Envelope Options</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Card 6: Custom Sticker & Label Printing */}
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-[#203357] bg-[#172644] text-[#F5F2EB] group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D4AF65] hover:shadow-xl transition-all duration-300 card-hover-lift hover-shimmer">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#0C1629] mb-4 border border-[#203357]">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="/assets/products/stickers.webp"
                      />
                      <img
                        src="/assets/products/stickers/die-cut-vinyl-stickers.jpg"
                        alt="Custom Sticker Printing Dubai"
                        width="400"
                        height="300"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-full bg-[#0F172A] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
                        Waterproof Die-Cut
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg bg-[#101D35]/90 border border-[#203357] px-2 py-0.5 text-[10px] font-bold text-[#F5F2EB] backdrop-blur-xs shadow-xs">
                        Same-Day
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">
                      Sticker &amp; Label Printing
                    </h3>
                    <p className="text-xs text-[#B0BECE] leading-relaxed">
                      Custom contour die-cut waterproof vinyl stickers, clear transparent decals, bottle labels, and eye-catching holographic finishes.
                    </p>
                    <ul className="pt-2 border-t border-[#203357] space-y-1 text-[11px] font-medium text-[#A0AEC0]">
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

                <div className="mt-5 pt-4 border-t border-[#203357] space-y-2">
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
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-[#A0AEC0] hover:text-[#D4AF65] py-1 transition-colors"
                  >
                    <span>View Sticker Options</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Card 7: Custom Stamp Printing */}
            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-[#203357] bg-[#172644] text-[#F5F2EB] group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D4AF65] hover:shadow-xl transition-all duration-300 card-hover-lift hover-shimmer">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#0C1629] mb-4 border border-[#203357]">
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
                      <span className="rounded-full bg-[#0F172A] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
                        Official Seal
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg bg-[#101D35]/90 border border-[#203357] px-2 py-0.5 text-[10px] font-bold text-[#F5F2EB] backdrop-blur-xs shadow-xs">
                        2h Express
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">
                      Custom Stamps &amp; Seals
                    </h3>
                    <p className="text-xs text-[#B0BECE] leading-relaxed">
                      Official corporate self-inking rubber stamps, portable pocket folding stamps, heavy-duty daters, and brass wax notary seals.
                    </p>
                    <ul className="pt-2 border-t border-[#203357] space-y-1 text-[11px] font-medium text-[#A0AEC0]">
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

                <div className="mt-5 pt-4 border-t border-[#203357] space-y-2">
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
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-[#A0AEC0] hover:text-[#D4AF65] py-1 transition-colors"
                  >
                    <span>View Stamp Options</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Card 8: Voucher & Coupon Printing */}
            <Reveal delay={0.2}>
              <div className="rounded-3xl border border-[#203357] bg-[#172644] text-[#F5F2EB] group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D4AF65] hover:shadow-xl transition-all duration-300 card-hover-lift hover-shimmer">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#0C1629] mb-4 border border-[#203357]">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="/assets/products/flyers/flyer-luxury-foil.webp"
                      />
                      <img
                        src="/assets/products/flyers/flyer-luxury-foil.jpg"
                        alt="Voucher and Gift Certificate Printing Dubai"
                        width="400"
                        height="300"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-full bg-[#0F172A] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
                        Security Numbered
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg bg-[#101D35]/90 border border-[#203357] px-2 py-0.5 text-[10px] font-bold text-[#F5F2EB] backdrop-blur-xs shadow-xs">
                        Same-Day / 24h
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">
                      Voucher &amp; Coupon Printing
                    </h3>
                    <p className="text-xs text-[#B0BECE] leading-relaxed">
                      Luxury retail gift vouchers, event ticket booklets, and discount coupons with sequential numbering, foil crests, and perforated stubs.
                    </p>
                    <ul className="pt-2 border-t border-[#203357] space-y-1 text-[11px] font-medium text-[#A0AEC0]">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Sequential Numbering &amp; Security Barcodes</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Micro-Perforated Tear-Off Stub Finishing</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>24K Gold/Silver Foil &amp; Velvet Cardstocks</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#203357] space-y-2">
                  <a
                    href={getServiceWhatsAppUrl('vouchers')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackWhatsAppClick({
                        source_page: '/',
                        service_name: 'vouchers',
                        button_location: 'homepage_service_cards',
                        label: 'voucher_whatsapp_inquiry',
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                  <Link
                    to="/products/luxury-gold-foil-flyers"
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-[#A0AEC0] hover:text-[#D4AF65] py-1 transition-colors"
                  >
                    <span>View Voucher Options</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>


        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2B. HORIZONTAL PRODUCT CAROUSEL                                           */}
      {/* ========================================================================= */}
      <HorizontalProductCarousel />

      {/* ========================================================================= */}
      {/* 3. LUXURY FINISHES SHOWCASE                                              */}
      {/* ========================================================================= */}
      <LuxuryFinishesShowcase />

      {/* ========================================================================= */}
      {/* 6. CAREFREE SHOPPING & PRODUCTION GUARANTEE                              */}
      {/* ========================================================================= */}
      <CarefreeShoppingSection />

      {/* ========================================================================= */}
      {/* 7. LIVE PRODUCTION SHOWCASE & PRODUCT MARQUEE                             */}
      {/* ========================================================================= */}
      <InfiniteProductMarquee />

      {/* ========================================================================= */}
      {/* 8. FEATURED PRODUCTS CATALOG                                             */}
      {/* ========================================================================= */}
      <section className="bg-[#101D35] py-16 sm:py-24 text-[#F5F2EB]">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">FEATURED COLLECTION</span>
              <h2 className="font-serif mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F2EB]">
                Trending Corporate Merchandise &amp; Print Products
              </h2>
              <p className="mt-1 max-w-xl text-sm text-[#B0BECE]">
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
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
      <section className="bg-[#0C1629] py-16 sm:py-24 text-[#F5F2EB]">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">
                SELECTED ATELIER WORK
              </span>
              <h2 className="font-serif mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F2EB]">
                Crafted in Dubai. Delivered Across the UAE.
              </h2>
              <p className="mt-1 max-w-xl text-sm text-[#B0BECE]">
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
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#203357] bg-[#172644] text-[#F5F2EB] shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF65] hover:shadow-xl">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0C1629]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-md bg-slate-900/90 border border-slate-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF65]">
                        {item.clientSector}
                      </span>
                      <h3 className="font-display mt-1 text-sm font-bold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-[#B0BECE] line-clamp-2">
                        {item.specs}
                      </p>
                    </div>
                    <div className="mt-4 border-t border-[#203357] pt-3">
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
      <section id="production-process" className="py-16 sm:py-24 bg-[#101D35] text-[#F5F2EB]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">THE ONPRINT ADVANTAGE</span>
            <h2 className="font-serif mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F2EB]">
              Why Leading UAE Enterprises Choose ONPRINT
            </h2>
            <p className="mt-2 text-sm text-[#B0BECE]">
              The benchmark in Heidelberg offset precision, tactile luxury finishing, and express UAE dispatch for corporations, luxury hotels, agencies, and government entities.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-[#203357] bg-[#172644] text-[#F5F2EB] p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF65] hover:shadow-xl hover:bg-[#203357]/40 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF65] font-display text-xs font-bold text-[#101D35] shadow-xs">
                    0{index + 1}
                  </div>
                  <h3 className="font-display mt-4 text-base font-bold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">{item.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#B0BECE]">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Process Steps */}
          <div className="mt-16 pt-12 border-t border-[#203357]">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">DISCIPLINED WORKFLOW</span>
              <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#F5F2EB] mt-1">
                Our 5-Step Production Pipeline
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {processSteps.map((item, idx) => (
                <Reveal key={item.step} delay={idx * 0.08}>
                  <div className="rounded-2xl border border-[#203357] bg-[#172644] text-[#F5F2EB] p-5 h-full card-hover-lift hover-shimmer shadow-xs hover:border-[#D4AF65]">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#101D35] border border-[#203357] text-[#D4AF65] text-xs font-bold shadow-2xs">
                      {item.step}
                    </span>
                    <h4 className="font-bold text-sm text-[#F5F2EB] mt-3">{item.title}</h4>
                    <p className="mt-1 text-xs text-[#B0BECE] leading-relaxed">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

            {/* ========================================================================= */}
      {/* 10B. CLIENT TESTIMONIALS & CORPORATE TRUST                                */}
      {/* ========================================================================= */}
      <section className="bg-[#101D35] py-16 sm:py-24 border-t border-[#203357] text-[#F5F2EB] relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#D4AF65]/10 blur-3xl -z-10" aria-hidden="true" />
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">
              VERIFIED CORPORATE REPUTATION
            </span>
            <h2 className="font-serif mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F2EB]">
              Trusted by Leading Dubai Enterprises &amp; Agencies
            </h2>
            <p className="mt-2 text-sm text-[#B0BECE]">
              Real-world feedback from corporate procurement heads, marketing directors, and business founders across the UAE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'The 600 GSM cotton business cards with 24K mirror gold foil debossing set our firm apart at investor meetings. Delivered right to our DIFC office within 24 hours.',
                author: 'Tariq Al-Hashemi',
                role: 'Managing Partner',
                company: 'DIFC Wealth Advisory',
                service: 'Executive Business Cards',
              },
              {
                quote: 'Printed 8 roll-up exhibition banners and backdrops for our trade booth at DWTC. Zero edge curl, calibrated Pantone color matching, and heavy-duty aluminium stands.',
                author: 'Sarah Jenkins',
                role: 'Brand & Events Director',
                company: 'Dubai Media City Agency',
                service: 'Exhibition Roll-Up Banners',
              },
              {
                quote: 'Our bilingual company stamps and waterproof product roll-labels arrived same-day with perfect Arabic calligraphy registration. Best print partner in Al Quoz.',
                author: 'Karim Mansour',
                role: 'Operations Lead',
                company: 'Business Bay Trading LLC',
                service: 'Official Stamps & Labels',
              },
            ].map((t, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div className="h-full flex flex-col justify-between rounded-3xl border border-[#203357] bg-[#172644] p-6 sm:p-7 shadow-md hover:border-[#D4AF65] transition-all group">
                  <div>
                    <div className="flex items-center gap-1 text-[#D4AF65] mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#D4AF65]" />
                      ))}
                    </div>
                    <p className="text-sm text-[#F5F2EB] leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#203357] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#F5F2EB]">{t.author}</h4>
                      <p className="text-xs text-[#B0BECE]">{t.role} • {t.company}</p>
                    </div>
                    <span className="rounded-full bg-[#101D35] border border-[#203357] px-2.5 py-1 text-[10px] font-bold text-[#D4AF65]">
                      {t.service}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

{/* ========================================================================= */}
      {/* 11. BLOG ARTICLES / GUIDES                                               */}
      {/* ========================================================================= */}
      {blogs && blogs.length > 0 && (
        <section className="bg-[#0C1629] py-16 sm:py-24 text-[#F5F2EB]">
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end mb-10">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">
                  PRINTING KNOWLEDGE &amp; INSIGHTS
                </span>
                <h2 className="font-serif mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F2EB]">
                  Commercial Printing &amp; Luxury Branding Guides
                </h2>
                <p className="mt-1 max-w-xl text-sm text-[#B0BECE]">
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
                  <article className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#203357] bg-[#172644] text-[#F5F2EB] p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF65] hover:shadow-xl">
                    <div>
                      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-[#0C1629]">
                        <img
                          src={getBlogCoverImage(blog)}
                          alt={blog.image_alt || blog.imageAlt || blog.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = '/assets/products/service_corporate_gifts.jpg'
                          }}
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[11px] font-semibold text-[#B0BECE]">
                        <span className="rounded-full bg-[#101D35] border border-[#203357] px-2.5 py-0.5 text-[#D4AF65] uppercase tracking-wider">
                          {blog.category || 'Printing Guide'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {blog.reading_time || blog.readTime || '4 min read'}
                        </span>
                      </div>

                      <h3 className="font-display mt-2.5 text-base font-bold text-[#F5F2EB] hover:text-[#D4AF65] transition-colors">
                        <Link to={`/blog/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-[#B0BECE] line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 border-t border-[#203357] pt-3">
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
      {/* 13. BOTTOM CONVERSION CALL TO ACTION                                      */}
      {/* ========================================================================= */}
      <section className="bg-[#0C1629] py-16 sm:py-20 text-[#F5F2EB] relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#D4AF65]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#D4AF65]/10 blur-3xl" />

        <Container className="relative z-10 flex flex-col items-center gap-6 text-center max-w-4xl">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#D4AF65] bg-[#D4AF65]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF65] shrink-0" />
            <span>Dubai's Trusted Commercial &amp; Luxury Printing Partner</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to Start Your Print Project in Dubai?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            From presidential cotton business cards and event roll-up banners to waterproof product stickers and official company stamps, get immediate pricing and turnaround times directly from our Al Quoz pressroom.
          </p>

          {/* Quick Service Inquiry WhatsApp Chips */}
          <div className="w-full max-w-3xl pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-3">
              One-Click WhatsApp Inquiry by Service:
            </p>
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-5 gap-2.5">
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
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#203357] bg-[#172644] px-3 py-2.5 text-xs font-bold text-[#F5F2EB] shadow-xs hover:border-[#25D366] hover:bg-slate-800 hover:text-white transition-all group"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 fill-[#25D366] group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate">{svc.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto pt-3">
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
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-5 sm:px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-500/20 hover:-translate-y-0.5 transition-all group cursor-pointer text-center leading-snug"
            >
              <WhatsAppIcon className="h-5 w-5 fill-current group-hover:scale-110 transition-transform shrink-0" />
              <span>Get a Quote on WhatsApp ({FORMATTED_PHONE})</span>
            </a>
            <Button
              to="/get-a-quote"
              variant="accent"
              size="lg"
              className="!rounded-full !bg-[#D4AF65] hover:!bg-[#D4AF65] shadow-lg shadow-[#D4AF65]/25 text-center justify-center font-black !py-3.5 !px-5 sm:!px-8 !text-[#0F172A]"
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
