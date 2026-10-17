import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from './Container'

const luxuryFinishes = [
  {
    id: 'gold-foil',
    title: '24K Hot Foil Stamping',
    tagline: 'High-Luster Metallic Mirror Reflection',
    description:
      'Heated brass dies apply pressure to bond ultra-reflective metallic foil onto premium paper stock. Available in Rich Gold, Rose Gold, Mirror Silver, Champagne, and Prismatic Holographic.',
    stockCompatibility: '350 – 700 GSM Cotton, Velvet Board, Kraft',
    idealFor: 'Executive Business Cards, Invitations & VIP Menus',
    image: '/assets/products/card-velvet-foil.jpg',
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
    idealFor: 'Luxury Book Covers, Presentation Folders, Catalogs & Booklets',
    image: '/assets/products/brochure_booklet_catalog.jpg',
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
    idealFor: 'Corporate Brochures, Presentation Folders, Luxury Stationery',
    image: '/assets/products/card-soft-touch.jpg',
    badge: 'Sensory Finish',
    specs: ['Anti-Fingerprint', '100% Anti-Scuff', 'Deep Color Enhancement'],
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
    image: '/assets/products/luxury_business_cards.jpg',
    badge: 'FSC Certified',
    specs: ['Acid-Free Archival', '100% Cotton Rag', 'Ultra-Heavyweight Feel'],
  },
]

export default function LuxuryFinishesShowcase() {
  const [selectedId, setSelectedId] = useState(luxuryFinishes[0].id)
  const activeFinish = luxuryFinishes.find((f) => f.id === selectedId) || luxuryFinishes[0]

  return (
    <section className="bg-zinc-50 py-16 sm:py-24 text-zinc-950 border-t border-zinc-200">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-200/80 border border-zinc-300 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-zinc-800">
              <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" />
              <span>Signature Dubai Pressroom Finishes</span>
            </div>
            <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-950">
              Mastery of Light, Texture &amp; Substrate
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 leading-relaxed">
              Every detail is engineered on our Al Quoz press floor using precision German Heidelberg machinery, heated brass dies, and European archival stocks.
            </p>
          </div>

          <Link
            to="/get-a-quote?service=Luxury+Finishing"
            className="shrink-0 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-xs font-bold text-zinc-900 hover:border-zinc-950 hover:bg-zinc-50 transition-all cursor-pointer shadow-2xs"
          >
            <span>Request Finish Swatches</span>
            <ArrowRight className="h-4 w-4 text-[#FF5500]" />
          </Link>
        </div>

        {/* Interactive Finishes Tabs Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
          {luxuryFinishes.map((finish) => {
            const isSelected = finish.id === selectedId
            return (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                key={finish.id}
                type="button"
                onClick={() => setSelectedId(finish.id)}
                className={`group relative flex flex-col items-start justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-lg'
                    : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-900'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`h-2 w-2 rounded-full ${isSelected ? 'bg-[#FF5500]' : 'bg-zinc-400'}`}
                  />
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-[#FF5500]' : 'text-zinc-500'}`}>
                    {finish.badge}
                  </span>
                </div>
                <span className={`mt-3 block text-xs font-bold transition-colors leading-tight line-clamp-2 ${isSelected ? 'text-white' : 'text-zinc-900 group-hover:text-black'}`}>
                  {finish.title}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Active Finish Interactive Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFinish.id}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm"
          >
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Left Column: Macro Image */}
              <div className="lg:col-span-6 relative">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-xs group">
                  <picture>
                    {activeFinish.image.endsWith('.jpg') && (
                      <source
                        type="image/webp"
                        srcSet={activeFinish.image.replace(/\.jpg$/, '.webp')}
                      />
                    )}
                    <img
                      src={activeFinish.image}
                      alt={activeFinish.title}
                      width="540"
                      height="405"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </picture>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-lg bg-zinc-950/85 border border-zinc-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                      {activeFinish.badge}
                    </span>
                    <span className="text-[10px] font-bold text-white bg-zinc-950/85 border border-white/15 px-2.5 py-1 rounded-lg">
                      100% QC PASS • DUBAI
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Finish Specifications & Details */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <span className="inline-block rounded-md bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-900">
                    {activeFinish.tagline}
                  </span>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-black text-zinc-950">
                    {activeFinish.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                    {activeFinish.description}
                  </p>
                </div>

                {/* Specs List */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeFinish.specs.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-800"
                    >
                      <Check className="h-3.5 w-3.5 text-[#FF5500]" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-y border-zinc-200 py-3.5 text-xs">
                  <div>
                    <span className="block uppercase tracking-wider text-zinc-400 font-bold text-[9.5px]">
                      Recommended Stock Weight
                    </span>
                    <span className="mt-1 block font-bold text-zinc-900">
                      {activeFinish.stockCompatibility}
                    </span>
                  </div>
                  <div>
                    <span className="block uppercase tracking-wider text-zinc-400 font-bold text-[9.5px]">
                      Signature Application
                    </span>
                    <span className="mt-1 block font-bold text-zinc-900">
                      {activeFinish.idealFor}
                    </span>
                  </div>
                </div>

                {/* CTA Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link
                    to={`/get-a-quote?service=${encodeURIComponent(activeFinish.title)}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 hover:bg-[#FF5500] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all cursor-pointer"
                  >
                    <span>Quote With {activeFinish.title}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 px-5 py-3 text-xs font-bold text-zinc-900 transition-all cursor-pointer"
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
