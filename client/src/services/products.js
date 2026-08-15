import api from './api'

export const defaultProducts = [
  {
    _id: 'prod-1',
    name: 'Mug Printing Dubai',
    slug: 'mug-printing-dubai',
    imageKey: 'mugs',
    category: { _id: 'cat-corporate-gifts', name: 'Corporate Gift Items', slug: 'corporate-gift-items' },
    shortDescription: 'High-quality ceramic & thermal mugs custom printed with corporate logos and sublimation.',
    description: 'Premium 11oz & 15oz ceramic mugs with dishwasher-safe full-color sublimation printing. Ideal for corporate branding and office gifts.',
    price: 25,
    minimumQuantity: 20,
    featured: true,
    images: ['/assets/products/1 (1).jpg'],
    active: true,
  },
  {
    _id: 'prod-2',
    name: 'Custom Mouse Pad',
    slug: 'custom-mouse-pad',
    imageKey: 'keychain',
    category: { _id: 'cat-corporate-gifts', name: 'Corporate Gift Items', slug: 'corporate-gift-items' },
    shortDescription: 'Smooth micro-weave fabric mouse pads with non-slip rubber base & anti-fray edge stitching.',
    description: 'Ultra-smooth tracking surface custom printed with your high-resolution brand artwork or desk mat designs.',
    price: 35,
    minimumQuantity: 25,
    featured: false,
    images: ['/assets/products/1 (2).jpg'],
    active: true,
  },
  {
    _id: 'prod-3',
    name: 'T-Shirt Printing Dubai',
    slug: 't-shirt-printing-dubai',
    imageKey: 'toteBags',
    category: { _id: 'cat-corporate-gifts', name: 'Corporate Gift Items', slug: 'corporate-gift-items' },
    shortDescription: 'Premium 100% combed cotton t-shirts with DTG, screen printing, and embroidered logos.',
    description: 'Breathable, durable corporate crewneck & polo t-shirts printed with vibrant eco-friendly inks or precision embroidery.',
    price: 45,
    minimumQuantity: 15,
    featured: true,
    images: ['/assets/products/1 (3).jpg'],
    active: true,
  },
  {
    _id: 'prod-4',
    name: 'Cap Printing Dubai',
    slug: 'cap-printing-dubai',
    imageKey: 'badges',
    category: { _id: 'cat-corporate-gifts', name: 'Corporate Gift Items', slug: 'corporate-gift-items' },
    shortDescription: 'Customized snapback, baseball, and trucker caps with 3D embroidery & printed logos.',
    description: 'High-profile structured caps featuring adjustable straps, custom interior taping, and bold 3D puff embroidery.',
    price: 30,
    minimumQuantity: 20,
    featured: false,
    images: ['/assets/products/1 (4).jpg'],
    active: true,
  },
  {
    _id: 'prod-5',
    name: 'Custom Water Bottles Printing in Dubai',
    slug: 'water-bottles-printing-dubai',
    imageKey: 'bottles',
    category: { _id: 'cat-corporate-gifts', name: 'Corporate Gift Items', slug: 'corporate-gift-items' },
    shortDescription: 'Smart LED temperature display vacuum flasks & stainless steel water bottles with laser engraving.',
    description: 'Double-wall insulated 500ml stainless steel water bottles with LED touch temperature display and full-color UV logo printing.',
    price: 55,
    minimumQuantity: 25,
    featured: true,
    images: ['/assets/products/1 (13).jpg'],
    active: true,
  },
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

