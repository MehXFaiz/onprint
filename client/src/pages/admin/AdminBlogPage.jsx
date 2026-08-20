import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Eye, Edit2, Trash2, BookOpen, Clock, AlertCircle } from 'lucide-react'
import Button from '../../components/Button'
import { getBlogPosts, deleteBlogPost, getStoredBlogPosts } from '../../services/blog'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    loadPosts()
  }, [])

  function loadPosts() {
    setLoading(true)
    getBlogPosts()
      .then((data) => {
        setPosts(data || [])
        setLoading(false)
      })
      .catch(() => {
        setPosts(getStoredBlogPosts())
        setLoading(false)
      })
  }

  async function handleDelete(id) {
    try {
      await deleteBlogPost(id)
      setPosts((prev) => prev.filter((p) => p._id !== id && String(p.id) !== String(id)))
      setDeleteConfirm(null)
    } catch {
      // error
    }
  }

  const filtered = posts.filter((p) => {
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter
    const matchSearch =
      !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  const categories = ['All', 'Printing Guide', 'Corporate Gifting', 'Business Stationery', 'Industry Insights']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-neutral-900">
            Blog &amp; Knowledge Articles
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage educational content, printing guides, and Google Search rankings.
          </p>
        </div>
        <Button to="/admin/blog/new" variant="accent" className="text-xs font-bold shrink-0">
          <Plus className="h-4 w-4 mr-1.5" />
          Write New Article
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles…"
            className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-4 py-2 text-xs font-semibold text-neutral-900 focus:border-[#A82F19] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-neutral-900 text-white'
                  : 'border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#A82F19] border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-neutral-300" />
            <h3 className="font-display mt-3 text-base font-bold text-neutral-900">No articles found</h3>
            <p className="text-xs text-neutral-500 mt-1">Try adjusting your search or write your first article.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 bg-neutral-50 font-bold uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">Article</th>
                  <th className="px-3 py-3.5">Category</th>
                  <th className="px-3 py-3.5">Read Time</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {filtered.map((post) => (
                  <tr key={post._id || post.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-4 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 overflow-hidden rounded-lg bg-neutral-100 shrink-0">
                          <img
                            src={post.featuredImage}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="max-w-md">
                          <div className="font-bold text-neutral-900 line-clamp-1">{post.title}</div>
                          <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">{post.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-neutral-700">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime || '5 min'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Published
                      </span>
                    </td>
                    <td className="py-4 pl-3 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                          title="View on site"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/blog/${post._id || post.id}/edit`}
                          className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                          title="Edit article"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(post._id || post.id)}
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="font-display text-lg font-bold text-neutral-900">Delete Blog Article?</h3>
            </div>
            <p className="text-xs leading-relaxed text-neutral-600">
              Are you sure you want to delete this article? This will remove it from the live website and Google search index.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="accent"
                onClick={() => handleDelete(deleteConfirm)}
                className="text-xs bg-red-600 hover:bg-red-700"
              >
                Delete Article
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
