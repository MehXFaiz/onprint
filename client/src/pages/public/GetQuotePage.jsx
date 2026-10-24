import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  CheckCircle2,
  FileText,
  Truck,
  Sparkles,
  Layers,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import QuickQuoteWhatsAppForm from '../../components/QuickQuoteWhatsAppForm'
import { getProductBySlug } from '../../services/products'
import { getCategories } from '../../services/categories'
import { createQuote } from '../../services/quotes'
import { uploadArtwork } from '../../services/uploadService'
import { trackQuoteRequest, trackArtworkUpload, trackWhatsAppClick } from '../../utils/analytics'
import { openWhatsAppDirectly, getWhatsAppUrl, WHATSAPP_PHONE } from '../../utils/whatsapp'

const steps = ['What You Need', 'Project Details', 'Artwork Upload', 'Contact Details', 'Review & Submit']

const FINISH_OPTIONS = [
  { id: 'gold-foil', label: '24K Hot Stamped Gold Foil' },
  { id: 'silver-foil', label: 'Silver / Metallic Foil' },
  { id: 'spot-uv', label: 'Raised 3D Spot UV (Tactile)' },
  { id: 'emboss', label: 'Embossing / Blind Deboss' },
  { id: 'matte-lam', label: 'Matte Lamination' },
  { id: 'gloss-lam', label: 'High-Gloss Lamination' },
  { id: 'velvet-lam', label: 'Soft-Touch Velvet Lamination' },
  { id: 'die-cut', label: 'Custom Die-Cutting' },
  { id: 'painted-edges', label: 'Gilded / Painted Edges' },
]

const QUANTITY_PRESETS = [50, 100, 250, 500, 1000, 2500, 5000]

const DELIVERY_LOCATIONS = [
  'Dubai — DIFC & Downtown',
  'Dubai — Business Bay & Al Quoz',
  'Dubai — JLT & Dubai Marina',
  'Dubai — Deira & Bur Dubai',
  'Dubai — Palm Jumeirah & Jumeirah',
  'Abu Dhabi & Al Ain',
  'Sharjah & Ajman',
  'Ras Al Khaimah & Fujairah',
  'UAE-Wide Express Courier',
  'International Courier (GCC / Worldwide)',
]

const initialForm = {
  product: '',
  quantity: '100',
  size: '',
  material: '',
  finishes: [],
  deliveryUrgency: 'Standard (2–3 business days)',
  deliveryLocation: 'Dubai — DIFC & Downtown',
  largeFileLink: '',
  notes: '',
  name: '',
  email: '',
  phone: '+971 ',
  company: '',
}

function StepIndicator({ current }) {
  return (
    <div>
      <ol className="flex items-start">
        {steps.map((label, index) => {
          const stepNumber = index + 1
          const done = stepNumber < current
          const active = stepNumber === current
          return (
            <li key={label} className="flex flex-1 flex-col items-start last:flex-none">
              <div className="flex w-full items-center">
                <span
                  className={`flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl font-display text-[11px] sm:text-xs font-extrabold tabular-nums transition-all ${
                    done
                      ? 'bg-[#D4AF65] text-[#101D35] shadow-xs'
                      : active
                        ? 'bg-[#101D35] text-white shadow-md ring-2 ring-[#D4AF65]'
                        : 'border border-[#203357] bg-[#101D35] text-slate-400'
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3]" /> : stepNumber}
                </span>
                {stepNumber < steps.length && (
                  <span className={`mx-1 sm:mx-2 h-0.5 flex-1 transition-colors ${done ? 'bg-[#D4AF65]' : 'bg-[#203357]'}`} />
                )}
              </div>
              <span
                className={`mt-2.5 hidden text-xs font-bold sm:block ${active ? 'text-[#D4AF65]' : 'text-[#B0BECE]'}`}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
      <div className="sm:hidden text-center mt-2.5 text-xs font-bold text-[#D4AF65]">
        Step {current} of {steps.length}: {steps[current - 1]}
      </div>
    </div>
  )
}

function FieldLabel({ htmlFor, children, optional }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-bold uppercase tracking-wider text-[#F5F2EB]">
      {children} {optional && <span className="font-normal text-slate-400 lowercase">(optional)</span>}
    </label>
  )
}

const inputClasses =
  'mt-2 w-full rounded-xl border border-[#203357] bg-[#101D35] px-4 py-3 text-sm font-medium text-[#F5F2EB] placeholder:text-slate-400 transition-colors focus:border-[#D4AF65] focus:outline-none focus:ring-2 focus:ring-[#D4AF65]/20 shadow-2xs'

export default function GetQuotePage() {
  const { state } = useLocation()
  const [searchParams] = useSearchParams()

  const [quoteMode, setQuoteMode] = useState(
    searchParams.get('mode') === 'wizard' ? 'wizard' : 'quick'
  )
  const [categories, setCategories] = useState([])
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [artworkFiles, setArtworkFiles] = useState([])
  const [uploadedArtworkUrls, setUploadedArtworkUrls] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [prefillNote, setPrefillNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submittedOrder, setSubmittedOrder] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState(null)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (state?.product) {
      setForm((prev) => ({
        ...prev,
        product: state.product,
        quantity: state.quantity ? String(state.quantity) : '100',
        size: state.size || '',
        material: state.material || '',
        finishes: state.finish ? [state.finish] : [],
        notes: state.notes || '',
        deliveryLocation: state.deliveryLocation || prev.deliveryLocation,
      }))
      if (state.artworkFileName) {
        setPrefillNote(`Selected artwork: "${state.artworkFileName}" — please attach below.`)
      }
      return
    }

    const productSlug = searchParams.get('product') || searchParams.get('service')
    if (productSlug) {
      getProductBySlug(productSlug)
        .then((product) => {
          setForm((prev) => ({
            ...prev,
            product: product.name,
            quantity: String(product.minimumQuantity || 100),
          }))
        })
        .catch(() => {
          setForm((prev) => ({ ...prev, product: productSlug }))
        })
    }
  }, [searchParams, state])

  function updateField(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    }
  }

  function toggleFinish(finishLabel) {
    setForm((prev) => {
      const exists = prev.finishes.includes(finishLabel)
      const next = exists ? prev.finishes.filter((f) => f !== finishLabel) : [...prev.finishes, finishLabel]
      return { ...prev, finishes: next }
    })
  }

  function selectProduct(name) {
    setForm((prev) => ({ ...prev, product: name }))
    setErrors((prev) => (prev.product ? { ...prev, product: undefined } : prev))
  }

  async function handleFileChange(event) {
    const selected = Array.from(event.target.files || [])
    if (selected.length === 0) return

    const ALLOWED = ['.pdf', '.ai', '.eps', '.psd', '.tiff', '.tif', '.jpg', '.jpeg', '.png', '.zip']
    const valid = []
    const invalid = []

    selected.forEach((f) => {
      const ext = `.${f.name.split('.').pop().toLowerCase()}`
      if (ALLOWED.includes(ext)) {
        valid.push(f)
      } else {
        invalid.push(f.name)
      }
    })

    if (invalid.length > 0) {
      setErrors((prev) => ({
        ...prev,
        artwork: `Unsupported format (${invalid.join(', ')}). Allowed: PDF, AI, EPS, PSD, TIFF, JPG, PNG, ZIP.`,
      }))
    } else {
      setErrors((prev) => ({ ...prev, artwork: undefined }))
    }

    if (valid.length > 0) {
      setArtworkFiles((prev) => [...prev, ...valid])
      trackArtworkUpload({ file_count: valid.length, source_page: 'get_quote_wizard' })

      // Auto-upload to private artwork endpoint with progress
      setIsUploading(true)
      setUploadProgress(10)
      try {
        const res = await uploadArtwork(valid, (percent) => setUploadProgress(percent))
        if (res?.urls) {
          setUploadedArtworkUrls((prev) => [...prev, ...res.urls])
        }
      } catch (err) {
        console.warn('Artwork upload warning:', err.message)
      } finally {
        setIsUploading(false)
        setUploadProgress(100)
      }
    }
  }

  function removeFile(index) {
    setArtworkFiles((prev) => prev.filter((_, i) => i !== index))
    setUploadedArtworkUrls((prev) => prev.filter((_, i) => i !== index))
  }

  function validateStep(current) {
    const nextErrors = {}
    if (current === 1 && !form.product.trim()) {
      nextErrors.product = 'Select a category or specify your custom print requirement.'
    }
    if (current === 2) {
      if (!form.quantity || parseInt(form.quantity, 10) < 1) {
        nextErrors.quantity = 'Please enter a valid quantity of at least 1 unit.'
      }
    }
    if (current === 4) {
      if (!form.name.trim()) nextErrors.name = 'Please enter your full name.'
      if (!form.email.trim()) {
        nextErrors.email = 'Please enter your work or personal email.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        nextErrors.email = 'Please enter a valid email address.'
      }
      if (!form.phone.trim() || form.phone.trim() === '+971') {
        nextErrors.phone = 'Please enter a contact phone number for quotation follow-up.'
      }
    }
    return nextErrors
  }

  function goNext() {
    const nextErrors = validateStep(step)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setStep((s) => Math.min(s + 1, steps.length))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    if (submitting) return
    setSubmitting(true)

    const specsArray = []
    if (form.size) specsArray.push(`Size: ${form.size}`)
    if (form.material) specsArray.push(`Material: ${form.material}`)
    if (form.finishes.length > 0) specsArray.push(`Finishes: ${form.finishes.join(', ')}`)
    if (form.deliveryUrgency) specsArray.push(`Urgency: ${form.deliveryUrgency}`)
    if (form.deliveryLocation) specsArray.push(`Location: ${form.deliveryLocation}`)
    if (form.largeFileLink) specsArray.push(`Cloud Artwork Link: ${form.largeFileLink}`)
    const specs = specsArray.length > 0 ? specsArray.join(' | ') : 'Custom Studio Specifications'

    const qty = parseInt(form.quantity, 10) || 100
    let totalPrice = state?.estimatedPrice || 0
    if (!totalPrice) {
      totalPrice = Math.max(150, Math.round(qty * 3.5))
    }

    const artworkNames = artworkFiles.length > 0 ? artworkFiles.map((f) => f.name).join(', ') : null
    const artworkList = uploadedArtworkUrls.length > 0 ? uploadedArtworkUrls : (artworkNames ? [artworkNames] : [])

    const randomSeq = Math.floor(100000 + Math.random() * 900000)
    const quoteRef = `ONP-Q-${randomSeq}`

    const fallbackQuote = {
      quoteNumber: quoteRef,
      orderNumber: quoteRef,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim() || null,
      productName: form.product.trim() || 'Custom Print Job',
      quantity: qty,
      totalPrice,
      estimatedPrice: totalPrice,
      status: 'New',
      specs,
      finishes: form.finishes,
      deliveryUrgency: form.deliveryUrgency,
      deliveryLocation: form.deliveryLocation,
      notes: form.notes.trim() || null,
      artworkFile: artworkNames,
      artworkFiles: artworkList,
    }

    try {
      const newQuote = await createQuote(fallbackQuote)

      trackQuoteRequest({
        source_page: 'get_quote_wizard',
        product_name: form.product || undefined,
        category_name: form.product || undefined,
      })

      setSubmittedOrder(newQuote || fallbackQuote)
      setSubmitted(true)
      setSubmissionError(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })

      // Dispatch to WhatsApp
      openWhatsAppDirectly(
        {
          title: 'NEW COMMERCIAL PRINT QUOTATION REQUEST',
          refNumber: quoteRef,
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          company: form.company.trim() || 'Individual Client',
          product: form.product.trim() || 'Custom Print Job',
          quantity: qty,
          specs,
          price: totalPrice,
          notes: form.notes.trim() || (form.largeFileLink ? `Artwork Link: ${form.largeFileLink}` : 'None'),
          pageUrl: 'https://www.0nprint.com/get-a-quote',
        },
        { allowSameTabFallback: true }
      )
    } catch (err) {
      console.warn('Quote creation notice:', err)
      setSubmissionError('Your specifications are saved locally. Connect directly with our pressroom on WhatsApp below.')
      setSubmittedOrder(fallbackQuote)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })

      openWhatsAppDirectly(
        {
          title: 'NEW COMMERCIAL PRINT QUOTATION REQUEST',
          refNumber: quoteRef,
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          company: form.company.trim() || 'Individual Client',
          product: form.product.trim() || 'Custom Print Job',
          quantity: qty,
          specs,
          price: totalPrice,
          notes: form.notes.trim() || (form.largeFileLink ? `Artwork Link: ${form.largeFileLink}` : 'None'),
          pageUrl: 'https://www.0nprint.com/get-a-quote',
        },
        { allowSameTabFallback: true }
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    const quoteNum = submittedOrder?.quoteNumber || submittedOrder?.orderNumber || 'ONP-Q-PROCESSED'
    const prodName = submittedOrder?.productName || form.product || 'Custom Print Job'
    const orderQty = submittedOrder?.quantity ?? form.quantity ?? 100

    const directWhatsAppUrl = getWhatsAppUrl({
      title: 'COMMERCIAL QUOTATION INQUIRY',
      refNumber: quoteNum,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      company: form.company.trim() || 'Individual',
      product: prodName,
      quantity: orderQty,
      notes: form.notes.trim() || 'None',
    })

    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#101D35] border border-[#203357] text-[#D4AF65] shadow-xs">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <span className="mt-4 rounded-full bg-[#101D35] border border-[#203357] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#D4AF65]">
          Quotation Submitted &bull; Reference #{quoteNum}
        </span>
        <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-[#F5F2EB] sm:text-4xl">
          Quote Request Received!
        </h1>
        <p className="mt-3 max-w-lg text-sm text-[#B0BECE] leading-relaxed">
          Thank you, <strong className="text-[#F5F2EB]">{form.name}</strong>. Our prepress estimator in Al Quoz, Dubai has received your specifications for <strong className="text-[#F5F2EB]">{prodName}</strong>. A formal proposal will be dispatched to <strong className="text-[#F5F2EB]">{form.email}</strong>.
        </p>

        {/* WhatsApp Card */}
        <div className="mt-8 w-full max-w-lg rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-5 text-center space-y-3 shadow-xs">
          {submissionError && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/15 p-2.5 text-xs text-amber-200 text-left">
              <strong>Notice:</strong> {submissionError}
            </div>
          )}
          <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
            <WhatsAppIcon className="h-4 w-4 fill-emerald-400" />
            <span>Express WhatsApp Priority Channel</span>
          </div>
          <p className="text-xs text-emerald-200 leading-relaxed">
            Need urgent same-day turnaround or custom material consultation? Chat directly with our senior pressman on WhatsApp quoting reference <code className="font-bold text-[#D4AF65] font-mono bg-[#101D35] px-1.5 py-0.5 rounded border border-[#203357]">{quoteNum}</code>.
          </p>
          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-4 sm:px-6 py-3.5 text-xs font-black text-white shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] cursor-pointer w-full text-center"
          >
            <WhatsAppIcon className="h-4.5 w-4.5 fill-white shrink-0" />
            <span className="truncate">Chat on WhatsApp Now (Ref: {quoteNum})</span>
          </a>
        </div>

        {/* Summary Card */}
        <div className="mt-6 w-full max-w-lg rounded-2xl border border-[#203357] bg-[#101D35] p-5 text-left text-xs space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#203357] pb-2.5 gap-2">
            <span className="font-bold uppercase tracking-wider text-[#B0BECE]">Quote Reference</span>
            <span className="font-mono font-black text-[#D4AF65] text-sm break-all">{quoteNum}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#B0BECE] shrink-0">Service:</span>
            <span className="font-bold text-[#F5F2EB] text-right truncate min-w-0">{prodName}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#B0BECE] shrink-0">Quantity:</span>
            <span className="font-bold text-[#F5F2EB] text-right">{orderQty} units</span>
          </div>
          {form.finishes.length > 0 && (
            <div className="flex items-start justify-between gap-3">
              <span className="text-[#B0BECE] shrink-0">Finishes:</span>
              <span className="font-bold text-[#F5F2EB] text-right">{form.finishes.join(', ')}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#B0BECE] shrink-0">Turnaround:</span>
            <span className="font-semibold text-[#F5F2EB] text-right truncate min-w-0">{form.deliveryUrgency}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#B0BECE] shrink-0">Destination:</span>
            <span className="font-semibold text-[#F5F2EB] text-right truncate min-w-0">{form.deliveryLocation}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button to={`/track-order?order=${quoteNum}`} variant="accent" icon={false}>
            Track Production Status
          </Button>
          <Button to="/" variant="outline" icon={false}>
            Back to Storefront
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <div className="py-16 sm:py-24 bg-[#101D35] text-[#F5F2EB]">
      <SEOHead
        title="Get a Commercial Printing Quote in Dubai | Fast Pricing | ONPRINT"
        description="Request a fast custom print quotation in Dubai. Upload your print-ready artwork (PDF, AI, EPS, PSD, ZIP) and select luxury finishes, substrates, and delivery timelines across the UAE."
        keywords="printing quote dubai, custom printing quotation uae, commercial printing calculator dubai, print price quote"
        canonicalPath="/get-a-quote"
        breadcrumbs={[{ name: 'Get a Quote', url: '/get-a-quote' }]}
      />

      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: 'Get a Quote' }]} />

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#101D35] border border-[#203357] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
            ONPRINT Commercial Quote Desk
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#B0BECE]">
            <Clock className="h-3.5 w-3.5 text-[#D4AF65]" />
            <span>Same-Day Estimations</span>
          </span>
        </div>

        <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-[#F5F2EB] sm:text-4xl">
          Request a Custom Printing Quote
        </h1>
        <p className="mt-2 text-sm text-[#B0BECE]">
          From luxury business cards to corporate brochures, stickers, and custom stamps, choose between instant WhatsApp quotation or our full 5-step specification builder.
        </p>

        {/* Quote Mode Toggle Switcher */}
        <div className="mt-8 flex flex-wrap items-center justify-start gap-2 p-1.5 rounded-2xl bg-[#172644] border border-[#203357] w-fit max-w-full">
          <button
            type="button"
            onClick={() => setQuoteMode('quick')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              quoteMode === 'quick'
                ? 'bg-[#25D366] text-white shadow-md'
                : 'text-[#B0BECE] hover:text-[#F5F2EB]'
            }`}
          >
            <WhatsAppIcon className="h-4 w-4 fill-current shrink-0" />
            <span>⚡ Fast WhatsApp Quote (Instant)</span>
          </button>
          <button
            type="button"
            onClick={() => setQuoteMode('wizard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              quoteMode === 'wizard'
                ? 'bg-[#D4AF65] text-[#101D35] shadow-md'
                : 'text-[#B0BECE] hover:text-[#F5F2EB]'
            }`}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span>📋 Detailed 5-Step RFP Builder</span>
          </button>
        </div>

        {quoteMode === 'quick' ? (
          <div className="mt-8">
            <QuickQuoteWhatsAppForm
              initialCategory="business-cards"
              productName={state?.product || form.product || ''}
              initialQuantity={state?.quantity ? String(state.quantity) : form.quantity}
            />
          </div>
        ) : (
          <>
            <div className="mt-10">
              <StepIndicator current={step} />
            </div>

            <div className="mt-10 rounded-3xl border border-[#203357] bg-[#172644] p-6 sm:p-8 md:p-10 shadow-xl text-[#F5F2EB]">
          {/* Step 1: Product Selection */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-2">
                <Layers className="h-4 w-4" />
                <span>Step 1 of 5</span>
              </div>
              <h2 className="font-display text-xl font-bold text-[#F5F2EB]">1. What print item do you need?</h2>
              <p className="mt-1.5 text-xs text-[#B0BECE]">
                Choose from our popular Al Quoz pressroom products or define your bespoke requirements.
              </p>

              {categories.length > 0 && (
                <div className="mt-6 grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 sm:grid-cols-3">
                  {categories.map((c) => (
                    <button
                      key={c._id || c.id || c.slug}
                      type="button"
                      onClick={() => selectProduct(c.name)}
                      className={`rounded-xl border p-3 sm:p-3.5 text-left text-xs font-bold transition-all cursor-pointer ${
                        form.product === c.name
                          ? 'border-[#D4AF65] bg-[#101D35] text-[#D4AF65] shadow-xs ring-1 ring-[#D4AF65]'
                          : 'border-[#203357] bg-[#101D35] text-[#F5F2EB] hover:border-[#D4AF65] hover:bg-[#172644] shadow-2xs'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <FieldLabel htmlFor="product">Or specify custom project requirement</FieldLabel>
                <input
                  id="product"
                  type="text"
                  value={form.product}
                  onChange={updateField('product')}
                  placeholder="e.g. 450gsm Velvet Business Cards, Rigid Magnetic Gift Boxes, Pull-up Banners…"
                  aria-invalid={Boolean(errors.product)}
                  className={inputClasses}
                />
                {errors.product && <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.product}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Specifications, Finishes & Delivery */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                <Sparkles className="h-4 w-4" />
                <span>Step 2 of 5</span>
              </div>
              <h2 className="font-display text-xl font-bold text-[#F5F2EB]">2. Project Specifications &amp; Finishes</h2>

              {/* Quantity Preset Tiers */}
              <div>
                <FieldLabel htmlFor="quantity">Quantity Required *</FieldLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  {QUANTITY_PRESETS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, quantity: String(q) }))}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        form.quantity === String(q)
                          ? 'border-[#D4AF65] bg-[#D4AF65] text-[#101D35]'
                          : 'border-[#203357] bg-[#101D35] text-[#F5F2EB] hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      {q.toLocaleString()} units
                    </button>
                  ))}
                </div>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={updateField('quantity')}
                  placeholder="Or enter custom quantity"
                  aria-invalid={Boolean(errors.quantity)}
                  className={inputClasses}
                />
                {errors.quantity && <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.quantity}</p>}
              </div>

              {/* Size & Substrate */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="size" optional>Dimensions / Size Specs</FieldLabel>
                  <input
                    id="size"
                    type="text"
                    value={form.size}
                    onChange={updateField('size')}
                    placeholder="e.g. EU 85x55mm, US 90x50mm, A4, 20x30cm"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="material" optional>Paper / Substrate Stock</FieldLabel>
                  <input
                    id="material"
                    type="text"
                    value={form.material}
                    onChange={updateField('material')}
                    placeholder="e.g. 350gsm Silk, 450gsm Velvet, 600gsm Cotton"
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Finishing Checkboxes */}
              <div>
                <FieldLabel optional>Luxury Finishes &amp; Embellishments</FieldLabel>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {FINISH_OPTIONS.map((f) => {
                    const checked = form.finishes.includes(f.label)
                    return (
                      <label
                        key={f.id}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-xs font-bold transition-all cursor-pointer ${
                          checked
                            ? 'border-[#D4AF65] bg-[#101D35] text-[#D4AF65]'
                            : 'border-[#203357] bg-[#101D35] text-[#F5F2EB] hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFinish(f.label)}
                          className="h-4 w-4 rounded border-slate-300 text-[#D4AF65] focus:ring-[#D4AF65]"
                        />
                        <span>{f.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Urgency & Delivery Location */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="deliveryUrgency">Production Turnaround</FieldLabel>
                  <select
                    id="deliveryUrgency"
                    value={form.deliveryUrgency}
                    onChange={updateField('deliveryUrgency')}
                    className={inputClasses}
                  >
                    <option value="Standard (2–3 business days)">
                      Standard Production (2–3 business days)
                    </option>
                    <option value="Express Priority (24 hours)">
                      Express Priority (24 hours)
                    </option>
                    <option value="Rush Same-Day (Subject to schedule)">
                      Rush Same-Day (Subject to press capacity)
                    </option>
                  </select>
                </div>
                <div>
                  <FieldLabel htmlFor="deliveryLocation">Delivery Location / Emirate</FieldLabel>
                  <select
                    id="deliveryLocation"
                    value={form.deliveryLocation}
                    onChange={updateField('deliveryLocation')}
                    className={inputClasses}
                  >
                    {DELIVERY_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <FieldLabel htmlFor="notes" optional>Additional Project Instructions</FieldLabel>
                <textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={updateField('notes')}
                  placeholder="Specify Pantone spot colors, double-sided requirements, fold lines, or packaging instructions…"
                  className={inputClasses}
                />
              </div>
            </div>
          )}

          {/* Step 3: Artwork Upload with Validation */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-2">
                <Upload className="h-4 w-4" />
                <span>Step 3 of 5</span>
              </div>
              <h2 className="font-display text-xl font-bold text-[#F5F2EB]">3. Upload Customer Artwork</h2>
              <p className="mt-1 text-xs text-[#B0BECE]">
                Support for all industry-standard vector and prepress file formats up to 50MB. (Optional)
              </p>

              {prefillNote && <p className="mt-3 text-xs font-bold text-[#D4AF65]">{prefillNote}</p>}

              {/* File Dropzone */}
              <label
                htmlFor="artwork"
                className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#203357] bg-[#101D35] p-5 sm:p-8 text-center transition-colors hover:border-[#D4AF65] hover:bg-[#101D35]/20 shadow-2xs"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#172644] text-[#D4AF65] border border-[#203357]">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-[#F5F2EB]">Choose Artwork Files or Drag &amp; Drop</span>
                <span className="text-xs text-[#B0BECE]">
                  Allowed formats: <strong>PDF, AI, EPS, PSD, TIFF, JPG, PNG, ZIP</strong> (Max 50MB per file)
                </span>
                <input
                  id="artwork"
                  type="file"
                  multiple
                  accept=".pdf,.ai,.eps,.psd,.tiff,.tif,.jpg,.jpeg,.png,.zip"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>

              {errors.artwork && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{errors.artwork}</span>
                </div>
              )}

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="mt-4 rounded-xl border border-[#203357] bg-[#101D35] p-3">
                  <div className="flex justify-between text-xs font-semibold text-[#F5F2EB] mb-1.5">
                    <span>Uploading artwork files...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-[#D4AF65] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Attached Files List */}
              {artworkFiles.length > 0 && (
                <div className="mt-6 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B0BECE] block">
                    Attached Files ({artworkFiles.length})
                  </span>
                  <ul className="space-y-2">
                    {artworkFiles.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-xl border border-[#203357] bg-[#101D35] px-4 py-3 text-xs font-medium text-[#F5F2EB] shadow-2xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-4 w-4 text-[#D4AF65] shrink-0" />
                          <span className="truncate">{file.name}</span>
                          <span className="text-[11px] text-[#B0BECE] shrink-0">
                            ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          aria-label={`Remove ${file.name}`}
                          className="ml-3 shrink-0 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cloud WeTransfer / Dropbox fallback link */}
              <div className="mt-6 rounded-2xl border border-[#203357] bg-[#101D35] p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F5F2EB]">
                  <ExternalLink className="h-3.5 w-3.5 text-[#D4AF65]" />
                  <span>Files Exceeding 50MB?</span>
                </div>
                <p className="text-[11px] text-[#B0BECE] leading-relaxed">
                  For large multi-page catalogs, packaging dielines, or heavy print archives, please paste a shared link below from WeTransfer, Google Drive, or Dropbox:
                </p>
                <input
                  type="url"
                  value={form.largeFileLink}
                  onChange={updateField('largeFileLink')}
                  placeholder="https://we.tl/... or https://dropbox.com/..."
                  className={inputClasses}
                />
              </div>
            </div>
          )}

          {/* Step 4: Contact Information */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                <FileText className="h-4 w-4" />
                <span>Step 4 of 5</span>
              </div>
              <h2 className="font-display text-xl font-bold text-[#F5F2EB]">4. Contact Information</h2>
              <p className="text-xs text-[#B0BECE]">
                Where should we send your official quotation and pre-flight digital proof?
              </p>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="name">Full Name *</FieldLabel>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={updateField('name')}
                    placeholder="e.g. Tariq Al-Mansoor"
                    aria-invalid={Boolean(errors.name)}
                    className={inputClasses}
                  />
                  {errors.name && <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.name}</p>}
                </div>
                <div>
                  <FieldLabel htmlFor="email">Email Address *</FieldLabel>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={updateField('email')}
                    placeholder="name@company.ae"
                    aria-invalid={Boolean(errors.email)}
                    className={inputClasses}
                  />
                  {errors.email && <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="phone">Phone / Mobile (WhatsApp Enabled) *</FieldLabel>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={updateField('phone')}
                    placeholder="+971 50 123 4567"
                    aria-invalid={Boolean(errors.phone)}
                    className={inputClasses}
                  />
                  {errors.phone && <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.phone}</p>}
                </div>
                <div>
                  <FieldLabel htmlFor="company" optional>Company / Organization Name</FieldLabel>
                  <input
                    id="company"
                    type="text"
                    value={form.company}
                    onChange={updateField('company')}
                    placeholder="e.g. Apex Marketing LLC"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {step === 5 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Step 5 of 5</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#F5F2EB]">5. Review Your Request</h2>
              <p className="mt-1 text-xs text-[#B0BECE]">
                Please verify your project parameters before generating your official quotation ticket.
              </p>

              <dl className="mt-6 divide-y divide-slate-100 rounded-2xl border border-[#203357] bg-[#101D35] shadow-2xs">
                {[
                  ['Project Item', form.product],
                  ['Quantity', `${form.quantity} units`],
                  ['Dimensions', form.size],
                  ['Substrate Material', form.material],
                  ['Finishes', form.finishes.length > 0 ? form.finishes.join(', ') : 'Standard Finishing'],
                  ['Turnaround', form.deliveryUrgency],
                  ['Destination', form.deliveryLocation],
                  ['Artwork Uploaded', artworkFiles.length > 0 ? artworkFiles.map((f) => f.name).join(', ') : (form.largeFileLink ? `Cloud Link: ${form.largeFileLink}` : 'None provided')],
                  ['Customer Name', form.name],
                  ['Work Email', form.email],
                  ['Contact Phone', form.phone],
                  ['Company', form.company || 'Individual Client'],
                  ['Special Notes', form.notes],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:justify-between sm:gap-4">
                      <dt className="text-xs font-bold uppercase tracking-wider text-[#B0BECE] shrink-0">{label}</dt>
                      <dd className="text-sm font-bold text-[#F5F2EB] sm:text-right break-words break-all sm:break-normal">{value}</dd>
                    </div>
                  ))}
              </dl>

              {/* Express WhatsApp Banner */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <div className="flex items-center gap-2.5 text-xs text-emerald-200 font-medium text-left">
                  <WhatsAppIcon className="h-5 w-5 fill-emerald-400 shrink-0" />
                  <span>Prefer an instant quotation on WhatsApp? Send these specs directly to our production engineer.</span>
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
                    `Hello ONPRINT Dubai, I would like an express quotation for:\n• Project: ${form.product || 'Commercial Printing'}\n• Quantity: ${form.quantity || '100'}\n• Dimensions: ${form.size || 'Standard'}\n• Material: ${form.material || 'Standard'}\n• Finishes: ${form.finishes.join(', ') || 'Standard'}\n• Urgency: ${form.deliveryUrgency}\n• Location: ${form.deliveryLocation}\n${form.notes ? `• Notes: ${form.notes}\n` : ''}• Contact: ${form.name} (${form.phone || form.email})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: 'quote_wizard_review',
                      service: form.product || 'general',
                      button_location: 'quote_step_5',
                    })
                  }
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all w-full sm:w-auto justify-center cursor-pointer"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 fill-white" />
                  <span>Send via WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Controls */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B0BECE] transition-colors hover:text-[#F5F2EB] disabled:invisible cursor-pointer py-2 sm:py-0"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Step
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {step < steps.length ? (
              <Button
                onClick={goNext}
                variant="primary"
                icon={false}
                size="md"
                className="inline-flex items-center justify-center gap-2 font-bold"
              >
                <span>Continue to Step {step + 1}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant="accent"
                size="lg"
                icon={false}
                disabled={submitting || isUploading}
                className="justify-center font-bold"
              >
                {submitting ? 'Generating Official Quote...' : 'Confirm & Request Formal Quote'}
              </Button>
            )}
          </div>
        </div>
      </>
    )}
  </Container>
</div>
  )
}
