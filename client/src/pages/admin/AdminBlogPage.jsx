import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  BookOpen,
  Clock,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  FileText,
  Calendar,
  Star,
  Layers,
  Package,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
  UploadCloud,
} from 'lucide-react'
import Button from '../../components/Button'
import {
  getAdminBlogs,
  getBlogStats,
  deleteBlog,
  bulkDeleteBlogs,
  publishBlog,
  unpublishBlog,
  toggleFeaturedBlog,
} from '../../services/blog'
import { getCategories } from '../../services/categories'
import { getProducts } from '../../services/products'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, scheduled: 0, featured: 0 })
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 })

  // Filters & Search
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Selection & Modal states
  const [selectedIds, setSelectedIds] = useState([])
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Load Categories & Products for dropdown filters
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))

    getProducts({ limit: 100 })
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProducts([]))
  }, [])

  // Load Blog Stats
  const loadStats = useCallback(async () => {
    try {
      const data = await getBlogStats()
      if (data) setStats(data)
    } catch (err) {
      console.error('Error fetching blog stats:', err)
    }
  }, [])

  // Load Blog Posts
  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAdminBlogs({
        page,
        limit: 20,
        status: statusFilter,
        category_id: categoryFilter,
        product_id: productFilter,
        search: search.trim() || undefined,
      })
      if (res?.success) {
        setPosts(res.data || [])
        setPagination(res.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 })
      } else {
        setPosts([])
      }
    } catch (err) {
      console.error('Error loading admin blogs:', err)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, categoryFilter, productFilter, search])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  useEffect(() => {
    loadPosts()
    setSelectedIds([])
  }, [loadPosts])

  // Single Delete
  async function handleDelete(id) {
    try {
      setActionLoading(true)
      await deleteBlog(id)
      setDeleteConfirm(null)
      loadPosts()
      loadStats()
    } catch (err) {
      console.error('Failed to delete blog:', err)
    } finally {
      setActionLoading(false)
    }
  }

  // Bulk Delete
  async function handleBulkDelete() {
    if (selectedIds.length === 0) return
    try {
      setActionLoading(true)
      await bulkDeleteBlogs(selectedIds)
      setSelectedIds([])
      setBulkDeleteConfirm(false)
      loadPosts()
      loadStats()
    } catch (err) {
      console.error('Failed to bulk delete blogs:', err)
    } finally {
      setActionLoading(false)
    }
  }

  // Toggle Publish / Unpublish
  async function handleTogglePublish(post) {
    try {
      if (post.status === 'published') {
        await unpublishBlog(post.id)
      } else {
        await publishBlog(post.id)
      }
      loadPosts()
      loadStats()
    } catch (err) {
      console.error('Failed to toggle publish status:', err)
    }
  }

  // Toggle Featured
  async function handleToggleFeatured(id) {
    try {
      await toggleFeaturedBlog(id)
      loadPosts()
      loadStats()
    } catch (err) {
      console.error('Failed to toggle featured status:', err)
    }
  }

  // Master Checkbox Handlers
  const isAllSelected = posts.length > 0 && selectedIds.length === posts.length
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(posts.map((p) => p.id))
    }
  }

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return '—'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>SEO CONTENT ENGINE</span>
          </div>
          <h1 className="font-display text-2xl font-black tracking-tight text-neutral-900 mt-1">
            Blog &amp; Knowledge Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Create, publish, and manage dynamic SEO printing guides connected directly to MySQL.
          </p>
        </div>
        <Button to="/admin/blog/new" variant="accent" className="text-xs font-bold shrink-0 shadow-sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Write New Article
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Articles</span>
            <FileText className="h-4 w-4 text-neutral-400" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-neutral-900">{stats.total}</div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Published</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-emerald-900">{stats.published}</div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Drafts</span>
            <FileText className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-amber-900">{stats.drafts}</div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Scheduled</span>
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-blue-900">{stats.scheduled}</div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#A82F19]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Featured</span>
            <Star className="h-4 w-4 fill-[#A82F19] text-[#A82F19]" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-[#A82F19]">{stats.featured}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by title, keyword, slug…"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 pl-10 pr-4 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs font-bold text-neutral-700 focus:border-[#A82F19] focus:bg-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="scheduled">Scheduled</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs font-bold text-neutral-700 focus:border-[#A82F19] focus:bg-white focus:outline-none max-w-[160px] truncate"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Product filter */}
          <select
            value={productFilter}
            onChange={(e) => {
              setProductFilter(e.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs font-bold text-neutral-700 focus:border-[#A82F19] focus:bg-white focus:outline-none max-w-[160px] truncate"
          >
            <option value="all">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Floating Multi-Delete Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-2xl bg-neutral-900 px-5 py-3 text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A82F19] text-[10px]">
              {selectedIds.length}
            </span>
            <span>article(s) selected</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-neutral-400 hover:text-white cursor-pointer"
            >
              Deselect All
            </button>
            <button
              type="button"
              onClick={() => setBulkDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-700 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#A82F19] border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-neutral-300" />
            <h3 className="font-display mt-3 text-base font-bold text-neutral-900">No blog articles found</h3>
            <p className="text-xs text-neutral-500 mt-1">
              {search || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your filters or search keywords.'
                : 'Write your first dynamic printing guide to rank on Google.'}
            </p>
            <div className="mt-4">
              <Button to="/admin/blog/new" variant="accent" size="sm">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Create First Article
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 bg-neutral-50/80 font-bold uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="py-3.5 pl-5 pr-2 w-8">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-neutral-500 hover:text-neutral-900 cursor-pointer"
                      aria-label="Select all"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="h-4 w-4 text-[#A82F19]" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-3">Article &amp; SEO Slug</th>
                  <th className="px-3 py-3.5">Category</th>
                  <th className="px-3 py-3.5">Related Product</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="px-3 py-3.5 text-center">Featured</th>
                  <th className="px-3 py-3.5">Published Date</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {posts.map((post) => {
                  const isSelected = selectedIds.includes(post.id)
                  return (
                    <tr
                      key={post.id}
                      className={`hover:bg-neutral-50/80 transition-colors ${
                        isSelected ? 'bg-neutral-50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 pl-5 pr-2">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(post.id)}
                          className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-[#A82F19]" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>

                      {/* Title & Thumbnail */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 overflow-hidden rounded-lg bg-neutral-100 shrink-0 border border-neutral-200">
                            <img
                              src={post.featured_image || post.featuredImage}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="max-w-sm sm:max-w-md">
                            <div className="font-bold text-neutral-900 line-clamp-1 hover:text-[#A82F19] transition-colors">
                              <Link to={`/admin/blog/${post.id}/edit`}>{post.title}</Link>
                            </div>
                            <div className="text-[11px] text-neutral-400 line-clamp-1 font-mono mt-0.5">
                              /blog/{post.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-3 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-neutral-700">
                          <Layers className="h-3 w-3 text-neutral-400" />
                          {post.category || 'General'}
                        </span>
                      </td>

                      {/* Related Product */}
                      <td className="px-3 py-4">
                        {post.product ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft/40 px-2.5 py-1 text-[10px] font-bold text-accent">
                            <Package className="h-3 w-3" />
                            <span className="max-w-[120px] truncate">{post.product}</span>
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="px-3 py-4">
                        {post.status === 'published' ? (
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(post)}
                            title="Click to unpublish"
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Published
                          </button>
                        ) : post.status === 'scheduled' ? (
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(post)}
                            title="Click to change status"
                            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
                          >
                            <Calendar className="h-3 w-3 text-blue-500" />
                            Scheduled
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(post)}
                            title="Click to publish"
                            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 hover:bg-amber-100 cursor-pointer"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Draft
                          </button>
                        )}
                      </td>

                      {/* Featured Star Toggle */}
                      <td className="px-3 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(post.id)}
                          className="text-neutral-300 hover:text-amber-400 cursor-pointer p-1 transition-colors"
                          title={post.is_featured ? 'Featured on Homepage' : 'Mark as Featured'}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              post.is_featured ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Published Date */}
                      <td className="px-3 py-4 text-neutral-500 text-[11px]">
                        {formatDate(post.published_at || post.publishedAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                            title="View on site"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/admin/blog/${post.id}/edit`}
                            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                            title="Edit article"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(post.id)}
                            className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete article"
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
        )}

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-3 bg-neutral-50 text-xs font-semibold text-neutral-600">
            <div>
              Showing {posts.length} of {pagination.total} articles
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 hover:bg-neutral-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <span className="font-bold text-neutral-900">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 hover:bg-neutral-50 disabled:opacity-40 cursor-pointer"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Single Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="font-display text-lg font-bold text-neutral-900">Delete Blog Article?</h3>
            </div>
            <p className="text-xs leading-relaxed text-neutral-600">
              Are you sure you want to permanently delete this article? This action cannot be undone and the URL will be removed from Google Search indexing.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                disabled={actionLoading}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="accent"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading}
                className="text-xs bg-red-600 hover:bg-red-700"
              >
                {actionLoading ? 'Deleting...' : 'Delete Article'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="font-display text-lg font-bold text-neutral-900">
                Delete {selectedIds.length} Selected Articles?
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-neutral-600">
              You are about to permanently delete <strong className="text-neutral-900">{selectedIds.length}</strong> articles from MySQL. This action is irreversible.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBulkDeleteConfirm(false)}
                disabled={actionLoading}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="accent"
                onClick={handleBulkDelete}
                disabled={actionLoading}
                className="text-xs bg-red-600 hover:bg-red-700"
              >
                {actionLoading ? 'Deleting...' : 'Confirm Bulk Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
