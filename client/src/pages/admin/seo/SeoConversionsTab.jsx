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
          Quote Request
        </span>
      )
    }
    if (t.includes('form')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <CheckCircle2 className="h-3 w-3" />
          Form Submission
        </span>
      )
    }
    if (t.includes('product_inquiry')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
          <TrendingUp className="h-3 w-3" />
          Product Inquiry
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Mail className="h-3 w-3" />
        Email Click
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#122240] bg-[#081226] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D6C29A]/10 px-2.5 py-0.5 text-xs font-bold text-[#D6C29A]">
                <TrendingUp className="h-3.5 w-3.5" />
                Real-Time Organic Attribution
              </span>
              <span className="text-xs font-semibold text-[#B8C2D9]">Privacy-Safe Non-PII Funnel</span>
            </div>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-black tracking-tight text-[#F5F3EE]">
              WhatsApp &amp; Conversion Funnel Dashboard
            </h2>
            <p className="mt-1 text-sm text-[#B8C2D9] max-w-2xl">
              Strictly separates outbound WhatsApp clicks (intent) from submitted quote/contact forms (confirmed inquiries) and verified orders. No personal customer data (PII) is stored in analytics events.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="text-xs font-bold border-[#122240]"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Events
            </Button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-6 gap-3">
          <div className="rounded-xl border border-[#122240]/70 bg-[#040A18] p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#B8C2D9]">Total Interactions</div>
            <div className="mt-1 text-2xl font-black text-[#F5F3EE]">{summary.totalConversions || 0}</div>
            <div className="mt-0.5 text-[10px] text-[#B8C2D9]">All tracked CTA events</div>
          </div>

          <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">WhatsApp Clicks</div>
            <div className="mt-1 text-2xl font-black text-emerald-700">{summary.whatsappCount || 0}</div>
            <div className="mt-0.5 text-[10px] text-emerald-600">Outbound chat intent</div>
          </div>

          <div className="rounded-xl border border-purple-200/70 bg-purple-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-800">Submitted Quotes</div>
            <div className="mt-1 text-2xl font-black text-purple-700">{summary.quoteCount || 0}</div>
            <div className="mt-0.5 text-[10px] text-purple-600">Confirmed RFQ forms</div>
          </div>

          <div className="rounded-xl border border-indigo-200/70 bg-indigo-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">Contact Forms</div>
            <div className="mt-1 text-2xl font-black text-indigo-700">{summary.formCount || 0}</div>
            <div className="mt-0.5 text-[10px] text-indigo-600">Submitted inquiries</div>
          </div>

          <div className="rounded-xl border border-blue-200/70 bg-blue-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Phone Clicks</div>
            <div className="mt-1 text-2xl font-black text-blue-700">{summary.phoneCount || 0}</div>
            <div className="mt-0.5 text-[10px] text-blue-600">Direct tel: clicks</div>
          </div>

          <div className="rounded-xl border border-[#D6C29A]/20 bg-[#D6C29A]/5 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#D6C29A]">Confirmed Orders</div>
            <div className="mt-1 text-2xl font-black text-[#D6C29A]">{summary.confirmedOrdersCount || 0}</div>
            <div className="mt-0.5 text-[10px] text-[#B8C2D9]">Verified database orders</div>
          </div>
        </div>
      </div>

      {/* Breakdown Grid: Top Landing Pages & Device Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Converting Pages */}
        <div className="rounded-2xl border border-[#122240] bg-[#081226] p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#122240] pb-4 mb-4">
            <div>
              <h3 className="font-bold text-[#F5F3EE] text-sm">Product &amp; Landing Page Performance</h3>
              <p className="text-xs text-[#B8C2D9]">WhatsApp clicks vs. submitted forms by page path</p>
            </div>
            <Globe className="h-4 w-4 text-[#B8C2D9]/70" />
          </div>

          {byPage.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#B8C2D9]">
              No conversion events recorded yet.
            </div>
          ) : (
            <div className="space-y-3.5">
              {byPage.slice(0, 7).map((p, idx) => {
                const pct = summary.totalConversions ? Math.round((p.conversions / summary.totalConversions) * 100) : 0
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold gap-2">
                      <span className="font-mono text-[#F5F3EE] truncate max-w-[220px] sm:max-w-xs">{p.landing_page}</span>
                      <div className="flex items-center gap-2 shrink-0 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                          WA: {p.whatsapp_clicks || p.whatsapp_leads || 0}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">
                          Forms: {p.form_submissions || (p.quote_leads || 0) + (p.form_leads || 0)}
                        </span>
                        <span className="text-[#F5F3EE] font-bold">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#D6C29A] h-2 rounded-full transition-all duration-500"
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
        <div className="rounded-2xl border border-[#122240] bg-[#081226] p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#122240] pb-4 mb-4">
            <div>
              <h3 className="font-bold text-[#F5F3EE] text-sm">Device Category Attribution</h3>
              <p className="text-xs text-[#B8C2D9]">Interaction split across mobile, desktop, and tablet</p>
            </div>
            <Smartphone className="h-4 w-4 text-[#B8C2D9]/70" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['mobile', 'desktop', 'tablet'].map((dev) => {
              const item = byDevice.find((d) => (d.device || '').toLowerCase() === dev)
              const count = item ? item.conversions : 0
              const pct = summary.totalConversions ? Math.round((count / summary.totalConversions) * 100) : 0
              return (
                <div key={dev} className="rounded-xl border border-[#122240] bg-[#040A18] p-4 text-center">
                  <div className="text-[#B8C2D9] uppercase font-bold text-[10px] tracking-wider mb-1">
                    {dev}
                  </div>
                  <div className="text-xl font-black text-[#F5F3EE]">{count}</div>
                  <div className="text-xs font-semibold text-[#D6C29A] mt-0.5">{pct}%</div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 bg-[#040A18] p-3.5 rounded-xl text-xs text-[#B8C2D9] leading-relaxed border border-[#122240]/50">
            <span className="font-bold text-[#F5F3EE]">Attribution Integrity Note:</span> A WhatsApp button click opens the WhatsApp conversation with pre-filled product details; it is tracked as an outbound click (`whatsapp_click`) and is never inflated as a confirmed sale unless an order is recorded.
          </div>
        </div>
      </div>

      {/* Filter and Live Event Stream */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B8C2D9]/70" />
          <input
            type="text"
            placeholder="Search page path, product, or event type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#122240] bg-[#081226] focus:outline-none focus:border-[#D6C29A]"
          />
        </div>

        <select
          value={eventTypeFilter}
          onChange={(e) => setEventTypeFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-[#122240] bg-[#081226] text-[#F5F3EE] font-semibold focus:outline-none focus:border-[#D6C29A] w-full sm:w-auto"
        >
          <option value="all">All Event Types</option>
          <option value="whatsapp_click">WhatsApp Click (whatsapp_click)</option>
          <option value="product_inquiry">Product Inquiry (product_inquiry)</option>
          <option value="quote_request">Quote Request (quote_request)</option>
          <option value="contact_form_submit">Contact Form Submit (contact_form_submit)</option>
          <option value="phone_click">Phone Click (phone_click)</option>
          <option value="email_click">Email Click (email_click)</option>
        </select>
      </div>

      {/* Events Table */}
      <div className="rounded-2xl border border-[#122240] bg-[#081226] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-[#B8C2D9]">
            Loading organic conversion records...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#B8C2D9]">
            No conversion events found for the active filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#122240] bg-[#040A18]/80 text-[#B8C2D9] font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Page Path</th>
                  <th className="py-3 px-3">Product / Button Location</th>
                  <th className="py-3 px-3">Device</th>
                  <th className="py-3 px-3">Traffic Source</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#040A18]/60 transition-colors">
                    <td className="py-3 px-4">
                      {getEventBadge(ev.event_type || ev.conversion_type)}
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-[#F5F3EE]">
                      {ev.landing_page}
                    </td>

                    <td className="py-3 px-3 text-[#F5F3EE]">
                      <div className="font-semibold">{ev.product_name || ev.source_label || '—'}</div>
                      {ev.button_location && (
                        <div className="text-[10px] font-mono text-[#B8C2D9]">{ev.button_location}</div>
                      )}
                    </td>

                    <td className="py-3 px-3 capitalize font-medium text-[#B8C2D9]">
                      {ev.device || ev.device_category || 'desktop'}
                    </td>

                    <td className="py-3 px-3 font-semibold text-[#F5F3EE] truncate max-w-[160px]">
                      {ev.source || 'Direct / Organic'}
                    </td>

                    <td className="py-3 px-4 text-right text-[#B8C2D9] font-mono text-[11px]">
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

