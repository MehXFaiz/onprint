const ORDERS_STORAGE_KEY = 'onprint_admin_orders'

export const initialOrders = [
  {
    _id: 'ORD-9821',
    orderNumber: 'ONP-2026-9821',
    customerName: 'Sarah Al-Maktoum',
    customerEmail: 'client@onprint.ae',
    company: 'Dubai Luxury Gifts LLC',
    phone: '+971 50 123 4567',
    productName: 'Custom Water Bottles Printing in Dubai',
    quantity: 100,
    totalPrice: 5500,
    status: 'In Production',
    paymentStatus: 'Paid',
    createdAt: '2026-08-14T10:30:00Z',
    specs: '500ml Stainless Steel Vacuum Flask, Matt Black with Gold Foil UV Logo',
    artworkFile: 'water_bottle_artwork_v2.pdf',
    deliveryAddress: 'Business Bay, Tower B, Level 14, Dubai, UAE',
  },
  {
    _id: 'ORD-9820',
    orderNumber: 'ONP-2026-9820',
    customerName: 'Ahmed Al-Mansoori',
    customerEmail: 'ahmed@emiratesholding.ae',
    company: 'Emirates Holdings',
    phone: '+971 52 987 6543',
    productName: 'Executive Business Stationery',
    quantity: 500,
    totalPrice: 3200,
    status: 'Pending',
    paymentStatus: 'Pending',
    createdAt: '2026-08-15T09:15:00Z',
    specs: '350gsm Cotton Card Stock, Soft-touch Laminate with Gold Foil Embossing',
    artworkFile: 'business_card_vector_cmyk.ai',
    deliveryAddress: 'DIFC Gate Precinct 4, Dubai, UAE',
  },
  {
    _id: 'ORD-9819',
    orderNumber: 'ONP-2026-9819',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@artisanboutique.ae',
    company: 'Artisan Boutique',
    phone: '+971 55 444 3322',
    productName: 'Luxury Packaging & Custom Boxes',
    quantity: 250,
    totalPrice: 7800,
    status: 'Dispatched',
    paymentStatus: 'Paid',
    createdAt: '2026-08-12T14:20:00Z',
    specs: 'Magnetic Closure Rigid Gift Box, Velvet Tray Interior, Debossed Logo',
    artworkFile: 'box_dieline_final.pdf',
    deliveryAddress: 'Dubai Design District (d3), Building 7, Dubai, UAE',
  },
  {
    _id: 'ORD-9818',
    orderNumber: 'ONP-2026-9818',
    customerName: 'Tariq Hassan',
    customerEmail: 'tariq@gulfevents.ae',
    company: 'Gulf Events Management',
    phone: '+971 50 888 1122',
    productName: 'Roll-up Printing Dubai',
    quantity: 10,
    totalPrice: 1800,
    status: 'Delivered',
    paymentStatus: 'Paid',
    createdAt: '2026-08-10T11:00:00Z',
    specs: '85x200cm Aluminum Luxury Stand, Anti-curl PET Film, High Resolution UV',
    artworkFile: 'rollup_stand_banner_85x200.pdf',
    deliveryAddress: 'DWTC Exhibition Center, Hall 4, Dubai, UAE',
  },
  {
    _id: 'ORD-9817',
    orderNumber: 'ONP-2026-9817',
    customerName: 'Jessica Taylor',
    customerEmail: 'jessica@apexmedia.com',
    company: 'Apex Media Agency',
    phone: '+971 56 777 2211',
    productName: 'Stickers Printing Dubai',
    quantity: 2000,
    totalPrice: 1200,
    status: 'In Production',
    paymentStatus: 'Paid',
    createdAt: '2026-08-13T16:45:00Z',
    specs: 'Waterproof Vinyl Die-Cut Stickers, Gloss UV Finish, Roll Format',
    artworkFile: 'stickers_diecut_master.png',
    deliveryAddress: 'Media City, Building 9, Dubai, UAE',
  },
]

export function getStoredOrders() {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // fallback
  }
  return initialOrders
}

export function saveOrders(orders) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  } catch {
    // ignore
  }
}

export function updateOrderStatus(orderId, newStatus) {
  const current = getStoredOrders()
  const updated = current.map((order) =>
    order._id === orderId ? { ...order, status: newStatus } : order
  )
  saveOrders(updated)
  return updated
}

export function createOrder(orderData) {
  const current = getStoredOrders()
  const newOrder = {
    _id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    orderNumber: `ONP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: 'Pending',
    paymentStatus: 'Pending',
    ...orderData,
  }
  const updated = [newOrder, ...current]
  saveOrders(updated)
  return newOrder
}
