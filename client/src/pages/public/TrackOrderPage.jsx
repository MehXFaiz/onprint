import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  FileCheck,
  AlertCircle,
  Phone,
  MessageSquare,
  ArrowRight,
  Printer,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import SEOHead from '../../components/SEOHead'
import Breadcrumbs from '../../components/Breadcrumbs'
import { useAuth } from '../../context/AuthContext'
import { trackOrder, getRecentTrackedOrders, getStoredOrders } from '../../services/orders'

export default function TrackOrderPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('order') || searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [order, setOrder] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [recentOrders, setRecentOrders] = useState([])
  const [copied, setCopied] = useState(false)

  // Load recent tracked orders on mount and when user state changes
  useEffect(() => {
    const recent = getRecentTrackedOrders(user)
    setRecentOrders(recent)

    if (initialQuery) {
      handleSearch(initialQuery)
    }
  }, [user])

  const handleSearch = async (searchTerm) => {
    const term = (searchTerm !== undefined ? searchTerm : query).trim()
    if (!term) return

    setLoading(true)
    setNotFound(false)
    setSearched(true)

    // Update URL param
    setSearchParams({ order: term }, { replace: true })

    try {
      const result = await trackOrder(term, user)
      if (result) {
        setOrder(result)
        setNotFound(false)
        setRecentOrders(getRecentTrackedOrders(user))
      } else {
        setOrder(null)
        setNotFound(true)
      }
    } catch (err) {
      console.error('Error tracking order:', err)
      setOrder(null)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleQuickLookup = (orderNum) => {
    setQuery(orderNum)
    handleSearch(orderNum)
  }

  const handleCopyOrderNumber = () => {
    if (!order?.orderNumber) return
    navigator.clipboard.writeText(order.orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Determine active stage based on order status
  const getTimelineSteps = (status = 'Pending') => {
    const s = (status || '').toLowerCase()

    const isPending = s === 'pending'
    const isApproved = s === 'approved' || s === 'in review'
    const isProduction = s === 'in production' || s === 'printing'
    const isDispatched = s === 'dispatched' || s === 'out for delivery' || s === 'shipped'
    const isDelivered = s === 'delivered' || s === 'completed'

    return [
      {
        id: 1,
        title: 'Order Placed',
        subtitle: 'Job specs & files received',
        icon: FileCheck,
        done: true,
        current: isPending,
      },
      {
        id: 2,
        title: 'Pre-Press & Proofing',
        subtitle: 'Color, bleed & resolution check',
        icon: Layers,
        done: isApproved || isProduction || isDispatched || isDelivered,
        current: isApproved,
      },
      {
        id: 3,
        title: 'In Production',
        subtitle: 'High-speed printing & finishing',
        icon: Printer,
        done: isProduction || isDispatched || isDelivered,
        current: isProduction,
      },
      {
        id: 4,
        title: 'Dispatched',
        subtitle: 'En route with Dubai courier',
        icon: Truck,
        done: isDispatched || isDelivered,
        current: isDispatched,
      },
      {
        id: 5,
        title: 'Delivered',
        subtitle: 'Completed & delivered',
        icon: CheckCircle2,
        done: isDelivered,
        current: isDelivered,
      },
    ]
  }

  const steps = order ? getTimelineSteps(order.status) : []

  return (
    <div className="py-12 sm:py-16 bg-slate-50/50 min-h-[75vh]">
      <SEOHead
        title="Track Your Order | Real-Time Print Production Status | ONPRINT Dubai"
        description="Track the real-time production, proofing, printing, and delivery status of your ONPRINT Dubai orders using your Order Number."
        keywords="track order dubai, print order tracking uae, onprint order status"
        canonicalPath="/track-order"
        breadcrumbs={[{ name: 'Track Order', url: '/track-order' }]}
      />

      <Container className="max-w-5xl">
        <Breadcrumbs items={[{ name: 'Track Order' }]} />

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <Sparkles className="w-3.5 h-3.5" /> Real-Time Production Tracker
          </span>
          <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Track Your Print Order
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter your <strong className="text-slate-900">Order Number</strong> (e.g. <code>ONP-2026-XXXXXX</code>), email, or phone number to see real-time pre-press, printing, and courier delivery progress.
          </p>
        </div>

        {/* Search Box Card */}
        <div className="mt-8 mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order # (e.g. ONP-2026-584109) or email"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#A82F19] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A82F19]/20 transition-all font-mono"
                required
              />
            </div>
            <Button
              type="submit"
              variant="accent"
              icon={false}
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto shrink-0 !py-3 !px-7 font-bold shadow-sm shadow-[#A82F19]/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Searching...
                </span>
              ) : (
                'Track Order'
              )}
            </Button>
          </form>

          {/* Quick lookup pills */}
          {recentOrders.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">Recent Orders:</span>
              {recentOrders.map((rec) => (
                <button
                  key={rec.orderNumber}
                  type="button"
                  onClick={() => handleQuickLookup(rec.orderNumber)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono font-bold text-slate-700 hover:border-[#A82F19] hover:bg-red-50 hover:text-[#A82F19] transition-all cursor-pointer"
                >
                  {rec.orderNumber}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-12 text-center py-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-[#A82F19] animate-bounce">
              <Printer className="h-6 w-6" />
            </div>
            <p className="mt-4 font-bold text-slate-800">Checking ONPRINT Production Database...</p>
            <p className="text-xs text-slate-500 mt-1">Retrieving job tickets, proofs, and dispatch records.</p>
          </div>
        )}

        {/* Not Found State */}
        {!loading && notFound && (
          <div className="mt-8 mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/60 p-8 text-center shadow-xs">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 mb-3">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900">No Matching Order Found</h3>
            <p className="mt-2 text-xs text-slate-600 max-w-md mx-auto">
              We couldn't locate an order matching &quot;<strong className="text-slate-900">{query}</strong>&quot;.
              Please verify your order number in your confirmation email (format: <code className="font-bold">ONP-2026-XXXXXX</code>) or search with the email address used during checkout.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://wa.me/971480077468?text=Hello%20ONPRINT%20Team%2C%20I%20need%20help%20tracking%20my%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageSquare className="h-4 w-4" /> WhatsApp Support
              </a>
              <Button to="/get-a-quote" variant="outline" size="sm" icon={false}>
                Request New Quote
              </Button>
            </div>
          </div>
        )}

        {/* Active Order Details & Visual Timeline */}
        {!loading && order && (
          <div className="mt-10 space-y-6">
            {/* Top Order Card Header */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Reference</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold border ${
                        order.status === 'Pending'
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : order.status === 'In Production'
                            ? 'bg-purple-50 border-purple-200 text-purple-700'
                            : order.status === 'Dispatched'
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}
                    >
                      {order.status || 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="font-mono text-2xl sm:text-3xl font-black text-slate-900">
                      {order.orderNumber}
                    </h2>
                    <button
                      type="button"
                      onClick={handleCopyOrderNumber}
                      title="Copy Order Number"
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Placed on{' '}
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/971480077468?text=Hello%20ONPRINT%2C%20inquiring%20about%20Order%20${order.orderNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" /> WhatsApp Query
                  </a>
                  <a
                    href="tel:+9714800PRINT"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Phone className="h-4 w-4 text-[#A82F19]" /> Call Us
                  </a>
                </div>
              </div>

              {/* Progress Timeline Stepper */}
              <div className="pt-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                  Live Production Timeline
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                  {steps.map((s, idx) => {
                    const Icon = s.icon
                    return (
                      <div key={s.title} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-bold transition-all shadow-xs ${
                            s.done
                              ? 'bg-[#A82F19] text-white ring-4 ring-red-50'
                              : s.current
                                ? 'bg-red-500 text-white ring-4 ring-red-100 animate-pulse'
                                : 'border border-slate-200 bg-slate-100 text-slate-400'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold ${s.done || s.current ? 'text-slate-900' : 'text-slate-400'}`}>
                            {s.title}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            {s.subtitle}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Order Details & Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Specifications & Artwork */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="font-display text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Project Specifications
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-500">Product / Item:</span>
                      <span className="font-extrabold text-slate-900 text-right">{order.productName || 'Custom Print Job'}</span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-500">Order Quantity:</span>
                      <span className="font-bold text-slate-900">{order.quantity || 1} units</span>
                    </div>

                    {order.specs && (
                      <div className="pt-2">
                        <span className="font-bold text-slate-500 block mb-1">Configuration &amp; Finishes:</span>
                        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-slate-700 leading-relaxed font-mono text-[11px]">
                          {order.specs}
                        </div>
                      </div>
                    )}

                    {order.notes && (
                      <div className="pt-2">
                        <span className="font-bold text-slate-500 block mb-1">Customer Special Instructions:</span>
                        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-slate-700 italic">
                          &quot;{order.notes}&quot;
                        </div>
                      </div>
                    )}

                    {order.artworkFile && (
                      <div className="pt-2">
                        <span className="font-bold text-slate-500 block mb-1">Attached Artwork / Design File:</span>
                        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50/50 p-3 text-xs font-bold text-[#A82F19]">
                          <span>📎</span>
                          <span>{order.artworkFile}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Financials & Customer Info */}
              <div className="space-y-6">
                {/* Financial Summary */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                  <h3 className="font-display text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Order Summary
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Quantity</span>
                      <span>{order.quantity || 1} units</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Currency</span>
                      <span>{order.currency || 'AED'}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-slate-900 border-t border-slate-100 pt-2">
                      <span>Total Amount</span>
                      <span className="text-[#A82F19]">
                        {order.totalPrice ? `AED ${Number(order.totalPrice).toLocaleString()}` : 'Pricing on Request'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 pt-1">
                      <span>Payment Status</span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                  <h3 className="font-display text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Client &amp; Delivery Details
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Name</span>
                      <span className="font-bold text-slate-800">{order.customerName || order.name || 'Valued Client'}</span>
                    </div>
                    {order.company && (
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Company</span>
                        <span className="font-semibold text-slate-700">{order.company}</span>
                      </div>
                    )}
                    {order.customerEmail && (
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Email</span>
                        <span className="text-slate-700 font-mono">{order.customerEmail || order.email}</span>
                      </div>
                    )}
                    {order.customerPhone && (
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Phone</span>
                        <span className="text-slate-700 font-mono">{order.customerPhone || order.phone}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Location</span>
                      <span className="text-slate-700">Dubai &amp; UAE Courier Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Initial Empty State / Turnaround Information */}
        {!loading && !searched && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-red-50 text-[#A82F19] flex items-center justify-center mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Fast Turnaround Times</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Standard digital print orders are dispatched in <strong>2–3 business days</strong>. Express same-day production is available upon request.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-red-50 text-[#A82F19] flex items-center justify-center mb-4">
                <FileCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Free Pre-Press Proofing</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Our pre-press department inspects every artwork file for bleed margins, resolution (300 DPI), and CMYK color accuracy before printing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-red-50 text-[#A82F19] flex items-center justify-center mb-4">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">UAE-Wide Express Delivery</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Securely packaged in heavy-duty cartons and dispatched directly to your office or doorstep across Dubai, Abu Dhabi, and the UAE.
              </p>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
