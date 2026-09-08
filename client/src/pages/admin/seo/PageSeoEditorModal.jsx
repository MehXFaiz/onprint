import { useState, useEffect } from 'react'
import {
  X,
  Save,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  History,
  Layers,
  Globe,
  Tag,
  FileCode,
  Share2,
  Check,
  ExternalLink,
} from 'lucide-react'
import Button from '../../../components/Button'
import { updatePageSeo, getPageSeoHistory, rollbackPageSeoHistory } from '../../../services/seo'

export default function PageSeoEditorModal({
  page,
  isOpen,
  onClose,
  onSaved,
  onOpenAiAnalysis,
}) {
  const [activeTab, setActiveTab] = useState('meta') // 'meta' | 'social' | 'schema' | 'history'
  const [formData, setFormData] = useState({})
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)

  useEffect(() => {
    if (page) {
      setFormData({
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        focus_keyword: page.focus_keyword || '',
        secondary_keywords: page.secondary_keywords || '',
        h1: page.h1 || '',
        canonical_url: page.canonical_url || '',
        robots_index: page.robots_index || 'index',
        robots_follow: page.robots_follow || 'follow',
        og_title: page.og_title || page.meta_title || '',
        og_description: page.og_description || page.meta_description || '',
        og_image: page.og_image || '',
        twitter_title: page.twitter_title || page.meta_title || '',
        twitter_description: page.twitter_description || page.meta_description || '',
        twitter_image: page.twitter_image || page.og_image || '',
        schema_type: page.schema_type || 'WebPage',
        schema_markup: page.schema_markup || '',
      })
      loadHistory(page.id)
    }
  }, [page])

  const loadHistory = async (pageId) => {
    try {
      setLoadingHistory(true)
      const res = await getPageSeoHistory(pageId)
      if (res?.success) {
        setHistory(res.data || [])
      }
    } catch (err) {
      console.warn('Load SEO history error:', err.message)
    } finally {
      setLoadingHistory(false)
    }
  }

  if (!isOpen || !page) return null

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e) => {
    e?.preventDefault()
    try {
      setSaving(true)
      setStatusMessage(null)

      // Validate schema markup if provided
      if (formData.schema_markup && formData.schema_markup.trim()) {
        try {
          JSON.parse(formData.schema_markup)
        } catch {
          setStatusMessage({ type: 'error', text: 'Schema Markup contains invalid JSON syntax.' })
          setSaving(false)
          return
        }
      }

      const res = await updatePageSeo(page.id, formData)
      if (res?.success) {
        setStatusMessage({ type: 'success', text: 'Page SEO saved successfully!' })
        if (onSaved) onSaved(res.data)
        loadHistory(page.id)
        setTimeout(() => {
          setStatusMessage(null)
        }, 3000)
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleRollback = async (historyId) => {
    if (!window.confirm('Are you sure you want to rollback to this previous version?')) return
    try {
      setSaving(true)
      const res = await rollbackPageSeoHistory(historyId)
      if (res?.success) {
        setStatusMessage({ type: 'success', text: 'Rolled back change successfully!' })
        if (onSaved) onSaved(res.data)
        // Refresh form
        setFormData({
          meta_title: res.data.meta_title || '',
          meta_description: res.data.meta_description || '',
          focus_keyword: res.data.focus_keyword || '',
          secondary_keywords: res.data.secondary_keywords || '',
          h1: res.data.h1 || '',
          canonical_url: res.data.canonical_url || '',
          robots_index: res.data.robots_index || 'index',
          robots_follow: res.data.robots_follow || 'follow',
          og_title: res.data.og_title || '',
          og_description: res.data.og_description || '',
          og_image: res.data.og_image || '',
          twitter_title: res.data.twitter_title || '',
          twitter_description: res.data.twitter_description || '',
          twitter_image: res.data.twitter_image || '',
          schema_type: res.data.schema_type || 'WebPage',
          schema_markup: res.data.schema_markup || '',
        })
        loadHistory(page.id)
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || err.message })
    } finally {
      setSaving(false)
    }
  }

  const titleLen = formData.meta_title?.length || 0
  const descLen = formData.meta_description?.length || 0

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#A82F19]/10 text-[#A82F19] flex items-center justify-center font-bold">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg text-neutral-900 tracking-tight">
                  Edit Page SEO
                </h2>
                <span className="rounded-full bg-neutral-200 px-2.5 py-0.5 text-[11px] font-mono font-bold text-neutral-700 uppercase">
                  {page.page_type}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-black ${
                    page.seo_score >= 80
                      ? 'bg-emerald-100 text-emerald-800'
                      : page.seo_score >= 60
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  Score: {page.seo_score || 0}/100
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono flex items-center gap-1 mt-0.5">
                <Globe className="h-3 w-3 text-neutral-400" />
                <span>{page.url}</span>
                <a
                  href={page.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#A82F19] hover:underline ml-1 inline-flex items-center gap-0.5 text-[11px]"
                >
                  Visit <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onOpenAiAnalysis && onOpenAiAnalysis(page)}
              className="text-xs font-bold border-neutral-300 hover:border-[#A82F19]"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#A82F19]" />
              Analyze with AI
            </Button>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-white px-6 shrink-0 gap-6">
          <button
            onClick={() => setActiveTab('meta')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'meta'
                ? 'border-[#A82F19] text-[#A82F19]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Tag className="h-3.5 w-3.5" />
            Core Meta &amp; Content
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'social'
                ? 'border-[#A82F19] text-[#A82F19]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            Open Graph &amp; Twitter
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'border-[#A82F19] text-[#A82F19]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            Structured Data (Schema)
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-[#A82F19] text-[#A82F19]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            Change History ({history.length})
          </button>
        </div>

        {/* Notification Banner */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-bold flex items-center gap-2 ${
              statusMessage.type === 'error'
                ? 'bg-red-50 text-red-700 border-b border-red-200'
                : 'bg-emerald-50 text-emerald-700 border-b border-emerald-200'
            }`}
          >
            {statusMessage.type === 'error' ? (
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CORE META & CONTENT */}
          {activeTab === 'meta' && (
            <div className="space-y-5">
              {/* Google SERP Preview Card */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                    Google SERP Desktop &amp; Mobile Preview
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">0nprint.com</span>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-neutral-600 font-mono truncate">
                    https://0nprint.com{page.url}
                  </div>
                  <div className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate">
                    {formData.meta_title || `${page.h1 || 'Page Title'} | ONPRINT Dubai`}
                  </div>
                  <div className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {formData.meta_description || 'No description provided. Add an authentic, conversion-focused meta description.'}
                  </div>
                </div>
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-neutral-800">
                    Meta Title <span className="text-red-500">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      titleLen >= 50 && titleLen <= 60
                        ? 'text-emerald-600'
                        : titleLen > 65
                        ? 'text-red-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {titleLen} / 60 characters
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  placeholder="e.g., Luxury Business Card Printing Dubai | Express 24h Delivery | ONPRINT"
                  className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:ring-1 focus:ring-[#A82F19] focus:outline-none"
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-neutral-800">
                    Meta Description <span className="text-red-500">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      descLen >= 140 && descLen <= 160
                        ? 'text-emerald-600'
                        : descLen > 165
                        ? 'text-red-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {descLen} / 160 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={formData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  placeholder="Write an authentic, click-worthy snippet that summarizes the page and includes a clear CTA..."
                  className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:ring-1 focus:ring-[#A82F19] focus:outline-none"
                />
              </div>

              {/* Focus Keyword & Secondary Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Focus Keyword <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.focus_keyword}
                    onChange={(e) => handleInputChange('focus_keyword', e.target.value)}
                    placeholder="e.g., business card printing dubai"
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:ring-1 focus:ring-[#A82F19] focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">
                    Primary target search query for this specific page.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Secondary Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.secondary_keywords}
                    onChange={(e) => handleInputChange('secondary_keywords', e.target.value)}
                    placeholder="e.g., luxury cards, gold foil stamping, express print"
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:ring-1 focus:ring-[#A82F19] focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">
                    Comma-separated semantic variations and LSI terms.
                  </p>
                </div>
              </div>

              {/* Primary Heading H1 & Canonical URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Primary Heading (H1)
                  </label>
                  <input
                    type="text"
                    value={formData.h1}
                    onChange={(e) => handleInputChange('h1', e.target.value)}
                    placeholder="e.g., Premium Business Card Printing in Dubai"
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:ring-1 focus:ring-[#A82F19] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Canonical URL
                  </label>
                  <input
                    type="text"
                    value={formData.canonical_url}
                    onChange={(e) => handleInputChange('canonical_url', e.target.value)}
                    placeholder={`https://0nprint.com${page.url}`}
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:ring-1 focus:ring-[#A82F19] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Robots Directives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Robots Index Directive
                  </label>
                  <select
                    value={formData.robots_index}
                    onChange={(e) => handleInputChange('robots_index', e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  >
                    <option value="index">index (Allow search engines to index)</option>
                    <option value="noindex">noindex (Prevent search indexing)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Robots Follow Directive
                  </label>
                  <select
                    value={formData.robots_follow}
                    onChange={(e) => handleInputChange('robots_follow', e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                  >
                    <option value="follow">follow (Crawl and follow outbound links)</option>
                    <option value="nofollow">nofollow (Do not follow outbound links)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPEN GRAPH & TWITTER */}
          {activeTab === 'social' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                <h3 className="font-bold text-xs text-neutral-800 mb-1">Open Graph &amp; Social Sharing Cards</h3>
                <p className="text-[11px] text-neutral-500">
                  Controls how this page appears when shared on WhatsApp, LinkedIn, Facebook, X/Twitter, and iMessage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Open Graph (Facebook / LinkedIn / WhatsApp) */}
                <div className="space-y-4 rounded-xl border border-neutral-200 p-4">
                  <span className="text-xs font-black text-neutral-900 uppercase tracking-wider block border-b border-neutral-100 pb-2">
                    Open Graph (Facebook / WhatsApp)
                  </span>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">OG Title</label>
                    <input
                      type="text"
                      value={formData.og_title}
                      onChange={(e) => handleInputChange('og_title', e.target.value)}
                      placeholder={formData.meta_title || 'OG Title'}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">OG Description</label>
                    <textarea
                      rows={2}
                      value={formData.og_description}
                      onChange={(e) => handleInputChange('og_description', e.target.value)}
                      placeholder={formData.meta_description || 'OG Description'}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">OG Image URL</label>
                    <input
                      type="text"
                      value={formData.og_image}
                      onChange={(e) => handleInputChange('og_image', e.target.value)}
                      placeholder="https://0nprint.com/images/og-share.jpg"
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Twitter Cards */}
                <div className="space-y-4 rounded-xl border border-neutral-200 p-4">
                  <span className="text-xs font-black text-neutral-900 uppercase tracking-wider block border-b border-neutral-100 pb-2">
                    Twitter Card
                  </span>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Twitter Title</label>
                    <input
                      type="text"
                      value={formData.twitter_title}
                      onChange={(e) => handleInputChange('twitter_title', e.target.value)}
                      placeholder={formData.meta_title || 'Twitter Title'}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Twitter Description</label>
                    <textarea
                      rows={2}
                      value={formData.twitter_description}
                      onChange={(e) => handleInputChange('twitter_description', e.target.value)}
                      placeholder={formData.meta_description || 'Twitter Description'}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Twitter Image URL</label>
                    <input
                      type="text"
                      value={formData.twitter_image}
                      onChange={(e) => handleInputChange('twitter_image', e.target.value)}
                      placeholder="https://0nprint.com/images/twitter-card.jpg"
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEMA / STRUCTURED DATA */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-neutral-800">
                    Primary Schema Type
                  </label>
                  <p className="text-[11px] text-neutral-500">
                    Select Schema.org entity type corresponding to this page.
                  </p>
                </div>
                <select
                  value={formData.schema_type}
                  onChange={(e) => handleInputChange('schema_type', e.target.value)}
                  className="rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-900 font-bold focus:border-[#A82F19] focus:outline-none"
                >
                  <option value="WebPage">WebPage (General)</option>
                  <option value="Service">Service (Commercial Printing Service)</option>
                  <option value="Product">Product (Item Catalog / Orderable Print)</option>
                  <option value="Article">Article / BlogPosting</option>
                  <option value="CollectionPage">CollectionPage (Category)</option>
                  <option value="ContactPage">ContactPage</option>
                  <option value="AboutPage">AboutPage</option>
                  <option value="FAQPage">FAQPage</option>
                  <option value="LocalBusiness">LocalBusiness (ONPRINT Dubai)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  JSON-LD Schema Markup
                </label>
                <textarea
                  rows={14}
                  value={formData.schema_markup}
                  onChange={(e) => handleInputChange('schema_markup', e.target.value)}
                  placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Page Title"\n}`}
                  className="w-full font-mono text-xs rounded-xl border border-neutral-300 p-3.5 bg-neutral-900 text-emerald-400 focus:border-[#A82F19] focus:outline-none leading-relaxed"
                />
                <p className="mt-1 text-[11px] text-neutral-500">
                  Must be valid JSON-LD. This script tag will be injected directly into the HTML &lt;head&gt; of this page.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CHANGE HISTORY & ROLLBACK */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-neutral-800">
                    Audit Trail &amp; 1-Click Rollback
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Every modification to this page&apos;s SEO is recorded with previous/new values.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadHistory(page.id)}
                  className="text-xs font-bold"
                >
                  Refresh History
                </Button>
              </div>

              {loadingHistory ? (
                <div className="py-12 text-center text-xs text-neutral-400">Loading history log...</div>
              ) : history.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-400 border border-dashed border-neutral-200 rounded-xl">
                  No previous changes recorded for this page. Changes will appear here upon editing.
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                  {history.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-neutral-50/70 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-mono font-bold text-neutral-700">
                            {item.field_changed}
                          </span>
                          <span className="text-xs text-neutral-500">
                            Modified by <strong className="text-neutral-800">{item.changed_by || 'Admin'}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-neutral-400">
                            {new Date(item.created_at).toLocaleString()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRollback(item.id)}
                            disabled={saving}
                            className="text-[11px] font-bold py-1 px-2.5 h-auto text-[#A82F19] hover:bg-[#A82F19]/10 border-neutral-300"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Rollback
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded bg-red-50/50 border border-red-100 text-red-900 font-mono text-[11px] break-all">
                          <span className="font-sans font-bold text-red-700 block mb-0.5">Previous Value:</span>
                          {item.old_value || '<empty>'}
                        </div>
                        <div className="p-2 rounded bg-emerald-50/50 border border-emerald-100 text-emerald-900 font-mono text-[11px] break-all">
                          <span className="font-sans font-bold text-emerald-700 block mb-0.5">Updated Value:</span>
                          {item.new_value || '<empty>'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/80 flex items-center justify-between shrink-0">
          <div className="text-xs text-neutral-500">
            Last Updated:{' '}
            <strong className="text-neutral-800">
              {page.updated_at ? new Date(page.updated_at).toLocaleString() : 'Never'}
            </strong>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={saving}
              className="text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="accent"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-bold shadow-md shadow-[#A82F19]/20"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
