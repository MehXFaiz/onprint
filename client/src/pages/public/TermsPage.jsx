import Container from '../../components/Container'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'

const sections = [
  {
    title: 'Quotes & Pricing',
    body: 'Quotes are valid for 30 days unless otherwise stated. Final pricing is confirmed once specifications, quantity and artwork are finalized.',
  },
  {
    title: 'Order Approval',
    body: 'Production begins only after you approve a digital proof. Once approved, changes may incur additional charges and affect delivery timelines.',
  },
  {
    title: 'Artwork Requirements',
    body: 'You are responsible for ensuring submitted artwork is print-ready and that you hold the rights to reproduce it. We are not liable for errors present in customer-supplied files that were approved at proofing.',
  },
  {
    title: 'Turnaround & Delivery',
    body: 'Estimated turnaround times begin after proof approval and are not guaranteed against delays caused by carriers or events outside our control.',
  },
  {
    title: 'Payment Terms',
    body: 'Payment is due according to the terms stated on your invoice. Orders may be held pending payment for new accounts.',
  },
  {
    title: 'Returns & Reprints',
    body: 'Because print products are custom-made, we do not accept returns for buyer’s remorse. Reprints are offered at our discretion for verified production defects.',
  },
  {
    title: 'Limitation of Liability',
    body: 'Our liability for any order is limited to the value of that order. We are not liable for indirect or consequential damages arising from its use.',
  },
]

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-24">
      <SEOHead
        title="Terms & Conditions | ONPRINT Dubai"
        description="Terms and conditions for commercial printing, proof approval, and orders with ONPRINT Dubai, UAE."
        canonicalPath="/terms"
        breadcrumbs={[{ name: 'Terms & Conditions', url: '/terms' }]}
      />

      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: 'Terms & Conditions' }]} />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Legal</p>
        <h1 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          Terms &amp; Conditions
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
