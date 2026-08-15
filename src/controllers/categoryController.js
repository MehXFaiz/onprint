const { pool } = require('../config/database')
const { categories: fallbackCategories } = require('../data/initialData')
const ApiError = require('../utils/ApiError')

async function listCategories(req, res, next) {
  try {
    let list = []
    try {
      const [rows] = await pool.execute(
        'SELECT id, category_key, name, slug, description, active FROM categories WHERE active = 1 ORDER BY name ASC'
      )
      if (rows.length > 0) {
        list = rows.map((c) => ({
          ...c,
          _id: c.category_key || `cat-${c.id}`,
        }))
      }
    } catch {
      // Fallback to static categories if database is empty/connecting
    }

    if (list.length === 0) {
      list = fallbackCategories
    }

    res.json({ success: true, data: list })
  } catch (err) {
    next(err)
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, slug, description, active } = req.body
    if (!name) throw new ApiError(400, 'Category name is required')

    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const [result] = await pool.execute(
      'INSERT INTO categories (name, slug, description, active) VALUES (?, ?, ?, ?)',
      [name, cleanSlug, description || '', active !== false ? 1 : 0]
    )

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        _id: `cat-${result.insertId}`,
        name,
        slug: cleanSlug,
        description,
        active: active !== false,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params
    const { name, slug, description, active } = req.body

    const [result] = await pool.execute(
      'UPDATE categories SET name = ?, slug = ?, description = ?, active = ? WHERE id = ? OR category_key = ? OR slug = ?',
      [name, slug, description, active ? 1 : 0, id, id, id]
    )

    if (result.affectedRows === 0) {
      throw new ApiError(404, 'Category not found')
    }

    res.json({ success: true, message: 'Category updated successfully' })
  } catch (err) {
    next(err)
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params

    const [result] = await pool.execute(
      'DELETE FROM categories WHERE id = ? OR category_key = ? OR slug = ?',
      [id, id, id]
    )

    if (result.affectedRows === 0) {
      throw new ApiError(404, 'Category not found')
    }

    res.json({ success: true, message: 'Category deleted successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
}
