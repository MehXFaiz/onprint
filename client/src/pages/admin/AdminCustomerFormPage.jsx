import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Users, Save } from 'lucide-react'
import Button from '../../components/Button'

export default function AdminCustomerFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'customer',
    status: 'active',
  })

  useEffect(() => {
    if (!isEdit) return
    setForm({
      name: 'Ahmed Al Mansoori',
      email: 'ahmed@emirateslogistics.ae',
      phone: '+971 50 123 4567',
      company: 'Emirates Logistics',
      role: 'customer',
      status: 'active',
    })
  }, [id, isEdit])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and Email address are required.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      navigate('/admin/customers', {
        state: { toast: `Customer "${form.name}" ${isEdit ? 'updated' : 'created'} successfully.` },
      })
    }, 400)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#B8C2D9]">
        <Link to="/admin" className="hover:text-[#F5F3EE] transition-colors">
          Admin
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#B8C2D9]/70" />
        <Link to="/admin/customers" className="hover:text-[#F5F3EE] transition-colors">
          Customers
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#B8C2D9]/70" />
        <span className="text-[#F5F3EE] font-bold">{isEdit ? 'Edit Customer' : 'Add New Customer'}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#122240] pb-6">
        <div>
          <Link
            to="/admin/customers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D6C29A] hover:underline mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Customers
          </Link>
          <h1 className="font-display text-2xl font-black text-[#F5F3EE]">
            {isEdit ? `Edit Customer: ${form.name}` : 'Add New Customer Account'}
          </h1>
          <p className="text-xs text-[#B8C2D9] mt-0.5">
            Manage corporate client accounts and contact profiles.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl border border-[#122240] bg-[#081226] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#122240] pb-4">
            <h3 className="font-display text-base font-bold text-[#F5F3EE] flex items-center gap-2">
              <Users className="h-4 w-4 text-[#D6C29A]" />
              Account Details
            </h3>
            <p className="text-xs text-[#B8C2D9]">Contact information and corporate affiliation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ahmed Al Mansoori"
                className="mt-1.5 w-full rounded-xl border border-[#122240] bg-[#081226] px-3.5 py-2.5 text-xs text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ahmed@emirateslogistics.ae"
                className="mt-1.5 w-full rounded-xl border border-[#122240] bg-[#081226] px-3.5 py-2.5 text-xs text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                Phone Number
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+971 50 123 4567"
                className="mt-1.5 w-full rounded-xl border border-[#122240] bg-[#081226] px-3.5 py-2.5 text-xs text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                Company Name
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Emirates Logistics"
                className="mt-1.5 w-full rounded-xl border border-[#122240] bg-[#081226] px-3.5 py-2.5 text-xs text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                User Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#122240] bg-[#081226] px-3.5 py-2.5 text-xs font-bold text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none cursor-pointer"
              >
                <option value="customer">Customer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                Account Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#122240] bg-[#081226] px-3.5 py-2.5 text-xs font-bold text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 rounded-2xl bg-[#081226] p-4 border border-[#122240] shadow-xs">
          <Link
            to="/admin/customers"
            className="w-full sm:w-auto text-center rounded-xl border border-[#122240] px-5 py-2.5 text-xs font-bold text-[#F5F3EE] hover:bg-[#040A18] transition-colors"
          >
            Cancel
          </Link>

          <Button
            type="submit"
            variant="accent"
            icon={false}
            disabled={submitting}
            className="w-full sm:w-auto justify-center !px-6 shadow-md shadow-[#D6C29A]/20"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {submitting ? 'Saving...' : isEdit ? 'Update Customer' : 'Save Customer'}
          </Button>
        </div>
      </form>
    </div>
  )
}
