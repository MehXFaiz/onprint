import React, { useState } from 'react'
import { Mail, MapPin, Phone, Clock, CheckCircle2, MessageSquare, RefreshCw } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import { trackContactFormSubmit } from '../../utils/analytics'
import { submitContactInquiry } from '../../services/contact'

const contactDetails = [
  { icon: Phone, label: 'Phone / WhatsApp', value: '+971 4 800 PRINT', href: 'tel:+9714800PRINT' },
  { icon: Mail, label: 'Email Inquiry', value: 'info@onprint.ae', href: 'mailto:info@onprint.ae' },
  { icon: MapPin, label: 'Studio & Press', value: 'Al Quoz Industrial Area 3, Dubai, UAE' },
  { icon: Clock, label: 'Working Hours', value: 'Mon–Sat: 8:30 AM – 6:30 PM' },
]

const initialForm = { name: '', email: '', phone: '', subject: '', message: '' }

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.email.trim()) {
    errors.email = 'Please enter your email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!values.message.trim()) errors.message = 'Tell us a little about your project specs.'
  return errors
}

export default function ContactPage() {
  const [values, setValues] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(field) {
    return (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setSubmitting(true)
      try {
        await submitContactInquiry({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim() || null,
          subject: values.subject.trim() || 'Direct Studio Inquiry',
          message: values.message.trim(),
        })
        trackContactFormSubmit({ source_page: 'contact_page' })
        setSubmitted(true)
      } catch (err) {
        console.error('Failed to submit contact inquiry:', err)
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
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
          Message Received Successfully.
        </h1>
        <p className="mt-4 max-w-md text-base text-secondary">
          Thank you, {values.name.split(' ')[0]} — our Dubai print sales team will review your inquiry and respond to {values.email} within 2 hours.
        </p>
        <Button
          variant="outline"
          icon={false}
          className="mt-8"
          onClick={() => {
            setValues(initialForm)
            setSubmitted(false)
          }}
        >
          Send Another Message
        </Button>
      </Container>
    )
  }

  return (
    <div className="py-16 sm:py-24">
      <SEOHead
        title="Contact ONPRINT | Printing Services in Dubai | Al Quoz Studio"
        description="Contact ONPRINT printing company in Dubai. Located in Al Quoz Industrial Area 3. Get in touch for custom quotes, prepress consultations, and express UAE delivery."
        keywords="contact onprint, printing services dubai contact, al quoz print shop, dubai printing press contact"
        canonicalPath="/contact"
        breadcrumbs={[{ name: 'Contact Us', url: '/contact' }]}
      />

      <Container>
        <Breadcrumbs items={[{ name: 'Contact Us' }]} />

        <div className="border-b border-border pb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-accent">GET IN TOUCH</span>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Contact ONPRINT Dubai – Print &amp; Creative Studio
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">
            Questions about press specs, paper stocks, turnaround timelines, or custom orders? Our Al Quoz studio is ready to help your brand.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Contact Details Cards */}
          <div className="space-y-4 lg:col-span-5">
            <h2 className="font-display text-lg font-bold text-primary mb-4">Dubai Press Facility</h2>
            {contactDetails.map(({ icon: Icon, label, value, href }) => {
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
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    {renderContactIcon()}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-secondary">{label}</p>
                    {href ? (
                      <a href={href} className="mt-1 block text-base font-bold text-primary transition-colors hover:text-accent">
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

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-10 lg:col-span-7"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-6">
              <MessageSquare className="h-4 w-4" />
              <span>Direct Studio Inquiry Form</span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange('name')}
                  aria-invalid={Boolean(errors.name)}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
                {errors.name && <p className="mt-1.5 text-xs font-semibold text-accent">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  aria-invalid={Boolean(errors.email)}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
                {errors.email && <p className="mt-1.5 text-xs font-semibold text-accent">{errors.email}</p>}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Phone / Mobile (Optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange('phone')}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Subject / Project Type (Optional)
                </label>
                <input
                  id="subject"
                  type="text"
                  value={values.subject}
                  onChange={handleChange('subject')}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-primary">
                Project Details / Specifications *
              </label>
              <textarea
                id="message"
                rows={5}
                value={values.message}
                onChange={handleChange('message')}
                aria-invalid={Boolean(errors.message)}
                placeholder="Mention product category, required quantity, paper stock preferences, and timeline…"
                className="mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
              />
              {errors.message && <p className="mt-1.5 text-xs font-semibold text-accent">{errors.message}</p>}
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={submitting}
              className="mt-8 w-full justify-center sm:w-auto font-bold"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Submitting...
                </span>
              ) : (
                'Submit Inquiry'
              )}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  )
}
