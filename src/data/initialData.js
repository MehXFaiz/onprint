function img(seed) {
  return `https://picsum.photos/seed/onprint-${seed}/900/700`
}

const categories = [
  {
    _id: 'cat-corporate-gifts',
    name: 'Corporate Gift Items',
    slug: 'corporate-gift-items',
    description: 'Premium branded gifts, apparel, mugs, and giveaways designed for businesses and corporate events in Dubai.',
    active: true,
  },
  {
    _id: 'cat-office-stationery',
    name: 'Office Stationery Printing',
    slug: 'office-stationery-printing',
    description: 'Executive notebooks, pens, business cards, and letterheads tailored for professional brand correspondence.',
    active: true,
  },
  {
    _id: 'cat-other-products',
    name: 'Other Products',
    slug: 'other-products',
    description: 'Large-format roll-ups, outdoor flags, die-cut vinyl stickers, and acrylic executive nameplates.',
    active: true,
  },
]

const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c]))

const sizeOptions = [
  { label: 'Standard', priceModifier: 0 },
  { label: 'Large / Executive', priceModifier: 15 },
]
const materialOptions = [
  { label: '300gsm Silk Stock', priceModifier: 0 },
  { label: '350gsm Soft-Touch', priceModifier: 8 },
  { label: 'Premium Metallic / Kraft', priceModifier: 12 },
]
const finishOptions = [
  { label: 'Matte Lamination', priceModifier: 0 },
  { label: 'Spot UV Varnish', priceModifier: 20 },
  { label: 'Metallic Gold Foil', priceModifier: 35 },
]

const rawProducts = [
  // CORPORATE GIFT ITEMS
  {
    name: 'Mug Printing Dubai',
    slug: 'mug-printing-dubai',
    category: 'corporate-gift-items',
    shortDescription: 'High-quality ceramic & thermal mugs custom printed with corporate logos and sublimation.',
    description: 'Premium 11oz & 15oz ceramic mugs with dishwasher-safe full-color sublimation printing. Ideal for corporate branding and office gifts.',
    price: 25,
    minimumQuantity: 20,
    featured: true,
    image: '/assets/products/1 (1).jpg',
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: finishOptions },
  },
  {
    name: 'Custom Mouse Pad',
    slug: 'custom-mouse-pad',
    category: 'corporate-gift-items',
    shortDescription: 'Smooth micro-weave fabric mouse pads with non-slip rubber base & anti-fray edge stitching.',
    description: 'Ultra-smooth tracking surface custom printed with your high-resolution brand artwork or desk mat designs.',
    price: 35,
    minimumQuantity: 25,
    featured: false,
    image: '/assets/products/1 (2).jpg',
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: [finishOptions[0]] },
  },
  {
    name: 'T-Shirt Printing Dubai',
    slug: 't-shirt-printing-dubai',
    category: 'corporate-gift-items',
    shortDescription: 'Premium 100% combed cotton t-shirts with DTG, screen printing, and embroidered logos.',
    description: 'Breathable, durable corporate crewneck & polo t-shirts printed with vibrant eco-friendly inks or precision embroidery.',
    price: 45,
    minimumQuantity: 15,
    featured: true,
    image: '/assets/products/1 (3).jpg',
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: [finishOptions[0]] },
  },
  {
    name: 'Cap Printing Dubai',
    slug: 'cap-printing-dubai',
    category: 'corporate-gift-items',
    shortDescription: 'Customized snapback, baseball, and trucker caps with 3D embroidery & printed logos.',
    description: 'High-profile structured caps featuring adjustable straps, custom interior taping, and bold 3D puff embroidery.',
    price: 30,
    minimumQuantity: 20,
    featured: false,
    image: '/assets/products/1 (4).jpg',
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: [finishOptions[0]] },
  },

  // OFFICE STATIONERY PRINTING
  {
    name: 'Notebook Printing',
    slug: 'notebook-printing',
    category: 'office-stationery-printing',
    shortDescription: 'Hardcover leatherette journals with foil stamped covers and ribbon page markers.',
    description: 'Executive A5 & A4 bound notebooks with 80gsm cream ruled pages, custom ribbon markers, and debossed covers.',
    price: 40,
    minimumQuantity: 50,
    featured: true,
    image: '/assets/products/1 (5).jpg',
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: finishOptions },
  },
  {
    name: 'Pens Printing',
    slug: 'pens-printing',
    category: 'office-stationery-printing',
    shortDescription: 'Metallic & eco-friendly rollerball pens laser engraved or screen printed with your brand.',
    description: 'Sleek metal body ballpoint pens with black or blue German ink refills, packaged in velvet presentation pouches.',
    price: 15,
    minimumQuantity: 100,
    featured: false,
    image: '/assets/products/1 (6).jpg',
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: [finishOptions[0]] },
  },
  {
    name: 'Business Cards Printing',
    slug: 'business-cards-printing',
    category: 'office-stationery-printing',
    shortDescription: 'Premium 350gsm silk, soft-touch matte laminate, and gold foil embossed cards.',
    description: 'Make an undeniable first impression with thick 350gsm–400gsm cotton or soft-touch laminated cards with painted edges.',
    price: 50,
    minimumQuantity: 100,
    featured: true,
    image: '/assets/products/1 (7).jpg',
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: finishOptions },
  },
  {
    name: 'Letterhead Printing Dubai',
    slug: 'letterhead-printing-dubai',
    category: 'office-stationery-printing',
    shortDescription: 'Executive 120gsm smooth white letterheads printed in crisp full-color CMYK.',
    description: 'Laser-guaranteed 120gsm smooth uncoated paper letterheads for official corporate contracts, invoices, and letters.',
    price: 65,
    minimumQuantity: 250,
    featured: false,
    image: '/assets/products/1 (8).jpg',
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: [finishOptions[0]] },
  },

  // OTHER PRODUCTS
  {
    name: 'Roll-up Printing Dubai',
    slug: 'roll-up-printing-dubai',
    category: 'other-products',
    shortDescription: 'Heavy-duty aluminum roll-up banner stands with anti-curl grey back film & padded bag.',
    description: '85x200cm & 100x200cm retractable banner stands printed on high-resolution anti-curl PET film for exhibitions and retail.',
    price: 180,
    minimumQuantity: 1,
    featured: true,
    image: '/assets/products/1 (9).jpg',
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: [finishOptions[0]] },
  },
  {
    name: 'Flag Printing Dubai',
    slug: 'flag-printing-dubai',
    category: 'other-products',
    shortDescription: 'Teardrop and feather beach flags with weather-resistant knitted polyester print.',
    description: 'Dynamic outdoor promotional flags with heavy water bags, ground spikes, and single or double-sided mirror printing.',
    price: 220,
    minimumQuantity: 1,
    featured: false,
    image: '/assets/products/1 (10).jpg',
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: [finishOptions[0]] },
  },
  {
    name: 'Stickers Printing Dubai',
    slug: 'stickers-printing-dubai',
    category: 'other-products',
    shortDescription: 'Waterproof vinyl die-cut stickers, kiss-cut sheets, and metallic foil product labels.',
    description: 'Durable weather-resistant vinyl stickers with matte or gloss UV lamination for packaging, windows, and branding.',
    price: 40,
    minimumQuantity: 250,
    featured: true,
    image: '/assets/products/1 (11).jpg',
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: finishOptions },
  },
  {
    name: 'Name Plate Printing Dubai',
    slug: 'name-plate-printing-dubai',
    category: 'other-products',
    shortDescription: 'Elegant acrylic, stainless steel, and brass desk & door nameplates with UV printing.',
    description: 'Laser-cut clear acrylic or brushed metal door & desk signs with metallic stand-off bolts for modern corporate offices.',
    price: 120,
    minimumQuantity: 1,
    featured: false,
    image: '/assets/products/1 (12).jpg',
    specifications: { sizes: sizeOptions, materials: materialOptions, finishes: finishOptions },
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
  images: [p.image, p.image],
  active: true,
  createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
}))

const services = []

module.exports = {
  categories,
  services,
  products,
}
