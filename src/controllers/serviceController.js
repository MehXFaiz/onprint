const { pool } = require('../config/database')
const { services: fallbackServices } = require('../data/initialData')
const ApiError = require('../utils/ApiError')

async function listServices(req, res, next) {
  try {
    let list = []
    try {
      const [rows] = await pool.execute(
        `SELECT 
          s.id, s.service_key, s.name, s.slug, s.short_description AS shortDescription,
          s.description, s.image, s.display_order AS 'order', s.active,
          c.id AS cat_id, c.category_key AS cat_key, c.name AS cat_name, c.slug AS cat_slug
        FROM services s
        LEFT JOIN categories c ON s.category_id = c.id
        WHERE s.active = 1
        ORDER BY s.display_order ASC, s.name ASC`
      )

      if (rows.length > 0) {
        list = rows.map((s) => ({
          _id: s.service_key || `serv-${s.id}`,
          id: s.id,
          name: s.name,
          slug: s.slug,
          shortDescription: s.shortDescription,
          description: s.description,
          image: s.image,
          order: s.order,
          active: Boolean(s.active),
          category: s.cat_id
            ? { _id: s.cat_key || `cat-${s.cat_id}`, id: s.cat_id, name: s.cat_name, slug: s.cat_slug }
            : null,
        }))
      }
    } catch {
      // Fallback
    }

    if (list.length === 0) {
      list = fallbackServices
    }

    res.json({ success: true, data: list })
  } catch (err) {
    next(err)
  }
}

async function getServiceBySlug(req, res, next) {
  try {
    const { slug } = req.params

    try {
      const [rows] = await pool.execute(
        `SELECT 
          s.id, s.service_key, s.name, s.slug, s.short_description AS shortDescription,
          s.description, s.image, s.display_order AS 'order', s.active,
          c.id AS cat_id, c.category_key AS cat_key, c.name AS cat_name, c.slug AS cat_slug
        FROM services s
        LEFT JOIN categories c ON s.category_id = c.id
        WHERE (s.slug = ? OR s.service_key = ? OR CAST(s.id AS CHAR) = ?) AND s.active = 1
        LIMIT 1`,
        [slug, slug, slug]
      )

      if (rows.length > 0) {
        const s = rows[0]
        return res.json({
          success: true,
          data: {
            _id: s.service_key || `serv-${s.id}`,
            id: s.id,
            name: s.name,
            slug: s.slug,
            shortDescription: s.shortDescription,
            description: s.description,
            image: s.image,
            order: s.order,
            active: Boolean(s.active),
            category: s.cat_id
              ? { _id: s.cat_key || `cat-${s.cat_id}`, id: s.cat_id, name: s.cat_name, slug: s.cat_slug }
              : null,
          },
        })
      }
    } catch {
      // Fallback
    }

    const fallback = fallbackServices.find((s) => s.slug === slug || s._id === slug)
    if (!fallback) throw new ApiError(404, 'Service not found')

    res.json({ success: true, data: fallback })
  } catch (err) {
    next(err)
  }
}

async function createService(req, res, next) {
  try {
    const { name, slug, categoryId, shortDescription, description, image, order } = req.body
    if (!name) throw new ApiError(400, 'Service name is required')

    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const [result] = await pool.execute(
      `INSERT INTO services 
        (name, slug, category_id, short_description, description, image, display_order, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [name, cleanSlug, categoryId || null, shortDescription || '', description || '', image || '', order || 1]
    )

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        _id: `serv-${result.insertId}`,
        name,
        slug: cleanSlug,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function updateService(req, res, next) {
  try {
    const { id } = req.params
    const { name, slug, shortDescription, description, image, order, active } = req.body

    const [result] = await pool.execute(
      `UPDATE services 
       SET name = ?, slug = ?, short_description = ?, description = ?, image = ?, display_order = ?, active = ?
       WHERE id = ? OR service_key = ? OR slug = ?`,
      [name, slug, shortDescription, description, image, order, active ? 1 : 0, id, id, id]
    )

    if (result.affectedRows === 0) {
      throw new ApiError(404, 'Service not found')
    }

    res.json({ success: true, message: 'Service updated successfully' })
  } catch (err) {
    next(err)
  }
}

async function deleteService(req, res, next) {
  try {
    const { id } = req.params

    const [result] = await pool.execute(
      'DELETE FROM services WHERE id = ? OR service_key = ? OR slug = ?',
      [id, id, id]
    )

    if (result.affectedRows === 0) {
      throw new ApiError(404, 'Service not found')
    }

    res.json({ success: true, message: 'Service deleted successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
}
