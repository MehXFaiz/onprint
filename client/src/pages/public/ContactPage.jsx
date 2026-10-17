import React, { useState } from 'react'
import { Mail, MapPin, Clock, CheckCircle2, MessageSquare, RefreshCw } from 'lucide-react'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import {
  trackContactFormStart,
  trackContactFormSubmit,
  trackWhatsAppClick,
  trackProductInquiry,
} from '../../utils/analytics'
import { submitContactInquiry } from '../../services/contact'
import { openWhatsAppDirectly, getWhatsAppUrl, getServiceWhatsAppUrl, FORMATTED_PHONE } from '../../utils/whatsapp'

const contactDetails = [
  {
    icon: WhatsAppIcon,
    label: 'WhatsApp Hotline',
    value: FORMATTED_PHONE,
    href: getServiceWhatsAppUrl('general'),
    isWhatsApp: true,
  },
  { icon: Mail, label: 'Email Inquiry', value: '0nprint183@gmail.com', href: 'mailto:0nprint183@gmail.com' },
  { icon: MapPin, label: 'Studio & Press', value: 'Al Quoz, Dubai, UAE' },
  { icon: Clock, label: 'Working Hours', value: 'Mon–Sat: 8:30 AM – 6:30 PM' },
]

const PRODUCT_OPTIONS = [
  'Business Cards / Visiting Cards',
  'Flyers & Leaflets Printing',
  'Brochures & Catalogs Printing',
  'Custom Stickers & Labels',
  'Letterheads & Office Stationery',
  'Corporate Envelopes & Folders',
  'Roll-Up Banners & Displays',
  'Corporate PVC ID Cards & Lanyards',
  'Custom Water Bottles & Mugs',
  'Custom Company Stamps & Seals',
  'Other Custom Printing Requirement',
]

const initialForm = {
  name: '',
  product: 'Business Cards / Visiting Cards',
  quantity: '500',
  deliveryLocation: '',
  phone: '',
  email: '',
  message: '',
}

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address (or leave optional).'
  }
  if (!values.message.trim()) errors.message = 'Please enter your printing specifications or requirements.'
  return errors
}

export default function ContactPage() {
  const [values, setValues] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleFieldFocus() {
    trackContactFormStart({
      form_name: 'contact_us_form',
      source_page: '/contact',
      product_name: values.product,
      button_location: 'contact_page_form',
    })
  }

  function handleChange(field) {
    return (event) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const dynamicWhatsAppUrl = getWhatsAppUrl({
    title: 'DIRECT PRINTING INQUIRY — 0NPRINT',
    name: values.name.trim() || undefined,
    phone: values.phone.trim() || undefined,
    email: values.email.trim() || undefined,
    product: values.product || 'Custom Printing Inquiry',
    quantity: values.quantity.trim() || undefined,
    deliveryLocation: values.deliveryLocation.trim() || 'Dubai, UAE',
    specifications: values.message.trim() || undefined,
    pageUrl: 'https://www.0nprint.com/contact',
  })

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setSubmitting(true)
      try {
        await submitContactInquiry({
          name: values.name.trim(),
          email: values.email.trim() || 'inquiry@0nprint.com',
          phone: values.phone.trim() || null,
          subject: values.product || 'Direct Studio Inquiry',
          product: values.product || 'Direct Studio Inquiry',
          quantity: values.quantity.trim() || null,
          deliveryLocation: values.deliveryLocation.trim() || null,
          message: values.message.trim(),
        })
        trackContactFormSubmit({
          source_page: '/contact',
          product_name: values.product,
          button_location: 'contact_form_submit_button',
          form_name: 'contact_us_form',
        })
        setSubmitted(true)

        // Attempt to open WhatsApp in a new tab without navigating away from the confirmation screen
        openWhatsAppDirectly(dynamicWhatsAppUrl, { allowSameTabFallback: false })
      } catch (err) {
        console.error('Failed to submit contact inquiry:', err)
        setSubmitError(
          err?.response?.data?.message ||
            'Could not submit online right now. You can click "Get Quote on WhatsApp" below to send your details immediately.'
        )
      } finally {
        setSubmitting(false)
      }
    }
  }

  if (submitted) {
    return (
      <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <SEOHead
          title="Inquiry Received | Contact ONPRINT Dubai"
          description="Thank you for contacting ONPRINT Dubai. Our print specialists will respond to your project request promptly."
          canonicalPath="/contact"
          noindex
        />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
          Message Received Successfully.
        </h1>
        <p className="mt-4 max-w-md text-base text-secondary">
          Thank you, {values.name.split(' ')[0]} — our print specialists have logged your inquiry for{' '}
          <strong>{values.product}</strong> and will respond within 2 hours.
        </p>

        <div className="mt-6 w-full max-w-md rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 p-4 text-center space-y-2">
          <p className="text-xs font-black uppercase tracking-wider text-emerald-800">
            📱 Instant WhatsApp Quotation
          </p>
          <p className="text-xs text-emerald-900 leading-relaxed font-medium">
            Your inquiry details ({values.product}, Qty: {values.quantity || 'Custom'}) are pre-filled and ready. Click below to open WhatsApp directly:
          </p>
          <a
            href={dynamicWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackWhatsAppClick({
                source_page: '/contact',
                product_name: values.product,
                button_location: 'contact_confirmation_whatsapp',
                label: 'contact_confirmation_wa',
              })
            }
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-6 py-3.5 text-xs font-black text-white shadow-lg transition-all w-full"
          >
            <WhatsAppIcon className="h-5 w-5 fill-white" />
            <span>Open Pre-Filled Message on WhatsApp</span>
          </a>
        </div>

        <Button
          variant="outline"
          icon={false}
          className="mt-6"
          onClick={() => {
            setValues(initialForm)
            setSubmitted(false)
          }}
        >
          Send Another Inquiry
        </Button>
      </Container>
    )
  }

  return (
    <div className="py-16 sm:py-24">
      <SEOHead
        title="Contact ONPRINT | Printing Prices, Quotations & Custom Orders"
        description="Contact ONPRINT printing company in Al Quoz, Dubai. Request printing prices, custom quotations for business cards, flyers, brochures, stickers, and express delivery."
        keywords="contact onprint, printing services dubai contact, business card printing prices, custom printing quotations, al quoz print shop"
        canonicalPath="/contact"
        breadcrumbs={[{ name: 'Contact Us', url: '/contact' }]}
      />

      <Container>
        <Breadcrumbs items={[{ name: 'Contact Us' }]} />

        <div className="border-b border-border pb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-accent">GET IN TOUCH</span>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Contact ONPRINT – Prices, Quotations &amp; Custom Orders
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">
            Need pricing for business cards, flyers, brochures, stickers, or custom corporate stationery? Message our press team directly on WhatsApp or use the quick inquiry form below.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Contact Details Cards */}
          <div className="space-y-4 lg:col-span-5">
            <h2 className="font-display text-lg font-bold text-primary mb-4">Direct Contact Channels</h2>
            {contactDetails.map(({ icon: Icon, label, value, href, isWhatsApp }) => {
              const renderContactIcon = () => {
                if (!Icon) return null
                if (React.isValidElement(Icon)) return Icon
                if (typeof Icon === 'function' || typeof Icon === 'string' || (typeof Icon === 'object' && Icon !== null && Icon.$$typeof)) {
                  const IconComp = Icon
                  return <IconComp className="h-5 w-5" strokeWidth={1.75} />
                }
                return null
              }
              return (
                <div key={label} className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6 shadow-xs">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isWhatsApp ? 'bg-emerald-50 text-[#25D366]' : 'bg-accent-soft text-accent'}`}>
                    {renderContactIcon()}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-secondary">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        onClick={() => {
                          if (isWhatsApp) {
                            trackWhatsAppClick({
                              source_page: '/contact',
                              button_location: 'contact_info_card',
                              label: 'contact_page_hotline_card',
                            })
                          }
                        }}
                        className={`mt-1 block text-base font-bold text-primary transition-colors ${isWhatsApp ? 'hover:text-[#25D366]' : 'hover:text-accent'}`}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-base font-bold text-primary">{value}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Short Inquiry Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-10 lg:col-span-7"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-2">
              <MessageSquare className="h-4 w-4" />
              <span>Quick Quotation &amp; WhatsApp Inquiry Form</span>
            </div>
            <p className="text-xs text-secondary mb-6">
              Fill in your product and specifications below to open a pre-filled WhatsApp message or submit your inquiry online.
            </p>

            {submitError && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-800">
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Your Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={values.name}
                  onFocus={handleFieldFocus}
                  onChange={handleChange('name')}
                  placeholder="e.g. Ahmed Khan"
                  aria-invalid={Boolean(errors.name)}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
                {errors.name && <p className="mt-1.5 text-xs font-semibold text-accent">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="product" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Product / Service *
                </label>
                <select
                  id="product"
                  value={values.product}
                  onFocus={handleFieldFocus}
                  onChange={handleChange('product')}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-primary focus:border-accent focus:outline-none"
                >
                  {PRODUCT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="quantity" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Quantity (Units)
                </label>
                <input
                  id="quantity"
                  type="text"
                  value={values.quantity}
                  onFocus={handleFieldFocus}
                  onChange={handleChange('quantity')}
                  placeholder="e.g. 250 / 500 / 1,000"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="deliveryLocation" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Delivery Location (Optional)
                </label>
                <input
                  id="deliveryLocation"
                  type="text"
                  value={values.deliveryLocation}
                  onFocus={handleFieldFocus}
                  onChange={handleChange('deliveryLocation')}
                  placeholder="e.g. Dubai, Abu Dhabi, Lahore, Karachi"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-primary">
                  WhatsApp / Phone Number (Optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={values.phone}
                  onFocus={handleFieldFocus}
                  onChange={handleChange('phone')}
                  placeholder="e.g. +971 50 123 4567"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Email Address (Optional)
                </label>
                <input
                  id="email"
                  type="email"
                  value={values.email}
                  onFocus={handleFieldFocus}
                  onChange={handleChange('email')}
                  placeholder="name@company.com"
                  aria-invalid={Boolean(errors.email)}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
                {errors.email && <p className="mt-1.5 text-xs font-semibold text-accent">{errors.email}</p>}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-primary">
                Specifications &amp; Printing Options *
              </label>
              <textarea
                id="message"
                rows={4}
                value={values.message}
                onFocus={handleFieldFocus}
                onChange={handleChange('message')}
                aria-invalid={Boolean(errors.message)}
                placeholder="Mention size (e.g. 90x55mm), paper weight (350gsm / 450gsm velvet), finish (matte / foil / spot UV), single or double sided…"
                className="mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
              />
              {errors.message && <p className="mt-1.5 text-xs font-semibold text-accent">{errors.message}</p>}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={dynamicWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackWhatsAppClick({
                    source_page: '/contact',
                    product_name: values.product,
                    button_location: 'contact_form_whatsapp_cta',
                    label: 'contact_form_prefilled_whatsapp',
                  })
                  trackProductInquiry({
                    source_page: '/contact',
                    product_name: values.product,
                    button_location: 'contact_form_whatsapp_cta',
                  })
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-6 py-3.5 text-sm font-black text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 cursor-pointer text-center"
              >
                <WhatsAppIcon className="h-4.5 w-4.5 fill-white shrink-0" />
                <span>Send Details on WhatsApp</span>
              </a>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                disabled={submitting}
                className="w-full justify-center sm:w-auto font-bold"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" /> Submitting...
                  </span>
                ) : (
                  'Submit Inquiry Online'
                )}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  )
}

