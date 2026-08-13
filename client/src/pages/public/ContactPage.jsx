import { useState } from 'react'
import { Mail, MapPin, Phone, Clock, CheckCircle2 } from 'lucide-react'
import Container from '../../components/Container'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'

const contactDetails = [
  { icon: Phone, label: 'Phone', value: '+1 (555) 010-1234', href: 'tel:+15550101234' },
  { icon: Mail, label: 'Email', value: 'hello@onprint.com', href: 'mailto:hello@onprint.com' },
  { icon: MapPin, label: 'Address', value: '221 Print District Ave, Suite 4' },
  { icon: Clock, label: 'Business Hours', value: 'Mon–Fri, 9:00–18:00' },
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
  if (!values.message.trim()) errors.message = 'Tell us a little about your project.'
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
      // No submit endpoint exists yet (roadmap Phase 10 — Portfolio & contact system).
      // This confirms receipt locally; wire to a real POST /api/messages once it exists.
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <CheckCircle2 className="h-10 w-10 text-accent" strokeWidth={1.5} />
        <h1 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
          Message received.
        </h1>
        <p className="mt-4 max-w-md text-secondary">
          Thanks, {values.name.split(' ')[0]} — we've got your message and will get back to you shortly.
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
    <div className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Get In Touch"
          title="Let's talk about your project."
          subtitle="Questions about a job, a quote, or just want to say hello? Reach out — we respond fast."
        />

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.4fr]">
          <ul className="space-y-8 border-t border-border pt-8">
            {contactDetails.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-start gap-4">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">{label}</p>
                  {href ? (
                    <a href={href} className="mt-1 block text-base font-medium text-primary hover:text-accent">
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 text-base font-medium text-primary">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit} noValidate className="space-y-6 border-t border-border pt-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm font-semibold text-primary">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className="mt-2 w-full border border-border bg-surface px-3 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
                {errors.name && (
                  <p id="name-error" className="mt-1.5 text-xs text-accent">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-semibold text-primary">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="mt-2 w-full border border-border bg-surface px-3 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-xs text-accent">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="text-sm font-semibold text-primary">
                  Phone <span className="font-normal text-secondary">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange('phone')}
                  className="mt-2 w-full border border-border bg-surface px-3 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="subject" className="text-sm font-semibold text-primary">
                  Subject <span className="font-normal text-secondary">(optional)</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  value={values.subject}
                  onChange={handleChange('subject')}
                  className="mt-2 w-full border border-border bg-surface px-3 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-semibold text-primary">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={values.message}
                onChange={handleChange('message')}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className="mt-2 w-full border border-border bg-surface px-3 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
              />
              {errors.message && (
                <p id="message-error" className="mt-1.5 text-xs text-accent">
                  {errors.message}
                </p>
              )}
            </div>

            <Button type="submit" variant="accent">
              Send Message
            </Button>
          </form>
        </div>
      </Container>
    </div>
  )
}
