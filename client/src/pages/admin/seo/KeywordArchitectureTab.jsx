import React, { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Download,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  ArrowUpDown,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  Key,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'
import Button from '../../../components/Button'
import {
  createKeywordTarget,
  updateKeywordTarget,
  deleteKeywordTarget,
} from '../../../services/seo'

export default function KeywordArchitectureTab({
  keywordTargets = { items: [], total: 0 },
  onRefresh,
  showToast,
}) {
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [intentFilter, setIntentFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState('keyword')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 50

  const KEYWORD_GROUPS_LIST = [
    { key: 'A', name: 'Group A: Core commercial' },
    { key: 'B', name: 'Group B: Dubai local' },
    { key: 'C', name: 'Group C: Service keywords' },
    { key: 'D', name: 'Group D: Product keywords' },
    { key: 'E', name: 'Group E: Long-tail keywords' },
    { key: 'F', name: 'Group F: Question keywords' },
    { key: 'G', name: 'Group G: Transactional' },
    { key: 'H', name: 'Group H: Informational' },
    { key: 'I', name: 'Group I: Comparison' },
    { key: 'J', name: 'Group J: AI/GEO queries' },
    { key: 'K', name: 'Group K: Corporate printing' },
    { key: 'L', name: 'Group L: Packaging keywords' },
    { key: 'M', name: 'Group M: Branding keywords' },
    { key: 'N', name: 'Group N: Event/exhibition' },
  ]

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    keyword: '',
    search_intent: 'Commercial',
    cluster: 'General Printing',
    category: 'General Printing',
    target_url: 'https://0nprint.com/services',
    target_page: 'Services Hub',
    country: 'UAE',
    city: 'Dubai',
    priority: 'High',
    status: 'Tracking',
    notes: '',
  })

  const rawItems = keywordTargets.items || []

  // Extract distinct categories and clusters
  const categories = useMemo(() => {
    const set = new Set()
    rawItems.forEach((item) => {
      const cat = item.category || item.cluster
      if (cat) set.add(cat)
    })
    return Array.from(set).sort()
  }, [rawItems])

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return rawItems
      .filter((item) => {
        const matchesSearch =
          !search ||
          (item.keyword || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.target_page || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.target_url || '').toLowerCase().includes(search.toLowerCase())

        const matchesGroup =
          groupFilter === 'all' ||
          (item.keyword_group || '').toUpperCase() === groupFilter.toUpperCase()

        const matchesCat =
          categoryFilter === 'all' ||
          (item.category || item.cluster) === categoryFilter

        const matchesIntent =
          intentFilter === 'all' ||
          (item.search_intent || '').toLowerCase() === intentFilter.toLowerCase()

        const matchesPriority =
          priorityFilter === 'all' ||
          (item.priority || '').toLowerCase() === priorityFilter.toLowerCase()

        const matchesStatus =
          statusFilter === 'all' ||
          (item.status || '').toLowerCase() === statusFilter.toLowerCase()

        return (
          matchesSearch &&
          matchesGroup &&
          matchesCat &&
          matchesIntent &&
          matchesPriority &&
          matchesStatus
        )
      })
      .sort((a, b) => {
        let valA = a[sortField] ?? ''
        let valB = b[sortField] ?? ''
        if (typeof valA === 'string') valA = valA.toLowerCase()
        if (typeof valB === 'string') valB = valB.toLowerCase()

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
  }, [
    rawItems,
    search,
    categoryFilter,
    intentFilter,
    priorityFilter,
    statusFilter,
    sortField,
    sortDirection,
  ])

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, currentPage, pageSize])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Export to CSV
  const handleExportCsv = () => {
    if (!filteredItems.length) {
      showToast?.('No keywords to export', 'error')
      return
    }
    const headers = [
      'Keyword',
      'Search Intent',
      'Target URL',
      'Country',
      'City',
      'Category',
      'Current Ranking',
      'Previous Ranking',
      'Search Volume',
      'CPC',
      'Competition',
      'Last Checked',
      'Ranking Change',
      'Priority',
      'Status',
    ]

    const csvRows = [
      headers.join(','),
      ...filteredItems.map((item) =>
        [
          `"${(item.keyword || '').replace(/"/g, '""')}"`,
          `"${item.search_intent || 'Commercial'}"`,
          `"${item.target_url || ''}"`,
          `"${item.country || 'UAE'}"`,
          `"${item.city || 'Dubai'}"`,
          `"${(item.category || item.cluster || '').replace(/"/g, '""')}"`,
          `"${item.current_ranking != null ? item.current_ranking : 'Not tracked'}"`,
          `"${item.previous_ranking != null ? item.previous_ranking : 'Not tracked'}"`,
          `"${item.search_volume != null ? item.search_volume : '—'}"`,
          `"${item.cpc != null ? `$${item.cpc}` : '—'}"`,
          `"${item.competition || '—'}"`,
          `"${item.last_checked || 'Pending'}"`,
          `"${item.ranking_change != null ? (item.ranking_change > 0 ? `+${item.ranking_change}` : item.ranking_change) : '—'}"`,
          `"${item.priority || 'Medium'}"`,
          `"${item.status || 'Planned'}"`,
        ].join(',')
      ),
    ]

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `onprint-keywords-architecture-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast?.('Keywords exported successfully.')
  }

  // Add Modal Handler
  const handleOpenAdd = () => {
    setFormData({
      keyword: '',
      search_intent: 'Commercial',
      cluster: 'General Printing',
      category: 'General Printing',
      target_url: 'https://0nprint.com/services',
      target_page: 'Services Hub',
      country: 'UAE',
      city: 'Dubai',
      priority: 'High',
      status: 'Tracking',
      notes: '',
    })
    setShowAddModal(true)
  }

  const handleSaveAdd = async (e) => {
    e.preventDefault()
    if (!formData.keyword.trim()) {
      showToast?.('Keyword is required', 'error')
      return
    }
    setActionLoading(true)
    try {
      await createKeywordTarget({
        ...formData,
        category: formData.cluster,
      })
      showToast?.('Keyword target created successfully.')
      setShowAddModal(false)
      onRefresh?.()
    } catch (err) {
      showToast?.(err.response?.data?.message || err.message || 'Failed to create keyword target', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Edit Modal Handler
  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setFormData({
      keyword: item.keyword || '',
      search_intent: item.search_intent || 'Commercial',
      cluster: item.cluster || item.category || 'General Printing',
      category: item.category || item.cluster || 'General Printing',
      target_url: item.target_url || '',
      target_page: item.target_page || '',
      country: item.country || 'UAE',
      city: item.city || 'Dubai',
      priority: item.priority || 'Medium',
      status: item.status || 'Planned',
      notes: item.notes || '',
    })
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingItem) return
    setActionLoading(true)
    try {
      await updateKeywordTarget(editingItem.id, {
        ...formData,
        category: formData.cluster,
      })
      showToast?.('Keyword updated successfully.')
      setEditingItem(null)
      onRefresh?.()
    } catch (err) {
      showToast?.(err.response?.data?.message || err.message || 'Failed to update keyword', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Delete Handler
  const handleDelete = async () => {
    if (!deletingItem) return
    setActionLoading(true)
    try {
      await deleteKeywordTarget(deletingItem.id)
      showToast?.(`Keyword "${deletingItem.keyword}" deleted.`)
      setDeletingItem(null)
      onRefresh?.()
    } catch (err) {
      showToast?.(err.response?.data?.message || err.message || 'Failed to delete keyword', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Metric Cards */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-3 py-1 text-xs font-bold text-[#A82F19]">
                <Key className="h-3.5 w-3.5" /> High-Intent SERP Architecture
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-bold text-neutral-600">
                Dubai & UAE Regional Targeting
              </span>
            </div>
            <h2 className="mt-2 font-display text-xl sm:text-2xl font-black text-neutral-900">
              Commercial Keyword Architecture & SERP Dashboard
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 max-w-3xl leading-relaxed">
              Targeting high-intent B2B search terms across commercial printing, luxury corporate stationery, customized packaging, large format printing, and eco-friendly solutions. Strict single-owner mapping prevents internal keyword cannibalization.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={false}
              onClick={handleExportCsv}
              className="flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={false}
              onClick={onRefresh}
              className="flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
            <Button
              variant="accent"
              size="sm"
              icon={false}
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Add Keyword
            </Button>
          </div>
        </div>

        {/* Real Data Integrity Notice */}
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs text-blue-900 flex items-start gap-3">
          <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Google Essentials & Real-Time Integrity Policy:</span> In strict adherence to our data integrity standards, search volume, CPC, ranking, and competition are never fabricated. Metrics show <span className="font-semibold text-neutral-700 bg-white/80 px-1.5 py-0.5 rounded border border-blue-200">Connect API</span> or <span className="font-semibold text-neutral-700 bg-white/80 px-1.5 py-0.5 rounded border border-blue-200">—</span> until live Google Search Console or Google Ads API sync is active.
          </div>
        </div>

        {/* Quick Filter & Search Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search keywords or URL..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-xl border border-neutral-200 pl-9 pr-3 py-2 text-xs focus:border-[#A82F19] focus:outline-none"
            />
          </div>

          <select
            value={groupFilter}
            onChange={(e) => {
              setGroupFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-[#A82F19] focus:outline-none"
          >
            <option value="all">All Groups (A–N)</option>
            {KEYWORD_GROUPS_LIST.map((g) => (
              <option key={g.key} value={g.key}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-[#A82F19] focus:outline-none"
          >
            <option value="all">All Clusters / Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={intentFilter}
            onChange={(e) => {
              setIntentFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-[#A82F19] focus:outline-none"
          >
            <option value="all">All Search Intents</option>
            <option value="Commercial">Commercial</option>
            <option value="Transactional">Transactional</option>
            <option value="Informational">Informational</option>
            <option value="Local">Local</option>
            <option value="Navigational">Navigational</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-[#A82F19] focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-[#A82F19] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Tracking">Tracking</option>
            <option value="Assigned">Assigned</option>
            <option value="Planned">Planned</option>
          </select>
        </div>

        {/* Count overview */}
        <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
          <span>
            Showing <strong className="text-neutral-900">{filteredItems.length}</strong> keywords (Page {currentPage} of {totalPages})
          </span>
          {(search || categoryFilter !== 'all' || intentFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('')
                setCategoryFilter('all')
                setIntentFilter('all')
                setPriorityFilter('all')
                setStatusFilter('all')
                setCurrentPage(1)
              }}
              className="text-[#A82F19] hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {paginatedItems.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/75 text-[10px] uppercase font-black text-neutral-400">
                  <th
                    className="p-3.5 cursor-pointer hover:text-neutral-800"
                    onClick={() => handleSort('keyword')}
                  >
                    <div className="flex items-center gap-1">
                      Keyword <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    className="p-3.5 cursor-pointer hover:text-neutral-800"
                    onClick={() => handleSort('search_intent')}
                  >
                    <div className="flex items-center gap-1">
                      Intent <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="p-3.5">Target URL</th>
                  <th className="p-3.5">Location</th>
                  <th
                    className="p-3.5 cursor-pointer hover:text-neutral-800"
                    onClick={() => handleSort('cluster')}
                  >
                    <div className="flex items-center gap-1">
                      Category <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="p-3.5 text-center">Rank</th>
                  <th className="p-3.5 text-center">Prev</th>
                  <th className="p-3.5 text-center">Volume</th>
                  <th className="p-3.5 text-center">CPC</th>
                  <th className="p-3.5 text-center">Comp</th>
                  <th className="p-3.5 text-center">Last Checked</th>
                  <th className="p-3.5 text-center">Change</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginatedItems.map((item) => {
                  const intentBadge =
                    item.search_intent === 'Commercial'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : item.search_intent === 'Transactional'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : item.search_intent === 'Local'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'

                  return (
                    <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Keyword */}
                      <td className="p-3.5 font-bold text-neutral-900 max-w-[200px] truncate" title={item.keyword}>
                        <div className="flex items-center gap-1.5">
                          <span>{item.keyword}</span>
                        </div>
                        {item.notes && (
                          <div className="text-[10px] font-normal text-neutral-400 truncate mt-0.5">
                            {item.notes}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 mt-1">
                          {item.keyword_group && (
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-neutral-100 text-neutral-700 border border-neutral-200">
                              Grp {item.keyword_group}
                            </span>
                          )}
                          {item.conversion_value && (
                            <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              item.conversion_value === 'High'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                            }`}>
                              {item.conversion_value}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Intent */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold border ${intentBadge}`}>
                          {item.search_intent || 'Commercial'}
                        </span>
                      </td>

                      {/* Target URL */}
                      <td className="p-3.5 max-w-[180px] truncate">
                        {item.target_url ? (
                          <a
                            href={item.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-neutral-600 hover:text-[#A82F19] font-medium"
                            title={item.target_url}
                          >
                            <span className="truncate">{item.target_page || item.target_url.replace(/^https?:\/\/[^/]+/, '') || '/'}</span>
                            <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                          </a>
                        ) : (
                          <span className="text-neutral-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Location */}
                      <td className="p-3.5 whitespace-nowrap text-neutral-600 font-medium">
                        {item.city || 'Dubai'}, {item.country || 'UAE'}
                      </td>

                      {/* Category */}
                      <td className="p-3.5 whitespace-nowrap text-neutral-700 font-medium">
                        {item.category || item.cluster || 'General Printing'}
                      </td>

                      {/* Current Ranking */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        {item.current_ranking != null ? (
                          <span className="font-bold text-neutral-900">{item.current_ranking}</span>
                        ) : (
                          <span className="text-neutral-400 font-mono text-[11px]" title="Live SERP API not connected">
                            —
                          </span>
                        )}
                      </td>

                      {/* Previous Ranking */}
                      <td className="p-3.5 text-center whitespace-nowrap text-neutral-400">
                        {item.previous_ranking != null ? (
                          <span>{item.previous_ranking}</span>
                        ) : (
                          <span className="font-mono text-[11px]">—</span>
                        )}
                      </td>

                      {/* Search Volume */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        {item.search_volume != null ? (
                          <span className="font-bold text-neutral-800">{item.search_volume}</span>
                        ) : (
                          <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100/80 px-1.5 py-0.5 rounded" title="Connect GSC or Ads API for verified metrics">
                            Connect API
                          </span>
                        )}
                      </td>

                      {/* CPC */}
                      <td className="p-3.5 text-center whitespace-nowrap text-neutral-400 font-mono text-[11px]">
                        {item.cpc != null ? `$${item.cpc}` : '—'}
                      </td>

                      {/* Competition */}
                      <td className="p-3.5 text-center whitespace-nowrap text-neutral-400 text-[11px]">
                        {item.competition || '—'}
                      </td>

                      {/* Last Checked */}
                      <td className="p-3.5 text-center whitespace-nowrap text-neutral-400 text-[11px]">
                        {item.last_checked || (
                          <span className="text-[10px] text-neutral-400 italic">Pending</span>
                        )}
                      </td>

                      {/* Ranking Change */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        {item.ranking_change != null ? (
                          <span
                            className={`font-bold text-[11px] ${
                              item.ranking_change > 0
                                ? 'text-emerald-600'
                                : item.ranking_change < 0
                                ? 'text-red-600'
                                : 'text-neutral-500'
                            }`}
                          >
                            {item.ranking_change > 0 ? `+${item.ranking_change}` : item.ranking_change}
                          </span>
                        ) : (
                          <span className="text-neutral-400 font-mono text-[11px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
                            title="Edit Keyword"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingItem(item)}
                            className="rounded-lg p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete Keyword"
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
          ) : (
            <div className="py-16 text-center text-sm text-neutral-500">
              <Key className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
              <p className="font-bold text-neutral-700">No keyword targets found</p>
              <p className="text-xs text-neutral-400 mt-1">Try clearing your filters or add a new keyword target.</p>
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="border-t border-neutral-100 p-4 flex items-center justify-between text-xs">
            <span className="text-neutral-500">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredItems.length)} of {filteredItems.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <span className="px-2 text-neutral-600 font-bold">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD KEYWORD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h3 className="font-display text-lg font-bold text-neutral-900">Add Keyword Target</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAdd} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Keyword *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. luxury business card printing Dubai"
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Cluster / Category</label>
                  <input
                    type="text"
                    value={formData.cluster}
                    onChange={(e) => setFormData({ ...formData, cluster: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Search Intent</label>
                  <select
                    value={formData.search_intent}
                    onChange={(e) => setFormData({ ...formData, search_intent: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none bg-white"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Transactional">Transactional</option>
                    <option value="Informational">Informational</option>
                    <option value="Local">Local</option>
                    <option value="Navigational">Navigational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Target URL</label>
                <input
                  type="url"
                  placeholder="https://0nprint.com/services/..."
                  value={formData.target_url}
                  onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Target Page Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Business Cards Landing Page"
                    value={formData.target_page}
                    onChange={(e) => setFormData({ ...formData, target_page: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Strategic notes, secondary variations..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={false}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  size="sm"
                  icon={false}
                  loading={actionLoading}
                  className="text-white"
                >
                  Save Keyword Target
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT KEYWORD MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h3 className="font-display text-lg font-bold text-neutral-900">Edit Keyword Target</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Keyword *</label>
                <input
                  type="text"
                  required
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Cluster / Category</label>
                  <input
                    type="text"
                    value={formData.cluster}
                    onChange={(e) => setFormData({ ...formData, cluster: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Search Intent</label>
                  <select
                    value={formData.search_intent}
                    onChange={(e) => setFormData({ ...formData, search_intent: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none bg-white"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Transactional">Transactional</option>
                    <option value="Informational">Informational</option>
                    <option value="Local">Local</option>
                    <option value="Navigational">Navigational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Target URL</label>
                <input
                  type="url"
                  value={formData.target_url}
                  onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Target Page</label>
                  <input
                    type="text"
                    value={formData.target_page}
                    onChange={(e) => setFormData({ ...formData, target_page: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none bg-white"
                  >
                    <option value="Tracking">Tracking</option>
                    <option value="Published">Published</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">City / Country</label>
                  <input
                    type="text"
                    value={`${formData.city}, ${formData.country}`}
                    disabled
                    className="w-full rounded-xl border border-neutral-200 p-2.5 bg-neutral-100 text-neutral-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={false}
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  size="sm"
                  icon={false}
                  loading={actionLoading}
                  className="text-white"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <h3 className="font-display text-base font-bold text-neutral-900">Confirm Keyword Deletion</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you want to delete the keyword{' '}
              <strong className="text-neutral-900 font-bold">"{deletingItem.keyword}"</strong>? This will remove it from SERP tracking and site architecture.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={false}
                onClick={() => setDeletingItem(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="accent"
                size="sm"
                icon={false}
                loading={actionLoading}
                onClick={handleDelete}
                className="bg-red-600 border-red-600 hover:bg-red-700 text-white"
              >
                Delete Keyword
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
