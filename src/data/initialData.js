function img(seed) {
  return `https://picsum.photos/seed/onprint-${seed}/900/700`
}

const categories = [
  {
    _id: 'cat-1',
    name: 'Business Stationery',
    slug: 'business-stationery',
    description: 'Business cards, letterheads and everyday office stationery.',
    active: true,
  },
  {
    _id: 'cat-2',
    name: 'Marketing Materials',
    slug: 'marketing-materials',
    description: 'Flyers, brochures and posters that get your message out.',
    active: true,
  },
  {
    _id: 'cat-3',
    name: 'Packaging & Labels',
    slug: 'packaging-labels',
    description: 'Custom boxes, packaging and stickers for your products.',
    active: true,
  },
  {
    _id: 'cat-4',
    name: 'Banners & Signage',
    slug: 'banners-signage',
    description: 'Large-format banners and signage for events and storefronts.',
    active: true,
  },
  {
    _id: 'cat-5',
    name: 'Promotional Products',
    slug: 'promotional-products',
    description: 'Calendars and branded giveaways for marketing campaigns.',
    active: true,
  },
  {
    _id: 'cat-6',
    name: 'Custom & Specialty',
    slug: 'custom-specialty',
    description: 'Certificates, invitations and one-off custom print jobs.',
    active: true,
  },
]

const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c]))

const rawServices = [
  { name: 'Digital Printing', slug: 'digital-printing', category: 'business-stationery', shortDescription: 'Fast, high-quality short-run digital printing for any project.', order: 1 },
  { name: 'Offset Printing', slug: 'offset-printing', category: 'business-stationery', shortDescription: 'Cost-effective, consistent color for high-volume print runs.', order: 2 },
  { name: 'Business Cards', slug: 'business-cards-service', category: 'business-stationery', shortDescription: 'Premium finishes that make a strong first impression.', order: 3 },
  { name: 'Brochures', slug: 'brochures-service', category: 'marketing-materials', shortDescription: 'Multi-page, multi-fold brochures for products and services.', order: 4 },
  { name: 'Flyers', slug: 'flyers-service', category: 'marketing-materials', shortDescription: 'Eye-catching flyers for promotions and announcements.', order: 5 },
  { name: 'Posters', slug: 'posters-service', category: 'marketing-materials', shortDescription: 'Large-format posters in vivid, durable color.', order: 6 },
  { name: 'Packaging', slug: 'packaging-service', category: 'packaging-labels', shortDescription: 'Custom retail and shipping packaging built to spec.', order: 7 },
  { name: 'Labels & Stickers', slug: 'labels-stickers', category: 'packaging-labels', shortDescription: 'Die-cut labels and stickers in any shape or finish.', order: 8 },
  { name: 'Banners', slug: 'banners-service', category: 'banners-signage', shortDescription: 'Indoor and outdoor banners built for visibility.', order: 9 },
  { name: 'Stationery', slug: 'stationery-service', category: 'business-stationery', shortDescription: 'Letterheads, envelopes and branded office supplies.', order: 10 },
  { name: 'Promotional Materials', slug: 'promotional-materials-service', category: 'promotional-products', shortDescription: 'Branded calendars, cards and giveaways.', order: 11 },
  { name: 'Custom Printing', slug: 'custom-printing', category: 'custom-specialty', shortDescription: 'Certificates, invitations and specialty one-off jobs.', order: 12 },
]

const services = rawServices.map((s, idx) => ({
  _id: `srv-${idx + 1}`,
  name: s.name,
  slug: s.slug,
  category: categoryMap[s.category]
    ? { _id: categoryMap[s.category]._id, name: categoryMap[s.category].name, slug: categoryMap[s.category].slug }
    : null,
  shortDescription: s.shortDescription,
  order: s.order,
  image: img(s.slug),
  active: true,
}))

const sizeOptions = [
  { label: 'Standard', priceModifier: 0 },
  { label: 'Large', priceModifier: 15 },
]
const materialOptions = [
  { label: '300gsm Matte', priceModifier: 0 },
  { label: '350gsm Gloss', priceModifier: 8 },
  { label: 'Recycled Kraft', priceModifier: 5 },
]
const finishOptions = [
  { label: 'None', priceModifier: 0 },
  { label: 'Spot UV', priceModifier: 20 },
  { label: 'Foil Stamping', priceModifier: 35 },
]

const rawProducts = [
  {
    name: 'Business Cards',
    slug: 'business-cards',
    category: 'business-stationery',
    shortDescription: 'Premium business cards with a range of finishes.',
    description: 'Make a lasting first impression with premium business cards, available in a range of paper stocks and finishes.',
    price: 45,
    minimumQuantity: 100,
    featured: true,
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: finishOptions },
  },
  {
    name: 'Letterheads',
    slug: 'letterheads',
    category: 'business-stationery',
    shortDescription: 'Branded letterheads for professional correspondence.',
    description: 'Professional letterheads printed on quality paper stock, customized with your brand identity.',
    price: 60,
    minimumQuantity: 250,
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: [finishOptions[0]] },
  },
  {
    name: 'Flyers',
    slug: 'flyers',
    category: 'marketing-materials',
    shortDescription: 'Vivid, full-color flyers for promotions and events.',
    description: 'Full-color flyers printed fast, perfect for promotions, events and announcements.',
    price: 35,
    minimumQuantity: 100,
    featured: true,
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: [finishOptions[0], finishOptions[1]] },
  },
  {
    name: 'Brochures',
    slug: 'brochures',
    category: 'marketing-materials',
    shortDescription: 'Tri-fold and bi-fold brochures that tell your story.',
    description: 'Multi-page, multi-fold brochures designed to showcase your products and services in detail.',
    price: 90,
    minimumQuantity: 100,
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: finishOptions },
  },
  {
    name: 'Posters',
    slug: 'posters',
    category: 'marketing-materials',
    shortDescription: 'Large-format posters in bold, durable color.',
    description: 'Large-format posters printed in vivid color on durable stock, ideal for retail and events.',
    price: null,
    minimumQuantity: 10,
    featured: true,
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: [finishOptions[0]] },
  },
  {
    name: 'Stickers & Labels',
    slug: 'stickers-labels',
    category: 'packaging-labels',
    shortDescription: 'Die-cut stickers and labels in any shape.',
    description: 'Custom die-cut stickers and product labels available in a variety of shapes, sizes and finishes.',
    price: 40,
    minimumQuantity: 250,
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: finishOptions },
  },
  {
    name: 'Boxes & Packaging',
    slug: 'boxes-packaging',
    category: 'packaging-labels',
    shortDescription: 'Custom retail and shipping boxes built to spec.',
    description: 'Custom-printed boxes and packaging built to your exact dimensions and branding requirements.',
    price: null,
    minimumQuantity: 50,
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: finishOptions },
  },
  {
    name: 'Envelopes',
    slug: 'envelopes',
    category: 'business-stationery',
    shortDescription: 'Branded envelopes to match your stationery set.',
    description: 'Custom-printed envelopes in a range of sizes, printed to match your brand stationery.',
    price: 55,
    minimumQuantity: 250,
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: [finishOptions[0]] },
  },
  {
    name: 'Certificates',
    slug: 'certificates',
    category: 'custom-specialty',
    shortDescription: 'Premium certificates for awards and recognition.',
    description: 'Premium printed certificates on quality stock, perfect for awards, recognition and achievements.',
    price: 50,
    minimumQuantity: 25,
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: finishOptions },
  },
  {
    name: 'Invitations',
    slug: 'invitations',
    category: 'custom-specialty',
    shortDescription: 'Elegant invitations for every occasion.',
    description: 'Custom-designed invitations for weddings, corporate events and special occasions.',
    price: 65,
    minimumQuantity: 50,
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: finishOptions },
  },
  {
    name: 'Banners',
    slug: 'banners',
    category: 'banners-signage',
    shortDescription: 'Durable indoor and outdoor banners.',
    description: 'Weather-resistant banners built for indoor and outdoor use, from storefronts to trade shows.',
    price: null,
    minimumQuantity: 1,
    featured: true,
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: [finishOptions[0]] },
  },
  {
    name: 'Calendars',
    slug: 'calendars',
    category: 'promotional-products',
    shortDescription: 'Branded calendars for year-round marketing.',
    description: 'Custom-branded wall and desk calendars, a lasting promotional item for clients and staff.',
    price: 70,
    minimumQuantity: 50,
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: [finishOptions[0]] },
  },
  {
    name: 'Custom Printed Products',
    slug: 'custom-printed-products',
    category: 'custom-specialty',
    shortDescription: 'Have something specific in mind? Let’s talk.',
    description: 'For projects that don’t fit a standard category, our team will work with you on a fully custom print solution.',
    price: null,
    minimumQuantity: 1,
    specifications: { sizes: [], materials: [], finishes: [] },
  },
]

const products = rawProducts.map((p, idx) => ({
  _id: `prod-${idx + 1}`,
  name: p.name,
  slug: p.slug,
  category: categoryMap[p.category]
    ? { _id: categoryMap[p.category]._id, name: categoryMap[p.category].name, slug: categoryMap[p.category].slug }
    : null,
  shortDescription: p.shortDescription,
  description: p.description,
  price: p.price,
  minimumQuantity: p.minimumQuantity,
  featured: Boolean(p.featured),
  specifications: p.specifications,
  images: [img(p.slug), img(`${p.slug}-alt`)],
  active: true,
  createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
}))

module.exports = {
  categories,
  services,
  products,
}
