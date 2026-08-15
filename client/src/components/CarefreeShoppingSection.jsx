import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Truck, BadgePercent, ArrowRight, PhoneCall, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react'
import { CornerMarks } from './PrintMarks'
import flagImg from '../assets/products/1 (10).jpg'

const features = [
  {
    icon: ShieldCheck,
    title: 'Secured UAE Shipping',
    description: 'We offer white-glove doorstep delivery anywhere across Dubai, Abu Dhabi, and all 7 Emirates with real-time tracking.',
    badge: '100% Insured',
  },
  {
    icon: Truck,
    title: 'Next-Day Express Delivery',
    description: 'Explore our printing services, place your order, and enjoy rapid 24-hour turnaround & same-day priority dispatch!',
    badge: 'Priority Press',
  },
  {
    icon: BadgePercent,
    title: 'Guaranteed Best Prices',
    description: 'Transparent bulk pricing with zero hidden fees. Free artwork pre-flight verification included with every order.',
    badge: 'Best Value',
  },
]

export default function CarefreeShoppingSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-gradient-to-b from-surface via-background to-surface py-20 sm:py-28">
      {/* Studio Background Ambient Glow */}
      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-10 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Column: High-Impact Visual Studio Showcase (Matching Flags image in screenshot, elevated to luxury UI) */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto overflow-hidden rounded-3xl border border-border/80 bg-primary shadow-2xl group"
            >
              {/* Corner Crop Marks for Authentic Print Studio Aesthetic */}
              <CornerMarks className="absolute top-4 left-4 z-20 h-6 w-6 text-white/60" />
              <CornerMarks className="absolute bottom-4 right-4 z-20 h-6 w-6 rotate-180 text-white/60" />

              {/* Main Flag / Event Print Photography */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden">
                <img
                  src={flagImg}
                  alt="Outdoor Flags & Express Corporate Print Dubai"
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 contrast-[1.05]"
                />
                
                {/* Subtle Studio Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              </div>

              {/* Floating Glass Quality Badge Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-20 rounded-2xl border border-white/30 bg-surface/90 p-4.5 backdrop-blur-md shadow-xl sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-black text-primary">Dubai Express Production</h4>
                      <p className="text-[11px] font-bold text-secondary">Passed 100% Quality Pre-flight</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-accent/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                    Verified
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Decorative Offset Backing Card */}
            <div className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl border border-accent/20 bg-accent-soft/40 hidden sm:block" />
          </div>

          {/* Right Column: Luxury Feature & Carefree Shopping Content */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft/50 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-accent mb-3">
                <Sparkles className="h-3 w-3" />
                Seamless &amp; Express Service
              </div>

              {/* Main Title matching user screenshot header requirement */}
              <h2 className="font-display text-3xl font-black tracking-tight text-primary sm:text-4xl lg:text-5xl">
                Carefree Shopping
              </h2>

              {/* Dual Accent Bar Line */}
              <div className="mt-3 flex items-center gap-1.5 mb-8">
                <span className="h-1.5 w-20 rounded-full bg-[#A82F19]" />
                <span className="h-1.5 w-3 rounded-full bg-accent/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent/20" />
              </div>

              {/* Feature List Cards (3 Rows) */}
              <div className="space-y-4">
                {features.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="group flex items-start gap-4 rounded-2xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition-transform group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-base font-extrabold text-primary group-hover:text-accent transition-colors">
                            {item.title}
                          </h3>
                          <span className="rounded-full bg-background border border-border/80 px-2.5 py-0.5 text-[10px] font-bold text-secondary">
                            {item.badge}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-secondary sm:text-sm">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Call to Action Row matching 'Contact Now' button requirement */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-accent px-7 py-4 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:scale-[1.02] cursor-pointer active:scale-95 sm:text-sm"
                >
                  <span>Contact Sales Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/get-a-quote"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-primary shadow-xs transition-all hover:border-primary hover:bg-background cursor-pointer active:scale-95 sm:text-sm"
                >
                  <MessageCircle className="h-4 w-4 text-accent" />
                  <span>Get Instant Quote</span>
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
