import { useState, useEffect, useMemo } from 'react'
import {
  TrendingUp,
  Phone,
  Mail,
  FileSpreadsheet,
  Smartphone,
  Monitor,
  Globe,
  RefreshCw,
  Search,
  CheckCircle2,
  Calendar,
  MessageCircle,
} from 'lucide-react'
import Button from '../../../components/Button'
import { getConversionStats } from '../../../services/seo'

export default function SeoConversionsTab({ showToast }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [eventTypeFilter, setEventTypeFilter] = useState('all')
  const [search, setSearch] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await getConversionStats()
      if (res?.success) {
        setStats(res.data)
      }
    } catch (err) {
      showToast?.('Failed to load conversion stats: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const summary = stats?.summary || {}
  const byPage = stats?.byPage || []
  const byDevice = stats?.byDevice || []
  const recentEvents = stats?.recent || []

  const filteredEvents = useMemo(() => {
    return recentEvents.filter((ev) => {
      const s = search.toLowerCase().trim()
      const matchesSearch =
        !s ||
        (ev.landing_page || '').toLowerCase().includes(s) ||
        (ev.event_type || '').toLowerCase().includes(s) ||
        (ev.source || '').toLowerCase().includes(s)

      const matchesType =
        eventTypeFilter === 'all' || (ev.event_type || '').toLowerCase() === eventTypeFilter.toLowerCase()

      return matchesSearch && matchesType
    })
  }, [recentEvents, search, eventTypeFilter])

  const getEventBadge = (type) => {
    const t = (type || '').toLowerCase()
    if (t.includes('whatsapp')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <MessageCircle className="h-3 w-3" />
          WhatsApp Click
        </span>
      )
    }
    if (t.includes('phone') || t.includes('call')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Phone className="h-3 w-3" />
          Phone Call
        </span>
      )
    }
    if (t.includes('quote')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <FileSpreadsheet className="h-3 w-3" />
          Quote Submission
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Mail className="h-3 w-3" />
        Email Inquiry
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 text-xs font-bold text-[#A82F19]">
                <TrendingUp className="h-3.5 w-3.5" />
                Real-Time Organic Attribution
              </span>
              <span className="text-xs font-semibold text-neutral-500">Requirements 35 & 36</span>
            </div>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
              Organic Conversion Dashboard
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
              Tracks high-intent organic lead generation in Dubai & UAE. Attributing phone calls, WhatsApp inquiries, emails, and quotation requests directly to landing page entry points.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="text-xs font-bold border-neutral-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Events
            </Button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-xl border border-neutral-200/70 bg-neutral-50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Total Leads</div>
            <div className="mt-1 text-2xl font-black text-neutral-900">{summary.totalConversions || 0}</div>
            <div className="mt-0.5 text-[10px] text-neutral-500">All channels combined</div>
          </div>

          <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">WhatsApp Clicks</div>
            <div className="mt-1 text-2xl font-black text-emerald-700">{summary.whatsappCount || 0}</div>
            <div className="mt-0.5 text-[10px] text-emerald-600">Highest conversion rate</div>
          </div>

          <div className="rounded-xl border border-blue-200/70 bg-blue-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Phone Calls</div>
            <div className="mt-1 text-2xl font-black text-blue-700">{summary.phoneCount || 0}</div>
            <div className="mt-0.5 text-[10px] text-blue-600">Direct Al Quoz line</div>
          </div>

          <div className="rounded-xl border border-purple-200/70 bg-purple-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-800">Quote Requests</div>
            <div className="mt-1 text-2xl font-black text-purple-700">{summary.quoteCount || 0}</div>
            <div className="mt-0.5 text-[10px] text-purple-600">High-volume B2B orders</div>
          </div>

          <div className="rounded-xl border border-[#A82F19]/20 bg-[#A82F19]/5 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#A82F19]">Email Inquiries</div>
            <div className="mt-1 text-2xl font-black text-[#A82F19]">{summary.emailCount || 0}</div>
            <div className="mt-0.5 text-[10px] text-neutral-500">Pressroom RFQs</div>
          </div>
        </div>
      </div>

      {/* Breakdown Grid: Top Landing Pages & Device Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Converting Pages */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
            <div>
              <h3 className="font-bold text-neutral-900 text-sm">Top Converting Landing Pages</h3>
              <p className="text-xs text-neutral-500">Commercial URLs generating the most organic conversions</p>
            </div>
            <Globe className="h-4 w-4 text-neutral-400" />
          </div>

          {byPage.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              No conversion events recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {byPage.slice(0, 5).map((p, idx) => {
                const pct = summary.totalConversions ? Math.round((p.conversions / summary.totalConversions) * 100) : 0
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="font-mono text-neutral-800 truncate max-w-xs">{p.landing_page}</span>
                      <span className="text-neutral-900 font-bold">{p.conversions} leads ({pct}%)</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#A82F19] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Device & Channel Breakdown */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
            <div>
              <h3 className="font-bold text-neutral-900 text-sm">Device & Attribution Split</h3>
              <p className="text-xs text-neutral-500">Lead breakdown by user device environment</p>
            </div>
            <Smartphone className="h-4 w-4 text-neutral-400" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['mobile', 'desktop', 'tablet'].map((dev) => {
              const item = byDevice.find((d) => (d.device || '').toLowerCase() === dev)
              const count = item ? item.conversions : 0
              const pct = summary.totalConversions ? Math.round((count / summary.totalConversions) * 100) : 0
              return (
                <div key={dev} className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 text-center">
                  <div className="text-neutral-500 uppercase font-bold text-[10px] tracking-wider mb-1">
                    {dev}
                  </div>
                  <div className="text-xl font-black text-neutral-900">{count}</div>
                  <div className="text-xs font-semibold text-[#A82F19] mt-0.5">{pct}%</div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 bg-neutral-50 p-3.5 rounded-xl text-xs text-neutral-600 leading-relaxed border border-neutral-200/50">
            <span className="font-bold text-neutral-800">CRO Insight:</span> Over 60% of Dubai commercial print buyers utilize WhatsApp direct inquiries on mobile devices during business hours (9:00 AM – 6:00 PM GST).
          </div>
        </div>
      </div>

      {/* Filter and Live Event Stream */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search landing page or event type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:outline-none focus:border-[#A82F19]"
          />
        </div>

        <select
          value={eventTypeFilter}
          onChange={(e) => setEventTypeFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white text-neutral-700 font-semibold focus:outline-none focus:border-[#A82F19] w-full sm:w-auto"
        >
          <option value="all">All Event Types</option>
          <option value="whatsapp_click">WhatsApp Direct Click</option>
          <option value="phone_call">Phone Call</option>
          <option value="quote_submit">Quote Submission</option>
          <option value="email_click">Email Inquiry</option>
        </select>
      </div>

      {/* Events Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-500">
            Loading organic conversion records...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-sm text-neutral-500">
            No conversion events found for the active filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Entry Landing Page</th>
                  <th className="py-3 px-3">Device</th>
                  <th className="py-3 px-3">Traffic Source</th>
                  <th className="py-3 px-3">Anonymized IP</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4">
                      {getEventBadge(ev.event_type)}
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-neutral-900">
                      {ev.landing_page}
                    </td>

                    <td className="py-3 px-3 capitalize font-medium text-neutral-600">
                      {ev.device || 'desktop'}
                    </td>

                    <td className="py-3 px-3 font-semibold text-neutral-700">
                      {ev.source || 'Organic Search'}
                    </td>

                    <td className="py-3 px-3 font-mono text-neutral-400 text-[11px]">
                      {ev.ip_address || '127.0.0.x'}
                    </td>

                    <td className="py-3 px-4 text-right text-neutral-500 font-mono text-[11px]">
                      {new Date(ev.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
