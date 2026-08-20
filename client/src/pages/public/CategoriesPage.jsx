import { useEffect, useState, useMemo } from 'react'
import { Search, FolderTree, Sparkles, ShieldCheck, Zap, Award } from 'lucide-react'
import Container from '../../components/Container'
import CategoryCard from '../../components/CategoryCard'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import Button from '../../components/Button'
import { getCategories } from '../../services/categories'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    setError(false)
    getCategories({ status: 'active', sort: 'display_order_asc' })
      .then((data) => {
        setCategories(data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load categories:', err)
        setError(true)
        setLoading(false)
      })
  }, [])

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const term = searchQuery.toLowerCase().trim()
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term)) ||
        c.slug.toLowerCase().includes(term)
    )
  }, [categories, searchQuery])

  const breadcrumbsList = [
    { name: 'Home', url: '/' },
    { name: 'Printing Categories', url: '/categories' },
  ]

  return (
    <div className="bg-[#FFFFFF] text-[#000000] py-12 sm:py-16">
      {/* SEO Head Management */}
      <SEOHead
        title="Printing Categories Dubai | Commercial Printing Solutions | ONPRINT"
        description="Browse all professional printing categories by ONPRINT in Dubai: Brochures, Luxury Business Cards, Marketing Flyers, PVC ID Cards, Lanyards, Letterheads, and Name Badges."
        keywords="printing categories dubai, commercial printing dubai, brochure printing, business cards, flyers printing, id cards, lanyards, letterheads, name badges dubai"
        canonicalPath="/categories"
        breadcrumbs={breadcrumbsList}
      />

      <Container>
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Categories' },
          ]}
        />

        {/* Page Hero Header */}
        <div className="mt-8 border-b border-[#000000]/10 pb-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19] bg-[#FFFFFF] px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#A82F19]">
              <Sparkles className="h-3.5 w-3.5 text-[#A82F19]" />
              Dubai Commercial Printing Press
            </div>
            <h1 className="font-display mt-4 text-3xl font-black tracking-tight text-[#000000] sm:text-5xl">
              Professional Printing Categories
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#000000]/70 sm:text-lg">
              Explore our comprehensive range of high-precision commercial printing services and corporate brand collaterals manufactured locally in Dubai with express delivery across the UAE.
            </p>
          </Reveal>

          {/* Search Bar */}
          <div className="mt-8 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories (e.g. Brochures, Business Cards)..."
              className="w-full rounded-2xl border border-[#000000]/20 bg-[#FFFFFF] pl-10 pr-4 py-3 text-xs font-semibold text-[#000000] placeholder-[#000000]/40 focus:border-[#A82F19] focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Category Grid Section */}
        <div className="mt-12">
          {loading && <LoadingState label="Loading printing categories from database..." />}

          {error && !loading && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
              <p className="text-sm font-bold text-red-700">Unable to load categories from database.</p>
              <Button
                variant="accent"
                size="sm"
                onClick={() => window.location.reload()}
                className="cursor-pointer"
              >
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && filteredCategories.length === 0 && (
            <EmptyState
              title="No categories found"
              description={searchQuery ? 'No category matches your search.' : 'No active printing categories currently available.'}
            />
          )}

          {!loading && !error && filteredCategories.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredCategories.map((category, idx) => (
                <Reveal key={category.id || category.slug} delay={idx * 0.05}>
                  <CategoryCard category={category} priority={idx < 4} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        {/* Value Props Strip */}
        <div className="mt-20 rounded-3xl border border-[#000000]/10 bg-[#FFFFFF] p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#A82F19]/10 text-[#A82F19]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#000000]">Strict Quality Control</h4>
                <p className="mt-1 text-xs text-[#000000]/70">
                  Every print job undergoes prepress verification, Pantone calibration, and tactile finishing inspections.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#A82F19]/10 text-[#A82F19]">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#000000]">Express Same-Day Turnaround</h4>
                <p className="mt-1 text-xs text-[#000000]/70">
                  Need urgent collaterals for a Dubai World Trade Centre exhibition? We dispatch fast across the UAE.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#A82F19]/10 text-[#A82F19]">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#000000]">Luxury Paper Stocks</h4>
                <p className="mt-1 text-xs text-[#000000]/70">
                  Curated selection of FSC-certified cardstocks, soft-touch laminates, metallic gold foils, and painted edges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
