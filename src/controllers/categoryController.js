const { pool } = require('../config/database')
const { categories: fallbackCategories } = require('../data/initialData')
const ApiError = require('../utils/ApiError')

let inMemoryCategories = [
  {
    id: 1,
    _id: 'cat-corporate-gifts',
    name: 'Corporate Gift Items',
    slug: 'corporate-gift-items',
    description: 'Premium branded gifts, apparel, mugs, and giveaways designed for businesses and corporate events in Dubai.',
    image: '/assets/products/1 (1).jpg',
    status: 'active',
    active: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    productCount: 5,
  },
  {
    id: 2,
    _id: 'cat-office-stationery',
    name: 'Office Stationery Printing',
    slug: 'office-stationery-printing',
    description: 'Executive notebooks, pens, business cards, and letterheads tailored for professional brand correspondence.',
    image: '/assets/products/1 (7).jpg',
    status: 'active',
    active: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    productCount: 4,
  },
  {
    id: 3,
    _id: 'cat-other-products',
    name: 'Other Products',
    slug: 'other-products',
    description: 'Large-format roll-ups, outdoor flags, die-cut vinyl stickers, and acrylic executive nameplates.',
    image: '/assets/products/1 (9).jpg',
    status: 'active',
    active: true,
    displayOrder: 3,
    createdAt: new Date().toISOString(),
    productCount: 4,
  },
]

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

async function listCategories(req, res, next) {
  try {
    const { search, status, sort } = req.query
    let list = []

    try {
      let query = `
        SELECT 
          c.id, c.category_key, c.name, c.slug, c.description, c.image, 
          c.status, c.display_order AS displayOrder, c.active, c.created_at AS createdAt, c.updated_at AS updatedAt,
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

      if (rows.length > 0) {
        list = rows.map((c) => ({
          id: c.id,
          _id: c.category_key || `cat-${c.id}`,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          image: c.image || '/assets/products/1 (1).jpg',
          status: c.status || (c.active ? 'active' : 'inactive'),
          active: Boolean(c.active !== 0 && c.status !== 'inactive'),
          displayOrder: Number(c.displayOrder || 0),
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          productCount: Number(c.productCount || 0),
        }))
      }
    } catch (err) {
      console.warn('MySQL categories query warning:', err.message)
    }

    if (list.length === 0) {
      list = [...inMemoryCategories]
      if (search) {
        const term = search.toLowerCase()
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            c.slug.toLowerCase().includes(term) ||
            (c.description && c.description.toLowerCase().includes(term))
        )
      }
      if (status && status !== 'all') {
        list = list.filter((c) => c.status === status)
      }
    }

    res.json({ success: true, data: list })
  } catch (err) {
    next(err)
  }
}

async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params

    try {
      const [rows] = await pool.execute(
        `SELECT 
          c.id, c.category_key, c.name, c.slug, c.description, c.image, 
          c.status, c.display_order AS displayOrder, c.active, c.created_at AS createdAt, c.updated_at AS updatedAt,
          COUNT(p.id) AS productCount
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        WHERE c.id = ? OR c.category_key = ? OR c.slug = ?
        GROUP BY c.id
        LIMIT 1`,
        [id, id, id]
      )

      if (rows.length > 0) {
        const c = rows[0]
        return res.json({
          success: true,
          data: {
            id: c.id,
            _id: c.category_key || `cat-${c.id}`,
            name: c.name,
            slug: c.slug,
            description: c.description || '',
            image: c.image || '/assets/products/1 (1).jpg',
            status: c.status || (c.active ? 'active' : 'inactive'),
            active: Boolean(c.active !== 0 && c.status !== 'inactive'),
            displayOrder: Number(c.displayOrder || 0),
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            productCount: Number(c.productCount || 0),
          },
        })
      }
    } catch {
      // Fallback
    }

    const found = inMemoryCategories.find((c) => String(c.id) === String(id) || c._id === id || c.slug === id)
    if (!found) throw new ApiError(404, 'Category not found')

    res.json({ success: true, data: found })
  } catch (err) {
    next(err)
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, slug, description, image, status, displayOrder } = req.body

    if (!name || !name.trim()) {
      throw new ApiError(400, 'Category Name is required')
    }

    const cleanSlug = generateSlug(slug || name)
    if (!cleanSlug) {
      throw new ApiError(400, 'Valid Category Slug is required')
    }

    const categoryStatus = status === 'inactive' ? 'inactive' : 'active'
    const isActive = categoryStatus === 'active' ? 1 : 0
    const orderNum = parseInt(displayOrder, 10) || 0
    let categoryId = Date.now()

    try {
      const [existing] = await pool.execute('SELECT id FROM categories WHERE slug = ? LIMIT 1', [cleanSlug])
      if (existing.length > 0) {
        throw new ApiError(409, 'This category slug already exists.')
      }

      const [result] = await pool.execute(
        'INSERT INTO categories (name, slug, description, image, status, display_order, active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name.trim(), cleanSlug, description ? description.trim() : null, image || null, categoryStatus, orderNum, isActive]
      )
      categoryId = result.insertId
    } catch (err) {
      if (err instanceof ApiError) throw err
      console.warn('MySQL category insert warning:', err.message)
    }

    const newCategory = {
      id: categoryId,
      _id: `cat-${categoryId}`,
      name: name.trim(),
      slug: cleanSlug,
      description: description ? description.trim() : '',
      image: image || '/assets/products/1 (1).jpg',
      status: categoryStatus,
      displayOrder: orderNum,
      active: Boolean(isActive),
      createdAt: new Date().toISOString(),
      productCount: 0,
    }

    inMemoryCategories.unshift(newCategory)

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    })
  } catch (err) {
    next(err)
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params
    const { name, slug, description, image, status, displayOrder } = req.body

    if (!name || !name.trim()) {
      throw new ApiError(400, 'Category Name is required')
    }

    const cleanSlug = generateSlug(slug || name)
    const categoryStatus = status === 'inactive' ? 'inactive' : 'active'
    const isActive = categoryStatus === 'active' ? 1 : 0
    const orderNum = parseInt(displayOrder, 10) || 0

    try {
      const [existing] = await pool.execute(
        'SELECT id FROM categories WHERE slug = ? AND id != ? AND (category_key IS NULL OR category_key != ?) LIMIT 1',
        [cleanSlug, id, id]
      )
      if (existing.length > 0) {
        throw new ApiError(409, 'This category slug already exists.')
      }

      await pool.execute(
        `UPDATE categories 
         SET name = ?, slug = ?, description = ?, image = ?, status = ?, display_order = ?, active = ?, updated_at = NOW() 
         WHERE id = ? OR category_key = ? OR slug = ?`,
        [name.trim(), cleanSlug, description ? description.trim() : null, image || null, categoryStatus, orderNum, isActive, id, id, id]
      )
    } catch (err) {
      if (err instanceof ApiError) throw err
      console.warn('MySQL category update warning:', err.message)
    }

    const idx = inMemoryCategories.findIndex((c) => String(c.id) === String(id) || c._id === id || c.slug === id)
    if (idx !== -1) {
      inMemoryCategories[idx] = {
        ...inMemoryCategories[idx],
        name: name.trim(),
        slug: cleanSlug,
        description: description ? description.trim() : '',
        image: image || inMemoryCategories[idx].image,
        status: categoryStatus,
        displayOrder: orderNum,
        active: Boolean(isActive),
      }
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { id, name: name.trim(), slug: cleanSlug, status: categoryStatus },
    })
  } catch (err) {
    next(err)
  }
}

async function updateCategoryStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body

    const categoryStatus = status === 'inactive' ? 'inactive' : 'active'
    const isActive = categoryStatus === 'active' ? 1 : 0

    try {
      await pool.execute(
        'UPDATE categories SET status = ?, active = ?, updated_at = NOW() WHERE id = ? OR category_key = ? OR slug = ?',
        [categoryStatus, isActive, id, id, id]
      )
    } catch (err) {
      console.warn('MySQL category status update warning:', err.message)
    }

    const idx = inMemoryCategories.findIndex((c) => String(c.id) === String(id) || c._id === id || c.slug === id)
    if (idx !== -1) {
      inMemoryCategories[idx].status = categoryStatus
      inMemoryCategories[idx].active = Boolean(isActive)
    }

    res.json({
      success: true,
      message: `Category status changed to ${categoryStatus}`,
      data: { id, status: categoryStatus, active: Boolean(isActive) },
    })
  } catch (err) {
    next(err)
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params

    let productCount = 0

    try {
      const [pRows] = await pool.execute(
        `SELECT COUNT(*) AS count FROM products 
         WHERE category_id = ? OR category_id = (SELECT id FROM categories WHERE id = ? OR category_key = ? OR slug = ? LIMIT 1)`,
        [id, id, id, id]
      )
      productCount = pRows.length > 0 ? Number(pRows[0].count) : 0
    } catch {
      const target = inMemoryCategories.find((c) => String(c.id) === String(id) || c._id === id || c.slug === id)
      if (target) productCount = target.productCount || 0
    }

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'This category contains products and cannot be deleted.',
        hasProducts: true,
        productCount,
      })
    }

    try {
      await pool.execute('DELETE FROM categories WHERE id = ? OR category_key = ? OR slug = ?', [id, id, id])
    } catch (err) {
      console.warn('MySQL category delete warning:', err.message)
    }

    inMemoryCategories = inMemoryCategories.filter((c) => String(c.id) !== String(id) && c._id !== id && c.slug !== id)

    res.json({ success: true, message: 'Category deleted successfully' })
  } catch (err) {
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
