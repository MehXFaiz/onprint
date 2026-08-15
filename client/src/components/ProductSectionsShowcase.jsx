import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Eye, ArrowUpRight, Sparkles, Tag, ShieldCheck, Check } from 'lucide-react'
import { getProductImage } from '../assets/productImages'

// 3 Main Sections Data strictly matching the uploaded user screenshot items with enhanced details
const homepageSectionsData = [
  {
    id: 'corporate-gift-items',
    sectionNumber: '01',
    badge: 'Corporate Gifts & Giveaways',
    title: 'Corporate Gift Items',
    subtitle: 'Custom printed promotional merchandise, mugs, bottles, and bespoke branded gifts in Dubai.',
    items: [
      {
        _id: 'sec1-1',
        name: 'Bags Printing Dubai',
        slug: 'bags-printing-dubai',
        imageKey: 'toteBags',
        shortDescription: 'Eco-friendly 100% natural cotton canvas tote bags with high-density screen printing.',
        price: 18,
        minimumQuantity: 50,
        badge: 'Eco Friendly',
        tag: 'Canvas & Jute',
        spec: 'Heavy Duty 280 GSM',
      },
      {
        _id: 'sec1-2',
        name: 'Keychain Printing Dubai',
        slug: 'keychain-printing-dubai',
        imageKey: 'keychain',
        shortDescription: 'Precision laser engraved wooden & metallic keychain rings with custom corporate logo.',
        price: 12,
        minimumQuantity: 50,
        badge: 'Popular Gift',
        tag: 'Laser Engraved',
        spec: 'Natural Oak & Metal',
      },
      {
        _id: 'sec1-3',
        name: 'Mugs Printing Dubai',
        slug: 'mugs-printing-dubai',
        imageKey: 'mugs',
        shortDescription: '11oz ceramic, magic heat-reveal & thermal travel mugs custom sublimated in vibrant colors.',
        price: 25,
        minimumQuantity: 20,
        badge: 'Best Seller',
        tag: 'Sublimation',
        spec: 'Dishwasher Safe Ceramic',
      },
      {
        _id: 'sec1-4',
        name: 'Custom Water Bottles Printing in Dubai',
        slug: 'custom-water-bottles-printing-in-dubai',
        imageKey: 'bottles',
        shortDescription: 'Double-wall insulated stainless steel thermal flasks with LED temperature cap touch screen.',
        price: 55,
        minimumQuantity: 25,
        badge: 'Executive',
        tag: 'Smart LED Flask',
        spec: '500ml Vacuum Insulated',
      },
    ],
  },
  {
    id: 'office-stationery-printing',
    sectionNumber: '02',
    badge: 'Executive Brand Identity',
    title: 'Office Stationery Printing',
    subtitle: 'High-precision business correspondence, marketing collaterals, flyers, brochures, and ID badges.',
    items: [
      {
        _id: 'sec2-1',
        name: 'Flyers Printing in Dubai',
        slug: 'flyers-printing-in-dubai',
        imageKey: 'flyers',
        shortDescription: 'Full-color single & double-sided promo flyers on premium gloss or matte artpaper.',
        price: 35,
        minimumQuantity: 100,
        badge: 'Express 24h',
        tag: 'CMYK Offset',
        spec: '170gsm–300gsm Art Paper',
      },
      {
        _id: 'sec2-2',
        name: 'Brochures Printing',
        slug: 'brochures-printing',
        imageKey: 'brochures',
        shortDescription: 'Bi-fold, tri-fold & multi-page corporate brochure printing with soft-touch lamination.',
        price: 65,
        minimumQuantity: 100,
        badge: 'Premium Finish',
        tag: 'Tri-Fold & Bi-Fold',
        spec: 'Precision Fold & Crease',
      },
      {
        _id: 'sec2-3',
        name: 'Name Badges Printing Dubai',
        slug: 'name-badges-printing-dubai',
        imageKey: 'badges',
        shortDescription: 'Durable acrylic & metallic magnetic staff name badges with metallic domed epoxy coating.',
        price: 22,
        minimumQuantity: 10,
        badge: 'Magnetic Fastener',
        tag: 'UV Metallic',
        spec: 'Scratch-Proof Resin',
      },
      {
        _id: 'sec2-4',
        name: 'Id Card Printing Dubai',
        slug: 'id-card-printing-dubai',
        imageKey: 'idCards',
        shortDescription: 'High-security PVC employee ID cards with barcode, NFC chip, and custom printed lanyards.',
        price: 15,
        minimumQuantity: 10,
        badge: 'Access Control',
        tag: 'PVC & Lanyard',
        spec: 'CR80 Standard Specs',
      },
    ],
  },
  {
    id: 'other-products',
    sectionNumber: '03',
    badge: 'Large Format & Signage',
    title: 'Other Products',
    subtitle: 'Event roll-up banner displays, outdoor advertising flags, die-cut stickers, and door nameplates.',
    items: [
      {
        _id: 'sec3-1',
        name: 'Roll up Printing in Dubai',
        slug: 'roll-up-printing-in-dubai',
        imageKey: 'rollup',
        shortDescription: 'Heavy-duty aluminum retractable roll-up banner stands with anti-curl PET film & carry case.',
        price: 180,
        minimumQuantity: 1,
        badge: 'Exhibition Ready',
        tag: 'Anti-Curl PET',
        spec: '85x200cm Luxury Base',
      },
      {
        _id: 'sec3-2',
        name: 'Flags Printing in Dubai',
        slug: 'flags-printing-in-dubai',
        imageKey: 'flags',
        shortDescription: 'Outdoor teardrop & feather promo beach flags with weather-resistant knitted polyester print.',
        price: 220,
        minimumQuantity: 1,
        badge: 'Weather Proof',
        tag: 'Sublimation Flag',
        spec: '3.5m Heavy Base Spike',
      },
      {
        _id: 'sec3-3',
        name: 'Stickers Printing in Dubai',
        slug: 'stickers-printing-in-dubai',
        imageKey: 'stickers',
        shortDescription: 'Waterproof die-cut vinyl stickers, product labels, and clear window graphics.',
        price: 40,
        minimumQuantity: 200,
        badge: 'Waterproof Vinyl',
        tag: 'Die-Cut Sheet',
        spec: 'UV Laminated Vinyl',
      },
      {
        _id: 'sec3-4',
        name: 'Name Plates Printing in Dubai',
        slug: 'name-plates-printing-in-dubai',
        imageKey: 'namePlates',
        shortDescription: 'Laser-cut clear acrylic & brushed stainless steel office door nameplates with metallic bolts.',
        price: 120,
        minimumQuantity: 1,
        badge: 'Executive Suite',
        tag: 'Acrylic & Metal',
        spec: 'Silver Standoff Pins',
      },
    ],
  },
]

// Single Section Component with Carousel Controls & Unique Card Aesthetic
function SectionCardGroup({ section, onQuickView }) {
  const [currentPage, setCurrentPage] = useState(0)

  const itemsPerPage = 4
  const totalPages = Math.ceil(section.items.length / itemsPerPage) || 1

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
  }

  const visibleItems = section.items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  return (
    <div className="relative rounded-3xl border border-border/80 bg-surface/90 p-6 sm:p-8 lg:p-10 shadow-sm backdrop-blur-xs transition-all duration-300 hover:border-purple-500/30 hover:shadow-xl">
      {/* Top Header Section matching the User's Title & Purple Underline Accent Bar */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-border/60">
        <div>
          {/* Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
            <span>SECTION {section.sectionNumber}</span>
            <span className="text-purple-400/50">•</span>
            <span>{section.badge}</span>
          </div>

          {/* Section Main Title with Purple Accent Bar (Honoring User Request with Unique Modern Styling) */}
          <div className="relative">
            <h2 className="font-display text-2xl font-black tracking-tight text-primary sm:text-3xl lg:text-4xl">
              {section.title}
            </h2>
            {/* Signature Underline Accent Bar */}
            <div className="mt-3 flex items-center gap-2">
              <span className="h-1.5 w-20 rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400 shadow-xs" />
              <span className="h-1.5 w-4 rounded-full bg-purple-400/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400/20" />
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm text-secondary leading-relaxed">
            {section.subtitle}
          </p>
        </div>

        {/* Carousel Slider Next/Prev Arrows Controls matching user screenshot controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 rounded-2xl border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-bold text-secondary">
            <span>{currentPage + 1}</span>
            <span className="text-border">/</span>
            <span>{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              aria-label={`Previous slide for ${section.title}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-primary shadow-xs transition-all hover:border-purple-500 hover:bg-purple-500/10 hover:text-purple-600 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={handleNextPage}
              aria-label={`Next slide for ${section.title}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-600/20 transition-all hover:bg-purple-700 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Unique Enhanced Cards */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${section.id}-${currentPage}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {visibleItems.map((item) => {
              const imageSrc = getProductImage(item)

              return (
                <div
                  key={item._id || item.slug}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-background shadow-xs transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10"
                >
                  {/* Image Container with Studio Lighting Vignette & Sheen */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    <img
                      src={imageSrc}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    />

                    {/* Gradient Overlay Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-60" />

                    {/* Top Badges Bar */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                      {item.badge ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/70 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md shadow-xs">
                          <Sparkles className="h-2.5 w-2.5 text-purple-400" />
                          {item.badge}
                        </span>
                      ) : <span />}

                      {item.tag && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-600/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs">
                          <Tag className="h-2.5 w-2.5" />
                          {item.tag}
                        </span>
                      )}
                    </div>

                    {/* Unique Frosted Glass Overlay Card Banner at bottom of image (Directly matching screenshot concept, 10/10 UI style) */}
                    <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/30 bg-white/85 dark:bg-neutral-950/85 p-3 backdrop-blur-md shadow-lg transition-all duration-300 group-hover:bg-white/95 dark:group-hover:bg-neutral-950/95 group-hover:border-purple-500/40 z-10">
                      <div className="flex items-center justify-between gap-2 text-[10px] font-extrabold">
                        <span className="uppercase tracking-wider text-purple-600 dark:text-purple-400">
                          {item.price ? `From AED ${item.price}` : 'Custom Quote'}
                        </span>
                        {item.minimumQuantity && (
                          <span className="font-semibold text-secondary">
                            Min: {item.minimumQuantity} pcs
                          </span>
                        )}
                      </div>

                      {/* Main Title Text matching user screenshot bold titles */}
                      <h3 className="font-display mt-1 text-sm font-black tracking-tight text-primary transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-1">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content & Action Bar */}
                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 pt-3 bg-background">
                    <div>
                      <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                        {item.shortDescription}
                      </p>

                      {item.spec && (
                        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-surface px-2 py-0.5 text-[10px] font-semibold text-secondary border border-border/50">
                          <Check className="h-3 w-3 text-purple-600" />
                          <span>{item.spec}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                      <Link
                        to={`/products/${item.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-primary transition-colors group-hover:text-purple-600 cursor-pointer"
                      >
                        <span>Order Custom</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-purple-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>

                      {onQuickView && (
                        <button
                          type="button"
                          onClick={() => onQuickView(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-bold text-secondary transition-all hover:border-purple-500 hover:text-purple-600 cursor-pointer active:scale-95"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Quick View</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Carousel Dots matching screenshot dots */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              aria-label={`Go to page ${idx + 1} of ${section.title}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentPage === idx
                  ? 'w-8 bg-purple-600'
                  : 'w-2 bg-border hover:bg-secondary/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductSectionsShowcase({ onQuickView }) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 bg-gradient-to-b from-background via-surface/50 to-background border-y border-border/70">
      {/* Decorative Subtle Radial Background Glows */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-2/3 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Intro Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            Dubai Premium Print Showcase
          </div>

          <h2 className="font-display text-3xl font-black tracking-tight text-primary sm:text-4xl lg:text-5xl">
            EXPLORE OUR <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 bg-clip-text text-transparent">PRODUCT CATEGORIES</span>
          </h2>

          <p className="text-sm sm:text-base text-secondary leading-relaxed">
            From high-volume corporate giveaways to executive office stationery and large-format outdoor displays.
          </p>
        </div>

        {/* 3 Main Product Sections Stacked Vertically as shown in user screenshot */}
        <div className="space-y-12">
          {homepageSectionsData.map((section) => (
            <SectionCardGroup key={section.id} section={section} onQuickView={onQuickView} />
          ))}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-display text-sm font-extrabold text-primary">Need a custom bulk quantity or unique specification?</h4>
              <p className="text-xs text-secondary">Our Dubai prepress team provides instant digital proofs and free material sample boxes.</p>
            </div>
          </div>

          <Link
            to="/get-a-quote"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition-all hover:bg-purple-700 hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Request Custom Quote</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
