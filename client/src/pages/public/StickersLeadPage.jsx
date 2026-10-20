import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  Scissors,
  Check,
  Send,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import SEOHead from '../../components/SEOHead'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import { createQuote } from '../../services/quotes'
import { trackGetQuoteClick, trackQuoteRequest, trackWhatsAppClick } from '../../utils/analytics'
import { openWhatsAppDirectly, getWhatsAppUrl, FORMATTED_PHONE, RAW_WHATSAPP_NUMBER } from '../../utils/whatsapp'

const STICKER_TYPES = [
  { id: 'die-cut-vinyl', name: 'Custom Die-Cut Vinyl', desc: 'Cut precisely to the exact perimeter of your artwork with easy-peel backing.', badge: 'Bestseller' },
  { id: 'kiss-cut-sheets', name: 'Kiss-Cut Sticker Sheets', desc: 'Multiple peelable stickers organized on a single backing sheet.', badge: 'Popular' },
  { id: 'clear-transparent', name: 'Clear Transparent Vinyl', desc: 'Ultra-clear waterproof film with selective white ink underprint for bottles & glass.', badge: 'Specialty' },
  { id: 'holographic-vinyl', name: 'Holographic Metallic Decals', desc: 'Iridescent rainbow metallic sheen that changes color in varying lighting.', badge: 'Luxury' },
  { id: 'gold-foil-labels', name: 'Hot Stamped Foil Labels', desc: 'Reflective gold, silver, or rose-gold metallic foil on matte or gloss substrates.', badge: 'Luxury' },
  { id: 'roll-packaging-labels', name: 'Machine Roll Product Labels', desc: 'Automatic dispenser rolls on bopp polypropylene for bottles, jars, and boxes.', badge: 'Commercial' },
]

const QUANTITY_OPTIONS = [
  '100 units',
  '250 units',
  '500 units',
  '1,000 units',
  '2,500 units',
  '5,000 units',
  '10,000+ units',
]

const MATERIAL_SPECS = [
  {
    icon: ShieldCheck,
    title: '100% Waterproof & Weatherproof',
    desc: 'Heavy-duty 100-micron vinyl resists direct sunlight, water, oil, and outdoor desert exposure without fading or peeling.',
  },
  {
    icon: Scissors,
    title: 'Optical Laser Die-Cut Precision',
    desc: 'CNC digital cutters follow intricate vector cutlines with sub-millimeter tolerances and easy-peel tab margins.',
  },
  {
    icon: Layers,
    title: 'Matte, Gloss & Velvet Overlaminates',
    desc: 'Scratch-resistant thermal protective laminates shield inks from scuffs, cleaning solvents, and friction.',
  },
  {
    icon: Zap,
    title: 'Rapid Al Quoz Turnaround',
    desc: 'Produced directly in our central Dubai pressroom. Urgent same-day rush options and 24–48h express delivery across the UAE.',
  },
]

export default function StickersLeadPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '500 units',
    stickerType: 'Custom Die-Cut Vinyl',
    size: 'e.g. 5x5 cm',
    finish: 'Matte Lamination',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [quoteRef, setQuoteRef] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return

    setIsSubmitting(true)
    trackGetQuoteClick({ source_page: 'stickers_lead_page' })

    const randomSeq = Math.floor(100000 + Math.random() * 900000)
    const generatedRef = `ONP-STK-${randomSeq}`

    const quotePayload = {
      quoteNumber: generatedRef,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      company: formData.company.trim() || null,
      productName: `Custom Stickers: ${formData.stickerType}`,
      quantity: formData.quantity,
      specs: `Type: ${formData.stickerType} | Size: ${formData.size} | Finish: ${formData.finish}`,
      notes: formData.message.trim() || null,
      status: 'New',
    }

    try {
      await createQuote(quotePayload)
    } catch (err) {
      console.warn('Backend quote submission note:', err.message)
    }

    trackQuoteRequest({
      product: `Custom Stickers: ${formData.stickerType}`,
      quantity: formData.quantity,
      source_page: 'stickers_lead_page',
    })

    setQuoteRef(generatedRef)
    setSubmitted(true)
    setIsSubmitting(false)

    // Direct auto-dispatch to WhatsApp
    openWhatsAppDirectly({
      title: 'CUSTOM STICKERS & LABELS QUOTE INQUIRY',
      refNumber: generatedRef,
      name: formData.name.trim(),
      phone: formData.phone.trim() || 'N/A',
      email: formData.email.trim(),
      company: formData.company.trim() || 'Individual',
      product: `Stickers (${formData.stickerType})`,
      quantity: formData.quantity,
      specs: `Type: ${formData.stickerType} | Approx Size: ${formData.size} | Finish: ${formData.finish}`,
      notes: formData.message.trim() || 'None',
    })
  }

  const breadcrumbs = [
    { name: 'Services', url: '/services' },
    { name: 'Sticker Printing Dubai', url: '/sticker-printing-dubai' },
    { name: 'Get Sticker Quote', url: '/quote/stickers' },
  ]

  return (
    <div className="bg-[#101C35] text-slate-200">
      <SEOHead
        title="Custom Sticker Printing Dubai | Instant Quote & Express UAE Delivery | ONPRINT"
        description="Configure custom waterproof vinyl stickers, die-cut decals, holographic stickers, and roll labels in Dubai. Same-day express turnaround and free digital proofing in Al Quoz."
        keywords="stickers quote dubai, custom stickers price dubai, sticker printing cost uae, die cut stickers quote, vinyl stickers dubai, bulk sticker printing dubai, label printing dubai"
        canonicalPath="/quote/stickers"
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#101C35] text-white pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-[#263654]">
        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D6BC8A] bg-[#D6BC8A]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#D6BC8A]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Commercial Sticker &amp; Label Press • Al Quoz, Dubai</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
              Custom Sticker &amp; Label Printing{' '}
              <span className="font-serif italic text-[#D6BC8A]">Made in Dubai</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Precision die-cut vinyl stickers, waterproof packaging labels, and holographic decals. Submit your specifications below for an instant quote and direct WhatsApp pre-flight assistance.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#D6BC8A]" />
                Any Custom Shape &amp; Size
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#D6BC8A]" />
                100% Waterproof Heavy-Duty Vinyl
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#D6BC8A]" />
                Express Same-Day or 24h Turnaround
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Form & Specs Grid */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              {submitted ? (
                <div className="space-y-6 text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">Sticker Specification Received</h2>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you, <strong className="text-slate-900">{formData.name}</strong>. Your reference number is <strong className="text-[#D6BC8A] font-mono">{quoteRef}</strong>.
                  </p>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3 max-w-md mx-auto">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Direct WhatsApp Dispatch
                    </p>
                    <p className="text-xs text-emerald-700">
                      Our pre-press team is reviewing your sticker specifications. Click below to continue directly on WhatsApp:
                    </p>
                    <a
                      href={getWhatsAppUrl({
                        title: 'CUSTOM STICKERS & LABELS QUOTE INQUIRY',
                        refNumber: quoteRef,
                        name: formData.name,
                        phone: formData.phone || 'N/A',
                        email: formData.email,
                        company: formData.company || 'Individual',
                        product: `Stickers (${formData.stickerType})`,
                        quantity: formData.quantity,
                        specs: `Type: ${formData.stickerType} | Size: ${formData.size} | Finish: ${formData.finish}`,
                        notes: formData.message || 'None',
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-3.5 px-6 text-xs font-bold text-white shadow-sm transition-all w-full cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-white" />
                      <span>Open WhatsApp Chat ({FORMATTED_PHONE})</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Submit another quote configuration
                  </button>
                </div>
              ) : (
                <>
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                      Request Your Custom Sticker Specification
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Fill in your details below for a verified commercial quote and free digital PDF proof.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Name <span className="text-[#D6BC8A]">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#D6BC8A] focus:ring-1 focus:ring-[#D6BC8A]"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Phone / WhatsApp <span className="text-[#D6BC8A]">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#D6BC8A] focus:ring-1 focus:ring-[#D6BC8A]"
                          placeholder="+971 50 123 4567"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address <span className="text-[#D6BC8A]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#D6BC8A] focus:ring-1 focus:ring-[#D6BC8A]"
                          placeholder="you@company.ae"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Company Name (Optional)</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#D6BC8A] focus:ring-1 focus:ring-[#D6BC8A]"
                          placeholder="Brand / Company"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Sticker Format <span className="text-[#D6BC8A]">*</span>
                        </label>
                        <select
                          name="stickerType"
                          required
                          value={formData.stickerType}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#D6BC8A] focus:ring-1 focus:ring-[#D6BC8A]"
                        >
                          {STICKER_TYPES.map((type) => (
                            <option key={type.id} value={type.name}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Quantity <span className="text-[#D6BC8A]">*</span>
                        </label>
                        <select
                          name="quantity"
                          required
                          value={formData.quantity}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#D6BC8A] focus:ring-1 focus:ring-[#D6BC8A]"
                        >
                          {QUANTITY_OPTIONS.map((qty) => (
                            <option key={qty} value={qty}>
                              {qty}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Approximate Dimensions</label>
                        <input
                          type="text"
                          name="size"
                          value={formData.size}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#D6BC8A] focus:ring-1 focus:ring-[#D6BC8A]"
                          placeholder="e.g. 6cm circle, 8x5cm rectangle"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Protective Finish</label>
                        <select
                          name="finish"
                          value={formData.finish}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#D6BC8A] focus:ring-1 focus:ring-[#D6BC8A]"
                        >
                          <option value="Matte Lamination">Matte Lamination (Anti-Glare)</option>
                          <option value="Gloss Lamination">Gloss Lamination (Vibrant Color)</option>
                          <option value="Velvet Soft-Touch">Velvet Soft-Touch (Tactile Luxury)</option>
                          <option value="Uncoated Waterproof">Uncoated Waterproof Synthetic</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Artwork Notes or Special Instructions
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#D6BC8A] focus:ring-1 focus:ring-[#D6BC8A] resize-none"
                        placeholder="e.g. We have artwork ready in vector AI format with 2mm bleed..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#D6BC8A] hover:bg-[#D6BC8A] text-[#101C35] font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D6BC8A]/25 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? 'Submitting Specifications…' : 'Submit Specification & Get Official Quote →'}
                    </button>

                    <p className="text-center text-slate-400 text-[11px]">
                      Your specifications are kept strictly confidential. Free PDF proofs provided before production.
                    </p>
                  </form>
                </>
              )}
            </div>

            {/* Right Column: Material Standards & Features */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D6BC8A]">
                  COMMERCIAL SUBSTRATES
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mt-1 mb-4">
                  Print Standards &amp; Finishes
                </h3>
                <div className="space-y-4">
                  {MATERIAL_SPECS.map((spec, idx) => {
                    const IconComp = spec.icon
                    return (
                      <div key={idx} className="flex gap-3.5 items-start">
                        <div className="flex-shrink-0 w-9 h-9 bg-[#D6BC8A]/10 rounded-xl flex items-center justify-center text-[#D6BC8A]">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{spec.title}</h4>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{spec.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Direct Al Quoz Pressroom Contact Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-serif text-base font-bold text-slate-900 mb-3">
                  Direct In-House Pressroom Assistance
                </h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#D6BC8A]" />
                    <span>WhatsApp / Direct Line: <strong className="text-slate-900">{FORMATTED_PHONE}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#D6BC8A]" />
                    <span>Inquiry Email: <strong className="text-slate-900">0nprint183@gmail.com</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#D6BC8A]" />
                    <span>Operating Hours: <strong className="text-slate-900">Mon–Sat 8:30 AM – 6:30 PM</strong></span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link to="/sticker-printing-dubai" className="text-xs font-semibold text-[#D6BC8A] hover:underline">
                    View Full Sticker Catalog &rarr;
                  </Link>
                  <Link to="/services" className="text-xs text-slate-500 hover:text-slate-800">
                    All Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
