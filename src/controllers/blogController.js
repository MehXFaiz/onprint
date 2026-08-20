const { pool, seedBlogArticles } = require('../config/database')
const ApiError = require('../utils/ApiError')

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

async function listBlogPosts(req, res, next) {
  try {
    const { category, search, q, limit = 50, page = 1 } = req.query
    const searchTerm = search || q
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10)

    let list = []
    let total = 0

    try {
      let query = `
        SELECT 
          id, title, slug, excerpt, content, category,
          featured_image AS featuredImage, image_alt AS imageAlt,
          author, read_time AS readTime, seo_title AS seoTitle,
          seo_description AS seoDescription, seo_keywords AS seoKeywords,
          canonical_url AS canonicalUrl, published_at AS publishedAt,
          active, created_at AS createdAt, updated_at AS updatedAt
        FROM blog_posts
        WHERE active = 1
      `
      const params = []

      if (category && category !== 'All') {
        query += ' AND category = ?'
        params.push(category)
      }

      if (searchTerm) {
        query += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)'
        const t = `%${searchTerm}%`
        params.push(t, t, t)
      }

      query += ' ORDER BY published_at DESC, created_at DESC'

      const [rows] = await pool.execute(query, params)
      if (rows.length > 0) {
        total = rows.length
        list = rows.slice(offset, offset + parseInt(limit, 10)).map((r) => ({
          ...r,
          _id: `blog-${r.id}`,
          featuredImage: r.featuredImage || '/assets/products/1 (7).jpg',
          imageAlt: r.imageAlt || r.title,
        }))
      }
    } catch {
      // fallback
    }

    if (list.length === 0 && seedBlogArticles) {
      let filtered = [...seedBlogArticles]
      if (category && category !== 'All') {
        filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase())
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(term) ||
            p.excerpt.toLowerCase().includes(term) ||
            p.content.toLowerCase().includes(term)
        )
      }
      total = filtered.length
      list = filtered.map((p, idx) => ({
        id: idx + 1,
        _id: `blog-${idx + 1}`,
        title: p.title,
        slug: p.slug,
        category: p.category,
        author: p.author || 'ONPRINT Studio',
        readTime: p.read_time || '5 min read',
        excerpt: p.excerpt,
        content: p.content,
        featuredImage: p.featured_image || '/assets/products/1 (7).jpg',
        imageAlt: p.image_alt || p.title,
        seoTitle: p.seo_title,
        seoDescription: p.seo_description,
        seoKeywords: p.seo_keywords,
        canonicalUrl: p.canonical_url,
        publishedAt: new Date(Date.now() - idx * 86400000).toISOString(),
        active: true,
      }))
    }

    res.json({
      success: true,
      data: list,
      pagination: {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function getBlogPostBySlug(req, res, next) {
  try {
    const { slug } = req.params

    try {
      const [rows] = await pool.execute(
        `SELECT 
          id, title, slug, excerpt, content, category,
          featured_image AS featuredImage, image_alt AS imageAlt,
          author, read_time AS readTime, seo_title AS seoTitle,
          seo_description AS seoDescription, seo_keywords AS seoKeywords,
          canonical_url AS canonicalUrl, published_at AS publishedAt,
          active, created_at AS createdAt, updated_at AS updatedAt
        FROM blog_posts
        WHERE (slug = ? OR CAST(id AS CHAR) = ?) AND active = 1
        LIMIT 1`,
        [slug, slug]
      )

      if (rows.length > 0) {
        const post = rows[0]

        // Fetch 3 related posts
        const [relatedRows] = await pool.execute(
          `SELECT id, title, slug, excerpt, category, featured_image AS featuredImage, image_alt AS imageAlt, read_time AS readTime, published_at AS publishedAt
           FROM blog_posts
           WHERE id != ? AND active = 1
           ORDER BY (category = ?) DESC, published_at DESC
           LIMIT 3`,
          [post.id, post.category]
        )

        return res.json({
          success: true,
          data: {
            ...post,
            _id: `blog-${post.id}`,
            featuredImage: post.featuredImage || '/assets/products/1 (7).jpg',
            imageAlt: post.imageAlt || post.title,
            related: relatedRows.map((r) => ({
              ...r,
              _id: `blog-${r.id}`,
              featuredImage: r.featuredImage || '/assets/products/1 (7).jpg',
              imageAlt: r.imageAlt || r.title,
            })),
          },
        })
      }
    } catch {
      // fallback
    }

    if (seedBlogArticles) {
      const found = seedBlogArticles.find((p) => p.slug === slug)
      if (found) {
        const related = seedBlogArticles
          .filter((p) => p.slug !== slug)
          .slice(0, 3)
          .map((p, idx) => ({
            id: idx + 2,
            _id: `blog-${idx + 2}`,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            category: p.category,
            readTime: p.read_time,
            featuredImage: p.featured_image || '/assets/products/1 (7).jpg',
            imageAlt: p.image_alt || p.title,
          }))

        return res.json({
          success: true,
          data: {
            id: 1,
            _id: 'blog-1',
            title: found.title,
            slug: found.slug,
            category: found.category,
            author: found.author || 'ONPRINT Studio',
            readTime: found.read_time || '5 min read',
            excerpt: found.excerpt,
            content: found.content,
            featuredImage: found.featured_image || '/assets/products/1 (7).jpg',
            imageAlt: found.image_alt || found.title,
            seoTitle: found.seo_title,
            seoDescription: found.seo_description,
            seoKeywords: found.seo_keywords,
            canonicalUrl: found.canonical_url,
            publishedAt: new Date().toISOString(),
            related,
          },
        })
      }
    }

    throw new ApiError(404, 'Blog article not found')
  } catch (err) {
    next(err)
  }
}

async function createBlogPost(req, res, next) {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      featuredImage,
      imageAlt,
      author,
      readTime,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
    } = req.body

    if (!title) throw new ApiError(400, 'Article title is required')
    if (!content) throw new ApiError(400, 'Article content is required')

    const cleanSlug = generateSlug(slug || title)

    const [result] = await pool.execute(
      `INSERT INTO blog_posts
       (title, slug, excerpt, content, category, featured_image, image_alt, author, read_time, seo_title, seo_description, seo_keywords, canonical_url, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        title.trim(),
        cleanSlug,
        excerpt || '',
        content,
        category || 'Printing & Branding',
        featuredImage || '/assets/products/1 (7).jpg',
        imageAlt || title,
        author || 'ONPRINT Studio',
        readTime || '5 min read',
        seoTitle || `${title} | ONPRINT Dubai`,
        seoDescription || excerpt || '',
        seoKeywords || '',
        canonicalUrl || `https://0nprint.com/blog/${cleanSlug}`,
      ]
    )

    res.status(201).json({
      success: true,
      message: 'Article published successfully',
      data: {
        id: result.insertId,
        _id: `blog-${result.insertId}`,
        title,
        slug: cleanSlug,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function updateBlogPost(req, res, next) {
  try {
    const { id } = req.params
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      featuredImage,
      imageAlt,
      author,
      readTime,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      active,
    } = req.body

    const cleanSlug = generateSlug(slug || title)

    const [result] = await pool.execute(
      `UPDATE blog_posts
       SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, featured_image = ?, image_alt = ?, author = ?, read_time = ?, seo_title = ?, seo_description = ?, seo_keywords = ?, canonical_url = ?, active = ?
       WHERE id = ? OR slug = ?`,
      [
        title,
        cleanSlug,
        excerpt || '',
        content,
        category,
        featuredImage,
        imageAlt,
        author,
        readTime,
        seoTitle,
        seoDescription,
        seoKeywords,
        canonicalUrl,
        active !== false ? 1 : 0,
        id,
        id,
      ]
    )

    if (result.affectedRows === 0) {
      throw new ApiError(404, 'Article not found')
    }

    res.json({ success: true, message: 'Article updated successfully' })
  } catch (err) {
    next(err)
  }
}

async function deleteBlogPost(req, res, next) {
  try {
    const { id } = req.params
    const [result] = await pool.execute('DELETE FROM blog_posts WHERE id = ? OR slug = ?', [id, id])

    if (result.affectedRows === 0) {
      throw new ApiError(404, 'Article not found')
    }

    res.json({ success: true, message: 'Article deleted successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
}
