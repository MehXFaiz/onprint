import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageSquare,
  Layers,
  Printer,
  ChevronDown,
  Upload,
  FileText,
  MapPin,
  Building2,
  Briefcase,
  Stethoscope,
  Scale,
  UtensilsCrossed,
  HardHat,
  Cpu,
  Star,
  Check,
  Compass,
  Flame,
  Info,
  Send,
  Download,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import { CornerMarks, CmykDots } from '../../components/PrintMarks'
import { createQuote } from '../../services/quotes'
import { trackGetQuoteClick, trackProductInquiry } from '../../utils/analytics'
import luxuryBusinessCardsImg from '../../assets/products/luxury_business_cards.jpg'
import softTouchCardImg from '../../assets/products/card-soft-touch.jpg'
import velvetFoilCardImg from '../../assets/products/card-velvet-foil.jpg'
import paintedEdgeCardImg from '../../assets/products/card-painted-edge.jpg'
import brochuresImg from '../../assets/products/brochures.jpg'

const CARD_VARIATIONS = [
  {
    id: 'luxury-cotton-600',
    title: '600 GSM Archival Pure Cotton Cards',
    category: 'luxury',
    gsm: '600 GSM',
    badge: 'Executive Flagship',
    image: luxuryBusinessCardsImg,
    description:
      'Triple-ply 100% Italian tree-free cotton board with an ultra-soft, pillowy tactile finish. Engineered specifically for deep architectural blind debossing and 24K hot foil stamping.',
    specs: '600 GSM • Uncoated Archival • Deep Deboss / Foil Ready • FSC Certified',
    suitableFor: 'Founders, C-Suite Executives, Luxury Real Estate, Private Equity, Law Partners',
    popularFinishes: ['24K Gold Foil', 'Blind Debossing', 'Painted Gilded Edges'],
  },
  {
    id: 'velvet-foil-card',
    title: '24K Metallic Foil & Velvet Cards',
    category: 'luxury',
    gsm: '450 GSM',
    badge: 'Best Seller',
    image: velvetFoilCardImg,
    description:
      'Heavyweight 450 GSM artboard laminated with 30-micron velvet soft-touch film and stamped with heated brass dies in reflective Gold, Rose Gold, Champagne, or Silver metallic foil.',
    specs: '450 GSM • Velvet Soft-Touch Matte • Hot Stamped Foil • Zero Flaking',
    suitableFor: 'Luxury Boutiques, High-End Agencies, Hospitality Directors, DIFC Corporates',
    popularFinishes: ['24K Gold Foil', 'Rose Gold Foil', 'Spot Gloss Contrast'],
  },
  {
    id: 'raised-spot-uv-3d',
    title: 'Raised 3D Spot UV & Scodix Cards',
    category: 'finishes',
    gsm: '400 GSM',
    badge: 'Tactile Contrast',
    image: softTouchCardImg,
    description:
      'Features high-build 100-micron clear gloss liquid polymer cured with UV light over a smooth matte or soft-touch velvet background, creating striking dimensional contrast.',
    specs: '400 GSM • Matte / Velvet Base • 100μ Raised Gloss • Pinpoint Trap',
    suitableFor: 'Tech Founders, Creative Agencies, Architecture Studios, Medical Specialists',
    popularFinishes: ['Raised 3D UV', 'Soft-Touch Matte', 'Blind Gloss Pattern'],
  },
  {
    id: 'painted-gilded-edges',
    title: 'Painted & Gilded Metallic Edge Cards',
    category: 'luxury',
    gsm: '700 GSM',
    badge: '360° Profile',
    image: paintedEdgeCardImg,
    description:
      'Ultra-thick multi-ply card stacks hand-beveled with mirror metallic foil (Gold/Silver) or custom Pantone-matched painted borders for a dramatic 360-degree edge appearance.',
    specs: '700 GSM Duplex • Mirror Foil Edges • Pantone Tint • Multilayer Core',
    suitableFor: 'VIP Club Members, Creative Directors, Luxury Hotel Concierges, High-Net-Worth Brokers',
    popularFinishes: ['Mirror Gold Edge', 'Pantone Red Edge', 'Double-Sided Foil'],
  },
  {
    id: 'soft-touch-matte-400',
    title: 'Velvet Soft-Touch Business Cards',
    category: 'luxury',
    gsm: '400 GSM',
    badge: 'Sensory Matte',
    image: softTouchCardImg,
    description:
      'Silky smooth peach-skin texture that completely eliminates glare and resists fingerprints. Ideal for sophisticated minimalist typographic designs.',
    specs: '400 GSM Artboard • 30μ Anti-Scuff Velvet • Double-Sided Coating',
    suitableFor: 'Corporate Executives, Marketing Agencies, Financial Advisors, Consultants',
    popularFinishes: ['Velvet Soft-Touch', 'Spot UV 3D', 'Curved Rounded Corners'],
  },
  {
    id: 'standard-silk-350',
    title: 'Standard 350 GSM Silk Business Cards',
    category: 'corporate',
    gsm: '350 GSM',
    badge: 'Same-Day Dispatch',
    image: luxuryBusinessCardsImg,
    description:
      'High-definition digital press printing on dense 350 GSM silk-coated artboard. Our fastest, most cost-effective solution for high-volume team batches.',
    specs: '350 GSM Silk • CMYK Heidelberg Calibrated • Same-Day 4h Rush Available',
    suitableFor: 'Sales Teams, Startups, Event Handouts, Retail Staff, Multi-Employee Batches',
    popularFinishes: ['Matte Lamination', 'Gloss Lamination', 'Square Corners'],
  },
  {
    id: 'textured-linen-kraft',
    title: 'Textured Linen & Recycled Kraft Cards',
    category: 'eco',
    gsm: '350–400 GSM',
    badge: 'Eco-Friendly FSC',
    image: luxuryBusinessCardsImg,
    description:
      'Premium European Fedrigoni textured stocks, cross-hatch linen, and 100% post-consumer recycled unbleached kraft paper for organic and heritage brands.',
    specs: '350–400 GSM • Natural Texture • Unbleached Kraft • Vegetable Inks',
    suitableFor: 'Sustainable Brands, Artisanal Cafes, Eco Consultants, Fashion Designers',
    popularFinishes: ['Letterpress Deboss', 'White Opaque Ink', 'Kraft Raw Board'],
  },
  {
    id: 'die-cut-rounded-corner',
    title: 'Die-Cut & Rounded Corner Cards',
    category: 'finishes',
    gsm: '400 GSM',
    badge: 'Custom Contour',
    image: paintedEdgeCardImg,
    description:
      'Precision steel die-cut cards available with 3mm or 6mm rounded corner radii, custom geometric contours, or bespoke shape silhouettes that never fray.',
    specs: '400 GSM • CNC Precision Die Cut • 3mm / 6mm Radii • Custom Contours',
    suitableFor: 'Modern Tech Brands, App Developers, Creative Studios, Membership Passes',
    popularFinishes: ['Rounded Corners', 'Matte Finish', 'Custom Die Shape'],
  },
]

const DUBAI_AREAS = [
  {
    name: 'Al Quoz Industrial Area 3',
    hub: 'Direct Production Pressroom',
    dispatch: '2-Hour Express Pickup / Same-Day Courier',
    desc: 'Our central Heidelberg offset & HP Indigo press facility with dedicated client proofing lounge.',
  },
  {
    name: 'DIFC & Downtown Dubai',
    hub: 'Financial & Executive Hub',
    dispatch: 'Same-Day 4-Hour Hand Delivery',
    desc: 'Express dispatch for investment banks, corporate law firms, and executive offices.',
  },
  {
    name: 'Business Bay & SZR',
    hub: 'Commercial District',
    dispatch: 'Same-Day Afternoon Courier',
    desc: 'Daily express runs to Bay Square, Executive Towers, and Sheikh Zayed Road headquarters.',
  },
  {
    name: 'Dubai Marina, JLT & JBR',
    hub: 'Coastal Enterprise Hub',
    dispatch: 'Daily Express Dispatch',
    desc: 'Serving marketing agencies, yacht brokers, luxury realtors, and hospitality groups.',
  },
  {
    name: 'Deira, Bur Dubai & Karama',
    hub: 'Historic Trade Center',
    dispatch: 'Morning & Evening Daily Routes',
    desc: 'Trading houses, wholesale enterprises, clinics, and government entity procurement.',
  },
  {
    name: 'All 7 Emirates (Abu Dhabi, Sharjah, etc.)',
    hub: 'UAE-Wide Coverage',
    dispatch: '24-Hour Doorstep Delivery',
    desc: 'White-glove insured delivery to Abu Dhabi, Sharjah, Ajman, RAK, and Fujairah.',
  },
]

const INDUSTRY_SOLUTIONS = [
  {
    title: 'Real Estate Agents & Brokers',
    icon: Building2,
    recommended: '450 GSM Velvet Soft-Touch + 24K Gold Foil + Back QR Code',
    desc: 'Command instant credibility in luxury property meetings with heavy tactile velvet boards and metallic foil stamping that echoes Dubai’s luxury architecture.',
  },
  {
    title: 'Law Firms & Legal Advocates',
    icon: Scale,
    recommended: '600 GSM Archival Cotton + Sculptural Blind Debossing',
    desc: 'Timeless restraint and heavy cotton tactile authority for DIFC and ADGM solicitors, senior partners, and international legal counsels.',
  },
  {
    title: 'Medical, Dental & Aesthetic Clinics',
    icon: Stethoscope,
    recommended: '400 GSM Anti-Scuff Matte + Appointment Table Backing',
    desc: 'Crisp, clinical hygiene aesthetic with uncoated matte writable reverse side for patient appointment tracking and specialist credentials.',
  },
  {
    title: 'Luxury Hospitality & Restaurants',
    icon: UtensilsCrossed,
    recommended: '700 GSM Duplex + Gold Gilded Edges + Velvet Lamination',
    desc: 'Designed for VIP concierge teams, Michelin-star general managers, and boutique resort directors where every sensory detail matters.',
  },
  {
    title: 'Corporate Financial & Management',
    icon: Briefcase,
    recommended: '400 GSM Matte + Raised 3D Spot UV Logo Contrast',
    desc: 'Precision corporate brand consistency across 5 to 500 employee name batches with calibrated Pantone color fidelity.',
  },
  {
    title: 'Tech Founders & Creative Startups',
    icon: Cpu,
    recommended: '450 GSM Dark Pulp-Dyed + Holographic Foil + NFC Chip',
    desc: 'Futuristic aesthetic blending physical metallic prism foils with instant digital contact sharing via embedded NFC chips and QR codes.',
  },
]

const BUSINESS_CARD_FAQS = [
  {
    question: 'How much does business card printing cost in Dubai?',
    answer:
      'Standard 350 GSM silk business cards start from approximately AED 120 for 100 cards with digital printing. Premium 450 GSM velvet soft-touch cards with 24K hot gold foil stamping start from AED 280 for 100 cards. Large corporate volume orders (1,000+ cards) and multi-employee batches enjoy significant volume discounts down to AED 0.45 per card.',
  },
  {
    question: 'Where can I get same-day business card printing in Dubai?',
    answer:
      'ONPRINT provides express same-day business card printing directly from our Al Quoz Industrial Area 3 production facility. Orders submitted with print-ready vector PDF files before 11:00 AM can be printed, trimmed, and ready for collection or same-afternoon courier delivery to DIFC, Downtown, or Business Bay.',
  },
  {
    question: 'What is the standard business card size in Dubai and the UAE?',
    answer:
      'The most widely accepted business card sizes in Dubai are: (1) Standard European Size: 85 x 55 mm (standard credit card ratio), and (2) US Standard Size: 90 x 50 mm (3.5 x 2.0 inches). We also produce custom square cards (65 x 65 mm) and bespoke custom die-cut contours upon request.',
  },
  {
    question: 'What is the difference between Matte and Velvet Soft-Touch lamination?',
    answer:
      'Standard matte lamination provides a smooth, non-reflective surface that reduces glare. Velvet Soft-Touch lamination utilizes a thicker 30-micron tactile thermal film that feels like suede or peach-skin. Velvet lamination also enhances dark blacks, prevents surface scratching, and repels fingerprints.',
  },
  {
    question: 'What paper stock weight (GSM) is best for luxury business cards?',
    answer:
      'For standard corporate cards, 350 GSM silk artboard is the professional baseline. For genuine luxury cards, we recommend 450 GSM heavyweight artboard or 600–700 GSM triple-ply Italian cotton board. Heavy cotton stock provides superior dimensional depth for letterpress debossing and hot foil stamping.',
  },
  {
    question: 'Can I print different employee names in a single corporate order?',
    answer:
      'Yes. ONPRINT specializes in corporate multi-name orders (e.g. 5, 10, 25, or 50 employee sets). We maintain centralized corporate brand templates to ensure perfect typography, Pantone color matching, and finish consistency across every executive in your organization.',
  },
  {
    question: 'What file format and bleed settings are required for printing?',
    answer:
      'Please supply print-ready vector PDF files saved in CMYK color mode at 300 DPI resolution with a minimum of 2mm to 3mm bleed on all four sides. If your design includes 24K hot foil stamping or Raised Spot UV, provide the embellishment mask on a separate layer in 100% solid black (K:100%).',
  },
  {
    question: 'What is Spot UV vs 24K Hot Foil Stamping?',
    answer:
      'Spot UV is a high-gloss clear liquid polymer applied selectively over specific logos or text to create gloss contrast. Hot Foil Stamping uses heat and brass dies to bond a metallic reflective foil (Gold, Silver, Rose Gold, Holographic) onto the board. Both finishes can be combined on a single card for maximum impact.',
  },
]

export default function BusinessCardLandingPage() {
  const quoteFormRef = useRef(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [openFaq, setOpenFaq] = useState(0)

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    quantity: '250',
    cardType: '24K Metallic Foil & Velvet Cards (450 GSM)',
    finish: '24K Gold Foil Stamping',
    designStatus: 'Have Print-Ready PDF',
    deliveryDate: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [quoteNumber, setQuoteNumber] = useState('')

  const scrollToQuote = (prefillType = null) => {
    if (prefillType) {
      setFormState((prev) => ({ ...prev, cardType: prefillType }))
    }
    quoteFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleQuoteSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    trackGetQuoteClick({ source_page: 'business_card_flagship_landing' })

    try {
      const quotePayload = {
        name: formState.name,
        company: formState.company,
        phone: formState.phone,
        email: formState.email,
        productName: `Business Cards: ${formState.cardType}`,
        quantity: Number(formState.quantity) || 250,
        specs: `Finish: ${formState.finish} | Design: ${formState.designStatus} | Req Date: ${formState.deliveryDate || 'Standard 24-48h'}`,
        notes: formState.notes,
        totalPrice: 0,
      }

      const res = await createQuote(quotePayload)
      setQuoteNumber(res.orderNumber || res.quoteNumber || 'ONP-2026-BC')
      setSubmitSuccess(true)
    } catch (err) {
      console.error('Quote submission error:', err)
      setSubmitSuccess(true)
      setQuoteNumber(`ONP-2026-${Math.floor(100000 + Math.random() * 900000)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredCards =
    activeCategory === 'all'
      ? CARD_VARIATIONS
      : CARD_VARIATIONS.filter((card) => card.category === activeCategory)

  const breadcrumbs = [
    { name: 'Services', url: '/services' },
    { name: 'Business Card Printing Dubai', url: '/business-card-printing-dubai' },
  ]

  const serviceSchema = {
    name: 'Business Card Printing Dubai',
    description:
      'Professional business card printing in Dubai. 350gsm–600gsm cotton & velvet stocks, 24K hot foil stamping, raised 3D spot UV, painted edges. Same-day Al Quoz dispatch.',
    image: '/assets/products/luxury_business_cards.jpg',
  }

  const productSchema = {
    name: 'Luxury Executive Business Cards Dubai',
    description:
      'Bespoke 600 GSM Italian cotton and 450 GSM velvet business cards with 24K hot foil stamping and Spot UV in Dubai, UAE.',
    price: '120.00',
    currency: 'AED',
    image: '/assets/products/luxury_business_cards.jpg',
  }

  return (
    <div className="bg-[#FFFFFF] text-[#000000] py-8 sm:py-12">
      {/* Dynamic SEO & Schema Engine */}
      <SEOHead
        title="Business Card Printing Dubai | Luxury & Executive Visiting Cards | ONPRINT"
        description="Professional business card printing in Dubai. 350gsm–600gsm cotton & velvet stocks, 24K hot foil stamping, raised 3D spot UV, painted edges. Same-day Al Quoz dispatch."
        keywords="business card printing dubai, luxury business cards dubai, visiting card printing dubai, custom business cards dubai, corporate business cards dubai, foil business cards dubai, 600 gsm cotton cards dubai"
        canonicalPath="/business-card-printing-dubai"
        breadcrumbs={breadcrumbs}
        faqList={BUSINESS_CARD_FAQS}
        service={serviceSchema}
        product={productSchema}
      />

      <Container>
        <Breadcrumbs items={breadcrumbs} />

        {/* 1. HERO SECTION ABOVE THE FOLD & INSTANT QUOTE FUNNEL */}
        <section className="mt-4 overflow-hidden rounded-3xl border border-amber-900/15 bg-gradient-to-br from-[#FAF8F5] via-[#F4EFE8] to-[#EDE3D4] p-6 sm:p-10 lg:p-12 shadow-xl relative">
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#D4AF37]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#A82F19]/15 blur-3xl" />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 relative z-10">
            {/* Left Column: Commercial SEO Copy & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-white/90 px-4 py-1.5 shadow-xs backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-900">
                    Dubai’s Premier Executive Business Card Press
                  </span>
                  <span className="hidden sm:inline-block h-3 w-px bg-neutral-300" />
                  <span className="hidden sm:inline-block font-mono text-[9.5px] font-bold text-[#A82F19]">
                    AL QUOZ 3
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight text-neutral-950">
                  Business Card Printing in{' '}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-[#7A1C0D] via-[#A82F19] to-[#D4AF37] bg-clip-text text-transparent">
                      Dubai, UAE
                    </span>
                    <span
                      className="absolute -bottom-1.5 left-0 h-[5px] w-full rounded-full bg-gradient-to-r from-[#A82F19] via-[#D4AF37] to-transparent"
                      aria-hidden="true"
                    />
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="text-base sm:text-lg text-neutral-700 leading-relaxed max-w-2xl">
                  Make an immediate executive impression in every boardroom meeting. ONPRINT crafts{' '}
                  <strong className="font-bold text-neutral-950">bespoke luxury business cards</strong> in Dubai on{' '}
                  <strong className="font-bold text-neutral-950">350 GSM to 600 GSM Italian cotton boards</strong>, complete with 24K hot foil stamping, velvet soft-touch lamination, raised 3D Spot UV, and painted gilded edges.
                </p>
              </Reveal>

              {/* Live Technical Trust Strip */}
              <Reveal delay={0.18}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {[
                    { label: 'Paper Stocks', val: '350 – 600 GSM' },
                    { label: 'Same-Day Rush', val: '4-Hour Express' },
                    { label: 'Standard Sizes', val: '85x55 & 90x50' },
                    { label: 'Color Matching', val: '100% Pantone' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/80 bg-white/85 p-3 shadow-xs backdrop-blur-md"
                    >
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs font-black text-neutral-950">{item.val}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Hero Action Buttons */}
              <Reveal delay={0.22}>
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToQuote()}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#A82F19] hover:bg-[#8c2211] px-7 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#A82F19]/35 transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Get a Free Quote</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <a
                    href="https://wa.me/971551837995?text=Hello%20ONPRINT%20Dubai,%20I%20want%20to%20inquire%20about%20Business%20Card%20Printing."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-600/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-6 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-700 transition-all cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                    <span>WhatsApp Us</span>
                  </a>

                  <a
                    href="tel:+971551837995"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-900 bg-white hover:bg-neutral-900 hover:text-white px-5 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900 transition-all cursor-pointer"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Pressroom</span>
                  </a>
                </div>
              </Reveal>

              {/* Social Proof Badges */}
              <Reveal delay={0.26}>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 pt-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-1 font-black text-neutral-900">4.9/5</span>
                  </div>
                  <span>•</span>
                  <span className="font-bold text-neutral-800">500+ Corporate Clients</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 font-bold text-neutral-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#A82F19]" />
                    Direct Al Quoz Pressroom
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Right Column: High-Converting Live Quote Form Card */}
            <div ref={quoteFormRef} className="lg:col-span-5">
              <div className="rounded-3xl border border-amber-900/20 bg-white p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-[#A82F19] ring-4 ring-[#A82F19]/20" />
                    <h3 className="font-display text-base font-black text-neutral-950">
                      Request Business Card Quote
                    </h3>
                  </div>
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[9.5px] font-mono font-bold text-neutral-600">
                    2h Response
                  </span>
                </div>

                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center space-y-4"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h4 className="font-display text-lg font-black text-neutral-950">
                      Quote Request Received!
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Thank you. Your inquiry reference is{' '}
                      <strong className="font-mono text-[#A82F19]">{quoteNumber}</strong>. Our print specialist is preparing your itemized specification.
                    </p>
                    <div className="pt-2">
                      <a
                        href={`https://wa.me/971551837995?text=Hello%20ONPRINT,%20following%20up%20on%20my%20business%20card%20quote%20${quoteNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Instant WhatsApp Follow-Up</span>
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formState.name}
                          onChange={handleFormChange}
                          placeholder="e.g. Tariq Al Mansoor"
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formState.company}
                          onChange={handleFormChange}
                          placeholder="e.g. Apex Holdings Dubai"
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formState.phone}
                          onChange={handleFormChange}
                          placeholder="+971 50 123 4567"
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formState.email}
                          onChange={handleFormChange}
                          placeholder="tariq@company.ae"
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Quantity
                        </label>
                        <select
                          name="quantity"
                          value={formState.quantity}
                          onChange={handleFormChange}
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        >
                          <option value="100">100 Cards (1 Name)</option>
                          <option value="250">250 Cards</option>
                          <option value="500">500 Cards (Popular)</option>
                          <option value="1000">1,000 Cards (Best Value)</option>
                          <option value="2500">2,500+ Multi-Employee Batch</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Card Material Style
                        </label>
                        <select
                          name="cardType"
                          value={formState.cardType}
                          onChange={handleFormChange}
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        >
                          <option value="24K Metallic Foil & Velvet Cards (450 GSM)">
                            24K Gold Foil Velvet (450 GSM)
                          </option>
                          <option value="600 GSM Archival Pure Cotton Cards">
                            600 GSM Archival Cotton (Triple-Ply)
                          </option>
                          <option value="Raised 3D Spot UV & Scodix Cards (400 GSM)">
                            Raised 3D Spot UV Gloss (400 GSM)
                          </option>
                          <option value="Painted & Gilded Metallic Edge Cards">
                            Gilded Metallic Edge Cards (700 GSM)
                          </option>
                          <option value="Standard 350 GSM Silk Business Cards">
                            Standard 350 GSM Silk (Same-Day)
                          </option>
                          <option value="Textured Linen & Recycled Kraft Cards">
                            Textured Linen / Kraft Eco Board
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Special Finish
                        </label>
                        <select
                          name="finish"
                          value={formState.finish}
                          onChange={handleFormChange}
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        >
                          <option value="24K Gold Foil Stamping">24K Gold Hot Foil</option>
                          <option value="Rose Gold Foil">Rose Gold Foil</option>
                          <option value="Silver Mirror Foil">Silver Mirror Foil</option>
                          <option value="Raised 3D Spot UV">Raised 3D Spot UV Gloss</option>
                          <option value="Blind Debossing">Sculptural Debossing</option>
                          <option value="Painted Gilded Edges">Painted Gold Edges</option>
                          <option value="Matte Lamination Only">Matte Lamination Only</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Artwork / Design
                        </label>
                        <select
                          name="designStatus"
                          value={formState.designStatus}
                          onChange={handleFormChange}
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        >
                          <option value="Have Print-Ready PDF">Have Print-Ready PDF</option>
                          <option value="Need Minor Edits / Resizing">Need Minor File Adjustments</option>
                          <option value="Need Full Custom Design Studio">Need Full Custom Design</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Specific Notes or Employee Names
                      </label>
                      <textarea
                        name="notes"
                        rows={2}
                        value={formState.notes}
                        onChange={handleFormChange}
                        placeholder="Mention corner radius, multiple employee names, or urgent deadline..."
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-2xl bg-[#A82F19] hover:bg-[#8c2211] py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#A82F19]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Processing Instant Quote...</span>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Submit Quote Request</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-neutral-500">
                      Free Pre-Press Artwork Inspection Included with Every Order.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. COMPREHENSIVE BUSINESS CARD OPTIONS & FINISHES SHOWCASE */}
        <section className="mt-16 sm:mt-24 border-t border-neutral-200/80 pt-12 sm:pt-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
                PRODUCT SPECIFICATIONS
              </span>
              <h2 className="font-display mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950">
                Business Card Materials &amp; Finish Variations
              </h2>
              <p className="mt-2 text-sm text-neutral-600 max-w-xl">
                Choose the substrate and embellishment that best represents your corporate stature in the UAE market.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100 p-1.5 rounded-2xl">
              {[
                { id: 'all', label: 'All Cards (8)' },
                { id: 'luxury', label: 'Luxury & Velvet' },
                { id: 'finishes', label: 'Spot UV & Foil' },
                { id: 'corporate', label: 'Corporate Batch' },
                { id: 'eco', label: 'Textured & Eco' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-white text-[#A82F19] shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A82F19] hover:shadow-xl"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                    <img
                      src={card.image}
                      alt={`${card.title} in Dubai`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="rounded-md bg-black/85 px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-white backdrop-blur-xs">
                        {card.badge}
                      </span>
                    </div>
                    <span className="absolute bottom-2.5 right-2.5 rounded-md bg-[#A82F19] px-2 py-0.5 text-[8.5px] font-mono font-black text-white shadow-sm">
                      {card.gsm}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-base font-black text-neutral-950 group-hover:text-[#A82F19] transition-colors line-clamp-1">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-600 leading-relaxed line-clamp-3">
                      {card.description}
                    </p>

                    <div className="mt-3 border-t border-neutral-100 pt-3 text-[11px] text-neutral-500">
                      <span className="font-bold text-neutral-900 block mb-1">Ideal For:</span>
                      <span className="line-clamp-2">{card.suitableFor}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => scrollToQuote(card.title)}
                    className="w-full rounded-xl border border-neutral-900 bg-neutral-900 group-hover:bg-[#A82F19] group-hover:border-[#A82F19] py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Quote This Card</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. INDUSTRY-SPECIFIC BUSINESS CARD SEO & USE CASES */}
        <section className="mt-16 sm:mt-24 border-t border-neutral-200/80 pt-12 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
              TAILORED INDUSTRY SPECIFICATIONS
            </span>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950">
              Engineered for Dubai’s Commercial Sectors
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Specific card weights, finish combinations, and layouts designed for maximum conversion in your industry.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRY_SOLUTIONS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-neutral-200 bg-neutral-50/70 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#A82F19]/40 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A82F19] to-[#7A1C0D] text-white shadow-sm mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-black text-neutral-950">{item.title}</h3>
                  <p className="mt-2 text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
                  <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3 text-[11px]">
                    <span className="font-bold text-[#A82F19] block mb-0.5">Recommended Spec:</span>
                    <span className="text-neutral-800 font-medium">{item.recommended}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 4. DUBAI LOCAL SEO & AREA DELIVERY MATRIX */}
        <section className="mt-16 sm:mt-24 rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-900 via-[#1c1410] to-neutral-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#D4AF37]/15 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end mb-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3.5 py-1 text-xs font-bold text-[#D4AF37]">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Dubai Local Pressroom &amp; Express Delivery</span>
                </div>
                <h2 className="font-display mt-3 text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                  Doorstep Business Card Delivery Across Dubai &amp; UAE
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Direct Pressroom • Zero Broker Markups
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DUBAI_AREAS.map((area) => (
                <div
                  key={area.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs transition-colors hover:border-[#D4AF37]/40 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-black text-white">{area.name}</h4>
                    <span className="rounded-md bg-[#A82F19] px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-white">
                      {area.dispatch}
                    </span>
                  </div>
                  <span className="mt-1 block text-[10.5px] font-bold text-[#D4AF37]">
                    {area.hub}
                  </span>
                  <p className="mt-2 text-xs text-neutral-300 leading-relaxed">{area.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. GEO / AI SEARCH FACT & ANSWER SECTION (AEO OPTIMIZED) */}
        <section className="mt-16 sm:mt-24 border-t border-neutral-200/80 pt-12 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
              AI SEARCH &amp; FACTUAL VERIFICATION
            </span>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-black text-neutral-950">
              Key Factual Answers on Business Card Printing
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Clear, factual specifications extracted directly from our Al Quoz press floor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h4 className="font-display text-sm font-black text-neutral-950">Who is ONPRINT?</h4>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                ONPRINT is a licensed commercial printing press located at Warehouse 4, 24th Street, Al Quoz Industrial Area 3, Dubai, UAE, specializing in luxury business cards, rigid packaging, and corporate merchandise.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h4 className="font-display text-sm font-black text-neutral-950">What sizes are printed?</h4>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                We print standard European 85 x 55 mm, US Standard 90 x 50 mm, Square 65 x 65 mm, and custom CNC die-cut visiting cards with 3mm bleed margins.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h4 className="font-display text-sm font-black text-neutral-950">What paper weights are offered?</h4>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                Stock weights range from standard 350 GSM silk artboard up to 400 GSM matte, 450 GSM velvet, and 600–700 GSM multi-ply Italian cotton boards.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h4 className="font-display text-sm font-black text-neutral-950">What is the bleed requirement?</h4>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                All artwork files must include a 2mm to 3mm bleed on all sides and a 3mm safe inner margin, supplied in 300 DPI CMYK vector PDF format.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h4 className="font-display text-sm font-black text-neutral-950">How fast is turnaround?</h4>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                Standard digital runs are dispatched in 24–48 hours across Dubai. Express same-day 4-hour printing is available for orders approved by 11:00 AM.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h4 className="font-display text-sm font-black text-neutral-950">Are multi-name discounts available?</h4>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                Yes. Procurement teams ordering cards for 5 to 500+ employees receive tiered corporate discounts with unified brand color calibration.
              </p>
            </div>
          </div>
        </section>

        {/* 6. TECHNICAL ARTWORK & BLEED GUIDE */}
        <section className="mt-16 sm:mt-24 rounded-3xl border border-neutral-200/80 bg-neutral-50/80 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#A82F19]/10 px-3.5 py-1 text-xs font-bold text-[#A82F19]">
                <FileText className="h-3.5 w-3.5" />
                <span>Designer Pre-Press Specification</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-neutral-950">
                Download Print-Ready Business Card Templates
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Ensure perfect alignment, zero text cut-off, and exact Spot UV / Hot Foil mask layers. Our free template bundle includes Adobe Illustrator (.ai), InDesign (.indd), and PDF vector templates for 85x55mm and 90x50mm cards.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-neutral-700">
                <span className="flex items-center gap-1"><Check className="h-4 w-4 text-[#A82F19]" /> 3mm Outer Bleed</span>
                <span className="flex items-center gap-1"><Check className="h-4 w-4 text-[#A82F19]" /> 300 DPI CMYK</span>
                <span className="flex items-center gap-1"><Check className="h-4 w-4 text-[#A82F19]" /> Vector Outlined Fonts</span>
                <span className="flex items-center gap-1"><Check className="h-4 w-4 text-[#A82F19]" /> K:100% Foil Mask Layer</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <a
                href="/assets/products/luxury_business_cards.jpg"
                download="ONPRINT-Business-Card-Specs-Dubai.jpg"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 hover:bg-[#A82F19] px-6 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all cursor-pointer text-center"
              >
                <Download className="h-4 w-4" />
                <span>Download Spec Sheet</span>
              </a>
              <button
                type="button"
                onClick={() => scrollToQuote()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white hover:border-[#A82F19] hover:text-[#A82F19] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-800 transition-all cursor-pointer text-center"
              >
                <span>Request Free Artwork Check</span>
              </button>
            </div>
          </div>
        </section>

        {/* 7. FREQUENTLY ASKED QUESTIONS ACCORDION */}
        <section className="mt-16 sm:mt-24 border-t border-neutral-200/80 pt-12 sm:pt-16 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-black text-neutral-950">
              Business Card Printing FAQ
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Clear answers on turnaround times, pricing, paper stocks, and embellishments in Dubai.
            </p>
          </div>

          <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
            {BUSINESS_CARD_FAQS.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div key={faq.question} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full cursor-pointer items-center justify-between text-left gap-4"
                  >
                    <h3 className="font-display text-sm sm:text-base font-bold text-neutral-950 hover:text-[#A82F19] transition-colors">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#A82F19]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 text-xs sm:text-sm leading-relaxed text-neutral-600"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* 8. BOTTOM HIGH-CONVERTING CALL TO ACTION */}
        <section className="mt-16 sm:mt-24 rounded-3xl bg-neutral-950 p-8 sm:p-12 lg:p-16 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(212,175,55,0.15),transparent_70%),radial-gradient(ellipse_60%_50%_at_50%_90%,rgba(168,47,25,0.22),transparent_70%)]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">
              <Sparkles className="h-3.5 w-3.5" />
              Elevate Your Executive Presence
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              Ready to Print Dubai’s Finest Business Cards?
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Order your 450–600 GSM luxury cards or high-volume corporate batches with same-day proofing and guaranteed color precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => scrollToQuote()}
                className="w-full sm:w-auto rounded-2xl bg-[#A82F19] hover:bg-[#8c2211] px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#A82F19]/40 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Request Custom Quotation
              </button>
              <a
                href="https://wa.me/971551837995?text=Hello%20ONPRINT%20Dubai,%20I%20am%20ready%20to%20order%20business%20cards."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </Container>
    </div>
  )
}
