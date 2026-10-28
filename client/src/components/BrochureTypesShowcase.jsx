import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Sparkles,
  Check,
  CheckCircle2,
  Maximize2,
  X,
  ArrowRight,
  ShieldCheck,
  Clock,
  Printer,
  FileText,
} from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { getServiceWhatsAppUrl } from '../utils/whatsapp'
import { trackWhatsAppClick } from '../utils/analytics'

export const BROCHURE_TYPES = [
  {
    id: 'bifold-brochure',
    title: 'Bi-Fold Brochures (4-Page Half Fold)',
    subtitle: 'Classic 4-Panel Executive Presentation',
    badge: 'Most Popular Standard',
    panels: '4 Panels (1 Center Fold)',
    image: '/assets/products/brochure_bifold.jpg',
    popularSizes: 'A4 folded to A5 (148×210mm) • A3 folded to A4 (210×297mm)',
    paperWeights: '170 GSM, 250 GSM, or 350 GSM Silk Artboard',
    turnaround: 'Same-Day / 24h Express',
    description:
      'Single fold down the center yielding 4 generous panels. The benchmark standard for corporate company profiles, executive summaries, medical clinics, and upscale restaurant menus in Dubai.',
    specs: [
      '1 sharp crease scored to prevent cracking',
      'Matte silk, high-gloss, or velvet soft-touch coating',
      'Optional 24K gold foil accent on front cover',
      'Calibrated German Heidelberg CMYK color accuracy',
    ],
    idealFor: 'Corporate profiles, product overviews, event programs, and hotel directory menus.',
  },
  {
    id: 'trifold-brochure',
    title: 'Tri-Fold Brochures (6-Page Letter / C-Fold)',
    subtitle: 'High-Impact Marketing & Direct Mail',
    badge: 'Best Seller for Marketing',
    panels: '6 Panels (2 Parallel Folds)',
    image: '/assets/products/brochure_trifold.jpg',
    popularSizes: 'A4 folded to DL Slim (99×210mm) • Fits DL Envelopes',
    paperWeights: '130 GSM, 170 GSM, or 250 GSM Silk / Gloss',
    turnaround: 'Same-Day / 24h Express',
    description:
      'Two parallel folds creating 3 compact sections that fold inward. Perfect for trade shows, reception racks, direct mail distributions, and exhibition collaterals at Dubai World Trade Centre (DWTC).',
    specs: [
      'Compact DL dimensions slide into pockets & envelopes',
      'Inward rolling fold keeps confidential info concealed',
      'Crisp high-speed automated folding lines',
      'Lightweight yet sturdy European coated paper stocks',
    ],
    idealFor: 'Exhibitions, clinic treatments, travel itineraries, banking brochures & promotional mailers.',
  },
  {
    id: 'zfold-brochure',
    title: 'Z-Fold Brochures (Accordion / Zig-Zag Fold)',
    subtitle: 'Continuous Panoramic Storytelling',
    badge: 'Sequential Flow',
    panels: '6 Panels (Zig-Zag Accordion)',
    image: '/assets/products/brochure_zfold.jpg',
    popularSizes: 'A4 folded to DL • 630×297mm Multi-Panel Panoramic',
    paperWeights: '150 GSM, 170 GSM, or 250 GSM Silk / Matte',
    turnaround: '24h Express Delivery',
    description:
      'Folded in an accordion zig-zag pattern with alternating inward and outward folds. Allows the reader to view content panel-by-panel or open the entire brochure into a wide continuous panorama.',
    specs: [
      'Smooth accordion pull-out reveals full visual spread',
      'No hidden panels—every surface faces the reader logically',
      'Available in 6-panel, 8-panel, or 10-panel custom lengths',
      'Heavy-duty crease scoring for durable repetitive handling',
    ],
    idealFor: 'Step-by-step guides, project roadmaps, tech specifications, tourist maps, and multi-language brochures.',
  },
  {
    id: 'gatefold-brochure',
    title: 'Gate-Fold Brochures (Double Window Reveal)',
    subtitle: 'Dramatic Double-Door Luxury Opening',
    badge: 'Luxury VIP Reveal',
    panels: '6 to 8 Panels (Center Meeting Flaps)',
    image: '/assets/products/brochure_gatefold.jpg',
    popularSizes: 'Double A4 opening to 840mm wide • A5 Gatefold',
    paperWeights: '250 GSM or 350 GSM Heavy Cardstock',
    turnaround: '24–48h Precision Press',
    description:
      'Both the left and right flaps fold inward to meet precisely in the middle without overlapping. Opening the gates reveals a dramatic widescreen panoramic interior spread with commanding visual impact.',
    specs: [
      'Architectural double-door opening experience',
      'Precision CNC creasing ensures flaps meet perfectly flush',
      'Ideal for paired foil debossed logo seals on front closure',
      'Double-gate (8pp) or closed-gate folding variations available',
    ],
    idealFor: 'Luxury Dubai real estate developments, high-end hospitality launches, VIP architectural portfolios & gala invitations.',
  },
  {
    id: 'booklet-catalog',
    title: 'Multi-Page Booklets & Catalogs (Saddle-Stitch / PUR)',
    subtitle: 'Comprehensive Bound Corporate Profiles',
    badge: 'Multi-Page Binding',
    panels: '8 to 64+ Printable Pages',
    image: '/assets/products/brochure_booklet_catalog.jpg',
    popularSizes: 'A4 Portrait/Landscape, A5, or 210×210mm Square',
    paperWeights: '130–170 GSM inside pages with 300 GSM heavy cover',
    turnaround: '24–48h Dispatch across UAE',
    description:
      'Multi-page bound brochures bound with precision saddle-stitching (spine wire staples) or luxury square-spine PUR perfect binding. Built for substantial product catalogs and institutional reports.',
    specs: [
      'Dual silver or matte black spine staples or PUR adhesive',
      'Reinforced 300–350 GSM laminated covers for longevity',
      'Matte, gloss, or velvet soft-touch cover lamination',
      'Page counts from 8pp up to 100+ pages with flat opening',
    ],
    idealFor: 'Corporate annual reports, product catalogs, company profiles, school prospectuses, and hotel directory compendiums.',
  },
  {
    id: 'softtouch-foil-brochure',
    title: 'Luxury Velvet Soft-Touch & 24K Foil Brochures',
    subtitle: 'Presidential Tactile Finish for Elite Brands',
    badge: 'Elite VIP Embellishment',
    panels: 'Custom Multi-Panel or Heavy Cover Fold',
    image: '/assets/products/brochure-soft-touch.jpg',
    popularSizes: 'Custom Bespoke Formats, A4, A5, Square',
    paperWeights: '300 GSM to 600 GSM Italian Artboard',
    turnaround: '2–3 Business Days Atelier Craft',
    description:
      'Engineered for prestigious UAE enterprises demanding exceptional tactile luxury. Combines peach-skin velvet soft-touch lamination with mirror 24K gold hot foil stamping and raised 3D spot UV.',
    specs: [
      'Sensory velvet soft-touch coating resists fingerprints',
      'Precision heated brass die gold/silver/rose gold foil stamping',
      'Raised 3D tactile clear gloss spot UV highlights on logos',
      'Hand-inspected in Al Quoz, Dubai before final delivery',
    ],
    idealFor: 'DIFC financial institutions, luxury jewelry catalogs, high-net-worth wealth management & sovereign summits.',
  },
]

export default function BrochureTypesShowcase({ className = '' }) {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [modalItem, setModalItem] = useState(null)

  const filterTabs = [
    { id: 'all', label: 'All Brochure Types', count: BROCHURE_TYPES.length },
    { id: 'bifold-brochure', label: 'Bi-Fold (4pp)' },
    { id: 'trifold-brochure', label: 'Tri-Fold (6pp)' },
    { id: 'zfold-brochure', label: 'Z-Fold (Accordion)' },
    { id: 'gatefold-brochure', label: 'Gate-Fold (Window)' },
    { id: 'booklet-catalog', label: 'Multi-Page Booklets' },
    { id: 'softtouch-foil-brochure', label: 'Luxury Velvet & Foil' },
  ]

  const displayedBrochures =
    selectedFilter === 'all'
      ? BROCHURE_TYPES
      : BROCHURE_TYPES.filter((b) => b.id === selectedFilter)

  return (
    <section className={`mt-14 sm:mt-18 pt-10 border-t border-[#122240] ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#122240] bg-[#081226] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF65]" />
            <span>Complete Folding Styles &amp; Production Specs</span>
          </div>
          <h2 className="font-serif mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F2EB]">
            All Types of Brochure Printing in Dubai
          </h2>
          <p className="mt-2 text-sm text-[#B0BECE] max-w-2xl leading-relaxed">
            Browse our complete range of commercial folding styles, tactile European paper stocks, and luxury finishes manufactured in-house at our Al Quoz pressroom. Click any style to inspect high-resolution imagery and specifications.
          </p>
        </div>

        {/* Global CTA WhatsApp */}
        <a
          href={getServiceWhatsAppUrl('brochures-printing', {
            productName: 'Brochure Printing Samples',
          })}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackWhatsAppClick({
              source_page: '/services/brochures-printing',
              service_name: 'brochure_types_top_cta',
              button_location: 'brochure_types_header',
              label: 'brochure_samples_inquiry',
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer shrink-0"
        >
          <WhatsAppIcon className="h-4 w-4 fill-white" />
          <span>Request Physical Swatches</span>
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = selectedFilter === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#D4AF65] text-[#040A18] font-black shadow-md'
                  : 'bg-[#081226] border border-[#122240] text-[#B0BECE] hover:text-[#F5F2EB] hover:border-[#D4AF65]/40'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count && <span className="text-[10px] opacity-75 font-mono">({tab.count})</span>}
            </button>
          )
        })}
      </div>

      {/* Visual Brochure Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {displayedBrochures.map((item, idx) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 1, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
            className="group flex flex-col justify-between rounded-3xl border border-[#122240] bg-[#081226] overflow-hidden text-[#F5F2EB] shadow-md transition-all duration-300 hover:border-[#D4AF65] hover:shadow-[0_16px_36px_rgba(16,29,53,0.8),0_0_24px_rgba(212,175,101,0.22)]"
          >
            {/* Image Container with Zoom & Quick View */}
            <div>
              <div
                className="relative aspect-[16/11] w-full overflow-hidden bg-[#020611] border-b border-[#122240] cursor-pointer"
                onClick={() => setModalItem(item)}
                title={`Click to view ${item.title} full size`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020611]/70 via-transparent to-transparent pointer-events-none" />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-[#D4AF65] px-3 py-1 text-[9.5px] font-black uppercase tracking-wider text-[#040A18] shadow-xs">
                    {item.badge}
                  </span>
                </div>

                {/* Quick View Indicator Pill */}
                <div className="absolute bottom-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#040A18]/90 border border-[#122240] px-2.5 py-1 text-[10px] font-bold text-[#F5F2EB] backdrop-blur-md shadow-xs group-hover:border-[#D4AF65]">
                    <Maximize2 className="h-3 w-3 text-[#D4AF65]" />
                    <span>View HD Photo</span>
                  </span>
                </div>

                {/* Turnaround Badge */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#040A18]/90 border border-[#122240] px-2.5 py-0.5 text-[9.5px] font-bold text-[#F5F2EB] backdrop-blur-md shadow-xs">
                    <Clock className="h-3 w-3 text-[#D4AF65]" />
                    <span>{item.turnaround}</span>
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF65]">
                  {item.panels}
                </span>

                <h3
                  onClick={() => setModalItem(item)}
                  className="mt-1 font-serif text-lg font-bold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors leading-snug cursor-pointer"
                >
                  {item.title}
                </h3>

                <p className="mt-2 text-xs text-[#B0BECE] leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {/* Specs List */}
                <ul className="mt-4 pt-4 border-t border-[#122240] space-y-1.5 text-[11px] font-medium text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Sizes:</strong> {item.popularSizes}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Stocks:</strong> {item.paperWeights}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-5 pt-0 mt-auto border-t border-[#122240]/60 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalItem(item)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#040A18] hover:bg-[#122240] border border-[#122240] hover:border-[#D4AF65] px-4 py-2 text-xs font-bold text-[#F5F2EB] transition-all cursor-pointer"
              >
                <span>Inspect Specs</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#D4AF65]" />
              </button>

              <a
                href={getServiceWhatsAppUrl('brochures-printing', {
                  productName: item.title,
                })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source_page: '/services/brochures-printing',
                    service_name: item.title,
                    button_location: 'brochure_types_card',
                    label: `brochure_wa_${item.id}`,
                  })
                }
                aria-label={`Get quote on WhatsApp for ${item.title}`}
                title={`Get quote on WhatsApp for ${item.title}`}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 fill-white shrink-0" />
                <span>Price</span>
              </a>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Modal / HD Lightbox for Detailed Brochure View */}
      <AnimatePresence>
        {modalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl rounded-3xl border border-[#122240] bg-[#081226] text-[#F5F2EB] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#122240] bg-[#040A18]/80">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF65]">
                    {modalItem.badge} • {modalItem.panels}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                    {modalItem.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalItem(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#081226] border border-[#122240] text-[#B0BECE] hover:text-white hover:border-[#D4AF65] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
                {/* Large HD Image */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#020611] border border-[#122240] shadow-inner">
                  <img
                    src={modalItem.image}
                    alt={modalItem.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Description */}
                <div className="rounded-2xl bg-[#040A18] border border-[#122240] p-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <p>{modalItem.description}</p>
                </div>

                {/* Detailed Specifications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-[#122240] bg-[#040A18] p-3.5">
                    <span className="text-[10px] font-black uppercase text-[#D4AF65] block mb-1">
                      Standard Dimensions
                    </span>
                    <span className="font-semibold text-white">{modalItem.popularSizes}</span>
                  </div>

                  <div className="rounded-xl border border-[#122240] bg-[#040A18] p-3.5">
                    <span className="text-[10px] font-black uppercase text-[#D4AF65] block mb-1">
                      Paper Stocks &amp; Grammages
                    </span>
                    <span className="font-semibold text-white">{modalItem.paperWeights}</span>
                  </div>

                  <div className="rounded-xl border border-[#122240] bg-[#040A18] p-3.5">
                    <span className="text-[10px] font-black uppercase text-[#D4AF65] block mb-1">
                      Folding &amp; Finishing Specs
                    </span>
                    <span className="font-semibold text-white">{modalItem.panels}</span>
                  </div>

                  <div className="rounded-xl border border-[#122240] bg-[#040A18] p-3.5">
                    <span className="text-[10px] font-black uppercase text-[#D4AF65] block mb-1">
                      Turnaround in Dubai
                    </span>
                    <span className="font-semibold text-emerald-400">{modalItem.turnaround}</span>
                  </div>
                </div>

                {/* Key Features Bullet points */}
                <div className="rounded-2xl border border-[#122240] bg-[#040A18] p-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF65] block mb-2">
                    Commercial Manufacturing Highlights
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {modalItem.specs.map((spec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-[#D4AF65] shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Use Cases */}
                <div className="text-xs text-slate-400">
                  <strong className="text-slate-200">Recommended For: </strong>
                  <span>{modalItem.idealFor}</span>
                </div>
              </div>

              {/* Modal Footer with Direct Inquiry Actions */}
              <div className="p-5 sm:p-6 border-t border-[#122240] bg-[#040A18]/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="text-xs text-[#B0BECE] text-center sm:text-left">
                  Direct Heidelberg Pressroom in Al Quoz • No Middlemen
                </span>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalItem(null)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-full border border-[#122240] text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                  >
                    Close
                  </button>

                  <a
                    href={getServiceWhatsAppUrl('brochures-printing', {
                      productName: `${modalItem.title} Quotation`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackWhatsAppClick({
                        source_page: '/services/brochures-printing',
                        service_name: modalItem.title,
                        button_location: 'brochure_modal_cta',
                        label: `modal_wa_${modalItem.id}`,
                      })
                    }
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-6 py-2.5 text-xs font-black text-white shadow-md cursor-pointer transition-all hover:scale-105"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>Get Instant Price on WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
