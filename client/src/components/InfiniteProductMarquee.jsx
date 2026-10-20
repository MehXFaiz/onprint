import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Layers, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react'
import Container from './Container'
import { getServiceWhatsAppUrl } from '../utils/whatsapp'

/**
 * Verified high-resolution product photography for ONPRINT Dubai marquee
 */
const MARQUEE_PRODUCTS = [
  {
    id: 'luxury-soft-touch',
    title: 'Luxury Soft-Touch Business Cards',
    category: 'Signature Cards',
    tag: '600 GSM Cotton',
    specs: 'Velvet Matte • Debossed Relief',
    image: '/assets/products/luxury_business_cards_dubai.webp',
    link: '/luxury-business-cards',
  },
  {
    id: 'gold-foil-cards',
    title: '24K Hot Gold Foil Stamping',
    category: 'VIP Metallic',
    tag: 'Reflective 24K Gold',
    specs: 'Precision Mirror Foil • Raised Edge',
    image: '/assets/products/card-velvet-foil.webp',
    link: '/foil-business-cards',
  },
  {
    id: 'embossed-debossed',
    title: 'Embossed & Debossed Printing',
    category: 'Tactile Finishes',
    tag: 'Deep 3D Sculpted',
    specs: 'Hardened Brass Dies • Blind Relief',
    image: '/assets/products/business-cards/bc_embossed.webp',
    link: '/embossed-business-cards',
  },
  {
    id: 'painted-edge-triplex',
    title: '700 GSM Triplex Painted Edge',
    category: 'Ultra-Heavyweight',
    tag: 'Gilded Color Core',
    specs: 'Gold & Midnight Navy Edge Tint',
    image: '/assets/products/card-painted-edge.webp',
    link: '/premium-business-cards',
  },
  {
    id: 'commercial-flyers',
    title: 'Corporate Marketing Flyers',
    category: 'Commercial Offset',
    tag: '170–300 GSM Silk',
    specs: 'Spot UV Accents • Heidelberg CMYK',
    image: '/assets/products/flyers.webp',
    link: '/flyer-printing-dubai',
  },
  {
    id: 'bifold-brochures',
    title: 'Luxury Bifold & Trifold Brochures',
    category: 'Catalogs & Reports',
    tag: 'Velvet Soft-Touch',
    specs: 'Precision Scored • Pantone Inks',
    image: '/assets/products/brochures.webp',
    link: '/brochure-printing-dubai',
  },
  {
    id: 'die-cut-stickers',
    title: 'Die-Cut Waterproof Vinyl Stickers',
    category: 'Stickers & Labels',
    tag: 'Custom Contour Cut',
    specs: 'Scratchproof • Matte Weatherproof',
    image: '/assets/products/stickers/die-cut-vinyl-stickers.jpg',
    link: '/services/stickers-labels-printing',
  },
  {
    id: 'holographic-stickers',
    title: 'Holographic Rainbow Foil Stickers',
    category: 'Iridescent Vinyl',
    tag: 'Prism Color Shift',
    specs: 'Light-Refracting • VIP Packaging',
    image: '/assets/products/stickers/holographic-foil-stickers.jpg',
    link: '/services/stickers-labels-printing',
  },
  {
    id: 'gold-foil-seals',
    title: '24K Gold Foil Stamped Seals',
    category: 'Embossed Seals',
    tag: 'Packaging Emblems',
    specs: 'Hot-Stamped • Heavy Duty Tack',
    image: '/assets/products/stickers/gold-foil-stamped-stickers.jpg',
    link: '/services/stickers-labels-printing',
  },
  {
    id: 'machine-roll-labels',
    title: 'Automated Bottle & Box Roll Labels',
    category: 'Industrial Packaging',
    tag: 'High-Speed Dispenser',
    specs: 'Gloss BOPP • Chemical & Oil Proof',
    image: '/assets/products/stickers/custom-roll-labels.jpg',
    link: '/services/stickers-labels-printing',
  },
  {
    id: 'luxury-rigid-boxes',
    title: 'Bespoke Rigid Luxury Packaging',
    category: 'Custom Boxes',
    tag: 'Rigid Box & Sleeve',
    specs: 'Magnetic Closure • Custom Foam Inserts',
    image: '/assets/products/service_luxury_packaging.webp',
    link: '/services/luxury-packaging-custom-boxes',
  },
  {
    id: 'executive-folders',
    title: 'Executive Presentation Folders',
    category: 'Corporate Stationery',
    tag: '350 GSM Silk Board',
    specs: 'Business Card Slits • Matt Lamination',
    image: '/assets/products/stationery/stationery-presentation-folders.webp',
    link: '/services/letterheads-printing-dubai',
  },
]

// Duplicate the array to guarantee zero-gap seamless infinite loop
const DUPLICATED_ITEMS = [...MARQUEE_PRODUCTS, ...MARQUEE_PRODUCTS]

export default function InfiniteProductMarquee() {
  const [imageErrorMap, setImageErrorMap] = useState({})

  const handleImageError = (id) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }))
  }

  const sampleBoxInquiryUrl = '/contact?inquiry=Sample+Box+Request'
  const sampleWhatsAppUrl = getServiceWhatsAppUrl('business-cards')

  return (
    <section
      aria-label="ONPRINT Dubai Live Production Showcase"
      className="relative overflow-hidden bg-[#0B132B] py-16 sm:py-20 md:py-24 border-y border-[#1E2C4F]"
    >
      {/* Background ambient lighting accents */}
      <div
        className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#D4AF65]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#101D35]/80 blur-3xl"
        aria-hidden="true"
      />

      {/* Header & Context */}
      <Container className="relative z-10 mb-10 sm:mb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65]/30 bg-[#14213D] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF65] shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF65]" />
              <span>Dubai Print Atelier • Continuous Production Showcase</span>
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F5F3EE] leading-tight">
              Mastery in Every Print Run.{' '}
              <span className="block sm:inline font-serif italic font-normal text-[#D4AF65]">
                Crafted for UAE Brands.
              </span>
            </h2>

            <p className="mt-2 text-sm sm:text-base text-[#A0AEC0] leading-relaxed">
              From 24K hot foil stamping and 600 GSM cotton business cards to waterproof contour die-cut stickers and
              bespoke rigid gift boxes. Printed with German Heidelberg &amp; calibrated digital presses in Al Quoz, Dubai.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={sampleBoxInquiryUrl}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF65] hover:bg-[#C8B185] px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0B132B] shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Claim Swatch Kit</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={sampleWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1E2C4F] bg-[#14213D] hover:bg-[#1E2C4F] hover:border-[#D4AF65] text-[#F5F3EE] px-4 py-2.5 text-xs sm:text-sm font-bold tracking-wider transition-all cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp Us</span>
            </a>
          </div>
        </div>
      </Container>

      {/* Marquee Viewport with Edge Fade Gradients */}
      <div className="relative w-full overflow-hidden">
        {/* Left infinity fade overlay */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 md:w-44 z-20 bg-gradient-to-r from-[#0B132B] via-[#0B132B]/85 to-transparent"
          aria-hidden="true"
        />
        {/* Right infinity fade overlay */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 md:w-44 z-20 bg-gradient-to-l from-[#0B132B] via-[#0B132B]/85 to-transparent"
          aria-hidden="true"
        />

        {/* Continuous Track */}
        <div className="onprint-marquee-track flex gap-4 sm:gap-6 py-4 px-2">
          {DUPLICATED_ITEMS.map((item, index) => {
            const hasError = imageErrorMap[`${item.id}-${index}`]
            const fallbackBg = 'linear-gradient(135deg, #14213D 0%, #101D35 100%)'

            return (
              <Link
                key={`${item.id}-${index}`}
                to={item.link}
                className="group relative flex-shrink-0 w-[270px] sm:w-[310px] md:w-[340px] rounded-2xl sm:rounded-3xl bg-[#14213D]/95 border border-[#1E2C4F] p-3 sm:p-3.5 shadow-lg transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#D4AF65] hover:shadow-[0_16px_40px_rgba(212,175,101,0.22)] backdrop-blur-xs select-none block"
              >
                {/* Product Image Stage */}
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[16/10] bg-[#101D35]">
                  {!hasError ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      width="340"
                      height="212"
                      onError={() => handleImageError(`${item.id}-${index}`)}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
                      style={{ background: fallbackBg }}
                    >
                      <Layers className="h-8 w-8 text-[#D4AF65]/60 mb-2" />
                      <span className="text-xs font-bold text-[#F5F3EE]">{item.title}</span>
                      <span className="text-[10px] text-[#A0AEC0]">{item.specs}</span>
                    </div>
                  )}

                  {/* Gradient shadow scrim over image */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101D35]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />

                  {/* Category Pill Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF65]/40 bg-[#101D35]/90 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#D4AF65] backdrop-blur-xs shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF65] animate-pulse" />
                      {item.category}
                    </span>
                  </div>

                  {/* Material Tag Badge */}
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="inline-block rounded-md bg-[#0B132B]/85 px-2 py-0.5 text-[10px] font-semibold text-[#F5F3EE] backdrop-blur-xs border border-[#1E2C4F]">
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="pt-3 pb-1 px-1">
                  <h3 className="text-sm sm:text-base font-bold text-[#F5F3EE] group-hover:text-[#D4AF65] transition-colors duration-300 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#A0AEC0] line-clamp-1">
                    {item.specs}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#1E2C4F]/70 flex items-center justify-between text-xs font-semibold text-[#D4AF65]">
                    <span className="text-[11px] tracking-wide uppercase">Explore Finish Spec</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Trust & Assurance Micro-Ribbon */}
      <Container className="relative z-10 mt-10 sm:mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#1E2C4F]/60 text-xs text-[#A0AEC0]">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-[#D4AF65] shrink-0" />
            <span>
              <strong className="text-[#F5F3EE]">Same-Day &amp; 24h Express</strong> dispatch available across Dubai &amp; UAE.
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-[#D4AF65] shrink-0" />
            <span>
              <strong className="text-[#F5F3EE]">Heidelberg &amp; Indigo</strong> calibrated color and micron-level registration.
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Layers className="h-4 w-4 text-[#D4AF65] shrink-0" />
            <span>
              <strong className="text-[#F5F3EE]">Tactile Swatches Included</strong> in our complimentary Dubai sample kits.
            </span>
          </div>
        </div>
      </Container>

      {/* Pure CSS Animation & Accessibility Styles */}
      <style>{`
        @keyframes onprintMarqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .onprint-marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: onprintMarqueeScroll 48s linear infinite;
        }

        /* Respect accessibility preferences for reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .onprint-marquee-track {
            animation: none !important;
            transform: none !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .onprint-marquee-track > * {
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  )
}
