import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SectionHeading from '../../components/SectionHeading'
import ProductCard from '../../components/ProductCard'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
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
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="Catalog"
        title="Products"
        subtitle="Browse our full range of print products, from business stationery to large-format signage."
      />

      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange('')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              !category ? 'bg-brand-600 text-white' : 'bg-gray-100 text-ink-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              type="button"
              onClick={() => handleCategoryChange(c._id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                category === c._id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-ink-700 hover:bg-gray-200'
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
              {result.data.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {result.pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-ink-700 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-2 text-sm text-ink-500">
                  Page {result.pagination.page} of {result.pagination.totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= result.pagination.totalPages}
                  onClick={() => goToPage(page + 1)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-ink-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
