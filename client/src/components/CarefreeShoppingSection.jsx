import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Truck, BadgePercent, ArrowRight, Sparkles } from 'lucide-react'
import carefreeShoppingImg from '../assets/products/carefree_shopping.jpg'
import { trackGetQuoteClick } from '../utils/analytics'

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
    description: 'Rapid 24-hour turnaround & same-day priority dispatch directly from our Al Quoz pressfloor.',
    badge: 'Priority Press',
  },
  {
    icon: BadgePercent,
    title: 'Direct Manufacturer Pricing',
    description: 'Direct press pricing with zero broker markups. Free vector pre-flight verification with every order.',
    badge: 'Best Value',
  },
]

export default function CarefreeShoppingSection() {
  return (
    <section className="relative overflow-hidden border-t border-slate-200 bg-white py-20 sm:py-24 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Studio Showcase */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl group"
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-slate-100">
                <img
                  src={carefreeShoppingImg}
                  alt="Corporate Gifts & Express Print Dispatch Dubai"
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Copy & Feature Grid */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19]/20 bg-[#A82F19]/5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Carefree Production Guarantee</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Commercial Printing Made Simple, Fast &amp; Flawless.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Experience seamless printing in Dubai. From pre-press artwork proofing to rapid delivery, our Al Quoz pressroom guarantees absolute color precision at every step.
            </p>

            <div className="space-y-3.5 pt-2">
              {features.map((feat) => {
                const Icon = feat.icon
                return (
                  <div
                    key={feat.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:bg-slate-100/70 hover:border-slate-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A82F19] text-white shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-sm font-bold text-slate-900">{feat.title}</h4>
                          <span className="rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                            {feat.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/get-a-quote"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A82F19] hover:bg-[#8e2614] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#A82F19]/25 transition-all hover:-translate-y-0.5"
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
