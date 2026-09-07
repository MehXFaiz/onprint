const { pool } = require('../config/database')
const { categories: fallbackCategories, services: fallbackServices, products: fallbackProducts } = require('../data/initialData')

/**
 * Image SEO Service
 * Scans, audits, and generates optimized metadata, filenames, and alt text for all website imagery.
 * Encourages modern formats (WebP/AVIF), dimension optimization, and responsive lazy loading.
 */
class ImageSeoService {
  /**
   * Scan all images across products, categories, services, and blog posts
   */
  async scanImages() {
    const images = []

    // 1. Scan Categories
    try {
      const [catRows] = await pool.query('SELECT id, name, slug, image, image_url, image_alt FROM categories')
      const cats = catRows.length > 0 ? catRows : fallbackCategories
      cats.forEach((c) => {
        const imgUrl = c.image_url || c.image
        if (imgUrl) {
          images.push(this._formatImageRecord('category', c.id, c.name, imgUrl, c.image_alt || c.imageAlt, c.slug))
        }
      })
    } catch {
      fallbackCategories.forEach((c) => {
        const imgUrl = c.image_url || c.image
        if (imgUrl) {
          images.push(this._formatImageRecord('category', c.id, c.name, imgUrl, c.image_alt || c.imageAlt, c.slug))
        }
      })
    }

    // 2. Scan Services
    try {
      const [servRows] = await pool.query('SELECT id, name, slug, image, image_alt FROM services')
      const servs = servRows.length > 0 ? servRows : fallbackServices
      servs.forEach((s) => {
        if (s.image) {
          images.push(this._formatImageRecord('service', s.id, s.name, s.image, s.image_alt || s.imageAlt, s.slug))
        }
      })
    } catch {
      fallbackServices.forEach((s) => {
        if (s.image) {
          images.push(this._formatImageRecord('service', s.id, s.name, s.image, s.image_alt || s.imageAlt, s.slug))
        }
      })
    }

    // 3. Scan Products
    try {
      const [prodRows] = await pool.query(`
        SELECT p.id, p.name, p.slug, p.image_alt,
               COALESCE((SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1), '/uploads/products/brochures.jpg') as image
        FROM products p
      `)
      const prods = prodRows.length > 0 ? prodRows : fallbackProducts
      prods.forEach((p) => {
        if (p.image) {
          images.push(this._formatImageRecord('product', p.id, p.name, p.image, p.image_alt || p.imageAlt, p.slug))
        }
      })
    } catch {
      fallbackProducts.forEach((p) => {
        if (p.image) {
          images.push(this._formatImageRecord('product', p.id, p.name, p.image, p.image_alt || p.imageAlt, p.slug))
        }
      })
    }

    // 4. Scan Blogs
    try {
      const [blogRows] = await pool.query('SELECT id, title, slug, featured_image, image_alt FROM blogs')
      blogRows.forEach((b) => {
        if (b.featured_image) {
          images.push(this._formatImageRecord('blog', b.id, b.title, b.featured_image, b.image_alt, b.slug))
        }
      })
    } catch {}

    const totalImages = images.length
    const missingAltCount = images.filter((i) => i.isMissingAlt).length
    const nonWebpCount = images.filter((i) => !i.isWebp).length
    const optimizedCount = images.filter((i) => !i.isMissingAlt && i.isWebp).length
    const healthScore = totalImages > 0 ? Math.round(((totalImages - missingAltCount) / totalImages) * 100) : 100

    return {
      totalImages,
      missingAltCount,
      nonWebpCount,
      optimizedCount,
      healthScore,
      images,
      recommendationsSummary: {
        missingAltNote: `${missingAltCount} image(s) missing alternative text for screen readers and Google Images.`,
        formatNote: `${nonWebpCount} image(s) can be converted to modern WebP/AVIF format for up to 30% faster load speed.`,
      },
    }
  }

  /**
   * Helper to format image record and generate SEO suggestions
   */
  _formatImageRecord(entityType, entityId, entityName, imageUrl, currentAlt, slug) {
    const isMissingAlt = !currentAlt || currentAlt.trim().length === 0
    const isWebp = imageUrl.toLowerCase().endsWith('.webp') || imageUrl.toLowerCase().endsWith('.svg')

    // Generate descriptive SEO filename suggestion
    const cleanName = (slug || entityName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const suggestedFilename = `${cleanName}-dubai-onprint.webp`

    // Generate intent-rich alt text suggestion
    const suggestedAlt = `${entityName} commercial printing and finishing in Dubai | ONPRINT`

    return {
      id: `${entityType}-${entityId}`,
      entityType,
      entityId,
      entityName,
      imageUrl,
      currentAlt: currentAlt || '',
      isMissingAlt,
      isWebp,
      suggestedAlt,
      suggestedFilename,
      suggestedDimensions: '1200x800 px (3:2 aspect ratio)',
      loadingRecommendation: 'loading="lazy" decoding="async"',
    }
  }

  /**
   * Update an image's ALT text in the database
   */
  async updateAltText(entityType, entityId, newAltText) {
    if (!newAltText || newAltText.trim().length === 0) {
      throw new Error('Alt text cannot be empty.')
    }

    const cleanAlt = newAltText.trim()

    if (entityType === 'category') {
      await pool.query('UPDATE categories SET image_alt = ? WHERE id = ?', [cleanAlt, entityId])
    } else if (entityType === 'service') {
      await pool.query('UPDATE services SET image_alt = ? WHERE id = ?', [cleanAlt, entityId])
    } else if (entityType === 'product') {
      await pool.query('UPDATE products SET image_alt = ? WHERE id = ?', [cleanAlt, entityId])
    } else if (entityType === 'blog') {
      await pool.query('UPDATE blogs SET image_alt = ? WHERE id = ?', [cleanAlt, entityId])
    } else {
      throw new Error(`Unsupported entity type: ${entityType}`)
    }

    return {
      success: true,
      message: `Updated image ALT text for ${entityType} #${entityId}.`,
      newAltText: cleanAlt,
    }
  }
}

module.exports = new ImageSeoService()
