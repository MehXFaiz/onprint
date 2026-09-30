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

        return p
      })

      // 3. Ensure all default products (including new ID cards, mugs and bottles) are always available in stored list
      const defaultIdCardSlugs = new Set(defaultProducts.filter((p) => p.category?.slug === 'id-card-printing-dubai').map((p) => p.slug))
      const cleanIdCardSlugs = new Set(clean.filter((p) => p.category?.slug === 'id-card-printing-dubai').map((p) => p.slug))
      
      const missingIdCards = defaultProducts.filter((p) => defaultIdCardSlugs.has(p.slug) && !cleanIdCardSlugs.has(p.slug))
      const existingSlugs = new Set(clean.map((p) => p.slug))
      const missingProducts = defaultProducts.filter((p) => !existingSlugs.has(p.slug))
      
      if (missingProducts.length > 0 || missingIdCards.length > 0) {
        // Refresh with latest default ID cards and missing catalog products
        clean = [...defaultProducts.filter((p) => defaultIdCardSlugs.has(p.slug)), ...clean.filter((p) => !defaultIdCardSlugs.has(p.slug))]
        const currentSlugs = new Set(clean.map((p) => p.slug))
        const remainingMissing = defaultProducts.filter((p) => !currentSlugs.has(p.slug))
        clean = [...clean, ...remainingMissing]
        saveProducts(clean)
      }
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
