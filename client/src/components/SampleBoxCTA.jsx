import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Package, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import Container from './Container'

export default function SampleBoxCTA() {
  return (
    <section className="relative overflow-hidden bg-[#161210] py-16 sm:py-20 text-white border-y border-[#A82F19]/30">
      {/* Ambient background styling */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_50%,rgba(168,47,25,0.22),transparent_70%),radial-gradient(ellipse_50%_40%_at_85%_50%,rgba(212,175,55,0.18),transparent_70%)]" />

      <Container className="relative z-10">
        <div className="rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#201814] via-[#2a1d17] to-[#1c1411] p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Complimentary Press Kit • Dubai &amp; UAE</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                Feel the Weight &amp; Tactile Finishes Before You Commit.
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                Request our curated <strong>Luxury Material &amp; Finishes Sample Box</strong>. Includes physical swatches of 600 GSM Cotton, Soft-Touch Velvet, 24K Hot Foil, Raised 3D Spot UV, and Painted Edge business cards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-neutral-200">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>100% Free for UAE Registered Businesses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>Dispatched Within 24 Hours in Dubai</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>Includes CMYK &amp; Pantone Color Chart</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>15+ Paper Stock &amp; Finish Chips</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-3.5 lg:pl-6">
              <Link
                to="/contact?inquiry=Sample+Box+Request"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#A82F19] hover:bg-[#8c2211] px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#A82F19]/40 transition-all hover:-translate-y-0.5 cursor-pointer text-center"
              >
                <span>Claim Free Sample Kit</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/get-a-quote"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white transition-all cursor-pointer text-center"
              >
                <span>Instant Project Quote</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
