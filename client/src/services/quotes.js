import api from './api'
import { syncApprovedQuoteToOrder, saveMyOrder } from './orders'

const QUOTES_STORAGE_KEY = 'onprint_admin_quotes'

export const initialQuotes = []

function sanitizeQuotes(list) {
  if (!Array.isArray(list)) return []
  const DUMMY_NAMES = ['khalid real estate', 'apex general trading']
  const DUMMY_IDS = ['QT-884120', 'QT-884119']

  return list.filter((q) => {
    const name = (q.name || '').toLowerCase().trim()
    const id = q._id || q.id || ''
    const isDummy = DUMMY_NAMES.includes(name) || DUMMY_IDS.includes(id)
    return !isDummy
  })
}

export function getStoredQuotes() {
  try {
    const saved = localStorage.getItem(QUOTES_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      const clean = sanitizeQuotes(parsed)
      if (clean.length !== parsed.length) {
        saveQuotes(clean)
      }
      return clean
    }
  } catch {
    // fallback
  }
  return initialQuotes
}

export function saveQuotes(quotes) {
  try {
    const clean = sanitizeQuotes(quotes)
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(clean))
  } catch {
    // ignore
  }
}

export async function fetchQuotes() {
  try {
    const { data } = await api.get('/quotes')
    if (data?.success && Array.isArray(data.data)) {
      const clean = sanitizeQuotes(data.data)
      saveQuotes(clean)
      return clean
    }
  } catch (err) {
    console.warn('[Quotes Service] API fetch fallback to local cache:', err.message)
  }
  return getStoredQuotes()
}

export async function createQuote(quoteData) {
  const current = getStoredQuotes()
  const randomSeq = Math.floor(100000 + Math.random() * 900000)
  const orderNumber = `ONP-2026-${randomSeq}`
  const newQuote = {
    _id: `ONP-${randomSeq}`,
    id: Date.now(),
    orderNumber,
    quoteNumber: orderNumber,
    createdAt: new Date().toISOString(),
    status: quoteData.status || 'Pending',
    ...quoteData,
  }
  const updated = [newQuote, ...current]
  saveQuotes(updated)

  // Also automatically save into orders store for instant tracking
  try {
    const rawOrders = localStorage.getItem('onprint_admin_orders')
    const currentOrders = rawOrders ? JSON.parse(rawOrders) : []
    const orderRecord = {
      _id: `ORD-${randomSeq}`,
      id: Date.now() + 1,
      orderNumber,
      createdAt: newQuote.createdAt,
      status: newQuote.status || 'Pending',
      paymentStatus: 'Pending',
      currency: 'AED',
      customerName: newQuote.name || 'Client',
      customerEmail: newQuote.email || '',
      customerPhone: newQuote.phone || '',
      company: newQuote.company || '',
      productName: newQuote.productName || 'Custom Print Job',
      quantity: Number(newQuote.quantity) || 1,
      totalPrice: Number(newQuote.totalPrice || 0),
      specs: newQuote.specs || '',
      notes: newQuote.notes || '',
      artworkFile: newQuote.artworkFile || null,
      quoteNumber: orderNumber,
      items: [
        {
          productName: newQuote.productName || 'Custom Print Job',
          quantity: Number(newQuote.quantity) || 1,
          unitPrice: newQuote.totalPrice ? Number(newQuote.totalPrice) / (Number(newQuote.quantity) || 1) : 0,
          subtotal: Number(newQuote.totalPrice || 0),
        },
      ],
    }
    localStorage.setItem('onprint_admin_orders', JSON.stringify([orderRecord, ...currentOrders]))
    saveMyOrder(orderRecord)
  } catch {
    // ignore
  }

  if ((newQuote.status || '').toLowerCase() === 'approved') {
    syncApprovedQuoteToOrder(newQuote)
  }

  try {
    const res = await api.post('/quotes', {
      name: quoteData.name,
      email: quoteData.email,
      phone: quoteData.phone,
      company: quoteData.company,
      notes: quoteData.notes,
      specs: quoteData.specs,
      artworkFile: quoteData.artworkFile,
      productName: quoteData.productName,
      quantity: quoteData.quantity,
      totalPrice: quoteData.totalPrice || 0,
      status: quoteData.status || 'Pending',
      orderNumber,
      quoteNumber: orderNumber,
      items: [
        {
          productName: quoteData.productName || 'Custom Print Request',
          quantity: quoteData.quantity || 1,
          unitPrice: quoteData.totalPrice ? Number(quoteData.totalPrice) / (Number(quoteData.quantity) || 1) : 0,
          subtotal: quoteData.totalPrice || 0,
        },
      ],
    })

    if (res.data?.success && (res.data?.data?.orderNumber || res.data?.data?.quoteNumber)) {
      const returnedNumber = res.data.data.orderNumber || res.data.data.quoteNumber
      newQuote.orderNumber = returnedNumber
      newQuote.quoteNumber = returnedNumber
      newQuote.id = res.data.data.id || newQuote.id
      saveQuotes([newQuote, ...current])
    }
  } catch (err) {
    console.warn('[Quotes Service] API post fallback to local persistence:', err.message)
  }

  return newQuote
}

export async function updateQuoteStatus(quoteId, newStatus) {
  const current = getStoredQuotes()
  let targetQuote = null
  const updated = current.map((q) => {
    if (q.id === quoteId || q._id === quoteId || q.quoteNumber === quoteId) {
      targetQuote = { ...q, status: newStatus }
      return targetQuote
    }
    return q
  })
  saveQuotes(updated)

  if (targetQuote && (newStatus || '').toLowerCase() === 'approved') {
    syncApprovedQuoteToOrder(targetQuote)
  }

  try {
    await api.put(`/quotes/${quoteId}/status`, { status: newStatus })
  } catch {
    // offline fallback
  }

  return updated
}

export async function updateQuote(quoteId, updatedData) {
  const current = getStoredQuotes()
  let targetQuote = null
  const updated = current.map((q) => {
    if (q.id === quoteId || q._id === quoteId || q.quoteNumber === quoteId) {
      targetQuote = { ...q, ...updatedData }
      return targetQuote
    }
    return q
  })
  saveQuotes(updated)

  if (targetQuote && (targetQuote.status || '').toLowerCase() === 'approved') {
    syncApprovedQuoteToOrder(targetQuote)
  }

  try {
    await api.put(`/quotes/${quoteId}`, updatedData)
  } catch {
    // offline fallback
  }

  return updated
}

export async function deleteQuote(quoteId) {
  const current = getStoredQuotes()
  const updated = current.filter((q) => q.id !== quoteId && q._id !== quoteId && q.quoteNumber !== quoteId)
  saveQuotes(updated)

  try {
    await api.delete(`/quotes/${quoteId}`)
  } catch {
    // offline fallback
  }

  return updated
}
