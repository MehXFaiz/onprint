const { pool } = require('../config/database')
const ApiError = require('../utils/ApiError')

// Helper function to generate clean URL slug
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

// Initial seed categories if MySQL table is completely empty
const initialSeedCategories = [
  {
    id: 1,
    category_key: 'cat-corporate-gifts',
    name: 'Corporate Gift Items',
    slug: 'corporate-gift-items',
    description: 'Premium branded gifts, apparel, mugs, and giveaways designed for businesses and corporate events in Dubai.',
    image: '/assets/products/1 (1).jpg',
    image_url: '/assets/products/1 (1).jpg',
    status: 'active',
    display_order: 1,
    active: 1,
  },
  {
    id: 2,
    category_key: 'cat-office-stationery',
    name: 'Office Stationery Printing',
    slug: 'office-stationery-printing',
    description: 'Executive notebooks, pens, business cards, and letterheads tailored for professional brand correspondence.',
    image: '/assets/products/1 (7).jpg',
    image_url: '/assets/products/1 (7).jpg',
    status: 'active',
    display_order: 2,
    active: 1,
  },
  {
    id: 3,
    category_key: 'cat-other-products',
    name: 'Other Products',
    slug: 'other-products',
    description: 'Large-format roll-ups, outdoor flags, die-cut vinyl stickers, and acrylic executive nameplates.',
    image: '/assets/products/1 (9).jpg',
    image_url: '/assets/products/1 (9).jpg',
    status: 'active',
    display_order: 3,
    active: 1,
  },
]

async function seedCategoriesIfEmpty() {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM categories')
    if (rows[0].count === 0) {
      console.log('[Categories] Seeding initial MySQL category records...')
      for (const cat of initialSeedCategories) {
        await pool.query(
          `INSERT INTO categories (id, category_key, name, slug, description, image, image_url, status, display_order, active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name)`,
          [cat.id, cat.category_key, cat.name, cat.slug, cat.description, cat.image, cat.image_url, cat.status, cat.display_order, cat.active]
        )
      }
    }
  } catch (err) {
    console.warn('[Categories] MySQL seed check note:', err.message)
  }
}

async function listCategories(req, res, next) {
  try {
    console.log('[Categories] GET request received for categories list')
    await seedCategoriesIfEmpty()

    const { search, status, sort } = req.query

    let query = `
      SELECT 
        c.id, c.category_key, c.name, c.slug, c.description,
        COALESCE(c.image, c.image_url) AS image,
        COALESCE(c.image_url, c.image) AS image_url,
        c.status, c.display_order AS displayOrder, c.active,
        c.created_at AS createdAt, c.updated_at AS updatedAt,
        COUNT(p.id) AS productCount
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id OR (c.category_key IS NOT NULL AND p.category_id IS NULL)
      WHERE 1=1
    `
    const params = []

    if (status && status !== 'all') {
      query += ' AND (c.status = ? OR (c.status IS NULL AND c.active = ?))'
      params.push(status, status === 'active' ? 1 : 0)
    }

    if (search) {
      query += ' AND (c.name LIKE ? OR c.slug LIKE ? OR c.description LIKE ?)'
      const term = `%${search}%`
      params.push(term, term, term)
    }

    query += ' GROUP BY c.id'

    if (sort === 'name_asc') {
      query += ' ORDER BY c.name ASC'
    } else if (sort === 'name_desc') {
      query += ' ORDER BY c.name DESC'
    } else if (sort === 'created_at_desc') {
      query += ' ORDER BY c.created_at DESC'
    } else if (sort === 'display_order_desc') {
      query += ' ORDER BY c.display_order DESC, c.name ASC'
    } else {
      query += ' ORDER BY c.display_order ASC, c.name ASC'
    }

    const [rows] = await pool.execute(query, params)

    const list = rows.map((c) => ({
      id: c.id,
      _id: c.category_key || `cat-${c.id}`,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image: c.image || '/assets/products/1 (1).jpg',
      image_url: c.image_url || c.image || '/assets/products/1 (1).jpg',
      status: c.status || (c.active ? 'active' : 'inactive'),
      active: Boolean(c.active !== 0 && c.status !== 'inactive'),
      displayOrder: Number(c.displayOrder || 0),
      display_order: Number(c.displayOrder || 0),
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      productCount: Number(c.productCount || 0),
    }))

    console.log(`[Categories] Fetched ${list.length} categories from MySQL`)
    res.json({ success: true, data: list })
  } catch (err) {
    console.error('[Categories] MySQL error in listCategories:', err.message)
    next(err)
  }
}

async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params
    console.log(`[Categories] GET request received for category ID/slug: ${id}`)

    const [rows] = await pool.execute(
      `SELECT 
        c.id, c.category_key, c.name, c.slug, c.description,
        COALESCE(c.image, c.image_url) AS image,
        COALESCE(c.image_url, c.image) AS image_url,
        c.status, c.display_order AS displayOrder, c.active,
        c.created_at AS createdAt, c.updated_at AS updatedAt,
        COUNT(p.id) AS productCount
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      WHERE c.id = ? OR c.category_key = ? OR c.slug = ?
      GROUP BY c.id
      LIMIT 1`,
      [id, id, id]
    )

    if (rows.length === 0) {
      throw new ApiError(404, 'Category not found')
    }

    const c = rows[0]
    const categoryData = {
      id: c.id,
      _id: c.category_key || `cat-${c.id}`,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image: c.image || '/assets/products/1 (1).jpg',
      image_url: c.image_url || c.image || '/assets/products/1 (1).jpg',
      status: c.status || (c.active ? 'active' : 'inactive'),
      active: Boolean(c.active !== 0 && c.status !== 'inactive'),
      displayOrder: Number(c.displayOrder || 0),
      display_order: Number(c.displayOrder || 0),
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      productCount: Number(c.productCount || 0),
    }

    res.json({ success: true, data: categoryData })
  } catch (err) {
    console.error('[Categories] MySQL error in getCategoryById:', err.message)
    next(err)
  }
}

async function createCategory(req, res, next) {
  try {
    console.log('[Categories] POST request received to create category')
    console.log('[Categories] Validating payload:', JSON.stringify(req.body))

    const name = (req.body.name || '').trim()
    const rawSlug = (req.body.slug || '').trim()
    const description = (req.body.description || '').trim()
    const imageUrl = (req.body.image_url || req.body.image || '').trim()
    const statusInput = req.body.status
    const displayOrderInput = req.body.display_order ?? req.body.displayOrder

    if (!name) {
      throw new ApiError(400, 'Category Name is required')
    }

    const cleanSlug = generateSlug(rawSlug || name)
    if (!cleanSlug) {
      throw new ApiError(400, 'Valid Category Slug is required')
    }

    const categoryStatus = statusInput === 'inactive' ? 'inactive' : 'active'
    const isActive = categoryStatus === 'active' ? 1 : 0
    const orderNum = parseInt(displayOrderInput, 10) || 0

    // Check duplicate slug in MySQL
    console.log(`[Categories] Checking duplicate slug '${cleanSlug}' in MySQL...`)
    const [existing] = await pool.execute('SELECT id FROM categories WHERE slug = ? LIMIT 1', [cleanSlug])
    if (existing.length > 0) {
      console.warn(`[Categories] Slug '${cleanSlug}' already exists in MySQL database`)
      throw new ApiError(409, 'Category slug already exists')
    }

    // Insert into MySQL categories table
    console.log('[Categories] MySQL insert started...')
    const [result] = await pool.execute(
      `INSERT INTO categories 
       (name, slug, description, image, image_url, status, display_order, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        cleanSlug,
        description || null,
        imageUrl || null,
        imageUrl || null,
        categoryStatus,
        orderNum,
        isActive,
      ]
    )

    const newId = result.insertId
    console.log(`[Categories] Category inserted successfully into MySQL with ID: ${newId}`)

    const categoryObj = {
      id: newId,
      _id: `cat-${newId}`,
      name,
      slug: cleanSlug,
      description: description || '',
      image: imageUrl || '/assets/products/1 (1).jpg',
      image_url: imageUrl || '/assets/products/1 (1).jpg',
      status: categoryStatus,
      displayOrder: orderNum,
      display_order: orderNum,
      active: Boolean(isActive),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productCount: 0,
    }

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: categoryObj,
      data: categoryObj,
    })
  } catch (err) {
    console.error('[Categories] MySQL error in createCategory:', err.message)
    next(err)
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params
    console.log(`[Categories] PUT request received to update category ID: ${id}`)
    console.log('[Categories] Validating payload:', JSON.stringify(req.body))

    const name = (req.body.name || '').trim()
    const rawSlug = (req.body.slug || '').trim()
    const description = (req.body.description || '').trim()
    const imageUrl = (req.body.image_url || req.body.image || '').trim()
    const statusInput = req.body.status
    const displayOrderInput = req.body.display_order ?? req.body.displayOrder

    if (!name) {
      throw new ApiError(400, 'Category Name is required')
    }

    const cleanSlug = generateSlug(rawSlug || name)
    if (!cleanSlug) {
      throw new ApiError(400, 'Valid Category Slug is required')
    }

    const categoryStatus = statusInput === 'inactive' ? 'inactive' : 'active'
    const isActive = categoryStatus === 'active' ? 1 : 0
    const orderNum = parseInt(displayOrderInput, 10) || 0

    // Check duplicate slug excluding current ID
    console.log(`[Categories] Checking duplicate slug '${cleanSlug}' for update...`)
    const [existing] = await pool.execute(
      'SELECT id FROM categories WHERE slug = ? AND id != ? AND (category_key IS NULL OR category_key != ?) LIMIT 1',
      [cleanSlug, id, id]
    )
    if (existing.length > 0) {
      console.warn(`[Categories] Slug '${cleanSlug}' is taken by another category`)
      throw new ApiError(409, 'Category slug already exists')
    }

    console.log('[Categories] Executing MySQL UPDATE query...')
    const [updateResult] = await pool.execute(
      `UPDATE categories 
       SET name = ?, slug = ?, description = ?, image = ?, image_url = ?, status = ?, display_order = ?, active = ?, updated_at = NOW() 
       WHERE id = ? OR category_key = ? OR slug = ?`,
      [name, cleanSlug, description || null, imageUrl || null, imageUrl || null, categoryStatus, orderNum, isActive, id, id, id]
    )

    if (updateResult.affectedRows === 0) {
      throw new ApiError(404, 'Category not found or no changes made')
    }

    console.log(`[Categories] Category ID ${id} updated successfully in MySQL`)

    const updatedObj = {
      id: Number(id) || id,
      _id: String(id).startsWith('cat-') ? id : `cat-${id}`,
      name,
      slug: cleanSlug,
      description: description || '',
      image: imageUrl || '/assets/products/1 (1).jpg',
      image_url: imageUrl || '/assets/products/1 (1).jpg',
      status: categoryStatus,
      displayOrder: orderNum,
      display_order: orderNum,
      active: Boolean(isActive),
      updatedAt: new Date().toISOString(),
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      category: updatedObj,
      data: updatedObj,
    })
  } catch (err) {
    console.error('[Categories] MySQL error in updateCategory:', err.message)
    next(err)
  }
}

async function updateCategoryStatus(req, res, next) {
  try {
    const { id } = req.params
    const statusInput = req.body.status
    console.log(`[Categories] PATCH request received for status update on category ID ${id}: ${statusInput}`)

    const categoryStatus = statusInput === 'inactive' ? 'inactive' : 'active'
    const isActive = categoryStatus === 'active' ? 1 : 0

    const [result] = await pool.execute(
      'UPDATE categories SET status = ?, active = ?, updated_at = NOW() WHERE id = ? OR category_key = ? OR slug = ?',
      [categoryStatus, isActive, id, id, id]
    )

    if (result.affectedRows === 0) {
      throw new ApiError(404, 'Category not found')
    }

    console.log(`[Categories] Category ID ${id} status updated to '${categoryStatus}' in MySQL`)

    res.json({
      success: true,
      message: `Category status changed to ${categoryStatus}`,
      data: { id, status: categoryStatus, active: Boolean(isActive) },
    })
  } catch (err) {
    console.error('[Categories] MySQL error in updateCategoryStatus:', err.message)
    next(err)
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params
    console.log(`[Categories] DELETE request received for category ID: ${id}`)

    // Check if category has dependent products in MySQL
    const [pRows] = await pool.execute(
      `SELECT COUNT(*) AS count FROM products 
       WHERE category_id = ? OR category_id = (SELECT id FROM categories WHERE id = ? OR category_key = ? OR slug = ? LIMIT 1)`,
      [id, id, id, id]
    )
    const productCount = pRows.length > 0 ? Number(pRows[0].count) : 0

    if (productCount > 0) {
      console.warn(`[Categories] Category ID ${id} contains ${productCount} products and cannot be deleted.`)
      return res.status(400).json({
        success: false,
        message: 'This category contains products and cannot be deleted.',
        hasProducts: true,
        productCount,
      })
    }

    const [deleteResult] = await pool.execute(
      'DELETE FROM categories WHERE id = ? OR category_key = ? OR slug = ?',
      [id, id, id]
    )

    if (deleteResult.affectedRows === 0) {
      throw new ApiError(404, 'Category not found')
    }

    console.log(`[Categories] Category ID ${id} deleted successfully from MySQL`)

    res.json({ success: true, message: 'Category deleted successfully' })
  } catch (err) {
    console.error('[Categories] MySQL error in deleteCategory:', err.message)
    next(err)
  }
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
}
