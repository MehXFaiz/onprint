import React from 'react'
import Container from '../../components/Container'
import SectionHeading from '../../components/SectionHeading'
import StatCounter from '../../components/StatCounter'
import Reveal from '../../components/Reveal'
import Button from '../../components/Button'
import { CornerMarks } from '../../components/PrintMarks'
import { ShieldCheck, Award, Zap, HeartHandshake } from 'lucide-react'

const stats = [
  { value: 10, suffix: '+', label: 'Years of Experience' },
  { value: 500, suffix: '+', label: 'Corporate Clients' },
  { value: 1500, suffix: '+', label: 'Projects Completed' },
  { value: 50, suffix: '+', label: 'Custom Print Solutions' },
]

const values = [
  {
    icon: Award,
    title: 'Craft over shortcuts',
    description: 'Every single print job is inspected by hand for registration, bleed, and color accuracy before it leaves our floor.',
  },
  {
    icon: Zap,
    title: 'Clarity over guesswork',
    description: 'You receive clear specs, stock samples, exact pricing, and confirmed dispatch dates upfront.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliability over promises',
    description: 'When we commit to a production window and delivery date in Dubai or across UAE, that commitment holds.',
  },
  {
    icon: HeartHandshake,
    title: 'Partnership over transactions',
    description: 'We act as an extension of your creative studio or brand marketing team, order after order.',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-border bg-background py-16 sm:py-24 lg:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent shadow-xs">
              About ONPRINT Dubai
            </span>
            <h1 className="font-display mt-6 text-4xl font-extrabold leading-[1.04] tracking-tight text-primary sm:text-5xl lg:text-6xl">
              We print more than paper.
              <br />
              We print <span className="text-accent">identities.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-secondary sm:text-lg">
              ONPRINT was established with a singular conviction: the physical collateral a brand hands to a client — business cards, gift packaging, stationery, rollups — should feel as refined as the brand itself.
            </p>
            <div className="mt-8 flex gap-4">
              <Button to="/contact" variant="accent" size="lg">
                Talk to Our Print Studio
              </Button>
              <Button to="/portfolio" variant="secondary" size="lg">
                View Past Projects
              </Button>
            </div>
          </div>

          <div className="relative mx-auto flex h-[340px] w-full max-w-md items-center justify-center sm:h-[400px]">
            <CornerMarks className="absolute -left-2 -top-2 h-8 w-8 text-primary/40" />
            <CornerMarks className="absolute -bottom-2 -right-2 h-8 w-8 rotate-180 text-primary/40" />
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
              <div className="flex h-full flex-col justify-between p-8">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <span className="font-display text-lg font-extrabold text-primary">ONPRINT UAE</span>
                  <span className="text-xs font-bold text-accent">EST. 2016</span>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-secondary">Press Standards</p>
                  <h3 className="font-display text-xl font-bold text-primary">Master Offset &amp; Digital Craft</h3>
                  <p className="text-sm text-secondary leading-relaxed">Combining Heidelberg offset speed with modern ultra-resolution digital technology.</p>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs font-bold text-primary">
                  <span>CMYK / PANTONE MATCHED</span>
                  <span className="text-accent">100% QUALITY ASSURED</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Counter Section */}
      <section className="border-b border-border bg-surface py-16">
        <Container className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <StatCounter {...stat} />
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Our Story" title="Built on the press floor, not a pitch deck." />
          <div className="space-y-6 text-base leading-relaxed text-secondary sm:text-lg">
            <p>
              ONPRINT was founded in Dubai on a straightforward premise: businesses deserve a print partner who treats their brand with genuine care. Not a faceless automated web form — a dedicated team that deeply understands paper weight, tactile finishes, precise color calibration, and hard deadlines.
            </p>
            <p>
              Today, our Al Quoz print facility houses state-of-the-art digital, offset, foil-stamping, and laser die-cutting equipment. We serve everyone from burgeoning startups placing their first business card order to multinational corporate enterprises producing recurring luxury gift boxes.
            </p>
            <p>
              Every single order moves through our disciplined production workflow: clear quotation, pre-flight file check, proof approval, multi-stage press quality control, and careful packaging before dispatch.
            </p>
          </div>
        </Container>
      </section>

      {/* Core Values Grid */}
      <section className="border-t border-border bg-surface py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="What We Believe"
            title="The principles behind every single sheet."
            subtitle="How we maintain our standards across hundreds of print runs every month."
            center
          />

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {values.map((item, index) => {
              const Icon = item.icon
              const renderValueIcon = () => {
                if (!Icon) return null
                if (React.isValidElement(Icon)) return Icon
                if (typeof Icon === 'function' || typeof Icon === 'string' || (typeof Icon === 'object' && Icon.$$typeof)) {
                  return <Icon className="h-6 w-6" strokeWidth={1.75} />
                }
                return null
              }
              return (
                <Reveal key={item.title} delay={index * 0.08}>
                  <div className="flex gap-5 rounded-2xl border border-border bg-background p-8 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      {renderValueIcon()}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-primary">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-secondary">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>
    </div>
  )
}

