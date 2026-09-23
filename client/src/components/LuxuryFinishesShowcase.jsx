import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Award, Layers, ArrowRight, Check, ShieldCheck, Flame, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from './Container'
import { CornerMarks } from './PrintMarks'

const luxuryFinishes = [
  {
    id: 'gold-foil',
    title: '24K Hot Foil Stamping',
    tagline: 'High-Luster Metallic Mirror Reflection',
    description:
      'Heated brass dies apply pressure to bond ultra-reflective metallic foil onto premium paper stock. Available in Rich Gold, Rose Gold, Mirror Silver, Champagne, and Prismatic Holographic.',
    stockCompatibility: '350 – 700 GSM Cotton, Velvet Board, Kraft',
    idealFor: 'Executive Business Cards, Rigid Gift Boxes, Invitations & VIP Menus',
    image: '/assets/products/card-velvet-foil.jpg',
    accentColor: '#D4AF37',
    badge: 'Signature Craft',
    specs: ['Brass Die-Cast', 'Zero Flaking Guarantee', '5 Metallic Shades'],
  },
  {
    id: 'spot-uv',
    title: 'Raised 3D Spot UV & Scodix',
    tagline: 'High-Gloss Tactile Dimensional Polymer',
    description:
      'A clear, ultra-glossy liquid polymer is cured with UV light and built up to 100 microns high over matte backgrounds, creating an irresistible tactile contrast that catches light dramatically.',
    stockCompatibility: '300 – 600 GSM Matte or Soft-Touch Coated Stock',
    idealFor: 'Luxury Book Covers, Presentation Folders, Cosmetics & Retail Boxes',
    image: '/assets/products/brochure_booklet_catalog.jpg',
    accentColor: '#00E5FF',
    badge: '3D Dimensional',
    specs: ['Up to 100μ Elevation', 'Glass-Like Shine', 'Pinpoint Registration'],
  },
  {
    id: 'soft-touch',
    title: 'Velvet Soft-Touch Lamination',
    tagline: 'Silky Peach-Skin Matte Texture',
    description:
      'A bi-axially oriented 30-micron thermal matte film with a velvety tactile feel. Eliminates glare, resists fingerprints and scuffs, and gives printed pieces an unmistakable feeling of sheer luxury.',
    stockCompatibility: '250 – 500 GSM Art Boards & Paperboards',
    idealFor: 'Corporate Brochures, Custom Folding Cartons, Premium Packaging',
    image: '/assets/products/card-soft-touch.jpg',
    accentColor: '#EC008C',
    badge: 'Sensory Finish',
    specs: ['Anti-Fingerprint', '100% Anti-Scuff', 'Deep Black Enhancement'],
  },
  {
    id: 'debossing',
    title: 'Sculptural Blind Debossing',
    tagline: 'Deep Dimensional Indentation into Heavyweight Stock',
    description:
      'Using custom CNC-machined magnesium or brass dies, our Heidelberg cylinders press your typography or logo deep into cotton board fibers without ink for timeless architectural elegance.',
    stockCompatibility: '450 – 800 GSM 100% Cotton & Uncoated Boards',
    idealFor: 'Monograms, Minimalist Luxury Brands, Letterheads & Hangtags',
    image: '/assets/products/luxury_business_cards.jpg',
    accentColor: '#A82F19',
    badge: 'Artisanal Press',
    specs: ['Architectural Depth', 'Double-Sided Protection', 'Pure Fiber Mold'],
  },
  {
    id: 'gilded-edges',
    title: 'Painted & Gilded Metallic Edges',
    tagline: 'Reflective Gold & Custom Pantone Edging',
    description:
      'The edges of ultra-thick card stacks are sanded to micron perfection and coated with mirror metallic foil or hand-sprayed with custom Pantone inks for a striking 360-degree profile.',
    stockCompatibility: '600 – 1000 GSM Multilayer & Duplexed Boards',
    idealFor: 'VIP Business Cards, VIP Membership Cards, Luxury Hotel Key Folders',
    image: '/assets/products/card-painted-edge.jpg',
    accentColor: '#F59E0B',
    badge: '360° Profile',
    specs: ['Hand-Beveled', 'Metallic Mirror Foil', 'Custom Pantone Edge Matching'],
  },
  {
    id: 'cotton-board',
    title: '600 GSM Archival Cotton Board',
    tagline: 'Pillowy Italian 100% Cotton Texture',
    description:
      'Natural, chemical-free tree-friendly cotton fibers crafted with historic European papermaking techniques. Incredibly soft, weighty, and built to hold deep letterpress and foil impressions.',
    stockCompatibility: 'Available in 300, 450, 600, and 900 GSM',
    idealFor: 'Executive Stationery, Luxury Real Estate Folders, Diplomatic Invites',
    image: '/assets/products/service_luxury_packaging.jpg',
    accentColor: '#10B981',
    badge: 'FSC Certified',
    specs: ['Acid-Free Archival', '100% Cotton Rag', 'Ultra-Heavyweight Feel'],
  },
]

export default function LuxuryFinishesShowcase() {
  const [selectedId, setSelectedId] = useState(luxuryFinishes[0].id)
  const activeFinish = luxuryFinishes.find((f) => f.id === selectedId) || luxuryFinishes[0]

  return (
    <section className="relative overflow-hidden bg-[#14100E] py-20 sm:py-28 text-white border-t border-[#A82F19]/25">
      {/* Background Ambience & Fine Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,175,55,0.12),transparent_70%),radial-gradient(ellipse_60%_50%_at_80%_90%,rgba(168,47,25,0.15),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Signature Dubai Pressroom Finishes</span>
            </div>
            <h2 className="font-display mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Mastery of Light, Texture &amp; Substrate
            </h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-neutral-300 leading-relaxed">
              Every detail is engineered on our Al Quoz press floor using precision German Heidelberg machinery, heated brass dies, and European archival stocks.
            </p>
          </div>

          <Link
            to="/get-a-quote?service=Luxury+Finishing"
            className="shrink-0 inline-flex items-center gap-2 rounded-2xl border border-[#D4AF37]/50 bg-gradient-to-r from-[#D4AF37]/20 to-transparent px-5 py-3 text-xs font-black uppercase tracking-wider text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-lg"
          >
            <span>Request Finish Swatches</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Interactive Finishes Tabs Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
          {luxuryFinishes.map((finish) => {
            const isSelected = finish.id === selectedId
            return (
              <button
                key={finish.id}
                type="button"
                onClick={() => setSelectedId(finish.id)}
                className={`group relative flex flex-col items-start justify-between rounded-2xl border p-3.5 text-left transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-[#D4AF37] bg-gradient-to-b from-[#241c18] to-[#1a1412] shadow-[0_12px_30px_rgba(212,175,55,0.22)] scale-[1.02]'
                    : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                    style={{ backgroundColor: finish.accentColor }}
                  />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">
                    {finish.badge}
                  </span>
                </div>
                <span className="mt-3 block font-display text-xs sm:text-sm font-black text-white group-hover:text-[#D4AF37] transition-colors leading-tight line-clamp-2">
                  {finish.title}
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="activeFinishPill"
                    className="absolute inset-0 rounded-2xl ring-2 ring-[#D4AF37] pointer-events-none"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Active Finish Interactive Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFinish.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#1c1613] via-[#221b17] to-[#120e0c] p-6 sm:p-10 shadow-2xl"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D4AF37]/15 blur-3xl" />

            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
              {/* Left Column: Macro Image Showcase */}
              <div className="lg:col-span-6 relative">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl group">
                  <CornerMarks className="absolute top-3 left-3 z-20 h-5 w-5 text-white/50" />
                  <CornerMarks className="absolute bottom-3 right-3 z-20 h-5 w-5 rotate-180 text-white/50" />

                  <img
                    src={activeFinish.image}
                    alt={activeFinish.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="rounded-full border border-white/20 bg-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                      {activeFinish.badge}
                    </span>
                    <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                      100% QC PASS • DUBAI
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Finish Specifications & Details */}
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <span
                    className="inline-block rounded-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-black"
                    style={{ backgroundColor: activeFinish.accentColor }}
                  >
                    {activeFinish.tagline}
                  </span>
                  <h3 className="font-display mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                    {activeFinish.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed">
                    {activeFinish.description}
                  </p>
                </div>

                {/* Specs Pill List */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeFinish.specs.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-neutral-200"
                    >
                      <Check className="h-3 w-3 text-[#D4AF37]" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-y border-white/10 py-4 text-xs">
                  <div>
                    <span className="block font-mono uppercase tracking-wider text-neutral-400 text-[10px]">
                      Recommended Stock Weight
                    </span>
                    <span className="mt-1 block font-bold text-white">
                      {activeFinish.stockCompatibility}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono uppercase tracking-wider text-neutral-400 text-[10px]">
                      Signature Application
                    </span>
                    <span className="mt-1 block font-bold text-white">
                      {activeFinish.idealFor}
                    </span>
                  </div>
                </div>

                {/* CTA Action Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link
                    to={`/get-a-quote?service=${encodeURIComponent(activeFinish.title)}`}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#A82F19] hover:bg-[#8c2211] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#A82F19]/30 transition-all cursor-pointer"
                  >
                    <span>Quote With {activeFinish.title}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider text-neutral-200 transition-all cursor-pointer"
                  >
                    <span>Request Sample Box</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  )
}
