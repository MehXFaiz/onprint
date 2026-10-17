import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { getCategories } from '../services/categories'
import { getProducts } from '../services/products'

function isProductInCategory(product, category) {
  if (!product || !category) return false
  const catId = category.id !== undefined && category.id !== null ? Number(category.id) : null
  const catKey = String(category.category_key || category._id || '').toLowerCase()
  const catSlug = String(category.slug || '').toLowerCase()
  const catName = String(category.name || '').toLowerCase()

  // 1. Direct Category Match (Strict Priority)
  const prodCat = product.category
  const prodCatId = product.category_id !== undefined && product.category_id !== null ? Number(product.category_id) : (prodCat?.id !== undefined ? Number(prodCat.id) : null)
  
  if (catId !== null && prodCatId !== null && catId === prodCatId) {
    return true
  }

  if (prodCat && typeof prodCat === 'object') {
    const pCatSlug = String(prodCat.slug || '').toLowerCase()
    const pCatKey = String(prodCat._id || prodCat.category_key || '').toLowerCase()
    const pCatName = String(prodCat.name || '').toLowerCase()

    if (catSlug && pCatSlug === catSlug) return true
    if (catKey && pCatKey === catKey) return true
    if (catName && pCatName === catName) return true
  }

  if (typeof prodCat === 'string') {
    const pCatStr = prodCat.toLowerCase()
    if (catSlug && pCatStr === catSlug) return true
    if (catKey && pCatStr === catKey) return true
    if (catName && pCatStr === catName) return true
  }

  if (Array.isArray(product.categories) && product.categories.length > 0) {
    return product.categories.some((c) => {
      if (!c) return false
      const cId = c.id !== undefined && c.id !== null ? Number(c.id) : null
      const cSlug = String(c.slug || '').toLowerCase()
      const cKey = String(c._id || c.category_key || '').toLowerCase()
      return (
        (catId !== null && cId !== null && catId === cId) ||
        (catSlug && cSlug === catSlug) ||
        (catKey && cKey === catKey)
      )
    })
  }

  return false
}

function SectionCardGroup({ section, onQuickView }) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 4
  const totalPages = Math.ceil(section.items.length / itemsPerPage)

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const visibleItems = section.items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  return (
    <div className="relative rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-8 lg:p-10 shadow-xs transition-all duration-300 hover:border-[#D4AF65] hover:shadow-xl">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-zinc-100">
        <div>
          {/* Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F5F2EB] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#101D35] mb-3">
            <span className="flex h-2 w-2 rounded-full bg-[#D4AF65] animate-pulse" />
            <span>SECTION {section.sectionNumber}</span>
            <span className="text-zinc-300">•</span>
            <span>{section.badge}</span>
          </div>

          {/* Section Main Title */}
          <div className="relative">
            <h3 className="text-2xl font-black tracking-tight text-[#101D35] sm:text-3xl lg:text-4xl">
              {section.title}
            </h3>
            {/* Signature Underline Accent Bar */}
            <div className="mt-3 flex items-center gap-2">
              <span className="h-1 w-16 rounded-full bg-[#D4AF65]" />
              <span className="h-1 w-3.5 rounded-full bg-zinc-400" />
              <span className="h-1 w-1.5 rounded-full bg-zinc-200" />
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm text-[#343D4F] leading-relaxed">
            {section.subtitle}
          </p>
        </div>

        {/* Carousel Slider Next/Prev Arrows Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-700">
              <span>{currentPage + 1}</span>
              <span className="text-zinc-400">/</span>
              <span>{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                aria-label={`Previous slide for ${section.title}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-xs transition-all hover:border-zinc-950 hover:bg-zinc-950 hover:text-white active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={handleNextPage}
                aria-label={`Next slide for ${section.title}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#101D35] bg-[#101D35] text-white shadow-xs transition-all hover:bg-[#D4AF65] hover:text-[#101D35] hover:border-[#D4AF65] active:scale-95 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Product Cards */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${section.id}-${currentPage}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {visibleItems.map((item, idx) => (
              <ProductCard
                key={item._id || item.id || item.slug}
                product={item}
                index={idx}
                onQuickView={onQuickView}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Carousel Dots */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              aria-label={`Go to page ${idx + 1} of ${section.title}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentPage === idx
                  ? 'w-8 bg-[#D4AF65]'
                  : 'w-2 bg-zinc-200 hover:bg-zinc-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductSectionsShowcase({
  categories: initialCategories = null,
  products: initialProducts = null,
  onQuickView,
}) {
  const [internalCategories, setInternalCategories] = useState(initialCategories)
  const [internalProducts, setInternalProducts] = useState(initialProducts)
  const [isLoading, setIsLoading] = useState(!initialCategories || !initialProducts)

  useEffect(() => {
    if (initialCategories) setInternalCategories(initialCategories)
    if (initialProducts) setInternalProducts(initialProducts)
  }, [initialCategories, initialProducts])

  useEffect(() => {
    let isMounted = true
    if (!initialCategories || !initialProducts) {
      Promise.all([
        initialCategories ? Promise.resolve(initialCategories) : getCategories().catch(() => []),
        initialProducts ? Promise.resolve(initialProducts) : getProducts().then((res) => res?.data || []).catch(() => []),
      ]).then(([cats, prods]) => {
        if (!isMounted) return
        if (!initialCategories) setInternalCategories(cats)
        if (!initialProducts) setInternalProducts(prods)
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
    return () => {
      isMounted = false
    }
  }, [initialCategories, initialProducts])

  const sections = useMemo(() => {
    const cats = internalCategories || []
    const prods = internalProducts || []
    if (!cats.length || !prods.length) return []

    const dynamicSections = []
    let sectionIdx = 1

    cats.forEach((cat) => {
      const items = prods.filter((p) => isProductInCategory(p, cat))
      if (items.length > 0) {
        dynamicSections.push({
          id: cat.slug || cat.id || `sec-${sectionIdx}`,
          sectionNumber: String(sectionIdx).padStart(2, '0'),
          badge: cat.name || 'Commercial Print',
          title: cat.name,
          subtitle: cat.description || cat.metaDescription || `High-precision custom ${cat.name?.toLowerCase()} printing in Dubai.`,
          items,
        })
        sectionIdx++
      }
    })

    if (dynamicSections.length === 0 && prods.length > 0) {
      dynamicSections.push({
        id: 'featured-products',
        sectionNumber: '01',
        badge: 'Dubai Flagship Print',
        title: 'Featured Print Catalog',
        subtitle: 'Explore our precision commercial printing products, luxury corporate stationery, and marketing collaterals.',
        items: prods,
      })
    }

    return dynamicSections
  }, [internalCategories, internalProducts])

  if (!isLoading && sections.length === 0) {
    return null
  }
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 bg-white border-y border-[#E5E7EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Intro Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-900 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF65]" />
            Dubai Premium Print Showcase
          </div>

          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-[#101D35]">
            <span>Explore Our </span>
            <span className="text-[#D4AF65]">Product Collections</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            From executive office stationery and promotional marketing collaterals to large-format outdoor displays.
          </p>
        </div>

        {/* Main Product Sections Stacked Vertically */}
        <div className="space-y-12">
          {sections.map((section) => (
            <SectionCardGroup key={section.id} section={section} onQuickView={onQuickView} />
          ))}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-[#E5E7EB] bg-[#F5F2EB]/50 p-5 sm:p-7 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#101D35] text-[#D4AF65] font-bold shadow-2xs">
              <ShieldCheck className="h-5 w-5 text-[#D4AF65]" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-zinc-950">Need a custom bulk quantity or unique specification?</h4>
              <p className="text-xs text-zinc-600">Our Dubai prepress team provides instant digital proofs and free material sample boxes.</p>
            </div>
          </div>

          <Link
            to="/get-a-quote"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#101D35] hover:bg-[#D4AF65] hover:text-[#101D35] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <span>Request Custom Quote</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
