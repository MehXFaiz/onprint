import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  FolderTree,
  Sparkles,
  ShieldCheck,
  Zap,
  Award,
  ArrowRight,
  ChevronRight,
  Briefcase,
  Megaphone,
  Tag,
  Layers,
  Building2,
  X,
} from 'lucide-react'
import Container from '../../components/Container'
import CategoryCard from '../../components/CategoryCard'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import Button from '../../components/Button'
import { getCategories } from '../../services/categories'
import { MASTER_DEPARTMENTS } from '../../data/masterDepartments'

const DEPARTMENT_ICONS = {
  'business-office-printing': Briefcase,
  'marketing-promotional-printing': Megaphone,
  'stickers-labels-packaging': Tag,
  'signage-displays-banners': Layers,
  'specialty-corporate-gifts': Sparkles,
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all')

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

  // Filter departments or subcategories based on search
  const filteredDepartments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q && selectedDeptFilter === 'all') {
      return MASTER_DEPARTMENTS
    }

    return MASTER_DEPARTMENTS.filter((dept) => {
      const matchFilter = selectedDeptFilter === 'all' || dept.slug === selectedDeptFilter
      if (!matchFilter) return false

      if (!q) return true

      const deptMatch =
        dept.name.toLowerCase().includes(q) ||
        dept.description.toLowerCase().includes(q) ||
        dept.eyebrow.toLowerCase().includes(q)

      const subMatch = dept.subcategories.some(
        (sub) =>
          sub.name.toLowerCase().includes(q) ||
          sub.shortDesc.toLowerCase().includes(q)
      )

      return deptMatch || subMatch
    })
  }, [searchQuery, selectedDeptFilter])

  // Filter store categories based on search query
  const filteredStoreCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return categories
    return categories.filter(
      (cat) =>
        (cat.name || '').toLowerCase().includes(q) ||
        (cat.description || '').toLowerCase().includes(q) ||
        (cat.slug || '').toLowerCase().includes(q)
    )
  }, [categories, searchQuery])

  const breadcrumbsList = [
    { name: 'Home', url: '/' },
    { name: 'Departments & Categories', url: '/categories' },
  ]

  return (
    <div className="bg-[#040A18] text-slate-200 py-12 sm:py-16">
      {/* SEO Head Management */}
      <SEOHead
        title="Printing Categories & Departments Dubai | Commercial Printing Catalog | ONPRINT"
        description="Browse all 5 master printing departments and 19 categories by ONPRINT in Dubai: Business cards, brochures, flyers, stickers, roll-up banners, and corporate gifts."
        keywords="printing categories dubai, master print departments, commercial printing dubai, brochure printing, business cards, flyers printing, stickers dubai"
        canonicalPath="/categories"
        breadcrumbs={breadcrumbsList}
      />

      <Container>
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Departments & Categories' },
          ]}
        />

        {/* Page Hero Header */}
        <div className="mt-8 border-b border-[#122240] pb-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65]/40 bg-[#081226] px-4 py-1 text-xs font-black uppercase tracking-widest text-[#D4AF65]">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF65]" />
              Dubai Commercial Printing Press • Master Architecture
            </div>
            <h1 className="font-display mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Printing Departments &amp; Categories
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Explore ONPRINT's 5 master commercial printing departments. Find luxury stationery, high-volume promotional items, large format displays, and custom corporate gifts manufactured locally in Al Quoz, Dubai.
            </p>
          </Reveal>

          {/* Quick Filter Department Pills + Search Bar */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedDeptFilter('all')}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  selectedDeptFilter === 'all'
                    ? 'bg-[#D4AF65] text-[#040A18] shadow-sm'
                    : 'bg-[#081226] border border-[#122240] text-slate-300 hover:text-white'
                }`}
              >
                All Departments (5)
              </button>
              {MASTER_DEPARTMENTS.map((dept) => (
                <button
                  key={dept.slug}
                  type="button"
                  onClick={() => setSelectedDeptFilter(dept.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    selectedDeptFilter === dept.slug
                      ? 'bg-[#D4AF65] text-[#040A18] shadow-sm'
                      : 'bg-[#081226] border border-[#122240] text-slate-300 hover:text-white'
                  }`}
                >
                  {dept.shortName || dept.name}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories (e.g. Business Cards)..."
                className="w-full rounded-2xl border border-[#122240] bg-[#081226] pl-10 pr-9 py-2.5 text-xs font-semibold text-white placeholder:text-slate-400 focus:border-[#D4AF65] focus:outline-none shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Master Departments Showcase Grid */}
        <div className="mt-12 space-y-16">
          {filteredDepartments.length === 0 ? (
            <EmptyState
              title="No printing departments or categories found"
              note={searchQuery ? `No category matched "${searchQuery}". Try a different keyword.` : 'No categories available.'}
              actionLabel={searchQuery ? 'Clear Search' : undefined}
              onAction={searchQuery ? () => setSearchQuery('') : undefined}
            />
          ) : (
            filteredDepartments.map((dept, deptIdx) => {
              const Icon = DEPARTMENT_ICONS[dept.slug] || Layers
              const totalProdCount = dept.subcategories.reduce(
                (acc, s) => acc + (s.productSlugs?.length || 0),
                0
              )

              return (
                <section
                  key={dept.slug}
                  className="rounded-3xl border border-[#122240] bg-[#081226] p-6 sm:p-8 relative overflow-hidden"
                >
                  {/* Department Banner Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#122240]/80">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF65] text-[#040A18] shrink-0 shadow-md">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF65]">
                            {dept.eyebrow}
                          </span>
                          <span className="rounded-full bg-[#040A18] border border-[#122240] px-2 py-0.2 text-[9px] font-bold text-slate-300">
                            {totalProdCount} Products
                          </span>
                        </div>
                        <h2 className="font-display text-2xl font-black text-white sm:text-3xl mt-0.5">
                          {dept.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
                          {dept.description}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/categories/${dept.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#D4AF65] hover:bg-[#D4AF65] px-5 py-2.5 text-xs font-black text-[#040A18] transition-all shrink-0 self-start lg:self-center"
                    >
                      <span>Explore Department</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {/* Subcategories Grid */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dept.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        to={`/categories/${sub.slug}`}
                        className="group rounded-2xl border border-[#122240] bg-[#040A18] p-3.5 hover:border-[#D4AF65] transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-800 mb-3">
                            <img
                              src={sub.image}
                              alt={sub.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = '/assets/products/luxury_business_cards_dubai.jpg'
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-display text-xs font-bold text-white group-hover:text-[#D4AF65] transition-colors truncate">
                              {sub.name}
                            </h3>
                            <span className="rounded-full bg-[#081226] border border-[#122240] px-1.5 py-0.2 text-[9px] font-bold text-slate-400 shrink-0">
                              {sub.productSlugs.length}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                            {sub.shortDesc}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#122240]/60 flex items-center justify-between text-[11px] font-bold text-[#D4AF65]">
                          <span>{sub.featuredBadge || 'View Products'}</span>
                          <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )
            })
          )}
        </div>

        {/* Complete 19-Category Store Directory */}
        {!loading && filteredStoreCategories.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#122240]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#D4AF65]">
                  COMPLETE DUBAI PRINT DIRECTORY
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-[#F5F2EB] mt-1">
                  All {filteredStoreCategories.length} Store Categories
                </h2>
                <p className="text-xs sm:text-sm text-[#B0BECE] mt-1 max-w-2xl">
                  Browse any product category directly or click WhatsApp to receive an instant custom quotation from our Al Quoz pressroom.
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF65] hover:underline shrink-0"
              >
                <span>View All 120+ Products</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
              {filteredStoreCategories.map((cat, idx) => (
                <CategoryCard key={cat.slug || cat.id || idx} category={cat} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Commercial Press Capabilities */}
        <div className="mt-20 rounded-3xl border border-[#122240] bg-[#081226] p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF65]/10 text-[#D4AF65]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Strict Quality Control</h4>
                <p className="mt-1 text-xs text-slate-300">
                  Every print job undergoes prepress verification, Fogra39 color calibration, and tactile finishing inspections.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF65]/10 text-[#D4AF65]">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Express Same-Day Turnaround</h4>
                <p className="mt-1 text-xs text-slate-300">
                  Need urgent collaterals for a Dubai World Trade Centre exhibition? We dispatch fast across the UAE.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF65]/10 text-[#D4AF65]">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Luxury Paper Stocks</h4>
                <p className="mt-1 text-xs text-slate-300">
                  Curated selection of FSC-certified cardstocks, soft-touch laminates, 24K hot foils, and painted edges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
