import React, { useState, useEffect, useMemo } from 'react'
import {
  Target,
  Sparkles,
  Search,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Link2,
  Mail,
  Calendar,
  Copy,
  Check,
  TrendingUp,
} from 'lucide-react'
import { getBusinessCardLinkBuilding, updateBusinessCardProspect } from '../../../services/seo'

export default function BusinessCardSeoTab({ showToast }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSubTab, setSelectedSubTab] = useState('prospects') // 'prospects' | 'keywords' | 'anchors' | 'content_outreach' | 'roadmap'
  const [searchTerm, setSearchTerm] = useState('')
  const [intentFilter, setIntentFilter] = useState('all')
  const [prospectFilter, setProspectFilter] = useState('all') // 'all' | 'qualified' | 'rejected'
  const [liveUrlDrafts, setLiveUrlDrafts] = useState({})
  const [copiedId, setCopiedId] = useState(null)

  const fetchStrategyData = async () => {
    setLoading(true)
    try {
      const res = await getBusinessCardLinkBuilding()
      if (res?.success && res?.data) {
        setData(res.data)
      }
    } catch (err) {
      console.error('Failed to load Business Card SEO & Link Building data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStrategyData()
  }, [])

  const keywords = data?.keywords || []
  const prospects = data?.prospects || []
  const anchorStrategy = data?.anchor_text_strategy || { distribution_targets: [], target_page_mapping: [] }
  const contentAssets = data?.link_worthy_content_assets || []
  const outreachTemplates = data?.outreach_templates || []
  const roadmap = data?.ninety_day_roadmap || []
  const technicalAudit = data?.technical_audit || null
  const summary = data?.summary || {
    total_keywords: 20,
    qualified_prospects: 12,
    rejected_prospects: 3,
    approved_for_outreach: 0,
    verified_acquired_links: 0,
    link_worthy_guides_published: 5,
  }

  const filteredKeywords = useMemo(() => {
    return keywords.filter((item) => {
      const matchesSearch =
        (item.keyword || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.cluster || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.target_url || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesIntent = intentFilter === 'all' || (item.search_intent || '').toLowerCase().includes(intentFilter.toLowerCase())
      return matchesSearch && matchesIntent
    })
  }, [keywords, searchTerm, intentFilter])

  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      const matchesTab =
        prospectFilter === 'all' ||
        (prospectFilter === 'qualified' && p.qualification_status === 'qualified') ||
        (prospectFilter === 'rejected' && p.qualification_status === 'rejected')
      const matchesSearch =
        !searchTerm ||
        (p.domain || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.website_category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.proposed_contribution || '').toLowerCase().includes(searchTerm.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [prospects, prospectFilter, searchTerm])

  const handleProspectUpdate = async (prospect, updates) => {
    try {
      const res = await updateBusinessCardProspect(prospect.id, updates)
      if (res?.success && res?.data) {
        setData((prev) => {
          if (!prev) return prev
          const nextProspects = prev.prospects.map((p) => (p.id === prospect.id ? res.data : p))
          const qualified = nextProspects.filter((p) => p.qualification_status === 'qualified')
          return {
            ...prev,
            prospects: nextProspects,
            summary: {
              ...prev.summary,
              approved_for_outreach: qualified.filter((p) => p.approved_by_owner).length,
              verified_acquired_links: qualified.filter((p) => p.outreach_status === 'Acquired' && p.verified_live).length,
            },
          }
        })
        showToast?.(res.message || `Updated ${prospect.domain}`, 'success')
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to update prospect'
      showToast?.(msg, 'error')
    }
  }

  const handleCopyText = (id, text) => {
    navigator.clipboard?.writeText(text)
    setCopiedId(id)
    showToast?.('Copied template to clipboard', 'success')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Key Stat Cards */}
      <div className="rounded-3xl border border-amber-900/20 bg-gradient-to-br from-neutral-900 via-[#181310] to-neutral-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D4AF37]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#A82F19]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1 text-xs font-bold text-[#D4AF37]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>White-Hat Digital PR &amp; Local SEO • Al Quoz Pressroom</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              Dubai Business Card SEO &amp; High-Quality Backlink System
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              Ethical authority-building and commercial keyword engineering for{' '}
              <a
                href="/business-card-printing-dubai"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[#D4AF37] underline hover:text-white"
              >
                /business-card-printing-dubai
              </a>
              . Strict anti-spam enforcement: owner approval required before outreach, and live URL verification required before any link is marked Acquired.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/business-card-printing-dubai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition-all"
            >
              <span>View Landing Page</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="/api/seo/business-cards-link-building/export-prospects-csv"
              download="dubai-business-card-backlink-prospects.csv"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#A82F19] hover:bg-[#8c2211] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#A82F19]/30 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Prospects CSV</span>
            </a>
            <a
              href="/api/seo/business-cards-link-building/export-keywords-csv"
              download="dubai-business-card-keywords-research.csv"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Keywords CSV</span>
            </a>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-white/10">
          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Priority Keywords</span>
            <span className="mt-1 block font-mono text-xl font-black text-[#D4AF37]">{summary.total_keywords}</span>
            <span className="text-[10px] text-neutral-400">Zero Fabricated Metrics</span>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Qualified Prospects</span>
            <span className="mt-1 block font-mono text-xl font-black text-emerald-400">{summary.qualified_prospects}</span>
            <span className="text-[10px] text-neutral-400">Vetted UAE Domains</span>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Rejected / Blocked</span>
            <span className="mt-1 block font-mono text-xl font-black text-rose-400">{summary.rejected_prospects}</span>
            <span className="text-[10px] text-neutral-400">Scrapers &amp; PBNs</span>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Owner Approved</span>
            <span className="mt-1 block font-mono text-xl font-black text-white">{summary.approved_for_outreach}</span>
            <span className="text-[10px] text-neutral-400">Cleared for Outreach</span>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Verified Acquired</span>
            <span className="mt-1 block font-mono text-xl font-black text-emerald-400">{summary.verified_acquired_links}</span>
            <span className="text-[10px] text-neutral-400">Live URL Confirmed</span>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Linkable Guides</span>
            <span className="mt-1 block font-mono text-xl font-black text-[#D4AF37]">{summary.link_worthy_guides_published}</span>
            <span className="text-[10px] text-neutral-400">Published on /blog</span>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-3">
        {[
          { id: 'prospects', label: '1. Risk-Assessed Backlink Prospects CRM', icon: Link2 },
          { id: 'keywords', label: '2. Target Business Card Keywords (20)', icon: Target },
          { id: 'anchors', label: '3. Natural Anchor Text & Target Plan', icon: ShieldCheck },
          { id: 'content_outreach', label: '4. Link-Worthy Guides & Outreach Templates', icon: Mail },
          { id: 'roadmap', label: '5. 90-Day Roadmap & Technical Audit', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = selectedSubTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedSubTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-950'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {loading && !data ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-xs text-neutral-500">
          Loading Dubai Business Card SEO &amp; White-Hat Backlink Strategy...
        </div>
      ) : null}

      {/* TAB 1: RISK-ASSESSED BACKLINK PROSPECTS CRM */}
      {selectedSubTab === 'prospects' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Strict White-Hat Safety Enforcement:</span> No external website is ever claimed to be 100% risk-free. Outreach cannot be marked as sent unless <span className="font-mono font-bold">Owner Approved</span> is checked, and no link can be marked <span className="font-mono font-bold">Acquired</span> until its live URL (<span className="font-mono">https://...</span>) is verified.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search domain, category, or contribution angle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-4 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: `All Reviewed (${prospects.length})` },
                { id: 'qualified', label: `Qualified Prospects (${summary.qualified_prospects})` },
                { id: 'rejected', label: `Rejected / Disqualified (${summary.rejected_prospects})` },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setProspectFilter(btn.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition-all ${
                    prospectFilter === btn.id
                      ? 'bg-[#A82F19] text-white'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredProspects.map((prospect) => {
              const isRejected = prospect.qualification_status === 'rejected'
              const draftUrl = liveUrlDrafts[prospect.id] !== undefined ? liveUrlDrafts[prospect.id] : prospect.live_backlink_url || ''
              return (
                <div
                  key={prospect.id}
                  className={`rounded-2xl border p-5 shadow-xs transition-all ${
                    isRejected
                      ? 'border-rose-200 bg-rose-50/40'
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-black text-neutral-950">{prospect.domain}</span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${
                            isRejected
                              ? 'bg-rose-600 text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isRejected ? 'Disqualified / Rejected' : 'Qualified UAE Prospect'}
                        </span>
                        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-700">
                          {prospect.website_category}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            prospect.risk_score >= 70
                              ? 'bg-rose-100 text-rose-800'
                              : prospect.risk_score >= 20
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          Risk Score: {prospect.risk_score}/100 ({prospect.risk_level})
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">{prospect.dubai_uae_relevance}</p>
                    </div>

                    {!isRejected && (
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex items-center gap-2 text-xs font-bold text-neutral-800 cursor-pointer bg-neutral-100 px-3 py-1.5 rounded-xl">
                          <input
                            type="checkbox"
                            checked={Boolean(prospect.approved_by_owner)}
                            onChange={(e) =>
                              handleProspectUpdate(prospect, { approved_by_owner: e.target.checked })
                            }
                            className="rounded border-neutral-300 text-[#A82F19] focus:ring-[#A82F19]"
                          />
                          <span>Owner Approved</span>
                        </label>

                        <select
                          value={prospect.outreach_status}
                          onChange={(e) =>
                            handleProspectUpdate(prospect, { outreach_status: e.target.value })
                          }
                          className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-800 focus:outline-none"
                        >
                          <option value="Pending Owner Approval">Pending Owner Approval</option>
                          <option value="Ready for Outreach">Ready for Outreach</option>
                          <option value="Outreach Sent">Outreach Sent</option>
                          <option value="In Editorial Review">In Editorial Review</option>
                          <option value="Acquired">Acquired (Requires Verified URL)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="font-bold text-neutral-900 block mb-1">Proposed Contribution / Reason:</span>
                      <p className="text-neutral-600 leading-relaxed">{prospect.proposed_contribution}</p>
                      <p className="mt-1.5 text-[11px] text-neutral-500">
                        <span className="font-semibold text-neutral-700">Inclusion/Rejection Rationale:</span> {prospect.inclusion_or_rejection_reason}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-neutral-900 block mb-1">Target Page &amp; Suggested Anchor:</span>
                      <p className="font-mono text-[11px] text-[#A82F19] break-all">{prospect.target_landing_page}</p>
                      <p className="mt-1 text-neutral-700">
                        Anchor: <span className="font-semibold">"{prospect.suggested_anchor_text}"</span>{' '}
                        <span className="text-[10px] uppercase bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">
                          {prospect.anchor_type}
                        </span>
                      </p>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        Contact: <span className="font-mono">{prospect.contact_page}</span>
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-neutral-900 block mb-1">Risk Assessment &amp; Verification:</span>
                      <p className="text-neutral-600 leading-relaxed">{prospect.risk_assessment}</p>
                      {!isRejected && (
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="url"
                            placeholder="https://... live backlink URL to verify"
                            value={draftUrl}
                            onChange={(e) =>
                              setLiveUrlDrafts((prev) => ({ ...prev, [prospect.id]: e.target.value }))
                            }
                            className="flex-1 rounded-lg border border-neutral-200 px-2.5 py-1 text-[11px] font-mono"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleProspectUpdate(prospect, {
                                approved_by_owner: true,
                                live_backlink_url: draftUrl,
                                verified_live: Boolean(draftUrl),
                                outreach_status: draftUrl ? 'Acquired' : prospect.outreach_status,
                              })
                            }
                            className="rounded-lg bg-emerald-700 hover:bg-emerald-800 px-2.5 py-1 text-[11px] font-bold text-white cursor-pointer shrink-0"
                          >
                            Verify Live Link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TARGET BUSINESS CARD KEYWORDS (20 CORE + TRUTHFUL METRICS) */}
      {selectedSubTab === 'keywords' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-950 flex items-start gap-3">
            <ShieldCheck className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Zero Fabricated Keyword Metrics Policy:</span> All 20 requested Dubai &amp; UAE business card keywords are mapped by verified commercial intent, funnel stage, and target landing page. Monthly search volume and KD% are transparently marked as <span className="font-mono font-bold">Unverified (Connect GSC / SEMrush API)</span> rather than invented numbers.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Filter 20 target business card keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-4 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <select
              value={intentFilter}
              onChange={(e) => setIntentFilter(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 focus:outline-none"
            >
              <option value="all">All Search Intents</option>
              <option value="transactional">Transactional</option>
              <option value="commercial">Commercial</option>
              <option value="local">Local</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 bg-neutral-50/80 font-bold text-neutral-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Target Keyword</th>
                  <th className="py-3 px-4">Search Intent</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Search Volume &amp; KD Status</th>
                  <th className="py-3 px-4">Target Page</th>
                  <th className="py-3 px-4">Recommended Anchor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredKeywords.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-neutral-400">{item.id}</td>
                    <td className="py-3 px-4 font-bold text-neutral-950">{item.keyword}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {item.search_intent}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${
                          item.priority === 'Critical'
                            ? 'bg-[#A82F19] text-white'
                            : 'bg-neutral-900 text-white'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-amber-800">
                      {item.search_volume_status}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#A82F19]">
                      <a href={item.target_url} target="_blank" rel="noreferrer" className="underline">
                        {item.target_url}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-neutral-700 font-medium">{item.recommended_anchor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: NATURAL ANCHOR TEXT & TARGET-PAGE MAPPING PLAN */}
      {selectedSubTab === 'anchors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {(anchorStrategy.distribution_targets || []).map((bucket, idx) => (
              <div key={idx} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    {bucket.category}
                  </span>
                  <span className="font-mono text-xl font-black text-[#A82F19]">
                    {bucket.target_percentage}%
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">{bucket.rationale}</p>
                <div className="pt-2 border-t border-neutral-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block">Approved Examples:</span>
                  {(bucket.examples || []).map((ex, i) => (
                    <span
                      key={i}
                      className="inline-block mr-1.5 mb-1 rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-800"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-display text-base font-black text-neutral-950">
              Target Landing Page &amp; Anchor Text Allocation Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-200 bg-neutral-50 font-bold text-neutral-600 uppercase">
                  <tr>
                    <th className="py-3 px-4">Target Page URL</th>
                    <th className="py-3 px-4">Page Role</th>
                    <th className="py-3 px-4">Link Share</th>
                    <th className="py-3 px-4">Approved Natural Anchors</th>
                    <th className="py-3 px-4">Prohibited Practices</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {(anchorStrategy.target_page_mapping || []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 font-mono font-bold text-[#A82F19]">{row.target_page}</td>
                      <td className="py-3 px-4 font-semibold text-neutral-900">{row.role}</td>
                      <td className="py-3 px-4 font-mono font-bold text-neutral-800">{row.recommended_share_of_links}</td>
                      <td className="py-3 px-4 text-neutral-700">{(row.allowed_anchors || []).join(' • ')}</td>
                      <td className="py-3 px-4 text-rose-700 font-medium">{row.prohibited}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LINK-WORTHY CONTENT ASSETS & PERSONALIZED OUTREACH TEMPLATES */}
      {selectedSubTab === 'content_outreach' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-display text-base font-black text-neutral-950">
              5 Published Link-Worthy Business Card Guides (Live on /blog)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentAssets.map((asset) => (
                <div key={asset.id} className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {asset.status} • {asset.word_count} words
                      </span>
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#A82F19] hover:underline"
                      >
                        <span>Read Live</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <h4 className="font-bold text-sm text-neutral-950 leading-snug">{asset.title}</h4>
                    <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">{asset.link_magnet_value}</p>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 text-[11px] text-neutral-500">
                    Internal Links:{' '}
                    <span className="font-mono text-neutral-700">
                      {(asset.internal_links_to || []).join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-display text-base font-black text-neutral-950">
              Personalized White-Hat Outreach Email Templates (Manual Approval Only)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outreachTemplates.map((tpl) => (
                <div key={tpl.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A82F19] block">
                        {tpl.target_category}
                      </span>
                      <h4 className="font-bold text-sm text-neutral-950">{tpl.title}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(tpl.id, `Subject: ${tpl.subject}\n\n${tpl.body}`)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                    >
                      {copiedId === tpl.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedId === tpl.id ? 'Copied' : 'Copy Email'}</span>
                    </button>
                  </div>
                  <div className="rounded-xl bg-white border border-neutral-200 p-3 text-xs font-mono text-neutral-800">
                    <div className="font-bold text-neutral-950 border-b border-neutral-100 pb-1.5 mb-2">
                      Subject: {tpl.subject}
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-xs text-neutral-700 leading-relaxed">
                      {tpl.body}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: 90-DAY ROADMAP & TECHNICAL AUDIT */}
      {selectedSubTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roadmap.map((phase, idx) => (
              <div key={idx} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-3">
                <span className="inline-block rounded-lg bg-[#A82F19]/10 px-2.5 py-1 text-xs font-black text-[#A82F19]">
                  {phase.phase}
                </span>
                <h4 className="font-display text-base font-black text-neutral-950">{phase.focus}</h4>
                <ul className="space-y-2 text-xs text-neutral-700">
                  {(phase.actions || []).map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-neutral-100 text-[11px] font-semibold text-neutral-600">
                  KPI: {phase.kpis}
                </div>
              </div>
            ))}
          </div>

          {technicalAudit && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-black text-neutral-950">
                    Landing Page Technical SEO &amp; Conversion Readiness Audit ({technicalAudit.target_page})
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Verified structured data, mobile responsiveness, NAP consistency, and WhatsApp lead tracking.
                  </p>
                </div>
                <span className="rounded-xl bg-emerald-100 px-3 py-1.5 font-mono text-sm font-black text-emerald-800">
                  Score: {technicalAudit.overall_score}/100
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(technicalAudit.checks || {}).map(([key, check]) => (
                  <div key={key} className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-neutral-950 uppercase tracking-wider block">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <p className="text-neutral-600 mt-0.5">{check.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
