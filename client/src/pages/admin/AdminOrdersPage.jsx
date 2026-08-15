import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Search, Filter, Edit2, Plus, CheckCircle2, Clock, Truck, AlertCircle, X } from 'lucide-react'
import Button from '../../components/Button'
import { getStoredOrders, updateOrderStatus } from '../../services/orders'

function StatusBadge({ status }) {
  let style = 'bg-neutral-100 text-neutral-700 border-neutral-200'
  let Icon = Clock

  if (status === 'Pending') {
    style = 'bg-amber-50 text-amber-700 border-amber-200'
    Icon = AlertCircle
  } else if (status === 'Processing') {
    style = 'bg-blue-50 text-blue-700 border-blue-200'
    Icon = Clock
  } else if (status === 'In Production') {
    style = 'bg-purple-50 text-purple-700 border-purple-200'
    Icon = ShoppingBag
  } else if (status === 'Dispatched') {
    style = 'bg-sky-50 text-sky-700 border-sky-200'
    Icon = Truck
  } else if (status === 'Delivered') {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200'
    Icon = CheckCircle2
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${style}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  )
}

export default function AdminOrdersPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [notification, setNotification] = useState(location.state?.toast || null)

  useEffect(() => {
    setOrders(getStoredOrders())
  }, [])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleStatusChange = (orderId, newStatus) => {
    const updated = updateOrderStatus(orderId, newStatus)
    setOrders(updated)
    setNotification(`Order status updated to "${newStatus}".`)
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.productName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <ShoppingBag className="h-4 w-4" />
            <span>Workflow & Dispatch</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-black text-neutral-900">
            Order Management
          </h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            Track customer print runs, update production stages, and manage dispatches in Dubai.
          </p>
        </div>

        <Button
          onClick={() => navigate('/admin/orders/new')}
          variant="accent"
          icon={false}
          className="shadow-md shadow-[#A82F19]/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Create Order
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

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Orders</div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-900">{orders.length}</div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending Approval</div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-600">
            {orders.filter((o) => o.status === 'Pending').length}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-600">In Production</div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-purple-600">
            {orders.filter((o) => o.status === 'In Production').length}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Delivered</div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600">
            {orders.filter((o) => o.status === 'Delivered').length}
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or customer..."
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-4 py-2 text-xs font-medium text-neutral-900 focus:border-[#A82F19] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-neutral-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs font-bold text-neutral-800 focus:border-[#A82F19] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="In Production">In Production</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-extrabold uppercase tracking-wider text-neutral-500">
              <th className="py-3.5 px-4">Order #</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Item</th>
              <th className="py-3.5 px-4">Qty</th>
              <th className="py-3.5 px-4">Total</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
            {filteredOrders.map((o) => (
              <tr key={o.id} className="hover:bg-neutral-50/60 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-neutral-900">{o.orderNumber}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-neutral-900">{o.customerName}</div>
                  <div className="text-[10px] text-neutral-500">{o.company || 'Client'}</div>
                </td>
                <td className="py-3 px-4 font-bold text-neutral-800 max-w-xs truncate">{o.productName}</td>
                <td className="py-3 px-4 font-bold text-neutral-700">{o.quantity}</td>
                <td className="py-3 px-4 font-black text-neutral-900">AED {o.totalPrice?.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={o.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-bold text-neutral-800 focus:border-[#A82F19] focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="In Production">In Production</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                    </select>

                    <button
                      onClick={() => navigate(`/admin/orders/${o.id}/edit`)}
                      className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                      title="Edit Order"
                    >
                      <Edit2 className="h-4 w-4" />
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
