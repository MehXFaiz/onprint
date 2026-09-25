import React, { useState, useEffect, useMemo } from 'react'
import {
  Target,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Sparkles,
  MapPin,
  Clock,
  Box,
  CreditCard,
  Building2,
  Send,
  RefreshCw,
  TrendingUp,
  Download,
  ChevronDown,
  ChevronUp,
  Table as TableIcon,
  BookOpen,
  Compass,
  FileSpreadsheet,
} from 'lucide-react'
import Button from '../../../components/Button'
import { getDlxprintGapAnalysis, getCompetitorGaps } from '../../../services/seo'

export default function CompeteWithDlxPrintTab({ showToast }) {
  const [loading, setLoading] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState('matrix') // 'matrix' | 'playbook' | 'clusters'
  const [data, setData] = useState(null)
  const [gaps10Col, setGaps10Col] = useState([])
  const [search, setSearch] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedIntent, setSelectedIntent] = useState('all')
  const [expandedRowId, setExpandedRowId] = useState(null)

  const fetchAnalysis = async () => {
    setLoading(true)
    try {
      const [resAnalysis, resGaps] = await Promise.all([
        getDlxprintGapAnalysis(),
        getCompetitorGaps(),
      ])

      if (resAnalysis?.success) {
        setData(resAnalysis.data)
      } else {
        showToast?.('Failed to load DLXPrint analysis', 'error')
      }

      if (resGaps?.success && Array.isArray(resGaps.data)) {
        setGaps10Col(resGaps.data)
      } else if (resGaps?.data?.items && Array.isArray(resGaps.data.items)) {
        setGaps10Col(resGaps.data.items)
      }
    } catch (err) {
      showToast?.('Error loading competitor data: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [])

  const gaps = data?.gaps || []
  const profile = data?.profile || {}
  const diffMatrix = data?.differentiationMatrix || []
  const summary = data?.summary || {}
  const topActions = data?.topCompetitiveActions || []

  // Filtered 10-column gaps
  const filtered10ColGaps = useMemo(() => {
    return gaps10Col.filter((g) => {
      const s = search.toLowerCase().trim()
      const matchSearch =
        !s ||
        g.competitor_topic?.toLowerCase().includes(s) ||
        g.missing_topic?.toLowerCase().includes(s) ||
        g.keyword_opportunity?.toLowerCase().includes(s) ||
        g.recommended_content?.toLowerCase().includes(s) ||
        g.onprint_url?.toLowerCase().includes(s) ||
        g.geo_opportunity?.toLowerCase().includes(s)

      const matchPriority =
        selectedPriority === 'all' ||
        (g.priority || '').toLowerCase() === selectedPriority.toLowerCase()

      const matchIntent =
        selectedIntent === 'all' ||
        (g.search_intent || '').toLowerCase().includes(selectedIntent.toLowerCase())

      return matchSearch && matchPriority && matchIntent
    })
  }, [gaps10Col, search, selectedPriority, selectedIntent])

  // CSV Export for 10-Column Matrix
  const handleExportCsv = () => {
    if (!filtered10ColGaps.length) {
      showToast?.('No records to export', 'warning')
      return
    }

    const headers = [
      'ID',
      'Competitor URL',
      'Competitor Topic',
      'ONPRINT URL',
      'Missing Topic Gap',
      'Keyword Opportunity',
      'Search Intent',
      'Recommended Content Strategy',
      'Internal Link Strategy',
      'Geographic Advantage',
      'Priority',
    ]

    const csvRows = filtered10ColGaps.map((g, idx) => [
      idx + 1,
      `"${(g.competitor_url || '').replace(/"/g, '""')}"`,
      `"${(g.competitor_topic || '').replace(/"/g, '""')}"`,
      `"${(g.onprint_url || '').replace(/"/g, '""')}"`,
      `"${(g.missing_topic || '').replace(/"/g, '""')}"`,
      `"${(g.keyword_opportunity || '').replace(/"/g, '""')}"`,
      `"${(g.search_intent || '').replace(/"/g, '""')}"`,
      `"${(g.recommended_content || '').replace(/"/g, '""')}"`,
      `"${(g.internal_link_opportunity || '').replace(/"/g, '""')}"`,
      `"${(g.geo_opportunity || '').replace(/"/g, '""')}"`,
      `"${(g.priority || '').replace(/"/g, '""')}"`,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `onprint-vs-dlxprint-gap-matrix-${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast?.('Competitor Gap Matrix exported to CSV', 'success')
  }

  // 11 Clusters Summary
  const clusters = [
    { name: 'Printing Services Dubai', target: '/printing-services-dubai', keywordsCount: 20, focus: 'General & Commercial Printing' },
    { name: 'Business Cards Dubai', target: '/business-card-printing-dubai', keywordsCount: 20, focus: '600gsm Cotton, Spot UV, Luxury' },
    { name: 'Large Format & Signage', target: '/large-format-printing-dubai', keywordsCount: 20, focus: 'Banners, Rollups, 3D Illuminated' },
    { name: 'Custom Packaging & Boxes', target: '/packaging-printing-dubai', keywordsCount: 20, focus: 'Rigid Boxes, Perfume, Low-MOQ 100' },
    { name: 'Promotional & Corporate Gifts', target: '/promotional-printing-dubai', keywordsCount: 20, focus: 'Executive Swag, Pens, Drinkware' },
    { name: 'Custom Stickers & Labels', target: '/sticker-printing-dubai', keywordsCount: 20, focus: 'Roll Labels, White Ink, Waterproof' },
    { name: 'Flyers, Brochures & Folders', target: '/flyer-printing-dubai', keywordsCount: 20, focus: 'Corporate Marketing Collateral' },
    { name: 'Acrylic Displays & Badges', target: '/signage-printing-dubai', keywordsCount: 20, focus: 'Reception Signs, Metal Badges' },
    { name: 'Eco-Friendly Printing', target: '/corporate-printing-dubai', keywordsCount: 20, focus: 'FSC Certified, Kraft, Soy Inks' },
    { name: 'Exhibition & Event Printing', target: '/large-format-printing-dubai', keywordsCount: 20, focus: 'DWTC Rush Displays & Backdrops' },
    { name: 'Corporate Uniforms & Apparel', target: '/promotional-printing-dubai', keywordsCount: 20, focus: 'Embroidery & DTF Printed Apparel' },
  ]

  if (loading && !data && gaps10Col.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
        <RefreshCw className="h-8 w-8 animate-spin text-[#A82F19] mb-3" />
        <p className="text-sm font-semibold">Loading DLXPrint Competitive Intelligence...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Context */}
      <div className="rounded-3xl border border-neutral-200/80 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-[#A82F19]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#A82F19]/30 border border-[#A82F19]/40 px-3 py-1 text-xs font-bold text-red-200">
              <Target className="h-3.5 w-3.5 text-[#A82F19]" />
              Competitor Gap Intelligence • DLXPrint (dlxprint.com)
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
              Head-to-Head Competitor Gap Matrix
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Exhaustive competitive architecture mapping ONPRINT (Al Quoz, Dubai) against Deluxe Printing (Al Qusais).
              Leveraging central Dubai proximity, low-MOQ luxury packaging, and same-day express turnaround to capture high-value corporate demand.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAnalysis}
              className="border-neutral-700 bg-neutral-800/80 hover:bg-neutral-700 text-white text-xs font-bold"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              Refresh Intelligence
            </Button>
            <a
              href="https://dlxprint.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors"
            >
              <span>Inspect dlxprint.com</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Head-to-Head Comparison Summary Cards */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-neutral-800 pt-6">
          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold">
              <MapPin className="h-4 w-4 text-[#A82F19]" />
              <span>Location Moat</span>
            </div>
            <div className="mt-2 text-lg sm:text-xl font-black text-white">Al Quoz vs Al Qusais</div>
            <p className="mt-1 text-[11px] text-neutral-400">10–15m to DIFC, Downtown, Bay</p>
          </div>

          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold">
              <Box className="h-4 w-4 text-amber-500" />
              <span>Packaging Moat</span>
            </div>
            <div className="mt-2 text-lg sm:text-xl font-black text-white">Rigid Boxes (MOQ 100)</div>
            <p className="mt-1 text-[11px] text-neutral-400">In-house die-making vs 1,000 MOQ</p>
          </div>

          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold">
              <CreditCard className="h-4 w-4 text-emerald-400" />
              <span>Finishing Moat</span>
            </div>
            <div className="mt-2 text-lg sm:text-xl font-black text-white">600gsm Cotton Duplex</div>
            <p className="mt-1 text-[11px] text-neutral-400">Painted edge vs 350gsm standard</p>
          </div>

          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span>Target Coverage</span>
            </div>
            <div className="mt-2 text-lg sm:text-xl font-black text-white">220 Keywords / 11 Hubs</div>
            <p className="mt-1 text-[11px] text-neutral-400">{gaps10Col.length || 16} competitive gaps mapped</p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'matrix'
              ? 'bg-[#A82F19] text-white shadow-sm'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <TableIcon className="h-3.5 w-3.5" />
          <span>10-Column Competitor Gap Matrix</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeSubTab === 'matrix' ? 'bg-black/20 text-white' : 'bg-neutral-200 text-neutral-700'}`}>
            {gaps10Col.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('playbook')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'playbook'
              ? 'bg-[#A82F19] text-white shadow-sm'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Strategic Moat & Playbook</span>
        </button>

        <button
          onClick={() => setActiveSubTab('clusters')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'clusters'
              ? 'bg-[#A82F19] text-white shadow-sm'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>220-Keyword Cluster Coverage</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeSubTab === 'clusters' ? 'bg-black/20 text-white' : 'bg-neutral-200 text-neutral-700'}`}>
            11
          </span>
        </button>
      </div>

      {/* VIEW 1: 10-COLUMN COMPETITOR GAP MATRIX */}
      {activeSubTab === 'matrix' && (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-[#A82F19]" />
                <h3 className="font-display text-base font-bold text-neutral-900">
                  DLXPrint 10-Column Competitor Gap Matrix
                </h3>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Exact 10-column competitor intelligence identifying target URLs, keywords, search intents, content strategy, link graph, and Al Quoz local advantage.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-neutral-500">
                Showing {filtered10ColGaps.length} of {gaps10Col.length} records
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
                className="text-xs font-bold border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                <Download className="h-3.5 w-3.5 mr-1.5 text-neutral-500" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search topics, keywords, gaps, URLs..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-[#A82F19]"
              />
            </div>

            <div>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-[#A82F19]"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>
            </div>

            <div>
              <select
                value={selectedIntent}
                onChange={(e) => setSelectedIntent(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-[#A82F19]"
              >
                <option value="all">All Search Intents</option>
                <option value="commercial">Commercial</option>
                <option value="transactional">Transactional</option>
                <option value="informational">Informational</option>
              </select>
            </div>
          </div>

          {/* 10-Column Responsive Table */}
          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="w-full text-left text-xs text-neutral-700 border-collapse min-w-[1200px]">
              <thead className="bg-neutral-900 text-white text-[11px] font-bold uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">#</th>
                  <th className="py-3 px-3 w-44">1. Competitor URL</th>
                  <th className="py-3 px-3 w-40">2. Competitor Topic</th>
                  <th className="py-3 px-3 w-44 text-[#FFA590]">3. ONPRINT URL</th>
                  <th className="py-3 px-3 w-56">4. Missing Topic Gap</th>
                  <th className="py-3 px-3 w-44 text-amber-300">5. Keyword Opportunity</th>
                  <th className="py-3 px-3 w-28 text-center">6. Intent</th>
                  <th className="py-3 px-3 w-64">7. Recommended Content</th>
                  <th className="py-3 px-3 w-52">8. Internal Link Strategy</th>
                  <th className="py-3 px-3 w-56">9. GEO Advantage (Al Quoz)</th>
                  <th className="py-3 px-3 w-24 text-center">10. Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {filtered10ColGaps.map((g, idx) => {
                  const isExpanded = expandedRowId === g.id || expandedRowId === idx
                  return (
                    <React.Fragment key={g.id || idx}>
                      <tr
                        className={`hover:bg-neutral-50/80 transition-colors ${
                          idx % 2 === 1 ? 'bg-neutral-50/40' : 'bg-white'
                        }`}
                      >
                        {/* Index */}
                        <td className="py-3 px-3 text-center text-neutral-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>

                        {/* 1. Competitor URL */}
                        <td className="py-3 px-3 font-mono text-[11px]">
                          <a
                            href={g.competitor_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-600 hover:text-neutral-900 hover:underline inline-flex items-center gap-1 max-w-[160px] truncate"
                            title={g.competitor_url}
                          >
                            <span>{(g.competitor_url || '').replace('https://dlxprint.com', '') || '/'}</span>
                            <ExternalLink className="h-3 w-3 shrink-0 text-neutral-400" />
                          </a>
                        </td>

                        {/* 2. Competitor Topic */}
                        <td className="py-3 px-3 font-semibold text-neutral-800">
                          {g.competitor_topic}
                        </td>

                        {/* 3. ONPRINT URL */}
                        <td className="py-3 px-3 font-mono text-[11px]">
                          <a
                            href={g.onprint_url}
                            className="font-bold text-[#A82F19] hover:underline inline-flex items-center gap-1"
                            title={g.onprint_url}
                          >
                            <span>{g.onprint_url}</span>
                          </a>
                        </td>

                        {/* 4. Missing Topic Gap */}
                        <td className="py-3 px-3 text-neutral-900 font-medium leading-relaxed">
                          {g.missing_topic}
                        </td>

                        {/* 5. Keyword Opportunity */}
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-neutral-900 bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200/60 inline-block">
                            {g.keyword_opportunity}
                          </span>
                        </td>

                        {/* 6. Search Intent */}
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block font-bold text-[10px] uppercase px-2 py-0.5 rounded-full ${
                              g.search_intent?.toLowerCase().includes('trans')
                                ? 'bg-purple-100 text-purple-800'
                                : g.search_intent?.toLowerCase().includes('comm')
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {g.search_intent}
                          </span>
                        </td>

                        {/* 7. Recommended Content */}
                        <td className="py-3 px-3 text-neutral-600 leading-snug">
                          {g.recommended_content}
                        </td>

                        {/* 8. Internal Link Strategy */}
                        <td className="py-3 px-3 text-neutral-600 text-[11px] leading-snug">
                          {g.internal_link_opportunity}
                        </td>

                        {/* 9. GEO Advantage */}
                        <td className="py-3 px-3 text-neutral-700 text-[11px] leading-snug bg-red-50/20">
                          <div className="flex items-start gap-1">
                            <MapPin className="h-3 w-3 text-[#A82F19] shrink-0 mt-0.5" />
                            <span>{g.geo_opportunity}</span>
                          </div>
                        </td>

                        {/* 10. Priority */}
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full ${
                              g.priority === 'Critical'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : g.priority === 'High'
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {g.priority}
                          </span>
                        </td>
                      </tr>
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: STRATEGIC MOAT & PLAYBOOK */}
      {activeSubTab === 'playbook' && (
        <div className="space-y-6">
          {/* Top 5 Priority Actions Playbook */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-[#A82F19]" />
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Top 5 Strategic Actions to Outperform DLXPrint
                </h3>
              </div>
              <span className="text-xs font-semibold text-neutral-500">Ranked by Commercial ROI</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topActions.map((action, idx) => (
                <div
                  key={action.gap_id || idx}
                  className="rounded-xl border border-neutral-200/70 bg-neutral-50/60 p-4 hover:border-neutral-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                        Step {idx + 1}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          action.priority === 'Critical'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {action.priority} Priority
                      </span>
                    </div>
                    <h4 className="mt-2 text-xs font-bold text-neutral-900">{action.title}</h4>
                    <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">{action.action}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-mono text-[11px] truncate max-w-[180px]">
                      {action.target_page}
                    </span>
                    <a
                      href={action.target_page}
                      className="font-bold text-[#A82F19] hover:underline flex items-center gap-1"
                    >
                      View Page &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Head-to-Head Differentiation Matrix */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Layers className="h-5 w-5 text-neutral-800" />
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Core Commercial Differentiation Pillars
                </h3>
              </div>
              <span className="text-xs font-medium text-neutral-500">5 Strategic Vectors</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600">
                <thead className="bg-neutral-50 text-[11px] font-extrabold uppercase text-neutral-500 border-b border-neutral-100">
                  <tr>
                    <th className="py-3 px-4">Capability Pillar</th>
                    <th className="py-3 px-4 text-[#A82F19]">ONPRINT Advantage (Al Quoz)</th>
                    <th className="py-3 px-4">DLXPrint Standard (Al Qusais)</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4">Market Execution Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {diffMatrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-neutral-900 whitespace-nowrap">
                        {item.pillar}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-neutral-800 bg-red-50/30">
                        {item.onprint}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-500">
                        {item.dlxprint}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] px-2 py-0.5">
                          {item.onprintAdvantageScore}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 italic">
                        {item.strategicAngle}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: 220-KEYWORD CLUSTER COVERAGE */}
      {activeSubTab === 'clusters' && (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#A82F19]" />
              <h3 className="font-display text-base font-bold text-neutral-900">
                11 Commercial Keyword Clusters (220 Keywords Total)
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Each commercial cluster targets exactly 20 commercial, transactional, and local search queries specifically chosen to capture search share from DLXPrint in Dubai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusters.map((c, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-4 hover:border-neutral-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                      Cluster {idx + 1}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {c.keywordsCount} Keywords
                    </span>
                  </div>
                  <h4 className="mt-2.5 font-bold text-neutral-900 text-sm">{c.name}</h4>
                  <p className="mt-1 text-xs text-neutral-600">
                    <strong className="text-neutral-700">Commercial Focus:</strong> {c.focus}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-mono text-[11px] truncate max-w-[170px]">
                    {c.target}
                  </span>
                  <a
                    href={c.target}
                    className="font-bold text-[#A82F19] hover:underline flex items-center gap-1"
                  >
                    Target Hub &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-neutral-900 text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#FFA590]">Complete Keyword Architecture</div>
              <div className="text-sm font-semibold text-neutral-200 mt-1">
                All 220 commercial keywords are fully mapped to dedicated URLs with zero intent cannibalization.
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-neutral-400">Manage via:</span>
              <span className="text-xs font-mono font-bold bg-neutral-800 text-white px-3 py-1.5 rounded-lg border border-neutral-700">
                SEO Keywords Tab
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
