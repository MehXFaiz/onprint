import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { getCategories } from '../services/categories'
import { getProducts } from '../services/products'

function isProductInCategory(product, category) {
  if (!product || !category) return false
  const catId = String(category.id || category._id || '')
  const catSlug = String(category.slug || '').toLowerCase()
  const catName = String(category.name || '').toLowerCase()

  const pName = String(product.name || '').toLowerCase()
  const pSlug = String(product.slug || '').toLowerCase()

  if (catSlug.includes('brochure') || catName.includes('brochure')) {
    const nonBrochureKeywords = [
      'mug', 'cup', 'bottle', 'flask', 'tote', 'bag', 't-shirt', 'tshirt',
      'cap', 'hat', 'badge', 'keychain', 'nameplate', 'signage', 'banner', 'flag', 'box', 'packaging'
    ]
    if (nonBrochureKeywords.some((kw) => pName.includes(kw) || pSlug.includes(kw))) {
      return false
    }
  }

  if (catSlug.includes('business-card') || catName.includes('business card')) {
    const nonCardKeywords = ['mug', 'bottle', 'tote', 'banner', 'box', 'brochure', 'booklet']
    if (nonCardKeywords.some((kw) => pName.includes(kw) || pSlug.includes(kw))) {
      return false
    }
  }

  const isMugCategory = catSlug.includes('mug') || catName.includes('mug')
  const isMugProduct = pName.includes('mug') || pSlug.includes('mug') || pName.includes('tumbler') || pSlug.includes('tumbler')
  if (isMugCategory) {
    return isMugProduct
  }

  const isBottleCategory = catSlug.includes('bottle') || catName.includes('bottle')
  const isBottleProduct = pName.includes('bottle') || pSlug.includes('bottle') || pName.includes('flask') || pSlug.includes('flask') || pName.includes('shaker') || pSlug.includes('shaker')
  if (isBottleCategory) {
    return isBottleProduct
  }

  if (isMugProduct || isBottleProduct) {
    return false
  }

  const prodCat = product.category
  if (prodCat && typeof prodCat === 'object') {
    const pCatId = String(prodCat._id || prodCat.id || '')
    const pCatSlug = String(prodCat.slug || '').toLowerCase()
    const pCatName = String(prodCat.name || '').toLowerCase()
    return (
      (catId && pCatId === catId) ||
      (catSlug && pCatSlug === catSlug) ||
      (catName && pCatName === catName)
    )
  }

  if (prodCat && typeof prodCat === 'string') {
    const prodCatLower = prodCat.toLowerCase()
    return (
      prodCat === catId ||
      prodCatLower === catSlug ||
      prodCatLower === catName
    )
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
    <div className="relative rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10 shadow-xs transition-all duration-300 hover:border-[#A82F19]/30 hover:shadow-md">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          {/* Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19]/20 bg-[#A82F19]/5 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-[#A82F19] mb-3">
            <span className="flex h-2 w-2 rounded-full bg-[#A82F19] animate-pulse" />
            <span>SECTION {section.sectionNumber}</span>
            <span className="text-[#A82F19]/40">•</span>
            <span>{section.badge}</span>
          </div>

          {/* Section Main Title */}
          <div className="relative">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {section.title}
            </h3>
            {/* Signature Underline Accent Bar */}
            <div className="mt-3 flex items-center gap-2">
              <span className="h-1 w-16 rounded-full bg-[#A82F19]" />
              <span className="h-1 w-3.5 rounded-full bg-[#A82F19]/40" />
              <span className="h-1 w-1.5 rounded-full bg-[#A82F19]/20" />
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed">
            {section.subtitle}
          </p>
        </div>

        {/* Carousel Slider Next/Prev Arrows Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
              <span>{currentPage + 1}</span>
              <span className="text-slate-400">/</span>
              <span>{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                aria-label={`Previous slide for ${section.title}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:border-[#A82F19] hover:bg-[#A82F19] hover:text-white active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={handleNextPage}
                aria-label={`Next slide for ${section.title}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#A82F19] bg-[#A82F19] text-white shadow-xs transition-all hover:bg-[#8F2412] active:scale-95 cursor-pointer"
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
            {visibleItems.map((item) => (
              <ProductCard
                key={item._id || item.id || item.slug}
                product={item}
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
                  ? 'w-8 bg-[#A82F19]'
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
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
        subtitle: 'Explore our precision commercial printing products, luxury corporate stationery, and custom packaging.',
        items: prods,
      })
    }

    return dynamicSections
  }, [internalCategories, internalProducts])

  if (!isLoading && sections.length === 0) {
    return null
  }
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 bg-slate-50/70 border-y border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Intro Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19]/20 bg-[#A82F19]/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#A82F19]">
            <Sparkles className="h-3.5 w-3.5 text-[#A82F19]" />
            Dubai Premium Print Showcase
          </div>

          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-slate-900">
            <span>Explore Our </span>
            <span className="text-[#A82F19] italic">Product Collections</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A82F19]/10 text-[#A82F19] font-bold shadow-2xs">
              <ShieldCheck className="h-5 w-5 text-[#A82F19]" />
            </div>
            <div>
              <h4 className="font-serif text-sm sm:text-base font-bold text-slate-900">Need a custom bulk quantity or unique specification?</h4>
              <p className="text-xs text-slate-600">Our Dubai prepress team provides instant digital proofs and free material sample boxes.</p>
            </div>
          </div>

          <Link
            to="/get-a-quote"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#A82F19] hover:bg-[#8F2412] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <span>Request Custom Quote</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
