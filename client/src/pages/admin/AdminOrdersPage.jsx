import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Search, Filter, Plus, CheckCircle2, Clock, Truck, AlertCircle, X, Trash2, AlertTriangle, CheckSquare } from 'lucide-react'
import Button from '../../components/Button'
import { getStoredOrders, fetchOrders, updateOrderStatus, deleteOrder, deleteOrders } from '../../services/orders'

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

  const renderBadgeIcon = () => {
    if (React.isValidElement(Icon)) return Icon
    if (Icon && (typeof Icon === 'function' || typeof Icon === 'string' || (typeof Icon === 'object' && Icon.$$typeof))) {
      const IconComp = Icon
      return <IconComp className="h-3 w-3" />
    }
    return <Clock className="h-3 w-3" />
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${style}`}>
      {renderBadgeIcon()}
      {status}
    </span>
  )
}

export default function AdminOrdersPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [notification, setNotification] = useState(location.state?.toast || null)
  const [deletingOrder, setDeletingOrder] = useState(null)
  const [selectedOrderIds, setSelectedOrderIds] = useState([])
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const reloadOrders = async () => {
    setLoading(true)
    const list = await fetchOrders()
    setOrders(list)
    setLoading(false)
  }

  useEffect(() => {
    reloadOrders()
  }, [])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const getOrderId = (o) => String(o._id || o.id || o.orderNumber)

  const handleStatusChange = async (orderId, newStatus) => {
    const updated = await updateOrderStatus(orderId, newStatus)
    setOrders(updated)
    setNotification(`Order status updated to "${newStatus}".`)
  }

  const confirmDeleteOrder = async () => {
    if (!deletingOrder) return
    const idToDelete = deletingOrder._id || deletingOrder.id || deletingOrder.orderNumber
    const updated = await deleteOrder(idToDelete)
    setOrders(updated)
    setSelectedOrderIds((prev) => prev.filter((id) => id !== String(idToDelete)))
    setNotification(`Order "${deletingOrder.orderNumber}" deleted successfully.`)
    setDeletingOrder(null)
  }

  const confirmBulkDelete = async () => {
    if (selectedOrderIds.length === 0) return
    const count = selectedOrderIds.length
    const updated = await deleteOrders(selectedOrderIds)
    setOrders(updated)
    setSelectedOrderIds([])
    setIsBulkDeleting(false)
    setNotification(`Successfully deleted ${count} selected order${count > 1 ? 's' : ''}.`)
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      (o.orderNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.productName || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.quoteNumber || '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const isAllSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((o) => selectedOrderIds.includes(getOrderId(o)))
  const isSomeSelected = selectedOrderIds.length > 0 && !isAllSelected

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const filteredKeySet = new Set(filteredOrders.map(getOrderId))
      setSelectedOrderIds((prev) => prev.filter((id) => !filteredKeySet.has(id)))
    } else {
      const allFilteredIds = filteredOrders.map(getOrderId)
      setSelectedOrderIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])))
    }
  }

  const toggleSelectOrder = (id) => {
    const idStr = String(id)
    setSelectedOrderIds((prev) =>
      prev.includes(idStr) ? prev.filter((item) => item !== idStr) : [...prev, idStr]
    )
  }

  const clearSelection = () => setSelectedOrderIds([])

  return (
    <div className="space-y-8 pb-16">
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
          <button onClick={() => setNotification(null)} className="cursor-pointer">
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

      {/* Filter Controls & Bulk Action Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, customer, or quote #..."
              className="w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-4 py-2 text-xs font-medium text-neutral-900 focus:border-[#A82F19] focus:outline-none"
            />
          </div>

          {selectedOrderIds.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-xl border border-red-200 text-xs font-bold">
              <span>{selectedOrderIds.length} selected</span>
              <button
                type="button"
                onClick={() => setIsBulkDeleting(true)}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Delete all selected orders"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="text-red-600 hover:text-red-800 text-[11px] underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
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
              <th className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isSomeSelected
                  }}
                  onChange={toggleSelectAll}
                  aria-label="Select all orders"
                  className="h-4 w-4 rounded border-neutral-300 text-[#A82F19] focus:ring-[#A82F19]/20 cursor-pointer accent-[#A82F19]"
                />
              </th>
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
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-xs text-neutral-500">
                  <ShoppingBag className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                  <p className="font-bold text-neutral-800">No orders recorded in database yet</p>
                  <p className="mt-1 text-neutral-400">
                    When a client quote request is approved or placed on the website, it will show up here.
                  </p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => {
                const orderId = getOrderId(o)
                const isSelected = selectedOrderIds.includes(orderId)

                return (
                  <tr
                    key={orderId}
                    className={`transition-colors ${
                      isSelected ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-neutral-50/60'
                    }`}
                  >
                    <td className="py-3 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOrder(orderId)}
                        aria-label={`Select order ${o.orderNumber}`}
                        className="h-4 w-4 rounded border-neutral-300 text-[#A82F19] focus:ring-[#A82F19]/20 cursor-pointer accent-[#A82F19]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-neutral-900">{o.orderNumber}</div>
                      {o.quoteNumber && (
                        <div className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 mt-0.5">
                          Quote: {o.quoteNumber}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900">{o.customerName}</div>
                      <div className="text-[10px] text-neutral-500">{o.company || o.customerEmail || 'Client'}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-neutral-800 truncate">{o.productName}</div>
                      {o.specs && <div className="text-[10px] text-neutral-500 truncate">{o.specs}</div>}
                      {o.artworkFile && (
                        <div className="mt-0.5 inline-flex items-center gap-1 text-[9px] font-bold text-[#A82F19] bg-red-50 px-1.5 py-0.5 rounded">
                          📎 {o.artworkFile}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-700">{o.quantity}</td>
                    <td className="py-3 px-4 font-black text-neutral-900">AED {o.totalPrice?.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o._id || o.id, e.target.value)}
                          className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-bold text-neutral-800 focus:border-[#A82F19] focus:outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="In Production">In Production</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setDeletingOrder(o)}
                          title="Delete order"
                          className="rounded-lg border border-neutral-200 p-1 text-neutral-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs text-xs font-semibold text-neutral-600">
        <div>
          Showing <span className="font-bold text-neutral-900">{filteredOrders.length}</span> of{' '}
          <span className="font-bold text-neutral-900">{orders.length}</span> orders
          {selectedOrderIds.length > 0 && (
            <span className="ml-2 text-[#A82F19] font-bold">({selectedOrderIds.length} selected)</span>
          )}
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

      {/* Floating Bottom Bulk Action Bar */}
      {selectedOrderIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-700">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#A82F19] text-xs font-bold text-white">
              {selectedOrderIds.length}
            </span>
            <span className="text-xs font-semibold">
              {selectedOrderIds.length === 1 ? '1 order selected' : `${selectedOrderIds.length} orders selected`}
            </span>
          </div>
          <div className="h-4 w-px bg-neutral-700 mx-1" />
          <button
            type="button"
            onClick={() => setIsBulkDeleting(true)}
            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Selected
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="rounded-xl border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            Deselect All
          </button>
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      {deletingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-900">Delete Order?</h3>
                <p className="text-xs text-neutral-500">
                  Are you sure you want to delete order &quot;{deletingOrder.orderNumber}&quot;?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setDeletingOrder(null)}
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteOrder}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start gap-3 text-red-600">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 mt-0.5">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-900">
                  Delete {selectedOrderIds.length} Order{selectedOrderIds.length > 1 ? 's' : ''}?
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Are you sure you want to permanently delete the {selectedOrderIds.length} selected orders? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="max-h-40 overflow-y-auto rounded-2xl bg-neutral-50 p-3 border border-neutral-200 text-xs space-y-1.5">
              {orders
                .filter((o) => selectedOrderIds.includes(getOrderId(o)))
                .map((o) => (
                  <div
                    key={getOrderId(o)}
                    className="flex items-center justify-between font-medium text-neutral-800 py-1 border-b border-neutral-100 last:border-0"
                  >
                    <span className="font-mono font-bold text-neutral-900">{o.orderNumber}</span>
                    <span className="text-neutral-500 truncate max-w-[150px]">{o.customerName || 'Client'}</span>
                    <span className="font-bold text-neutral-900">AED {o.totalPrice?.toLocaleString()}</span>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsBulkDeleting(false)}
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmBulkDelete}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
              >
                Delete {selectedOrderIds.length} Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
