import api from './api'

export const defaultProducts = [
  // 1. Brochures Printing - Dedicated distinct styles
  {
    _id: 'prod-bi-fold-brochures',
    id: 1,
    name: 'Bi-Fold Brochures Printing',
    slug: 'bi-fold-brochures-printing',
    category: {
      _id: 'cat-brochures-printing',
      id: 1,
      name: 'Brochures Printing',
      slug: 'brochures-printing'
    },
    shortDescription: 'Classic 4-panel bi-fold corporate brochures on 250gsm–350gsm silk art paper with crisp crease folding and foil stamping.',
    description: 'High-impact 4-panel bi-fold corporate brochures printed on 250gsm to 350gsm luxury art card. Precision machine creased and folded with optional soft-touch matte lamination and gold foil.',
    price: 95,
    minimumQuantity: 100,
    featured: true,
    active: true,
    images: ['/assets/products/brochure_bifold.jpg'],
    image_url: '/assets/products/brochure_bifold.jpg',
  },
  {
    _id: 'prod-tri-fold-brochures',
    id: 2,
    name: 'Tri-Fold Marketing Brochures',
    slug: 'tri-fold-brochures-printing',
    category: {
      _id: 'cat-brochures-printing',
      id: 1,
      name: 'Brochures Printing',
      slug: 'brochures-printing'
    },
    shortDescription: 'Classic 6-panel tri-fold letter-fold marketing leaflets with organized panels and vivid CMYK Pantone color fidelity.',
    description: 'Versatile 6-panel tri-fold brochures printed on 200gsm to 300gsm art paper. Machine scored in two parallel lines creating six organized readable panels for marketing and menus.',
    price: 85,
    minimumQuantity: 100,
    featured: true,
    active: true,
    images: ['/assets/products/brochure_trifold.jpg'],
    image_url: '/assets/products/brochure_trifold.jpg',
  },
  {
    _id: 'prod-catalogs-booklets-printing',
    id: 3,
    name: 'Multi-Page Booklets & Catalogs',
    slug: 'catalogs-booklets-printing',
    category: {
      _id: 'cat-brochures-printing',
      id: 1,
      name: 'Brochures Printing',
      slug: 'brochures-printing'
    },
    shortDescription: 'Saddle-stitched and perfect-bound corporate multi-page booklets, annual reports, and product catalogs.',
    description: 'Multi-page corporate catalogs and company profiles printed on 170gsm–250gsm interior art paper with heavy 350gsm laminated cover and saddle-stitch or PUR spine binding.',
    price: 165,
    minimumQuantity: 50,
    featured: true,
    active: true,
    images: ['/assets/products/brochure_booklet_catalog.jpg'],
    image_url: '/assets/products/brochure_booklet_catalog.jpg',
  },
  {
    _id: 'prod-gate-fold-brochures',
    id: 4,
    name: 'Gate-Fold Luxury Brochures',
    slug: 'gate-fold-brochures-printing',
    category: {
      _id: 'cat-brochures-printing',
      id: 1,
      name: 'Brochures Printing',
      slug: 'brochures-printing'
    },
    shortDescription: 'Dramatic opening gate-fold brochures with dual outer flaps revealing a full-width inner luxury spread.',
    description: 'Exclusive gate-fold brochures featuring two outer flaps that fold inward like double doors to reveal a dramatic full-width inner spread. Printed on 350gsm art card with foil accents.',
    price: 145,
    minimumQuantity: 50,
    featured: true,
    active: true,
    images: ['/assets/products/brochure_gatefold.jpg'],
    image_url: '/assets/products/brochure_gatefold.jpg',
  },
  {
    _id: 'prod-z-fold-leaflets',
    id: 5,
    name: 'Z-Fold Accordion Brochures & Menus',
    slug: 'z-fold-leaflets-printing',
    category: {
      _id: 'cat-brochures-printing',
      id: 1,
      name: 'Brochures Printing',
      slug: 'brochures-printing'
    },
    shortDescription: 'Compact accordion zig-zag multi-panel brochures and leaflets for restaurant menus, price lists, and guides.',
    description: 'Versatile accordion-style Z-fold brochures where panels fold back and forth alternately, creating multiple compact readable surfaces for menus, price lists, and instructional guides.',
    price: 78,
    minimumQuantity: 100,
    featured: true,
    active: true,
    images: ['/assets/products/brochure_zfold.jpg'],
    image_url: '/assets/products/brochure_zfold.jpg',
  },

  // 2. Business Cards
  {
    _id: 'prod-luxury-velvet-business-cards',
    id: 6,
    name: 'Luxury Velvet Business Cards',
    slug: 'luxury-velvet-business-cards',
    category: {
      _id: 'cat-business-cards-printing',
      id: 2,
      name: 'Business Cards Printing',
      slug: 'business-cards-printing'
    },
    shortDescription: 'Executive 450gsm silk cards with soft-touch matte velvet lamination and metallic gold foil stamping.',
    description: 'Crafted for executive distinction, featuring heavy 450gsm silk stock coated in tactile soft-touch lamination with precision hot foil stamping.',
    price: 150,
    minimumQuantity: 250,
    featured: true,
    active: true,
    images: ['/assets/products/card-velvet-foil.jpg'],
    image_url: '/assets/products/card-velvet-foil.jpg',
  },
  {
    _id: 'prod-premium-business-cards',
    id: 7,
    name: 'Premium Soft-Touch Business Cards',
    slug: 'premium-business-cards',
    category: {
      _id: 'cat-business-cards-printing',
      id: 2,
      name: 'Business Cards Printing',
      slug: 'business-cards-printing'
    },
    shortDescription: 'Luxury 350gsm–450gsm business cards with silky tactile finish and spot UV highlights.',
    description: 'Premium business cards with soft-touch matte lamination and high-gloss spot UV gloss contrasts.',
    price: 95,
    minimumQuantity: 100,
    featured: true,
    active: true,
    images: ['/assets/products/card-soft-touch.jpg'],
    image_url: '/assets/products/card-soft-touch.jpg',
  },
  {
    _id: 'prod-luxury-painted-edge-business-cards',
    id: 8,
    name: 'Luxury Painted-Edge Business Cards',
    slug: 'luxury-painted-edge-business-cards',
    category: {
      _id: 'cat-business-cards-printing',
      id: 2,
      name: 'Business Cards Printing',
      slug: 'business-cards-printing'
    },
    shortDescription: 'Substantial 600gsm duplex board with hand-gilded or painted colored edges and embossing.',
    description: 'Statement 600gsm duplex business cards with painted edges, precision embossing, and metallic foil options.',
    price: 220,
    minimumQuantity: 100,
    featured: true,
    active: true,
    images: ['/assets/products/card-painted-edge.jpg'],
    image_url: '/assets/products/card-painted-edge.jpg',
  },

  // 3. Flyers & Large Format
  {
    _id: 'prod-high-impact-gloss-marketing-flyers',
    id: 9,
    name: 'High-Impact Gloss Marketing Flyers',
    slug: 'high-impact-gloss-marketing-flyers',
    category: {
      _id: 'cat-flyers-printing-in-dubai',
      id: 3,
      name: 'Flyers Printing In Dubai',
      slug: 'flyers-printing-in-dubai'
    },
    shortDescription: 'Double-sided commercial promotional flyers printed on 170gsm gloss art paper with vibrant CMYK fidelity.',
    description: 'Maximize marketing ROI with high-impact single and double-sided flyers printed on premium 170gsm gloss art paper.',
    price: 120,
    minimumQuantity: 500,
    featured: true,
    active: true,
    images: ['/assets/products/flyers.jpg'],
    image_url: '/assets/products/flyers.jpg',
  },
  {
    _id: 'prod-roll-up-banners',
    id: 10,
    name: 'Roll-Up Banners',
    slug: 'roll-up-banners',
    category: {
      _id: 'cat-flyers-printing-in-dubai',
      id: 3,
      name: 'Flyers Printing In Dubai',
      slug: 'flyers-printing-in-dubai'
    },
    shortDescription: 'Retractable pull-up banners for exhibitions, trade shows, and corporate events with aluminium base.',
    description: 'Portable roll-up display banners with high-resolution photographic print on anti-curl grey-back media.',
    price: 180,
    minimumQuantity: 1,
    featured: true,
    active: true,
    images: ['/assets/products/rollup_banner.jpg'],
    image_url: '/assets/products/rollup_banner.jpg',
  },
  {
    _id: 'prod-die-cut-stickers',
    id: 11,
    name: 'Die-Cut Vinyl Stickers',
    slug: 'die-cut-stickers',
    category: {
      _id: 'cat-flyers-printing-in-dubai',
      id: 3,
      name: 'Flyers Printing In Dubai',
      slug: 'flyers-printing-in-dubai'
    },
    shortDescription: 'Waterproof die-cut vinyl stickers for product packaging, branding, and promotional giveaways.',
    description: 'Custom die-cut stickers and labels in gloss or matte vinyl with protective UV laminate.',
    price: 40,
    minimumQuantity: 200,
    featured: true,
    active: true,
    images: ['/assets/products/service_stickers_labels.jpg'],
    image_url: '/assets/products/service_stickers_labels.jpg',
  },

  // 4. Corporate Gifts & Merchandise (Cleanly categorized under Lanyard/Gifts)
  {
    _id: 'prod-custom-printed-mugs',
    id: 12,
    name: 'Custom Printed Mugs',
    slug: 'custom-printed-mugs',
    category: {
      _id: 'cat-lanyard-printing-dubai',
      id: 5,
      name: 'Corporate Gifts & Merchandise',
      slug: 'lanyard-printing-dubai'
    },
    shortDescription: 'Ceramic & thermal mugs custom printed with corporate logos for client and employee gifting.',
    description: 'Custom printed ceramic mugs designed for corporate gifting, hospitality, and staff appreciation.',
    price: 30,
    minimumQuantity: 25,
    featured: true,
    active: true,
    images: ['/assets/products/mugs.jpg'],
    image_url: '/assets/products/mugs.jpg',
  },
  {
    _id: 'prod-personalized-water-bottles',
    id: 13,
    name: 'Personalized Water Bottles',
    slug: 'personalized-water-bottles',
    category: {
      _id: 'cat-lanyard-printing-dubai',
      id: 5,
      name: 'Corporate Gifts & Merchandise',
      slug: 'lanyard-printing-dubai'
    },
    shortDescription: 'Double-walled stainless steel insulated thermal smart bottles with laser engraving or color print.',
    description: 'Branded water bottles for corporate gifting and sports events with laser engraving and full-color printing.',
    price: 45,
    minimumQuantity: 25,
    featured: true,
    active: true,
    images: ['/assets/products/water_bottles.jpg'],
    image_url: '/assets/products/water_bottles.jpg',
  },
  {
    _id: 'prod-custom-branded-tote-bags',
    id: 14,
    name: 'Custom Branded Tote Bags',
    slug: 'custom-branded-tote-bags',
    category: {
      _id: 'cat-lanyard-printing-dubai',
      id: 5,
      name: 'Corporate Gifts & Merchandise',
      slug: 'lanyard-printing-dubai'
    },
    shortDescription: 'Eco-friendly heavy canvas and cotton tote bags with screen-printed brand identity.',
    description: 'Custom branded tote bags printed with full-color graphics for retail, trade shows, and corporate giveaways.',
    price: 34,
    minimumQuantity: 50,
    featured: true,
    active: true,
    images: ['/assets/products/tote_bags.jpg'],
    image_url: '/assets/products/tote_bags.jpg',
  },

  // 5. Office Stationery & Identification
  {
    _id: 'prod-executive-stationery-letterheads',
    id: 15,
    name: 'Executive Stationery Letterheads',
    slug: 'executive-stationery-letterheads',
    category: {
      _id: 'cat-letterheads-printing-dubai',
      id: 6,
      name: 'Letterheads Printing Dubai',
      slug: 'letterheads-printing-dubai'
    },
    shortDescription: '120gsm ultra-smooth laser-compatible corporate letterheads with crisp Pantone color fidelity.',
    description: 'Official corporate stationery printed on 120gsm ultra-smooth laser-guaranteed paper for proposals and contracts.',
    price: 180,
    minimumQuantity: 500,
    featured: true,
    active: true,
    images: ['/assets/products/service_executive_stationery.jpg'],
    image_url: '/assets/products/service_executive_stationery.jpg',
  },
  {
    _id: 'prod-magnetic-brushed-metal-name-badges',
    id: 16,
    name: 'Magnetic Brushed Metal Name Badges',
    slug: 'magnetic-brushed-metal-name-badges',
    category: {
      _id: 'cat-name-badges-printing-dubai',
      id: 7,
      name: 'Name Badges Printing Dubai',
      slug: 'name-badges-printing-dubai'
    },
    shortDescription: 'Laser-engraved champagne gold and silver staff name badges with neodymium magnetic fastener.',
    description: 'Professional staff name badges manufactured from brushed metal with scratch-resistant epoxy doming.',
    price: 35,
    minimumQuantity: 5,
    featured: true,
    active: true,
    images: ['/assets/products/name_badges.jpg'],
    image_url: '/assets/products/name_badges.jpg',
  },
  {
    _id: 'prod-secure-smart-nfc-pvc-id-cards',
    id: 17,
    name: 'Secure Smart NFC PVC ID Cards',
    slug: 'secure-smart-nfc-pvc-id-cards',
    category: {
      _id: 'cat-id-card-printing-dubai',
      id: 4,
      name: 'ID Card Printing Dubai',
      slug: 'id-card-printing-dubai'
    },
    shortDescription: 'CR80 standard PVC identity cards with embedded NFC/RFID chips and high-definition photo print.',
    description: 'High-security employee ID cards manufactured from durable CR80 PVC with smart chips and protective overlay.',
    price: 25,
    minimumQuantity: 10,
    featured: true,
    active: true,
    images: ['/assets/products/id_cards.jpg'],
    image_url: '/assets/products/id_cards.jpg',
  }
]

const PRODUCTS_STORAGE_KEY = 'onprint_admin_products'

export function getStoredProducts() {
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    let parsed = saved ? JSON.parse(saved) : null
    if (Array.isArray(parsed)) {
      // 1. Filter out legacy dummy product IDs
      let clean = parsed.filter((p) => {
        const id = String(p._id || p.id || '')
        return !['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8', 'prod-9', 'prod-10', 'prod-11', 'prod-12', 'prod-13'].includes(id)
      })

      // 2. Sanitize: Fix any mug, bottle, or non-brochure mistakenly assigned to brochures-printing
      clean = clean.map((p) => {
        const name = String(p.name || '').toLowerCase()
        const slug = String(p.slug || '').toLowerCase()
        const catSlug = String(typeof p.category === 'object' ? p.category?.slug : p.category || '').toLowerCase()
        if (catSlug.includes('brochure') && (name.includes('mug') || slug.includes('mug') || name.includes('bottle') || slug.includes('bottle') || name.includes('tote') || slug.includes('tote'))) {
          return {
            ...p,
            category: {
              _id: 'cat-lanyard-printing-dubai',
              id: 5,
              name: 'Corporate Gifts & Merchandise',
              slug: 'lanyard-printing-dubai'
            }
          }
        }
        return p
      })

      // 3. Ensure default brochure products are always available in stored list
      const existingSlugs = new Set(clean.map((p) => p.slug))
      const missingBrochures = defaultProducts.filter((p) => !existingSlugs.has(p.slug))
      if (missingBrochures.length > 0) {
        clean = [...clean, ...missingBrochures]
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

