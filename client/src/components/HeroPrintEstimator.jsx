import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  Tag,
  FileText,
  Mail,
  Flag,
  Sparkles,
  Zap,
  Check,
  CheckCircle,
  Clock,
  ArrowRight,
  Package,
  ShieldCheck,
  Truck,
  Upload,
} from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { trackWhatsAppClick } from '../utils/analytics'
import { getServiceWhatsAppUrl, WHATSAPP_PHONE, getWhatsAppUrl } from '../utils/whatsapp'

const ESTIMATOR_PRODUCTS = [
  {
    id: 'business-cards',
    name: 'Business Cards',
    shortName: 'Cards',
    icon: CreditCard,
    image: '/assets/products/luxury_business_cards_dubai.jpg',
    imageWebp: '/assets/products/luxury_business_cards_dubai.webp',
    badge: 'Flagship Luxury',
    turnaround: 'Same-Day / 24h',
    link: '/business-card-printing-dubai',
    quantities: [100, 250, 500, 1000, 2500],
    unit: 'pcs',
    options: [
      {
        id: 'cotton-foil',
        name: '600 GSM Cotton + 24K Gold Foil',
        tag: 'Signature VIP',
        prices: { 100: 195, 250: 290, 500: 390, 1000: 590, 2500: 1150 },
        desc: 'Presidential double-thick cotton with mirror gold hot foil',
      },
      {
        id: 'velvet-softtouch',
        name: '350 GSM Velvet Soft-Touch',
        tag: 'Best Seller',
        prices: { 100: 95, 250: 140, 500: 190, 1000: 280, 2500: 550 },
        desc: 'Tactile peach-skin velvet lamination with rich colors',
      },
      {
        id: 'triplex-edge',
        name: '700 GSM Triplex Painted Edge',
        tag: 'Ultra-Thick',
        prices: { 100: 240, 250: 350, 500: 480, 1000: 750, 2500: 1450 },
        desc: 'Triple-layer sandwich stock with hand-gilded foil edges',
      },
      {
        id: 'standard-matte',
        name: '350 GSM Standard Matte Silk',
        tag: 'Express Economy',
        prices: { 100: 65, 250: 95, 500: 130, 1000: 190, 2500: 380 },
        desc: 'Smooth silk artboard with protective matte coating',
      },
    ],
  },
  {
    id: 'stickers',
    name: 'Waterproof Stickers',
    shortName: 'Stickers',
    icon: Tag,
    image: '/assets/products/stickers/die-cut-vinyl-stickers.jpg',
    imageWebp: '/assets/products/stickers.webp',
    badge: 'Waterproof Vinyl',
    turnaround: 'Same-Day Ready',
    link: '/categories/stickers-labels-printing',
    quantities: [100, 250, 500, 1000, 2500],
    unit: 'pcs',
    options: [
      {
        id: 'die-cut-vinyl',
        name: 'Custom Shape Die-Cut Vinyl',
        tag: 'Contour Cut',
        prices: { 100: 75, 250: 120, 500: 180, 1000: 280, 2500: 520 },
        desc: 'Precision laser-cut contour outline on heavy waterproof vinyl',
      },
      {
        id: 'holographic-foil',
        name: 'Holographic Rainbow Foil',
        tag: 'Shimmering Prism',
        prices: { 100: 95, 250: 160, 500: 240, 1000: 380, 2500: 720 },
        desc: 'Spectacular iridescent color-shifting metallic vinyl decals',
      },
      {
        id: 'clear-transparent',
        name: 'Ultra-Clear Transparent Decals',
        tag: 'Glass & Bottle',
        prices: { 100: 85, 250: 140, 500: 210, 1000: 320, 2500: 610 },
        desc: 'Optically clear see-through vinyl with opaque white ink underbase',
      },
      {
        id: 'roll-labels',
        name: 'Packaging Roll Labels',
        tag: 'Machine Roll',
        prices: { 100: 120, 250: 180, 500: 260, 1000: 390, 2500: 690 },
        desc: 'Continuous roll labels for bottles, jars & automated dispensers',
      },
    ],
  },
  {
    id: 'flyers',
    name: 'Flyers & Leaflets',
    shortName: 'Flyers',
    icon: FileText,
    image: '/assets/products/flyers.jpg',
    imageWebp: '/assets/products/flyers/flyer-a5-promotional.webp',
    badge: 'Vivid 4K CMYK',
    turnaround: 'Same-Day / 4h',
    link: '/categories/flyers-brochures-printing',
    quantities: [250, 500, 1000, 2500, 5000],
    unit: 'pcs',
    options: [
      {
        id: 'a5-promotional',
        name: 'A5 Standard Promotional (170 GSM Silk)',
        tag: 'Most Popular',
        prices: { 250: 120, 500: 165, 1000: 230, 2500: 420, 5000: 750 },
        desc: 'Double-sided high-impact marketing flyers on premium European silk',
      },
      {
        id: 'a4-corporate',
        name: 'A4 Corporate Handbills (170 GSM Silk)',
        tag: 'Full Page',
        prices: { 250: 175, 500: 240, 1000: 360, 2500: 690, 5000: 1250 },
        desc: 'Spacious presentation format for catalogs, menus & corporate sheets',
      },
      {
        id: 'dl-slim',
        name: 'DL Event Slim Flyers (170 GSM)',
        tag: 'Rack Card',
        prices: { 250: 95, 500: 140, 1000: 195, 2500: 360, 5000: 640 },
        desc: 'Pocket-friendly event invitations and promotional voucher slips',
      },
      {
        id: 'folded-leaflets',
        name: 'Bi-Fold / Tri-Fold Leaflets (250 GSM)',
        tag: 'Multi-Panel',
        prices: { 250: 220, 500: 310, 1000: 480, 2500: 890, 5000: 1580 },
        desc: 'Scored & folded mini-brochures on heavy luxury artcard',
      },
    ],
  },
  {
    id: 'letterheads',
    name: 'Letterheads & Stationery',
    shortName: 'Stationery',
    icon: Mail,
    image: '/assets/products/letterhead_executive_120gsm.jpg',
    imageWebp: '/assets/products/stationery/stationery-executive-letterheads.webp',
    badge: 'Prestige Bond',
    turnaround: 'Same-Day / 24h',
    link: '/products/executive-letterheads-120gsm',
    quantities: [100, 250, 500, 1000, 2500],
    unit: 'pcs',
    options: [
      {
        id: 'royal-laser-120',
        name: '120 GSM Royal Laser Bond',
        tag: 'Corporate Standard',
        prices: { 100: 110, 250: 160, 500: 220, 1000: 320, 2500: 590 },
        desc: 'Laser & inkjet guaranteed ultra-smooth high-opacity executive paper',
      },
      {
        id: 'textured-linen',
        name: 'Textured Linen Artboard Paper',
        tag: 'Woven Texture',
        prices: { 100: 160, 250: 230, 500: 320, 1000: 480, 2500: 890 },
        desc: 'Distinctive cross-hatched tactile linen texture for legal & VIP letters',
      },
      {
        id: 'corporate-envelopes',
        name: 'Branded Envelopes (DL Peel & Seal)',
        tag: 'Mailing Suite',
        prices: { 100: 130, 250: 190, 500: 280, 1000: 420, 2500: 790 },
        desc: '120 GSM self-adhesive peel & seal envelopes with full flap branding',
      },
    ],
  },
  {
    id: 'rollup-banners',
    name: 'Roll-Up Banners',
    shortName: 'Banners',
    icon: Flag,
    image: '/assets/products/rollup_banner.jpg',
    imageWebp: '/assets/products/rollup_banner.webp',
    badge: 'DWTC & Expo',
    turnaround: 'Rush 24h Ready',
    link: '/categories/banners-displays-printing',
    quantities: [1, 2, 5, 10],
    unit: 'units',
    options: [
      {
        id: 'standard-85',
        name: '85×200 cm Standard Heavy Aluminum',
        tag: 'Trade Show Standard',
        prices: { 1: 110, 2: 190, 5: 420, 10: 750 },
        desc: 'Vivid anti-curl stoplight grey-back blockout film with padded carry bag',
      },
      {
        id: 'wide-100',
        name: '100×200 cm Wide Exhibition Banner',
        tag: 'Wide Stage',
        prices: { 1: 160, 2: 290, 5: 650, 10: 1150 },
        desc: 'Extra wide stage backdrop presentation banner for events & conferences',
      },
      {
        id: 'luxury-teardrop',
        name: '85×200 cm Luxury Teardrop Chrome Base',
        tag: 'VIP Chrome Stand',
        prices: { 1: 180, 2: 320, 5: 720, 10: 1290 },
        desc: 'Sleek teardrop base with chrome endcaps, no swing-out feet needed',
      },
    ],
  },
]

const LUXURY_FINISHES_GALLERY = [
  {
    id: 'gold-foil',
    title: '24K Hot Gold Foil Stamping',
    category: 'Gold Foil',
    badge: 'Signature VIP',
    stock: '600 GSM Italian Cotton',
    metric: '600 GSM',
    image: '/assets/products/luxury_business_cards_dubai.jpg',
    tag: 'Mirror Metallic',
    desc: 'Deep metallic foil pressed with custom heated brass dies for sharp, mirror-reflective crests and logos on luxurious duplexed cotton.',
    highlights: ['Mirror 24K Gold or Silver foil', 'Sculptural raised deboss / emboss', 'Tactile heavy cotton artboard'],
    priceFrom: '195',
  },
  {
    id: 'velvet-uv',
    title: 'Velvet Soft-Touch & 3D Raised Spot UV',
    category: 'Velvet & UV',
    badge: 'Executive Suite',
    stock: '450 GSM Silk Artboard',
    metric: '450 GSM',
    image: '/assets/products/card-velvet-foil.jpg',
    tag: 'Tactile Contrast',
    desc: 'Irresistible peach-skin matte laminate paired with glossy, high-build clear polymer Spot UV that you can feel with your fingertips.',
    highlights: ['Micro-thin velvet soft-touch film', 'Raised 3D gloss UV varnish (50 micron)', 'Vivid Heidelberg CMYK calibration'],
    priceFrom: '140',
  },
  {
    id: 'painted-edge',
    title: '700 GSM Triplex Gilded Painted Edge',
    category: 'Painted Edge',
    badge: 'Triplex Edge',
    stock: '700 GSM Triplexed Velvet',
    metric: '700 GSM',
    image: '/assets/products/card-painted-edge.jpg',
    tag: 'Hand-Gilded',
    desc: 'Extra-thick triple-ply cardstock with hand-gilded metallic foil edges. Looks stunning when presented at executive and VIP meetings.',
    highlights: ['Mirror gold, silver or rose gold edges', 'Solid 700 GSM rigidity (never bends)', 'Velvet laminate surface on both sides'],
    priceFrom: '240',
  },
]

export default function HeroPrintEstimator() {
  const [activeTab, setActiveTab] = useState('estimator') // 'estimator' | 'finishes' | 'samples'
  const [selectedProductIdx, setSelectedProductIdx] = useState(0)
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0)
  const [selectedQtyIdx, setSelectedQtyIdx] = useState(1) // default to 2nd tier (e.g. 250 pcs or 2 banners)
  const [activeFinishIdx, setActiveFinishIdx] = useState(0)

  const product = ESTIMATOR_PRODUCTS[selectedProductIdx] || ESTIMATOR_PRODUCTS[0]
  const option = product.options[selectedOptionIdx] || product.options[0]
  const quantity = product.quantities[selectedQtyIdx] !== undefined ? product.quantities[selectedQtyIdx] : product.quantities[0]
  const estimatedPrice = option.prices[quantity] || option.prices[product.quantities[0]] || 120

  const handleProductChange = (idx) => {
    setSelectedProductIdx(idx)
    setSelectedOptionIdx(0)
    // Keep quantity index in bounds
    const nextProduct = ESTIMATOR_PRODUCTS[idx]
    if (selectedQtyIdx >= nextProduct.quantities.length) {
      setSelectedQtyIdx(0)
    }
  }

  // Construct direct WhatsApp URL with pre-filled exact specs
  const getEstimatorWhatsAppUrl = () => {
    const text = `Hello ONPRINT, I would like to order ${product.name} via your website estimator:
• Specification / Finish: ${option.name}
• Selected Quantity: ${quantity} ${product.unit}
• Delivery Location: Dubai, UAE
Please confirm official quote, turnaround time, artwork pre-flight check, and doorstep Dubai delivery.`
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
  }

  const getFinishWhatsAppUrl = (finish) => {
    const text = `Hello ONPRINT, I am interested in ordering print with ${finish.title} (${finish.stock}). Please share available cardstock choices, formal quotation, and delivery details.`
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
  }

  return (
    <div className="relative w-full max-w-[590px] mx-auto min-w-0">
      {/* Outer Elevated Luxury Card Container */}
      <div className="relative rounded-3xl border border-[#203357] bg-[#172644] shadow-2xl text-[#F5F2EB] p-4 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#D4AF65] hover:shadow-[0_24px_50px_-12px_rgba(16,29,53,0.18)]">
        {/* Top Mode Navigation Switcher Tabs */}
        <div className="mb-4 flex items-center justify-between gap-1.5 rounded-2xl border border-[#203357] bg-[#101D35] p-1.5 shadow-xs">
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('estimator')}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition-all cursor-pointer ${
                activeTab === 'estimator'
                  ? 'bg-[#D4AF65] text-[#101D35] shadow-xs'
                  : 'text-[#F5F2EB] hover:text-[#D4AF65] hover:bg-[#172644]'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Instant Estimator</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('finishes')}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition-all cursor-pointer ${
                activeTab === 'finishes'
                  ? 'bg-[#D4AF65] text-[#101D35] shadow-xs'
                  : 'text-[#F5F2EB] hover:text-[#D4AF65] hover:bg-[#172644]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Luxury Finishes</span>
            </button>
          </div>

          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Prepress
          </span>
        </div>

        {/* Tab 1: Instant Print Estimator Mode */}
        {activeTab === 'estimator' && (
          <motion.div
            key="estimator-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Step 1: Product Selector Chips */}
            <div>
              <div className="flex items-center justify-between pb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF65]">
                  1. Select Print Discipline
                </span>
                <span className="text-[10px] font-bold text-[#B0BECE]">
                  {product.turnaround}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {ESTIMATOR_PRODUCTS.map((p, idx) => {
                  const Icon = p.icon
                  const isSelected = idx === selectedProductIdx
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProductChange(idx)}
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-center transition-all cursor-pointer border ${
                        isSelected
                          ? 'border-[#D4AF65] bg-[#101D35] text-[#D4AF65] shadow-xs'
                          : 'border-[#203357] bg-[#101D35]/80 text-[#F5F2EB] hover:bg-[#172644] hover:border-[#D4AF65]/50'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-[#D4AF65]' : 'text-[#B0BECE]'}`} />
                      <span className="text-[11px] font-bold leading-tight truncate w-full">
                        {p.shortName}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Compact Product Visual Banner */}
            <div className="relative h-28 sm:h-32 w-full overflow-hidden rounded-2xl border border-[#203357] bg-slate-900 group">
              <picture>
                {product.imageWebp && (
                  <source type="image/webp" srcSet={product.imageWebp} />
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  width="400"
                  height="128"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#101D35]/90 border border-[#D4AF65]/40 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#D4AF65] backdrop-blur-md">
                  {product.badge}
                </span>
                <span className="rounded-full bg-[#101D35]/90 border border-[#203357] px-2.5 py-0.5 text-[9px] font-black text-[#F5F2EB] backdrop-blur-md shadow-xs">
                  ⚡ {product.turnaround}
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-2 text-white">
                <div className="min-w-0">
                  <h4 className="font-serif text-sm sm:text-base font-bold text-white leading-tight truncate">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-slate-300 truncate mt-0.5">
                    {option.desc}
                  </p>
                </div>
                <Link
                  to={product.link}
                  className="shrink-0 text-[10px] font-bold text-[#D4AF65] hover:text-white transition-colors inline-flex items-center gap-0.5"
                >
                  <span>Specs</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              </div>
            </div>

            {/* Step 2: Paper Stock / Finishing Option Pills */}
            <div>
              <div className="flex items-center justify-between pb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF65]">
                  2. Select Paper Stock &amp; Finish
                </span>
                <span className="text-[10px] font-bold text-[#D4AF65]">
                  {option.tag}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {product.options.map((opt, idx) => {
                  const isSelected = idx === selectedOptionIdx
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOptionIdx(idx)}
                      className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'border-[#D4AF65] bg-[#D4AF65]/15 text-[#F5F2EB] shadow-xs'
                          : 'border-[#203357] bg-[#101D35] text-[#F5F2EB] hover:border-[#D4AF65]/50 hover:bg-[#172644]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isSelected ? 'bg-[#D4AF65]' : 'bg-slate-400'}`} />
                          <span className="text-xs font-bold truncate">
                            {opt.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#172644] border border-[#203357] text-[#D4AF65] shrink-0">
                        {opt.tag}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 3: Quantity Selector */}
            <div>
              <div className="flex items-center justify-between pb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF65]">
                  3. Select Quantity
                </span>
                <span className="text-[10px] font-medium text-[#B0BECE]">
                  Volume discounts automatically applied
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {product.quantities.map((qty, idx) => {
                  const isSelected = idx === selectedQtyIdx
                  return (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setSelectedQtyIdx(idx)}
                      className={`flex-1 min-w-[65px] rounded-xl py-1.5 px-2 text-center text-xs font-black transition-all cursor-pointer border ${
                        isSelected
                          ? 'border-[#D4AF65] bg-[#D4AF65] text-[#101D35] shadow-xs'
                          : 'border-[#203357] bg-[#101D35] text-[#F5F2EB] hover:border-[#D4AF65]/50 hover:bg-[#172644]'
                      }`}
                    >
                      <span>{qty}</span> <span className="text-[10px] font-medium">{product.unit}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Custom Production Quote Bar */}
            <div className="rounded-2xl border border-[#203357] bg-[#101D35] p-3.5 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B0BECE] block">
                    Custom Production Quote
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-[#D4AF65] tracking-tight">
                      Quote on Request
                    </span>
                    <span className="text-[11px] font-semibold text-[#B0BECE]">
                      • {quantity} {product.unit}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-0.5">
                  <div className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                    <Clock className="h-3 w-3 text-emerald-400" />
                    <span>{product.turnaround}</span>
                  </div>
                  <p className="text-[10px] font-medium text-[#B0BECE]">
                    Doorstep Delivery in UAE
                  </p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#203357] flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-medium text-[#B0BECE]">
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                  Free 300 DPI Pre-Flight Check
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                  Digital Proof Approval Included
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Concierge CTA */}
            <div className="space-y-2 pt-1">
              <a
                href={getEstimatorWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source_page: '/',
                    service_name: `estimator_${product.id}`,
                    button_location: 'hero_print_estimator',
                    label: `${product.id}_${quantity}`,
                  })
                }
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-3.5 px-4 text-xs sm:text-sm font-black text-white shadow-md hover:shadow-lg transition-all cursor-pointer text-center"
              >
                <WhatsAppIcon className="h-4 w-4 fill-white shrink-0" />
                <span>Order on WhatsApp • Instant Prepress Confirmation</span>
              </a>

              <div className="flex items-center justify-between text-xs font-bold text-[#B0BECE] pt-0.5 px-1">
                <Link
                  to={`/get-a-quote?category=${product.id}`}
                  className="inline-flex items-center gap-1 hover:text-[#D4AF65] transition-colors"
                >
                  <Upload className="h-3 w-3" />
                  <span>Upload Artwork / Custom RFQ</span>
                </Link>
                <Link
                  to="/corporate-quotes"
                  className="inline-flex items-center gap-1 hover:text-[#D4AF65] transition-colors"
                >
                  <ArrowRight className="h-3 w-3" />
                  <span>Corporate RFQ &amp; Trade Credit →</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Luxury Finishes Mode */}
        {activeTab === 'finishes' && (
          <motion.div
            key="finishes-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Finish Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5">
              {LUXURY_FINISHES_GALLERY.map((finish, idx) => {
                const isSelected = idx === activeFinishIdx
                return (
                  <button
                    key={finish.id}
                    type="button"
                    onClick={() => setActiveFinishIdx(idx)}
                    className={`rounded-xl py-2 px-1.5 text-center text-[11px] font-black transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-[#D4AF65] bg-[#D4AF65] text-[#101D35] shadow-xs'
                        : 'border-[#203357] bg-[#101D35] text-[#F5F2EB] hover:bg-[#172644] hover:border-[#D4AF65]/40'
                    }`}
                  >
                    <span className="truncate block">{finish.category}</span>
                  </button>
                )
              })}
            </div>

            {/* Selected Finish Showcase Card */}
            {(() => {
              const currentFinish = LUXURY_FINISHES_GALLERY[activeFinishIdx] || LUXURY_FINISHES_GALLERY[0]
              return (
                <div className="space-y-3.5">
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-2xl border border-[#203357] bg-slate-900 group">
                    <img
                      src={currentFinish.image}
                      alt={currentFinish.title}
                      width="480"
                      height="208"
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-[#101D35]/90 border border-[#D4AF65]/40 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#D4AF65] backdrop-blur-md">
                        {currentFinish.badge}
                      </span>
                      <span className="rounded-full bg-[#D4AF65] px-2.5 py-0.5 text-[9px] font-black text-[#101D35] shadow-xs">
                        {currentFinish.metric}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF65]">
                        {currentFinish.tag}
                      </span>
                      <h4 className="font-serif text-base sm:text-lg font-bold text-white mt-0.5 leading-snug">
                        {currentFinish.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                        {currentFinish.desc}
                      </p>
                    </div>
                  </div>

                  {/* Highlights List */}
                  <div className="rounded-2xl border border-[#203357] bg-[#101D35] p-3 space-y-1.5">
                    {currentFinish.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs font-semibold text-[#B0BECE]">
                        <CheckCircle className="h-3.5 w-3.5 text-[#D4AF65] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp CTA */}
                  <a
                    href={getFinishWhatsAppUrl(currentFinish)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-3 px-4 text-xs sm:text-sm font-black text-white shadow-md transition-all cursor-pointer text-center"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white shrink-0" />
                    <span>Inquire for {currentFinish.category} on WhatsApp</span>
                  </a>
                </div>
              )
            })()}
          </motion.div>
        )}
      </div>

      {/* Floating UAE Atelier Serving Banner beneath the Card */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#101D35] border border-[#203357] px-4 py-2.5 text-xs text-slate-200 shadow-md">
        <div className="flex items-center gap-2 font-bold min-w-0">
          <span className="text-base leading-none shrink-0">🇦🇪</span>
          <span className="leading-snug text-slate-200">
            Direct Al Quoz Pressroom • Doorstep UAE Delivery
          </span>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1 font-bold text-[#D4AF65] hover:text-white transition-colors text-xs shrink-0"
        >
          <span>Explore 100+ Products</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
