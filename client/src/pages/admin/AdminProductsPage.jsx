import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Plus, Search, Filter, Trash2, Edit2, Package, Sparkles, X, CheckCircle2, AlertTriangle } from 'lucide-react'
import Button from '../../components/Button'
import { getStoredProducts, deleteProduct } from '../../services/products'

export default function AdminProductsPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [notification, setNotification] = useState(location.state?.toast || null)
  const [deletingProduct, setDeletingProduct] = useState(null)

  useEffect(() => {
    setProducts(getStoredProducts())
  }, [])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription?.toLowerCase().includes(search.toLowerCase())
    const catName = typeof p.category === 'object' ? p.category?.name : p.category
    const matchesCategory =
      selectedCategory === 'ALL' ||
      catName?.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  const confirmDeleteProduct = () => {
    if (!deletingProduct) return
    const targetId = deletingProduct._id || deletingProduct.id
    const updated = deleteProduct(targetId)
    setProducts(updated)
    setNotification(`Product "${deletingProduct.name}" deleted successfully.`)
    setDeletingProduct(null)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-neutral-900">
            Products Catalog Manager
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Upload, update, and organize customized print items for Dubai businesses.
          </p>
        </div>

        <Button
          onClick={() => navigate('/admin/products/new')}
          variant="accent"
          icon={false}
          className="shadow-md shadow-[#A82F19]/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Product
        </Button>
      </div>

      {notification && (
        <div className="rounded-2xl border border-neutral-700 bg-neutral-900 p-4 text-xs font-bold text-white flex items-center justify-between shadow-xl">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {notification}
          </span>
          <button onClick={() => setNotification(null)}>
            <X className="h-4 w-4 text-neutral-400 hover:text-white" />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-4 py-2 text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-neutral-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs font-bold text-neutral-800 focus:border-[#A82F19] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Gift">Corporate Gifts</option>
            <option value="Stationery">Office Stationery</option>
            <option value="Roll-up">Large Format Signage</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => {
          const img = Array.isArray(p.images) ? p.images[0] : p.image
          const catName = typeof p.category === 'object' ? p.category?.name : p.category
          const targetId = p._id || p.id

          return (
            <div
              key={targetId}
              className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-all"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-neutral-100 mb-4 border border-neutral-100">
                  <img
                    src={img || '/assets/products/1 (1).jpg'}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                  {p.featured && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#A82F19] px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-white shadow-xs">
                      <Sparkles className="h-3 w-3" /> Featured
                    </span>
                  )}
                </div>

                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#A82F19]">
                  {catName}
                </div>
                <h3 className="font-display font-bold text-base text-neutral-900 mt-1 line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  {p.shortDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold text-neutral-400">Min MOQ: {p.minimumQuantity || 1}</div>
                  <div className="font-black text-sm text-neutral-900">AED {p.price || 50}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/admin/products/${targetId}/edit`)}
                    className="rounded-xl border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                    title="Edit Product"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingProduct(p)}
                    className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs text-xs font-semibold text-neutral-600">
        <div>
          Showing <span className="font-bold text-neutral-900">{filteredProducts.length}</span> of{' '}
          <span className="font-bold text-neutral-900">{products.length}</span> products
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-neutral-400 opacity-60 cursor-not-allowed"
          >
            Previous
          </button>
          <button type="button" className="rounded-xl bg-[#A82F19] px-3 py-1.5 font-bold text-white shadow-xs">
            1
          </button>
          <button
            type="button"
            disabled
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-neutral-400 opacity-60 cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-900">Delete Product?</h3>
                <p className="text-xs text-neutral-500">
                  Are you sure you want to delete &quot;{deletingProduct.name}&quot; from shop catalog?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
