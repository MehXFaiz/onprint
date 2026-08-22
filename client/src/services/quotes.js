import api from './api'

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
  const newQuote = {
    _id: `QT-${randomSeq}`,
    id: Date.now(),
    quoteNumber: `QT-2026-${randomSeq}`,
    createdAt: new Date().toISOString(),
    status: 'Pending',
    ...quoteData,
  }
  const updated = [newQuote, ...current]
  saveQuotes(updated)

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
      items: [
        {
          productName: quoteData.productName || 'Custom Print Request',
          quantity: quoteData.quantity || 1,
          unitPrice: quoteData.totalPrice ? Number(quoteData.totalPrice) / (Number(quoteData.quantity) || 1) : 0,
          subtotal: quoteData.totalPrice || 0,
        },
      ],
    })

    if (res.data?.success && res.data?.data?.quoteNumber) {
      newQuote.quoteNumber = res.data.data.quoteNumber
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
  const updated = current.map((q) =>
    q.id === quoteId || q._id === quoteId || q.quoteNumber === quoteId ? { ...q, status: newStatus } : q
  )
  saveQuotes(updated)
  return updated
}

export function updateQuote(quoteId, updatedData) {
  const current = getStoredQuotes()
  const updated = current.map((q) =>
    q.id === quoteId || q._id === quoteId || q.quoteNumber === quoteId ? { ...q, ...updatedData } : q
  )
  saveQuotes(updated)
  return updated
}

export function deleteQuote(quoteId) {
  const current = getStoredQuotes()
  const updated = current.filter((q) => q.id !== quoteId && q._id !== quoteId && q.quoteNumber !== quoteId)
  saveQuotes(updated)
  return updated
}
