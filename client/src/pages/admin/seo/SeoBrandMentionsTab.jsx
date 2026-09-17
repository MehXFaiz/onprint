import { useState, useEffect, useMemo } from 'react'
import {
  Sparkles,
  Plus,
  Link2,
  ExternalLink,
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Search,
  RefreshCw,
  X,
} from 'lucide-react'
import Button from '../../../components/Button'
import {
  getBrandMentions,
  createBrandMention,
  updateBrandMention,
  deleteBrandMention,
} from '../../../services/seo'

export default function SeoBrandMentionsTab({ showToast }) {
  const [mentions, setMentions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPitchModal, setShowPitchModal] = useState(null)
  const [copied, setCopied] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const initialForm = {
    source_url: '',
    mentioning_domain: '',
    article_title: '',
    mention_snippet: '',
    domain_authority: 45,
    is_linked: 0,
    outreach_status: 'IDENTIFIED',
    contact_email: '',
  }
  const [formData, setFormData] = useState(initialForm)

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await getBrandMentions()
      if (res?.success) {
        setMentions(res.data || [])
      }
    } catch (err) {
      showToast?.('Failed to load brand mentions: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      await createBrandMention(formData)
      showToast?.('Brand mention logged successfully!')
      setShowAddModal(false)
      setFormData(initialForm)
      loadData()
    } catch (err) {
      showToast?.('Failed to log mention: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status, isLinked) => {
    try {
      await updateBrandMention(id, {
        outreach_status: status,
        is_linked: isLinked !== undefined ? isLinked : undefined,
      })
      showToast?.('Mention updated successfully!')
      loadData()
    } catch (err) {
      showToast?.('Update failed: ' + (err.response?.data?.message || err.message), 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand mention record?')) return
    try {
      await deleteBrandMention(id)
      showToast?.('Mention deleted.')
      loadData()
    } catch (err) {
      showToast?.('Delete failed: ' + (err.response?.data?.message || err.message), 'error')
    }
  }

  const summary = useMemo(() => {
    const total = mentions.length
    const unlinked = mentions.filter((m) => !m.is_linked).length
    const secured = mentions.filter((m) => m.is_linked).length
    const contacted = mentions.filter((m) => m.outreach_status === 'CONTACTED').length
    return { total, unlinked, secured, contacted }
  }, [mentions])

  const filteredMentions = useMemo(() => {
    return mentions.filter((m) => {
      const s = search.toLowerCase().trim()
      const matchesSearch =
        !s ||
        (m.mentioning_domain || '').toLowerCase().includes(s) ||
        (m.article_title || '').toLowerCase().includes(s) ||
        (m.mention_snippet || '').toLowerCase().includes(s)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'unlinked' && !m.is_linked) ||
        (statusFilter === 'linked' && m.is_linked) ||
        m.outreach_status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [mentions, search, statusFilter])

  const generatePitchText = (item) => {
    return `Hi editorial team at ${item.mentioning_domain},

I was reading your excellent piece "${item.article_title || 'Recent article'}" and noticed your mention of ONPRINT:
"${item.mention_snippet || 'ONPRINT'}"

Thank you so much for featuring our Al Quoz pressroom! Would you consider hyperlinking "ONPRINT" directly to our website (https://0nprint.com) so your readers can easily explore our commercial printing and packaging portfolio?

Either way, thank you for the shoutout and keep up the great coverage!

Best regards,
ONPRINT Editorial & Press Team
Dubai, UAE`
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 text-xs font-bold text-[#A82F19]">
                <Sparkles className="h-3.5 w-3.5" />
                Unlinked Brand Mentions & PR
              </span>
              <span className="text-xs font-semibold text-neutral-500">Requirements 30 & 31</span>
            </div>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
              Brand Mention Tracker & Reclamation
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
              Tracks editorial citations and press mentions of &quot;ONPRINT&quot; and &quot;0nprint&quot; across UAE media and directories to convert unlinked brand equity into high-authority dofollow backlinks.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="accent"
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold bg-[#A82F19] text-white hover:bg-[#8f2714]"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Log Brand Mention
            </Button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-neutral-200/70 bg-neutral-50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Total Mentions</div>
            <div className="mt-1 text-2xl font-black text-neutral-900">{summary.total}</div>
            <div className="mt-0.5 text-[10px] text-neutral-500">Tracked in media</div>
          </div>

          <div className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Unlinked (Opportunity)</div>
            <div className="mt-1 text-2xl font-black text-amber-700">{summary.unlinked}</div>
            <div className="mt-0.5 text-[10px] text-amber-600">Prime link targets</div>
          </div>

          <div className="rounded-xl border border-blue-200/70 bg-blue-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Pitch Sent</div>
            <div className="mt-1 text-2xl font-black text-blue-700">{summary.contacted}</div>
            <div className="mt-0.5 text-[10px] text-blue-600">Awaiting editor reply</div>
          </div>

          <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Secured Backlinks</div>
            <div className="mt-1 text-2xl font-black text-emerald-700">{summary.secured}</div>
            <div className="mt-0.5 text-[10px] text-emerald-600">Converted to links</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search domain, article, or snippet..."
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
          <option value="all">All Mentions</option>
          <option value="unlinked">Unlinked Mentions Only</option>
          <option value="linked">Secured Backlinks</option>
          <option value="IDENTIFIED">Status: Identified</option>
          <option value="CONTACTED">Status: Contacted</option>
          <option value="CONVERTED">Status: Converted</option>
        </select>
      </div>

      {/* Mentions Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-500">
            Loading brand mentions...
          </div>
        ) : filteredMentions.length === 0 ? (
          <div className="p-12 text-center text-sm text-neutral-500">
            No brand mentions match the active filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Publication Domain & Title</th>
                  <th className="py-3 px-3">DR</th>
                  <th className="py-3 px-4">Brand Mention Snippet</th>
                  <th className="py-3 px-3">Linked?</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Outreach Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredMentions.map((item) => {
                  const isLinked = Boolean(item.is_linked)
                  return (
                    <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-neutral-900 truncate">
                          {item.mentioning_domain}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {item.article_title || 'Article Feature'}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-black text-xs text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-md">
                          DR {item.domain_authority || 40}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-sm text-neutral-700 italic text-[11px]">
                        &quot;{item.mention_snippet}&quot;
                      </td>

                      <td className="py-3 px-3">
                        {isLinked ? (
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            Active Link
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            Unlinked
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block font-extrabold text-[10px] px-2 py-0.5 rounded-full ${
                            item.outreach_status === 'CONVERTED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : item.outreach_status === 'CONTACTED'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {item.outreach_status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setShowPitchModal(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                            title="Generate Pitch"
                          >
                            <Mail className="h-3 w-3 text-[#A82F19]" />
                            Pitch
                          </button>

                          {!isLinked && (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => handleUpdateStatus(item.id, 'CONVERTED', 1)}
                              className="text-[11px] font-bold text-emerald-700 border-emerald-200 py-0.5 px-2"
                              title="Mark as Secured Link"
                            >
                              <Link2 className="h-3 w-3 mr-1" />
                              Linked
                            </Button>
                          )}

                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-neutral-400 hover:text-[#A82F19] rounded-lg hover:bg-neutral-100"
                            title="View Mention Live"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
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

      {/* Add Mention Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-lg text-neutral-900">Log Discovered Brand Mention</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Source URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://gulfnews.com/business/printing-trends"
                  value={formData.source_url}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-mono text-xs focus:outline-none focus:border-[#A82F19]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Domain</label>
                  <input
                    type="text"
                    placeholder="gulfnews.com"
                    value={formData.mentioning_domain}
                    onChange={(e) => setFormData({ ...formData, mentioning_domain: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#A82F19]"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Domain Rating (DR)</label>
                  <input
                    type="number"
                    value={formData.domain_authority}
                    onChange={(e) => setFormData({ ...formData, domain_authority: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#A82F19]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Article Headline</label>
                <input
                  type="text"
                  placeholder="Top Commercial Printing Facilities in Dubai 2026"
                  value={formData.article_title}
                  onChange={(e) => setFormData({ ...formData, article_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#A82F19]"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Brand Mention Snippet *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="...press facilities like ONPRINT located in Al Quoz provide express Heidelberg offset output..."
                  value={formData.mention_snippet}
                  onChange={(e) => setFormData({ ...formData, mention_snippet: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#A82F19]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Is Currently Linked?</label>
                  <select
                    value={formData.is_linked}
                    onChange={(e) => setFormData({ ...formData, is_linked: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#A82F19]"
                  >
                    <option value={0}>No (Unlinked Mention)</option>
                    <option value={1}>Yes (Active Backlink)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="editor@publication.ae"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#A82F19]"
                  />
                </div>
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
                  {actionLoading ? 'Saving...' : 'Save Mention'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Outreach Pitch Generator Modal */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-lg text-neutral-900">Editorial Reclamation Pitch</h3>
                <p className="text-xs text-neutral-500">Pre-composed email template for {showPitchModal.mentioning_domain}</p>
              </div>
              <button
                onClick={() => {
                  setShowPitchModal(null)
                  setCopied(false)
                }}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-neutral-900 text-neutral-100 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed relative">
              {generatePitchText(showPitchModal)}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-neutral-500">
                Target link: <span className="font-mono text-neutral-800 font-bold">https://0nprint.com</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(generatePitchText(showPitchModal))
                    setCopied(true)
                    showToast?.('Pitch copied to clipboard!')
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="text-xs font-bold"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Copy Email Pitch
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="accent"
                  size="sm"
                  onClick={async () => {
                    await handleUpdateStatus(showPitchModal.id, 'CONTACTED')
                    setShowPitchModal(null)
                  }}
                  className="text-xs font-bold bg-[#A82F19] text-white hover:bg-[#8f2714]"
                >
                  Mark as Contacted
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
