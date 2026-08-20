import api from './api'

export const defaultProducts = [
  {
    _id: 'prod-6',
    name: 'Notebook Printing',
    slug: 'notebook-printing',
    imageKey: 'brochures',
    category: { _id: 'cat-office-stationery', name: 'Office Stationery Printing', slug: 'office-stationery-printing' },
    shortDescription: 'Hardcover leatherette journals with foil stamped covers and ribbon page markers.',
    description: 'Executive A5 & A4 bound notebooks with 80gsm cream ruled pages, custom ribbon markers, and debossed covers.',
    price: 40,
    minimumQuantity: 50,
    featured: true,
    images: ['/assets/products/1 (5).jpg'],
    active: true,
  },
  {
    _id: 'prod-7',
    name: 'Pens Printing',
    slug: 'pens-printing',
    imageKey: 'badges',
    category: { _id: 'cat-office-stationery', name: 'Office Stationery Printing', slug: 'office-stationery-printing' },
    shortDescription: 'Metallic & eco-friendly rollerball pens laser engraved or screen printed with your brand.',
    description: 'Sleek metal body ballpoint pens with black or blue German ink refills, packaged in velvet presentation pouches.',
    price: 15,
    minimumQuantity: 100,
    featured: false,
    images: ['/assets/products/1 (6).jpg'],
    active: true,
  },
  {
    _id: 'prod-8',
    name: 'Business Cards Printing',
    slug: 'business-cards-printing',
    imageKey: 'flyers',
    category: { _id: 'cat-office-stationery', name: 'Office Stationery Printing', slug: 'office-stationery-printing' },
    shortDescription: 'Premium 350gsm silk, soft-touch matte laminate, and gold foil embossed cards.',
    description: 'Make an undeniable first impression with thick 350gsm–400gsm cotton or soft-touch laminated cards with painted edges.',
    price: 50,
    minimumQuantity: 100,
    featured: true,
    images: ['/assets/products/1 (7).jpg'],
    active: true,
  },
  {
    _id: 'prod-9',
    name: 'Letterhead Printing Dubai',
    slug: 'letterhead-printing-dubai',
    imageKey: 'brochures',
    category: { _id: 'cat-office-stationery', name: 'Office Stationery Printing', slug: 'office-stationery-printing' },
    shortDescription: 'Executive 120gsm smooth white letterheads printed in crisp full-color CMYK.',
    description: 'Laser-guaranteed 120gsm smooth uncoated paper letterheads for official corporate contracts, invoices, and letters.',
    price: 65,
    minimumQuantity: 250,
    featured: false,
    images: ['/assets/products/1 (8).jpg'],
    active: true,
  },
  {
    _id: 'prod-10',
    name: 'Roll-up Printing Dubai',
    slug: 'roll-up-printing-dubai',
    imageKey: 'rollup',
    category: { _id: 'cat-other-products', name: 'Other Products', slug: 'other-products' },
    shortDescription: 'Heavy-duty aluminum roll-up banner stands with anti-curl grey back film & padded bag.',
    description: '85x200cm & 100x200cm retractable banner stands printed on high-resolution anti-curl PET film for exhibitions and retail.',
    price: 180,
    minimumQuantity: 1,
    featured: true,
    images: ['/assets/products/1 (9).jpg'],
    active: true,
  },
  {
    _id: 'prod-11',
    name: 'Flag Printing Dubai',
    slug: 'flag-printing-dubai',
    imageKey: 'flags',
    category: { _id: 'cat-other-products', name: 'Other Products', slug: 'other-products' },
    shortDescription: 'Teardrop and feather beach flags with weather-resistant knitted polyester print.',
    description: 'Dynamic outdoor promotional flags with heavy water bags, ground spikes, and single or double-sided mirror printing.',
    price: 220,
    minimumQuantity: 1,
    featured: false,
    images: ['/assets/products/1 (10).jpg'],
    active: true,
  },
  {
    _id: 'prod-12',
    name: 'Stickers Printing Dubai',
    slug: 'stickers-printing-dubai',
    imageKey: 'stickers',
    category: { _id: 'cat-other-products', name: 'Other Products', slug: 'other-products' },
    shortDescription: 'Waterproof vinyl die-cut stickers, kiss-cut sheets, and metallic foil product labels.',
    description: 'Durable weather-resistant vinyl stickers with matte or gloss UV lamination for packaging, windows, and branding.',
    price: 40,
    minimumQuantity: 250,
    featured: true,
    images: ['/assets/products/1 (11).jpg'],
    active: true,
  },
  {
    _id: 'prod-13',
    name: 'Name Plate Printing Dubai',
    slug: 'name-plate-printing-dubai',
    imageKey: 'namePlates',
    category: { _id: 'cat-other-products', name: 'Other Products', slug: 'other-products' },
    shortDescription: 'Elegant acrylic, stainless steel, and brass desk & door nameplates with UV printing.',
    description: 'Laser-cut clear acrylic or brushed metal door & desk signs with metallic stand-off bolts for modern corporate offices.',
    price: 120,
    minimumQuantity: 1,
    featured: false,
    images: ['/assets/products/1 (12).jpg'],
    active: true,
  },
]

const PRODUCTS_STORAGE_KEY = 'onprint_admin_products'

export function getStoredProducts() {
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    if (saved) return JSON.parse(saved)
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

