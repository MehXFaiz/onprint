import { useState } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import Container from '../../components/Container'
import Reveal from '../../components/Reveal'
import EmptyState from '../../components/EmptyState'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import { portfolioCategories, portfolioItems } from '../../data/portfolio'

import { Link } from 'react-router-dom'

function PortfolioTile({ item }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A82F19] hover:shadow-xl">
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
          {item.clientSector && (
            <span className="hidden sm:inline-block rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black backdrop-blur-xs">
              {item.clientSector}
            </span>
          )}
        </div>
        <Link
          to={`/get-a-quote?service=${encodeURIComponent(item.title)}`}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#A82F19] text-white opacity-0 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
          title="Inquire about this spec"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Project Details */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A82F19]">
            Dubai Press Production
          </p>
          <h3 className="font-display mt-1.5 text-lg font-black tracking-tight text-black group-hover:text-[#A82F19] transition-colors">
            {item.title}
          </h3>
          {item.specs && (
            <p className="mt-2.5 text-xs font-semibold leading-relaxed text-neutral-600">
              {item.specs}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-black/8 pt-4">
          <span className="text-[11px] font-bold text-neutral-500">
            {item.clientSector || 'Commercial Client'}
          </span>
          <Link
            to={`/get-a-quote?service=${encodeURIComponent(item.title)}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#A82F19] hover:underline"
          >
            <span>Quote This Spec</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const items =
    activeCategory === 'All' ? portfolioItems : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <div className="py-16 sm:py-24">
      <SEOHead
        title="Commercial Print & Branding Portfolio Dubai | ONPRINT"
        description="Explore our curated portfolio of executive business stationery, custom packaging boxes, luxury gift sets, and large-format signage produced for UAE brands."
        keywords="printing portfolio dubai, luxury print samples uae, custom packaging showcase dubai, branding collateral uae"
        canonicalPath="/portfolio"
        breadcrumbs={[{ name: 'Portfolio', url: '/portfolio' }]}
      />

      <Container>
        <Breadcrumbs items={[{ name: 'Portfolio' }]} />

        <div className="flex flex-col items-start justify-between gap-6 border-b border-border pb-10 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SELECTED PRESS WORK</span>
            </div>
            <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
              Commercial Printing &amp; Luxury Branding Portfolio
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">
              A curated editorial showcase of stationery, packaging boxes, and high-impact press projects produced in Dubai.
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
                  <PortfolioTile item={item} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
