import { ChevronDown } from 'lucide-react'
import Container from '../../components/Container'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'

const faqs = [
  {
    question: 'How long does a typical print order take?',
    answer:
      'Most standard orders — business cards, flyers, stationery — take 3–5 business days once artwork is approved. Large-format and packaging jobs typically run 7–10 business days. Exact timelines are confirmed on your quote.',
  },
  {
    question: 'What file formats do you accept for artwork?',
    answer:
      'We accept print-ready PDF, AI and EPS files. High-resolution JPG or PNG also works for simpler jobs. If you need design help, our team can review your file and flag anything that needs adjusting before it goes to press.',
  },
  {
    question: 'Is there a minimum order quantity?',
    answer:
      'Minimums vary by product — most stationery starts at 100–250 units, while large-format items like banners have no minimum. Each product page lists its specific minimum quantity.',
  },
  {
    question: 'Can I see a proof before my order goes to print?',
    answer:
      'Yes. Every order includes a digital proof for approval before production starts. Physical pre-press proofs are available for an additional fee on large or color-critical runs.',
  },
  {
    question: 'Do you offer rush production?',
    answer:
      'Rush turnaround is available on most products, subject to current production capacity. Let us know your deadline when requesting a quote and we’ll confirm whether it’s achievable.',
  },
  {
    question: 'What are my payment options?',
    answer:
      'We accept major credit cards and bank transfer for business accounts. Recurring clients can apply for net-30 invoicing after their first completed order.',
  },
  {
    question: 'Do you ship, or is pickup available?',
    answer:
      'Both. Local pickup is available at our facility, and we ship nationwide via tracked courier. Shipping cost and timeline are included in your quote.',
  },
]

export default function FaqPage() {
  return (
    <div className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Support"
          title="Frequently asked questions."
          subtitle="Can't find what you're looking for? Reach out and we'll get back to you directly."
        />

        <div className="mt-14 divide-y divide-border border-t border-border">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <span className="font-display text-base font-bold text-primary sm:text-lg">{faq.question}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-secondary transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-secondary">{faq.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-4 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-secondary">Still have questions?</p>
          <Button to="/contact" variant="outline" icon={false}>
            Contact Us
          </Button>
        </div>
      </Container>
    </div>
  )
}
