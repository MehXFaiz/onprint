import { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  HelpCircle,
  Code,
  Globe,
  Tag,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import Button from '../../../components/Button'
import {
  getGeoFaqs,
  createGeoFaq,
  updateGeoFaq,
  deleteGeoFaq,
} from '../../../services/seo'

const CATEGORIES = [
  'All',
  'General',
  'Business Cards',
  'Packaging',
  'Labels',
  'Corporate Printing',
  'Artwork & Proofing',
  'Pricing & Turnaround',
]

export default function GeoFaqManagerTab({ showToast }) {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [expandedId, setExpandedId] = useState(null)
  const [schemaPreviewItem, setSchemaPreviewItem] = useState(null)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Form State
  const initialForm = {
    category: 'General',
    target_url: '/',
    question: '',
    answer: '',
    direct_answer: '',
    expanded_answer: '',
    related_service: '',
    related_keyword: '',
    keywords: '',
    search_intent: 'Commercial',
    display_order: 0,
    is_active: 1,
    status: 'published',
  }
  const [formData, setFormData] = useState(initialForm)

  const loadFaqs = async () => {
    setLoading(true)
    try {
      const res = await getGeoFaqs()
      if (res?.success) {
        setFaqs(res.data || [])
      }
    } catch (err) {
      showToast?.('Failed to load GEO FAQs: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFaqs()
  }, [])

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const q = (search || '').toLowerCase().trim()
      const matchSearch =
        !q ||
        faq.question?.toLowerCase().includes(q) ||
        faq.answer?.toLowerCase().includes(q) ||
        faq.direct_answer?.toLowerCase().includes(q) ||
        faq.expanded_answer?.toLowerCase().includes(q) ||
        faq.target_url?.toLowerCase().includes(q) ||
        faq.related_keyword?.toLowerCase().includes(q) ||
        faq.keywords?.toLowerCase().includes(q)

      const matchCat = categoryFilter === 'All' || faq.category === categoryFilter
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && (faq.status === 'published' || faq.is_active === 1 || faq.is_active === true)) ||
        (statusFilter === 'Inactive' && (faq.status !== 'published' && (faq.is_active === 0 || faq.is_active === false)))

      return matchSearch && matchCat && matchStatus
    })
  }, [faqs, search, categoryFilter, statusFilter])

  const handleCreate = async (e) => {
    e.preventDefault()
    const ans = (formData.answer || formData.direct_answer || '').trim()
    if (!formData.question.trim() || !ans) {
      showToast?.('Please enter both question and direct answer', 'error')
      return
    }
    setActionLoading(true)
    try {
      const payload = {
        ...formData,
        answer: ans,
        direct_answer: ans,
        related_keyword: formData.related_keyword || formData.keywords,
        status: formData.is_active ? 'published' : 'draft',
      }
      const res = await createGeoFaq(payload)
      if (res?.success) {
        showToast?.('GEO FAQ created successfully!')
        setShowAddModal(false)
        setFormData(initialForm)
        loadFaqs()
      }
    } catch (err) {
      showToast?.('Failed to create FAQ: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const ans = (formData.answer || formData.direct_answer || '').trim()
    if (!formData.question.trim() || !ans) {
      showToast?.('Please enter both question and direct answer', 'error')
      return
    }
    setActionLoading(true)
    try {
      const payload = {
        ...formData,
        answer: ans,
        direct_answer: ans,
        related_keyword: formData.related_keyword || formData.keywords,
        status: formData.is_active ? 'published' : 'draft',
      }
      const res = await updateGeoFaq(editingItem.id, payload)
      if (res?.success) {
        showToast?.('GEO FAQ updated successfully!')
        setEditingItem(null)
        loadFaqs()
      }
    } catch (err) {
      showToast?.('Failed to update FAQ: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingItem) return
    setActionLoading(true)
    try {
      const res = await deleteGeoFaq(deletingItem.id)
      if (res?.success) {
        showToast?.('GEO FAQ deleted!')
        setDeletingItem(null)
        loadFaqs()
      }
    } catch (err) {
      showToast?.('Failed to delete FAQ: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const openEditModal = (faq) => {
    setEditingItem(faq)
    setFormData({
      category: faq.category || 'General',
      target_url: faq.target_url || '/',
      question: faq.question || '',
      answer: faq.answer || faq.direct_answer || '',
      direct_answer: faq.answer || faq.direct_answer || '',
      expanded_answer: faq.expanded_answer || '',
      related_service: faq.related_service || '',
      related_keyword: faq.related_keyword || faq.keywords || '',
      keywords: faq.related_keyword || faq.keywords || '',
      search_intent: faq.search_intent || 'Commercial',
      display_order: faq.display_order || 0,
      is_active: faq.status === 'published' || faq.is_active ? 1 : 0,
      status: faq.status || 'published',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 text-xs font-bold text-[#A82F19]">
                <HelpCircle className="h-3.5 w-3.5" />
                GEO &amp; AEO Answer Engine
              </span>
              <span className="text-xs font-semibold text-neutral-500">Requirement 27</span>
            </div>
            <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-neutral-900">
              GEO FAQ Database Manager
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
              Authentic, verified Dubai printing FAQs structured for generative AI citation, direct answer extraction, and automated JSON-LD schema generation.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={loadFaqs}
              disabled={loading}
              className="flex items-center gap-1.5"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                setFormData(initialForm)
                setShowAddModal(true)
              }}
              className="flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add FAQ</span>
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-neutral-100 pt-4 text-xs">
          <div>
            <span className="text-neutral-500 block">Total FAQs in Database</span>
            <span className="text-lg font-black text-neutral-900">{faqs.length}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Active / Published</span>
            <span className="text-lg font-black text-emerald-600">
              {faqs.filter((f) => f.is_active).length}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block">Unique Target URLs</span>
            <span className="text-lg font-black text-neutral-900">
              {new Set(faqs.map((f) => f.target_url)).size}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block">Coverage Disciplines</span>
            <span className="text-lg font-black text-[#A82F19]">8 Categories</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs, answers, keywords, or URLs…"
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-[#A82F19] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-700 focus:outline-none focus:border-[#A82F19]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-700 focus:outline-none focus:border-[#A82F19]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* FAQ Items List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[#A82F19] mb-2" />
            Loading GEO FAQ Database…
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
            No FAQs match your search criteria.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 bg-white ${
                  isExpanded ? 'border-neutral-900 shadow-md' : 'border-neutral-200/80 hover:border-neutral-300 shadow-2xs'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-neutral-700">
                          {faq.category}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                          <Globe className="h-3 w-3" />
                          {faq.target_url}
                        </span>
                        {(faq.related_keyword || faq.keywords) && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                            <Tag className="h-3 w-3" />
                            {faq.related_keyword || faq.keywords}
                          </span>
                        )}
                        {faq.search_intent && (
                          <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700 border border-purple-200">
                            {faq.search_intent}
                          </span>
                        )}
                        {!faq.is_active && faq.status !== 'published' && (
                          <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                            Inactive
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-base font-bold text-neutral-900 pt-1">
                        {faq.question}
                      </h3>

                      {/* Direct Answer Preview (AEO) */}
                      <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <strong className="text-[#A82F19] font-bold">Direct Snippet: </strong>
                        {faq.answer || faq.direct_answer}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSchemaPreviewItem(faq)}
                        className="p-2 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                        title="View JSON-LD Schema snippet"
                      >
                        <Code className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(faq)}
                        className="p-2 text-neutral-500 hover:text-[#A82F19] rounded-lg hover:bg-neutral-100 transition-colors"
                        title="Edit FAQ"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingItem(faq)}
                        className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete FAQ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                        className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                        title="Toggle Details"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3 text-xs">
                      {faq.expanded_answer && (
                        <div>
                          <span className="font-bold text-neutral-700 block mb-1">
                            Expanded Comprehensive Answer:
                          </span>
                          <p className="text-neutral-600 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-neutral-200">
                            {faq.expanded_answer}
                          </p>
                        </div>
                      )}

                      {faq.keywords && (
                        <div className="flex items-center gap-2">
                          <Tag className="h-3.5 w-3.5 text-neutral-400" />
                          <span className="font-semibold text-neutral-600">Target Keywords:</span>
                          <span className="text-neutral-800">{faq.keywords}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingItem) && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => {
            setShowAddModal(false)
            setEditingItem(null)
          }}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false)
                setEditingItem(null)
              }}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-xl font-black text-neutral-900">
              {editingItem ? 'Edit GEO FAQ' : 'Add New GEO FAQ'}
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Formulate a direct, factual answer that AI engines (ChatGPT, Perplexity, Gemini) can parse as a self-contained snippet.
            </p>

            <form onSubmit={editingItem ? handleUpdate : handleCreate} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Target Page URL</label>
                  <input
                    type="text"
                    value={formData.target_url}
                    onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                    placeholder="e.g. /business-card-printing-dubai"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Question</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. What is the turnaround time for business card printing in Dubai?"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Direct Answer (AEO Snippet — 40–80 words)
                </label>
                <textarea
                  rows={3}
                  value={formData.direct_answer}
                  onChange={(e) => setFormData({ ...formData, direct_answer: e.target.value })}
                  placeholder="Direct, truthful answer starting with ONPRINT or clear specification..."
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Expanded Answer (Optional comprehensive technical details)
                </label>
                <textarea
                  rows={4}
                  value={formData.expanded_answer}
                  onChange={(e) => setFormData({ ...formData, expanded_answer: e.target.value })}
                  placeholder="Additional specifications, paper weights, turnaround options, or finishing techniques..."
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Related Target Keyword</label>
                  <input
                    type="text"
                    value={formData.related_keyword}
                    onChange={(e) => setFormData({ ...formData, related_keyword: e.target.value, keywords: e.target.value })}
                    placeholder="e.g. business card printing dubai"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  />
                  <p className="text-[10px] text-neutral-400 mt-0.5">Primary query targeted by this answer</p>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Search Intent</label>
                  <select
                    value={formData.search_intent}
                    onChange={(e) => setFormData({ ...formData, search_intent: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Transactional">Transactional</option>
                    <option value="Informational">Informational</option>
                    <option value="Local">Local</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-700">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.is_active)}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                    className="rounded border-neutral-300 text-[#A82F19] focus:ring-[#A82F19]"
                  />
                  <span>Active &amp; Published in Schema</span>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingItem(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="accent" size="sm" disabled={actionLoading}>
                  {actionLoading ? 'Saving…' : editingItem ? 'Save Changes' : 'Create FAQ'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h4 className="font-display text-lg font-black text-neutral-900">Delete FAQ?</h4>
            <p className="mt-2 text-xs text-neutral-600">
              Are you sure you want to delete: <strong>&ldquo;{deletingItem.question}&rdquo;</strong>? This will remove it from the database and generated FAQ schemas.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setDeletingItem(null)}>
                Cancel
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={handleDelete}
                disabled={actionLoading}
                className="!bg-red-600 hover:!bg-red-700 text-white"
              >
                {actionLoading ? 'Deleting…' : 'Yes, Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* JSON-LD Schema Preview Modal */}
      {schemaPreviewItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSchemaPreviewItem(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSchemaPreviewItem(null)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-lg font-black text-neutral-900">
              FAQPage JSON-LD Schema Snippet
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              This schema is injected on <code>https://0nprint.com{schemaPreviewItem.target_url}</code> for Google Rich Snippets &amp; LLM extraction.
            </p>

            <div className="mt-4 rounded-xl bg-neutral-900 p-4 text-emerald-400 font-mono text-xs overflow-x-auto">
              <pre>
                {JSON.stringify(
                  {
                    '@context': 'https://schema.org',
                    '@type': 'Question',
                    name: schemaPreviewItem.question,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: schemaPreviewItem.direct_answer,
                    },
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSchemaPreviewItem(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
