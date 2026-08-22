import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, FileText, User, ArrowRight, Clock, CheckCircle2, ShieldCheck, Plus, Package } from 'lucide-react'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'
import { getStoredOrders } from '../../services/orders'
import { getStoredQuotes } from '../../services/quotes'

export default function DashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [quotes, setQuotes] = useState([])

  useEffect(() => {
    const allOrders = getStoredOrders()
    const allQuotes = getStoredQuotes()
    setOrders(allOrders)
    setQuotes(allQuotes)
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
              <ShieldCheck className="h-3.5 w-3.5" /> Client Portal
            </span>
            <h1 className="font-display mt-1 text-2xl sm:text-3xl font-black text-neutral-900">
              Welcome, {user?.name || 'Valued Client'}
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              {user?.company || 'Corporate Account'} • Track active print runs, quotes, and delivery proofs.
            </p>
          </div>

          <Button to="/get-a-quote" variant="accent" icon={false} className="shadow-md shadow-[#A82F19]/20 self-start sm:self-auto">
            <Plus className="h-4 w-4 mr-1" />
            Request New Quote
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/account/orders" className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs hover:border-[#A82F19]/30 transition-all">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Active Orders</div>
          <div className="mt-2 text-3xl font-black text-neutral-900">{orders.length}</div>
        </Link>

        <Link to="/account/quotes" className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs hover:border-[#A82F19]/30 transition-all">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Quotes Requested</div>
          <div className="mt-2 text-3xl font-black text-neutral-900">{quotes.length}</div>
        </Link>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Proof Status</div>
          <div className="mt-2 text-3xl font-black text-emerald-600">
            {orders.length > 0 ? (orders[0].status === 'Pending' ? 'Under Review' : 'Approved') : 'Ready'}
          </div>
        </div>
      </div>

      {/* Active Orders List */}
      <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-neutral-900">My Print Orders</h3>
            <p className="text-xs text-neutral-500">Track production progress and dispatch details</p>
          </div>
          <Link to="/account/orders" className="text-xs font-bold text-[#A82F19] hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">
            <Package className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
            <p className="font-bold text-neutral-700">No active print orders yet</p>
            <p className="mt-1">Submit a quote request to begin your custom print run.</p>
            <Button to="/get-a-quote" variant="accent" size="sm" icon={false} className="mt-4">
              Get a Quote Now
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id || order.id || order.orderNumber} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-neutral-900 text-sm">{order.productName}</div>
                  <div className="text-neutral-500 mt-0.5">
                    Order #{order.orderNumber} • Qty: {order.quantity} units {order.specs ? `• ${order.specs}` : ''}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-neutral-900">AED {Number(order.totalPrice || 0).toLocaleString()}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold border ${
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
