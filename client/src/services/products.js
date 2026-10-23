import api from './api'
import catalogProducts from '../data/catalogProducts.json'
import { resolveCanonicalCategorySlug } from '../utils/categoryMapping'

export const defaultProducts = catalogProducts

const PRODUCTS_STORAGE_KEY = 'onprint_admin_products_v8'

export function getStoredProducts() {
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    let parsed = saved ? JSON.parse(saved) : null
    if (Array.isArray(parsed) && parsed.length > 0) {
      // 1. Filter out legacy dummy product IDs
      let clean = parsed.filter((p) => {
        const id = String(p._id || p.id || '')
        return !['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8', 'prod-9', 'prod-10', 'prod-11', 'prod-12', 'prod-13'].includes(id)
      })

      // 2. Sanitize: Fix category assignment into standard 19 categories
      clean = clean.map((p) => {
        const name = String(p.name || '').toLowerCase()
        const slug = String(p.slug || '').toLowerCase()

        if (name.includes('mug') || slug.includes('mug')) {
          return {
            ...p,
            category: {
              _id: 'cat-mug-printing-dubai',
              id: 8,
              name: 'Mug Printing Dubai',
              slug: 'mug-printing-dubai'
            }
          }
        }

        if (name.includes('bottle') || slug.includes('bottle') || name.includes('flask') || slug.includes('flask') || name.includes('shaker') || slug.includes('shaker')) {
          return {
            ...p,
            category: {
              _id: 'cat-bottle-printing-dubai',
              id: 9,
              name: 'Water Bottle Printing Dubai',
              slug: 'bottle-printing-dubai'
            }
          }
        }

        if (name.includes('stamp') || slug.includes('stamp') || name.includes('seal') || slug.includes('seal') || name.includes('dater') || slug.includes('dater')) {
          return {
            ...p,
            category: {
              _id: 'cat-stamps-printing-dubai',
              id: 18,
              name: 'Custom Stamps & Seals',
              slug: 'stamps-printing-dubai'
            }
          }
        }

        if (name.includes('lanyard') || slug.includes('lanyard') || name.includes('badge reel') || slug.includes('badge-reel')) {
          return {
            ...p,
            category: {
              _id: 'cat-lanyard-printing-dubai',
              id: 5,
              name: 'Lanyard Printing Dubai',
              slug: 'lanyard-printing-dubai'
            }
          }
        }

        if (
          name.includes('name badge') ||
          slug.includes('name-badge') ||
          name.includes('nameplate') ||
          slug.includes('nameplate') ||
          name.includes('name sign') ||
          slug.includes('name-sign') ||
          slug.includes('magnetic-badge') ||
          p.category_id === 7 ||
          (p.category && (p.category.id === 7 || p.category.slug === 'name-badges-printing-dubai'))
        ) {
          return {
            ...p,
            category_id: 7,
            category: {
              _id: 'cat-name-badges-printing-dubai',
              id: 7,
              name: 'Name Badges Printing Dubai',
              slug: 'name-badges-printing-dubai'
            }
          }
        }

        if (name.includes('id card') || slug.includes('id-card') || (name.includes('staff badge') && !slug.includes('epoxy') && !slug.includes('magnetic')) || slug.includes('id-badge')) {
          return {
            ...p,
            category: {
              _id: 'cat-id-card-printing-dubai',
              id: 4,
              name: 'ID Card Printing Dubai',
              slug: 'id-card-printing-dubai'
            }
          }
        }

        if (name.includes('sticker') || slug.includes('sticker') || name.includes('label') || slug.includes('label')) {
          return {
            ...p,
            category: {
              _id: 'cat-stickers-labels-printing',
              id: 13,
              name: 'Stickers & Product Labels',
              slug: 'stickers-labels-printing'
            }
          }
        }

        if (name.includes('flyer') || slug.includes('flyer') || name.includes('leaflet') || slug.includes('leaflet') || slug.includes('door-hanger') || slug.includes('postcard')) {
          return {
            ...p,
            category: {
              _id: 'cat-flyers-printing-in-dubai',
              id: 3,
              name: 'Flyers Printing In Dubai',
              slug: 'flyers-printing-in-dubai'
            }
          }
        }

        if (name.includes('rollup') || slug.includes('rollup') || name.includes('roll-up') || slug.includes('roll-up') || name.includes('pull-up') || slug.includes('retractable')) {
          return {
            ...p,
            category: {
              _id: 'cat-rollup-banners-dubai',
              id: 19,
              name: 'Rollup Banners',
              slug: 'rollup-banners'
            }
          }
        }

        if (name.includes('banner') || slug.includes('banner') || name.includes('flag') || slug.includes('flag')) {
          return {
            ...p,
            category: {
              _id: 'cat-signage-banners-printing',
              id: 11,
              name: 'Signage & Exhibition Banners',
              slug: 'signage-banners-printing'
            }
          }
        }

        if (name.includes('tote') || slug.includes('tote') || name.includes('keychain') || slug.includes('keychain')) {
          return {
            ...p,
            category: {
              _id: 'cat-corporate-gift-items',
              id: 10,
              name: 'Corporate Gifts & Merchandise',
              slug: 'corporate-gift-items'
            }
          }
        }

        if (
          slug.includes('presentation-folder') ||
          slug.includes('printed-envelope') ||
          slug.includes('corporate-envelope') ||
          slug.includes('executive-notebook') ||
          slug.includes('desk-pad') ||
          slug.includes('stationery-gift-set') ||
          slug.includes('executive-letterhead') ||
          slug.includes('corporate-ring-binder') ||
          slug.includes('wall-desk-calendar') ||
          slug.includes('ncr-duplicate') ||
          slug.includes('string-tie-envelope') ||
          slug.includes('sticky-notes-cube')
        ) {
          return {
            ...p,
            category: {
              _id: 'cat-office-stationery-printing',
              id: 15,
              name: 'Office Stationery & Envelopes',
              slug: 'office-stationery-printing'
            }
          }
        }

        return p
      })

      // 3. Ensure all default products and their latest images, prices and order are always up to date
      const defaultMap = new Map(defaultProducts.map((p) => [p.slug, p]))
      const defaultOrderMap = new Map(defaultProducts.map((p, idx) => [p.slug, idx]))
      clean = clean.map((p) => {
        // If an administrator modified this product, preserve their edits!
        if (p._isCustom || p._updatedAt) {
          return p
        }
        const def = defaultMap.get(p.slug)
        if (def) {
          return {
            ...p,
            price: def.price !== undefined ? def.price : p.price,
            image: def.image || p.image,
            image_url: def.image_url || p.image_url,
            images: def.images || p.images,
            name: def.name || p.name,
            shortDescription: def.shortDescription || p.shortDescription,
            category: def.category || p.category,
          }
        }
        return p
      })

      const existingSlugs = new Set(clean.map((p) => p.slug))
      const missingProducts = defaultProducts.filter((p) => !existingSlugs.has(p.slug))
      if (missingProducts.length > 0) {
        clean = [...clean, ...missingProducts]
      }
      clean.sort((a, b) => (defaultOrderMap.get(a.slug) ?? 9999) - (defaultOrderMap.get(b.slug) ?? 9999))
      saveProducts(clean)
      return clean
    }
  } catch {
    // fallback
  }
  return defaultProducts
}

export function saveProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
  } catch {
    // ignore
  }
}

export function addProduct(productData) {
  const current = getStoredProducts()
  const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const primaryImg = productData.image || (Array.isArray(productData.images) ? productData.images[0] : null) || ''
  const imgList = Array.isArray(productData.images) && productData.images.length > 0
    ? productData.images
    : primaryImg
      ? [primaryImg]
      : []

  const newProduct = {
    _id: `prod-${Date.now()}`,
    slug,
    active: productData.active !== false,
    featured: Boolean(productData.featured),
    image: primaryImg,
    images: imgList,
    _isCustom: true,
    _updatedAt: Date.now(),
    ...productData,
  }
  const updated = [newProduct, ...current]
  saveProducts(updated)

  // Sync to API in background if possible
  api.post('/products', productData).catch(() => {})

  return newProduct
}

export function updateProduct(productId, productData) {
  const current = getStoredProducts()
  const targetId = String(productId)
  const targetSlug = productData.slug || ''

  const idx = current.findIndex(
    (p) => String(p._id || p.id) === targetId || (targetSlug && p.slug === targetSlug)
  )

  const primaryImg = productData.image || (Array.isArray(productData.images) ? productData.images[0] : null) || ''
  const imgList = Array.isArray(productData.images) && productData.images.length > 0
    ? productData.images
    : primaryImg
      ? [primaryImg]
      : []

  if (idx === -1) {
    return addProduct(productData)
  }

  const existing = current[idx]
  const updatedItem = {
    ...existing,
    ...productData,
    _id: existing._id || existing.id || targetId,
    id: existing.id || targetId,
    slug: productData.slug || existing.slug,
    image: primaryImg || existing.image || '',
    images: imgList.length > 0 ? imgList : (existing.images || (existing.image ? [existing.image] : [])),
    _isCustom: true,
    _updatedAt: Date.now(),
  }

  current[idx] = updatedItem
  saveProducts(current)

  // Sync to backend API in background if available
  api.put(`/products/${existing.id || existing._id || targetId}`, productData).catch(() => {})

  return updatedItem
}

export function deleteProduct(productId) {
  const current = getStoredProducts()
  const updated = current.filter((p) => p._id !== productId)
  saveProducts(updated)
  return updated
}

export async function getProducts(params = {}) {
  let list = getStoredProducts()
  try {
    const { data } = await api.get('/products', { params })
    if (data?.data && data.data.length > 0) {
      if (params.category) {
        const catParam = params.category.toLowerCase()
        const hasMatchingCategory = data.data.some((p) => {
          const s = p.category?.slug?.toLowerCase() || ''
          const cid = String(p.category?._id || '').toLowerCase()
          const sec = (p.categories || []).some(
            (c) => c.slug?.toLowerCase() === catParam || String(c._id || '').toLowerCase() === catParam
          )
          return s === catParam || cid === catParam || sec
        })
        if (hasMatchingCategory) {
          list = data.data
        }
      } else {
        list = data.data
      }
    }
  } catch {
    // fallback to local stored list
  }
  
  if (params.featured) list = list.filter((p) => p.featured)
  if (params.category) {
    const rawCategory = String(params.category).toLowerCase().trim()
    const categoryParam = resolveCanonicalCategorySlug(rawCategory)

    list = list.filter((p) => {
      const catSlug = p.category?.slug?.toLowerCase() || ''
      const catCanonical = resolveCanonicalCategorySlug(catSlug)
      const catId = p.category?._id?.toLowerCase() || ''
      const catName = p.category?.name?.toLowerCase() || ''

      // 1. Canonical slug match or raw slug match
      if (
        catCanonical === categoryParam ||
        catSlug === categoryParam ||
        catSlug === rawCategory ||
        catId === categoryParam ||
        catId === rawCategory
      ) {
        return true
      }

      // 2. Specific alias fallbacks for main commercial categories
      if (
        categoryParam === 'rollup-banners' &&
        (catSlug.includes('rollup') || catSlug.includes('roll-up') || p.slug.includes('rollup') || p.slug.includes('roll-up') || p.slug.includes('pull-up') || p.slug.includes('retractable'))
      ) {
        return true
      }

      if (
        categoryParam === 'stickers-labels-printing' &&
        (catSlug.includes('sticker') || catSlug.includes('label') || p.slug.includes('sticker') || p.slug.includes('label'))
      ) {
        return true
      }

      if (
        categoryParam === 'stamps-printing-dubai' &&
        (catSlug.includes('stamp') || catSlug.includes('seal') || p.slug.includes('stamp') || p.slug.includes('seal') || p.slug.includes('dater'))
      ) {
        return true
      }

      if (
        categoryParam === 'business-cards-printing' &&
        (catSlug.includes('business-card') || p.slug.includes('business-card'))
      ) {
        return true
      }

      if (
        categoryParam === 'letterheads-printing-dubai' &&
        (catSlug.includes('letterhead') || p.slug.includes('letterhead') || p.slug.includes('presentation-folder') || p.slug.includes('corporate-envelope'))
      ) {
        return true
      }

      if (
        categoryParam === 'bottle-printing-dubai' &&
        (catSlug.includes('bottle') || p.slug.includes('bottle') || p.slug.includes('flask') || p.slug.includes('shaker'))
      ) {
        return true
      }

      // 3. Partial name match
      if (catName === categoryParam || catName === rawCategory) return true

      // 4. Secondary categories
      const secondaryCats = p.categories || []
      return secondaryCats.some((cat) => {
        const sSlug = cat.slug?.toLowerCase() || ''
        const sCanonical = resolveCanonicalCategorySlug(sSlug)
        return (
          sCanonical === categoryParam ||
          sSlug === categoryParam ||
          sSlug === rawCategory ||
          cat._id?.toLowerCase() === categoryParam ||
          cat._id?.toLowerCase() === rawCategory
        )
      })
    })
  }
  if (params.q) {
    const q = params.q.toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.shortDescription?.toLowerCase().includes(q))
  }
  return { data: list, page: 1, pageSize: 50, total: list.length }
}

export async function getProductBySlug(slug) {
  const current = getStoredProducts()
  try {
    const { data } = await api.get(`/products/${slug}`)
    if (data?.data) return data.data
  } catch {
    // fallback
  }
  const found = current.find((p) => p.slug === slug)
  if (found) return found
  throw new Error('Product not found')
}
