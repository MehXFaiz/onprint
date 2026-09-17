import { useState, useEffect, useMemo } from 'react'
import {
  Target,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Layers,
  FileText,
  Clock,
  Zap,
} from 'lucide-react'
import Button from '../../../components/Button'
import {
  getContentDecay,
  updateContentDecay,
  getSeoOpportunities,
} from '../../../services/seo'

const INTENT_CATEGORIES = [
  { id: 'commercial', label: 'Commercial Intent', badge: 'bg-emerald-50 text-emerald-700' },
  { id: 'transactional', label: 'Transactional', badge: 'bg-blue-50 text-blue-700' },
  { id: 'local', label: 'Dubai Local Hubs', badge: 'bg-red-50 text-red-700' },
  { id: 'informational', label: 'Informational Guides', badge: 'bg-purple-50 text-purple-700' },
  { id: 'comparison', label: 'Competitor & Material Comparisons', badge: 'bg-amber-50 text-amber-700' },
  { id: 'pricing', label: 'Pricing & Cost Calculators', badge: 'bg-teal-50 text-teal-700' },
  { id: 'howto', label: 'How-to & Print Prep', badge: 'bg-indigo-50 text-indigo-700' },
]

export default function SeoContentGapDecayTab({ showToast }) {
  const [decayList, setDecayList] = useState([])
  const [oppData, setOppData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeIntent, setActiveIntent] = useState('commercial')
  const [tierFilter, setTierFilter] = useState('all')

  const loadData = async () => {
    setLoading(true)
    try {
      const [decRes, oppRes] = await Promise.all([
        getContentDecay().catch(() => ({ data: [] })),
        getSeoOpportunities().catch(() => ({ data: null })),
      ])
      if (decRes?.success) setDecayList(decRes.data || [])
      if (oppRes?.success) setOppData(oppRes.data || null)
    } catch (err) {
      showToast?.('Failed to load Content Gap & Decay data: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleMarkRefreshed = async (id) => {
    try {
      await updateContentDecay(id, {
        status: 'REFRESHED',
        last_refreshed_at: new Date().toISOString(),
      })
      showToast?.('Content marked as REFRESHED!')
      loadData()
    } catch (err) {
      showToast?.('Update failed: ' + (err.response?.data?.message || err.message), 'error')
    }
  }

  // Content gap matrices
  const contentGapMatrix = oppData?.contentGapMatrix || {
    commercial: [
      { keyword: 'luxury business card printing dubai', status: 'Covered', path: '/business-card-printing-dubai', priority: 'High' },
      { keyword: 'custom perfume box packaging printing', status: 'Under-Optimized', path: '/perfume-box-printing-dubai', priority: 'High' },
      { keyword: 'corporate gift printing press dubai', status: 'Covered', path: '/corporate-gift-printing-dubai', priority: 'Medium' },
    ],
    transactional: [
      { keyword: 'order business cards online dubai same day', status: 'Needs CTA Upgrade', path: '/business-card-printing-dubai', priority: 'High' },
      { keyword: 'roll up banner printing same day dubai', status: 'Covered', path: '/roll-up-banner-printing-dubai', priority: 'High' },
      { keyword: 'bulk flyer printing quotation uae', status: 'Under-Optimized', path: '/flyer-printing-dubai', priority: 'Medium' },
    ],
    local: [
      { keyword: 'printing press in al quoz dubai 3', status: 'Covered', path: '/commercial-printing-al-quoz', priority: 'High' },
      { keyword: 'printing services business bay dubai', status: 'Covered', path: '/printing-services-business-bay', priority: 'High' },
      { keyword: 'printing press difc dubai financial centre', status: 'Covered', path: '/printing-press-difc', priority: 'High' },
      { keyword: 'print shop dubai marina jbr', status: 'Covered', path: '/printing-services-dubai-marina', priority: 'Medium' },
    ],
    informational: [
      { keyword: 'cmyk vs pantone printing dubai standards', status: 'Covered', path: '/blog/cmyk-vs-pantone-commercial-printing', priority: 'Medium' },
      { keyword: 'gsm paper weight guide for luxury brochures', status: 'Covered', path: '/blog/gsm-paper-weight-guide-brochures-dubai', priority: 'Medium' },
      { keyword: 'best packaging materials for hot dubai weather', status: 'Missing Page', path: '/blog/heat-resistant-packaging-dubai', priority: 'High' },
    ],
    comparison: [
      { keyword: 'digital printing vs offset printing cost dubai', status: 'Covered', path: '/blog/offset-vs-digital-printing-dubai', priority: 'High' },
      { keyword: 'matte lamination vs soft touch coating comparison', status: 'Covered', path: '/blog/matte-vs-soft-touch-coating', priority: 'Medium' },
    ],
    pricing: [
      { keyword: 'business cards printing price dubai aed', status: 'Needs Table', path: '/business-card-printing-dubai', priority: 'High' },
      { keyword: 'roll up banner printing cost dubai', status: 'Covered', path: '/roll-up-banner-printing-dubai', priority: 'High' },
    ],
    howto: [
      { keyword: 'how to prepare print ready pdf bleed crop marks', status: 'Covered', path: '/blog/how-to-prepare-print-ready-pdf', priority: 'Medium' },
      { keyword: 'foil stamping file setup illustrator tutorial', status: 'Missing Page', path: '/blog/foil-stamping-vector-setup-guide', priority: 'Medium' },
    ],
  }

  const strikingKeywords = oppData?.strikingDistanceKeywords || []
  const filteredStriking = useMemo(() => {
    if (tierFilter === 'all') return strikingKeywords
    return strikingKeywords.filter((k) => k.tier === tierFilter)
  }, [strikingKeywords, tierFilter])

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 text-xs font-bold text-[#A82F19]">
                <Target className="h-3.5 w-3.5" />
                7-Intent Matrix & Decay Defense
              </span>
              <span className="text-xs font-semibold text-neutral-500">Requirements 10, 14 & 40</span>
            </div>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
              Content Gap Matrix & Content Decay
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
              Systematically captures all 7 search intent buckets across UAE commercial queries and alerts when high-performing URLs experience more than 15% traffic drop.
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
              Re-Scan Opportunities
            </Button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Content Decay Monitor (Requirement 14) */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <h3 className="font-bold text-neutral-900 text-base">Content Decay Alert Tracker</h3>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Pages experiencing &gt;15% organic impression drop requiring updated pricing, FAQs, or content additions.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full">
            {decayList.filter((d) => d.status === 'PENDING').length} URLs Decaying
          </span>
        </div>

        {decayList.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            No content decay detected across indexed pages.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">URL Path</th>
                  <th className="py-3 px-3">Peak Clicks</th>
                  <th className="py-3 px-3">Recent Clicks</th>
                  <th className="py-3 px-3">Drop %</th>
                  <th className="py-3 px-4">Prescribed Refresh Action</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {decayList.map((item) => {
                  const isPending = item.status === 'PENDING'
                  return (
                    <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                        {item.page_path}
                      </td>

                      <td className="py-3 px-3 font-semibold text-neutral-700">
                        {item.peak_clicks || 0}
                      </td>

                      <td className="py-3 px-3 font-semibold text-neutral-700">
                        {item.current_clicks || 0}
                      </td>

                      <td className="py-3 px-3 font-extrabold text-red-600">
                        -{item.drop_percentage}%
                      </td>

                      <td className="py-3 px-4 text-neutral-700 text-xs font-medium max-w-sm">
                        {item.prescribed_action}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block font-bold text-[10px] uppercase px-2 py-0.5 rounded-full ${
                            isPending
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {isPending && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleMarkRefreshed(item.id)}
                            className="text-xs font-bold text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Mark Refreshed
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 2: 7-Category Intent Content Gap Matrix (Requirement 10) */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#A82F19]" />
              <h3 className="font-bold text-neutral-900 text-base">7 Search Intent Content Coverage Matrix</h3>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Comprehensive keyword mapping ensuring ONPRINT dominates Informational, Commercial, Local, and Transactional print queries in the UAE.
            </p>
          </div>
        </div>

        {/* Intent Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {INTENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveIntent(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeIntent === cat.id
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Selected Intent Table */}
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Target Keyword (Dubai Focus)</th>
                <th className="py-3 px-3">Current Coverage</th>
                <th className="py-3 px-4">Mapped / Recommended URL</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(contentGapMatrix[activeIntent] || []).map((row, idx) => {
                const isCovered = row.status === 'Covered'
                return (
                  <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      {row.keyword}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block font-extrabold text-[10px] px-2 py-0.5 rounded-full ${
                          isCovered
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-neutral-700 text-[11px]">
                      {row.path}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`font-black text-[10px] uppercase px-2 py-0.5 rounded-full ${
                          row.priority === 'High' ? 'text-red-700 bg-red-50' : 'text-neutral-700 bg-neutral-100'
                        }`}
                      >
                        {row.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <a
                        href={`https://0nprint.com${row.path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#A82F19] hover:underline font-bold text-xs"
                      >
                        Visit Page <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Striking-Distance Keywords (Requirements 3 & 40) */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#A82F19]" />
              <h3 className="font-bold text-neutral-900 text-base">Striking Distance Opportunity Keywords</h3>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Rankings in Positions 4–30 sorted by objective Opportunity Score: <span className="font-mono text-neutral-700">(log10(impressions) * intentWeight * (15/pos) * (ctrGap/2))</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['all', 'Tier 1', 'Tier 2', 'Tier 3'].map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tierFilter === t
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {t === 'all' ? 'All Tiers' : `${t} ${t === 'Tier 1' ? '(Pos 4-10)' : t === 'Tier 2' ? '(Pos 11-20)' : '(Pos 21-30)'}`}
              </button>
            ))}
          </div>
        </div>

        {filteredStriking.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            No striking distance queries found for this tier.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Search Query</th>
                  <th className="py-3 px-3">Position</th>
                  <th className="py-3 px-3">Tier</th>
                  <th className="py-3 px-3">Impressions</th>
                  <th className="py-3 px-3">Current CTR</th>
                  <th className="py-3 px-3">Opportunity Score</th>
                  <th className="py-3 px-4">Target Landing Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredStriking.map((kw, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      {kw.query}
                    </td>

                    <td className="py-3 px-3 font-black text-neutral-800">
                      #{kw.position}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block font-extrabold text-[10px] px-2 py-0.5 rounded-full ${
                          kw.tier === 'Tier 1'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : kw.tier === 'Tier 2'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {kw.tier}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-semibold text-neutral-700">
                      {kw.impressions?.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 font-semibold text-neutral-700">
                      {kw.ctr}%
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-black text-[#A82F19] text-sm">
                        {kw.opportunity_score || 75} / 100
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-neutral-600 text-[11px] truncate max-w-xs">
                      {kw.url || '/'}
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
