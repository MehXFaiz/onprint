import { useState, useEffect } from 'react'
import { MessageSquare, Search, Filter, Mail, CheckCircle2, Trash2, User, Phone, RefreshCw } from 'lucide-react'
import { getStoredMessages, fetchMessages, updateMessageStatus, deleteMessage } from '../../services/contact'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [toast, setToast] = useState(null)

  const loadData = async () => {
    setLoading(true)
    const local = getStoredMessages()
    setMessages(local)
    try {
      const remote = await fetchMessages()
      if (Array.isArray(remote)) {
        setMessages(remote)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = messages.filter((m) => {
    const matchesSearch =
      (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.message || '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || (m.status || 'unread') === statusFilter
    return matchesSearch && matchesStatus
  })

  const markAsRead = async (id) => {
    const updated = await updateMessageStatus(id, 'read')
    setMessages(updated)
  }

  const handleDelete = async (id) => {
    const updated = await deleteMessage(id)
    setMessages(updated)
    if (selectedMessage?.id === id || selectedMessage?._id === id) {
      setSelectedMessage(null)
    }
    setToast('Message deleted successfully.')
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 left-4 sm:left-auto max-w-[calc(100vw-2rem)] z-50 flex items-center gap-2.5 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-3 text-xs font-bold text-white shadow-2xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#081226] p-6 rounded-3xl border border-[#122240] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D6C29A]">
            <MessageSquare className="h-4 w-4" />
            <span>Communications Hub</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-black text-[#F5F3EE]">
            Contact Messages & Inquiries
          </h1>
          <p className="mt-0.5 text-xs text-[#B8C2D9]">
            Review inquiries, custom print questions, and client contact messages.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#081226] p-4 rounded-2xl border border-[#122240] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B8C2D9]/70" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages by sender, email, subject..."
            className="w-full rounded-xl border border-[#122240] bg-[#040A18] pl-10 pr-4 py-2 text-xs font-medium text-[#F5F3EE] placeholder-neutral-400 focus:border-[#D6C29A] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-[#B8C2D9]/70 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-[#122240] bg-[#040A18] px-3 py-2 text-xs font-bold text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none cursor-pointer"
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
            <div className="rounded-3xl border border-[#122240] bg-[#081226] p-8 text-center text-xs text-[#B8C2D9]">
              No messages found matching search criteria.
            </div>
          ) : (
            filtered.map((msg) => {
              const msgId = msg.id || msg._id
              const isSelected = selectedMessage && (selectedMessage.id === msgId || selectedMessage._id === msgId)
              const formattedDate = msg.createdAt
                ? new Date(msg.createdAt).toLocaleDateString('en-AE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : 'Recent'
              return (
                <div
                  key={msgId}
                  onClick={() => {
                    setSelectedMessage(msg)
                    if (msg.status === 'unread') markAsRead(msgId)
                  }}
                  className={`rounded-2xl border p-4 shadow-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#D6C29A] bg-red-50/20 shadow-sm'
                      : msg.status === 'unread'
                      ? 'border-[#D6C29A]/40 bg-red-50/10 font-bold'
                      : 'border-[#122240] bg-[#081226] hover:border-[#122240]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#F5F3EE] text-xs truncate">{msg.name}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                        msg.status === 'unread'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : msg.status === 'replied'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-neutral-100 text-[#B8C2D9] border border-[#122240]'
                      }`}
                    >
                      {msg.status || 'unread'}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-[#F5F3EE] mt-1 line-clamp-1">
                    {msg.subject || 'Direct Studio Inquiry'}
                  </div>
                  <p className="text-[11px] text-[#B8C2D9] mt-1 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-[#B8C2D9]/70 border-t border-[#122240] pt-2">
                    <span className="truncate min-w-0">{msg.email}</span>
                    <span className="shrink-0">{formattedDate}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Message Detail Viewer Column */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="rounded-3xl border border-[#122240] bg-[#081226] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-[#122240] pb-5">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#F5F3EE]">
                    {selectedMessage.subject}
                  </h2>
                  <p className="text-xs text-[#B8C2D9] mt-0.5">Received on {selectedMessage.createdAt}</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-[#040A18] p-4 text-xs">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#D6C29A] shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#B8C2D9]/70">Sender</div>
                    <div className="font-bold text-[#F5F3EE]">{selectedMessage.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="h-4 w-4 text-[#D6C29A] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-[#B8C2D9]/70">Email</div>
                    <div className="font-mono text-[#F5F3EE] break-all">{selectedMessage.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#D6C29A] shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#B8C2D9]/70">Phone</div>
                    <div className="font-bold text-[#F5F3EE]">{selectedMessage.phone || '—'}</div>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#B8C2D9]/70 block mb-2">
                  Message Content
                </label>
                <div className="rounded-2xl border border-[#122240] bg-[#081226] p-5 text-xs text-[#F5F3EE] leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-[#122240] pt-4">
                <a
                  href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-[#D6C29A] transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#122240] bg-[#081226] p-12 text-center text-xs text-[#B8C2D9]/70">
              Select a message from the left list to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
