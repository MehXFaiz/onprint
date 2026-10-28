const { pool } = require('../config/database')
const { products: fallbackProducts } = require('../data/initialData')
const ApiError = require('../utils/ApiError')
const pageSeoService = require('../services/pageSeoService')

const PAGE_SIZE = 12

function generateSlug(name) {
  return (name || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

async function listProducts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const { category, featured, search, q } = req.query
    const searchQuery = search || q

    let list = []

    try {
      let query = `
        SELECT 
          p.id, p.product_key, p.name, p.slug, p.short_description AS shortDescription,
          p.description, p.price, p.minimum_quantity AS minimumQuantity,
          p.featured, p.specifications, p.active, p.created_at AS createdAt,
          p.seo_title AS seoTitle, p.seo_description AS seoDescription,
          p.seo_keywords AS seoKeywords, p.seo_heading AS seoHeading,
          p.canonical_url AS canonicalUrl, p.image_alt AS imageAlt,
          c.id AS cat_id, c.category_key AS cat_key, c.name AS cat_name, c.slug AS cat_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.active = 1
      `
      const params = []

      if (category) {
        const aliasMap = {
          'roll-up-banners-dubai': 'rollup-banners',
          'rollup-banners-dubai': 'rollup-banners',
          'roll-up-banners': 'rollup-banners',
          'stickers-printing-dubai': 'stickers-labels-printing',
          'custom-stickers-dubai': 'stickers-labels-printing',
          'custom-stamps-seals': 'stamps-printing-dubai',
          'stamps': 'stamps-printing-dubai',
          'business-cards': 'business-cards-printing',
          'business-cards-dubai': 'business-cards-printing',
          'corporate-gifts': 'corporate-gift-items',
        }
        const targetCategory = aliasMap[category] || category
        query += ' AND (c.slug = ? OR c.slug = ? OR c.category_key = ? OR CAST(c.id AS CHAR) = ?)'
        params.push(category, targetCategory, category, category)
      }

      if (featured === 'true' || featured === '1') {
        query += ' AND p.featured = 1'
      }

      if (searchQuery) {
        query += ' AND (p.name LIKE ? OR p.short_description LIKE ?)'
        const term = `%${searchQuery}%`
        params.push(term, term)
      }

      query += ' ORDER BY p.created_at DESC'

      const [rows] = await pool.execute(query, params)

      if (rows.length > 0) {
        const [images] = await pool.execute(
          'SELECT product_id, image_url, alt_text FROM product_images ORDER BY display_order ASC'
        )

        const imageMap = {}
        images.forEach((img) => {
          if (!imageMap[img.product_id]) imageMap[img.product_id] = []
          imageMap[img.product_id].push(img.image_url)
        })

        list = rows.map((p) => {
          const directImgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : null
          const mappedImgs =
            imageMap[p.slug] ||
            imageMap[p.product_key] ||
            imageMap[p.id] ||
            (p._id ? imageMap[p._id] : null)
          const finalImgs = directImgs || mappedImgs || ['/assets/products/1 (1).jpg']

          return {
            _id: p.product_key || `prod-${p.id}`,
            id: p.id,
            name: p.name,
            slug: p.slug,
            shortDescription: p.shortDescription,
            description: p.description,
            price: Number(p.price),
            minimumQuantity: p.minimumQuantity,
            featured: Boolean(p.featured),
            active: Boolean(p.active),
            seoTitle: p.seoTitle || `${p.name} | ONPRINT Dubai`,
            seoDescription: p.seoDescription || p.shortDescription || p.description || '',
            seoKeywords: p.seoKeywords || '',
            seoHeading: p.seoHeading || p.name,
            canonicalUrl: p.canonicalUrl || `https://www.0nprint.com/products/${p.slug}`,
            imageAlt: p.imageAlt || p.name,
            createdAt: p.createdAt,
            category: p.category || (p.cat_id
              ? { _id: p.cat_key || `cat-${p.cat_id}`, id: p.cat_id, name: p.cat_name, slug: p.cat_slug }
              : null),
            images: finalImgs,
          }
        })
      }
    } catch {
      // Fallback to static initial data
    }

    if (list.length === 0) {
      let filtered = fallbackProducts.filter((p) => p.active !== false)
      if (category) {
        const aliasMap = {
          'roll-up-banners-dubai': 'rollup-banners',
          'rollup-banners-dubai': 'rollup-banners',
          'roll-up-banners': 'rollup-banners',
          'stickers-printing-dubai': 'stickers-labels-printing',
          'custom-stickers-dubai': 'stickers-labels-printing',
          'custom-stamps-seals': 'stamps-printing-dubai',
          'stamps': 'stamps-printing-dubai',
          'business-cards': 'business-cards-printing',
          'business-cards-dubai': 'business-cards-printing',
          'corporate-gifts': 'corporate-gift-items',
        }
        const catQuery = String(category).toLowerCase()
        const targetQuery = (aliasMap[catQuery] || catQuery).toLowerCase()

        filtered = filtered.filter((p) => {
          const pCatSlug = p.category?.slug?.toLowerCase() || ''
          const pCatId = String(p.category?._id || '').toLowerCase()
          const pCatNumId = String(p.category?.id || '')
          const pCatName = p.category?.name?.toLowerCase() || ''

          if (
            pCatSlug === catQuery ||
            pCatSlug === targetQuery ||
            pCatId === catQuery ||
            pCatId === targetQuery ||
            pCatNumId === catQuery ||
            pCatNumId === targetQuery ||
            pCatName === catQuery ||
            pCatName === targetQuery
          ) {
            return true
          }

          if (Array.isArray(p.categories)) {
            return p.categories.some((c) => {
              const cSlug = c.slug?.toLowerCase() || ''
              const cId = String(c._id || '').toLowerCase()
              const cNumId = String(c.id || '')
              const cName = c.name?.toLowerCase() || ''
              return cSlug === catQuery || cId === catQuery || cNumId === catQuery || cName === catQuery
            })
          }

          return false
        })
      }
      if (featured === 'true' || featured === '1') filtered = filtered.filter((p) => p.featured)
      if (searchQuery) {
        const term = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            (p.shortDescription && p.shortDescription.toLowerCase().includes(term))
        )
      }
      list = filtered
    }

    const total = list.length
    const paginated = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    res.json({
      success: true,
      data: paginated,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE) || 1,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params

    try {
      const [rows] = await pool.execute(
        `SELECT 
          p.id, p.product_key, p.name, p.slug, p.short_description AS shortDescription,
          p.description, p.price, p.minimum_quantity AS minimumQuantity,
          p.featured, p.specifications, p.active, p.created_at AS createdAt,
          p.seo_title AS seoTitle, p.seo_description AS seoDescription,
          p.seo_keywords AS seoKeywords, p.seo_heading AS seoHeading,
          p.canonical_url AS canonicalUrl, p.image_alt AS imageAlt,
          c.id AS cat_id, c.category_key AS cat_key, c.name AS cat_name, c.slug AS cat_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE (p.slug = ? OR p.product_key = ? OR CAST(p.id AS CHAR) = ?) AND p.active = 1
        LIMIT 1`,
        [slug, slug, slug]
      )

      if (rows.length > 0) {
        const p = rows[0]
        const [images] = await pool.execute(
          'SELECT image_url, alt_text FROM product_images WHERE product_id = ? ORDER BY display_order ASC',
          [p.id]
        )

        const directImgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : null
        const queryImgs = images.length > 0 ? images.map((i) => i.image_url) : null
        const finalImgs = directImgs || queryImgs || ['/assets/products/1 (1).jpg']

        const product = {
          _id: p.product_key || `prod-${p.id}`,
          id: p.id,
          name: p.name,
          slug: p.slug,
          shortDescription: p.shortDescription,
          description: p.description,
          price: Number(p.price),
          minimumQuantity: p.minimumQuantity,
          featured: Boolean(p.featured),
          active: Boolean(p.active),
          seoTitle: p.seoTitle || `${p.name} | ONPRINT Dubai`,
          seoDescription: p.seoDescription || p.shortDescription || p.description || '',
          seoKeywords: p.seoKeywords || '',
          seoHeading: p.seoHeading || p.name,
          canonicalUrl: p.canonicalUrl || `https://www.0nprint.com/products/${p.slug}`,
          imageAlt: p.imageAlt || (images[0]?.alt_text) || p.name,
          createdAt: p.createdAt,
          category: p.category || (p.cat_id
            ? { _id: p.cat_key || `cat-${p.cat_id}`, id: p.cat_id, name: p.cat_name, slug: p.cat_slug }
            : null),
          images: finalImgs,
        }

        return res.json({ success: true, data: product })
      }
    } catch {
      // Fallback
    }

    const fallback = fallbackProducts.find((p) => p.slug === slug || p._id === slug || String(p.id) === slug)
    if (!fallback) throw new ApiError(404, 'Product not found')

    res.json({ success: true, data: fallback })
  } catch (err) {
    next(err)
  }
}

async function createProduct(req, res, next) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    const {
      name,
      slug,
      categoryId,
      shortDescription,
      description,
      price,
      minimumQuantity,
      featured,
      images,
      seoTitle,
      seoDescription,
      seoKeywords,
      seoHeading,
      imageAlt,
    } = req.body

    if (!name) throw new ApiError(400, 'Product name is required')

    const cleanSlug = generateSlug(slug || name)
    const cleanNameLower = name.trim().toLowerCase().replace(/\s+in\s+dubai$/i, '').replace(/\s+dubai$/i, '')
    const defaultSeoKeywords = `${cleanNameLower} dubai, custom ${cleanNameLower} uae, ${cleanNameLower} printing dubai, order ${cleanNameLower} dubai`
    const defaultSeoTitle = `${name.trim()} Dubai | Custom Printing UAE | ONPRINT`
    const defaultSeoDesc =
      shortDescription ||
      description ||
      `Order custom ${name.trim()} in Dubai & across the UAE. Precision commercial printing, artwork verification, and fast WhatsApp quotation.`

    const [result] = await connection.execute(
      `INSERT INTO products 
        (name, slug, category_id, short_description, description, price, minimum_quantity, featured, active,
         seo_title, seo_description, seo_keywords, seo_heading, image_alt, canonical_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        cleanSlug,
        categoryId || null,
        shortDescription || '',
        description || '',
        price || 0,
        minimumQuantity || 1,
        featured ? 1 : 0,
        seoTitle || defaultSeoTitle,
        seoDescription || defaultSeoDesc,
        seoKeywords || defaultSeoKeywords,
        seoHeading || `${name.trim()} in Dubai`,
        imageAlt || `${name.trim()} - Custom Commercial Printing in Dubai, UAE`,
        `https://www.0nprint.com/products/${cleanSlug}`,
      ]
    )

    const productId = result.insertId

    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await connection.execute(
          'INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES (?, ?, ?, ?)',
          [productId, images[i], imageAlt || name, i + 1]
        )
      }
    } else {
      await connection.execute(
        'INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES (?, ?, ?, 1)',
        [productId, '/assets/products/1 (1).jpg', imageAlt || name]
      )
    }

    await connection.commit()

    // Automatic sync with page_seo
    pageSeoService.autoCreateOrSyncEntitySeo('product', {
      id: productId,
      name,
      slug: cleanSlug,
      seo_title: seoTitle,
      seo_description: seoDescription || shortDescription || description,
      short_description: shortDescription,
      description,
      seo_keywords: seoKeywords,
      image_alt: imageAlt,
      canonical_url: `https://www.0nprint.com/products/${cleanSlug}`,
    }).catch((err) => console.warn('[PageSEO Sync] Product create warning:', err.message))

    res.status(201).json({
      success: true,
      data: {
        id: productId,
        _id: `prod-${productId}`,
        name,
        slug: cleanSlug,
        price,
        minimumQuantity,
      },
    })
  } catch (err) {
    await connection.rollback()
    next(err)
  } finally {
    connection.release()
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params
    const {
      name,
      slug,
      categoryId,
      shortDescription,
      description,
      price,
      minimumQuantity,
      featured,
      active,
      seoTitle,
      seoDescription,
      seoKeywords,
      seoHeading,
      imageAlt,
      images,
      image,
    } = req.body

    const cleanSlug = generateSlug(slug || name)

    const [result] = await pool.execute(
      `UPDATE products 
       SET name = ?, slug = ?, category_id = ?, short_description = ?, description = ?, price = ?, minimum_quantity = ?,
           featured = ?, active = ?, seo_title = ?, seo_description = ?, seo_keywords = ?, seo_heading = ?, image_alt = ?, canonical_url = ?
       WHERE id = ? OR product_key = ? OR slug = ?`,
      [
        name,
        cleanSlug,
        categoryId || null,
        shortDescription,
        description,
        price,
        minimumQuantity,
        featured ? 1 : 0,
        active ? 1 : 0,
        seoTitle || `${name} | ONPRINT Dubai`,
        seoDescription || shortDescription || description || '',
        seoKeywords || '',
        seoHeading || name,
        imageAlt || name,
        `https://www.0nprint.com/products/${cleanSlug}`,
        id,
        id,
        id,
      ]
    )

    if (result.affectedRows === 0) {
      throw new ApiError(404, 'Product not found')
    }

    // Sync product_images if provided
    const imageList = Array.isArray(images) && images.length > 0
      ? images
      : image
        ? [image]
        : null

    if (imageList && imageList.length > 0) {
      try {
        const [pRows] = await pool.execute(
          'SELECT id FROM products WHERE id = ? OR product_key = ? OR slug = ? LIMIT 1',
          [id, id, id]
        )
        if (pRows.length > 0) {
          const prodId = pRows[0].id
          await pool.execute('DELETE FROM product_images WHERE product_id = ?', [prodId])
          for (let i = 0; i < imageList.length; i++) {
            await pool.execute(
              'INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES (?, ?, ?, ?)',
              [prodId, imageList[i], imageAlt || name || '', i + 1]
            )
          }
        }
      } catch (imgErr) {
        console.warn('[Product Update] product_images update notice:', imgErr.message)
      }
    }

    // Automatic sync with page_seo
    pageSeoService.autoCreateOrSyncEntitySeo('product', {
      id,
      name,
      slug: cleanSlug,
      seo_title: seoTitle,
      seo_description: seoDescription || shortDescription || description,
      short_description: shortDescription,
      description,
      seo_keywords: seoKeywords,
      image_alt: imageAlt,
      canonical_url: `https://www.0nprint.com/products/${cleanSlug}`,
    }).catch((err) => console.warn('[PageSEO Sync] Product update warning:', err.message))

    res.json({ success: true, message: 'Product updated successfully' })
  } catch (err) {
    next(err)
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params

    const [result] = await pool.execute(
      'DELETE FROM products WHERE id = ? OR product_key = ? OR slug = ?',
      [id, id, id]
    )

    if (result.affectedRows === 0) {
      throw new ApiError(404, 'Product not found')
    }

    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
}
