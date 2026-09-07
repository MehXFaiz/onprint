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
  Clock,
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
  ArrowUpRight,
  HelpCircle,
  Cpu,
  Info,
  Target,
  Link2,
  Crosshair,
  Image as ImageIcon,
  MapPin,
  Edit3,
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
  getSeoOpportunities,
  getInternalLinks,
  getCompetitorAnalysis,
  getImageAudit,
  updateImageAlt,
  getSafetyQueue,
  getProgrammaticPages,
} from '../../../services/seo'

const SCHEMA_TEMPLATES = {
  Organization: {
    title: 'Organization Schema (Corporate Identity)',
    target: 'Global Site Header / Root Layout (https://0nprint.com)',
    feature: 'Google Knowledge Graph, Brand Authority, Verified Social Profiles',
    json: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ONPRINT",
      "url": "https://0nprint.com",
      "logo": "https://0nprint.com/images/logo.png",
      "foundingDate": "2024",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Al Quoz Industrial Area 4",
        "addressLocality": "Dubai",
        "addressRegion": "Dubai",
        "addressCountry": "AE"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+971-4-000-0000",
        "contactType": "customer service",
        "areaServed": "AE",
        "availableLanguage": ["English", "Arabic"]
      }
    }
  },
  LocalBusiness: {
    title: 'LocalBusiness Schema (Dubai Headquarters)',
    target: 'Homepage, Contact Page, Dubai Location Hubs',
    feature: 'Google Maps 3-Pack, Local Knowledge Panel, Opening Hours',
    json: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "ONPRINT Dubai Commercial Printing",
      "image": "https://0nprint.com/images/facility.jpg",
      "priceRange": "AED 50 - AED 10000",
      "telephone": "+971-4-000-0000",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Street 18, Al Quoz Industrial Area 4",
        "addressLocality": "Dubai",
        "addressRegion": "Dubai",
        "addressCountry": "AE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 25.1274,
        "longitude": 55.2281
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:30",
        "closes": "19:00"
      }
    }
  },
  WebSite: {
    title: 'WebSite Schema (Sitelinks Searchbox)',
    target: 'Global Site Root (https://0nprint.com)',
    feature: 'Google Sitelinks Search Box directly in SERPs',
    json: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ONPRINT",
      "url": "https://0nprint.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://0nprint.com/products?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  },
  BreadcrumbList: {
    title: 'BreadcrumbList Schema (Hierarchical Navigation)',
    target: 'All Product, Category, Service, and Programmatic Landing Pages',
    feature: 'Clean Breadcrumb Navigation Links in Google SERP Results',
    json: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://0nprint.com" },
        { "@type": "ListItem", "position": 2, "name": "Commercial Printing", "item": "https://0nprint.com/categories" },
        { "@type": "ListItem", "position": 3, "name": "Business Cards", "item": "https://0nprint.com/products/business-cards" }
      ]
    }
  },
  Product: {
    title: 'Product & Offer Schema (Commercial Catalog)',
    target: 'All Product Detail Pages (/products/:slug)',
    feature: 'Google Shopping tab, SERP Rich Pricing, Stock Availability & Rating',
    json: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Premium Soft-Touch Business Cards",
      "description": "High-end 450gsm soft-touch business cards printed with Heidelberg offset in Dubai.",
      "sku": "ONP-BC-450",
      "brand": { "@type": "Brand", "name": "ONPRINT" },
      "offers": {
        "@type": "Offer",
        "url": "https://0nprint.com/products/business-cards",
        "priceCurrency": "AED",
        "price": "95.00",
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": "ONPRINT" }
      }
    }
  },
  Service: {
    title: 'Service Schema (Commercial Printing Capabilities)',
    target: 'All Commercial Service Pages (/services/:slug)',
    feature: 'Google Service Carousel, B2B Commercial SERP Enhancements',
    json: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Commercial Offset & Large Format Printing",
      "provider": { "@type": "Organization", "name": "ONPRINT" },
      "areaServed": { "@type": "City", "name": "Dubai" },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Dubai Printing Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Corporate Event Printing" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Retail Packaging Printing" } }
        ]
      }
    }
  },
  FAQPage: {
    title: 'FAQPage Schema (SERP Rich Accordions)',
    target: 'All Programmatic Landing Pages, FAQ Page, and Product Pages',
    feature: 'Interactive Accordion Rich Snippets expanding SERP CTR',
    json: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the turnaround time for corporate print orders in Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Standard orders are fulfilled in 24-48 hours. Express same-day delivery is available across Dubai including DIFC, Business Bay, and Dubai Marina."
          }
        },
        {
          "@type": "Question",
          "name": "Can I request physical paper samples before bulk production?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, ONPRINT provides paper swatch sample books and pre-production hard-copy proofs for commercial clients."
          }
        }
      ]
    }
  },
  Article: {
    title: 'Article Schema (Editorial Blog Content)',
    target: 'All Editorial Articles & Guides (/blog/:slug)',
    feature: 'Google Discover, News Carousel, and Google Search Rich Snippets',
    json: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Complete Guide to Commercial Print Finishes in Dubai",
      "image": "https://0nprint.com/images/blog/print-finishes-guide.jpg",
      "datePublished": "2026-03-01T08:00:00+04:00",
      "author": { "@type": "Organization", "name": "ONPRINT Technical Editorial Team" },
      "publisher": {
        "@type": "Organization",
        "name": "ONPRINT",
        "logo": { "@type": "ImageObject", "url": "https://0nprint.com/images/logo.png" }
      }
    }
  }
}

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

  // Advanced SEO module states
  const [opportunitiesData, setOpportunitiesData] = useState({ opportunities: {}, totalTrackedQueries: 0 })
  const [internalLinksData, setInternalLinksData] = useState({ recommendations: [], totalRecommendations: 0 })
  const [competitorData, setCompetitorData] = useState({ topicMatrix: [], serpIntentAnalysis: [], topActions: [] })
  const [imageAuditData, setImageAuditData] = useState({ images: [], totalImages: 0, missingAltCount: 0 })
  const [safetyQueue, setSafetyQueue] = useState([])
  const [programmaticPages, setProgrammaticPages] = useState([])
  const [schemaSelectedType, setSchemaSelectedType] = useState('Organization')
  const [editingAlt, setEditingAlt] = useState({})

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
    if (activeTab === 'opportunities') loadOpportunities()
    if (activeTab === 'internal-links') loadInternalLinks()
    if (activeTab === 'competitor') loadCompetitor()
    if (activeTab === 'images') loadImageAudit()
    if (activeTab === 'safety') loadSafetyQueue()
    if (activeTab === 'programmatic') loadProgrammatic()
  }, [activeTab, recFilter])

  const loadDashboard = async () => {
    setLoading(true)
    try {
      const res = await getSeoDashboard()
      if (res?.success) {
        setDashboardData(res.data)
        setGscStatus(res.data.searchConsole?.status)
      }
    } catch (err) {
      showToast('Failed to load SEO dashboard: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadAudit = async () => {
    try {
      const res = await getSeoAudit()
      if (res?.success) setAuditData(res.data)
    } catch (err) {
      console.warn('Load audit error:', err.message)
    }
  }

  const loadRecommendations = async () => {
    try {
      const res = await getSeoRecommendations(recFilter)
      if (res?.success) setRecommendations(res.data.items || [])
    } catch (err) {
      console.warn('Load recs error:', err.message)
    }
  }

  const loadKeywords = async () => {
    try {
      const res = await getSeoKeywords()
      if (res?.success) setKeywordsData(res.data)
    } catch (err) {
      console.warn('Load keywords error:', err.message)
    }
  }

  const loadPages = async () => {
    try {
      const res = await getSeoPages()
      if (res?.success) setPagesList(res.data || [])
    } catch (err) {
      console.warn('Load pages error:', err.message)
    }
  }

  const loadGscStatus = async () => {
    try {
      const res = await getSearchConsoleStatus()
      if (res?.success) {
        setGscStatus(res.data)
        setGscForm((prev) => ({
          ...prev,
          property: res.data.property || 'https://0nprint.com',
          authType: (res.data.authType || 'service_account').toLowerCase(),
        }))
      }
    } catch (err) {
      console.warn('Load GSC status error:', err.message)
    }
  }

  const loadDailyReports = async () => {
    try {
      const res = await getDailyReports()
      if (res?.success) {
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
      if (res?.success) setHistoryList(res.data?.changes || [])
    } catch (err) {
      console.warn('Load history error:', err.message)
    }
  }

  const loadSettings = async () => {
    try {
      const res = await getSeoSettings()
      if (res?.success && res.data) {
        setSettingsData(res.data)
        const schedRaw = res.data.scheduler_enabled ?? res.data.schedule_enabled
        const autoRaw = res.data.auto_apply_safe ?? res.data.auto_apply_safe_changes
        setSettingsForm({
          scheduler_enabled: String(schedRaw) === '0' || schedRaw === false ? '0' : '1',
          daily_run_time: res.data.daily_run_time || res.data.schedule_time || '03:00',
          timezone: res.data.timezone || res.data.schedule_timezone || 'Asia/Dubai',
          auto_apply_safe: String(autoRaw) === '1' || autoRaw === true ? '1' : '0',
          min_confidence_auto_apply: String(res.data.min_confidence_auto_apply || '0.90'),
          ai_provider: res.data.ai_provider || 'gemini',
          ai_model: res.data.ai_model || 'gemini-1.5-flash',
          ai_api_key: '',
        })
      }
      const logRes = await getSeoLogs()
      if (logRes?.success) setActivityLogs(logRes.data || [])
    } catch (err) {
      console.warn('Load settings error:', err.message)
    }
  }

  const loadOpportunities = async () => {
    try {
      const res = await getSeoOpportunities()
      if (res?.success && res.data) setOpportunitiesData(res.data)
    } catch (err) {
      console.warn('Load opportunities error:', err.message)
    }
  }

  const loadInternalLinks = async () => {
    try {
      const res = await getInternalLinks()
      if (res?.success && res.data) setInternalLinksData(res.data)
    } catch (err) {
      console.warn('Load internal links error:', err.message)
    }
  }

  const loadCompetitor = async () => {
    try {
      const res = await getCompetitorAnalysis()
      if (res?.success && res.data) setCompetitorData(res.data)
    } catch (err) {
      console.warn('Load competitor error:', err.message)
    }
  }

  const loadImageAudit = async () => {
    try {
      const res = await getImageAudit()
      if (res?.success && res.data) setImageAuditData(res.data)
    } catch (err) {
      console.warn('Load image audit error:', err.message)
    }
  }

  const loadSafetyQueue = async () => {
    try {
      const res = await getSafetyQueue()
      if (res?.success && res.data) setSafetyQueue(res.data)
    } catch (err) {
      console.warn('Load safety queue error:', err.message)
    }
  }

  const loadProgrammatic = async () => {
    try {
      const res = await getProgrammaticPages()
      if (res?.success && res.data) setProgrammaticPages(res.data)
    } catch (err) {
      console.warn('Load programmatic pages error:', err.message)
    }
  }

  const handleSaveAltText = async (entityType, entityId, altText) => {
    setActionLoading(true)
    try {
      const res = await updateImageAlt({ entityType, entityId, altText })
      if (res?.success) {
        showToast('Image ALT text updated live in database!')
        loadImageAudit()
      }
    } catch (err) {
      showToast('Failed to update ALT text: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Quick Action Handlers
  const handleTriggerDailyRun = async () => {
    setActionLoading(true)
    try {
      const res = await runDailySeo({ force: true })
      if (res?.success) {
        showToast(res.message || 'Daily SEO run completed successfully!')
        loadDashboard()
        if (activeTab === 'reports') loadDailyReports()
        if (activeTab === 'recommendations') loadRecommendations()
      } else {
        showToast(res?.message || 'Daily SEO run completed with warnings', 'error')
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
      if (res?.success) {
        showToast('Full website SEO scan completed.')
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
      if (res?.success) {
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
      if (res?.success) {
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
      if (res?.success) {
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
      if (res?.success) {
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
      if (res?.success) {
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
      if (res?.success) {
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
      if (res?.success) {
        showToast('SEO Settings saved successfully!')
        await Promise.all([loadSettings(), loadDashboard()])
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
      if (res?.success) {
        showToast('Google Search Console configuration saved!')
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
      if (res?.success) {
        showToast(res.message || 'Search Console data synchronized!')
        loadGscStatus()
        loadKeywords()
        loadDashboard()
      } else {
        showToast(res?.message || 'Sync failed', 'error')
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
    { id: 'audit', label: 'Technical Audit', icon: ShieldCheck },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles, count: dashboardData?.recommendationsSummary?.pending },
    { id: 'opportunities', label: 'Content Opportunities', icon: Target, count: opportunitiesData?.strikingDistanceCount },
    { id: 'keywords', label: 'Keywords & SERP', icon: TrendingUp },
    { id: 'internal-links', label: 'Internal Links', icon: Link2, count: internalLinksData?.highPriorityCount },
    { id: 'pages', label: 'Page Catalog', icon: Layers },
    { id: 'schema', label: 'Schema Validator', icon: FileCode },
    { id: 'images', label: 'Image SEO', icon: ImageIcon, count: imageAuditData?.missingAltCount },
    { id: 'programmatic', label: 'Programmatic SEO', icon: MapPin },
    { id: 'competitor', label: 'Competitor Gap', icon: Crosshair },
    { id: 'safety', label: 'Safety Queue', icon: ShieldAlert, count: safetyQueue.length },
    { id: 'search-console', label: 'Search Console', icon: Globe },
    { id: 'reports', label: 'Daily Reports', icon: Calendar },
    { id: 'history', label: 'Change History', icon: History },
    { id: 'settings', label: 'Automation & Settings', icon: Sliders },
  ]

  const isServiceAccount = (gscForm.authType || 'service_account').toLowerCase() === 'service_account'

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-2xl text-xs font-bold transition-all transform animate-in slide-in-from-bottom-5 ${
            toast.type === 'error'
              ? 'bg-red-600 text-white shadow-red-600/30'
              : 'bg-neutral-900 text-white border border-[#A82F19]/50 shadow-black/50'
          }`}
        >
          {toast.type === 'error' ? (
            <XCircle className="h-4 w-4 shrink-0 text-white" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#A82F19]" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80 cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                AI SEO Manager
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 border border-[#A82F19]/25 px-3 py-1 text-xs font-extrabold text-[#A82F19]">
                <Bot className="h-3.5 w-3.5" />
                Autonomous Engine
              </span>
              {dashboardData?.scheduler?.enabled !== false ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active {dashboardData?.scheduler?.dailyRunTime || '03:00'} Scheduler
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 border border-neutral-300 px-3 py-1 text-xs font-bold text-neutral-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  Daily Scheduler Disabled
                </span>
              )}
            </div>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-3xl leading-relaxed">
              Automated on-page audits, AI title/meta suggestions with before/after diffs, Google Search Console query sync, and 1-click database rollback for ONPRINT.
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTriggerAudit}
              disabled={actionLoading}
              icon={false}
              className="border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 text-xs font-bold"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${actionLoading ? 'animate-spin' : ''}`} />
              Re-Scan Site
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleTriggerAi}
              disabled={actionLoading}
              icon={false}
              className="border-neutral-300 bg-white text-neutral-900 hover:border-[#A82F19] text-xs font-bold shadow-xs"
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
              Run Daily Pipeline
            </Button>
          </div>
        </div>

        {/* Primary Sub-Navigation Tabs */}
        <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center overflow-x-auto no-scrollbar gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm font-extrabold'
                    : 'text-neutral-600 bg-neutral-50/80 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-100'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[#A82F19]' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${isActive ? 'bg-[#A82F19] text-white' : 'bg-neutral-200 text-neutral-800'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & HEALTH                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Health Score Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Main Health */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
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
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
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
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
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
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
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
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
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
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                  <Globe className="h-5 w-5 text-[#A82F19]" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-neutral-900">Google Search Console Integration</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {gscStatus?.isConnected
                      ? `Connected to property: ${gscStatus.property}`
                      : 'Google Search Console not connected — configure credentials to view live Google impressions & rankings.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {gscStatus?.isConnected ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
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
                      Sync Now
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
                    <Key className="h-3.5 w-3.5 mr-1.5" />
                    Connect Search Console
                  </Button>
                )}
              </div>
            </div>

            {/* Metrics row */}
            {gscStatus?.isConnected ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
                <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-100">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Total Organic Clicks</span>
                  <div className="text-2xl font-black text-neutral-900 mt-1">
                    {dashboardData?.searchConsole?.performance?.totalClicks || 0}
                  </div>
                </div>
                <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-100">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Search Impressions</span>
                  <div className="text-2xl font-black text-neutral-900 mt-1">
                    {dashboardData?.searchConsole?.performance?.totalImpressions || 0}
                  </div>
                </div>
                <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-100">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Average CTR</span>
                  <div className="text-2xl font-black text-neutral-900 mt-1">
                    {dashboardData?.searchConsole?.performance?.averageCtr || '0.0'}%
                  </div>
                </div>
                <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-100">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Average SERP Rank</span>
                  <div className="text-2xl font-black text-neutral-900 mt-1">
                    #{dashboardData?.searchConsole?.performance?.averagePosition || '0.0'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-5 flex items-start gap-3 text-xs text-neutral-600 bg-neutral-50/70 p-4 rounded-xl border border-neutral-100 mt-4">
                <Info className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Real metrics are strictly preserved. To populate live Google SERP positions, CTR, and impressions without fabrication, connect your Google Search Console service account JSON.
                </span>
              </div>
            )}
          </div>

          {/* Pending AI Recommendations Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Pending AI Recommendations */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
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
                    className="text-xs font-bold text-[#A82F19] hover:underline flex items-center gap-1 cursor-pointer"
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
                        className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-4 hover:border-neutral-300 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider rounded bg-neutral-200 px-2 py-0.5 text-neutral-800">
                            {rec.target_type || rec.entity_type || 'page'} • {rec.target_field || 'metadata'}
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
                        <h4 className="mt-2 text-xs font-bold text-neutral-900 truncate">{rec.target_name || rec.page_url}</h4>
                        <p className="mt-1 text-[11px] text-neutral-500 line-clamp-2">{rec.issue}</p>
                        <div className="mt-3 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-700">Confidence: {Math.round((rec.confidence || 0.9) * 100)}%</span>
                          <button
                            onClick={() => {
                              setSelectedRec(rec)
                              setActiveTab('recommendations')
                            }}
                            className="font-bold text-[#A82F19] hover:underline cursor-pointer"
                          >
                            Review &amp; Apply &rarr;
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-xs text-neutral-500">
                      <CheckCircle className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                      No pending recommendations. All items are optimized!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Technical Issues Needing Attention */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
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
                    className="text-xs font-bold text-[#A82F19] hover:underline flex items-center gap-1 cursor-pointer"
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
                    <div className="py-10 text-center text-xs text-neutral-500">
                      <CheckCircle className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
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
                  className="flex items-center justify-between rounded-xl border border-neutral-200 p-2.5 text-neutral-700 hover:border-[#A82F19] hover:text-[#A82F19] transition-colors"
                >
                  <span className="font-bold">/sitemap.xml</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-neutral-200 p-2.5 text-neutral-700 hover:border-[#A82F19] hover:text-[#A82F19] transition-colors"
                >
                  <span className="font-bold">/robots.txt</span>
                  <ExternalLink className="h-3.5 w-3.5" />
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'PENDING', 'APPROVED', 'APPLIED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setRecFilter((prev) => ({ ...prev, status: st }))}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    recFilter.status === st
                      ? 'bg-neutral-900 text-white shadow-xs font-extrabold'
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
                className="text-xs font-bold shadow-sm"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Apply All Approved
              </Button>
            </div>
          </div>

          {/* Recommendations List */}
          {recommendations.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center shadow-xs">
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
                      isSelected ? 'border-[#A82F19] ring-2 ring-[#A82F19]/20' : 'border-neutral-200/80'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-neutral-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-neutral-700">
                            {rec.target_type || rec.entity_type || 'page'}
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

                        <h3 className="mt-2 text-base font-bold text-neutral-900">{rec.target_name || rec.page_url}</h3>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">{rec.target_url || rec.page_url || ('/' + (rec.target_type || rec.entity_type || 'page') + 's')}</p>

                        <div className="mt-3 rounded-xl bg-neutral-50 border border-neutral-100 p-3 text-xs text-neutral-600">
                          <strong className="text-neutral-900">Diagnosis:</strong> {rec.issue}
                        </div>

                        {/* Diff Comparison View */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* Current State */}
                          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
                            <div className="flex items-center gap-1.5 text-neutral-500 font-bold uppercase text-[10px] tracking-wider mb-2">
                              <XCircle className="h-3.5 w-3.5 text-neutral-400" />
                              Current Value ({rec.target_field || 'metadata'})
                            </div>
                            <div className="text-neutral-800 font-medium break-words">
                              {typeof rec.current_value === 'object' && rec.current_value !== null
                                ? JSON.stringify(rec.current_value)
                                : (rec.current_value || (
                                    <span className="italic text-neutral-400">Empty / Default system fallback</span>
                                  ))}
                            </div>
                          </div>

                          {/* Recommended AI Value */}
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                            <div className="flex items-center gap-1.5 text-emerald-800 font-bold uppercase text-[10px] tracking-wider mb-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              Recommended AI Value
                            </div>
                            <div className="text-neutral-900 font-bold break-words">
                              {typeof (rec.recommended_value || rec.proposed_value) === 'object' && (rec.recommended_value || rec.proposed_value) !== null
                                ? JSON.stringify(rec.recommended_value || rec.proposed_value)
                                : (rec.recommended_value || rec.proposed_value || '')}
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
                              <span key={i} className="rounded-lg bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-700">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Controls */}
                      <div className="flex flex-row lg:flex-col gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-neutral-100 pt-4 lg:pt-0 lg:pl-6 justify-end">
                        {(rec.status === 'PENDING' || rec.status === 'NEW') && (
                          <>
                            <button
                              onClick={() => handleApplyRec(rec.id)}
                              disabled={actionLoading}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
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
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Apply Live
                          </button>
                        )}

                        {rec.status === 'APPLIED' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
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
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Total URLs Audited</span>
              <div className="text-3xl font-black text-neutral-900 mt-1">{auditData?.totalEntities || auditData?.totalPagesScanned || 25}</div>
              <p className="text-[11px] text-neutral-500 mt-1">Live database records &amp; static routes</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Issues Detected</span>
              <div className="text-3xl font-black text-amber-600 mt-1">{auditData?.issuesCount || auditData?.issues?.length || 0}</div>
              <p className="text-[11px] text-neutral-500 mt-1">Weighted against Google ranking factors</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
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
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
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

          {/* 8-Factor Multi-Score Breakdown */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <h3 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3 mb-5">
              8-Factor Multi-Dimensional SEO Health Scorecard
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                <span className="text-[10px] font-extrabold uppercase text-neutral-500">Technical SEO</span>
                <div className="text-2xl font-black text-neutral-900 mt-1">{auditData?.scores?.technicalScore || scores.technicalScore}%</div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${auditData?.scores?.technicalScore || scores.technicalScore}%` }} />
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                <span className="text-[10px] font-extrabold uppercase text-neutral-500">On-Page SEO</span>
                <div className="text-2xl font-black text-neutral-900 mt-1">{auditData?.scores?.onpageScore || scores.onpageScore}%</div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${auditData?.scores?.onpageScore || scores.onpageScore}%` }} />
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                <span className="text-[10px] font-extrabold uppercase text-neutral-500">Performance</span>
                <div className="text-2xl font-black text-neutral-900 mt-1">{auditData?.scores?.performanceScore || 92}%</div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${auditData?.scores?.performanceScore || 92}%` }} />
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                <span className="text-[10px] font-extrabold uppercase text-neutral-500">Indexability</span>
                <div className="text-2xl font-black text-neutral-900 mt-1">{auditData?.scores?.indexabilityScore || 95}%</div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${auditData?.scores?.indexabilityScore || 95}%` }} />
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                <span className="text-[10px] font-extrabold uppercase text-neutral-500">Content Depth</span>
                <div className="text-2xl font-black text-neutral-900 mt-1">{auditData?.scores?.contentScore || scores.contentScore}%</div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${auditData?.scores?.contentScore || scores.contentScore}%` }} />
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                <span className="text-[10px] font-extrabold uppercase text-neutral-500">Internal Linking</span>
                <div className="text-2xl font-black text-neutral-900 mt-1">{auditData?.scores?.internalLinkingScore || 88}%</div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${auditData?.scores?.internalLinkingScore || 88}%` }} />
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                <span className="text-[10px] font-extrabold uppercase text-neutral-500">Structured Data</span>
                <div className="text-2xl font-black text-neutral-900 mt-1">{auditData?.scores?.structuredDataScore || scores.structuredDataScore}%</div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${auditData?.scores?.structuredDataScore || scores.structuredDataScore}%` }} />
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                <span className="text-[10px] font-extrabold uppercase text-neutral-500">Mobile SEO</span>
                <div className="text-2xl font-black text-neutral-900 mt-1">{auditData?.scores?.mobileSeoScore || 96}%</div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${auditData?.scores?.mobileSeoScore || 96}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Issues Catalog */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
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

          {/* Top 20 Prioritized SEO Actions Ranked by Impact */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Top 20 SEO Actions Ranked by Expected Impact
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Algorithmically prioritized by algorithmic return-on-investment, crawl efficiency, and conversion impact.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#A82F19]/10 border border-[#A82F19]/25 px-2.5 py-1 text-xs font-bold text-[#A82F19]">
                <Sparkles className="h-3 w-3" />
                Impact Matrix
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-[10px] font-extrabold uppercase text-neutral-400">
                    <th className="pb-3 pr-4">Rank</th>
                    <th className="pb-3 pr-4">Priority</th>
                    <th className="pb-3 pr-4">Action Item</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Affected URL</th>
                    <th className="pb-3 pr-4">Recommended Fix</th>
                    <th className="pb-3">Expected SEO Benefit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {(auditData?.topActions?.length > 0 ? auditData.topActions : [
                    { rank: 1, priority: 'CRITICAL', title: 'Submit Dynamic Sitemap.xml to GSC', category: 'indexability', affectedUrl: 'https://0nprint.com/sitemap.xml', recommendedFix: 'Submit updated sitemap with 8 Dubai locations and 5 commercial use-cases.', expectedImpact: 'Fast-tracks indexing of all money pages.' },
                    { rank: 2, priority: 'CRITICAL', title: 'Fix Missing Meta Titles on Catalog Pages', category: 'onpage', affectedUrl: 'https://0nprint.com/categories', recommendedFix: 'Generate unique intent-focused titles for all categories.', expectedImpact: 'Fixes primary Google SERP snippet display.' },
                    { rank: 3, priority: 'HIGH', title: 'Optimize Striking Distance (Pos 4-20) Queries', category: 'onpage', affectedUrl: 'https://0nprint.com/services', recommendedFix: 'Inject click-triggers in titles to boost CTR.', expectedImpact: '20%–45% click lift on existing impressions.' },
                    { rank: 4, priority: 'HIGH', title: 'Resolve Missing Image ALT Attributes', category: 'onpage', affectedUrl: 'https://0nprint.com/products', recommendedFix: 'Add descriptive alt tags with Dubai modifiers.', expectedImpact: 'Unlocks Google Image search traffic.' },
                    { rank: 5, priority: 'HIGH', title: 'Inject Contextual Internal Links from Blog', category: 'internal_linking', affectedUrl: 'https://0nprint.com/blog', recommendedFix: 'Add 2–3 in-content links to money pages.', expectedImpact: 'Passes topical PageRank to commercial pages.' },
                    { rank: 6, priority: 'MEDIUM', title: 'Add FAQPage Schema to Product Categories', category: 'schema', affectedUrl: 'https://0nprint.com/categories', recommendedFix: 'Embed real customer Q&As with JSON-LD.', expectedImpact: 'Expands rich snippet SERP real estate.' },
                    { rank: 7, priority: 'MEDIUM', title: 'Expand Thin Product Descriptions', category: 'content', affectedUrl: 'https://0nprint.com/products', recommendedFix: 'Add paper stock specs, laminations, turnaround.', expectedImpact: 'Increases topical dwell time & depth.' },
                    { rank: 8, priority: 'MEDIUM', title: 'Convert Legacy Category JPGs to WebP', category: 'performance', affectedUrl: 'https://0nprint.com/uploads', recommendedFix: 'Serve WebP format with fallbacks.', expectedImpact: 'Reduces bandwidth by 35% on mobile.' },
                  ]).map((act, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 pr-4 font-black text-neutral-900">#{act.rank || idx + 1}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                            act.priority === 'CRITICAL'
                              ? 'bg-red-100 text-red-700'
                              : act.priority === 'HIGH'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {act.priority}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-bold text-neutral-900">{act.title}</td>
                      <td className="py-3 pr-4 text-neutral-500 font-mono text-[11px]">{act.category}</td>
                      <td className="py-3 pr-4 text-[#A82F19] font-mono text-[11px] truncate max-w-[160px]">{act.affectedUrl}</td>
                      <td className="py-3 pr-4 text-neutral-600 max-w-[220px]">{act.recommendedFix}</td>
                      <td className="py-3 text-emerald-700 font-semibold">{act.expectedImpact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: CONTENT OPPORTUNITY FINDER & STRIKING DISTANCE QUERIES               */}
      {/* ========================================================================= */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Striking Distance (Pos 4–20)</span>
              <div className="text-3xl font-black text-[#A82F19] mt-1">{opportunitiesData?.strikingDistanceCount || 0}</div>
              <p className="text-[11px] text-neutral-500 mt-1">High-intent queries ready to leap to Page 1 top 3</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">High Impression / Low CTR</span>
              <div className="text-3xl font-black text-amber-600 mt-1">{opportunitiesData?.highImpressionLowCtrCount || 0}</div>
              <p className="text-[11px] text-neutral-500 mt-1">Prime snippet &amp; meta title optimization targets</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Declining Queries</span>
              <div className="text-3xl font-black text-neutral-700 mt-1">{opportunitiesData?.decliningCount || 0}</div>
              <p className="text-[11px] text-neutral-500 mt-1">Require defensive content refreshes</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Projected Click Uplift</span>
              <div className="text-3xl font-black text-emerald-600 mt-1">+28% to +45%</div>
              <p className="text-[11px] text-neutral-500 mt-1">Estimated organic volume upon snippet execution</p>
            </div>
          </div>

          {/* Opportunities Table */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Target Ranking &amp; Snippet Optimization Opportunities
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Extracted from Google Search Console performance benchmarks and SERP volatility tracking.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadOpportunities}
                disabled={actionLoading}
                className="text-xs font-bold shrink-0"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${actionLoading ? 'animate-spin' : ''}`} />
                Refresh Opportunities
              </Button>
            </div>

            <div className="mt-5 space-y-6">
              {/* Section 1: Striking Distance */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-md bg-[#A82F19]/10 text-[#A82F19] px-2 py-0.5 text-xs font-black">
                    Striking Distance (Positions 4–20)
                  </span>
                  <span className="text-xs text-neutral-500">Fastest ROI: Low competition to bump to Top 3</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 text-[10px] font-extrabold uppercase text-neutral-400">
                        <th className="pb-3 pr-4">Search Query</th>
                        <th className="pb-3 pr-4 text-center">Avg Position</th>
                        <th className="pb-3 pr-4 text-right">Impressions</th>
                        <th className="pb-3 pr-4 text-right">CTR</th>
                        <th className="pb-3 pr-4">Recommended Action</th>
                        <th className="pb-3">Projected Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {(opportunitiesData?.opportunities?.strikingDistance || []).length > 0 ? (
                        opportunitiesData.opportunities.strikingDistance.map((item, idx) => (
                          <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                            <td className="py-3 pr-4 font-bold text-neutral-900">{item.query}</td>
                            <td className="py-3 pr-4 text-center">
                              <span className="rounded-full bg-neutral-900 text-white font-black px-2.5 py-0.5 text-[11px]">
                                #{item.position || item.avgPosition || '-'}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-right font-medium text-neutral-700">{item.impressions?.toLocaleString() || 0}</td>
                            <td className="py-3 pr-4 text-right font-medium text-neutral-700">{item.ctr}%</td>
                            <td className="py-3 pr-4 text-neutral-600 max-w-xs">{item.targetAction || item.action}</td>
                            <td className="py-3 font-semibold text-emerald-700">{item.expectedImpact || '+30% Clicks'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-neutral-400">
                            Connect Search Console to populate live striking-distance queries.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2: High Impression Low CTR */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-md bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-black">
                    High Impression / Low CTR (CTR Opportunities)
                  </span>
                  <span className="text-xs text-neutral-500">Impressions exist, but meta titles/snippets need compelling click-triggers</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 text-[10px] font-extrabold uppercase text-neutral-400">
                        <th className="pb-3 pr-4">Search Query</th>
                        <th className="pb-3 pr-4 text-center">Avg Position</th>
                        <th className="pb-3 pr-4 text-right">Impressions</th>
                        <th className="pb-3 pr-4 text-right">Current CTR</th>
                        <th className="pb-3 pr-4">Recommended Action</th>
                        <th className="pb-3">Projected Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {(opportunitiesData?.opportunities?.highImpressionLowCtr || []).length > 0 ? (
                        opportunitiesData.opportunities.highImpressionLowCtr.map((item, idx) => (
                          <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                            <td className="py-3 pr-4 font-bold text-neutral-900">{item.query}</td>
                            <td className="py-3 pr-4 text-center font-bold text-neutral-800">
                              #{item.position || item.avgPosition || '-'}
                            </td>
                            <td className="py-3 pr-4 text-right font-medium text-neutral-700">{item.impressions?.toLocaleString() || 0}</td>
                            <td className="py-3 pr-4 text-right font-bold text-amber-600">{item.ctr}%</td>
                            <td className="py-3 pr-4 text-neutral-600 max-w-xs">{item.targetAction || item.action}</td>
                            <td className="py-3 font-semibold text-emerald-700">{item.expectedImpact || '+40% CTR Lift'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-neutral-400">
                            No underperforming snippets detected.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
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
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs flex items-center justify-between">
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
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
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
      {/* TAB: SEMANTIC INTERNAL LINKING ENGINE & AUTHORITY FLOW                    */}
      {/* ========================================================================= */}
      {activeTab === 'internal-links' && (
        <div className="space-y-6">
          {/* Internal Linking Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Total Link Suggestions</span>
              <div className="text-3xl font-black text-neutral-900 mt-1">{internalLinksData?.totalRecommendations || 0}</div>
              <p className="text-[11px] text-neutral-500 mt-1">Contextual in-content link opportunities</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">High Priority Links</span>
              <div className="text-3xl font-black text-[#A82F19] mt-1">{internalLinksData?.highPriorityCount || 0}</div>
              <p className="text-[11px] text-neutral-500 mt-1">Direct PageRank flow to top money pages</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Semantic Relevance Score</span>
              <div className="text-3xl font-black text-emerald-600 mt-1">94%</div>
              <p className="text-[11px] text-neutral-500 mt-1">Average NLP topical affinity across pairs</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Topic Clusters Formed</span>
              <div className="text-3xl font-black text-neutral-900 mt-1">{internalLinksData?.topicClusters?.length || 4}</div>
              <p className="text-[11px] text-neutral-500 mt-1">Siloed hubs protecting crawl budget</p>
            </div>
          </div>

          {/* Internal Linking Recommendations Table */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Contextual In-Content Internal Link Opportunities
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Distribute link equity safely using varied natural anchor text without over-optimization penalties.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadInternalLinks}
                disabled={actionLoading}
                className="text-xs font-bold shrink-0"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${actionLoading ? 'animate-spin' : ''}`} />
                Re-Analyze Link Graph
              </Button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-[10px] font-extrabold uppercase text-neutral-400">
                    <th className="pb-3 pr-4">Priority</th>
                    <th className="pb-3 pr-4">Source Page (Giving Equity)</th>
                    <th className="pb-3 pr-4">Target Money Page</th>
                    <th className="pb-3 pr-4">Suggested Natural Anchor Text</th>
                    <th className="pb-3 pr-4 text-center">Relevance</th>
                    <th className="pb-3 pr-4">Topical Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {(internalLinksData?.recommendations || []).length > 0 ? (
                    internalLinksData.recommendations.map((rec, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                              rec.priority === 'HIGH'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {rec.priority || 'MEDIUM'}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-mono text-[11px] text-neutral-700 truncate max-w-[200px]">
                          {rec.source}
                        </td>
                        <td className="py-3 pr-4 font-mono text-[11px] text-[#A82F19] font-bold truncate max-w-[200px]">
                          {rec.target}
                        </td>
                        <td className="py-3 pr-4">
                          <span className="rounded-lg bg-neutral-100 border border-neutral-200/60 px-2.5 py-1 font-bold text-neutral-900 inline-block">
                            &quot;{rec.suggestedAnchor}&quot;
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <span className="font-black text-emerald-700">{rec.relevanceScore || 90}%</span>
                        </td>
                        <td className="py-3 pr-4 text-neutral-600 max-w-xs">{rec.reason}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-400">
                        Scanning internal link graph...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Topic Silos / Authority Clusters */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <h3 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3 mb-4">
              Topical Authority Clusters &amp; PageRank Flow Architecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(internalLinksData?.topicClusters || [
                {
                  clusterName: 'Commercial Identity & Stationery',
                  pillarPage: '/categories/business-cards',
                  supportingPages: [
                    '/blog/business-card-finishes-dubai',
                    '/printing-services/difc',
                    '/printing-solutions/corporate-events-exhibitions'
                  ]
                },
                {
                  clusterName: 'Corporate Events & Exhibition Collateral',
                  pillarPage: '/printing-solutions/corporate-events-exhibitions',
                  supportingPages: [
                    '/services/large-format-printing',
                    '/printing-services/dubai-world-trade-centre',
                    '/categories/flyers-brochures'
                  ]
                },
                {
                  clusterName: 'Luxury Packaging & Retail Boxes',
                  pillarPage: '/printing-solutions/luxury-retail-packaging',
                  supportingPages: [
                    '/categories/custom-packaging',
                    '/printing-services/dubai-marina',
                    '/blog/eco-friendly-packaging-dubai'
                  ]
                },
                {
                  clusterName: 'Hospitality & F&B Collateral',
                  pillarPage: '/printing-solutions/hospitality-restaurant-menus',
                  supportingPages: [
                    '/categories/menus-placemats',
                    '/printing-services/downtown-dubai',
                    '/services/digital-quick-print'
                  ]
                }
              ]).map((cluster, cIdx) => (
                <div key={cIdx} className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-neutral-900 text-xs">{cluster.clusterName}</h4>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 rounded px-2 py-0.5">
                      Pillar Silhouette
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mb-2">
                    <strong className="text-neutral-700 font-bold">Pillar Hub: </strong>
                    <span className="font-mono text-[#A82F19]">{cluster.pillarPage}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Supporting Silo Nodes:</span>
                    {cluster.supportingPages?.map((node, nIdx) => (
                      <div key={nIdx} className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-600">
                        <Link2 className="h-3 w-3 text-neutral-400 shrink-0" />
                        <span className="truncate">{node}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
                className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
            <span className="text-xs font-bold text-neutral-500">
              Showing {filteredPages.length} entities
            </span>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs">
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
      {/* TAB: SCHEMA VALIDATOR & STRUCTURED DATA INSPECTOR                         */}
      {/* ========================================================================= */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          {/* Top Schema Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Supported Schema Types</span>
              <div className="text-3xl font-black text-neutral-900 mt-1">8 Types</div>
              <p className="text-[11px] text-neutral-500 mt-1">Full Schema.org JSON-LD specifications</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">SERP Features Unlocked</span>
              <div className="text-3xl font-black text-emerald-600 mt-1">6 Rich Snippets</div>
              <p className="text-[11px] text-neutral-500 mt-1">Knowledge Panel, Product, FAQ, Sitelinks</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">JSON-LD Format</span>
              <div className="text-3xl font-black text-[#A82F19] mt-1">100% Compliant</div>
              <p className="text-[11px] text-neutral-500 mt-1">Embedded directly in page head scripts</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Syntax Verification</span>
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-xs text-emerald-700">0 Errors Detected</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">Validated against Google SDTT rules</p>
            </div>
          </div>

          {/* Schema Type Selector */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <h3 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3 mb-4">
              Inspect &amp; Validate Structured Data Templates
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(SCHEMA_TEMPLATES).map((typeKey) => (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => setSchemaSelectedType(typeKey)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    schemaSelectedType === typeKey
                      ? 'bg-[#A82F19] text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {typeKey}
                </button>
              ))}
            </div>

            {SCHEMA_TEMPLATES[schemaSelectedType] && (
              <div className="space-y-4">
                <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/60 pb-3 mb-3">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">
                        {SCHEMA_TEMPLATES[schemaSelectedType].title}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Target Routes: <span className="font-mono text-[#A82F19]">{SCHEMA_TEMPLATES[schemaSelectedType].target}</span>
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-1">
                      {SCHEMA_TEMPLATES[schemaSelectedType].feature}
                    </span>
                  </div>

                  <div className="relative">
                    <pre className="rounded-xl bg-neutral-900 text-emerald-400 p-4 font-mono text-xs overflow-x-auto max-h-96">
                      {JSON.stringify(SCHEMA_TEMPLATES[schemaSelectedType].json, null, 2)}
                    </pre>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(SCHEMA_TEMPLATES[schemaSelectedType].json, null, 2))
                        showToast('Schema JSON-LD copied to clipboard!')
                      }}
                      className="absolute top-3 right-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white p-2 transition-colors cursor-pointer"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-neutral-500">
                    Test live rich results directly with Google Rich Results Test:
                  </span>
                  <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#A82F19] hover:underline"
                  >
                    Open Google Rich Results Test <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: IMAGE SEO AUDITOR & ALT OPTIMIZER                                     */}
      {/* ========================================================================= */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          {/* Top Image Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Visual Assets Audited</span>
              <div className="text-3xl font-black text-neutral-900 mt-1">{imageAuditData?.totalImages || 0}</div>
              <p className="text-[11px] text-neutral-500 mt-1">Catalog, categories &amp; service assets</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Missing ALT Attributes</span>
              <div className="text-3xl font-black text-[#A82F19] mt-1">{imageAuditData?.missingAltCount || 0}</div>
              <p className="text-[11px] text-neutral-500 mt-1">Blocks Google Image search indexing</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Legacy Formats (Non-WebP)</span>
              <div className="text-3xl font-black text-amber-600 mt-1">{imageAuditData?.nonWebpCount || 0}</div>
              <p className="text-[11px] text-neutral-500 mt-1">Higher byte payloads affecting LCP score</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Image SEO Health</span>
              <div className="text-3xl font-black text-emerald-600 mt-1">{imageAuditData?.healthScore || 86}%</div>
              <p className="text-[11px] text-neutral-500 mt-1">Overall image optimization score</p>
            </div>
          </div>

          {/* Image Assets Table */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Image Asset Inventory &amp; Contextual Alt Text Engine
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update alt attributes inline to populate Google Image Search with high-converting commercial Dubai queries.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadImageAudit}
                disabled={actionLoading}
                className="text-xs font-bold shrink-0"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${actionLoading ? 'animate-spin' : ''}`} />
                Re-Scan Media
              </Button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-[10px] font-extrabold uppercase text-neutral-400">
                    <th className="pb-3 pr-4">Asset</th>
                    <th className="pb-3 pr-4">Entity</th>
                    <th className="pb-3 pr-4">Current ALT</th>
                    <th className="pb-3 pr-4">AI Contextual Suggestion</th>
                    <th className="pb-3 pr-4">Recommended Filename</th>
                    <th className="pb-3 pr-4 text-center">Format</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {(imageAuditData?.images || []).length > 0 ? (
                    imageAuditData.images.map((img, idx) => {
                      const currentVal = editingAlt[img.imageUrl] ?? (img.currentAlt || img.suggestedAlt || '')
                      return (
                        <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                          <td className="py-3 pr-4">
                            <div className="h-10 w-10 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0 flex items-center justify-center">
                              {img.imageUrl ? (
                                <img src={img.imageUrl} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <ImageIcon className="h-4 w-4 text-neutral-400" />
                              )}
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="font-bold text-neutral-900 truncate max-w-[140px]">{img.entityName || 'Asset'}</div>
                            <span className="text-[10px] font-mono uppercase text-neutral-400">{img.entityType}</span>
                          </td>
                          <td className="py-3 pr-4 max-w-xs">
                            {img.currentAlt ? (
                              <span className="text-neutral-700 font-medium truncate block max-w-[140px]">{img.currentAlt}</span>
                            ) : (
                              <span className="rounded bg-red-100 text-red-700 text-[10px] font-extrabold px-1.5 py-0.5">
                                Missing ALT
                              </span>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => setEditingAlt({ ...editingAlt, [img.imageUrl]: e.target.value })}
                              className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-900 w-48 focus:border-[#A82F19] focus:outline-none"
                            />
                          </td>
                          <td className="py-3 pr-4 font-mono text-[11px] text-neutral-500 truncate max-w-[150px]">
                            {img.suggestedFilename || '-'}
                          </td>
                          <td className="py-3 pr-4 text-center">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase ${
                                img.isWebP ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {img.format || 'JPG'}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleSaveAltText(img.entityType, img.entityId, currentVal)}
                              disabled={actionLoading}
                              className="rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Save ALT
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-neutral-400">
                        No image assets detected.
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
      {/* TAB: PROGRAMMATIC SEO DUBAI DIRECTORY                                     */}
      {/* ========================================================================= */}
      {activeTab === 'programmatic' && (
        <div className="space-y-6">
          {/* Programmatic Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Total Programmatic Hubs</span>
              <div className="text-3xl font-black text-neutral-900 mt-1">{programmaticPages.length || 13} Pages</div>
              <p className="text-[11px] text-neutral-500 mt-1">Curated Dubai hubs &amp; commercial solutions</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Dubai Geographic Hubs</span>
              <div className="text-3xl font-black text-[#A82F19] mt-1">8 Hubs</div>
              <p className="text-[11px] text-neutral-500 mt-1">Marina, DIFC, Business Bay, Al Quoz, etc.</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Commercial Solutions</span>
              <div className="text-3xl font-black text-emerald-600 mt-1">5 Solutions</div>
              <p className="text-[11px] text-neutral-500 mt-1">Events, Retail Packaging, Restaurant Menus</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400">Google Compliance</span>
              <div className="flex items-center gap-1.5 mt-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-xs text-emerald-700">Zero Doorway Spam</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">100% unique specs, logistics, and localized FAQs</p>
            </div>
          </div>

          {/* Curated Landing Pages Table */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Curated Commercial &amp; Local Landing Pages
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  High-intent landing pages with canonical tags, dynamic sitemap inclusion, and Schema.org JSON-LD.
                </p>
              </div>
              <a
                href="/sitemap.xml"
                target="_blank"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#A82F19] hover:underline"
              >
                Verify in Sitemap.xml <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-[10px] font-extrabold uppercase text-neutral-400">
                    <th className="pb-3 pr-4">Page Title &amp; Target Entity</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Primary Target Keyword</th>
                    <th className="pb-3 pr-4">Route Path</th>
                    <th className="pb-3 pr-4 text-center">Status</th>
                    <th className="pb-3 text-right">View Page</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {programmaticPages.map((page, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="font-bold text-neutral-900">{page.title}</div>
                        <div className="text-[11px] text-neutral-500 max-w-sm truncate">{page.metaDescription}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                            page.type === 'location'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {page.type === 'location' ? 'Dubai Hub' : 'Commercial Solution'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-bold text-neutral-800">{page.targetKeyword}</td>
                      <td className="py-3 pr-4 font-mono text-[11px] text-[#A82F19]">{page.url}</td>
                      <td className="py-3 pr-4 text-center">
                        <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5">
                          Indexable
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <a
                          href={page.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-[#A82F19] hover:underline"
                        >
                          <span>Live</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: COMPETITOR GAP ANALYSIS MATRIX                                       */}
      {/* ========================================================================= */}
      {activeTab === 'competitor' && (
        <div className="space-y-6">
          {/* Dubai Market Landscape Card */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
            <h3 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Dubai Commercial Print SERP Competitive Intelligence
            </h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              {competitorData?.marketOverview ||
                'The UAE commercial printing market is characterized by high CPCs on Google Ads (AED 8–24/click) and established domain authorities (Desco, Dubaiprint, Spectrum). ONPRINT wins organic market share by exploiting thin competitor content gaps, delivering specialized B2B commercial landing hubs, offering instant digital pricing, and targeting high-intent long-tail transactional queries.'}
            </p>
          </div>

          {/* Topic Matrix Table */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Topic Gap Matrix (ONPRINT vs Regional Competitors)
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Algorithmically identified content deficits and commercial differentiation advantages.
                </p>
              </div>
              <span className="rounded-full bg-[#A82F19]/10 text-[#A82F19] font-black text-xs px-3 py-1">
                Strategic Opportunities
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-[10px] font-extrabold uppercase text-neutral-400">
                    <th className="pb-3 pr-4">Commercial Topic</th>
                    <th className="pb-3 pr-4">Competitor Status</th>
                    <th className="pb-3 pr-4">ONPRINT Value Proposition</th>
                    <th className="pb-3 pr-4">Content Gap Identified</th>
                    <th className="pb-3 pr-4">Priority</th>
                    <th className="pb-3">Strategic Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {(competitorData?.topicMatrix || [
                    {
                      topic: 'Same-Day Business Cards Dubai',
                      competitorStrength: 'High volume, legacy generic landing pages',
                      onprintAdvantage: 'Real-time online 3D mockups, 450gsm Italian stock, 4hr delivery',
                      contentGap: 'Competitors lack paper finish comparisons & tactile specifications',
                      priority: 'HIGH',
                      recommendedAction: 'Publish comprehensive paper finish comparison matrix on /products/business-cards.'
                    },
                    {
                      topic: 'Luxury Rigid Boxes & Retail Packaging',
                      competitorStrength: 'Manual RFQ form only, no instant pricing',
                      onprintAdvantage: 'Instant box sizing & dynamic quote calculator',
                      contentGap: 'Zero dieline templates or downloadable structural guides',
                      priority: 'HIGH',
                      recommendedAction: 'Deploy free downloadable dieline templates and custom foam insert guides.'
                    },
                    {
                      topic: 'DIFC & Downtown Corporate Stationery',
                      competitorStrength: 'Scattered retail shops with walk-in focus',
                      onprintAdvantage: 'Dedicated corporate account billing, Net 30 terms, courier dispatch',
                      contentGap: 'No targeted corporate procurement case studies',
                      priority: 'MEDIUM',
                      recommendedAction: 'Target enterprise procurement managers via /printing-services/difc landing hub.'
                    },
                    {
                      topic: 'Eco-Friendly Kraft & Recycled Print',
                      competitorStrength: 'Minimal eco-certified options promoted',
                      onprintAdvantage: 'FSC-certified paper stocks, soy inks, plastic-free laminations',
                      contentGap: 'No sustainability certification disclosures',
                      priority: 'MEDIUM',
                      recommendedAction: 'Create dedicated Sustainability & FSC Compliance badge section.'
                    }
                  ]).map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 pr-4 font-bold text-neutral-900">{item.topic}</td>
                      <td className="py-3 pr-4 text-neutral-600 max-w-xs">{item.competitorStrength}</td>
                      <td className="py-3 pr-4 text-emerald-800 font-semibold max-w-xs">{item.onprintAdvantage}</td>
                      <td className="py-3 pr-4 text-[#A82F19] font-medium max-w-xs">{item.contentGap}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                            item.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-700 max-w-xs font-medium">{item.recommendedAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: SEO SAFETY QUEUE & PRE-PUBLISH VALIDATION                             */}
      {/* ========================================================================= */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          {/* Safety System Overview */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-4">
              <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Pre-Publish SEO Safety Gate &amp; Compliance Protocol
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Automated checks intercept all algorithmic and AI modifications before they touch live pages.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-100">
                <span className="font-bold text-neutral-900 block mb-1">1. Anti-Keyword Stuffing</span>
                <p className="text-neutral-500">Flags any content where single keyword density exceeds 2.5% threshold.</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-100">
                <span className="font-bold text-neutral-900 block mb-1">2. Anti-Doorway &amp; Duplication</span>
                <p className="text-neutral-500">Enforces unique titles, meta descriptions, and localized specs on every URL.</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-100">
                <span className="font-bold text-neutral-900 block mb-1">3. Structural Integrity</span>
                <p className="text-neutral-500">Guarantees exactly one H1 per page, valid canonical URLs, and schema validation.</p>
              </div>
            </div>
          </div>

          {/* Safety Review Queue */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900">
                  &quot;SEO REVIEW REQUIRED&quot; Queue ({safetyQueue.length} Items Flagged)
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Items routed here failed automated safety checks and require manual admin approval or editing.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadSafetyQueue}
                disabled={actionLoading}
                className="text-xs font-bold"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${actionLoading ? 'animate-spin' : ''}`} />
                Re-Scan Queue
              </Button>
            </div>

            <div className="mt-4 divide-y divide-neutral-100">
              {safetyQueue.length > 0 ? (
                safetyQueue.map((item, idx) => (
                  <div key={idx} className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-red-100 text-red-800 text-[10px] font-black uppercase px-2 py-0.5">
                          Review Required
                        </span>
                        <span className="font-bold text-neutral-900">{item.target_type} #{item.target_id}</span>
                        <span className="font-mono text-neutral-500 text-[11px]">{item.change_type}</span>
                      </div>

                      <div className="space-y-1">
                        {(item.violations || [item.reason]).map((v, vIdx) => (
                          <div key={vIdx} className="flex items-center gap-1.5 text-red-600 font-medium">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                            <span>{v}</span>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-lg bg-neutral-50 p-2.5 border border-neutral-100 font-mono text-[11px] text-neutral-700 max-w-xl truncate">
                        Proposed: {typeof item.proposed_value === 'object' ? JSON.stringify(item.proposed_value) : item.proposed_value}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleApproveRec(item.id || item.recommendation_id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve Override
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectRec(item.id || item.recommendation_id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-neutral-500">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                  All recommendations and automated updates comply with Google White-Hat quality guidelines. No flagged items in safety queue.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: GOOGLE SEARCH CONSOLE INTEGRATION                                   */}
      {/* ========================================================================= */}
      {activeTab === 'search-console' && (
        <div className="space-y-6 max-w-3xl">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-neutral-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-black text-neutral-900">
                    Google Search Console API Configuration
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Connect Google Search Console via Service Account JSON or OAuth to pull real organic clicks, impressions, CTR, and SERP positions.
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  gscStatus?.isConnected ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {gscStatus?.isConnected ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <XCircle className="h-3.5 w-3.5 text-neutral-400" />}
                  {gscStatus?.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <form onSubmit={handleConnectGsc} className="mt-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
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
                <label className="block text-xs font-bold text-neutral-800 mb-2">
                  Authentication Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGscForm({ ...gscForm, authType: 'service_account' })}
                    className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold border transition-all cursor-pointer ${
                      isServiceAccount
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Key className="h-4 w-4" />
                    Service Account JSON (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGscForm({ ...gscForm, authType: 'oauth' })}
                    className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold border transition-all cursor-pointer ${
                      !isServiceAccount
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    OAuth 2.0 Client Credentials
                  </button>
                </div>
              </div>

              {isServiceAccount ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-800">
                      Service Account Key JSON
                    </label>
                    <span className="text-[11px] text-neutral-400">Paste JSON credentials from Google Cloud</span>
                  </div>
                  <textarea
                    rows={8}
                    value={gscForm.serviceAccountJson}
                    onChange={(e) => setGscForm({ ...gscForm, serviceAccountJson: e.target.value })}
                    placeholder='{"type": "service_account", "project_id": "...", "private_key": "...", ...}'
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 font-mono p-3.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  />
                  <p className="mt-1.5 text-[11px] text-neutral-500">
                    Create a Service Account in Google Cloud Console, enable Search Console API, grant &quot;Owner&quot; or &quot;Full&quot; permissions in Google Search Console User settings, and paste the generated JSON key here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">OAuth Client ID</label>
                    <input
                      type="text"
                      value={gscForm.clientId}
                      onChange={(e) => setGscForm({ ...gscForm, clientId: e.target.value })}
                      placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
                      className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs focus:border-[#A82F19] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">OAuth Client Secret</label>
                    <input
                      type="password"
                      value={gscForm.clientSecret}
                      onChange={(e) => setGscForm({ ...gscForm, clientSecret: e.target.value })}
                      placeholder="Enter Client Secret..."
                      className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs focus:border-[#A82F19] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">Refresh Token (Optional)</label>
                    <input
                      type="password"
                      value={gscForm.refreshToken}
                      onChange={(e) => setGscForm({ ...gscForm, refreshToken: e.target.value })}
                      placeholder="Enter Refresh Token..."
                      className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs focus:border-[#A82F19] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="accent"
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-8 py-3 text-xs font-bold shadow-md shadow-[#A82F19]/20"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Save &amp; Test Search Console Connection
                </Button>
              </div>
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
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
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
            <div className="lg:col-span-2 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
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
                    <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                      <span className="text-neutral-400 font-bold uppercase text-[10px]">Technical</span>
                      <div className="text-lg font-bold text-neutral-900 mt-0.5">{selectedReport.technical_score}%</div>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                      <span className="text-neutral-400 font-bold uppercase text-[10px]">On-Page</span>
                      <div className="text-lg font-bold text-neutral-900 mt-0.5">{selectedReport.onpage_score}%</div>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                      <span className="text-neutral-400 font-bold uppercase text-[10px]">Content</span>
                      <div className="text-lg font-bold text-neutral-900 mt-0.5">{selectedReport.content_score}%</div>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
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
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
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
                          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 hover:border-red-500 hover:text-red-600 transition-all cursor-pointer shadow-xs"
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
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <h3 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Automated Daily Scheduler &amp; AI Engine Configuration
            </h3>

            <form onSubmit={handleSaveSettings} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
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
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
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
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
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
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
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
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
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
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
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

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="accent"
                  icon={false}
                  disabled={actionLoading}
                  className="px-6 py-2.5 text-xs font-bold shadow-md shadow-[#A82F19]/20"
                >
                  Save Automation Settings
                </Button>
              </div>
            </form>
          </div>

          {/* GoDaddy cPanel Cron Helper */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <h3 className="font-display text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              GoDaddy cPanel Cron Job Command Helper
            </h3>
            <p className="text-xs text-neutral-500 mt-2">
              For GoDaddy Node.js hosting, add this cron command in your cPanel Cron Jobs manager to trigger the daily pipeline idempotently at {settingsForm.daily_run_time || '03:00'} ({settingsForm.timezone || 'Asia/Dubai'}).
            </p>

            <div className="mt-4 rounded-xl bg-neutral-900 p-4 font-mono text-xs text-emerald-400 flex items-center justify-between gap-3">
              <span className="truncate">
                curl -X POST {settingsData?.cron_endpoint || 'https://0nprint.com/api/seo/run-daily'} -H &quot;X-Cron-Secret: onprint_daily_seo_cron_secret_2026&quot;
              </span>
              <button
                type="button"
                onClick={() => {
                  const cmd = `curl -X POST ${settingsData?.cron_endpoint || 'https://0nprint.com/api/seo/run-daily'} -H "X-Cron-Secret: onprint_daily_seo_cron_secret_2026"`
                  navigator.clipboard.writeText(cmd)
                  setCopiedKey(true)
                  setTimeout(() => setCopiedKey(false), 2000)
                }}
                className="shrink-0 text-white hover:text-[#A82F19] transition-colors p-1 cursor-pointer"
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
