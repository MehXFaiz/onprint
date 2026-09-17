import { useState, useEffect, useMemo } from 'react'
import {
  RotateCcw,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Edit2,
  X,
  Play,
} from 'lucide-react'
import Button from '../../../components/Button'
import {
  getRedirects,
  createRedirect,
  updateRedirect,
  deleteRedirect,
} from '../../../services/seo'

export default function SeoRedirectsTab({ showToast }) {
  const [redirects, setRedirects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modals & form state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const initialForm = {
    source_path: '',
    target_path: '',
    status_code: 301,
    notes: '',
    is_active: 1,
  }
  const [formData, setFormData] = useState(initialForm)

  // Simulator state
  const [testInput, setTestInput] = useState('')
  const [testResult, setTestResult] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await getRedirects()
      if (res?.success) {
        setRedirects(res.data || [])
      }
    } catch (err) {
      showToast?.('Failed to load redirects: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    let src = formData.source_path.trim()
    let tgt = formData.target_path.trim()

    if (!src.startsWith('/')) src = '/' + src
    if (!tgt.startsWith('/') && !tgt.startsWith('http')) tgt = '/' + tgt

    if (src === tgt) {
      showToast?.('Source and Target cannot be identical', 'error')
      return
    }

    setActionLoading(true)
    try {
      const payload = {
        source_path: src,
        target_path: tgt,
        status_code: Number(formData.status_code),
        notes: formData.notes,
        is_active: formData.is_active ? 1 : 0,
      }

      if (editingItem) {
        await updateRedirect(editingItem.id, payload)
        showToast?.('Redirect updated successfully!')
      } else {
        await createRedirect(payload)
        showToast?.('Redirect rule created successfully!')
      }

      setShowAddModal(false)
      setEditingItem(null)
      setFormData(initialForm)
      loadData()
    } catch (err) {
      showToast?.('Failed to save redirect: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id, src) => {
    if (!window.confirm(`Delete redirect rule for "${src}"?`)) return
    try {
      const res = await deleteRedirect(id)
      if (res?.success) {
        showToast?.('Redirect rule deleted.')
        loadData()
      }
    } catch (err) {
      showToast?.('Failed to delete redirect: ' + (err.response?.data?.message || err.message), 'error')
    }
  }

  const handleTestRedirect = (e) => {
    e.preventDefault()
    if (!testInput.trim()) return

    let path = testInput.trim().toLowerCase()
    if (!path.startsWith('/')) path = '/' + path
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)

    const match = redirects.find(
      (r) => r.is_active && r.source_path.toLowerCase().replace(/\/$/, '') === path
    )

    if (match) {
      setTestResult({
        matched: true,
        source: path,
        target: match.target_path,
        statusCode: match.status_code,
        notes: match.notes,
      })
    } else {
      setTestResult({
        matched: false,
        source: path,
      })
    }
  }

  const summary = useMemo(() => {
    const total = redirects.length
    const p301 = redirects.filter((r) => r.status_code === 301).length
    const p302 = redirects.filter((r) => r.status_code === 302).length
    const hits = redirects.reduce((sum, r) => sum + (Number(r.hit_count) || 0), 0)
    return { total, p301, p302, hits }
  }, [redirects])

  const filteredList = useMemo(() => {
    return redirects.filter((r) => {
      const s = search.toLowerCase().trim()
      const matchesSearch =
        !s ||
        r.source_path.toLowerCase().includes(s) ||
        r.target_path.toLowerCase().includes(s) ||
        (r.notes || '').toLowerCase().includes(s)

      const matchesStatus =
        statusFilter === 'all' || String(r.status_code) === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [redirects, search, statusFilter])

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 text-xs font-bold text-[#A82F19]">
                <RotateCcw className="h-3.5 w-3.5" />
                HTTP Status & 404 Defense
              </span>
              <span className="text-xs font-semibold text-neutral-500">Requirement 28</span>
            </div>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
              Redirect & 404 Mitigation Manager
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
              High-performance Express middleware intercepts deprecated URLs, legacy catalog paths, and spelling errors before rendering to protect PageRank and preserve link equity.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="accent"
              size="sm"
              onClick={() => {
                setEditingItem(null)
                setFormData(initialForm)
                setShowAddModal(true)
              }}
              className="text-xs font-bold bg-[#A82F19] text-white hover:bg-[#8f2714]"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Redirect Rule
            </Button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-neutral-200/70 bg-neutral-50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Active Rules</div>
            <div className="mt-1 text-2xl font-black text-neutral-900">{summary.total}</div>
            <div className="mt-0.5 text-[10px] text-neutral-500">Routing in memory</div>
          </div>

          <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">301 Permanent</div>
            <div className="mt-1 text-2xl font-black text-emerald-700">{summary.p301}</div>
            <div className="mt-0.5 text-[10px] text-emerald-600">Full equity pass</div>
          </div>

          <div className="rounded-xl border border-blue-200/70 bg-blue-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">302 Temporary</div>
            <div className="mt-1 text-2xl font-black text-blue-700">{summary.p302}</div>
            <div className="mt-0.5 text-[10px] text-blue-600">Short-term routing</div>
          </div>

          <div className="rounded-xl border border-[#A82F19]/20 bg-[#A82F19]/5 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#A82F19]">Hits Intercepted</div>
            <div className="mt-1 text-2xl font-black text-[#A82F19]">{summary.hits}</div>
            <div className="mt-0.5 text-[10px] text-neutral-500">404s prevented</div>
          </div>
        </div>
      </div>

      {/* Redirect Simulator Bar */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
        <form onSubmit={handleTestRedirect} className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Test any path (e.g. /printing-services or /services/offset-printing)..."
              value={testInput}
              onChange={(e) => {
                setTestInput(e.target.value)
                setTestResult(null)
              }}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 focus:outline-none focus:border-[#A82F19] font-mono"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="text-xs font-bold shrink-0 w-full sm:w-auto"
          >
            <Play className="h-3.5 w-3.5 mr-1.5 text-[#A82F19]" />
            Test Path
          </Button>
        </form>

        {testResult && (
          <div className="mt-3 text-xs p-3 rounded-xl border bg-neutral-50 flex items-center gap-3">
            {testResult.matched ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-700">Intercepted!</span>{' '}
                  <span className="font-mono text-neutral-800">{testResult.source}</span> redirects with{' '}
                  <span className="font-bold text-neutral-900">{testResult.statusCode}</span> to{' '}
                  <span className="font-mono font-bold text-[#A82F19]">{testResult.target}</span>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <div className="text-neutral-700">
                  <span className="font-semibold text-neutral-900">No redirect rule matched:</span>{' '}
                  <span className="font-mono text-neutral-800">{testResult.source}</span> will proceed to normal route handler or 404.
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search source, target, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:outline-none focus:border-[#A82F19]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white text-neutral-700 font-semibold focus:outline-none focus:border-[#A82F19] w-full sm:w-auto"
        >
          <option value="all">All HTTP Codes</option>
          <option value="301">301 Moved Permanently</option>
          <option value="302">302 Found (Temporary)</option>
        </select>
      </div>

      {/* Redirects Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-500">
            Loading redirect rules...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-sm text-neutral-500">
            No redirect rules match your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Source Request Path</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4">Target Destination</th>
                  <th className="py-3 px-3">Hits Intercepted</th>
                  <th className="py-3 px-3">Last Accessed</th>
                  <th className="py-3 px-3">Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                      {item.source_path}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block font-extrabold text-[10px] px-2 py-0.5 rounded-full ${
                          item.status_code === 301
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {item.status_code}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[#A82F19] font-bold">
                      <div className="flex items-center gap-1.5">
                        <ArrowRight className="h-3 w-3 text-neutral-400 shrink-0" />
                        <span className="truncate max-w-xs">{item.target_path}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-neutral-700">
                      {item.hit_count || 0}
                    </td>

                    <td className="py-3 px-3 text-neutral-500 text-[11px]">
                      {item.last_accessed_at
                        ? new Date(item.last_accessed_at).toLocaleDateString()
                        : 'Never'}
                    </td>

                    <td className="py-3 px-3 text-neutral-500 text-[11px] max-w-xs truncate">
                      {item.notes || '—'}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(item)
                            setFormData({
                              source_path: item.source_path,
                              target_path: item.target_path,
                              status_code: item.status_code,
                              notes: item.notes || '',
                              is_active: item.is_active ? 1 : 0,
                            })
                            setShowAddModal(true)
                          }}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 cursor-pointer"
                          title="Edit Rule"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.source_path)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                          title="Delete Rule"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-lg text-neutral-900">
                {editingItem ? 'Edit Redirect Rule' : 'New 301/302 Redirect Rule'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingItem(null)
                }}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Source Request Path *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/old-catalog/business-cards"
                  value={formData.source_path}
                  onChange={(e) => setFormData({ ...formData, source_path: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-mono text-xs focus:outline-none focus:border-[#A82F19]"
                />
                <span className="text-[10px] text-neutral-400 mt-0.5 block">
                  The incoming 404 or deprecated URL path
                </span>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Target Destination URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/business-card-printing-dubai"
                  value={formData.target_path}
                  onChange={(e) => setFormData({ ...formData, target_path: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-mono text-xs focus:outline-none focus:border-[#A82F19]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    HTTP Status Code
                  </label>
                  <select
                    value={formData.status_code}
                    onChange={(e) => setFormData({ ...formData, status_code: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#A82F19]"
                  >
                    <option value={301}>301 Permanent (SEO Best)</option>
                    <option value={302}>302 Found (Temporary)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Rule Status
                  </label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#A82F19]"
                  >
                    <option value={1}>Active (Enabled)</option>
                    <option value={0}>Disabled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Administrative Notes / Rationale
                </label>
                <input
                  type="text"
                  placeholder="Legacy WordPress URL migration..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#A82F19]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  size="sm"
                  disabled={actionLoading}
                  className="text-xs font-bold bg-[#A82F19] text-white hover:bg-[#8f2714]"
                >
                  {actionLoading ? 'Saving...' : editingItem ? 'Update Rule' : 'Create Rule'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
