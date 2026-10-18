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
  MessageSquare,
  ArrowRight,
  Printer,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Mail,
  FileText,
  ExternalLink,
  Download,
  CheckSquare,
  ShieldCheck,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import SEOHead from '../../components/SEOHead'
import Breadcrumbs from '../../components/Breadcrumbs'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import { useAuth } from '../../context/AuthContext'
import { trackOrder, getRecentTrackedOrders, getStoredOrders } from '../../services/orders'

export default function TrackOrderPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('order') || searchParams.get('q') || searchParams.get('ref') || ''

  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [order, setOrder] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [recentOrders, setRecentOrders] = useState([])
  const [copied, setCopied] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)

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

  // 9 Production Stages from Order Received to Delivered
  const getTimelineSteps = (status = 'Pending') => {
    const s = (status || '').toLowerCase()

    let activeStageIdx = 1
    if (s.includes('artwork received') || s.includes('prepress') || s.includes('review')) {
      activeStageIdx = 2
    } else if (s.includes('proof ready') || s.includes('proof sent')) {
      activeStageIdx = 3
    } else if (s.includes('approved') || s.includes('scheduled')) {
      activeStageIdx = 4
    } else if (s.includes('production') || s.includes('printing') || s.includes('press')) {
      activeStageIdx = 5
    } else if (s.includes('finishing') || s.includes('quality') || s.includes('cutting')) {
      activeStageIdx = 6
    } else if (s.includes('dispatched') || s.includes('shipped')) {
      activeStageIdx = 7
    } else if (s.includes('out for delivery') || s.includes('in transit')) {
      activeStageIdx = 8
    } else if (s.includes('delivered') || s.includes('completed')) {
      activeStageIdx = 9
    }

    const stages = [
      { id: 1, title: 'Order Received', subtitle: 'Job ticket registered', icon: FileCheck },
      { id: 2, title: 'Artwork Received', subtitle: 'Bleed & 300 DPI pre-flight', icon: Layers },
      { id: 3, title: 'Digital Proof Ready', subtitle: 'PDF proof issued', icon: CheckSquare },
      { id: 4, title: 'Artwork Approved', subtitle: 'Plates exposed & scheduled', icon: CheckCircle2 },
      { id: 5, title: 'In Production', subtitle: 'Running on press in Al Quoz', icon: Printer },
      { id: 6, title: 'Quality & Finishing', subtitle: 'Tactile foil, UV & trim', icon: Sparkles },
      { id: 7, title: 'Dispatched', subtitle: 'Handed to courier partner', icon: Package },
      { id: 8, title: 'Out for Delivery', subtitle: 'Courier in transit to door', icon: Truck },
      { id: 9, title: 'Delivered', subtitle: 'Signed & completed', icon: CheckCircle2 },
    ]

    return stages.map((st) => ({
      ...st,
      done: st.id < activeStageIdx,
      current: st.id === activeStageIdx,
    }))
  }

  const steps = order ? getTimelineSteps(order.status) : []

  // VAT calculations for receipt
  const subtotal = order ? Number(order.subtotal || (order.totalPrice ? order.totalPrice / 1.05 : 0)) : 0
  const vatAmount = order ? Number(order.tax || (order.totalPrice ? order.totalPrice - subtotal : 0)) : 0
  const totalAmount = order ? Number(order.totalPrice || subtotal + vatAmount) : 0

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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#162542] border border-[#D4AF65]/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF65]" /> Real-Time Production Tracker
          </span>
          <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Track Your Print Order &amp; Quotation
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Enter your <strong className="text-white font-bold">Reference Number</strong> (e.g. <code className="text-[#D4AF65] bg-[#162542] px-1.5 py-0.5 rounded">ONP-2026-XXXXXX</code> or <code className="text-[#D4AF65] bg-[#162542] px-1.5 py-0.5 rounded">ONP-Q-XXXXXX</code>), email, or phone number to see real-time pre-press, printing, and courier delivery progress.
          </p>
        </div>

        {/* Search Box Card */}
        <div className="mt-8 mx-auto max-w-2xl rounded-2xl border border-[#28395A] bg-[#162542] p-4 sm:p-6 shadow-sm">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Reference # (e.g. ONP-2026-584109 / ONP-Q-123456) or email"
                className="w-full rounded-xl border border-[#28395A] bg-[#101D35] py-3 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-400 focus:border-[#D4AF65] focus:outline-none focus:ring-2 focus:ring-[#D4AF65]/20 transition-all font-mono"
                required
              />
            </div>
            <Button
              type="submit"
              variant="accent"
              icon={false}
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto shrink-0 !py-3 !px-7 font-bold shadow-sm shadow-[#D4AF65]/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Searching...
                </span>
              ) : (
                'Track Status'
              )}
            </Button>
          </form>

          {/* Quick lookup pills */}
          {recentOrders.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#28395A] flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400">Recent Orders:</span>
              {recentOrders.map((rec) => (
                <button
                  key={rec.orderNumber}
                  type="button"
                  onClick={() => handleQuickLookup(rec.orderNumber)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono font-bold text-slate-700 hover:border-[#D4AF65] hover:bg-amber-50 hover:text-[#101D35] transition-all cursor-pointer"
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
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-[#D4AF65] animate-bounce">
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
            <h3 className="font-display text-lg font-bold text-slate-900">No Matching Order or Quote Found</h3>
            <p className="mt-2 text-xs text-slate-600 max-w-md mx-auto">
              We couldn&apos;t locate a job matching &quot;<strong className="text-slate-900">{query}</strong>&quot;.
              Please verify your reference number in your confirmation email (format: <code className="font-bold">ONP-2026-XXXXXX</code> or <code className="font-bold">ONP-Q-XXXXXX</code>) or search with the email address used during checkout.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:0nprint183@gmail.com"
                className="inline-flex w-full sm:w-auto justify-center text-center break-words items-center gap-2 rounded-xl bg-[#101D35] px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Mail className="h-4 w-4 shrink-0" /> Email Support (0nprint183@gmail.com)
              </a>
              <Button to="/get-a-quote" variant="outline" size="sm" icon={false} className="w-full sm:w-auto justify-center text-center break-words">
                Request New Quote
              </Button>
            </div>
          </div>
        )}

        {/* Active Order Details & Visual Timeline */}
        {!loading && order && (
          <div className="mt-10 space-y-6">
            {/* Top Order Card Header */}
            <div className="rounded-2xl border border-[#28395A] bg-[#162542] p-6 sm:p-8 shadow-sm text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#28395A] pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {order.isQuote ? 'Quote Reference' : order.isCorporate ? 'Corporate Procurement RFQ' : 'Order Reference'}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold border ${
                        order.status === 'Pending' || order.status === 'New'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : order.status === 'In Production' || order.status === 'Printing'
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                            : order.status === 'Dispatched' || order.status === 'Out for Delivery'
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {order.status || 'Pending'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <h2 className="break-all font-mono text-2xl sm:text-3xl font-black text-white">
                      {order.orderNumber || order.quoteNumber}
                    </h2>
                    <button
                      type="button"
                      onClick={handleCopyOrderNumber}
                      title="Copy Reference Number"
                      className="p-1.5 rounded-md hover:bg-[#101D35] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Placed on{' '}
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#28395A] bg-[#101D35] px-3.5 py-2 text-xs font-bold text-slate-200 hover:border-[#D4AF65] transition-colors cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-[#D4AF65]" /> View Tax Invoice
                  </button>

                  <a
                    href={`https://wa.me/447344546056?text=${encodeURIComponent(`Hello ONPRINT, I am tracking my reference ${order.orderNumber || order.quoteNumber} (Status: ${order.status || 'In Progress'}). Please share live production update.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2 text-xs font-bold transition-all shadow-xs"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white" /> WhatsApp Inquiry
                  </a>
                </div>
              </div>

              {/* 9-Stage Progress Timeline Stepper */}
              <div className="pt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    9-Stage Commercial Production Workflow
                  </h3>
                  <span className="text-xs font-bold text-[#D4AF65] bg-[#D4AF65]/10 px-2.5 py-0.5 rounded-full border border-[#D4AF65]/30">
                    ISO 12647-2 Pressroom Standards
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 relative">
                  {steps.map((s) => {
                    const Icon = s.icon
                    return (
                      <div key={s.id} className="flex flex-col items-center text-center p-2 rounded-xl bg-[#101D35] border border-[#28395A]">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all shadow-xs ${
                            s.done
                              ? 'bg-[#162542] text-[#D4AF65] ring-1 ring-[#D4AF65]/40'
                              : s.current
                                ? 'bg-[#D4AF65] text-[#101D35] ring-4 ring-[#D4AF65]/20 animate-pulse font-black'
                                : 'border border-[#28395A] bg-[#162542] text-slate-500'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className={`text-[11px] font-bold mt-2 leading-tight ${s.done ? 'text-white' : s.current ? 'text-[#D4AF65] font-black' : 'text-slate-400'}`}>
                          {s.title}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5 hidden sm:block">
                          {s.subtitle}
                        </p>
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
                <div className="rounded-2xl border border-[#28395A] bg-[#162542] p-6 shadow-sm space-y-4 text-white">
                  <h3 className="font-display text-base font-bold text-white border-b border-[#28395A] pb-3">
                    Project Specifications &amp; Artworking
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-bold text-slate-400">Product / Item:</span>
                      <span className="break-words font-extrabold text-white text-right">{order.productName || 'Custom Print Job'}</span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <span className="font-bold text-slate-400">Order Quantity:</span>
                      <span className="font-bold text-white text-right">{order.quantity || 1} units</span>
                    </div>

                    {order.specs && (
                      <div className="pt-2">
                        <span className="font-bold text-slate-400 block mb-1">Configuration &amp; Finishes:</span>
                        <div className="break-words rounded-xl border border-[#28395A] bg-[#101D35] p-3 text-slate-200 leading-relaxed font-mono text-[11px]">
                          {order.specs}
                        </div>
                      </div>
                    )}

                    {order.notes && (
                      <div className="pt-2">
                        <span className="font-bold text-slate-400 block mb-1">Customer Special Instructions:</span>
                        <div className="break-words rounded-xl border border-[#28395A] bg-[#101D35] p-3 text-slate-300 italic">
                          &quot;{order.notes}&quot;
                        </div>
                      </div>
                    )}

                    {order.artworkFile && (
                      <div className="pt-2">
                        <span className="font-bold text-slate-400 block mb-1">Attached Artwork / Design File:</span>
                        <div className="flex items-center justify-between gap-2 rounded-xl border border-[#28395A] bg-[#101D35] p-3 text-xs font-bold text-white">
                          <span className="min-w-0 break-all text-slate-200">📎 {order.artworkFile}</span>
                          <span className="text-[10px] uppercase font-bold text-[#D4AF65] bg-[#162542] px-2 py-0.5 rounded border border-[#28395A] shrink-0">
                            Pre-Flight Passed
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Financials & Customer Info */}
              <div className="space-y-6">
                {/* Financial Summary */}
                <div className="rounded-2xl border border-[#28395A] bg-[#162542] p-6 shadow-sm space-y-3 text-white">
                  <h3 className="font-display text-base font-bold text-white border-b border-[#28395A] pb-3">
                    Invoice &amp; VAT Breakdown
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal (Excl. VAT)</span>
                      <span>AED {subtotal > 0 ? subtotal.toFixed(2) : (totalAmount > 0 ? (totalAmount / 1.05).toFixed(2) : 'Quoted')}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>5% UAE VAT</span>
                      <span>AED {vatAmount > 0 ? vatAmount.toFixed(2) : (totalAmount > 0 ? (totalAmount - totalAmount / 1.05).toFixed(2) : 'Quoted')}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-white border-t border-[#28395A] pt-2">
                      <span>Total (Incl. VAT)</span>
                      <span className="text-[#D4AF65]">
                        {totalAmount > 0 ? `AED ${totalAmount.toFixed(2)}` : 'Pricing on Request'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300 pt-1">
                      <span>Payment Status</span>
                      <span className="rounded-md bg-[#101D35] border border-[#28395A] px-2 py-0.5 text-[10px] font-bold uppercase text-slate-200">
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="rounded-2xl border border-[#28395A] bg-[#162542] p-6 shadow-sm space-y-3 text-white">
                  <h3 className="font-display text-base font-bold text-white border-b border-[#28395A] pb-3">
                    Client &amp; Delivery Details
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Client Name</span>
                      <span className="font-bold text-white">{order.customerName || order.name || 'Valued Client'}</span>
                    </div>
                    {order.company && (
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Company</span>
                        <span className="font-semibold text-slate-200">{order.company}</span>
                      </div>
                    )}
                    {order.customerEmail && (
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Email</span>
                        <span className="break-all text-slate-200 font-mono">{order.customerEmail || order.email}</span>
                      </div>
                    )}
                    {order.customerPhone && (
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Phone</span>
                        <span className="text-slate-200 font-mono">{order.customerPhone || order.phone}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Delivery Destination</span>
                      <span className="text-slate-200">{order.deliveryLocation || 'Dubai & UAE Courier Delivery'}</span>
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
            <div className="rounded-2xl border border-[#28395A] bg-[#162542] p-6 shadow-xs text-white">
              <div className="h-10 w-10 rounded-xl bg-[#101D35] border border-[#28395A] text-[#D4AF65] flex items-center justify-center mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Fast Turnaround Times</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Standard digital print orders are dispatched in <strong className="text-white">24–48 hours</strong>. Express same-day production is available upon request.
              </p>
            </div>

            <div className="rounded-2xl border border-[#28395A] bg-[#162542] p-6 shadow-xs text-white">
              <div className="h-10 w-10 rounded-xl bg-[#101D35] border border-[#28395A] text-[#D4AF65] flex items-center justify-center mb-4">
                <FileCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Free Pre-Press Proofing</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Our pre-press department inspects every artwork file for bleed margins, resolution (300 DPI), and CMYK color accuracy before printing.
              </p>
            </div>

            <div className="rounded-2xl border border-[#28395A] bg-[#162542] p-6 shadow-xs text-white">
              <div className="h-10 w-10 rounded-xl bg-[#101D35] border border-[#28395A] text-[#D4AF65] flex items-center justify-center mb-4">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-sm">UAE-Wide Express Delivery</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Securely packaged in heavy-duty cartons and dispatched directly to your office or doorstep across Dubai, Abu Dhabi, and all 7 Emirates.
              </p>
            </div>
          </div>
        )}

        {/* Official Printable Tax Invoice Modal */}
        {showInvoiceModal && order && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              {/* Invoice Printable Document */}
              <div id="printable-tax-invoice" className="space-y-6">
                <div className="flex items-start justify-between border-b border-slate-200 pb-6">
                  <div>
                    <h2 className="text-2xl font-black tracking-wider text-[#101D35]">
                      ON<span className="text-[#D4AF65]">PRINT</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Commercial Printing &amp; Custom Branding LLC<br />
                      Al Quoz Industrial Area 3, Dubai, UAE<br />
                      TRN: <strong>100482910400003</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-[#101D35] text-[#D4AF65] text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                      Tax Invoice / Receipt
                    </span>
                    <p className="text-xs font-mono font-bold text-slate-900 mt-2">
                      Ref: {order.orderNumber || order.quoteNumber}
                    </p>
                    <p className="text-xs text-slate-500">
                      Date: {new Date().toLocaleDateString('en-AE')}
                    </p>
                  </div>
                </div>

                {/* Client info */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 font-bold uppercase">Billed To:</p>
                    <p className="font-bold text-slate-900 mt-1">{order.customerName || order.name || 'Client'}</p>
                    {order.company && <p className="text-slate-600">{order.company}</p>}
                    {order.customerEmail && <p className="text-slate-600">{order.customerEmail || order.email}</p>}
                    {order.customerPhone && <p className="text-slate-600">{order.customerPhone || order.phone}</p>}
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase">Delivery Location:</p>
                    <p className="text-slate-700 mt-1">{order.deliveryLocation || 'Dubai & UAE Courier Delivery'}</p>
                    <p className="text-slate-400 font-bold uppercase mt-2">Status:</p>
                    <p className="font-bold text-emerald-700">{order.status || 'Active'}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 font-bold">Description</th>
                        <th className="py-2.5 px-3 font-bold text-center">Qty</th>
                        <th className="py-2.5 px-3 font-bold text-right">Unit Price</th>
                        <th className="py-2.5 px-3 font-bold text-right">Total (AED)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-900">{order.productName || 'Commercial Printing Job'}</p>
                          {order.specs && <p className="text-[11px] text-slate-500 mt-0.5">{order.specs}</p>}
                        </td>
                        <td className="py-3 px-3 text-center">{order.quantity || 1}</td>
                        <td className="py-3 px-3 text-right">
                          AED {totalAmount > 0 ? (totalAmount / (order.quantity || 1) / 1.05).toFixed(2) : '0.00'}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          AED {subtotal > 0 ? subtotal.toFixed(2) : (totalAmount / 1.05).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end text-xs">
                  <div className="w-64 space-y-2 border-t border-slate-100 pt-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal (Excl. VAT):</span>
                      <span>AED {subtotal > 0 ? subtotal.toFixed(2) : (totalAmount / 1.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>5% UAE VAT (FTA):</span>
                      <span>AED {vatAmount > 0 ? vatAmount.toFixed(2) : (totalAmount - totalAmount / 1.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-[#101D35] border-t border-slate-200 pt-2">
                      <span>Total Amount:</span>
                      <span className="text-[#D4AF65]">AED {totalAmount > 0 ? totalAmount.toFixed(2) : 'Quoted'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-4">
                  <p>
                    This is an electronically generated tax invoice from ONPRINT Commercial Pressroom. All printing services are executed under ISO 12647-2 color fidelity standards.
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <Button variant="outline" size="sm" onClick={() => setShowInvoiceModal(false)}>
                  Close
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => window.print()}
                  className="font-bold gap-2"
                >
                  <Printer className="h-4 w-4" /> Print Tax Invoice
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
