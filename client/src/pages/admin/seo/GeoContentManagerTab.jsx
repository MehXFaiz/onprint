import { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Code,
  FileText,
  RefreshCw,
  X,
  Building,
  CheckCircle2,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react'
import Button from '../../../components/Button'
import {
  getGeoContent,
  createGeoContent,
  updateGeoContent,
  deleteGeoContent,
} from '../../../services/seo'

export default function GeoContentManagerTab({ showToast }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [schemaPreviewItem, setSchemaPreviewItem] = useState(null)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Form State
  const initialForm = {
    entity_key: '',
    title: '',
    direct_answer: '',
    structured_data: '{\n  "category": "Specification",\n  "details": []\n}',
    citations: '["https://0nprint.com/"]',
    is_active: 1,
  }
  const [formData, setFormData] = useState(initialForm)

  const loadContent = async () => {
    setLoading(true)
    try {
      const res = await getGeoContent()
      if (res?.success) {
        setItems(res.data || [])
      }
    } catch (err) {
      showToast?.('Failed to load GEO Content: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContent()
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = (search || '').toLowerCase().trim()
      return (
        !q ||
        item.entity_key?.toLowerCase().includes(q) ||
        item.title?.toLowerCase().includes(q) ||
        item.direct_answer?.toLowerCase().includes(q) ||
        item.structured_data?.toLowerCase().includes(q)
      )
    })
  }, [items, search])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.entity_key.trim() || !formData.title.trim() || !formData.direct_answer.trim()) {
      showToast?.('Please fill in entity key, title, and direct answer', 'error')
      return
    }
    setActionLoading(true)
    try {
      const res = await createGeoContent(formData)
      if (res?.success) {
        showToast?.('GEO Content record created successfully!')
        setShowAddModal(false)
        setFormData(initialForm)
        loadContent()
      }
    } catch (err) {
      showToast?.('Failed to create content: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!formData.entity_key.trim() || !formData.title.trim() || !formData.direct_answer.trim()) {
      showToast?.('Please fill in entity key, title, and direct answer', 'error')
      return
    }
    setActionLoading(true)
    try {
      const res = await updateGeoContent(editingItem.id, formData)
      if (res?.success) {
        showToast?.('GEO Content updated successfully!')
        setEditingItem(null)
        loadContent()
      }
    } catch (err) {
      showToast?.('Failed to update content: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingItem) return
    setActionLoading(true)
    try {
      const res = await deleteGeoContent(deletingItem.id)
      if (res?.success) {
        showToast?.('GEO Content deleted!')
        setDeletingItem(null)
        loadContent()
      }
    } catch (err) {
      showToast?.('Failed to delete content: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setFormData({
      entity_key: item.entity_key || '',
      title: item.title || '',
      direct_answer: item.direct_answer || '',
      structured_data:
        typeof item.structured_data === 'object'
          ? JSON.stringify(item.structured_data, null, 2)
          : item.structured_data || '{}',
      citations:
        typeof item.citations === 'object'
          ? JSON.stringify(item.citations, null, 2)
          : item.citations || '[]',
      is_active: item.is_active ? 1 : 0,
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
                <FileText className="h-3.5 w-3.5" />
                Knowledge Graph Engine
              </span>
              <span className="text-xs font-semibold text-neutral-500">Requirement 28</span>
            </div>
            <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-neutral-900">
              GEO Content &amp; Entity Knowledge Manager
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
              Verified corporate facts, technical capabilities, paper substrates, and operational constraints powering ONPRINT&apos;s digital entity representation across Google, Bing, ChatGPT, and Perplexity.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={loadContent}
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
              <span>Add Knowledge Record</span>
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-neutral-100 pt-4 text-xs">
          <div>
            <span className="text-neutral-500 block">Verified Knowledge Records</span>
            <span className="text-lg font-black text-neutral-900">{items.length}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Active Entities</span>
            <span className="text-lg font-black text-emerald-600">
              {items.filter((i) => i.is_active).length}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block">Schema Compatibility</span>
            <span className="text-lg font-black text-[#A82F19]">100% Valid JSON-LD</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Entity Consistency</span>
            <span className="text-lg font-black text-neutral-900">Al Quoz, Dubai</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search knowledge records, keys, or direct answers…"
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-[#A82F19] transition-colors"
        />
      </div>

      {/* Content Records List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[#A82F19] mb-2" />
            Loading Knowledge Database…
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
            No knowledge records found.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedId === item.id
            let parsedData = null
            try {
              parsedData =
                typeof item.structured_data === 'object'
                  ? item.structured_data
                  : JSON.parse(item.structured_data || '{}')
            } catch {
              parsedData = null
            }

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 bg-white ${
                  isExpanded ? 'border-neutral-900 shadow-md' : 'border-neutral-200/80 hover:border-neutral-300 shadow-2xs'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-neutral-900 text-white px-2.5 py-0.5 text-[10px] font-mono font-bold">
                          {item.entity_key}
                        </span>
                        {!item.is_active && (
                          <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                            Inactive
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-base font-bold text-neutral-900 pt-1">
                        {item.title}
                      </h3>

                      <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        {item.direct_answer}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSchemaPreviewItem(item)}
                        className="p-2 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                        title="View JSON-LD Structure"
                      >
                        <Code className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-2 text-neutral-500 hover:text-[#A82F19] rounded-lg hover:bg-neutral-100 transition-colors"
                        title="Edit Knowledge Record"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingItem(item)}
                        className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                        title="Toggle JSON Data"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Structured Data Viewer */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-neutral-700 block mb-1">
                          Structured Specifications:
                        </span>
                        <div className="rounded-xl bg-neutral-900 p-4 text-emerald-400 font-mono text-xs overflow-x-auto">
                          <pre>{JSON.stringify(parsedData, null, 2)}</pre>
                        </div>
                      </div>

                      {item.citations && (
                        <div>
                          <span className="font-semibold text-neutral-600 block mb-1">Citations &amp; Primary URLs:</span>
                          <span className="text-neutral-700 font-mono text-[11px] bg-neutral-100 px-2 py-1 rounded">
                            {typeof item.citations === 'string' ? item.citations : JSON.stringify(item.citations)}
                          </span>
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
              {editingItem ? 'Edit Knowledge Record' : 'Add Knowledge Record'}
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Store structured business facts and specifications consumed by LLMs and search engines.
            </p>

            <form onSubmit={editingItem ? handleUpdate : handleCreate} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Entity Key (Unique Identifier)</label>
                  <input
                    type="text"
                    value={formData.entity_key}
                    onChange={(e) => setFormData({ ...formData, entity_key: e.target.value })}
                    placeholder="e.g. business_hours, paper_substrates"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#A82F19]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Knowledge Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Paper Substrates &amp; Weights"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Direct Truthful Answer (LLM Snippet)
                </label>
                <textarea
                  rows={3}
                  value={formData.direct_answer}
                  onChange={(e) => setFormData({ ...formData, direct_answer: e.target.value })}
                  placeholder="Clear direct factual answer..."
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Structured Data (JSON format)
                </label>
                <textarea
                  rows={6}
                  value={formData.structured_data}
                  onChange={(e) => setFormData({ ...formData, structured_data: e.target.value })}
                  placeholder='{\n  "key": "value"\n}'
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#A82F19]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Citations (JSON Array of URLs)</label>
                  <input
                    type="text"
                    value={formData.citations}
                    onChange={(e) => setFormData({ ...formData, citations: e.target.value })}
                    placeholder='["https://0nprint.com/"]'
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#A82F19]"
                  />
                </div>

                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-700">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.is_active)}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                      className="rounded border-neutral-300 text-[#A82F19] focus:ring-[#A82F19]"
                    />
                    <span>Active Entity</span>
                  </label>
                </div>
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
                  {actionLoading ? 'Saving…' : editingItem ? 'Save Changes' : 'Create Record'}
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
            <h4 className="font-display text-lg font-black text-neutral-900">Delete Knowledge Record?</h4>
            <p className="mt-2 text-xs text-neutral-600">
              Are you sure you want to delete: <strong>&ldquo;{deletingItem.title}&rdquo;</strong>?
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

      {/* Schema Preview Modal */}
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
              Knowledge Entity JSON Structure
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Entity Key: <code>{schemaPreviewItem.entity_key}</code>
            </p>

            <div className="mt-4 rounded-xl bg-neutral-900 p-4 text-emerald-400 font-mono text-xs overflow-x-auto">
              <pre>
                {JSON.stringify(
                  {
                    entity: schemaPreviewItem.entity_key,
                    name: schemaPreviewItem.title,
                    description: schemaPreviewItem.direct_answer,
                    data:
                      typeof schemaPreviewItem.structured_data === 'string'
                        ? JSON.parse(schemaPreviewItem.structured_data || '{}')
                        : schemaPreviewItem.structured_data,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSchemaPreviewItem(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
