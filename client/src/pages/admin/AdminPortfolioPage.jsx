import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Image as ImageIcon, Plus, Search, Edit2, Trash2, CheckCircle2, X, AlertTriangle } from 'lucide-react'
import Button from '../../components/Button'

export default function AdminPortfolioPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [items, setItems] = useState([])
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#14213D] p-6 rounded-3xl border border-[#1E2C4F] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D6C29A]">
            <ImageIcon className="h-4 w-4" />
            <span>Client Case Studies</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-black text-[#F5F3EE]">
            Portfolio Showcase Gallery
          </h1>
          <p className="mt-0.5 text-xs text-[#B8C2D9]">
            Showcase finished print projects, high-resolution photography, and client deliverables.
          </p>
        </div>

        <Button
          onClick={() => navigate('/admin/portfolio/new')}
          variant="accent"
          icon={false}
          className="shadow-md shadow-[#D6C29A]/20 self-start sm:self-auto cursor-pointer"
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
            <X className="h-4 w-4 text-[#B8C2D9]/70 hover:text-white" />
          </button>
        </div>
      )}

      {/* Filter */}
      <div className="bg-[#14213D] p-4 rounded-2xl border border-[#1E2C4F] shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B8C2D9]/70" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search portfolio projects..."
            className="w-full rounded-xl border border-[#1E2C4F] bg-[#0B132B] pl-10 pr-4 py-2 text-xs font-medium text-[#F5F3EE] placeholder-neutral-400 focus:border-[#D6C29A] focus:outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-[#1E2C4F] bg-[#14213D] p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="h-44 w-full overflow-hidden rounded-2xl bg-neutral-100 mb-4 border border-[#1E2C4F]">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#D6C29A]">
                {item.category}
              </div>
              <h3 className="font-display font-bold text-base text-[#F5F3EE] mt-0.5 line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-[#B8C2D9] mt-1">Client: {item.client}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1E2C4F] flex items-center justify-end gap-2">
              <button
                onClick={() => navigate(`/admin/portfolio/${item.id}/edit`)}
                className="rounded-xl border border-[#1E2C4F] p-2 text-[#B8C2D9] hover:bg-[#0B132B] hover:text-[#F5F3EE] transition-colors"
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#14213D] p-4 rounded-2xl border border-[#1E2C4F] shadow-xs text-xs font-semibold text-[#B8C2D9]">
        <div>
          Showing <span className="font-bold text-[#F5F3EE]">{filtered.length}</span> of{' '}
          <span className="font-bold text-[#F5F3EE]">{items.length}</span> projects
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled
            className="rounded-xl border border-[#1E2C4F] bg-[#0B132B] px-3 py-1.5 text-[#B8C2D9]/70 opacity-60 cursor-not-allowed"
          >
            Previous
          </button>
          <button type="button" className="rounded-xl bg-[#D6C29A] px-3 py-1.5 font-bold text-white shadow-xs">
            1
          </button>
          <button
            type="button"
            disabled
            className="rounded-xl border border-[#1E2C4F] bg-[#0B132B] px-3 py-1.5 text-[#B8C2D9]/70 opacity-60 cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#1E2C4F] bg-[#14213D] p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#F5F3EE]">Delete Project?</h3>
                <p className="text-xs text-[#B8C2D9]">
                  Are you sure you want to delete &quot;{deletingItem.title}&quot; from portfolio showcase?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E2C4F]">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="rounded-xl border border-[#1E2C4F] px-4 py-2.5 text-xs font-bold text-[#F5F3EE] hover:bg-[#0B132B]"
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
