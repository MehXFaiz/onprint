import Container from '../../components/Container'
import SectionHeading from '../../components/SectionHeading'
import StatCounter from '../../components/StatCounter'
import Reveal from '../../components/Reveal'
import Button from '../../components/Button'
import { CornerMarks } from '../../components/PrintMarks'

// Placeholder company stats — swap for real, admin-editable figures once Settings exists.
const stats = [
  { value: 10, suffix: '+', label: 'Years Experience' },
  { value: 500, suffix: '+', label: 'Projects Completed' },
  { value: 100, suffix: '+', label: 'Business Clients' },
  { value: 50, suffix: '+', label: 'Print Solutions' },
]

const values = [
  { title: 'Craft over shortcuts', description: 'Every job is checked by hand before it ships — not just by a machine.' },
  { title: 'Clarity over guesswork', description: 'You know the price, the timeline and the spec before production starts.' },
  { title: 'Reliability over promises', description: 'If we commit to a delivery date, that date holds.' },
  { title: 'Partnership over transactions', description: 'We work alongside your team, project after project.' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border">
        <Container className="grid grid-cols-1 items-center gap-16 py-20 sm:py-28 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
              About ONPRINT
            </span>
            <h1 className="font-display mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-primary sm:text-5xl lg:text-6xl">
              We print more than paper.
              <br />
              We print <span className="text-accent">identities.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-secondary">
              ONPRINT started with a simple belief: the physical things a brand puts into the
              world — a business card, a box, a label — should feel as considered as everything
              else it makes. That belief still runs every job on our floor.
            </p>
            <div className="mt-10">
              <Button to="/contact" variant="outline" icon={false}>
                Talk to Our Team
              </Button>
            </div>
          </div>

          <div className="relative mx-auto flex h-[340px] w-full max-w-sm items-center justify-center sm:h-[400px]">
            <CornerMarks className="absolute -left-2 -top-2 h-8 w-8 text-primary/30" />
            <CornerMarks className="absolute -bottom-2 -right-2 h-8 w-8 rotate-180 text-primary/30" />
            <div className="relative h-full w-full">
              <div className="absolute inset-x-6 top-0 h-2/3 border border-border bg-surface" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-primary" />
              <div className="absolute bottom-10 left-1/2 h-24 w-24 -translate-x-1/2 bg-accent" />
              <div className="absolute inset-x-10 top-8 flex justify-center gap-1.5">
                {['#00AEEF', '#EC008C', '#FFF200', '#101010'].map((c) => (
                  <span key={c} className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-surface py-20">
        <Container className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <StatCounter {...stat} />
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Story */}
      <section className="py-24 sm:py-32">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Our Story" title="Built on the press floor, not a pitch deck." />
          <div className="space-y-6 text-base leading-relaxed text-secondary">
            <p>
              ONPRINT was founded on a straightforward premise: businesses deserve a print
              partner who treats their brand with the same care they do. Not a faceless
              order form — a team that understands paper stock, finishing, color calibration
              and deadlines, and applies that expertise to every job, large or small.
            </p>
            <p>
              Today we work across digital and offset printing, packaging, signage and
              promotional products — serving startups placing their first order for business
              cards and established brands running recurring packaging production. The scale
              changes; the standard doesn't.
            </p>
            <p>
              Every project moves through the same discipline: a clear quote, a confirmed
              spec, a production run that's checked at every stage, and delivery you can plan
              around.
            </p>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="border-t border-border bg-surface py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="What We Believe" title="The standard behind every print run." center />
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
            {values.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className="border-t-2 border-primary pt-5">
                  <h3 className="font-display text-lg font-bold text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
