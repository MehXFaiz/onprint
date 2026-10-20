import React, { useState, useEffect } from 'react'
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
  Droplets,
  Flame,
  CheckCircle,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import { createQuote } from '../../services/quotes'
import { trackGetQuoteClick, trackProductInquiry, trackQuoteRequest } from '../../utils/analytics'
import { openWhatsAppDirectly, getWhatsAppUrl, RAW_WHATSAPP_NUMBER, FORMATTED_PHONE } from '../../utils/whatsapp'

const BOTTLE_OPTIONS = [
  {
    id: 'matte-stainless-steel',
    name: 'Matte Thermal Stainless Steel Flask (500ml)',
    tag: 'Corporate Best Seller',
    badge: '3-4 Days',
    pricePerUnit: 'Custom Quote',
    basePrice: 38,
    minQty: 20,
    image: '/assets/products/bottle_matte_thermal.jpg',
    description: 'Double-wall 304 stainless steel vacuum insulation keeping drinks cold for 24 hours. Anti-scratch powder coat finish with precision laser engraving.',
    specs: ['500ml Capacity', 'Double-Wall Vacuum 304 Steel', 'Laser Engraved or UV Print'],
  },
  {
    id: 'smart-led-temperature',
    name: 'Smart LED Temperature Flask (500ml)',
    tag: 'Tech Innovation',
    badge: '3-5 Days',
    pricePerUnit: 'Custom Quote',
    basePrice: 48,
    minQty: 15,
    image: '/assets/products/bottle_smart_led.jpg',
    description: 'Touch-activated LCD temperature display cap showing real-time water temperature. Premium matte black steel body with laser-etched monogram.',
    specs: ['Touch LCD Display Cap', 'No Charging Needed (Long-Life)', 'Precision Rotary Laser Etch'],
  },
  {
    id: 'glass-bamboo',
    name: 'Borosilicate Glass with Bamboo Lid (550ml)',
    tag: 'Eco Sustainability',
    badge: '3-4 Days',
    pricePerUnit: 'Custom Quote',
    basePrice: 42,
    minQty: 20,
    image: '/assets/products/bottle_glass_bamboo.jpg',
    description: 'High-clarity thermal shock resistant glass with natural organic bamboo screw cap and non-slip protective silicone sleeve.',
    specs: ['Borosilicate Glass Body', 'Natural Bamboo Screw Cap', 'Silicone Protective Sleeve'],
  },
  {
    id: 'aluminium-sports',
    name: 'Aluminium Sports Bottle with Carabiner (600ml)',
    tag: 'Value / Events',
    badge: '2-3 Days',
    pricePerUnit: 'Custom Quote',
    basePrice: 22,
    minQty: 30,
    image: '/assets/products/bottle_sports_aluminium.jpg',
    description: 'Ultra-lightweight food-safe single-wall aluminium with leak-proof screw cap and metal carabiner clip. Ideal for marathons, gyms, and school events.',
    specs: ['600ml Single-Wall Aluminium', 'Metal Carabiner Clip Included', 'Vibrant Screen Printing'],
  },
  {
    id: 'gym-protein-shaker',
    name: 'Ergonomic Gym Protein Shaker (700ml)',
    tag: 'Fitness & Sports',
    badge: '2-3 Days',
    pricePerUnit: 'Custom Quote',
    basePrice: 26,
    minQty: 25,
    image: '/assets/products/bottle_protein_shaker.jpg',
    description: '700ml leak-proof sports shaker with surgical-grade stainless steel wire blending ball, embossed measurement scale, and flip carry loop.',
    specs: ['700ml BPA-Free Plastic', 'Stainless Wire Whisk Ball', 'Embossed Oz/Ml Scale'],
  },
  {
    id: 'luxury-copper-flask',
    name: 'Executive Copper-Vacuum Luxury Flask (650ml)',
    tag: 'VIP Executive',
    badge: '4-5 Days',
    pricePerUnit: 'Custom Quote',
    basePrice: 55,
    minQty: 15,
    image: '/assets/products/bottle_luxury_copper.jpg',
    description: 'Flagship corporate gift drinkware. Copper-plated vacuum insulation with rose copper base, silicone handle, and metallic gold corporate branding.',
    specs: ['650ml Copper-Vacuum Core', 'Brushed Rose Copper Accents', 'Metallic Gold or Laser Etch'],
  },
]

const BRANDING_METHODS = [
  { id: 'laser-engrave', name: 'Precision Fiber Laser Engraving', tag: 'Permanent & Indelible', desc: 'Crisp metallic contrast mark that never peels or fades' },
  { id: 'rotary-uv', name: '360° Rotary UV Wraparound Printing', tag: 'Full Color Photographic', desc: 'Vibrant CMYK + White ink wrap around the cylindrical body' },
  { id: 'screen-print', name: 'Screen Printing (Pantone PMS)', tag: 'Cost-Effective Spot Color', desc: 'High-durability direct ink transfer for clean corporate logos' },
]

const QUANTITY_TIERS = [25, 50, 100, 250, 500, 1000]

export default function BottlesLeadPage() {
  const [selectedBottle, setSelectedBottle] = useState(BOTTLE_OPTIONS[0])
  const [selectedBranding, setSelectedBranding] = useState(BRANDING_METHODS[0])
  const [quantity, setQuantity] = useState(50)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [quoteNumber, setQuoteNumber] = useState('')
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    deliveryDate: 'Standard (3-5 Days)',
    notes: '',
  })

  // Calculate volume discount multiplier
  const getVolumeMultiplier = (qty) => {
    if (qty >= 1000) return 0.75
    if (qty >= 500) return 0.80
    if (qty >= 250) return 0.85
    if (qty >= 100) return 0.90
    if (qty >= 50) return 0.95
    return 1.0
  }

  const unitPrice = Math.round(selectedBottle.basePrice * getVolumeMultiplier(quantity))
  const estimatedTotal = unitPrice * quantity

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formState.name || !formState.phone) return

    setSubmitting(true)
    trackGetQuoteClick('Bottle Lead Page Instant Quote')

    const quotePayload = {
      customer_name: formState.name,
      customer_email: formState.email || 'customer@onprint.ae',
      customer_phone: formState.phone,
      company_name: formState.company || 'Private Client',
      service_type: 'Custom Bottle Printing',
      product_name: selectedBottle.name,
      quantity,
      specifications: JSON.stringify({
        bottleType: selectedBottle.name,
        brandingMethod: selectedBranding.name,
        unitPriceAED: unitPrice,
        estimatedTotalAED: estimatedTotal,
        turnaround: formState.deliveryDate,
      }),
      estimated_amount: estimatedTotal,
      notes: `Branding: ${selectedBranding.name} | Qty: ${quantity} units | Delivery: ${formState.deliveryDate} | Notes: ${formState.notes}`,
      status: 'new',
    }

    try {
      const res = await createQuote(quotePayload)
      const finalNum = res?.orderNumber || res?.quoteNumber || `ONP-BTL-${Math.floor(100000 + Math.random() * 900000)}`
      setQuoteNumber(finalNum)
      setSubmitSuccess(true)

      trackQuoteRequest({
        product: `Custom Bottles: ${selectedBottle.name}`,
        quantity,
        value: estimatedTotal,
        currency: 'AED',
        source_page: 'bottles_lead_page',
      })

      openWhatsAppDirectly({
        title: 'CUSTOM BOTTLE PRINTING QUOTE',
        refNumber: finalNum,
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        company: formState.company || 'N/A',
        product: selectedBottle.name,
        quantity: `${quantity} units`,
        specs: `Branding: ${selectedBranding.name} | Request: Official Quotation & Schedule`,
        notes: formState.notes || 'None',
      })
    } catch (err) {
      console.warn('Quote creation notice:', err.message)
      const fallbackNum = `ONP-BTL-${Math.floor(100000 + Math.random() * 900000)}`
      setQuoteNumber(fallbackNum)
      setSubmitSuccess(true)

      openWhatsAppDirectly({
        title: 'CUSTOM BOTTLE PRINTING QUOTE',
        refNumber: fallbackNum,
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        company: formState.company || 'N/A',
        product: selectedBottle.name,
        quantity: `${quantity} units`,
        specs: `Branding: ${selectedBranding.name} | Request: Official Quotation & Schedule`,
        notes: formState.notes || 'None',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const breadcrumbs = [
    { name: 'Services', url: '/services' },
    { name: 'Bottle Printing Dubai', url: '/bottle-printing-dubai' },
    { name: 'Get Bottle Quote', url: '/quote/bottles' },
  ]

  const serviceSchemaData = {
    name: 'Custom Water Bottle Printing & Laser Engraving Dubai',
    description: 'Get free instant quotes for custom printed water bottles, thermal flasks, glass bottles, and sports bottles with company logos in Dubai and UAE.',
    image: '/assets/products/bottle_matte_thermal.jpg',
  }

  return (
    <div className="py-12 sm:py-20 bg-surface-alt/30">
      <SEOHead
        title="Get Bottle Printing Quote Dubai | Water Bottles & Laser Engraving | ONPRINT"
        description="Instant custom water bottle printing quote in Dubai. Thermal stainless steel, glass bamboo bottles, aluminium sports bottles & protein shakers. Fast UAE delivery."
        keywords="bottle printing dubai, custom bottle printing dubai, water bottle printing dubai, personalized bottle printing uae, stainless steel bottle printing dubai, metal bottle engraving dubai, promotional water bottles uae, branded bottles dubai"
        canonicalPath="/quote/bottles"
        breadcrumbs={breadcrumbs}
        service={serviceSchemaData}
      />

      <Container>
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              <span>INSTANT DRINKWARE QUOTE &amp; WHATSAPP ESTIMATOR</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
              Custom Water Bottle Printing &amp; Laser Engraving in Dubai
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-4 text-base leading-relaxed text-secondary sm:text-lg">
              Calculate instant pricing for custom branded drinkware. Double-wall stainless steel thermal flasks, eco-friendly glass bottles, aluminium sports bottles, and gym shakers with precision laser etching or full-wrap UV print.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-secondary sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                Custom Quote Available
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                Low MOQ: 15–30 Units
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                Indelible Laser Engraving
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                Fast 3–5 Day UAE Delivery
              </span>
            </div>
          </Reveal>
        </div>

        {/* Interactive Calculator & Lead Form Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Product & Spec Selection */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Bottle Type Selection */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">STEP 1</span>
                  <h2 className="text-lg font-bold text-primary">Select Your Bottle Type</h2>
                </div>
                <span className="text-xs font-medium text-secondary">{BOTTLE_OPTIONS.length} Models Available</span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {BOTTLE_OPTIONS.map((bottle) => {
                  const isSelected = selectedBottle.id === bottle.id
                  return (
                    <div
                      key={bottle.id}
                      onClick={() => setSelectedBottle(bottle)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? 'border-accent bg-accent-soft/30 shadow-md ring-2 ring-accent'
                          : 'border-border bg-surface-alt/40 hover:border-accent/40 hover:bg-surface'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          {bottle.tag}
                        </span>
                        <span className="text-xs font-bold text-accent">Custom Quote</span>
                      </div>
                      <div className="mt-3 font-semibold text-sm text-primary line-clamp-1">{bottle.name}</div>
                      <p className="mt-1 text-xs text-secondary line-clamp-2">{bottle.description}</p>
                      <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-tertiary">
                        <span>MOQ: {bottle.minQty} units</span>
                        <span className="font-semibold text-accent">{bottle.badge}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Branding Method Selection */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="border-b border-border pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">STEP 2</span>
                <h2 className="text-lg font-bold text-primary">Choose Branding Technology</h2>
              </div>

              <div className="mt-6 space-y-3">
                {BRANDING_METHODS.map((method) => {
                  const isSelected = selectedBranding.id === method.id
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedBranding(method)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? 'border-accent bg-accent-soft/30 shadow-sm ring-2 ring-accent'
                          : 'border-border bg-surface-alt/30 hover:border-accent/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-primary">{method.name}</span>
                          <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                            {method.tag}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-secondary">{method.desc}</p>
                      </div>
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-accent bg-accent text-white' : 'border-neutral-300'}`}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step 3: Quantity Selection */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">STEP 3</span>
                  <h2 className="text-lg font-bold text-primary">Select Order Quantity</h2>
                </div>
                <span className="text-xs font-bold text-accent">Volume Discounts Apply</span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {QUANTITY_TIERS.map((qty) => {
                  const isSelected = quantity === qty
                  return (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setQuantity(qty)}
                      className={`flex flex-col items-center justify-center rounded-xl border py-3 transition-all ${
                        isSelected
                          ? 'border-accent bg-accent text-[#0B132B] shadow-md'
                          : 'border-border bg-surface-alt/40 text-primary hover:border-accent/40'
                      }`}
                    >
                      <span className="text-base font-extrabold">{qty}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-[#0B132B]/80 font-bold' : 'text-secondary'}`}>Units</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Estimate & Lead Capture Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 shadow-lg">
              <div className="border-b border-border pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">LIVE ORDER SUMMARY</span>
                <h3 className="text-xl font-extrabold text-primary">{selectedBottle.name}</h3>
              </div>

              {/* Price Calculation Box */}
              <div className="mt-6 rounded-xl bg-surface-alt p-4 border border-border">
                <div className="flex items-center justify-between text-xs text-secondary">
                  <span>Selected Branding:</span>
                  <span className="font-semibold text-primary">{selectedBranding.name}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-secondary">
                  <span>Selected Quantity:</span>
                  <span className="font-semibold text-primary">{quantity} Units</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-secondary">
                  <span>Pricing Status:</span>
                  <span className="font-bold text-accent">Quote on Request</span>
                </div>
                <div className="mt-4 border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">Official Quotation:</span>
                  <span className="text-xl font-black text-accent">Instant Quote on Request</span>
                </div>
                <p className="mt-1 text-[11px] text-tertiary">
                  *Formal pricing and fast turnaround schedule confirmed via WhatsApp concierge.
                </p>
              </div>

              {/* Lead Form */}
              {submitSuccess ? (
                <div className="mt-6 rounded-xl bg-green-50 p-6 text-center border border-green-200">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-green-900">Quote Request Submitted!</h4>
                  <p className="mt-1 text-xs text-green-700">
                    Quote Reference: <span className="font-mono font-bold">{quoteNumber}</span>
                  </p>
                  <p className="mt-2 text-xs text-green-600">
                    Your WhatsApp chat has opened. Our Al Quoz estimators are ready to assist.
                  </p>
                  <a
                    href={getWhatsAppUrl({
                      text: `Hello ONPRINT Dubai, I submitted quote ${quoteNumber} for ${quantity}x ${selectedBottle.name}. Please confirm pricing!`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-[#20ba5a]"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>Re-open WhatsApp Chat</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-primary">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Tariq Al Mansoori"
                      className="mt-1 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-primary placeholder-neutral-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formState.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +971 50 123 4567"
                      className="mt-1 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-primary placeholder-neutral-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary">Company / Organization (Optional)</label>
                    <input
                      type="text"
                      name="company"
                      value={formState.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Dubai Real Estate LLC"
                      className="mt-1 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-primary placeholder-neutral-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary">Project Notes or Logo Link (Optional)</label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formState.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Need single-side laser engraving with employee name list"
                      className="mt-1 w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-xs text-primary placeholder-neutral-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#20ba5a] active:scale-[0.98] disabled:opacity-50"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" />
                    <span>{submitting ? 'Generating Quote...' : 'Get Bottle Quote on WhatsApp'}</span>
                  </button>

                  <p className="text-center text-[11px] text-tertiary">
                    Instant response from our Al Quoz press studio. Free 3D photorealistic mockups provided within 2 hours.
                  </p>
                </form>
              )}

              {/* Direct Call / Email Fallback */}
              <div className="mt-6 border-t border-border pt-4 flex items-center justify-between text-xs text-secondary">
                <a href={`tel:+${RAW_WHATSAPP_NUMBER}`} className="flex items-center gap-1.5 hover:text-accent font-medium">
                  <Phone className="h-3.5 w-3.5 text-accent" />
                  <span>Call {FORMATTED_PHONE}</span>
                </a>
                <Link to="/bottle-printing-dubai" className="hover:text-accent font-semibold text-accent">
                  <span>View Specifications &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
