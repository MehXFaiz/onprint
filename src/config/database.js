const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const { initialPageSeoRecords } = require('./initialPageSeoData')
const DUBAI_KEYWORDS = require('../data/dubaiKeywordsData')
const DUBAI_BLOGS = require('../data/dubaiBlogsData')
const { UAE_BACKLINKS, UAE_OUTREACH_PROSPECTS, COMPETITOR_GAP_RECORDS } = require('../data/dubaiSeoSeedData')
const { BACKLINK_OPPORTUNITIES } = require('../data/dubaiBacklinkOpportunitiesData')
const { BACKLINK_OPPORTUNITIES_200 } = require('../data/dubaiBacklinkOpportunities200Data')
const { DUBAI_AI_VISIBILITY_QUERIES } = require('../data/dubaiAiVisibilityData')
const { GEO_FAQS } = require('../data/geoFaqsData')
const { GEO_CONTENT_RECORDS } = require('../data/geoContentData')

let pool

function createFallbackPool() {
  const fail = () => Promise.reject(new Error('Database pool is unavailable (degraded mode). Check DB_* environment variables.'))
  return {
    getConnection: fail,
    query: fail,
    execute: fail,
    end: () => Promise.resolve(),
  }
}

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'onprintdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  })
} catch (err) {
  console.warn('[Database] Failed to create MySQL pool (degraded mode):', err.message)
  pool = createFallbackPool()
}

async function columnExists(connection, tableName, columnName) {
  try {
    const [rows] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [tableName, columnName]
    )
    return rows.length > 0
  } catch {
    return false
  }
}

async function addColumnIfMissing(connection, tableName, columnName, columnDefinition) {
  try {
    const exists = await columnExists(connection, tableName, columnName)
    if (!exists) {
      await connection.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${columnDefinition}`)
      console.log(`[Database Migration] Added column '${columnName}' to table '${tableName}'`)
    }
  } catch (err) {
    console.warn(`[Database Migration Note] '${tableName}.${columnName}':`, err.message)
  }
}



const seedCategoriesList = [
  {
    category_key: 'cat-brochures-printing',
    name: 'Brochures Printing',
    slug: 'brochures-printing',
    description: 'Premium corporate bi-fold, tri-fold, and multi-page marketing brochures printed on luxury coated art paper with precision folding and finishing.',
    image: '/uploads/categories/brochures-printing.jpg',
    image_url: '/uploads/categories/brochures-printing.jpg',
    status: 'active',
    display_order: 1,
    active: 1,
    seo_title: 'Brochures Printing in Dubai | Premium Brochure Printing | ONPRINT',
    seo_description: 'Professional brochure printing in Dubai. Custom bi-fold, tri-fold, and multi-page brochures with soft-touch matte lamination and fast turnaround.',
    seo_keywords: 'brochure printing dubai, brochure printing services dubai, custom brochure printing dubai, corporate brochure printing uae, bi fold brochure dubai, product catalog printing dubai',
    seo_heading: 'Commercial Brochure Printing in Dubai',
    canonical_url: 'https://0nprint.com/categories/brochures-printing',
    image_alt: 'Professional commercial printed brochures in Dubai',
  },
  {
    category_key: 'cat-business-cards-printing',
    name: 'Business Cards Printing',
    slug: 'business-cards-printing',
    description: 'Executive 350gsm to 600gsm cotton and silk business cards with soft-touch velvet lamination, metallic gold foil stamping, and painted edges.',
    image: '/uploads/categories/business-cards-printing.jpg',
    image_url: '/uploads/categories/business-cards-printing.jpg',
    status: 'active',
    display_order: 2,
    active: 1,
    seo_title: 'Business Card Printing in Dubai | Luxury Business Cards | ONPRINT',
    seo_description: 'Make an undeniable first impression with luxury business cards in Dubai. 350gsm–600gsm cotton stocks, gold foil stamping, and spot UV varnishing.',
    seo_keywords: 'business card printing dubai, custom business cards dubai, premium business cards dubai, luxury business cards dubai, corporate business cards dubai',
    seo_heading: 'Luxury Executive Business Card Printing in Dubai',
    canonical_url: 'https://0nprint.com/categories/business-cards-printing',
    image_alt: 'Luxury gold foil executive business cards in Dubai',
  },
  {
    category_key: 'cat-flyers-printing-in-dubai',
    name: 'Flyers Printing In Dubai',
    slug: 'flyers-printing-in-dubai',
    description: 'High-impact commercial marketing flyers printed on 170gsm–300gsm gloss or matte art paper with vibrant CMYK Pantone color fidelity.',
    image: '/uploads/categories/flyers-printing-in-dubai.jpg',
    image_url: '/uploads/categories/flyers-printing-in-dubai.jpg',
    status: 'active',
    display_order: 3,
    active: 1,
    seo_title: 'Flyer Printing in Dubai | Same Day Marketing Flyer Printing | ONPRINT',
    seo_description: 'Order custom marketing flyer printing in Dubai. Single and double-sided promo flyers on premium art paper with express same-day delivery.',
    seo_keywords: 'flyer printing dubai, flyer printing services dubai, custom flyer printing dubai, promotional flyer printing dubai, leaflet printing dubai',
    seo_heading: 'High-Impact Marketing Flyer Printing in Dubai',
    canonical_url: 'https://0nprint.com/categories/flyers-printing-in-dubai',
    image_alt: 'Full color commercial marketing flyers printed in Dubai',
  },
  {
    category_key: 'cat-id-card-printing-dubai',
    name: 'ID Card Printing Dubai',
    slug: 'id-card-printing-dubai',
    description: 'Secure CR80 standard PVC employee identity cards with high-definition thermal printing, smart chips, magnetic strips, and barcodes.',
    image: '/uploads/categories/id-card-printing-dubai.jpg',
    image_url: '/uploads/categories/id-card-printing-dubai.jpg',
    status: 'active',
    display_order: 4,
    active: 1,
    seo_title: 'ID Card Printing Dubai | Corporate Employee & PVC Cards | ONPRINT',
    seo_description: 'High-security corporate PVC ID card printing in Dubai. Crisp photo resolution, smart NFC chips, barcodes, and custom lanyards for UAE businesses.',
    seo_keywords: 'id card printing dubai, pvc id cards dubai, corporate employee badges uae, student id card printing',
    seo_heading: 'Corporate PVC ID Card Printing Solutions Dubai',
    canonical_url: 'https://0nprint.com/categories/id-card-printing-dubai',
    image_alt: 'Corporate employee PVC identity cards with chips in Dubai',
  },
  {
    category_key: 'cat-lanyard-printing-dubai',
    name: 'Lanyard Printing Dubai',
    slug: 'lanyard-printing-dubai',
    description: 'Custom branded satin and woven polyester neck lanyards with screen printing, safety breakaway clips, and heavy-duty metal swivel hooks.',
    image: '/uploads/categories/lanyard-printing-dubai.jpg',
    image_url: '/uploads/categories/lanyard-printing-dubai.jpg',
    status: 'active',
    display_order: 5,
    active: 1,
    seo_title: 'Lanyard Printing Dubai | Custom Branded Neck Lanyards | ONPRINT',
    seo_description: 'Custom branded neck lanyard printing in Dubai. High-density polyester and satin lanyards with safety buckles and swivel hooks for corporate events.',
    seo_keywords: 'lanyard printing dubai, custom lanyards dubai, branded neck straps uae, event lanyards dubai',
    seo_heading: 'Custom Branded Neck Lanyard Printing in Dubai',
    canonical_url: 'https://0nprint.com/categories/lanyard-printing-dubai',
    image_alt: 'Custom branded corporate neck lanyards in Dubai',
  },
  {
    category_key: 'cat-letterheads-printing-dubai',
    name: 'Letterheads Printing Dubai',
    slug: 'letterheads-printing-dubai',
    description: 'Executive 120gsm smooth uncoated white letterheads and official corporate stationery printed with crisp full-color CMYK laser compatibility.',
    image: '/uploads/categories/letterheads-printing-dubai.jpg',
    image_url: '/uploads/categories/letterheads-printing-dubai.jpg',
    status: 'active',
    display_order: 6,
    active: 1,
    seo_title: 'Letterhead Printing in Dubai | Official Corporate Stationery | ONPRINT',
    seo_description: 'Executive corporate letterhead printing in Dubai. 120gsm smooth laser-guaranteed paper for official contracts, proposals, and invoices.',
    seo_keywords: 'letterheads printing dubai, letterhead printing dubai, corporate stationery uae, official letterhead paper',
    seo_heading: 'Executive Corporate Letterhead Printing in Dubai',
    canonical_url: 'https://0nprint.com/categories/letterheads-printing-dubai',
    image_alt: 'Executive corporate stationery letterhead and envelope in Dubai',
  },
  {
    category_key: 'cat-name-badges-printing-dubai',
    name: 'Name Badges Printing Dubai',
    slug: 'name-badges-printing-dubai',
    description: 'Laser-cut brushed metal and acrylic employee name badges with magnetic backings, clear domed epoxy coatings, and scratch-resistant finishes.',
    image: '/uploads/categories/name-badges-printing-dubai.jpg',
    image_url: '/uploads/categories/name-badges-printing-dubai.jpg',
    status: 'active',
    display_order: 7,
    active: 1,
    seo_title: 'Name Badges Printing Dubai | Magnetic Metal & Acrylic Badges | ONPRINT',
    seo_description: 'Professional staff name badges printing in Dubai. Brushed silver, gold, and acrylic magnetic badges with domed epoxy resin for corporate teams.',
    seo_keywords: 'name badges printing dubai, magnetic name badges dubai, staff badge printing uae, acrylic name tag printing',
    seo_heading: 'Professional Magnetic Name Badges Printing Dubai',
    canonical_url: 'https://0nprint.com/categories/name-badges-printing-dubai',
    image_alt: 'Professional magnetic metal and acrylic name badges in Dubai',
  },
]

const seedServicesList = [
  {
    service_key: 'serv-brochures-printing',
    category_slug: 'brochures-printing',
    name: 'Brochures Printing',
    slug: 'brochures-printing',
    short_description: 'Premium corporate bi-fold, tri-fold, and multi-page marketing brochures printed on luxury coated art paper with precision folding.',
    description: 'Showcase your corporate offerings with luxury multi-page brochures, bi-fold & tri-fold marketing leaflets, saddle-stitched catalogs, and custom presentation folders with soft-touch matte lamination and spot UV.',
    image: '/uploads/categories/brochures-printing.jpg',
    display_order: 1,
    active: 1,
    seo_title: 'Brochure Printing Services in Dubai | Luxury Commercial Brochures | ONPRINT',
    seo_description: 'Professional corporate brochure printing in Dubai. Bi-fold, tri-fold, and multi-page marketing brochures with fast UAE delivery.',
    seo_keywords: 'brochures printing dubai, brochure printing dubai, corporate brochures uae',
    seo_heading: 'Commercial Brochure Printing in Dubai',
    canonical_url: 'https://0nprint.com/services/brochures-printing',
    image_alt: 'Professional commercial printed brochures in Dubai',
  },
  {
    service_key: 'serv-business-cards-printing',
    category_slug: 'business-cards-printing',
    name: 'Business Cards Printing',
    slug: 'business-cards-printing',
    short_description: 'Executive 350gsm–600gsm cotton & silk business cards with soft-touch velvet lamination and metallic gold foil stamping.',
    description: 'Make an undeniable first impression with bespoke luxury business cards. Choose from 350gsm to 600gsm cotton stocks, embossed foil stamping, painted colored edges, and tactile spot UV.',
    image: '/uploads/categories/business-cards-printing.jpg',
    display_order: 2,
    active: 1,
    seo_title: 'Business Card Printing in Dubai | Luxury Executive Cards | ONPRINT',
    seo_description: 'Executive business card printing in Dubai. 350gsm-600gsm cotton card stocks, soft-touch matte lamination, gold foil, and spot UV.',
    seo_keywords: 'business cards printing dubai, luxury business cards dubai, visiting cards uae',
    seo_heading: 'Luxury Executive Business Card Printing in Dubai',
    canonical_url: 'https://0nprint.com/services/business-cards-printing',
    image_alt: 'Luxury gold foil executive business cards in Dubai',
  },
  {
    service_key: 'serv-flyers-printing-in-dubai',
    category_slug: 'flyers-printing-in-dubai',
    name: 'Flyers Printing In Dubai',
    slug: 'flyers-printing-in-dubai',
    short_description: 'High-impact marketing flyers printed on 170gsm–300gsm gloss or matte art paper with vibrant CMYK color fidelity.',
    description: 'Accelerate your campaigns with high-impact single and double-sided commercial marketing flyers. Printed on premium FSC-certified silk and gloss art paper with express same-day turnaround.',
    image: '/uploads/categories/flyers-printing-in-dubai.jpg',
    display_order: 3,
    active: 1,
    seo_title: 'Flyer Printing Services in Dubai | Same Day Turnaround | ONPRINT',
    seo_description: 'Order custom marketing flyers in Dubai. Single and double-sided promotional flyers on premium gloss/matte art paper with express delivery.',
    seo_keywords: 'flyers printing in dubai, flyer printing dubai, promotional flyers uae',
    seo_heading: 'High-Impact Marketing Flyer Printing in Dubai',
    canonical_url: 'https://0nprint.com/services/flyers-printing-in-dubai',
    image_alt: 'Full color commercial marketing flyers printed in Dubai',
  },
  {
    service_key: 'serv-id-card-printing-dubai',
    category_slug: 'id-card-printing-dubai',
    name: 'ID Card Printing Dubai',
    slug: 'id-card-printing-dubai',
    short_description: 'Secure CR80 standard PVC employee identity cards with high-definition thermal printing and smart chips.',
    description: 'Secure corporate ID card printing in Dubai. High-definition thermal transfer on CR80 PVC cards, compatible with RFID smart chips, magnetic strips, barcodes, and custom security overlays.',
    image: '/uploads/categories/id-card-printing-dubai.jpg',
    display_order: 4,
    active: 1,
    seo_title: 'Corporate PVC ID Card Printing Dubai | Smart NFC Badges | ONPRINT',
    seo_description: 'High-security corporate PVC ID card printing in Dubai. Crisp photo resolution, smart NFC chips, barcodes, and accessories.',
    seo_keywords: 'id card printing dubai, pvc id cards dubai, employee badges uae',
    seo_heading: 'Corporate PVC ID Card Printing Solutions Dubai',
    canonical_url: 'https://0nprint.com/services/id-card-printing-dubai',
    image_alt: 'Corporate employee PVC identity cards with chips in Dubai',
  },
  {
    service_key: 'serv-lanyard-printing-dubai',
    category_slug: 'lanyard-printing-dubai',
    name: 'Lanyard Printing Dubai',
    slug: 'lanyard-printing-dubai',
    short_description: 'Custom branded satin and woven polyester neck lanyards with safety breakaway clips and metal hooks.',
    description: 'Custom branded neck lanyards for corporate teams, exhibitions, and VIP events. High-density woven polyester and silky satin straps featuring durable screen printing or dye-sublimation with swivel hooks and safety breakaways.',
    image: '/uploads/categories/lanyard-printing-dubai.jpg',
    display_order: 5,
    active: 1,
    seo_title: 'Custom Branded Lanyard Printing Dubai | Event Neck Straps | ONPRINT',
    seo_description: 'Custom branded neck lanyard printing in Dubai. High-density polyester and satin lanyards with safety buckles and swivel hooks.',
    seo_keywords: 'lanyard printing dubai, custom lanyards dubai, branded neck straps uae',
    seo_heading: 'Custom Branded Neck Lanyard Printing in Dubai',
    canonical_url: 'https://0nprint.com/services/lanyard-printing-dubai',
    image_alt: 'Custom branded corporate neck lanyards in Dubai',
  },
  {
    service_key: 'serv-letterheads-printing-dubai',
    category_slug: 'letterheads-printing-dubai',
    name: 'Letterheads Printing Dubai',
    slug: 'letterheads-printing-dubai',
    short_description: 'Executive 120gsm smooth uncoated white letterheads with crisp full-color CMYK laser printer compatibility.',
    description: 'Elevate official company communications with luxury 120gsm smooth laser-guaranteed paper. Flawless Pantone color fidelity for official contracts, proposals, invoices, and executive correspondence.',
    image: '/uploads/categories/letterheads-printing-dubai.jpg',
    display_order: 6,
    active: 1,
    seo_title: 'Executive Corporate Letterhead Printing Dubai | ONPRINT',
    seo_description: 'Executive corporate letterhead printing in Dubai. 120gsm smooth laser-guaranteed paper for official contracts and proposals.',
    seo_keywords: 'letterheads printing dubai, corporate stationery dubai, official letterhead paper',
    seo_heading: 'Executive Corporate Letterhead Printing in Dubai',
    canonical_url: 'https://0nprint.com/services/letterheads-printing-dubai',
    image_alt: 'Executive corporate stationery letterhead and envelope in Dubai',
  },
  {
    service_key: 'serv-name-badges-printing-dubai',
    category_slug: 'name-badges-printing-dubai',
    name: 'Name Badges Printing Dubai',
    slug: 'name-badges-printing-dubai',
    short_description: 'Laser-cut brushed metal & acrylic staff name badges with strong magnetic backings and epoxy dome finish.',
    description: 'Premium staff name badges for corporate hospitality, retail, and corporate teams. Brushed gold, silver, and crystal-clear acrylic badges with strong neodymium magnetic fasteners and scratch-proof domed epoxy resin.',
    image: '/uploads/categories/name-badges-printing-dubai.jpg',
    display_order: 7,
    active: 1,
    seo_title: 'Magnetic Metal & Acrylic Name Badges Printing Dubai | ONPRINT',
    seo_description: 'Professional staff name badges printing in Dubai. Brushed silver, gold, and acrylic magnetic badges with domed epoxy resin.',
    seo_keywords: 'name badges printing dubai, magnetic name badges dubai, staff badge printing uae',
    seo_heading: 'Professional Magnetic Name Badges Printing Dubai',
    canonical_url: 'https://0nprint.com/services/name-badges-printing-dubai',
    image_alt: 'Professional magnetic metal and acrylic name badges in Dubai',
  },
]

const seedProductsList = [
  {
    product_key: 'prod-standard-business-cards',
    category_slug: 'business-cards-printing',
    name: 'Standard Business Cards',
    slug: 'standard-business-cards',
    short_description: 'Clean 300gsm business cards for everyday networking, teams, and local business use.',
    description: 'Reliable 300gsm business cards printed on smooth matte or silk stock with crisp full-colour artwork and practical finishing for everyday business networking.',
    price: 45.00,
    minimum_quantity: 100,
    featured: 0,
    seo_title: 'Standard Business Cards Dubai | 300gsm Card Printing | ONPRINT',
    seo_description: 'Order clean 300gsm standard business cards in Dubai with crisp colour printing and practical matte or silk finishes for everyday networking.',
    seo_keywords: 'standard business cards dubai, 300gsm business cards, affordable card printing dubai',
    seo_heading: 'Standard 300gsm Business Cards in Dubai',
    canonical_url: 'https://0nprint.com/products/standard-business-cards',
    image_alt: 'Standard 300gsm business cards printed by ONPRINT',
    images: ['/assets/products/business-card-standard.svg'],
  },
  {
    product_key: 'prod-premium-soft-touch-business-cards',
    category_slug: 'business-cards-printing',
    name: 'Premium Soft-Touch Business Cards',
    slug: 'premium-soft-touch-business-cards',
    short_description: '350gsm business cards with soft-touch lamination, spot UV, and a refined tactile finish.',
    description: 'Premium 350gsm business cards finished with soft-touch lamination and optional spot UV detailing for companies that need a polished, memorable handout.',
    price: 75.00,
    minimum_quantity: 100,
    featured: 1,
    seo_title: 'Premium Soft-Touch Business Cards Dubai | ONPRINT',
    seo_description: 'Premium 350gsm soft-touch business cards in Dubai with optional spot UV detailing and refined finishing for professional brands.',
    seo_keywords: 'soft touch business cards dubai, 350gsm business cards, premium visiting cards uae',
    seo_heading: 'Premium Soft-Touch Business Cards in Dubai',
    canonical_url: 'https://0nprint.com/products/premium-soft-touch-business-cards',
    image_alt: 'Premium 350gsm soft-touch business cards printed by ONPRINT',
    images: ['/assets/products/card-soft-touch.jpg'],
  },
  {
    product_key: 'prod-velvet-foil-business-cards',
    category_slug: 'business-cards-printing',
    name: 'Velvet Foil Business Cards',
    slug: 'velvet-foil-business-cards',
    short_description: '450gsm velvet-laminated cards with hot foil stamping for executive and luxury branding.',
    description: 'Executive 450gsm business cards with tactile velvet lamination and hot foil stamping in gold or silver, designed for premium client meetings and luxury brands.',
    price: 150.00,
    minimum_quantity: 100,
    featured: 1,
    seo_title: 'Velvet Foil Business Cards Dubai | 450gsm Luxury Cards | ONPRINT',
    seo_description: 'Make a premium impression with 450gsm velvet foil business cards in Dubai, available with tactile lamination and gold or silver foil.',
    seoKeywords: 'velvet foil business cards dubai, 450gsm business cards, gold foil visiting cards',
    seo_heading: '450gsm Velvet Foil Business Cards in Dubai',
    canonical_url: 'https://0nprint.com/products/velvet-foil-business-cards',
    image_alt: '450gsm velvet laminated business cards with foil stamping',
    images: ['/assets/products/card-velvet-foil.jpg'],
  },
  {
    product_key: 'prod-luxury-painted-edge-business-cards',
    category_slug: 'business-cards-printing',
    name: 'Luxury Painted-Edge Business Cards',
    slug: 'luxury-painted-edge-business-cards',
    short_description: '600gsm duplex cards with painted edges, foil, embossing, and a substantial luxury feel.',
    description: 'Statement 600gsm duplex business cards with painted edges, precision embossing, and metallic foil options for executive identities, agencies, and luxury businesses.',
    price: 220.00,
    minimum_quantity: 100,
    featured: 1,
    seo_title: 'Luxury Painted-Edge Business Cards Dubai | 600gsm Cards | ONPRINT',
    seo_description: 'Order substantial 600gsm painted-edge business cards in Dubai with foil and embossing options for luxury corporate identities.',
    seoKeywords: 'painted edge business cards dubai, 600gsm business cards, luxury business cards uae',
    seo_heading: '600gsm Luxury Painted-Edge Business Cards in Dubai',
    canonical_url: 'https://0nprint.com/products/luxury-painted-edge-business-cards',
    image_alt: '600gsm painted-edge luxury business cards with foil finish',
    images: ['/assets/products/card-painted-edge.jpg'],
  },
  {
    product_key: 'prod-luxury-velvet-business-cards',
    category_slug: 'business-cards-printing',
    name: 'Luxury Velvet Business Cards',
    slug: 'luxury-velvet-business-cards',
    short_description: 'Executive 450gsm silk cards with soft-touch matte velvet lamination, metallic gold foil stamping, and painted edges.',
    description: 'Crafted for executive distinction, our luxury velvet business cards feature heavy 450gsm silk stock coated in tactile soft-touch lamination with precision hot foil stamping in mirror gold or silver.',
    price: 150.00,
    minimum_quantity: 250,
    featured: 1,
    seo_title: 'Luxury Velvet Business Cards Dubai | Gold Foil Stamping | ONPRINT',
    seo_description: 'Executive 450gsm velvet business cards with gold foil stamping & painted edges in Dubai. Order bespoke luxury cards with express delivery.',
    seo_keywords: 'luxury business cards dubai, velvet business cards uae, gold foil business cards dubai',
    seo_heading: 'Executive Luxury Velvet Business Cards Dubai',
    canonical_url: 'https://0nprint.com/products/luxury-velvet-business-cards',
    image_alt: 'Luxury velvet business cards with gold foil stamping in Dubai',
    images: ['/uploads/categories/business-cards-printing.jpg'],
  },
  {
    product_key: 'prod-corporate-bi-fold-brochures',
    category_slug: 'brochures-printing',
    name: 'Corporate Bi-Fold Brochures',
    slug: 'corporate-bi-fold-brochures',
    short_description: 'High-definition 4-page bi-fold corporate brochures on 250gsm coated art paper with protective matte or gloss coating.',
    description: 'Present corporate capabilities with premium bi-fold brochures printed in full vibrant CMYK on heavy 250gsm coated paper with precision creasing and folding.',
    price: 350.00,
    minimum_quantity: 100,
    featured: 1,
    seo_title: 'Corporate Bi-Fold Brochures Dubai | Custom Art Paper | ONPRINT',
    seo_description: 'Commercial bi-fold brochure printing in Dubai. 250gsm premium art paper, vibrant CMYK color calibration, and express turnaround across UAE.',
    seo_keywords: 'bifold brochure printing dubai, corporate brochures uae, custom bi fold printing',
    seo_heading: 'Corporate Bi-Fold Brochure Printing Dubai',
    canonical_url: 'https://0nprint.com/products/corporate-bi-fold-brochures',
    image_alt: 'Corporate bi-fold marketing brochure printed in Dubai',
    images: ['/uploads/categories/brochures-printing.jpg'],
  },
  {
    product_key: 'prod-high-impact-gloss-marketing-flyers',
    category_slug: 'flyers-printing-in-dubai',
    name: 'High-Impact Gloss Marketing Flyers',
    slug: 'high-impact-gloss-marketing-flyers',
    short_description: 'Double-sided commercial promotional flyers printed on 170gsm gloss art paper with vibrant CMYK ink fidelity.',
    description: 'Maximize marketing campaign ROI with high-impact single and double-sided flyers printed on premium 170gsm gloss art paper with crisp photo resolution and express same-day dispatch in Dubai.',
    price: 120.00,
    minimum_quantity: 500,
    featured: 1,
    seo_title: 'High-Impact Marketing Flyers Dubai | Express CMYK Print | ONPRINT',
    seo_description: 'Order commercial gloss marketing flyers in Dubai. Double-sided high-resolution printing on 170gsm art paper with same-day delivery.',
    seo_keywords: 'marketing flyer printing dubai, gloss flyers uae, commercial leaflets dubai',
    seo_heading: 'High-Impact Commercial Marketing Flyers Dubai',
    canonical_url: 'https://0nprint.com/products/high-impact-gloss-marketing-flyers',
    image_alt: 'High impact gloss marketing flyers in Dubai',
    images: ['/uploads/categories/flyers-printing-in-dubai.jpg'],
  },
  {
    product_key: 'prod-secure-smart-nfc-pvc-id-cards',
    category_slug: 'id-card-printing-dubai',
    name: 'Secure Smart NFC PVC ID Cards',
    slug: 'secure-smart-nfc-pvc-id-cards',
    short_description: 'CR80 standard PVC identity cards with embedded NFC/RFID chips, high-definition photo print and security overlay.',
    description: 'High-security employee ID cards manufactured from durable CR80 PVC with integrated contactless smart chips, QR codes, magnetic stripes, and anti-scratch protective lamination.',
    price: 25.00,
    minimum_quantity: 10,
    featured: 1,
    seo_title: 'Secure Smart NFC PVC ID Cards Dubai | RFID Badges | ONPRINT',
    seo_description: 'High-security corporate PVC ID cards with NFC & RFID chips in Dubai. High-resolution photo printing, barcodes, and custom security overlays.',
    seo_keywords: 'nfc id cards dubai, pvc id card printing uae, corporate smart badges dubai',
    seo_heading: 'Secure Smart NFC PVC ID Cards Dubai',
    canonical_url: 'https://0nprint.com/products/secure-smart-nfc-pvc-id-cards',
    image_alt: 'Secure smart NFC PVC employee ID cards in Dubai',
    images: ['/uploads/categories/id-card-printing-dubai.jpg'],
  },
  {
    product_key: 'prod-custom-branded-satin-neck-lanyards',
    category_slug: 'lanyard-printing-dubai',
    name: 'Custom Branded Satin Neck Lanyards',
    slug: 'custom-branded-satin-neck-lanyards',
    short_description: 'Silky 20mm premium neck lanyards featuring silk-screen company branding, safety breakaway buckle and swivel hook.',
    description: 'Custom branded neck lanyards for corporate staff and exhibition attendees. Manufactured from soft satin polyester with durable screen printing, safety breakaway clips, and heavy-duty metal swivel hooks.',
    price: 8.50,
    minimum_quantity: 50,
    featured: 1,
    seo_title: 'Custom Satin Neck Lanyards Dubai | Safety Breakaway Clips | ONPRINT',
    seo_description: 'Custom branded neck lanyards in Dubai. Silky satin polyester, full color logo printing, safety release buckles, and metal swivel clips.',
    seo_keywords: 'custom lanyards dubai, branded neck straps uae, event lanyards printing dubai',
    seo_heading: 'Custom Branded Satin Neck Lanyards Dubai',
    canonical_url: 'https://0nprint.com/products/custom-branded-satin-neck-lanyards',
    image_alt: 'Custom branded satin neck lanyards in Dubai',
    images: ['/uploads/categories/lanyard-printing-dubai.jpg'],
  },
  {
    product_key: 'prod-executive-stationery-letterheads',
    category_slug: 'letterheads-printing-dubai',
    name: 'Executive Stationery Letterheads',
    slug: 'executive-stationery-letterheads',
    short_description: '120gsm ultra-smooth laser-compatible corporate letterheads with Pantone precision color matching.',
    description: 'Official corporate stationery printed on 120gsm ultra-smooth laser-guaranteed paper. Designed for flawless feeding through office desktop printers with crisp, high-density corporate branding.',
    price: 180.00,
    minimum_quantity: 500,
    featured: 1,
    seo_title: 'Executive Uncoated Letterheads Dubai | 120gsm Laser Guaranteed | ONPRINT',
    seo_description: 'Corporate letterhead printing in Dubai. 120gsm ultra-smooth laser-compatible paper with crisp Pantone color fidelity for official business stationery.',
    seo_keywords: 'letterhead printing dubai, corporate letterheads uae, executive stationery dubai',
    seo_heading: 'Executive Uncoated Corporate Letterheads Dubai',
    canonical_url: 'https://0nprint.com/products/executive-stationery-letterheads',
    image_alt: 'Executive uncoated corporate letterheads in Dubai',
    images: ['/uploads/categories/letterheads-printing-dubai.jpg'],
  },
  {
    product_key: 'prod-magnetic-brushed-metal-name-badges',
    category_slug: 'name-badges-printing-dubai',
    name: 'Magnetic Brushed Metal Name Badges',
    slug: 'magnetic-brushed-metal-name-badges',
    short_description: 'Laser-engraved brushed champagne gold and silver staff name badges with strong neodymium magnet fastener.',
    description: 'Professional staff name badges manufactured from brushed gold, silver, or acrylic with crystal-clear scratch-resistant epoxy doming and strong garment-friendly neodymium magnetic clips.',
    price: 35.00,
    minimum_quantity: 5,
    featured: 1,
    seo_title: 'Magnetic Domed Name Badges Dubai | Brushed Silver & Gold | ONPRINT',
    seo_description: 'Order magnetic staff name badges in Dubai. Brushed metal and acrylic finishes with protective domed resin and strong magnetic fasteners.',
    seo_keywords: 'magnetic name badges dubai, staff badge printing uae, metal name tags dubai',
    seo_heading: 'Magnetic Brushed Metal Name Badges Dubai',
    canonical_url: 'https://0nprint.com/products/magnetic-brushed-metal-name-badges',
    image_alt: 'Magnetic brushed metal staff name badges in Dubai',
    images: ['/uploads/categories/name-badges-printing-dubai.jpg'],
  },
  {
    product_key: 'prod-luxury-packaging-custom-boxes',
    category_slug: 'brochures-printing',
    name: 'Luxury Packaging & Custom Boxes',
    slug: 'luxury-packaging-custom-boxes',
    short_description: 'Rigid, magnetic, and luxury gift boxes tailored for premium packaging and retail presentation.',
    description: 'Luxury packaging and custom boxes with premium rigid board, embossed details, foil stamping, texture finishes, and custom internal inserts for gifting and retail delivery.',
    price: 220.00,
    minimum_quantity: 25,
    featured: 1,
    seo_title: 'Luxury Packaging & Custom Boxes Dubai | Premium Rigid Box Printing | ONPRINT',
    seo_description: 'Premium custom packaging boxes in Dubai for gifting, retail, and luxury presentation. Hot foil finish, rigid board, and tailored inserts available.',
    seo_keywords: 'luxury packaging dubai, custom boxes dubai, rigid boxes uae, gift packaging dubai',
    seo_heading: 'Luxury Packaging & Custom Boxes Dubai',
    canonical_url: 'https://0nprint.com/products/luxury-packaging-custom-boxes',
    image_alt: 'Luxury custom packaging boxes in Dubai',
    images: ['/assets/products/1 (5).jpg'],
  },
  {
    product_key: 'prod-custom-branded-tote-bags',
    category_slug: 'business-cards-printing',
    name: 'Custom Branded Tote Bags',
    slug: 'custom-branded-tote-bags',
    short_description: 'Custom printed tote bags for events, gifting, and retail promotions.',
    description: 'Custom branded tote bags printed with full-color graphics and durable ink finishes for event giveaways, retail promotions, and corporate gifting.',
    price: 34.00,
    minimum_quantity: 50,
    featured: 1,
    seo_title: 'Custom Branded Tote Bags Dubai | Promotional Shopping Bags | ONPRINT',
    seo_description: 'Custom printed tote bags in Dubai with eco-friendly materials and high-resolution branding for promotions and corporate events.',
    seo_keywords: 'custom tote bags dubai, branded shopping bags uae, tote bag printing dubai',
    seo_heading: 'Custom Branded Tote Bags Dubai',
    canonical_url: 'https://0nprint.com/products/custom-branded-tote-bags',
    image_alt: 'Custom branded tote bags printed in Dubai',
    images: ['/assets/products/tote_bags.jpg'],
  },
  {
    product_key: 'prod-personalized-water-bottles',
    category_slug: 'lanyard-printing-dubai',
    name: 'Personalized Water Bottles',
    slug: 'personalized-water-bottles',
    short_description: 'Custom stainless steel and insulated water bottles for branded gifting.',
    description: 'Branded water bottles for corporate gifting and employee rewards with laser engraving, full-color printing, and premium finish options.',
    price: 45.00,
    minimum_quantity: 25,
    featured: 1,
    seo_title: 'Personalized Water Bottles Dubai | Corporate Gift Bottles | ONPRINT',
    seo_description: 'Custom branded water bottles in Dubai for corporate gifting and large event programs with premium finishes.',
    seo_keywords: 'personalized water bottles dubai, corporate gift bottles uae, custom bottles dubai',
    seo_heading: 'Personalized Water Bottles Dubai',
    canonical_url: 'https://0nprint.com/products/personalized-water-bottles',
    image_alt: 'Personalized branded water bottles in Dubai',
    images: ['/assets/products/water_bottles.jpg'],
  },
  {
    product_key: 'prod-custom-printed-mugs',
    category_slug: 'lanyard-printing-dubai',
    name: 'Custom Printed Mugs',
    slug: 'custom-printed-mugs',
    short_description: 'Elegant employee and client gift mugs with personalized print and finish options.',
    description: 'Custom printed mugs designed for corporate gifting, hospitality programs, and staff appreciation, with durable ceramic finish and custom branding.',
    price: 30.00,
    minimum_quantity: 50,
    featured: 1,
    seo_title: 'Custom Printed Mugs Dubai | Corporate Gift Mugs | ONPRINT',
    seo_description: 'Custom ceramic mugs in Dubai for branding, hospitality, and corporate gifting with premium print finishes.',
    seo_keywords: 'custom mugs dubai, printed mugs uae, corporate gift mugs dubai',
    seo_heading: 'Custom Printed Mugs Dubai',
    canonical_url: 'https://0nprint.com/products/custom-printed-mugs',
    image_alt: 'Custom printed ceramic mugs in Dubai',
    images: ['/assets/products/mugs.jpg'],
  },
  {
    product_key: 'prod-premium-business-cards',
    category_slug: 'business-cards-printing',
    name: 'Premium Business Cards',
    slug: 'premium-business-cards',
    short_description: 'Luxury 350gsm–600gsm business cards with foil, textured stock, and premium finishing.',
    description: 'Premium business cards for executive branding with cotton stock, soft-touch finishes, metallic foil, and edge detailing.',
    price: 95.00,
    minimum_quantity: 100,
    featured: 1,
    seo_title: 'Premium Business Cards Dubai | Executive Cards | ONPRINT',
    seo_description: 'Premium executive business cards in Dubai with textured stock, metallic foil, and luxury finishing options.',
    seo_keywords: 'premium business cards dubai, executive cards uae, luxury card printing dubai',
    seo_heading: 'Premium Business Cards Dubai',
    canonical_url: 'https://0nprint.com/products/premium-business-cards',
    image_alt: 'Luxury premium business cards in Dubai',
    images: ['/assets/products/1 (11).jpg'],
  },
  {
    product_key: 'prod-acrylic-nameplates',
    category_slug: 'name-badges-printing-dubai',
    name: 'Acrylic Nameplates',
    slug: 'acrylic-nameplates',
    short_description: 'Executive acrylic door and desk nameplates with polished surfaces and premium mounting hardware.',
    description: 'Custom acrylic nameplates for office signage, reception desks, and brand touchpoints with polished edges and branding finishes.',
    price: 75.00,
    minimum_quantity: 10,
    featured: 1,
    seo_title: 'Acrylic Nameplates Dubai | Office Door Signage | ONPRINT',
    seo_description: 'Custom acrylic nameplates in Dubai for office signage, desk identity, and reception branding with premium finish.',
    seo_keywords: 'acrylic nameplates dubai, office signage uae, corporate door signs dubai',
    seo_heading: 'Acrylic Nameplates Dubai',
    canonical_url: 'https://0nprint.com/products/acrylic-nameplates',
    image_alt: 'Acrylic office nameplates in Dubai',
    images: ['/assets/products/name_plates.jpg'],
  },
  {
    product_key: 'prod-roll-up-banners',
    category_slug: 'flyers-printing-in-dubai',
    name: 'Roll-Up Banners',
    slug: 'roll-up-banners',
    short_description: 'Retractable banners for events, exhibitions, and retail features.',
    description: 'Portable roll-up banners with premium print quality for exhibitions, malls, and event activations throughout Dubai.',
    price: 180.00,
    minimum_quantity: 1,
    featured: 1,
    seo_title: 'Roll-Up Banners Dubai | Exhibition Banner Printing | ONPRINT',
    seo_description: 'Retractable roll-up banners in Dubai for exhibitions and events with premium print quality and portable carry cases.',
    seo_keywords: 'roll up banners dubai, exhibition banners uae, trade show signage dubai',
    seo_heading: 'Roll-Up Banners Dubai',
    canonical_url: 'https://0nprint.com/products/roll-up-banners',
    image_alt: 'Promotional roll-up banner in Dubai',
    images: ['/assets/products/rollup_banner.jpg'],
  },
  {
    product_key: 'prod-beach-flags',
    category_slug: 'flyers-printing-in-dubai',
    name: 'Beach Flags',
    slug: 'beach-flags',
    short_description: 'Outdoor promotional beach flags for roadshows and retail frontage branding.',
    description: 'Custom beach and feather flags designed to maximize visibility and brand reach outdoors in Dubai and UAE.',
    price: 220.00,
    minimum_quantity: 1,
    featured: 1,
    seo_title: 'Beach Flags Dubai | Feather Flag Printing | ONPRINT',
    seo_description: 'Custom beach flags in Dubai for outdoor promotions and event visibility with weatherproof materials and vivid color graphics.',
    seo_keywords: 'beach flags dubai, feather flags uae, promotional flag printing dubai',
    seo_heading: 'Beach Flags Dubai',
    canonical_url: 'https://0nprint.com/products/beach-flags',
    image_alt: 'Outdoor beach flags for promotional branding in Dubai',
    images: ['/assets/products/flags.jpg'],
  },
  {
    product_key: 'prod-die-cut-stickers',
    category_slug: 'flyers-printing-in-dubai',
    name: 'Die-Cut Stickers',
    slug: 'die-cut-stickers',
    short_description: 'Waterproof vinyl stickers for branding, packaging, and retail POP display essentials.',
    description: 'Custom die-cut stickers and labels in gloss or matte vinyl for product branding and packaging applications.',
    price: 40.00,
    minimum_quantity: 200,
    featured: 1,
    seo_title: 'Die-Cut Stickers Dubai | Vinyl Labels & Packaging Stickers | ONPRINT',
    seo_description: 'Custom die-cut vinyl stickers in Dubai for product labels, packaging, and promotional branding.',
    seo_keywords: 'die cut stickers dubai, vinyl stickers uae, custom stickers dubai',
    seo_heading: 'Die-Cut Stickers Dubai',
    canonical_url: 'https://0nprint.com/products/die-cut-stickers',
    image_alt: 'Die-cut vinyl stickers in Dubai',
    images: ['/assets/products/stickers.jpg'],
  },
  {
    product_key: 'prod-engraved-keychains',
    category_slug: 'lanyard-printing-dubai',
    name: 'Engraved Keychains',
    slug: 'engraved-keychains',
    short_description: 'Premium engraved keychains and accessories for corporate gifting and loyalty campaigns.',
    description: 'Engraved wooden and metal keychains with premium finishes for branded merchandise and client appreciation programs.',
    price: 28.00,
    minimum_quantity: 50,
    featured: 1,
    seo_title: 'Engraved Keychains Dubai | Corporate Gift Keyrings | ONPRINT',
    seo_description: 'Custom engraved keychains in Dubai for corporate gifting and promotional merchandise with premium finish options.',
    seo_keywords: 'engraved keychains dubai, custom keyrings uae, corporate gift keychains dubai',
    seo_heading: 'Engraved Keychains Dubai',
    canonical_url: 'https://0nprint.com/products/engraved-keychains',
    image_alt: 'Engraved corporate keychains in Dubai',
    images: ['/assets/products/wooden_keychain.jpg'],
  },
  {
    product_key: 'prod-executive-notebooks',
    category_slug: 'letterheads-printing-dubai',
    name: 'Executive Notebooks',
    slug: 'executive-notebooks',
    short_description: 'Hardcover executive notebooks with premium covers and logo embossing for gifting and branding.',
    description: 'Executive notebooks designed for premium gifting, corporate stationery, and client presentation sets with personalized cover branding.',
    price: 65.00,
    minimum_quantity: 25,
    featured: 1,
    seo_title: 'Executive Notebooks Dubai | Corporate Gift Notebooks | ONPRINT',
    seo_description: 'Custom executive notebooks in Dubai for premium corporate gifting and branded stationery with embossed finishes.',
    seo_keywords: 'executive notebooks dubai, corporate gift notebooks uae, custom branded notebooks dubai',
    seo_heading: 'Executive Notebooks Dubai',
    canonical_url: 'https://0nprint.com/products/executive-notebooks',
    image_alt: 'Executive branded notebooks in Dubai',
    images: ['/assets/products/1 (5).jpg'],
  },
]

async function seedCategoriesIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM categories')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0) {
      console.log('[Categories] Seeding initial high-quality Dubai printing categories in MySQL...')
      for (const cat of seedCategoriesList) {
        await connection.query(
          `INSERT INTO categories 
           (category_key, name, slug, description, image, image_url, status, display_order, active, seo_title, seo_description, seo_keywords, seo_heading, canonical_url, image_alt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name), image_url=VALUES(image_url), image=VALUES(image)`,
          [
            cat.category_key,
            cat.name,
            cat.slug,
            cat.description,
            cat.image,
            cat.image_url,
            cat.status,
            cat.display_order,
            cat.active,
            cat.seo_title,
            cat.seo_description,
            cat.seo_keywords,
            cat.seo_heading,
            cat.canonical_url,
            cat.image_alt,
          ]
        )
      }
      console.log('[Categories] Seeded 7 professional printing categories successfully.')
    }
  } catch (err) {
    console.warn('[Categories Seed Check Note]:', err.message)
  }
}

async function seedServicesIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM services')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0) {
      console.log('[Services] Seeding initial high-quality Dubai printing services in MySQL...')
      const [cats] = await connection.query('SELECT id, slug FROM categories')
      const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]))

      for (const serv of seedServicesList) {
        const catId = catMap[serv.category_slug] || null
        await connection.query(
          `INSERT INTO services 
           (service_key, category_id, name, slug, short_description, description, image, display_order, active, seo_title, seo_description, seo_keywords, seo_heading, canonical_url, image_alt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), image=VALUES(image)`,
          [
            serv.service_key,
            catId,
            serv.name,
            serv.slug,
            serv.short_description,
            serv.description,
            serv.image,
            serv.display_order,
            serv.active,
            serv.seo_title,
            serv.seo_description,
            serv.seo_keywords,
            serv.seo_heading,
            serv.canonical_url,
            serv.image_alt,
          ]
        )
      }
      console.log('[Services] Seeded 7 professional printing services successfully.')
    }
  } catch (err) {
    console.warn('[Services Seed Check Note]:', err.message)
  }
}

async function seedProductsIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM products')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0) {
      console.log('[Products] Seeding initial authentic Dubai printing products in MySQL...')
      const [cats] = await connection.query('SELECT id, slug FROM categories')
      const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]))

      for (const prod of seedProductsList) {
        const catId = catMap[prod.category_slug] || null
        const [res] = await connection.query(
          `INSERT INTO products 
           (product_key, category_id, name, slug, short_description, description, price, minimum_quantity, featured, active, seo_title, seo_description, seo_keywords, seo_heading, canonical_url, image_alt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), description=VALUES(description)`,
          [
            prod.product_key,
            catId,
            prod.name,
            prod.slug,
            prod.short_description,
            prod.description,
            prod.price,
            prod.minimum_quantity,
            prod.featured,
            1,
            prod.seo_title,
            prod.seo_description,
            prod.seo_keywords,
            prod.seo_heading,
            prod.canonical_url,
            prod.image_alt,
          ]
        )

        const insertedId = res.insertId
        if (insertedId && prod.images && prod.images.length > 0) {
          for (let i = 0; i < prod.images.length; i++) {
            await connection.query(
              `INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES (?, ?, ?, ?)`,
              [insertedId, prod.images[i], prod.image_alt, i + 1]
            )
          }
        }
      }
      console.log('[Products] Seeded 7 professional printing products successfully.')
    }

    // Add newly introduced business-card quality tiers to existing installations
    // without replacing or fabricating any products already managed by the admin.
    const businessCardQualitySlugs = new Set([
      'standard-business-cards',
      'premium-soft-touch-business-cards',
      'velvet-foil-business-cards',
      'luxury-painted-edge-business-cards',
    ])
    const [businessCardCategoryRows] = await connection.query(
      `SELECT id FROM categories WHERE slug = 'business-cards-printing' LIMIT 1`
    )
    const businessCardCategoryId = businessCardCategoryRows[0]?.id || null

    if (businessCardCategoryId) {
      for (const prod of seedProductsList.filter((item) => businessCardQualitySlugs.has(item.slug))) {
        await connection.query(
          `INSERT INTO products
           (product_key, category_id, name, slug, short_description, description, price, minimum_quantity, featured, active, seo_title, seo_description, seo_keywords, seo_heading, canonical_url, image_alt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE category_id = VALUES(category_id), image_alt = VALUES(image_alt)`,
          [
            prod.product_key,
            businessCardCategoryId,
            prod.name,
            prod.slug,
            prod.short_description,
            prod.description,
            prod.price,
            prod.minimum_quantity,
            prod.featured,
            1,
            prod.seo_title,
            prod.seo_description,
            prod.seo_keywords,
            prod.seo_heading,
            prod.canonical_url,
            prod.image_alt,
          ]
        )

        const [productRows] = await connection.query('SELECT id FROM products WHERE slug = ? LIMIT 1', [prod.slug])
        const productId = productRows[0]?.id
        if (productId && prod.images?.length) {
          const [imageRows] = await connection.query('SELECT id FROM product_images WHERE product_id = ? LIMIT 1', [productId])
          if (imageRows.length === 0) {
            await connection.query(
              'INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES (?, ?, ?, ?)',
              [productId, prod.images[0], prod.image_alt, 1]
            )
          }
        }
      }
    }
  } catch (err) {
    console.warn('[Products Seed Check Note]:', err.message)
  }
}

async function seedPageSeoIfEmpty(connection) {
  try {
    // Fetch existing entity IDs so we can map page_id accurately for dynamic entities
    const [cats] = await connection.query('SELECT id, slug FROM categories')
    const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]))

    const [servs] = await connection.query('SELECT id, slug FROM services')
    const servMap = Object.fromEntries(servs.map((s) => [s.slug, s.id]))

    const [prods] = await connection.query('SELECT id, slug FROM products')
    const prodMap = Object.fromEntries(prods.map((p) => [p.slug, p.id]))

    const [blogs] = await connection.query('SELECT id, slug FROM blogs')
    const blogMap = Object.fromEntries(blogs.map((b) => [b.slug, b.id]))

    for (const rec of initialPageSeoRecords) {
      let resolvedPageId = rec.page_id
      if (!resolvedPageId && rec.slug) {
        if (rec.page_type === 'category') resolvedPageId = catMap[rec.slug] || null
        else if (rec.page_type === 'service') resolvedPageId = servMap[rec.slug] || null
        else if (rec.page_type === 'product') resolvedPageId = prodMap[rec.slug] || null
        else if (rec.page_type === 'blog') resolvedPageId = blogMap[rec.slug] || null
      }

      await connection.query(
        `INSERT INTO page_seo 
         (page_type, page_id, url, slug, meta_title, meta_description, focus_keyword, secondary_keywords, h1, seo_content, canonical_url, robots_index, robots_follow, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, schema_type, schema_markup, seo_score, readability_score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           page_type = VALUES(page_type),
           page_id = COALESCE(page_seo.page_id, VALUES(page_id)),
           slug = VALUES(slug)`,
        [
          rec.page_type,
          resolvedPageId,
          rec.url,
          rec.slug,
          rec.meta_title,
          rec.meta_description,
          rec.focus_keyword,
          rec.secondary_keywords,
          rec.h1,
          rec.seo_content,
          rec.canonical_url,
          rec.robots_index,
          rec.robots_follow,
          rec.og_title,
          rec.og_description,
          rec.og_image,
          rec.twitter_title,
          rec.twitter_description,
          rec.twitter_image,
          rec.schema_type,
          rec.schema_markup,
          rec.seo_score,
          rec.readability_score,
        ]
      )
    }
    console.log(`[Page SEO] Verified and synchronized ${initialPageSeoRecords.length} page SEO records in MySQL.`)
  } catch (err) {
    console.warn('[Page SEO Seed Check Note]:', err.message)
  }
}

async function seedBlogsIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM blogs')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0) {
      console.log(`[Blogs] Seeding ${DUBAI_BLOGS.length} comprehensive technical printing guides in MySQL...`)
      for (const blog of DUBAI_BLOGS) {
        await connection.query(
          `INSERT INTO blogs 
           (id, title, slug, excerpt, content, featured_image, image_alt, category_id, author_name, status, is_featured, reading_time, word_count, target_location, published_at, seo_title, meta_title, meta_description, focus_keyword, secondary_keywords, canonical_url, og_title, og_description, og_image, schema_type, seo_score, readability_score, faqs)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), excerpt=VALUES(excerpt), seo_title=VALUES(seo_title), meta_description=VALUES(meta_description)`,
          [
            blog.id,
            blog.title,
            blog.slug,
            blog.excerpt,
            blog.content,
            blog.featured_image,
            blog.image_alt,
            blog.category_id,
            blog.author_name,
            blog.status,
            blog.is_featured ? 1 : 0,
            blog.reading_time,
            blog.word_count,
            blog.target_location,
            blog.published_at,
            blog.seo_title,
            blog.seo_title,
            blog.meta_description,
            blog.focus_keyword,
            blog.secondary_keywords,
            blog.canonical_url,
            blog.og_title,
            blog.og_description,
            blog.og_image,
            blog.schema_type,
            95,
            85,
            JSON.stringify(blog.faqs || []),
          ]
        )

        // Ensure page_seo has matching record for blog
        const blogUrl = `/blog/${blog.slug}`
        const blogSchema = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: blog.title,
          description: blog.meta_description,
          image: `${SITE_URL}${blog.featured_image}`,
          author: { '@type': 'Organization', name: 'ONPRINT' },
          publisher: { '@id': `${SITE_URL}/#organization` },
          datePublished: blog.published_at,
          mainEntityOfPage: { '@type': 'WebPage', '@id': blog.canonical_url },
        }

        await connection.query(
          `INSERT INTO page_seo
           (page_type, page_id, url, slug, meta_title, meta_description, focus_keyword, secondary_keywords, h1, canonical_url, robots_index, robots_follow, og_title, og_description, og_image, schema_type, schema_markup, seo_score, readability_score)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'index', 'follow', ?, ?, ?, ?, ?, 95, 85)
           ON DUPLICATE KEY UPDATE meta_title=VALUES(meta_title), meta_description=VALUES(meta_description), focus_keyword=VALUES(focus_keyword)`,
          [
            'blog',
            blog.id,
            blogUrl,
            blog.slug,
            blog.seo_title,
            blog.meta_description,
            blog.focus_keyword,
            blog.secondary_keywords,
            blog.title,
            blog.canonical_url,
            blog.og_title,
            blog.og_description,
            blog.og_image,
            'BlogPosting',
            JSON.stringify(blogSchema),
          ]
        )
      }
      console.log(`[Blogs] Successfully seeded ${DUBAI_BLOGS.length} high-authority printing guides into MySQL.`)
    }
  } catch (err) {
    console.warn('[Blogs Seed Check Note]:', err.message)
  }
}

async function seedKeywordsIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM seo_keywords')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count < 300) {
      console.log(`[Keywords] Seeding ${DUBAI_KEYWORDS.length} targeted Dubai keywords into MySQL...`)
      for (const kw of DUBAI_KEYWORDS) {
        await connection.query(
          `INSERT INTO seo_keywords 
           (keyword, keyword_type, search_intent, cluster, category, target_url, target_page, priority, status, country, city, current_ranking, previous_ranking, search_volume, cpc, competition, last_checked, ranking_change, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
             cluster=VALUES(cluster), 
             category=COALESCE(VALUES(category), category),
             target_url=VALUES(target_url), 
             target_page=COALESCE(VALUES(target_page), target_page),
             priority=VALUES(priority), 
             status=VALUES(status),
             country=COALESCE(VALUES(country), country),
             city=COALESCE(VALUES(city), city)`,
          [
            kw.keyword,
            kw.keyword_type || 'primary',
            kw.search_intent || 'Commercial',
            kw.cluster,
            kw.category || kw.cluster || null,
            kw.target_url,
            kw.target_page,
            kw.priority || 'Medium',
            kw.status || 'Published',
            kw.country || 'UAE',
            kw.city || 'Dubai',
            kw.current_ranking ?? null,
            kw.previous_ranking ?? null,
            kw.search_volume ?? null,
            kw.cpc ?? null,
            kw.competition ?? null,
            kw.last_checked ?? null,
            kw.ranking_change ?? null,
            kw.notes || null,
          ]
        )
      }
      console.log(`[Keywords] Successfully seeded/updated Dubai printing keywords into MySQL.`)
    }
  } catch (err) {
    console.warn('[Keywords Seed Check Note]:', err.message)
  }
}

async function seedBacklinksIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM seo_backlinks')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0) {
      console.log(`[Backlinks] Seeding ${UAE_BACKLINKS.length} verified UAE directory backlink records...`)
      for (const bl of UAE_BACKLINKS) {
        await connection.query(
          `INSERT INTO seo_backlinks
           (linking_domain, linking_url, target_url, anchor_text, link_type, status, authority, relevance, toxic_risk, first_discovered_at, last_checked_at, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            bl.linking_domain,
            bl.linking_url,
            bl.target_url,
            bl.anchor_text,
            bl.link_type,
            bl.status,
            bl.authority,
            bl.relevance,
            bl.toxic_risk,
            bl.first_discovered_at,
            bl.last_checked_at,
            bl.notes,
          ]
        )
      }
    }

    const [outreachRows] = await connection.query('SELECT COUNT(*) AS count FROM seo_outreach_prospects')
    const outreachCount = outreachRows && outreachRows[0] ? (outreachRows[0].count ?? outreachRows[0].COUNT ?? 0) : 0
    if (outreachCount === 0) {
      console.log(`[Outreach] Seeding ${UAE_OUTREACH_PROSPECTS.length} UAE outreach prospects...`)
      for (const op of UAE_OUTREACH_PROSPECTS) {
        await connection.query(
          `INSERT INTO seo_outreach_prospects
           (website_domain, contact_name, contact_email, website_category, relevance, authority, outreach_status, date_contacted, follow_up_date, target_url, anchor_text, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            op.website_domain,
            op.contact_name,
            op.contact_email,
            op.website_category,
            op.relevance,
            op.authority,
            op.outreach_status,
            op.date_contacted || null,
            op.follow_up_date || null,
            op.target_url,
            op.anchor_text,
            op.notes,
          ]
        )
      }
    }
  } catch (err) {
    console.warn('[Backlinks Seed Check Note]:', err.message)
  }
}

async function seedCompetitorsIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM seo_competitor_records')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0) {
      console.log(`[Competitors] Seeding ${COMPETITOR_GAP_RECORDS.length} competitor gap records...`)
      for (const cg of COMPETITOR_GAP_RECORDS) {
        await connection.query(
          `INSERT INTO seo_competitor_records
           (competitor_name, competitor_url, record_type, keyword, source_url, notes)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            cg.competitor_name,
            cg.competitor_url,
            cg.record_type,
            cg.keyword,
            cg.source_url,
            cg.notes,
          ]
        )
      }
    }
  } catch (err) {
    console.warn('[Competitors Seed Check Note]:', err.message)
  }
}

async function seedBacklinkOpportunitiesIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM backlink_opportunities')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0 && Array.isArray(BACKLINK_OPPORTUNITIES) && BACKLINK_OPPORTUNITIES.length > 0) {
      console.log(`[Backlink Opportunities] Seeding ${BACKLINK_OPPORTUNITIES.length} legitimate UAE opportunities into MySQL...`)
      for (const b of BACKLINK_OPPORTUNITIES) {
        await connection.query(
          `INSERT INTO backlink_opportunities 
           (website_name, domain, website_url, category, submission_method, domain_authority, priority, country, city, relevance, link_type, follow_type, contact_url, submission_url, target_url, target_anchor_text, status, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            b.website || b.website_name || b.domain,
            b.domain,
            b.url || b.website_url,
            b.category,
            b.submission_method,
            b.da || b.domain_authority || 30,
            b.priority || 'Medium',
            b.country || 'UAE',
            b.city || 'Dubai',
            b.relevance || 'High',
            b.link_type || 'Directory Profile Link',
            b.follow_type || 'Follow',
            b.contact_url || null,
            b.submission_url || null,
            b.target_onprint_url || b.target_url || 'https://0nprint.com/',
            b.anchor_text || b.target_anchor_text || 'ONPRINT Dubai Printing',
            b.status || 'Planned',
            b.notes || null,
          ]
        )
      }
      console.log(`[Backlink Opportunities] Successfully seeded 150 UAE opportunities into MySQL.`)
    }
  } catch (err) {
    console.warn('[Backlink Opportunities Seed Note]:', err.message)
  }
}

async function seedBacklinkOpportunities200IfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM seo_backlink_opportunities_200')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0 && Array.isArray(BACKLINK_OPPORTUNITIES_200) && BACKLINK_OPPORTUNITIES_200.length > 0) {
      console.log(`[Backlink Opportunities 200] Seeding ${BACKLINK_OPPORTUNITIES_200.length} research-backed UAE opportunities into MySQL...`)
      for (const b of BACKLINK_OPPORTUNITIES_200) {
        await connection.query(
          `INSERT INTO seo_backlink_opportunities_200 
           (website, domain, url, country, city, industry, relevance, link_opportunity, submission_url, contact_url, link_type, follow_type, target_onprint_url, anchor_text, status, date, link_url, link_attribute, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            b.website || b.domain,
            b.domain,
            b.url,
            b.country || 'United Arab Emirates',
            b.city || 'Dubai',
            b.industry || 'Commercial Directory',
            b.relevance || 'High',
            b.link_opportunity || 'Business Directory Listing',
            b.submission_url || null,
            b.contact_url || null,
            b.link_type || 'Directory Profile',
            b.follow_type || 'Follow',
            b.target_onprint_url || 'https://0nprint.com/',
            b.anchor_text || 'ONPRINT',
            b.status || 'Prospect',
            b.date || null,
            b.link_url || null,
            b.link_attribute || (b.follow_type ? b.follow_type.toLowerCase() : 'follow'),
            b.notes || null,
          ]
        )
      }
      console.log(`[Backlink Opportunities 200] Successfully seeded ${BACKLINK_OPPORTUNITIES_200.length} UAE opportunities into MySQL.`)
    }
  } catch (err) {
    console.warn('[Backlink Opportunities 200 Seed Note]:', err.message)
  }
}

async function seedAiVisibilityIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM seo_ai_visibility_tracking')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0 && Array.isArray(DUBAI_AI_VISIBILITY_QUERIES) && DUBAI_AI_VISIBILITY_QUERIES.length > 0) {
      console.log(`[AI Visibility] Seeding ${DUBAI_AI_VISIBILITY_QUERIES.length} core AI queries into MySQL...`)
      for (const q of DUBAI_AI_VISIBILITY_QUERIES) {
        await connection.query(
          `INSERT INTO seo_ai_visibility_tracking 
           (id, query, cluster, intent, target_page, target_url, overall_visibility_score, status, last_tested, engines_json, key_entities_extracted, recommended_action)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
             overall_visibility_score = VALUES(overall_visibility_score),
             status = VALUES(status),
             engines_json = VALUES(engines_json)`,
          [
            q.id,
            q.query,
            q.cluster,
            q.intent,
            q.target_page,
            q.target_url,
            q.overall_visibility_score || 0,
            q.status,
            q.last_tested,
            JSON.stringify(q.platforms || q.engines || {}),
            JSON.stringify(q.key_entities_extracted || []),
            q.notes || q.recommended_action || '',
          ]
        )
      }
      console.log(`[AI Visibility] Successfully seeded AI visibility queries into MySQL.`)
    }
  } catch (err) {
    console.warn('[AI Visibility Seed Note]:', err.message)
  }
}

async function seedGeoFaqsIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM geo_faqs')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0 && Array.isArray(GEO_FAQS) && GEO_FAQS.length > 0) {
      console.log(`[GEO FAQs] Seeding ${GEO_FAQS.length} authentic Dubai printing FAQs into MySQL...`)
      for (const f of GEO_FAQS) {
        await connection.query(
          `INSERT INTO geo_faqs
           (question, answer, category, related_service, target_url, search_intent, status)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            f.question,
            f.answer,
            f.category,
            f.related_service || null,
            f.target_url || null,
            f.search_intent || 'Commercial',
            f.status || 'published',
          ]
        )
      }
      console.log(`[GEO FAQs] Successfully seeded ${GEO_FAQS.length} GEO FAQs into MySQL.`)
    }
  } catch (err) {
    console.warn('[GEO FAQs Seed Note]:', err.message)
  }
}

async function seedGeoContentIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM geo_content')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0 && Array.isArray(GEO_CONTENT_RECORDS) && GEO_CONTENT_RECORDS.length > 0) {
      console.log(`[GEO Content] Seeding ${GEO_CONTENT_RECORDS.length} database-driven GEO content records into MySQL...`)
      for (const c of GEO_CONTENT_RECORDS) {
        await connection.query(
          `INSERT INTO geo_content
           (topic, question, answer, target_keyword, entity, target_url, related_service, faq, source, author, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            c.topic,
            c.question,
            c.answer,
            c.target_keyword || null,
            c.entity || 'ONPRINT',
            c.target_url || null,
            c.related_service || null,
            c.faq !== undefined ? Number(c.faq) : 1,
            c.source || 'ONPRINT Pressroom Operations Manual',
            c.author || 'ONPRINT Technical Team',
            c.status || 'published',
          ]
        )
      }
      console.log(`[GEO Content] Successfully seeded GEO Content records into MySQL.`)
    }
  } catch (err) {
    console.warn('[GEO Content Seed Note]:', err.message)
  }
}

async function seedRedirectsIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM seo_redirects')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0) {
      const defaultRedirects = [
        { old_url: '/old-print-quote', new_url: '/get-quote', redirect_type: '301', notes: 'Legacy quote form redirect' },
        { old_url: '/printing-press-al-quoz', new_url: '/contact', redirect_type: '301', notes: 'Legacy local press link to contact' },
        { old_url: '/packaging-boxes-dubai', new_url: '/custom-packaging-dubai', redirect_type: '301', notes: 'Legacy boxes keyword to custom packaging landing' },
        { old_url: '/corporate-business-cards', new_url: '/business-card-printing-dubai', redirect_type: '301', notes: 'Consolidated visiting cards path' },
        { old_url: '/catalog', new_url: '/products', redirect_type: '301', notes: 'Legacy catalog redirect to products' },
      ]
      for (const r of defaultRedirects) {
        await connection.query(
          'INSERT INTO seo_redirects (old_url, new_url, redirect_type, status, notes) VALUES (?, ?, ?, ?, ?)',
          [r.old_url, r.new_url, r.redirect_type, 'active', r.notes]
        )
      }
      console.log('[Redirects] Seeded baseline 301 redirect rules into MySQL.')
    }
  } catch (err) {
    console.warn('[Redirects Seed Note]:', err.message)
  }
}

async function seedBrandMentionsIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM seo_brand_mentions')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0) {
      const defaultMentions = [
        {
          mention_source: 'Dubai Chamber Business Directory',
          source_url: 'https://www.dubaichamber.com/en/business-directory/',
          brand_query: 'ONPRINT',
          snippet: 'ONPRINT is a licensed commercial digital and offset printing facility operating in Al Quoz Industrial Area 3, Dubai.',
          has_link: 1,
          linking_url: 'https://0nprint.com/',
          domain_authority: 84,
          sentiment: 'positive',
          outreach_status: 'link_added',
          notes: 'Official Chamber commercial entity link verified.',
        },
        {
          mention_source: 'SME10x Middle East Business Guide',
          source_url: 'https://sme10x.com/business-stationery-guide-dubai',
          brand_query: '0nprint.com',
          snippet: 'Startups in Dubai can streamline their physical corporate stationery orders through platforms like 0nprint.com in Al Quoz.',
          has_link: 0,
          linking_url: null,
          domain_authority: 51,
          sentiment: 'positive',
          outreach_status: 'uncontacted',
          notes: 'Unlinked mention opportunity: Request natural contextual link to /business-card-printing-dubai.',
        },
        {
          mention_source: 'Packaging Trends UAE & GCC',
          source_url: 'https://packagingtrends.ae/luxury-fragrance-boxes-dubai',
          brand_query: 'ONPRINT Dubai',
          snippet: 'Rigid setup boxes with magnetic closures are manufactured locally in Dubai by presses such as ONPRINT Dubai for luxury perfumers.',
          has_link: 0,
          linking_url: null,
          domain_authority: 42,
          sentiment: 'positive',
          outreach_status: 'uncontacted',
          notes: 'Unlinked mention opportunity: Pitch editorial attribution to /packaging-printing-dubai.',
        },
        {
          mention_source: 'Gulf Print & Pack News Wire',
          source_url: 'https://gulfprintpack.com/exhibitor-highlights',
          brand_query: 'ONPRINT',
          snippet: 'ONPRINT showcased new UV flatbed direct-to-substrate printing equipment capable of precision printing on acrylic and wood.',
          has_link: 1,
          linking_url: 'https://0nprint.com/services',
          domain_authority: 49,
          sentiment: 'positive',
          outreach_status: 'link_added',
          notes: 'Trade portal link live.',
        },
      ]
      for (const m of defaultMentions) {
        await connection.query(
          `INSERT INTO seo_brand_mentions 
           (mention_source, source_url, brand_query, snippet, has_link, linking_url, domain_authority, sentiment, outreach_status, notes, date_discovered)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
          [m.mention_source, m.source_url, m.brand_query, m.snippet, m.has_link, m.linking_url, m.domain_authority, m.sentiment, m.outreach_status, m.notes]
        )
      }
      console.log('[Brand Mentions] Seeded brand mentions into MySQL.')
    }
  } catch (err) {
    console.warn('[Brand Mentions Seed Note]:', err.message)
  }
}

async function seedExperimentsIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM seo_experiments')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0) {
      const defaultExp = [
        {
          page_url: '/business-card-printing-dubai',
          test_type: 'title',
          control_value: 'Business Cards | ONPRINT Dubai',
          variant_value: 'Business Card Printing in Dubai | Luxury Visiting Cards | ONPRINT',
          hypothesis: 'Adding target commercial keyword and luxury value prop will increase organic CTR from 1.8% to over 3.2%.',
          status: 'running',
          start_date: '2026-03-01',
          baseline_clicks: 42,
          baseline_impressions: 2350,
          baseline_ctr: 1.79,
          variant_clicks: 86,
          variant_impressions: 2480,
          variant_ctr: 3.47,
          winner: 'variant',
        },
        {
          page_url: '/packaging-printing-dubai',
          test_type: 'meta_description',
          control_value: 'Custom packaging and boxes printing in Dubai by ONPRINT printing press.',
          variant_value: 'Order luxury custom packaging and rigid setup boxes in Dubai. Fast 24-48h Al Quoz production, gold foil, spot UV & eco-friendly options. Get an instant quote!',
          hypothesis: 'Including turnaround time and specific finishes in meta description will improve click-through rate on commercial search queries.',
          status: 'running',
          start_date: '2026-03-05',
          baseline_clicks: 28,
          baseline_impressions: 1600,
          baseline_ctr: 1.75,
          variant_clicks: 54,
          variant_impressions: 1720,
          variant_ctr: 3.14,
          winner: 'variant',
        },
      ]
      for (const e of defaultExp) {
        await connection.query(
          `INSERT INTO seo_experiments
           (page_url, test_type, control_value, variant_value, hypothesis, status, start_date, baseline_clicks, baseline_impressions, baseline_ctr, variant_clicks, variant_impressions, variant_ctr, winner)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [e.page_url, e.test_type, e.control_value, e.variant_value, e.hypothesis, e.status, e.start_date, e.baseline_clicks, e.baseline_impressions, e.baseline_ctr, e.variant_clicks, e.variant_impressions, e.variant_ctr, e.winner]
        )
      }
      console.log('[SEO Experiments] Seeded A/B test experiments into MySQL.')
    }
  } catch (err) {
    console.warn('[SEO Experiments Seed Note]:', err.message)
  }
}

async function seedConversionsIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM seo_conversions')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0) {
      const defaultConversions = [
        { conversion_type: 'whatsapp', landing_page: '/business-card-printing-dubai', referrer: 'https://www.google.ae/', source_label: 'WhatsApp Concierge CTA', query_string: 'q=luxury+business+cards+dubai' },
        { conversion_type: 'quote_request', landing_page: '/packaging-printing-dubai', referrer: 'https://www.google.com/', source_label: 'Instant Quote Button', query_string: 'q=custom+rigid+boxes+dubai' },
        { conversion_type: 'phone', landing_page: '/contact', referrer: 'https://www.google.ae/', source_label: 'Press Desk Call', query_string: 'q=printing+press+al+quoz+dubai' },
        { conversion_type: 'whatsapp', landing_page: '/flyer-printing-dubai', referrer: 'https://www.google.ae/', source_label: 'Hero WhatsApp Link', query_string: 'q=flyers+printing+dubai' },
        { conversion_type: 'product_inquiry', landing_page: '/corporate-printing-dubai', referrer: 'https://www.google.com/', source_label: 'Corporate Package Inquiry', query_string: 'q=corporate+stationery+dubai' },
      ]
      for (const c of defaultConversions) {
        await connection.query(
          `INSERT INTO seo_conversions
           (conversion_type, landing_page, referrer, source_label, query_string, created_at)
           VALUES (?, ?, ?, ?, ?, NOW() - INTERVAL FLOOR(RAND()*7) DAY)`,
          [c.conversion_type, c.landing_page, c.referrer, c.source_label, c.query_string]
        )
      }
      console.log('[SEO Conversions] Seeded organic conversion records into MySQL.')
    }
  } catch (err) {
    console.warn('[SEO Conversions Seed Note]:', err.message)
  }
}

async function seedContentDecayIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM seo_content_decay')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0) {
      const defaultDecay = [
        {
          page_url: '/services/letterheads-printing-dubai',
          title: 'Letterheads Printing Dubai',
          page_type: 'service',
          previous_clicks: 84,
          current_clicks: 61,
          clicks_change_pct: -27.38,
          previous_impressions: 2100,
          current_impressions: 1750,
          impressions_change_pct: -16.67,
          decay_severity: 'HIGH',
          recommended_action: 'Refresh technical GSM specifications, add 3 new FAQs on laser printer compatibility, and update H2 headings with corporate contract use-cases.',
          status: 'needs_refresh',
          last_audited: '2026-03-10',
        },
        {
          page_url: '/blog/print-finishes-guide',
          title: 'Complete Guide to Commercial Print Finishes in Dubai',
          page_type: 'blog',
          previous_clicks: 142,
          current_clicks: 119,
          clicks_change_pct: -16.20,
          previous_impressions: 4800,
          current_impressions: 4300,
          impressions_change_pct: -10.42,
          decay_severity: 'MEDIUM',
          recommended_action: 'Add visual comparison table between Spot UV and 3D Raised Foil, include 2026 Dubai design trends, and link to /business-card-printing-dubai.',
          status: 'needs_refresh',
          last_audited: '2026-03-12',
        },
      ]
      for (const d of defaultDecay) {
        await connection.query(
          `INSERT INTO seo_content_decay
           (page_url, title, page_type, previous_clicks, current_clicks, clicks_change_pct, previous_impressions, current_impressions, impressions_change_pct, decay_severity, recommended_action, status, last_audited)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [d.page_url, d.title, d.page_type, d.previous_clicks, d.current_clicks, d.clicks_change_pct, d.previous_impressions, d.current_impressions, d.impressions_change_pct, d.decay_severity, d.recommended_action, d.status, d.last_audited]
        )
      }
      console.log('[Content Decay] Seeded content decay tracking into MySQL.')
    }
  } catch (err) {
    console.warn('[Content Decay Seed Note]:', err.message)
  }
}

async function initDatabase() {
  try {
    const connection = await pool.getConnection()

    // 1. Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        status VARCHAR(50) DEFAULT 'active',
        last_login_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 2. Categories Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_key VARCHAR(100) DEFAULT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT DEFAULT NULL,
        image VARCHAR(500) DEFAULT NULL,
        image_url VARCHAR(500) DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'active',
        display_order INT DEFAULT 0,
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // Dynamic SEO columns for categories
    await addColumnIfMissing(connection, 'categories', 'seo_title', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'categories', 'seo_description', 'TEXT DEFAULT NULL')
    await addColumnIfMissing(connection, 'categories', 'seo_keywords', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'categories', 'seo_heading', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'categories', 'canonical_url', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'categories', 'image_alt', 'VARCHAR(255) DEFAULT NULL')

    // Seed categories if empty
    await seedCategoriesIfEmpty(connection)

    // 3. Products Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_key VARCHAR(100) DEFAULT NULL,
        category_id INT DEFAULT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        short_description TEXT DEFAULT NULL,
        description TEXT DEFAULT NULL,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        minimum_quantity INT NOT NULL DEFAULT 1,
        featured TINYINT(1) DEFAULT 0,
        specifications JSON DEFAULT NULL,
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // Dynamic SEO columns for products
    await addColumnIfMissing(connection, 'products', 'seo_title', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'products', 'seo_description', 'TEXT DEFAULT NULL')
    await addColumnIfMissing(connection, 'products', 'seo_keywords', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'products', 'seo_heading', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'products', 'canonical_url', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'products', 'image_alt', 'VARCHAR(255) DEFAULT NULL')

    // 4. Product Images Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
    await addColumnIfMissing(connection, 'product_images', 'alt_text', 'VARCHAR(255) DEFAULT NULL')

    // Seed products if empty
    await seedProductsIfEmpty(connection)

    // 5. Services Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_key VARCHAR(100) DEFAULT NULL,
        category_id INT DEFAULT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        short_description TEXT DEFAULT NULL,
        description TEXT DEFAULT NULL,
        image VARCHAR(500) DEFAULT NULL,
        display_order INT DEFAULT 0,
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_services_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // Dynamic SEO columns for services
    await addColumnIfMissing(connection, 'services', 'seo_title', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'services', 'seo_description', 'TEXT DEFAULT NULL')
    await addColumnIfMissing(connection, 'services', 'seo_keywords', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'services', 'seo_heading', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'services', 'canonical_url', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'services', 'image_alt', 'VARCHAR(255) DEFAULT NULL')

    // Seed services if empty
    await seedServicesIfEmpty(connection)

    // 6. Dynamic Blogs Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        excerpt TEXT DEFAULT NULL,
        content LONGTEXT NOT NULL,
        featured_image VARCHAR(500) DEFAULT NULL,
        image_alt VARCHAR(255) DEFAULT NULL,
        category_id INT DEFAULT NULL,
        product_id INT DEFAULT NULL,
        author_id INT DEFAULT NULL,
        author_name VARCHAR(100) DEFAULT 'ONPRINT Editorial Team',
        status ENUM('draft', 'published', 'scheduled') DEFAULT 'draft',
        is_featured TINYINT(1) DEFAULT 0,
        seo_title VARCHAR(255) DEFAULT NULL,
        meta_description TEXT DEFAULT NULL,
        focus_keyword VARCHAR(255) DEFAULT NULL,
        secondary_keywords TEXT DEFAULT NULL,
        canonical_url VARCHAR(500) DEFAULT NULL,
        og_title VARCHAR(255) DEFAULT NULL,
        og_description TEXT DEFAULT NULL,
        og_image VARCHAR(500) DEFAULT NULL,
        schema_type VARCHAR(50) DEFAULT 'BlogPosting',
        reading_time INT DEFAULT 3,
        target_location VARCHAR(100) DEFAULT NULL,
        published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_blogs_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        CONSTRAINT fk_blogs_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
        CONSTRAINT fk_blogs_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // Ensure all columns exist on blogs table in case it was created earlier
    await addColumnIfMissing(connection, 'blogs', 'category_id', 'INT DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'product_id', 'INT DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'author_id', 'INT DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'author_name', 'VARCHAR(100) DEFAULT "ONPRINT Editorial Team"')
    await addColumnIfMissing(connection, 'blogs', 'status', 'VARCHAR(50) DEFAULT "draft"')
    await addColumnIfMissing(connection, 'blogs', 'is_featured', 'TINYINT(1) DEFAULT 0')
    await addColumnIfMissing(connection, 'blogs', 'seo_title', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'meta_description', 'TEXT DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'focus_keyword', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'secondary_keywords', 'TEXT DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'canonical_url', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'og_title', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'og_description', 'TEXT DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'og_image', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'schema_type', 'VARCHAR(50) DEFAULT "BlogPosting"')
    await addColumnIfMissing(connection, 'blogs', 'reading_time', 'INT DEFAULT 3')
    await addColumnIfMissing(connection, 'blogs', 'target_location', 'VARCHAR(100) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'image_alt', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'meta_title', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'robots_index', "VARCHAR(10) DEFAULT 'index'")
    await addColumnIfMissing(connection, 'blogs', 'robots_follow', "VARCHAR(10) DEFAULT 'follow'")
    await addColumnIfMissing(connection, 'blogs', 'seo_score', 'INT DEFAULT 0')
    await addColumnIfMissing(connection, 'blogs', 'readability_score', 'INT DEFAULT 0')
    await addColumnIfMissing(connection, 'blogs', 'keyword_density', 'DECIMAL(5, 2) DEFAULT 0.00')
    await addColumnIfMissing(connection, 'blogs', 'word_count', 'INT DEFAULT 0')
    await addColumnIfMissing(connection, 'blogs', 'seo_suggestions', 'JSON DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'schema_markup', 'TEXT DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'faqs', 'JSON DEFAULT NULL')

    // Sync meta_title from seo_title if meta_title is null
    try {
      await connection.query('UPDATE blogs SET meta_title = seo_title WHERE meta_title IS NULL AND seo_title IS NOT NULL')
    } catch {}

    // Maintain legacy blog_posts view or migrate if previous blog_posts table exists
    try {
      const [tableCheck] = await connection.query(`SHOW TABLES LIKE 'blog_posts'`)
      if (tableCheck.length > 0) {
        // Copy any existing blog_posts into blogs if empty
        const [blogCount] = await connection.query(`SELECT COUNT(*) AS cnt FROM blogs`)
        if (blogCount[0].cnt === 0) {
          await connection.query(`
            INSERT IGNORE INTO blogs (title, slug, excerpt, content, featured_image, image_alt, author_name, status, seo_title, meta_description, canonical_url, published_at, created_at)
            SELECT title, slug, excerpt, content, featured_image, image_alt, author, IF(active = 1, 'published', 'draft'), seo_title, seo_description, canonical_url, published_at, created_at
            FROM blog_posts
          `)
        }
      }
    } catch (e) {
      // Ignore migration note
    }

    // 7. Contact Messages Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        company VARCHAR(255) DEFAULT NULL,
        subject VARCHAR(255) DEFAULT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 8. Quotes Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quote_number VARCHAR(50) NOT NULL UNIQUE,
        user_id INT DEFAULT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        company VARCHAR(255) DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        total_price DECIMAL(10, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_quotes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 9. Orders Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) NOT NULL UNIQUE,
        user_id INT DEFAULT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) DEFAULT NULL,
        company VARCHAR(255) DEFAULT NULL,
        shipping_address TEXT DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        payment_status VARCHAR(50) DEFAULT 'unpaid',
        total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 10. Site Settings Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11. SEO Management System Tables
    // 11.1 SEO Settings
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value LONGTEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    await addColumnIfMissing(connection, 'seo_settings', 'description', 'TEXT DEFAULT NULL')

    // 11.2 SEO Audits History
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_audits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        health_score INT NOT NULL DEFAULT 0,
        technical_score INT NOT NULL DEFAULT 0,
        onpage_score INT NOT NULL DEFAULT 0,
        content_score INT NOT NULL DEFAULT 0,
        structured_data_score INT NOT NULL DEFAULT 0,
        total_pages_scanned INT NOT NULL DEFAULT 0,
        issues_count INT NOT NULL DEFAULT 0,
        summary_json JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
    await addColumnIfMissing(connection, 'seo_audits', 'technical_score', 'INT NOT NULL DEFAULT 0')
    await addColumnIfMissing(connection, 'seo_audits', 'onpage_score', 'INT NOT NULL DEFAULT 0')
    await addColumnIfMissing(connection, 'seo_audits', 'content_score', 'INT NOT NULL DEFAULT 0')
    await addColumnIfMissing(connection, 'seo_audits', 'structured_data_score', 'INT NOT NULL DEFAULT 0')
    await addColumnIfMissing(connection, 'seo_audits', 'total_pages_scanned', 'INT NOT NULL DEFAULT 0')
    await addColumnIfMissing(connection, 'seo_audits', 'issues_count', 'INT NOT NULL DEFAULT 0')

    // 11.3 SEO Issues Itemized
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_issues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        audit_id INT DEFAULT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INT DEFAULT NULL,
        url VARCHAR(500) DEFAULT NULL,
        issue_type VARCHAR(100) NOT NULL,
        category ENUM('technical', 'onpage', 'content', 'schema', 'indexing') DEFAULT 'onpage',
        severity ENUM('critical', 'high', 'medium', 'low') DEFAULT 'medium',
        title VARCHAR(255) NOT NULL,
        description TEXT DEFAULT NULL,
        recommendation TEXT DEFAULT NULL,
        resolved TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_seo_issues_audit (audit_id),
        INDEX idx_seo_issues_cat (category),
        INDEX idx_seo_issues_sev (severity),
        INDEX idx_seo_issues_res (resolved)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.4 SEO AI Recommendations
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_recommendations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_url VARCHAR(500) NOT NULL,
        entity_type VARCHAR(50) DEFAULT 'page',
        entity_id INT DEFAULT NULL,
        target_type VARCHAR(50) DEFAULT NULL,
        target_field VARCHAR(100) DEFAULT NULL,
        target_name VARCHAR(255) DEFAULT NULL,
        target_url VARCHAR(500) DEFAULT NULL,
        issue TEXT NOT NULL,
        priority ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW') DEFAULT 'MEDIUM',
        status VARCHAR(50) DEFAULT 'NEW',
        current_value JSON DEFAULT NULL,
        proposed_value JSON DEFAULT NULL,
        recommended_value TEXT DEFAULT NULL,
        reason TEXT DEFAULT NULL,
        expected_benefit TEXT DEFAULT NULL,
        confidence DECIMAL(3, 2) DEFAULT 0.85,
        keywords JSON DEFAULT NULL,
        internal_link_suggestions JSON DEFAULT NULL,
        reviewed_at DATETIME DEFAULT NULL,
        applied_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_seo_rec_status (status),
        INDEX idx_seo_rec_priority (priority),
        INDEX idx_seo_rec_type (entity_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
    await addColumnIfMissing(connection, 'seo_recommendations', 'target_type', 'VARCHAR(50) DEFAULT NULL')
    await addColumnIfMissing(connection, 'seo_recommendations', 'target_field', 'VARCHAR(100) DEFAULT NULL')
    await addColumnIfMissing(connection, 'seo_recommendations', 'target_name', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'seo_recommendations', 'target_url', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'seo_recommendations', 'recommended_value', 'TEXT DEFAULT NULL')
    try {
      await connection.query(`ALTER TABLE seo_recommendations MODIFY COLUMN status VARCHAR(50) DEFAULT 'NEW'`)
    } catch (e) {
      // Ignored if table status column already modified
    }

    // 11.5 SEO Changes & Rollback Audit Trail
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_changes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recommendation_id INT DEFAULT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INT DEFAULT NULL,
        page_url VARCHAR(500) NOT NULL,
        change_type VARCHAR(100) NOT NULL,
        old_value JSON DEFAULT NULL,
        new_value JSON DEFAULT NULL,
        ai_reason TEXT DEFAULT NULL,
        ai_model VARCHAR(100) DEFAULT 'gemini-2.5-flash',
        approved_by VARCHAR(100) DEFAULT 'Admin',
        approved_at DATETIME DEFAULT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status ENUM('applied', 'rolled_back') DEFAULT 'applied',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_seo_changes_type (entity_type),
        INDEX idx_seo_changes_status (status),
        INDEX idx_seo_changes_time (applied_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.6 SEO Daily Reports
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_daily_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        report_date DATE NOT NULL UNIQUE,
        health_score INT NOT NULL DEFAULT 0,
        technical_score INT NOT NULL DEFAULT 0,
        onpage_score INT NOT NULL DEFAULT 0,
        content_score INT NOT NULL DEFAULT 0,
        structured_data_score INT NOT NULL DEFAULT 0,
        total_pages_scanned INT NOT NULL DEFAULT 0,
        critical_issues INT NOT NULL DEFAULT 0,
        high_issues INT NOT NULL DEFAULT 0,
        medium_issues INT NOT NULL DEFAULT 0,
        low_issues INT NOT NULL DEFAULT 0,
        pending_recommendations INT NOT NULL DEFAULT 0,
        applied_changes_today INT NOT NULL DEFAULT 0,
        organic_clicks INT NOT NULL DEFAULT 0,
        organic_impressions INT NOT NULL DEFAULT 0,
        clicks INT DEFAULT 0,
        impressions INT DEFAULT 0,
        ctr DECIMAL(5, 2) DEFAULT 0.00,
        avg_position DECIMAL(5, 2) DEFAULT 0.00,
        top_gaining_keywords JSON DEFAULT NULL,
        top_losing_keywords JSON DEFAULT NULL,
        top_opportunities JSON DEFAULT NULL,
        technical_issues JSON DEFAULT NULL,
        content_opportunities JSON DEFAULT NULL,
        ai_recommendations JSON DEFAULT NULL,
        changes_applied JSON DEFAULT NULL,
        changes_pending JSON DEFAULT NULL,
        executive_summary TEXT DEFAULT NULL,
        report_summary TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_seo_report_date (report_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // Automatic column migrations for seo_daily_reports (ensures compatibility with existing databases)
    const dailyReportColumns = [
      ['technical_score', 'INT NOT NULL DEFAULT 0'],
      ['onpage_score', 'INT NOT NULL DEFAULT 0'],
      ['content_score', 'INT NOT NULL DEFAULT 0'],
      ['structured_data_score', 'INT NOT NULL DEFAULT 0'],
      ['total_pages_scanned', 'INT NOT NULL DEFAULT 0'],
      ['critical_issues', 'INT NOT NULL DEFAULT 0'],
      ['high_issues', 'INT NOT NULL DEFAULT 0'],
      ['medium_issues', 'INT NOT NULL DEFAULT 0'],
      ['low_issues', 'INT NOT NULL DEFAULT 0'],
      ['pending_recommendations', 'INT NOT NULL DEFAULT 0'],
      ['applied_changes_today', 'INT NOT NULL DEFAULT 0'],
      ['organic_clicks', 'INT NOT NULL DEFAULT 0'],
      ['organic_impressions', 'INT NOT NULL DEFAULT 0'],
      ['clicks', 'INT DEFAULT 0'],
      ['impressions', 'INT DEFAULT 0'],
      ['ctr', 'DECIMAL(5, 2) DEFAULT 0.00'],
      ['avg_position', 'DECIMAL(5, 2) DEFAULT 0.00'],
      ['top_gaining_keywords', 'JSON DEFAULT NULL'],
      ['top_losing_keywords', 'JSON DEFAULT NULL'],
      ['top_opportunities', 'JSON DEFAULT NULL'],
      ['technical_issues', 'JSON DEFAULT NULL'],
      ['content_opportunities', 'JSON DEFAULT NULL'],
      ['ai_recommendations', 'JSON DEFAULT NULL'],
      ['changes_applied', 'JSON DEFAULT NULL'],
      ['changes_pending', 'JSON DEFAULT NULL'],
      ['executive_summary', 'TEXT DEFAULT NULL'],
      ['report_summary', 'TEXT DEFAULT NULL'],
    ]
    for (const [colName, colDef] of dailyReportColumns) {
      await addColumnIfMissing(connection, 'seo_daily_reports', colName, colDef)
    }

    // 11.7 SEO Keyword Snapshots (from Search Console)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_keyword_snapshots (
        id INT AUTO_INCREMENT PRIMARY KEY,
        query VARCHAR(255) NOT NULL,
        page_url VARCHAR(500) DEFAULT NULL,
        clicks INT DEFAULT 0,
        impressions INT DEFAULT 0,
        ctr DECIMAL(5, 2) DEFAULT 0.00,
        position DECIMAL(5, 2) DEFAULT 0.00,
        previous_position DECIMAL(5, 2) DEFAULT NULL,
        opportunity_type VARCHAR(50) DEFAULT NULL,
        snapshot_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_seo_kw_query (query),
        INDEX idx_seo_kw_date (snapshot_date),
        INDEX idx_seo_kw_opp (opportunity_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.8 SEO Page Metrics
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_page_metrics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_url VARCHAR(500) NOT NULL,
        clicks INT DEFAULT 0,
        impressions INT DEFAULT 0,
        ctr DECIMAL(5, 2) DEFAULT 0.00,
        position DECIMAL(5, 2) DEFAULT 0.00,
        snapshot_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_seo_pm_url (page_url(191)),
        INDEX idx_seo_pm_date (snapshot_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.9 SEO Integrations (GSC, AI Provider)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_integrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        integration_name VARCHAR(100) NOT NULL UNIQUE,
        is_connected TINYINT(1) DEFAULT 0,
        config JSON DEFAULT NULL,
        last_synced_at DATETIME DEFAULT NULL,
        error_message TEXT DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.10 SEO Operational Logs
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'info',
        message TEXT NOT NULL,
        details JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_seo_logs_type (event_type),
        INDEX idx_seo_logs_time (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // Seed default SEO settings if empty
    const defaultSeoSettings = [
      ['scheduler_enabled', '1'],
      ['schedule_enabled', '1'],
      ['daily_run_time', '03:00'],
      ['schedule_time', '03:00'],
      ['timezone', 'Asia/Dubai'],
      ['schedule_timezone', 'Asia/Dubai'],
      ['ai_provider', 'gemini'],
      ['ai_model', 'gemini-1.5-flash'],
      ['auto_apply_safe', '0'],
      ['auto_apply_safe_changes', '0'],
      ['min_confidence_auto_apply', '0.90'],
      ['gsc_property_url', 'https://0nprint.com'],
      ['notification_email', 'admin@onprint.ae'],
    ]
    for (const [key, val] of defaultSeoSettings) {
      await connection.query(
        'INSERT IGNORE INTO seo_settings (setting_key, setting_value) VALUES (?, ?)',
        [key, val]
      )
    }

    // Seed default SEO integration records if empty
    await connection.query(`
      INSERT IGNORE INTO seo_integrations (integration_name, is_connected, config)
      VALUES 
        ('google_search_console', 0, '{"property": "https://0nprint.com", "auth_type": "oauth2"}'),
        ('ai_service', 1, '{"provider": "gemini", "model": "gemini-2.5-flash"}')
    `)

    // 11.11 Page-Level SEO Management Tables (Requirement 2 & 22)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS page_seo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_type VARCHAR(50) NOT NULL,
        page_id INT DEFAULT NULL,
        url VARCHAR(500) NOT NULL UNIQUE,
        slug VARCHAR(255) DEFAULT NULL,
        meta_title VARCHAR(255) DEFAULT NULL,
        meta_description TEXT DEFAULT NULL,
        focus_keyword VARCHAR(255) DEFAULT NULL,
        secondary_keywords TEXT DEFAULT NULL,
        h1 VARCHAR(255) DEFAULT NULL,
        seo_content LONGTEXT DEFAULT NULL,
        canonical_url VARCHAR(500) DEFAULT NULL,
        robots_index VARCHAR(20) DEFAULT 'index',
        robots_follow VARCHAR(20) DEFAULT 'follow',
        og_title VARCHAR(255) DEFAULT NULL,
        og_description TEXT DEFAULT NULL,
        og_image VARCHAR(500) DEFAULT NULL,
        twitter_title VARCHAR(255) DEFAULT NULL,
        twitter_description TEXT DEFAULT NULL,
        twitter_image VARCHAR(500) DEFAULT NULL,
        schema_type VARCHAR(50) DEFAULT NULL,
        schema_markup LONGTEXT DEFAULT NULL,
        seo_score INT DEFAULT 0,
        readability_score INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_page_seo_type (page_type),
        INDEX idx_page_seo_score (seo_score),
        INDEX idx_page_seo_fk (focus_keyword(191))
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS page_seo_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_seo_id INT NOT NULL,
        page_url VARCHAR(500) NOT NULL,
        field_changed VARCHAR(100) NOT NULL,
        old_value LONGTEXT DEFAULT NULL,
        new_value LONGTEXT DEFAULT NULL,
        changed_by VARCHAR(100) DEFAULT 'Admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_psh_page_id (page_seo_id),
        INDEX idx_psh_created (created_at),
        CONSTRAINT fk_page_seo_hist FOREIGN KEY (page_seo_id) REFERENCES page_seo(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.12 Scalable keyword, backlink, outreach and competitor records
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_keywords (
        id INT AUTO_INCREMENT PRIMARY KEY,
        keyword VARCHAR(255) NOT NULL,
        keyword_type ENUM('primary', 'secondary') DEFAULT 'primary',
        search_intent ENUM('Informational', 'Commercial', 'Transactional', 'Navigational', 'Local') NOT NULL DEFAULT 'Commercial',
        cluster VARCHAR(150) NOT NULL,
        target_url VARCHAR(500) DEFAULT NULL,
        target_page VARCHAR(255) DEFAULT NULL,
        priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
        status ENUM('Planned', 'Assigned', 'Published', 'Tracking', 'Archived') DEFAULT 'Planned',
        notes TEXT DEFAULT NULL,
        content_type VARCHAR(100) DEFAULT NULL,
        assigned_page VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_seo_keyword (keyword),
        INDEX idx_seo_keyword_cluster (cluster),
        INDEX idx_seo_keyword_target (target_url(191))
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    const keywordColumns = [
      ['category', 'VARCHAR(150) DEFAULT NULL'],
      ['country', "VARCHAR(100) DEFAULT 'UAE'"],
      ['city', "VARCHAR(100) DEFAULT 'Dubai'"],
      ['current_ranking', 'INT DEFAULT NULL'],
      ['previous_ranking', 'INT DEFAULT NULL'],
      ['search_volume', 'INT DEFAULT NULL'],
      ['cpc', 'DECIMAL(8, 2) DEFAULT NULL'],
      ['competition', 'VARCHAR(50) DEFAULT NULL'],
      ['last_checked', 'DATE DEFAULT NULL'],
      ['ranking_change', 'INT DEFAULT NULL'],
    ]
    for (const [colName, colDef] of keywordColumns) {
      await addColumnIfMissing(connection, 'seo_keywords', colName, colDef)
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_backlinks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        linking_domain VARCHAR(255) NOT NULL,
        linking_url VARCHAR(1000) NOT NULL,
        target_url VARCHAR(500) NOT NULL,
        anchor_text VARCHAR(500) DEFAULT NULL,
        link_type ENUM('follow', 'nofollow', 'sponsored', 'ugc', 'unknown') DEFAULT 'unknown',
        status ENUM('active', 'new', 'lost', 'needs_review') DEFAULT 'needs_review',
        authority DECIMAL(6,2) DEFAULT NULL,
        relevance ENUM('high', 'medium', 'low', 'unknown') DEFAULT 'unknown',
        toxic_risk ENUM('low', 'medium', 'high', 'unknown') DEFAULT 'unknown',
        first_discovered_at DATE DEFAULT NULL,
        last_checked_at DATE DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_backlink_domain (linking_domain),
        INDEX idx_backlink_status (status),
        INDEX idx_backlink_type (link_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_outreach_prospects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        website_domain VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255) DEFAULT NULL,
        contact_email VARCHAR(255) DEFAULT NULL,
        website_category VARCHAR(150) DEFAULT NULL,
        relevance ENUM('high', 'medium', 'low', 'unknown') DEFAULT 'unknown',
        authority DECIMAL(6,2) DEFAULT NULL,
        outreach_status ENUM('Prospect', 'Contacted', 'Follow-up', 'Accepted', 'Published', 'Rejected', 'Not Relevant') DEFAULT 'Prospect',
        date_contacted DATE DEFAULT NULL,
        follow_up_date DATE DEFAULT NULL,
        response TEXT DEFAULT NULL,
        link_obtained TINYINT(1) DEFAULT 0,
        target_url VARCHAR(500) DEFAULT NULL,
        anchor_text VARCHAR(500) DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_outreach_status (outreach_status),
        INDEX idx_outreach_domain (website_domain)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_competitor_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        competitor_name VARCHAR(255) NOT NULL,
        competitor_url VARCHAR(500) DEFAULT NULL,
        record_type ENUM('ranking_keyword', 'page', 'keyword_gap', 'backlink_gap', 'content_gap', 'service_gap', 'location_gap') NOT NULL,
        keyword VARCHAR(255) DEFAULT NULL,
        source_url VARCHAR(1000) DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_competitor_name (competitor_name),
        INDEX idx_competitor_type (record_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS backlink_opportunities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        website_name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) NOT NULL,
        website_url VARCHAR(1000) NOT NULL,
        category VARCHAR(150) NOT NULL,
        submission_method VARCHAR(150) NOT NULL,
        domain_authority INT DEFAULT 0,
        priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
        country VARCHAR(100) DEFAULT 'UAE',
        city VARCHAR(100) DEFAULT 'Dubai',
        relevance VARCHAR(50) DEFAULT 'High',
        link_type VARCHAR(100) DEFAULT NULL,
        follow_type ENUM('Follow', 'Nofollow', 'UGC', 'Sponsored') DEFAULT 'Follow',
        contact_url VARCHAR(1000) DEFAULT NULL,
        submission_url VARCHAR(1000) DEFAULT NULL,
        target_url VARCHAR(500) NOT NULL,
        target_anchor_text VARCHAR(500) DEFAULT NULL,
        status ENUM('Not Started', 'Planned', 'Submitted', 'In Review', 'Live', 'Rejected') DEFAULT 'Planned',
        date_added DATE DEFAULT NULL,
        date_submitted DATE DEFAULT NULL,
        date_live DATE DEFAULT NULL,
        live_url VARCHAR(1000) DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_bo_domain (domain),
        INDEX idx_bo_category (category),
        INDEX idx_bo_status (status),
        INDEX idx_bo_priority (priority)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_ai_visibility_tracking (
        id VARCHAR(100) PRIMARY KEY,
        query VARCHAR(500) NOT NULL,
        cluster VARCHAR(255) DEFAULT NULL,
        intent VARCHAR(100) DEFAULT NULL,
        target_page VARCHAR(255) DEFAULT NULL,
        target_url VARCHAR(500) DEFAULT NULL,
        overall_visibility_score INT DEFAULT 0,
        status VARCHAR(100) DEFAULT 'Dominant Citation',
        last_tested DATE DEFAULT NULL,
        engines_json LONGTEXT DEFAULT NULL,
        key_entities_extracted LONGTEXT DEFAULT NULL,
        recommended_action TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_ai_vis_cluster (cluster),
        INDEX idx_ai_vis_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_backlink_opportunities_200 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        website VARCHAR(255) NOT NULL,
        domain VARCHAR(255) NOT NULL,
        url VARCHAR(1000) NOT NULL,
        country VARCHAR(100) DEFAULT 'United Arab Emirates',
        city VARCHAR(100) DEFAULT 'Dubai',
        industry VARCHAR(150) NOT NULL,
        relevance ENUM('High', 'Medium', 'Low') DEFAULT 'High',
        link_opportunity VARCHAR(255) NOT NULL,
        submission_url VARCHAR(1000) DEFAULT NULL,
        contact_url VARCHAR(1000) DEFAULT NULL,
        link_type VARCHAR(100) DEFAULT 'Directory Profile',
        follow_type ENUM('Follow', 'Nofollow', 'Sponsored', 'UGC') DEFAULT 'Follow',
        target_onprint_url VARCHAR(500) NOT NULL,
        anchor_text VARCHAR(500) DEFAULT NULL,
        status ENUM('Prospect', 'Researching', 'Contacted', 'Submitted', 'Approved', 'Published', 'Rejected', 'Not Relevant') DEFAULT 'Prospect',
        date DATE DEFAULT NULL,
        link_url VARCHAR(1000) DEFAULT NULL,
        link_attribute ENUM('follow', 'nofollow', 'sponsored', 'ugc') DEFAULT 'follow',
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_bo200_domain (domain),
        INDEX idx_bo200_industry (industry),
        INDEX idx_bo200_status (status),
        INDEX idx_bo200_relevance (relevance)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.13 GEO FAQ Database Table (Requirement 27)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS geo_faqs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question VARCHAR(500) NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        related_service VARCHAR(150) DEFAULT NULL,
        target_url VARCHAR(500) DEFAULT NULL,
        search_intent ENUM('Informational', 'Commercial', 'Transactional', 'Local') DEFAULT 'Commercial',
        status ENUM('published', 'draft', 'archived') DEFAULT 'published',
        published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_geo_faq_category (category),
        INDEX idx_geo_faq_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.14 GEO Content Database Table (Requirement 28)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS geo_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        topic VARCHAR(255) NOT NULL,
        question VARCHAR(500) NOT NULL,
        answer TEXT NOT NULL,
        target_keyword VARCHAR(255) DEFAULT NULL,
        entity VARCHAR(150) DEFAULT 'ONPRINT',
        target_url VARCHAR(500) DEFAULT NULL,
        related_service VARCHAR(150) DEFAULT NULL,
        faq TINYINT(1) DEFAULT 1,
        source VARCHAR(255) DEFAULT 'ONPRINT Pressroom Operations Manual',
        author VARCHAR(100) DEFAULT 'ONPRINT Technical Team',
        status ENUM('published', 'draft', 'archived') DEFAULT 'published',
        published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_geo_content_topic (topic),
        INDEX idx_geo_content_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.15 GEO Citation Logs Table (Requirements 29 & 30)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS geo_citation_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        query VARCHAR(500) NOT NULL,
        date_checked DATE NOT NULL,
        platform VARCHAR(100) NOT NULL,
        onprint_mentioned TINYINT(1) DEFAULT 0,
        onprint_url VARCHAR(500) DEFAULT NULL,
        citation_source VARCHAR(500) DEFAULT NULL,
        competitors_mentioned JSON DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_gcl_query (query(191)),
        INDEX idx_gcl_platform (platform)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.16 GEO Competitor Audits Table (Requirement 31)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS geo_competitor_audits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        competitor_url VARCHAR(1000) NOT NULL,
        competitor_name VARCHAR(255) DEFAULT NULL,
        analysis_json JSON DEFAULT NULL,
        recommendations_json JSON DEFAULT NULL,
        audited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_gca_url (competitor_url(191))
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.17 404 + Redirect Manager (Requirement 28)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_redirects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        old_url VARCHAR(500) NOT NULL,
        new_url VARCHAR(500) NOT NULL,
        redirect_type ENUM('301', '302', '307') DEFAULT '301',
        status ENUM('active', 'inactive') DEFAULT 'active',
        hit_count INT DEFAULT 0,
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_redirect_old (old_url(250)),
        INDEX idx_redirect_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.18 Brand Mention System (Requirement 30)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_brand_mentions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mention_source VARCHAR(255) NOT NULL,
        source_url VARCHAR(1000) NOT NULL,
        brand_query VARCHAR(100) DEFAULT 'ONPRINT',
        snippet TEXT DEFAULT NULL,
        has_link TINYINT(1) DEFAULT 0,
        linking_url VARCHAR(500) DEFAULT NULL,
        domain_authority INT DEFAULT 30,
        sentiment ENUM('positive', 'neutral', 'negative') DEFAULT 'positive',
        outreach_status ENUM('uncontacted', 'contacted', 'link_added', 'rejected', 'ignored') DEFAULT 'uncontacted',
        notes TEXT DEFAULT NULL,
        date_discovered DATE DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_bm_source (mention_source),
        INDEX idx_bm_has_link (has_link),
        INDEX idx_bm_status (outreach_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.19 SEO Controlled Experiments / A/B Testing (Requirement 34)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_experiments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_url VARCHAR(500) NOT NULL,
        test_type ENUM('title', 'meta_description', 'h1', 'content_faq', 'internal_links') NOT NULL,
        control_value TEXT NOT NULL,
        variant_value TEXT NOT NULL,
        hypothesis TEXT DEFAULT NULL,
        status ENUM('draft', 'running', 'completed', 'rolled_back') DEFAULT 'running',
        start_date DATE NOT NULL,
        end_date DATE DEFAULT NULL,
        baseline_clicks INT DEFAULT 0,
        baseline_impressions INT DEFAULT 0,
        baseline_ctr DECIMAL(5,2) DEFAULT 0.00,
        variant_clicks INT DEFAULT 0,
        variant_impressions INT DEFAULT 0,
        variant_ctr DECIMAL(5,2) DEFAULT 0.00,
        winner ENUM('variant', 'control', 'inconclusive') DEFAULT 'inconclusive',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_exp_page (page_url(191)),
        INDEX idx_exp_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.20 Organic Conversion & ROI Tracking (Requirements 35 & 36)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_conversions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversion_type ENUM('whatsapp', 'phone', 'email', 'quote_request', 'product_inquiry') NOT NULL,
        landing_page VARCHAR(500) DEFAULT NULL,
        referrer VARCHAR(500) DEFAULT NULL,
        source_label VARCHAR(100) DEFAULT NULL,
        query_string VARCHAR(255) DEFAULT NULL,
        ip_hash VARCHAR(64) DEFAULT NULL,
        user_agent VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_conv_type (conversion_type),
        INDEX idx_conv_page (landing_page(191)),
        INDEX idx_conv_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11.21 Content Decay & Refresh Tracking (Requirement 14)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_content_decay (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_url VARCHAR(500) NOT NULL,
        title VARCHAR(255) NOT NULL,
        page_type VARCHAR(50) DEFAULT 'service',
        previous_clicks INT DEFAULT 0,
        current_clicks INT DEFAULT 0,
        clicks_change_pct DECIMAL(5,2) DEFAULT 0.00,
        previous_impressions INT DEFAULT 0,
        current_impressions INT DEFAULT 0,
        impressions_change_pct DECIMAL(5,2) DEFAULT 0.00,
        decay_severity ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'STABLE') DEFAULT 'MEDIUM',
        recommended_action TEXT DEFAULT NULL,
        status ENUM('needs_refresh', 'refresh_scheduled', 'refreshed', 'monitoring') DEFAULT 'needs_refresh',
        last_audited DATE DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_decay_page (page_url(191)),
        INDEX idx_decay_severity (decay_severity)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // Seed/Synchronize all SEO and GEO datasets
    await seedPageSeoIfEmpty(connection)
    await seedBlogsIfEmpty(connection)
    await seedKeywordsIfEmpty(connection)
    await seedBacklinksIfEmpty(connection)
    await seedCompetitorsIfEmpty(connection)
    await seedBacklinkOpportunitiesIfEmpty(connection)
    await seedBacklinkOpportunities200IfEmpty(connection)
    await seedAiVisibilityIfEmpty(connection)
    await seedGeoFaqsIfEmpty(connection)
    await seedGeoContentIfEmpty(connection)
    await seedRedirectsIfEmpty(connection)
    await seedBrandMentionsIfEmpty(connection)
    await seedExperimentsIfEmpty(connection)
    await seedConversionsIfEmpty(connection)
    await seedContentDecayIfEmpty(connection)


    // 12. Automatically Seed/Verify Admin User in DB
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@onprint.ae').toLowerCase().trim()
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const adminName = process.env.ADMIN_NAME || 'ONPRINT Admin'
    const adminPhone = process.env.ADMIN_PHONE || '+971 55 183 7995'

    const [adminRows] = await connection.query(
      'SELECT id, password_hash, role FROM users WHERE email = ? LIMIT 1',
      [adminEmail]
    )

    if (adminRows.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 10)
      await connection.query(
        'INSERT INTO users (name, email, password_hash, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        [adminName, adminEmail, passwordHash, adminPhone, 'admin', 'active']
      )
      console.log(`[Database] Seeded Admin User in MySQL: ${adminEmail} (password: ${adminPassword})`)
    } else {
      const existingUser = adminRows[0]
      const isPassValid = await bcrypt.compare(adminPassword, existingUser.password_hash)
      if (!isPassValid || existingUser.role !== 'admin') {
        const passwordHash = await bcrypt.hash(adminPassword, 10)
        await connection.query(
          'UPDATE users SET password_hash = ?, role = "admin", status = "active" WHERE id = ?',
          [passwordHash, existingUser.id]
        )
        console.log(`[Database] Updated Admin User credentials/role in MySQL for: ${adminEmail}`)
      }
    }

    connection.release()
    console.log('[Database] ONPRINT MySQL schema, SEO columns & admin verified successfully')
    return true
  } catch (err) {
    console.warn('[Database] MySQL table initialization warning:', err.message)
    return false
  }
}

async function testConnection() {
  try {
    const connection = await pool.getConnection()
    await connection.query('SELECT 1 AS connected')
    connection.release()
    console.log('MySQL database connected successfully')
    await initDatabase()
    return true
  } catch (err) {
    console.error('MySQL database connection failed:', err.message)
    return false
  }
}

module.exports = {
  pool,
  testConnection,
  initDatabase,
  seedCategoriesList,
}
