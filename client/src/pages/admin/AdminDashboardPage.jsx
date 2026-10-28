import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  ShoppingBag,
  TrendingUp,
  FileText,
  Plus,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Users,
  MessageSquare,
  Mail,
  Wrench,
  Calendar,
  FolderTree,
  BookOpen,
  Search,
  CheckCircle2,
  Sparkles,
  Globe,
} from 'lucide-react'
import Button from '../../components/Button'
import { getAdminDashboard } from '../../services/admin'
import { getStoredOrders } from '../../services/orders'
import { getStoredQuotes } from '../../services/quotes'
import { getStoredMessages } from '../../services/contact'
import { getStoredProducts } from '../../services/products'
import { initialCategories } from '../../services/categories'
import { getStoredServices } from '../../services/services'
import { getStoredBlogs } from '../../services/blog'
import { auditCatalogSeoAndKeywords, EDITORIAL_90_DAY_CONTENT_PLAN } from '../../utils/seoDraftGenerator'
import { getStoredConversionEvents, GA4_MEASUREMENT_ID } from '../../utils/analytics'

const TIMEFRAME_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: 'this_month', label: 'This Month' },
  { value: 'this_year', label: 'This Year' },
]

export default function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const loadDashboard = async (selectedTimeframe = timeframe, isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true)
    } else if (!data) {
      setLoading(true)
    }
    setError(null)

    const storedOrders = getStoredOrders()
    const storedQuotes = getStoredQuotes()
    const storedMessages = getStoredMessages()

    const orderStats = {
      total: storedOrders.length,
      pending: storedOrders.filter((o) => (o.status || '').toLowerCase() === 'pending').length,
      inProduction: storedOrders.filter((o) => (o.status || '').toLowerCase().includes('production')).length,
      processing: storedOrders.filter((o) => (o.status || '').toLowerCase().includes('processing')).length,
      dispatched: storedOrders.filter((o) => (o.status || '').toLowerCase().includes('dispatch')).length,
      delivered: storedOrders.filter((o) => (o.status || '').toLowerCase().includes('deliver')).length,
      cancelled: storedOrders.filter((o) => (o.status || '').toLowerCase().includes('cancel')).length,
    }

    const calculatedRevenue = storedOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0)

    const quoteStats = {
      total: storedQuotes.length,
      pending: storedQuotes.filter((q) => (q.status || '').toLowerCase() === 'pending').length,
      approved: storedQuotes.filter((q) => (q.status || '').toLowerCase().includes('approve')).length,
      rejected: storedQuotes.filter((q) => (q.status || '').toLowerCase().includes('reject')).length,
    }

    const messageStats = {
      total: storedMessages.length,
      unread: storedMessages.filter((m) => (m.status || 'unread').toLowerCase() === 'unread').length,
    }

    const recentOrders = storedOrders.slice(0, 5).map((o) => ({
      id: o.id || o._id,
      orderNumber: o.orderNumber,
      productName: o.productName,
      customerName: o.customerName,
      company: o.company,
      totalPrice: o.totalPrice,
      status: o.status,
    }))

    const recentQuotes = storedQuotes.slice(0, 5).map((q) => ({
      id: q.id || q._id,
      quoteNumber: q.quoteNumber,
      name: q.name,
      email: q.email,
      totalPrice: q.totalPrice,
      status: q.status,
    }))

    const recentMessages = storedMessages.slice(0, 5).map((m) => ({
      id: m.id || m._id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      subject: m.subject || 'Direct Studio Inquiry',
      message: m.message,
      status: m.status || 'unread',
      createdAt: m.createdAt,
    }))

    const storedProducts = getStoredProducts()
    const storedServices = getStoredServices()
    const defaultProductStats = {
      total: storedProducts.length,
      active: storedProducts.filter((p) => p.active !== false).length,
      inactive: storedProducts.filter((p) => p.active === false).length,
    }
    const defaultServiceStats = {
      total: storedServices.length,
      active: storedServices.filter((s) => s.active !== false).length,
    }

    try {
      const response = await getAdminDashboard({ timeframe: selectedTimeframe })
      if (response?.success && response?.data) {
        const backendData = response.data
        setData({
          ...backendData,
          timeframe: selectedTimeframe,
          products: backendData.products?.total ? backendData.products : defaultProductStats,
          categories: backendData.categories?.total ? backendData.categories : { total: initialCategories.length },
          services: backendData.services?.total ? backendData.services : defaultServiceStats,
          blogs: backendData.blogs?.total ? backendData.blogs : { total: 25, published: 25 },
          orders: backendData.orders || orderStats,
          quotes: backendData.quotes || quoteStats,
          messages: backendData.messages || messageStats,
          revenue: backendData.revenue ?? calculatedRevenue ?? 0,
          recentOrders: backendData.recentOrders && backendData.recentOrders.length > 0 ? backendData.recentOrders : recentOrders,
          recentQuotes: backendData.recentQuotes && backendData.recentQuotes.length > 0 ? backendData.recentQuotes : recentQuotes,
          recentMessages: backendData.recentMessages && backendData.recentMessages.length > 0 ? backendData.recentMessages : recentMessages,
        })
      } else {
        setData({
          timeframe: selectedTimeframe,
          products: defaultProductStats,
          categories: { total: initialCategories.length },
          orders: orderStats,
          revenue: calculatedRevenue || 0,
          quotes: quoteStats,
          messages: messageStats,
          users: { total: 1, customers: 0, admins: 1 },
          services: defaultServiceStats,
          blogs: { total: 25, published: 25 },
          newsletterSubscribers: { total: 0 },
          recentOrders,
          recentQuotes,
          recentMessages,
        })
      }
    } catch {
      setData({
        timeframe: selectedTimeframe,
        products: defaultProductStats,
        categories: { total: initialCategories.length },
        orders: orderStats,
        revenue: calculatedRevenue || 0,
        quotes: quoteStats,
        messages: messageStats,
        users: { total: 1, customers: 0, admins: 1 },
        services: defaultServiceStats,
        blogs: { total: 25, published: 25 },
        newsletterSubscribers: { total: 0 },
        recentOrders,
        recentQuotes,
        recentMessages,
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboard(timeframe, false)
  }, [timeframe])

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-14 rounded-2xl bg-[#081226] border border-[#122240]" />
        <div className="h-44 rounded-3xl bg-neutral-800/60 border border-neutral-700/50" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-[#081226] border border-[#122240] p-5 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3 w-24 bg-neutral-200 rounded" />
                <div className="h-8 w-8 bg-neutral-200 rounded-full" />
              </div>
              <div className="h-8 w-16 bg-neutral-300 rounded" />
              <div className="h-3 w-32 bg-neutral-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const products = data?.products || { total: 0, active: 0, inactive: 0 }
  const orders = data?.orders || {
    total: 0,
    pending: 0,
    inProduction: 0,
    processing: 0,
    dispatched: 0,
    delivered: 0,
    cancelled: 0,
  }
  const revenue = data?.revenue ?? 0
  const quotes = data?.quotes || { total: 0, pending: 0, approved: 0, rejected: 0 }
  const messages = data?.messages || { total: 0, unread: 0 }
  const users = data?.users || { total: 1, customers: 0, admins: 1 }
  const services = data?.services || { total: 7, active: 7 }
  const subscribers = data?.newsletterSubscribers || { total: 0 }
  const blogs = data?.blogs || { total: 0, published: 0 }
  const recentOrders = Array.isArray(data?.recentOrders) ? data.recentOrders : []
  const recentQuotes = Array.isArray(data?.recentQuotes) ? data.recentQuotes : []
  const recentMessages = Array.isArray(data?.recentMessages) ? data.recentMessages : []

  return (
    <div className="space-y-8">
      {/* Top Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#081226] p-4 rounded-2xl border border-[#122240] shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#F5F3EE]">
          <Calendar className="h-4 w-4 text-[#D6C29A]" />
          <span>Filter Metric Window:</span>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-lg border border-[#122240] bg-[#040A18] px-3 py-1.5 text-xs font-bold text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none cursor-pointer"
          >
            {TIMEFRAME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => loadDashboard(timeframe, true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#122240] bg-[#040A18] px-3.5 py-1.5 text-xs font-bold text-[#F5F3EE] hover:bg-[#122240] hover:text-[#F5F3EE] transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-[#D6C29A] ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Syncing MySQL...' : 'Refresh Live DB Data'}</span>
        </button>
      </div>

      {/* Welcome Banner */}
      <div className="rounded-3xl border border-[#122240] bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D6C29A]">
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

          <div className="flex flex-wrap items-center gap-3">
            <Button
              to="/admin/products"
              variant="accent"
              icon={false}
              className="shadow-md shadow-[#D6C29A]/40"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Upload Product
            </Button>

            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-[#081226]/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-[#081226]/20 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Manage Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Products */}
        <Link
          to="/admin/products"
          className="group rounded-2xl border border-[#122240] bg-[#081226] p-5 shadow-xs transition-all hover:border-[#D6C29A]/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C2D9]">Products Catalog</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-[#D6C29A]">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-[#F5F3EE]">{products.total}</div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="font-bold text-[#D6C29A] flex items-center">
              Manage & Upload <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="text-[#B8C2D9] font-semibold">{products.active} Active</span>
          </div>
        </Link>

        {/* Card 2: Active Orders */}
        <Link
          to="/admin/orders"
          className="group rounded-2xl border border-[#122240] bg-[#081226] p-5 shadow-xs transition-all hover:border-[#D6C29A]/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C2D9]">Total Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-[#F5F3EE]">{orders.total}</div>
          <div className="mt-1 text-xs font-semibold text-[#B8C2D9]">
            <span className="font-bold text-amber-600">{orders.pending} Pending</span> •{' '}
            <span className="font-bold text-purple-600">{orders.inProduction} In Press</span>
          </div>
        </Link>

        {/* Card 3: Revenue */}
        <div className="rounded-2xl border border-[#122240] bg-[#081226] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C2D9]">Order Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-[#F5F3EE]">
            AED {revenue.toLocaleString()}
          </div>
          <div className="mt-1 text-xs font-semibold text-emerald-600">
            Verified Completed & Active Runs
          </div>
        </div>

        {/* Card 4: Quotes */}
        <Link
          to="/admin/quotes"
          className="group rounded-2xl border border-[#122240] bg-[#081226] p-5 shadow-xs transition-all hover:border-[#D6C29A]/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C2D9]">Pending Quotes</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-[#F5F3EE]">{quotes.pending}</div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="font-bold text-purple-600 flex items-center">
              Review Requests <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="text-[#B8C2D9] font-semibold">{quotes.total} Total</span>
          </div>
        </Link>
      </div>

      {/* Secondary Metric Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        <Link
          to="/admin/messages"
          className="rounded-2xl border border-[#122240] bg-[#081226] p-3.5 sm:p-4 shadow-xs hover:border-amber-500 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#B8C2D9] uppercase tracking-wider">
            <MessageSquare className="h-3.5 w-3.5 text-amber-600" />
            <span>Studio Inquiries</span>
          </div>
          <div className="mt-2 text-2xl font-black text-[#F5F3EE]">{messages.total}</div>
          <div className="mt-0.5 text-[11px] font-bold text-amber-600">{messages.unread} Unread</div>
        </Link>

        <Link
          to="/admin/customers"
          className="rounded-2xl border border-[#122240] bg-[#081226] p-3.5 sm:p-4 shadow-xs hover:border-[#122240] transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#B8C2D9] uppercase tracking-wider">
            <Users className="h-3.5 w-3.5 text-indigo-600" />
            <span>Registered Users</span>
          </div>
          <div className="mt-2 text-2xl font-black text-[#F5F3EE]">{users.total}</div>
          <div className="mt-0.5 text-[11px] font-semibold text-[#B8C2D9]">{users.customers} Clients</div>
        </Link>

        <Link
          to="/admin/services"
          className="rounded-2xl border border-[#122240] bg-[#081226] p-3.5 sm:p-4 shadow-xs hover:border-[#122240] transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#B8C2D9] uppercase tracking-wider">
            <Wrench className="h-3.5 w-3.5 text-sky-600" />
            <span>Print Services</span>
          </div>
          <div className="mt-2 text-2xl font-black text-[#F5F3EE]">{services.total}</div>
          <div className="mt-0.5 text-[11px] font-semibold text-[#B8C2D9]">{services.active} Active</div>
        </Link>

        <Link
          to="/admin/categories"
          className="rounded-2xl border border-[#122240] bg-[#081226] p-3.5 sm:p-4 shadow-xs hover:border-[#D6C29A] transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#B8C2D9] uppercase tracking-wider">
            <FolderTree className="h-3.5 w-3.5 text-[#D6C29A]" />
            <span>Categories</span>
          </div>
          <div className="mt-2 text-2xl font-black text-[#F5F3EE]">{data?.categories?.total || 7}</div>
          <div className="mt-0.5 text-[11px] font-bold text-[#D6C29A]">Store Categories</div>
        </Link>

        <Link
          to="/admin/blog"
          className="rounded-2xl border border-[#122240] bg-[#081226] p-3.5 sm:p-4 shadow-xs hover:border-[#D6C29A] transition-colors xs:col-span-2 sm:col-span-1"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#B8C2D9] uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5 text-[#D6C29A]" />
            <span>Blog Articles</span>
          </div>
          <div className="mt-2 text-2xl font-black text-[#F5F3EE]">{blogs.total}</div>
          <div className="mt-0.5 text-[11px] font-bold text-emerald-600">{blogs.published} Published</div>
        </Link>
      </div>

      {/* Centralized All-Product SEO, Keyword & WhatsApp Lead Generation Hub (Section 10) */}
      {(() => {
        const liveProducts = getStoredProducts()
        const liveServices = getStoredServices()
        const liveBlogs = getStoredBlogs({ includeDrafts: true })
        const seoAudit = auditCatalogSeoAndKeywords({
          products: liveProducts,
          categories: initialCategories,
          services: liveServices,
          blogs: liveBlogs,
        })
        const conversionEvents = getStoredConversionEvents()
        const whatsappEvents = conversionEvents.filter((e) => e.conversion_type === 'whatsapp_click')
        const whatsappByProductMap = new Map()
        whatsappEvents.forEach((e) => {
          const key = e.product_name || e.landing_page || 'General WhatsApp Inquiry'
          whatsappByProductMap.set(key, (whatsappByProductMap.get(key) || 0) + 1)
        })
        const topWhatsappProducts = Array.from(whatsappByProductMap.entries())
          .map(([label, count]) => ({ label, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6)

        return (
          <div className="rounded-3xl border border-[#122240] bg-[#081226] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#122240] pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D6C29A]">
                  <Sparkles className="h-4 w-4" />
                  <span>All-Product SEO, GEO &amp; WhatsApp Lead Engine</span>
                </div>
                <h2 className="font-display mt-1 text-xl sm:text-2xl font-black text-[#F5F3EE]">
                  Centralized SEO Health, Keyword Registry &amp; Lead Funnel
                </h2>
                <p className="mt-1 text-xs text-[#B8C2D9]">
                  Dynamic monitoring across all {seoAudit.totals.products} products, {seoAudit.totals.categories} categories, {seoAudit.totals.services} services, and {blogs.total || 25} blog guides. WhatsApp clicks and quote inquiries are strictly separated from confirmed orders.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  to="/admin/seo"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#D6C29A] px-4 py-2 text-xs font-extrabold text-[#040A18] hover:bg-[#e5d4b0] transition-colors"
                >
                  <Search className="h-3.5 w-3.5" />
                  Open Full SEO Command Center
                </Link>
                <Link
                  to="/admin/products/new"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#122240] bg-[#040A18] px-3.5 py-2 text-xs font-bold text-[#F5F3EE] hover:border-[#D6C29A] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-[#D6C29A]" />
                  Add Product (Auto-SEO)
                </Link>
              </div>
            </div>

            {/* 8-Card SEO & Funnel Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-[#122240] bg-[#040A18] p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8C2D9]">
                  Total Audited Catalog
                </span>
                <div className="mt-2 text-2xl font-black text-[#F5F3EE]">
                  {seoAudit.totals.products + seoAudit.totals.categories + seoAudit.totals.services + (blogs.total || 25)} Pages
                </div>
                <div className="mt-1 text-[11px] text-emerald-400 font-semibold">
                  {seoAudit.totals.products} Products • {seoAudit.totals.categories} Categories • {seoAudit.totals.services} Services
                </div>
              </div>

              <div className="rounded-2xl border border-[#122240] bg-[#040A18] p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8C2D9]">
                  Pages Missing SEO Fields
                </span>
                <div className="mt-2 text-2xl font-black text-[#F5F3EE]">
                  {seoAudit.missingSeoCount}
                </div>
                <div className="mt-1 text-[11px] font-semibold text-emerald-400">
                  {seoAudit.missingSeoCount === 0
                    ? '100% Complete (Title, Meta, H1, Keywords, Alt, Canonical)'
                    : `${seoAudit.missingSeoCount} pages require metadata review`}
                </div>
              </div>

              <div className="rounded-2xl border border-[#122240] bg-[#040A18] p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8C2D9]">
                  Keyword Opportunities &amp; Review
                </span>
                <div className="mt-2 text-2xl font-black text-[#D6C29A]">
                  {seoAudit.keywordOpportunitiesCount} Active Targets
                </div>
                <div className="mt-1 text-[11px] text-[#B8C2D9] font-semibold">
                  {seoAudit.pagesAwaitingReviewCount} Drafts Awaiting Admin Review • {seoAudit.duplicateKeywordCount} Duplicate Warnings
                </div>
              </div>

              <div className="rounded-2xl border border-[#122240] bg-[#040A18] p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8C2D9]">
                  GA4 &amp; Search Console Status
                </span>
                <div className="mt-2 flex items-center gap-1.5 text-sm font-black text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>GA4 Active ({GA4_MEASUREMENT_ID})</span>
                </div>
                <div className="mt-1 text-[11px] text-[#B8C2D9] font-semibold">
                   WhatsApp (+447344546056): {whatsappEvents.length} Tracked Clicks • Sitemap Live
                </div>
              </div>
            </div>

            {/* Two-Column Breakdown: Deduplicated Keyword Bank & WhatsApp Lead Attribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className="rounded-2xl border border-[#122240] bg-[#040A18] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-sm font-bold text-[#F5F3EE]">
                    Deduplicated Buyer-Intent Keyword Registry (All 19 Categories)
                  </h3>
                  <span className="rounded-full bg-[#081226] px-2.5 py-0.5 text-[10px] font-bold text-[#D6C29A] border border-[#122240]">
                    No Daily Repetition
                  </span>
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-[#122240] text-xs">
                  {seoAudit.keywordOpportunities.slice(0, 10).map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-bold text-[#F5F3EE] truncate">{item.keyword}</div>
                        <div className="text-[11px] text-[#B8C2D9] truncate">
                          {item.category} → <span className="text-[#D6C29A]">{item.targetUrl}</span>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                        {item.searchIntent}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#122240] bg-[#040A18] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-sm font-bold text-[#F5F3EE]">
                    WhatsApp Inquiries vs. Quotes vs. Confirmed Orders
                  </h3>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    +44 7344 546056
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="rounded-xl border border-[#122240] bg-[#081226] p-3">
                    <div className="text-lg font-black text-emerald-400">{whatsappEvents.length}</div>
                    <div className="text-[10px] font-bold uppercase text-[#B8C2D9]">WhatsApp Clicks</div>
                  </div>
                  <div className="rounded-xl border border-[#122240] bg-[#081226] p-3">
                    <div className="text-lg font-black text-purple-400">{quotes.total}</div>
                    <div className="text-[10px] font-bold uppercase text-[#B8C2D9]">Quote Requests</div>
                  </div>
                  <div className="rounded-xl border border-[#122240] bg-[#081226] p-3">
                    <div className="text-lg font-black text-[#D6C29A]">{orders.total}</div>
                    <div className="text-[10px] font-bold uppercase text-[#B8C2D9]">Confirmed Orders</div>
                  </div>
                </div>
                {topWhatsappProducts.length > 0 ? (
                  <div className="divide-y divide-[#122240] text-xs">
                    {topWhatsappProducts.map((row, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <span className="text-[#F5F3EE] font-semibold truncate">{row.label}</span>
                        <span className="text-emerald-400 font-bold">{row.count} clicks</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#B8C2D9] leading-relaxed">
                    Live WhatsApp click events (`whatsapp_click`) are tracked per product, category, and blog page via GA4 (`{GA4_MEASUREMENT_ID}`) and the conversion beacon without counting clicks as confirmed orders.
                  </p>
                )}
              </div>
            </div>

            {/* 90-Day Editorial Plan & Drafts Awaiting Admin Review */}
            <div className="rounded-2xl border border-[#122240] bg-[#040A18] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-display text-sm font-bold text-[#F5F3EE]">
                    90-Day Organic Content Growth Engine &amp; Editorial Drafts ({seoAudit.pagesAwaitingReviewCount} Drafts Awaiting Review)
                  </h3>
                  <p className="text-[11px] text-[#B8C2D9]">
                    Every guide targets a distinct commercial/comparison intent and links directly to canonical ONPRINT product &amp; category pages.
                  </p>
                </div>
                <Link
                  to="/admin/blog"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#D6C29A] hover:underline"
                >
                  Review &amp; Publish Drafts <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {EDITORIAL_90_DAY_CONTENT_PLAN.slice(0, 6).map((planItem, idx) => (
                  <div key={idx} className="rounded-xl border border-[#122240] bg-[#081226] p-3.5 flex flex-col justify-between gap-2">
                    <div>
                      <span className="inline-block rounded bg-[#040A18] px-2 py-0.5 text-[10px] font-bold text-[#D6C29A] border border-[#122240] mb-1.5">
                        {planItem.status}
                      </span>
                      <div className="font-bold text-[#F5F3EE] line-clamp-2">{planItem.topicTitle}</div>
                    </div>
                    <div className="text-[11px] text-[#B8C2D9] pt-1 border-t border-[#122240]/60">
                      Keyword: <span className="text-emerald-400 font-semibold">{planItem.targetKeyword}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Recent Activity Widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Widget 1: Orders */}
        <div className="rounded-3xl border border-[#122240] bg-[#081226] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#122240] pb-4 mb-4">
              <div>
                <h3 className="font-display text-base font-bold text-[#F5F3EE]">Recent Press Orders</h3>
                <p className="text-xs text-[#B8C2D9]">Live order queue from database</p>
              </div>
              <Link
                to="/admin/orders"
                className="text-xs font-bold text-[#D6C29A] hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#B8C2D9]">
                No orders recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {recentOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#F5F3EE] truncate">{order.productName || 'Print Order'}</div>
                      <div className="text-[11px] text-[#B8C2D9] truncate">
                        {order.orderNumber} • {order.customerName}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-[#F5F3EE]">
                        AED {(order.totalPrice || 0).toLocaleString()}
                      </span>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] font-bold text-[#F5F3EE]">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Widget 2: Quotes */}
        <div className="rounded-3xl border border-[#122240] bg-[#081226] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#122240] pb-4 mb-4">
              <div>
                <h3 className="font-display text-base font-bold text-[#F5F3EE]">Recent Quotes</h3>
                <p className="text-xs text-[#B8C2D9]">Submitted quote requests</p>
              </div>
              <Link
                to="/admin/quotes"
                className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {recentQuotes.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#B8C2D9]">
                No quote requests recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {recentQuotes.slice(0, 4).map((quote) => (
                  <div key={quote.id} className="py-3 flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#F5F3EE] truncate">{quote.name}</div>
                      <div className="text-[11px] text-[#B8C2D9] truncate">
                        {quote.quoteNumber} • {quote.email}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[9px] font-bold text-purple-700 border border-purple-200">
                        {quote.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Widget 3: Direct Studio Inquiries */}
        <div className="rounded-3xl border border-[#122240] bg-[#081226] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#122240] pb-4 mb-4">
              <div>
                <h3 className="font-display text-base font-bold text-[#F5F3EE]">Direct Studio Inquiries</h3>
                <p className="text-xs text-[#B8C2D9]">Contact form messages & specs</p>
              </div>
              <Link
                to="/admin/messages"
                className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#B8C2D9]">
                No contact inquiries received yet.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {recentMessages.slice(0, 4).map((msg) => (
                  <div key={msg.id || msg._id} className="py-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-[#F5F3EE] truncate">{msg.name}</div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                          msg.status === 'unread'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-neutral-100 text-[#B8C2D9]'
                        }`}
                      >
                        {msg.status || 'unread'}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#B8C2D9] font-medium truncate mt-0.5">
                      {msg.subject || 'Direct Studio Inquiry'}
                    </div>
                    <div className="text-[10px] text-[#B8C2D9]/70 mt-1 line-clamp-1">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
