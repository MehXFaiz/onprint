import api from './api'

const MESSAGES_STORAGE_KEY = 'onprint_admin_messages'

export function getStoredMessages() {
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY)
    if (raw) return JSON.parse(raw) || []
  } catch {
    // fallback
  }
  return []
}

export function saveMessages(messages) {
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages || []))
  } catch {
    // ignore
  }
}

export async function fetchMessages() {
  try {
    const { data } = await api.get('/contact')
    if (data?.success && Array.isArray(data.data)) {
      saveMessages(data.data)
      return data.data
    }
  } catch (err) {
    console.warn('[Contact Service] API fetch fallback to local cache:', err.message)
  }
  return getStoredMessages()
}

export async function submitContactInquiry(formData) {
  const current = getStoredMessages()
  const randomSeq = Math.floor(100000 + Math.random() * 900000)
  const newMessage = {
    _id: `msg-${randomSeq}`,
    id: Date.now(),
    name: (formData.name || '').trim(),
    email: (formData.email || '').trim().toLowerCase(),
    phone: (formData.phone || '').trim() || null,
    company: (formData.company || '').trim() || null,
    subject: (formData.subject || '').trim() || 'Direct Studio Inquiry',
    message: (formData.message || '').trim(),
    status: 'unread',
    createdAt: new Date().toISOString(),
  }

  const updated = [newMessage, ...current]
  saveMessages(updated)

  try {
    const res = await api.post('/contact', {
      name: newMessage.name,
      email: newMessage.email,
      phone: newMessage.phone,
      company: newMessage.company,
      subject: newMessage.subject,
      message: newMessage.message,
    })

    if (res.data?.success && res.data?.data?.id) {
      newMessage.id = res.data.data.id
      saveMessages([newMessage, ...current])
    }
  } catch (err) {
    console.warn('[Contact Service] API post fallback to local cache:', err.message)
  }

  return newMessage
}

export async function updateMessageStatus(id, newStatus) {
  const current = getStoredMessages()
  const updated = current.map((m) =>
    m.id === id || m._id === id ? { ...m, status: newStatus } : m
  )
  saveMessages(updated)

  try {
    await api.put(`/contact/${id}/status`, { status: newStatus })
  } catch {
    // offline fallback
  }

  return updated
}

export async function deleteMessage(id) {
  const current = getStoredMessages()
  const updated = current.filter((m) => m.id !== id && m._id !== id)
  saveMessages(updated)

  try {
    await api.delete(`/contact/${id}`)
  } catch {
    // offline fallback
  }

  return updated
}
