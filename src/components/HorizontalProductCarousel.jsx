import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Check,
  CreditCard,
  Layers,
  Tag,
  Stamp,
  Award,
} from 'lucide-react'
import Container from './Container'
import WhatsAppIcon from './WhatsAppIcon'
import { getServiceWhatsAppUrl } from '../utils/whatsapp'
import { trackWhatsAppClick } from '../utils/analytics'

const CAROUSEL_FEATURED_PRODUCTS = [
  {
    id: 'business-cards-dubai',
    title: 'Luxury Cotton & Foil Business Cards',
    category: 'Executive Stationery',
    badge: 'Dubai Flagship #1',
    turnaround: 'Same-Day / 24h',
    image: '/assets/products/luxury_business_cards_dubai.webp',
    specs: ['600 GSM Cotton Stock', '24K Mirror Gold Foil', 'Velvet Soft-Touch'],
    link: '/categories/business-cards-printing',
    slug: 'business-cards-printing',
    description: 'Ultra-thick architectural paperboard with razor-sharp foil debossing and painted edges.',
  },
  {
    id: 'rollup-banners-dubai',
    title: 'Exhibition Roll-Up & Pull-Up Banners',
    category: 'Signage & Displays',
    badge: 'DWTC Event Standard',
    turnaround: '24h Express Ready',
    image: '/assets/products/rollup_banner.jpg',
    specs: ['Anti-Curl Greyback Film', 'Heavy Anodized Aluminium Base', 'Includes Padded Carry Bag'],
    link: '/categories/rollup-banners',
    slug: 'rollup-banners',
    description: 'High-definition 1440 DPI solvent prints calibrated for Dubai trade shows and conferences.',
  },
  {
    id: 'waterproof-stickers-dubai',
    title: 'Die-Cut Waterproof Vinyl Stickers',
    category: 'Stickers & Labels',
    badge: 'Weatherproof & UV-Proof',
    turnaround: 'Same-Day Ready',
    image: '/assets/products/stickers/die-cut-vinyl-stickers.jpg',
    specs: ['Matte / Gloss Vinyl', 'Zero-Residue Adhesive', 'Custom Contour Cut'],
    link: '/categories/stickers-labels-printing',
    slug: 'stickers-labels-printing',
    description: 'Chemical, moisture, and sunlight resistant die-cut labels engineered for UAE heat.',
  },
  {
    id: 'stamps-seals-dubai',
    title: 'Official Company Stamps & Seals',
    category: 'Corporate Compliance',
    badge: 'Dubai Economic Standard',
    turnaround: 'Same-Day 3-Hour Service',
    image: '/assets/products/stamps/self-inking-company-stamp.jpg',
    specs: ['Austrian Trodat Mechanics', '10,000+ Crisp Impressions', 'Bilingual Arabic / English'],
    link: '/categories/stamps-printing-dubai',
    slug: 'stamps-printing-dubai',
    description: 'Pre-inked and self-inking official seals approved for Dubai trade license requirements.',
  },
  {
    id: 'letterheads-stationery',
    title: 'Executive Letterheads & Suites',
    category: 'Corporate Stationery',
    badge: 'Corporate Suite',
    turnaround: '24h Delivery',
    image: '/assets/products/letterhead_executive_120gsm.jpg',
    specs: ['120 GSM Conqueror Watermarked', 'Laser-Safe Printing', 'Pantone Spot Color'],
    link: '/categories/letterheads-printing-dubai',
    slug: 'letterheads-printing-dubai',
    description: 'Smooth, tactile corporate stationery suites designed for prestigious UAE enterprises.',
  },
  {
    id: 'custom-bottles-mugs',
    title: 'Smart LED Bottles & Executive Drinkware',
    category: 'Specialty Gifts',
    badge: 'VIP Corporate Gifting',
    turnaround: '24–48h Dispatch',
    image: '/assets/products/bottle_smart_led.jpg',
    specs: ['Laser-Etched Logo', 'Vacuum Thermal Insulated', 'Digital Temperature Touch Lid'],
    link: '/categories/bottle-printing-dubai',
    slug: 'bottle-printing-dubai',
    description: 'Premium stainless steel drinkware customized with laser precision in Al Quoz.',
  },
]

export default function HorizontalProductCarousel() {
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const checkScroll = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

    const cardWidth = 320
    const index = Math.round(scrollLeft / cardWidth)
    setActiveIndex(Math.min(Math.max(index, 0), CAROUSEL_FEATURED_PRODUCTS.length - 1))
  }

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scrollByAmount = (direction) => {
    const el = scrollContainerRef.current
    if (!el) return
    const cardWidth = el.querySelector('article')?.offsetWidth || 340
    const scrollAmount = (cardWidth + 16) * (direction === 'left' ? -1 : 1)
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const scrollToIndex = (index) => {
    const el = scrollContainerRef.current
    if (!el) return
    const cards = el.querySelectorAll('article')
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }

  return (
    <section className="relative overflow-hidden border-t border-[#DED2C1] bg-[#F5F0E7] py-16 sm:py-20 text-[#352719]">
      {/* Ambient Radial Accent */}
      <div
        className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#795C43]/10 blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#FAF8F3]/70 blur-3xl -z-10"
        aria-hidden="true"
      />

      <Container>
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DED2C1] bg-[#FAF8F3] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#795C43] shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#795C43]" />
              <span>Flagship UAE Product Suite</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#352719]">
              Popular Commercial Printing Disciplines
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#756657] max-w-2xl leading-relaxed">
              Explore our most requested corporate print lines with verified in-house production specs and rapid UAE delivery.
            </p>
          </div>

          {/* Desktop Left/Right Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollByAmount('left')}
              disabled={!canScrollLeft}
              aria-label="Previous products"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DED2C1] bg-[#FAF8F3] text-[#352719] shadow-xs transition-all hover:border-[#C5A989] hover:text-[#795C43] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount('right')}
              disabled={!canScrollRight}
              aria-label="Next products"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DED2C1] bg-[#FAF8F3] text-[#352719] shadow-xs transition-all hover:border-[#C5A989] hover:text-[#795C43] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link
              to="/products"
              className="ml-2 hidden md:inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#795C43] hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none focus:outline-none"
          tabIndex={0}
          role="region"
          aria-label="Products Carousel"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault()
              scrollByAmount('left')
            } else if (e.key === 'ArrowRight') {
              e.preventDefault()
              scrollByAmount('right')
            }
          }}
        >
          {CAROUSEL_FEATURED_PRODUCTS.map((prod) => (
            <article
              key={prod.id}
              className="snap-start shrink-0 w-[285px] sm:w-[330px] md:w-[360px] flex flex-col rounded-3xl border border-[#DED2C1] bg-[#FAF8F3] overflow-hidden text-[#352719] shadow-md transition-all duration-300 hover:border-[#C5A989] hover:shadow-[0_16px_36px_rgba(121, 92, 67, 0.1),0_0_24px_rgba(121, 92, 67, 0.22)] group"
            >
              {/* Image Studio Stage */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EDE3D5] border-b border-[#DED2C1]">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#EDE3D5]/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-[#795C43] px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-white shadow-xs">
                    {prod.badge}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F0E7]/90 border border-[#DED2C1] px-2.5 py-0.5 text-[9.5px] font-bold text-[#352719] backdrop-blur-md shadow-xs">
                    <Clock className="h-3 w-3 text-[#795C43]" />
                    <span>{prod.turnaround}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795C43]">
                  {prod.category}
                </span>

                <h3 className="mt-1 text-base sm:text-lg font-bold text-[#352719] group-hover:text-[#795C43] transition-colors leading-snug line-clamp-1">
                  <Link to={prod.link}>{prod.title}</Link>
                </h3>

                <p className="mt-1.5 text-xs text-[#756657] leading-relaxed line-clamp-2">
                  {prod.description}
                </p>

                {/* Specs Chips */}
                <div className="mt-3 pt-3 border-t border-[#DED2C1] flex flex-wrap gap-1.5">
                  {prod.specs.map((spec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full bg-[#F5F0E7] border border-[#DED2C1] px-2.5 py-0.5 text-[10px] font-medium text-[#352719]"
                    >
                      <Check className="h-3 w-3 text-[#795C43] shrink-0" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-auto pt-4 border-t border-[#DED2C1] flex items-center gap-2">
                  <Link
                    to={prod.link}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#795C43] hover:bg-[#5D442E] px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition-all shadow-xs cursor-pointer active:scale-[0.98]"
                  >
                    <span>Explore Specs</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>

                  <a
                    href={getServiceWhatsAppUrl(prod.slug, { productName: prod.title })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackWhatsAppClick({
                        source_page: '/',
                        product_name: prod.title,
                        service_name: prod.category,
                        button_location: 'horizontal_carousel',
                        label: `carousel_wa_${prod.slug}`,
                      })
                    }}
                    aria-label={`Inquire about ${prod.title} on WhatsApp`}
                    title={`Inquire about ${prod.title} on WhatsApp`}
                    className="inline-flex items-center justify-center gap-1.5 h-8.5 px-3 rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-700 text-[11px] font-bold transition-all hover:bg-[#25D366] hover:text-white active:scale-95 cursor-pointer shadow-xs shrink-0"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5 fill-current shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Carousel Slide Indicators */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {CAROUSEL_FEATURED_PRODUCTS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'w-6 bg-[#795C43]'
                  : 'w-2 bg-[#DED2C1] hover:bg-[#795C43]/50'
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
