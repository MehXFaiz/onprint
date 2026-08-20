const { pool } = require('../config/database')
const { services: fallbackServices } = require('../data/initialData')
const ApiError = require('../utils/ApiError')

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

async function listServices(req, res, next) {
  try {
    let list = []
    try {
      const [rows] = await pool.execute(
        `SELECT 
          s.id, s.service_key, s.name, s.slug, s.short_description AS shortDescription,
          s.description, s.image, s.display_order AS 'order', s.active,
          s.seo_title AS seoTitle, s.seo_description AS seoDescription,
          s.seo_keywords AS seoKeywords, s.seo_heading AS seoHeading,
          s.canonical_url AS canonicalUrl, s.image_alt AS imageAlt,
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
          seoTitle: s.seoTitle || `${s.name} | ONPRINT Dubai`,
          seoDescription: s.seoDescription || s.shortDescription || s.description || '',
          seoKeywords: s.seoKeywords || '',
          seoHeading: s.seoHeading || s.name,
          canonicalUrl: s.canonicalUrl || `https://0nprint.com/services/${s.slug}`,
          imageAlt: s.imageAlt || s.name,
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
          s.seo_title AS seoTitle, s.seo_description AS seoDescription,
          s.seo_keywords AS seoKeywords, s.seo_heading AS seoHeading,
          s.canonical_url AS canonicalUrl, s.image_alt AS imageAlt,
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
            seoTitle: s.seoTitle || `${s.name} | ONPRINT Dubai`,
            seoDescription: s.seoDescription || s.shortDescription || s.description || '',
            seoKeywords: s.seoKeywords || '',
            seoHeading: s.seoHeading || s.name,
            canonicalUrl: s.canonicalUrl || `https://0nprint.com/services/${s.slug}`,
            imageAlt: s.imageAlt || s.name,
            category: s.cat_id
              ? { _id: s.cat_key || `cat-${s.cat_id}`, id: s.cat_id, name: s.cat_name, slug: s.cat_slug }
              : null,
          },
        })
      }
    } catch {
      // Fallback
    }

    const fallback = fallbackServices.find((s) => s.slug === slug || s._id === slug || String(s.id) === slug)
    if (!fallback) throw new ApiError(404, 'Service not found')

    res.json({ success: true, data: fallback })
  } catch (err) {
    next(err)
  }
}

async function createService(req, res, next) {
  try {
    const {
      name,
      slug,
      categoryId,
      shortDescription,
      description,
      image,
      order,
      seoTitle,
      seoDescription,
      seoKeywords,
      seoHeading,
      imageAlt,
    } = req.body

    if (!name) throw new ApiError(400, 'Service name is required')

    const cleanSlug = generateSlug(slug || name)

    const [result] = await pool.execute(
      `INSERT INTO services 
        (name, slug, category_id, short_description, description, image, display_order, active,
         seo_title, seo_description, seo_keywords, seo_heading, image_alt, canonical_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        cleanSlug,
        categoryId || null,
        shortDescription || '',
        description || '',
        image || '',
        order || 1,
        seoTitle || `${name} | ONPRINT Dubai`,
        seoDescription || shortDescription || description || '',
        seoKeywords || '',
        seoHeading || name,
        imageAlt || name,
        `https://0nprint.com/services/${cleanSlug}`,
      ]
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
    const {
      name,
      slug,
      categoryId,
      shortDescription,
      description,
      image,
      order,
      active,
      seoTitle,
      seoDescription,
      seoKeywords,
      seoHeading,
      imageAlt,
    } = req.body

    const cleanSlug = generateSlug(slug || name)

    const [result] = await pool.execute(
      `UPDATE services 
       SET name = ?, slug = ?, category_id = ?, short_description = ?, description = ?, image = ?,
           display_order = ?, active = ?, seo_title = ?, seo_description = ?, seo_keywords = ?,
           seo_heading = ?, image_alt = ?, canonical_url = ?
       WHERE id = ? OR service_key = ? OR slug = ?`,
      [
        name,
        cleanSlug,
        categoryId || null,
        shortDescription,
        description,
        image,
        order,
        active ? 1 : 0,
        seoTitle || `${name} | ONPRINT Dubai`,
        seoDescription || shortDescription || description || '',
        seoKeywords || '',
        seoHeading || name,
        imageAlt || name,
        `https://0nprint.com/services/${cleanSlug}`,
        id,
        id,
        id,
      ]
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
