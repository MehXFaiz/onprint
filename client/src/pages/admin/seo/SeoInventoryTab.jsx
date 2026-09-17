import { useState, useEffect, useMemo } from 'react'
import {
  Layers,
  Search,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Link2,
  ShieldCheck,
  Download,
  Eye,
  Edit3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import Button from '../../../components/Button'
import { getSeoInventory } from '../../../services/seo'

export default function SeoInventoryTab({ showToast, onEditPage }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [crawling, setCrawling] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [issueFilter, setIssueFilter] = useState('all')
  const [expandedRow, setExpandedRow] = useState(null)

  const loadInventory = async (fresh = false) => {
    if (fresh) setCrawling(true)
    else setLoading(true)

    try {
      const res = await getSeoInventory({ fresh: fresh ? 'true' : undefined })
      if (res?.success) {
        setData(res.data)
        if (fresh) showToast?.('Crawl inventory refreshed successfully!')
      }
    } catch (err) {
      showToast?.('Failed to load SEO crawl inventory: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setLoading(false)
      setCrawling(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [])

  const inventory = data?.inventory || []
  const summary = data?.summary || {}

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const s = search.toLowerCase().trim()
      const matchesSearch =
        !s ||
        (item.path || '').toLowerCase().includes(s) ||
        (item.title || '').toLowerCase().includes(s) ||
        (item.target_keyword || '').toLowerCase().includes(s)

      const matchesType =
        typeFilter === 'all' || (item.page_type || '').toLowerCase() === typeFilter.toLowerCase()

      let matchesIssue = true
      if (issueFilter === 'orphan') {
        matchesIssue = item.internal_links_in <= 1
      } else if (issueFilter === 'thin') {
        matchesIssue = item.word_count < 300
      } else if (issueFilter === 'canonical') {
        matchesIssue = item.canonical_status === 'MISMATCH'
      } else if (issueFilter === 'missing_h1') {
        matchesIssue = !item.h1
      } else if (issueFilter === 'has_issues') {
        matchesIssue = (item.issues || []).length > 0
      }

      return matchesSearch && matchesType && matchesIssue
    })
  }, [inventory, search, typeFilter, issueFilter])

  const exportCsv = () => {
    if (!inventory.length) return
    const headers = [
      'Path',
      'Page Type',
      'HTTP Status',
      'Health Score',
      'Title',
      'Title Length',
      'Meta Description',
      'Word Count',
      'Internal Links In',
      'Internal Links Out',
      'Canonical Status',
      'Missing Alt Images',
      'Schema Types',
      'Issues',
    ]

    const rows = inventory.map((item) => [
      `"${item.path}"`,
      `"${item.page_type}"`,
      item.http_status,
      item.health_score,
      `"${(item.title || '').replace(/"/g, '""')}"`,
      item.title?.length || 0,
      `"${(item.meta_description || '').replace(/"/g, '""')}"`,
      item.word_count,
      item.internal_links_in,
      item.internal_links_out,
      `"${item.canonical_status}"`,
      item.missing_alt_count,
      `"${(item.schema_types || []).join(', ')}"`,
      `"${(item.issues || []).join('; ')}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `onprint_seo_inventory_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 text-xs font-bold text-[#A82F19]">
                <Layers className="h-3.5 w-3.5" />
                Live Architecture & Crawl
              </span>
              <span className="text-xs font-semibold text-neutral-500">Requirements 1 & 9</span>
            </div>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
              SEO Site Inventory & Orphan Pages
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
              20-column live crawl report of ONPRINT URLs covering canonical alignment, internal link depth, thin content, schema markup, and orphan pages.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={exportCsv}
              disabled={loading || !inventory.length}
              className="text-xs font-bold border-neutral-300"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export CSV
            </Button>

            <Button
              type="button"
              variant="accent"
              size="sm"
              onClick={() => loadInventory(true)}
              disabled={crawling || loading}
              className="text-xs font-bold bg-[#A82F19] text-white hover:bg-[#8f2714]"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${crawling ? 'animate-spin' : ''}`} />
              {crawling ? 'Crawling Pages...' : 'Re-Crawl Site Now'}
            </Button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-xl border border-neutral-200/70 bg-neutral-50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Total Crawled</div>
            <div className="mt-1 text-2xl font-black text-neutral-900">{summary.totalPages || 0}</div>
            <div className="mt-0.5 text-[10px] text-neutral-500">Live indexed routes</div>
          </div>

          <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Healthy Pages</div>
            <div className="mt-1 text-2xl font-black text-emerald-700">{summary.healthyPages || 0}</div>
            <div className="mt-0.5 text-[10px] text-emerald-600">Score &ge; 80 / 100</div>
          </div>

          <div className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Needs Optimization</div>
            <div className="mt-1 text-2xl font-black text-amber-700">{summary.needsOptimizationPages || 0}</div>
            <div className="mt-0.5 text-[10px] text-amber-600">Score &lt; 80 / 100</div>
          </div>

          <div className="rounded-xl border border-red-200/70 bg-red-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-red-800">Orphan Pages</div>
            <div className="mt-1 text-2xl font-black text-red-700">{summary.orphanPagesCount || 0}</div>
            <div className="mt-0.5 text-[10px] text-red-600">&le; 1 internal link in</div>
          </div>

          <div className="rounded-xl border border-neutral-200/70 bg-neutral-50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Thin Content</div>
            <div className="mt-1 text-2xl font-black text-neutral-900">{summary.thinContentCount || 0}</div>
            <div className="mt-0.5 text-[10px] text-neutral-500">&lt; 300 total words</div>
          </div>

          <div className="rounded-xl border border-[#A82F19]/20 bg-[#A82F19]/5 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#A82F19]">Avg Health Score</div>
            <div className="mt-1 text-2xl font-black text-[#A82F19]">{summary.avgHealthScore || 0}%</div>
            <div className="mt-0.5 text-[10px] text-neutral-500">Across all catalog</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search path, title, or target keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:outline-none focus:border-[#A82F19]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white text-neutral-700 font-semibold focus:outline-none focus:border-[#A82F19]"
          >
            <option value="all">All Page Types</option>
            <option value="commercial">Commercial Hubs</option>
            <option value="service">Services</option>
            <option value="product">Products</option>
            <option value="category">Categories</option>
            <option value="blog">Editorial Blog</option>
            <option value="core">Core Pages</option>
          </select>

          <select
            value={issueFilter}
            onChange={(e) => setIssueFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white text-neutral-700 font-semibold focus:outline-none focus:border-[#A82F19]"
          >
            <option value="all">All Issues & Health</option>
            <option value="orphan">Orphan Pages (&le; 1 link)</option>
            <option value="thin">Thin Content (&lt; 300 words)</option>
            <option value="missing_h1">Missing H1 Heading</option>
            <option value="canonical">Canonical Mismatch</option>
            <option value="has_issues">Any Flagged Issue</option>
          </select>
        </div>
      </div>

      {/* Crawl Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-500">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[#A82F19] mb-2" />
            Crawling ONPRINT URLs and computing health metrics...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-sm text-neutral-500">
            No pages match the selected search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">URL & Path</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Health</th>
                  <th className="py-3 px-3">Word Count</th>
                  <th className="py-3 px-3">Links In / Out</th>
                  <th className="py-3 px-3">Canonical</th>
                  <th className="py-3 px-3">Issues</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredItems.map((item) => {
                  const isExpanded = expandedRow === item.path
                  const isOrphan = item.internal_links_in <= 1
                  const isThin = item.word_count < 300
                  const hasIssues = (item.issues || []).length > 0

                  return (
                    <tr
                      key={item.path}
                      className={`hover:bg-neutral-50/60 transition-colors ${
                        isOrphan ? 'bg-red-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 max-w-xs sm:max-w-md">
                        <div className="font-bold text-neutral-900 truncate font-mono text-[11px]">
                          {item.path}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {item.title || '(No Title Specified)'}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-block uppercase font-bold text-[10px] tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                          {item.page_type}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 font-bold text-[11px] text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {item.http_status}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-black text-xs ${
                              item.health_score >= 80
                                ? 'text-emerald-700'
                                : item.health_score >= 60
                                ? 'text-amber-600'
                                : 'text-red-600'
                            }`}
                          >
                            {item.health_score}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold text-neutral-700">
                        {item.word_count}{' '}
                        {isThin && (
                          <span className="ml-1 text-[10px] text-amber-600 font-bold bg-amber-50 px-1 rounded">
                            Thin
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px]">
                        <span
                          className={`font-bold ${
                            isOrphan ? 'text-red-600 bg-red-50 px-1.5 py-0.5 rounded' : 'text-neutral-900'
                          }`}
                        >
                          {item.internal_links_in} in
                        </span>{' '}
                        <span className="text-neutral-400">/</span> {item.internal_links_out} out
                      </td>

                      <td className="py-3 px-3">
                        {item.canonical_status === 'MATCH' ? (
                          <span className="text-emerald-700 font-semibold text-[11px]">OK</span>
                        ) : (
                          <span className="text-red-600 font-bold text-[10px] bg-red-50 px-1.5 py-0.5 rounded">
                            MISMATCH
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {hasIssues ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="h-3 w-3" />
                            {item.issues.length} {item.issues.length === 1 ? 'flag' : 'flags'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            Clean
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setExpandedRow(isExpanded ? null : item.path)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 cursor-pointer"
                            title="View Crawl Details"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-neutral-500 hover:text-[#A82F19] rounded-lg hover:bg-neutral-100"
                            title="Visit URL"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>

                          {onEditPage && (
                            <button
                              type="button"
                              onClick={() => onEditPage(item)}
                              className="p-1.5 text-neutral-500 hover:text-[#A82F19] rounded-lg hover:bg-neutral-100 cursor-pointer"
                              title="Edit SEO"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expanded Row Detail Modal */}
      {expandedRow && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            {(() => {
              const item = inventory.find((i) => i.path === expandedRow)
              if (!item) return null
              return (
                <div>
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-black text-lg text-neutral-900">Crawl Inspection: {item.path}</h3>
                      <p className="text-xs text-neutral-500">Full 20-point on-page diagnostic</p>
                    </div>
                    <button
                      onClick={() => setExpandedRow(null)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3 rounded-xl">
                      <div>
                        <span className="text-neutral-500 font-bold">Canonical:</span>
                        <div className="font-mono text-[11px] truncate text-neutral-800">{item.canonical}</div>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-bold">Target Keyword:</span>
                        <div className="font-semibold text-neutral-800">{item.target_keyword || 'N/A'}</div>
                      </div>
                    </div>

                    <div>
                      <span className="text-neutral-500 font-bold">Meta Description:</span>
                      <p className="text-neutral-800 mt-0.5 bg-neutral-50 p-2.5 rounded-lg">
                        {item.meta_description || 'None'}
                      </p>
                    </div>

                    <div>
                      <span className="text-neutral-500 font-bold">H1 Heading:</span>
                      <p className="text-neutral-800 font-semibold mt-0.5">{item.h1 || 'Missing H1 Heading'}</p>
                    </div>

                    <div>
                      <span className="text-neutral-500 font-bold">Detected Schemas:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(item.schema_types || []).map((st) => (
                          <span key={st} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md">
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>

                    {item.issues?.length > 0 && (
                      <div className="border border-red-200 bg-red-50/50 p-3 rounded-xl">
                        <span className="text-red-700 font-bold block mb-1">Diagnostic Issues Detected:</span>
                        <ul className="list-disc list-inside space-y-1 text-red-600">
                          {item.issues.map((iss, i) => (
                            <li key={i}>{iss}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
