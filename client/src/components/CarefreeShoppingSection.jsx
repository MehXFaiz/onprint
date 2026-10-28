import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Truck, BadgePercent, ArrowRight, Sparkles } from 'lucide-react'
import carefreeShoppingImg from '../assets/products/carefree_shopping.jpg'
import carefreeShoppingWebp from '../assets/products/carefree_shopping.webp'
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
    <section className="relative overflow-hidden bg-[#040A18] py-20 sm:py-24 text-[#F5F2EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Studio Showcase */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 1, scale: 0.98, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto overflow-hidden p-2 rounded-3xl border border-[#122240] bg-[#081226] shadow-lg group"
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-2xl bg-[#020611]">
                <picture>
                  <source type="image/webp" srcSet={carefreeShoppingWebp} />
                  <img
                    src={carefreeShoppingImg}
                    alt="Corporate Gifts & Express Print Dispatch Dubai"
                    width="540"
                    height="405"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020611]/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Copy & Feature Grid */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#122240] bg-[#081226] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF65] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF65]" />
              <span>Carefree Production Guarantee</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F2EB] leading-tight">
              Commercial Printing Made Simple, Fast &amp; Flawless.
            </h2>

            <p className="text-sm sm:text-base text-[#A0AEC0] leading-relaxed">
              Experience seamless printing in Dubai. From pre-press artwork proofing to rapid delivery, our Al Quoz pressroom guarantees absolute color precision at every step.
            </p>

            <div className="space-y-3.5 pt-2">
              {features.map((feat, idx) => {
                const Icon = feat.icon
                return (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 1, x: 8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    transition={{ delay: idx * 0.08, duration: 0.45 }}
                    className="rounded-2xl border border-[#122240] bg-[#081226] p-4 shadow-xs hover:border-[#D4AF65] hover:shadow-md transition-all cursor-pointer card-hover-lift hover-shimmer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#040A18] border border-[#122240] text-[#D4AF65] shadow-2xs">
                        <Icon className="h-5 w-5 text-[#D4AF65]" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#F5F2EB]">{feat.title}</h4>
                          <span className="rounded-md bg-[#040A18] border border-[#122240] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D4AF65]">
                            {feat.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#A0AEC0] leading-relaxed">{feat.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/get-a-quote"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF65] hover:bg-[#C8B185] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-[#040A18] shadow-xs transition-all"
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
