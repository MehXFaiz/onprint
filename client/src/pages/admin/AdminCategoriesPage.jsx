import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FolderTree,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Image as ImageIcon,
  ArrowUpDown,
  Filter,
  Package,
} from 'lucide-react'
import Button from '../../components/Button'
import {
  getCategories,
  updateCategoryStatus,
  deleteCategory,
} from '../../services/categories'

export default function AdminCategoriesPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(location.state?.toast || null)

  // Filters & Controls
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('display_order_asc')

  // Delete Confirmation State
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Clear toast after 4s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const fetchCategoryList = async (isManual = false) => {
    if (isManual) setRefreshing(true)
    else if (categories.length === 0) setLoading(true)
    setError(null)

    try {
      const data = await getCategories({
        status: statusFilter,
        search: searchTerm,
        sort: sortBy,
      })
      setCategories(data || [])
    } catch (err) {
      console.error('Failed to load categories:', err)
      setError('Unable to load categories from MySQL database.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCategoryList()
  }, [statusFilter, sortBy])

  // Real-time search filter
  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && (c.status === 'active' || c.active)) ||
      (statusFilter === 'inactive' && (c.status === 'inactive' || !c.active))

    return matchesSearch && matchesStatus
  })

  // Handle Toggle Status
  const handleToggleStatus = async (cat) => {
    const targetId = cat.id || cat._id
    const currentStatus = cat.status || (cat.active ? 'active' : 'inactive')
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

    try {
      await updateCategoryStatus(targetId, newStatus)
      setToast({ type: 'success', message: `Status changed to ${newStatus}` })
      fetchCategoryList(true)
    } catch (err) {
      setToast({ type: 'error', message: err?.response?.data?.message || 'Failed to update status' })
    }
  }

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return
    const targetId = deletingCategory.id || deletingCategory._id
    setSubmitting(true)
    setDeleteError(null)

    try {
      await deleteCategory(targetId)
      setToast({ type: 'success', message: `Category "${deletingCategory.name}" deleted successfully` })
      setDeletingCategory(null)
      fetchCategoryList(true)
    } catch (err) {
      const errRes = err?.response?.data
      if (errRes?.hasProducts || errRes?.message?.includes('contains products')) {
        setDeleteError({
          message: errRes.message || 'This category contains products and cannot be deleted.',
          hasProducts: true,
        })
      } else {
        setDeleteError({
          message: errRes?.message || err?.message || 'Failed to delete category.',
          hasProducts: false,
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-bold shadow-2xl transition-all ${
            typeof toast === 'string'
              ? 'bg-neutral-900 text-white border border-neutral-700'
              : toast.type === 'error'
              ? 'bg-red-900 text-white border border-red-700'
              : 'bg-neutral-900 text-white border border-neutral-700'
          }`}
        >
          {typeof toast === 'object' && toast.type === 'error' ? (
            <XCircle className="h-4 w-4 text-red-400" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          )}
          <span>{typeof toast === 'string' ? toast : toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <FolderTree className="h-4 w-4" />
            <span>Store Organization</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-black tracking-tight text-neutral-900">
            Category Management
          </h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            Manage your product categories in GoDaddy MySQL database.
          </p>
        </div>

        <Button
          onClick={() => navigate('/admin/categories/new')}
          variant="accent"
          icon={false}
          className="shadow-md shadow-[#A82F19]/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Filter & Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories by name or slug..."
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-4 py-2 text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3 flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs font-bold text-neutral-800 focus:border-[#A82F19] focus:outline-none cursor-pointer"
          >
            <option value="all">Status: All</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Sort dropdown */}
        <div className="md:col-span-3 flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-neutral-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs font-bold text-neutral-800 focus:border-[#A82F19] focus:outline-none cursor-pointer"
          >
            <option value="display_order_asc">Display Order (Asc)</option>
            <option value="display_order_desc">Display Order (Desc)</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="created_at_desc">Newest First</option>
          </select>
        </div>

        {/* Refresh Sync Button */}
        <div className="md:col-span-1 flex items-center justify-end">
          <button
            type="button"
            onClick={() => fetchCategoryList(true)}
            disabled={refreshing}
            title="Refresh from MySQL"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 text-[#A82F19] ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="space-y-3 bg-white p-6 rounded-3xl border border-neutral-200 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-neutral-100" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto" />
          <div className="font-bold text-sm text-neutral-900">{error}</div>
          <button
            type="button"
            onClick={() => fetchCategoryList(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-[#A82F19] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry MySQL Connection
          </button>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#A82F19]">
            <FolderTree className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-neutral-900">No categories found</h3>
            <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
              {searchTerm
                ? 'No categories match your search terms.'
                : 'Get started by creating your first product category.'}
            </p>
          </div>
          <Button onClick={() => navigate('/admin/categories/new')} variant="accent" icon={false} className="cursor-pointer">
            <Plus className="h-4 w-4 mr-1.5" />
            Add your first category
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop & Tablet Table View */}
          <div className="hidden md:block overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-extrabold uppercase tracking-wider text-neutral-500">
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Order</th>
                  <th className="py-3.5 px-4 text-center">Products</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {filteredCategories.map((cat) => {
                  const isActive = cat.status === 'active' || cat.active
                  const targetId = cat.id || cat._id
                  return (
                    <tr key={targetId} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 flex items-center justify-center">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-neutral-400" />
                          )}
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-neutral-900">{cat.name}</td>

                      {/* Slug */}
                      <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">{cat.slug}</td>

                      {/* Description */}
                      <td className="py-3 px-4 max-w-xs truncate text-neutral-500">
                        {cat.description || '—'}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(cat)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500' : 'bg-neutral-400'
                            }`}
                          />
                          {isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Display Order */}
                      <td className="py-3 px-4 text-center font-bold text-neutral-700">
                        {cat.displayOrder || 0}
                      </td>

                      {/* Products Count */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-700">
                          <Package className="h-3 w-3 text-neutral-500" />
                          {cat.productCount || 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/categories/${targetId}/edit`)}
                            title="Edit Category"
                            className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingCategory(cat)}
                            title="Delete Category"
                            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredCategories.map((cat) => {
              const isActive = cat.status === 'active' || cat.active
              const targetId = cat.id || cat._id
              return (
                <div
                  key={targetId}
                  className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 flex items-center justify-center">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-neutral-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-neutral-900">{cat.name}</div>
                        <div className="font-mono text-[10px] text-neutral-500">{cat.slug}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(cat)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                        isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  {cat.description && (
                    <p className="text-xs text-neutral-600 line-clamp-2">{cat.description}</p>
                  )}

                  <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-xs">
                    <span className="text-neutral-500 font-medium">Order: {cat.displayOrder || 0}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/categories/${targetId}/edit`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCategory(cat)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
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
              Showing <span className="font-bold text-neutral-900">{filteredCategories.length}</span> of{' '}
              <span className="font-bold text-neutral-900">{categories.length}</span> categories
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled
                className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-neutral-400 opacity-60 cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                className="rounded-xl bg-[#A82F19] px-3 py-1.5 font-bold text-white shadow-xs"
              >
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
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-900">Delete Category?</h3>
                <p className="text-xs text-neutral-500">
                  Are you sure you want to delete &quot;{deletingCategory.name}&quot;?
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 space-y-2">
                <div>{deleteError.message}</div>
                {deleteError.hasProducts && (
                  <button
                    type="button"
                    onClick={async () => {
                      await handleToggleStatus(deletingCategory)
                      setDeletingCategory(null)
                      setDeleteError(null)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-[#A82F19] transition-colors cursor-pointer"
                  >
                    Deactivate Category Instead
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  setDeletingCategory(null)
                  setDeleteError(null)
                }}
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
