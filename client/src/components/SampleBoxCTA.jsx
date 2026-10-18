import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import Container from './Container'

export default function SampleBoxCTA() {
  return (
    <section className="relative overflow-hidden bg-[#101D35] py-16 sm:py-20 text-white border-y border-[#28395A]">
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bento-card-dark p-8 sm:p-12 lg:p-14 relative overflow-hidden bg-[#162542] border border-[#28395A] rounded-3xl shadow-xl hover-shimmer card-hover-lift"
        >
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-[#D4AF65]/15 blur-3xl animate-pulse" />
          <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Complimentary Swatch Kit • Dubai &amp; UAE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Feel the Weight &amp; Tactile Finishes Before You Commit.
              </h2>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
                Request our curated <strong className="text-white">Luxury Material &amp; Finishes Sample Box</strong>. Includes physical swatches of 600 GSM Cotton, Soft-Touch Velvet, 24K Hot Foil, Raised 3D Spot UV, and Painted Edge business cards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-zinc-300">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/10 text-[#D4AF65] flex items-center justify-center shrink-0 border border-white/15">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>100% Complimentary for UAE Brands</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/10 text-[#D4AF65] flex items-center justify-center shrink-0 border border-white/15">
                    <Truck className="h-3.5 w-3.5" />
                  </div>
                  <span>Dispatched Within 24 Hours in Dubai</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/10 text-[#D4AF65] flex items-center justify-center shrink-0 border border-white/15">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>Includes CMYK &amp; Pantone Guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/10 text-[#D4AF65] flex items-center justify-center shrink-0 border border-white/15">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>15+ Paper Stock &amp; Finish Chips</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-3.5 lg:pl-6">
              <Link
                to="/contact?inquiry=Sample+Box+Request"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF65] hover:bg-[#B89245] px-4 sm:px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-[#101D35] shadow-lg transition-all cursor-pointer text-center"
              >
                <span>Claim Free Sample Kit</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
              <Link
                to="/get-a-quote"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 hover:bg-white hover:text-[#101D35] px-4 sm:px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all cursor-pointer text-center"
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
