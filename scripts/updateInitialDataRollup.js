const fs = require('fs')
const path = require('path')

// 1. Update src/data/initialData.js
const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initialData.js')
const initialData = require(initialDataPath)

const rollupCategory = {
  _id: "cat-rollup-banners-dubai",
  id: 10,
  name: "Rollup Banners",
  slug: "rollup-banners",
  description: "Premium retractable roll-up banner stands, pull-up exhibition displays, and pop-up banners printed on anti-curl blockout film with sturdy aluminium cassette bases and carry bags.",
  image: "/assets/products/rollup_banner_showcase.jpg",
  image_url: "/assets/products/rollup_banner_showcase.jpg",
  status: "active",
  display_order: 10,
  active: true,
  seoTitle: "Rollup Banner Printing Dubai | Retractable Pull-Up Banner Stands | ONPRINT",
  seoDescription: "High-quality roll-up banner printing in Dubai. Standard 85x200cm, Wide 100x200cm, and luxury teardrop retractable pull-up banners with express same-day delivery across UAE.",
  seoKeywords: "rollup banner dubai, roll up banner printing dubai, pull up banner stand dubai, retractable banner dubai, exhibition banner stands uae, popup banner dubai",
  seoHeading: "Premium Roll-Up Banner Printing & Retractable Stands Dubai",
  canonicalUrl: "https://0nprint.com/categories/rollup-banners",
  imageAlt: "Professional retractable roll-up banner stand printing in Dubai"
}

const rollupService = {
  _id: "serv-rollup-banners-dubai",
  id: 10,
  name: "Rollup Banners Printing",
  slug: "rollup-banners",
  category: {
    _id: "cat-rollup-banners-dubai",
    name: "Rollup Banners",
    slug: "rollup-banners"
  },
  shortDescription: "High-definition retractable roll-up banners and pull-up exhibition displays with durable aluminum cassette stands and padded carry bags.",
  description: "Elevate your brand presence at exhibitions, conferences, and retail spaces with ONPRINT Dubai roll-up banner printing. Printed in 1440 DPI photo resolution on anti-curl greyback blockout media with fast same-day and 24-hour turnaround.",
  image: "/assets/products/rollup_banner_showcase.jpg",
  imageAlt: "Professional roll-up banner printing services in Dubai",
  seoTitle: "Rollup Banner Printing Services Dubai | Pull-Up Exhibition Stands | ONPRINT",
  seoDescription: "Professional roll-up banner printing services in Dubai. High-definition anti-curl banners with aluminum cassette stands and carry bags for corporate events.",
  seoKeywords: "rollup banner printing dubai, roll up banners uae, pull up stands dubai, exhibition banner printing",
  order: 10,
  active: true
}

const rollupProductsList = [
  {
    _id: "prod-standard-rollup-banner-85x200",
    id: 101,
    name: "Standard Retractable Roll-Up Banner (85cm × 200cm)",
    slug: "standard-rollup-banner-85x200",
    shortDescription: "Popular 85cm × 200cm retractable roll-up banner with twin stabilizing feet, anti-curl blockout film, and padded carry bag.",
    description: "The industry-standard choice for corporate seminars, retail promotions, and exhibition stands across Dubai and the UAE. Features a lightweight anodized aluminum base with two swing-out stabilizing feet, three-part bungee shock pole, and high-definition 1440 DPI UV/Eco-Solvent printed 220μm anti-curl greyback PET film that stays perfectly flat.",
    price: 145,
    minimumQuantity: 1,
    featured: true,
    active: true,
    image: "/assets/products/rollup_banner_showcase.jpg",
    images: ["/assets/products/rollup_banner_showcase.jpg", "/assets/products/rollup_banner.jpg"],
    features: [
      "Standard 85cm (W) × 200cm (H) Display Size",
      "220μm Tear-Resistant Anti-Curl Greyback Blockout Film",
      "Anodized Aluminum Cassette with Dual Stabilizing Feet",
      "Includes Padded Oxford Nylon Travel Carry Bag",
      "1440 DPI High-Definition Full Color UV Printing"
    ],
    specifications: {
      sizes: [
        { label: "85cm × 200cm (Standard)", value: "85x200" },
        { label: "100cm × 200cm (Wide)", value: "100x200" }
      ],
      materials: [
        { label: "220μm Anti-Curl Greyback Blockout PET", value: "greyback-220" },
        { label: "260μm Satin Smooth Blockout Polypropylene", value: "satin-260" }
      ],
      finishes: [
        { label: "Matte Anti-Glare Finish", value: "matte" },
        { label: "Vibrant Gloss Laminated Finish", value: "gloss" }
      ],
      turnaround: [
        { label: "Same-Day / Express 24h Dispatch", value: "express-24h" },
        { label: "Standard 2–3 Days", value: "standard" }
      ]
    },
    categories: [
      {
        _id: "cat-rollup-banners-dubai",
        id: 10,
        name: "Rollup Banners",
        slug: "rollup-banners"
      }
    ]
  },
  {
    _id: "prod-luxury-teardrop-rollup-banner",
    id: 102,
    name: "Luxury Teardrop Chrome Roll-Up Banner (85cm × 200cm)",
    slug: "luxury-teardrop-rollup-banner",
    shortDescription: "Executive wide-base teardrop cassette roll-up banner with chrome end-caps (no swing feet required).",
    description: "Designed for luxury Dubai press conferences, 5-star hotel lobbies, and premium corporate launches. Heavyweight cast-aluminum teardrop base with high-sheen chrome side accents provides ultimate freestanding stability without floor feet. Printed on 260μm satin smooth blockout film with rich color saturation.",
    price: 280,
    minimumQuantity: 1,
    featured: true,
    active: true,
    image: "/assets/products/rollup_banner_showcase.jpg",
    images: ["/assets/products/rollup_banner_showcase.jpg", "/assets/products/service_exhibition_signage.jpg"],
    features: [
      "Executive 85cm (W) × 200cm (H) Free-Standing Display",
      "Luxury Teardrop Base with High-Gloss Chrome End-Caps",
      "Footless Design with Low Center of Gravity",
      "260μm Satin Smooth Blockout Film",
      "Heavy-Duty Padded Zipper Bag Included"
    ],
    specifications: {
      sizes: [
        { label: "85cm × 200cm (Luxury Teardrop)", value: "85x200" },
        { label: "100cm × 200cm (Luxury Teardrop)", value: "100x200" }
      ],
      materials: [
        { label: "260μm Premium Satin Blockout", value: "satin-260" }
      ],
      finishes: [
        { label: "Matte Anti-Glare Premium Finish", value: "matte" }
      ],
      turnaround: [
        { label: "Same-Day Express 24h", value: "express-24h" },
        { label: "Standard 2 Days", value: "standard" }
      ]
    },
    categories: [
      {
        _id: "cat-rollup-banners-dubai",
        id: 10,
        name: "Rollup Banners",
        slug: "rollup-banners"
      }
    ]
  },
  {
    _id: "prod-wide-exhibition-rollup-banner-100x200",
    id: 103,
    name: "Wide Exhibition Roll-Up Banner (100cm × 200cm)",
    slug: "wide-exhibition-rollup-banner-100x200",
    shortDescription: "Expanded 100cm width roll-up banner stand for high-impact Dubai World Trade Centre (DWTC) exhibition booths.",
    description: "Offers 18% wider graphics coverage than standard models, perfect for sponsor walls, booth entrances, and keynote stages. Built with a reinforced aluminum cassette, top-snapping aluminum clamp rail, and 240μm anti-glare blockout PET media.",
    price: 195,
    minimumQuantity: 1,
    featured: true,
    active: true,
    image: "/assets/products/rollup_banner_showcase.jpg",
    images: ["/assets/products/rollup_banner_showcase.jpg", "/assets/products/rollup_banner.jpg"],
    features: [
      "Wide 100cm (W) × 200cm (H) Panoramic View",
      "240μm Anti-Glare Non-Curling Blockout Film",
      "Dual Stabilizing Feet & Top Aluminum Snapping Rail",
      "Padded Carry Bag Included"
    ],
    categories: [
      {
        _id: "cat-rollup-banners-dubai",
        id: 10,
        name: "Rollup Banners",
        slug: "rollup-banners"
      }
    ]
  },
  {
    _id: "prod-giant-backdrop-rollup-banner-120x200",
    id: 104,
    name: "Giant Backdrop Roll-Up Banner (120cm × 200cm)",
    slug: "giant-backdrop-rollup-banner-120x200",
    shortDescription: "Extra-wide 1.2m retractable display banner with dual support poles for stage and media backdrops.",
    description: "Command attention with a massive 120cm wide banner stand. Equipped with dual interlocking vertical support poles, heavy-duty cassette base, and non-reflective matte blockout graphic film that ensures zero flash glare during photography and video broadcasting.",
    price: 340,
    minimumQuantity: 1,
    featured: true,
    active: true,
    image: "/assets/products/rollup_banner_showcase.jpg",
    images: ["/assets/products/rollup_banner_showcase.jpg", "/assets/products/flags.jpg"],
    features: [
      "Giant 120cm (W) × 200cm (H) Stage Backdrop Size",
      "Twin Telescopic Aluminum Support Poles",
      "Non-Reflective Matte Blockout Film for Camera Flash Protection",
      "Heavy-Gauge Cassette with Deluxe Padded Bag"
    ],
    categories: [
      {
        _id: "cat-rollup-banners-dubai",
        id: 10,
        name: "Rollup Banners",
        slug: "rollup-banners"
      }
    ]
  },
  {
    _id: "prod-double-sided-rollup-banner-85x200",
    id: 105,
    name: "Double-Sided 360° Retractable Roll-Up Banner (85cm × 200cm)",
    slug: "double-sided-rollup-banner-85x200",
    shortDescription: "Dual-graphic retractable banner stand with back-to-back graphics for 360-degree walkway visibility.",
    description: "Maximizes foot traffic engagement in shopping mall concourses, airport terminals, and exhibition aisles. Features dual spring-loaded rollers housing two independent full-color blockout banners inside a single heavy-duty aluminum base.",
    price: 290,
    minimumQuantity: 1,
    featured: true,
    active: true,
    image: "/assets/products/rollup_banner_showcase.jpg",
    images: ["/assets/products/rollup_banner_showcase.jpg", "/assets/products/service_exhibition_signage.jpg"],
    features: [
      "Dual 85cm × 200cm Back-to-Back Graphics",
      "360° Brand Visibility for Hallways and Aisles",
      "Twin Roller Heavy-Duty Base Mechanism",
      "Two Independent 220μm Anti-Curl Printed Banners"
    ],
    categories: [
      {
        _id: "cat-rollup-banners-dubai",
        id: 10,
        name: "Rollup Banners",
        slug: "rollup-banners"
      }
    ]
  },
  {
    _id: "prod-desktop-mini-rollup-banner",
    id: 106,
    name: "Desktop Mini Tabletop Roll-Up Banner (A3 / A4)",
    slug: "desktop-mini-rollup-banner",
    shortDescription: "Compact mini pull-up banner for reception desks, cashier points, and POS counter marketing.",
    description: "High-impact counter display. Engineered with a miniature anodized silver pull-up stand and micro-spring roller. Printed on ultra-fine photographic synthetic film with crystal-clear text and vivid brand graphics. Available in A4 (21×29.7cm) and A3 (29.7×42cm).",
    price: 65,
    minimumQuantity: 2,
    featured: true,
    active: true,
    image: "/assets/products/rollup_banner_showcase.jpg",
    images: ["/assets/products/rollup_banner_showcase.jpg", "/assets/products/rollup_banner.jpg"],
    features: [
      "Available in A4 (21×29.7cm) and A3 (29.7×42cm)",
      "Anodized Aluminum Desktop Miniature Cassette",
      "Photographic Quality 2400 DPI Micro-Print",
      "Perfect for POS Counters, Checkouts & Hotel Receptions"
    ],
    categories: [
      {
        _id: "cat-rollup-banners-dubai",
        id: 10,
        name: "Rollup Banners",
        slug: "rollup-banners"
      }
    ]
  }
]

if (!initialData.categories.some(c => c.slug === 'rollup-banners')) {
  initialData.categories.push(rollupCategory)
}
if (!initialData.services.some(s => s.slug === 'rollup-banners')) {
  initialData.services.push(rollupService)
}
for (const p of rollupProductsList) {
  if (!initialData.products.some(prod => prod.slug === p.slug)) {
    initialData.products.push(p)
  }
}

fs.writeFileSync(initialDataPath, 'module.exports = ' + JSON.stringify(initialData, null, 2) + '\n', 'utf8')
console.log('Successfully updated src/data/initialData.js')

// 2. Update client/src/assets/categoryImageMap.js
const mapPath = path.join(__dirname, '..', 'client', 'src', 'assets', 'categoryImageMap.js')
let mapContent = fs.readFileSync(mapPath, 'utf8')

if (!mapContent.includes("'rollup-banners'")) {
  mapContent = mapContent.replace(
    'export const categoryImageMap = {',
    `export const categoryImageMap = {\n  'rollup-banners': {\n    'rollup-banners': [\n      '/assets/products/rollup_banner_showcase.jpg',\n      '/assets/products/rollup_banner.jpg',\n      '/assets/products/service_exhibition_signage.jpg'\n    ]\n  },`
  )
  fs.writeFileSync(mapPath, mapContent, 'utf8')
  console.log('Successfully updated client/src/assets/categoryImageMap.js')
}
