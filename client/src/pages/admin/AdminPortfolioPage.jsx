import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Image as ImageIcon, Plus, Search, Edit2, Trash2, CheckCircle2, X, AlertTriangle } from 'lucide-react'
import Button from '../../components/Button'

const MOCK_PORTFOLIO = [
  { id: 1, title: 'Emirates Smart Vacuum Flasks', client: 'Emirates Logistics', category: 'Corporate Gifts', image: '/assets/products/1 (13).jpg' },
  { id: 2, title: 'Vertex Executive Hardcover Journals', client: 'Vertex Tech', category: 'Office Stationery', image: '/assets/products/1 (5).jpg' },
  { id: 3, title: 'Custom Roll-up Exhibition Stand', client: 'Dubai Expo Client', category: 'Large Format', image: '/assets/products/1 (9).jpg' },
]

export default function AdminPortfolioPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [items, setItems] = useState(MOCK_PORTFOLIO)
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(location.state?.toast || null)
  const [deletingItem, setDeletingItem] = useState(null)

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.client.toLowerCase().includes(search.toLowerCase())
  )

  const confirmDeleteItem = () => {
    if (!deletingItem) return
    setItems((prev) => prev.filter((i) => i.id !== deletingItem.id))
    setNotification(`Project "${deletingItem.title}" deleted successfully.`)
    setDeletingItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <ImageIcon className="h-4 w-4" />
            <span>Client Case Studies</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-black text-neutral-900">
            Portfolio Showcase Gallery
          </h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            Showcase finished print projects, high-resolution photography, and client deliverables.
          </p>
        </div>

        <Button
          onClick={() => navigate('/admin/portfolio/new')}
          variant="accent"
          icon={false}
          className="shadow-md shadow-[#A82F19]/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Project
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

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search portfolio projects..."
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-4 py-2 text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="h-44 w-full overflow-hidden rounded-2xl bg-neutral-100 mb-4 border border-neutral-100">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#A82F19]">
                {item.category}
              </div>
              <h3 className="font-display font-bold text-base text-neutral-900 mt-0.5 line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">Client: {item.client}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                onClick={() => navigate(`/admin/portfolio/${item.id}/edit`)}
                className="rounded-xl border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                title="Edit Project"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeletingItem(item)}
                className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs text-xs font-semibold text-neutral-600">
        <div>
          Showing <span className="font-bold text-neutral-900">{filtered.length}</span> of{' '}
          <span className="font-bold text-neutral-900">{items.length}</span> projects
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
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-900">Delete Project?</h3>
                <p className="text-xs text-neutral-500">
                  Are you sure you want to delete &quot;{deletingItem.title}&quot; from portfolio showcase?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteItem}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
