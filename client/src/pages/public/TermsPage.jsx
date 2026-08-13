import Container from '../../components/Container'

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
    <div className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Legal</p>
        <h1 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-4 text-sm text-secondary">
          Last updated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}. This is
          placeholder terms content and should be reviewed by legal counsel before publishing.
        </p>

        <div className="mt-14 space-y-10 border-t border-border pt-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-lg font-bold text-primary">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-secondary">{section.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
