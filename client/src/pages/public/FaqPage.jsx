import { ChevronDown, Sparkles } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'

const faqs = [
  {
    question: 'What printing services does ONPRINT offer in Dubai?',
    answer:
      'ONPRINT offers digital and offset printing, executive office stationery (business cards, letterheads, presentation folders), custom packaging boxes, corporate gift items (mugs, water bottles, notebooks, apparel), large-format roll-ups, outdoor flags, and die-cut vinyl stickers.',
  },
  {
    question: 'How long does a typical print order take across Dubai & UAE?',
    answer:
      'Standard digital printing runs take 24 to 48 hours once artwork proof is confirmed. Large offset runs, luxury foil-embossed packaging, and custom gift boxes typically take 3 to 7 business days. Express same-day production is available for urgent deadlines.',
  },
  {
    question: 'What file formats and resolutions do you accept for artwork?',
    answer:
      'We accept print-ready PDF/X-1a, Adobe Illustrator (AI), and EPS files with all fonts outlined and 3mm bleed included. High-resolution JPG or PNG files at 300+ DPI in CMYK format are also accepted for simpler items.',
  },
  {
    question: 'Is there a minimum order quantity (MOQ)?',
    answer:
      'Minimums vary by product category. Most corporate stationery items start at 50 to 100 units, while large-format roll-up banners, beach flags, and acrylic nameplates can be ordered starting from 1 unit.',
  },
  {
    question: 'Can I see a proof before my order goes to press?',
    answer:
      'Yes. Every order includes a complimentary pre-flight check and digital PDF proof for approval before production begins. Physical printed sample proofs are available for large volume or color-critical runs.',
  },
  {
    question: 'Do you offer rush or express same-day printing in Dubai?',
    answer:
      'Yes, express rush printing is available for business cards, flyers, roll-up banner stands, and brochures subject to daily press schedule. Contact our sales desk at +971 4 800 PRINT for urgent requests.',
  },
  {
    question: 'What are your payment and corporate invoicing terms?',
    answer:
      'We accept major credit/debit cards, bank wire transfers, and corporate cheques. Registered UAE corporate accounts can apply for 30-day credit invoicing terms after initial completed transactions.',
  },
  {
    question: 'Do you deliver across all Emirates in the UAE?',
    answer:
      'Yes. We offer tracked doorstep courier delivery across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain, as well as local collection from our Al Quoz print facility.',
  },
]

export default function FaqPage() {
  return (
    <div className="py-16 sm:py-24">
      <SEOHead
        title="Dubai Printing FAQ | Turnaround, Specs & Delivery | ONPRINT"
        description="Frequently asked questions about commercial printing in Dubai. Learn about turnaround times, minimum order quantities, artwork specifications, paper stocks, and UAE delivery."
        keywords="printing faq dubai, printing turnaround dubai, artwork specs printing uae, printing questions dubai"
        canonicalPath="/faq"
        faqList={faqs}
        breadcrumbs={[{ name: 'FAQ', url: '/faq' }]}
      />

      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ name: 'FAQ' }]} />

        <div className="border-b border-border pb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            <span>SUPPORT &amp; SPECIFICATIONS</span>
          </div>
          <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Frequently Asked Questions About Printing in Dubai
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">
            Everything you need to know about our printing processes, paper stock grades, artwork requirements, turnarounds, and delivery across the UAE.
          </p>
        </div>

        <div className="mt-12 divide-y divide-border border-t border-b border-border">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <h2 className="font-display text-base font-bold text-primary sm:text-lg group-hover:text-accent transition-colors">
                  {faq.question}
                </h2>
                <ChevronDown className="h-5 w-5 shrink-0 text-secondary transition-transform duration-300 group-open:rotate-180 group-hover:text-accent" />
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-secondary">{faq.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-primary">Still have a specific question about your print job?</h3>
            <p className="mt-1 text-xs text-secondary">Our print specialists in Al Quoz, Dubai are ready to assist you.</p>
          </div>
          <Button to="/contact" variant="accent" icon={false} className="shrink-0">
            Contact Support Desk
          </Button>
        </div>
      </Container>
    </div>
  )
}
