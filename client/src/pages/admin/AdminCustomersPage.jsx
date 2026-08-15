import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Users, Plus, Search, Edit2, Trash2, CheckCircle2, X } from 'lucide-react'
import Button from '../../components/Button'

const MOCK_CUSTOMERS = [
  { id: 1, name: 'Ahmed Al Mansoori', email: 'ahmed@emirateslogistics.ae', phone: '+971 50 123 4567', company: 'Emirates Logistics', role: 'customer', status: 'active' },
  { id: 2, name: 'Sarah Jenkins', email: 'sarah@vertextech.ae', phone: '+971 52 987 6543', company: 'Vertex Tech', role: 'customer', status: 'active' },
  { id: 3, name: 'ONPRINT Admin', email: 'admin@onprint.ae', phone: '+971 4 800 PRINT', company: 'ONPRINT Studio', role: 'admin', status: 'active' },
]

export default function AdminCustomersPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [customers, setCustomers] = useState(MOCK_CUSTOMERS)
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(location.state?.toast || null)

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete customer "${name}"?`)) {
      setCustomers((prev) => prev.filter((c) => c.id !== id))
      setNotification(`Customer "${name}" removed.`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <Users className="h-4 w-4" />
            <span>Client Accounts</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-black text-neutral-900">
            Customer Directory
          </h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            Manage corporate client profiles and user permissions.
          </p>
        </div>

        <Button
          onClick={() => navigate('/admin/customers/new')}
          variant="accent"
          icon={false}
          className="shadow-md shadow-[#A82F19]/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Customer
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
            placeholder="Search customers by name, email, or company..."
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-4 py-2 text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-extrabold uppercase tracking-wider text-neutral-500">
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Phone</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50/60 transition-colors">
                <td className="py-3 px-4 font-bold text-neutral-900">{c.name}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">{c.email}</td>
                <td className="py-3 px-4 text-neutral-700">{c.company}</td>
                <td className="py-3 px-4 text-neutral-500">{c.phone}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                      c.role === 'admin'
                        ? 'bg-red-50 text-[#A82F19] border border-red-200'
                        : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                    }`}
                  >
                    {c.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/admin/customers/${c.id}/edit`)}
                      className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                      title="Edit Customer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Customer"
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
