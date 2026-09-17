import { useState, useEffect } from 'react'
import {
  Bot,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  X,
  FileText,
  HelpCircle,
} from 'lucide-react'
import Button from '../../../components/Button'
import {
  getAiVisibility,
  updateAiVisibility,
  getCitationLogs,
  createCitationLog,
} from '../../../services/seo'

export default function AiVisibilityTab({ showToast }) {
  const [aiData, setAiData] = useState({ items: [], summary: {} })
  const [citationLogs, setCitationLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('All')

  // Modals
  const [showLogModal, setShowLogModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Log Form
  const initialLogForm = {
    ai_engine: 'Perplexity',
    query_prompt: '',
    onprint_cited: 1,
    citation_rank: 1,
    source_url_cited: 'https://0nprint.com/business-card-printing-dubai',
    extracted_snippet: '',
    competitors_cited: '',
    verification_notes: '',
  }
  const [logFormData, setLogFormData] = useState(initialLogForm)

  const loadData = async () => {
    setLoading(true)
    try {
      const [visRes, logRes] = await Promise.all([
        getAiVisibility(),
        getCitationLogs().catch(() => ({ data: [] })),
      ])
      if (visRes?.success) {
        setAiData(visRes.data)
      }
      if (logRes?.success) {
        setCitationLogs(logRes.data || [])
      }
    } catch (err) {
      showToast?.('Failed to load AI Visibility data: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateLog = async (e) => {
    e.preventDefault()
    if (!logFormData.query_prompt.trim()) {
      showToast?.('Please enter query prompt', 'error')
      return
    }
    setActionLoading(true)
    try {
      const res = await createCitationLog(logFormData)
      if (res?.success) {
        showToast?.('Citation verification logged successfully!')
        setShowLogModal(false)
        setLogFormData(initialLogForm)
        loadData()
      }
    } catch (err) {
      showToast?.('Failed to log verification: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const filteredItems = aiData.items?.filter((item) => {
    if (categoryFilter === 'All') return true
    return item.category?.toLowerCase() === categoryFilter.toLowerCase()
  }) || []

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 text-xs font-bold text-[#A82F19]">
                <Bot className="h-3.5 w-3.5" />
                AI Search Monitor
              </span>
              <span className="text-xs font-semibold text-neutral-500">Requirement 30</span>
            </div>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
              AI Engine Visibility Tracking (GEO)
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
              Real-time monitoring across 13 core Dubai commercial printing queries in ChatGPT Search, Perplexity, Google AI Overviews, Gemini, and Microsoft Copilot.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-1.5"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Log Real Citation</span>
            </Button>
          </div>
        </div>

        {/* Honest API Status Notice */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <p className="leading-relaxed">
            <strong>Honest Reporting Mode:</strong> When external third-party AI APIs (ChatGPT Search, Perplexity API) are disconnected, the status displays <code>Data unavailable — API not connected</code> rather than fabricating simulated citation percentages. Use the <em>&ldquo;Log Real Citation&rdquo;</em> button to record empirical manual query verifications.
          </p>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'General', 'Packaging', 'Business Cards', 'Corporate', 'Labels'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === cat
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 13 Queries Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 bg-neutral-50/80 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Tracked Search Query</th>
                <th className="px-5 py-3">Search Intent</th>
                <th className="px-5 py-3">Target URL</th>
                <th className="px-5 py-3 text-right">Status / Citation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-500">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto text-[#A82F19] mb-2" />
                    Loading tracked queries…
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-500">
                    No queries found in this category.
                  </td>
                </tr>
              ) : (
                filteredItems.map((q) => (
                  <tr key={q.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-neutral-700">
                        {q.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-neutral-900 max-w-md">
                      {q.query}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600 whitespace-nowrap">
                      {q.intent || 'Commercial'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-blue-700">
                      {q.target_url}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          q.status?.includes('unavailable')
                            ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {q.status || 'Data unavailable — API not connected'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Citation Verification Logs Section */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-neutral-900">
              Logged Real Citation Verifications
            </h3>
            <p className="text-xs text-neutral-500">
              Empirical verification records logged by technical staff testing queries in AI engines.
            </p>
          </div>
          <span className="text-xs font-bold text-neutral-600">
            {citationLogs.length} Verified Log{citationLogs.length === 1 ? '' : 's'}
          </span>
        </div>

        {citationLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500 bg-neutral-50 rounded-xl border border-neutral-100">
            No citation verifications logged yet. Click &ldquo;Log Real Citation&rdquo; to record manual tests from Perplexity or ChatGPT.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 text-xs">
            {citationLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">{log.ai_engine}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500">{new Date(log.tested_at || Date.now()).toLocaleDateString()}</span>
                    {log.onprint_cited ? (
                      <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                        ONPRINT Cited #{log.citation_rank || 1}
                      </span>
                    ) : (
                      <span className="rounded-full bg-neutral-100 text-neutral-600 px-2 py-0.5 text-[10px] font-bold">
                        Not Cited
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-neutral-800">
                    &ldquo;{log.query_prompt}&rdquo;
                  </p>
                  {log.extracted_snippet && (
                    <p className="text-neutral-600 bg-neutral-50 p-2 rounded-lg border border-neutral-100 text-[11px]">
                      {log.extracted_snippet}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Real Citation Modal */}
      {showLogModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowLogModal(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLogModal(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-xl font-black text-neutral-900">
              Log Real Citation Verification
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Record empirical results when manually querying Perplexity, ChatGPT Search, Gemini, or Copilot.
            </p>

            <form onSubmit={handleCreateLog} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">AI Engine Tested</label>
                  <select
                    value={logFormData.ai_engine}
                    onChange={(e) => setLogFormData({ ...logFormData, ai_engine: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  >
                    <option value="Perplexity">Perplexity</option>
                    <option value="ChatGPT Search">ChatGPT Search</option>
                    <option value="Google AI Overviews">Google AI Overviews</option>
                    <option value="Gemini">Gemini</option>
                    <option value="Microsoft Copilot">Microsoft Copilot</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Was ONPRINT Cited?</label>
                  <select
                    value={logFormData.onprint_cited}
                    onChange={(e) => setLogFormData({ ...logFormData, onprint_cited: Number(e.target.value) })}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  >
                    <option value={1}>Yes, Cited with link or mention</option>
                    <option value={0}>No, Not cited in top results</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Exact Query Prompt Entered</label>
                <input
                  type="text"
                  value={logFormData.query_prompt}
                  onChange={(e) => setLogFormData({ ...logFormData, query_prompt: e.target.value })}
                  placeholder="e.g. Best commercial printing press in Al Quoz Dubai"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Citation Rank / Position</label>
                  <input
                    type="number"
                    value={logFormData.citation_rank}
                    onChange={(e) => setLogFormData({ ...logFormData, citation_rank: Number(e.target.value) })}
                    min={1}
                    max={10}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Source URL Cited</label>
                  <input
                    type="text"
                    value={logFormData.source_url_cited}
                    onChange={(e) => setLogFormData({ ...logFormData, source_url_cited: e.target.value })}
                    placeholder="https://0nprint.com/..."
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Extracted AI Snippet / Mention</label>
                <textarea
                  rows={3}
                  value={logFormData.extracted_snippet}
                  onChange={(e) => setLogFormData({ ...logFormData, extracted_snippet: e.target.value })}
                  placeholder="Paste snippet where ONPRINT was mentioned in the AI response..."
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowLogModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="accent" size="sm" disabled={actionLoading}>
                  {actionLoading ? 'Saving…' : 'Save Verification Log'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
