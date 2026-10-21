import { Sparkles, ArrowRight, ShieldCheck, Layers, CheckCircle2, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../../components/Container'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import Button from '../../components/Button'
import LuxuryFinishesShowcase from '../../components/LuxuryFinishesShowcase'

export default function FinishingShowcasePage() {
  return (
    <div className="py-16 sm:py-24 bg-[#101D35] text-[#F5F2EB]">
      <SEOHead
        title="Luxury Printing Finishes & Embellishments Dubai | ONPRINT"
        description="Explore tactile commercial printing finishes engineered on our Al Quoz press floor: 24K gold foil, raised 3D spot UV, blind debossing, velvet lamination, gilded edges, letterpress, and PUR binding."
        keywords="printing finishes dubai, gold foil stamping dubai, spot uv printing uae, debossing dubai, luxury business card finishes, pur binding dubai"
        canonicalPath="/finishes"
        breadcrumbs={[{ name: 'Finishing Showcase', url: '/finishes' }]}
      />

      <Container>
        <Breadcrumbs items={[{ name: 'Finishing Showcase' }]} />

        {/* Hero Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#172644] border border-[#203357] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#D4AF65]">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF65]" />
            <span>Al Quoz Master Presswork</span>
          </div>
          <h1 className="font-display mt-3 text-3xl font-black tracking-tight text-[#F5F2EB] sm:text-5xl">
            Commercial Print Finishes &amp; Tactile Embellishments
          </h1>
          <p className="mt-4 text-base text-[#A0AEC0] leading-relaxed">
            Elevate executive stationery, luxury packaging, and corporate publications with signature embellishments calibrated for exceptional tactile impact under Dubai lighting.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button to="/get-a-quote?service=Luxury+Finishing" variant="accent" size="md">
              Order Custom Swatch Box
            </Button>
            <Button to="/portfolio" variant="outline" size="md">
              View Finished Case Studies
            </Button>
          </div>
        </div>
      </Container>

      {/* Embedded Interactive 8-Craft Showcase Component */}
      <LuxuryFinishesShowcase />

      {/* Technical Specifications Grid */}
      <Container className="mt-20">
        <div className="rounded-3xl border border-[#203357] bg-[#172644] p-8 sm:p-12 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-3">
            <ShieldCheck className="h-4 w-4" />
            <span>Pre-Press &amp; Production Standards</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-[#F5F2EB] mb-6">
            Prepress Guidelines for Specialty Finishes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-[#A0AEC0]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
              <h3 className="font-bold text-[#F5F2EB] text-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#D4AF65]" />
                Foil &amp; Spot UV Layering
              </h3>
              <p className="leading-relaxed">
                Provide finish layers as 100% Solid Black (K=100) vector elements on a separate named artboard in Adobe Illustrator or PDF/X-4. Minimum stroke width: 0.25 pt.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
              <h3 className="font-bold text-[#F5F2EB] text-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#D4AF65]" />
                Embossing &amp; Debossing Dies
              </h3>
              <p className="leading-relaxed">
                Requires vector vector outlines without gradients. We recommend duplexed cotton boards (minimum 400 GSM) to achieve deep sculptural indentation without back-press show-through.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
              <h3 className="font-bold text-[#F5F2EB] text-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#D4AF65]" />
                Bleed &amp; Dieline Precision
              </h3>
              <p className="leading-relaxed">
                All finished cut pieces require 3mm external bleed and 4mm internal safety margins. Custom cutting dielines must be designated in a distinct Spot Color named &quot;DieLine&quot;.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#203357] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6B7C96]">
              Need assistance setting up your artwork layers? Our Al Quoz prepress team provides complimentary file pre-flight checks.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF65] hover:underline shrink-0"
            >
              <span>Contact Prepress Engineer</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
