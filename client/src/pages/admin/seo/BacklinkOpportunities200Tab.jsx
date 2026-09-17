import React, { useState, useMemo } from 'react'
import {
  Search,
  Download,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  ArrowUpDown,
  X,
  Link2,
  RefreshCw,
} from 'lucide-react'
import Button from '../../../components/Button'
import {
  createBacklinkOpportunity200,
  updateBacklinkOpportunity200,
  deleteBacklinkOpportunity200,
} from '../../../services/seo'

const STATUS_CHOICES = [
  'Prospect',
  'Researching',
  'Contacted',
  'Submitted',
  'Approved',
  'Published',
  'Rejected',
  'Not Relevant',
]

const STATUS_COLORS = {
  Prospect: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  Researching: 'bg-blue-50 text-blue-700 border-blue-200',
  Contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  Submitted: 'bg-purple-50 text-purple-700 border-purple-200',
  Approved: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  'Not Relevant': 'bg-neutral-100 text-neutral-400 border-neutral-200',
}

const ATTRIBUTE_CHOICES = ['follow', 'nofollow', 'sponsored', 'ugc']

export default function BacklinkOpportunities200Tab({
  backlinkData = { items: [], summary: {} },
  onRefresh,
  showToast,
}) {
  const [search, setSearch] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [relevanceFilter, setRelevanceFilter] = useState('all')
  const [attributeFilter, setAttributeFilter] = useState('all')
  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 50

  const [updatingId, setUpdatingId] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    website: '',
    domain: '',
    url: '',
    industry: 'Commercial Directory',
    country: 'United Arab Emirates',
    city: 'Dubai',
    relevance: 'High',
    link_opportunity: 'Business Directory Listing',
    target_onprint_url: 'https://0nprint.com/',
    anchor_text: 'ONPRINT',
    status: 'Prospect',
    date: new Date().toISOString().slice(0, 10),
    link_url: '',
    link_attribute: 'follow',
    notes: '',
  })

  const rawItems = useMemo(() => backlinkData.items || [], [backlinkData.items])

  // Extract distinct industries
  const industries = useMemo(() => {
    const set = new Set()
    rawItems.forEach((item) => {
      if (item.industry) set.add(item.industry)
    })
    return Array.from(set).sort()
  }, [rawItems])

  // Filter & sort
  const filteredItems = useMemo(() => {
    return rawItems
      .filter((item) => {
        const matchesSearch =
          !search ||
          (item.website || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.domain || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.anchor_text || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.link_opportunity || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.notes || '').toLowerCase().includes(search.toLowerCase())

        const matchesIndustry =
          industryFilter === 'all' || item.industry === industryFilter

        const matchesStatus =
          statusFilter === 'all' || item.status === statusFilter

        const matchesRelevance =
          relevanceFilter === 'all' ||
          (item.relevance || '').toLowerCase() === relevanceFilter.toLowerCase()

        const matchesAttr =
          attributeFilter === 'all' ||
          (item.link_attribute || (item.follow_type ? item.follow_type.toLowerCase() : 'follow')) === attributeFilter

        return (
          matchesSearch &&
          matchesIndustry &&
          matchesStatus &&
          matchesRelevance &&
          matchesAttr
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
    industryFilter,
    statusFilter,
    relevanceFilter,
    attributeFilter,
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

  // Quick Status Update
  const handleQuickStatusChange = async (item, newStatus) => {
    setUpdatingId(item.id)
    try {
      await updateBacklinkOpportunity200(item.id, { status: newStatus })
      showToast?.(`Status updated to "${newStatus}" for ${item.website || item.domain}`)
      onRefresh?.()
    } catch (err) {
      showToast?.(err.response?.data?.message || err.message || 'Failed to update status', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  // CSV Export
  const handleExportCsv = () => {
    if (!filteredItems.length) {
      showToast?.('No opportunities to export', 'error')
      return
    }
    const headers = [
      'Website',
      'Domain',
      'Industry',
      'Location',
      'Relevance',
      'Opportunity',
      'Target Page',
      'Anchor Text',
      'Status',
      'Date',
      'Link URL',
      'Link Attribute',
      'Notes',
    ]

    const csvRows = [
      headers.join(','),
      ...filteredItems.map((item) =>
        [
          `"${(item.website || '').replace(/"/g, '""')}"`,
          `"${item.domain || ''}"`,
          `"${(item.industry || '').replace(/"/g, '""')}"`,
          `"${item.city || 'Dubai'}, ${item.country || 'UAE'}"`,
          `"${item.relevance || 'High'}"`,
          `"${(item.link_opportunity || '').replace(/"/g, '""')}"`,
          `"${item.target_onprint_url || 'https://0nprint.com/'}"`,
          `"${(item.anchor_text || '').replace(/"/g, '""')}"`,
          `"${item.status || 'Prospect'}"`,
          `"${item.date || ''}"`,
          `"${item.link_url || item.url || ''}"`,
          `"${item.link_attribute || (item.follow_type ? item.follow_type.toLowerCase() : 'follow')}"`,
          `"${(item.notes || '').replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ]

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `onprint-backlink-crm-200-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast?.('Backlink CRM opportunities exported.')
  }

  // Add Modal Handler
  const handleOpenAdd = () => {
    setFormData({
      website: '',
      domain: '',
      url: '',
      industry: 'Commercial Directory',
      country: 'United Arab Emirates',
      city: 'Dubai',
      relevance: 'High',
      link_opportunity: 'Business Directory Listing',
      target_onprint_url: 'https://0nprint.com/',
      anchor_text: 'ONPRINT',
      status: 'Prospect',
      date: new Date().toISOString().slice(0, 10),
      link_url: '',
      link_attribute: 'follow',
      notes: '',
    })
    setShowAddModal(true)
  }

  const handleSaveAdd = async (e) => {
    e.preventDefault()
    if (!formData.website.trim() || !formData.domain.trim()) {
      showToast?.('Website and Domain are required', 'error')
      return
    }
    setActionLoading(true)
    try {
      await createBacklinkOpportunity200(formData)
      showToast?.('Backlink opportunity created.')
      setShowAddModal(false)
      onRefresh?.()
    } catch (err) {
      showToast?.(err.response?.data?.message || err.message || 'Failed to create opportunity', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Edit Modal Handler
  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setFormData({
      website: item.website || '',
      domain: item.domain || '',
      url: item.url || '',
      industry: item.industry || 'Commercial Directory',
      country: item.country || 'United Arab Emirates',
      city: item.city || 'Dubai',
      relevance: item.relevance || 'High',
      link_opportunity: item.link_opportunity || '',
      target_onprint_url: item.target_onprint_url || 'https://0nprint.com/',
      anchor_text: item.anchor_text || 'ONPRINT',
      status: item.status || 'Prospect',
      date: item.date || new Date().toISOString().slice(0, 10),
      link_url: item.link_url || '',
      link_attribute: item.link_attribute || (item.follow_type ? item.follow_type.toLowerCase() : 'follow'),
      notes: item.notes || '',
    })
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingItem) return
    setActionLoading(true)
    try {
      await updateBacklinkOpportunity200(editingItem.id, formData)
      showToast?.('Backlink opportunity updated.')
      setEditingItem(null)
      onRefresh?.()
    } catch (err) {
      showToast?.(err.response?.data?.message || err.message || 'Failed to update opportunity', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteOpportunity = async (item) => {
    const targetTitle = item.website || item.domain || item.name || 'this item'
    if (!window.confirm(`Are you sure you want to delete the backlink target "${targetTitle}"?`)) {
      return
    }
    setActionLoading(true)
    try {
      await deleteBacklinkOpportunity200(item.id)
      showToast?.(`Deleted "${targetTitle}" successfully.`)
      onRefresh?.()
    } catch (err) {
      showToast?.(err.response?.data?.message || err.message || 'Failed to delete opportunity', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-3 py-1 text-xs font-bold text-[#A82F19]">
                <Link2 className="h-3.5 w-3.5" /> Backlink Outreach CRM (200 Opportunities)
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-bold text-neutral-600">
                10 Strategic Clusters (B1–B10)
              </span>
            </div>
            <h2 className="mt-2 font-display text-xl sm:text-2xl font-black text-neutral-900">
              Verified UAE Commercial Backlink Pipeline & Outreach CRM
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 max-w-3xl leading-relaxed">
              200 authentic, research-backed link acquisition targets across Dubai Chamber, DED registries, regional printing alliances, packaging converters, B2B procurement portals, and verified editorial platforms. Strictly 100% white-hat and PBN-free.
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
              <Plus className="h-3.5 w-3.5" /> Add Opportunity
            </Button>
          </div>
        </div>

        {/* 8 Live Status Metrics */}
        <div className="mt-5 pt-4 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs text-center">
          {STATUS_CHOICES.map((st) => {
            const count = rawItems.filter((i) => i.status === st).length
            return (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(statusFilter === st ? 'all' : st)
                  setCurrentPage(1)
                }}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'border-[#A82F19] bg-[#A82F19]/5 shadow-xs'
                    : 'border-neutral-200/70 bg-neutral-50/50 hover:bg-neutral-100/60'
                }`}
              >
                <div className="text-[10px] font-bold uppercase text-neutral-400 truncate">{st}</div>
                <div className="text-lg font-black text-neutral-900 mt-0.5">{count}</div>
              </button>
            )
          })}
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search website, domain, anchor..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-xl border border-neutral-200 pl-9 pr-3 py-2 text-xs focus:border-[#A82F19] focus:outline-none"
            />
          </div>

          <select
            value={industryFilter}
            onChange={(e) => {
              setIndustryFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-[#A82F19] focus:outline-none"
          >
            <option value="all">All Industries / Clusters</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-[#A82F19] focus:outline-none"
          >
            <option value="all">All 8 Statuses</option>
            {STATUS_CHOICES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={relevanceFilter}
            onChange={(e) => {
              setRelevanceFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-[#A82F19] focus:outline-none"
          >
            <option value="all">All Relevances</option>
            <option value="High">High Relevance</option>
            <option value="Medium">Medium Relevance</option>
            <option value="Low">Low Relevance</option>
          </select>

          <select
            value={attributeFilter}
            onChange={(e) => {
              setAttributeFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-[#A82F19] focus:outline-none"
          >
            <option value="all">All Link Attributes</option>
            {ATTRIBUTE_CHOICES.map((attr) => (
              <option key={attr} value={attr}>
                {attr}
              </option>
            ))}
          </select>
        </div>

        {/* Count overview */}
        <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
          <span>
            Showing <strong className="text-neutral-900">{filteredItems.length}</strong> backlink opportunities (Page {currentPage} of {totalPages})
          </span>
          {(search || industryFilter !== 'all' || statusFilter !== 'all' || relevanceFilter !== 'all' || attributeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('')
                setIndustryFilter('all')
                setStatusFilter('all')
                setRelevanceFilter('all')
                setAttributeFilter('all')
                setCurrentPage(1)
              }}
              className="text-[#A82F19] hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main CRM Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {paginatedItems.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/75 text-[10px] uppercase font-black text-neutral-400">
                  <th
                    className="p-3.5 cursor-pointer hover:text-neutral-800"
                    onClick={() => handleSort('website')}
                  >
                    <div className="flex items-center gap-1">
                      Website & Domain <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    className="p-3.5 cursor-pointer hover:text-neutral-800"
                    onClick={() => handleSort('industry')}
                  >
                    <div className="flex items-center gap-1">
                      Industry <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5 text-center">Relevance</th>
                  <th className="p-3.5">Opportunity</th>
                  <th className="p-3.5">Target Page</th>
                  <th className="p-3.5">Anchor Text</th>
                  <th
                    className="p-3.5 cursor-pointer hover:text-neutral-800"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="p-3.5 text-center">Date</th>
                  <th className="p-3.5 text-center">Attribute</th>
                  <th className="p-3.5">Notes</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginatedItems.map((item) => {
                  const statusClass =
                    STATUS_COLORS[item.status] ||
                    'bg-neutral-100 text-neutral-600 border-neutral-200'

                  const attr =
                    item.link_attribute ||
                    (item.follow_type ? item.follow_type.toLowerCase() : 'follow')

                  return (
                    <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Website & Domain */}
                      <td className="p-3.5 max-w-[200px]">
                        <div className="font-bold text-neutral-900 truncate" title={item.website}>
                          {item.website || item.domain}
                        </div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-[#A82F19] truncate"
                          title={item.url}
                        >
                          <span>{item.domain}</span>
                          <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />
                        </a>
                      </td>

                      {/* Industry */}
                      <td className="p-3.5 whitespace-nowrap text-neutral-700 font-medium max-w-[140px] truncate" title={item.industry}>
                        {item.industry}
                      </td>

                      {/* Location */}
                      <td className="p-3.5 whitespace-nowrap text-neutral-600">
                        {item.city || 'Dubai'}, {item.country === 'United Arab Emirates' ? 'UAE' : (item.country || 'UAE')}
                      </td>

                      {/* Relevance */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                            item.relevance === 'High'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.relevance === 'Medium'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {item.relevance || 'High'}
                        </span>
                      </td>

                      {/* Opportunity */}
                      <td className="p-3.5 max-w-[150px] truncate text-neutral-800 font-medium" title={item.link_opportunity}>
                        {item.link_opportunity}
                      </td>

                      {/* Target Page */}
                      <td className="p-3.5 max-w-[140px] truncate">
                        <a
                          href={item.target_onprint_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-600 hover:text-[#A82F19] font-medium inline-flex items-center gap-1"
                          title={item.target_onprint_url}
                        >
                          <span className="truncate">
                            {item.target_onprint_url?.replace(/^https?:\/\/[^/]+/, '') || '/'}
                          </span>
                          <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />
                        </a>
                      </td>

                      {/* Anchor Text */}
                      <td className="p-3.5 max-w-[150px] truncate font-medium text-neutral-900" title={item.anchor_text}>
                        <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px]">
                          {item.anchor_text || 'ONPRINT'}
                        </span>
                      </td>

                      {/* Status Dropdown (Inline CRM Choice) */}
                      <td className="p-3.5 whitespace-nowrap">
                        <select
                          disabled={updatingId === item.id}
                          value={item.status || 'Prospect'}
                          onChange={(e) => handleQuickStatusChange(item, e.target.value)}
                          className={`rounded-lg border px-2 py-1 text-[11px] font-bold cursor-pointer transition-all ${statusClass} focus:outline-none`}
                        >
                          {STATUS_CHOICES.map((st) => (
                            <option key={st} value={st} className="bg-white text-neutral-900 font-normal">
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-center whitespace-nowrap text-neutral-500 font-mono text-[11px]">
                        {item.date || '—'}
                      </td>

                      {/* Link Attribute */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase font-mono ${
                            attr === 'follow'
                              ? 'bg-emerald-100/60 text-emerald-800'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {attr}
                        </span>
                      </td>

                      {/* Notes */}
                      <td className="p-3.5 max-w-[180px] truncate text-neutral-500 text-[11px]" title={item.notes}>
                        {item.notes || '—'}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.submission_url && (
                            <a
                              href={item.submission_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                              title="Direct Submission Portal"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
                            title="Edit Opportunity & Notes"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteOpportunity(item)}
                            className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete Opportunity"
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
              <Link2 className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
              <p className="font-bold text-neutral-700">No backlink opportunities found</p>
              <p className="text-xs text-neutral-400 mt-1">Try changing your filters or search keywords.</p>
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

      {/* EDIT / VIEW MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-900">
                  Edit Backlink Opportunity
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">{editingItem.website || editingItem.domain}</p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Website Name</label>
                  <input
                    type="text"
                    required
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Domain</label>
                  <input
                    type="text"
                    required
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Opportunity Page URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Industry / Category</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Opportunity Type</label>
                  <input
                    type="text"
                    value={formData.link_opportunity}
                    onChange={(e) => setFormData({ ...formData, link_opportunity: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Target ONPRINT Page</label>
                  <input
                    type="url"
                    value={formData.target_onprint_url}
                    onChange={(e) => setFormData({ ...formData, target_onprint_url: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Anchor Text</label>
                  <input
                    type="text"
                    value={formData.anchor_text}
                    onChange={(e) => setFormData({ ...formData, anchor_text: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Status (CRM)</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none bg-white font-bold"
                  >
                    {STATUS_CHOICES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Attribute</label>
                  <select
                    value={formData.link_attribute}
                    onChange={(e) => setFormData({ ...formData, link_attribute: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none bg-white"
                  >
                    {ATTRIBUTE_CHOICES.map((attr) => (
                      <option key={attr} value={attr}>
                        {attr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Live Published Link URL (if active)</label>
                <input
                  type="url"
                  placeholder="https://... URL where link is live"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Outreach & Strategic Notes</label>
                <textarea
                  rows={3}
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
                  Save Opportunity
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD OPPORTUNITY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-900">
                  Add Backlink Opportunity
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">Register new legitimate UAE link target</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Website Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dubai Chamber Directory"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Domain *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. dubaichamber.com"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Opportunity Page URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Industry / Category</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Opportunity Type</label>
                  <input
                    type="text"
                    value={formData.link_opportunity}
                    onChange={(e) => setFormData({ ...formData, link_opportunity: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Target ONPRINT Page</label>
                  <input
                    type="url"
                    value={formData.target_onprint_url}
                    onChange={(e) => setFormData({ ...formData, target_onprint_url: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Anchor Text</label>
                  <input
                    type="text"
                    value={formData.anchor_text}
                    onChange={(e) => setFormData({ ...formData, anchor_text: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Status (CRM)</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none bg-white font-bold"
                  >
                    {STATUS_CHOICES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Attribute</label>
                  <select
                    value={formData.link_attribute}
                    onChange={(e) => setFormData({ ...formData, link_attribute: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none bg-white"
                  >
                    {ATTRIBUTE_CHOICES.map((attr) => (
                      <option key={attr} value={attr}>
                        {attr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 focus:border-[#A82F19] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Strategic & Outreach Notes</label>
                <textarea
                  rows={2}
                  placeholder="Submission instructions, requirement details..."
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
                  Add Opportunity
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
