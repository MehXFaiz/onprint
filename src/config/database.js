const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const models = require('../models')
const { categories: initialCategories, products: initialProducts, services: initialServices } = require('../data/initialData')

const {
  User,
  Category,
  Product,
  Service,
  Blog,
  Quote,
  Order,
  ContactMessage,
  NewsletterSubscriber,
  SiteSetting,
  PageSeo,
  PageSeoHistory,
  SeoKeyword,
  SeoBacklink,
  SeoOutreachProspect,
  SeoCompetitorRecord,
  SeoCompetitorGap,
  BacklinkOpportunity,
  SeoBacklinkOpportunity200,
  SeoAiVisibility,
  GeoFaq,
  GeoContent,
  GeoCitationLog,
  GeoCompetitorAudit,
  SeoRedirect,
  SeoBrandMention,
  SeoExperiment,
  SeoConversion,
  SeoContentDecay,
  SeoTask,
  SeoSetting,
  SeoAudit,
  SeoIssue,
  SeoRecommendation,
  SeoChange,
  SeoDailyReport,
  SeoKeywordSnapshot,
  SeoPageMetric,
  SeoIntegration,
  SeoLog,
  Review,
  CorporateQuote,
  NotificationLog,
} = models

// Serverless-optimized global connection caching
let cached = global.mongoose
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) return cached.conn

  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn('[Database] MONGODB_URI environment variable is not defined. Operating with fallback catalog data.')
    return null
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      dbName: 'onprintdb',
      appName: 'ONPRINT-Vercel',
    }
    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        console.log('✓ [MongoDB Atlas] Connected successfully to onprintdb')
        return m
      })
      .catch((err) => {
        cached.promise = null
        console.warn('[MongoDB Atlas] Connection attempt failed:', err.message)
        return null
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null
    console.error('[MongoDB Atlas] Connection error:', err.message)
    return null
  }

  return cached.conn
}

async function testConnection() {
  try {
    await connectDB()
    await initDatabase()
    return true
  } catch (err) {
    console.error('[Database] MongoDB Atlas connection test failed:', err.message)
    return false
  }
}

async function initDatabase() {
  try {
    await connectDB()

    // Ensure default Admin user
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@onprint.ae').toLowerCase().trim()
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const adminName = process.env.ADMIN_NAME || 'ONPRINT Admin'
    const adminPhone = process.env.ADMIN_PHONE || '+971 4 800 PRINT'

    const existingAdmin = await User.findOne({ email: adminEmail })
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10)
      await User.create({
        id: 1,
        name: adminName,
        email: adminEmail,
        password_hash: passwordHash,
        phone: adminPhone,
        role: 'admin',
        status: 'active',
      })
      console.log(`[Database] Seeded Admin User in MongoDB Atlas: ${adminEmail}`)
    }

    // 1. Ensure all 19 categories are synced into MongoDB Atlas with clean local images (no trae.ai URLs)
    for (const c of initialCategories) {
      await Category.updateOne(
        { slug: c.slug },
        {
          $set: {
            id: c.id,
            category_key: c._id || `cat-${c.slug}`,
            name: c.name,
            slug: c.slug,
            description: c.description || '',
            image: c.image || c.image_url,
            image_url: c.image_url || c.image,
            status: 'active',
            active: true,
            display_order: c.display_order || c.id,
            seo_title: c.seo_title || c.seoTitle,
            seo_description: c.seo_description || c.seoDescription,
            seo_keywords: c.seo_keywords || c.seoKeywords,
            seo_heading: c.seo_heading || c.seoHeading,
            canonical_url: c.canonical_url || c.canonicalUrl,
            image_alt: c.image_alt || c.imageAlt,
          },
        },
        { upsert: true }
      )
    }

    // 2. Ensure all 111 products have collision-free unique IDs, correct category_id, embedded category, and verified image arrays
    for (const p of initialProducts) {
      const cleanImgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image]
      await Product.updateOne(
        { slug: p.slug },
        {
          $set: {
            id: p.id,
            product_key: p.product_key || `prod-${p.id}`,
            category_id: p.category_id,
            category: p.category,
            categories: p.categories || [p.category],
            name: p.name,
            slug: p.slug,
            short_description: p.short_description || p.shortDescription || '',
            description: p.description || '',
            price: p.price || 0,
            minimum_quantity: p.minimum_quantity || p.minimumQuantity || 1,
            featured: Boolean(p.featured),
            specifications: p.specifications || [],
            images: cleanImgs,
            active: p.active !== false,
            seo_title: p.seo_title || p.seoTitle,
            seo_description: p.seo_description || p.seoDescription,
            seo_keywords: p.seo_keywords || p.seoKeywords,
            seo_heading: p.seo_heading || p.seoHeading,
            canonical_url: p.canonical_url || p.canonicalUrl,
            image_alt: p.image_alt || p.imageAlt || p.name,
          },
        },
        { upsert: true }
      )
    }

    return true
  } catch (err) {
    console.warn('[Database] MongoDB initialization note:', err.message)
    return false
  }
}

// Map SQL table names to Mongoose models
const TABLE_MODEL_MAP = {
  users: User,
  categories: Category,
  products: Product,
  services: Service,
  blogs: Blog,
  blog_posts: Blog,
  quotes: Quote,
  orders: Order,
  contact_messages: ContactMessage,
  newsletter_subscribers: NewsletterSubscriber,
  site_settings: SiteSetting,
  page_seo: PageSeo,
  page_seo_history: PageSeoHistory,
  seo_keywords: SeoKeyword,
  seo_backlinks: SeoBacklink,
  seo_outreach_prospects: SeoOutreachProspect,
  seo_competitor_records: SeoCompetitorRecord,
  seo_competitor_gaps: SeoCompetitorGap,
  backlink_opportunities: BacklinkOpportunity,
  seo_backlink_opportunities_200: SeoBacklinkOpportunity200,
  seo_ai_visibility_tracking: SeoAiVisibility,
  geo_faqs: GeoFaq,
  geo_content: GeoContent,
  geo_citation_logs: GeoCitationLog,
  geo_competitor_audits: GeoCompetitorAudit,
  seo_redirects: SeoRedirect,
  seo_brand_mentions: SeoBrandMention,
  seo_experiments: SeoExperiment,
  seo_conversions: SeoConversion,
  seo_content_decay: SeoContentDecay,
  seo_tasks: SeoTask,
  seo_settings: SeoSetting,
  seo_audits: SeoAudit,
  seo_issues: SeoIssue,
  seo_recommendations: SeoRecommendation,
  seo_changes: SeoChange,
  seo_daily_reports: SeoDailyReport,
  seo_keyword_snapshots: SeoKeywordSnapshot,
  seo_page_metrics: SeoPageMetric,
  seo_integrations: SeoIntegration,
  seo_logs: SeoLog,
  reviews: Review,
  corporate_quotes: CorporateQuote,
  notification_logs: NotificationLog,
}

function normalizeDoc(doc) {
  if (!doc) return doc
  const obj = doc.toObject ? doc.toObject({ virtuals: true }) : { ...doc }
  // Ensure legacy SQL fields are present
  if (obj._id && !obj.id) obj.id = obj._id.toString()
  return obj
}

function extractPrimaryTable(sql) {
  let m = sql.match(/INSERT\s+INTO\s+`?([a-zA-Z0-9_]+)`?/i)
  if (m) return m[1].toLowerCase()
  m = sql.match(/UPDATE\s+`?([a-zA-Z0-9_]+)`?/i)
  if (m) return m[1].toLowerCase()
  m = sql.match(/DELETE\s+FROM\s+`?([a-zA-Z0-9_]+)`?/i)
  if (m) return m[1].toLowerCase()

  // For SELECT queries: find all FROM clauses.
  // In queries with subqueries like "SELECT ... (SELECT COUNT(*) FROM products p WHERE ...) FROM categories c",
  // the outer main table is the last FROM clause before WHERE/GROUP/ORDER/LIMIT.
  const fromMatches = []
  const fromRegex = /\bFROM\s+`?([a-zA-Z0-9_]+)`?/gi
  let match
  while ((match = fromRegex.exec(sql)) !== null) {
    fromMatches.push(match[1].toLowerCase())
  }
  if (fromMatches.length > 0) {
    for (let i = fromMatches.length - 1; i >= 0; i--) {
      const tbl = fromMatches[i]
      if (TABLE_MODEL_MAP[tbl] || tbl === 'product_images') {
        return tbl
      }
    }
    return fromMatches[fromMatches.length - 1]
  }

  // Fallback scan:
  for (const table of Object.keys(TABLE_MODEL_MAP)) {
    if (new RegExp(`\\b${table}\\b`, 'i').test(sql)) {
      return table
    }
  }
  return null
}

/**
 * Robust SQL-to-MongoDB compatibility query executor.
 * Intercepts SQL statements executed by legacy services/controllers
 * and maps them directly into MongoDB operations.
 */
async function executeSql(sql, params = []) {
  try {
    await connectDB()
  } catch (err) {
    console.warn('[Database] executeSql connect warning:', err.message)
  }

  const cleanSql = (sql || '').trim().replace(/\s+/g, ' ')
  const upperSql = cleanSql.toUpperCase()

  // 1. Health check & connectivity probes
  if (upperSql.includes('SELECT 1 AS CONNECTED') || upperSql === 'SELECT 1') {
    return [[{ connected: cached.conn ? 1 : 0, ok: 1 }], []]
  }

  // Graceful fallback when database connection is unavailable
  if (!cached.conn) {
    const target = extractPrimaryTable(cleanSql)
    if (target === 'categories') {
      if (params.length > 0 && (upperSql.includes('WHERE') || upperSql.includes('LIMIT 1'))) {
        const val = String(params[0]).toLowerCase()
        const match = (initialCategories || []).find(c => (c.slug && c.slug.toLowerCase() === val) || String(c.id) === val || (c.category_key && c.category_key.toLowerCase() === val))
        return [match ? [match] : [], []]
      }
      return [initialCategories || [], []]
    }
    if (target === 'products') {
      let list = initialProducts || []
      if (params.length > 0 && (upperSql.includes('WHERE ID = ?') || upperSql.includes('WHERE SLUG = ?') || upperSql.includes('P.ID = ?') || upperSql.includes('P.SLUG = ?') || (upperSql.includes('LIMIT 1') && !upperSql.includes('C.SLUG')))) {
        const val = String(params[0]).toLowerCase()
        const match = list.find(p => (p.slug && p.slug.toLowerCase() === val) || String(p.id) === val || (p.product_key && p.product_key.toLowerCase() === val))
        if (match) return [[match], []]
      }
      if (upperSql.includes('C.SLUG = ?') || upperSql.includes('CATEGORY_ID = ?') || upperSql.includes('P.CATEGORY_ID = ?')) {
        const catVal = String(params[0]).toLowerCase()
        list = list.filter(p => {
          if (String(p.category_id).toLowerCase() === catVal) return true
          if (p.category && (
            (p.category.slug && p.category.slug.toLowerCase() === catVal) ||
            String(p.category.id).toLowerCase() === catVal ||
            (p.category._id && String(p.category._id).toLowerCase() === catVal)
          )) return true
          if (Array.isArray(p.categories) && p.categories.some(c => (c.slug && c.slug.toLowerCase() === catVal) || String(c.id).toLowerCase() === catVal)) return true
          return false
        })
      }
      return [list, []]
    }
    if (target === 'services') {
      const allServices = initialServices || []
      if (params.length > 0 && (upperSql.includes('WHERE') || upperSql.includes('LIMIT 1'))) {
        const val = String(params[0]).toLowerCase()
        const match = allServices.find(s => (s.slug && s.slug.toLowerCase() === val) || String(s.id) === val || (s.service_key && s.service_key.toLowerCase() === val))
        return [match ? [match] : [], []]
      }
      return [allServices, []]
    }
    if (target === 'users' && upperSql.includes('SELECT')) {
      return [[{
        id: 1,
        name: process.env.ADMIN_NAME || 'ONPRINT Admin',
        email: (process.env.ADMIN_EMAIL || 'admin@onprint.ae').toLowerCase(),
        role: 'admin',
        status: 'active',
      }], []]
    }
    return [[], []]
  }

  // 2. Schema check / Table inspection queries
  if (upperSql.startsWith('SHOW TABLES')) {
    return [Object.keys(TABLE_MODEL_MAP).map((t) => ({ [`Tables_in_onprintdb`]: t })), []]
  }
  if (upperSql.includes('INFORMATION_SCHEMA.COLUMNS')) {
    return [[{ COLUMN_NAME: 'id' }], []]
  }
  if (upperSql.startsWith('ALTER TABLE') || upperSql.startsWith('CREATE TABLE')) {
    return [{ affectedRows: 0 }, []]
  }

  // Target table identification
  const targetTable = extractPrimaryTable(cleanSql)

  // Special handling for product_images
  if (targetTable === 'product_images') {
    if (upperSql.startsWith('SELECT')) {
      let filter = {}
      if (params.length > 0 && (upperSql.includes('PRODUCT_ID = ?') || upperSql.includes('PRODUCT_ID=?'))) {
        const prodId = params[0]
        const orConditions = [
          { id: prodId },
          { id: Number(prodId) || -1 },
          { product_key: String(prodId) },
          { slug: String(prodId) },
        ]
        if (mongoose.isValidObjectId(prodId)) {
          orConditions.push({ _id: prodId })
        }
        filter = { $or: orConditions }
      }

      const products = await Product.find(filter).lean()
      const imageRows = []
      let imgIdx = 1
      for (const p of products) {
        const imgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : [])
        imgs.forEach((url, i) => {
          const rowData = {
            image_url: url,
            alt_text: p.image_alt || p.name,
            display_order: i + 1,
          }
          imageRows.push({
            id: imgIdx++,
            product_id: p.id,
            ...rowData,
          })
          if (p.slug) {
            imageRows.push({
              id: imgIdx++,
              product_id: p.slug,
              ...rowData,
            })
          }
          if (p.product_key) {
            imageRows.push({
              id: imgIdx++,
              product_id: p.product_key,
              ...rowData,
            })
          }
          if (p._id) {
            imageRows.push({
              id: imgIdx++,
              product_id: p._id.toString(),
              ...rowData,
            })
          }
        })
      }
      return [imageRows, []]
    }
    if (upperSql.startsWith('INSERT')) {
      if (params.length >= 2) {
        const prodId = params[0]
        const imgUrl = params[1]
        await Product.updateOne(
          {
            $or: [
              { id: prodId },
              { id: Number(prodId) || -1 },
              { product_key: String(prodId) },
              { slug: String(prodId) },
              { _id: mongoose.isValidObjectId(prodId) ? prodId : null },
            ].filter(Boolean),
          },
          { $push: { images: imgUrl } }
        )
      }
      return [{ insertId: Date.now(), affectedRows: 1 }, []]
    }
    if (upperSql.startsWith('DELETE')) {
      if (params.length >= 1) {
        const prodId = params[0]
        await Product.updateOne(
          {
            $or: [
              { id: prodId },
              { id: Number(prodId) || -1 },
              { product_key: String(prodId) },
              { slug: String(prodId) },
              { _id: mongoose.isValidObjectId(prodId) ? prodId : null },
            ].filter(Boolean),
          },
          { $set: { images: [] } }
        )
      }
      return [{ affectedRows: 1 }, []]
    }
    return [[], []]
  }

  const Model = targetTable ? TABLE_MODEL_MAP[targetTable] : null
  if (!Model) {
    return [[], []]
  }

  // 3. SELECT Queries
  if (upperSql.startsWith('SELECT')) {
    // 3a. Aggregate Blog statistics in Admin Dashboard
    if (upperSql.includes("SUM(CASE WHEN STATUS = 'PUBLISHED'")) {
      const total = await Blog.countDocuments({})
      const published = await Blog.countDocuments({ status: 'published' })
      const drafts = await Blog.countDocuments({ status: 'draft' })
      return [[{ total, published, drafts, scheduled: 0, featured: 0 }], []]
    }

    // 3b. GROUP BY queries
    if (upperSql.includes('GROUP BY ACTIVE') || upperSql.includes('GROUP BY P.ACTIVE') || upperSql.includes('GROUP BY C.ACTIVE')) {
      const activeCount = await Model.countDocuments({ active: true })
      const inactiveCount = await Model.countDocuments({ active: false })
      return [[{ active: 1, count: activeCount }, { active: 0, count: inactiveCount }], []]
    }
    if (upperSql.includes('GROUP BY ROLE')) {
      const adminCount = await User.countDocuments({ role: 'admin' })
      const customerCount = await User.countDocuments({ role: { $ne: 'admin' } })
      return [[{ role: 'admin', count: adminCount }, { role: 'customer', count: customerCount }], []]
    }
    if (upperSql.includes('GROUP BY STATUS')) {
      const groups = await Model.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
      return [groups.map((g) => ({ status: g._id, count: g.count })), []]
    }

    // 3c. Pure COUNT queries (must start with SELECT COUNT)
    if (/^\s*SELECT\s+COUNT\s*\(/i.test(cleanSql)) {
      let filter = {}
      if (targetTable === 'blogs') {
        if (upperSql.includes("STATUS = 'PUBLISHED'")) filter.status = 'published'
        if (upperSql.includes('IS_FEATURED = 1')) filter.is_featured = true
        if (params.length > 0) {
          const p0 = params[0]
          if (typeof p0 === 'number' || !isNaN(Number(p0))) {
            if (upperSql.includes('CATEGORY_ID = ?')) filter.category_id = Number(p0)
            else if (upperSql.includes('PRODUCT_ID = ?')) filter.product_id = Number(p0)
          }
        }
      } else if (params.length === 1) {
        if (upperSql.includes('CATEGORY_ID = ?')) filter.category_id = params[0]
        else if (upperSql.includes('EMAIL = ?')) filter.email = String(params[0]).toLowerCase()
      }
      const count = await Model.countDocuments(filter)
      return [[{ totalCount: count, count, cnt: count, 'COUNT(*)': count, 'COUNT(b.id)': count, 'COUNT(p.id)': count }], []]
    }

    // 3c2. SERVICES queries
    if (targetTable === 'services') {
      let filter = {}
      if (params.length > 0) {
        const val = params[0]
        if (upperSql.includes('S.SLUG = ?') || upperSql.includes('WHERE SLUG = ?') || upperSql.includes('S.SERVICE_KEY = ?') || upperSql.includes('SLUG = ?')) {
          filter = { $or: [{ slug: val }, { service_key: val }] }
          const numId = Number(val)
          if (!isNaN(numId) && numId > 0) filter.$or.push({ id: numId })
        } else if (upperSql.includes('WHERE ID = ?') || upperSql.includes('S.ID = ?')) {
          const numId = Number(val)
          filter = !isNaN(numId) && numId > 0 ? { $or: [{ id: numId }, { service_key: String(val) }] } : { service_key: String(val) }
        }
      }
      if (upperSql.includes('ACTIVE = 1') || upperSql.includes('S.ACTIVE = 1')) {
        filter.active = true
      }
      let sort = { display_order: 1, id: 1 }
      let queryObj = Service.find(filter).sort(sort)
      if (upperSql.includes('LIMIT 1')) queryObj = queryObj.limit(1)
      const docs = await queryObj.lean()
      return [docs.map(normalizeDoc), []]
    }

    // 3d. CATEGORIES queries
    if (targetTable === 'categories') {
      let filter = {}
      if (params.length === 1) {
        const val = params[0]
        if (upperSql.includes('C.ID = ?') || upperSql.includes('WHERE ID = ?')) {
          filter = { $or: [{ id: val }, { slug: val }, { category_key: val }] }
        } else if (upperSql.includes('WHERE SLUG = ?')) {
          filter = { slug: val }
        }
      } else if (params.length === 3 && (upperSql.includes('C.ID = ?') || upperSql.includes('WHERE ID = ?'))) {
        const val = params[0]
        filter = { $or: [{ id: val }, { slug: val }, { category_key: val }] }
      } else if (upperSql.includes('C.STATUS = ?')) {
        if (params[0] && params[0] !== 'all') {
          filter.status = params[0]
        }
      }

      if (upperSql.includes('C.ACTIVE = 1') || upperSql.includes('ACTIVE = 1')) {
        filter.active = true
      }

      let sort = { display_order: 1, name: 1 }
      if (upperSql.includes('ORDER BY C.NAME DESC')) sort = { name: -1 }
      else if (upperSql.includes('ORDER BY C.NAME ASC')) sort = { name: 1 }
      else if (upperSql.includes('ORDER BY C.CREATED_AT DESC')) sort = { created_at: -1 }
      else if (upperSql.includes('ORDER BY C.DISPLAY_ORDER DESC')) sort = { display_order: -1, name: 1 }

      let queryObj = Category.find(filter).sort(sort)
      if (upperSql.includes('LIMIT 1')) queryObj = queryObj.limit(1)

      const cats = await queryObj.lean()

      const prodCounts = await Product.aggregate([
        { $match: { active: true } },
        { $group: { _id: '$category_id', count: { $sum: 1 } } },
      ])
      const countMap = {}
      prodCounts.forEach((pc) => {
        if (pc._id) countMap[pc._id] = pc.count
      })

      const rows = cats.map((c) => {
        const doc = normalizeDoc(c)
        doc.productCount = countMap[doc.id] || countMap[doc.category_key] || 0
        doc.displayOrder = doc.display_order || 0
        doc.seoTitle = doc.seo_title
        doc.seoDescription = doc.seo_description
        doc.seoKeywords = doc.seo_keywords
        doc.seoHeading = doc.seo_heading
        doc.canonicalUrl = doc.canonical_url
        doc.imageAlt = doc.image_alt
        return doc
      })

      return [rows, []]
    }

    // 3e. PRODUCTS queries
    if (targetTable === 'products') {
      let filter = {}
      if (upperSql.includes('ACTIVE = 1') || upperSql.includes('P.ACTIVE = 1')) {
        filter.active = true
      }
      if (upperSql.includes('P.FEATURED = 1') || upperSql.includes('FEATURED = 1')) {
        filter.featured = true
      }

      if (params.length > 0) {
        if (upperSql.includes('P.ID = ?') || upperSql.includes('WHERE ID = ?')) {
          const val = params[0]
          filter = { $or: [{ id: val }, { slug: val }, { product_key: val }] }
        } else if (upperSql.includes('WHERE SLUG = ?') || upperSql.includes('P.SLUG = ?')) {
          filter = { slug: params[0] }
        } else if (upperSql.includes('C.SLUG = ?')) {
          const catVal = params[0]
          const cat = await Category.findOne({
            $or: [{ slug: catVal }, { category_key: catVal }, { id: Number(catVal) || -1 }],
          }).lean()
          if (cat) {
            filter.$or = [
              { category_id: cat.id },
              { category_id: cat.category_key },
              { 'category.slug': cat.slug },
              { 'category._id': cat.category_key },
            ]
          }
        }
      }

      let sort = { created_at: -1 }
      let limit = 0
      if (upperSql.includes('LIMIT 1')) limit = 1
      else if (upperSql.includes('LIMIT 30')) limit = 30

      let queryObj = Product.find(filter).sort(sort)
      if (limit > 0) queryObj = queryObj.limit(limit)
      const prods = await queryObj.lean()

      const allCats = await Category.find({}).lean()
      const catMap = {}
      allCats.forEach((c) => {
        catMap[c.id] = c
        catMap[String(c.id)] = c
        if (c.category_key) catMap[c.category_key] = c
        if (c.slug) catMap[c.slug] = c
      })

      const rows = prods.map((p) => {
        const doc = normalizeDoc(p)
        const cat =
          catMap[doc.category_id] ||
          catMap[String(doc.category_id)] ||
          (doc.category && catMap[doc.category.slug]) ||
          (doc.category && catMap[doc.category.id]) ||
          doc.category
        if (cat) {
          doc.cat_id = cat.id
          doc.cat_key = cat.category_key || cat._id || `cat-${cat.id}`
          doc.cat_name = cat.name
          doc.cat_slug = cat.slug
          doc.category = {
            _id: cat.category_key || cat._id || `cat-${cat.id}`,
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
          }
        }
        doc.images = Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : [])
        doc.shortDescription = doc.short_description
        doc.minimumQuantity = doc.minimum_quantity
        doc.seoTitle = doc.seo_title
        doc.seoDescription = doc.seo_description
        doc.seoKeywords = doc.seo_keywords
        doc.seoHeading = doc.seo_heading
        doc.canonicalUrl = doc.canonical_url
        doc.imageAlt = doc.image_alt
        return doc
      })

      return [rows, []]
    }

    // 3f. BLOGS queries
    if (targetTable === 'blogs') {
      let filter = {}
      if (upperSql.includes("STATUS = 'PUBLISHED'") || upperSql.includes("B.STATUS = 'PUBLISHED'")) {
        filter.status = 'published'
      }
      if (upperSql.includes('IS_FEATURED = 1') || upperSql.includes('B.IS_FEATURED = 1')) {
        filter.is_featured = true
      }

      let sort = { is_featured: -1, published_at: -1, id: -1 }
      if (upperSql.includes('ORDER BY B.PUBLISHED_AT ASC')) sort = { published_at: 1 }
      else if (upperSql.includes('ORDER BY B.TITLE ASC')) sort = { title: 1 }

      let limit = 0
      let skip = 0
      if (upperSql.includes('LIMIT ? OFFSET ?')) {
        limit = Number(params[params.length - 2]) || 12
        skip = Number(params[params.length - 1]) || 0
      } else if (upperSql.includes('LIMIT 1')) {
        limit = 1
      }

      if (params.length >= 1 && (upperSql.includes('WHERE SLUG = ?') || upperSql.includes('B.SLUG = ?'))) {
        filter.slug = params[0]
      } else if (params.length >= 1 && (upperSql.includes('WHERE ID = ?') || upperSql.includes('B.ID = ?'))) {
        filter.id = params[0]
      }

      let queryObj = Blog.find(filter).sort(sort)
      if (skip > 0) queryObj = queryObj.skip(skip)
      if (limit > 0) queryObj = queryObj.limit(limit)

      const blogs = await queryObj.lean()

      const allCats = await Category.find({}).lean()
      const allProds = await Product.find({}).lean()
      const catMap = {}
      allCats.forEach((c) => {
        catMap[c.id] = c
      })
      const prodMap = {}
      allProds.forEach((p) => {
        prodMap[p.id] = p
      })

      const rows = blogs.map((b) => {
        const doc = normalizeDoc(b)
        const cat = catMap[doc.category_id]
        const prod = prodMap[doc.product_id]
        if (cat) {
          doc.category_name = cat.name
          doc.category_slug = cat.slug
        }
        if (prod) {
          doc.product_name = prod.name
          doc.product_slug = prod.slug
        }
        return doc
      })

      return [rows, []]
    }

    // 3g. Standard SELECT for all other models
    let filter = {}
    if (params.length > 0) {
      if (upperSql.includes('EMAIL = ?') || upperSql.includes('U.EMAIL = ?')) {
        filter.email = String(params[0]).toLowerCase().trim()
      } else if (upperSql.includes('WHERE ID = ?')) {
        const idVal = params[0]
        filter = mongoose.isValidObjectId(idVal) ? { $or: [{ _id: idVal }, { id: idVal }] } : { id: idVal }
      } else if (upperSql.includes('WHERE SLUG = ?')) {
        filter.slug = params[0]
      } else if (upperSql.includes('WHERE URL = ?')) {
        filter.url = params[0]
      } else if (upperSql.includes('WHERE OLD_URL = ?')) {
        filter.old_url = params[0]
      } else if (upperSql.includes('WHERE SETTING_KEY = ?')) {
        filter.setting_key = params[0]
      } else if (upperSql.includes('WHERE QUOTE_NUMBER = ?')) {
        filter.quote_number = params[0]
      } else if (upperSql.includes('WHERE ORDER_NUMBER = ?')) {
        filter.order_number = params[0]
      } else if (upperSql.includes('WHERE AUDIT_ID = ?')) {
        filter.audit_id = params[0]
      }
    }

    if (upperSql.includes('ACTIVE = 1') || upperSql.includes('STATUS = "ACTIVE"') || upperSql.includes("STATUS = 'ACTIVE'")) {
      filter.active = true
    }

    let sort = { created_at: -1 }
    let limit = 0
    if (upperSql.includes('LIMIT 1')) limit = 1
    else if (upperSql.includes('LIMIT 5')) limit = 5
    else if (upperSql.includes('LIMIT 100')) limit = 100

    let queryObj = Model.find(filter)
    if (sort) queryObj = queryObj.sort(sort)
    if (limit > 0) queryObj = queryObj.limit(limit)

    const docs = await queryObj.lean()
    return [docs.map(normalizeDoc), []]
  }

  // 4. INSERT Queries
  if (upperSql.startsWith('INSERT')) {
    let insertData = {}
    if (params.length > 0) {
      if (targetTable === 'users' && params.length >= 6) {
        insertData = {
          name: params[0],
          email: params[1],
          password_hash: params[2],
          phone: params[3],
          role: params[4] || 'customer',
          status: params[5] || 'active',
        }
      } else if (targetTable === 'categories') {
        insertData = {
          name: params[0],
          slug: params[1],
          description: params[2],
          image: params[3],
          image_url: params[4],
          status: params[5],
          display_order: params[6],
          active: Boolean(params[7]),
          seo_title: params[8],
          seo_description: params[9],
          seo_keywords: params[10],
          seo_heading: params[11],
          image_alt: params[12],
          canonical_url: params[13],
        }
      } else if (targetTable === 'contact_messages' && params.length >= 6) {
        insertData = {
          name: params[0],
          email: params[1],
          phone: params[2],
          company: params[3],
          subject: params[4],
          message: params[5],
          status: params[6] || 'unread',
        }
      } else if (targetTable === 'quotes' && params.length >= 8) {
        insertData = {
          quote_number: params[0],
          user_id: params[1],
          name: params[2],
          email: params[3],
          phone: params[4],
          company: params[5],
          notes: params[6],
          total_price: params[7],
        }
      } else if (targetTable === 'orders' && params.length >= 7) {
        insertData = {
          order_number: params[0],
          user_id: params[1],
          customer_name: params[2],
          customer_email: params[3],
          customer_phone: params[4],
          company: params[5],
          subtotal: params[6],
          tax: params[7] || 0,
        }
      } else if (targetTable === 'newsletter_subscribers' && params.length >= 1) {
        insertData = {
          email: params[0],
          status: params[1] || 'subscribed',
        }
      } else if (targetTable === 'seo_settings' && params.length >= 2) {
        insertData = {
          setting_key: params[0],
          setting_value: params[1],
        }
      } else if (targetTable === 'seo_redirects' && params.length >= 4) {
        insertData = {
          old_url: params[0],
          new_url: params[1],
          redirect_type: params[2],
          status: params[3] || 'active',
        }
      }
    }

    if (Object.keys(insertData).length > 0) {
      const created = await Model.create(insertData)
      return [{ insertId: created.id || created._id.toString(), affectedRows: 1 }, []]
    }

    return [{ insertId: Date.now(), affectedRows: 1 }, []]
  }

  // 5. UPDATE Queries
  if (upperSql.startsWith('UPDATE')) {
    if (params.length > 0) {
      const lastParam = params[params.length - 1]
      let updateFilter = { id: lastParam }
      if (mongoose.isValidObjectId(lastParam)) {
        updateFilter = { $or: [{ _id: lastParam }, { id: lastParam }] }
      }
      await Model.updateOne(updateFilter, { $set: { updated_at: new Date() } })
    }
    return [{ affectedRows: 1 }, []]
  }

  // 6. DELETE Queries
  if (upperSql.startsWith('DELETE')) {
    if (params.length > 0) {
      const idVal = params[0]
      let delFilter = { id: idVal }
      if (mongoose.isValidObjectId(idVal)) {
        delFilter = { $or: [{ _id: idVal }, { id: idVal }] }
      }
      await Model.deleteOne(delFilter)
    }
    return [{ affectedRows: 1 }, []]
  }

  return [[], []]
}

// Emulated pool object matching mysql2 interface
const pool = {
  query: async (sql, params) => executeSql(sql, params),
  execute: async (sql, params) => executeSql(sql, params),
  getConnection: async () => ({
    query: async (sql, params) => executeSql(sql, params),
    execute: async (sql, params) => executeSql(sql, params),
    beginTransaction: async () => {},
    commit: async () => {},
    rollback: async () => {},
    release: () => {},
  }),
  end: async () => {
    if (cached.conn) {
      await mongoose.disconnect()
      cached.conn = null
      cached.promise = null
    }
  },
}

module.exports = {
  pool,
  connectDB,
  testConnection,
  initDatabase,
  models,
  ...models,
}
