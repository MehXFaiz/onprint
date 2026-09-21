import { useState, useEffect, useMemo } from 'react'
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  Edit2,
  X,
  Sparkles,
  Layers,
  Calendar,
  User,
  Tag,
  Check,
} from 'lucide-react'
import Button from '../../../components/Button'
import {
  getSeoTasks,
  createSeoTask,
  updateSeoTask,
  deleteSeoTask,
  generateSeoTasks,
} from '../../../services/seo'

const CATEGORIES = [
  { value: 'All', label: 'All Categories' },
  { value: 'onpage', label: 'On-Page SEO' },
  { value: 'technical', label: 'Technical SEO' },
  { value: 'content', label: 'Content Depth' },
  { value: 'geo', label: 'GEO / AI Visibility' },
  { value: 'schema', label: 'Structured Data' },
  { value: 'backlinks', label: 'Backlinks & Outreach' },
]

const PRIORITIES = [
  { value: 'All', label: 'All Priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const STATUSES = [
  { value: 'All', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

export default function SeoTasksTab({ showToast }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Modals & Form
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const initialForm = {
    title: '',
    description: '',
    category: 'onpage',
    priority: 'high',
    status: 'pending',
    assigned_to: 'SEO Specialist',
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  }
  const [formData, setFormData] = useState(initialForm)

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await getSeoTasks()
      if (res?.success) {
        setTasks(res.data || [])
      }
    } catch (err) {
      showToast?.('Failed to load SEO tasks: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await generateSeoTasks()
      if (res?.success) {
        showToast?.(res.message || 'Auto-generated SEO tasks successfully!')
        loadData()
      }
    } catch (err) {
      showToast?.('Failed to auto-generate tasks: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    try {
      const res = await updateSeoTask(task.id, { ...task, status: newStatus })
      if (res?.success) {
        showToast?.(newStatus === 'completed' ? 'Task marked as completed!' : 'Task reopened.')
        loadData()
      }
    } catch (err) {
      showToast?.('Failed to update task: ' + (err.response?.data?.message || err.message), 'error')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      showToast?.('Please enter a task title', 'error')
      return
    }
    setActionLoading(true)
    try {
      if (editingItem) {
        await updateSeoTask(editingItem.id, formData)
        showToast?.('Task updated successfully!')
      } else {
        await createSeoTask(formData)
        showToast?.('New SEO task created successfully!')
      }
      setShowAddModal(false)
      setEditingItem(null)
      setFormData(initialForm)
      loadData()
    } catch (err) {
      showToast?.('Failed to save task: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingItem) return
    setActionLoading(true)
    try {
      await deleteSeoTask(deletingItem.id)
      showToast?.('SEO task deleted!')
      setDeletingItem(null)
      loadData()
    } catch (err) {
      showToast?.('Failed to delete task: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const openEdit = (task) => {
    setEditingItem(task)
    setFormData({
      title: task.title || '',
      description: task.description || '',
      category: task.category || 'onpage',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      assigned_to: task.assigned_to || 'Admin',
      due_date: task.due_date ? String(task.due_date).split('T')[0] : '',
    })
    setShowAddModal(true)
  }

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const q = (search || '').toLowerCase().trim()
      const matchSearch =
        !q ||
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.assigned_to?.toLowerCase().includes(q)

      const matchCategory = categoryFilter === 'All' || t.category === categoryFilter
      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter
      const matchStatus = statusFilter === 'All' || t.status === statusFilter

      return matchSearch && matchCategory && matchPriority && matchStatus
    })
  }, [tasks, search, categoryFilter, priorityFilter, statusFilter])

  // Stats calculation
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'medium':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200'
    }
  }

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'technical':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'onpage':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'geo':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'schema':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200'
      case 'backlinks':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'content':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 text-xs font-bold text-[#A82F19]">
                <Layers className="h-3.5 w-3.5" />
                Workflow Engine
              </span>
              <span className="text-xs font-semibold text-neutral-500">Requirement 22 &amp; 38</span>
            </div>
            <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-neutral-900">
              SEO Action Tasks &amp; Execution Queue
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
              Track priority tasks across on-page optimization, technical fixes, GEO entities, schema markup, and high-impact striking distance keyword queries.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-1.5 border-neutral-300 text-neutral-800 hover:border-[#A82F19]"
            >
              <Sparkles className={`h-4 w-4 text-[#A82F19] ${generating ? 'animate-spin' : ''}`} />
              <span>{generating ? 'Scanning…' : 'Auto-Generate Tasks'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
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
                setEditingItem(null)
                setFormData(initialForm)
                setShowAddModal(true)
              }}
              className="flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </Button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
              Total Tasks
            </span>
            <div className="text-2xl font-black text-neutral-900">{totalTasks}</div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
              Pending
            </span>
            <div className="text-2xl font-black text-amber-800">{pendingTasks}</div>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
              In Progress
            </span>
            <div className="text-2xl font-black text-blue-800">{inProgressTasks}</div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Completed
              </span>
              <span className="text-xs font-bold text-emerald-700">{completionRate}%</span>
            </div>
            <div className="text-2xl font-black text-emerald-800">{completedTasks}</div>
            <div className="w-full bg-emerald-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks, descriptions..."
              className="w-full rounded-xl border border-neutral-200 pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List Table */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[#A82F19] mb-2" />
            Loading SEO task queue…
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
            No SEO tasks match your filter criteria. Click "Auto-Generate Tasks" to analyze audit issues.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed'
            return (
              <div
                key={task.id}
                className={`rounded-2xl border transition-all duration-200 bg-white p-5 shadow-2xs hover:border-neutral-300 ${
                  isCompleted ? 'bg-neutral-50/60 opacity-80' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(task)}
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                        isCompleted
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-neutral-300 hover:border-[#A82F19] text-transparent hover:text-neutral-300'
                      }`}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </button>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${getCategoryBadge(
                            task.category
                          )}`}
                        >
                          {task.category}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${getPriorityBadge(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            task.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : task.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h3
                        className={`font-display text-sm font-bold text-neutral-900 ${
                          isCompleted ? 'line-through text-neutral-500' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-neutral-500">
                        {task.assigned_to && (
                          <span className="inline-flex items-center gap-1 font-medium">
                            <User className="h-3 w-3 text-neutral-400" />
                            {task.assigned_to}
                          </span>
                        )}
                        {task.due_date && (
                          <span className="inline-flex items-center gap-1 font-mono">
                            <Calendar className="h-3 w-3 text-neutral-400" />
                            Due: {String(task.due_date).split('T')[0]}
                          </span>
                        )}
                        {task.completed_at && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-mono">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            Done: {new Date(task.completed_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(task)}
                      className="p-2 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit task"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingItem(task)}
                      className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add / Edit Task Modal */}
      {showAddModal && (
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
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl"
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
              {editingItem ? 'Edit SEO Task' : 'Create SEO Task'}
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Add actionable optimization actions to keep ONPRINT ranking ahead in Dubai local and AI searches.
            </p>

            <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Audit striking-distance queries for Business Cards Dubai"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Description &amp; Action Plan</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Specific optimization guidelines, test hypotheses, or checklist items..."
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  >
                    <option value="onpage">On-Page SEO</option>
                    <option value="technical">Technical SEO</option>
                    <option value="content">Content Depth</option>
                    <option value="geo">GEO / AI Engine</option>
                    <option value="schema">Structured Data</option>
                    <option value="backlinks">Backlinks &amp; Outreach</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Assigned To</label>
                  <input
                    type="text"
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                    placeholder="e.g. SEO Specialist, Lead Tech"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Target Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
                />
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
                  {actionLoading ? 'Saving…' : editingItem ? 'Save Changes' : 'Create Task'}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="font-display text-lg font-black text-neutral-900">Delete SEO Task?</h3>
            <p className="mt-2 text-xs text-neutral-600">
              Are you sure you want to permanently delete{' '}
              <strong className="text-neutral-900 font-bold">"{deletingItem.title}"</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setDeletingItem(null)} disabled={actionLoading}>
                Cancel
              </Button>
              <Button
                variant="accent"
                size="sm"
                className="bg-red-600 hover:bg-red-700 border-red-600"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting…' : 'Delete Task'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
