import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Trash2, Eye, Package, Sparkles, Check, Upload, Image as ImageIcon, X } from 'lucide-react'
import Button from '../../components/Button'
import { getStoredProducts, addProduct, deleteProduct } from '../../services/products'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState(null)

  // Form State
  const [form, setForm] = useState({
    name: '',
    categoryName: 'Corporate Gift Items',
    price: '',
    minimumQuantity: '10',
    shortDescription: '',
    description: '',
    image: '',
    features: '',
    featured: false,
  })

  useEffect(() => {
    setProducts(getStoredProducts())
  }, [])

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateProduct = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return

    const productPayload = {
      name: form.name,
      category: { name: form.categoryName },
      price: parseFloat(form.price) || 50,
      minimumQuantity: parseInt(form.minimumQuantity, 10) || 1,
      shortDescription: form.shortDescription,
      description: form.description || form.shortDescription,
      images: [form.image || '/assets/products/1 (1).jpg'],
      featured: form.featured,
      features: form.features
        ? form.features.split(',').map((f) => f.trim())
        : ['High-Precision Print', 'Bespoke Finishing'],
    }

    const created = addProduct(productPayload)
    setProducts(getStoredProducts())
    setIsModalOpen(false)

    // Reset Form
    setForm({
      name: '',
      categoryName: 'Corporate Gift Items',
      price: '',
      minimumQuantity: '10',
      shortDescription: '',
      description: '',
      image: '',
      features: '',
      featured: false,
    })

    setNotification(`Product "${created.name}" uploaded successfully!`)
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = deleteProduct(id)
      setProducts(updated)
      setNotification(`Product "${name}" deleted.`)
      setTimeout(() => setNotification(null), 4000)
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-neutral-900">
            Products Catalog & Upload
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Upload new products, manage prices, stock specs, and active items.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="accent"
          icon={false}
          className="shadow-md shadow-[#A82F19]/20 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Upload New Product
        </Button>
      </div>

      {notification && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)}>
            <X className="h-4 w-4 text-emerald-600" />
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Products</div>
          <div className="mt-2 text-3xl font-black text-neutral-900">{products.length}</div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Featured Items</div>
          <div className="mt-2 text-3xl font-black text-[#A82F19]">
            {products.filter((p) => p.featured).length}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Categories</div>
          <div className="mt-2 text-3xl font-black text-neutral-900">3 Major Hubs</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-2 text-xs font-medium text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-neutral-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-bold text-neutral-800 focus:border-[#A82F19] focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Corporate Gift Items">Corporate Gift Items</option>
            <option value="Office Stationery Printing">Office Stationery Printing</option>
            <option value="Other Products">Other Products</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4">Min Order</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const catName =
                    typeof product.category === 'object'
                      ? product.category?.name
                      : product.category || 'General'
                  const imgSrc = product.images?.[0] || '/assets/products/1 (1).jpg'

                  return (
                    <tr key={product._id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={imgSrc}
                            alt={product.name}
                            className="h-12 w-12 rounded-xl object-cover border border-neutral-200 shrink-0 bg-neutral-100"
                          />
                          <div>
                            <div className="font-bold text-neutral-900 text-sm">{product.name}</div>
                            <div className="text-[11px] text-neutral-500 line-clamp-1 max-w-xs">
                              {product.shortDescription}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase text-neutral-700 border border-neutral-200">
                          {catName}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-bold text-neutral-900">
                        AED {product.price || 45}
                      </td>

                      <td className="px-6 py-4 font-semibold text-neutral-600">
                        {product.minimumQuantity || 1} units
                      </td>

                      <td className="px-6 py-4">
                        {product.featured ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                            <Sparkles className="h-3 w-3" /> Featured
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-neutral-900">
                  Upload New Product
                </h2>
                <p className="text-xs text-neutral-500">
                  Add product title, pricing, specifications, and cover artwork.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Premium Embossed Leather Journals"
                  className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-sm text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Category *
                  </label>
                  <select
                    value={form.categoryName}
                    onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  >
                    <option value="Corporate Gift Items">Corporate Gift Items</option>
                    <option value="Office Stationery Printing">Office Stationery Printing</option>
                    <option value="Other Products">Other Products</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Price per Unit (AED)
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="45"
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-sm text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Minimum Order Qty
                  </label>
                  <input
                    type="number"
                    value={form.minimumQuantity}
                    onChange={(e) => setForm({ ...form, minimumQuantity: e.target.value })}
                    placeholder="25"
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-sm text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Feature Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.features}
                    onChange={(e) => setForm({ ...form, features: e.target.value })}
                    placeholder="Gold Foil, Soft Touch, Spot UV"
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-sm text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="High quality luxury custom printed executive notebooks."
                  className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-sm text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              {/* Product Image File Upload */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Product Image Cover Upload
                </label>
                <div className="mt-1.5 flex items-center gap-4">
                  <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-4 text-center hover:border-[#A82F19] transition-colors">
                    <Upload className="h-6 w-6 text-neutral-400 mb-1" />
                    <span className="text-xs font-bold text-neutral-800">
                      Click to choose image file
                    </span>
                    <span className="text-[10px] text-neutral-500">PNG, JPG or WEBP up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {form.image && (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-neutral-200">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  id="featured-check"
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-[#A82F19] focus:ring-[#A82F19]"
                />
                <label htmlFor="featured-check" className="text-xs font-bold text-neutral-800">
                  Feature this product on Homepage showcase
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <Button type="submit" variant="accent" icon={false} className="!px-6">
                  Save & Publish Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
