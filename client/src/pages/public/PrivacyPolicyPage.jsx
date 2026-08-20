import Container from '../../components/Container'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'

const sections = [
  {
    title: 'Information We Collect',
    body: 'When you request a quote, place an order, or contact us, we collect information such as your name, email address, phone number, company name, billing details and any artwork or files you provide for production.',
  },
  {
    title: 'How We Use Your Information',
    body: 'We use your information to prepare quotes, process orders, communicate about production and delivery, and improve our services. We do not sell your personal information to third parties.',
  },
  {
    title: 'Artwork & File Ownership',
    body: 'Files you upload for production remain your property. We retain production files only as long as necessary to fulfill your order and support reprints, unless you request earlier deletion.',
  },
  {
    title: 'Cookies',
    body: 'Our website uses essential cookies to support core functionality such as navigation and form submissions. We do not use third-party advertising trackers.',
  },
  {
    title: 'Data Security',
    body: 'We apply reasonable technical and organizational safeguards to protect your information against unauthorized access, alteration or disclosure.',
  },
  {
    title: 'Your Rights',
    body: 'You may request access to, correction of, or deletion of your personal information at any time by contacting us directly.',
  },
  {
    title: 'Contact',
    body: 'Questions about this policy can be directed to info@onprint.ae.',
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 sm:py-24">
      <SEOHead
        title="Privacy Policy | ONPRINT Dubai"
        description="Privacy policy and data protection practices for ONPRINT printing and branding solutions in Dubai, UAE."
        canonicalPath="/privacy-policy"
        breadcrumbs={[{ name: 'Privacy Policy', url: '/privacy-policy' }]}
      />

      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: 'Privacy Policy' }]} />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Legal</p>
        <h1 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-xs font-semibold text-secondary">Effective Date: January 1, 2026</p>

        <div className="mt-12 divide-y divide-border border-t border-b border-border">
          {sections.map((s) => (
            <div key={s.title} className="py-8">
              <h2 className="font-display text-lg font-bold text-primary">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-secondary">{s.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
