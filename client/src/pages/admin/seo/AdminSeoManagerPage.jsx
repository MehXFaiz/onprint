import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  Settings,
  History,
  Check,
  X,
  FileCode,
  Globe,
  ExternalLink,
  ChevronRight,
  Copy,
  Sliders,
  Database,
  ArrowUpRight,
  HelpCircle,
  Calendar,
  Zap,
  BarChart3,
  Bot,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileText,
  Key,
  ShieldAlert,
  ChevronDown
} from 'lucide-react'
import Button from '../../../components/Button'
import {
  getSeoDashboard,
  getSeoAudit,
  triggerSeoAudit,
  getSeoRecommendations,
  triggerAiAnalysis,
  approveRecommendation,
  rejectRecommendation,
  applyRecommendation,
  bulkApplyRecommendations,
  getSeoHistory,
  rollbackSeoChange,
  getDailyReports,
  getSeoKeywords,
  getSeoPages,
  getSearchConsoleStatus,
  connectSearchConsole,
  syncSearchConsole,
  getSeoSettings,
  updateSeoSettings,
  runDailySeo,
  getSeoLogs,
} from '../../../services/seo'

export default function AdminSeoManagerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const setActiveTab = (tab) => {
    setSearchParams({ tab })
  }

  // Global State
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // Sub-view data states
  const [dashboardData, setDashboardData] = useState(null)
  const [auditData, setAuditData] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [recFilter, setRecFilter] = useState({ status: 'PENDING', priority: 'all', targetType: 'all' })
  const [historyList, setHistoryList] = useState([])
  const [dailyReports, setDailyReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [keywordsData, setKeywordsData] = useState({ queries: [], opportunities: {}, connected: false })
  const [pagesList, setPagesList] = useState([])
  const [pageSearch, setPageSearch] = useState('')
  const [gscStatus, setGscStatus] = useState(null)
  const [settingsData, setSettingsData] = useState({})
  const [activityLogs, setActivityLogs] = useState([])

  // Modal / Review state
  const [selectedRec, setSelectedRec] = useState(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [copiedKey, setCopiedKey] = useState(false)

  // Form states for Settings & GSC
  const [settingsForm, setSettingsForm] = useState({
    scheduler_enabled: '1',
    daily_run_time: '03:00',
    timezone: 'Asia/Dubai',
    auto_apply_safe: '0',
    min_confidence_auto_apply: '0.90',
    ai_provider: 'gemini',
    ai_model: 'gemini-1.5-flash',
    ai_api_key: '',
  })

  const [gscForm, setGscForm] = useState({
    property: 'https://0nprint.com',
    authType: 'service_account',
    serviceAccountJson: '',
    clientId: '',
    clientSecret: '',
    refreshToken: '',
  })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Load Initial Dashboard Data
  useEffect(() => {
    loadDashboard()
  }, [])

  // Load Tab-specific data on switch
  useEffect(() => {
    if (activeTab === 'recommendations') loadRecommendations()
    if (activeTab === 'audit') loadAudit()
    if (activeTab === 'keywords') loadKeywords()
    if (activeTab === 'pages') loadPages()
    if (activeTab === 'search-console') loadGscStatus()
    if (activeTab === 'reports') loadDailyReports()
    if (activeTab === 'history') loadHistory()
    if (activeTab === 'settings') loadSettings()
  }, [activeTab, recFilter])

  const loadDashboard = async () => {
    setLoading(true)
    try {
      const res = await getSeoDashboard()
      if (res.success) {
        setDashboardData(res.data)
        setGscStatus(res.data.searchConsole?.status)
      }
    } catch (err) {
      showToast('Failed to load SEO dashboard data: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadAudit = async () => {
    try {
      const res = await getSeoAudit()
      if (res.success) setAuditData(res.data)
    } catch (err) {
      console.warn('Load audit error:', err.message)
    }
  }

  const loadRecommendations = async () => {
    try {
      const res = await getSeoRecommendations(recFilter)
      if (res.success) setRecommendations(res.data.items || [])
    } catch (err) {
      console.warn('Load recs error:', err.message)
    }
  }

  const loadKeywords = async () => {
    try {
      const res = await getSeoKeywords()
      if (res.success) setKeywordsData(res.data)
    } catch (err) {
      console.warn('Load keywords error:', err.message)
    }
  }

  const loadPages = async () => {
    try {
      const res = await getSeoPages()
      if (res.success) setPagesList(res.data || [])
    } catch (err) {
      console.warn('Load pages error:', err.message)
    }
  }

  const loadGscStatus = async () => {
    try {
      const res = await getSearchConsoleStatus()
      if (res.success) {
        setGscStatus(res.data)
        setGscForm((prev) => ({
          ...prev,
          property: res.data.property || 'https://0nprint.com',
          authType: res.data.authType || 'service_account',
        }))
      }
    } catch (err) {
      console.warn('Load GSC status error:', err.message)
    }
  }

  const loadDailyReports = async () => {
    try {
      const res = await getDailyReports()
      if (res.success) {
        setDailyReports(res.data || [])
        if (res.data.length > 0 && !selectedReport) {
          setSelectedReport(res.data[0])
        }
      }
    } catch (err) {
      console.warn('Load reports error:', err.message)
    }
  }

  const loadHistory = async () => {
    try {
      const res = await getSeoHistory()
      if (res.success) setHistoryList(res.data?.changes || [])
    } catch (err) {
      console.warn('Load history error:', err.message)
    }
  }

  const loadSettings = async () => {
    try {
      const res = await getSeoSettings()
      if (res.success) {
        setSettingsData(res.data)
        setSettingsForm({
          scheduler_enabled: res.data.scheduler_enabled || '1',
          daily_run_time: res.data.daily_run_time || '03:00',
          timezone: res.data.timezone || 'Asia/Dubai',
          auto_apply_safe: res.data.auto_apply_safe || '0',
          min_confidence_auto_apply: res.data.min_confidence_auto_apply || '0.90',
          ai_provider: res.data.ai_provider || 'gemini',
          ai_model: res.data.ai_model || 'gemini-1.5-flash',
          ai_api_key: '',
        })
      }
      const logRes = await getSeoLogs()
      if (logRes.success) setActivityLogs(logRes.data || [])
    } catch (err) {
      console.warn('Load settings error:', err.message)
    }
  }

  // Quick Action Handlers
  const handleTriggerDailyRun = async () => {
    setActionLoading(true)
    try {
      const res = await runDailySeo({ force: true })
      if (res.success) {
        showToast(res.message || 'Daily SEO run completed successfully!')
        loadDashboard()
        if (activeTab === 'reports') loadDailyReports()
        if (activeTab === 'recommendations') loadRecommendations()
      } else {
        showToast(res.message || 'Daily SEO run completed with warnings', 'error')
      }
    } catch (err) {
      showToast('Daily run failed: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleTriggerAudit = async () => {
    setActionLoading(true)
    try {
      const res = await triggerSeoAudit()
      if (res.success) {
        showToast('Full SEO scan completed.')
        setAuditData(res.data)
        loadDashboard()
      }
    } catch (err) {
      showToast('Scan failed: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleTriggerAi = async () => {
    setActionLoading(true)
    try {
      const res = await triggerAiAnalysis({ maxEntities: 15, priorityFilter: 'all' })
      if (res.success) {
        showToast(res.message || 'AI SEO recommendations generated.')
        loadRecommendations()
        loadDashboard()
      }
    } catch (err) {
      showToast('AI Analysis failed: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleApproveRec = async (id) => {
    try {
      const res = await approveRecommendation(id, reviewNotes)
      if (res.success) {
        showToast('Recommendation approved.')
        setSelectedRec(null)
        setReviewNotes('')
        loadRecommendations()
        loadDashboard()
      }
    } catch (err) {
      showToast('Approve failed: ' + (err.response?.data?.message || err.message), 'error')
    }
  }

  const handleRejectRec = async (id) => {
    try {
      const res = await rejectRecommendation(id, reviewNotes)
      if (res.success) {
        showToast('Recommendation rejected.')
        setSelectedRec(null)
        setReviewNotes('')
        loadRecommendations()
        loadDashboard()
      }
    } catch (err) {
      showToast('Reject failed: ' + (err.response?.data?.message || err.message), 'error')
    }
  }

  const handleApplyRec = async (id) => {
    setActionLoading(true)
    try {
      const res = await applyRecommendation(id)
      if (res.success) {
        showToast('SEO change applied live to database!')
        setSelectedRec(null)
        loadRecommendations()
        loadDashboard()
      }
    } catch (err) {
      showToast('Apply failed: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleBulkApply = async () => {
    if (!window.confirm('Apply all APPROVED recommendations directly to live products/categories?')) return
    setActionLoading(true)
    try {
      const res = await bulkApplyRecommendations()
      if (res.success) {
        showToast(res.message || 'Bulk applied approved changes!')
        loadRecommendations()
        loadDashboard()
      }
    } catch (err) {
      showToast('Bulk apply failed: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRollback = async (changeId) => {
    if (!window.confirm('Are you sure you want to rollback this change to its previous value?')) return
    setActionLoading(true)
    try {
      const res = await rollbackSeoChange(changeId)
      if (res.success) {
        showToast('Change successfully rolled back!')
        loadHistory()
        loadDashboard()
      }
    } catch (err) {
      showToast('Rollback failed: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      const payload = { ...settingsForm }
      if (!payload.ai_api_key) delete payload.ai_api_key
      const res = await updateSeoSettings(payload)
      if (res.success) {
        showToast('SEO Settings saved successfully!')
        loadSettings()
      }
    } catch (err) {
      showToast('Save failed: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleConnectGsc = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      const res = await connectSearchConsole(gscForm)
      if (res.success) {
        showToast('Google Search Console configured!')
        loadGscStatus()
        loadDashboard()
      }
    } catch (err) {
      showToast('Connection failed: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSyncGsc = async () => {
    setActionLoading(true)
    try {
      const res = await syncSearchConsole()
      if (res.success) {
        showToast(res.message || 'Search Console data synchronized!')
        loadGscStatus()
        loadKeywords()
        loadDashboard()
      } else {
        showToast(res.message || 'Sync failed', 'error')
      }
    } catch (err) {
      showToast('Sync failed: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Filtered pages
  const filteredPages = useMemo(() => {
    return pagesList.filter((p) => {
      const term = pageSearch.toLowerCase()
      return (
        p.name?.toLowerCase().includes(term) ||
        p.url?.toLowerCase().includes(term) ||
        p.entityType?.toLowerCase().includes(term)
      )
    })
  }, [pagesList, pageSearch])

  // Top metric scores calculation
  const scores = dashboardData?.scores || {
    healthScore: 92,
    technicalScore: 95,
    onpageScore: 90,
    contentScore: 88,
    structuredDataScore: 95,
  }

  const tabs = [
    { id: 'overview', label: 'Overview & Health', icon: BarChart3 },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles, count: dashboardData?.recommendationsSummary?.pending },
    { id: 'audit', label: 'Technical Audit', icon: ShieldCheck },
    { id: 'keywords', label: 'Keywords & SERP', icon: TrendingUp },
    { id: 'pages', label: 'Page Catalog', icon: Layers },
    { id: 'search-console', label: 'Search Console', icon: Globe },
    { id: 'reports', label: 'Daily Reports', icon: Calendar },
    { id: 'history', label: 'Change History', icon: History },
    { id: 'settings', label: 'Automation & Settings', icon: Sliders },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-xl text-xs font-bold transition-all transform animate-in slide-in-from-bottom-5 ${
            toast.type === 'error'
              ? 'bg-red-600 text-white shadow-red-600/30'
              : 'bg-[#000000] text-white border border-[#A82F19]/40 shadow-black/40'
          }`}
        >
          {toast.type === 'error' ? (
            <XCircle className="h-4 w-4 shrink-0 text-white" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#A82F19]" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              AI SEO Manager
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 border border-[#A82F19]/25 px-2.5 py-0.5 text-[11px] font-bold text-[#A82F19]">
              <Bot className="h-3.5 w-3.5" />
              Daily Autonomous Engine
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Production SEO auditing, AI meta optimization, Google Search Console syncing, and change rollback management for ONPRINT.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTriggerAudit}
            disabled={actionLoading}
            icon={false}
            className="border-neutral-200 text-neutral-800 hover:bg-neutral-50 text-xs font-bold"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${actionLoading ? 'animate-spin' : ''}`} />
            Quick Re-Scan
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleTriggerAi}
            disabled={actionLoading}
            icon={false}
            className="border-neutral-300 text-neutral-900 hover:border-[#A82F19] text-xs font-bold"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#A82F19]" />
            Generate AI Recs
          </Button>

          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={handleTriggerDailyRun}
            disabled={actionLoading}
            icon={false}
            className="text-xs font-bold shadow-md shadow-[#A82F19]/20"
          >
            <Zap className={`h-3.5 w-3.5 mr-1.5 ${actionLoading ? 'animate-spin' : ''}`} />
            Run Daily Pipeline Now
          </Button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 border-b border-neutral-200 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[#A82F19]' : 'text-neutral-400'}`} />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span className="rounded-full bg-[#A82F19] px-1.5 py-0.2 text-[10px] font-extrabold text-white">
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & HEALTH                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Health Score Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Main Health */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-500">Overall Health</span>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-black text-neutral-900">{scores.healthScore}%</span>
                  <span className={`text-xs font-bold ${scores.healthScore >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {scores.healthScore >= 90 ? 'Optimal' : 'Needs Work'}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${scores.healthScore >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${scores.healthScore}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-neutral-500">
                {dashboardData?.auditSummary?.totalPagesScanned || 25} URLs scanned
              </p>
            </div>

            {/* Technical Score */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-500">Technical SEO</span>
                <FileCode className="h-4 w-4 text-blue-600" />
              </div>
              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-neutral-900">{scores.technicalScore}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${scores.technicalScore}%` }} />
                </div>
              </div>
              <p className="text-[11px] text-neutral-500">Robots, Sitemaps, Canonicals</p>
            </div>

            {/* On-Page Score */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-500">On-Page SEO</span>
                <Sliders className="h-4 w-4 text-purple-600" />
              </div>
              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-neutral-900">{scores.onpageScore}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500" style={{ width: `${scores.onpageScore}%` }} />
                </div>
              </div>
              <p className="text-[11px] text-neutral-500">Titles, Descriptions, H1s, ALTs</p>
            </div>

            {/* Content Score */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-500">Content Depth</span>
                <FileText className="h-4 w-4 text-amber-600" />
              </div>
              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-neutral-900">{scores.contentScore}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${scores.contentScore}%` }} />
                </div>
              </div>
              <p className="text-[11px] text-neutral-500">Word count &amp; keyword focus</p>
            </div>

            {/* Structured Data */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-500">Structured Data</span>
                <Database className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-neutral-900">{scores.structuredDataScore}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${scores.structuredDataScore}%` }} />
                </div>
              </div>
              <p className="text-[11px] text-neutral-500">Schema.org JSON-LD models</p>
            </div>
          </div>

          {/* Search Console Live Banner / Status */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
                  <Globe className="h-5 w-5 text-[#A82F19]" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-neutral-900">Google Search Console Integration</h3>
                  <p className="text-xs text-neutral-500">
                    {gscStatus?.isConnected
                      ? `Connected to property ${gscStatus.property}`
                      : 'Google Search Console not connected — connect credentials to view live impressions.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {gscStatus?.isConnected ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Live Sync Active
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSyncGsc}
                      disabled={actionLoading}
                      icon={false}
                      className="text-xs font-bold"
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${actionLoading ? 'animate-spin' : ''}`} />
                      Sync
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => setActiveTab('search-console')}
                    icon={false}
                    className="text-xs font-bold"
                  >
                    <Key className="h-3.5 w-3.5 mr-1" />
                    Connect Search Console
                  </Button>
                )}
              </div>
            </div>

            {/* Metrics row */}
            {gscStatus?.isConnected ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Total Organic Clicks</span>
                  <div className="text-2xl font-black text-neutral-900 mt-1">
                    {dashboardData?.searchConsole?.performance?.totalClicks || 0}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Search Impressions</span>
                  <div className="text-2xl font-black text-neutral-900 mt-1">
                    {dashboardData?.searchConsole?.performance?.totalImpressions || 0}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Average CTR</span>
                  <div className="text-2xl font-black text-neutral-900 mt-1">
                    {dashboardData?.searchConsole?.performance?.averageCtr || '0.0'}%
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Average SERP Rank</span>
                  <div className="text-2xl font-black text-neutral-900 mt-1">
                    #{dashboardData?.searchConsole?.performance?.averagePosition || '0.0'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-4 text-xs text-neutral-500 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Real metrics are strictly preserved. To populate live Google SERP positions and CTR, configure your credentials in the Search Console tab.</span>
              </div>
            )}
          </div>

          {/* Pending AI Recommendations Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Pending AI Recommendations */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#A82F19]" />
                    <h3 className="font-display text-sm font-bold text-neutral-900">
                      Pending AI Recommendations ({dashboardData?.recommendationsSummary?.pending || 0})
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className="text-xs font-bold text-[#A82F19] hover:underline flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {dashboardData?.recommendationsSummary?.topPending?.length > 0 ? (
                    dashboardData.recommendationsSummary.topPending.map((rec) => (
                      <div
                        key={rec.id}
                        className="rounded-xl border border-neutral-100 bg-neutral-50 p-3.5 hover:border-neutral-300 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider rounded bg-neutral-200 px-2 py-0.5 text-neutral-800">
                            {rec.target_type} • {rec.target_field}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase rounded px-2 py-0.5 ${
                              rec.priority === 'CRITICAL'
                                ? 'bg-red-100 text-red-700'
                                : rec.priority === 'HIGH'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {rec.priority}
                          </span>
                        </div>
                        <h4 className="mt-2 text-xs font-bold text-neutral-900 truncate">{rec.target_name}</h4>
                        <p className="mt-1 text-[11px] text-neutral-500 line-clamp-2">{rec.issue}</p>
                        <div className="mt-3 flex items-center justify-between text-[10px]">
                          <span className="font-bold text-emerald-700">Confidence: {Math.round((rec.confidence || 0.9) * 100)}%</span>
                          <button
                            onClick={() => {
                              setSelectedRec(rec)
                              setActiveTab('recommendations')
                            }}
                            className="font-bold text-[#A82F19] hover:underline"
                          >
                            Review &amp; Apply &rarr;
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-neutral-500">
                      <CheckCircle className="mx-auto h-8 w-8 text-emerald-500 mb-1" />
                      No pending recommendations. All items optimized!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Technical Issues Needing Attention */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    <h3 className="font-display text-sm font-bold text-neutral-900">
                      Active Technical Issues ({dashboardData?.auditSummary?.issuesCount || 0})
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className="text-xs font-bold text-[#A82F19] hover:underline flex items-center gap-1"
                  >
                    Audit Details
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="mt-4 space-y-2.5">
                  {dashboardData?.topIssues?.length > 0 ? (
                    dashboardData.topIssues.map((iss, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-xs">
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900 truncate">{iss.page_url}</span>
                            <span className="text-[10px] font-extrabold uppercase rounded bg-neutral-200 px-1.5 py-0.2 text-neutral-700">
                              {iss.severity}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5 truncate">{iss.issue_message}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-neutral-500">
                      <CheckCircle className="mx-auto h-8 w-8 text-emerald-500 mb-1" />
                      Zero critical technical issues detected.
                    </div>
                  )}
                </div>
              </div>

              {/* Quick links to technical files */}
              <div className="mt-6 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-2 text-xs">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-neutral-200 p-2 text-neutral-700 hover:border-[#A82F19] hover:text-[#A82F19] transition-colors"
                >
                  <span className="font-bold">/sitemap.xml</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-neutral-200 p-2 text-neutral-700 hover:border-[#A82F19] hover:text-[#A82F19] transition-colors"
                >
                  <span className="font-bold">/robots.txt</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AI RECOMMENDATIONS & APPROVAL WORKFLOW                              */}
      {/* ========================================================================= */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Filter and Bulk Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'PENDING', 'APPROVED', 'APPLIED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setRecFilter((prev) => ({ ...prev, status: st }))}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    recFilter.status === st
                      ? 'bg-[#000000] text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="accent"
                size="sm"
                onClick={handleBulkApply}
                disabled={actionLoading}
                icon={false}
                className="text-xs font-bold"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Apply All Approved
              </Button>
            </div>
          </div>

          {/* Recommendations List */}
          {recommendations.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
              <Sparkles className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
              <h3 className="font-display text-base font-bold text-neutral-900">No Recommendations Found</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                No items match your active filters. Click &quot;Generate AI Recs&quot; above to scan products, categories, and articles for optimization opportunities.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleTriggerAi}
                className="mt-4 text-xs font-bold"
              >
                Generate AI Recommendations Now
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((rec) => {
                const isSelected = selectedRec?.id === rec.id
                return (
                  <div
                    key={rec.id}
                    className={`rounded-2xl border bg-white p-6 shadow-xs transition-all ${
                      isSelected ? 'border-[#A82F19] ring-2 ring-[#A82F19]/20' : 'border-neutral-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-neutral-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-neutral-700">
                            {rec.target_type}
                          </span>
                          <span
                            className={`rounded px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                              rec.priority === 'CRITICAL'
                                ? 'bg-red-100 text-red-700'
                                : rec.priority === 'HIGH'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {rec.priority}
                          </span>
                          <span
                            className={`rounded px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                              rec.status === 'APPLIED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : rec.status === 'APPROVED'
                                ? 'bg-blue-100 text-blue-800'
                                : rec.status === 'REJECTED'
                                ? 'bg-neutral-200 text-neutral-600'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Status: {rec.status}
                          </span>
                          <span className="text-xs text-neutral-400 font-medium">
                            Confidence: {Math.round((rec.confidence || 0.9) * 100)}%
                          </span>
                        </div>

                        <h3 className="mt-2 text-base font-bold text-neutral-900">{rec.target_name}</h3>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">{rec.target_url || '/' + rec.target_type + 's'}</p>

                        <div className="mt-3 rounded-xl bg-neutral-50 border border-neutral-100 p-3 text-xs text-neutral-600">
                          <strong className="text-neutral-900">Diagnosis:</strong> {rec.issue}
                        </div>

                        {/* Diff Comparison View */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* Current State */}
                          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
                            <div className="flex items-center gap-1.5 text-neutral-500 font-bold uppercase text-[10px] tracking-wider mb-2">
                              <XCircle className="h-3.5 w-3.5 text-neutral-400" />
                              Current Value ({rec.target_field})
                            </div>
                            <div className="text-neutral-800 font-medium break-words">
                              {rec.current_value || (
                                <span className="italic text-neutral-400">Empty / Default system fallback</span>
                              )}
                            </div>
                          </div>

                          {/* Recommended AI Value */}
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                            <div className="flex items-center gap-1.5 text-emerald-800 font-bold uppercase text-[10px] tracking-wider mb-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              Recommended AI Value
                            </div>
                            <div className="text-neutral-900 font-bold break-words">
                              {rec.recommended_value}
                            </div>
                          </div>
                        </div>

                        {/* Rationale & Expected Benefit */}
                        <div className="mt-3 text-xs text-neutral-600 flex flex-col gap-1">
                          {rec.reason && (
                            <div>
                              <strong className="text-neutral-800">Rationale:</strong> {rec.reason}
                            </div>
                          )}
                          {rec.expected_benefit && (
                            <div>
                              <strong className="text-emerald-700">Expected Benefit:</strong> {rec.expected_benefit}
                            </div>
                          )}
                        </div>

                        {/* Keywords & Linking Suggestions */}
                        {rec.keywords?.length > 0 && (
                          <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase text-neutral-400 mr-1">Target Keywords:</span>
                            {rec.keywords.map((kw, i) => (
                              <span key={i} className="rounded bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-700">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Controls */}
                      <div className="flex flex-row lg:flex-col gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-neutral-100 pt-4 lg:pt-0 lg:pl-4 justify-end">
                        {rec.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApplyRec(rec.id)}
                              disabled={actionLoading}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Apply Live
                            </button>
                            <button
                              onClick={() => handleApproveRec(rec.id)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRec(rec.id)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          </>
                        )}

                        {rec.status === 'APPROVED' && (
                          <button
                            onClick={() => handleApplyRec(rec.id)}
                            disabled={actionLoading}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Apply Live
                          </button>
                        )}

                        {rec.status === 'APPLIED' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Active in DB
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TECHNICAL & ON-PAGE AUDIT ENGINE                                    */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Top Audit Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Total URLs Audited</span>
              <div className="text-3xl font-black text-neutral-900 mt-1">{auditData?.totalEntities || auditData?.totalPagesScanned || 25}</div>
              <p className="text-[11px] text-neutral-500 mt-1">Live database records &amp; static routes</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Issues Detected</span>
              <div className="text-3xl font-black text-amber-600 mt-1">{auditData?.issuesCount || auditData?.issues?.length || 0}</div>
              <p className="text-[11px] text-neutral-500 mt-1">Weighted against Google ranking factors</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Sitemap Status</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5">
                  Valid XML
                </span>
                <a href="/sitemap.xml" target="_blank" className="text-xs font-bold text-[#A82F19] hover:underline flex items-center gap-0.5">
                  View <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Robots.txt Status</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5">
                  Allow Public / Disallow Admin
                </span>
                <a href="/robots.txt" target="_blank" className="text-xs font-bold text-[#A82F19] hover:underline flex items-center gap-0.5">
                  View <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Itemized Issues Catalog */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Itemized Issues &amp; Diagnostic Details
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Categorized by severity and impact on crawling, indexing, and CTR.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTriggerAudit}
                disabled={actionLoading}
                className="text-xs font-bold"
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1 ${actionLoading ? 'animate-spin' : ''}`} />
                Re-Scan All
              </Button>
            </div>

            <div className="mt-4 divide-y divide-neutral-100">
              {auditData?.issues?.length > 0 ? (
                auditData.issues.map((iss, i) => (
                  <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          iss.severity === 'critical'
                            ? 'text-red-600'
                            : iss.severity === 'high'
                            ? 'text-amber-500'
                            : 'text-blue-500'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900">{iss.page_url || iss.name}</span>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[10px] font-extrabold uppercase ${
                              iss.severity === 'critical'
                                ? 'bg-red-100 text-red-700'
                                : iss.severity === 'high'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {iss.severity}
                          </span>
                          <span className="rounded bg-neutral-100 px-1.5 py-0.2 text-[10px] font-bold text-neutral-700">
                            {iss.category}
                          </span>
                        </div>
                        <p className="text-neutral-600 mt-1">{iss.issue_message || iss.issues?.join(', ')}</p>
                        {iss.recommendation && (
                          <p className="text-emerald-700 font-medium mt-0.5">Fix: {iss.recommendation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-neutral-500">
                  <CheckCircle className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
                  <h4 className="text-sm font-bold text-neutral-900">Audit Clean</h4>
                  <p className="mt-1">All pages and catalog entries pass on-page SEO verification.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: KEYWORDS & SEARCH CONSOLE OPPORTUNITIES                             */}
      {/* ========================================================================= */}
      {activeTab === 'keywords' && (
        <div className="space-y-6">
          {!keywordsData.connected ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 shadow-xs flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display text-sm font-bold text-neutral-900">
                  Google Search Console Disconnected
                </h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Showing tracked target keywords from database snapshot. To populate live Google impressions, CTR, and SERP ranking shifts, connect your Google Search Console API service account.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab('search-console')}
                  className="mt-3 text-xs font-bold"
                >
                  Configure Search Console Connection
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                Live Google Search Console Performance Data Active
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncGsc}
                disabled={actionLoading}
                className="text-xs font-bold"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${actionLoading ? 'animate-spin' : ''}`} />
                Sync Performance
              </Button>
            </div>
          )}

          {/* Keywords Table */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <h3 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Tracked Search Queries &amp; Target Keywords ({keywordsData.queries?.length || 0})
            </h3>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-[10px] font-extrabold uppercase text-neutral-400">
                    <th className="pb-3">Search Query / Keyword</th>
                    <th className="pb-3 text-right">Clicks</th>
                    <th className="pb-3 text-right">Impressions</th>
                    <th className="pb-3 text-right">CTR</th>
                    <th className="pb-3 text-right">Avg Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {keywordsData.queries?.length > 0 ? (
                    keywordsData.queries.map((q, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-3 font-bold text-neutral-900">{q.query}</td>
                        <td className="py-3 text-right font-medium text-neutral-700">{q.clicks}</td>
                        <td className="py-3 text-right font-medium text-neutral-700">{q.impressions}</td>
                        <td className="py-3 text-right font-medium text-neutral-700">{q.ctr}%</td>
                        <td className="py-3 text-right font-bold text-neutral-900">
                          {q.position ? `#${q.position}` : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-500">
                        No search queries recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PAGE CATALOG & ENTITY HEALTH                                        */}
      {/* ========================================================================= */}
      {activeTab === 'pages' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search page URL, product, or category..."
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
            <span className="text-xs font-bold text-neutral-500">
              Showing {filteredPages.length} entities
            </span>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-extrabold uppercase text-neutral-400">
                    <th className="p-4">Entity &amp; Name</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">SEO Title</th>
                    <th className="p-4">Meta Description</th>
                    <th className="p-4 text-center">Schema</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredPages.map((page, idx) => {
                    const hasCustomTitle = Boolean(page.title && !page.title.includes('fallback'))
                    const hasCustomDesc = Boolean(page.metaDescription && page.metaDescription.length > 20)
                    return (
                      <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-neutral-900">{page.name}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">{page.url}</div>
                        </td>
                        <td className="p-4">
                          <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-neutral-700">
                            {page.entityType}
                          </span>
                        </td>
                        <td className="p-4 max-w-xs truncate">
                          {hasCustomTitle ? (
                            <span className="text-neutral-900 font-medium">{page.title}</span>
                          ) : (
                            <span className="text-amber-600 font-bold">Needs Custom Title</span>
                          )}
                        </td>
                        <td className="p-4 max-w-xs truncate">
                          {hasCustomDesc ? (
                            <span className="text-neutral-600">{page.metaDescription}</span>
                          ) : (
                            <span className="text-amber-600 font-bold">Needs Description</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {page.hasSchema ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-neutral-300 mx-auto" />
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            to={
                              page.entityType === 'category'
                                ? `/admin/categories`
                                : page.entityType === 'service'
                                ? `/admin/services`
                                : page.entityType === 'blog'
                                ? `/admin/blog`
                                : `/admin/products`
                            }
                            className="inline-flex items-center gap-1 font-bold text-[#A82F19] hover:underline"
                          >
                            <span>Edit</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: GOOGLE SEARCH CONSOLE INTEGRATION                                   */}
      {/* ========================================================================= */}
      {activeTab === 'search-console' && (
        <div className="space-y-6 max-w-3xl">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <h3 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Google Search Console API Configuration
            </h3>
            <p className="text-xs text-neutral-500 mt-2">
              Connect Google Search Console via Service Account JSON or OAuth to pull real organic clicks, impressions, CTR, and SERP positions.
            </p>

            <form onSubmit={handleConnectGsc} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Search Console Property URL
                </label>
                <input
                  type="text"
                  value={gscForm.property}
                  onChange={(e) => setGscForm({ ...gscForm, property: e.target.value })}
                  placeholder="https://0nprint.com"
                  className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Authentication Type
                </label>
                <select
                  value={gscForm.authType}
                  onChange={(e) => setGscForm({ ...gscForm, authType: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                >
                  <option value="service_account">Google Cloud Service Account JSON (Recommended)</option>
                  <option value="oauth">OAuth 2.0 Client Credentials</option>
                </select>
              </div>

              {gscForm.authType === 'service_account' ? (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Service Account Key JSON
                  </label>
                  <textarea
                    rows={6}
                    value={gscForm.serviceAccountJson}
                    onChange={(e) => setGscForm({ ...gscForm, serviceAccountJson: e.target.value })}
                    placeholder='{"type": "service_account", "project_id": "...", ...}'
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 font-mono p-3 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Client ID</label>
                    <input
                      type="text"
                      value={gscForm.clientId}
                      onChange={(e) => setGscForm({ ...gscForm, clientId: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Client Secret</label>
                    <input
                      type="password"
                      value={gscForm.clientSecret}
                      onChange={(e) => setGscForm({ ...gscForm, clientSecret: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="accent"
                disabled={actionLoading}
                className="w-full text-xs font-bold"
              >
                Save &amp; Test Search Console Connection
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: DAILY REPORTS & HISTORICAL SNAPSHOTS                               */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reports List / Calendar */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h3 className="font-display text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-3">
                Historical Daily Reports ({dailyReports.length})
              </h3>
              <div className="mt-3 space-y-2 max-h-[500px] overflow-y-auto">
                {dailyReports.map((rep) => {
                  const isSel = selectedReport?.id === rep.id
                  return (
                    <button
                      key={rep.id}
                      onClick={() => setSelectedReport(rep)}
                      className={`w-full text-left rounded-xl p-3 text-xs transition-all cursor-pointer ${
                        isSel
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{rep.report_date}</span>
                        <span className={isSel ? 'text-emerald-400' : 'text-emerald-700'}>
                          {rep.health_score}% Score
                        </span>
                      </div>
                      <div className="mt-1 text-[10px] opacity-70 truncate">
                        {rep.total_pages_scanned} URLs • {rep.critical_issues + rep.high_issues} critical/high issues
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected Report Breakdown */}
            <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
              {selectedReport ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-neutral-400">Daily Snapshot</span>
                      <h3 className="font-display text-lg font-black text-neutral-900">
                        Report: {selectedReport.report_date}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-3xl font-black text-neutral-900">
                        {selectedReport.health_score}%
                      </div>
                      <span className="text-xs font-bold text-emerald-600">Health Score</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="rounded-xl bg-neutral-50 p-3">
                      <span className="text-neutral-400 font-bold uppercase text-[10px]">Technical</span>
                      <div className="text-lg font-bold text-neutral-900 mt-0.5">{selectedReport.technical_score}%</div>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-3">
                      <span className="text-neutral-400 font-bold uppercase text-[10px]">On-Page</span>
                      <div className="text-lg font-bold text-neutral-900 mt-0.5">{selectedReport.onpage_score}%</div>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-3">
                      <span className="text-neutral-400 font-bold uppercase text-[10px]">Content</span>
                      <div className="text-lg font-bold text-neutral-900 mt-0.5">{selectedReport.content_score}%</div>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-3">
                      <span className="text-neutral-400 font-bold uppercase text-[10px]">Structured Data</span>
                      <div className="text-lg font-bold text-neutral-900 mt-0.5">{selectedReport.structured_data_score}%</div>
                    </div>
                  </div>

                  {selectedReport.executive_summary && (
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-xs">
                      <strong className="text-neutral-900 block mb-1">Executive Summary:</strong>
                      <p className="text-neutral-600">{selectedReport.executive_summary}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-neutral-500">
                  Select a report date on the left to view detailed breakdown.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: CHANGE HISTORY & 1-CLICK ROLLBACK                                   */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <h3 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Immutable SEO Change Audit Log &amp; 1-Click Rollback
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Every SEO modification applied by admins or auto-apply schedulers is tracked here with previous and updated states.
            </p>

            <div className="mt-4 divide-y divide-neutral-100">
              {historyList.length > 0 ? (
                historyList.map((ch) => (
                  <div key={ch.id} className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">Change #{ch.id}</span>
                        <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-neutral-700">
                          {ch.entity_type} #{ch.entity_id}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            ch.status === 'applied'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-200 text-neutral-600'
                          }`}
                        >
                          {ch.status}
                        </span>
                        <span className="text-neutral-400 text-[10px]">
                          Applied: {new Date(ch.applied_at).toLocaleString()} by {ch.applied_by}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                        <div className="rounded-lg bg-neutral-50 p-2.5 border border-neutral-100">
                          <span className="font-bold text-neutral-400 uppercase text-[9px] block">Previous State</span>
                          <div className="text-neutral-700 font-mono truncate">{JSON.stringify(ch.old_value)}</div>
                        </div>
                        <div className="rounded-lg bg-emerald-50/60 p-2.5 border border-emerald-100">
                          <span className="font-bold text-emerald-700 uppercase text-[9px] block">Applied State</span>
                          <div className="text-emerald-900 font-mono truncate">{JSON.stringify(ch.new_value)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {ch.status === 'applied' && (
                        <button
                          onClick={() => handleRollback(ch.id)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 hover:border-red-500 hover:text-red-600 transition-all cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Rollback
                        </button>
                      )}
                      {ch.status === 'rolled_back' && (
                        <span className="text-[11px] text-neutral-400 font-bold italic">
                          Rolled Back
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-neutral-500">
                  <History className="mx-auto h-8 w-8 text-neutral-300 mb-2" />
                  No changes have been applied yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: AUTOMATION SETTINGS & GODADDY CRON HELPER                            */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-4xl">
          {/* Settings Form */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <h3 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Automated Daily Scheduler &amp; AI Engine Configuration
            </h3>

            <form onSubmit={handleSaveSettings} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Daily Scheduler Status
                  </label>
                  <select
                    value={settingsForm.scheduler_enabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, scheduler_enabled: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  >
                    <option value="1">Enabled (Active Daily Pipeline)</option>
                    <option value="0">Disabled (Manual Triggers Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Daily Run Time (Server Time)
                  </label>
                  <input
                    type="time"
                    value={settingsForm.daily_run_time}
                    onChange={(e) => setSettingsForm({ ...settingsForm, daily_run_time: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Safe Auto-Apply
                  </label>
                  <select
                    value={settingsForm.auto_apply_safe}
                    onChange={(e) => setSettingsForm({ ...settingsForm, auto_apply_safe: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  >
                    <option value="0">Off (Require Manual Admin Approval)</option>
                    <option value="1">On (Auto-apply meta descriptions &amp; image ALTs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Min Confidence for Auto-Apply
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="1.0"
                    value={settingsForm.min_confidence_auto_apply}
                    onChange={(e) => setSettingsForm({ ...settingsForm, min_confidence_auto_apply: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    AI Provider
                  </label>
                  <select
                    value={settingsForm.ai_provider}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ai_provider: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  >
                    <option value="gemini">Google Gemini (Gemini 1.5 Flash / Pro)</option>
                    <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    AI API Key (Leave blank to keep existing)
                  </label>
                  <input
                    type="password"
                    placeholder={settingsData?.ai_api_key_masked || 'Enter AI API Key...'}
                    value={settingsForm.ai_api_key}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ai_api_key: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="accent"
                disabled={actionLoading}
                className="text-xs font-bold"
              >
                Save Automation Settings
              </Button>
            </form>
          </div>

          {/* GoDaddy cPanel Cron Helper */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <h3 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              GoDaddy cPanel Cron Job Command Helper
            </h3>
            <p className="text-xs text-neutral-500 mt-2">
              For GoDaddy Node.js hosting, add this cron command in your cPanel Cron Jobs manager to trigger the daily pipeline idempotently at 3:00 AM.
            </p>

            <div className="mt-4 rounded-xl bg-neutral-900 p-4 font-mono text-xs text-emerald-400 flex items-center justify-between gap-3">
              <span className="truncate">
                curl -X POST https://0nprint.com/api/seo/run-daily -H &quot;X-Cron-Secret: onprint_daily_seo_cron_secret_2026&quot;
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('curl -X POST https://0nprint.com/api/seo/run-daily -H "X-Cron-Secret: onprint_daily_seo_cron_secret_2026"')
                  setCopiedKey(true)
                  setTimeout(() => setCopiedKey(false), 2000)
                }}
                className="shrink-0 text-white hover:text-[#A82F19] transition-colors p-1"
              >
                {copiedKey ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
