import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Search,
  X,
  Sparkles,
  Layers,
  Briefcase,
  Megaphone,
  Tag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle,
  Building2,
} from 'lucide-react'
import Container from '../../components/Container'
import ProductCard from '../../components/ProductCard'
import ProductDetailModal from '../../components/ProductDetailModal'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'
import { trackViewCategory, trackSearch } from '../../utils/analytics'
import {
  MASTER_DEPARTMENTS,
  getDepartmentBySlug,
  getDepartmentForCategory,
  isDepartmentSlug,
} from '../../data/masterDepartments'

const DEPARTMENT_ICONS = {
  'business-office-printing': Briefcase,
  'marketing-promotional-printing': Megaphone,
  'stickers-labels-packaging': Tag,
  'signage-displays-banners': Layers,
  'specialty-corporate-gifts': Sparkles,
}

const ITEMS_PER_PAGE = 24

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeDeptParam = searchParams.get('department') || ''
  const activeCategoryParam = searchParams.get('category') || ''
  const searchQueryParam = searchParams.get('search') || ''
  const pageParam = parseInt(searchParams.get('page') || '1', 10)
  const sortParam = searchParams.get('sort') || 'featured'

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState(searchQueryParam)

  // Sync internal search input with URL search param
  useEffect(() => {
    setSearchQuery(searchQueryParam)
  }, [searchQueryParam])

  // Initial Load: All active catalog products & categories
  useEffect(() => {
    setLoading(true)
    setError(false)

    Promise.all([
      getProducts({ active: true, limit: 140 }),
      getCategories({ status: 'active', sort: 'display_order_asc' }),
    ])
      .then(([prodsRes, catsRes]) => {
        setProducts(prodsRes.data || prodsRes.products || (Array.isArray(prodsRes) ? prodsRes : []))
        setCategories(catsRes || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load products:', err)
        setError(true)
        setLoading(false)
      })
  }, [])

  // Resolve Active Department from either ?department= or inferred from ?category=
  const activeDepartment = useMemo(() => {
    if (activeDeptParam) {
      return getDepartmentBySlug(activeDeptParam)
    }
    if (activeCategoryParam) {
      return getDepartmentForCategory(activeCategoryParam)
    }
    return null
  }, [activeDeptParam, activeCategoryParam])

  // Track Analytics View
  useEffect(() => {
    const label = activeCategoryParam || activeDeptParam || 'All Products'
    trackViewCategory({
      category_name: label,
      category_slug: activeCategoryParam || activeDeptParam || 'all',
    })
  }, [activeDeptParam, activeCategoryParam])

  // Debounced Search Tracking
  useEffect(() => {
    if (!searchQueryParam || searchQueryParam.trim().length < 2) return
    const timer = setTimeout(() => {
      trackSearch({ search_term: searchQueryParam.trim() })
    }, 600)
    return () => clearTimeout(timer)
  }, [searchQueryParam])

  // Helper to update URL params
  function updateFilters(updates) {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, val]) => {
      if (!val) {
        next.delete(key)
      } else {
        next.set(key, val)
      }
    })
    // Reset to page 1 on filter changes unless explicit page update
    if (!('page' in updates)) {
      next.delete('page')
    }
    setSearchParams(next)
  }

  function handleSelectDepartment(deptSlug) {
    if (!deptSlug) {
      updateFilters({ department: '', category: '' })
    } else {
      updateFilters({ department: deptSlug, category: '' })
    }
  }

  function handleSelectCategory(catSlug) {
    updateFilters({ category: catSlug })
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    updateFilters({ search: searchQuery.trim() })
  }

  // Filter products by Department, Category, and Search Query
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Department match
      if (activeDeptParam) {
        const dept = getDepartmentBySlug(activeDeptParam)
        if (dept) {
          const match = dept.subcategories.some(
            (sub) => sub.productSlugs.includes(item.slug) || item.category?.slug === sub.slug
          )
          if (!match) return false
        }
      }

      // 2. Category match
      if (activeCategoryParam) {
        const itemCatSlug = item.category?.slug || item.category?.name?.toLowerCase() || ''
        const matchCat =
          itemCatSlug === activeCategoryParam ||
          (Array.isArray(item.categories) &&
            item.categories.some((c) => c?.slug === activeCategoryParam)) ||
          // Also check master department subcategory productSlugs
          MASTER_DEPARTMENTS.some((dept) =>
            dept.subcategories.some(
              (sub) => sub.slug === activeCategoryParam && sub.productSlugs.includes(item.slug)
            )
          )

        if (!matchCat) return false
      }

      // 3. Search query match
      if (searchQueryParam.trim()) {
        const q = searchQueryParam.toLowerCase().trim()
        const name = (item.name || '').toLowerCase()
        const desc = (item.shortDescription || item.description || '').toLowerCase()
        const cat = (item.category?.name || '').toLowerCase()
        if (!name.includes(q) && !desc.includes(q) && !cat.includes(q)) {
          return false
        }
      }

      return true
    })
  }, [products, activeDeptParam, activeCategoryParam, searchQueryParam])

  // Sorted Products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]
    if (sortParam === 'name-asc') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else if (sortParam === 'name-desc') {
      list.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
    }
    // Default 'featured' keeps original curated order
    return list
  }, [filteredProducts, sortParam])

  // Paginated Slices
  const totalItems = sortedProducts.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1
  const currentPage = Math.max(1, Math.min(pageParam, totalPages))
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [sortedProducts, currentPage])

  // Active Category & Department Headings
  const activeHeading = useMemo(() => {
    if (activeCategoryParam) {
      const foundCat = categories.find((c) => c.slug === activeCategoryParam)
      if (foundCat) return foundCat.name
      for (const dept of MASTER_DEPARTMENTS) {
        const sub = dept.subcategories.find((s) => s.slug === activeCategoryParam)
        if (sub) return sub.name
      }
      return activeCategoryParam
    }
    if (activeDepartment) {
      return activeDepartment.name
    }
    if (searchQueryParam) {
      return `Results for "${searchQueryParam}"`
    }
    return 'All 110+ Commercial Printing Products'
  }, [activeCategoryParam, activeDepartment, searchQueryParam, categories])

  const activeEyebrow = useMemo(() => {
    if (activeDepartment) return activeDepartment.eyebrow
    if (activeCategoryParam) return 'CATEGORY SPECIFICATION'
    return 'DUBAI MASTER CATALOG'
  }, [activeDepartment, activeCategoryParam])

  const activeDescription = useMemo(() => {
    if (activeDepartment) return activeDepartment.description
    return 'Browse ONPRINT’s complete commercial printing inventory manufactured locally in Al Quoz, Dubai. Order luxury stationery, exhibition displays, packaging stickers, and corporate merchandise.'
  }, [activeDepartment])

  return (
    <div className="py-10 sm:py-16 bg-[#0B132B] text-[#F5F3EE] min-h-screen">
      {/* SEO Head Management */}
      <SEOHead
        title={`${activeHeading} | ONPRINT Dubai Commercial Printing Press`}
        description={activeDescription}
        keywords="commercial printing products dubai, luxury business cards, pull up banners, vinyl stickers, letterheads dubai, corporate gifts uae"
        canonicalPath="/products"
      />

      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            activeDepartment
              ? { name: activeDepartment.name, path: `/categories/${activeDepartment.slug}` }
              : null,
            { name: activeHeading },
          ].filter(Boolean)}
        />

        {/* Editorial Page Header */}
        <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end border-b border-[#1E2C4F] pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0B132B] px-3.5 py-1 text-xs font-black uppercase tracking-widest text-[#D6C29A]">
              <Sparkles className="h-3.5 w-3.5 text-[#D6C29A]" />
              <span>{activeEyebrow}</span>
            </div>
            <h1 className="font-display mt-3 text-3xl font-black tracking-tight text-[#F5F3EE] sm:text-4xl lg:text-5xl">
              {activeHeading}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#A0AEC0] sm:text-base">
              {activeDescription}
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 110+ products…"
              className="w-full rounded-2xl border border-[#1E2C4F] bg-[#14213D] pl-10 pr-9 py-2.5 text-xs font-semibold text-[#F5F3EE] placeholder:text-[#52647D] transition-all focus:border-[#D6C29A] focus:outline-none shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  updateFilters({ search: '' })
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>

        {/* Master Department Navigation Tabs */}
        <div className="mt-8 border-b border-[#1E2C4F] pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#D6C29A]">
              Departments
            </span>
            <span className="text-xs font-bold text-slate-500">
              Showing {totalItems} {totalItems === 1 ? 'Product' : 'Products'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => handleSelectDepartment('')}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                !activeDeptParam && !activeCategoryParam
                  ? 'bg-[#D6C29A] text-[#0B132B] shadow-md font-black'
                  : 'border border-[#1E2C4F] bg-[#14213D] text-[#F5F3EE] hover:border-[#D6C29A] hover:text-[#D6C29A]'
              }`}
            >
              All Products ({products.length})
            </button>

            {MASTER_DEPARTMENTS.map((dept) => {
              const Icon = DEPARTMENT_ICONS[dept.slug] || Layers
              const isSelected = activeDeptParam === dept.slug || activeDepartment?.slug === dept.slug
              const deptProdCount = dept.subcategories.reduce(
                (acc, s) => acc + (s.productSlugs?.length || 0),
                0
              )

              return (
                <button
                  key={dept.slug}
                  type="button"
                  onClick={() => handleSelectDepartment(dept.slug)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#D6C29A] text-[#0B132B] shadow-md font-black'
                      : 'border border-[#1E2C4F] bg-[#14213D] text-[#F5F3EE] hover:border-[#D6C29A] hover:text-[#D6C29A]'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-[#D6C29A]' : 'text-slate-400'}`} />
                  <span>{dept.shortName || dept.name}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-[#D6C29A]' : 'text-slate-400'} font-semibold`}>
                    ({deptProdCount})
                  </span>
                </button>
              )
            })}
          </div>

          {/* Subcategory Filter Pills (Shown when a Department is active) */}
          {activeDepartment && (
            <div className="mt-3 pt-3 border-t border-[#1E2C4F]/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">
                Filter by Category:
              </span>
              <button
                type="button"
                onClick={() => handleSelectCategory('')}
                className={`shrink-0 rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  !activeCategoryParam
                    ? 'bg-[#D6C29A] text-[#0B132B] font-black'
                    : 'bg-[#14213D] border border-[#1E2C4F] text-[#F5F3EE] hover:bg-[#1E2C4F]'
                }`}
              >
                All in {activeDepartment.shortName || activeDepartment.name}
              </button>
              {activeDepartment.subcategories.map((sub) => {
                const isSubSelected = activeCategoryParam === sub.slug
                return (
                  <button
                    key={sub.slug}
                    type="button"
                    onClick={() => handleSelectCategory(sub.slug)}
                    className={`shrink-0 rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSubSelected
                        ? 'bg-[#D6C29A] text-[#0B132B] font-black'
                        : 'bg-[#14213D] border border-[#1E2C4F] text-[#F5F3EE] hover:bg-[#1E2C4F]'
                    }`}
                  >
                    <span>{sub.name}</span>
                    <span className="text-[10px] opacity-75">({sub.productSlugs.length})</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Toolbar: Sorting & Active Filter Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(activeDeptParam || activeCategoryParam || searchQueryParam) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  updateFilters({ department: '', category: '', search: '' })
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
                <span>Reset All Filters</span>
              </button>
            )}

            {activeDeptParam && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-800">
                <span>Dept: {activeDepartment?.name}</span>
                <button
                  type="button"
                  onClick={() => handleSelectDepartment('')}
                  className="hover:text-red-600 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {activeCategoryParam && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#D6C29A]/20 border border-[#D6C29A]/40 px-3 py-1 text-xs font-semibold text-slate-900">
                <span>Cat: {activeHeading}</span>
                <button
                  type="button"
                  onClick={() => handleSelectCategory('')}
                  className="hover:text-red-600 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#D6C29A]" />
            <span>Sort by:</span>
            <select
              value={sortParam}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="rounded-xl border border-[#1E2C4F] bg-[#14213D] px-3 py-1.5 text-xs font-semibold text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
            >
              <option value="featured">Featured / Most Popular</option>
              <option value="name-asc">Product Name (A → Z)</option>
              <option value="name-desc">Product Name (Z → A)</option>
            </select>
          </div>
        </div>

        {/* Main Product Grid */}
        <div className="mt-8">
          {loading && <LoadingState type="cards" columns={4} count={8} label="Loading products catalog…" />}
          {error && <EmptyState title="Unable to load product catalog" note="Please check your connection and refresh." />}

          {!loading && !error && paginatedProducts.length === 0 && (
            <EmptyState
              title="No matching products found"
              note={
                searchQueryParam
                  ? `No results for "${searchQueryParam}". Try a different keyword.`
                  : 'Select a different department or category.'
              }
              actionLabel="Reset Filters"
              onAction={() => {
                setSearchQuery('')
                updateFilters({ department: '', category: '', search: '' })
              }}
            />
          )}

          {!loading && !error && paginatedProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
              {paginatedProducts.map((product, idx) => (
                <ProductCard
                  key={product._id || product.slug || product.id}
                  product={product}
                  index={idx}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1E2C4F] pt-6">
            <span className="text-xs font-bold text-slate-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} products
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => updateFilters({ page: String(currentPage - 1) })}
                className="flex h-9 items-center gap-1 rounded-xl border border-[#1E2C4F] bg-[#14213D] px-3 text-xs font-bold text-[#F5F3EE] hover:bg-[#1E2C4F] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isCurr = p === currentPage
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => updateFilters({ page: String(p) })}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isCurr
                        ? 'bg-[#D6C29A] text-[#0B132B] font-black shadow-xs'
                        : 'border border-[#1E2C4F] bg-[#14213D] text-[#B8C2D9] hover:bg-[#1E2C4F] hover:text-[#F5F3EE]'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => updateFilters({ page: String(currentPage + 1) })}
                className="flex h-9 items-center gap-1 rounded-xl border border-[#1E2C4F] bg-[#14213D] px-3 text-xs font-bold text-[#F5F3EE] hover:bg-[#1E2C4F] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Dubai Commercial Press Trust Strip */}
        <Reveal>
          <div className="mt-20 rounded-3xl border border-[#0B132B] bg-[#0B132B] p-8 text-white shadow-xl sm:p-12">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <span className="rounded-full bg-[#D6C29A]/20 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#D6C29A]">
                  Al Quoz Pressroom • Dubai, UAE
                </span>
                <h2 className="font-display mt-4 text-2xl font-black tracking-tight sm:text-4xl text-white">
                  Have a bespoke corporate printing requirement?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                  From custom die-cuts and 24K hot foil stamping to high-volume commercial runs, our Dubai print production team is ready to inspect artwork and quote in minutes.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 shrink-0">
                <Button to="/get-a-quote" variant="accent" size="lg">
                  Request a Quote
                </Button>
                <Button
                  to="/contact"
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white hover:text-[#0B132B]"
                >
                  Contact Studio
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* Product Detail Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  )
}
