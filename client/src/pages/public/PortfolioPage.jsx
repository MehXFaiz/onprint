import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Container from '../../components/Container'
import SectionHeading from '../../components/SectionHeading'
import Reveal from '../../components/Reveal'
import EmptyState from '../../components/EmptyState'
import Button from '../../components/Button'
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
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Portfolio &amp; Work"
            title="Selected press runs &amp; brand collateral."
            subtitle="A curated editorial look at stationery, packaging, and high-impact press projects produced in Dubai."
          />
          <Button to="/get-a-quote" variant="accent" className="shrink-0">
            Start Your Project
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="mt-10 flex flex-wrap gap-2.5 border-b border-border pb-8">
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

