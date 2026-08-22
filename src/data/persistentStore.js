const fs = require('fs')
const path = require('path')

const STORE_PATH = path.join(__dirname, 'dbStore.json')

function loadStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf8')
      return JSON.parse(raw)
    }
  } catch (err) {
    console.warn('[PersistentStore] Read error, resetting:', err.message)
  }
  return { orders: [], quotes: [], messages: [] }
}

function saveStore(data) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8')
  } catch (err) {
    console.error('[PersistentStore] Write error:', err.message)
  }
}

function syncQuoteToOrder(quote, store) {
  if (!quote || (quote.status || '').toLowerCase() !== 'approved') return
  const existingOrder = store.orders.find(
    (o) => o.quoteNumber === quote.quoteNumber || o.quoteId === quote.id || o.notes?.includes(quote.quoteNumber)
  )
  if (!existingOrder) {
    const year = new Date().getFullYear()
    const randomSeq = Math.floor(100000 + Math.random() * 900000)
    const orderNumber = `ONP-${year}-${randomSeq}`
    const id = store.orders.length > 0 ? Math.max(...store.orders.map((o) => o.id || 0)) + 1 : 1

    const newOrder = {
      _id: `ord-${id}`,
      id,
      orderNumber,
      customerName: quote.name || 'Client',
      customerEmail: quote.email || '',
      customerPhone: quote.phone || null,
      company: quote.company || null,
      status: 'Pending',
      subtotal: Number(quote.totalPrice || 0),
      tax: 0,
      shipping: 0,
      totalPrice: Number(quote.totalPrice || 0),
      currency: 'AED',
      notes: quote.notes ? `${quote.notes} (Approved Quote ${quote.quoteNumber})` : `Approved Quote ${quote.quoteNumber}`,
      specs: quote.specs || null,
      artworkFile: quote.artworkFile || null,
      quoteNumber: quote.quoteNumber,
      quoteId: quote.id,
      createdAt: new Date().toISOString(),
      productName: quote.productName || quote.items?.[0]?.productName || 'Custom Print Job',
      items: quote.items && quote.items.length > 0 ? quote.items : [
        {
          productName: quote.productName || 'Custom Print Job',
          quantity: quote.quantity || 1,
          unitPrice: quote.totalPrice || 0,
          subtotal: quote.totalPrice || 0,
        },
      ],
    }
    store.orders.unshift(newOrder)
  }
}

function getOrders() {
  const store = loadStore()
  let modified = false
  if (Array.isArray(store.quotes)) {
    store.quotes.forEach((q) => {
      if ((q.status || '').toLowerCase() === 'approved') {
        const hasOrder = store.orders.some(
          (o) => o.quoteNumber === q.quoteNumber || o.quoteId === q.id || o.notes?.includes(q.quoteNumber)
        )
        if (!hasOrder) {
          syncQuoteToOrder(q, store)
          modified = true
        }
      }
    })
  }
  if (modified) {
    saveStore(store)
  }
  return store.orders || []
}

function addOrder(orderData) {
  const store = loadStore()
  const year = new Date().getFullYear()
  const randomSeq = Math.floor(100000 + Math.random() * 900000)
  const orderNumber = orderData.orderNumber || `ORD-${year}-${randomSeq}`
  const id = store.orders.length > 0 ? Math.max(...store.orders.map((o) => o.id || 0)) + 1 : 1

  const newOrder = {
    _id: `ord-${id}`,
    id,
    orderNumber,
    customerName: orderData.customerName || orderData.name || 'Client',
    customerEmail: orderData.customerEmail || orderData.email || '',
    customerPhone: orderData.customerPhone || orderData.phone || null,
    company: orderData.company || null,
    status: orderData.status || 'Pending',
    subtotal: Number(orderData.subtotal || orderData.totalPrice || 0),
    tax: Number(orderData.tax || 0),
    shipping: Number(orderData.shipping || 0),
    totalPrice: Number(orderData.totalPrice || orderData.totalAmount || 0),
    currency: orderData.currency || 'AED',
    notes: orderData.notes || null,
    specs: orderData.specs || null,
    artworkFile: orderData.artworkFile || null,
    quoteNumber: orderData.quoteNumber || null,
    quoteId: orderData.quoteId || null,
    createdAt: orderData.createdAt || new Date().toISOString(),
    productName: orderData.productName || orderData.items?.[0]?.productName || 'Printing Order',
    items: orderData.items || [
      {
        productName: orderData.productName || 'Printing Order',
        quantity: orderData.quantity || 1,
        unitPrice: orderData.totalPrice || 0,
        subtotal: orderData.totalPrice || 0,
      },
    ],
  }

  store.orders.unshift(newOrder)
  saveStore(store)
  return newOrder
}

function getOrder(id) {
  if (!id) return null
  const store = loadStore()
  const clean = String(id).trim().toLowerCase()
  const found = store.orders.find(
    (o) =>
      String(o.id).toLowerCase() === clean ||
      String(o.orderNumber || '').toLowerCase() === clean ||
      String(o._id || '').toLowerCase() === clean ||
      String(o.quoteNumber || '').toLowerCase() === clean ||
      String(o.customerEmail || '').toLowerCase() === clean ||
      (o.customerPhone && String(o.customerPhone).replace(/\D/g, '') === clean.replace(/\D/g, '') && clean.length > 5)
  )
  if (found) return found

  const foundQuote = (store.quotes || []).find(
    (q) =>
      String(q.id).toLowerCase() === clean ||
      String(q.quoteNumber || '').toLowerCase() === clean ||
      String(q.orderNumber || '').toLowerCase() === clean ||
      String(q._id || '').toLowerCase() === clean ||
      String(q.email || '').toLowerCase() === clean ||
      (q.phone && String(q.phone).replace(/\D/g, '') === clean.replace(/\D/g, '') && clean.length > 5)
  )

  if (foundQuote) {
    return {
      _id: foundQuote._id || `ord-${foundQuote.id}`,
      id: foundQuote.id,
      orderNumber: foundQuote.orderNumber || foundQuote.quoteNumber || `ONP-2026-${foundQuote.id}`,
      customerName: foundQuote.name || 'Client',
      customerEmail: foundQuote.email || '',
      customerPhone: foundQuote.phone || null,
      company: foundQuote.company || null,
      status: foundQuote.status || 'Pending',
      subtotal: Number(foundQuote.totalPrice || 0),
      tax: 0,
      shipping: 0,
      totalPrice: Number(foundQuote.totalPrice || 0),
      currency: 'AED',
      notes: foundQuote.notes || '',
      specs: foundQuote.specs || null,
      artworkFile: foundQuote.artworkFile || null,
      quoteNumber: foundQuote.quoteNumber,
      createdAt: foundQuote.createdAt,
      productName: foundQuote.productName || 'Custom Print Job',
      items: Array.isArray(foundQuote.items) && foundQuote.items.length > 0 ? foundQuote.items : [
        {
          productName: foundQuote.productName || 'Custom Print Job',
          quantity: foundQuote.quantity || 1,
          unitPrice: foundQuote.totalPrice || 0,
          subtotal: foundQuote.totalPrice || 0,
        }
      ],
    }
  }

  return null
}

function updateOrderStatus(id, status) {
  const store = loadStore()
  const clean = String(id).trim().toLowerCase()
  const order = store.orders.find((o) => String(o.id).toLowerCase() === clean || String(o.orderNumber || '').toLowerCase() === clean || String(o._id || '').toLowerCase() === clean)
  if (order) {
    order.status = status
    order.updatedAt = new Date().toISOString()
    saveStore(store)
    return order
  }
  return null
}

function getQuotes() {
  const store = loadStore()
  return store.quotes || []
}

function addQuote(quoteData) {
  const store = loadStore()
  const year = new Date().getFullYear()
  const randomSeq = Math.floor(100000 + Math.random() * 900000)
  const orderNumber = quoteData.orderNumber || quoteData.quoteNumber || `ONP-${year}-${randomSeq}`
  const quoteNumber = orderNumber
  const id = store.quotes.length > 0 ? Math.max(...store.quotes.map((q) => q.id || 0)) + 1 : 1

  const newQuote = {
    _id: `qt-${id}`,
    id,
    orderNumber,
    quoteNumber,
    name: quoteData.name || 'Client',
    email: quoteData.email || '',
    phone: quoteData.phone || null,
    company: quoteData.company || null,
    notes: quoteData.notes || null,
    status: quoteData.status || 'Pending',
    totalPrice: Number(quoteData.totalPrice || 0),
    specs: quoteData.specs || null,
    artworkFile: quoteData.artworkFile || null,
    createdAt: quoteData.createdAt || new Date().toISOString(),
    productName: quoteData.productName || quoteData.items?.[0]?.productName || 'Custom Print Job',
    items: quoteData.items || [],
  }

  store.quotes.unshift(newQuote)
  if ((newQuote.status || '').toLowerCase() === 'approved') {
    syncQuoteToOrder(newQuote, store)
  }
  saveStore(store)
  return newQuote
}

function getQuote(id) {
  const store = loadStore()
  return store.quotes.find((q) => String(q.id) === String(id) || q.quoteNumber === id || q._id === id) || null
}

function updateQuoteStatus(id, status) {
  const store = loadStore()
  const quote = store.quotes.find((q) => String(q.id) === String(id) || q.quoteNumber === id || q._id === id)
  if (quote) {
    quote.status = status
    quote.updatedAt = new Date().toISOString()
    if ((status || '').toLowerCase() === 'approved') {
      syncQuoteToOrder(quote, store)
    }
    saveStore(store)
    return quote
  }
  return null
}

function updateQuote(id, updatedData) {
  const store = loadStore()
  const quote = store.quotes.find((q) => String(q.id) === String(id) || q.quoteNumber === id || q._id === id)
  if (quote) {
    Object.assign(quote, updatedData)
    quote.updatedAt = new Date().toISOString()
    if ((quote.status || '').toLowerCase() === 'approved') {
      syncQuoteToOrder(quote, store)
    }
    saveStore(store)
    return quote
  }
  return null
}

function deleteOrder(id) {
  const store = loadStore()
  store.orders = store.orders.filter((o) => String(o.id) !== String(id) && o.orderNumber !== id && o._id !== id)
  saveStore(store)
  return true
}

function getMessages() {
  const store = loadStore()
  return store.messages || []
}

function addMessage(msgData) {
  const store = loadStore()
  if (!store.messages) store.messages = []
  const id = store.messages.length > 0 ? Math.max(...store.messages.map((m) => m.id || 0)) + 1 : 1

  const newMessage = {
    _id: `msg-${id}`,
    id,
    name: msgData.name || 'Anonymous',
    email: msgData.email || '',
    phone: msgData.phone || null,
    company: msgData.company || null,
    subject: msgData.subject || 'Direct Studio Inquiry',
    message: msgData.message || '',
    status: msgData.status || 'unread',
    createdAt: msgData.createdAt || new Date().toISOString(),
  }

  store.messages.unshift(newMessage)
  saveStore(store)
  return newMessage
}

function updateMessageStatus(id, status) {
  const store = loadStore()
  if (!store.messages) return null
  const clean = String(id).trim().toLowerCase()
  const msg = store.messages.find((m) => String(m.id).toLowerCase() === clean || String(m._id || '').toLowerCase() === clean)
  if (msg) {
    msg.status = status
    msg.updatedAt = new Date().toISOString()
    saveStore(store)
    return msg
  }
  return null
}

function deleteMessage(id) {
  const store = loadStore()
  if (!store.messages) return true
  const clean = String(id).trim().toLowerCase()
  store.messages = store.messages.filter((m) => String(m.id).toLowerCase() !== clean && String(m._id || '').toLowerCase() !== clean)
  saveStore(store)
  return true
}

module.exports = {
  getOrders,
  addOrder,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  getQuotes,
  addQuote,
  getQuote,
  updateQuoteStatus,
  updateQuote,
  deleteQuote,
  syncQuoteToOrder,
  getMessages,
  addMessage,
  updateMessageStatus,
  deleteMessage,
}
