import { useState } from 'react'
import { Mail, MapPin, Phone, Clock, CheckCircle2, MessageSquare } from 'lucide-react'
import Container from '../../components/Container'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'

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
  const [submitted, setSubmitted] = useState(false)

  function handleChange(field) {
    return (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
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
      <Container>
        <SectionHeading
          eyebrow="Get In Touch"
          title="Let’s discuss your print &amp; creative requirements."
          subtitle="Questions about press specs, materials, timelines, or custom orders? Our Al Quoz studio is ready to help."
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Contact Details Cards */}
          <div className="space-y-4 lg:col-span-5">
            {contactDetails.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6 shadow-xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
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
            ))}
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

            <Button type="submit" variant="accent" size="lg" className="mt-8 w-full justify-center sm:w-auto">
              Submit Inquiry
            </Button>
          </form>
        </div>
      </Container>
    </div>
  )
}

