import api from './api'

export const defaultProducts = []

const PRODUCTS_STORAGE_KEY = 'onprint_admin_products'

export function getStoredProducts() {
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        // Filter out legacy dummy product IDs
        const clean = parsed.filter((p) => {
          const id = String(p._id || p.id || '')
          return !['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8', 'prod-9', 'prod-10', 'prod-11', 'prod-12', 'prod-13'].includes(id)
        })
        return clean
      }
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
  if (params.category) list = list.filter((p) => p.category?.slug === params.category || p.category?._id === params.category || p.category?.name?.toLowerCase().includes(params.category.toLowerCase()))
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

