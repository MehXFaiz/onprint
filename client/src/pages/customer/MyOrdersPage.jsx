import { useState, useEffect } from 'react'
import { ShoppingBag, FileText, CheckCircle2, Clock, Truck } from 'lucide-react'
import { getStoredOrders } from '../../services/orders'

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    setOrders(getStoredOrders())
  }, [])

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="font-display text-2xl font-black text-neutral-900">My Print Orders</h1>
        <p className="text-xs text-neutral-500">Track all your corporate printing runs and artwork statuses.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#A82F19]">{order.orderNumber}</span>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-700">
                  {order.status}
                </span>
              </div>
              <h3 className="font-bold text-lg text-neutral-900 mt-1">{order.productName}</h3>
              <p className="text-xs text-neutral-500 mt-1">{order.specs}</p>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 border-neutral-100 pt-3 md:pt-0">
              <div>
                <div className="text-[10px] font-bold uppercase text-neutral-400">Total Price</div>
                <div className="font-black text-neutral-900 text-sm">AED {order.totalPrice.toLocaleString()}</div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase text-neutral-400">Quantity</div>
                <div className="font-bold text-neutral-800 text-xs">{order.quantity} units</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
