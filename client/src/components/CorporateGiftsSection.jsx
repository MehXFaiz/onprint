import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react'
import ProductCard from './ProductCard'
import { getProductImage } from '../assets/productImages'

// Core Corporate Gift Items (including exact 4 from user's image + bonus items)
const defaultGiftItems = [
  {
    _id: 'gift-1',
    name: 'Mugs Printing Dubai',
    slug: 'mug-printing-dubai',
    category: { name: 'Drinkware & Gifts', slug: 'corporate-gift-items' },
    shortDescription: 'Ceramic, magic color-changing & thermal travel mugs custom printed with corporate logos.',
    price: 25,
    minimumQuantity: 20,
    badge: 'Best Seller',
    tag: 'Sublimation',
    imageKey: 'mug-printing-dubai',
  },
  {
    _id: 'gift-2',
    name: 'Custom Water Bottles Printing in Dubai',
    slug: 'water-bottles-printing-dubai',
    category: { name: 'Drinkware & Gifts', slug: 'corporate-gift-items' },
    shortDescription: 'Smart LED temperature display vacuum flasks & sleek stainless steel thermal water bottles.',
    price: 55,
    minimumQuantity: 25,
    badge: 'Popular',
    tag: 'Laser Engraved / UV',
    imageKey: 'water-bottles-printing-dubai',
  },
  {
    _id: 'gift-3',
    name: 'T-shirt Printing in Dubai',
    slug: 't-shirt-printing-dubai',
    category: { name: 'Apparel & Wearables', slug: 'corporate-gift-items' },
    shortDescription: '100% premium combed cotton crewnecks & polos with high-precision DTG and screen printing.',
    price: 45,
    minimumQuantity: 15,
    badge: 'Express 24h',
    tag: 'DTG & Screen Print',
    imageKey: 't-shirt-printing-dubai',
  },
  {
    _id: 'gift-4',
    name: 'Cap Printing Dubai',
    slug: 'cap-printing-dubai',
    category: { name: 'Apparel & Wearables', slug: 'corporate-gift-items' },
    shortDescription: 'Custom snapback, trucker, and baseball caps with high-density 3D puff embroidery.',
    price: 30,
    minimumQuantity: 20,
    badge: 'Executive',
    tag: '3D Puff Embroidery',
    imageKey: 'cap-printing-dubai',
  },
  {
    _id: 'gift-5',
    name: 'Executive Leather Notebook Set',
    slug: 'notebook-printing',
    category: { name: 'Executive Gifts', slug: 'office-stationery-printing' },
    shortDescription: 'Premium A5 bound leatherette journals with metallic foil debossing & ribbon marker.',
    price: 40,
    minimumQuantity: 30,
    badge: 'Luxury',
    tag: 'Foil Stamping',
    imageKey: 'notebook-printing',
  },
  {
    _id: 'gift-6',
    name: 'Laser Engraved Metal Pens',
    slug: 'pens-printing',
    category: { name: 'Executive Gifts', slug: 'office-stationery-printing' },
    shortDescription: 'Sleek matte rollerball metal pens packaged in velvet gift boxes with company logo.',
    price: 18,
    minimumQuantity: 50,
    badge: 'Promo Essential',
    tag: 'Laser Engraving',
    imageKey: 'pens-printing',
  },
]

export default function CorporateGiftsSection({ products, onQuickView }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Use passed products or fallback to default gift items
  const giftList = (products && products.length > 0)
    ? products.filter(p => p.category?.slug === 'corporate-gift-items' || p.category === 'corporate-gift-items')
    : defaultGiftItems

  const itemsToDisplay = giftList.length > 0 ? giftList : defaultGiftItems

  // Filter items by category tab
  const filteredItems = itemsToDisplay.filter(item => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'drinkware') return item.slug.includes('mug') || item.slug.includes('bottle')
    if (activeCategory === 'apparel') return item.slug.includes('t-shirt') || item.slug.includes('cap')
    if (activeCategory === 'stationery') return item.slug.includes('notebook') || item.slug.includes('pen')
    return true
  })

  // Calculation for slider pages
  const itemsPerPage = 4
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
  }

  const visibleItems = filteredItems.slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage)

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-[#FFFFFF] border-y border-[#000000]/10">
      {/* Decorative Subtle Background Studio Glow */}
      <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Professional Branding & Purple Accent Bar matching screenshot */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft/50 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-accent mb-3">
              <Sparkles className="h-3 w-3" />
              Corporate Merchandise &amp; Giveaways
            </div>

            {/* Custom Heading matching screenshot title style with modern flair */}
            <div className="relative">
              <h2 className="font-display text-3xl font-black tracking-tight text-primary sm:text-4xl lg:text-5xl">
                Corporate Gift Items
              </h2>
              {/* Unique Dual Accent Underline Bar */}
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="h-1.5 w-16 rounded-full bg-[#A82F19]" />
                <span className="h-1.5 w-3 rounded-full bg-[#A82F19]/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#A82F19]/20" />
              </div>
            </div>
          </div>

          {/* Filter Pills & Slider Arrow Navigation */}
          <div className="flex flex-wrap items-center gap-4 justify-between md:justify-end">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 rounded-2xl border border-border/80 bg-surface p-1 shadow-xs">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'drinkware', label: 'Drinkware' },
                { id: 'apparel', label: 'Apparel' },
                { id: 'stationery', label: 'Executive' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCategory(tab.id)
                    setCurrentIndex(0)
                  }}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-primary text-background shadow-sm'
                      : 'text-secondary hover:text-primary hover:bg-background/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Slider Next/Prev Arrows matching user's circular controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-surface text-primary shadow-xs transition-all hover:border-accent hover:bg-accent-soft hover:text-accent cursor-pointer active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-accent bg-accent text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:scale-105 cursor-pointer active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Cards Carousel Grid */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {visibleItems.map((item) => (
                <ProductCard
                  key={item._id || item.slug}
                  product={item}
                  onQuickView={onQuickView}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Pagination Dots matching screenshot dot controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? 'w-8 bg-accent'
                    : 'w-2.5 bg-border hover:bg-secondary/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom Trust Guarantee Strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-border/60 bg-surface/60 px-6 py-3.5 text-center text-xs font-bold text-secondary backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Official Sublimation &amp; DTG Production Dubai</span>
          </div>
          <span className="hidden sm:inline text-border">•</span>
          <div className="flex items-center gap-2">
            <span>Free Sample Swatch &amp; Pre-flight Proofs</span>
          </div>
          <span className="hidden sm:inline text-border">•</span>
          <div className="flex items-center gap-2">
            <span>Bulk Corporate Discounts Available</span>
          </div>
        </div>
      </div>
    </section>
  )
}
