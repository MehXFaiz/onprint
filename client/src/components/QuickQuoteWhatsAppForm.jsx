import React, { useState } from 'react'
import {
  Send,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Phone,
  Mail,
  Sparkles,
  Layers,
  Clock,
  ShieldCheck,
  HelpCircle,
  FileText
} from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import {
  WHATSAPP_PHONE,
  FORMATTED_PHONE,
  openWhatsAppDirectly,
  resolveServiceKey,
  getServiceWhatsAppUrl
} from '../utils/whatsapp'
import {
  trackQuoteFormStart,
  trackQuoteRequest,
  trackWhatsAppClick,
  trackBusinessCardWhatsAppClick,
  trackStickerWhatsAppClick,
  trackArtworkUpload
} from '../utils/analytics'
import { createQuote } from '../services/quotes'
import { uploadArtwork } from '../services/uploadService'

const CATEGORIES = [
  { id: 'business-cards', label: 'Business Cards (350–700 GSM)', defaultSize: '90 × 55 mm Standard', defaultFinish: 'Matte Lamination' },
  { id: 'stickers', label: 'Stickers & Product Labels', defaultSize: '50 × 50 mm Die-Cut', defaultFinish: 'Waterproof Vinyl' },
  { id: 'stamps', label: 'Company Stamps & Legal Seals', defaultSize: '40 mm Round / Standard', defaultFinish: 'Self-Inking Austrian Casing' },
  { id: 'flyers', label: 'Flyers & Leaflets (A5 / A4 / DL)', defaultSize: 'A5 (148 × 210 mm)', defaultFinish: '170 GSM Coated Silk' },
  { id: 'brochures', label: 'Brochures & Catalogs (Bi-Fold / Tri-Fold)', defaultSize: 'A4 Bi-Fold / Tri-Fold', defaultFinish: '250 GSM Cover + Matte' },
  { id: 'rollup-banners', label: 'Roll-Up Banners & Displays', defaultSize: '85 × 200 cm Aluminum Stand', defaultFinish: 'Anti-Curl Polypropylene' },
  { id: 'stationery', label: 'Business Stationery (Letterheads / Envelopes)', defaultSize: 'A4 Letterhead / DL Envelope', defaultFinish: '120 GSM Prestige Bond' },
  { id: 'bottle-printing', label: 'Custom Water Bottles & Drinkware', defaultSize: '500ml Thermal Stainless', defaultFinish: 'Rotary UV / Laser Engraved' },
  { id: 'general', label: 'Other Custom Commercial Printing', defaultSize: 'Custom Dimensions', defaultFinish: 'Custom Substrate & Finish' },
]

const POPULAR_LOCATIONS = [
  'Dubai — DIFC & Downtown',
  'Dubai — Business Bay & Al Quoz',
  'Dubai — JLT & Dubai Marina',
  'Dubai — Deira & Bur Dubai',
  'Abu Dhabi & Al Ain',
  'Sharjah & Ajman',
  'Ras Al Khaimah & Fujairah',
  'UAE-Wide Express Doorstep Delivery',
]

const QUICK_QUANTITIES = [100, 250, 500, 1000, 2500, 5000]

export default function QuickQuoteWhatsAppForm({
  initialCategory = 'business-cards',
  initialQuantity = '100',
  productName = '',
  onSuccess,
  className = '',
}) {
  const [category, setCategory] = useState(initialCategory)
  const [quantity, setQuantity] = useState(initialQuantity)
  const [size, setSize] = useState('')
  const [materialFinish, setMaterialFinish] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState(POPULAR_LOCATIONS[0])
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [artworkFiles, setArtworkFiles] = useState([])
  const [uploadedArtworkUrls, setUploadedArtworkUrls] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedResult, setGeneratedResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleStart = () => {
    if (!hasStarted) {
      setHasStarted(true)
      trackQuoteFormStart({
        form_name: 'quick_quote_whatsapp_form',
        product_name: productName || category,
        button_location: 'quick_quote_form',
      })
    }
  }

  const handleCategoryChange = (e) => {
    handleStart()
    const newCatId = e.target.value
    setCategory(newCatId)
    const match = CATEGORIES.find((c) => c.id === newCatId)
    if (match) {
      if (!size) setSize(match.defaultSize)
      if (!materialFinish) setMaterialFinish(match.defaultFinish)
    }
  }

  const handleFileChange = async (e) => {
    handleStart()
    const selected = Array.from(e.target.files || [])
    if (selected.length === 0) return

    const ALLOWED = ['.pdf', '.ai', '.eps', '.psd', '.tiff', '.tif', '.jpg', '.jpeg', '.png', '.zip']
    const MAX_BYTES = 50 * 1024 * 1024
    const valid = []
    const invalid = []
    const oversized = []

    selected.forEach((f) => {
      const ext = `.${f.name.split('.').pop().toLowerCase()}`
      if (!ALLOWED.includes(ext)) {
        invalid.push(f.name)
      } else if (f.size > MAX_BYTES) {
        oversized.push(f.name)
      } else {
        valid.push(f)
      }
    })

    if (invalid.length > 0 || oversized.length > 0) {
      const msgParts = []
      if (invalid.length > 0) {
        msgParts.push(`Unsupported format (${invalid.join(', ')}). Allowed: PDF, AI, EPS, PSD, TIFF, JPG, PNG, ZIP.`)
      }
      if (oversized.length > 0) {
        msgParts.push(`Exceeds 50MB (${oversized.join(', ')}). You can attach large files directly in WhatsApp chat.`)
      }
      setErrors((prev) => ({ ...prev, artwork: msgParts.join(' ') }))
    } else {
      setErrors((prev) => ({ ...prev, artwork: undefined }))
    }

    if (valid.length === 0) return

    setArtworkFiles((prev) => [...prev, ...valid])
    trackArtworkUpload({ file_count: valid.length, source_page: 'quick_quote_whatsapp_form' })

    setIsUploading(true)
    try {
      const res = await uploadArtwork(valid)
      if (res?.urls) {
        setUploadedArtworkUrls((prev) => [...prev, ...res.urls])
      }
    } catch (err) {
      console.warn('Artwork upload note (files can still be sent via WhatsApp):', err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const removeArtworkFile = (index) => {
    setArtworkFiles((prev) => prev.filter((_, i) => i !== index))
    setUploadedArtworkUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const validate = () => {
    const errs = {}
    if (!category) errs.category = 'Please choose a product category.'
    if (!quantity || parseInt(quantity, 10) < 1) {
      errs.quantity = 'Please specify a valid quantity of 1 or more.'
    }
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    handleStart()

    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setIsSubmitting(true)

    const selectedCategory = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0]
    const resolvedProd = productName || selectedCategory.label
    const qtyNum = parseInt(quantity, 10) || 100
    const randomSeq = Math.floor(100000 + Math.random() * 900000)
    const quoteRef = `ONP-Q-${randomSeq}`

    const artworkNames = artworkFiles.map((f) => f.name).join(', ')

    // Build tailored WhatsApp message
    let tailoredWhatsAppUrl = ''
    if (category === 'business-cards') {
      tailoredWhatsAppUrl = getServiceWhatsAppUrl('business-cards', {
        productName: resolvedProd,
        quantity: qtyNum,
        material: materialFinish || '350 GSM Silk',
        finish: materialFinish || 'Matte Lamination',
        deliveryLocation: deliveryLocation || 'Dubai',
        customerName: customerName.trim() || undefined,
        notes: notes.trim() || undefined,
        refNumber: quoteRef,
        artworkStatus: artworkNames ? `${artworkNames} (uploaded / ready to attach)` : undefined,
      })
    } else if (category === 'stickers') {
      tailoredWhatsAppUrl = getServiceWhatsAppUrl('stickers', {
        stickerType: resolvedProd,
        quantity: `${qtyNum} units`,
        size: size.trim() || 'Custom Size',
        finish: materialFinish.trim() || 'Waterproof Vinyl',
        deliveryLocation: deliveryLocation || 'Dubai',
        customerName: customerName.trim() || undefined,
        notes: notes.trim() || undefined,
        refNumber: quoteRef,
        artworkStatus: artworkNames ? `${artworkNames} (uploaded / ready to attach)` : undefined,
      })
    } else if (category === 'stamps') {
      tailoredWhatsAppUrl = getServiceWhatsAppUrl('stamps', {
        stampType: resolvedProd,
        quantity: `${qtyNum} unit`,
        size: size.trim() || 'Standard Legal',
        casingBrand: materialFinish.trim() || 'Trodat / Colop Austrian Casing',
        deliveryLocation: deliveryLocation || 'Dubai',
        customerName: customerName.trim() || undefined,
        notes: notes.trim() || undefined,
        refNumber: quoteRef,
        artworkStatus: artworkNames ? `${artworkNames} (uploaded / ready to attach)` : undefined,
      })
    } else {
      tailoredWhatsAppUrl = getServiceWhatsAppUrl(category, {
        productName: resolvedProd,
        quantity: qtyNum,
        size: size.trim() || undefined,
        material: materialFinish.trim() || undefined,
        deliveryLocation: deliveryLocation || 'Dubai',
        customerName: customerName.trim() || undefined,
        notes: notes.trim() || undefined,
        refNumber: quoteRef,
        artworkStatus: artworkNames ? `${artworkNames} (uploaded / ready to attach)` : undefined,
      })
    }

    // Extract prefilled message text for user copy/preview
    let prefilledText = ''
    try {
      const parsedUrl = new URL(tailoredWhatsAppUrl)
      prefilledText = parsedUrl.searchParams.get('text') || ''
    } catch {
      prefilledText = `Hello ONPRINT, I would like a quotation for ${resolvedProd}. Quantity: ${qtyNum}. Specifications: ${size || ''} ${materialFinish || ''}. Delivery: ${deliveryLocation}. Please share pricing and options.`
    }

    // Attempt quote creation in background without blocking WhatsApp
    try {
      await createQuote({
        quoteNumber: quoteRef,
        name: customerName.trim() || 'Direct WhatsApp Inquirer',
        phone: phone.trim() || 'Via WhatsApp',
        email: 'inquiry@onprint.ae',
        productName: resolvedProd,
        quantity: qtyNum,
        specs: `Category: ${selectedCategory.label} | Size: ${size || 'Standard'} | Finish: ${materialFinish || 'Standard'} | Delivery: ${deliveryLocation}`,
        notes: notes.trim() || null,
        artworkFile: artworkNames || null,
        artworkFiles: uploadedArtworkUrls.length > 0 ? uploadedArtworkUrls : undefined,
        status: 'New',
      })
    } catch (saveErr) {
      console.warn('Quote auto-save fallback:', saveErr.message)
    }

    // Dispatch analytics (privacy-safe, zero PII)
    trackQuoteRequest({
      source_page: typeof window !== 'undefined' ? window.location.pathname : 'quick_quote_form',
      product_name: resolvedProd,
      category_name: selectedCategory.label,
      button_location: 'quick_quote_whatsapp_submit',
    })
    trackWhatsAppClick({
      source_page: typeof window !== 'undefined' ? window.location.pathname : 'quick_quote_form',
      product_name: resolvedProd,
      service_name: selectedCategory.label,
      button_location: 'quick_quote_whatsapp_submit',
      label: `quick_quote_${category}`,
    })

    if (category === 'business-cards') {
      trackBusinessCardWhatsAppClick({
        card_type: resolvedProd,
        quantity: qtyNum,
        paper_stock: materialFinish,
        button_location: 'quick_quote_whatsapp_submit',
        source_page: typeof window !== 'undefined' ? window.location.pathname : 'quick_quote_form',
      })
    } else if (category === 'stickers') {
      trackStickerWhatsAppClick({
        sticker_type: resolvedProd,
        quantity: qtyNum,
        button_location: 'quick_quote_whatsapp_submit',
        source_page: typeof window !== 'undefined' ? window.location.pathname : 'quick_quote_form',
      })
    }

    setGeneratedResult({
      refNumber: quoteRef,
      productName: resolvedProd,
      quantity: qtyNum,
      whatsappUrl: tailoredWhatsAppUrl,
      prefilledText,
    })

    setIsSubmitting(false)

    // Open WhatsApp directly
    openWhatsAppDirectly(tailoredWhatsAppUrl, { allowSameTabFallback: true })

    if (onSuccess) onSuccess()
  }

  const handleCopy = () => {
    if (generatedResult?.prefilledText) {
      navigator.clipboard?.writeText(generatedResult.prefilledText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div
      className={`rounded-3xl border border-[#203357] bg-[#172644] p-5 sm:p-7 shadow-2xl text-[#F5F2EB] ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-[#203357]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#D4AF65]">
              Instant WhatsApp Quotation
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-black text-[#F5F2EB] mt-1">
            Get Your Official Print Quote in &lt;15 Mins
          </h3>
          <p className="text-xs sm:text-sm text-[#B0BECE] mt-0.5">
            Fill the details below to generate a prefilled message tailored to your project. Review it before sending on WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101D35] border border-[#203357] text-[11px] text-[#B0BECE] shrink-0">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Verified Pressroom: <strong>{FORMATTED_PHONE}</strong></span>
        </div>
      </div>

      {/* Result Status Card if Submitted */}
      {generatedResult ? (
        <div className="mt-6 space-y-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 p-5 text-[#F5F2EB]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Inquiry Prepared (Ref #{generatedResult.refNumber})</span>
            </div>
            <span className="text-[10px] text-emerald-200/80 bg-emerald-900/50 px-2 py-0.5 rounded">
              WhatsApp Ready
            </span>
          </div>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            WhatsApp has been launched with your exact requirements for <strong>{generatedResult.productName}</strong> ({generatedResult.quantity} units). If WhatsApp didn't open automatically on your browser or device, click the button below:
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <a
              href={generatedResult.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-5 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <WhatsAppIcon className="h-4.5 w-4.5 fill-white shrink-0" />
              <span>Open WhatsApp Chat Now</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#203357] bg-[#101D35] px-4 py-3 text-xs font-bold text-[#F5F2EB] hover:bg-[#203357] transition-all cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-[#D4AF65]" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Inquiry Message'}</span>
            </button>
          </div>

          {/* Alternative Contact Channels */}
          <div className="pt-3 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200/90">
            <span>Alternative ways to reach our Al Quoz pressroom:</span>
            <div className="flex items-center gap-3 font-semibold">
              <a href={`tel:+${WHATSAPP_PHONE}`} className="hover:text-white flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-[#D4AF65]" />
                <span>Call {FORMATTED_PHONE}</span>
              </a>
              <a href="mailto:0nprint183@gmail.com" className="hover:text-white flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-[#D4AF65]" />
                <span>0nprint183@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* The Quick Quote Form */
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* 1. Category & Quantity in 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quote-category" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-1.5">
                1. Product Category <span className="text-red-400">*</span>
              </label>
              <select
                id="quote-category"
                value={category}
                onChange={handleCategoryChange}
                className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-3 text-xs sm:text-sm font-semibold text-[#F5F2EB] focus:border-[#D4AF65] focus:outline-none focus:ring-1 focus:ring-[#D4AF65]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#101D35] text-[#F5F2EB]">
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-[11px] text-red-400 mt-1">{errors.category}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="quote-quantity" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                  2. Quantity (Units) <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-[#B0BECE]">Tier discounts apply</span>
              </div>
              <input
                id="quote-quantity"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onFocus={handleStart}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 500"
                className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs sm:text-sm font-bold text-[#F5F2EB] focus:border-[#D4AF65] focus:outline-none focus:ring-1 focus:ring-[#D4AF65]"
              />
              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {QUICK_QUANTITIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => { handleStart(); setQuantity(String(q)) }}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                      String(quantity) === String(q)
                        ? 'bg-[#D4AF65] text-[#101D35]'
                        : 'border border-[#203357] bg-[#101D35] text-[#B0BECE] hover:border-[#D4AF65] hover:text-[#F5F2EB]'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              {errors.quantity && <p className="text-[11px] text-red-400 mt-1">{errors.quantity}</p>}
            </div>
          </div>

          {/* 2. Dimensions & Material / Finish */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quote-size" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-1.5">
                3. Size or Dimensions (Optional)
              </label>
              <input
                id="quote-size"
                type="text"
                value={size}
                onFocus={handleStart}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 90x55mm, 50x50mm, 85x200cm, A5..."
                className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F2EB] placeholder:text-slate-500 focus:border-[#D4AF65] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="quote-material" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-1.5">
                4. Paper, Material &amp; Finishes (Optional)
              </label>
              <input
                id="quote-material"
                type="text"
                value={materialFinish}
                onFocus={handleStart}
                onChange={(e) => setMaterialFinish(e.target.value)}
                placeholder="e.g. 400 GSM Matte, 24K Gold Foil, Spot UV, Vinyl..."
                className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F2EB] placeholder:text-slate-500 focus:border-[#D4AF65] focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Delivery Location */}
          <div>
            <label htmlFor="quote-location" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-1.5">
              5. Delivery Location in UAE
            </label>
            <select
              id="quote-location"
              value={deliveryLocation}
              onChange={(e) => { handleStart(); setDeliveryLocation(e.target.value) }}
              className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#F5F2EB] focus:border-[#D4AF65] focus:outline-none"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc} className="bg-[#101D35] text-[#F5F2EB]">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Optional Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quote-name" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-1.5">
                Your Name <span className="text-[10px] text-slate-400 lowercase">(optional)</span>
              </label>
              <input
                id="quote-name"
                type="text"
                value={customerName}
                onFocus={handleStart}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ahmed / Sarah"
                className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F2EB] placeholder:text-slate-500 focus:border-[#D4AF65] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="quote-phone" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-1.5">
                Phone / WhatsApp <span className="text-[10px] text-slate-400 lowercase">(optional callback)</span>
              </label>
              <input
                id="quote-phone"
                type="tel"
                value={phone}
                onFocus={handleStart}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F2EB] placeholder:text-slate-500 focus:border-[#D4AF65] focus:outline-none"
              />
            </div>
          </div>

          {/* 5. Artwork Upload & Explanation */}
          <div className="rounded-2xl border border-dashed border-[#203357] bg-[#101D35]/60 p-4">
            <div className="flex flex-col min-[420px]:flex-row items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF65] block">
                  Artwork Upload (Optional)
                </span>
                <p className="text-[11px] text-[#B0BECE] mt-0.5">
                  Supported formats: PDF, AI, EPS, PSD, TIFF, JPG, PNG, ZIP (Max 50MB).
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[10.5px] text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>You can also attach files directly in WhatsApp chat once opened.</span>
                </div>
              </div>

              <label className="shrink-0 inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-[#203357] bg-[#172644] hover:bg-[#203357] px-3.5 py-2 text-xs font-bold text-[#F5F2EB] transition-colors cursor-pointer">
                <Upload className="h-3.5 w-3.5 text-[#D4AF65]" />
                <span>{isUploading ? 'Uploading...' : 'Choose File'}</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.ai,.eps,.psd,.tiff,.tif,.jpg,.jpeg,.png,.zip"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {errors.artwork && (
              <p className="mt-2 text-[11px] font-semibold text-red-400" role="alert">
                {errors.artwork}
              </p>
            )}

            {artworkFiles.length > 0 && (
              <div className="mt-2.5 pt-2 border-t border-[#203357] space-y-1.5">
                {artworkFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 text-[11px] text-slate-300">
                    <span className="truncate">📄 {f.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-emerald-400 font-semibold">Attached ✓</span>
                      <button
                        type="button"
                        onClick={() => removeArtworkFile(i)}
                        aria-label={`Remove ${f.name}`}
                        className="rounded px-1.5 py-0.5 text-[10px] font-bold text-red-300 hover:bg-red-500/20 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. Additional Requirements */}
          <div>
            <label htmlFor="quote-notes" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-1.5">
              Additional Requirements or Deadline urgency (Optional)
            </label>
            <textarea
              id="quote-notes"
              rows={2}
              value={notes}
              onFocus={handleStart}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Need same-day turnaround for DWTC exhibition, single/double sided, custom Pantone code..."
              className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs text-[#F5F2EB] placeholder:text-slate-500 focus:border-[#D4AF65] focus:outline-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] px-6 py-4 text-sm sm:text-base font-black text-white shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <WhatsAppIcon className="h-5 w-5 fill-white shrink-0" />
              <span>{isSubmitting ? 'Preparing WhatsApp Message...' : 'Send Inquiry on WhatsApp'}</span>
            </button>

            <p className="text-center text-[11px] text-[#B0BECE] mt-2.5">
              Instant click-to-chat opens with your specifications prefilled. You review and click Send in WhatsApp.
            </p>
          </div>
        </form>
      )}
    </div>
  )
}
