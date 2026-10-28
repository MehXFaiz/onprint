import api from './api'
import { DEFAULT_BLOG_GUIDES } from '../data/defaultBlogGuides'

export { DEFAULT_BLOG_GUIDES }

const BLOGS_STORAGE_KEY = 'onprint_admin_blogs_v2'

/**
 * Prioritized Editorial Drafts Created for Admin Review Before Publication (Section 5)
 * Each targets a distinct commercial/comparison search intent and links to target product pages + WhatsApp (+447344546056).
 */
export const DEFAULT_EDITORIAL_DRAFTS = [
  {
    id: 201,
    slug: 'corporate-mugs-vs-insulated-water-bottles-gifting-dubai',
    title: 'Custom Branded Ceramic Mugs vs Insulated Stainless Steel Flasks: Corporate Gifting Guide for Dubai Teams',
    excerpt: 'Compare custom sublimated/UV ceramic mugs and laser-engraved 304 stainless steel thermal flasks for employee onboarding kits, DWTC exhibition giveaways, and VIP corporate gifts in Dubai.',
    category: 'Corporate Gifting & Drinkware',
    categoryData: { name: 'Mug Printing Dubai', slug: 'mug-printing-dubai' },
    productData: { name: 'Executive Matte Ceramic Mugs', slug: 'executive-matte-black-mugs' },
    author: 'ONPRINT Corporate Merchandise Desk',
    author_name: 'ONPRINT Corporate Merchandise Desk',
    status: 'draft',
    seoReviewStatus: 'needs_review',
    published_at: null,
    reading_time: '7 min read',
    word_count: 1480,
    featured_image: '/uploads/categories/mug-printing-dubai.jpg',
    image_alt: 'Custom branded corporate ceramic mugs and laser engraved thermal water bottles in Dubai',
    meta_title: 'Custom Corporate Mugs vs Insulated Water Bottles Dubai Guide | ONPRINT',
    meta_description: 'Compare custom printed ceramic mugs and laser-engraved thermal flasks for Dubai corporate gifting. MOQ, print durability, unit cost, and UAE delivery.',
    focus_keyword: 'corporate mugs vs water bottles dubai',
    secondary_keywords: 'custom mug printing dubai, branded water bottles uae, employee onboarding gift items dubai',
    canonical_url: 'https://www.0nprint.com/blog/corporate-mugs-vs-insulated-water-bottles-gifting-dubai',
    faqs: [
      {
        question: 'Which is more durable for daily corporate use: UV printing or laser engraving on drinkware?',
        answer: 'On stainless steel thermal flasks, fiber laser engraving permanently etches your logo into the metal and never peels. On ceramic mugs, high-temperature dye sublimation and cured 3D UV printing provide dishwasher-safe longevity.',
        is_approved: true,
      },
    ],
    content: `
      <h2>Selecting High-Retention Corporate Drinkware in the UAE</h2>
      <p>Branded drinkware remains one of the highest-retention promotional products in Dubai because it sits directly on an executive's desk or accompanies clients during daily commutes. Choosing between <a href="/categories/mug-printing-dubai">Custom Ceramic Mugs</a> and <a href="/categories/bottle-printing-dubai">Insulated Stainless Steel Water Bottles</a> depends on your distribution scenario, unit budget, and branding method.</p>
      <h2>1. Custom Ceramic & Matte Executive Mugs (Desk & Pantry Staple)</h2>
      <p>Ideal for office pantries, client meeting rooms, and trade show giveaways, <a href="/products/classic-white-ceramic-mugs">Classic White Ceramic Mugs</a> and <a href="/products/executive-matte-black-mugs">Executive Matte Black Mugs</a> offer wrap-around branding visibility at a low per-unit cost.</p>
      <h2>2. Double-Wall Vacuum Insulated Flasks (VIP & Onboarding Kits)</h2>
      <p>In the UAE climate, 304 food-grade stainless steel flasks such as <a href="/products/smart-led-temperature-bottles">Smart LED Temperature Bottles</a> and <a href="/products/matte-stainless-steel-bottles">Matte Thermal Bottles</a> keep water ice-cold for up to 24 hours. Pair them with <a href="/products/executive-notebooks">Executive Notebooks</a> inside a custom onboarding box.</p>
      <p>Request a custom drinkware quotation via <a href="/get-a-quote">our online quote form</a> or message ONPRINT on WhatsApp at <a href="https://wa.me/447344546056">+44 7344 546056</a>.</p>
    `,
  },
  {
    id: 202,
    slug: 'flyer-vs-trifold-brochure-vs-booklet-comparison-dubai',
    title: 'A5 Flyer vs Tri-Fold Brochure vs Saddle-Stitched Booklet: Choosing the Right Marketing Collateral in Dubai',
    excerpt: 'A practical commercial print buyer guide comparing flat A5/A4 flyers, 6-panel tri-fold brochures, and multi-page saddle-stitched booklets for Dubai real estate, clinics, and retail campaigns.',
    category: 'Commercial Print Buying Guides',
    categoryData: { name: 'Brochures Printing', slug: 'brochures-printing' },
    productData: { name: 'Tri-Fold Brochures Printing', slug: 'tri-fold-brochures-printing' },
    author: 'ONPRINT Commercial Press Team',
    author_name: 'ONPRINT Commercial Press Team',
    status: 'draft',
    seoReviewStatus: 'needs_review',
    published_at: null,
    reading_time: '7 min read',
    word_count: 1540,
    featured_image: '/uploads/categories/brochures-printing.jpg',
    image_alt: 'Comparison of A5 flyers, tri-fold brochures, and saddle-stitched corporate booklets in Dubai',
    meta_title: 'Flyer vs Tri-Fold Brochure vs Booklet Printing Dubai | ONPRINT',
    meta_description: 'Compare A5 flyers, tri-fold brochures, and saddle-stitched booklets in Dubai. Learn paper GSM rules, folding specs, and unit economics for UAE campaigns.',
    focus_keyword: 'flyer vs brochure vs booklet dubai',
    secondary_keywords: 'tri fold brochure printing dubai, a5 flyer printing uae, saddle stitched booklet dubai',
    canonical_url: 'https://www.0nprint.com/blog/flyer-vs-trifold-brochure-vs-booklet-comparison-dubai',
    faqs: [
      {
        question: 'At what page count should I switch from a folded brochure to a saddle-stitched booklet?',
        answer: 'Once your content exceeds 6 panels (Tri-Fold) or 8 panels (Gate-Fold / Z-Fold), switch to an 8-page to 48-page saddle-stitched booklet (in multiples of 4 pages) for clean reading flow.',
        is_approved: true,
      },
    ],
    content: `
      <h2>Matching Print Format to Customer Decision Stage</h2>
      <p>Marketing teams in Dubai frequently ask whether a campaign requires flat <a href="/products/a5-promotional-flyers">A5 Promotional Flyers</a>, a 6-panel <a href="/products/tri-fold-brochures-printing">Tri-Fold Brochure</a>, or a multi-page <a href="/products/catalogs-booklets-printing">Corporate Booklet</a>.</p>
      <ul>
        <li><strong>Flat A5 / DL Flyers (150–170 GSM):</strong> Best for single-offer retail promotions, restaurant delivery inserts, and door drops (<a href="/flyer-printing-dubai">Flyer Printing Dubai</a>).</li>
        <li><strong>Bi-Fold &amp; Tri-Fold Brochures (170–250 GSM with Creasing):</strong> Best for clinic service menus, real estate floorplans, and hotel spa guides (<a href="/brochure-printing-dubai">Brochure Printing Dubai</a>).</li>
        <li><strong>Saddle-Stitched &amp; Perfect-Bound Catalogs:</strong> Best for comprehensive company profiles, B2B product specifications, and annual reports.</li>
      </ul>
      <p>Get instant volume pricing on WhatsApp at <a href="https://wa.me/447344546056">+44 7344 546056</a>.</p>
    `,
  },
  {
    id: 203,
    slug: 'dubai-cafe-restaurant-stickers-menus-packaging-guide',
    title: 'Dubai Cafe, Restaurant & Cloud Kitchen Printing Guide: Waterproof Cup Stickers, Tamper Seals & Menus',
    excerpt: 'Complete hospitality printing specification guide for Dubai cafes and restaurants: ice-proof BOPP cup stickers, delivery bag tamper-evident security labels, DL takeaway menus, and wipe-clean dine-in menus.',
    category: 'Hospitality & Packaging',
    categoryData: { name: 'Stickers & Product Labels', slug: 'stickers-labels-printing' },
    productData: { name: 'Packaging & Box Sealing Stickers', slug: 'packaging-box-sealing-stickers' },
    author: 'ONPRINT Hospitality & Packaging Team',
    author_name: 'ONPRINT Hospitality & Packaging Team',
    status: 'draft',
    seoReviewStatus: 'needs_review',
    published_at: null,
    reading_time: '8 min read',
    word_count: 1620,
    featured_image: '/assets/products/stickers.jpg',
    image_alt: 'Dubai cafe and cloud kitchen waterproof cup stickers, tamper seals, and menus',
    meta_title: 'Dubai Cafe & Restaurant Stickers, Tamper Seals & Menus Guide | ONPRINT',
    meta_description: 'Printing guide for Dubai cafes, restaurants, and cloud kitchens: waterproof iced-cup labels, tamper-evident delivery seals, and waterproof synthetic menus.',
    focus_keyword: 'cafe cup stickers and restaurant menus dubai',
    secondary_keywords: 'cloud kitchen packaging stickers dubai, tamper evident delivery labels uae, waterproof restaurant menus dubai',
    canonical_url: 'https://www.0nprint.com/blog/dubai-cafe-restaurant-stickers-menus-packaging-guide',
    faqs: [
      {
        question: 'Which sticker adhesive stays stuck to iced coffee PET cups in Dubai humidity?',
        answer: 'Specify 60-micron white or clear BOPP film with permanent all-temperature acrylic adhesive. Unlike paper stickers, BOPP will not wrinkle or peel when cold condensation forms on iced cups.',
        is_approved: true,
      },
    ],
    content: `
      <h2>Essential Print Touchpoints for UAE Hospitality &amp; Cloud Kitchens</h2>
      <p>From specialty coffee roasters in Al Quoz and Jumeirah to high-volume cloud kitchens in Business Bay, food &amp; beverage brands rely on durable printed packaging to protect food safety and build repeat orders.</p>
      <ul>
        <li><strong>Iced-Cup &amp; Bottle Labels:</strong> Use <a href="/products/clear-transparent-stickers">Clear Transparent Vinyl/BOPP Stickers</a> with white ink underbase or <a href="/products/custom-roll-labels">Custom Roll Labels</a> for rapid barista application.</li>
        <li><strong>Tamper-Evident Delivery Seals:</strong> Lollipop-shaped or long strip <a href="/products/packaging-box-sealing-stickers">Box &amp; Bag Sealing Stickers</a> secure paper delivery bags for Talabat, Deliveroo, and Careem orders.</li>
        <li><strong>Dine-In &amp; Takeaway Menus:</strong> Pair wipe-clean <a href="/products/restaurant-menus-printing">Waterproof Synthetic Dine-In Menus</a> with high-impact <a href="/products/dl-event-flyers">DL Slim Takeaway Menu Flyers</a>.</li>
      </ul>
      <p>Need fast sample rolls or menu quotes in Dubai? Contact ONPRINT on WhatsApp at <a href="https://wa.me/447344546056">+44 7344 546056</a>.</p>
    `,
  },
]

export function getStoredBlogs() {
  const baseList = [
    ...DEFAULT_BLOG_GUIDES.map((b) => ({ ...b, status: b.status || 'published', seoReviewStatus: b.seoReviewStatus || 'approved' })),
    ...DEFAULT_EDITORIAL_DRAFTS,
  ]
  if (typeof window === 'undefined') return baseList
  try {
    const raw = localStorage.getItem(BLOGS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingSlugs = new Set(parsed.map((b) => b.slug))
        const missing = baseList.filter((b) => !existingSlugs.has(b.slug))
        return missing.length > 0 ? [...parsed, ...missing] : parsed
      }
    }
  } catch {
    // ignore
  }
  return baseList
}

export function saveStoredBlogs(blogs) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogs))
  } catch {
    // ignore
  }
}

/**
 * Fetch public published blog posts with pagination, search, and category/product filters
 */
export async function getPublicBlogs(params = {}) {
  try {
    const { data } = await api.get('/blogs', { params })
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      return data
    }
  } catch {
    // Fallback if API server is offline or database empty
  }

  let filtered = getStoredBlogs().filter((b) => b.status !== 'draft')
  if (params.category && params.category !== 'All') {
    filtered = filtered.filter((b) => (b.category || '').toLowerCase().includes(params.category.toLowerCase()))
  }
  if (params.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter((b) => (b.title || '').toLowerCase().includes(q) || (b.excerpt || '').toLowerCase().includes(q))
  }

  return {
    success: true,
    data: filtered,
    pagination: {
      page: params.page || 1,
      limit: params.limit || 12,
      total: filtered.length,
      totalPages: 1,
    },
  }
}

/**
 * Fetch a single blog post by slug (includes related blogs, related product, and category)
 */
export async function getPublicBlogBySlug(slug) {
  try {
    const { data } = await api.get(`/blogs/${slug}`)
    if (data?.data) {
      return data.data
    }
  } catch {
    // Fallback if API server is offline
  }

  const allPublished = getStoredBlogs().filter((b) => b.status !== 'draft')
  const found = allPublished.find((b) => b.slug === slug)
  if (found) {
    return {
      ...found,
      relatedBlogs: allPublished.filter((b) => b.slug !== slug).slice(0, 3),
    }
  }
  return null
}

/**
 * Fetch a single blog post for Admin by ID or slug
 */
export async function getAdminBlogById(id) {
  try {
    const { data } = await api.get(`/blogs/${id}`)
    if (data?.data) return data.data
  } catch {
    // fallback to local stored blogs
  }
  return getStoredBlogs().find((b) => String(b.id || b._id) === String(id) || b.slug === id) || null
}

/**
 * Fetch all blogs for Admin dashboard with statistics and filters
 */
export async function getAdminBlogs(params = {}) {
  try {
    const { data } = await api.get('/blogs/admin', { params })
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      return data
    }
  } catch {
    // fallback to local stored blogs
  }
  let all = getStoredBlogs()
  if (params.status && params.status !== 'all') {
    all = all.filter((b) => (b.status || 'published') === params.status)
  }
  return {
    success: true,
    data: all,
    pagination: { page: 1, limit: 100, total: all.length, totalPages: 1 },
  }
}

/**
 * Fetch blog dashboard KPI statistics
 */
export async function getBlogStats() {
  try {
    const { data } = await api.get('/blogs/stats')
    if (data?.data) return data.data
  } catch {
    // fallback
  }
  const all = getStoredBlogs()
  return {
    total: all.length,
    published: all.filter((b) => b.status !== 'draft').length,
    drafts: all.filter((b) => b.status === 'draft').length,
  }
}

/**
 * Create a new blog post (Admin)
 */
export async function createBlog(payload) {
  const all = getStoredBlogs()
  const newPost = {
    id: Date.now(),
    status: payload.status || 'draft',
    seoReviewStatus: payload.seoReviewStatus || 'needs_review',
    published_at: payload.status === 'published' ? new Date().toISOString() : null,
    ...payload,
  }
  saveStoredBlogs([newPost, ...all])
  try {
    const { data } = await api.post('/blogs', payload)
    return data
  } catch {
    return { success: true, data: newPost }
  }
}

/**
 * Update an existing blog post (Admin)
 */
export async function updateBlog(id, payload) {
  const all = getStoredBlogs()
  const updated = all.map((b) => (String(b.id || b._id) === String(id) || b.slug === id ? { ...b, ...payload } : b))
  saveStoredBlogs(updated)
  try {
    const { data } = await api.put(`/blogs/${id}`, payload)
    return data
  } catch {
    return { success: true, data: { id, ...payload } }
  }
}

/**
 * Delete a single blog post (Admin)
 */
export async function deleteBlog(id) {
  const all = getStoredBlogs()
  saveStoredBlogs(all.filter((b) => String(b.id || b._id) !== String(id) && b.slug !== id))
  try {
    const { data } = await api.delete(`/blogs/${id}`)
    return data
  } catch {
    return { success: true }
  }
}

/**
 * Bulk delete blog posts (Admin)
 */
export async function bulkDeleteBlogs(blogIds) {
  const idSet = new Set((blogIds || []).map(String))
  const all = getStoredBlogs()
  saveStoredBlogs(all.filter((b) => !idSet.has(String(b.id || b._id))))
  try {
    const { data } = await api.post('/blogs/bulk-delete', { blogIds })
    return data
  } catch {
    return { success: true }
  }
}

/**
 * Publish blog (Admin)
 */
export async function publishBlog(id) {
  const all = getStoredBlogs()
  saveStoredBlogs(
    all.map((b) =>
      String(b.id || b._id) === String(id) || b.slug === id
        ? { ...b, status: 'published', seoReviewStatus: 'approved', published_at: new Date().toISOString() }
        : b
    )
  )
  try {
    const { data } = await api.patch(`/blogs/${id}/publish`)
    return data
  } catch {
    return { success: true }
  }
}

/**
 * Unpublish blog / Save as Draft (Admin)
 */
export async function unpublishBlog(id) {
  const all = getStoredBlogs()
  saveStoredBlogs(
    all.map((b) => (String(b.id || b._id) === String(id) || b.slug === id ? { ...b, status: 'draft' } : b))
  )
  try {
    const { data } = await api.patch(`/blogs/${id}/unpublish`)
    return data
  } catch {
    return { success: true }
  }
}

/**
 * Toggle featured state (Admin)
 */
export async function toggleFeaturedBlog(id) {
  const { data } = await api.patch(`/blogs/${id}/featured`)
  return data
}

/**
 * AI Content and SEO Generator (Admin)
 */
export async function generateBlogContent(payload) {
  const { data } = await api.post('/blogs/generate-content', payload)
  return data?.data
}

/**
 * AI Image Generator & Matcher (Admin)
 */
export async function generateBlogImage(payload) {
  const { data } = await api.post('/blogs/generate-image', payload)
  return data?.data
}

/**
 * AI-powered Blog SEO Generator (Admin)
 * Generates meta title, meta description, focus keyword, secondary keywords,
 * slug, canonical, og tags, structured data, and FAQs.
 */
export async function generateBlogSeo(payload, id = null) {
  const url = id ? `/blogs/${id}/generate-seo` : '/blogs/generate-seo'
  const { data } = await api.post(url, payload)
  return data?.data || data
}

/**
 * Real-time Blog SEO Analysis (Admin)
 * Evaluates 16 on-page & technical factors and returns 0-100 score + checklist + recommendations.
 */
export async function analyzeBlogSeo(payload, id = null) {
  const url = id ? `/blogs/${id}/analyze-seo` : '/blogs/analyze-seo'
  const { data } = await api.post(url, payload)
  return data?.data || data
}

/**
 * Fetch Blog SEO Dashboard Metrics & Opportunities (Admin)
 */
export async function getBlogSeoMetrics() {
  const { data } = await api.get('/blogs/seo-metrics')
  return data?.data || data
}

// Backwards-compatible aliases
export const getBlogPosts = async (params = {}) => {
  const res = await getPublicBlogs(params)
  return res?.data || []
}
export const getBlogPostBySlug = getPublicBlogBySlug
export const createBlogPost = createBlog
export const updateBlogPost = updateBlog
export const deleteBlogPost = deleteBlog
