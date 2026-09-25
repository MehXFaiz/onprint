const fs = require('fs')
const path = require('path')

const STORE_PATH = path.join(__dirname, 'dbStore.json')

const { GEO_FAQS } = require('./geoFaqsData')
const { GEO_CONTENT_RECORDS } = require('./geoContentData')
const { DUBAI_AI_VISIBILITY_QUERIES } = require('./dubaiAiVisibilityData')

const DEFAULT_SEO_TASKS = [
  {
    id: 1,
    title: 'Review & optimize H2 topical depth for Business Cards Dubai',
    description: 'Ensure 350gsm, 450gsm, and 600gsm cotton and painted edge specs are clearly articulated in H2 subheadings for DIFC corporate search intent.',
    category: 'onpage',
    priority: 'high',
    status: 'pending',
    assigned_to: 'SEO Specialist',
    due_date: '2026-09-30',
    completed_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Submit updated XML sitemap to Google Search Console',
    description: 'Verify all 12 commercial Dubai landing pages and dynamic blog guides are submitted in sitemap.xml without 404 or redirect errors.',
    category: 'technical',
    priority: 'critical',
    status: 'completed',
    assigned_to: 'Technical Lead',
    due_date: '2026-09-25',
    completed_at: '2026-09-21T18:00:00.000Z',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Audit striking distance queries (Positions 4–10) for CTR click-triggers',
    description: 'Update meta title tags for queries ranking 4–10 by testing click triggers such as "Same-Day Dubai", "Free Sample Box", and "Al Quoz Direct Press".',
    category: 'onpage',
    priority: 'high',
    status: 'in_progress',
    assigned_to: 'SEO Specialist',
    due_date: '2026-10-05',
    completed_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Verify LocalBusiness JSON-LD Schema NAP consistency',
    description: 'Confirm Al Quoz Industrial Area 3 street address, phone (+971 55 183 7995), coordinates, and opening hours match Google Business Profile perfectly.',
    category: 'schema',
    priority: 'high',
    status: 'completed',
    assigned_to: 'Technical Lead',
    due_date: '2026-09-22',
    completed_at: '2026-09-22T08:00:00.000Z',
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    title: 'Outreach to Dubai Chamber & verified UAE B2B directories',
    description: 'Submit legitimate business profile to Dubai Chamber Member Directory and UAE Industrial Portal under Commercial Printing & Packaging.',
    category: 'backlinks',
    priority: 'medium',
    status: 'pending',
    assigned_to: 'Outreach Coordinator',
    due_date: '2026-10-15',
    completed_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    title: 'Monitor ChatGPT and Perplexity citations for "business card printing dubai"',
    description: 'Run weekly AI engine visibility probes to track whether ONPRINT is referenced as a verified local Al Quoz printing press.',
    category: 'geo',
    priority: 'medium',
    status: 'in_progress',
    assigned_to: 'GEO Lead',
    due_date: '2026-10-01',
    completed_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    title: 'Add contextual internal links from blog guides to money pages',
    description: 'Link "How to Choose Business Card Paper" to /business-card-printing-dubai and "Packaging Finishes Guide" to /packaging-printing-dubai.',
    category: 'content',
    priority: 'high',
    status: 'pending',
    assigned_to: 'Content Editor',
    due_date: '2026-10-02',
    completed_at: null,
    created_at: new Date().toISOString(),
  },
]

function loadStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf8')
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed.geo_faqs) || parsed.geo_faqs.length === 0) {
        parsed.geo_faqs = [...GEO_FAQS]
      }
      if (!Array.isArray(parsed.geo_content) || parsed.geo_content.length === 0) {
        parsed.geo_content = [...GEO_CONTENT_RECORDS]
      }
      if (!Array.isArray(parsed.ai_visibility) || parsed.ai_visibility.length === 0) {
        parsed.ai_visibility = [...DUBAI_AI_VISIBILITY_QUERIES]
      }
      if (!Array.isArray(parsed.seo_tasks) || parsed.seo_tasks.length === 0) {
        parsed.seo_tasks = [...DEFAULT_SEO_TASKS]
      }
      return parsed
    }
  } catch (err) {
    console.warn('[PersistentStore] Read error, resetting:', err.message)
  }
  return {
    orders: [],
    quotes: [],
    messages: [],
    blogs: [],
    geo_faqs: [...GEO_FAQS],
    geo_content: [...GEO_CONTENT_RECORDS],
    ai_visibility: [...DUBAI_AI_VISIBILITY_QUERIES],
    citation_logs: [],
    seo_tasks: [...DEFAULT_SEO_TASKS],
  }
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
  const clean = String(id).trim().toLowerCase()
  store.orders = (store.orders || []).filter(
    (o) => String(o.id).toLowerCase() !== clean && String(o.orderNumber || '').toLowerCase() !== clean && String(o._id || '').toLowerCase() !== clean
  )
  saveStore(store)
  return true
}

function deleteOrders(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return true
  const store = loadStore()
  const cleanSet = new Set(ids.map((id) => String(id).trim().toLowerCase()))
  store.orders = (store.orders || []).filter((o) => {
    const idStr = String(o.id).toLowerCase()
    const numStr = String(o.orderNumber || '').toLowerCase()
    const uidStr = String(o._id || '').toLowerCase()
    return !cleanSet.has(idStr) && !cleanSet.has(numStr) && !cleanSet.has(uidStr)
  })
  saveStore(store)
  return true
}

function deleteQuote(id) {
  const store = loadStore()
  const clean = String(id).trim().toLowerCase()
  store.quotes = (store.quotes || []).filter(
    (q) => String(q.id).toLowerCase() !== clean && String(q.quoteNumber || '').toLowerCase() !== clean && String(q._id || '').toLowerCase() !== clean
  )
  saveStore(store)
  return true
}

function deleteQuotes(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return true
  const store = loadStore()
  const cleanSet = new Set(ids.map((id) => String(id).trim().toLowerCase()))
  store.quotes = (store.quotes || []).filter((q) => {
    const idStr = String(q.id).toLowerCase()
    const numStr = String(q.quoteNumber || '').toLowerCase()
    const uidStr = String(q._id || '').toLowerCase()
    return !cleanSet.has(idStr) && !cleanSet.has(numStr) && !cleanSet.has(uidStr)
  })
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

function getBlogs() {
  const store = loadStore()
  return Array.isArray(store.blogs) ? store.blogs : []
}

function getBlog(id) {
  const store = loadStore()
  const blogs = Array.isArray(store.blogs) ? store.blogs : []
  const clean = String(id).trim().toLowerCase()
  return blogs.find((b) => String(b.id).toLowerCase() === clean || String(b._id || '').toLowerCase() === clean) || null
}

function getBlogBySlug(slug) {
  const store = loadStore()
  const blogs = Array.isArray(store.blogs) ? store.blogs : []
  const clean = String(slug).trim().toLowerCase()
  return blogs.find((b) => String(b.slug).toLowerCase() === clean || String(b.id).toLowerCase() === clean || String(b._id || '').toLowerCase() === clean) || null
}

function addBlog(blogData) {
  const store = loadStore()
  if (!Array.isArray(store.blogs)) store.blogs = []
  const id = store.blogs.length > 0 ? Math.max(...store.blogs.map((b) => Number(b.id) || 0)) + 1 : 1
  const newBlog = {
    id,
    _id: `blog-${id}`,
    title: blogData.title || 'Untitled Article',
    slug: blogData.slug || `article-${id}`,
    excerpt: blogData.excerpt || '',
    content: blogData.content || '',
    featured_image: blogData.featured_image || blogData.featuredImage || '/assets/products/1 (1).jpg',
    image_alt: blogData.image_alt || blogData.imageAlt || blogData.title || '',
    category_id: blogData.category_id ? Number(blogData.category_id) : null,
    product_id: blogData.product_id ? Number(blogData.product_id) : null,
    author_id: blogData.author_id ? Number(blogData.author_id) : null,
    author_name: blogData.author_name || blogData.author || 'ONPRINT Editorial Team',
    status: blogData.status || 'draft',
    is_featured: blogData.is_featured ? 1 : 0,
    seo_title: blogData.seo_title || blogData.seoTitle || `${blogData.title} | ONPRINT Dubai`,
    meta_description: blogData.meta_description || blogData.seoDescription || blogData.excerpt || '',
    focus_keyword: blogData.focus_keyword || blogData.seoKeywords || '',
    secondary_keywords: blogData.secondary_keywords || '',
    canonical_url: blogData.canonical_url || `https://0nprint.com/blog/${blogData.slug || id}`,
    og_title: blogData.og_title || blogData.seo_title || blogData.title,
    og_description: blogData.og_description || blogData.meta_description || blogData.excerpt || '',
    og_image: blogData.og_image || blogData.featured_image || '/assets/products/1 (1).jpg',
    schema_type: blogData.schema_type || 'BlogPosting',
    reading_time: Number(blogData.reading_time) || 3,
    target_location: blogData.target_location || null,
    published_at: blogData.published_at || new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  store.blogs.unshift(newBlog)
  saveStore(store)
  return newBlog
}

function updateBlog(id, blogData) {
  const store = loadStore()
  if (!Array.isArray(store.blogs)) return null
  const clean = String(id).trim().toLowerCase()
  const idx = store.blogs.findIndex((b) => String(b.id).toLowerCase() === clean || String(b._id || '').toLowerCase() === clean)
  if (idx === -1) return null

  store.blogs[idx] = {
    ...store.blogs[idx],
    ...blogData,
    id: store.blogs[idx].id,
    _id: store.blogs[idx]._id,
    updated_at: new Date().toISOString(),
  }
  saveStore(store)
  return store.blogs[idx]
}

function deleteBlog(id) {
  const store = loadStore()
  if (!Array.isArray(store.blogs)) return true
  const clean = String(id).trim().toLowerCase()
  store.blogs = store.blogs.filter((b) => String(b.id).toLowerCase() !== clean && String(b._id || '').toLowerCase() !== clean)
  saveStore(store)
  return true
}

function deleteBlogs(ids) {
  const store = loadStore()
  if (!Array.isArray(store.blogs) || !Array.isArray(ids)) return true
  const idSet = new Set(ids.map((id) => String(id).toLowerCase().trim()))
  store.blogs = store.blogs.filter(
    (b) => !idSet.has(String(b.id).toLowerCase()) && !idSet.has(String(b._id || '').toLowerCase())
  )
  saveStore(store)
  return true
}

function getGeoFaqs(filter = {}) {
  const store = loadStore()
  let list = store.geo_faqs || []
  if (filter.category && filter.category !== 'All') {
    list = list.filter((f) => String(f.category).toLowerCase() === String(filter.category).toLowerCase())
  }
  if (filter.status && filter.status !== 'All') {
    list = list.filter((f) => String(f.status).toLowerCase() === String(filter.status).toLowerCase())
  }
  if (filter.search) {
    const s = String(filter.search).toLowerCase()
    list = list.filter(
      (f) =>
        String(f.question || '').toLowerCase().includes(s) ||
        String(f.answer || '').toLowerCase().includes(s) ||
        String(f.related_service || '').toLowerCase().includes(s) ||
        String(f.related_keyword || '').toLowerCase().includes(s)
    )
  }
  return list
}

function getGeoFaqsByUrl(url) {
  const store = loadStore()
  const list = store.geo_faqs || []
  const cleanUrl = String(url || '').toLowerCase().trim()
  return list.filter((f) => {
    if (!f.target_url) return false
    const u = String(f.target_url).toLowerCase()
    return u.endsWith(cleanUrl) || u.includes(cleanUrl)
  })
}

function addGeoFaq(data) {
  const store = loadStore()
  const id = (store.geo_faqs && store.geo_faqs.length > 0 ? Math.max(...store.geo_faqs.map((f) => Number(f.id) || 0)) : 0) + 1
  const newFaq = {
    id,
    question: data.question || '',
    answer: data.answer || '',
    category: data.category || 'General',
    related_service: data.related_service || null,
    related_keyword: data.related_keyword || null,
    target_url: data.target_url || null,
    search_intent: data.search_intent || 'Commercial',
    status: data.status || 'published',
    published_at: data.published_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  store.geo_faqs.unshift(newFaq)
  saveStore(store)
  return newFaq
}

function updateGeoFaq(id, data) {
  const store = loadStore()
  const idx = store.geo_faqs.findIndex((f) => String(f.id) === String(id))
  if (idx === -1) return null
  store.geo_faqs[idx] = {
    ...store.geo_faqs[idx],
    ...data,
    id: store.geo_faqs[idx].id,
    updated_at: new Date().toISOString(),
  }
  saveStore(store)
  return store.geo_faqs[idx]
}

function deleteGeoFaq(id) {
  const store = loadStore()
  store.geo_faqs = store.geo_faqs.filter((f) => String(f.id) !== String(id))
  saveStore(store)
  return true
}

function getGeoContent(filter = {}) {
  const store = loadStore()
  let list = store.geo_content || []
  if (filter.status && filter.status !== 'All') {
    list = list.filter((c) => String(c.status).toLowerCase() === String(filter.status).toLowerCase())
  }
  if (filter.search) {
    const s = String(filter.search).toLowerCase()
    list = list.filter(
      (c) =>
        String(c.topic || '').toLowerCase().includes(s) ||
        String(c.question || '').toLowerCase().includes(s) ||
        String(c.answer || '').toLowerCase().includes(s) ||
        String(c.target_keyword || '').toLowerCase().includes(s)
    )
  }
  return list
}

function addGeoContent(data) {
  const store = loadStore()
  const id = (store.geo_content && store.geo_content.length > 0 ? Math.max(...store.geo_content.map((c) => Number(c.id) || 0)) : 0) + 1
  const newContent = {
    id,
    topic: data.topic || '',
    question: data.question || '',
    answer: data.answer || '',
    target_keyword: data.target_keyword || null,
    entity: data.entity || 'ONPRINT',
    target_url: data.target_url || null,
    related_service: data.related_service || null,
    faq: data.faq !== undefined ? Number(data.faq) : 1,
    source: data.source || 'ONPRINT Pressroom Operations Manual',
    author: data.author || 'ONPRINT Technical Team',
    status: data.status || 'published',
    published_at: data.published_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  store.geo_content.unshift(newContent)
  saveStore(store)
  return newContent
}

function updateGeoContent(id, data) {
  const store = loadStore()
  const idx = store.geo_content.findIndex((c) => String(c.id) === String(id))
  if (idx === -1) return null
  store.geo_content[idx] = {
    ...store.geo_content[idx],
    ...data,
    id: store.geo_content[idx].id,
    updated_at: new Date().toISOString(),
  }
  saveStore(store)
  return store.geo_content[idx]
}

function deleteGeoContent(id) {
  const store = loadStore()
  store.geo_content = store.geo_content.filter((c) => String(c.id) !== String(id))
  saveStore(store)
  return true
}

function getAiVisibilityList() {
  const store = loadStore()
  return store.ai_visibility || []
}

function updateAiVisibilityItem(id, data) {
  const store = loadStore()
  const idx = store.ai_visibility.findIndex((item) => String(item.id) === String(id))
  if (idx === -1) return null
  store.ai_visibility[idx] = {
    ...store.ai_visibility[idx],
    ...data,
    id: store.ai_visibility[idx].id,
    last_tested: data.last_tested || new Date().toISOString().split('T')[0],
  }
  saveStore(store)
  return store.ai_visibility[idx]
}

function getCitationLogs() {
  const store = loadStore()
  return store.citation_logs || []
}

function addCitationLog(data) {
  const store = loadStore()
  const id = Date.now().toString()
  const newLog = {
    id,
    query: data.query || '',
    date_checked: data.date_checked || new Date().toISOString().split('T')[0],
    platform: data.platform || 'ChatGPT Search',
    onprint_mentioned: Boolean(data.onprint_mentioned),
    onprint_url: data.onprint_url || null,
    citation_source: data.citation_source || null,
    competitors_mentioned: data.competitors_mentioned || [],
    notes: data.notes || '',
    created_at: new Date().toISOString(),
  }
  store.citation_logs.unshift(newLog)
  saveStore(store)
  return newLog
}

function getSeoTasks(filter = {}) {
  const store = loadStore()
  let list = store.seo_tasks || []
  if (filter.category && filter.category !== 'All') {
    list = list.filter((t) => String(t.category).toLowerCase() === String(filter.category).toLowerCase())
  }
  if (filter.priority && filter.priority !== 'All') {
    list = list.filter((t) => String(t.priority).toLowerCase() === String(filter.priority).toLowerCase())
  }
  if (filter.status && filter.status !== 'All') {
    list = list.filter((t) => String(t.status).toLowerCase() === String(filter.status).toLowerCase())
  }
  if (filter.search) {
    const s = String(filter.search).toLowerCase()
    list = list.filter(
      (t) =>
        String(t.title || '').toLowerCase().includes(s) ||
        String(t.description || '').toLowerCase().includes(s) ||
        String(t.assigned_to || '').toLowerCase().includes(s)
    )
  }
  return list
}

function addSeoTask(data) {
  const store = loadStore()
  const id = (store.seo_tasks && store.seo_tasks.length > 0 ? Math.max(...store.seo_tasks.map((t) => Number(t.id) || 0)) : 0) + 1
  const newTask = {
    id,
    title: data.title || 'Untitled Task',
    description: data.description || '',
    category: data.category || 'onpage',
    priority: data.priority || 'medium',
    status: data.status || 'pending',
    assigned_to: data.assigned_to || 'Admin',
    due_date: data.due_date || null,
    completed_at: data.status === 'completed' ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  store.seo_tasks.unshift(newTask)
  saveStore(store)
  return newTask
}

function updateSeoTask(id, data) {
  const store = loadStore()
  const idx = store.seo_tasks.findIndex((t) => String(t.id) === String(id))
  if (idx === -1) return null
  const oldTask = store.seo_tasks[idx]
  let completed_at = oldTask.completed_at
  if (data.status === 'completed' && oldTask.status !== 'completed') {
    completed_at = new Date().toISOString()
  } else if (data.status && data.status !== 'completed') {
    completed_at = null
  }
  store.seo_tasks[idx] = {
    ...oldTask,
    ...data,
    id: oldTask.id,
    completed_at,
    updated_at: new Date().toISOString(),
  }
  saveStore(store)
  return store.seo_tasks[idx]
}

function deleteSeoTask(id) {
  const store = loadStore()
  store.seo_tasks = store.seo_tasks.filter((t) => String(t.id) !== String(id))
  saveStore(store)
  return true
}

module.exports = {
  getOrders,
  addOrder,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  deleteOrders,
  getQuotes,
  addQuote,
  getQuote,
  updateQuoteStatus,
  updateQuote,
  deleteQuote,
  deleteQuotes,
  syncQuoteToOrder,
  getMessages,
  addMessage,
  updateMessageStatus,
  deleteMessage,
  getBlogs,
  getBlog,
  getBlogBySlug,
  addBlog,
  updateBlog,
  deleteBlog,
  deleteBlogs,
  getGeoFaqs,
  getGeoFaqsByUrl,
  addGeoFaq,
  updateGeoFaq,
  deleteGeoFaq,
  getGeoContent,
  addGeoContent,
  updateGeoContent,
  deleteGeoContent,
  getAiVisibilityList,
  updateAiVisibilityItem,
  getCitationLogs,
  addCitationLog,
  getSeoTasks,
  addSeoTask,
  updateSeoTask,
  deleteSeoTask,
}
