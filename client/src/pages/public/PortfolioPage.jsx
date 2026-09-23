import { useState } from 'react'
import { ArrowUpRight, Sparkles, X, CheckCircle2, Layers, Briefcase, FileText, ChevronRight } from 'lucide-react'
import Container from '../../components/Container'
import Reveal from '../../components/Reveal'
import EmptyState from '../../components/EmptyState'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import { portfolioCategories, portfolioItems } from '../../data/portfolio'
import { Link } from 'react-router-dom'

function PortfolioTile({ item, onSelectCaseStudy }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A82F19] hover:shadow-xl">
      {/* Project Photography */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-xs">
            {item.category}
          </span>
          {item.industry && (
            <span className="hidden sm:inline-block rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black backdrop-blur-xs">
              {item.industry}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onSelectCaseStudy(item)}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#A82F19] text-white opacity-0 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 cursor-pointer"
          title="View full case study"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Project Details */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#A82F19]">
              Dubai Press Production
            </p>
            <span className="text-[10px] font-semibold text-neutral-400">Case Study</span>
          </div>
          <h3 className="font-display mt-1.5 text-lg font-black tracking-tight text-black group-hover:text-[#A82F19] transition-colors">
            {item.title}
          </h3>
          {item.specs && (
            <p className="mt-2.5 text-xs font-semibold leading-relaxed text-neutral-600">
              {item.specs}
            </p>
          )}
          {item.challenge && (
            <p className="mt-2 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
              <strong className="text-neutral-700">Challenge:</strong> {item.challenge}
            </p>
          )}
        </div>

        <div className="mt-5 space-y-3 border-t border-black/8 pt-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => onSelectCaseStudy(item)}
              className="inline-flex items-center gap-1 text-xs font-bold text-black hover:text-[#A82F19] transition-colors cursor-pointer"
            >
              <span>Read Case Study</span>
              <ChevronRight className="h-3 w-3" />
            </button>
            <Link
              to={`/get-a-quote?service=${encodeURIComponent(item.title)}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#A82F19] hover:underline"
            >
              <span>Quote Spec</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null)

  const items =
    activeCategory === 'All' ? portfolioItems : portfolioItems.filter((item) => item.category === activeCategory)

  // Generate ItemList schema of Case Studies for SEO/LLMs
  const portfolioSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ONPRINT Dubai Commercial Printing & Press Work Case Studies',
    itemListElement: portfolioItems.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.projectName || p.title,
        headline: p.title,
        description: p.challenge ? `${p.challenge} Solution: ${p.solution}` : p.specs,
        creator: {
          '@type': 'Organization',
          name: 'ONPRINT',
        },
        genre: p.category,
      },
    })),
  }

  return (
    <div className="py-16 sm:py-24">
      <SEOHead
        title="Commercial Print & Press Work Case Studies Dubai | ONPRINT"
        description="Explore verified commercial printing case studies produced in Al Quoz, Dubai. Executive business cards, corporate brochures, and branded collaterals delivered with precision."
        keywords="printing portfolio dubai, printing case studies uae, commercial print work dubai"
        canonicalPath="/portfolio"
        breadcrumbs={[{ name: 'Portfolio', url: '/portfolio' }]}
        structuredData={portfolioSchema}
      />

      <Container>
        <Breadcrumbs items={[{ name: 'Portfolio' }]} />

        <div className="flex flex-col items-start justify-between gap-6 border-b border-border pb-10 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              <span>VERIFIED CASE STUDIES &amp; PRESS WORK</span>
            </div>
            <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
              Commercial Printing &amp; Press Work Case Studies
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">
              A documented showcase of technical challenges, substrate engineering, and finished outcomes delivered on our Al Quoz press floor.
            </p>
          </div>
          <Button to="/get-a-quote" variant="accent" className="shrink-0">
            Start Your Project
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-2.5 border-b border-border pb-8">
          {portfolioCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary text-background shadow-xs'
                  : 'border border-border bg-surface text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="mt-12">
          {items.length === 0 ? (
            <EmptyState title="No projects in this category yet" note="Check back soon or select another category." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <Reveal key={item.id} delay={(index % 3) * 0.08}>
                  <PortfolioTile item={item} onSelectCaseStudy={setSelectedCaseStudy} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Interactive Case Study Modal */}
      {selectedCaseStudy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedCaseStudy(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedCaseStudy(null)}
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-10">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 font-extrabold uppercase text-[#A82F19]">
                  {selectedCaseStudy.category}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-bold text-slate-700">
                  Industry: {selectedCaseStudy.industry || selectedCaseStudy.clientSector}
                </span>
              </div>
              <h2 className="font-display mt-3 text-2xl sm:text-3xl font-black text-black">
                {selectedCaseStudy.projectName || selectedCaseStudy.title}
              </h2>
              <p className="mt-1 text-sm font-semibold text-[#A82F19]">
                Service: {selectedCaseStudy.serviceProvided || selectedCaseStudy.title}
              </p>
            </div>

            {/* Case Study Image */}
            <div className="mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
              <img
                src={selectedCaseStudy.image}
                alt={selectedCaseStudy.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Structured Case Study Grid */}
            <div className="mt-8 space-y-6">
              {/* Challenge */}
              <div className="rounded-xl border border-border bg-slate-50/70 p-5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
                  <Briefcase className="h-4 w-4 text-[#A82F19]" />
                  <span>The Project Challenge</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {selectedCaseStudy.challenge || 'Client required high-precision commercial printing with strict color calibration and fast delivery in the UAE.'}
                </p>
              </div>

              {/* Solution */}
              <div className="rounded-xl border border-border bg-slate-50/70 p-5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
                  <FileText className="h-4 w-4 text-[#A82F19]" />
                  <span>The Engineering &amp; Press Solution</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {selectedCaseStudy.solution || 'Produced on calibrated presses with custom dieline verification, pre-flight file checks, and hand-finished embellishments.'}
                </p>
              </div>

              {/* Materials & Finishes */}
              <div className="rounded-xl border border-border bg-slate-50/70 p-5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
                  <Layers className="h-4 w-4 text-[#A82F19]" />
                  <span>Materials &amp; Finishes Used</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {selectedCaseStudy.materialsAndFinishes || selectedCaseStudy.specs}
                </p>
              </div>

              {/* Verified Result */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Verified Outcome</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-emerald-800 font-medium">
                  {selectedCaseStudy.result || 'Delivered on schedule with 100% color fidelity and client approval across the UAE.'}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6">
              <span className="text-xs text-slate-500">
                Facility: Al Quoz Industrial Area 3, Dubai
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCaseStudy(null)}
                >
                  Close
                </Button>
                <Button
                  to={`/get-a-quote?service=${encodeURIComponent(selectedCaseStudy.title)}`}
                  variant="accent"
                  size="sm"
                  className="w-full sm:w-auto justify-center"
                >
                  Inquire About This Spec
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
