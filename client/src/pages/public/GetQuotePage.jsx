import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, Upload, X, CheckCircle2, FileText } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import { getProductBySlug } from '../../services/products'
import { getCategories } from '../../services/categories'

const steps = ['What You Need', 'Project Details', 'Artwork', 'Contact Details', 'Review & Submit']

const initialForm = {
  product: '',
  quantity: '',
  size: '',
  material: '',
  finish: '',
  notes: '',
  name: '',
  email: '',
  phone: '',
  company: '',
}

function StepIndicator({ current }) {
  return (
    <ol className="flex items-start">
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const done = stepNumber < current
        const active = stepNumber === current
        return (
          <li key={label} className="flex flex-1 flex-col items-start last:flex-none">
            <div className="flex w-full items-center">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-xs font-extrabold tabular-nums transition-all ${
                  done
                    ? 'bg-accent text-white shadow-xs'
                    : active
                      ? 'bg-primary text-background shadow-md'
                      : 'border border-border bg-surface text-secondary'
                }`}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : stepNumber}
              </span>
              {stepNumber < steps.length && (
                <span className={`mx-2 h-0.5 flex-1 transition-colors ${done ? 'bg-accent' : 'bg-border'}`} />
              )}
            </div>
            <span
              className={`mt-2.5 hidden text-xs font-bold sm:block ${active ? 'text-primary' : 'text-secondary'}`}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function FieldLabel({ htmlFor, children, optional }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-bold uppercase tracking-wider text-primary">
      {children} {optional && <span className="font-normal text-secondary lowercase">(optional)</span>}
    </label>
  )
}

const inputClasses =
  'mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-primary transition-colors focus:border-accent focus:outline-none'

export default function GetQuotePage() {
  const { state } = useLocation()
  const [searchParams] = useSearchParams()

  const [categories, setCategories] = useState([])
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [artworkFiles, setArtworkFiles] = useState([])
  const [prefillNote, setPrefillNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (state?.product) {
      setForm((prev) => ({
        ...prev,
        product: state.product,
        quantity: state.quantity ? String(state.quantity) : '',
        size: state.size || '',
        material: state.material || '',
        finish: state.finish || '',
        notes: state.notes || '',
      }))
      if (state.artworkFileName) {
        setPrefillNote(`Selected artwork: "${state.artworkFileName}" — please attach below.`)
      }
      return
    }

    const productSlug = searchParams.get('product')
    if (productSlug) {
      getProductBySlug(productSlug)
        .then((product) => {
          setForm((prev) => ({ ...prev, product: product.name, quantity: String(product.minimumQuantity || 1) }))
        })
        .catch(() => {})
    }
  }, [searchParams, state])

  function updateField(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    }
  }

  function selectProduct(name) {
    setForm((prev) => ({ ...prev, product: name }))
    setErrors((prev) => (prev.product ? { ...prev, product: undefined } : prev))
  }

  function handleFileChange(event) {
    const files = Array.from(event.target.files || [])
    setArtworkFiles((prev) => [...prev, ...files])
  }

  function removeFile(index) {
    setArtworkFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function validateStep(current) {
    const nextErrors = {}
    if (current === 1 && !form.product.trim()) {
      nextErrors.product = 'Select a category or specify your project requirement.'
    }
    if (current === 2 && !form.quantity) {
      nextErrors.quantity = 'Please enter required quantity.'
    }
    if (current === 4) {
      if (!form.name.trim()) nextErrors.name = 'Please enter your full name.'
      if (!form.email.trim()) {
        nextErrors.email = 'Please enter your email.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        nextErrors.email = 'Please enter a valid email address.'
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

  function handleSubmit() {
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
          Quote Request Submitted!
        </h1>
        <p className="mt-4 max-w-md text-base text-secondary">
          Thank you, {form.name.split(' ')[0]} — we have logged your request for <strong className="text-primary">{form.product || 'your project'}</strong> and will send formal pricing to <span className="text-primary font-bold">{form.email}</span> shortly.
        </p>
        <Button to="/" variant="outline" icon={false} className="mt-8">
          Back to Storefront
        </Button>
      </Container>
    )
  }

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
          ONPRINT Quote Wizard
        </span>
        <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
          Tell us about your print project.
        </h1>

        <div className="mt-10">
          <StepIndicator current={step} />
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-10">
          {step === 1 && (
            <div>
              <h2 className="font-display text-xl font-bold text-primary">1. What do you need?</h2>
              <p className="mt-1.5 text-sm text-secondary">Pick an existing product category or specify custom work.</p>

              {categories.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => selectProduct(c.name)}
                      className={`rounded-xl border p-4 text-left text-xs font-bold transition-all cursor-pointer ${
                        form.product === c.name
                          ? 'border-accent bg-accent-soft text-accent shadow-xs'
                          : 'border-border bg-background text-secondary hover:border-primary hover:text-primary'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <FieldLabel htmlFor="product">Or specify custom project</FieldLabel>
                <input
                  id="product"
                  type="text"
                  value={form.product}
                  onChange={updateField('product')}
                  placeholder="e.g. Luxury Business Cards, Embossed Boxes, Rigid Envelopes…"
                  aria-invalid={Boolean(errors.product)}
                  className={inputClasses}
                />
                {errors.product && <p className="mt-1.5 text-xs font-semibold text-accent">{errors.product}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-bold text-primary">2. Project Specifications</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="quantity">Quantity Required *</FieldLabel>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={updateField('quantity')}
                    aria-invalid={Boolean(errors.quantity)}
                    className={inputClasses}
                  />
                  {errors.quantity && <p className="mt-1.5 text-xs font-semibold text-accent">{errors.quantity}</p>}
                </div>
                <div>
                  <FieldLabel htmlFor="size" optional>
                    Dimensions / Size
                  </FieldLabel>
                  <input
                    id="size"
                    type="text"
                    value={form.size}
                    onChange={updateField('size')}
                    placeholder="e.g. A4, 90x55mm, Custom 20x30cm"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="material" optional>
                    Paper / Stock Material
                  </FieldLabel>
                  <input
                    id="material"
                    type="text"
                    value={form.material}
                    onChange={updateField('material')}
                    placeholder="e.g. 350gsm Silk, Craft Card, Metallic"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="finish" optional>
                    Finishing &amp; Lamination
                  </FieldLabel>
                  <input
                    id="finish"
                    type="text"
                    value={form.finish}
                    onChange={updateField('finish')}
                    placeholder="e.g. Matte Lamination, Gold Foil, Spot UV"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="notes" optional>
                  Additional Project Notes
                </FieldLabel>
                <textarea
                  id="notes"
                  rows={4}
                  value={form.notes}
                  onChange={updateField('notes')}
                  placeholder="Mention packaging assembly needs, delivery deadline, or Pantone codes…"
                  className={inputClasses}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-xl font-bold text-primary">3. Upload Artwork &amp; Mockups</h2>
              <p className="mt-1.5 text-sm text-secondary">
                Upload your print-ready PDF, Illustrator (.AI), EPS, or high-res images. (Optional)
              </p>
              {prefillNote && <p className="mt-3 text-xs font-bold text-accent">{prefillNote}</p>}

              <label
                htmlFor="artwork"
                className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-background p-10 text-center transition-colors hover:border-accent"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-primary">Click to attach files</span>
                <span className="text-xs text-secondary">Supports PDF, AI, EPS, PNG, JPG (Max 50MB)</span>
                <input
                  id="artwork"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.ai,.eps"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>

              {artworkFiles.length > 0 && (
                <ul className="mt-6 space-y-2">
                  {artworkFiles.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium"
                    >
                      <span className="truncate text-primary">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        aria-label={`Remove ${file.name}`}
                        className="ml-3 shrink-0 text-secondary hover:text-accent cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-bold text-primary">4. Contact Information</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="name">Full Name *</FieldLabel>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={updateField('name')}
                    aria-invalid={Boolean(errors.name)}
                    className={inputClasses}
                  />
                  {errors.name && <p className="mt-1.5 text-xs font-semibold text-accent">{errors.name}</p>}
                </div>
                <div>
                  <FieldLabel htmlFor="email">Email Address *</FieldLabel>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={updateField('email')}
                    aria-invalid={Boolean(errors.email)}
                    className={inputClasses}
                  />
                  {errors.email && <p className="mt-1.5 text-xs font-semibold text-accent">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="phone" optional>
                    Phone / Mobile Number
                  </FieldLabel>
                  <input id="phone" type="tel" value={form.phone} onChange={updateField('phone')} className={inputClasses} />
                </div>
                <div>
                  <FieldLabel htmlFor="company" optional>
                    Company Name
                  </FieldLabel>
                  <input id="company" type="text" value={form.company} onChange={updateField('company')} className={inputClasses} />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-2">
                <FileText className="h-4 w-4" />
                <span>Summary Check</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-primary">5. Review Your Request</h2>

              <dl className="mt-6 divide-y divide-border/60 rounded-xl border border-border bg-background">
                {[
                  ['Project Required', form.product],
                  ['Quantity', form.quantity],
                  ['Dimensions', form.size],
                  ['Material Stock', form.material],
                  ['Finishing', form.finish],
                  ['Notes', form.notes],
                  ['Attached Files', artworkFiles.length > 0 ? artworkFiles.map((f) => f.name).join(', ') : 'None attached'],
                  ['Contact Name', form.name],
                  ['Email Address', form.email],
                  ['Phone Number', form.phone],
                  ['Company', form.company],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:justify-between sm:gap-4">
                      <dt className="text-xs font-bold uppercase tracking-wider text-secondary">{label}</dt>
                      <dd className="text-sm font-bold text-primary sm:text-right">{value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}
        </div>

        {/* Wizard Controls */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:text-primary disabled:opacity-0 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Step
          </button>

          {step < steps.length ? (
            <Button onClick={goNext} variant="primary" icon={false} size="md" className="inline-flex items-center gap-2">
              Next Step
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} variant="accent" size="lg" icon={false}>
              Confirm &amp; Submit Request
            </Button>
          )}
        </div>
      </Container>
    </div>
  )
}

