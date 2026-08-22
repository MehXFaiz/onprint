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

export function getStoredOrders() {
  try {
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
    const { data } = await api.get('/orders')
    if (data?.success && Array.isArray(data.data)) {
      const clean = sanitizeOrders(data.data)
      saveOrders(clean)
      return clean
    }
  } catch (err) {
    console.warn('[Orders Service] API fetch fallback to local cache:', err.message)
  }
  return getStoredOrders()
}

export function getOrderById(orderId) {
  const orders = getStoredOrders()
  return orders.find((o) => o._id === orderId || o.id === orderId || o.orderNumber === orderId) || null
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

export function deleteOrder(orderId) {
  const current = getStoredOrders()
  const updated = current.filter((o) => o._id !== orderId && o.id !== orderId && o.orderNumber !== orderId)
  saveOrders(updated)
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
