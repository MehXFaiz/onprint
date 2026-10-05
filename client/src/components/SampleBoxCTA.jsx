import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Package, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import Container from './Container'

export default function SampleBoxCTA() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 text-slate-900 border-y border-slate-200">
      {/* Soft gradient accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_50%,rgba(168,47,25,0.06),transparent_70%),radial-gradient(ellipse_50%_40%_at_85%_50%,rgba(241,245,249,0.8),transparent_70%)]" />

      <Container className="relative z-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 lg:p-14 shadow-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-[#A82F19]/5 blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19]/20 bg-[#A82F19]/5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Complimentary Press Kit • Dubai &amp; UAE</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                Feel the Weight &amp; Tactile Finishes Before You Commit.
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Request our curated <strong className="text-slate-900">Luxury Material &amp; Finishes Sample Box</strong>. Includes physical swatches of 600 GSM Cotton, Soft-Touch Velvet, 24K Hot Foil, Raised 3D Spot UV, and Painted Edge business cards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>100% Free for UAE Businesses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                    <Truck className="h-3.5 w-3.5" />
                  </div>
                  <span>Dispatched Within 24 Hours in Dubai</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>Includes CMYK &amp; Pantone Guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>15+ Paper Stock &amp; Finish Chips</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-3.5 lg:pl-6">
              <Link
                to="/contact?inquiry=Sample+Box+Request"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A82F19] hover:bg-[#8e2614] px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#A82F19]/25 transition-all hover:-translate-y-0.5 cursor-pointer text-center"
              >
                <span>Claim Free Sample Kit</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/get-a-quote"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 transition-all cursor-pointer text-center"
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
