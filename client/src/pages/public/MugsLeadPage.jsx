import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  Clock,
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Coffee,
  Check,
  Flame,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import SEOHead from '../../components/SEOHead'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import { createQuote } from '../../services/quotes'
import { trackGetQuoteClick, trackQuoteRequest, trackWhatsAppClick } from '../../utils/analytics'
import { openWhatsAppDirectly, getWhatsAppUrl, FORMATTED_PHONE, RAW_WHATSAPP_NUMBER } from '../../utils/whatsapp'

const MUG_TYPES = [
  { id: 'standard-ceramic-11oz', name: 'Classic Ceramic Coffee Mug (11oz / 325ml)', desc: 'High-grade AAA gloss white ceramic with ultra-crisp dye-sublimation print.', badge: 'Bestseller' },
  { id: 'large-ceramic-15oz', name: 'Executive Jumbo Ceramic Mug (15oz / 450ml)', desc: 'Heavyweight ceramic with enlarged C-handle for extra comfort.', badge: 'Popular' },
  { id: 'two-tone-color-inner', name: 'Two-Tone Accent Color Mug (11oz)', desc: 'Vibrant interior and handle color with pristine white exterior print canvas.', badge: 'Corporate' },
  { id: 'magic-heat-reveal', name: 'Magic Heat-Sensitive Color Change Mug', desc: 'Matte black coating that turns translucent when hot liquid is poured, revealing artwork.', badge: 'Novelty' },
  { id: 'thermal-travel-tumbler', name: 'Double-Wall Stainless Steel Travel Tumbler', desc: 'Vacuum insulated with spill-resistant lid for hot/cold beverages on the go.', badge: 'Premium' },
  { id: 'matte-ceramic-luxury', name: 'Matte Black / Charcoal Stoneware Mug', desc: 'Tactile satin matte glaze with laser engraving or metallic gold/silver imprint.', badge: 'Executive' },
]

const QUANTITY_OPTIONS = [
  '24 units (Minimum)',
  '50 units',
  '100 units',
  '250 units',
  '500 units',
  '1,000+ units',
]

const QUALITY_SPECS = [
  {
    icon: Flame,
    title: 'Dishwasher & Microwave Safe',
    desc: 'Kiln-cured polymer and high-temperature sublimation inks resist fading, cracking, or peeling across commercial wash cycles.',
  },
  {
    icon: ShieldCheck,
    title: 'Food-Safe & Non-Toxic Ceramic',
    desc: 'Lead-free, cadmium-free FDA-compliant glazes and food-grade 304 stainless steel interior liners.',
  },
  {
    icon: Award,
    title: 'High-Definition Wrap Printing (1440 DPI)',
    desc: 'Full-color photographic reproduction from handle-to-handle with true Pantone spot matching.',
  },
  {
    icon: Zap,
    title: 'Central Dubai Press Production',
    desc: 'In-house production in Al Quoz with rapid 24–48h express dispatch across Dubai, Abu Dhabi, and the Northern Emirates.',
  },
]

export default function MugsLeadPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '50 units',
    mugType: 'Classic Ceramic Coffee Mug (11oz / 325ml)',
    boxPackaging: 'Individual White Gift Box',
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
    trackGetQuoteClick({ source_page: 'mugs_lead_page' })

    const randomSeq = Math.floor(100000 + Math.random() * 900000)
    const generatedRef = `ONP-MUG-${randomSeq}`

    const quotePayload = {
      quoteNumber: generatedRef,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      company: formData.company.trim() || null,
      productName: `Custom Mugs: ${formData.mugType}`,
      quantity: formData.quantity,
      specs: `Model: ${formData.mugType} | Packaging: ${formData.boxPackaging}`,
      notes: formData.message.trim() || null,
      status: 'New',
    }

    try {
      await createQuote(quotePayload)
    } catch (err) {
      console.warn('Backend quote submission note:', err.message)
    }

    trackQuoteRequest({
      product: `Custom Mugs: ${formData.mugType}`,
      quantity: formData.quantity,
      source_page: 'mugs_lead_page',
    })

    setQuoteRef(generatedRef)
    setSubmitted(true)
    setIsSubmitting(false)

    // Direct auto-dispatch to WhatsApp
    openWhatsAppDirectly({
      title: 'CUSTOM PRINTED MUGS QUOTE INQUIRY',
      refNumber: generatedRef,
      name: formData.name.trim(),
      phone: formData.phone.trim() || 'N/A',
      email: formData.email.trim(),
      company: formData.company.trim() || 'Individual',
      product: `Custom Mugs (${formData.mugType})`,
      quantity: formData.quantity,
      specs: `Model: ${formData.mugType} | Packaging: ${formData.boxPackaging}`,
      notes: formData.message.trim() || 'None',
    })
  }

  const breadcrumbs = [
    { name: 'Services', url: '/services' },
    { name: 'Mug Printing Dubai', url: '/services/mug-printing-dubai' },
    { name: 'Get Mug Quote', url: '/quote/mugs' },
  ]

  return (
    <div className="bg-white text-slate-900 selection:bg-[#FF5500] selection:text-white">
      <SEOHead
        title="Custom Mug Printing Dubai | Coffee Mugs & Travel Tumblers | ONPRINT"
        description="Configure custom printed ceramic coffee mugs, magic color-change mugs, and insulated tumblers in Dubai. 1440 DPI wrap printing, individual gift boxes, and express UAE delivery."
        keywords="mugs quote dubai, custom mugs price dubai, mug printing cost uae, ceramic mugs quote dubai, promotional mugs dubai, custom coffee cups dubai"
        canonicalPath="/quote/mugs"
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-slate-200/80">
        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5500] bg-[#FF5500]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
              <Coffee className="h-3.5 w-3.5" />
              <span>Commercial Drinkware Press • Al Quoz, Dubai</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              Custom Coffee Mug Printing{' '}
              <span className="font-serif italic text-[#FF5500]">in Dubai &amp; UAE</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Dishwasher-safe ceramic mugs, magic heat-activated mugs, and double-wall tumblers for corporate gifting and brand merchandising. Instant quote with WhatsApp pre-press verification.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-slate-700">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#FF5500]" />
                Dishwasher &amp; Microwave Safe
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#FF5500]" />
                Full-Wrap 1440 DPI Dye Sublimation
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#FF5500]" />
                Fast 2–4 Day Delivery Across UAE
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
                  <h2 className="text-2xl font-serif font-bold text-slate-900">Mug Specification Received</h2>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you, <strong className="text-slate-900">{formData.name}</strong>. Your reference number is <strong className="text-[#FF5500] font-mono">{quoteRef}</strong>.
                  </p>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3 max-w-md mx-auto">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Direct WhatsApp Dispatch
                    </p>
                    <p className="text-xs text-emerald-700">
                      Our drinkware specialists are reviewing your design details. Click below to continue directly on WhatsApp:
                    </p>
                    <a
                      href={getWhatsAppUrl({
                        title: 'CUSTOM PRINTED MUGS QUOTE INQUIRY',
                        refNumber: quoteRef,
                        name: formData.name,
                        phone: formData.phone || 'N/A',
                        email: formData.email,
                        company: formData.company || 'Individual',
                        product: `Custom Mugs (${formData.mugType})`,
                        quantity: formData.quantity,
                        specs: `Model: ${formData.mugType} | Packaging: ${formData.boxPackaging}`,
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
                      Request Your Drinkware Specification
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Fill in your details below for a verified commercial quote and complimentary 3D visual mockup.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Name <span className="text-[#FF5500]">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#A82F19]"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Phone / WhatsApp <span className="text-[#FF5500]">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#A82F19]"
                          placeholder="+971 50 123 4567"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address <span className="text-[#FF5500]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#A82F19]"
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
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#A82F19]"
                          placeholder="Brand / Company"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Mug / Tumbler Model <span className="text-[#FF5500]">*</span>
                        </label>
                        <select
                          name="mugType"
                          required
                          value={formData.mugType}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#A82F19]"
                        >
                          {MUG_TYPES.map((type) => (
                            <option key={type.id} value={type.name}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Quantity <span className="text-[#FF5500]">*</span>
                        </label>
                        <select
                          name="quantity"
                          required
                          value={formData.quantity}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#A82F19]"
                        >
                          {QUANTITY_OPTIONS.map((qty) => (
                            <option key={qty} value={qty}>
                              {qty}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Packaging Option</label>
                      <select
                        name="boxPackaging"
                        value={formData.boxPackaging}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#A82F19]"
                      >
                        <option value="Individual White Gift Box">Individual White Cardboard Gift Box (Standard)</option>
                        <option value="Custom Printed Box">Custom Branded Rigid Gift Box with Logo</option>
                        <option value="Bulk Safe Tray">Bulk Eco Master Carton (No Individual Boxes)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Artwork Notes or Print Position
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#A82F19] resize-none"
                        placeholder="e.g. Single logo facing right-handed drinker, or full panoramic 360 wrap..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#FF5500] hover:bg-[#8F2412] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FF5500]/25 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? 'Submitting Specifications…' : 'Submit Specification & Get Official Quote →'}
                    </button>

                    <p className="text-center text-slate-400 text-[11px]">
                      Complimentary 3D digital photorealistic mockup prepared before any production run.
                    </p>
                  </form>
                </>
              )}
            </div>

            {/* Right Column: Drinkware Standards & Features */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF5500]">
                  COMMERCIAL SPECIFICATIONS
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mt-1 mb-4">
                  Quality &amp; Durability Standards
                </h3>
                <div className="space-y-4">
                  {QUALITY_SPECS.map((spec, idx) => {
                    const IconComp = spec.icon
                    return (
                      <div key={idx} className="flex gap-3.5 items-start">
                        <div className="flex-shrink-0 w-9 h-9 bg-[#FF5500]/10 rounded-xl flex items-center justify-center text-[#FF5500]">
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
                    <Phone className="w-4 h-4 text-[#FF5500]" />
                    <span>WhatsApp / Direct Line: <strong className="text-slate-900">{FORMATTED_PHONE}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#FF5500]" />
                    <span>Inquiry Email: <strong className="text-slate-900">0nprint183@gmail.com</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#FF5500]" />
                    <span>Operating Hours: <strong className="text-slate-900">Mon–Sat 8:30 AM – 6:30 PM</strong></span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link to="/services/mug-printing-dubai" className="text-xs font-semibold text-[#FF5500] hover:underline">
                    View Mug Service Overview &rarr;
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
