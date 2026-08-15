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
    <section className="relative overflow-hidden border-t border-[#000000]/10 bg-[#FFFFFF] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Column: High-Impact Visual Studio Showcase */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto overflow-hidden rounded-3xl border border-[#000000]/15 bg-[#000000] shadow-2xl group"
            >
              {/* Corner Crop Marks */}
              <CornerMarks className="absolute top-4 left-4 z-20 h-6 w-6 text-[#FFFFFF]/60" />
              <CornerMarks className="absolute bottom-4 right-4 z-20 h-6 w-6 rotate-180 text-[#FFFFFF]/60" />

              {/* Main Flag / Event Print Photography */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden">
                <img
                  src={flagImg}
                  alt="Outdoor Flags & Express Corporate Print Dubai"
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-[#000000]/20" />
              </div>

              {/* Floating Quality Badge Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-20 rounded-2xl border border-[#000000]/15 bg-[#FFFFFF]/95 p-4.5 backdrop-blur-md shadow-xl sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A82F19]/10 text-[#A82F19]">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-black text-[#000000]">Dubai Express Production</h4>
                      <p className="text-[11px] font-bold text-[#000000]/60">Passed 100% Quality Pre-flight</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#A82F19] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#FFFFFF] shadow-xs">
                    Verified
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Decorative Offset Backing Card */}
            <div className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl border border-[#A82F19]/30 bg-[#A82F19]/5 hidden sm:block" />
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
              <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19] bg-[#FFFFFF] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-[#A82F19] mb-3">
                <Sparkles className="h-3 w-3 text-[#A82F19]" />
                Seamless &amp; Express Service
              </div>

              {/* Main Title */}
              <h2 className="font-display text-3xl font-black tracking-tight text-[#000000] sm:text-4xl lg:text-5xl">
                Carefree Shopping
              </h2>

              {/* Dual Accent Bar Line */}
              <div className="mt-3 flex items-center gap-1.5 mb-8">
                <span className="h-1.5 w-20 rounded-full bg-[#A82F19]" />
                <span className="h-1.5 w-3 rounded-full bg-[#A82F19]/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#A82F19]/20" />
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
                      className="group flex items-start gap-4 rounded-2xl border border-[#000000]/15 bg-[#FFFFFF] p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#A82F19] hover:shadow-md"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#A82F19]/10 text-[#A82F19] transition-transform group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-base font-extrabold text-[#000000] group-hover:text-[#A82F19] transition-colors">
                            {item.title}
                          </h3>
                          <span className="rounded-full bg-[#FFFFFF] border border-[#000000]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#000000]/60">
                            {item.badge}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-[#000000]/70 sm:text-sm">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Call to Action Row */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#A82F19] px-7 py-4 text-xs font-black uppercase tracking-wider text-[#FFFFFF] shadow-lg shadow-[#A82F19]/25 transition-all hover:bg-[#8f2513] hover:scale-[1.02] cursor-pointer active:scale-95 sm:text-sm"
                >
                  <span>Contact Sales Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/get-a-quote"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#000000] bg-[#FFFFFF] px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-[#000000] shadow-xs transition-all hover:border-[#A82F19] hover:text-[#A82F19] cursor-pointer active:scale-95 sm:text-sm"
                >
                  <MessageCircle className="h-4 w-4 text-[#A82F19]" />
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
