import { useState, useMemo } from 'react'
import {
  ChevronDown,
  Sparkles,
  Search,
  HelpCircle,
  Layers,
  FileCheck,
  ShieldCheck,
  CreditCard,
  Truck,
  MessageSquare,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'

const CATEGORIES = [
  'All Topics',
  'Ordering & Turnaround',
  'Artwork & Prepress',
  'Luxury Finishes & Papers',
  'Pricing & 5% VAT',
  'Corporate & Delivery',
]

const ALL_FAQS = [
  {
    category: 'Ordering & Turnaround',
    question: 'What is the standard turnaround time for printing orders in Dubai?',
    answer:
      'Digital print orders (business cards, flyers, brochures, roll-up banners, and stickers) are typically produced within 24 to 48 hours following digital proof approval. Large offset press runs (5,000+ units) and multi-stage luxury embellishments (hot foil stamping, 3D spot UV, and edge painting) take 3 to 5 business days. Same-day express rush printing is available for time-critical corporate events.',
  },
  {
    category: 'Ordering & Turnaround',
    question: 'How do I place an urgent same-day printing order in Dubai?',
    answer:
      'For same-day rush printing, contact our Al Quoz pressroom directly via WhatsApp (+44 7344546056) or submit your print-ready PDF artwork through our Get a Quote wizard selecting "Same-Day Rush (Under 12h)". We prioritize priority press slots on our HP Indigo and digital wide-format presses.',
  },
  {
    category: 'Ordering & Turnaround',
    question: 'Can I inspect physical sample swatches before placing a large volume order?',
    answer:
      'Yes. Corporate clients and brand agencies are welcome to visit our Al Quoz facility to inspect substrate swatch books (350 GSM Silk, 450 GSM Velvet Soft-Touch, 600 GSM Archival Italian Cotton) and foil color charts. We also dispatch swatch sample kits across Dubai and Abu Dhabi upon request.',
  },
  {
    category: 'Artwork & Prepress',
    question: 'What file formats, color profiles, and bleed margins do you require for artwork?',
    answer:
      'We recommend print-ready PDF/X-1a or PDF/X-4 files saved at 300+ DPI in CMYK color mode. Please convert all fonts to outlines (curves) and include a minimum 3mm bleed margin on all four sides with crop marks. We also accept layered Adobe Illustrator (.ai) and Photoshop (.psd) files.',
  },
  {
    category: 'Artwork & Prepress',
    question: 'Do you provide a digital proof before printing begins?',
    answer:
      'Every single order includes a complimentary prepress audit and digital PDF proof. Our prepress engineers check resolution, color profiles, safe zones, and trim margins. We never put plates on press until you have explicitly reviewed and approved your digital proof.',
  },
  {
    category: 'Artwork & Prepress',
    question: 'How do I prepare vector mask layers for Spot UV and Hot Foil stamping?',
    answer:
      'For specialty finishes, supply your artwork with a separate vector separation layer on top of your CMYK design. Color the foil or UV elements as 100% Solid K (Black) or a dedicated 100% Pantone Spot color swatch named "Foil" or "Spot UV", set to overprint.',
  },
  {
    category: 'Luxury Finishes & Papers',
    question: 'What signature embellishments and luxury finishes do you offer?',
    answer:
      'Our Al Quoz pressroom specializes in 8 tactile crafts: 24K Gold & Silver Metallic Foil Stamping, Raised 3D Spot UV (Scodix), Blind Letterpress Debossing / Embossing, Velvet Soft-Touch Lamination, Precision Custom Die-Cutting, Painted / Gilded Edges, 600 GSM Cotton Letterpress, and PUR Book Binding.',
  },
  {
    category: 'Luxury Finishes & Papers',
    question: 'What is the difference between Matte, Gloss, and Velvet Soft-Touch lamination?',
    answer:
      'Gloss lamination provides a high-shine, vibrant finish ideal for photo-heavy brochures and product labels. Matte lamination eliminates glare, offering a smooth, glare-free finish. Velvet Soft-Touch lamination provides an ultra-luxurious, suede-like tactile feel that protects cards and packaging from fingerprints and scuffs.',
  },
  {
    category: 'Pricing & 5% VAT',
    question: 'How does volume tier discount pricing work on ONPRINT?',
    answer:
      'We offer automatic volume discounts built directly into our price calculators: 6% discount at 250 units, 12% at 500 units, 20% at 1,000 units, 25% at 2,500 units, and 35% discount for 5,000+ units. High-volume runs leverage our German Heidelberg Speedmaster offset press to dramatically reduce unit costs.',
  },
  {
    category: 'Pricing & 5% VAT',
    question: 'Are prices subject to UAE Federal Tax Authority (FTA) 5% VAT?',
    answer:
      'Yes, in compliance with UAE Federal Tax Authority regulations, all commercial print services are subject to standard 5% UAE VAT. Every order includes a fully itemized Tax Invoice containing our TRN (100482910400003) for your corporate accounting and VAT reclaim.',
  },
  {
    category: 'Corporate & Delivery',
    question: 'Do you offer 30-day or 60-day credit facilities for corporate accounts?',
    answer:
      'Yes. Registered UAE companies, government entities, and marketing agencies can apply for 30-day or 60-day credit terms via our Corporate Procurement portal (/corporate-quotes). Account approval is processed within 24 business hours upon trade license and TRN verification.',
  },
  {
    category: 'Corporate & Delivery',
    question: 'Where do you deliver across the United Arab Emirates?',
    answer:
      'We offer door-to-door courier delivery across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. We also handle split-shipments for national retail chains and multi-branch corporate offices.',
  },
]

export default function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Topics')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = useMemo(() => {
    return ALL_FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'All Topics' || faq.category === selectedCategory
      const matchesSearch =
        !searchQuery.trim() ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="py-16 sm:py-24 bg-[#0B132B] min-h-screen text-[#F5F3EE]">
      <SEOHead
        title="Commercial Printing FAQ Dubai | Turnaround, Specs & Prices | ONPRINT"
        description="Comprehensive answers to commercial printing questions in Dubai: turnaround times, CMYK bleed specifications, luxury foil & spot UV finishes, 5% UAE VAT, and corporate credit terms."
        keywords="printing faq dubai, commercial printing turnaround, cmyk bleed artwork specs, luxury business cards faq, uae vat printing invoice"
        canonicalPath="/faq"
        faqList={filteredFaqs}
        breadcrumbs={[{ name: 'FAQ', url: '/faq' }]}
      />

      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ name: 'FAQ & Print Knowledgebase' }]} />

        {/* Hero Header */}
        <div className="border-b border-[#1E2C4F] pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#14213D] border border-[#D6C29A]/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D6C29A]">
            <Sparkles className="h-3.5 w-3.5 text-[#D6C29A]" />
            <span>COMMERCIAL PRINT KNOWLEDGEBASE</span>
          </div>
          <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Everything you need to know about our Al Quoz pressroom capabilities, paper stock selections, prepress specifications, volume tier pricing, and doorstep delivery across the UAE.
          </p>

          {/* Real-Time Search Bar */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. foil, turnaround, 300 DPI, VAT, delivery)…"
              className="w-full rounded-xl border border-[#1E2C4F] bg-[#14213D] py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium text-white placeholder:text-slate-400 focus:border-[#D6C29A] focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#D6C29A] text-[#0B132B] shadow-xs'
                  : 'bg-[#14213D] border border-[#1E2C4F] text-slate-200 hover:border-[#D6C29A] hover:text-[#D6C29A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-8 divide-y divide-[#1E2C4F] border border-[#1E2C4F] bg-[#14213D] rounded-2xl p-4 sm:p-8 shadow-xs">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center">
              <HelpCircle className="h-10 w-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-200">No questions matched your search query</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All Topics')
                }}
                className="mt-2 text-xs font-bold text-[#D6C29A] hover:underline cursor-pointer"
              >
                Reset search filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <details key={faq.question} className="group py-5 first:pt-2 last:pb-2">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6C29A] block mb-1">
                      {faq.category}
                    </span>
                    <h2 className="font-display text-sm font-bold text-white sm:text-base group-hover:text-[#D6C29A] transition-colors">
                      {faq.question}
                    </h2>
                  </div>
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180 group-hover:text-[#D6C29A]" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300 pl-0 sm:pl-2 border-l-2 border-[#D6C29A]/30">
                  {faq.answer}
                </p>
              </details>
            ))
          )}
        </div>

        {/* Support CTA Box */}
        <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl bg-[#0B132B] p-6 sm:p-8 text-white sm:flex-row sm:items-center sm:justify-between shadow-lg">
          <div>
            <h3 className="font-display text-base font-bold text-white">
              Have a custom specification or non-standard print request?
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Our print engineers in Al Quoz, Dubai are available for instant technical consultation.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button to="/contact" variant="accent" size="sm" icon={false} className="w-full sm:w-auto font-bold">
              Contact Support Desk
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
