import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Truck, BadgePercent, ArrowRight, PhoneCall, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react'
import { CornerMarks } from './PrintMarks'
import carefreeShoppingImg from '../assets/products/carefree_shopping.jpg'
import { trackGetQuoteClick, trackProductInquiry } from '../utils/analytics'

const features = [
  {
    icon: ShieldCheck,
    title: 'Secured UAE Shipping',
    description: 'White-glove doorstep delivery anywhere across Dubai, Abu Dhabi, and all 7 Emirates with real-time tracking.',
    badge: '100% Insured',
  },
  {
    icon: Truck,
    title: 'Next-Day Express Delivery',
    description: 'Rapid 24-hour turnaround & same-day priority dispatch from our Al Quoz pressfloor.',
    badge: 'Priority Press',
  },
  {
    icon: BadgePercent,
    title: 'Guaranteed Best Prices',
    description: 'Direct manufacturer pricing with zero broker fees. Free vector pre-flight verification with every order.',
    badge: 'Direct Pressfloor',
  },
]

export default function CarefreeShoppingSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.08] bg-[#090A0D] py-20 sm:py-28 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Studio Showcase */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto overflow-hidden rounded-3xl border border-white/[0.12] bg-neutral-950 shadow-2xl group"
            >
              {/* Corner Crop Marks */}
              <CornerMarks className="absolute top-4 left-4 z-20 h-6 w-6 text-white/40" />
              <CornerMarks className="absolute bottom-4 right-4 z-20 h-6 w-6 rotate-180 text-white/40" />

              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-neutral-900">
                <img
                  src={carefreeShoppingImg}
                  alt="Corporate Gifts & Express Print Dispatch Dubai"
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Copy & Feature Grid */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-[#D4AF37]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Carefree Production Guarantee</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Commercial Printing Made Simple, Fast &amp; Flawless.
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Experience seamless printing in Dubai. From pre-press artwork proofing to rapid delivery, our Al Quoz pressroom guarantees precision at every step.
            </p>

            <div className="space-y-4 pt-2">
              {features.map((feat) => {
                const Icon = feat.icon
                return (
                  <div
                    key={feat.title}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4.5 transition-all hover:border-[#D4AF37]/40 backdrop-blur-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#A82F19] to-[#7A1C0D] text-white shadow-md">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-sm font-black text-white">{feat.title}</h4>
                          <span className="rounded-md bg-white/[0.06] border border-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#D4AF37]">
                            {feat.badge}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed">{feat.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/get-a-quote"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A82F19] to-[#C7371E] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all hover:brightness-110"
                onClick={() => trackGetQuoteClick({ source_page: 'carefree_section' })}
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
