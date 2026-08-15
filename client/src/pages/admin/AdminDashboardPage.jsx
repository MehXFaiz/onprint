import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, TrendingUp, FileText, Plus, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react'
import Button from '../../components/Button'
import { getStoredProducts } from '../../services/products'
import { getStoredOrders } from '../../services/orders'

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    setProducts(getStoredProducts())
    setOrders(getStoredOrders())
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length
  const inProductionOrders = orders.filter((o) => o.status === 'In Production').length

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-neutral-200 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
              <ShieldCheck className="h-4 w-4" />
              <span>Studio Management System</span>
            </div>
            <h1 className="font-display mt-2 text-2xl sm:text-3xl font-black text-white">
              Welcome to ONPRINT Admin
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-300">
              Overview of product uploads, active press production, and client dispatches in Dubai.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              to="/admin/products"
              variant="accent"
              icon={false}
              className="shadow-md shadow-[#A82F19]/40"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Upload Product
            </Button>

            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Manage Orders
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Products */}
        <Link
          to="/admin/products"
          className="group rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition-all hover:border-[#A82F19]/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Products Catalog</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-[#A82F19]">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-neutral-900">{products.length}</div>
          <div className="mt-1 flex items-center text-xs font-bold text-[#A82F19]">
            <span>Manage & Upload</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card 2: Active Orders */}
        <Link
          to="/admin/orders"
          className="group rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition-all hover:border-[#A82F19]/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-neutral-900">{orders.length}</div>
          <div className="mt-1 text-xs font-semibold text-neutral-500">
            <span className="font-bold text-amber-600">{pendingOrders} Pending</span> • <span className="font-bold text-purple-600">{inProductionOrders} In Press</span>
          </div>
        </Link>

        {/* Card 3: Revenue */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Order Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-neutral-900">
            AED {totalRevenue.toLocaleString()}
          </div>
          <div className="mt-1 text-xs font-semibold text-emerald-600">
            Verified Completed & Active Runs
          </div>
        </div>

        {/* Card 4: Quotes */}
        <Link
          to="/admin/quotes"
          className="group rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition-all hover:border-[#A82F19]/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Pending Quotes</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-neutral-900">4</div>
          <div className="mt-1 flex items-center text-xs font-bold text-purple-600">
            <span>Review Requests</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Action 1: Upload Product */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
              <Package className="h-4 w-4" />
              <span>Catalog Upload</span>
            </div>
            <h3 className="font-display text-xl font-bold text-neutral-900 mt-1">
              Add New Product to Shop
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-600">
              Upload product photos, set minimum unit order quantities, specify finish options (foil debossing, spot UV, laminates), and define prices.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <Button to="/admin/products" variant="accent" icon={false} className="w-full justify-center">
              Go to Product Uploader
            </Button>
          </div>
        </div>

        {/* Quick Action 2: Manage Orders */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <ShoppingBag className="h-4 w-4" />
              <span>Production Pipeline</span>
            </div>
            <h3 className="font-display text-xl font-bold text-neutral-900 mt-1">
              Manage Client Orders & Status
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-600">
              Update print statuses from Pending to In Production or Dispatched. Review client vector artwork files and custom print specifications.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <Link
              to="/admin/orders"
              className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-[#A82F19] transition-colors"
            >
              Open Order Manager
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Overview Widget */}
      <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-neutral-900">Recent Press Orders</h3>
            <p className="text-xs text-neutral-500">Live order queue and current status</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#A82F19] hover:underline flex items-center gap-1"
          >
            View All Orders <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-neutral-100">
          {orders.slice(0, 4).map((order) => (
            <div key={order._id} className="py-3.5 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-neutral-900">{order.productName}</div>
                <div className="text-[11px] text-neutral-500">
                  {order.orderNumber} • {order.customerName} ({order.company || 'Client'})
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-neutral-900">AED {order.totalPrice.toLocaleString()}</span>
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-neutral-700">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
