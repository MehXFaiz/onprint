const { pool } = require('../config/database')
const ApiError = require('../utils/ApiError')
const persistentStore = require('../data/persistentStore')

function generateSlug(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

function calculateReadingTime(content) {
  if (!content) return 3
  const plainText = content.replace(/<[^>]+>/g, ' ')
  const words = plainText.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/**
 * Ensures slug is unique in MySQL (or appends suffix)
 */
async function getUniqueSlug(baseSlug, existingId = null) {
  let cleanSlug = generateSlug(baseSlug)
  if (!cleanSlug) cleanSlug = 'article'

  try {
    let query = 'SELECT id FROM blogs WHERE slug = ?'
    const params = [cleanSlug]
    if (existingId) {
      query += ' AND id != ?'
      params.push(existingId)
    }

    const [rows] = await pool.execute(query, params)
    if (rows.length === 0) return cleanSlug

    // Collision found: append suffix
    let suffix = 2
    while (true) {
      const candidate = `${cleanSlug}-${suffix}`
      let checkQuery = 'SELECT id FROM blogs WHERE slug = ?'
      const checkParams = [candidate]
      if (existingId) {
        checkQuery += ' AND id != ?'
        checkParams.push(existingId)
      }
      const [checkRows] = await pool.execute(checkQuery, checkParams)
      if (checkRows.length === 0) return candidate
      suffix++
    }
  } catch (err) {
    return cleanSlug
  }
}

/**
 * Public Blog List: Only returns published blogs with pagination, search, and category/product filters
 */
async function listPublicBlogs(req, res, next) {
  try {
    const { category, product, search, q, featured, limit = 12, page = 1, sort = 'newest' } = req.query
    const searchTerm = search || q
    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 12))
    const offset = (pageNum - 1) * limitNum

    let blogs = []
    let total = 0

    try {
      let whereClauses = [
        `b.status = 'published'`,
        `(b.published_at IS NULL OR b.published_at <= NOW())`
      ]
      const params = []

      if (category && category !== 'All') {
        if (!isNaN(category)) {
          whereClauses.push('b.category_id = ?')
          params.push(parseInt(category, 10))
        } else {
          whereClauses.push('(c.slug = ? OR c.name LIKE ?)')
          params.push(category, `%${category}%`)
        }
      }

      if (product && product !== 'All') {
        if (!isNaN(product)) {
          whereClauses.push('b.product_id = ?')
          params.push(parseInt(product, 10))
        } else {
          whereClauses.push('(p.slug = ? OR p.name LIKE ?)')
          params.push(product, `%${product}%`)
        }
      }

      if (featured === 'true' || featured === '1') {
        whereClauses.push('b.is_featured = 1')
      }

      if (searchTerm && searchTerm.trim()) {
        whereClauses.push('(b.title LIKE ? OR b.excerpt LIKE ? OR b.content LIKE ? OR b.focus_keyword LIKE ?)')
        const t = `%${searchTerm.trim()}%`
        params.push(t, t, t, t)
      }

      const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

      // Count query
      const countQuery = `
        SELECT COUNT(b.id) AS totalCount
        FROM blogs b
        LEFT JOIN categories c ON b.category_id = c.id
        LEFT JOIN products p ON b.product_id = p.id
        ${whereSql}
      `
      const [countRows] = await pool.execute(countQuery, params)
      total = countRows[0]?.totalCount || 0

      // Order query
      let orderSql = 'ORDER BY b.is_featured DESC, b.published_at DESC, b.id DESC'
      if (sort === 'oldest') orderSql = 'ORDER BY b.published_at ASC'
      if (sort === 'title') orderSql = 'ORDER BY b.title ASC'

      const dataQuery = `
        SELECT 
          b.id, b.title, b.slug, b.excerpt, b.content, b.featured_image, b.image_alt,
          b.category_id, b.product_id, b.author_name, b.status, b.is_featured,
          b.seo_title, b.meta_description, b.focus_keyword, b.secondary_keywords,
          b.canonical_url, b.og_title, b.og_description, b.og_image, b.schema_type,
          b.reading_time, b.target_location, b.published_at, b.created_at, b.updated_at,
          c.name AS category_name, c.slug AS category_slug,
          p.name AS product_name, p.slug AS product_slug, p.image AS product_image
        FROM blogs b
        LEFT JOIN categories c ON b.category_id = c.id
        LEFT JOIN products p ON b.product_id = p.id
        ${whereSql}
        ${orderSql}
        LIMIT ? OFFSET ?
      `
      const dataParams = [...params, limitNum, offset]
      const [rows] = await pool.query(dataQuery, dataParams)

      blogs = rows.map((r) => formatBlogRow(r))
    } catch (dbErr) {
      console.warn('[BlogController] MySQL listPublicBlogs fallback:', dbErr.message)
      // Persistent Store fallback
      let all = persistentStore.getBlogs().filter((b) => b.status === 'published')
      if (category && category !== 'All') {
        all = all.filter((b) => String(b.category_id) === String(category) || (b.category && b.category.toLowerCase().includes(category.toLowerCase())))
      }
      if (product && product !== 'All') {
        all = all.filter((b) => String(b.product_id) === String(product))
      }
      if (featured === 'true' || featured === '1') {
        all = all.filter((b) => b.is_featured === 1 || b.is_featured === true)
      }
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase()
        all = all.filter((b) => (b.title || '').toLowerCase().includes(term) || (b.excerpt || '').toLowerCase().includes(term) || (b.content || '').toLowerCase().includes(term))
      }
      total = all.length
      blogs = all.slice(offset, offset + limitNum).map((b) => formatBlogRow(b))
    }

    res.json({
      success: true,
      data: blogs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Admin Blog List: Returns all blogs with rich filtering and stats
 */
async function listAdminBlogs(req, res, next) {
  try {
    const { category_id, product_id, status, search, q, featured, limit = 50, page = 1, sort = 'newest' } = req.query
    const searchTerm = search || q
    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.max(1, Math.min(200, parseInt(limit, 10) || 50))
    const offset = (pageNum - 1) * limitNum

    let blogs = []
    let total = 0

    try {
      let whereClauses = []
      const params = []

      if (status && status !== 'all') {
        whereClauses.push('b.status = ?')
        params.push(status)
      }

      if (category_id && category_id !== 'all') {
        whereClauses.push('b.category_id = ?')
        params.push(parseInt(category_id, 10))
      }

      if (product_id && product_id !== 'all') {
        whereClauses.push('b.product_id = ?')
        params.push(parseInt(product_id, 10))
      }

      if (featured === 'true' || featured === '1') {
        whereClauses.push('b.is_featured = 1')
      }

      if (searchTerm && searchTerm.trim()) {
        whereClauses.push('(b.title LIKE ? OR b.excerpt LIKE ? OR b.slug LIKE ? OR b.focus_keyword LIKE ?)')
        const t = `%${searchTerm.trim()}%`
        params.push(t, t, t, t)
      }

      const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

      // Count query
      const countQuery = `
        SELECT COUNT(b.id) AS totalCount
        FROM blogs b
        LEFT JOIN categories c ON b.category_id = c.id
        LEFT JOIN products p ON b.product_id = p.id
        ${whereSql}
      `
      const [countRows] = await pool.execute(countQuery, params)
      total = countRows[0]?.totalCount || 0

      // Order
      let orderSql = 'ORDER BY b.created_at DESC, b.id DESC'
      if (sort === 'oldest') orderSql = 'ORDER BY b.created_at ASC'
      if (sort === 'published') orderSql = 'ORDER BY b.published_at DESC'
      if (sort === 'title') orderSql = 'ORDER BY b.title ASC'

      const dataQuery = `
        SELECT 
          b.id, b.title, b.slug, b.excerpt, b.content, b.featured_image, b.image_alt,
          b.category_id, b.product_id, b.author_name, b.status, b.is_featured,
          b.seo_title, b.meta_description, b.focus_keyword, b.secondary_keywords,
          b.canonical_url, b.og_title, b.og_description, b.og_image, b.schema_type,
          b.reading_time, b.target_location, b.published_at, b.created_at, b.updated_at,
          c.name AS category_name, c.slug AS category_slug,
          p.name AS product_name, p.slug AS product_slug, p.image AS product_image
        FROM blogs b
        LEFT JOIN categories c ON b.category_id = c.id
        LEFT JOIN products p ON b.product_id = p.id
        ${whereSql}
        ${orderSql}
        LIMIT ? OFFSET ?
      `
      const dataParams = [...params, limitNum, offset]
      const [rows] = await pool.query(dataQuery, dataParams)

      blogs = rows.map((r) => formatBlogRow(r))
    } catch (dbErr) {
      console.warn('[BlogController] MySQL listAdminBlogs fallback:', dbErr.message)
      let all = persistentStore.getBlogs()
      if (status && status !== 'all') {
        all = all.filter((b) => b.status === status)
      }
      if (category_id && category_id !== 'all') {
        all = all.filter((b) => String(b.category_id) === String(category_id))
      }
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase()
        all = all.filter((b) => (b.title || '').toLowerCase().includes(term) || (b.slug || '').toLowerCase().includes(term))
      }
      total = all.length
      blogs = all.slice(offset, offset + limitNum).map((b) => formatBlogRow(b))
    }

    res.json({
      success: true,
      data: blogs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Get dynamic blog dashboard statistics from MySQL
 */
async function getBlogStats(req, res, next) {
  try {
    let stats = {
      total: 0,
      published: 0,
      drafts: 0,
      scheduled: 0,
      featured: 0,
    }

    try {
      const [rows] = await pool.execute(`
        SELECT 
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'published' AND (published_at IS NULL OR published_at <= NOW()) THEN 1 ELSE 0 END) AS published,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS drafts,
          SUM(CASE WHEN status = 'scheduled' OR (status = 'published' AND published_at > NOW()) THEN 1 ELSE 0 END) AS scheduled,
          SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) AS featured
        FROM blogs
      `)
      if (rows.length > 0) {
        stats = {
          total: Number(rows[0].total) || 0,
          published: Number(rows[0].published) || 0,
          drafts: Number(rows[0].drafts) || 0,
          scheduled: Number(rows[0].scheduled) || 0,
          featured: Number(rows[0].featured) || 0,
        }
      }
    } catch (dbErr) {
      const all = persistentStore.getBlogs()
      stats = {
        total: all.length,
        published: all.filter((b) => b.status === 'published').length,
        drafts: all.filter((b) => b.status === 'draft').length,
        scheduled: all.filter((b) => b.status === 'scheduled').length,
        featured: all.filter((b) => b.is_featured === 1 || b.is_featured === true).length,
      }
    }

    res.json({ success: true, data: stats })
  } catch (err) {
    next(err)
  }
}

/**
 * Get single blog by slug or ID with dynamic related product, category, and related blogs
 */
async function getBlogBySlug(req, res, next) {
  try {
    const { slug } = req.params
    const isAdmin = Boolean(req.user && req.user.role === 'admin')

    let blog = null
    let relatedBlogs = []

    try {
      const [rows] = await pool.execute(
        `SELECT 
          b.id, b.title, b.slug, b.excerpt, b.content, b.featured_image, b.image_alt,
          b.category_id, b.product_id, b.author_name, b.status, b.is_featured,
          b.seo_title, b.meta_description, b.focus_keyword, b.secondary_keywords,
          b.canonical_url, b.og_title, b.og_description, b.og_image, b.schema_type,
          b.reading_time, b.target_location, b.published_at, b.created_at, b.updated_at,
          c.id AS cat_id, c.name AS category_name, c.slug AS category_slug, c.description AS category_description, c.image AS category_image,
          p.id AS prod_id, p.name AS product_name, p.slug AS product_slug, p.short_description AS product_description, p.image AS product_image, p.price AS product_price
        FROM blogs b
        LEFT JOIN categories c ON b.category_id = c.id
        LEFT JOIN products p ON b.product_id = p.id
        WHERE (b.slug = ? OR CAST(b.id AS CHAR) = ?)
        LIMIT 1`,
        [slug, slug]
      )

      if (rows.length > 0) {
        const row = rows[0]
        // Non-admin cannot view unpublished drafts
        if (!isAdmin && row.status !== 'published') {
          throw new ApiError(404, 'Blog article not found or not published')
        }

        blog = formatBlogRow(row)

        // Query related blogs:
        // Priority 1: Same product
        // Priority 2: Same category
        // Priority 3: Other published blogs
        const [relatedRows] = await pool.execute(
          `SELECT 
            b.id, b.title, b.slug, b.excerpt, b.featured_image, b.image_alt,
            b.category_id, b.reading_time, b.published_at,
            c.name AS category_name, c.slug AS category_slug
          FROM blogs b
          LEFT JOIN categories c ON b.category_id = c.id
          WHERE b.id != ? AND b.status = 'published' AND (b.published_at IS NULL OR b.published_at <= NOW())
          ORDER BY 
            (CASE WHEN ? IS NOT NULL AND b.product_id = ? THEN 3
                  WHEN ? IS NOT NULL AND b.category_id = ? THEN 2
                  ELSE 1 END) DESC,
            b.published_at DESC
          LIMIT 3`,
          [blog.id, blog.product_id, blog.product_id, blog.category_id, blog.category_id]
        )

        relatedBlogs = relatedRows.map((r) => formatBlogRow(r))
      }
    } catch (dbErr) {
      if (dbErr instanceof ApiError) throw dbErr
      console.warn('[BlogController] MySQL getBlogBySlug fallback:', dbErr.message)
      const found = persistentStore.getBlogBySlug(slug) || persistentStore.getBlog(slug)
      if (found) {
        if (!isAdmin && found.status !== 'published') {
          throw new ApiError(404, 'Blog article not found or not published')
        }
        blog = formatBlogRow(found)
        const allPublished = persistentStore.getBlogs().filter((b) => b.status === 'published' && b.id !== blog.id)
        relatedBlogs = allPublished.slice(0, 3).map((b) => formatBlogRow(b))
      }
    }

    if (!blog) {
      throw new ApiError(404, 'Blog article not found')
    }

    res.json({
      success: true,
      data: {
        ...blog,
        related: relatedBlogs,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Create blog post in MySQL with automated SEO and unique slug
 */
async function createBlog(req, res, next) {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      featuredImage,
      image_alt,
      imageAlt,
      category_id,
      product_id,
      author_id,
      author_name,
      author,
      status = 'draft',
      is_featured = 0,
      seo_title,
      seoTitle,
      meta_description,
      metaDescription,
      focus_keyword,
      secondary_keywords,
      canonical_url,
      og_title,
      og_description,
      og_image,
      schema_type = 'BlogPosting',
      reading_time,
      target_location,
      published_at,
    } = req.body

    if (!title || !title.trim()) {
      throw new ApiError(400, 'Blog title is required')
    }
    if (!content || !content.trim()) {
      throw new ApiError(400, 'Blog content is required')
    }

    const cleanTitle = title.trim()
    const cleanSlug = await getUniqueSlug(slug || cleanTitle)
    const img = featured_image || featuredImage || '/assets/products/1 (1).jpg'
    const alt = image_alt || imageAlt || `${cleanTitle} printing dubai`
    const calculatedReadingTime = reading_time ? parseInt(reading_time, 10) : calculateReadingTime(content)
    const publishDate = published_at || (status === 'published' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null)
    const isFeat = is_featured === true || is_featured === 1 || is_featured === '1' ? 1 : 0
    const catId = category_id && !isNaN(category_id) ? parseInt(category_id, 10) : null
    const prodId = product_id && !isNaN(product_id) ? parseInt(product_id, 10) : null
    const authId = author_id && !isNaN(author_id) ? parseInt(author_id, 10) : (req.user?.id || null)
    const authName = author_name || author || 'ONPRINT Editorial Team'

    const seoTit = seo_title || seoTitle || `${cleanTitle} | ONPRINT Dubai`
    const metaDesc = meta_description || metaDescription || excerpt || cleanTitle
    const focKey = focus_keyword || ''
    const secKeys = Array.isArray(secondary_keywords) ? secondary_keywords.join(', ') : (secondary_keywords || '')
    const canonUrl = canonical_url || `https://0nprint.com/blog/${cleanSlug}`
    const ogTit = og_title || seoTit
    const ogDesc = og_description || metaDesc
    const ogImg = og_image || img

    let insertedId = null

    try {
      const [result] = await pool.execute(
        `INSERT INTO blogs (
          title, slug, excerpt, content, featured_image, image_alt,
          category_id, product_id, author_id, author_name, status, is_featured,
          seo_title, meta_description, focus_keyword, secondary_keywords,
          canonical_url, og_title, og_description, og_image, schema_type,
          reading_time, target_location, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cleanTitle,
          cleanSlug,
          excerpt || '',
          content,
          img,
          alt,
          catId,
          prodId,
          authId,
          authName,
          status,
          isFeat,
          seoTit,
          metaDesc,
          focKey,
          secKeys,
          canonUrl,
          ogTit,
          ogDesc,
          ogImg,
          schema_type,
          calculatedReadingTime,
          target_location || null,
          publishDate,
        ]
      )
      insertedId = result.insertId
    } catch (dbErr) {
      console.warn('[BlogController] MySQL createBlog fallback:', dbErr.message)
      const stored = persistentStore.addBlog({
        title: cleanTitle,
        slug: cleanSlug,
        excerpt: excerpt || '',
        content,
        featured_image: img,
        image_alt: alt,
        category_id: catId,
        product_id: prodId,
        author_id: authId,
        author_name: authName,
        status,
        is_featured: isFeat,
        seo_title: seoTit,
        meta_description: metaDesc,
        focus_keyword: focKey,
        secondary_keywords: secKeys,
        canonical_url: canonUrl,
        og_title: ogTit,
        og_description: ogDesc,
        og_image: ogImg,
        schema_type,
        reading_time: calculatedReadingTime,
        target_location: target_location || null,
        published_at: publishDate,
      })
      insertedId = stored.id
    }

    res.status(201).json({
      success: true,
      message: 'Blog article created successfully',
      data: {
        id: insertedId,
        _id: `blog-${insertedId}`,
        title: cleanTitle,
        slug: cleanSlug,
        status,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Update blog post in MySQL
 */
async function updateBlog(req, res, next) {
  try {
    const { id } = req.params
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      featuredImage,
      image_alt,
      imageAlt,
      category_id,
      product_id,
      author_name,
      author,
      status,
      is_featured,
      seo_title,
      seoTitle,
      meta_description,
      metaDescription,
      focus_keyword,
      secondary_keywords,
      canonical_url,
      og_title,
      og_description,
      og_image,
      schema_type,
      reading_time,
      target_location,
      published_at,
    } = req.body

    const cleanTitle = title ? title.trim() : ''
    const cleanSlug = slug ? await getUniqueSlug(slug, id) : undefined
    const img = featured_image || featuredImage
    const alt = image_alt || imageAlt
    const calculatedReadingTime = reading_time ? parseInt(reading_time, 10) : (content ? calculateReadingTime(content) : undefined)
    const isFeat = is_featured !== undefined ? (is_featured === true || is_featured === 1 || is_featured === '1' ? 1 : 0) : undefined
    const catId = category_id !== undefined ? (category_id && !isNaN(category_id) ? parseInt(category_id, 10) : null) : undefined
    const prodId = product_id !== undefined ? (product_id && !isNaN(product_id) ? parseInt(product_id, 10) : null) : undefined
    const secKeys = Array.isArray(secondary_keywords) ? secondary_keywords.join(', ') : secondary_keywords

    try {
      const [result] = await pool.execute(
        `UPDATE blogs SET
          title = COALESCE(?, title),
          slug = COALESCE(?, slug),
          excerpt = COALESCE(?, excerpt),
          content = COALESCE(?, content),
          featured_image = COALESCE(?, featured_image),
          image_alt = COALESCE(?, image_alt),
          category_id = COALESCE(?, category_id),
          product_id = COALESCE(?, product_id),
          author_name = COALESCE(?, author_name),
          status = COALESCE(?, status),
          is_featured = COALESCE(?, is_featured),
          seo_title = COALESCE(?, seo_title),
          meta_description = COALESCE(?, meta_description),
          focus_keyword = COALESCE(?, focus_keyword),
          secondary_keywords = COALESCE(?, secondary_keywords),
          canonical_url = COALESCE(?, canonical_url),
          og_title = COALESCE(?, og_title),
          og_description = COALESCE(?, og_description),
          og_image = COALESCE(?, og_image),
          schema_type = COALESCE(?, schema_type),
          reading_time = COALESCE(?, reading_time),
          target_location = COALESCE(?, target_location),
          published_at = COALESCE(?, published_at)
        WHERE id = ? OR slug = ?`,
        [
          cleanTitle || null,
          cleanSlug || null,
          excerpt !== undefined ? excerpt : null,
          content || null,
          img || null,
          alt || null,
          catId,
          prodId,
          author_name || author || null,
          status || null,
          isFeat,
          seo_title || seoTitle || null,
          meta_description || metaDescription || null,
          focus_keyword || null,
          secKeys !== undefined ? secKeys : null,
          canonical_url || null,
          og_title || null,
          og_description || null,
          og_image || null,
          schema_type || null,
          calculatedReadingTime || null,
          target_location || null,
          published_at || null,
          id,
          id,
        ]
      )

      if (result.affectedRows === 0) {
        // Fallback update in persistentStore
        const updated = persistentStore.updateBlog(id, req.body)
        if (!updated) throw new ApiError(404, 'Blog article not found')
      }
    } catch (dbErr) {
      if (dbErr instanceof ApiError) throw dbErr
      console.warn('[BlogController] MySQL updateBlog fallback:', dbErr.message)
      const updated = persistentStore.updateBlog(id, req.body)
      if (!updated) throw new ApiError(404, 'Blog article not found')
    }

    res.json({ success: true, message: 'Blog article updated successfully' })
  } catch (err) {
    next(err)
  }
}

/**
 * Delete blog post
 */
async function deleteBlog(req, res, next) {
  try {
    const { id } = req.params

    try {
      const [result] = await pool.execute('DELETE FROM blogs WHERE id = ? OR slug = ?', [id, id])
      if (result.affectedRows === 0) {
        persistentStore.deleteBlog(id)
      }
    } catch (dbErr) {
      console.warn('[BlogController] MySQL deleteBlog fallback:', dbErr.message)
      persistentStore.deleteBlog(id)
    }

    res.json({ success: true, message: 'Blog article deleted successfully' })
  } catch (err) {
    next(err)
  }
}

/**
 * Bulk delete blogs
 */
async function bulkDeleteBlogs(req, res, next) {
  try {
    const { blogIds } = req.body
    if (!Array.isArray(blogIds) || blogIds.length === 0) {
      throw new ApiError(400, 'Please provide an array of blog IDs to delete')
    }

    try {
      const placeholders = blogIds.map(() => '?').join(',')
      await pool.query(`DELETE FROM blogs WHERE id IN (${placeholders})`, blogIds)
    } catch (dbErr) {
      console.warn('[BlogController] MySQL bulkDeleteBlogs fallback:', dbErr.message)
    }

    persistentStore.deleteBlogs(blogIds)

    res.json({
      success: true,
      message: `Successfully deleted ${blogIds.length} article(s)`,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Quick Publish Blog
 */
async function publishBlog(req, res, next) {
  try {
    const { id } = req.params
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    try {
      await pool.execute(
        `UPDATE blogs SET status = 'published', published_at = IF(published_at IS NULL, NOW(), published_at) WHERE id = ? OR slug = ?`,
        [id, id]
      )
    } catch (dbErr) {
      persistentStore.updateBlog(id, { status: 'published', published_at: now })
    }

    res.json({ success: true, message: 'Article published successfully' })
  } catch (err) {
    next(err)
  }
}

/**
 * Quick Unpublish Blog (Save as Draft)
 */
async function unpublishBlog(req, res, next) {
  try {
    const { id } = req.params

    try {
      await pool.execute(`UPDATE blogs SET status = 'draft' WHERE id = ? OR slug = ?`, [id, id])
    } catch (dbErr) {
      persistentStore.updateBlog(id, { status: 'draft' })
    }

    res.json({ success: true, message: 'Article moved to draft' })
  } catch (err) {
    next(err)
  }
}

/**
 * Toggle is_featured
 */
async function toggleFeaturedBlog(req, res, next) {
  try {
    const { id } = req.params

    try {
      await pool.execute(`UPDATE blogs SET is_featured = IF(is_featured = 1, 0, 1) WHERE id = ? OR slug = ?`, [id, id])
    } catch (dbErr) {
      const current = persistentStore.getBlog(id)
      if (current) {
        persistentStore.updateBlog(id, { is_featured: current.is_featured ? 0 : 1 })
      }
    }

    res.json({ success: true, message: 'Featured status updated' })
  } catch (err) {
    next(err)
  }
}

/**
 * AI Content & SEO Generator
 * Generates an SEO-structured, technically accurate printing article without AI filler/spam.
 */
async function generateBlogContent(req, res, next) {
  try {
    const {
      title,
      topic,
      category_id,
      product_id,
      focus_keyword,
      target_location = 'Dubai',
      tone = 'authoritative and commercial',
    } = req.body

    let categoryName = 'Commercial Printing'
    let productName = ''
    let productDetails = ''

    // Resolve category and product details from MySQL
    try {
      if (category_id) {
        const [cats] = await pool.execute('SELECT name, description FROM categories WHERE id = ?', [category_id])
        if (cats.length > 0) {
          categoryName = cats[0].name
        }
      }
      if (product_id) {
        const [prods] = await pool.execute('SELECT name, short_description, description FROM products WHERE id = ?', [product_id])
        if (prods.length > 0) {
          productName = prods[0].name
          productDetails = prods[0].short_description || prods[0].description || ''
        }
      }
    } catch (e) {
      // ignore
    }

    const mainTopic = title || topic || `${categoryName} for Dubai Businesses`
    const loc = target_location ? target_location.trim() : 'Dubai'
    const keyword = focus_keyword || `${categoryName.toLowerCase()} ${loc.toLowerCase()}`

    // Build intelligent structured printing article
    const generatedArticle = generatePrintingArticleBody({
      title: mainTopic,
      categoryName,
      productName,
      productDetails,
      keyword,
      location: loc,
    })

    res.json({
      success: true,
      data: generatedArticle,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * AI Image Generator & Asset Matcher
 */
async function generateBlogImage(req, res, next) {
  try {
    const { title, category_id, product_id, focus_keyword } = req.body

    let categorySlug = 'brochures-printing'
    let categoryName = 'Commercial Printing'

    try {
      if (category_id) {
        const [cats] = await pool.execute('SELECT name, slug FROM categories WHERE id = ?', [category_id])
        if (cats.length > 0) {
          categorySlug = cats[0].slug
          categoryName = cats[0].name
        }
      }
    } catch (e) {}

    // Map to relevant high-resolution photography asset
    const categoryImageMap = {
      'brochures-printing': '/assets/brochures-CO2Zibqf.jpg',
      'business-cards-printing': '/assets/business-cards-printing.jpg',
      'flyers-printing-in-dubai': '/assets/flyers-B0qaxRv8.jpg',
      'id-card-printing-dubai': '/assets/id_cards-CBY1y0hj.jpg',
      'lanyard-printing-dubai': '/assets/lanyard-printing-dubai.jpg',
      'letterheads-printing-dubai': '/assets/letterheads-printing-dubai.jpg',
      'mugs-printing-in-dubai': '/assets/mugs-yagEE7gO.jpg',
      'name-badges-printing-dubai': '/assets/name_badges-C9R9b0eN.jpg',
      'name-plates-printing-dubai': '/assets/name_plates-DsWAdPql.jpg',
      'promotional-gift-items-dubai': '/assets/water_bottles-Bpl23Qvg.jpg',
      'rollup-banner-printing-dubai': '/assets/rollup_banner-C-Zwm6RF.jpg',
      'stickers-printing-dubai': '/assets/stickers-UAmhWS4r.jpg',
      'tote-bags-printing-dubai': '/assets/tote_bags-Cl2-5YpR.jpg',
      'wooden-keychain-printing-dubai': '/assets/wooden_keychain-Bqolrktp.jpg',
      'flags-printing-dubai': '/assets/flags-ZdXWAOJb.jpg',
    }

    const selectedImage = categoryImageMap[categorySlug] || '/assets/brochures-CO2Zibqf.jpg'
    const meaningfulAlt = `${title || categoryName} — Professional Commercial Printing Services in Dubai, UAE`

    res.json({
      success: true,
      data: {
        imageUrl: selectedImage,
        imageAlt: meaningfulAlt,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Structured printing article generator
 */
function generatePrintingArticleBody({ title, categoryName, productName, productDetails, keyword, location }) {
  const cleanTitle = title.replace(/\s+/g, ' ').trim()
  const slug = generateSlug(cleanTitle)

  const h2_1 = `Why Premium ${categoryName} Matters for ${location} Corporate Brands`
  const h2_2 = `Material Selection & Paper GSM Specifications`
  const h2_3 = `Finishing Techniques: Foiling, Spot UV & Lamination`
  const h2_4 = `Artwork Preparation & CMYK Pre-Press Best Practices`
  const h2_5 = `Ordering ${productName ? productName : categoryName} with ONPRINT Dubai`

  const contentHtml = `
<p class="lead">In a competitive commercial market like ${location}, tactile brand collateral makes an indelible impression on clients and stakeholders. Whether you are distributing executive marketing literature at Dubai World Trade Centre or presenting corporate contracts in DIFC, high-fidelity <strong>${keyword}</strong> sets the benchmark for professionalism.</p>

<h2>${h2_1}</h2>
<p>First impressions in business happen in seconds. When a partner holds a brochure, receives a business card, or inspects custom event packaging, the weight of the cardstock, the crispness of typography, and color fidelity communicate brand trust immediately.</p>
<p>Modern digital and offset printing presses allow businesses to achieve ultra-sharp vector details, Pantone color matching, and consistent corporate branding across all physical touchpoints.</p>

<h2>${h2_2}</h2>
<p>Selecting the correct substrate is crucial for durability, aesthetic appeal, and print texture. Common industry standards include:</p>
<ul>
  <li><strong>350gsm – 450gsm Premium Silk / Art Card:</strong> Ideal for luxury business cards, presentation folders, and heavy brochure covers.</li>
  <li><strong>170gsm – 250gsm Coated Matte / Gloss Paper:</strong> Perfect for corporate marketing brochures, event leaflets, and catalog inner leaves.</li>
  <li><strong>100gsm – 120gsm Uncoated Smooth Stationery:</strong> Recommended for official laser-compatible letterheads, corporate invoices, and executive correspondence.</li>
</ul>

<h2>${h2_3}</h2>
<p>Elevate your print materials with specialized finishing processes that reflect true craftmanship:</p>
<ul>
  <li><strong>Soft-Touch Velvet Lamination:</strong> Imparts a suede-like tactile surface while protecting paper fibers from scratching and moisture.</li>
  <li><strong>Metallic Hot Foil Stamping:</strong> Gold, silver, copper, or holographic foils applied with heated brass dies for high-end corporate identity.</li>
  <li><strong>Raised Spot UV Varnishing:</strong> Targeted high-gloss coating that creates dramatic contrast against velvety matte backgrounds.</li>
  <li><strong>Custom Die-Cutting:</strong> Precision contour cutting for bespoke pocket folders, badge windows, and distinctive silhouette edges.</li>
</ul>

<h2>${h2_4}</h2>
<p>To guarantee zero production delays and flawless output on Dubai press lines, ensure your creative team follows pre-press standards:</p>
<ol>
  <li><strong>Color Mode:</strong> Convert all RGB graphics and photographs to CMYK (FOGRA39 or GRACoL profiles).</li>
  <li><strong>Bleed Allowance:</strong> Include a minimum of 3mm bleed on all outer trimming margins.</li>
  <li><strong>Safe Zone Margins:</strong> Keep vital typography and logos at least 4mm inside the trim cut line.</li>
  <li><strong>Resolution:</strong> Ensure all rasterized bitmap imagery maintains a minimum of 300 DPI at 100% scale.</li>
  <li><strong>Font Outlining:</strong> Convert all typefaces to vector outlines / curves before exporting print-ready PDF/X-1a files.</li>
</ol>

<h2>${h2_5}</h2>
<p>At <strong>ONPRINT</strong>, our Dubai production studio combines German offset precision with high-speed digital printing to deliver bespoke solutions for businesses across the UAE.</p>
<p>From initial digital PDF proofing to doorstep delivery across Dubai, Sharjah, and Abu Dhabi, our pre-press team ensures every single print run meets international quality standards.</p>
`.trim()

  const excerpt = `Discover how professional ${keyword} elevates your corporate brand in ${location}. Complete technical guide on paper GSM, luxury laminations, Pantone fidelity, and pre-press setup.`
  const seoTitle = `${cleanTitle} | ONPRINT ${location}`.slice(0, 60)
  const metaDescription = `Expert guide to ${keyword}. Learn about paper weights, hot foil stamping, soft-touch lamination, and fast turnarounds in ${location}.`.slice(0, 160)

  return {
    title: cleanTitle,
    slug,
    excerpt,
    content: contentHtml,
    reading_time: 4,
    category: categoryName,
    focus_keyword: keyword,
    secondary_keywords: `${categoryName.toLowerCase()}, commercial printing dubai, custom printing uae, print finishing dubai`,
    seo_title: seoTitle,
    meta_description: metaDescription,
    canonical_url: `https://0nprint.com/blog/${slug}`,
    target_location: location,
    image_alt: `${cleanTitle} — ONPRINT Dubai`,
  }
}

/**
 * Helper to normalize blog database fields for frontend consumption
 */
function formatBlogRow(r) {
  const id = r.id
  const featImg = r.featured_image || r.featuredImage || '/assets/products/1 (1).jpg'
  const alt = r.image_alt || r.imageAlt || r.title

  let categoryObj = null
  if (r.category_id || r.category_name) {
    categoryObj = {
      id: r.category_id || r.cat_id,
      name: r.category_name || r.category || 'Commercial Printing',
      slug: r.category_slug || generateSlug(r.category_name || r.category || 'commercial-printing'),
      description: r.category_description || null,
      image: r.category_image || null,
    }
  }

  let productObj = null
  if (r.product_id || r.product_name) {
    productObj = {
      id: r.product_id || r.prod_id,
      name: r.product_name || 'Custom Print Solution',
      slug: r.product_slug || generateSlug(r.product_name || 'custom-print'),
      description: r.product_description || null,
      image: r.product_image || featImg,
      price: r.product_price || null,
    }
  }

  return {
    id,
    _id: `blog-${id}`,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt || '',
    content: r.content || '',
    featured_image: featImg,
    featuredImage: featImg,
    image_alt: alt,
    imageAlt: alt,
    category_id: r.category_id || null,
    category: r.category_name || r.category || 'Printing & Branding',
    categoryData: categoryObj,
    product_id: r.product_id || null,
    product: r.product_name || null,
    productData: productObj,
    author: r.author_name || r.author || 'ONPRINT Editorial Team',
    author_name: r.author_name || r.author || 'ONPRINT Editorial Team',
    status: r.status || 'draft',
    is_featured: r.is_featured === 1 || r.is_featured === true || r.is_featured === '1',
    reading_time: r.reading_time ? `${r.reading_time} min read` : '4 min read',
    readTime: r.reading_time ? `${r.reading_time} min read` : (r.read_time || '4 min read'),
    seo_title: r.seo_title || `${r.title} | ONPRINT Blog`,
    seoTitle: r.seo_title || `${r.title} | ONPRINT Blog`,
    meta_description: r.meta_description || r.excerpt || '',
    seoDescription: r.meta_description || r.excerpt || '',
    focus_keyword: r.focus_keyword || '',
    seoKeywords: r.focus_keyword || r.secondary_keywords || '',
    secondary_keywords: r.secondary_keywords || '',
    canonical_url: r.canonical_url || `https://0nprint.com/blog/${r.slug}`,
    canonicalUrl: r.canonical_url || `https://0nprint.com/blog/${r.slug}`,
    og_title: r.og_title || r.seo_title || r.title,
    og_description: r.og_description || r.meta_description || r.excerpt || '',
    og_image: r.og_image || featImg,
    schema_type: r.schema_type || 'BlogPosting',
    target_location: r.target_location || null,
    published_at: r.published_at || r.created_at,
    publishedAt: r.published_at || r.created_at,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }
}

module.exports = {
  listPublicBlogs,
  listAdminBlogs,
  getBlogStats,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  bulkDeleteBlogs,
  publishBlog,
  unpublishBlog,
  toggleFeaturedBlog,
  generateBlogContent,
  generateBlogImage,
  // Backwards compatibility aliases
  listBlogPosts: listPublicBlogs,
  getBlogPostBySlug: getBlogBySlug,
  createBlogPost: createBlog,
  updateBlogPost: updateBlog,
  deleteBlogPost: deleteBlog,
}
