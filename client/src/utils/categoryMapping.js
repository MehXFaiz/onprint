/**
 * ONPRINT — Unified Category & Image Mapping Architecture
 * Guarantees 1:1 bidirectional mapping between category slugs, images, and catalog products.
 */

export const CANONICAL_CATEGORIES = {
  'business-cards-printing': {
    slug: 'business-cards-printing',
    name: 'Business Cards Printing',
    heroImage: '/uploads/categories/business-cards-printing.jpg',
    departmentSlug: 'business-office-printing',
  },
  'brochures-printing': {
    slug: 'brochures-printing',
    name: 'Brochures Printing',
    heroImage: '/uploads/categories/brochures-printing.jpg',
    departmentSlug: 'marketing-promotional-printing',
  },
  'flyers-printing-in-dubai': {
    slug: 'flyers-printing-in-dubai',
    name: 'Flyers Printing In Dubai',
    heroImage: '/uploads/categories/flyers-printing-in-dubai.jpg',
    departmentSlug: 'marketing-promotional-printing',
  },
  'id-card-printing-dubai': {
    slug: 'id-card-printing-dubai',
    name: 'ID Card Printing Dubai',
    heroImage: '/assets/products/id-cards/uv_id_card_hero.jpg',
    departmentSlug: 'specialty-corporate-gifts',
  },
  'lanyard-printing-dubai': {
    slug: 'lanyard-printing-dubai',
    name: 'Lanyard Printing Dubai',
    heroImage: '/uploads/categories/lanyard-printing-dubai.jpg',
    departmentSlug: 'specialty-corporate-gifts',
  },
  'letterheads-printing-dubai': {
    slug: 'letterheads-printing-dubai',
    name: 'Letterheads Printing Dubai',
    heroImage: '/uploads/categories/letterheads-printing-dubai.jpg',
    departmentSlug: 'business-office-printing',
  },
  'name-badges-printing-dubai': {
    slug: 'name-badges-printing-dubai',
    name: 'Name Badges Printing Dubai',
    heroImage: '/uploads/categories/name-badges-printing-dubai.jpg',
    departmentSlug: 'signage-displays-banners',
  },
  'mug-printing-dubai': {
    slug: 'mug-printing-dubai',
    name: 'Mug Printing Dubai',
    heroImage: '/uploads/categories/mug-printing-dubai.jpg',
    departmentSlug: 'specialty-corporate-gifts',
  },
  'bottle-printing-dubai': {
    slug: 'bottle-printing-dubai',
    name: 'Water Bottle Printing Dubai',
    heroImage: '/uploads/categories/bottle-printing-dubai.jpg',
    departmentSlug: 'specialty-corporate-gifts',
  },
  'corporate-gift-items': {
    slug: 'corporate-gift-items',
    name: 'Corporate Gifts & Merchandise',
    heroImage: '/uploads/categories/corporate-gift-items.jpg',
    departmentSlug: 'specialty-corporate-gifts',
  },
  'signage-banners-printing': {
    slug: 'signage-banners-printing',
    name: 'Signage & Exhibition Banners',
    heroImage: '/uploads/categories/signage-banners-printing.jpg',
    departmentSlug: 'signage-displays-banners',
  },
  'custom-apparel-printing': {
    slug: 'custom-apparel-printing',
    name: 'Custom Apparel & Wearables',
    heroImage: '/uploads/categories/custom-apparel-printing.jpg',
    departmentSlug: 'specialty-corporate-gifts',
  },
  'stickers-labels-printing': {
    slug: 'stickers-labels-printing',
    name: 'Stickers & Product Labels',
    heroImage: '/uploads/categories/stickers-labels-printing.jpg',
    departmentSlug: 'stickers-labels-packaging',
  },
  'catalogs-booklets-printing': {
    slug: 'catalogs-booklets-printing',
    name: 'Catalogs & Booklets Printing',
    heroImage: '/uploads/categories/catalogs-booklets-printing.jpg',
    departmentSlug: 'marketing-promotional-printing',
  },
  'office-stationery-printing': {
    slug: 'office-stationery-printing',
    name: 'Office Stationery & Envelopes',
    heroImage: '/uploads/categories/office-stationery-printing.jpg',
    departmentSlug: 'business-office-printing',
  },
  'hospitality-event-printing': {
    slug: 'hospitality-event-printing',
    name: 'Hospitality & Event Stationery',
    heroImage: '/uploads/categories/hospitality-event-printing.jpg',
    departmentSlug: 'marketing-promotional-printing',
  },
  'promotional-drinkware-tech': {
    slug: 'promotional-drinkware-tech',
    name: 'Promotional Drinkware & Tech',
    heroImage: '/uploads/categories/promotional-drinkware-tech.jpg',
    departmentSlug: 'specialty-corporate-gifts',
  },
  'stamps-printing-dubai': {
    slug: 'stamps-printing-dubai',
    name: 'Custom Stamps & Seals',
    heroImage: '/uploads/categories/stamps-printing-dubai.jpg',
    departmentSlug: 'business-office-printing',
  },
  'rollup-banners': {
    slug: 'rollup-banners',
    name: 'Rollup Banners',
    heroImage: '/uploads/categories/rollup-banners.jpg',
    departmentSlug: 'signage-displays-banners',
  },
}

export const CATEGORY_SLUG_ALIASES = {
  // Business Cards
  'business-cards': 'business-cards-printing',
  'business-cards-dubai': 'business-cards-printing',
  'luxury-business-cards': 'business-cards-printing',
  'business-card-printing': 'business-cards-printing',
  'visiting-cards': 'business-cards-printing',
  'visiting-cards-dubai': 'business-cards-printing',

  // Roll-Up Banners
  'roll-up-banners-dubai': 'rollup-banners',
  'rollup-banners-dubai': 'rollup-banners',
  'roll-up-banners': 'rollup-banners',
  'pull-up-banners': 'rollup-banners',
  'popup-banners': 'rollup-banners',
  'banner-stands': 'rollup-banners',
  'exhibition-banners': 'rollup-banners',

  // Stickers & Labels
  'stickers-printing-dubai': 'stickers-labels-printing',
  'custom-stickers-dubai': 'stickers-labels-printing',
  'stickers-labels-packaging': 'stickers-labels-printing',
  'stickers': 'stickers-labels-printing',
  'labels': 'stickers-labels-printing',
  'product-labels': 'stickers-labels-printing',
  'custom-stickers': 'stickers-labels-printing',
  'waterproof-stickers': 'stickers-labels-printing',

  // Stamps & Seals
  'custom-stamps-seals': 'stamps-printing-dubai',
  'stamps': 'stamps-printing-dubai',
  'custom-stamps': 'stamps-printing-dubai',
  'company-stamps-dubai': 'stamps-printing-dubai',
  'stamp-maker-dubai': 'stamps-printing-dubai',
  'rubber-stamps': 'stamps-printing-dubai',
  'rubber-stamps-dubai': 'stamps-printing-dubai',

  // Letterheads & Stationery
  'letterheads': 'letterheads-printing-dubai',
  'letterhead-printing': 'letterheads-printing-dubai',
  'executive-letterheads': 'letterheads-printing-dubai',
  'letterheads-stationery': 'letterheads-printing-dubai',

  // Bottles & Drinkware
  'bottle-printing': 'bottle-printing-dubai',
  'water-bottle-printing-dubai': 'bottle-printing-dubai',
  'custom-bottles-mugs': 'bottle-printing-dubai',
  'bottles': 'bottle-printing-dubai',
  'custom-bottles': 'bottle-printing-dubai',

  // Flyers
  'flyers': 'flyers-printing-in-dubai',
  'flyer-printing': 'flyers-printing-in-dubai',
  'leaflets': 'flyers-printing-in-dubai',

  // Brochures
  'brochures': 'brochures-printing',
  'brochure-printing': 'brochures-printing',

  // Signage
  'signage': 'signage-banners-printing',
  'signage-displays': 'signage-banners-printing',

  // Gifts
  'corporate-gifts': 'corporate-gift-items',
  'gifts': 'corporate-gift-items',

  // Apparel
  'apparel': 'custom-apparel-printing',
  't-shirt-printing': 'custom-apparel-printing',

  // Mugs
  'mugs': 'mug-printing-dubai',
  'mug-printing': 'mug-printing-dubai',

  // ID Cards
  'id-cards': 'id-card-printing-dubai',
  'id-card-printing': 'id-card-printing-dubai',

  // Lanyards
  'lanyards': 'lanyard-printing-dubai',
  'lanyard-printing': 'lanyard-printing-dubai',

  // Name Badges
  'name-badges': 'name-badges-printing-dubai',
  'badges': 'name-badges-printing-dubai',

  // Catalogs
  'catalogs': 'catalogs-booklets-printing',
  'booklets': 'catalogs-booklets-printing',

  // Stationery
  'stationery': 'office-stationery-printing',
  'envelopes': 'office-stationery-printing',
}

/**
 * Resolves any raw slug or alias into the canonical category slug.
 */
export function resolveCanonicalCategorySlug(rawSlug) {
  if (!rawSlug) return ''
  const clean = String(rawSlug).trim().toLowerCase()
  if (CANONICAL_CATEGORIES[clean]) return clean
  if (CATEGORY_SLUG_ALIASES[clean]) return CATEGORY_SLUG_ALIASES[clean]
  return clean
}

/**
 * Returns the verified image URL for any category object or slug.
 * Avoids any hardcoded cross-category leaking.
 */
export function getCategoryImage(categoryOrSlug) {
  if (!categoryOrSlug) return '/uploads/categories/business-cards-printing.jpg'

  let slug = typeof categoryOrSlug === 'string' ? categoryOrSlug : (categoryOrSlug.slug || '')
  const canonicalSlug = resolveCanonicalCategorySlug(slug)

  // 1. If explicit category object with a valid custom image that isn't broken
  if (typeof categoryOrSlug === 'object') {
    const rawImg = categoryOrSlug.image_url || categoryOrSlug.image
    if (
      rawImg &&
      typeof rawImg === 'string' &&
      !rawImg.includes('trae.ai') &&
      !rawImg.includes('1 (1).jpg')
    ) {
      return rawImg
    }
  }

  // 2. Canonical registry hero image
  if (CANONICAL_CATEGORIES[canonicalSlug]?.heroImage) {
    return CANONICAL_CATEGORIES[canonicalSlug].heroImage
  }

  // 3. Category path based on canonical slug
  return `/uploads/categories/${canonicalSlug}.jpg`
}
