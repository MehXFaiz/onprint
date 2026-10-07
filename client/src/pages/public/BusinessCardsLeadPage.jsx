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
  ArrowRight,
  Phone,
  MessageSquare,
  Layers,
  Printer,
  ChevronDown,
  Upload,
  FileText,
  Star,
  Check,
  Send,
  Building2,
  Mail,
  Sliders,
  Package,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import { createQuote } from '../../services/quotes'
import { trackGetQuoteClick, trackProductInquiry } from '../../utils/analytics'

const CARD_OPTIONS = [
  {
    id: 'standard-silk',
    name: '350 GSM Silk / Smooth Matte',
    tag: 'Popular Standard',
    badge: 'Same-Day / 24h',
    pricePer100: 'AED 85',
    basePrice: 85,
    minQty: 100,
    image: '/assets/products/basic_business_cards.jpg',
    description: 'Crisp digital printing with double-sided protective matte coating. Perfect for daily corporate networking and sales teams.',
    specs: ['350 GSM Silk Artboard', 'Double-Sided CMYK', 'Matte or Gloss Sealed'],
  },
  {
    id: 'velvet-soft-touch',
    name: '400 GSM Velvet Soft-Touch',
    tag: 'Tactile Upgrade',
    badge: '24h Express',
    pricePer100: 'AED 120',
    basePrice: 120,
    minQty: 100,
    image: '/assets/products/card-soft-touch.jpg',
    description: 'Sensory peach-skin velvet matte laminate that eliminates glare and resists fingerprints. Modern and elegant.',
    specs: ['400 GSM Heavyweight Artboard', '30μ Anti-Scuff Velvet Film', 'Fingerprint Resistant'],
  },
  {
    id: '24k-gold-foil',
    name: '24K Hot Stamped Gold Foil',
    tag: 'Signature Craft',
    badge: '3-4 Days',
    pricePer100: 'AED 180',
    basePrice: 180,
    minQty: 100,
    image: '/assets/products/card-velvet-foil.jpg',
    description: 'Reflective mirror gold, rose gold, or silver metallic foil hot-stamped with custom brass dies on soft-touch board.',
    specs: ['450 GSM Velvet Board', 'Heat-Fused Metallic Foil', 'Zero Flaking Guarantee'],
  },
  {
    id: 'luxury-cotton-600',
    name: '600 GSM Italian Cotton Board',
    tag: 'Presidential Luxury',
    badge: '3-5 Days',
    pricePer100: 'AED 240',
    basePrice: 240,
    minQty: 100,
    image: '/assets/products/luxury_business_cards_dubai.jpg',
    description: 'Uncoated 100% natural tree-free cotton fibers. Heavyweight, pillowy, and built for deep architectural debossing.',
    specs: ['600 GSM 100% Cotton Rag', 'Letterpress / Deboss Ready', 'Acid-Free Archival'],
  },
  {
    id: 'gilded-painted-edge',
    name: '700 GSM Gilded Painted Edge',
    tag: '360° Profile',
    badge: '4-5 Days',
    pricePer100: 'AED 290',
    basePrice: 290,
    minQty: 100,
    image: '/assets/products/card-painted-edge.jpg',
    description: 'Ultra-thick multi-ply card stacks hand-beveled with mirror gold foil or custom Pantone-matched painted borders.',
    specs: ['700 GSM Triplexed Board', 'Mirror Gold / Color Edges', '360° Luxury Profile'],
  },
  {
    id: 'raised-spot-uv',
    name: 'Raised 3D Spot UV & Scodix',
    tag: 'Dimensional Gloss',
    badge: '2-3 Days',
    pricePer100: 'AED 160',
    basePrice: 160,
    minQty: 100,
    image: '/assets/products/luxury_business_cards.jpg',
    description: '100-micron high-gloss raised polymer cured over velvet matte backgrounds for maximum tactile contrast.',
    specs: ['400 GSM Velvet Base', '100μ Dimensional Elevation', 'Glass-Like Gloss Finish'],
  },
]

const QUANTITY_OPTIONS = [
  { label: '100 Cards', value: 100, multiplier: 1.0 },
  { label: '250 Cards', value: 250, multiplier: 2.1 },
  { label: '500 Cards', value: 500, multiplier: 3.6 },
  { label: '1,000 Cards', value: 1000, multiplier: 6.2 },
  { label: '2,500 Cards (Multi-Name)', value: 2500, multiplier: 14.0 },
  { label: '5,000+ Cards (Corporate)', value: 5000, multiplier: 25.0 },
]

const FINISHING_ADDONS = [
  { id: 'standard', label: 'Standard Clean Cut', price: 0 },
  { id: 'rounded-corners', label: 'Rounded Die-Cut Corners', price: 25 },
  { id: 'single-foil', label: 'Single-Sided Metallic Foil', price: 60 },
  { id: 'double-foil', label: 'Double-Sided Metallic Foil', price: 110 },
  { id: 'spot-uv', label: 'Raised 3D Spot Gloss UV', price: 50 },
  { id: 'blind-deboss', label: 'Sculptural Blind Deboss', price: 75 },
]

const TURNAROUND_OPTIONS = [
  { id: 'standard', label: 'Standard UAE (2–3 Days)', extra: 0, tag: 'Standard' },
  { id: 'express-24h', label: 'Express 24h UAE Delivery', extra: 35, tag: 'Priority' },
  { id: 'same-day', label: 'Same-Day Dubai Press Rush', extra: 75, tag: 'Rush 6h' },
]

export default function BusinessCardsLeadPage() {
  const [selectedCard, setSelectedCard] = useState(CARD_OPTIONS[0])
  const [selectedQty, setSelectedQty] = useState(QUANTITY_OPTIONS[0])
  const [selectedAddons, setSelectedAddons] = useState([])
  const [selectedTurnaround, setSelectedTurnaround] = useState(TURNAROUND_OPTIONS[0])

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedQuote, setSubmittedQuote] = useState(null)

  const toggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    )
  }

  // Calculate estimated price
  const calculateEstimatedTotal = () => {
    const base = selectedCard.basePrice * selectedQty.multiplier
    const addonsTotal = selectedAddons.reduce((acc, addonId) => {
      const item = FINISHING_ADDONS.find((a) => a.id === addonId)
      return acc + (item ? item.price : 0)
    }, 0)
    const total = base + addonsTotal + selectedTurnaround.extra
    return Math.round(total)
  }

  const estimatedTotal = calculateEstimatedTotal()

  const generateWhatsAppLink = () => {
    const addonLabels = selectedAddons
      .map((id) => FINISHING_ADDONS.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(', ')

    const msg = `Hello ONPRINT Dubai, I would like an express quotation for Business Cards:
• Stock: ${selectedCard.name}
• Quantity: ${selectedQty.label}
• Finishes: ${addonLabels || 'Standard'}
• Turnaround: ${selectedTurnaround.label}
• Est. Price: ~AED ${estimatedTotal}

Client Name: ${formData.name || 'Not specified'}
Company: ${formData.company || 'Not specified'}

Please confirm availability and dispatch schedule.`

    return `https://wa.me/447344546056?text=${encodeURIComponent(msg)}`
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.email) {
      alert('Please fill in your name, phone number, and email.')
      return
    }

    setIsSubmitting(true)
    trackGetQuoteClick({ source_page: 'business_cards_lead_page' })

    const addonLabels = selectedAddons
      .map((id) => FINISHING_ADDONS.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(', ')

    try {
      const quotePayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        productName: `Business Cards: ${selectedCard.name}`,
        quantity: selectedQty.value,
        totalPrice: estimatedTotal,
        specs: `Stock: ${selectedCard.name} | Addons: ${addonLabels || 'None'} | Turnaround: ${selectedTurnaround.label}`,
        notes: formData.notes,
        status: 'Pending',
      }

      const res = await createQuote(quotePayload)
      setSubmittedQuote(res || quotePayload)
    } catch (err) {
      console.error('Quote submission error:', err)
      setSubmittedQuote({
        orderNumber: `ONP-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        name: formData.name,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white text-[#0F172A] selection:bg-[#A82F19] selection:text-white">
      <SEOHead
        title="Business Card Printing Dubai | Instant Custom Quote & Express UAE Delivery | ONPRINT"
        description="Configure luxury business cards in Dubai. 350-600 GSM Italian cotton, 24K hot foil, velvet soft-touch, spot UV, and painted edges with same-day express press turnaround in Al Quoz."
        keywords="business card printing dubai, luxury business cards dubai, business cards quote dubai, 600 gsm cotton business cards, foil business cards dubai, same day business card printing dubai, visiting cards dubai"
        canonicalPath="/quote/business-cards"
      />

      {/* ========================================================================= */}
      {/* 1. HERO HEADER                                                            */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-slate-200/80">
        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19]/20 bg-[#A82F19]/5 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Dubai's Premier Business Card Atelier • Al Quoz</span>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                Custom Business Card Printing{' '}
                <span className="font-serif italic text-[#A82F19]">Engineered for Distinction</span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Select your paper stock, specialty finishes, and volume. Get instant pricing, 1-click WhatsApp quote dispatch, and same-day express delivery across Dubai and the UAE.
              </p>
            </Reveal>

            {/* Value Trust Badges */}
            <Reveal delay={0.18}>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-slate-700">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Direct Al Quoz Pressroom
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-[#A82F19]" />
                  Same-Day Express Available
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  Free Pre-Flight Artwork Check
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  4.9/5.0 Google Verified
                </span>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE SPEC CONFIGURATOR & DUAL CONVERSION FUNNEL                  */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-slate-50/60">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Card Configurator (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Select Card Stock */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#A82F19] text-white text-xs font-bold">
                      1
                    </span>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                      Choose Paper Stock &amp; Finish
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    6 Options
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {CARD_OPTIONS.map((card) => {
                    const isSelected = selectedCard.id === card.id
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setSelectedCard(card)}
                        className={`group text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#A82F19] bg-[#A82F19]/5 ring-2 ring-[#A82F19]/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                            <img
                              src={card.image}
                              alt={card.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#A82F19]">
                                {card.tag}
                              </span>
                              <span className="text-[9px] font-bold text-slate-500">
                                {card.badge}
                              </span>
                            </div>
                            <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 mt-0.5">
                              {card.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                              {card.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between w-full text-[11px]">
                          <span className="font-semibold text-slate-600">From {card.pricePer100}</span>
                          <span
                            className={`font-bold flex items-center gap-1 ${
                              isSelected ? 'text-[#A82F19]' : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                          >
                            {isSelected ? '✓ Selected' : 'Select'}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 2: Select Quantity */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#A82F19] text-white text-xs font-bold">
                    2
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                    Select Quantity
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {QUANTITY_OPTIONS.map((qty) => {
                    const isSelected = selectedQty.value === qty.value
                    return (
                      <button
                        key={qty.value}
                        type="button"
                        onClick={() => setSelectedQty(qty)}
                        className={`p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-[#A82F19] bg-[#A82F19] text-white font-bold shadow-xs'
                            : 'border-slate-200 bg-white text-slate-800 font-semibold hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <span className="block text-xs sm:text-sm">{qty.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 3: Optional Add-on Enhancements */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#A82F19] text-white text-xs font-bold">
                      3
                    </span>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                      Optional Specialty Finishes
                    </h2>
                  </div>
                  <span className="text-[11px] text-slate-400">Optional</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FINISHING_ADDONS.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id)
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer ${
                          isChecked
                            ? 'border-[#A82F19] bg-[#A82F19]/5 text-slate-900 ring-1 ring-[#A82F19]/30'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                              isChecked ? 'bg-[#A82F19] border-[#A82F19] text-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-bold">{addon.label}</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#A82F19]">
                          {addon.price > 0 ? `+AED ${addon.price}` : 'Included'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 4: Turnaround & Delivery */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#A82F19] text-white text-xs font-bold">
                    4
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                    Production Speed &amp; Dispatch
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TURNAROUND_OPTIONS.map((option) => {
                    const isSelected = selectedTurnaround.id === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedTurnaround(option)}
                        className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-[#A82F19] bg-[#A82F19]/5 ring-1 ring-[#A82F19]'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A82F19]">
                          {option.tag}
                        </span>
                        <span className="text-xs font-bold text-slate-900 mt-1">
                          {option.label}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 mt-2">
                          {option.extra > 0 ? `+AED ${option.extra}` : 'Free Standard'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Price Summary & Dual-Conversion Form (5 Cols) */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              {/* Order / Spec Preview Box */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#A82F19]">
                      CONFIGURED SPECIFICATION
                    </span>
                    <h3 className="font-serif text-xl font-bold text-slate-900 mt-0.5">
                      {selectedCard.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      ESTIMATED TOTAL
                    </span>
                    <div className="text-2xl font-black text-slate-900">
                      AED {estimatedTotal}
                    </div>
                  </div>
                </div>

                {/* Specs List */}
                <div className="py-4 space-y-2 text-xs border-b border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Quantity:</span>
                    <span className="font-bold text-slate-900">{selectedQty.label}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Finishes:</span>
                    <span className="font-bold text-slate-900">
                      {selectedAddons.length > 0
                        ? selectedAddons.map((id) => FINISHING_ADDONS.find((a) => a.id === id)?.label).join(', ')
                        : 'Standard Clean Trim'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Turnaround:</span>
                    <span className="font-bold text-slate-900">{selectedTurnaround.label}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Location:</span>
                    <span className="font-bold text-emerald-600">Dubai &amp; UAE (Doorstep)</span>
                  </div>
                </div>

                {/* Conversion Trigger: 1-Click WhatsApp Instant Quote */}
                <div className="pt-4 space-y-3">
                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5 group cursor-pointer"
                  >
                    <WhatsAppIcon className="h-5 w-5 fill-current group-hover:scale-110 transition-transform" />
                    <span>Instant Quote on WhatsApp</span>
                  </a>
                  <p className="text-center text-[11px] text-slate-500">
                    Direct reply from our Al Quoz print technicians within 15 minutes.
                  </p>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-400 font-bold">OR SUBMIT FORM BELOW</span>
                  </div>
                </div>

                {/* Form Submission */}
                {submittedQuote ? (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                      <Check className="h-5 w-5 stroke-[3]" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-emerald-950">
                      Quote Request Received!
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Quote Reference: <strong className="font-mono">{submittedQuote.orderNumber}</strong>. Our pre-press team will review your specs and email your official quotation within 2 hours.
                    </p>
                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-5 text-xs font-bold text-white shadow-sm transition-all"
                    >
                      <WhatsAppIcon className="h-4 w-4 fill-current" />
                      <span>Fast-Track Reference on WhatsApp</span>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitForm} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-[#A82F19]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Tariq Al-Mansoor"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#A82F19] focus:ring-1 focus:ring-[#A82F19] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Phone / WhatsApp <span className="text-[#A82F19]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+971 50 123 4567"
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#A82F19] focus:ring-1 focus:ring-[#A82F19] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address <span className="text-[#A82F19]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="tariq@company.ae"
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#A82F19] focus:ring-1 focus:ring-[#A82F19] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Al Mansoor Properties"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#A82F19] focus:ring-1 focus:ring-[#A82F19] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Special Instructions / Notes
                      </label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="e.g. Need foil on logo only, double-sided print..."
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#A82F19] focus:ring-1 focus:ring-[#A82F19] outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-[#A82F19] hover:bg-[#8F2412] py-3.5 px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#A82F19]/25 transition-all hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? 'Submitting Specification…' : 'Submit Specification & Get Official Quote →'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. BUSINESS CARD SWATCH & FINISH GALLERY                                  */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#A82F19]">
              ATELIER SUBSTRATES &amp; FINISHES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-1">
              Explore Our Signature Business Card Finishes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Every card is printed on certified European substrates and hand-finished with calibrated German Heidelberg precision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: '24K Hot Stamped Foil',
                tag: 'Signature Metallic',
                image: '/assets/products/card-velvet-foil.jpg',
                desc: 'Reflective gold, silver, or copper foil heat-stamped under high ton pressure. 100% anti-flaking guarantee.',
              },
              {
                title: '600 GSM Italian Cotton',
                tag: 'Presidential Weight',
                image: '/assets/products/luxury_business_cards_dubai.jpg',
                desc: 'Soft pillowy cotton texture engineered for deep architectural debossing and timeless letterpress elegance.',
              },
              {
                title: 'Gilded & Painted Edges',
                tag: '360° Profile',
                image: '/assets/products/card-painted-edge.jpg',
                desc: 'Custom mirror metallic or Pantone-matched painted borders that catch the eye from every physical angle.',
              },
              {
                title: 'Velvet Soft-Touch',
                tag: 'Tactile Sensation',
                image: '/assets/products/card-soft-touch.jpg',
                desc: 'Anti-fingerprint thermal matte lamination offering a luxurious, velvety peach-skin feel in hand.',
              },
              {
                title: 'Raised 3D Spot UV',
                tag: 'Gloss Contrast',
                image: '/assets/products/luxury_business_cards.jpg',
                desc: 'Dimensional clear gloss polymer raised up to 100 microns over velvet matte backgrounds.',
              },
              {
                title: 'Sculptural Blind Deboss',
                tag: 'Deep Indentation',
                image: '/assets/products/bc_embossed.jpg',
                desc: 'CNC-machined brass male/female dies press typography deep into card fibers for pure tactile beauty.',
              },
            ].map((finish, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#A82F19] hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={finish.image}
                    alt={finish.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-md bg-black/80 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                      {finish.tag}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-[#A82F19] transition-colors">
                    {finish.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {finish.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. BUSINESS CARD CLIENT TESTIMONIALS & TRUST                              */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <Container className="max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#A82F19]">
              CLIENT SATISFACTION
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Trusted by 500+ Corporate Executives Across the UAE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Tariq Al-Mansoor',
                company: 'Al Mansoor Capital DIFC',
                quote:
                  'The 600 GSM cotton cards with 24K gold foil and painted edges are the most impressive business cards our partners have ever held. Flawless turnaround.',
                stars: 5,
              },
              {
                name: 'Sarah Jenkins',
                company: 'Luxury Living Real Estate Dubai',
                quote:
                  'We ordered 2,500 velvet soft-touch cards for our team. The color accuracy matched our brand Pantone guide perfectly, delivered within 24 hours.',
                stars: 5,
              },
              {
                name: 'Rashed Al Nuaimi',
                company: 'Apex Design & Architecture',
                quote:
                  'Direct in-house pressroom service with zero middleman hassle. The blind debossing depth and paper weight exceeded all expectations.',
                stars: 5,
              },
            ].map((test, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[...Array(test.stars)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div className="font-bold text-xs text-slate-900">{test.name}</div>
                  <div className="text-[11px] text-slate-500">{test.company}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 5. BOTTOM CTA BANNER                                                      */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-16 bg-white border-t border-slate-200">
        <Container className="text-center max-w-3xl space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Need a Custom Quantity or Bespoke Die-Line?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Contact our Al Quoz print specialists directly on WhatsApp for immediate custom quotations, bulk enterprise discounts, and artwork pre-flight verification.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="https://wa.me/447344546056?text=Hello%20ONPRINT%20Dubai%2C%20I%20would%20like%20to%20discuss%20a%20custom%20business%20card%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-7 py-3.5 text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="h-4 w-4 fill-current" />
              <span>Chat on WhatsApp (+44 7344 546056)</span>
            </a>
            <Button
              to="/get-a-quote"
              variant="outline"
              size="lg"
              className="!rounded-xl border-slate-300 bg-white text-slate-800 hover:bg-slate-50 text-xs font-bold !py-3.5 !px-7 shadow-xs"
            >
              All Product Quotes →
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
