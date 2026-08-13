import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Container from '../../components/Container'
import SectionHeading from '../../components/SectionHeading'
import Reveal from '../../components/Reveal'
import EmptyState from '../../components/EmptyState'
import { portfolioCategories, portfolioItems } from '../../data/portfolio'

const treatments = {
  dark: 'bg-primary text-background',
  accent: 'bg-accent text-white',
  paper: 'border border-border bg-background text-primary',
  duotone: 'bg-accent-soft text-primary',
}

function PortfolioTile({ item }) {
  return (
    <div className={`group relative mb-6 block break-inside-avoid overflow-hidden ${treatments[item.treatment]}`}>
      <div className={`${item.aspect} flex flex-col justify-between p-6 transition-transform duration-500 group-hover:scale-[1.02]`}>
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">{item.category}</span>
          <ArrowUpRight className="h-5 w-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <h3 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">{item.title}</h3>
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const items =
    activeCategory === 'All' ? portfolioItems : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <div className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Our Work"
          title="Selected projects, printed."
          subtitle="A look at the packaging, branding, stationery and promotional work that's come off our press."
        />

        <div className="mt-10 flex flex-wrap gap-2 border-b border-border pb-8">
          {portfolioCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                activeCategory === cat
                  ? 'border border-primary bg-primary text-background'
                  : 'border border-border text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {items.length === 0 ? (
            <EmptyState title="No projects in this category yet" note="Check back soon, or browse another category." />
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
