import api from './api'

const ORDERS_STORAGE_KEY = 'onprint_admin_orders'

// Clean / empty initial orders list (No fake mock users)
export const initialOrders = []

// Filter out old legacy dummy mock orders if present in localStorage
function sanitizeOrders(list) {
  if (!Array.isArray(list)) return []
  const DUMMY_NAMES = [
    'sarah al-maktoum',
    'ahmed al-mansoori',
    'elena rostova',
    'tariq hassan',
    'jessica taylor',
  ]
  const DUMMY_IDS = ['ORD-9821', 'ORD-9820', 'ORD-9819', 'ORD-9818', 'ORD-9817']

  return list.filter((order) => {
    const name = (order.customerName || '').toLowerCase().trim()
    const id = order._id || order.id || ''
    const isDummy = DUMMY_NAMES.includes(name) || DUMMY_IDS.includes(id)
    return !isDummy
  })
}

function getStoredQuotesRaw() {
  try {
    const saved = localStorage.getItem('onprint_admin_quotes')
    if (saved) {
      return JSON.parse(saved) || []
    }
  } catch {
    // ignore
  }
  return []
}

export function syncApprovedQuoteToOrder(quote) {
  if (!quote || (quote.status || '').toLowerCase() !== 'approved') return null
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY)
    const currentOrders = saved ? JSON.parse(saved) : []
    const cleanOrders = sanitizeOrders(currentOrders)
    const qNum = quote.quoteNumber || ''
    const qId = quote.id || quote._id

    const exists = cleanOrders.some(
      (o) =>
        (qNum && o.quoteNumber === qNum) ||
        (qId && o.quoteId === qId) ||
        (qNum && (o.notes || '').includes(qNum)) ||
        (qNum && (o.orderNumber || '').includes(qNum))
    )

    if (exists) return null

    const randomSeq = Math.floor(100000 + Math.random() * 900000)
    const newOrder = {
      _id: `ORD-${randomSeq}`,
      id: Date.now() + Math.floor(Math.random() * 1000),
      orderNumber: `ONP-2026-${randomSeq}`,
      createdAt: quote.createdAt || new Date().toISOString(),
      status: 'Pending',
      paymentStatus: 'Pending',
      currency: 'AED',
      customerName: quote.name || 'Client',
      customerEmail: quote.email || '',
      customerPhone: quote.phone || '',
      company: quote.company || '',
      productName: quote.productName || quote.items?.[0]?.productName || 'Custom Print Job',
      quantity: Number(quote.quantity) || 1,
      totalPrice: Number(quote.totalPrice || 0),
      specs: quote.specs || '',
      notes: quote.notes ? `${quote.notes} (Approved Quote ${quote.quoteNumber})` : `Approved Quote ${quote.quoteNumber}`,
      artworkFile: quote.artworkFile || null,
      quoteNumber: quote.quoteNumber || null,
      quoteId: quote.id || quote._id || null,
      items: Array.isArray(quote.items) && quote.items.length > 0
        ? quote.items
        : [
            {
              productName: quote.productName || 'Custom Print Job',
              quantity: Number(quote.quantity) || 1,
              unitPrice: quote.totalPrice ? Number(quote.totalPrice) / (Number(quote.quantity) || 1) : 0,
              subtotal: Number(quote.totalPrice || 0),
            },
          ],
    }

    const updated = [newOrder, ...cleanOrders]
    saveOrders(updated)
    return newOrder
  } catch {
    return null
  }
}

export function syncAllApprovedQuotesToOrders() {
  const quotes = getStoredQuotesRaw()
  if (Array.isArray(quotes)) {
    quotes.forEach((q) => {
      if ((q.status || '').toLowerCase() === 'approved') {
        syncApprovedQuoteToOrder(q)
      }
    })
  }
}

export function getStoredOrders() {
  try {
    syncAllApprovedQuotesToOrders()
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      const clean = sanitizeOrders(parsed)
      if (clean.length !== parsed.length) {
        saveOrders(clean)
      }
      return clean
    }
  } catch {
    // fallback
  }
  return initialOrders
}

export function saveOrders(orders) {
  try {
    const clean = sanitizeOrders(orders)
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(clean))
  } catch {
    // ignore
  }
}

export async function fetchOrders() {
  try {
    syncAllApprovedQuotesToOrders()
    const { data } = await api.get('/orders')
    if (data?.success && Array.isArray(data.data)) {
      const clean = sanitizeOrders(data.data)
      saveOrders(clean)
      syncAllApprovedQuotesToOrders()
      return getStoredOrders()
    }
  } catch (err) {
    console.warn('[Orders Service] API fetch fallback to local cache:', err.message)
  }
  return getStoredOrders()
}

export function getOrderById(orderId) {
  if (!orderId) return null
  const cleanId = String(orderId).trim().toLowerCase()
  const orders = getStoredOrders()
  const found = orders.find(
    (o) =>
      String(o._id).toLowerCase() === cleanId ||
      String(o.id).toLowerCase() === cleanId ||
      String(o.orderNumber || '').toLowerCase() === cleanId ||
      String(o.quoteNumber || '').toLowerCase() === cleanId
  )
  if (found) return found

  // Fallback check in quotes store
  const rawQuotes = getStoredQuotesRaw()
  const foundQuote = rawQuotes.find(
    (q) =>
      String(q._id).toLowerCase() === cleanId ||
      String(q.id).toLowerCase() === cleanId ||
      String(q.orderNumber || '').toLowerCase() === cleanId ||
      String(q.quoteNumber || '').toLowerCase() === cleanId
  )
  if (foundQuote) {
    return {
      _id: foundQuote._id || `ORD-${foundQuote.id}`,
      id: foundQuote.id,
      orderNumber: foundQuote.orderNumber || foundQuote.quoteNumber || `ONP-2026-${foundQuote.id}`,
      createdAt: foundQuote.createdAt,
      status: foundQuote.status || 'Pending',
      paymentStatus: 'Pending',
      currency: 'AED',
      customerName: foundQuote.name || 'Client',
      customerEmail: foundQuote.email || '',
      customerPhone: foundQuote.phone || '',
      company: foundQuote.company || '',
      productName: foundQuote.productName || 'Custom Print Job',
      quantity: Number(foundQuote.quantity) || 1,
      totalPrice: Number(foundQuote.totalPrice || 0),
      specs: foundQuote.specs || '',
      notes: foundQuote.notes || '',
      artworkFile: foundQuote.artworkFile || null,
      quoteNumber: foundQuote.quoteNumber || foundQuote.orderNumber,
      items: Array.isArray(foundQuote.items) && foundQuote.items.length > 0
        ? foundQuote.items
        : [
            {
              productName: foundQuote.productName || 'Custom Print Job',
              quantity: Number(foundQuote.quantity) || 1,
              unitPrice: foundQuote.totalPrice || 0,
              subtotal: foundQuote.totalPrice || 0,
            },
          ],
    }
  }

  return null
}

const RECENT_TRACKED_KEY = 'onprint_recent_tracked_orders'

export function getRecentTrackedOrders() {
  try {
    const raw = localStorage.getItem(RECENT_TRACKED_KEY)
    if (raw) return JSON.parse(raw) || []
  } catch {
    // ignore
  }
  return []
}

export function saveRecentTrackedOrder(order) {
  if (!order || !order.orderNumber) return
  try {
    const existing = getRecentTrackedOrders()
    const filtered = existing.filter((item) => item.orderNumber !== order.orderNumber)
    const itemToSave = {
      orderNumber: order.orderNumber,
      productName: order.productName || 'Custom Print Job',
      status: order.status || 'Pending',
      totalPrice: order.totalPrice || 0,
      createdAt: order.createdAt || new Date().toISOString(),
    }
    const updated = [itemToSave, ...filtered].slice(0, 5)
    localStorage.setItem(RECENT_TRACKED_KEY, JSON.stringify(updated))
  } catch {
    // ignore
  }
}

export async function trackOrder(query) {
  if (!query || !query.trim()) return null
  const clean = query.trim().toLowerCase()

  // 1. Check local order by ID / Order Number / Email / Phone
  const localOrders = getStoredOrders()
  let matched = localOrders.find(
    (o) =>
      String(o.orderNumber || '').toLowerCase() === clean ||
      String(o.quoteNumber || '').toLowerCase() === clean ||
      String(o._id || '').toLowerCase() === clean ||
      String(o.id || '').toLowerCase() === clean ||
      String(o.customerEmail || '').toLowerCase() === clean ||
      String(o.customerPhone || '').replace(/\D/g, '') === clean.replace(/\D/g, '') && clean.length > 5
  )

  // 2. Check local quotes
  if (!matched) {
    const rawQuotes = getStoredQuotesRaw()
    const matchedQuote = rawQuotes.find(
      (q) =>
        String(q.orderNumber || '').toLowerCase() === clean ||
        String(q.quoteNumber || '').toLowerCase() === clean ||
        String(q._id || '').toLowerCase() === clean ||
        String(q.id || '').toLowerCase() === clean ||
        String(q.email || '').toLowerCase() === clean ||
        String(q.phone || '').replace(/\D/g, '') === clean.replace(/\D/g, '') && clean.length > 5
    )

    if (matchedQuote) {
      matched = {
        _id: matchedQuote._id || `ORD-${matchedQuote.id}`,
        id: matchedQuote.id,
        orderNumber: matchedQuote.orderNumber || matchedQuote.quoteNumber || `ONP-2026-${matchedQuote.id}`,
        createdAt: matchedQuote.createdAt,
        status: matchedQuote.status || 'Pending',
        paymentStatus: 'Pending',
        currency: 'AED',
        customerName: matchedQuote.name || 'Client',
        customerEmail: matchedQuote.email || '',
        customerPhone: matchedQuote.phone || '',
        company: matchedQuote.company || '',
        productName: matchedQuote.productName || 'Custom Print Job',
        quantity: Number(matchedQuote.quantity) || 1,
        totalPrice: Number(matchedQuote.totalPrice || 0),
        specs: matchedQuote.specs || '',
        notes: matchedQuote.notes || '',
        artworkFile: matchedQuote.artworkFile || null,
        quoteNumber: matchedQuote.quoteNumber || matchedQuote.orderNumber,
        items: Array.isArray(matchedQuote.items) && matchedQuote.items.length > 0
          ? matchedQuote.items
          : [
              {
                productName: matchedQuote.productName || 'Custom Print Job',
                quantity: Number(matchedQuote.quantity) || 1,
                unitPrice: matchedQuote.totalPrice || 0,
                subtotal: matchedQuote.totalPrice || 0,
              },
            ],
      }
    }
  }

  // 3. Try backend API fetch if available
  try {
    const { data } = await api.get(`/orders/${encodeURIComponent(clean)}`)
    if (data?.success && data?.data) {
      matched = data.data
    }
  } catch {
    // offline or not found on server
  }

  if (matched) {
    saveRecentTrackedOrder(matched)
  }

  return matched
}

export async function updateOrderStatus(orderId, newStatus) {
  const current = getStoredOrders()
  const updated = current.map((order) =>
    order._id === orderId || order.id === orderId || order.orderNumber === orderId
      ? { ...order, status: newStatus }
      : order
  )
  saveOrders(updated)

  try {
    await api.put(`/orders/${orderId}/status`, { status: newStatus })
  } catch {
    // Graceful offline fallback
  }

  return updated
}

export function updateOrder(orderId, updatedFields) {
  const current = getStoredOrders()
  const updated = current.map((order) =>
    order._id === orderId || order.id === orderId || order.orderNumber === orderId
      ? { ...order, ...updatedFields }
      : order
  )
  saveOrders(updated)
  return updated
}

export async function deleteOrder(orderId) {
  const current = getStoredOrders()
  const updated = current.filter((o) => o._id !== orderId && o.id !== orderId && o.orderNumber !== orderId)
  saveOrders(updated)

  try {
    await api.delete(`/orders/${orderId}`)
  } catch {
    // offline fallback
  }

  return updated
}

export async function createOrder(orderData) {
  const current = getStoredOrders()
  const randomSeq = Math.floor(100000 + Math.random() * 900000)
  const newOrder = {
    _id: `ORD-${randomSeq}`,
    id: Date.now(),
    orderNumber: `ONP-2026-${randomSeq}`,
    createdAt: new Date().toISOString(),
    status: 'Pending',
    paymentStatus: 'Pending',
    currency: 'AED',
    totalPrice: Number(orderData.totalPrice || 0),
    ...orderData,
  }

  const updated = [newOrder, ...current]
  saveOrders(updated)

  try {
    const res = await api.post('/orders', {
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone || orderData.phone,
      company: orderData.company,
      notes: orderData.notes,
      specs: orderData.specs,
      artworkFile: orderData.artworkFile,
      productName: orderData.productName,
      quantity: orderData.quantity,
      totalPrice: Number(orderData.totalPrice || 0),
      items: [
        {
          productName: orderData.productName || 'Custom Print Job',
          quantity: orderData.quantity || 1,
          unitPrice: orderData.totalPrice ? Number(orderData.totalPrice) / (Number(orderData.quantity) || 1) : 0,
          subtotal: Number(orderData.totalPrice || 0),
        },
      ],
    })

    if (res.data?.success && res.data?.data?.orderNumber) {
      newOrder.orderNumber = res.data.data.orderNumber
      newOrder.id = res.data.data.id || newOrder.id
      saveOrders([newOrder, ...current])
    }
  } catch (err) {
    console.warn('[Orders Service] API post fallback to local persistence:', err.message)
  }

  return newOrder
}
