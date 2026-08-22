import api from './api'

export const defaultServices = [
  {
    _id: 'serv-brochures-printing',
    id: 1,
    name: 'Brochures Printing',
    slug: 'brochures-printing',
    category: { name: 'Office Stationery Printing' },
    shortDescription: 'Premium bi-fold, tri-fold, and multi-page marketing brochures on luxury coated art paper with precision folding.',
    description: 'Showcase your corporate offerings with luxury multi-page brochures, bi-fold & tri-fold marketing leaflets, saddle-stitched catalogs, and custom presentation folders with soft-touch matte lamination and spot UV.',
    image: '/uploads/categories/brochures-printing.jpg',
    image_url: '/uploads/categories/brochures-printing.jpg',
    order: 1,
    active: true,
    seoTitle: 'Brochures Printing in Dubai | Luxury Commercial Brochures | ONPRINT',
    seoDescription: 'Professional corporate brochure printing in Dubai. Bi-fold, tri-fold, and multi-page marketing brochures with fast UAE delivery.',
    seoKeywords: 'brochures printing dubai, brochure printing dubai, corporate brochures uae',
  },
  {
    _id: 'serv-business-cards-printing',
    id: 2,
    name: 'Business Cards Printing',
    slug: 'business-cards-printing',
    category: { name: 'Office Stationery Printing' },
    shortDescription: 'Executive 350gsm–600gsm cotton & silk business cards with soft-touch velvet lamination and metallic gold foil stamping.',
    description: 'Make an undeniable first impression with bespoke luxury business cards. Choose from 350gsm to 600gsm cotton stocks, embossed foil stamping, painted colored edges, and tactile spot UV.',
    image: '/uploads/categories/business-cards-printing.jpg',
    image_url: '/uploads/categories/business-cards-printing.jpg',
    order: 2,
    active: true,
    seoTitle: 'Business Cards Printing in Dubai | Luxury Executive Cards | ONPRINT',
    seoDescription: 'Executive business card printing in Dubai. 350gsm-600gsm cotton card stocks, soft-touch matte lamination, gold foil, and spot UV.',
    seoKeywords: 'business cards printing dubai, luxury business cards dubai, visiting cards uae',
  },
  {
    _id: 'serv-flyers-printing-in-dubai',
    id: 3,
    name: 'Flyers Printing In Dubai',
    slug: 'flyers-printing-in-dubai',
    category: { name: 'Office Stationery Printing' },
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
    shortDescription: 'Secure CR80 standard PVC employee identity cards with high-definition thermal printing and smart chips.',
    description: 'Secure corporate ID card printing in Dubai. High-definition thermal transfer on CR80 PVC cards, compatible with RFID smart chips, magnetic strips, barcodes, and custom security overlays.',
    image: '/uploads/categories/id-card-printing-dubai.jpg',
    image_url: '/uploads/categories/id-card-printing-dubai.jpg',
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
]

export async function getServices() {
  try {
    const { data } = await api.get('/services')
    if (data?.data && data.data.length > 0) {
      return data.data
    }
    return defaultServices
  } catch {
    return defaultServices
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
  const found = defaultServices.find((s) => s.slug === slug)
  if (found) return found
  throw new Error('Service not found')
}

