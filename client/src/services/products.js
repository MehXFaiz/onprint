import api from './api'
import catalogProducts from '../data/catalogProducts.json'

export const defaultProducts = catalogProducts

const PRODUCTS_STORAGE_KEY = 'onprint_admin_products'

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

      // 2. Sanitize: Fix category assignment for mugs and bottles into dedicated categories
      clean = clean.map((p) => {
        const name = String(p.name || '').toLowerCase()
        const slug = String(p.slug || '').toLowerCase()

        if (name.includes('mug') || slug.includes('mug')) {
          return {
            ...p,
            category: {
              _id: 'cat-mug-printing-dubai',
              id: 17,
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
              id: 18,
              name: 'Water Bottle Printing Dubai',
              slug: 'bottle-printing-dubai'
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

        if (name.includes('flyer') || slug.includes('flyer') || name.includes('leaflet') || slug.includes('leaflet')) {
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

        if (name.includes('banner') || slug.includes('banner') || name.includes('flag') || slug.includes('flag')) {
          return {
            ...p,
            category: {
              _id: 'cat-signage-banners-printing',
              id: 10,
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
              id: 9,
              name: 'Corporate Gifts & Merchandise',
              slug: 'corporate-gift-items'
            }
          }
        }

        return p
      })

      // 3. Ensure all default products and their latest images, prices and order are always up to date
      const defaultMap = new Map(defaultProducts.map((p) => [p.slug, p]))
      const defaultOrderMap = new Map(defaultProducts.map((p, idx) => [p.slug, idx]))
      clean = clean.map((p) => {
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
  const newProduct = {
    _id: `prod-${Date.now()}`,
    slug,
    active: true,
    featured: productData.featured || false,
    images: productData.images || ['/assets/products/1 (1).jpg'],
    ...productData,
  }
  const updated = [newProduct, ...current]
  saveProducts(updated)
  return newProduct
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
    if (data?.data && data.data.length > 0) list = data.data
  } catch {
    // fallback to local stored list
  }
  
  if (params.featured) list = list.filter((p) => p.featured)
  if (params.category) {
    const categoryParam = params.category.toLowerCase()
    list = list.filter((p) => {
      const catSlug = p.category?.slug?.toLowerCase() || ''
      const catId = p.category?._id?.toLowerCase() || ''
      const catName = p.category?.name?.toLowerCase() || ''
      
      // Exact match first
      if (catSlug === categoryParam || catId === categoryParam) return true
      
      // Partial name match only if it's a clear match (not just containing the word)
      if (catName === categoryParam) return true
      
      // Check secondary categories
      const secondaryCats = p.categories || []
      const hasSecondaryMatch = secondaryCats.some(cat => 
        cat.slug?.toLowerCase() === categoryParam || 
        cat._id?.toLowerCase() === categoryParam ||
        cat.name?.toLowerCase() === categoryParam
      )
      return hasSecondaryMatch
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
