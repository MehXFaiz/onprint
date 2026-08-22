import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock, Truck, ShoppingBag, Package } from 'lucide-react'
import Button from '../../components/Button'
import { getOrderById } from '../../services/orders'

export default function OrderDetailPage() {
  const { id } = useParams()
  const order = getOrderById(id)

  if (!order) {
    return (
      <div className="space-y-6">
        <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A82F19] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to My Orders
        </Link>
        <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center shadow-xs">
          <Package className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-neutral-900">Order Not Found</h3>
          <p className="text-xs text-neutral-500 mt-1">We could not find an order matching identifier &quot;{id}&quot;.</p>
          <Button to="/account/orders" variant="outline" icon={false} className="mt-6">
            View All Orders
          </Button>
        </div>
      </div>
    )
  }

  const steps = [
    { label: 'Order Placed', done: true, current: order.status === 'Pending' },
    { label: 'In Production', done: ['In Production', 'Dispatched', 'Delivered'].includes(order.status), current: order.status === 'In Production' },
    { label: 'Dispatched', done: ['Dispatched', 'Delivered'].includes(order.status), current: order.status === 'Dispatched' },
    { label: 'Delivered', done: order.status === 'Delivered', current: order.status === 'Delivered' },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A82F19] hover:underline mb-2">
          <ArrowLeft className="h-4 w-4" /> Back to My Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="font-display text-2xl font-black text-neutral-900">Order #{order.orderNumber}</h1>
          <span
            className={`self-start sm:self-auto rounded-full px-3 py-1 text-xs font-bold border ${
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
        <p className="text-xs text-neutral-500 mt-0.5">Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
      </div>

      {/* Production Stage Tracker */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-neutral-500 mb-6">Production Timeline</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {steps.map((s, idx) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  s.done ? 'bg-[#A82F19] text-white shadow-xs' : 'border border-neutral-300 bg-neutral-100 text-neutral-400'
                }`}
              >
                {s.done ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
              </div>
              <span className={`mt-2 text-xs font-bold ${s.current ? 'text-[#A82F19]' : 'text-neutral-700'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Info Breakdown */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="font-display text-xl font-bold text-neutral-900">{order.productName}</h2>
          {order.specs && <p className="text-xs text-neutral-600 mt-1">{order.specs}</p>}
          {order.notes && <p className="text-xs text-neutral-500 mt-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100">Notes: {order.notes}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-neutral-100 py-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Quantity</span>
            <p className="font-bold text-neutral-900 text-sm mt-0.5">{order.quantity} units</p>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total Price</span>
            <p className="font-black text-neutral-900 text-sm mt-0.5">AED {Number(order.totalPrice || 0).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Payment Status</span>
            <p className="font-bold text-neutral-900 text-sm mt-0.5">{order.paymentStatus || 'Pending'}</p>
          </div>
        </div>

        {order.artworkFile && (
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Attached Artwork</span>
            <div className="mt-1.5 flex items-center gap-2 text-xs font-bold text-neutral-800 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
              <span>📎</span>
              <span>{order.artworkFile}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
