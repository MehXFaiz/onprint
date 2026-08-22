import { useState } from 'react'
import { MessageSquare, Search, Filter, Mail, CheckCircle2, Trash2, User, Phone } from 'lucide-react'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [toast, setToast] = useState(null)

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.company.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const markAsRead = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'read' } : m))
    )
  }

  const handleDelete = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }
    setToast('Message deleted successfully.')
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-3 text-xs font-bold text-white shadow-2xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <MessageSquare className="h-4 w-4" />
            <span>Communications Hub</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-black text-neutral-900">
            Contact Messages & Inquiries
          </h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            Review inquiries, custom print questions, and client contact messages.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages by sender, email, subject..."
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-4 py-2 text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-neutral-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs font-bold text-neutral-800 focus:border-[#A82F19] focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Main Split View Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List Column */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center text-xs text-neutral-500">
              No messages found matching search criteria.
            </div>
          ) : (
            filtered.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id
              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg)
                    if (msg.status === 'unread') markAsRead(msg.id)
                  }}
                  className={`rounded-2xl border p-4 shadow-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#A82F19] bg-red-50/20 shadow-sm'
                      : msg.status === 'unread'
                      ? 'border-neutral-300 bg-white font-bold'
                      : 'border-neutral-200/80 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-neutral-900 text-xs truncate">{msg.name}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                        msg.status === 'unread'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : msg.status === 'replied'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-neutral-700 mt-1 line-clamp-1">
                    {msg.subject}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-400 border-t border-neutral-100 pt-2">
                    <span>{msg.company || 'Direct Contact'}</span>
                    <span>{msg.createdAt}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Message Detail Viewer Column */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-5">
                <div>
                  <h2 className="font-display text-xl font-bold text-neutral-900">
                    {selectedMessage.subject}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">Received on {selectedMessage.createdAt}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(selectedMessage.id)}
                  title="Delete message"
                  className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-neutral-50 p-4 text-xs">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#A82F19] shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-neutral-400">Sender</div>
                    <div className="font-bold text-neutral-900">{selectedMessage.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#A82F19] shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-neutral-400">Email</div>
                    <div className="font-mono text-neutral-800">{selectedMessage.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#A82F19] shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-neutral-400">Phone</div>
                    <div className="font-bold text-neutral-800">{selectedMessage.phone || '—'}</div>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  Message Content
                </label>
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-xs text-neutral-800 leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
                <a
                  href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-[#A82F19] transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-12 text-center text-xs text-neutral-400">
              Select a message from the left list to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
