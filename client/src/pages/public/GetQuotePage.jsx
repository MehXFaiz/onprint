import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, Upload, X, CheckCircle2 } from 'lucide-react'
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
                className={`flex h-8 w-8 shrink-0 items-center justify-center border font-display text-xs font-bold tabular-nums transition-colors ${
                  done
                    ? 'border-accent bg-accent text-white'
                    : active
                      ? 'border-primary bg-primary text-background'
                      : 'border-border bg-surface text-secondary'
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : stepNumber}
              </span>
              {stepNumber < steps.length && (
                <span className={`mx-2 h-px flex-1 transition-colors ${done ? 'bg-accent' : 'bg-border'}`} />
              )}
            </div>
            <span
              className={`mt-2 hidden text-xs font-medium sm:block ${active ? 'text-primary' : 'text-secondary'}`}
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
    <label htmlFor={htmlFor} className="text-sm font-semibold text-primary">
      {children} {optional && <span className="font-normal text-secondary">(optional)</span>}
    </label>
  )
}

const inputClasses =
  'mt-2 w-full border border-border bg-surface px-3 py-2.5 text-sm text-primary focus:border-accent focus:outline-none'

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
        setPrefillNote(`You selected "${state.artworkFileName}" on the product page — please re-attach it below.`)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      nextErrors.product = 'Choose what you need, or describe it below.'
    }
    if (current === 2 && !form.quantity) {
      nextErrors.quantity = 'Let us know how many you need.'
    }
    if (current === 4) {
      if (!form.name.trim()) nextErrors.name = 'Please enter your name.'
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
    // No submit endpoint exists yet (roadmap Phase 7 — Quote system). This confirms
    // receipt locally; wire to a real POST /api/quotes once it exists.
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <CheckCircle2 className="h-10 w-10 text-accent" strokeWidth={1.5} />
        <h1 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
          Quote request received.
        </h1>
        <p className="mt-4 max-w-md text-secondary">
          Thanks, {form.name.split(' ')[0]} — we've got your request for {form.product || 'your project'} and
          will follow up at {form.email} with pricing shortly.
        </p>
        <Button to="/" variant="outline" icon={false} className="mt-8">
          Back to Home
        </Button>
      </Container>
    )
  }

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Get a Quote</p>
        <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
          Tell us about your project.
        </h1>

        <div className="mt-10">
          <StepIndicator current={step} />
        </div>

        <div className="mt-12 border-t border-border pt-10">
          {step === 1 && (
            <div>
              <h2 className="font-display text-xl font-bold text-primary">What do you need?</h2>
              <p className="mt-2 text-sm text-secondary">Pick a category, or describe your project below.</p>

              {categories.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => selectProduct(c.name)}
                      className={`border px-4 py-3 text-left text-sm font-medium transition-colors ${
                        form.product === c.name
                          ? 'border-accent bg-accent-soft text-accent-hover'
                          : 'border-border text-secondary hover:border-primary hover:text-primary'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <FieldLabel htmlFor="product">Describe what you need</FieldLabel>
                <input
                  id="product"
                  type="text"
                  value={form.product}
                  onChange={updateField('product')}
                  placeholder="e.g. Business cards, retail packaging, event banners…"
                  aria-invalid={Boolean(errors.product)}
                  className={inputClasses}
                />
                {errors.product && <p className="mt-1.5 text-xs text-accent">{errors.product}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-bold text-primary">Tell us about the project.</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={updateField('quantity')}
                    aria-invalid={Boolean(errors.quantity)}
                    className={inputClasses}
                  />
                  {errors.quantity && <p className="mt-1.5 text-xs text-accent">{errors.quantity}</p>}
                </div>
                <div>
                  <FieldLabel htmlFor="size" optional>
                    Size
                  </FieldLabel>
                  <input id="size" type="text" value={form.size} onChange={updateField('size')} className={inputClasses} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="material" optional>
                    Material
                  </FieldLabel>
                  <input
                    id="material"
                    type="text"
                    value={form.material}
                    onChange={updateField('material')}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="finish" optional>
                    Finishing
                  </FieldLabel>
                  <input id="finish" type="text" value={form.finish} onChange={updateField('finish')} className={inputClasses} />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="notes" optional>
                  Notes
                </FieldLabel>
                <textarea
                  id="notes"
                  rows={4}
                  value={form.notes}
                  onChange={updateField('notes')}
                  placeholder="Anything else we should know?"
                  className={inputClasses}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-xl font-bold text-primary">Upload your artwork.</h2>
              <p className="mt-2 text-sm text-secondary">
                Optional — you can also send artwork later. Accepts images, PDF, AI or EPS files.
              </p>
              {prefillNote && <p className="mt-3 text-xs text-accent">{prefillNote}</p>}

              <label
                htmlFor="artwork"
                className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-border bg-surface px-6 py-12 text-center transition-colors hover:border-primary"
              >
                <Upload className="h-6 w-6 text-secondary" strokeWidth={1.5} />
                <span className="text-sm font-medium text-primary">Click to select files</span>
                <span className="text-xs text-secondary">or drag and drop</span>
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
                <ul className="mt-4 space-y-2">
                  {artworkFiles.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between border border-border bg-surface px-4 py-2.5 text-sm"
                    >
                      <span className="truncate text-primary">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        aria-label={`Remove ${file.name}`}
                        className="ml-3 shrink-0 text-secondary hover:text-accent"
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
              <h2 className="font-display text-xl font-bold text-primary">Your contact details.</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={updateField('name')}
                    aria-invalid={Boolean(errors.name)}
                    className={inputClasses}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-accent">{errors.name}</p>}
                </div>
                <div>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={updateField('email')}
                    aria-invalid={Boolean(errors.email)}
                    className={inputClasses}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-accent">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="phone" optional>
                    Phone
                  </FieldLabel>
                  <input id="phone" type="tel" value={form.phone} onChange={updateField('phone')} className={inputClasses} />
                </div>
                <div>
                  <FieldLabel htmlFor="company" optional>
                    Company
                  </FieldLabel>
                  <input id="company" type="text" value={form.company} onChange={updateField('company')} className={inputClasses} />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="font-display text-xl font-bold text-primary">Review &amp; submit.</h2>
              <dl className="mt-6 divide-y divide-border border border-border">
                {[
                  ['What you need', form.product],
                  ['Quantity', form.quantity],
                  ['Size', form.size],
                  ['Material', form.material],
                  ['Finishing', form.finish],
                  ['Notes', form.notes],
                  ['Artwork', artworkFiles.length > 0 ? artworkFiles.map((f) => f.name).join(', ') : 'None attached'],
                  ['Name', form.name],
                  ['Email', form.email],
                  ['Phone', form.phone],
                  ['Company', form.company],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:justify-between sm:gap-4">
                      <dt className="text-sm font-semibold text-primary">{label}</dt>
                      <dd className="text-sm text-secondary sm:text-right">{value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-border pt-8">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary transition-colors hover:text-primary disabled:opacity-0"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {step < steps.length ? (
            <Button onClick={goNext} variant="primary" icon={false} className="inline-flex items-center gap-1.5">
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} variant="accent" icon={false}>
              Submit Quote Request
            </Button>
          )}
        </div>
      </Container>
    </div>
  )
}
