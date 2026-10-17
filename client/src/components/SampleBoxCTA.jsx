import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Package, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import Container from './Container'

export default function SampleBoxCTA() {
  return (
    <section className="relative overflow-hidden bg-[#F3EDE2] py-16 sm:py-20 text-[#181411] border-y border-[#E4DCD0]">
      <Container className="relative z-10">
        <div className="bento-card-dark p-8 sm:p-12 lg:p-14 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-[#C89D54]/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-[#B83A22]/15 blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C89D54]/45 bg-[#C89D54]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#DFB973]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Complimentary Swatch Kit • Dubai &amp; UAE</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Feel the Weight &amp; Tactile Finishes Before You Commit.
              </h2>

              <p className="text-sm sm:text-base text-[#CFC4B4] leading-relaxed max-w-xl">
                Request our curated <strong className="text-white">Luxury Material &amp; Finishes Sample Box</strong>. Includes physical swatches of 600 GSM Cotton, Soft-Touch Velvet, 24K Hot Foil, Raised 3D Spot UV, and Painted Edge business cards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-[#FAF7F2]">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#C89D54]/20 text-[#DFB973] flex items-center justify-center shrink-0 border border-[#C89D54]/40">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>100% Complimentary for UAE Brands</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#C89D54]/20 text-[#DFB973] flex items-center justify-center shrink-0 border border-[#C89D54]/40">
                    <Truck className="h-3.5 w-3.5" />
                  </div>
                  <span>Dispatched Within 24 Hours in Dubai</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#C89D54]/20 text-[#DFB973] flex items-center justify-center shrink-0 border border-[#C89D54]/40">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>Includes CMYK &amp; Pantone Guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#C89D54]/20 text-[#DFB973] flex items-center justify-center shrink-0 border border-[#C89D54]/40">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>15+ Paper Stock &amp; Finish Chips</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-3.5 lg:pl-6">
              <Link
                to="/contact?inquiry=Sample+Box+Request"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#DFB973] via-[#C89D54] to-[#A87E35] hover:brightness-105 px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#181411] shadow-lg shadow-[#C89D54]/25 transition-all hover:-translate-y-0.5 cursor-pointer text-center"
              >
                <span>Claim Free Sample Kit</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/get-a-quote"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/18 px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all cursor-pointer text-center"
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
