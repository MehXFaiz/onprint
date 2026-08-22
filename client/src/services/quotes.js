import api from './api'

const QUOTES_STORAGE_KEY = 'onprint_admin_quotes'

export const initialQuotes = [
  {
    _id: 'QT-884120',
    id: 1,
    quoteNumber: 'QT-2026-884120',
    name: 'Khalid Real Estate',
    email: 'khalid@khalidre.ae',
    phone: '+971 55 444 3322',
    company: 'Khalid Real Estate LLC',
    productName: 'Custom Acrylic Nameplates & Folders',
    quantity: 150,
    totalPrice: 3500,
    status: 'Pending',
    createdAt: '2026-08-14T09:30:00Z',
    specs: 'Size: Custom | Material: Clear Acrylic & 350gsm Silk',
    notes: 'Requested custom acrylic door nameplates and foil embossed presentation folders.',
    artworkFile: 'door_plates_dieline.pdf',
  },
  {
    _id: 'QT-884119',
    id: 2,
    quoteNumber: 'QT-2026-884119',
    name: 'Apex General Trading',
    email: 'procurement@apexgt.ae',
    phone: '+971 50 777 8899',
    company: 'Apex Trading',
    productName: 'Luxury Business Cards & Letterheads',
    quantity: 1000,
    totalPrice: 5200,
    status: 'Approved',
    createdAt: '2026-08-12T11:20:00Z',
    specs: 'Size: 90x55mm | Material: 350gsm Silk | Finish: Gold Foil',
    notes: '350gsm silk cards with gold foil stamping and letterheads.',
    artworkFile: 'business_cards_vector.ai',
  },
]

export function getStoredQuotes() {
  try {
    const saved = localStorage.getItem(QUOTES_STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // fallback
  }
  return initialQuotes
}

export function saveQuotes(quotes) {
  try {
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes))
  } catch {
    // ignore
  }
}

export function createQuote(quoteData) {
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

  // Asynchronously attempt to sync with backend API if available
  api.post('/quotes', {
    name: quoteData.name,
    email: quoteData.email,
    phone: quoteData.phone,
    company: quoteData.company,
    notes: quoteData.notes,
    totalPrice: quoteData.totalPrice || 0,
    items: [
      {
        productName: quoteData.productName || 'Custom Print Request',
        quantity: quoteData.quantity || 1,
        unitPrice: quoteData.totalPrice ? Number(quoteData.totalPrice) / (Number(quoteData.quantity) || 1) : 0,
        subtotal: quoteData.totalPrice || 0,
        options: {
          specs: quoteData.specs,
          artworkFile: quoteData.artworkFile,
        },
      },
    ],
  }).catch(() => {
    // Backend sync error handled gracefully
  })

  return newQuote
}

export function updateQuoteStatus(quoteId, newStatus) {
  const current = getStoredQuotes()
  const updated = current.map((q) =>
    q.id === quoteId || q._id === quoteId ? { ...q, status: newStatus } : q
  )
  saveQuotes(updated)
  return updated
}

export function updateQuote(quoteId, updatedData) {
  const current = getStoredQuotes()
  const updated = current.map((q) =>
    q.id === quoteId || q._id === quoteId ? { ...q, ...updatedData } : q
  )
  saveQuotes(updated)
  return updated
}

export function deleteQuote(quoteId) {
  const current = getStoredQuotes()
  const updated = current.filter((q) => q.id !== quoteId && q._id !== quoteId)
  saveQuotes(updated)
  return updated
}
