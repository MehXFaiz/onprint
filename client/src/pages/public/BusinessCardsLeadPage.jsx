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
import { trackGetQuoteClick, trackProductInquiry, trackWhatsAppClick, trackBusinessCardWhatsAppClick, trackQuoteRequest, trackQualifiedLead, trackArtworkUpload } from '../../utils/analytics'
import { openWhatsAppDirectly, getWhatsAppUrl, getServiceWhatsAppUrl, formatBusinessCardInquiry, WHATSAPP_PHONE, FORMATTED_PHONE } from '../../utils/whatsapp'

const CARD_OPTIONS = [
  {
    id: 'standard-silk',
    name: '350 GSM Silk / Smooth Matte',
    tag: 'Popular Standard',
    badge: 'Same-Day / 24h',
    pricePer100: 'Custom Quote',
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
    pricePer100: 'Custom Quote',
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
    pricePer100: 'Custom Quote',
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
    pricePer100: 'Custom Quote',
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
    pricePer100: 'Custom Quote',
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
    pricePer100: 'Custom Quote',
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
  const [deliveryLocation, setDeliveryLocation] = useState('Dubai, UAE')
  const [artworkFile, setArtworkFile] = useState(null)
  const [formError, setFormError] = useState('')

  const handleArtworkChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 50 * 1024 * 1024) {
        setFormError('File size exceeds 50MB limit. Please upload a smaller file or send via WhatsApp.')
        return
      }
      setArtworkFile(file)
      setFormError('')
      trackArtworkUpload({ file_count: 1, source_page: 'business_cards_lead_page' })
    }
  }

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

    const msg = formatBusinessCardInquiry({
      quantity: selectedQty.label,
      material: selectedCard.name,
      finish: addonLabels || 'Standard Clean Cut',
      location: deliveryLocation || 'Dubai, UAE',
      artwork: artworkFile,
      name: formData.name.trim() || undefined,
      company: formData.company.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    })

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setFormError('Please enter your full name, phone / WhatsApp number, and email address.')
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
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        productName: `Business Cards: ${selectedCard.name}`,
        quantity: selectedQty.value,
        totalPrice: estimatedTotal,
        specs: `Stock: ${selectedCard.name} | Finishes: ${addonLabels || 'None'} | Turnaround: ${selectedTurnaround.label} | Location: ${deliveryLocation}${artworkFile ? ` | Artwork: ${artworkFile.name}` : ''}`,
        notes: formData.notes,
        status: 'New',
      }

      const res = await createQuote(quotePayload)
      const finalQuote = res || quotePayload
      setSubmittedQuote(finalQuote)

      trackQuoteRequest({
        product: `Business Cards: ${selectedCard.name}`,
        quantity: selectedQty.value,
        value: estimatedTotal,
        currency: 'AED',
        source_page: 'business_cards_lead_page',
      })

      trackQualifiedLead({
        lead_type: 'business_card_quote',
        product_name: `Business Cards: ${selectedCard.name}`,
        quantity: selectedQty.value,
        material: selectedCard.name,
        finish: addonLabels || 'Standard Clean Cut',
        has_artwork: Boolean(artworkFile),
        delivery_location: deliveryLocation,
        estimated_value: estimatedTotal,
        source_page: 'business_cards_lead_page',
      })

      const refNo = finalQuote.orderNumber || finalQuote.quoteNumber || 'PENDING'
      const inquiryMsg = formatBusinessCardInquiry({
        quantity: selectedQty.label,
        material: selectedCard.name,
        finish: addonLabels || 'Standard Clean Cut',
        location: deliveryLocation,
        artwork: artworkFile,
        name: formData.name,
        company: formData.company,
        notes: formData.notes,
      })
      const fullUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
        `${inquiryMsg}\n\n• Quote Reference: ${refNo}`
      )}`
      openWhatsAppDirectly(fullUrl, { allowSameTabFallback: true })
    } catch (err) {
      console.error('Quote submission error:', err)
      const fallbackOrderNum = `ONP-2026-${Math.floor(100000 + Math.random() * 900000)}`
      setSubmittedQuote({
        orderNumber: fallbackOrderNum,
        name: formData.name,
      })
      const inquiryMsg = formatBusinessCardInquiry({
        quantity: selectedQty.label,
        material: selectedCard.name,
        finish: addonLabels || 'Standard Clean Cut',
        location: deliveryLocation,
        artwork: artworkFile,
        name: formData.name,
        company: formData.company,
        notes: formData.notes,
      })
      const fullUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
        `${inquiryMsg}\n\n• Quote Reference: ${fallbackOrderNum}`
      )}`
      openWhatsAppDirectly(fullUrl, { allowSameTabFallback: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#101D35] text-slate-200">
      <SEOHead
        title="Business Card Printing Dubai | Instant Custom Quote & Express UAE Delivery | ONPRINT"
        description="Configure luxury business cards in Dubai. 350-600 GSM Italian cotton, 24K hot foil, velvet soft-touch, spot UV, and painted edges with same-day express press turnaround in Al Quoz."
        keywords="business card printing dubai, luxury business cards dubai, business cards quote dubai, 600 gsm cotton business cards, foil business cards dubai, same day business card printing dubai, visiting cards dubai"
        canonicalPath="/quote/business-cards"
      />

      {/* ========================================================================= */}
      {/* 1. HERO HEADER                                                            */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-[#101D35] text-white pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-[#203357]">
        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65] bg-[#D4AF65]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Dubai's Premier Business Card Atelier • Al Quoz</span>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                Custom Business Card Printing{' '}
                <span className="font-serif italic text-[#D4AF65]">Engineered for Distinction</span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Select your paper stock, specialty finishes, and volume. Get instant pricing, 1-click WhatsApp quote dispatch, and same-day express delivery across Dubai and the UAE.
              </p>
            </Reveal>

            {/* Value Trust Badges */}
            <Reveal delay={0.18}>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Direct Al Quoz Pressroom
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-[#D4AF65]" />
                  Same-Day Express Available
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  Free Pre-Flight Artwork Check
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#D4AF65]" />
                  100% Pre-Press Proof Guarantee
                </span>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE SPEC CONFIGURATOR & DUAL CONVERSION FUNNEL                  */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-[#101D35]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Card Configurator (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Select Card Stock */}
              <div className="rounded-2xl border border-[#203357] bg-[#172644] text-[#F5F2EB] p-5 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF65] text-white text-xs font-bold">
                      1
                    </span>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F5F2EB]">
                      Choose Paper Stock &amp; Finish
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B0BECE]">
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
                            ? 'border-[#D4AF65] bg-[#D4AF65]/10 ring-2 ring-[#D4AF65]/20 shadow-xs'
                            : 'border-[#203357] bg-[#101D35] hover:border-slate-300 hover:bg-[#101D35]/50'
                        }`}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-[#203357]/80">
                            <img
                              src={card.image}
                              alt={card.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#D4AF65]">
                                {card.tag}
                              </span>
                              <span className="text-[9px] font-bold text-[#B0BECE]">
                                {card.badge}
                              </span>
                            </div>
                            <h3 className="font-bold text-xs sm:text-sm text-[#F5F2EB] line-clamp-1 mt-0.5">
                              {card.name}
                            </h3>
                            <p className="text-[11px] text-[#B0BECE] line-clamp-2 mt-0.5 leading-tight">
                              {card.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#203357] flex items-center justify-between w-full text-[11px]">
                          <span className="font-semibold text-[#B0BECE]">Custom Quote</span>
                          <span
                            className={`font-bold flex items-center gap-1 ${
                              isSelected ? 'text-[#D4AF65]' : 'text-[#B0BECE] group-hover:text-[#B0BECE]'
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
              <div className="rounded-2xl border border-[#203357] bg-[#172644] text-[#F5F2EB] p-5 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF65] text-white text-xs font-bold">
                    2
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F5F2EB]">
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
                            ? 'border-[#D4AF65] bg-[#D4AF65] text-white font-bold shadow-xs'
                            : 'border-[#203357] bg-[#101D35] text-[#F5F2EB] font-semibold hover:bg-[#101D35] hover:border-slate-300'
                        }`}
                      >
                        <span className="block text-xs sm:text-sm">{qty.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 3: Optional Add-on Enhancements */}
              <div className="rounded-2xl border border-[#203357] bg-[#172644] text-[#F5F2EB] p-5 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF65] text-white text-xs font-bold">
                      3
                    </span>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F5F2EB]">
                      Optional Specialty Finishes
                    </h2>
                  </div>
                  <span className="text-[11px] text-[#B0BECE]">Optional</span>
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
                            ? 'border-[#D4AF65] bg-[#D4AF65]/10 text-[#F5F2EB] ring-1 ring-[#D4AF65]/30'
                            : 'border-[#203357] bg-[#101D35] text-[#F5F2EB] hover:bg-[#101D35]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                              isChecked ? 'bg-[#D4AF65] border-[#D4AF65] text-white' : 'border-slate-300 bg-[#172644]'
                            }`}
                          >
                            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-bold">{addon.label}</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#D4AF65]">
                          {addon.price > 0 ? 'Custom Craft' : 'Included'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 4: Turnaround & Delivery */}
              <div className="rounded-2xl border border-[#203357] bg-[#172644] text-[#F5F2EB] p-5 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF65] text-white text-xs font-bold">
                    4
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F5F2EB]">
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
                            ? 'border-[#D4AF65] bg-[#D4AF65]/10 ring-1 ring-[#D4AF65]'
                            : 'border-[#203357] bg-[#101D35] hover:bg-[#101D35]'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF65]">
                          {option.tag}
                        </span>
                        <span className="text-xs font-bold text-[#F5F2EB] mt-1">
                          {option.label}
                        </span>
                        <span className="text-[11px] font-semibold text-[#B0BECE] mt-2">
                          {option.extra > 0 ? 'Express Priority' : 'Free Standard'}
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
              <div className="rounded-3xl border border-[#203357] bg-[#172644] text-[#F5F2EB] p-6 sm:p-8 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#203357] gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF65]">
                      CONFIGURED SPECIFICATION
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#F5F2EB] mt-0.5">
                      {selectedCard.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B0BECE]">
                      PRICING
                    </span>
                    <div className="text-xl font-black text-[#D4AF65]">
                      Quote on Request
                    </div>
                  </div>
                </div>

                {/* Specs List */}
                <div className="py-4 space-y-2 text-xs border-b border-[#203357]">
                  <div className="flex justify-between text-[#B0BECE]">
                    <span>Quantity:</span>
                    <span className="font-bold text-[#F5F2EB]">{selectedQty.label}</span>
                  </div>
                  <div className="flex justify-between text-[#B0BECE]">
                    <span>Finishes:</span>
                    <span className="font-bold text-[#F5F2EB]">
                      {selectedAddons.length > 0
                        ? selectedAddons.map((id) => FINISHING_ADDONS.find((a) => a.id === id)?.label).join(', ')
                        : 'Standard Clean Trim'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#B0BECE]">
                    <span>Turnaround:</span>
                    <span className="font-bold text-[#F5F2EB]">{selectedTurnaround.label}</span>
                  </div>
                  <div className="flex justify-between text-[#B0BECE]">
                    <span>Delivery Location:</span>
                    <span className="font-bold text-emerald-400">{deliveryLocation}</span>
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
                  <p className="text-center text-[11px] text-[#B0BECE]">
                    Direct reply from our Al Quoz print technicians within 15 minutes.
                  </p>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#203357]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#172644] px-3 text-[#B0BECE] font-bold">OR SUBMIT FORM BELOW</span>
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
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-3.5 px-5 text-xs sm:text-sm font-black text-white shadow-md transition-all cursor-pointer"
                    >
                      <WhatsAppIcon className="h-4 w-4 fill-current" />
                      <span>👉 Tap to Open WhatsApp &amp; Send to Pressroom</span>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitForm} className="space-y-3.5">
                    {formError && (
                      <div className="rounded-xl bg-red-950/60 border border-red-500/50 p-3 text-xs text-red-200">
                        {formError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-[#F5F2EB] mb-1">
                        Full Name <span className="text-[#D4AF65]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Tariq Al-Mansoor"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-[#F5F2EB] placeholder:text-[#B0BECE] focus:border-[#D4AF65] focus:ring-1 focus:ring-[#D4AF65] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#F5F2EB] mb-1">
                          Phone / WhatsApp <span className="text-[#D4AF65]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+971 50 123 4567"
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-[#F5F2EB] placeholder:text-[#B0BECE] focus:border-[#D4AF65] focus:ring-1 focus:ring-[#D4AF65] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#F5F2EB] mb-1">
                          Email Address <span className="text-[#D4AF65]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="tariq@company.ae"
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-[#F5F2EB] placeholder:text-[#B0BECE] focus:border-[#D4AF65] focus:ring-1 focus:ring-[#D4AF65] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#F5F2EB] mb-1">
                        Company Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Al Mansoor Properties"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-[#F5F2EB] placeholder:text-[#B0BECE] focus:border-[#D4AF65] focus:ring-1 focus:ring-[#D4AF65] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#F5F2EB] mb-1">
                        Special Instructions / Notes
                      </label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="e.g. Need foil on logo only, double-sided print..."
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-[#F5F2EB] placeholder:text-[#B0BECE] focus:border-[#D4AF65] focus:ring-1 focus:ring-[#D4AF65] outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#F5F2EB] mb-1">
                        Delivery Destination / UAE City <span className="text-[#D4AF65]">*</span>
                      </label>
                      <select
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-[#101D35] px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF65] focus:ring-1 focus:ring-[#D4AF65] outline-none"
                      >
                        <option value="Dubai, UAE (Express Doorstep Delivery)">Dubai, UAE (Express Doorstep Delivery)</option>
                        <option value="Abu Dhabi, UAE (Next-Day Courier)">Abu Dhabi, UAE (Next-Day Courier)</option>
                        <option value="Sharjah, UAE (Doorstep Delivery)">Sharjah, UAE (Doorstep Delivery)</option>
                        <option value="Ajman, UAE (Doorstep Delivery)">Ajman, UAE (Doorstep Delivery)</option>
                        <option value="Ras Al Khaimah, UAE">Ras Al Khaimah, UAE</option>
                        <option value="Fujairah / Umm Al Quwain, UAE">Fujairah / Umm Al Quwain, UAE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#F5F2EB] mb-1">
                        Upload Artwork (Optional)
                      </label>
                      <div className="relative rounded-xl border border-dashed border-[#203357] bg-[#101D35]/60 p-3 text-center hover:border-[#D4AF65] transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.ai,.eps,.jpg,.jpeg,.png,.zip"
                          onChange={handleArtworkChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="h-4 w-4 text-[#D4AF65]" />
                          <span className="text-xs text-[#F5F2EB] font-semibold">
                            {artworkFile ? artworkFile.name : 'Click or drag PDF, AI, EPS, or ZIP file'}
                          </span>
                          <span className="text-[10px] text-[#B0BECE]">
                            {artworkFile
                              ? `${(artworkFile.size / 1024 / 1024).toFixed(2)} MB • Click to replace`
                              : 'Up to 50MB • Free Pre-Press Inspection Included'}
                          </span>
                        </div>
                      </div>
                      {artworkFile && (
                        <button
                          type="button"
                          onClick={() => setArtworkFile(null)}
                          className="mt-1 text-[11px] text-red-400 hover:text-red-300 underline cursor-pointer"
                        >
                          Remove file
                        </button>
                      )}
                    </div>

                    <div className="rounded-xl bg-[#101D35]/80 border border-[#203357] p-2.5 text-[11px] text-[#B0BECE] leading-relaxed">
                      💡 <strong>Note on WhatsApp Inquiries:</strong> Clicking WhatsApp prepares your exact pre-filled specs. A confirmed binding quotation and delivery schedule are validated with our master pressman in Al Quoz before production starts.
                    </div>


                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-[#D4AF65] hover:bg-[#D4AF65] py-3.5 px-6 text-xs font-bold uppercase tracking-wider text-[#101D35] shadow-md shadow-[#D4AF65]/25 transition-all hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
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
      <section className="py-16 sm:py-20 bg-[#172644] border-t border-[#203357]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">
              ATELIER SUBSTRATES &amp; FINISHES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F2EB] mt-1">
              Explore Our Signature Business Card Finishes
            </h2>
            <p className="text-xs sm:text-sm text-[#B0BECE] mt-2">
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
                image: '/assets/products/business-cards/bc_embossed.jpg',
                desc: 'CNC-machined brass male/female dies press typography deep into card fibers for pure tactile beauty.',
              },
            ].map((finish, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-[#203357] bg-[#172644] text-[#F5F2EB] p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF65] hover:shadow-md"
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
                  <h3 className="font-serif text-base font-bold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">
                    {finish.title}
                  </h3>
                  <p className="text-xs text-[#B0BECE] mt-1 leading-relaxed">
                    {finish.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRE-PRESS QUALITY & ACCURACY STANDARDS                                 */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-[#101D35] border-t border-[#203357]">
        <Container className="max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF65]">
              COMMERCIAL ATELIER STANDARDS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F2EB] mt-1">
              Rigorous Quality Checks for Corporate Stationery in Dubai
            </h2>
            <p className="text-xs sm:text-sm text-[#B0BECE] mt-2 max-w-2xl mx-auto">
              Every business card run is inspected for color fidelity, dimensional accuracy, and finishing alignment before dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Free PDF Soft Proof & Pre-Flight',
                desc: 'Every file is pre-flighted for 300+ DPI resolution, CMYK color space conversion, 2mm bleed margins, and font rasterization before plates are set.',
              },
              {
                icon: Award,
                title: 'European Stock & Pantone Calibration',
                desc: 'Certified 350 to 700 GSM artboards and Italian cotton boards with calibrated digital toner density and heat-bonded foil stamping.',
              },
              {
                icon: Clock,
                title: 'Express Al Quoz Press Turnaround',
                desc: 'Direct in-house production in Al Quoz, Dubai. Urgent same-day rush options available or standard 24–48 hour delivery across all 7 Emirates.',
              },
            ].map((std, idx) => {
              const IconComp = std.icon
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#203357] bg-[#172644] text-[#F5F2EB] p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[#D4AF65]/10 text-[#D4AF65] mb-4">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#F5F2EB] mb-2">{std.title}</h3>
                    <p className="text-xs sm:text-sm text-[#B0BECE] leading-relaxed">
                      {std.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-[#203357] flex items-center gap-1.5 text-[11px] font-semibold text-[#D4AF65]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>ONPRINT Dubai Standard</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 5. BOTTOM CTA BANNER                                                      */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-16 bg-[#172644] border-t border-[#203357]">
        <Container className="text-center max-w-3xl space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F2EB]">
            Need a Custom Quantity or Bespoke Die-Line?
          </h2>
          <p className="text-xs sm:text-sm text-[#B0BECE] leading-relaxed max-w-xl mx-auto">
            Contact our Al Quoz print specialists directly on WhatsApp for immediate custom quotations, bulk enterprise discounts, and artwork pre-flight verification.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={getServiceWhatsAppUrl('business-cards')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackBusinessCardWhatsAppClick({
                  source_page: '/quote/business-cards',
                  button_location: 'bottom_section',
                  card_type: selectedCard?.name || 'Business Cards',
                  quantity: selectedQty?.label,
                  paper_stock: selectedCard?.name,
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-7 py-3.5 text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <WhatsAppIcon className="h-4 w-4 fill-current" />
              <span>Chat on WhatsApp ({FORMATTED_PHONE})</span>
            </a>
            <Button
              to="/get-a-quote"
              variant="outline"
              size="lg"
              className="!rounded-xl border-slate-300 bg-[#172644] text-[#F5F2EB] hover:bg-[#101D35] text-xs font-bold !py-3.5 !px-7 shadow-xs"
            >
              All Product Quotes →
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
