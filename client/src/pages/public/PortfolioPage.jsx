import { useState } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import Container from '../../components/Container'
import Reveal from '../../components/Reveal'
import EmptyState from '../../components/EmptyState'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import { portfolioCategories, portfolioItems } from '../../data/portfolio'

const treatments = {
  dark: 'bg-primary text-background border border-primary',
  accent: 'bg-accent text-white border border-accent shadow-md shadow-accent/20',
  paper: 'border border-border bg-surface text-primary shadow-xs',
  duotone: 'bg-accent-soft text-primary border border-accent/20',
}

function PortfolioTile({ item }) {
  return (
    <div
      className={`group relative mb-6 block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${treatments[item.treatment]}`}
    >
      <div className={`${item.aspect} flex flex-col justify-between p-6 sm:p-8`}>
        <div className="flex items-start justify-between">
          <span className="rounded-full bg-background/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
            {item.category}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background/20 opacity-80 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-60">ONPRINT Showcase</p>
          <h3 className="font-display mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{item.title}</h3>
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

        {/* Portfolio Masonry Columns */}
        <div className="mt-12">
          {items.length === 0 ? (
            <EmptyState title="No projects in this category yet" note="Check back soon or select another category." />
          ) : (
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
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
