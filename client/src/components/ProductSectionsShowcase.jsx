import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { getCategories } from '../services/categories'
import { getProducts } from '../services/products'

function isProductInCategory(product, category) {
  if (!product || !category) return false

  const catSlug = String(category.slug || '').trim().toLowerCase()
  const catKey = String(category.category_key || category._id || '').trim().toLowerCase()
  const catName = String(category.name || '').trim().toLowerCase()
  const catId = category.id !== undefined && category.id !== null ? Number(category.id) : null

  // Extract primary product category details
  const prodCat = product.category
  let pCatSlug = ''
  let pCatKey = ''
  let pCatName = ''
  let pCatId = product.category_id !== undefined && product.category_id !== null ? Number(product.category_id) : null

  if (prodCat && typeof prodCat === 'object') {
    pCatSlug = String(prodCat.slug || '').trim().toLowerCase()
    pCatKey = String(prodCat._id || prodCat.category_key || '').trim().toLowerCase()
    pCatName = String(prodCat.name || '').trim().toLowerCase()
    if (pCatId === null && prodCat.id !== undefined && prodCat.id !== null) {
      pCatId = Number(prodCat.id)
    }
  } else if (typeof prodCat === 'string') {
    pCatSlug = prodCat.trim().toLowerCase()
  }

  // Guard: Protect against cross-contamination between brochures and business cards
  const prodName = String(product.name || '').toLowerCase()
  const prodSlug = String(product.slug || '').toLowerCase()
  const isBrochureCategory = catSlug === 'brochures-printing' || catSlug === 'brochures' || catSlug === 'cat-brochures-printing'
  const isBusinessCardProduct = prodSlug.includes('business-card') || prodName.includes('business card') || prodSlug.includes('visiting-card')

  if (isBrochureCategory && isBusinessCardProduct) {
    return false
  }

  // 1. Semantic Slug Matching with common alias normalization (Authoritative)
  if (catSlug && pCatSlug) {
    if (catSlug === pCatSlug) return true
    if (isBrochureCategory && (pCatSlug === 'brochures-printing' || pCatSlug === 'brochures')) return true
    if ((catSlug === 'business-cards-printing' || catSlug === 'business-cards') && (pCatSlug === 'business-cards-printing' || pCatSlug === 'business-cards')) return true
    if ((catSlug === 'stickers-labels-printing' || catSlug === 'stickers-printing-dubai') && (pCatSlug === 'stickers-labels-printing' || pCatSlug === 'stickers-printing-dubai')) return true
    if ((catSlug === 'rollup-banners' || catSlug === 'cat-rollup-banners-dubai') && (pCatSlug === 'rollup-banners' || pCatSlug === 'cat-rollup-banners-dubai')) return true
    if ((catSlug === 'id-card-printing-dubai' || catSlug === 'id-cards' || catSlug === 'id-card-printing') && (pCatSlug === 'id-card-printing-dubai' || pCatSlug === 'id-cards' || pCatSlug === 'id-card-printing')) return true
  }

  // 2. Category Key / _id match
  if (catKey && pCatKey && catKey === pCatKey) {
    return true
  }

  // 3. Exact Category Name match
  if (catName && pCatName && catName === pCatName) {
    return true
  }

  // 4. Check secondary categories array
  if (Array.isArray(product.categories) && product.categories.length > 0) {
    const secondaryMatch = product.categories.some((c) => {
      if (!c) return false
      const cSlug = String(c.slug || '').trim().toLowerCase()
      const cKey = String(c._id || c.category_key || '').trim().toLowerCase()
      const cName = String(c.name || '').trim().toLowerCase()

      if (catSlug && cSlug && catSlug === cSlug) return true
      if (catKey && cKey && catKey === cKey) return true
      if (catName && cName && catName === cName) return true
      return false
    })
    if (secondaryMatch) return true
  }

  // 5. Explicit heuristic match for known products by slug / name
  if (isBrochureCategory) {
    if (prodSlug.includes('brochure') || prodName.includes('brochure') || prodSlug === 'digital-offset-printing') {
      return true
    }
  }

  if (catSlug === 'business-cards-printing' || catSlug === 'business-cards') {
    if (isBusinessCardProduct) {
      return true
    }
  }

  if (catSlug === 'id-card-printing-dubai' || catSlug === 'id-cards' || catSlug === 'id-card-printing') {
    if (prodSlug.includes('name-badge') || pCatSlug === 'name-badges-printing-dubai') {
      return false
    }
    if (prodSlug.includes('id-card') || prodName.includes('id card') || prodSlug.includes('id-badge')) {
      return true
    }
  }

  // 6. Fallback Numeric ID match: ONLY if neither has a conflicting slug
  if (catId !== null && pCatId !== null && catId === pCatId) {
    if (!catSlug || !pCatSlug || catSlug === pCatSlug) {
      return true
    }
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
    <div className="relative rounded-3xl border border-[#122240] bg-[#081226] p-5 sm:p-8 lg:p-10 shadow-xs transition-all duration-300 hover:border-[#D4AF65] hover:shadow-xl hover-shimmer text-[#F5F2EB]">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-[#122240]">
        <div>
          {/* Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#122240] bg-[#040A18] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#D4AF65] mb-3">
            <span className="flex h-2 w-2 rounded-full bg-[#D4AF65] animate-pulse" />
            <span>SECTION {section.sectionNumber}</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#D4AF65]">{section.badge}</span>
          </div>

          {/* Section Main Title */}
          <div className="relative">
            <h3 className="text-2xl font-black tracking-tight text-[#F5F2EB] sm:text-3xl lg:text-4xl">
              {section.title}
            </h3>
            {/* Signature Underline Accent Bar */}
            <div className="mt-3 flex items-center gap-2">
              <span className="h-1 w-16 rounded-full bg-[#D4AF65]" />
              <span className="h-1 w-3.5 rounded-full bg-[#122240]" />
              <span className="h-1 w-1.5 rounded-full bg-[#122240]/50" />
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm text-[#B0BECE] leading-relaxed">
            {section.subtitle}
          </p>
        </div>

        {/* Carousel Slider Next/Prev Arrows Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#122240] bg-[#040A18] px-3 py-1.5 text-xs font-bold text-[#F5F2EB]">
              <span>{currentPage + 1}</span>
              <span className="text-slate-400">/</span>
              <span>{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                aria-label={`Previous slide for ${section.title}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#122240] bg-[#040A18] text-[#B0BECE] shadow-xs transition-all hover:border-[#D4AF65] hover:bg-[#D4AF65] hover:text-[#040A18] active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={handleNextPage}
                aria-label={`Next slide for ${section.title}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF65] bg-[#D4AF65] text-[#040A18] shadow-xs transition-all hover:bg-[#D4AF65]/90 hover:border-[#D4AF65] active:scale-95 cursor-pointer"
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
                  : 'w-2 bg-[#122240] hover:bg-[#D4AF65]'
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
    const rawCats = internalCategories || []
    const prods = internalProducts || []
    if (!rawCats.length || !prods.length) return []

    // Sort categories deterministically by display_order / displayOrder / id
    const cats = [...rawCats].sort((a, b) => {
      const orderA = Number(a.display_order ?? a.displayOrder ?? a.order ?? a.id ?? 99)
      const orderB = Number(b.display_order ?? b.displayOrder ?? b.order ?? b.id ?? 99)
      return orderA - orderB
    })

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
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 bg-[#040A18] border-y border-[#122240]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Intro Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65]/30 bg-[#081226] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF65] shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF65]" />
            Dubai Premium Print Showcase
          </div>

          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-[#F5F2EB]">
            <span>Explore Our </span>
            <span className="text-[#D4AF65]">Product Collections</span>
          </h2>

          <p className="text-sm sm:text-base text-[#B0BECE] leading-relaxed">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-[#122240] bg-[#081226] p-5 sm:p-7 shadow-xs text-[#F5F2EB]">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#040A18] border border-[#122240] text-[#D4AF65] font-bold shadow-2xs">
              <ShieldCheck className="h-5 w-5 text-[#D4AF65]" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#F5F2EB]">Need a custom bulk quantity or unique specification?</h4>
              <p className="text-xs text-[#B0BECE]">Our Dubai prepress team provides instant digital proofs and express doorstep UAE delivery.</p>
            </div>
          </div>

          <Link
            to="/get-a-quote"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF65] hover:bg-[#D4AF65] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#040A18] shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <span>Request Custom Quote</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
