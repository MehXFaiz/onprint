import { useState, useEffect } from 'react'
import { ShoppingBag, Search, Filter, Eye, CheckCircle2, Clock, Truck, AlertCircle, FileText, X } from 'lucide-react'
import { getStoredOrders, updateOrderStatus } from '../../services/orders'

const STATUS_OPTIONS = ['Pending', 'Processing', 'In Production', 'Dispatched', 'Delivered', 'Cancelled']

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
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    setOrders(getStoredOrders())
  }, [])

  const handleStatusChange = (orderId, newStatus) => {
    const updated = updateOrderStatus(orderId, newStatus)
    setOrders(updated)
    setNotification(`Order status updated to "${newStatus}".`)
    setTimeout(() => setNotification(null), 3000)
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
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-black text-neutral-900">
          Order Management & Workflow
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Track customer print runs, update production stages, and manage dispatches in Dubai.
        </p>
      </div>

      {notification && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)}>
            <X className="h-4 w-4 text-emerald-600" />
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

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, or item..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-2 text-xs font-medium text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['ALL', ...STATUS_OPTIONS].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === status
                  ? 'bg-[#A82F19] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-6 py-4">Order ID & Date</th>
                <th className="px-6 py-4">Client & Company</th>
                <th className="px-6 py-4">Product Run</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-neutral-900">{order.orderNumber}</div>
                      <div className="text-[10px] text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-neutral-900">{order.customerName}</div>
                      <div className="text-[11px] text-neutral-500">{order.company || order.customerEmail}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900">{order.productName}</div>
                      <div className="text-[10px] text-neutral-500">Qty: {order.quantity} units</div>
                    </td>

                    <td className="px-6 py-4 font-bold text-neutral-900">
                      AED {order.totalPrice.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.status} />
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[10px] font-bold text-neutral-700 focus:border-[#A82F19] focus:outline-none"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              Change to: {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 rounded-xl bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-[#A82F19] hover:text-white transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#A82F19] uppercase tracking-wider">
                  Order Details
                </span>
                <h2 className="font-display text-xl font-bold text-neutral-900 mt-0.5">
                  {selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6 text-xs text-neutral-800">
              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-neutral-50 p-4 border border-neutral-200">
                <div>
                  <div className="font-bold text-neutral-500 uppercase text-[10px]">Client Info</div>
                  <div className="font-bold text-neutral-900 mt-1">{selectedOrder.customerName}</div>
                  <div>{selectedOrder.company}</div>
                  <div className="text-neutral-500">{selectedOrder.customerEmail}</div>
                  <div className="text-neutral-500">{selectedOrder.phone}</div>
                </div>

                <div>
                  <div className="font-bold text-neutral-500 uppercase text-[10px]">Delivery Address</div>
                  <div className="mt-1 font-semibold">{selectedOrder.deliveryAddress}</div>
                </div>
              </div>

              <div>
                <div className="font-bold text-neutral-900 text-sm mb-2">Print Specifications & Artwork</div>
                <div className="rounded-2xl border border-neutral-200 p-4 space-y-2 bg-white">
                  <div><strong className="text-neutral-900">Product:</strong> {selectedOrder.productName}</div>
                  <div><strong className="text-neutral-900">Quantity:</strong> {selectedOrder.quantity} units</div>
                  <div><strong className="text-neutral-900">Specifications:</strong> {selectedOrder.specs}</div>
                  <div className="pt-2 flex items-center gap-2 border-t border-neutral-100 mt-2">
                    <FileText className="h-4 w-4 text-[#A82F19]" />
                    <span className="font-bold text-neutral-900">Artwork File:</span>
                    <span className="text-[#A82F19] underline font-mono cursor-pointer">
                      {selectedOrder.artworkFile}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <div>
                  <span className="text-neutral-500">Total Price: </span>
                  <span className="font-black text-lg text-neutral-900">AED {selectedOrder.totalPrice.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-600">Status:</span>
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
