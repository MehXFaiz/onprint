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
    if (!user) {
      setOrders([])
      setQuotes([])
      return
    }
    const userEmail = (user.email || '').toLowerCase().trim()
    const userPhone = user.phone ? String(user.phone).replace(/\D/g, '') : ''

    const allOrders = getStoredOrders()
    const myOrders = allOrders.filter((o) => {
      const oEmail = (o.customerEmail || o.email || '').toLowerCase().trim()
      const oPhone = (o.customerPhone || o.phone || '').replace(/\D/g, '')
      return (userEmail && oEmail === userEmail) || (userPhone && oPhone && oPhone === userPhone) || (user.id && o.userId === user.id)
    })

    const allQuotes = getStoredQuotes()
    const myQuotes = allQuotes.filter((q) => {
      const qEmail = (q.email || '').toLowerCase().trim()
      const qPhone = (q.phone || '').replace(/\D/g, '')
      return (userEmail && qEmail === userEmail) || (userPhone && qPhone && qPhone === userPhone) || (user.id && q.userId === user.id)
    })

    setOrders(myOrders)
    setQuotes(myQuotes)
  }, [user])

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="rounded-3xl border border-[#122240] bg-[#081226] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#D6C29A]">
              <ShieldCheck className="h-3.5 w-3.5" /> Client Portal
            </span>
            <h1 className="font-display mt-1 text-2xl sm:text-3xl font-black text-[#F5F3EE]">
              Welcome, {user?.name || 'Valued Client'}
            </h1>
            <p className="mt-1 text-xs text-[#F5F3EE]/70">
              {user?.company || 'Corporate Account'} • Track active print runs, quotes, and delivery proofs.
            </p>
          </div>

          <Button to="/get-a-quote" variant="accent" icon={false} className="shadow-md shadow-[#D6C29A]/20 self-start sm:self-auto">
            <Plus className="h-4 w-4 mr-1" />
            Request New Quote
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/account/orders" className="rounded-2xl border border-[#122240] bg-[#081226] p-5 shadow-xs hover:border-[#D6C29A]/40 transition-all">
          <div className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]/60">Active Orders</div>
          <div className="mt-2 text-3xl font-black text-[#F5F3EE]">{orders.length}</div>
        </Link>

        <Link to="/account/quotes" className="rounded-2xl border border-[#122240] bg-[#081226] p-5 shadow-xs hover:border-[#D6C29A]/40 transition-all">
          <div className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]/60">Quotes Requested</div>
          <div className="mt-2 text-3xl font-black text-[#F5F3EE]">{quotes.length}</div>
        </Link>

        <div className="rounded-2xl border border-[#122240] bg-[#081226] p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]/60">Proof Status</div>
          <div className="mt-2 text-3xl font-black text-[#D6C29A]">
            {orders.length > 0 ? (orders[0].status === 'Pending' ? 'Under Review' : 'Approved') : 'Ready'}
          </div>
        </div>
      </div>

      {/* Active Orders List */}
      <div className="rounded-3xl border border-[#122240] bg-[#081226] p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#122240] pb-4 mb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-[#F5F3EE]">My Print Orders</h3>
            <p className="text-xs text-[#F5F3EE]/60">Track production progress and dispatch details</p>
          </div>
          <Link to="/account/orders" className="text-xs font-bold text-[#D6C29A] hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#F5F3EE]/60">
            <Package className="h-8 w-8 text-[#52647D] mx-auto mb-2" />
            <p className="font-bold text-[#F5F3EE]">No active print orders yet</p>
            <p className="mt-1">Submit a quote request to begin your custom print run.</p>
            <Button to="/get-a-quote" variant="accent" size="sm" icon={false} className="mt-4">
              Get a Quote Now
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-[#122240]">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id || order.id || order.orderNumber} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-[#F5F3EE] text-sm">{order.productName}</div>
                  <div className="text-[#F5F3EE]/60 mt-0.5">
                    Order #{order.orderNumber} • Qty: {order.quantity} units {order.specs ? `• ${order.specs}` : ''}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-[#D6C29A]">AED {Number(order.totalPrice || 0).toLocaleString()}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold border ${
                      order.status === 'Pending'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : order.status === 'In Production'
                          ? 'bg-[#D6C29A]/10 border-[#D6C29A]/30 text-[#D6C29A]'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
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
