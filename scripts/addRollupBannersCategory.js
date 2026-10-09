const fs = require('fs')
const path = require('path')

// 1. Update src/config/database.js
const dbJsPath = path.join(__dirname, '..', 'src', 'config', 'database.js')
let dbJs = fs.readFileSync(dbJsPath, 'utf8')

const rollupCategory = `  {
    category_key: 'cat-rollup-banners-dubai',
    name: 'Rollup Banners',
    slug: 'rollup-banners',
    description: 'Premium retractable roll-up banner stands, pull-up exhibition displays, and pop-up banners printed on anti-curl blockout film with sturdy aluminium cassette bases and carry bags.',
    image: '/assets/products/rollup_banner_showcase.jpg',
    image_url: '/assets/products/rollup_banner_showcase.jpg',
    status: 'active',
    display_order: 10,
    active: 1,
    seo_title: 'Rollup Banner Printing Dubai | Retractable Pull-Up Banner Stands | ONPRINT',
    seo_description: 'High-quality roll-up banner printing in Dubai. Standard 85x200cm, Wide 100x200cm, and luxury teardrop retractable pull-up banners with express same-day delivery across UAE.',
    seo_keywords: 'rollup banner dubai, roll up banner printing dubai, pull up banner stand dubai, retractable banner dubai, exhibition banner stands uae, popup banner dubai',
    seo_heading: 'Premium Roll-Up Banner Printing & Retractable Stands Dubai',
    canonical_url: 'https://0nprint.com/categories/rollup-banners',
    image_alt: 'Professional retractable roll-up banner stand printing in Dubai',
  },`

const rollupService = `  {
    service_key: 'serv-rollup-banners-dubai',
    category_slug: 'rollup-banners',
    name: 'Rollup Banners Printing',
    slug: 'rollup-banners',
    short_description: 'High-definition retractable roll-up banners and pull-up exhibition displays with durable aluminum cassette stands and padded carry bags.',
    description: 'Elevate your brand presence at exhibitions, conferences, and retail spaces with ONPRINT Dubai roll-up banner printing. Printed in 1440 DPI photo resolution on anti-curl greyback blockout media with fast same-day and 24-hour turnaround.',
    image: '/assets/products/rollup_banner_showcase.jpg',
    display_order: 10,
    active: 1,
    seo_title: 'Rollup Banner Printing Services Dubai | Pull-Up Exhibition Stands | ONPRINT',
    seo_description: 'Professional roll-up banner printing services in Dubai. High-definition anti-curl banners with aluminum cassette stands and carry bags for corporate events.',
    seo_keywords: 'rollup banner printing dubai, roll up banners uae, pull up stands dubai, exhibition banner printing',
    seo_heading: 'Professional Roll-Up Banner Printing Services in Dubai',
    canonical_url: 'https://0nprint.com/services/rollup-banners',
    image_alt: 'Professional roll-up banner printing services in Dubai',
  },`

const rollupProducts = `  {
    product_key: 'prod-standard-rollup-banner-85x200',
    category_slug: 'rollup-banners',
    name: "Standard Retractable Roll-Up Banner (85cm × 200cm)",
    slug: 'standard-rollup-banner-85x200',
    short_description: "Popular 85cm × 200cm retractable roll-up banner with twin stabilizing feet, anti-curl blockout film, and padded carry bag.",
    description: "The industry-standard choice for corporate seminars, retail promotions, and exhibition stands across Dubai and the UAE. Features a lightweight anodized aluminum base with two swing-out stabilizing feet, three-part bungee shock pole, and high-definition 1440 DPI UV/Eco-Solvent printed 220μm anti-curl greyback PET film that stays perfectly flat.",
    price: 145.00,
    minimum_quantity: 1,
    featured: 1,
    seo_title: "Standard Roll-Up Banner 85x200cm Dubai | Retractable Stand | ONPRINT",
    seo_description: "Standard 85x200cm roll-up banner printing in Dubai. Anodized aluminum base, anti-curl blockout film, high-definition photo print, and padded bag.",
    seo_keywords: "standard rollup banner dubai, 85x200 banner stand uae, pull up banner 85cm dubai",
    seo_heading: "Standard Retractable Roll-Up Banner (85cm × 200cm) in Dubai",
    canonical_url: 'https://0nprint.com/products/standard-rollup-banner-85x200',
    image_alt: "Standard 85x200cm retractable roll-up banner stand in Dubai",
    images: ["/assets/products/rollup_banner_showcase.jpg", "/assets/products/rollup_banner.jpg"],
  },
  {
    product_key: 'prod-luxury-teardrop-rollup-banner',
    category_slug: 'rollup-banners',
    name: "Luxury Teardrop Chrome Roll-Up Banner (85cm × 200cm)",
    slug: 'luxury-teardrop-rollup-banner',
    short_description: "Executive wide-base teardrop cassette roll-up banner with chrome end-caps (no swing feet required).",
    description: "Designed for luxury Dubai press conferences, 5-star hotel lobbies, and premium corporate launches. Heavyweight cast-aluminum teardrop base with high-sheen chrome side accents provides ultimate freestanding stability without floor feet. Printed on 260μm satin smooth blockout film with rich color saturation.",
    price: 280.00,
    minimum_quantity: 1,
    featured: 1,
    seo_title: "Luxury Teardrop Roll-Up Banner Dubai | Executive Chrome Stand | ONPRINT",
    seo_description: "Luxury teardrop base roll-up banner printing in Dubai. Chrome accents, footless wide cassette, and satin blockout media for VIP exhibitions.",
    seo_keywords: "luxury rollup banner dubai, teardrop banner stand uae, chrome base pull up banner",
    seo_heading: "Luxury Teardrop Chrome Roll-Up Banner (85cm × 200cm) in Dubai",
    canonical_url: 'https://0nprint.com/products/luxury-teardrop-rollup-banner',
    image_alt: "Luxury teardrop chrome base roll-up banner stand in Dubai",
    images: ["/assets/products/rollup_banner_showcase.jpg", "/assets/products/service_exhibition_signage.jpg"],
  },
  {
    product_key: 'prod-wide-exhibition-rollup-banner-100x200',
    category_slug: 'rollup-banners',
    name: "Wide Exhibition Roll-Up Banner (100cm × 200cm)",
    slug: 'wide-exhibition-rollup-banner-100x200',
    short_description: "Expanded 100cm width roll-up banner stand for high-impact Dubai World Trade Centre (DWTC) exhibition booths.",
    description: "Offers 18% wider graphics coverage than standard models, perfect for sponsor walls, booth entrances, and keynote stages. Built with a reinforced aluminum cassette, top-snapping aluminum clamp rail, and 240μm anti-glare blockout PET media.",
    price: 195.00,
    minimum_quantity: 1,
    featured: 1,
    seo_title: "Wide Roll-Up Banner 100x200cm Dubai | Exhibition Banner Stands | ONPRINT",
    seo_description: "Order wide 100x200cm roll-up banners in Dubai. Extra-wide coverage, heavy-duty cassette stand, anti-glare blockout film, and fast delivery.",
    seo_keywords: "wide rollup banner dubai, 100x200 pull up banner uae, exhibition stands dubai",
    seo_heading: "Wide Exhibition Roll-Up Banner (100cm × 200cm) in Dubai",
    canonical_url: 'https://0nprint.com/products/wide-exhibition-rollup-banner-100x200',
    image_alt: "Wide 100x200cm exhibition roll-up banner stand in Dubai",
    images: ["/assets/products/rollup_banner_showcase.jpg", "/assets/products/rollup_banner.jpg"],
  },
  {
    product_key: 'prod-giant-backdrop-rollup-banner-120x200',
    category_slug: 'rollup-banners',
    name: "Giant Backdrop Roll-Up Banner (120cm × 200cm)",
    slug: 'giant-backdrop-rollup-banner-120x200',
    short_description: "Extra-wide 1.2m retractable display banner with dual support poles for stage and media backdrops.",
    description: "Command attention with a massive 120cm wide banner stand. Equipped with dual interlocking vertical support poles, heavy-duty cassette base, and non-reflective matte blockout graphic film that ensures zero flash glare during photography and video broadcasting.",
    price: 340.00,
    minimum_quantity: 1,
    featured: 1,
    seo_title: "Giant Roll-Up Banner 120x200cm Dubai | Backdrop Banner Stand | ONPRINT",
    seo_description: "120x200cm giant retractable banner printing in Dubai. Dual pole support, anti-glare matte blockout film for stage backdrops and photo walls.",
    seo_keywords: "giant rollup banner dubai, 120x200 banner stand uae, backdrop pull up banner",
    seo_heading: "Giant Backdrop Roll-Up Banner (120cm × 200cm) in Dubai",
    canonical_url: 'https://0nprint.com/products/giant-backdrop-rollup-banner-120x200',
    image_alt: "Giant 120x200cm retractable backdrop banner in Dubai",
    images: ["/assets/products/rollup_banner_showcase.jpg", "/assets/products/flags.jpg"],
  },
  {
    product_key: 'prod-double-sided-rollup-banner-85x200',
    category_slug: 'rollup-banners',
    name: "Double-Sided 360° Retractable Roll-Up Banner (85cm × 200cm)",
    slug: 'double-sided-rollup-banner-85x200',
    short_description: "Dual-graphic retractable banner stand with back-to-back graphics for 360-degree walkway visibility.",
    description: "Maximizes foot traffic engagement in shopping mall concourses, airport terminals, and exhibition aisles. Features dual spring-loaded rollers housing two independent full-color blockout banners inside a single heavy-duty aluminum base.",
    price: 290.00,
    minimum_quantity: 1,
    featured: 1,
    seo_title: "Double-Sided Roll-Up Banner Dubai | 360 Degree Pull-Up Stand | ONPRINT",
    seo_description: "Double-sided roll-up banner printing in Dubai. Two full-color retractable graphics in one stand for 360-degree visibility in malls and expos.",
    seo_keywords: "double sided rollup banner dubai, dual graphic banner stand uae, 360 pull up banner",
    seo_heading: "Double-Sided 360° Retractable Roll-Up Banner in Dubai",
    canonical_url: 'https://0nprint.com/products/double-sided-rollup-banner-85x200',
    image_alt: "Double-sided retractable roll-up banner stand in Dubai",
    images: ["/assets/products/rollup_banner_showcase.jpg", "/assets/products/service_exhibition_signage.jpg"],
  },
  {
    product_key: 'prod-desktop-mini-rollup-banner',
    category_slug: 'rollup-banners',
    name: "Desktop Mini Tabletop Roll-Up Banner (A3 / A4)",
    slug: 'desktop-mini-rollup-banner',
    short_description: "Compact mini pull-up banner for reception desks, cashier points, and POS counter marketing.",
    description: "High-impact counter display. Engineered with a miniature anodized silver pull-up stand and micro-spring roller. Printed on ultra-fine photographic synthetic film with crystal-clear text and vivid brand graphics. Available in A4 (21×29.7cm) and A3 (29.7×42cm).",
    price: 65.00,
    minimum_quantity: 2,
    featured: 1,
    seo_title: "Desktop Mini Roll-Up Banner A3 A4 Dubai | Tabletop Pull-Up | ONPRINT",
    seo_description: "Mini tabletop roll-up banner printing in Dubai. Compact A3 and A4 desktop pull-up banners for reception desks and point-of-sale displays.",
    seo_keywords: "mini rollup banner dubai, tabletop pull up stand uae, desktop banner printing a4 a3",
    seo_heading: "Desktop Mini Tabletop Roll-Up Banner (A3 / A4) in Dubai",
    canonical_url: 'https://0nprint.com/products/desktop-mini-rollup-banner',
    image_alt: "Desktop mini tabletop pull-up banner stand in Dubai",
    images: ["/assets/products/rollup_banner_showcase.jpg", "/assets/products/rollup_banner.jpg"],
  },`

if (!dbJs.includes("'cat-rollup-banners-dubai'")) {
  dbJs = dbJs.replace(
    /category_key:\s*'cat-bottle-printing-dubai'[\s\S]*?canonical_url:\s*'https:\/\/0nprint\.com\/categories\/bottle-printing-dubai',[\s\S]*?image_alt:[\s\S]*?},\s*\]/m,
    (match) => match.replace(/\],\s*$/, `  },\n${rollupCategory}\n]`)
  )
  console.log('Inserted Rollup Banners to seedCategoriesList in database.js')
}

if (!dbJs.includes("'serv-rollup-banners-dubai'")) {
  dbJs = dbJs.replace(
    /service_key:\s*'serv-bottle-printing-dubai'[\s\S]*?canonical_url:\s*'https:\/\/0nprint\.com\/services\/bottle-printing-dubai',[\s\S]*?image_alt:[\s\S]*?},\s*\]/m,
    (match) => match.replace(/\],\s*$/, `  },\n${rollupService}\n]`)
  )
  console.log('Inserted Rollup Banners to seedServicesList in database.js')
}

if (!dbJs.includes("'prod-standard-rollup-banner-85x200'")) {
  dbJs = dbJs.replace(
    /product_key:\s*'prod-luxury-copper-insulated-flasks'[\s\S]*?images:\s*\["\/assets\/products\/bottle_luxury_copper\.jpg"\],[\s\S]*?},\s*\]/m,
    (match) => match.replace(/\],\s*$/, `  },\n${rollupProducts}\n]`)
  )
  console.log('Inserted Rollup Banners products to seedProductsList in database.js')
}

fs.writeFileSync(dbJsPath, dbJs, 'utf8')
console.log('Successfully updated src/config/database.js')
