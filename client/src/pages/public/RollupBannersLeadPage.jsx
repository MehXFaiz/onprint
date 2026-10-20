import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Phone,
  Layers,
  Printer,
  ChevronDown,
  FileText,
  Check,
  Building2,
  Mail,
  Package,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import { createQuote } from '../../services/quotes'
import { trackGetQuoteClick, trackQuoteRequest, trackWhatsAppClick } from '../../utils/analytics'
import { openWhatsAppDirectly, getWhatsAppUrl, FORMATTED_PHONE, RAW_WHATSAPP_NUMBER } from '../../utils/whatsapp'

const BANNER_MODELS = [
  {
    id: 'standard-85x200',
    name: 'Standard Retractable Stand (85cm × 200cm)',
    tag: 'Bestseller Standard',
    badge: 'Same-Day / 24h',
    pricePerUnit: 'AED 140',
    basePrice: 140,
    minQty: 1,
    image: '/assets/products/rollup_banner_showcase.jpg',
    description: 'Anodized aluminum cassette with dual swing-out stabilizing feet, three-piece bungee pole, and padded zip carry case.',
    specs: ['85cm × 200cm Visual Size', '300 GSM Greyback Stoplight Film', 'Includes Padded Nylon Bag'],
  },
  {
    id: 'luxury-teardrop-85x200',
    name: 'Luxury Teardrop Footless Stand (85cm × 200cm)',
    tag: 'Executive Grade',
    badge: '24h Express',
    pricePerUnit: 'AED 240',
    basePrice: 240,
    minQty: 1,
    image: '/assets/products/rollup-banners/executive-matte-black-rollup-banner.svg',
    description: 'Heavy solid-weight teardrop cassette with polished chrome end caps. Stands flush without protruding feet.',
    specs: ['Footless Luxury Profile', 'Heavy Weighted Chrome Base', 'Anti-Curl Velvet Blockout Film'],
  },
  {
    id: 'wide-exhibition-100x200',
    name: 'Wide Exhibition Display (100cm × 200cm)',
    tag: 'Panoramic Impact',
    badge: '24–48h',
    pricePerUnit: 'AED 220',
    basePrice: 220,
    minQty: 1,
    image: '/assets/products/rollup_banner_showcase.jpg',
    description: 'Extended width banner for major exhibition booths, trade shows at DWTC, and corporate press backdrops.',
    specs: ['100cm × 200cm Wide View', 'Dual Support Bungee Poles', 'Zero-Light-Pass Greyback'],
  },
  {
    id: 'giant-backdrop-120x200',
    name: 'Giant Stage Banner (120cm × 200cm)',
    tag: 'Stage & Event',
    badge: '24–48h',
    pricePerUnit: 'AED 290',
    basePrice: 290,
    minQty: 1,
    image: '/assets/products/rollup_banner_showcase.jpg',
    description: 'Large-scale vertical presence for seminar stages, press conferences, and red carpet step-and-repeat photography.',
    specs: ['120cm × 200cm Oversized Size', 'Heavyweight Aluminum Rig', 'High-Tension Roller Spring'],
  },
  {
    id: 'double-sided-85x200',
    name: 'Double-Sided 360° Stand (85cm × 200cm)',
    tag: 'Two-Way Walkway',
    badge: '2–3 Days',
    pricePerUnit: 'AED 290',
    basePrice: 290,
    minQty: 1,
    image: '/assets/products/rollup-banners/double-sided-rollup-banner-85x200.svg',
    description: 'Two independent printed banners housed back-to-back in a single base. 360-degree visibility for mall corridors and aisles.',
    specs: ['Dual Back-to-Back Graphics', 'Two Independent Rollers', 'Maximum Foot-Traffic Reach'],
  },
  {
    id: 'desktop-tabletop-a3-a4',
    name: 'Desktop Mini Tabletop Stand (A3 / A4)',
    tag: 'Counter & POS',
    badge: '24h Express',
    pricePerUnit: 'AED 65',
    basePrice: 65,
    minQty: 2,
    image: '/assets/products/rollup-banners/desktop-mini-tabletop-rollup-banner.svg',
    description: 'Miniature pull-up banner stand for reception desks, hotel check-ins, payment counters, and dining tables.',
    specs: ['Available in A4 or A3 Size', 'Miniature Silver Stand', 'Fine Synthetic Graphic'],
  },
]

const QUANTITY_OPTIONS = [
  { label: '1 Banner', value: 1, multiplier: 1.0 },
  { label: '2 Banners', value: 2, multiplier: 1.9 },
  { label: '3 Banners', value: 3, multiplier: 2.7 },
  { label: '5 Banners', value: 5, multiplier: 4.3 },
  { label: '10 Banners', value: 10, multiplier: 8.0 },
  { label: '20+ Banners (Corporate)', value: 20, multiplier: 15.0 },
]

const TURNAROUND_OPTIONS = [
  { id: 'standard', label: 'Standard Press (24–48 Hours)', surcharge: 0 },
  { id: 'same-day', label: 'Express Same-Day Rush (4–6 Hours)', surcharge: 50 },
]

export default function RollupBannersLeadPage() {
  const [selectedModel, setSelectedModel] = useState(BANNER_MODELS[0])
  const [selectedQty, setSelectedQty] = useState(QUANTITY_OPTIONS[0])
  const [selectedTurnaround, setSelectedTurnaround] = useState(TURNAROUND_OPTIONS[0])
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    venueDelivery: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedQuote, setSubmittedQuote] = useState(null)

  const estimatedTotal = Math.round(
    selectedModel.basePrice * selectedQty.multiplier + selectedTurnaround.surcharge
  )

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return

    setIsSubmitting(true)
    trackGetQuoteClick({ source_page: 'rollup_banners_lead_page' })

    const randomSeq = Math.floor(100000 + Math.random() * 900000)
    const quoteNumber = `ONP-BAN-${randomSeq}`

    const quotePayload = {
      quoteNumber,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      productName: `Roll-Up Banner: ${selectedModel.name}`,
      quantity: selectedQty.value,
      totalPrice: estimatedTotal,
      specs: `Model: ${selectedModel.name} | Turnaround: ${selectedTurnaround.label} | Delivery: ${formData.venueDelivery || 'Standard'}`,
      notes: formData.notes,
      status: 'New',
    }

    try {
      const res = await createQuote(quotePayload)
      const finalQuote = res || quotePayload
      setSubmittedQuote(finalQuote)

      trackQuoteRequest({
        product: `Roll-Up Banner: ${selectedModel.name}`,
        quantity: selectedQty.value,
        value: estimatedTotal,
        currency: 'AED',
        source_page: 'rollup_banners_lead_page',
      })

      // Direct WhatsApp Dispatch
      openWhatsAppDirectly({
        title: 'ROLL-UP BANNERS QUOTE INQUIRY',
        refNumber: finalQuote.orderNumber || finalQuote.quoteNumber || quoteNumber,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company: formData.company || 'N/A',
        product: `Roll-Up Banner: ${selectedModel.name}`,
        quantity: `${selectedQty.label}`,
        specs: `Model: ${selectedModel.name} | Speed: ${selectedTurnaround.label}`,
        price: estimatedTotal,
        notes: `Venue: ${formData.venueDelivery || 'N/A'} | Notes: ${formData.notes || 'None'}`,
      })
    } catch (err) {
      console.warn('Quote creation notice:', err.message)
      setSubmittedQuote(quotePayload)
      trackQuoteRequest({
        product: `Roll-Up Banner: ${selectedModel.name}`,
        quantity: selectedQty.value,
        value: estimatedTotal,
        currency: 'AED',
        source_page: 'rollup_banners_lead_page',
      })
      openWhatsAppDirectly({
        title: 'ROLL-UP BANNERS QUOTE INQUIRY',
        refNumber: quoteNumber,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company: formData.company || 'N/A',
        product: `Roll-Up Banner: ${selectedModel.name}`,
        quantity: `${selectedQty.label}`,
        price: estimatedTotal,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const breadcrumbs = [
    { name: 'Services', url: '/services' },
    { name: 'Rollup Banners Dubai', url: '/services/rollup-banners' },
    { name: 'Rollup Quote', url: '/quote/rollup-banners' },
  ]

  return (
    <div className="bg-[#101D35] text-slate-200">
      <SEOHead
        title="Rollup Banner Printing Dubai | Pull-Up Stands Quote & Same-Day Dispatch | ONPRINT"
        description="Instant custom roll-up banner printing quote in Dubai. 85x200cm standard, luxury teardrop, wide exhibition stands & desktop banners with anti-curl greyback film and carry bag."
        keywords="rollup banner printing dubai, roll up banners uae, pull up banner quote dubai, exhibition banner stands dubai, same day banner printing dubai"
        canonicalPath="/quote/rollup-banners"
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#101D35] text-white pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-[#28395A]">
        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65] bg-[#D4AF65]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Exhibition &amp; Display Pressroom • Al Quoz, Dubai</span>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                Roll-Up Banner Printing{' '}
                <span className="font-serif italic text-[#D4AF65]">Engineered for Events</span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Configure your pull-up exhibition stands with 300 GSM anti-curl greyback blockout film, heavy-duty aluminum cassettes, and padded carry bags. Same-day express dispatch across Dubai and DWTC.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF65]" />
                  1440 DPI Photographic UV Print
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF65]" />
                  Anti-Curl Stoplight Greyback Film
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF65]" />
                  Same-Day Express DWTC Delivery
                </span>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Main Interactive Configurator & Lead Form */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Spec Selector */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Banner Model Selection */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">
                      STEP 1
                    </span>
                    <h2 className="font-serif text-lg font-bold text-slate-900">
                      Choose Your Banner Stand Model
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {BANNER_MODELS.length} Models Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {BANNER_MODELS.map((model) => {
                    const isSelected = selectedModel.id === model.id
                    return (
                      <div
                        key={model.id}
                        onClick={() => setSelectedModel(model)}
                        className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                          isSelected
                            ? 'border-[#D4AF65] bg-[#D4AF65]/10 shadow-sm ring-1 ring-[#D4AF65]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                            {model.tag}
                          </span>
                          <span className="text-xs font-bold text-[#D4AF65]">Custom Quote</span>
                        </div>
                        <h3 className="mt-2.5 font-bold text-xs text-slate-900 leading-snug">
                          {model.name}
                        </h3>
                        <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                          {model.description}
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-600">
                          <span>{model.specs[0]}</span>
                          <span className="text-[#D4AF65]">{model.badge}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Step 2: Quantity Selection */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">
                    STEP 2
                  </span>
                  <h2 className="font-serif text-lg font-bold text-slate-900">
                    Select Order Volume &amp; Quantity
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {QUANTITY_OPTIONS.map((qty) => {
                    const isSelected = selectedQty.value === qty.value
                    const unitEst = Math.round(
                      (selectedModel.basePrice * qty.multiplier) / qty.value
                    )
                    return (
                      <button
                        key={qty.value}
                        type="button"
                        onClick={() => setSelectedQty(qty)}
                        className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#D4AF65] bg-[#D4AF65]/10 shadow-xs ring-1 ring-[#D4AF65]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">{qty.label}</div>
                        <div className="text-[11px] font-semibold text-[#D4AF65] mt-0.5">
                          ~AED {unitEst} / unit
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 3: Turnaround Selection */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">
                    STEP 3
                  </span>
                  <h2 className="font-serif text-lg font-bold text-slate-900">
                    Select Turnaround &amp; Urgency
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {TURNAROUND_OPTIONS.map((turn) => {
                    const isSelected = selectedTurnaround.id === turn.id
                    return (
                      <div
                        key={turn.id}
                        onClick={() => setSelectedTurnaround(turn)}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                          isSelected
                            ? 'border-[#D4AF65] bg-[#D4AF65]/10 shadow-xs ring-1 ring-[#D4AF65]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#D4AF65] bg-[#D4AF65]' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="text-xs font-bold text-slate-900">{turn.label}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-600">
                          {turn.surcharge === 0 ? 'Included' : `+AED ${turn.surcharge}`}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Instant Live Estimate & Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">
                    INSTANT PRICING ESTIMATE
                  </span>
                  <h3 className="font-serif text-xl font-bold text-slate-900 mt-1">
                    Your Specification Summary
                  </h3>
                </div>

                <div className="space-y-2.5 py-4 border-b border-slate-100 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Banner Stand:</span>
                    <span className="font-bold text-slate-800 text-right">{selectedModel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quantity:</span>
                    <span className="font-bold text-slate-800">{selectedQty.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Media Substrate:</span>
                    <span className="font-bold text-slate-800">300 GSM Anti-Curl Greyback</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Turnaround Speed:</span>
                    <span className="font-bold text-slate-800">{selectedTurnaround.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Accessories:</span>
                    <span className="font-bold text-emerald-700">Padded Bag Included</span>
                  </div>
                </div>

                <div className="py-4 border-b border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Estimated Subtotal:
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#D4AF65]">
                      AED {estimatedTotal}
                    </span>
                    <div className="text-[10px] text-slate-400">Excl. 5% UAE VAT</div>
                  </div>
                </div>

                {/* Form or Submitted State */}
                {submittedQuote ? (
                  <div className="pt-4 space-y-4 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-slate-900">
                        Specification Dispatched!
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Reference: <strong className="text-[#D4AF65] font-mono">{submittedQuote.orderNumber || submittedQuote.quoteNumber}</strong>
                      </p>
                    </div>

                    <a
                      href={getWhatsAppUrl({
                        title: 'ROLL-UP BANNERS QUOTE INQUIRY',
                        refNumber: submittedQuote.orderNumber || submittedQuote.quoteNumber,
                        name: formData.name,
                        phone: formData.phone,
                        email: formData.email,
                        company: formData.company || 'N/A',
                        product: `Roll-Up Banner: ${selectedModel.name}`,
                        quantity: `${selectedQty.label}`,
                        price: estimatedTotal,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-3.5 px-6 text-xs font-bold text-white shadow-sm transition-all w-full cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-white" />
                      <span>Chat with Estimator ({FORMATTED_PHONE})</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setSubmittedQuote(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Edit specifications
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="pt-4 space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-[#D4AF65]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF65] focus:ring-1 focus:ring-[#D4AF65] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Phone / WhatsApp <span className="text-[#D4AF65]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+971 50 123 4567"
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF65] focus:ring-1 focus:ring-[#D4AF65] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address <span className="text-[#D4AF65]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@company.ae"
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF65] focus:ring-1 focus:ring-[#D4AF65] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Company / Exhibitor"
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF65] focus:ring-1 focus:ring-[#D4AF65] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Exhibition / Venue (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.venueDelivery}
                          onChange={(e) => setFormData({ ...formData, venueDelivery: e.target.value })}
                          placeholder="e.g. DWTC Hall 4, DIFC..."
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF65] focus:ring-1 focus:ring-[#D4AF65] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Artwork Notes or Special Instructions
                      </label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="e.g. We have high-res PDF ready, need delivery by Thursday 2 PM..."
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF65] focus:ring-1 focus:ring-[#D4AF65] outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-[#D4AF65] hover:bg-[#B89245] py-3.5 px-6 text-xs font-bold uppercase tracking-wider text-[#101D35] shadow-md shadow-[#D4AF65]/25 transition-all hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? 'Submitting Specifications…' : 'Submit Specification & Get Official Quote →'}
                    </button>

                    <p className="text-center text-[11px] text-slate-400">
                      Direct WhatsApp copy created automatically. Free file pre-flight check included.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Production Standards Section */}
      <section className="py-14 sm:py-16 bg-white border-t border-slate-200">
        <Container className="max-w-5xl">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">
              LARGE FORMAT ENGINEERING
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Roll-Up Banner Technical Standards in Dubai
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
              Built to withstand multi-day exhibitions, bright venue halogen lights, and high-traffic event environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[#D4AF65]/10 text-[#D4AF65] mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Anti-Curl Stoplight Film</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                300 GSM multi-layered composite PET media with an opaque greyback layer that prevents backside halogen lights from bleeding through.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[#D4AF65]/10 text-[#D4AF65] mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">1440 DPI Japanese Inkjet Precision</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Micro-piezo printheads deliver razor-sharp typography down to 6pt text and rich solid brand Pantone colors without banding.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[#D4AF65]/10 text-[#D4AF65] mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Al Quoz Express Turnaround</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Direct in-house assembly in central Dubai. Urgent same-day rush orders delivered directly to your booth at DWTC, Expo City, or DIFC.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
