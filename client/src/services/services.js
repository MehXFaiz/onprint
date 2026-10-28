import api from './api'
import { generateEntitySeoDraft, slugifyText } from '../utils/seoDraftGenerator'

const SERVICES_STORAGE_KEY = 'onprint_admin_services_v2'

export const defaultServices = [
  {
    _id: 'serv-business-cards-printing',
    id: 1,
    name: 'Business Cards Printing',
    slug: 'business-cards-printing',
    category: { name: 'Office Stationery Printing' },
    shortDescription: 'Executive 350gsm–600gsm cotton & silk business cards with soft-touch velvet lamination and metallic gold foil stamping.',
    description: 'Make an undeniable first impression with bespoke luxury business cards. Choose from 350gsm to 600gsm cotton stocks, embossed foil stamping, painted colored edges, and tactile spot UV.',
    image: '/uploads/categories/business-cards-printing.jpg',
    image_url: '/uploads/categories/business-cards-printing.jpg',
    order: 1,
    active: true,
    seoTitle: 'Business Cards Printing in Dubai | Luxury Executive Cards | ONPRINT',
    seoDescription: 'Executive business card printing in Dubai. 350gsm-600gsm cotton card stocks, soft-touch matte lamination, gold foil, and spot UV.',
    seoKeywords: 'business cards printing dubai, luxury business cards dubai, visiting cards uae',
  },
  {
    _id: 'serv-brochures-printing',
    id: 2,
    name: 'Brochures Printing',
    slug: 'brochures-printing',
    category: { name: 'Office Stationery Printing' },
    shortDescription: 'Premium bi-fold, tri-fold, and multi-page marketing brochures on luxury coated art paper with precision folding.',
    description: 'Showcase your corporate offerings with luxury multi-page brochures, bi-fold & tri-fold marketing leaflets, saddle-stitched catalogs, and custom presentation folders with soft-touch matte lamination and spot UV.',
    image: '/uploads/categories/brochures-printing.jpg',
    image_url: '/uploads/categories/brochures-printing.jpg',
    order: 2,
    active: true,
    seoTitle: 'Brochures Printing in Dubai | Luxury Commercial Brochures | ONPRINT',
    seoDescription: 'Professional corporate brochure printing in Dubai. Bi-fold, tri-fold, and multi-page marketing brochures with fast UAE delivery.',
    seoKeywords: 'brochures printing dubai, brochure printing dubai, corporate brochures uae',
  },
  {
    _id: 'serv-flyers-printing-in-dubai',
    id: 3,
    name: 'Flyers Printing In Dubai',
    slug: 'flyers-printing-in-dubai',
    category: { name: 'Marketing Flyers & Leaflets', slug: 'flyers-printing-in-dubai' },
    shortDescription: 'High-impact marketing flyers printed on 170gsm–300gsm gloss or matte art paper with vibrant CMYK color fidelity.',
    description: 'Accelerate your campaigns with high-impact single and double-sided commercial marketing flyers. Printed on premium FSC-certified silk and gloss art paper with express same-day turnaround.',
    image: '/uploads/categories/flyers-printing-in-dubai.jpg',
    image_url: '/uploads/categories/flyers-printing-in-dubai.jpg',
    order: 3,
    active: true,
    seoTitle: 'Flyers Printing in Dubai | Express Marketing Leaflets | ONPRINT',
    seoDescription: 'Order custom marketing flyers in Dubai. Single and double-sided promotional flyers on premium gloss/matte art paper with express delivery.',
    seoKeywords: 'flyers printing in dubai, flyer printing dubai, promotional flyers uae',
  },
  {
    _id: 'serv-id-card-printing-dubai',
    id: 4,
    name: 'ID Card Printing Dubai',
    slug: 'id-card-printing-dubai',
    category: { name: 'Office Stationery Printing' },
    shortDescription: 'High-definition UV printed CR80 PVC employee ID cards, staff badges, and VIP membership cards with scratch-resistant cured inks.',
    description: 'High-definition UV printed corporate employee ID cards and staff badges in Dubai. Ultra-durable UV flatbed printing on standard CR80 PVC, with optional raised 3D spot UV emblems, frosted translucent cards, and luxury metallic finishes.',
    image: '/assets/products/id-cards/uv_id_card_hero.jpg',
    image_url: '/assets/products/id-cards/uv_id_card_hero.jpg',
    order: 4,
    active: true,
    seoTitle: 'ID Card Printing Dubai | Corporate PVC & Staff Badges | ONPRINT',
    seoDescription: 'High-security corporate PVC ID card printing in Dubai. Crisp photo resolution, smart NFC chips, barcodes, and accessories.',
    seoKeywords: 'id card printing dubai, pvc id cards dubai, employee badges uae',
  },
  {
    _id: 'serv-lanyard-printing-dubai',
    id: 5,
    name: 'Lanyard Printing Dubai',
    slug: 'lanyard-printing-dubai',
    category: { name: 'Office Stationery Printing' },
    shortDescription: 'Custom branded satin and woven polyester neck lanyards with safety breakaway clips and metal hooks.',
    description: 'Custom branded neck lanyards for corporate teams, exhibitions, and VIP events. High-density woven polyester and silky satin straps featuring durable screen printing or dye-sublimation with swivel hooks and safety breakaways.',
    image: '/uploads/categories/lanyard-printing-dubai.jpg',
    image_url: '/uploads/categories/lanyard-printing-dubai.jpg',
    order: 5,
    active: true,
    seoTitle: 'Lanyard Printing Dubai | Custom Branded Neck Lanyards | ONPRINT',
    seoDescription: 'Custom branded neck lanyard printing in Dubai. High-density polyester and satin lanyards with safety buckles and swivel hooks.',
    seoKeywords: 'lanyard printing dubai, custom lanyards dubai, branded neck straps uae',
  },
  {
    _id: 'serv-letterheads-printing-dubai',
    id: 6,
    name: 'Letterheads Printing Dubai',
    slug: 'letterheads-printing-dubai',
    category: { name: 'Office Stationery Printing' },
    shortDescription: 'Executive 120gsm smooth uncoated white letterheads with crisp full-color CMYK laser printer compatibility.',
    description: 'Elevate official company communications with luxury 120gsm smooth laser-guaranteed paper. Flawless Pantone color fidelity for official contracts, proposals, invoices, and executive correspondence.',
    image: '/uploads/categories/letterheads-printing-dubai.jpg',
    image_url: '/uploads/categories/letterheads-printing-dubai.jpg',
    order: 6,
    active: true,
    seoTitle: 'Letterheads Printing Dubai | Official Corporate Stationery | ONPRINT',
    seoDescription: 'Executive corporate letterhead printing in Dubai. 120gsm smooth laser-guaranteed paper for official contracts and proposals.',
    seoKeywords: 'letterheads printing dubai, corporate stationery dubai, official letterhead paper',
  },
  {
    _id: 'serv-name-badges-printing-dubai',
    id: 7,
    name: 'Name Badges Printing Dubai',
    slug: 'name-badges-printing-dubai',
    category: { name: 'Office Stationery Printing' },
    shortDescription: 'Laser-cut brushed metal & acrylic staff name badges with strong magnetic backings and epoxy dome finish.',
    description: 'Premium staff name badges for corporate hospitality, retail, and corporate teams. Brushed gold, silver, and crystal-clear acrylic badges with strong neodymium magnetic fasteners and scratch-proof domed epoxy resin.',
    image: '/uploads/categories/name-badges-printing-dubai.jpg',
    image_url: '/uploads/categories/name-badges-printing-dubai.jpg',
    order: 7,
    active: true,
    seoTitle: 'Name Badges Printing Dubai | Magnetic Metal & Acrylic Badges | ONPRINT',
    seoDescription: 'Professional staff name badges printing in Dubai. Brushed silver, gold, and acrylic magnetic badges with domed epoxy resin.',
    seoKeywords: 'name badges printing dubai, magnetic name badges dubai, staff badge printing uae',
  },
  {
    _id: 'serv-mug-printing-dubai',
    id: 8,
    name: 'Mug Printing Dubai',
    slug: 'mug-printing-dubai',
    category: { name: 'Mug Printing Dubai' },
    shortDescription: 'Custom branded ceramic coffee mugs, magic heat-reveal mugs, matte black executive tumblers, and vintage enamel mugs.',
    description: 'Bespoke corporate mug printing services in Dubai. Full-color vibrant dye-sublimation on 11oz/15oz ceramic mugs, thermochromic heat-reveal mugs, luxury engraved travel tumblers, and enamel camping mugs with fast UAE delivery.',
    image: '/assets/products/mug_white_ceramic.jpg',
    image_url: '/assets/products/mug_white_ceramic.jpg',
    order: 8,
    active: true,
    seoTitle: 'Mug Printing Dubai | Custom Branded Ceramic & Travel Mugs | ONPRINT',
    seoDescription: 'Professional mug printing in Dubai. Custom ceramic mugs, magic color-changing mugs, executive matte black mugs, and travel tumblers with fast UAE delivery.',
    seoKeywords: 'mug printing dubai, custom mugs dubai, printed mugs uae, personalized coffee mugs dubai, magic mugs dubai, ceramic mug printing',
  },
  {
    _id: 'serv-bottle-printing-dubai',
    id: 9,
    name: 'Water Bottle Printing Dubai',
    slug: 'bottle-printing-dubai',
    category: { name: 'Water Bottle Printing Dubai' },
    shortDescription: 'Custom printed & laser-engraved water bottles, smart LED temperature display flasks, double-wall stainless thermal bottles, and sports bottles.',
    description: 'Custom water bottle printing and laser engraving in Dubai. Double-wall vacuum insulated flasks, smart LED digital temp bottles, aluminium sports bottles, and bamboo glass tumblers with fast UAE delivery.',
    image: '/assets/products/bottle_smart_led.jpg',
    image_url: '/assets/products/bottle_smart_led.jpg',
    order: 9,
    active: true,
    seoTitle: 'Water Bottle Printing Dubai | Custom Branded Flasks & Sports Bottles | ONPRINT',
    seoDescription: 'Custom water bottle printing and laser engraving in Dubai. Double-wall insulated flasks, smart LED temp bottles, aluminium sports bottles with fast UAE delivery.',
    seoKeywords: 'bottle printing dubai, water bottle printing dubai, custom flasks uae, branded sports bottles dubai, smart led temperature bottle dubai',
  },
  {
    _id: 'serv-rollup-banners',
    id: 10,
    name: 'Rollup Banners Printing',
    slug: 'rollup-banners',
    category: { name: 'Rollup Banners' },
    shortDescription: 'Retractable roll-up exhibition banners with heavy-duty aluminum pull-up stands and anti-curl blockout film.',
    description: 'Professional roll-up banner printing in Dubai for exhibitions, trade shows, retail stores, and corporate conferences. High-resolution UV/latex printing on 300gsm anti-curl stoplight grey-back film. Includes retractable aluminum cassette base, support pole, and padded canvas carry bag with same-day express turnaround.',
    image: '/assets/products/rollup_banner.jpg',
    image_url: '/assets/products/rollup_banner.jpg',
    order: 10,
    active: true,
    seoTitle: 'Roll-Up Banner Printing Dubai | Retractable Pull-Up Banners | ONPRINT',
    seoDescription: 'Premium roll-up banner printing in Dubai. 85x200cm, 100x200cm, 120x200cm retractable banners with aluminum stands and express same-day UAE delivery.',
    seoKeywords: 'rollup banners dubai, roll up banner printing dubai, pull up banner uae, exhibition banner stands dubai, retractable banners dubai',
  },
  {
    _id: 'serv-stickers-labels-printing',
    id: 11,
    name: 'Stickers & Product Labels',
    slug: 'stickers-labels-printing',
    category: { name: 'Stickers & Product Labels' },
    shortDescription: 'Precision die-cut waterproof vinyl stickers, roll labels, transparent decals, and holographic packaging stickers.',
    description: 'Commercial sticker and product label printing in Dubai. Custom precision contour die-cutting on premium waterproof white vinyl, clear transparent, metallic foil, and rainbow holographic substrates. UV-protected and scratch-resistant for food packaging, cosmetic jars, bottles, and retail products.',
    image: '/assets/products/stickers.jpg',
    image_url: '/assets/products/stickers.jpg',
    order: 11,
    active: true,
    seoTitle: 'Sticker Printing Dubai | Custom Die-Cut Vinyl Labels | ONPRINT',
    seoDescription: 'Custom sticker printing in Dubai. Waterproof vinyl stickers, roll labels, die-cut decals, and holographic packaging stickers with same-day express delivery.',
    seoKeywords: 'sticker printing dubai, custom stickers dubai, vinyl sticker printing dubai, label printing uae, die cut stickers dubai',
  },
  {
    _id: 'serv-stamps-printing-dubai',
    id: 12,
    name: 'Custom Stamps & Seals',
    slug: 'stamps-printing-dubai',
    category: { name: 'Custom Stamps & Seals' },
    shortDescription: 'Official corporate self-inking rubber stamps, pocket stamps, heavy-duty dater stamps, and notary embossing seals.',
    description: 'Certified corporate rubber stamp and company seal maker in Dubai. High-precision laser-etched Trodat self-inking stamps, compact folding pocket stamps, heavy-duty accounting date stamps, and brass desktop embossing seals with official UAE trade license compliance and 2-hour express turnaround.',
    image: '/assets/products/stamps/self-inking-company-stamp.jpg',
    image_url: '/assets/products/stamps/self-inking-company-stamp.jpg',
    order: 12,
    active: true,
    seoTitle: 'Custom Stamp Printing Dubai | Stamp Maker & Company Seals | ONPRINT',
    seoDescription: 'Official company stamp maker in Dubai. Trodat self-inking stamps, corporate seals, pocket stamps, and dater stamps with fast express same-day Dubai delivery.',
    seoKeywords: 'stamp maker dubai, custom stamps dubai, company stamp printing dubai, self inking stamp uae, corporate seal dubai, notary stamp dubai',
  },
]

export function getStoredServices() {
  try {
    const saved = localStorage.getItem(SERVICES_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingSlugs = new Set(parsed.map((s) => s.slug))
        const missing = defaultServices.filter((ds) => !existingSlugs.has(ds.slug))
        return missing.length > 0 ? [...parsed, ...missing] : parsed
      }
    }
  } catch {
    // ignore
  }
  return defaultServices
}

export function saveServices(services) {
  try {
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services))
  } catch {
    // ignore
  }
}

export function addService(serviceData) {
  const current = getStoredServices()
  const slug = serviceData.slug || slugifyText(serviceData.name || 'service')
  const draftSeo = generateEntitySeoDraft({
    entityType: 'service',
    name: serviceData.name,
    slug,
    categoryName: serviceData.category?.name || serviceData.category || 'Commercial Printing',
    shortDescription: serviceData.shortDescription || serviceData.short_description || '',
    description: serviceData.description || '',
    existingCatalogItems: current,
  })

  const finalSeoTitle = serviceData.seoTitle || serviceData.seo_title || draftSeo.seoTitle
  const finalSeoDescription = serviceData.seoDescription || serviceData.seo_description || draftSeo.seoDescription
  const finalSeoKeywords = serviceData.seoKeywords || serviceData.seo_keywords || draftSeo.seoKeywords
  const finalSeoHeading = serviceData.seoHeading || serviceData.seo_heading || draftSeo.seoHeading
  const finalCanonicalUrl = serviceData.canonicalUrl || serviceData.canonical_url || draftSeo.canonicalUrl
  const finalImageAlt = serviceData.imageAlt || serviceData.image_alt || draftSeo.imageAlt

  const newService = {
    _id: `serv-${Date.now()}`,
    id: Date.now(),
    slug,
    active: serviceData.active !== false,
    order: Number(serviceData.order || current.length + 1),
    ...serviceData,
    image: serviceData.image || serviceData.image_url || '/uploads/categories/business-cards-printing.jpg',
    image_url: serviceData.image_url || serviceData.image || '/uploads/categories/business-cards-printing.jpg',
    seoTitle: finalSeoTitle,
    seo_title: finalSeoTitle,
    seoDescription: finalSeoDescription,
    seo_description: finalSeoDescription,
    seoKeywords: finalSeoKeywords,
    seo_keywords: finalSeoKeywords,
    seoHeading: finalSeoHeading,
    seo_heading: finalSeoHeading,
    canonicalUrl: finalCanonicalUrl,
    canonical_url: finalCanonicalUrl,
    imageAlt: finalImageAlt,
    image_alt: finalImageAlt,
    seoReviewStatus: serviceData.seoReviewStatus || 'needs_review',
  }

  const updated = [newService, ...current]
  saveServices(updated)
  api.post('/services', newService).catch(() => {})
  return newService
}

export function updateService(serviceId, serviceData) {
  const current = getStoredServices()
  const targetId = String(serviceId)
  const idx = current.findIndex(
    (s) => String(s._id || s.id) === targetId || (serviceData.slug && s.slug === serviceData.slug)
  )

  if (idx === -1) {
    return addService(serviceData)
  }

  const existing = current[idx]
  const resolvedSlug = serviceData.slug || existing.slug
  const draftSeo = generateEntitySeoDraft({
    entityType: 'service',
    name: serviceData.name || existing.name,
    slug: resolvedSlug,
    categoryName: serviceData.category?.name || existing.category?.name || 'Commercial Printing',
    shortDescription: serviceData.shortDescription || existing.shortDescription || '',
    description: serviceData.description || existing.description || '',
    existingCatalogItems: current,
  })

  const finalSeoTitle = serviceData.seoTitle || existing.seoTitle || draftSeo.seoTitle
  const finalSeoDescription = serviceData.seoDescription || existing.seoDescription || draftSeo.seoDescription
  const finalSeoKeywords = serviceData.seoKeywords || existing.seoKeywords || draftSeo.seoKeywords
  const finalSeoHeading = serviceData.seoHeading || existing.seoHeading || draftSeo.seoHeading
  const finalCanonicalUrl = serviceData.canonicalUrl || existing.canonicalUrl || draftSeo.canonicalUrl
  const finalImageAlt = serviceData.imageAlt || existing.imageAlt || draftSeo.imageAlt

  const updatedItem = {
    ...existing,
    ...serviceData,
    slug: resolvedSlug,
    seoTitle: finalSeoTitle,
    seo_title: finalSeoTitle,
    seoDescription: finalSeoDescription,
    seo_description: finalSeoDescription,
    seoKeywords: finalSeoKeywords,
    seo_keywords: finalSeoKeywords,
    seoHeading: finalSeoHeading,
    seo_heading: finalSeoHeading,
    canonicalUrl: finalCanonicalUrl,
    canonical_url: finalCanonicalUrl,
    imageAlt: finalImageAlt,
    image_alt: finalImageAlt,
    seoReviewStatus: serviceData.seoReviewStatus || existing.seoReviewStatus || 'approved',
  }

  current[idx] = updatedItem
  saveServices(current)
  api.put(`/services/${existing.id || existing._id || targetId}`, updatedItem).catch(() => {})
  return updatedItem
}

export function deleteService(serviceId) {
  const current = getStoredServices()
  const updated = current.filter((s) => String(s._id || s.id) !== String(serviceId))
  saveServices(updated)
  return updated
}

export async function getServices() {
  const stored = getStoredServices()
  try {
    const { data } = await api.get('/services')
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      const existingSlugs = new Set(data.data.map((s) => s.slug))
      const missing = stored.filter((ds) => !existingSlugs.has(ds.slug))
      return missing.length > 0 ? [...data.data, ...missing] : data.data
    }
    return stored
  } catch {
    return stored
  }
}

export async function getServiceBySlug(slug) {
  try {
    const { data } = await api.get(`/services/${slug}`)
    if (data?.data) {
      return data.data
    }
  } catch {
    // Fallback if API server is offline or returns an error
  }
  const stored = getStoredServices()
  const found = stored.find((s) => s.slug === slug || String(s._id || s.id) === String(slug))
  if (found) return found

  // Fallback slug aliases
  if (slug === 'sticker-printing-dubai' || slug === 'sticker-printing') {
    return stored.find((s) => s.slug === 'stickers-labels-printing')
  }
  if (slug === 'rollup-banner-printing-dubai' || slug === 'roll-up-banners' || slug === 'rollup-banner') {
    return stored.find((s) => s.slug === 'rollup-banners')
  }
  if (slug === 'custom-stamps-dubai' || slug === 'stamp-printing-dubai' || slug === 'stamps') {
    return stored.find((s) => s.slug === 'stamps-printing-dubai')
  }

  throw new Error('Service not found')
}

