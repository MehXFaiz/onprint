import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Container from '../../components/Container'
import SectionHeading from '../../components/SectionHeading'
import ProductCard from '../../components/ProductCard'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Reveal from '../../components/Reveal'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const category = searchParams.get('category') || ''

  const [result, setResult] = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setResult(null)
    setError(false)
    getProducts({ page, ...(category ? { category } : {}) })
      .then(setResult)
      .catch(() => setError(true))
  }, [page, category])

  function handleCategoryChange(nextCategory) {
    setSearchParams(nextCategory ? { category: nextCategory } : {})
  }

  function goToPage(nextPage) {
    const params = { page: String(nextPage) }
    if (category) params.category = category
    setSearchParams(params)
  }

  return (
    <div className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Catalog"
          title="Products, made to your spec."
          subtitle="Browse our full range of print products, from business stationery to large-format signage."
        />

        {categories.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-b border-border pb-8">
            <button
              type="button"
              onClick={() => handleCategoryChange('')}
              className={`border px-4 py-2 text-sm font-medium transition-colors ${
                !category
                  ? 'border-primary bg-primary text-background'
                  : 'border-border text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                type="button"
                onClick={() => handleCategoryChange(c._id)}
                className={`border px-4 py-2 text-sm font-medium transition-colors ${
                  category === c._id
                    ? 'border-primary bg-primary text-background'
                    : 'border-border text-secondary hover:border-primary hover:text-primary'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-12">
          {result === null && !error && <LoadingState label="Loading products…" />}
          {error && <EmptyState title="Couldn't load products" note="Please try again shortly." />}
          {result?.data.length === 0 && (
            <EmptyState title="No products found" note="Try a different category, or check back soon." />
          )}
          {result && result.data.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {result.data.map((product, index) => (
                  <Reveal key={product._id} delay={(index % 4) * 0.06}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>

              {result.pagination.totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                    aria-label="Previous page"
                    className="flex h-10 w-10 items-center justify-center border border-border text-primary transition-colors hover:border-primary disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-2 text-sm font-medium tabular-nums text-secondary">
                    Page {result.pagination.page} of {result.pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= result.pagination.totalPages}
                    onClick={() => goToPage(page + 1)}
                    aria-label="Next page"
                    className="flex h-10 w-10 items-center justify-center border border-border text-primary transition-colors hover:border-primary disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  )
}
