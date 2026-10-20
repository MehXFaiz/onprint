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
  Gauge,
  X,
  ExternalLink,
  AlertTriangle,
  XCircle,
  CheckCircle,
  TrendingUp,
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
  analyzeBlogSeo,
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

  // SEO Modal State
  const [seoModalPost, setSeoModalPost] = useState(null)
  const [seoModalLoading, setSeoModalLoading] = useState(false)
  const [seoModalData, setSeoModalData] = useState(null)

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

  // Open SEO Analysis Modal
  const openSeoModal = async (post) => {
    setSeoModalPost(post)
    setSeoModalLoading(true)
    // Seed modal with post data while waiting for real-time live evaluation
    setSeoModalData({
      seo_score: post.seo_score != null ? Number(post.seo_score) : null,
      readability_score: post.readability_score != null ? Number(post.readability_score) : null,
      keyword_density: post.keyword_density != null ? Number(post.keyword_density) : null,
      word_count: post.word_count != null ? Number(post.word_count) : null,
      recommendations: post.seo_suggestions || [],
      evaluation: null,
    })

    try {
      const res = await analyzeBlogSeo(post, post.id)
      if (res?.data) {
        setSeoModalData(res.data)
      }
    } catch (err) {
      console.warn('Live SEO analysis error:', err.message)
    } finally {
      setSeoModalLoading(false)
    }
  }

  const closeSeoModal = () => {
    setSeoModalPost(null)
    setSeoModalData(null)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1E2C4F] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D6C29A]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>SEO CONTENT ENGINE</span>
          </div>
          <h1 className="font-display text-2xl font-black tracking-tight text-[#F5F3EE] mt-1">
            Blog &amp; Knowledge Management
          </h1>
          <p className="text-xs text-[#B8C2D9] mt-0.5">
            Create, publish, and manage dynamic SEO printing guides connected directly to MySQL.
          </p>
        </div>
        <Button to="/admin/blog/new" variant="accent" className="text-xs font-bold shrink-0 shadow-sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Blog
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-[#1E2C4F] bg-[#14213D] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#B8C2D9]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Articles</span>
            <FileText className="h-4 w-4 text-[#B8C2D9]/70" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-[#F5F3EE]">{stats.total}</div>
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

        <div className="rounded-2xl border border-[#1E2C4F] bg-[#14213D] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#D6C29A]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Featured</span>
            <Star className="h-4 w-4 fill-[#D6C29A] text-[#D6C29A]" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-[#D6C29A]">{stats.featured}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#14213D] p-4 rounded-2xl border border-[#1E2C4F] shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B8C2D9]/70" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by title, keyword, slug…"
            className="w-full rounded-xl border border-[#1E2C4F] bg-[#0B132B] pl-10 pr-4 py-2 text-xs font-semibold text-[#F5F3EE] focus:border-[#D6C29A] focus:bg-[#14213D] focus:outline-none"
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
            className="w-full sm:w-auto sm:max-w-[160px] rounded-xl border border-[#1E2C4F] bg-[#0B132B] px-3 py-2 text-xs font-bold text-[#F5F3EE] focus:border-[#D6C29A] focus:bg-[#14213D] focus:outline-none"
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
            className="w-full sm:w-auto sm:max-w-[160px] rounded-xl border border-[#1E2C4F] bg-[#0B132B] px-3 py-2 text-xs font-bold text-[#F5F3EE] focus:border-[#D6C29A] focus:bg-[#14213D] focus:outline-none truncate"
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
            className="w-full sm:w-auto sm:max-w-[160px] rounded-xl border border-[#1E2C4F] bg-[#0B132B] px-3 py-2 text-xs font-bold text-[#F5F3EE] focus:border-[#D6C29A] focus:bg-[#14213D] focus:outline-none truncate"
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
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D6C29A] text-[10px]">
              {selectedIds.length}
            </span>
            <span>article(s) selected</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-[#B8C2D9]/70 hover:text-white cursor-pointer"
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
      <div className="overflow-hidden rounded-2xl border border-[#1E2C4F] bg-[#14213D] shadow-xs">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D6C29A] border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-neutral-300" />
            <h3 className="font-display mt-3 text-base font-bold text-[#F5F3EE]">No blog articles found</h3>
            <p className="text-xs text-[#B8C2D9] mt-1">
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
            <table className="w-full min-w-[800px] text-left text-xs">
              <thead className="border-b border-[#1E2C4F] bg-[#0B132B]/80 font-bold uppercase tracking-wider text-[#B8C2D9]">
                <tr>
                  <th className="py-3.5 pl-5 pr-2 w-8">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-[#B8C2D9] hover:text-[#F5F3EE] cursor-pointer"
                      aria-label="Select all"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="h-4 w-4 text-[#D6C29A]" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-3">Article &amp; SEO Slug</th>
                  <th className="px-3 py-3.5">Category</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="px-3 py-3.5 text-center">SEO Score</th>
                  <th className="px-3 py-3.5 text-center">Featured</th>
                  <th className="px-3 py-3.5">Published / Updated</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-[#F5F3EE]">
                {posts.map((post) => {
                  const isSelected = selectedIds.includes(post.id)
                  const seoScore = post.seo_score != null ? Number(post.seo_score) : null
                  return (
                    <tr
                      key={post.id}
                      className={`hover:bg-[#0B132B]/80 transition-colors ${
                        isSelected ? 'bg-[#0B132B]' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 pl-5 pr-2">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(post.id)}
                          className="text-[#B8C2D9]/70 hover:text-[#F5F3EE] cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-[#D6C29A]" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>

                      {/* Title & Thumbnail */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 overflow-hidden rounded-lg bg-neutral-100 shrink-0 border border-[#1E2C4F]">
                            <img
                              src={post.featured_image || post.featuredImage}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="max-w-sm sm:max-w-md">
                            <div className="font-bold text-[#F5F3EE] line-clamp-1 hover:text-[#D6C29A] transition-colors">
                              <Link to={`/admin/blog/${post.id}/edit`}>{post.title}</Link>
                            </div>
                            <div className="text-[11px] text-[#B8C2D9]/70 line-clamp-1 font-mono mt-0.5">
                              /blog/{post.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-3 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-[#F5F3EE]">
                          <Layers className="h-3 w-3 text-[#B8C2D9]/70" />
                          {post.category || 'General'}
                        </span>
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

                      {/* SEO Score Badge */}
                      <td className="px-3 py-4 text-center">
                        {seoScore != null ? (
                          <button
                            type="button"
                            onClick={() => openSeoModal(post)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold border transition-all hover:scale-105 cursor-pointer ${
                              seoScore >= 90
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : seoScore >= 75
                                ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                                : seoScore >= 50
                                ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                                : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                            }`}
                            title="Click to view full SEO breakdown & AI suggestions"
                          >
                            <Gauge className="h-3 w-3" />
                            <span>{seoScore}/100</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openSeoModal(post)}
                            className="inline-flex items-center gap-1 rounded-full bg-neutral-100 border border-[#1E2C4F] px-2 py-0.5 text-[10px] font-bold text-[#B8C2D9] hover:bg-neutral-200 cursor-pointer"
                            title="Click to run real-time SEO analysis"
                          >
                            <Sparkles className="h-3 w-3 text-amber-500" />
                            <span>Analyze</span>
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

                      {/* Published / Updated Date */}
                      <td className="px-3 py-4 text-[#B8C2D9] text-[11px]">
                        <div className="font-semibold text-[#F5F3EE]">
                          {formatDate(post.published_at || post.publishedAt)}
                        </div>
                        <div className="text-[10px] text-[#B8C2D9]/70 mt-0.5">
                          Upd: {formatDate(post.updated_at || post.updatedAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openSeoModal(post)}
                            className="rounded-lg p-1.5 text-[#B8C2D9]/70 hover:bg-[#D6C29A]/10 hover:text-[#D6C29A] transition-colors cursor-pointer"
                            title="View SEO Analysis"
                          >
                            <Gauge className="h-4 w-4 text-[#D6C29A]" />
                          </button>
                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-[#B8C2D9]/70 hover:bg-[#1E2C4F] hover:text-[#F5F3EE] transition-colors"
                            title="View live on website"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/admin/blog/${post.id}/edit`}
                            className="rounded-lg p-1.5 text-[#B8C2D9]/70 hover:bg-[#1E2C4F] hover:text-[#F5F3EE] transition-colors"
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#1E2C4F] px-4 sm:px-6 py-3 bg-[#0B132B] text-xs font-semibold text-[#B8C2D9]">
            <div>
              Showing {posts.length} of {pagination.total} articles
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-[#1E2C4F] bg-[#14213D] px-3 py-1.5 hover:bg-[#0B132B] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <span className="font-bold text-[#F5F3EE]">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-[#1E2C4F] bg-[#14213D] px-3 py-1.5 hover:bg-[#0B132B] disabled:opacity-40 cursor-pointer"
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
          <div className="w-full max-w-md rounded-2xl bg-[#14213D] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="font-display text-lg font-bold text-[#F5F3EE]">Delete Blog Article?</h3>
            </div>
            <p className="text-xs leading-relaxed text-[#B8C2D9]">
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
          <div className="w-full max-w-md rounded-2xl bg-[#14213D] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="font-display text-lg font-bold text-[#F5F3EE]">
                Delete {selectedIds.length} Selected Articles?
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[#B8C2D9]">
              You are about to permanently delete <strong className="text-[#F5F3EE]">{selectedIds.length}</strong> articles from MySQL. This action is irreversible.
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

      {/* SEO Analysis Breakdown Modal */}
      {seoModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#14213D] shadow-2xl border border-[#1E2C4F] overflow-hidden my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1E2C4F] bg-[#0B132B]/80 px-6 py-4">
              <div className="flex items-center gap-2 text-[#D6C29A]">
                <Gauge className="h-5 w-5" />
                <h3 className="font-display text-base font-black text-[#F5F3EE]">
                  AI Blog SEO Analysis &amp; Diagnostic
                </h3>
              </div>
              <button
                type="button"
                onClick={closeSeoModal}
                className="rounded-lg p-1.5 text-[#B8C2D9]/70 hover:bg-neutral-200 hover:text-[#F5F3EE] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Article Meta Header */}
              <div className="rounded-2xl border border-[#1E2C4F] bg-[#0B132B] p-4">
                <div className="font-bold text-[#F5F3EE] text-sm">{seoModalPost.title}</div>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
                  <span className="font-mono text-[#B8C2D9]">/blog/{seoModalPost.slug}</span>
                  {seoModalPost.focus_keyword && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#D6C29A]/10 px-2 py-0.5 font-bold text-[#D6C29A]">
                      Keyword: {seoModalPost.focus_keyword}
                    </span>
                  )}
                  {seoModalPost.category && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200 px-2 py-0.5 font-bold text-[#F5F3EE]">
                      {seoModalPost.category}
                    </span>
                  )}
                </div>
              </div>

              {/* KPI Score Cards Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {/* 0-100 Score */}
                <div className="rounded-2xl border border-[#1E2C4F] bg-[#14213D] p-3.5 text-center shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#B8C2D9]/70">
                    Overall Score
                  </div>
                  <div className="mt-1 flex items-baseline justify-center gap-1">
                    <span
                      className={`text-2xl font-black ${
                        (seoModalData?.seo_score || 0) >= 90
                          ? 'text-emerald-600'
                          : (seoModalData?.seo_score || 0) >= 75
                          ? 'text-blue-600'
                          : (seoModalData?.seo_score || 0) >= 50
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {seoModalData?.seo_score != null ? seoModalData.seo_score : '—'}
                    </span>
                    <span className="text-xs text-[#B8C2D9]/70 font-bold">/100</span>
                  </div>
                  <div className="text-[10px] font-bold text-[#B8C2D9] mt-0.5">
                    {(seoModalData?.seo_score || 0) >= 90
                      ? 'Excellent'
                      : (seoModalData?.seo_score || 0) >= 75
                      ? 'Good'
                      : (seoModalData?.seo_score || 0) >= 50
                      ? 'Needs Work'
                      : 'Poor'}
                  </div>
                </div>

                {/* Readability Score */}
                <div className="rounded-2xl border border-[#1E2C4F] bg-[#14213D] p-3.5 text-center shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#B8C2D9]/70">
                    Readability
                  </div>
                  <div className="mt-1 text-2xl font-black text-[#F5F3EE]">
                    {seoModalData?.readability_score != null ? seoModalData.readability_score : '—'}
                  </div>
                  <div className="text-[10px] font-bold text-[#B8C2D9] mt-0.5">Flesch Ease</div>
                </div>

                {/* Word Count */}
                <div className="rounded-2xl border border-[#1E2C4F] bg-[#14213D] p-3.5 text-center shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#B8C2D9]/70">
                    Word Count
                  </div>
                  <div className="mt-1 text-2xl font-black text-[#F5F3EE]">
                    {seoModalData?.word_count != null ? seoModalData.word_count : '—'}
                  </div>
                  <div className="text-[10px] font-bold text-[#B8C2D9] mt-0.5">Words</div>
                </div>

                {/* Keyword Density */}
                <div className="rounded-2xl border border-[#1E2C4F] bg-[#14213D] p-3.5 text-center shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#B8C2D9]/70">
                    Density
                  </div>
                  <div className="mt-1 text-2xl font-black text-[#F5F3EE]">
                    {seoModalData?.keyword_density != null ? `${seoModalData.keyword_density}%` : '—'}
                  </div>
                  <div className="text-[10px] font-bold text-[#B8C2D9] mt-0.5">Ideal: 1–2.5%</div>
                </div>
              </div>

              {/* 16-point Breakdown Checklist */}
              {seoModalData?.breakdown && (
                <div className="rounded-2xl border border-[#1E2C4F] bg-[#14213D] p-4 shadow-xs">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#F5F3EE] mb-3 flex items-center justify-between">
                    <span>16-Point Optimization Checklist</span>
                    <span className="text-[11px] text-[#B8C2D9]/70 font-normal">Google Essentials Compliant</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                    {Object.entries(seoModalData.breakdown).map(([factorKey, item]) => {
                      const isPassing = item?.score > 0 || item?.passed === true
                      const label = factorKey
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())
                      return (
                        <div
                          key={factorKey}
                          className={`flex items-start gap-2 rounded-xl p-2 border ${
                            isPassing
                              ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900'
                              : 'bg-[#0B132B] border-[#1E2C4F] text-[#F5F3EE]'
                          }`}
                        >
                          {isPassing ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-[11px] truncate">{label}</div>
                            <div className="text-[10px] text-[#B8C2D9] truncate">
                              {item?.note || (isPassing ? 'Satisfies best practices' : 'Needs attention')}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Actionable Recommendations List */}
              <div className="rounded-2xl border border-[#1E2C4F] bg-[#14213D] p-4 shadow-xs">
                <div className="font-bold text-xs uppercase tracking-wider text-[#F5F3EE] mb-3">
                  Priority Recommendations &amp; Fixes
                </div>
                {seoModalLoading ? (
                  <div className="py-6 text-center text-xs text-[#B8C2D9]/70">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D6C29A] border-t-transparent mx-auto mb-2" />
                    Running 16-point real-time AI SEO diagnostic…
                  </div>
                ) : Array.isArray(seoModalData?.recommendations) && seoModalData.recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {seoModalData.recommendations.map((rec, idx) => {
                      const sev = (rec.priority || rec.severity || 'MEDIUM').toUpperCase()
                      return (
                        <div
                          key={idx}
                          className="rounded-xl border border-[#1E2C4F] bg-[#0B132B]/70 p-3 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#F5F3EE]">
                              {rec.problem || rec.issue || rec.title}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                                sev === 'CRITICAL'
                                  ? 'bg-red-100 text-red-700'
                                  : sev === 'HIGH'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {sev}
                            </span>
                          </div>
                          {rec.why && (
                            <div className="text-[11px] text-[#B8C2D9]">
                              <strong className="text-[#F5F3EE]">Why:</strong> {rec.why}
                            </div>
                          )}
                          {(rec.solution || rec.fix || rec.recommendation) && (
                            <div className="text-[11px] text-emerald-800 bg-emerald-50/60 p-2 rounded-lg mt-1">
                              <strong className="text-emerald-900">Action:</strong>{' '}
                              {rec.solution || rec.fix || rec.recommendation}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl">
                    ✓ No critical SEO deficiencies detected. Article meets core search guidelines.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-[#1E2C4F] bg-[#0B132B]/80 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeSeoModal}
                className="text-xs"
              >
                Close
              </Button>
              <Link
                to={`/admin/blog/${seoModalPost.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#D6C29A] px-4 py-2 text-xs font-bold text-[#0B132B] shadow-xs hover:bg-[#D6C29A] transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Optimize in Blog Editor</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
