import { useState, useEffect } from 'react'
import { ShoppingBag, FileText, CheckCircle2, Clock, Truck, Package, Plus } from 'lucide-react'
import Button from '../../components/Button'
import { getStoredOrders } from '../../services/orders'

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    setOrders(getStoredOrders())
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="font-display text-2xl font-black text-neutral-900">My Print Orders</h1>
          <p className="text-xs text-neutral-500">Track all your corporate printing runs and artwork statuses.</p>
        </div>
        <Button to="/get-a-quote" variant="accent" size="sm" icon={false}>
          <Plus className="h-4 w-4 mr-1" />
          Request New Quote
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center shadow-xs">
          <Package className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-neutral-900">No print orders yet</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Submit your first custom print quote request, and your order will appear here with live tracking.
          </p>
          <Button to="/get-a-quote" variant="accent" size="md" icon={false} className="mt-6">
            Get a Quote Now
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id || order.id || order.orderNumber}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-neutral-300 transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#A82F19]">{order.orderNumber}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      order.status === 'Pending'
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : order.status === 'In Production'
                          ? 'bg-purple-50 border-purple-200 text-purple-700'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-neutral-900 mt-1">{order.productName}</h3>
                {order.specs && <p className="text-xs text-neutral-600 mt-1">{order.specs}</p>}
                {order.notes && <p className="text-[11px] text-neutral-500 italic mt-1">Note: {order.notes}</p>}
                {order.artworkFile && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#A82F19] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                    📎 {order.artworkFile}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 border-t md:border-t-0 border-neutral-100 pt-3 md:pt-0 shrink-0">
                <div>
                  <div className="text-[10px] font-bold uppercase text-neutral-400">Total Price</div>
                  <div className="font-black text-neutral-900 text-sm">AED {Number(order.totalPrice || 0).toLocaleString()}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase text-neutral-400">Quantity</div>
                  <div className="font-bold text-neutral-800 text-xs">{order.quantity} units</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
