import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Wrench, Plus, Search, Edit2, Trash2, CheckCircle2, X } from 'lucide-react'
import Button from '../../components/Button'

const MOCK_SERVICES = [
  { id: 1, name: 'Digital & Offset Printing', slug: 'digital-offset-printing', description: 'High-precision digital and high-volume offset printing with Pantone color matching.', status: 'active', displayOrder: 1 },
  { id: 2, name: 'Luxury Packaging & Custom Boxes', slug: 'luxury-packaging-custom-boxes', description: 'Custom rigid boxes, magnetic gift boxes, folding cartons, and specialty sleeves.', status: 'active', displayOrder: 2 },
  { id: 3, name: 'Corporate Gift Customization', slug: 'corporate-gift-customization', description: 'Bespoke corporate merchandise, executive desk sets, thermal flasks, custom mugs.', status: 'active', displayOrder: 3 },
  { id: 4, name: 'Large Format & Exhibition Signage', slug: 'large-format-exhibition-signage', description: 'Roll-up banner stands, pop-up backdrops, outdoor teardrop flags, acrylic nameplates.', status: 'active', displayOrder: 4 },
  { id: 5, name: 'Custom Labels & Die-Cut Stickers', slug: 'custom-labels-die-cut-stickers', description: 'Waterproof vinyl stickers, product packaging labels, gold foil seals.', status: 'active', displayOrder: 5 },
  { id: 6, name: 'Executive Business Stationery', slug: 'executive-business-stationery', description: 'Premium business cards, cotton letterheads, custom envelopes, and presentation folders.', status: 'active', displayOrder: 6 },
]

export default function AdminServicesPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [services, setServices] = useState(MOCK_SERVICES)
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(location.state?.toast || null)

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete service "${name}"?`)) {
      setServices((prev) => prev.filter((s) => s.id !== id))
      setNotification(`Service "${name}" deleted.`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <Wrench className="h-4 w-4" />
            <span>Workshop Offerings</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-black text-neutral-900">
            Print Services Management
          </h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            Configure custom printing solutions, offset production, and luxury finishes in Dubai.
          </p>
        </div>

        <Button
          onClick={() => navigate('/admin/services/new')}
          variant="accent"
          icon={false}
          className="shadow-md shadow-[#A82F19]/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Service
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
            placeholder="Search services..."
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-4 py-2 text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-extrabold uppercase tracking-wider text-neutral-500">
              <th className="py-3.5 px-4">Service Name</th>
              <th className="py-3.5 px-4">Slug</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-neutral-50/60 transition-colors">
                <td className="py-3 px-4 font-bold text-neutral-900">{s.name}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">{s.slug}</td>
                <td className="py-3 px-4 max-w-sm truncate text-neutral-500">{s.description}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-emerald-700 border border-emerald-200">
                    {s.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/admin/services/${s.id}/edit`)}
                      className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id, s.name)}
                      className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Service"
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
    </div>
  )
}
