import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import Container from './Container'

export default function SampleBoxCTA() {
  return (
    <section className="relative overflow-hidden bg-[#F5F0E7] py-16 sm:py-20 border-y border-[#DED2C1]">
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 1, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 sm:p-12 lg:p-14 relative overflow-hidden bg-[#FAF8F3] border border-[#DED2C1] rounded-3xl shadow-xl hover-shimmer card-hover-lift"
        >
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-[#795C43]/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-[#795C43]/5 blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DED2C1] bg-[#F5F0E7] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#795C43] shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-[#795C43]" />
                <span>Executive Print Consultation • Dubai &amp; UAE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#352719] tracking-tight leading-tight">
                Feel the Weight &amp; Tactile Finishes Before You Commit.
              </h2>

              <p className="text-sm sm:text-base text-[#756657] leading-relaxed max-w-xl">
                Request our curated <strong className="text-[#352719]">Luxury Material &amp; Finishes Sample Box</strong>. Includes physical swatches of 600 GSM Cotton, Soft-Touch Velvet, 24K Hot Foil, Raised 3D Spot UV, and Painted Edge business cards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-[#352719]">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#F5F0E7] text-[#795C43] flex items-center justify-center shrink-0 border border-[#DED2C1]">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>100% Complimentary for UAE Brands</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#F5F0E7] text-[#795C43] flex items-center justify-center shrink-0 border border-[#DED2C1]">
                    <Truck className="h-3.5 w-3.5" />
                  </div>
                  <span>Dispatched Within 24 Hours in Dubai</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#F5F0E7] text-[#795C43] flex items-center justify-center shrink-0 border border-[#DED2C1]">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>Includes CMYK &amp; Pantone Guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#F5F0E7] text-[#795C43] flex items-center justify-center shrink-0 border border-[#DED2C1]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>15+ Paper Stock &amp; Finish Chips</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-3.5 lg:pl-6">
              <Link
                to="/contact?inquiry=Sample+Box+Request"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#795C43] hover:bg-[#5D442E] px-4 sm:px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-md transition-all cursor-pointer text-center"
              >
                <span>Schedule VIP Print Consultation</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
              <Link
                to="/get-a-quote"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DED2C1] bg-[#F5F0E7] hover:bg-[#EDE3D5] hover:border-[#C5A989] text-[#352719] px-4 sm:px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer text-center shadow-xs"
              >
                <span>Instant Project Quote</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
