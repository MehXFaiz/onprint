import api from './api'

export const defaultServices = [
  {
    _id: 'serv-1',
    name: 'Digital & Offset Printing',
    slug: 'digital-offset-printing',
    category: { name: 'Office Stationery Printing' },
    shortDescription: 'High-precision digital and high-volume offset printing with Pantone color matching and crisp CMYK clarity.',
    description: 'From short-run express marketing collateral to high-volume commercial runs, our offset and digital presses deliver pin-sharp resolution, Pantone color fidelity, and rapid turnarounds in Dubai.',
    image: '/assets/products/1 (7).jpg',
    order: 1,
    active: true,
  },
  {
    _id: 'serv-2',
    name: 'Luxury Packaging & Custom Boxes',
    slug: 'luxury-packaging-custom-boxes',
    category: { name: 'Corporate Gift Items' },
    shortDescription: 'Custom rigid boxes, magnetic gift boxes, folding cartons, and specialty foil-stamped presentation sleeves.',
    description: 'Elevate unboxing experiences with custom-engineered rigid gift boxes, velvet interiors, foil debossing, soft-touch laminates, and magnetic closures designed for luxury UAE brands.',
    image: '/assets/products/1 (5).jpg',
    order: 2,
    active: true,
  },
  {
    _id: 'serv-3',
    name: 'Corporate Gift Customization',
    slug: 'corporate-gift-customization',
    category: { name: 'Corporate Gift Items' },
    shortDescription: 'Bespoke corporate merchandise, executive desk sets, thermal flasks, custom mugs, and apparel embroidery.',
    description: 'Turn everyday corporate giveaways into premium branded keepsakes. Laser engraving, screen printing, and UV printing on stainless steel flasks, leather items, ceramic mugs, and apparel.',
    image: '/assets/products/1 (13).jpg',
    order: 3,
    active: true,
  },
  {
    _id: 'serv-4',
    name: 'Large Format & Exhibition Signage',
    slug: 'large-format-exhibition-signage',
    category: { name: 'Other Products' },
    shortDescription: 'Roll-up banner stands, pop-up backdrops, outdoor teardrop flags, acrylic nameplates, and wall graphics.',
    description: 'Make your brand unmissable at trade shows and events. Durable UV-resistant inks, anti-curl PET film roll-ups, acrylic door plates, and high-impact outdoor promotional banners.',
    image: '/assets/products/1 (9).jpg',
    order: 4,
    active: true,
  },
  {
    _id: 'serv-5',
    name: 'Custom Labels & Die-Cut Stickers',
    slug: 'custom-labels-die-cut-stickers',
    category: { name: 'Other Products' },
    shortDescription: 'Waterproof vinyl stickers, product packaging labels, gold foil seals, and roll labels.',
    description: 'Precision contour-cut stickers and product packaging labels printed on waterproof vinyl, metallic foil, or transparent stock with scratch-resistant matte or gloss UV finish.',
    image: '/assets/products/1 (11).jpg',
    order: 5,
    active: true,
  },
  {
    _id: 'serv-6',
    name: 'Executive Business Stationery',
    slug: 'executive-business-stationery',
    category: { name: 'Office Stationery Printing' },
    shortDescription: 'Premium business cards, cotton letterheads, custom envelopes, and luxury foil presentation folders.',
    description: 'Leave a lasting impression with 350gsm–400gsm cotton card stocks, edge painting, gold or silver foil embossing, spot UV varnishing, and custom die-cut corporate folders.',
    image: '/assets/products/1 (8).jpg',
    order: 6,
    active: true,
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

