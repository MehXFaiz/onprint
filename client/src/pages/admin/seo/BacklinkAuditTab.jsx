import React, { useState, useEffect, useCallback } from 'react'
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Upload,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  FileText,
  Mail,
  History,
  RefreshCw,
  CheckSquare,
  Square,
  Copy,
  Check,
  Info,
  Lock,
  Globe,
} from 'lucide-react'
import {
  getBacklinkAudit,
  importBacklinkCsv,
  reviewBacklinkItem,
  bulkReviewBacklinks,
  createRemovalRequest,
  updateRemovalRequest,
  generateDisavowFile,
} from '../../../services/seo'

const CLASSIFICATION_STYLES = {
  'Confirmed harmful': 'bg-red-500/15 text-red-400 border-red-500/30',
  'Suspicious — needs review': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  'Potentially legitimate': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Unknown: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
}

export default function BacklinkAuditTab({ showToast }) {
  const [auditData, setAuditData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subView, setSubView] = useState('domain_review') // domain_review | disavow_queue | removal_requests | csv_import | gsc_and_logs

  // Filters & pagination
  const [search, setSearch] = useState('')
  const [classificationFilter, setClassificationFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])

  // CSV Import state
  const [csvText, setCsvText] = useState('')
  const [csvFileName, setCsvFileName] = useState('0nprint.com-Latest links-2026-10-16.csv')
  const [csvPreview, setCsvPreview] = useState(null)
  const [importingCsv, setImportingCsv] = useState(false)

  // Disavow generator state
  const [disavowMode, setDisavowMode] = useState('approved_only')
  const [disavowNotes, setDisavowNotes] = useState('')
  const [generatingDisavow, setGeneratingDisavow] = useState(false)
  const [explicitUserConsent, setExplicitUserConsent] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  // New Removal Request form
  const [newRemoval, setNewRemoval] = useState({
    linking_domain: '',
    linking_url: '',
    contact_page: '',
    contact_email: '',
    status: 'sent',
    notes: '',
  })

  const notify = useCallback(
    (msg, type = 'success') => {
      if (typeof showToast === 'function') showToast(msg, type)
    },
    [showToast]
  )

  const fetchAudit = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getBacklinkAudit({
        classification: classificationFilter,
        source_dataset: sourceFilter,
        search: search || undefined,
        page,
        limit: 50,
      })
      if (res?.success) {
        setAuditData(res.data)
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to load backlink forensics data', 'error')
    } finally {
      setLoading(false)
    }
  }, [classificationFilter, sourceFilter, search, page, notify])

  useEffect(() => {
    fetchAudit()
  }, [fetchAudit])

  const handleSelectToggle = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    const items = auditData?.items || []
    if (selectedIds.length === items.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map((i) => i.id))
    }
  }

  const handleSingleReview = async (id, payload) => {
    try {
      const res = await reviewBacklinkItem(id, payload)
      if (res?.success) {
        notify(res.message || 'Updated backlink review')
        fetchAudit()
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Review update failed', 'error')
    }
  }

  const handleBulkAction = async (payload) => {
    if (selectedIds.length === 0) {
      notify('Select at least one domain row first', 'error')
      return
    }
    try {
      const res = await bulkReviewBacklinks({ ids: selectedIds, ...payload })
      if (res?.success) {
        notify(res.message)
        setSelectedIds([])
        fetchAudit()
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Bulk review failed', 'error')
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvFileName(file.name)
    const reader = new FileReader()
    reader.onload = (evt) => {
      setCsvText(String(evt.target?.result || ''))
      setCsvPreview(null)
    }
    reader.readAsText(file)
  }

  const handlePreviewCsv = async () => {
    if (!csvText.trim()) {
      notify('Paste CSV content or choose a CSV file first', 'error')
      return
    }
    setImportingCsv(true)
    try {
      const res = await importBacklinkCsv({
        csvText,
        fileName: csvFileName,
        previewOnly: true,
      })
      if (res?.success) {
        setCsvPreview(res.data)
        notify(res.message)
      }
    } catch (err) {
      notify(err.response?.data?.message || 'CSV parse failed', 'error')
    } finally {
      setImportingCsv(false)
    }
  }

  const handleCommitCsv = async () => {
    if (!csvText.trim()) return
    setImportingCsv(true)
    try {
      const res = await importBacklinkCsv({
        csvText,
        fileName: csvFileName,
        previewOnly: false,
      })
      if (res?.success) {
        notify(res.message)
        setCsvPreview(null)
        setSubView('domain_review')
        fetchAudit()
      }
    } catch (err) {
      notify(err.response?.data?.message || 'CSV import failed', 'error')
    } finally {
      setImportingCsv(false)
    }
  }

  const handleGenerateDisavow = async () => {
    if (!explicitUserConsent) {
      notify('Please check the explicit approval confirmation box before generating a disavow file version.', 'error')
      return
    }
    setGeneratingDisavow(true)
    try {
      const res = await generateDisavowFile({
        mode: disavowMode,
        notes: disavowNotes || `Manual generation (${disavowMode})`,
      })
      if (res?.success) {
        notify(res.message)
        fetchAudit()
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to generate disavow file', 'error')
    } finally {
      setGeneratingDisavow(false)
    }
  }

  const handleDownloadText = (content, filename, mime = 'text/plain;charset=utf-8') => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportClassifiedCsv = () => {
    const items = auditData?.items || []
    const headers = [
      'ID',
      'Referring Domain',
      'Linking URL',
      'Target URL',
      'Points to 0nprint.com',
      'Anchor Text',
      'Link Attribute',
      'Classification',
      'Risk Score',
      'Review Status',
      'Disavow Approved',
      'Disavow Scope',
      'Dataset Source',
      'Last Crawled',
      'Recommended Action',
      'Forensic Evidence',
    ]
    const esc = (v) => {
      const s = v === null || v === undefined ? '' : String(v)
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
    }
    const rows = items.map((i) => [
      i.id,
      i.linking_domain,
      i.linking_url,
      i.target_url,
      i.target_verification?.pointsToRealSite !== false ? 'Yes' : 'No',
      i.anchor_text,
      i.link_type,
      i.classification,
      i.risk_score,
      i.review_status,
      i.disavow_approved ? 'Approved' : 'Not Approved',
      i.disavow_scope,
      i.source_dataset,
      i.last_checked_at,
      i.recommended_action,
      Array.isArray(i.evidence) ? i.evidence.join(' | ') : i.explanation,
    ])
    const csv = [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n')
    handleDownloadText(csv, `0nprint-backlink-forensics-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8')
    notify('Downloaded classified backlink audit CSV')
  }

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    notify('Copied to clipboard')
  }

  const handleCreateRemoval = async (e) => {
    e.preventDefault()
    if (!newRemoval.linking_domain) {
      notify('Referring domain is required', 'error')
      return
    }
    try {
      const res = await createRemovalRequest(newRemoval)
      if (res?.success) {
        notify(res.message)
        setNewRemoval({
          linking_domain: '',
          linking_url: '',
          contact_page: '',
          contact_email: '',
          status: 'sent',
          notes: '',
        })
        fetchAudit()
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to log removal request', 'error')
    }
  }

  const handleUpdateRemovalStatus = async (id, payload) => {
    try {
      const res = await updateRemovalRequest(id, payload)
      if (res?.success) {
        notify(res.message)
        fetchAudit()
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to update removal status', 'error')
    }
  }

  const summary = auditData?.summary || {}
  const categories = summary.categories || {}
  const items = auditData?.items || []
  const removalRequests = auditData?.removalRequests || []
  const outreachTemplates = auditData?.outreachTemplates || []
  const disavowInfo = auditData?.disavow || {}
  const gscVerification = auditData?.gscVerification || {}
  const auditLogs = auditData?.auditLogs || []

  return (
    <div className="space-y-6">
      {/* Header & Executive Disavow Safety Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">
                Toxic Backlink Forensics, Spam Cleanup & Safe Disavow Engine
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Real-data backlink audit for <span className="text-white font-mono">https://0nprint.com/</span> — Multi-signal classification, webmaster removal outreach CRM, and human-gated Google Disavow file automation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setSubView('csv_import')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
            >
              <Upload className="w-4 h-4" /> Import SEMrush / GSC CSV
            </button>
            <button
              onClick={handleExportClassifiedCsv}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <Download className="w-4 h-4" /> Export Classified CSV
            </button>
            <button
              onClick={fetchAudit}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Real GSC Export Forensic Finding Banner */}
        <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row gap-4 items-start">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-200 space-y-1.5 leading-relaxed">
            <div className="font-bold text-amber-300 text-sm">
              {summary.disavowRecommendation?.headline || 'Forensic Assessment of Uploaded GSC Backlink Export'}
            </div>
            <p className="text-slate-300">
              {summary.disavowRecommendation?.rationale}
            </p>
            <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-950/70 border border-slate-800 text-amber-300 font-mono">
                Uploaded CSV: 0nprint.com-Latest links-2026-10-16.csv (1 link: 2ip.io)
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-950/70 border border-slate-800 text-emerald-400">
                Safety Guardrail Active: Never auto-disavows based solely on low Authority Score or foreign language
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Referring Domains / Links</div>
          <div className="text-2xl font-bold text-white mt-1">
            {summary.totalReferringDomains || 0} <span className="text-sm font-normal text-slate-400">/ {summary.totalBacklinks || 0}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {summary.gscExportLinksCount || 0} GSC CSV • {summary.repositoryTrackedCitationsCount || 0} Citations
          </div>
        </div>

        <div className="bg-slate-900 border border-red-500/30 rounded-xl p-4">
          <div className="text-xs text-red-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Confirmed Harmful
          </div>
          <div className="text-2xl font-bold text-red-400 mt-1">{categories.confirmedHarmful || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Explicit spam / link schemes</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4">
          <div className="text-xs text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Suspicious (Review)
          </div>
          <div className="text-2xl font-bold text-amber-300 mt-1">{categories.suspicious || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Includes 2ip.io IP scraper</div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-xs text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Potentially Legitimate
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{categories.potentiallyLegitimate || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Protected UAE citations</div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="text-xs text-slate-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> Unknown
          </div>
          <div className="text-2xl font-bold text-slate-200 mt-1">{categories.unknown || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Insufficient evidence</div>
        </div>

        <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-4">
          <div className="text-xs text-purple-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Disavow Approved
          </div>
          <div className="text-2xl font-bold text-purple-300 mt-1">{summary.disavowApprovedCount || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {summary.reviewQueueCount || 0} awaiting review
          </div>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'domain_review', label: `1. Forensic Domain Review (${summary.totalBacklinks || 0})`, icon: ShieldAlert },
          { id: 'disavow_queue', label: `2. Disavow Approval Queue & disavow.txt (${summary.disavowApprovedCount || 0} Approved)`, icon: FileText },
          { id: 'removal_requests', label: `3. Removal Requests & Outreach Templates (${removalRequests.length})`, icon: Mail },
          { id: 'csv_import', label: '4. Import SEMrush / GSC CSV (With Preview)', icon: Upload },
          { id: 'gsc_and_logs', label: `5. GSC Verification & Audit Logs (${auditLogs.length})`, icon: History },
        ].map((t) => {
          const Icon = t.icon
          const active = subView === t.id
          return (
            <button
              key={t.id}
              onClick={() => setSubView(t.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                active
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* SUBVIEW 1: FORENSIC DOMAIN & LINK REVIEW TABLE */}
      {subView === 'domain_review' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  placeholder="Search domain, URL, anchor, evidence..."
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none w-64"
                />
              </div>

              <select
                value={classificationFilter}
                onChange={(e) => {
                  setClassificationFilter(e.target.value)
                  setPage(1)
                }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
              >
                <option value="all">All 4 Classifications</option>
                <option value="Confirmed harmful">Confirmed harmful</option>
                <option value="Suspicious — needs review">Suspicious — needs review</option>
                <option value="Potentially legitimate">Potentially legitimate</option>
                <option value="Unknown">Unknown</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value)
                  setPage(1)
                }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
              >
                <option value="all">All Data Sources</option>
                <option value="gsc_latest_links_csv">GSC Latest Links CSV Export</option>
                <option value="semrush_backlink_export">SEMrush Backlink CSV Export</option>
                <option value="repository_tracked_citations">Tracked UAE Directory Citations</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                <span className="text-xs text-amber-400 font-semibold">{selectedIds.length} selected:</span>
                <button
                  onClick={() =>
                    handleBulkAction({
                      classification: 'Potentially legitimate',
                      disavow_approved: false,
                      review_status: 'reviewed_safe',
                    })
                  }
                  className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[11px] hover:bg-emerald-500/30"
                >
                  Mark Legitimate (Protect)
                </button>
                <button
                  onClick={() =>
                    handleBulkAction({
                      classification: 'Suspicious — needs review',
                      review_status: 'pending_review',
                    })
                  }
                  className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[11px] hover:bg-amber-500/30"
                >
                  Flag Suspicious
                </button>
                <button
                  onClick={() =>
                    handleBulkAction({
                      disavow_approved: true,
                      review_status: 'approved_for_disavow',
                      disavow_scope: 'domain',
                    })
                  }
                  className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 text-[11px] hover:bg-red-500/30"
                >
                  Approve for Disavow
                </button>
                <button
                  onClick={() =>
                    handleBulkAction({
                      disavow_approved: false,
                      review_status: 'reviewed_manual',
                    })
                  }
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] hover:bg-slate-700"
                >
                  Remove from Disavow
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400">
                  <th className="py-3 px-2 w-8">
                    <button onClick={handleSelectAll} className="text-slate-400 hover:text-white">
                      {selectedIds.length > 0 && selectedIds.length === items.length ? (
                        <CheckSquare className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Referring Domain & Linking URL</th>
                  <th className="py-3 px-3">Target Page & Anchor</th>
                  <th className="py-3 px-3">Classification & Risk Score</th>
                  <th className="py-3 px-3">Forensic Evidence & Recommended Action</th>
                  <th className="py-3 px-3 text-right">Review & Disavow Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs">
                {items.map((item) => {
                  const isSelected = selectedIds.includes(item.id)
                  const badgeStyle = CLASSIFICATION_STYLES[item.classification] || CLASSIFICATION_STYLES.Unknown
                  const isLegit = item.classification === 'Potentially legitimate'
                  return (
                    <tr key={item.id} className={`hover:bg-slate-800/30 ${isSelected ? 'bg-amber-500/5' : ''}`}>
                      <td className="py-3.5 px-2 align-top">
                        <button onClick={() => handleSelectToggle(item.id)} className="text-slate-400 hover:text-white">
                          {isSelected ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="py-3.5 px-3 align-top max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{item.linking_domain}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                            {item.source_dataset === 'gsc_latest_links_csv'
                              ? 'GSC CSV Export'
                              : item.source_dataset === 'semrush_backlink_export'
                              ? 'SEMrush CSV'
                              : 'UAE Citation'}
                          </span>
                        </div>
                        <a
                          href={item.linking_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 hover:underline break-all inline-flex items-center gap-1 mt-1 text-[11px]"
                        >
                          {item.linking_url} <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Last crawled: <span className="text-slate-300">{item.last_checked_at || 'N/A'}</span>
                          {item.authority !== null && item.authority !== undefined && (
                            <> • Authority: <span className="text-slate-300">{item.authority}</span></>
                          )}
                          {item.semrush_toxicity_score !== null && item.semrush_toxicity_score !== undefined && (
                            <> • SEMrush Signal: <span className="text-amber-300">{item.semrush_toxicity_score}</span></>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 align-top max-w-[220px]">
                        <div className="text-slate-200 break-all text-[11px] font-mono">{item.target_url}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.target_verification?.pointsToRealSite !== false ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                              ✓ Valid 0nprint.com Target
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[10px]">
                              ⚠ Mismatched Target
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                            {item.link_type}
                          </span>
                        </div>
                        <div className="mt-1.5 text-[11px] text-slate-400">
                          Anchor: <span className="text-white font-medium">"{item.anchor_text}"</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 align-top">
                        <span className={`inline-block px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${badgeStyle}`}>
                          {item.classification}
                        </span>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-slate-400">Forensic Risk Score</span>
                            <span
                              className={`font-bold ${
                                item.risk_score >= 75
                                  ? 'text-red-400'
                                  : item.risk_score >= 45
                                  ? 'text-amber-300'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {item.risk_score}/100
                            </span>
                          </div>
                          <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                item.risk_score >= 75
                                  ? 'bg-red-500'
                                  : item.risk_score >= 45
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(4, item.risk_score))}%` }}
                            />
                          </div>
                        </div>
                        {item.disavow_approved && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-semibold">
                            ✓ Approved for Disavow ({item.disavow_scope === 'url' ? 'URL' : `domain:${item.linking_domain}`})
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3 align-top max-w-md">
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                          {(item.evidence || []).map((ev, idx) => (
                            <li key={idx}>{ev}</li>
                          ))}
                        </ul>
                        <div className="mt-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-amber-200/90">
                          <span className="font-semibold text-amber-400">Action: </span>
                          {item.recommended_action}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 align-top text-right space-y-1.5">
                        <div>
                          <select
                            value={item.classification}
                            onChange={(e) =>
                              handleSingleReview(item.id, {
                                classification: e.target.value,
                              })
                            }
                            className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200 w-44"
                          >
                            <option value="Confirmed harmful">Confirmed harmful</option>
                            <option value="Suspicious — needs review">Suspicious — needs review</option>
                            <option value="Potentially legitimate">Potentially legitimate</option>
                            <option value="Unknown">Unknown</option>
                          </select>
                        </div>

                        {!isLegit && (
                          <div className="flex justify-end gap-1.5">
                            {item.disavow_approved ? (
                              <button
                                onClick={() =>
                                  handleSingleReview(item.id, {
                                    disavow_approved: false,
                                    review_status: 'reviewed_manual',
                                  })
                                }
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                              >
                                Remove from Disavow
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleSingleReview(item.id, {
                                    disavow_approved: true,
                                    disavow_scope: 'domain',
                                    review_status: 'approved_for_disavow',
                                  })
                                }
                                className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-[11px] font-medium"
                              >
                                Approve domain:{item.linking_domain}
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: DISAVOW APPROVAL QUEUE & VALIDATED DISAVOW.TXT GENERATOR */}
      {subView === 'disavow_queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Approval Queue & Generator Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" /> Human Review Queue & Disavow Safety Gate
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Safety Rule: No domain enters your active <code className="text-amber-300">disavow.txt</code> file without your explicit approval. Legitimate UAE business directories and trade citations are locked from disavowal.
            </p>

            <div className="space-y-3">
              {(auditData?.reviewQueue || []).map((qItem) => (
                <div key={qItem.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">{qItem.linking_domain}</span>
                      <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {qItem.classification} (Risk: {qItem.risk_score}/100)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={qItem.disavow_scope || 'domain'}
                        onChange={(e) => handleSingleReview(qItem.id, { disavow_scope: e.target.value })}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200"
                      >
                        <option value="domain">domain:{qItem.linking_domain}</option>
                        <option value="url">URL-level only</option>
                      </select>
                      <button
                        onClick={() =>
                          handleSingleReview(qItem.id, {
                            disavow_approved: !qItem.disavow_approved,
                            review_status: !qItem.disavow_approved ? 'approved_for_disavow' : 'pending_review',
                          })
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          qItem.disavow_approved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                        }`}
                      >
                        {qItem.disavow_approved ? '✓ Approved in Queue' : 'Approve for Disavow'}
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 break-all">URL: {qItem.linking_url}</div>
                  <div className="text-[11px] text-slate-300">{qItem.explanation}</div>
                </div>
              ))}
            </div>

            {/* Explicit Approval & Version Generation Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3 mt-4">
              <div className="text-xs font-bold text-amber-300">Generate & Record Validated disavow.txt Snapshot</div>
              <div className="flex gap-3">
                <select
                  value={disavowMode}
                  onChange={(e) => setDisavowMode(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="approved_only">Strict Mode: Explicitly Approved Domains Only</option>
                  <option value="candidate_draft">Draft Preview Mode: Include Suspicious Candidate (domain:2ip.io)</option>
                </select>
                <input
                  type="text"
                  value={disavowNotes}
                  onChange={(e) => setDisavowNotes(e.target.value)}
                  placeholder="Audit version note (optional)..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={explicitUserConsent}
                  onChange={(e) => setExplicitUserConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700"
                />
                <span>
                  I have reviewed the domain list and risks. I understand this generates a downloadable <code className="text-amber-300">disavow.txt</code> file and does <strong>not</strong> auto-submit to Google Search Console without my manual upload.
                </span>
              </label>

              <button
                onClick={handleGenerateDisavow}
                disabled={generatingDisavow}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
              >
                {generatingDisavow ? 'Validating & Generating...' : 'Validate & Save disavow.txt Version'}
              </button>
            </div>
          </div>

          {/* Right Column: Live Validated disavow.txt Output & Version History */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Validated Google Disavow File Preview</h3>
                <p className="text-xs text-slate-400">
                  Syntax: UTF-8 • Comments (#) • Validated against legitimate domain list
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleCopyText(
                      disavowMode === 'candidate_draft'
                        ? disavowInfo.candidateDraft?.content || ''
                        : disavowInfo.approvedFile?.content || '',
                      'disavow-copy'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                >
                  {copiedId === 'disavow-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
                <button
                  onClick={() =>
                    handleDownloadText(
                      disavowMode === 'candidate_draft'
                        ? disavowInfo.candidateDraft?.content || ''
                        : disavowInfo.approvedFile?.content || '',
                      'disavow.txt'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download disavow.txt
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-80">
              {disavowMode === 'candidate_draft'
                ? disavowInfo.candidateDraft?.content
                : disavowInfo.approvedFile?.content}
            </pre>

            {/* Version History */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Disavow File Version History</h4>
              {(disavowInfo.versions || []).length === 0 ? (
                <div className="text-xs text-slate-500 italic">No disavow versions saved yet. Use the generator on the left to record v1.0.</div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {disavowInfo.versions.map((ver) => (
                    <div key={ver.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-amber-400">{ver.version}</span>
                        <span className="text-slate-400 ml-2">({ver.directives_count} directives • {ver.mode})</span>
                        <div className="text-[11px] text-slate-500">{new Date(ver.created_at).toLocaleString()} — {ver.notes}</div>
                      </div>
                      <button
                        onClick={() => handleDownloadText(ver.content, `disavow-${ver.version}.txt`)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 3: REMOVAL REQUEST TRACKING & OUTREACH TEMPLATES */}
      {subView === 'removal_requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" /> Backlink Removal Request Tracker
            </h3>
            <p className="text-xs text-slate-400">
              Important: External websites control their own backlinks. Editing ONPRINT source code cannot delete links on third-party sites. Use this tracker to record webmaster removal outreach and verified removals.
            </p>

            <div className="space-y-3">
              {removalRequests.map((reqItem) => (
                <div key={reqItem.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{reqItem.linking_domain}</span>
                    <select
                      value={reqItem.status}
                      onChange={(e) =>
                        handleUpdateRemovalStatus(reqItem.id, {
                          status: e.target.value,
                          verified_removed: e.target.value === 'removed_verified',
                        })
                      }
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-[11px] text-amber-300"
                    >
                      <option value="draft_ready">Draft Ready</option>
                      <option value="sent">Outreach Sent</option>
                      <option value="follow_up_sent">Follow-Up Sent</option>
                      <option value="removed_verified">Verified Removed</option>
                      <option value="rejected_or_no_response">No Response / Ignored</option>
                    </select>
                  </div>
                  <div className="text-slate-400 break-all">Linking URL: {reqItem.linking_url}</div>
                  <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
                    <span>Contact Page: <a href={reqItem.contact_page} target="_blank" rel="noreferrer" className="text-amber-400 underline">{reqItem.contact_page}</a></span>
                    <span>Email: <span className="text-slate-200">{reqItem.contact_email}</span></span>
                    <span>Date: <span className="text-slate-200">{reqItem.requested_at}</span></span>
                  </div>
                  <div className="text-[11px] text-slate-300">{reqItem.notes}</div>
                </div>
              ))}
            </div>

            {/* Log New Removal Request Form */}
            <form onSubmit={handleCreateRemoval} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-white">Record New Removal / Delisting Outreach</div>
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="text"
                  placeholder="Referring Domain (e.g. example.com)"
                  value={newRemoval.linking_domain}
                  onChange={(e) => setNewRemoval({ ...newRemoval, linking_domain: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Linking URL"
                  value={newRemoval.linking_url}
                  onChange={(e) => setNewRemoval({ ...newRemoval, linking_url: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Contact / Abuse URL"
                  value={newRemoval.contact_page}
                  onChange={(e) => setNewRemoval({ ...newRemoval, contact_page: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Webmaster Email"
                  value={newRemoval.contact_email}
                  onChange={(e) => setNewRemoval({ ...newRemoval, contact_email: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Outreach notes / response summary"
                value={newRemoval.notes}
                onChange={(e) => setNewRemoval({ ...newRemoval, notes: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Save Removal Request Record
              </button>
            </form>
          </div>

          {/* Outreach Templates */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">Professional Backlink Removal Outreach Templates</h3>
            <div className="space-y-4">
              {outreachTemplates.map((tpl) => (
                <div key={tpl.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 text-xs">{tpl.name}</span>
                    <button
                      onClick={() => handleCopyText(`Subject: ${tpl.subject}\n\n${tpl.body}`, tpl.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                    >
                      {copiedId === tpl.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy Template
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400">{tpl.scenario}</div>
                  <div className="text-xs text-white font-mono bg-slate-900 p-2 rounded border border-slate-800">
                    Subject: {tpl.subject}
                  </div>
                  <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap bg-slate-900 p-3 rounded border border-slate-800 max-h-48 overflow-y-auto">
                    {tpl.body}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 4: CSV IMPORT & DRY-RUN PREVIEW */}
      {subView === 'csv_import' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-400" /> Import SEMrush Backlink Audit CSV or Google Search Console Links CSV
          </h3>
          <p className="text-xs text-slate-400">
            Supports Google Search Console (<code className="text-slate-200">Linking page,Last crawled</code>), SEMrush Backlink Audit (<code className="text-slate-200">Source url,Target url,Anchor,Authority Score,Toxicity score</code>), and Ahrefs exports. Always run <strong>Preview & Validate</strong> first before committing.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700">
              Choose .CSV File
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            <span className="text-xs text-slate-400 font-mono">{csvFileName}</span>
          </div>

          <textarea
            rows={7}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={`Paste CSV content here, e.g.:\nLinking page,Last crawled\nhttps://2ip.io/ru/domain-list-by-ip/aih.life/,2026-09-17`}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-200 focus:border-amber-500 focus:outline-none"
          />

          <div className="flex gap-3">
            <button
              onClick={handlePreviewCsv}
              disabled={importingCsv}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold"
            >
              1. Preview & Run Forensic Classification (Dry Run)
            </button>
            <button
              onClick={handleCommitCsv}
              disabled={importingCsv || !csvText.trim()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
            >
              2. Commit Imported Links to Audit Database
            </button>
          </div>

          {csvPreview && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-emerald-400">
                Dry-Run Preview: Detected format "{csvPreview.detectedFormat}" • {csvPreview.validCount} unique valid link(s) • {csvPreview.duplicatesRemoved} duplicate(s) stripped
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2">Domain</th>
                      <th className="py-2">Linking URL</th>
                      <th className="py-2">Proposed Classification</th>
                      <th className="py-2">Risk Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(csvPreview.previewItems || []).slice(0, 15).map((pi, i) => (
                      <tr key={i} className="border-b border-slate-900">
                        <td className="py-2 font-bold text-white">{pi.linking_domain}</td>
                        <td className="py-2 text-slate-300 break-all">{pi.linking_url}</td>
                        <td className="py-2 text-amber-300">{pi.classification}</td>
                        <td className="py-2">{pi.risk_score}/100</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBVIEW 5: GOOGLE SEARCH CONSOLE VERIFICATION & AUDIT LOGS */}
      {subView === 'gsc_and_logs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" /> Google Search Console Verification & Comparison
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Target Property</span>
                <span className="text-white font-mono">https://0nprint.com/</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Latest GSC Links CSV Imported</span>
                <span className="text-emerald-400 font-mono">{gscVerification.latestCsvImported} ({gscVerification.latestCsvLinksCount} link)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Manual Actions Status</span>
                <span className="text-emerald-400 font-semibold">{gscVerification.manualActionsStatus}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Security Issues Status</span>
                <span className="text-emerald-400 font-semibold">{gscVerification.securityIssuesStatus}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="font-bold text-white">GSC vs. SEMrush & Repository Comparison</div>
              <p>
                1. <strong>Google Search Console Export (<code className="text-amber-300">0nprint.com-Latest links-2026-10-16.csv</code>)</strong> reports 1 crawled external link: <code className="text-amber-300">https://2ip.io/ru/domain-list-by-ip/aih.life/</code> (last crawled 2026-09-17).
              </p>
              <p>
                2. <strong>Why Immediate Disavowal Is Optional / Unnecessary:</strong> Because <code className="text-amber-300">2ip.io</code> is an automated IP-neighbor lookup tool and there are <strong>0 Manual Actions</strong> in Google Search Console, Google's algorithms automatically ignore this scraper link. We have classified it as <strong>Suspicious — needs review (Risk Score 58/100)</strong> and prepared both a webmaster delisting template and a validated optional <code className="text-amber-300">domain:2ip.io</code> disavow draft if you choose to submit one.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" /> Immutable Backlink Forensics Audit Log
            </h3>
            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 font-mono text-[11px]">{log.action}</span>
                    <span className="text-[11px] text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  <div className="text-slate-300">{log.details}</div>
                  <div className="text-[10px] text-slate-500">Actor: {log.actor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
